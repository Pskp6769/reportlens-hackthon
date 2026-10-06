"use client";

import React, { useState } from "react";
import { Copy, Check, FileText, CheckCircle2 } from "lucide-react";

interface ClinicalSummaryProps {
  summary: string;
  impression: string[];
  recommendations: string[];
  onSelectEvidence?: (evidence: string) => void;
}

export function ClinicalSummary({
  summary,
  impression,
  recommendations,
  onSelectEvidence,
}: ClinicalSummaryProps) {
  const [copied, setCopied] = useState(false);

  const handleCopySummary = () => {
    const fullText = `CLINICAL SUMMARY:\n${summary}\n\nIMPRESSION:\n${impression
      .map((imp, idx) => `${idx + 1}. ${imp}`)
      .join("\n")}\n\nRECOMMENDATIONS:\n${recommendations
      .map((rec, idx) => `${idx + 1}. ${rec}`)
      .join("\n")}`;

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Synthesized Clinical Summary Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-sky-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Clinical Executive Summary
            </h3>
          </div>

          <button
            onClick={handleCopySummary}
            className="flex items-center space-x-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy Summary</span>
              </>
            )}
          </button>
        </div>

        <p className="text-sm text-slate-800 leading-relaxed font-normal bg-slate-50/70 p-3.5 rounded-lg border border-slate-100">
          {summary || "No executive summary available for this study."}
        </p>
      </div>

      {/* 2. Diagnostic Impression Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-3">
          Diagnostic Impression
        </h3>

        {impression.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No formal impression documented.</p>
        ) : (
          <ol className="space-y-2.5">
            {impression.map((item, index) => (
              <li
                key={index}
                className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-900 group"
              >
                <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <span className="font-medium">{item}</span>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* 3. Clinical Recommendations Card */}
      {recommendations.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center space-x-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Actionable Recommendations
            </h3>
          </div>

          <ul className="space-y-2">
            {recommendations.map((rec, index) => (
              <li
                key={index}
                className="flex items-start space-x-2 text-xs sm:text-sm text-slate-800 bg-emerald-50/40 p-2.5 rounded-lg border border-emerald-100"
              >
                <span className="text-emerald-600 font-bold mr-1">•</span>
                <span className="font-medium">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
