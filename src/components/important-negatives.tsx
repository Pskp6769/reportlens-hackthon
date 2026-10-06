"use client";

import React from "react";
import { ShieldCheck, Check, ExternalLink } from "lucide-react";

interface ImportantNegativesProps {
  negatives: string[];
  onSelectEvidence?: (evidence: string) => void;
}

export function ImportantNegatives({ negatives, onSelectEvidence }: ImportantNegativesProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs mb-6">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            Important Clinical Negatives
          </h3>
        </div>
        <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
          Negation-Verified
        </span>
      </div>

      <p className="text-xs text-slate-500 mb-3">
        High-impact negative assertions confirmed absent in the text (prevents false positive hallucinations):
      </p>

      {negatives.length === 0 ? (
        <p className="text-xs text-slate-400 italic">No specific clinical negatives highlighted.</p>
      ) : (
        <ul className="space-y-2">
          {negatives.map((neg, idx) => (
            <li
              key={idx}
              className="flex items-start justify-between gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-800 hover:bg-slate-100/70 transition-colors group"
            >
              <div className="flex items-start space-x-2 min-w-0">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="font-medium">{neg}</span>
              </div>

              {onSelectEvidence && (
                <button
                  onClick={() => onSelectEvidence(neg)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-sky-600 cursor-pointer"
                  title="View citation in original text"
                >
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
