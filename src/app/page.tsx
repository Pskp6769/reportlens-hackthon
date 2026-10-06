"use client";

import React, { useState } from "react";
import { Header } from "@/components/header";
import { UploadZone } from "@/components/upload-zone";
import { ProcessingState } from "@/components/processing-state";
import { ReportDashboard } from "@/components/report-dashboard";
import { SAMPLE_REPORTS, SampleReport } from "@/lib/sample-reports";
import { ReportAnalysis } from "@/lib/report-schema";
import { Zap, ShieldCheck, ArrowRight, Activity, FileCheck, Layers } from "lucide-react";

export default function Home() {
  const [status, setStatus] = useState<"idle" | "processing" | "result">("idle");
  const [analysis, setAnalysis] = useState<ReportAnalysis | null>(null);
  const [rawText, setRawText] = useState<string>("");
  const [pageCount, setPageCount] = useState<number>(1);
  const [fileName, setFileName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Trigger 30s Judge Demo instantly
  const handleTriggerJudgeDemo = () => {
    const demoCase = SAMPLE_REPORTS[0]; // Acute Pulmonary Embolism CT Chest
    handleSampleSelect(demoCase);
  };

  // Run analysis via API route
  const runAnalysis = async (payload: { file?: File; text?: string; pageCount?: number; fileName?: string }) => {
    setStatus("processing");
    setErrorMessage(null);
    setFileName(payload.fileName || payload.file?.name || "Radiology_Study.pdf");
    setPageCount(payload.pageCount || 1);

    try {
      let res: Response;

      if (payload.file) {
        const formData = new FormData();
        formData.append("file", payload.file);
        res = await fetch("/api/analyze", {
          method: "POST",
          body: formData,
        });
      } else {
        res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: payload.text,
            pageCount: payload.pageCount || 1,
            fileName: payload.fileName,
          }),
        });
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status ${res.status}`);
      }

      const data = await res.json();
      if (!data.success || !data.analysis) {
        throw new Error(data.error || "Analysis response was incomplete.");
      }

      // Small delay to allow the judge to appreciate the sleek multi-stage animation
      setTimeout(() => {
        setAnalysis(data.analysis);
        setRawText(data.rawText || payload.text || "");
        setPageCount(data.pageCount || payload.pageCount || 1);
        setStatus("result");
      }, 800);
    } catch (err: unknown) {
      console.error("Analysis failed:", err);
      const msg = err instanceof Error ? err.message : "Analysis failed unexpectedly.";
      setErrorMessage(msg);
      setStatus("idle");
    }
  };

  const handleFileUpload = (file: File) => {
    runAnalysis({ file, fileName: file.name });
  };

  const handleSampleSelect = (sample: SampleReport) => {
    runAnalysis({
      text: sample.rawText,
      pageCount: sample.pageCount,
      fileName: `${sample.id.toUpperCase()}_Study.txt`,
    });
  };

  const handleTextSubmit = (text: string, title?: string) => {
    runAnalysis({
      text,
      pageCount: 1,
      fileName: title || "Pasted_Clinical_Document.txt",
    });
  };

  const handleReset = () => {
    setStatus("idle");
    setAnalysis(null);
    setRawText("");
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col font-sans selection:bg-sky-100 selection:text-sky-900">
      {/* Top Workstation Header */}
      <Header
        onTriggerDemo={handleTriggerJudgeDemo}
        isAnalyzing={status === "processing"}
      />

      <main className="flex-1 pb-16">
        {status === "idle" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            {/* Hero Value Proposition Strip */}
            <div className="text-center max-w-3xl mx-auto mb-8">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-semibold mb-3">
                <Activity className="w-3.5 h-3.5 text-sky-600" />
                <span>Auditable Decision-Support Layer for Radiology</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Every AI conclusion is traceable, safety-checked, and clinically prioritized.
              </h1>

              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
                Transform multi-page unstructured radiology reports into verified structured clinical summaries
                with deterministic negation safety and verbatim source evidence citations.
              </p>

              {/* 30-Second Fast-Track Button for Hackathon Judges */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  id="btn-hero-demo"
                  onClick={handleTriggerJudgeDemo}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all hover:shadow cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Launch 30-Second Judge Demo (Acute PE)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Trust & Differentiation Indicators */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500 font-medium">
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Negation & Contradiction Guard</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <FileCheck className="w-4 h-4 text-sky-600" />
                  <span>Click-to-Source Sentence Tracing</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>Validated Zod Schema Output</span>
                </div>
              </div>
            </div>

            {/* Upload Zone */}
            <UploadZone
              onFileUpload={handleFileUpload}
              onSampleSelect={handleSampleSelect}
              onTextSubmit={handleTextSubmit}
              isProcessing={false}
              errorMessage={errorMessage}
            />
          </div>
        )}

        {status === "processing" && (
          <ProcessingState fileName={fileName} pageCount={pageCount} />
        )}

        {status === "result" && analysis && (
          <ReportDashboard
            analysis={analysis}
            rawText={rawText}
            pageCount={pageCount}
            fileName={fileName}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  );
}
