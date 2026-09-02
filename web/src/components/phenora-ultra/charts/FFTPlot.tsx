"use client";

import React from "react";
import { FFTAnalysisData } from "@/phenora/types";

interface FFTPlotProps {
  data: FFTAnalysisData | undefined;
}

export default function FFTPlot({ data }: FFTPlotProps) {
  return (
    <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 font-mono text-xs space-y-4">
      <div className="flex justify-between text-slate-600 text-[11px]">
        <span>EXCITATION & HARMONIC FFT ANALYSIS</span>
        <span className="text-emerald-600 font-bold">INTEGRITY: GOOD</span>
      </div>

      <div className="h-44 border-b border-l border-slate-200 flex items-end justify-around p-2">
        <div className="flex flex-col items-center">
          <div className="w-8 bg-emerald-400 h-32 rounded-t"></div>
          <span className="text-[10px] text-slate-600 mt-1">10 kHz (Fund)</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-8 bg-slate-200 h-12 rounded-t"></div>
          <span className="text-[10px] text-slate-600 mt-1">20 kHz (2nd)</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-8 bg-slate-100 h-6 rounded-t"></div>
          <span className="text-[10px] text-slate-600 mt-1">30 kHz (3rd)</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-200 text-[11px]">
        <div>
          <span className="text-slate-500 block">FUNDAMENTAL</span>
          <span className="font-bold text-emerald-700">10.0 kHz</span>
        </div>
        <div>
          <span className="text-slate-500 block">2ND HARMONIC</span>
          <span className="font-bold text-slate-700">-34 dB</span>
        </div>
        <div>
          <span className="text-slate-500 block">3RD HARMONIC</span>
          <span className="font-bold text-slate-700">-49 dB</span>
        </div>
      </div>
    </div>
  );
}
