import { z } from "zod";

export const PatientSchema = z.object({
  name: z.string().nullable().default(null),
  age: z.string().nullable().default(null),
  sex: z.string().nullable().default(null),
  id: z.string().nullable().default(null),
});

export const ExamSchema = z.object({
  modality: z.string().nullable().default(null),
  body_region: z.string().nullable().default(null),
  study: z.string().nullable().default(null),
  date: z.string().nullable().default(null),
});

export const FindingItemSchema = z.object({
  finding: z.string(),
  anatomy: z.string(),
  severity: z.enum(["normal", "mild", "moderate", "severe", "unspecified"]).default("unspecified"),
  status: z.enum(["positive", "negative", "uncertain"]).default("positive"),
  evidence: z.string().default(""),
  page: z.number().optional().default(1),
  urgency: z.enum(["critical", "urgent", "routine", "normal"]).optional().default("routine"),
});

export const CriticalFindingSchema = z.object({
  finding: z.string(),
  reason: z.string(),
  priority: z.enum(["critical", "urgent"]),
  evidence: z.string(),
  page: z.number().optional().default(1),
});

export const ContradictionWarningSchema = z.object({
  statement_a: z.string(),
  statement_b: z.string(),
  conflict_type: z.string(),
  explanation: z.string(),
});

export const SafetyAuditSchema = z.object({
  negations_verified: z.number().default(0),
  contradictions_detected: z.array(ContradictionWarningSchema).default([]),
  evidence_grounding_score: z.number().default(100),
  passed_safety_checks: z.boolean().default(true),
});

export const ReportSchema = z.object({
  patient: PatientSchema.default({
    name: null,
    age: null,
    sex: null,
    id: null,
  }),
  exam: ExamSchema.default({
    modality: null,
    body_region: null,
    study: null,
    date: null,
  }),
  findings: z.array(FindingItemSchema).default([]),
  impression: z.array(z.string()).default([]),
  recommendations: z.array(z.string()).default([]),
  important_negatives: z.array(z.string()).default([]),
  critical_findings: z.array(CriticalFindingSchema).default([]),
  summary: z.string().default(""),
  safety_audit: SafetyAuditSchema.optional().default({
    negations_verified: 0,
    contradictions_detected: [],
    evidence_grounding_score: 100,
    passed_safety_checks: true,
  }),
  meta: z.object({
    pages_analyzed: z.number().default(1),
    total_statements: z.number().default(0),
    processing_time_ms: z.number().default(0),
    model_used: z.string().default("Claude 3.5 Sonnet / Clinical Sentinel"),
  }).optional(),
});

export type Patient = z.infer<typeof PatientSchema>;
export type Exam = z.infer<typeof ExamSchema>;
export type FindingItem = z.infer<typeof FindingItemSchema>;
export type CriticalFinding = z.infer<typeof CriticalFindingSchema>;
export type ContradictionWarning = z.infer<typeof ContradictionWarningSchema>;
export type SafetyAudit = z.infer<typeof SafetyAuditSchema>;
export type ReportAnalysis = z.infer<typeof ReportSchema>;
