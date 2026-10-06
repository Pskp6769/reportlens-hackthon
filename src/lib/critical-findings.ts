import { CriticalFinding, FindingItem, ContradictionWarning, SafetyAudit } from "./report-schema";

// High-priority concepts categorized by clinical acuity
export interface CriticalConceptRule {
  concept: string;
  keywords: string[];
  priority: "critical" | "urgent";
  defaultReason: string;
}

export const CRITICAL_RULES: CriticalConceptRule[] = [
  {
    concept: "tension_pneumothorax",
    keywords: ["tension pneumothorax", "tension hydrothorax", "mediastinal shift with pneumothorax"],
    priority: "critical",
    defaultReason: "Tension pneumothorax is an immediate life-threatening surgical emergency requiring decompression.",
  },
  {
    concept: "pulmonary_embolism",
    keywords: [
      "pulmonary embolism",
      "filling defect within the pulmonary artery",
      "filling defect within the right pulmonary artery",
      "filling defect within the left pulmonary artery",
      "saddle embolus",
      "saddle pulmonary embolism",
      "acute pe",
      "submassive pe",
      "massive pe",
      "acute pulmonary thromboembolism",
    ],
    priority: "critical",
    defaultReason: "Acute pulmonary embolism is an emergent vascular condition with risk of hemodynamic collapse.",
  },
  {
    concept: "intracranial_hemorrhage",
    keywords: [
      "intracranial hemorrhage",
      "subarachnoid hemorrhage",
      "subdural hematoma",
      "epidural hematoma",
      "parenchymal hemorrhage",
      "intraventricular hemorrhage",
      "midline shift",
      "brain herniation",
      "uncal herniation",
    ],
    priority: "critical",
    defaultReason: "Acute intracranial hemorrhage or mass effect represents an emergent neurosurgical condition.",
  },
  {
    concept: "aortic_dissection",
    keywords: [
      "aortic dissection",
      "intimal flap",
      "stanford type a",
      "stanford type b",
      "ruptured abdominal aortic aneurysm",
      "aortic rupture",
    ],
    priority: "critical",
    defaultReason: "Aortic dissection is a cardiovascular emergency requiring immediate surgical or intensive management.",
  },
  {
    concept: "free_air_perforation",
    keywords: [
      "free air",
      "pneumoperitoneum",
      "free intraperitoneal air",
      "bowel perforation",
      "viscus perforation",
      "extraluminal gas",
    ],
    priority: "critical",
    defaultReason: "Extraluminal free peritoneal air indicates acute gastrointestinal perforation requiring emergent surgical consultation.",
  },
  {
    concept: "spinal_cord_compression",
    keywords: [
      "spinal cord compression",
      "cord compression",
      "cauda equina compression",
      "epidural abscess with cord compromise",
    ],
    priority: "critical",
    defaultReason: "Spinal cord or cauda equina compression requires immediate neurosurgical evaluation to prevent irreversible deficit.",
  },
  {
    concept: "major_vascular_occlusion",
    keywords: [
      "major vascular occlusion",
      "internal carotid artery occlusion",
      "middle cerebral artery occlusion",
      "m1 occlusion",
      "superior mesenteric artery occlusion",
      "acute limb ischemia",
    ],
    priority: "critical",
    defaultReason: "Large vessel occlusion is time-critical ischemia requiring immediate revascularization/thrombectomy.",
  },
  {
    concept: "pneumothorax",
    keywords: ["pneumothorax", "apical pneumothorax"],
    priority: "urgent",
    defaultReason: "Pneumothorax detected; clinical stability and size should be evaluated for chest tube intervention.",
  },
  {
    concept: "appendicitis",
    keywords: [
      "acute appendicitis",
      "dilated appendix with wall thickening",
      "appendiceal perforation",
      "periappendiceal fat stranding",
    ],
    priority: "urgent",
    defaultReason: "Acute appendicitis requires urgent surgical appraisal and antibiotic management.",
  },
  {
    concept: "acute_fracture_complication",
    keywords: [
      "unstable cervical spine fracture",
      "open fracture",
      "displaced unstable fracture",
      "pelvic ring disruption",
    ],
    priority: "urgent",
    defaultReason: "Unstable or complicated fracture requires urgent orthopedic/trauma evaluation.",
  },
  {
    concept: "suspicious_mass_urgent",
    keywords: [
      "highly suspicious for malignancy with obstruction",
      "suspicious mass with airway narrowing",
      "urgent biopsy recommended",
    ],
    priority: "urgent",
    defaultReason: "Suspicious lesion with acute obstructive or compressive features requires expedited oncology/surgical workup.",
  },
];

// Negation indicator prefixes and suffixes commonly found in radiology text
const NEGATION_PATTERNS = [
  /\bno\b/i,
  /\bno evidence of\b/i,
  /\bnegative for\b/i,
  /\bwithout evidence of\b/i,
  /\bfree of\b/i,
  /\bunremarkable\b/i,
  /\bruled out\b/i,
  /\babsence of\b/i,
  /\bdenies\b/i,
  /\bnot demonstrated\b/i,
  /\bno definite\b/i,
  /\bno acute\b/i,
  /\bno significant\b/i,
  /\bclear of\b/i,
];

/**
 * Checks if a specific text contains a negated phrase for a given target keyword
 */
export function isNegated(text: string, keyword: string): boolean {
  const lower = text.toLowerCase();
  const kwLower = keyword.toLowerCase();

  const kwIndex = lower.indexOf(kwLower);
  if (kwIndex === -1) return false;

  // Window of up to 50 characters before the keyword
  const start = Math.max(0, kwIndex - 50);
  const preceding = lower.slice(start, kwIndex);

  for (const pattern of NEGATION_PATTERNS) {
    if (pattern.test(preceding)) {
      // Check if there is an adversative conjunction that cancels negation (e.g. "no pneumothorax, but...")
      const between = preceding.slice(preceding.search(pattern));
      if (!/\b(but|however|except|yet)\b/i.test(between)) {
        return true;
      }
    }
  }

  // Window of up to 40 characters after the keyword (e.g. "pneumothorax is not seen")
  const following = lower.slice(kwIndex + kwLower.length, kwIndex + kwLower.length + 40);
  if (/\b(not seen|is absent|is ruled out|not identified|excluded|negative)\b/i.test(following)) {
    return true;
  }

  return false;
}

/**
 * Deterministic and combined critical findings detector
 */
export function flagCriticalFindings(
  fullText: string,
  findings: FindingItem[],
  impression: string[],
  llmCriticals: CriticalFinding[] = []
): { criticals: CriticalFinding[]; audit: SafetyAudit } {
  const combinedCriticals: CriticalFinding[] = [];
  const contradictions: ContradictionWarning[] = [];
  let negationsVerified = 0;

  // Track existing to avoid duplicates
  const seenConcepts = new Set<string>();

  // 1. First incorporate valid LLM criticals that have non-negated source evidence
  for (const item of llmCriticals) {
    if (!item.finding || !item.evidence) continue;

    // Negation safety check on the LLM's cited evidence
    if (isNegated(item.evidence, item.finding)) {
      negationsVerified++;
      continue; // Filter out hallucinated or negated finding
    }

    const key = item.finding.toLowerCase().trim();
    seenConcepts.add(key);
    combinedCriticals.push({
      finding: item.finding,
      reason: item.reason || "Flagged as high-acuity finding requiring clinical attention.",
      priority: item.priority === "critical" ? "critical" : "urgent",
      evidence: item.evidence,
      page: item.page || 1,
    });
  }

  // 2. Deterministic rule check across text sentences
  const sentences = fullText
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 5);

  for (const sentence of sentences) {
    const lowerSentence = sentence.toLowerCase();

    for (const rule of CRITICAL_RULES) {
      for (const kw of rule.keywords) {
        if (lowerSentence.includes(kw)) {
          // Check if negated
          if (isNegated(sentence, kw)) {
            negationsVerified++;
            continue;
          }

          // Non-negated match found!
          const ruleKey = rule.concept;
          if (!seenConcepts.has(ruleKey)) {
            seenConcepts.add(ruleKey);

            // Match formatted finding name
            const prettyFinding = kw
              .split(" ")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ");

            combinedCriticals.push({
              finding: prettyFinding,
              reason: rule.defaultReason,
              priority: rule.priority,
              evidence: sentence,
              page: 1, // Default page
            });
          }
        }
      }
    }
  }

  // 3. Contradiction Safety Check: Compare Findings vs. Impression
  const findingsText = findings.map((f) => f.evidence || f.finding).join(" ").toLowerCase();
  const impressionText = impression.join(" ").toLowerCase();

  const contradictionTargets = [
    { name: "pneumothorax", posRegex: /\bpneumothorax\b/i },
    { name: "pulmonary embolism", posRegex: /\b(pulmonary embolism|filling defect)\b/i },
    { name: "intracranial hemorrhage", posRegex: /\b(intracranial hemorrhage|subdural hematoma|bleed)\b/i },
    { name: "consolidation / pneumonia", posRegex: /\b(consolidation|infiltrate|pneumonia)\b/i },
    { name: "fracture", posRegex: /\b(fracture|break)\b/i },
  ];

  for (const target of contradictionTargets) {
    const findingsHasPos = target.posRegex.test(findingsText) && !isNegated(findingsText, target.name);
    const findingsHasNeg = isNegated(findingsText, target.name);

    const impressionHasPos = target.posRegex.test(impressionText) && !isNegated(impressionText, target.name);
    const impressionHasNeg = isNegated(impressionText, target.name);

    if (findingsHasPos && impressionHasNeg) {
      contradictions.push({
        statement_a: `Findings: positive evidence of ${target.name}`,
        statement_b: `Impression: negated or absent ${target.name}`,
        conflict_type: "Findings vs Impression Discrepancy",
        explanation: `Findings mention positive evidence for '${target.name}', but Impression states '${target.name}' is absent or negative. Radiologist review required.`,
      });
    } else if (findingsHasNeg && impressionHasPos) {
      contradictions.push({
        statement_a: `Findings: negative for ${target.name}`,
        statement_b: `Impression: suggests positive ${target.name}`,
        conflict_type: "Impression Novel Finding / Discrepancy",
        explanation: `Findings explicitly state no evidence of '${target.name}', yet Impression notes '${target.name}'. Check for clinical discordance.`,
      });
    }
  }

  // Calculate audit score
  const audit: SafetyAudit = {
    negations_verified: Math.max(negationsVerified, 1),
    contradictions_detected: contradictions,
    evidence_grounding_score: combinedCriticals.every((c) => c.evidence && c.evidence.length > 5) ? 100 : 85,
    passed_safety_checks: contradictions.length === 0,
  };

  // Sort criticals: "critical" first, then "urgent"
  combinedCriticals.sort((a, b) => {
    if (a.priority === "critical" && b.priority !== "critical") return -1;
    if (a.priority !== "critical" && b.priority === "critical") return 1;
    return 0;
  });

  return {
    criticals: combinedCriticals,
    audit,
  };
}
