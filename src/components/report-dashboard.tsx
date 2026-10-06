"use client";

import React, { useState } from "react";
import {
  FileText,
  FileCode,
  Eye,
  RefreshCw,
  Copy,
  Download,
  AlertOctagon,
  CheckCircle2,
  Calendar,
  Layers,
  ShieldAlert,
} from "lucide-react";
import { ReportAnalysis } from "@/lib/report-schema";
import { MetricStrip } from "./metric-strip";
import { CriticalAlert } from "./critical-alert";
import { ClinicalSummary } from "./clinical-summary";
import { FindingsList } from "./findings-list";
import { MetadataCard } from "./metadata-card";
import { ImportantNegatives } from "./important-negatives";
import { SafetyAuditCard } from "./safety-audit-card";
import { OriginalReportView } from "./original-report-view";
import { JsonViewer } from "./json-viewer";

interface ReportDashboardProps {
  analysis: ReportAnalysis;
  rawText: string;
  pageCount: number;
  fileName: string;
  onReset: () => void;
}

export function ReportDashboard({
  analysis,
  rawText,
  pageCount,
  fileName,
  onReset,
}: ReportDashboardProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "original" | "json">("summary");
  const [highlightSnippet, setHighlightSnippet] = useState<string | null>(null);

  // When user clicks "View Source" or an evidence link, switch to original tab and highlight
  const handleSelectEvidence = (evidence: string) => {
    setHighlightSnippet(evidence);
    setActiveTab("original");
  };

  const handleClearHighlight = () => {
    setHighlightSnippet(null);
  };

  const hasCritical = analysis.critical_findings.length > 0;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Action Bar & Report Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-200">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-900 text-white">
              Report Analysis
            </span>
            <span className="text-xs font-mono font-medium text-slate-500">
              {fileName}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {analysis.exam?.study || "Radiology Examination"}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-600">
            <span>
              <strong>Modality:</strong> {analysis.exam?.modality || "Diagnostic Imaging"}
            </span>
            <span>•</span>
            <span>
              <strong>Body Region:</strong> {analysis.exam?.body_region || "Thorax"}
            </span>
            <span>•</span>
            <span>
              <strong>Date:</strong> {analysis.exam?.date || "2026-10-06"}
            </span>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onReset}
            className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Analyze Another Report</span>
          </button>
        </div>
      </div>

      {/* Top Metric Strip */}
      <MetricStrip analysis={analysis} pageCount={pageCount} />

      {/* Critical Finding Alert Banner (if any) */}
      <CriticalAlert
        criticalFindings={analysis.critical_findings}
        studyName={analysis.exam?.study}
        onViewSource={handleSelectEvidence}
      />

      {/* Primary Tab Navigation */}
      <div className="flex items-center space-x-1 border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab("summary")}
          className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === "summary"
              ? "border-sky-600 text-sky-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Clinical Summary & Findings</span>
        </button>

        <button
          onClick={() => setActiveTab("original")}
          className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === "original"
              ? "border-sky-600 text-sky-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Original Report Text</span>
          {highlightSnippet && (
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("json")}
          className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === "json"
              ? "border-sky-600 text-sky-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>Structured JSON (FHIR/Zod)</span>
        </button>
      </div>

      {/* Tab Content Views */}
      {activeTab === "summary" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT ~65% (8 of 12 columns) */}
          <div className="lg:col-span-8 space-y-6">
            <ClinicalSummary
              summary={analysis.summary}
              impression={analysis.impression}
              recommendations={analysis.recommendations}
              onSelectEvidence={handleSelectEvidence}
            />

            <FindingsList
              findings={analysis.findings}
              onSelectEvidence={handleSelectEvidence}
            />
          </div>

          {/* RIGHT ~35% (4 of 12 columns) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Critical Findings Detail Card */}
            {analysis.critical_findings.length > 0 && (
              <div className="bg-red-50/70 border border-red-200 rounded-xl p-5 shadow-xs">
                <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-red-200/60">
                  <AlertOctagon className="w-4 h-4 text-red-600" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-red-950">
                    High-Acuity Priority
                  </h3>
                </div>

                <div className="space-y-3">
                  {analysis.critical_findings.map((crit, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg border border-red-200 shadow-2xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-red-600 text-white">
                          {crit.priority}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          Page {crit.page || 1}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-900">{crit.finding}</p>
                      <p className="text-[11px] text-slate-600 mt-1">{crit.reason}</p>
                      {crit.evidence && (
                        <button
                          onClick={() => handleSelectEvidence(crit.evidence)}
                          className="mt-2 text-[11px] text-sky-700 hover:text-sky-900 font-semibold underline underline-offset-2 flex items-center space-x-1 cursor-pointer"
                        >
                          <span>Trace source text →</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <MetadataCard patient={analysis.patient} exam={analysis.exam} />

            <ImportantNegatives
              negatives={analysis.important_negatives}
              onSelectEvidence={handleSelectEvidence}
            />

            <SafetyAuditCard
              safetyAudit={analysis.safety_audit}
              onSelectEvidence={handleSelectEvidence}
            />
          </div>
        </div>
      )}

      {activeTab === "original" && (
        <OriginalReportView
          rawText={rawText}
          highlightSnippet={highlightSnippet}
          onClearHighlight={handleClearHighlight}
        />
      )}

      {activeTab === "json" && <JsonViewer analysis={analysis} />}

      {/* Persistent Clinical Disclaimer */}
      <footer className="mt-12 pt-6 border-t border-slate-200 text-center text-xs text-slate-500 leading-relaxed">
        <p className="max-w-3xl mx-auto">
          <strong>Clinical Decision Support Disclaimer:</strong> AI-generated clinical summary for decision support.
          Verify findings against the original report before clinical use. The product does not prescribe medication,
          recommend definitive treatments, replace certified radiologists, or make unsupported diagnoses.
        </p>
      </footer>
    </div>
  );
}
