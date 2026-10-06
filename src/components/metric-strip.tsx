"use client";

import React from "react";
import { FileText, ListChecks, AlertOctagon, Lightbulb, ShieldCheck, CheckCircle2 } from "lucide-react";
import { ReportAnalysis } from "@/lib/report-schema";

interface MetricStripProps {
  analysis: ReportAnalysis;
  pageCount: number;
}

export function MetricStrip({ analysis, pageCount }: MetricStripProps) {
  const findingsCount = analysis.findings.length;
  const criticalCount = analysis.critical_findings.filter((c) => c.priority === "critical").length;
  const urgentCount = analysis.critical_findings.filter((c) => c.priority === "urgent").length;
  const recsCount = analysis.recommendations.length;
  const negationsCount = analysis.safety_audit?.negations_verified ?? analysis.important_negatives.length;
  const contradictionsCount = analysis.safety_audit?.contradictions_detected?.length ?? 0;

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl shadow-xs p-3.5 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Core Metric Pills */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-medium">
          {/* Pages */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100/80 text-slate-700">
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>
              <strong className="font-semibold text-slate-900">{pageCount}</strong> pages analyzed
            </span>
          </div>

          {/* Findings */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100/80 text-slate-700">
            <ListChecks className="w-3.5 h-3.5 text-slate-500" />
            <span>
              <strong className="font-semibold text-slate-900">{findingsCount}</strong> clinical findings
            </span>
          </div>

          {/* Criticals */}
          <div
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg ${
              criticalCount > 0
                ? "bg-red-50 text-red-700 border border-red-200"
                : urgentCount > 0
                ? "bg-amber-50 text-amber-700 border border-amber-200"
                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>
              <strong className="font-semibold">{criticalCount > 0 ? criticalCount : urgentCount}</strong>{" "}
              {criticalCount > 0 ? "critical alert" : urgentCount > 0 ? "urgent finding" : "0 critical alerts"}
            </span>
          </div>

          {/* Recommendations */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100/80 text-slate-700">
            <Lightbulb className="w-3.5 h-3.5 text-slate-500" />
            <span>
              <strong className="font-semibold text-slate-900">{recsCount}</strong> recommendations
            </span>
          </div>
        </div>

        {/* Safety & Audit Verification Badges */}
        <div className="flex items-center space-x-2 text-xs">
          <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-sky-50 text-sky-800 border border-sky-100 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
            <span>{negationsCount} Negations Verified</span>
          </div>

          <div
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md font-medium border ${
              contradictionsCount === 0
                ? "bg-emerald-50 text-emerald-800 border-emerald-100"
                : "bg-purple-50 text-purple-800 border-purple-200"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{contradictionsCount === 0 ? "Safety: 0 Contradictions" : `${contradictionsCount} Contradiction Warning`}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
