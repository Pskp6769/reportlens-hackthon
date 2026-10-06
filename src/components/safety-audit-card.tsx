"use client";

import React from "react";
import { ShieldAlert, ShieldCheck, AlertTriangle, CheckCircle2 } from "lucide-react";
import { SafetyAudit } from "@/lib/report-schema";

interface SafetyAuditCardProps {
  safetyAudit?: SafetyAudit;
  onSelectEvidence?: (evidence: string) => void;
}

export function SafetyAuditCard({ safetyAudit, onSelectEvidence }: SafetyAuditCardProps) {
  if (!safetyAudit) return null;

  const contradictions = safetyAudit.contradictions_detected || [];
  const hasContradiction = contradictions.length > 0;

  return (
    <div
      className={`border rounded-xl p-5 shadow-xs mb-6 transition-all ${
        hasContradiction
          ? "bg-purple-50/70 border-purple-200"
          : "bg-white border-slate-200"
      }`}
    >
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          {hasContradiction ? (
            <ShieldAlert className="w-4 h-4 text-purple-700" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          )}
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            Safety & Contradiction Engine
          </h3>
        </div>

        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
            hasContradiction
              ? "bg-purple-600 text-white border-purple-700"
              : "bg-emerald-50 text-emerald-700 border-emerald-200"
          }`}
        >
          {hasContradiction ? "DISCORDANCE ALERT" : "PASSED SAFETY CHECKS"}
        </span>
      </div>

      {/* Contradiction Warning Banner if detected */}
      {hasContradiction && (
        <div className="mb-4 p-3 bg-white rounded-lg border border-purple-200 shadow-2xs text-xs space-y-2">
          <div className="flex items-center space-x-1.5 text-purple-900 font-bold">
            <AlertTriangle className="w-4 h-4 text-purple-600" />
            <span>Findings vs. Impression Contradiction Detected</span>
          </div>

          {contradictions.map((conflict, idx) => (
            <div key={idx} className="bg-purple-50/80 p-2.5 rounded border border-purple-100 text-slate-800">
              <p className="font-semibold text-purple-950 mb-1">{conflict.conflict_type}</p>
              <div className="space-y-1 text-slate-700 font-mono text-[11px]">
                <p className="bg-white/80 p-1 rounded">⚠️ {conflict.statement_a}</p>
                <p className="bg-white/80 p-1 rounded">⚠️ {conflict.statement_b}</p>
              </div>
              <p className="mt-2 text-xs text-purple-900 font-medium">
                {conflict.explanation}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Safety Matrix Table */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between py-1 border-b border-slate-100">
          <span className="text-slate-600">Negated statements evaluated:</span>
          <span className="font-bold text-slate-900 flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
            <span>{safetyAudit.negations_verified} statements</span>
          </span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-slate-100">
          <span className="text-slate-600">Cross-section contradiction check:</span>
          <span
            className={`font-bold ${
              hasContradiction ? "text-purple-700" : "text-emerald-700"
            }`}
          >
            {hasContradiction ? `${contradictions.length} Conflict(s) Warned` : "0 Conflicts (Consistent)"}
          </span>
        </div>

        <div className="flex items-center justify-between py-1">
          <span className="text-slate-600">Auditable evidence grounding:</span>
          <span className="font-bold text-emerald-700">
            {safetyAudit.evidence_grounding_score}% Grounded in Source
          </span>
        </div>
      </div>
    </div>
  );
}
