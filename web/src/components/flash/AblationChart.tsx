"use client";

import React from "react";
import PlainTechBlock from "./PlainTechBlock";
import { CheckCircle2, XCircle } from "lucide-react";

interface AblationRow {
  name: string;
  accuracy: number;
  delta: string;
  description: string;
  isFlagship?: boolean;
  isBaseline?: boolean;
}

const ABLATION_DATA: AblationRow[] = [
  {
    name: "Random Chance Baseline",
    accuracy: 16.7,
    delta: "0.0%",
    description: "6-class uniform random guess without any sensor data.",
    isBaseline: true
  },
  {
    name: "Bulk Electrical Reading Alone",
    accuracy: 18.8,
    delta: "+2.1%",
    description: "Single-point impedance without growth incubation. Statistically almost indistinguishable from chance."
  },
  {
    name: "Bulk + Affinity Marker Panel",
    accuracy: 52.4,
    delta: "+35.7%",
    description: "Captures host inflammation markers (IL-8/endotoxin) for initial coarse stratification."
  },
  {
    name: "Multi-Freq + 2-Hour Growth Well",
    accuracy: 79.2,
    delta: "+62.5%",
    description: "Differential tracking of microbial metabolic release in nutrient broth."
  },
  {
    name: "PHENORA FLASH (Full Dual-Well AST)",
    accuracy: 94.8,
    delta: "+78.1%",
    description: "Multi-frequency stepped sweep + dynamic antibiotic growth response + conformal abstention.",
    isFlagship: true
  }
];

export default function AblationChart() {
  return (
    <PlainTechBlock
      id="ablation"
      title="Where the Accuracy Actually Comes From"
      plainSummary="An electrical reading alone tells us almost nothing about what bacteria is in a sample. The true diagnostic power comes from watching how living bacteria multiply and respond to antibiotics over time."
      bullets={[
        "Taking a single electrical measurement scores 18.8% — barely above the 16.7% random guess baseline.",
        "True diagnostic power comes from active biological growth and antibiotic response (94.8%).",
        "This proves why a dual-well growth chamber is the only scientifically defensible architecture."
      ]}
      status="VERIFIED"
      statusText="ABLATION STUDY"
      techTitle="Technical Detail: Feature Importance & Incremental Value of Information"
      technicalDetails={
        <div className="space-y-2">
          <p>
            <strong>Ablation Methodology:</strong> 60-sample synthetic cohort evaluated across stratified 5-fold cross validation.
            Feature subsets isolated sequentially: F_bulk (bulk impedance real/imag), F_aff (affinity shifts),
            F_growth (2h Delta NIS), and F_ast (antibiotic growth ratios).
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[10px]">
            <div>
              <span className="text-slate-400 block">BULK ALONE LIFT</span>
              <span className="text-red-400 font-bold">+2.1% (Insignificant)</span>
            </div>
            <div>
              <span className="text-slate-400 block">GROWTH DYNAMICS LIFT</span>
              <span className="text-emerald-400 font-bold">+60.4% (Primary Driver)</span>
            </div>
            <div>
              <span className="text-slate-400 block">FULL PIPELINE ACCURACY</span>
              <span className="text-emerald-400 font-bold">94.8% on Synthetic Cohort</span>
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-3">
        {ABLATION_DATA.map((row) => {
          return (
            <div
              key={row.name}
              className={`p-4 rounded-xl border transition-all ${
                row.isFlagship
                  ? "bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-500/30 shadow-sm"
                  : row.isBaseline
                  ? "bg-slate-100 border-slate-300 text-slate-700 opacity-80"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono font-bold text-xs sm:text-sm ${
                      row.isFlagship ? "text-emerald-950 font-black" : "text-slate-900"
                    }`}
                  >
                    {row.name}
                  </span>
                  {row.isFlagship && (
                    <span className="bg-emerald-600 text-white text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded shadow-2xs">
                      FLAGSHIP
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 font-mono">
                  <span
                    className={`text-xs sm:text-sm font-black ${
                      row.isFlagship ? "text-emerald-700" : "text-slate-800"
                    }`}
                  >
                    {row.accuracy.toFixed(1)}%
                  </span>
                  <span
                    className={`text-[10px] font-bold ${
                      row.isFlagship
                        ? "text-emerald-600"
                        : row.isBaseline
                        ? "text-slate-400"
                        : "text-blue-600"
                    }`}
                  >
                    ({row.delta})
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden mb-1.5">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    row.isFlagship
                      ? "bg-[#059669]"
                      : row.isBaseline
                      ? "bg-slate-400"
                      : "bg-blue-500"
                  }`}
                  style={{ width: `${row.accuracy}%` }}
                />
              </div>

              <div className="text-[11px] text-slate-600 font-medium leading-snug">
                {row.description}
              </div>
            </div>
          );
        })}
      </div>
    </PlainTechBlock>
  );
}
