export interface ExtractedPage {
  pageNumber: number;
  text: string;
}

export interface PDFExtractionResult {
  fullText: string;
  pages: ExtractedPage[];
  pageCount: number;
}

/**
 * Extracts plain text from a PDF Buffer or plain text buffer
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<PDFExtractionResult> {
  // 1. Check if buffer is actually a plain text file masquerading or uploaded as text
  const header = buffer.subarray(0, 5).toString("utf-8");
  if (!header.startsWith("%PDF-")) {
    const textContent = buffer.toString("utf-8");
    if (textContent.trim().length > 0) {
      // Split into pseudo-pages if delimiter exists, otherwise 1 page
      const pageSections = textContent.split(/---+\s*PAGE\s*\d+\s*---+/i);
      const pages: ExtractedPage[] = pageSections
        .map((p, idx) => ({ pageNumber: idx + 1, text: p.trim() }))
        .filter((p) => p.text.length > 0);

      return {
        fullText: textContent,
        pages: pages.length > 0 ? pages : [{ pageNumber: 1, text: textContent }],
        pageCount: Math.max(pages.length, 1),
      };
    }
  }

  // 2. Parse real PDF with pdf-parse
  try {
    // Dynamic import to avoid build-time issues
    const pdfParseModule = await import("pdf-parse");
    // Handle both default export and standard cjs export
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdf = (pdfParseModule as any).default || pdfParseModule;

    const data = await pdf(buffer, {
      pagerender: (pageData: any) => {
        return pageData.getTextContent().then((textContent: any) => {
          let lastY: number | null = null;
          let text = "";
          for (const item of textContent.items) {
            if (lastY === item.transform[5] || lastY === null) {
              text += item.str;
            } else {
              text += "\n" + item.str;
            }
            lastY = item.transform[5];
          }
          return text;
        });
      },
    });

    const fullText = (data.text || "").trim();
    if (!fullText) {
      throw new Error("PDF contains no extractable text or is a scanned image without OCR.");
    }

    // Split pages by form feed (\f) or standard page indicators
    const rawPages = fullText.split(/\f/g);
    const pages: ExtractedPage[] = [];

    if (rawPages.length > 1) {
      rawPages.forEach((p: string, idx: number) => {
        if (p.trim().length > 0) {
          pages.push({ pageNumber: idx + 1, text: p.trim() });
        }
      });
    }

    if (pages.length === 0) {
      // If no form feeds, chunk intelligently or assign to page 1
      pages.push({ pageNumber: 1, text: fullText });
    }

    return {
      fullText,
      pages,
      pageCount: data.numpages || pages.length,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn("pdf-parse primary extraction failed, attempting fallback text scan:", message);

    // Defensive fallback: extract ASCII text streams from PDF buffer directly
    const rawStr = buffer.toString("binary");
    const textMatches: string[] = [];
    const streamRegex = /stream[\r\n]+([\s\S]*?)[\r\n]+endstream/g;
    let match;

    while ((match = streamRegex.exec(rawStr)) !== null) {
      const streamContent = match[1];
      // Extract printable characters
      const printable = streamContent.replace(/[^\x20-\x7E\n\r\t]/g, " ").trim();
      if (printable.length > 40 && /[a-zA-Z]{3,}/.test(printable)) {
        textMatches.push(printable);
      }
    }

    const fallbackText = textMatches.join("\n\n").trim();
    if (fallbackText.length > 50) {
      return {
        fullText: fallbackText,
        pages: [{ pageNumber: 1, text: fallbackText }],
        pageCount: 1,
      };
    }

    throw new Error(`Unable to extract text from PDF: ${message}`);
  }
}
