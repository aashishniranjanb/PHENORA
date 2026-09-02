"use client";

import React from "react";
import type { SusceptibilityItem } from "@/types/flash";
import PlainTechBlock from "./PlainTechBlock";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";

export default function SusceptibilityPanel({ items, isMysteryMode }: { items: SusceptibilityItem[], isMysteryMode?: boolean }) {
  if (!items || items.length === 0) {
    return (
      <PlainTechBlock
        id="ast"
        title="Antibiotic Susceptibility Testing (AST)"
        plainSummary="No bacterial growth detected. Antibiotic susceptibility testing was not required for this sterile sample."
        bullets={[
          "Baseline electrical signal remained unchanged across all chambers.",
          "No antibiotic exposure required for patient."
        ]}
        status="VERIFIED"
        statusText="NO GROWTH"
      >
        <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center font-mono text-xs text-slate-500">
          Sterile Specimen · AST Panel Skipped
        </div>
      </PlainTechBlock>
    );
  }

  return (
    <PlainTechBlock
      id="ast"
      title="Which Antibiotic Will Work?"
      plainSummary="The sample was split across miniature wells containing different standard antibiotics. We measured whether the bacteria kept growing or were stopped."
      bullets={[
        "Wells where growth stops indicate antibiotics that are effective.",
        "Wells where growth continues indicate resistance.",
        "Borderline calls suggest alternative dosing or higher concentrations may be required."
      ]}
      status="VERIFIED"
      statusText="PHENOTYPIC AST"
      techTitle="Technical Detail: Differential Growth Ratios & Breakpoint Logic"
      technicalDetails={
        <div className="space-y-2">
          <p>
            <strong>Growth Ratio Derivation:</strong> For antibiotic channel k, the normalized growth ratio is
            R_k = (NIS_k(t_4) - NIS_k(t_0)) / (NIS_ctrl(t_4) - NIS_ctrl(t_0)).
            Classification follows calibrated EUCAST/CLSI equivalent boundaries: 
            R_k &lt; 0.35 = SUSCEPTIBLE, 
            0.35 &lt;= R_k &lt; 0.60 = INTERMEDIATE, 
            R_k &gt;= 0.60 = RESISTANT.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[10px]">
            <div>
              <span className="text-slate-400 block">PANEL DRUGS</span>
              <span className="text-white font-bold">3 First-line Agents</span>
            </div>
            <div>
              <span className="text-slate-400 block">METHODOLOGY</span>
              <span className="text-emerald-400 font-bold">Direct Phenotypic Growth</span>
            </div>
            <div>
              <span className="text-slate-400 block">TIME ACCELERATION</span>
              <span className="text-blue-400 font-bold">3 Hours vs 48 Hours Broth Dilution</span>
            </div>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item) => {
          const isS = item.call === "SUSCEPTIBLE";
          const isI = item.call === "INTERMEDIATE";
          const isR = item.call === "RESISTANT";

          return (
            <div
              key={item.drug}
              className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                isS
                  ? "bg-emerald-50/50 border-emerald-300 shadow-2xs"
                  : isI
                  ? "bg-amber-50/50 border-amber-300 shadow-2xs"
                  : "bg-red-50/50 border-red-300 shadow-2xs"
              }`}
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h4 className="font-mono font-bold text-sm text-slate-900">{isMysteryMode ? "Antibiotic ???" : item.drug}</h4>
                  <span
                    className={`inline-flex items-center gap-1 text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded border shrink-0 ${
                      isMysteryMode
                        ? "bg-slate-100 text-slate-500 border-slate-300"
                        : isS
                        ? "bg-emerald-100 text-emerald-800 border-emerald-400"
                        : isI
                        ? "bg-amber-100 text-amber-800 border-amber-400"
                        : "bg-red-100 text-red-800 border-red-400"
                    }`}
                  >
                    {!isMysteryMode && isS ? <CheckCircle className="w-3 h-3 shrink-0" /> : !isMysteryMode && isI ? <AlertCircle className="w-3 h-3 shrink-0" /> : <XCircle className="w-3 h-3 shrink-0 opacity-50" />}
                    <span>{isMysteryMode ? "HIDDEN" : item.call}</span>
                  </span>
                </div>

                <div className="text-xs text-slate-700 font-medium leading-relaxed mb-4">
                  {isMysteryMode ? "Data masked during diagnostic challenge." : item.plain}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/80">
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-1">
                  <span>GROWTH RATIO (R)</span>
                  <span className="font-bold text-slate-800">{item.ratio.toFixed(3)}</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isS ? "bg-emerald-500" : isI ? "bg-amber-500" : "bg-red-500"
                    }`}
                    style={{ width: `${Math.min(100, Math.max(5, item.ratio * 100))}%` }}
                  />
                </div>
                <div className="flex justify-between text-[8px] font-mono text-slate-400 mt-1">
                  <span>0.0 (Inhibited)</span>
                  <span>1.0 (Full Growth)</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </PlainTechBlock>
  );
}
