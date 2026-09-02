"use client";

import React from "react";
import { TemporalImpedanceData } from "@/phenora/types";

interface TemporalPlotProps {
  data: TemporalImpedanceData | undefined;
}

export default function TemporalPlot({ data }: TemporalPlotProps) {
  if (!data || data.impedance.length === 0) {
    return (
      <div className="h-64 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 font-mono text-xs">
        NO TEMPORAL IMPEDANCE HISTORY
      </div>
    );
  }

  const baseline = data.baseline;
  const current = data.impedance[data.impedance.length - 1];
  const delta = current - baseline;
  const relChange = baseline !== 0 ? ((delta / baseline) * 100).toFixed(1) : "0";

  return (
    <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 font-mono text-xs space-y-4">
      <div className="flex justify-between text-slate-600 text-[11px]">
        <span>TEMPORAL IMPEDANCE TRAJECTORY |Z(t)| AT 10 kHz</span>
        <span className="text-emerald-600 font-bold">BASELINE t=0</span>
      </div>

      <div className="h-48 border-b border-l border-slate-200 relative flex items-end p-2 space-x-2">
        {data.impedance.map((z, i) => {
          const heightPct = Math.min(100, Math.max(15, (z / 250) * 100));
          return (
            <div key={i} className="flex-1 flex flex-col items-center group relative">
              <div
                className="w-full bg-emerald-400 hover:bg-emerald-300 rounded-t transition-all"
                style={{ height: `${heightPct}%` }}
              />
              <div className="absolute bottom-full mb-1 hidden group-hover:block bg-white text-emerald-200 border border-slate-300 p-1.5 rounded text-[9px] z-10 whitespace-nowrap shadow-xl">
                Cycle {i + 1}: {z.toFixed(1)} Ω
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-4 pt-3 border-t border-slate-200 text-[11px]">
        <div>
          <span className="text-slate-500 block">BASELINE |Z|</span>
          <span className="font-bold text-slate-800">{baseline.toFixed(1)} Ω</span>
        </div>
        <div>
          <span className="text-slate-500 block">CURRENT |Z|</span>
          <span className="font-bold text-emerald-700">{current.toFixed(1)} Ω</span>
        </div>
        <div>
          <span className="text-slate-500 block">RELATIVE ΔZ</span>
          <span className={`font-bold ${delta < 0 ? "text-amber-400" : "text-emerald-600"}`}>
            {delta > 0 ? `+${delta.toFixed(1)}` : delta.toFixed(1)} Ω ({relChange}%)
          </span>
        </div>
      </div>
    </div>
  );
}
