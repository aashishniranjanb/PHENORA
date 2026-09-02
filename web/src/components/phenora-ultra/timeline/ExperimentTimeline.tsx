"use client";

import React from "react";
import { StageId, StageState, PhenoraRun } from "@/phenora/types";

interface TimelineProps {
  run: PhenoraRun | null;
  activeStage: StageId;
  onSelectStage: (stage: StageId) => void;
}

const STAGES: { id: StageId; label: string; sub: string }[] = [
  { id: "SAMPLE", label: "SAMPLE", sub: "Define Sample" },
  { id: "ACQUISITION", label: "ACQUISITION", sub: "Live Signal" },
  { id: "IMPEDANCE", label: "IMPEDANCE", sub: "Spectrum Z(f,t)" },
  { id: "PHENOTYPE", label: "PHENOTYPE", sub: "Feature Matrix" },
  { id: "DISEASE", label: "DISEASE", sub: "Intelligence Model" },
  { id: "TWIN", label: "DIGITAL TWIN", sub: "State Representation" },
  { id: "FORECAST", label: "FORECAST", sub: "Predictive Evolution" },
  { id: "AUTONOMY", label: "AUTONOMY", sub: "Decision Planner" },
  { id: "RESULT", label: "FINAL RESULT", sub: "Traceable Output" },
];

export default function ExperimentTimeline({
  run,
  activeStage,
  onSelectStage,
}: TimelineProps) {
  const getStageState = (stageId: StageId): StageState => {
    if (!run) {
      return stageId === "SAMPLE" ? "READY" : "LOCKED";
    }
    return run.stages[stageId] || "LOCKED";
  };

  return (
    <div className="bg-[#0B1528] border-b border-slate-800 px-4 py-2 shrink-0 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700">
      <div className="flex items-center space-x-2 min-w-max">
        {STAGES.map((st, idx) => {
          const state = getStageState(st.id);
          const isSelected = activeStage === st.id;

          let badgeColor = "bg-slate-800 text-slate-500 border-slate-700";
          let icon = "🔒";

          if (state === "COMPLETE") {
            badgeColor = "bg-emerald-950/70 text-emerald-300 border-emerald-600/60";
            icon = "✓";
          } else if (state === "ACTIVE" || state === "PROCESSING") {
            badgeColor = "bg-cyan-950 text-cyan-300 border-cyan-400 animate-pulse";
            icon = "◉";
          } else if (state === "READY") {
            badgeColor = "bg-slate-800 text-slate-200 border-slate-600";
            icon = "○";
          }

          if (isSelected) {
            badgeColor += " ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#0B1528]";
          }

          return (
            <React.Fragment key={st.id}>
              {idx > 0 && (
                <div
                  className={`h-0.5 w-6 ${
                    state === "COMPLETE" || isSelected ? "bg-cyan-500/60" : "bg-slate-800"
                  }`}
                />
              )}
              <button
                onClick={() => onSelectStage(st.id)}
                className={`flex flex-col items-start px-3 py-1.5 rounded-lg border text-left font-mono transition-all hover:border-cyan-400/80 ${badgeColor}`}
              >
                <div className="flex items-center space-x-1.5 font-bold text-[11px] tracking-wide">
                  <span>{icon}</span>
                  <span>{st.label}</span>
                </div>
                <span className="text-[9px] text-slate-400 mt-0.5">{st.sub}</span>
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
