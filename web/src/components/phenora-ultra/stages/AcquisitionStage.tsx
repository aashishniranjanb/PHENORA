"use client";

import React, { useState } from "react";
import { PhenoraFlashResult } from "@/phenora/types";

interface AcquisitionStageProps {
  result: PhenoraFlashResult | null;
  isRunning: boolean;
}

export default function AcquisitionStage({
  result,
  isRunning,
}: AcquisitionStageProps) {
  const [signalView, setSignalView] = useState<"RAW" | "FILTERED" | "RMS" | "DELTA">("RAW");
  const [showEngDrawer, setShowEngDrawer] = useState(false);

  const acq = result?.acquisition;
  const quality = acq?.signalQuality ?? 96;

  return (
    <div className="p-6 max-w-5xl mx-auto font-mono space-y-6">
      {/* Header card */}
      <div className="bg-[#0B1528] border border-slate-800 rounded-xl p-5 flex justify-between items-center">
        <div>
          <h2 className="text-base font-bold text-white mb-1">STAGE 2 — ACQUISITION</h2>
          <p className="text-xs text-slate-400">Collecting multi-frequency bioimpedance measurements</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`text-xs px-3 py-1 rounded font-bold ${
            isRunning ? "bg-cyan-950 text-cyan-300 border border-cyan-500 animate-pulse" : "bg-emerald-950 text-emerald-300 border border-emerald-700"
          }`}>
            {isRunning ? "ACQUISITION ACTIVE" : "ACQUISITION COMPLETE"}
          </span>
        </div>
      </div>

      {/* Live Signal Chart Area */}
      <div className="bg-[#0B1528] border border-slate-800 rounded-xl p-5">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs text-slate-300 font-bold">TIME-DOMAIN SIGNAL STREAM</span>
          <div className="flex space-x-1 bg-slate-900 p-1 rounded border border-slate-800 text-[10px]">
            {(["RAW", "FILTERED", "RMS", "DELTA"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setSignalView(mode)}
                className={`px-2.5 py-0.5 rounded ${
                  signalView === mode ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Mock Signal Waveform Display */}
        <div className="h-44 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center relative overflow-hidden p-4">
          <svg className="w-full h-full stroke-cyan-400 fill-none" viewBox="0 0 500 100" preserveAspectRatio="none">
            <path
              d="M 0 50 Q 25 20 50 50 T 100 50 T 150 50 T 200 50 T 250 50 T 300 50 T 350 50 T 400 50 T 450 50 T 500 50"
              strokeWidth="2"
              className="opacity-40"
            />
            <path
              d="M 0 50 Q 12.5 10 25 50 T 50 50 T 75 50 T 100 50 T 125 50 T 150 50 T 175 50 T 200 50 T 225 50 T 250 50 T 275 50 T 300 50 T 325 50 T 350 50 T 375 50 T 400 50 T 425 50 T 450 50 T 475 50 T 500 50"
              strokeWidth="1.5"
              className="animate-pulse"
            />
          </svg>
          <div className="absolute top-2 right-3 text-[10px] text-cyan-400 bg-slate-900/90 border border-slate-700 px-2 py-0.5 rounded">
            MODE: {signalView} | 860 SPS | 16-BIT
          </div>
        </div>
      </div>

      {/* Mini Processing Pipeline Indicator */}
      <div className="bg-[#0B1528] border border-slate-800 rounded-xl p-5">
        <h3 className="text-xs font-bold text-slate-300 mb-3">PROCESSING PIPELINE INDICATOR</h3>
        <div className="grid grid-cols-6 gap-2 text-[10px] text-center">
          {[
            { label: "RAW ADC", status: "✓ COMPLETE" },
            { label: "NORMALIZATION", status: "✓ COMPLETE" },
            { label: "FILTER", status: "✓ COMPLETE" },
            { label: "RMS", status: "✓ COMPLETE" },
            { label: "FEATURE EXTRACT", status: "✓ COMPLETE" },
            { label: "QUALITY SCORE", status: `✓ ${quality}/100` },
          ].map((step, idx) => (
            <div key={idx} className="bg-slate-900/90 border border-emerald-500/40 p-2.5 rounded text-emerald-300">
              <div className="font-bold mb-1">{step.label}</div>
              <div className="text-[9px] text-emerald-400">{step.status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Engineering Drawer */}
      <div className="bg-[#0B1528] border border-slate-800 rounded-xl p-4">
        <button
          onClick={() => setShowEngDrawer(!showEngDrawer)}
          className="text-xs font-bold text-slate-400 hover:text-cyan-300 flex items-center justify-between w-full"
        >
          <span>ENGINEERING DETAILS {showEngDrawer ? "▲" : "▼"}</span>
          <span className="text-[10px] text-slate-500">ADS1115 / HELTEC-01 / VSDSQUADRON FPGA</span>
        </button>

        {showEngDrawer && (
          <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-800 text-[11px] text-slate-300">
            <div>
              <span className="text-slate-500 block">ADC MODEL</span>
              <span className="font-bold text-cyan-300">ADS1115 (16-bit)</span>
            </div>
            <div>
              <span className="text-slate-500 block">SAMPLE RATE</span>
              <span className="font-bold text-cyan-300">860 SPS</span>
            </div>
            <div>
              <span className="text-slate-500 block">MCU INTERFACE</span>
              <span className="font-bold text-cyan-300">HELTEC ESP32-S3</span>
            </div>
            <div>
              <span className="text-slate-500 block">FPGA STATE</span>
              <span className="font-bold text-emerald-400">CALCULATE_SLOPE</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
