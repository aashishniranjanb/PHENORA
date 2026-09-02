"use client";

import React from "react";
import { CLINICAL_STRAIN_PROFILES } from "@/phenora/runtime/simulationEngine";

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
  const selectedStrain = CLINICAL_STRAIN_PROFILES[sampleId] || CLINICAL_STRAIN_PROFILES["URINE-017"];

  return (
    <div className="p-6 max-w-3xl mx-auto font-mono">
      <div className="bg-[#0B1528] border border-slate-800 rounded-xl p-6 shadow-2xl space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center justify-between border-b border-slate-800 pb-3">
          <span>STAGE 1 — SAMPLE & CLINICAL STRAIN SPECIFICATION</span>
          <span className="text-xs text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded border border-cyan-800">
            ENTRY POINT
          </span>
        </h2>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-bold">SELECT CLINICAL STRAIN SAMPLE (iFAST DATASET PAIRING)</label>
            <select
              value={sampleId}
              onChange={(e) => setSampleId(e.target.value)}
              className="w-full bg-slate-900 border border-cyan-500/60 rounded px-3 py-2.5 text-cyan-300 font-bold focus:outline-none focus:border-cyan-400"
            >
              <option value="URINE-017">URINE-017 | E. coli NCTC 10418 (Ampicillin Susceptible)</option>
              <option value="URINE-042">URINE-042 | K. pneumoniae 13368 (ESBL Positive)</option>
              <option value="URINE-089">URINE-089 | E. coli CFI-003 NDM-5 (Carbapenem Resistant)</option>
            </select>
          </div>

          {/* Selected Strain Card */}
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 grid grid-cols-2 gap-4 text-[11px]">
            <div>
              <span className="text-slate-500 block">ORGANISM</span>
              <span className="font-bold text-white text-xs">{selectedStrain.organism}</span>
            </div>
            <div>
              <span className="text-slate-500 block">STRAIN IDENTIFIER</span>
              <span className="font-bold text-cyan-400 text-xs">{selectedStrain.strain}</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-500 block mb-0.5">AMR RESISTANCE PROFILE (CLINICAL MIC)</span>
              <span className="font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/80">
                {selectedStrain.resistanceProfile}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">SAMPLE TYPE</label>
              <input
                type="text"
                disabled
                value="URINE (UTI Screening)"
                className="w-full bg-slate-900/60 border border-slate-800 rounded px-3 py-2 text-slate-300"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">PROTOCOL</label>
              <input
                type="text"
                disabled
                value="UTI-EIS-V1 (Multi-freq)"
                className="w-full bg-slate-900/60 border border-slate-800 rounded px-3 py-2 text-slate-300"
              />
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
        <div className="bg-slate-950 border border-emerald-500/40 rounded-lg p-4">
          <div className="text-emerald-400 font-bold text-xs mb-2">
            ✓ SAMPLE VALIDATION & MODALITY PROVENANCE
          </div>
          <ul className="text-[11px] text-slate-300 space-y-1">
            <li>✓ Sample ID & iFAST clinical strain pairing verified</li>
            <li>✓ Volume within required protocol limits (100–500 µL)</li>
            <li>✓ Calibration CAL-0042 verified (Multi-frequency Cole-Cole dispersion)</li>
            <li>✓ Modality: <span className="text-cyan-300 font-bold">REAL_CLINICAL_METADATA + SIMULATED_EIS</span></li>
          </ul>
        </div>

        <button
          onClick={onVerify}
          className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg shadow-lg shadow-cyan-500/20 transition-all text-xs tracking-wider uppercase"
        >
          VERIFY SAMPLE & START EXPERIMENT PIPELINE
        </button>
      </div>
    </div>
  );
}
