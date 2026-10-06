"use client";

import React, { useState, useRef } from "react";
import { Upload, FileUp, Zap, Sparkles, FileText, AlertCircle } from "lucide-react";
import { SAMPLE_REPORTS, SampleReport } from "@/lib/sample-reports";

interface UploadZoneProps {
  onFileUpload: (file: File) => void;
  onSampleSelect: (sample: SampleReport) => void;
  onTextSubmit: (text: string, title?: string) => void;
  isProcessing: boolean;
  errorMessage?: string | null;
}

export function UploadZone({
  onFileUpload,
  onSampleSelect,
  onTextSubmit,
  isProcessing,
  errorMessage,
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pastedText, setPastedText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndUpload(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      validateAndUpload(file);
    }
  };

  const validateAndUpload = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert("File exceeds maximum size of 10 MB.");
      return;
    }
    onFileUpload(file);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 my-6">
      {/* Error Banner if any */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs sm:text-sm text-red-800 flex items-start space-x-2.5">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold">Analysis Notice:</strong> {errorMessage}
          </div>
        </div>
      )}

      {/* Main Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all p-10 sm:p-14 text-center bg-white shadow-2xs hover:shadow-xs ${
          isDragging
            ? "border-sky-500 bg-sky-50/50 scale-[1.01]"
            : "border-slate-300 hover:border-slate-400"
        } ${isProcessing ? "opacity-50 pointer-events-none" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload-input"
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center ring-8 ring-sky-50/60 shadow-xs">
            <Upload className="w-8 h-8 stroke-[1.8]" />
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Upload radiology report
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Drag & drop your multi-page clinical report, or{" "}
              <span className="text-sky-600 font-semibold underline decoration-sky-300 underline-offset-2">
                browse files
              </span>
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
              PDF or TXT
            </span>
            <span>•</span>
            <span>Up to 10 MB</span>
            <span>•</span>
            <span>Automated PHI redaction friendly</span>
          </div>

          {/* Quick Paste Alternate */}
          <div className="pt-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowPasteModal(true);
              }}
              className="text-xs text-slate-600 hover:text-sky-600 underline decoration-slate-300 underline-offset-2 font-medium cursor-pointer"
            >
              Or paste report text directly →
            </button>
          </div>
        </div>
      </div>

      {/* Try Sample Reports Section */}
      <div className="bg-slate-100/60 border border-slate-200/80 rounded-2xl p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Pre-Loaded Clinical Test Cases
              </h4>
            </div>
            <p className="text-xs text-slate-500">
              Simulate instant multi-page clinical workflows with verified findings
            </p>
          </div>

          <span className="self-start sm:self-center text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
            DEMO DATA — NOT A REAL PATIENT
          </span>
        </div>

        {/* Sample Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SAMPLE_REPORTS.map((sample) => (
            <div
              key={sample.id}
              onClick={() => onSampleSelect(sample)}
              className="group p-3.5 bg-white rounded-xl border border-slate-200 hover:border-sky-400 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${sample.badgeColor}`}
                  >
                    {sample.badge}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {sample.pageCount} pages
                  </span>
                </div>

                <h5 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                  {sample.title}
                </h5>
                <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {sample.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-sky-700 font-semibold">
                <span>{sample.modality}</span>
                <span className="group-hover:translate-x-1 transition-transform">
                  Load Case →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Paste Text Modal */}
      {showPasteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200">
            <h4 className="text-base font-bold text-slate-900 mb-2">
              Paste Radiology Report Text
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Paste findings, impressions, and technique text from any radiology report.
            </p>

            <textarea
              rows={10}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste raw radiology report here..."
              className="w-full p-3 font-mono text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
            />

            <div className="mt-4 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowPasteModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (pastedText.trim().length > 20) {
                    setShowPasteModal(false);
                    onTextSubmit(pastedText, "Pasted_Report.txt");
                  } else {
                    alert("Please provide at least 20 characters of report text.");
                  }
                }}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-sky-600 hover:bg-sky-700 text-white shadow-xs cursor-pointer"
              >
                Analyze Pasted Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
