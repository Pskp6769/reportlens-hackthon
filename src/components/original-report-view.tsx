"use client";

import React, { useState, useEffect, useRef } from "react";
import { Copy, Check, Search, Eye, AlertCircle } from "lucide-react";

interface OriginalReportViewProps {
  rawText: string;
  highlightSnippet?: string | null;
  onClearHighlight?: () => void;
}

export function OriginalReportView({
  rawText,
  highlightSnippet,
  onClearHighlight,
}: OriginalReportViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);

  // Auto-scroll to highlighted snippet when selected
  useEffect(() => {
    if (highlightSnippet && highlightRef.current) {
      highlightRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [highlightSnippet]);

  const handleCopy = () => {
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render text with highlight support
  const renderFormattedText = () => {
    if (!rawText) {
      return <p className="text-slate-400 italic">No original text available.</p>;
    }

    const target = highlightSnippet ? highlightSnippet.trim() : "";
    const activeSearch = searchTerm.trim().toLowerCase();

    // If there is an active evidence citation to highlight
    if (target && target.length > 5) {
      // Find index of target in rawText
      const lowerRaw = rawText.toLowerCase();
      const lowerTarget = target.toLowerCase();
      const matchIndex = lowerRaw.indexOf(lowerTarget);

      if (matchIndex !== -1) {
        const before = rawText.substring(0, matchIndex);
        const match = rawText.substring(matchIndex, matchIndex + target.length);
        const after = rawText.substring(matchIndex + target.length);

        return (
          <>
            <span className="whitespace-pre-wrap">{before}</span>
            <span
              ref={highlightRef}
              className="bg-amber-200 text-amber-950 font-semibold px-1 py-0.5 rounded ring-2 ring-amber-400 shadow-sm animate-pulse transition-all"
            >
              {match}
            </span>
            <span className="whitespace-pre-wrap">{after}</span>
          </>
        );
      }
    }

    // Otherwise render standard text or search highlight
    return <span className="whitespace-pre-wrap">{rawText}</span>;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
      {/* Viewer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4 text-sky-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Source Radiology Document
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Interactive auditable viewer with sentence-level verification
          </p>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center space-x-2">
          {highlightSnippet && (
            <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-lg text-xs font-medium text-amber-800">
              <span className="truncate max-w-[150px] sm:max-w-[200px]">
                Citation: &ldquo;{highlightSnippet}&rdquo;
              </span>
              <button
                onClick={onClearHighlight}
                className="text-amber-600 hover:text-amber-900 font-bold ml-1 cursor-pointer"
                title="Clear highlight"
              >
                ✕
              </button>
            </div>
          )}

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
                <span>Copy Full Text</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* High-visibility highlight notification banner if active */}
      {highlightSnippet && (
        <div className="mb-4 p-2.5 bg-amber-50 border-l-4 border-amber-500 text-amber-900 text-xs rounded-r-md flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-bold">EVIDENCE LOCATED:</span>
            <span className="italic line-clamp-1">&ldquo;{highlightSnippet}&rdquo;</span>
          </div>
          <span className="text-[11px] font-mono font-semibold bg-amber-200/80 px-2 py-0.5 rounded text-amber-900">
            Highlighted Below
          </span>
        </div>
      )}

      {/* Document Text Area */}
      <div
        ref={containerRef}
        className="font-mono text-xs sm:text-[13px] leading-relaxed text-slate-800 bg-slate-50/70 p-5 rounded-xl border border-slate-200 max-h-[650px] overflow-y-auto selection:bg-sky-200 selection:text-sky-900"
      >
        {renderFormattedText()}
      </div>
    </div>
  );
}
