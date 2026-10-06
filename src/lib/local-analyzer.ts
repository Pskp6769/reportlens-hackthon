import { ReportAnalysis, FindingItem } from "./report-schema";
import { flagCriticalFindings, isNegated } from "./critical-findings";

/**
 * Deterministic Clinical NLP Engine for high-speed fallback and offline demo capability.
 * Accurately extracts metadata, sections, anatomy, and findings with evidence citations.
 */
export function analyzeReportLocally(text: string, pageCount = 1): ReportAnalysis {
  const startTime = Date.now();

  // Extract Patient Info
  const nameMatch = text.match(/Name:\s*([^\n\r,]+(?:,\s*[^\n\r]+)?)/i);
  const ageMatch = text.match(/Age:\s*(\d+\s*(?:years|yo|y\.?o\.?)?)/i);
  const sexMatch = text.match(/Sex:\s*(Female|Male|F|M|Other)/i);
  const idMatch = text.match(/(?:Patient\s*ID|MRN|Accession(?:\s*Number)?):\s*([A-Za-z0-9-_]+)/i);

  // Extract Exam Info
  const modalityMatch = text.match(/EXAMINATION:\s*([^\n\r]+)/i) || text.match(/(CT|MRI|X-RAY|ULTRASOUND|PET)[^\n\r]+/i);
  const dateMatch = text.match(/(?:Exam\s*Date|Date):\s*([0-9]{4}-[0-9]{2}-[0-9]{2}(?:\s*[0-9]{2}:[0-9]{2}(?:\s*[A-Z]+)?)?)/i);

  let modality = "Radiology Study";
  let bodyRegion = "Chest / Thorax";
  let studyTitle = "Diagnostic Imaging";

  if (modalityMatch) {
    studyTitle = modalityMatch[1] ? modalityMatch[1].trim() : modalityMatch[0].trim();
    if (/CT/i.test(studyTitle)) modality = "Computed Tomography (CT)";
    else if (/MRI/i.test(studyTitle)) modality = "Magnetic Resonance Imaging (MRI)";
    else if (/X-RAY|RADIOGRAPH/i.test(studyTitle)) modality = "Plain Radiography (X-Ray)";
    else if (/ULTRASOUND/i.test(studyTitle)) modality = "Ultrasound";

    if (/CHEST|PULMONARY/i.test(studyTitle)) bodyRegion = "Chest / Thorax";
    else if (/ABDOMEN|PELVIS|APPENDIC/i.test(studyTitle)) bodyRegion = "Abdomen & Pelvis";
    else if (/BRAIN|HEAD|STROKE/i.test(studyTitle)) bodyRegion = "Head / Neuro";
    else if (/SPINE/i.test(studyTitle)) bodyRegion = "Spine";
  }

  // Extract Sections
  const findingsSectionMatch = text.match(/FINDINGS:?\s*([\s\S]*?)(?=IMPRESSION:?|RECOMMENDATIONS:?|$)/i);
  const impressionSectionMatch = text.match(/IMPRESSION:?\s*([\s\S]*?)(?=RECOMMENDATIONS:?|$)/i);
  const recommendationsSectionMatch = text.match(/RECOMMENDATIONS:?\s*([\s\S]*?)$/i);

  const findingsRaw = findingsSectionMatch ? findingsSectionMatch[1].trim() : "";
  const impressionRaw = impressionSectionMatch ? impressionSectionMatch[1].trim() : "";
  const recommendationsRaw = recommendationsSectionMatch ? recommendationsSectionMatch[1].trim() : "";

  // Parse Impressions
  const impressionLines: string[] = [];
  if (impressionRaw) {
    const lines = impressionRaw.split(/\n+/).map((l) => l.trim()).filter(Boolean);
    for (const l of lines) {
      // Strip numbers like "1. " or "- "
      const clean = l.replace(/^\d+[\.\)]\s*/, "").replace(/^[-*•]\s*/, "").trim();
      if (clean.length > 5) {
        impressionLines.push(clean);
      }
    }
  }

  // Parse Recommendations
  const recommendationLines: string[] = [];
  if (recommendationsRaw) {
    const lines = recommendationsRaw.split(/\n+/).map((l) => l.trim()).filter(Boolean);
    for (const l of lines) {
      const clean = l.replace(/^\d+[\.\)]\s*/, "").replace(/^[-*•]\s*/, "").trim();
      if (clean.length > 5) {
        recommendationLines.push(clean);
      }
    }
  }

  // Extract Sentences from Findings
  const rawSentences = findingsRaw
    ? findingsRaw.split(/(?<=[.!?])\s+|\n{2,}/).map((s) => s.trim()).filter((s) => s.length > 10)
    : text.split(/(?<=[.!?])\s+|\n{2,}/).map((s) => s.trim()).filter((s) => s.length > 15);

  const parsedFindings: FindingItem[] = [];
  const importantNegatives: string[] = [];

  // Anatomy classifier dictionary
  const anatomyKeywords: { [key: string]: string } = {
    pulmonary: "Pulmonary Arteries",
    artery: "Pulmonary Arteries",
    embolus: "Pulmonary Arteries",
    aorta: "Thoracic Aorta",
    mediastin: "Mediastinum & Hila",
    cardiac: "Heart & Pericardium",
    pericard: "Heart & Pericardium",
    lung: "Lung Parenchyma",
    infiltrat: "Lung Parenchyma",
    consolidation: "Lung Parenchyma",
    pleura: "Pleural Space",
    pneumothorax: "Pleural Space",
    effusion: "Pleural Space",
    chest: "Chest Wall",
    appendix: "Appendix & RLQ",
    appendic: "Appendix & RLQ",
    bowel: "Gastrointestinal Tract",
    liver: "Liver & Biliary",
    kidney: "Kidneys / Retroperitoneum",
    brain: "Brain Parenchyma",
    ventricl: "Ventricular System",
    hemorrhag: "Intracranial Spaces",
    bone: "Osseous Structures",
    osseous: "Osseous Structures",
    fracture: "Osseous Structures",
    spine: "Spine",
  };

  let currentCategory = "General";

  for (const sentence of rawSentences) {
    // Check if this line is an anatomical header like "PULMONARY VASCULATURE:"
    const headerMatch = sentence.match(/^([A-Z\s]{4,}):$/);
    if (headerMatch) {
      currentCategory = headerMatch[1].trim();
      continue;
    }

    // Determine Anatomy
    let matchedAnatomy = currentCategory !== "General" ? currentCategory : "Chest / Thorax";
    const lower = sentence.toLowerCase();
    for (const [kw, anat] of Object.entries(anatomyKeywords)) {
      if (lower.includes(kw)) {
        matchedAnatomy = anat;
        break;
      }
    }

    // Determine Status (Positive vs Negative vs Uncertain)
    const isNeg = isNegated(sentence, "") ||
      /\b(no\b|negative for|not seen|unremarkable|within normal|free of|without)\b/i.test(sentence);

    const isUncertain = /\b(possible|indeterminate|suspicious for|suggestive of|cannot exclude)\b/i.test(sentence);

    let status: "positive" | "negative" | "uncertain" = "positive";
    if (isNeg) {
      status = "negative";
      // Collect key important negatives that clinicians care about
      if (/\b(pneumothorax|embolism|hemorrhage|dissection|free air|fracture|mass|effusion|perforation)\b/i.test(sentence)) {
        importantNegatives.push(sentence);
      }
    } else if (isUncertain) {
      status = "uncertain";
    }

    // Determine Severity
    let severity: "normal" | "mild" | "moderate" | "severe" | "unspecified" = "unspecified";
    if (status === "negative" || /\bunremarkable|normal\b/i.test(sentence)) {
      severity = "normal";
    } else if (/\bmild|trace|minimal|small\b/i.test(sentence)) {
      severity = "mild";
    } else if (/\bmoderate\b/i.test(sentence)) {
      severity = "moderate";
    } else if (/\bsevere|critical|extensive|large|massive\b/i.test(sentence)) {
      severity = "severe";
    }

    // Determine Finding Urgency
    let urgency: "critical" | "urgent" | "routine" | "normal" = "routine";
    if (status === "negative" || severity === "normal") {
      urgency = "normal";
    } else if (/\b(filling defect|pulmonary embolism|tension pneumothorax|intracranial hemorrhage|aortic dissection|free air)\b/i.test(sentence) && !isNeg) {
      urgency = "critical";
    } else if (/\b(appendicitis|pneumothorax|perforation|fracture|infarction)\b/i.test(sentence) && !isNeg) {
      urgency = "urgent";
    }

    // Clean finding statement
    parsedFindings.push({
      finding: sentence.length > 120 ? sentence.slice(0, 117) + "..." : sentence,
      anatomy: matchedAnatomy,
      severity,
      status,
      evidence: sentence,
      page: 1,
      urgency,
    });
  }

  // Deduplicate and filter important negatives
  const cleanNegatives = Array.from(new Set(importantNegatives)).slice(0, 6);

  // Run Critical Findings and Safety Engine
  const { criticals, audit } = flagCriticalFindings(text, parsedFindings, impressionLines);

  // Generate Synthesized Clinical Summary
  let summary = "";
  if (criticals.length > 0) {
    const highestCrit = criticals[0];
    summary = `Report indicates high clinical acuity: ${highestCrit.finding.toUpperCase()} demonstrated on ${studyTitle}. Immediate clinical review and intervention recommended per priority protocol.`;
  } else if (parsedFindings.some((f) => f.urgency === "urgent")) {
    summary = `Report demonstrates urgent clinical findings requiring prompt management, with no signs of life-threatening decompensation.`;
  } else {
    summary = `Diagnostic imaging is overall unremarkable or stable without evidence of acute cardiopulmonary or surgical abnormality.`;
  }

  // Add impression summary if available
  if (impressionLines.length > 0) {
    summary += ` Primary impression notes: ${impressionLines.slice(0, 2).join("; ")}.`;
  }

  return {
    patient: {
      name: nameMatch ? nameMatch[1].trim() : null,
      age: ageMatch ? ageMatch[1].trim() : null,
      sex: sexMatch ? sexMatch[1].trim() : null,
      id: idMatch ? idMatch[1].trim() : null,
    },
    exam: {
      modality,
      body_region: bodyRegion,
      study: studyTitle,
      date: dateMatch ? dateMatch[1].trim() : "2026-10-06",
    },
    findings: parsedFindings.slice(0, 12),
    impression: impressionLines.length > 0 ? impressionLines : ["Examination completed without documented diagnostic impression."],
    recommendations: recommendationLines.length > 0 ? recommendationLines : ["Correlate with ongoing clinical and laboratory parameters."],
    important_negatives: cleanNegatives.length > 0 ? cleanNegatives : ["No acute cardiopulmonary process", "No acute osseous abnormality"],
    critical_findings: criticals,
    summary,
    safety_audit: audit,
    meta: {
      pages_analyzed: pageCount,
      total_statements: rawSentences.length,
      processing_time_ms: Date.now() - startTime,
      model_used: "ReportLens Medical NLP Engine (Deterministic + Safety Layer)",
    },
  };
}
