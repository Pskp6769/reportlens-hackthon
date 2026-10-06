"use client";

import React, { useState, useEffect } from "react";
import { Check, Loader2 } from "lucide-react";

interface ProcessingStateProps {
  fileName?: string;
  pageCount?: number;
}

const STAGES = [
  { id: 1, label: "PDF uploaded & validated", detail: "File integrity verified" },
  { id: 2, label: "Extracting report text & layout", detail: "Multi-page segmentation active" },
  { id: 3, label: "Analyzing clinical findings with Claude", detail: "Information extraction & anatomical mapping" },
  { id: 4, label: "Checking critical findings & negation safety", detail: "Auditing against rule-based deterministic sentinel" },
  { id: 5, label: "Building structured summary & evidence links", detail: "Generating auditable clinical dashboard" },
];

export function ProcessingState({ fileName = "Radiology_Report.pdf", pageCount = 5 }: ProcessingStateProps) {
  const [activeStage, setActiveStage] = useState(1);

  useEffect(() => {
    // Progressively advance through realistic stages
    const timer1 = setTimeout(() => setActiveStage(2), 600);
    const timer2 = setTimeout(() => setActiveStage(3), 1400);
    const timer3 = setTimeout(() => setActiveStage(4), 2600);
    const timer4 = setTimeout(() => setActiveStage(5), 3800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto my-12 p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
      {/* File Badge & Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-medium mb-3">
          <span>{fileName}</span>
          <span>•</span>
          <span>{pageCount} {pageCount === 1 ? "page" : "pages"}</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">
          Analyzing Radiology Report
        </h3>
        {/* Dynamic ticker from prompt */}
        <p className="mt-1 text-xs font-mono text-sky-700 bg-sky-50 py-1.5 px-3 rounded-lg border border-sky-100 inline-block font-semibold">
          Reading {pageCount} pages → Extracting clinical statements → Verifying evidence → Checking urgency
        </p>
      </div>

      {/* Stage Stepper List */}
      <div className="space-y-4 max-w-md mx-auto">
        {STAGES.map((stage) => {
          const isDone = stage.id < activeStage;
          const isCurrent = stage.id === activeStage;
          const isUpcoming = stage.id > activeStage;

          return (
            <div
              key={stage.id}
              className={`flex items-center space-x-3.5 p-3 rounded-xl transition-all duration-200 ${
                isCurrent
                  ? "bg-sky-50/80 border border-sky-200 shadow-2xs"
                  : isDone
                  ? "bg-slate-50 border border-slate-100"
                  : "opacity-40"
              }`}
            >
              {/* Icon Marker */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-all ${
                  isDone
                    ? "bg-emerald-600 text-white"
                    : isCurrent
                    ? "bg-sky-600 text-white ring-4 ring-sky-100"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {isDone ? (
                  <Check className="w-4 h-4 stroke-[2.5]" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 animate-spin stroke-[2.5]" />
                ) : (
                  <span>{stage.id}</span>
                )}
              </div>

              {/* Text info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p
                    className={`text-sm font-semibold truncate ${
                      isCurrent ? "text-slate-900" : isDone ? "text-slate-700" : "text-slate-500"
                    }`}
                  >
                    {stage.label}
                  </p>
                  {isCurrent && (
                    <span className="text-[11px] font-mono font-medium text-sky-600 animate-pulse">
                      Processing...
                    </span>
                  )}
                  {isDone && (
                    <span className="text-[11px] font-mono font-medium text-emerald-600">
                      Done
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 truncate">{stage.detail}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hospital System Safety Guarantee notice */}
      <div className="mt-8 pt-6 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-500">
          Strict extraction mode active • Hallucination prevention & negation safety checks applied
        </p>
      </div>
    </div>
  );
}
