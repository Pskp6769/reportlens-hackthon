import { NextRequest, NextResponse } from "next/server";
import { extractTextFromPDF } from "@/lib/extract-pdf";
import { analyzeReportWithClaude } from "@/lib/anthropic";

export const maxDuration = 60; // Next.js API route timeout config

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let reportText = "";
    let pageCount = 1;
    let fileName = "Radiology_Report.pdf";

    // 1. Handle JSON payload (e.g. sample report or raw text)
    if (contentType.includes("application/json")) {
      const body = await req.json();
      if (!body.text || typeof body.text !== "string" || body.text.trim().length === 0) {
        return NextResponse.json(
          { error: "Invalid report content. Please provide valid text." },
          { status: 400 }
        );
      }
      reportText = body.text;
      pageCount = body.pageCount || 1;
      fileName = body.fileName || "Sample_Radiology_Report.txt";
    }
    // 2. Handle Multipart Form Data (PDF file upload)
    else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json(
          { error: "No file provided in the upload request." },
          { status: 400 }
        );
      }

      // Check file size (max 10MB)
      const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
      if (file.size > MAX_SIZE) {
        return NextResponse.json(
          { error: "File exceeds the maximum allowable size of 10 MB." },
          { status: 413 }
        );
      }

      fileName = file.name;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      try {
        const extraction = await extractTextFromPDF(buffer);
        reportText = extraction.fullText;
        pageCount = extraction.pageCount;
      } catch (extractErr: unknown) {
        const msg = extractErr instanceof Error ? extractErr.message : "Failed to parse PDF document.";
        return NextResponse.json(
          { error: `PDF Extraction Failed: ${msg}` },
          { status: 422 }
        );
      }

      if (!reportText || reportText.trim().length < 20) {
        return NextResponse.json(
          { error: "Document is empty or could not yield readable text. Please ensure it is a digital text PDF." },
          { status: 422 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Unsupported Content-Type. Please use multipart/form-data or application/json." },
        { status: 415 }
      );
    }

    // Run clinical extraction and safety pipeline
    const analysis = await analyzeReportWithClaude(reportText, pageCount);

    return NextResponse.json({
      success: true,
      analysis,
      rawText: reportText,
      pageCount,
      fileName,
    });
  } catch (err: unknown) {
    console.error("Unhandled error in /api/analyze:", err);
    const message = err instanceof Error ? err.message : "An unexpected server error occurred.";
    return NextResponse.json(
      { error: `Analysis Error: ${message}` },
      { status: 500 }
    );
  }
}
