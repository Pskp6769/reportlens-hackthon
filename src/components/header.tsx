"use client";

import React from "react";
import { Activity, ShieldCheck, Zap } from "lucide-react";

interface HeaderProps {
  onTriggerDemo: () => void;
  isAnalyzing: boolean;
}

export function Header({ onTriggerDemo, isAnalyzing }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand & Clinical Subtitle */}
        <div className="flex items-center space-x-3.5">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900 text-white shadow-sm ring-1 ring-slate-800">
            <Activity className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold tracking-tight text-slate-900">
                ReportLens
              </span>
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200 rounded-full">
                Clinical Decision Support
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              AI-assisted radiology report analysis & auditable findings extraction
            </p>
          </div>
        </div>

        {/* Right: Quick Judge Demo Button & Status Indicator */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Deterministic Negation & Safety Engine Active</span>
          </div>

          <button
            id="btn-header-demo"
            onClick={onTriggerDemo}
            disabled={isAnalyzing}
            className="flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-sm transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            title="Load sample PE case to showcase critical alert, evidence highlighting, and structured findings"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span>⚡ 30s Judge Demo</span>
          </button>
        </div>
      </div>
    </header>
  );
}
