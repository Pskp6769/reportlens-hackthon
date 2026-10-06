"use client";

import React from "react";
import { User, Calendar, Stethoscope, Hash, Tag } from "lucide-react";
import { Patient, Exam } from "@/lib/report-schema";

interface MetadataCardProps {
  patient: Patient;
  exam: Exam;
}

export function MetadataCard({ patient, exam }: MetadataCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs mb-6">
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-3.5 pb-2 border-b border-slate-100">
        Patient & Study Metadata
      </h3>

      <div className="space-y-3 text-xs">
        {/* Patient Name / ID */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-1.5 text-slate-500">
            <User className="w-3.5 h-3.5" />
            <span>Patient:</span>
          </div>
          <span className="font-semibold text-slate-900 text-right">
            {patient.name || "Anonymous / Unspecified"}
          </span>
        </div>

        {/* Demographics */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-1.5 text-slate-500">
            <Hash className="w-3.5 h-3.5" />
            <span>Age / Sex / ID:</span>
          </div>
          <span className="font-medium text-slate-800 text-right">
            {[patient.age, patient.sex, patient.id ? `ID: ${patient.id}` : null]
              .filter(Boolean)
              .join(" • ") || "Not provided in report"}
          </span>
        </div>

        {/* Modality */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-1.5 text-slate-500">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Modality:</span>
          </div>
          <span className="font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100 text-right">
            {exam.modality || "General Imaging"}
          </span>
        </div>

        {/* Body Region */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-1.5 text-slate-500">
            <Tag className="w-3.5 h-3.5" />
            <span>Anatomical Region:</span>
          </div>
          <span className="font-medium text-slate-800 text-right">
            {exam.body_region || "Unspecified"}
          </span>
        </div>

        {/* Study Date */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-1.5 text-slate-500">
            <Calendar className="w-3.5 h-3.5" />
            <span>Study Date:</span>
          </div>
          <span className="font-mono text-slate-700 text-right">
            {exam.date || "Not recorded"}
          </span>
        </div>
      </div>
    </div>
  );
}
