"use client";

import React from "react";
import { SampleMetadata, SampleType } from "@/phenora/types";

interface SampleStageProps {
  sampleId: string;
  setSampleId: (id: string) => void;
  onVerify: () => void;
}

export default function SampleStage({
  sampleId,
  setSampleId,
  onVerify,
}: SampleStageProps) {
  return (
    <div className="p-6 max-w-3xl mx-auto font-mono">
      <div className="bg-[#0B1528] border border-slate-800 rounded-xl p-6 shadow-2xl">
        <h2 className="text-lg font-bold text-white mb-1 flex items-center justify-between border-b border-slate-800 pb-3">
          <span>STAGE 1 — SAMPLE DEFINITION</span>
          <span className="text-xs text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded border border-cyan-800">
            ENTRY POINT
          </span>
        </h2>

        <div className="space-y-4 my-6 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">SAMPLE ID</label>
            <input
              type="text"
              value={sampleId}
              onChange={(e) => setSampleId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-cyan-300 font-bold focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">SAMPLE TYPE</label>
              <select className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-400">
                <option value="URINE">URINE (UTI Screening)</option>
                <option value="BLOOD" disabled>BLOOD (Malaria - Unsupported)</option>
                <option value="CONTROL">CONTROL (Standard)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">PROTOCOL</label>
              <select className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-400">
                <option value="UTI-EIS-V1">UTI-EIS-V1 (Multi-freq)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">VOLUME (µL)</label>
              <input
                type="number"
                defaultValue={100}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">ENVIRONMENT TEMP (°C)</label>
              <input
                type="number"
                defaultValue={25}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* Validation summary */}
        <div className="bg-slate-900/90 border border-emerald-500/30 rounded-lg p-4 mb-6">
          <div className="text-emerald-400 font-bold text-xs mb-2">
            ✓ SAMPLE VALIDATION
          </div>
          <ul className="text-[11px] text-slate-300 space-y-1">
            <li>✓ Sample ID format valid</li>
            <li>✓ Sample type supported (UTI models active)</li>
            <li>✓ Volume within required protocol limits (100–500 µL)</li>
            <li>✓ Calibration CAL-0042 verified</li>
          </ul>
        </div>

        <button
          onClick={onVerify}
          className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded shadow-lg shadow-cyan-500/20 transition-all text-xs tracking-wider uppercase"
        >
          VERIFY & PROCEED TO ACQUISITION
        </button>
      </div>
    </div>
  );
}
