"use client";

import React, { useState } from "react";
import { FindingItem } from "@/lib/report-schema";
import { ExternalLink, Filter, Search } from "lucide-react";

interface FindingsListProps {
  findings: FindingItem[];
  onSelectEvidence?: (evidence: string) => void;
}

export function FindingsList({ findings, onSelectEvidence }: FindingsListProps) {
  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = findings.filter((item) => {
    const matchesSearch =
      item.finding.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.anatomy.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.evidence.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ? true : item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs mb-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            Key Anatomical Findings
          </h3>
          <p className="text-xs text-slate-500">
            Structured statements categorized by organ system with auditable citations
          </p>
        </div>

        {/* Filter / Search Bar */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search findings..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 w-36 sm:w-44 text-slate-900"
            />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter findings by status"
              className="py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="positive">Positive</option>
              <option value="negative">Negative</option>
              <option value="uncertain">Uncertain</option>
            </select>
          </div>
        </div>
      </div>

      {/* Findings Table / Card Rows */}
      {filtered.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-200">
          No findings match the current search criteria.
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {filtered.map((item, index) => {
            const isCritical = item.urgency === "critical";
            const isUrgent = item.urgency === "urgent";

            return (
              <div
                key={index}
                className="py-3 px-2 sm:px-3 hover:bg-slate-50/80 rounded-lg transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-3 group"
              >
                {/* Left: Anatomy and Finding details */}
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    {/* Anatomy Badge */}
                    <span className="px-2 py-0.5 text-[11px] font-semibold bg-slate-100 text-slate-700 rounded-md">
                      {item.anatomy}
                    </span>

                    {/* Status Badge */}
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md ${
                        item.status === "positive"
                          ? "bg-sky-50 text-sky-700 border border-sky-100"
                          : item.status === "negative"
                          ? "bg-slate-100 text-slate-600"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {item.status}
                    </span>

                    {/* Severity Badge */}
                    {item.severity !== "unspecified" && (
                      <span
                        className={`px-2 py-0.5 text-[10px] font-medium rounded-md ${
                          item.severity === "severe"
                            ? "bg-red-50 text-red-700 font-semibold"
                            : item.severity === "moderate"
                            ? "bg-amber-50 text-amber-700"
                            : item.severity === "mild"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {item.severity}
                      </span>
                    )}

                    {/* Urgency tag if high priority */}
                    {isCritical && (
                      <span className="px-1.5 py-0.2 text-[10px] font-bold bg-red-600 text-white rounded">
                        CRITICAL
                      </span>
                    )}
                    {isUrgent && (
                      <span className="px-1.5 py-0.2 text-[10px] font-bold bg-amber-600 text-white rounded">
                        URGENT
                      </span>
                    )}
                  </div>

                  {/* Finding Statement */}
                  <p className="text-xs sm:text-sm font-medium text-slate-900 leading-snug">
                    {item.finding}
                  </p>

                  {/* Evidence Snippet preview */}
                  {item.evidence && (
                    <p className="mt-1 text-xs text-slate-500 italic line-clamp-1 group-hover:text-slate-700 transition-colors">
                      &ldquo;{item.evidence}&rdquo;
                    </p>
                  )}
                </div>

                {/* Right: Evidence Link Button */}
                {item.evidence && (
                  <button
                    onClick={() => onSelectEvidence?.(item.evidence)}
                    className="shrink-0 self-start sm:self-center flex items-center space-x-1 px-2.5 py-1.5 text-xs text-sky-700 bg-sky-50 hover:bg-sky-100 active:bg-sky-200 rounded-md transition-colors cursor-pointer border border-sky-100"
                    title="Highlight source sentence in Original Report"
                  >
                    <span>Source evidence</span>
                    <ExternalLink className="w-3 h-3 text-sky-600" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
