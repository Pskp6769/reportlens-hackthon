"use client";

import React, { useState } from "react";
import { Copy, Check, Download, Code } from "lucide-react";
import { ReportAnalysis } from "@/lib/report-schema";

interface JsonViewerProps {
  analysis: ReportAnalysis;
}

export function JsonViewer({ analysis }: JsonViewerProps) {
  const [copied, setCopied] = useState(false);
  const formattedJson = JSON.stringify(analysis, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([formattedJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ReportLens_Analysis_${analysis.patient?.id || "Export"}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-4">
        <div className="flex items-center space-x-2">
          <Code className="w-4 h-4 text-sky-600" />
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Structured JSON Schema Output
            </h3>
            <p className="text-xs text-slate-500">
              Strictly validated Zod data model ready for EHR / FHIR integration
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy JSON</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download JSON</span>
          </button>
        </div>
      </div>

      {/* Code syntax viewer */}
      <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto max-h-[650px] shadow-inner selection:bg-sky-500 selection:text-white">
        <pre>{formattedJson}</pre>
      </div>
    </div>
  );
}
