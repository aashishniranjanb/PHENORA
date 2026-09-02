"use client";

import React, { useState } from "react";
import { BodeData } from "@/phenora/types";

interface BodePlotProps {
  data: BodeData | undefined;
}

export default function BodePlot({ data }: BodePlotProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.frequencies.length === 0) {
    return (
      <div className="h-64 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center text-slate-500 font-mono text-xs">
        NO BODE SPECTRUM DATA AVAILABLE
      </div>
    );
  }

  const hoveredFreq = hoveredIndex !== null ? data.frequencies[hoveredIndex] : null;
  const hoveredMag = hoveredIndex !== null ? data.magnitudes[hoveredIndex] : null;
  const hoveredPhase = hoveredIndex !== null ? data.phases[hoveredIndex] : null;

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Interactive Cursor Readout Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg flex justify-between items-center text-[11px]">
        <div>
          CURSOR FREQUENCY: <span className="text-cyan-400 font-bold">{hoveredFreq ? `${hoveredFreq} Hz` : "HOVER POINT"}</span>
        </div>
        <div>
          MAGNITUDE |Z|: <span className="text-cyan-400 font-bold">{hoveredMag !== null ? `${hoveredMag.toFixed(1)} Ω` : "--"}</span>
        </div>
        <div>
          PHASE θ: <span className="text-emerald-400 font-bold">{hoveredPhase !== null ? `${hoveredPhase.toFixed(1)}°` : "--"}</span>
        </div>
        <div>
          PROVENANCE: <span className="text-slate-400 font-bold">{data.status}</span>
        </div>
      </div>

      {/* Magnitude Plot */}
      <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
        <div className="flex justify-between text-slate-400 text-[11px] mb-2">
          <span>LOG MAGNITUDE |Z| (Ω) vs LOG FREQUENCY (10 Hz – 1 MHz)</span>
          <span className="text-cyan-400 font-bold">MEASURED DISPERSION</span>
        </div>
        <div className="h-36 flex items-end justify-between space-x-1 pt-4 pb-1 px-2 border-b border-l border-slate-800">
          {data.magnitudes.map((mag, i) => {
            const heightPct = Math.min(100, Math.max(10, (mag / 300) * 100));
            const isHovered = hoveredIndex === i;
            return (
              <div
                key={i}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="flex-1 flex flex-col items-center group relative cursor-pointer"
              >
                <div
                  className={`w-full rounded-t transition-all ${
                    isHovered ? "bg-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.8)]" : "bg-cyan-400 hover:bg-cyan-300"
                  }`}
                  style={{ height: `${heightPct}%` }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Phase Plot */}
      <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
        <div className="flex justify-between text-slate-400 text-[11px] mb-2">
          <span>PHASE θ (degrees) vs LOG FREQUENCY</span>
          <span className="text-emerald-400 font-bold">COLE-COLE DISPERSION PHASE</span>
        </div>
        <div className="h-28 flex items-center justify-between space-x-1 pt-2 pb-1 px-2 border-b border-l border-slate-800">
          {data.phases.map((ph, i) => {
            const absPh = Math.abs(ph);
            const heightPct = Math.min(100, Math.max(10, (absPh / 90) * 100));
            const isHovered = hoveredIndex === i;
            return (
              <div
                key={i}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="flex-1 flex flex-col items-center group relative cursor-pointer"
              >
                <div
                  className={`w-full rounded-t transition-all ${
                    isHovered ? "bg-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.8)]" : "bg-emerald-400 hover:bg-emerald-300"
                  }`}
                  style={{ height: `${heightPct}%` }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
