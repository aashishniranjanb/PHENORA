"use client";

import React from "react";
import { PhenoraFlashResult } from "@/phenora/types";

interface IntelligencePanelProps {
  result: PhenoraFlashResult | null;
  onRunNextCycle: () => void;
  isRunning: boolean;
}

export default function IntelligencePanel({
  result,
  onRunNextCycle,
  isRunning,
}: IntelligencePanelProps) {
  const quality = result?.spectrum?.overallQuality ?? 0;
  const confidence = result?.diseaseIntelligence?.primary?.confidence ?? 0;
  const uncertainty = result?.diseaseIntelligence?.primary?.uncertainty ?? 0;
  const ood = result?.diseaseIntelligence?.primary?.oodScore ?? 0;
  const decision = result?.autonomousDecision?.decision ?? "WAITING";
  const trajectory = result?.phenotype?.temporal.find((f) => f.name === "temporalTrend")?.value || "STABLE";

  return (
    <aside className="w-72 bg-slate-50 border-l border-slate-200 p-4 flex flex-col justify-between shrink-0 font-mono text-xs overflow-y-auto">
      <div>
        <h3 className="text-slate-700 font-bold tracking-wider mb-4 border-b border-slate-200 pb-2 flex items-center justify-between">
          <span>PHENORA INTELLIGENCE</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
        </h3>

        {/* Quality Metric */}
        <div className="mb-4">
          <div className="flex justify-between text-slate-600 text-[11px] mb-1">
            <span>QUALITY</span>
            <span className="text-emerald-600 font-bold">{quality}/100</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded overflow-hidden">
            <div
              className="bg-emerald-400 h-full transition-all duration-500"
              style={{ width: `${quality}%` }}
            />
          </div>
        </div>

        {/* Confidence Metric */}
        <div className="mb-4">
          <div className="flex justify-between text-slate-600 text-[11px] mb-1">
            <span>CONFIDENCE</span>
            <span className="text-emerald-600 font-bold">{confidence}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded overflow-hidden">
            <div
              className="bg-emerald-400 h-full transition-all duration-500"
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>

        {/* Uncertainty */}
        <div className="mb-4 bg-white/80 p-2.5 rounded border border-slate-200 flex justify-between items-center">
          <span className="text-slate-600">UNCERTAINTY</span>
          <span className="text-amber-400 font-bold">{uncertainty}%</span>
        </div>

        {/* OOD Score */}
        <div className="mb-4 bg-white/80 p-2.5 rounded border border-slate-200 flex justify-between items-center">
          <span className="text-slate-600">OOD SCORE</span>
          <span className={`font-bold ${ood > 30 ? "text-red-400" : "text-emerald-600"}`}>
            {ood > 30 ? `HIGH (${ood})` : `LOW (${ood})`}
          </span>
        </div>

        {/* Current State */}
        <div className="mb-4 bg-white/80 p-2.5 rounded border border-slate-200 flex justify-between items-center">
          <span className="text-slate-600">TRAJECTORY</span>
          <span className="text-emerald-700 font-bold uppercase">{String(trajectory)}</span>
        </div>

        {/* Next Action */}
        <div className="mb-4 bg-white/90 p-3 rounded-lg border border-emerald-500/30">
          <div className="text-[10px] text-slate-600 mb-1">RECOMMENDED ACTION</div>
          <div className="text-sm font-bold text-emerald-600 tracking-wide uppercase">
            {decision}
          </div>
          {result?.autonomousDecision?.reason && (
            <p className="text-[10px] text-slate-600 mt-1 leading-relaxed">
              {result.autonomousDecision.reason}
            </p>
          )}
        </div>
      </div>

      {/* Cycle Control */}
      {decision === "MEASURE_AGAIN" && (
        <button
          onClick={onRunNextCycle}
          disabled={isRunning}
          className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded shadow-lg shadow-amber-500/20 transition-all font-mono text-xs"
        >
          {isRunning ? "MEASURING..." : "🔁 EXECUTE MEASURE AGAIN"}
        </button>
      )}
    </aside>
  );
}
