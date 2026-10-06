"use client";

import React from "react";
import { AlertCircle, AlertTriangle, ArrowRight, ShieldAlert } from "lucide-react";
import { CriticalFinding } from "@/lib/report-schema";

interface CriticalAlertProps {
  criticalFindings: CriticalFinding[];
  studyName?: string | null;
  onViewSource?: (evidence: string) => void;
}

export function CriticalAlert({
  criticalFindings,
  studyName = "Radiology Study",
  onViewSource,
}: CriticalAlertProps) {
  if (!criticalFindings || criticalFindings.length === 0) {
    return null;
  }

  const primary = criticalFindings[0];
  const isCritical = primary.priority === "critical";

  return (
    <div
      className={`w-full mb-6 p-4 rounded-xl border transition-all ${
        isCritical
          ? "bg-red-50/90 border-red-200 text-red-950 shadow-xs"
          : "bg-amber-50/90 border-amber-200 text-amber-950 shadow-xs"
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Left: Icon & High-Acuity Title */}
        <div className="flex items-start space-x-3">
          <div
            className={`p-2 rounded-lg shrink-0 mt-0.5 ${
              isCritical ? "bg-red-600 text-white" : "bg-amber-600 text-white"
            }`}
          >
            {isCritical ? (
              <ShieldAlert className="w-5 h-5 stroke-[2.2]" />
            ) : (
              <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-2 py-0.5 text-xs font-bold uppercase tracking-wider rounded-md ${
                  isCritical ? "bg-red-600 text-white" : "bg-amber-600 text-white"
                }`}
              >
                {isCritical ? "🔴 CRITICAL FINDING" : "🟠 URGENT FINDING"}
              </span>
              <span className="text-xs font-mono font-medium text-slate-600">
                {studyName} • Page {primary.page || 1}
              </span>
            </div>

            <h4 className="mt-1 text-base font-bold text-slate-900 leading-tight">
              {primary.finding}
            </h4>

            {primary.reason && (
              <p className="mt-0.5 text-xs text-slate-700">
                {primary.reason}
              </p>
            )}

            {/* Verbatim Source Evidence */}
            {primary.evidence && (
              <blockquote className="mt-2 pl-3 border-l-2 border-red-400/80 text-xs text-slate-800 italic bg-white/60 py-1 pr-2 rounded-r">
                &ldquo;{primary.evidence}&rdquo;
              </blockquote>
            )}
          </div>
        </div>

        {/* Right: View Source Button */}
        {primary.evidence && (
          <button
            onClick={() => onViewSource?.(primary.evidence)}
            className="self-end sm:self-center shrink-0 flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-300 hover:border-slate-400 text-slate-800 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer group"
          >
            <span>View source evidence</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>

      {/* Additional Critical Findings if multiple exist */}
      {criticalFindings.length > 1 && (
        <div className="mt-3 pt-3 border-t border-red-200/60 flex flex-wrap gap-2 text-xs">
          <span className="font-semibold text-slate-700">Also detected:</span>
          {criticalFindings.slice(1).map((item, idx) => (
            <span
              key={idx}
              onClick={() => onViewSource?.(item.evidence)}
              className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-white/70 border border-red-200 text-red-900 cursor-pointer hover:bg-white"
            >
              <span>{item.finding}</span>
              <ArrowRight className="w-3 h-3 text-red-600" />
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
