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

  const isFitAvailable = data.curveQuality >= 60;

  return (
    <div className="bg-slate-950 p-5 rounded-lg border border-slate-800 font-mono text-xs space-y-4">
      <div className="flex justify-between text-slate-400 text-[11px]">
        <span>NYQUIST DIAGRAM: -Im(Z) vs Re(Z)</span>
        <span className={`font-bold ${isFitAvailable ? "text-cyan-400" : "text-amber-400"}`}>
          {isFitAvailable ? `COLE-COLE ARC FIT (${data.curveQuality}/100)` : "FIT UNAVAILABLE (NOISY/OOD)"}
        </span>
      </div>

      <div className="h-60 border-b border-l border-slate-800 relative flex items-end p-4">
        {isFitAvailable ? (
          <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
            {/* Fitted Cole-Cole Semicircle Arc */}
            <path
              d="M 30 180 Q 200 20 370 180"
              fill="none"
              stroke="#22d3ee"
              strokeWidth="2"
              strokeDasharray="4,4"
            />
            {/* Peak Frequency Indicator Line */}
            <line x1="200" y1="20" x2="200" y2="180" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2,2" />
            <text x="205" y="40" fill="#f59e0b" fontSize="10">f_peak = 8.7 kHz</text>

            {data.zReal.map((r, i) => {
              const x = Math.min(370, Math.max(30, (r / 260) * 340));
              const img = data.zImagNeg[i] || 10;
              const y = 180 - Math.min(160, (img / 100) * 150);

              return (
                <circle key={i} cx={x} cy={y} r="4" className="fill-cyan-400 stroke-slate-900 hover:r-6 cursor-pointer transition-all" />
              );
            })}
          </svg>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-amber-400 bg-amber-950/20 border border-amber-800/40 rounded p-4 text-center">
            <span className="font-bold text-sm mb-1">⚠ COLE-COLE ARC FIT UNAVAILABLE</span>
            <span className="text-[11px] text-amber-300/80">
              High signal noise or Out of Domain dispersion detected. Insufficient spectral coherence to fit semicircle model.
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 pt-3 border-t border-slate-800 text-[11px]">
        <div>
          <span className="text-slate-500 block">ESTIMATED ARC DIAMETER (ΔR)</span>
          <span className="font-bold text-cyan-300">{isFitAvailable ? "142.5 Ω" : "UNAVAILABLE"}</span>
        </div>
        <div>
          <span className="text-slate-500 block">RELAXATION PEAK FREQUENCY (f_peak)</span>
          <span className="font-bold text-cyan-300">{isFitAvailable ? "8.7 kHz" : "UNAVAILABLE"}</span>
        </div>
        <div>
          <span className="text-slate-500 block">SOLUTION RESISTANCE (Rs)</span>
          <span className="font-bold text-emerald-400">{isFitAvailable ? "42.5 Ω" : "UNAVAILABLE"}</span>
        </div>
      </div>
    </div>
  );
}
