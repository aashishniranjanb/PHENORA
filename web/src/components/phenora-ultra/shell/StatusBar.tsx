"use client";

import React from "react";
import { PhenoraRun, PhenoraFlashResult } from "@/phenora/types";

interface StatusBarProps {
  run: PhenoraRun | null;
  result: PhenoraFlashResult | null;
  isRunning: boolean;
}

export default function StatusBar({ run, result, isRunning }: StatusBarProps) {
  const quality = result?.spectrum?.overallQuality ?? "--";
  const confidence = result?.diseaseIntelligence?.primary?.confidence ?? "--";
  const uncertainty = result?.diseaseIntelligence?.primary?.uncertainty ?? "--";

  return (
    <footer className="h-9 bg-[#0B1528] border-t border-slate-800 px-4 flex items-center justify-between shrink-0 font-mono text-[11px] text-slate-400">
      {/* Device Connection Telemetry */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="text-slate-300">DEVICE: HELTEC-01</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="text-slate-300">ADC: STREAMING</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="text-slate-300">FPGA: READY</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          <span className="text-amber-300 font-bold">MODE: SIMULATION</span>
        </div>
      </div>

      {/* Primary Science Quality Telemetry */}
      <div className="flex items-center space-x-6">
        <div>
          QUALITY: <span className="text-cyan-400 font-bold">{quality}/100</span>
        </div>
        <div>
          CONFIDENCE: <span className="text-emerald-400 font-bold">{confidence}%</span>
        </div>
        <div>
          UNCERTAINTY: <span className="text-amber-400 font-bold">{uncertainty}%</span>
        </div>
        {run && (
          <div className="text-slate-500">
            PHASE: <span className="text-slate-300">{run.phase}</span>
          </div>
        )}
      </div>
    </footer>
  );
}
