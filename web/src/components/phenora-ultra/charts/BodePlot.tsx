"use client";

import React from "react";
import { BodeData } from "@/phenora/types";

interface BodePlotProps {
  data: BodeData | undefined;
}

export default function BodePlot({ data }: BodePlotProps) {
  if (!data || data.frequencies.length === 0) {
    return (
      <div className="h-64 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center text-slate-500 font-mono text-xs">
        NO BODE SPECTRUM DATA AVAILABLE
      </div>
    );
  }

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Magnitude Plot */}
      <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
        <div className="flex justify-between text-slate-400 text-[11px] mb-2">
          <span>LOG MAGNITUDE |Z| (Ω) vs LOG FREQUENCY (Hz)</span>
          <span className="text-cyan-400 font-bold">1 Hz – 1 MHz</span>
        </div>
        <div className="h-36 flex items-end justify-between space-x-1 pt-4 pb-1 px-2 border-b border-l border-slate-800">
          {data.magnitudes.map((mag, i) => {
            const heightPct = Math.min(100, Math.max(10, (mag / 300) * 100));
            return (
              <div key={i} className="flex-1 flex flex-col items-center group relative">
                <div
                  className="w-full bg-cyan-400 hover:bg-cyan-300 rounded-t transition-all"
                  style={{ height: `${heightPct}%` }}
                />
                {/* Tooltip on hover */}
                <div className="absolute bottom-full mb-1 hidden group-hover:block bg-slate-900 text-cyan-200 border border-slate-700 p-1.5 rounded text-[9px] z-10 whitespace-nowrap shadow-xl">
                  f: {data.frequencies[i]} Hz<br />|Z|: {mag.toFixed(1)} Ω
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Phase Plot */}
      <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
        <div className="flex justify-between text-slate-400 text-[11px] mb-2">
          <span>PHASE θ (degrees) vs LOG FREQUENCY (Hz)</span>
          <span className="text-emerald-400 font-bold">RANGE -90° to 0°</span>
        </div>
        <div className="h-28 flex items-center justify-between space-x-1 pt-2 pb-1 px-2 border-b border-l border-slate-800">
          {data.phases.map((ph, i) => {
            const absPh = Math.abs(ph);
            const heightPct = Math.min(100, Math.max(10, (absPh / 90) * 100));
            return (
              <div key={i} className="flex-1 flex flex-col items-center group relative">
                <div
                  className="w-full bg-emerald-400 hover:bg-emerald-300 rounded-t transition-all"
                  style={{ height: `${heightPct}%` }}
                />
                <div className="absolute bottom-full mb-1 hidden group-hover:block bg-slate-900 text-emerald-200 border border-slate-700 p-1.5 rounded text-[9px] z-10 whitespace-nowrap shadow-xl">
                  f: {data.frequencies[i]} Hz<br />Phase: {ph.toFixed(1)}°
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
