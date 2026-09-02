"use client";

import React from "react";
import { TemporalImpedanceData } from "@/phenora/types";

interface TemporalPlotProps {
  data: TemporalImpedanceData | undefined;
}

export default function TemporalPlot({ data }: TemporalPlotProps) {
  if (!data || data.impedance.length === 0) {
    return (
      <div className="h-64 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center text-slate-500 font-mono text-xs">
        NO TEMPORAL IMPEDANCE HISTORY
      </div>
    );
  }

  const baseline = data.baseline;
  const current = data.impedance[data.impedance.length - 1];
  const delta = current - baseline;
  const relChange = baseline !== 0 ? ((delta / baseline) * 100).toFixed(1) : "0";

  return (
    <div className="bg-slate-950 p-5 rounded-lg border border-slate-800 font-mono text-xs space-y-4">
      <div className="flex justify-between text-slate-400 text-[11px]">
        <span>TEMPORAL IMPEDANCE TRAJECTORY |Z(t)| AT 10 kHz</span>
        <span className="text-cyan-400 font-bold">BASELINE t=0</span>
      </div>

      <div className="h-48 border-b border-l border-slate-800 relative flex items-end p-2 space-x-2">
        {data.impedance.map((z, i) => {
          const heightPct = Math.min(100, Math.max(15, (z / 250) * 100));
          return (
            <div key={i} className="flex-1 flex flex-col items-center group relative">
              <div
                className="w-full bg-cyan-400 hover:bg-cyan-300 rounded-t transition-all"
                style={{ height: `${heightPct}%` }}
              />
              <div className="absolute bottom-full mb-1 hidden group-hover:block bg-slate-900 text-cyan-200 border border-slate-700 p-1.5 rounded text-[9px] z-10 whitespace-nowrap shadow-xl">
                Cycle {i + 1}: {z.toFixed(1)} Ω
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-4 pt-3 border-t border-slate-800 text-[11px]">
        <div>
          <span className="text-slate-500 block">BASELINE |Z|</span>
          <span className="font-bold text-slate-200">{baseline.toFixed(1)} Ω</span>
        </div>
        <div>
          <span className="text-slate-500 block">CURRENT |Z|</span>
          <span className="font-bold text-cyan-300">{current.toFixed(1)} Ω</span>
        </div>
        <div>
          <span className="text-slate-500 block">RELATIVE ΔZ</span>
          <span className={`font-bold ${delta < 0 ? "text-amber-400" : "text-emerald-400"}`}>
            {delta > 0 ? `+${delta.toFixed(1)}` : delta.toFixed(1)} Ω ({relChange}%)
          </span>
        </div>
      </div>
    </div>
  );
}
