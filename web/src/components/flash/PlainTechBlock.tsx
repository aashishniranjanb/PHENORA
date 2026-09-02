"use client";

import React, { useState } from "react";
import StatusBadge, { ValidationStatus } from "@/components/simulation/StatusBadge";
import { ChevronDown } from "lucide-react";

interface PlainTechBlockProps {
  id?: string;
  title: string;
  plainSummary: string;
  bullets?: string[];
  status?: ValidationStatus;
  statusText?: string;
  techTitle?: string;
  children: React.ReactNode;
  technicalDetails?: React.ReactNode;
  className?: string;
}

export default function PlainTechBlock({
  id,
  title,
  plainSummary,
  bullets = [],
  status = "VERIFIED",
  statusText,
  techTitle = "Technical Detail & Physical Derivation",
  children,
  technicalDetails,
  className = ""
}: PlainTechBlockProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section
      id={id}
      className={`bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm transition-all duration-300 ${className}`}
    >
      {/* Header with Title and Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-[#059669] font-black tracking-widest uppercase">
            PHENORA FLASH
          </span>
          <span className="text-slate-300">|</span>
          <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">
            {title}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {statusText && (
            <span className="text-[9px] font-mono text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded">
              {statusText}
            </span>
          )}
          <StatusBadge status={status} />
        </div>
      </div>

      {/* Layer 1: Plain Language Primary Layer (Always Visible) */}
      <div className="space-y-3 mb-6">
        <p className="text-sm md:text-base text-slate-700 font-medium leading-relaxed">
          {plainSummary}
        </p>

        {bullets.length > 0 && (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-slate-600 font-medium">
            {bullets.map((b, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#059669] font-bold text-sm leading-none mt-0.5">•</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Main Visual / Interactive Content */}
      <div className="mb-6">{children}</div>

      {/* Layer 2: Expandable Technical Layer */}
      {technicalDetails && (
        <div className="border-t border-slate-200/80 pt-4 mt-6">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#059669]" />
              <span className="font-mono text-[11px] tracking-wide uppercase text-slate-700 group-hover:text-slate-900">
                {techTitle}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
              <span>{isOpen ? "COLLAPSE" : "EXPAND SPEC"}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-300 ${
                  isOpen ? "rotate-180 text-[#059669]" : ""
                }`}
              />
            </div>
          </button>

          <div
            className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isOpen ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="bg-slate-900 text-slate-200 p-5 rounded-xl border border-slate-800 text-xs leading-relaxed font-mono shadow-inner space-y-3">
                {technicalDetails}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
