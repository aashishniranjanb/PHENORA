"use client";

import React from "react";
import { NyquistData } from "@/phenora/types";

interface NyquistPlotProps {
  data: NyquistData | undefined;
}

export default function NyquistPlot({ data }: NyquistPlotProps) {
  if (!data || data.zReal.length === 0) {
    return (
      <div className="h-64 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center text-slate-500 font-mono text-xs">
        NO NYQUIST DATA AVAILABLE
      </div>
    );
  }

  return (
    <div className="bg-slate-950 p-5 rounded-lg border border-slate-800 font-mono text-xs">
      <div className="flex justify-between text-slate-400 text-[11px] mb-3">
        <span>NYQUIST DIAGRAM: -Im(Z) vs Re(Z)</span>
        <span className="text-cyan-400 font-bold">Arc Quality: {data.curveQuality}/100</span>
      </div>

      <div className="h-60 border-b border-l border-slate-800 relative flex items-end p-4">
        <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
          {/* Semi-circle arc simulation */}
          <path
            d="M 20 180 Q 200 20 380 180"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="2"
            strokeDasharray="4,4"
          />

          {data.zReal.map((r, i) => {
            const x = Math.min(380, Math.max(20, (r / 250) * 360));
            const img = data.zImagNeg[i] || 10;
            const y = 180 - Math.min(160, (img / 100) * 150);

            return (
              <g key={i} className="group">
                <circle cx={x} cy={y} r="4" className="fill-cyan-400 stroke-slate-900 group-hover:r-6 cursor-pointer transition-all" />
              </g>
            );
          })}
        </svg>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4 pt-3 border-t border-slate-800 text-[11px]">
        <div>
          <span className="text-slate-500 block">ESTIMATED ARC DIAMETER</span>
          <span className="font-bold text-cyan-300">142.5 Ω</span>
        </div>
        <div>
          <span className="text-slate-500 block">PEAK FREQUENCY</span>
          <span className="font-bold text-cyan-300">8.7 kHz</span>
        </div>
        <div>
          <span className="text-slate-500 block">SOLUTION RESISTANCE (Rs)</span>
          <span className="font-bold text-emerald-400">42.1 Ω</span>
        </div>
      </div>
    </div>
  );
}
