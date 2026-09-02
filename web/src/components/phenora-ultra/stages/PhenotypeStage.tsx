"use client";

import React, { useState } from "react";
import { PhenoraFlashResult, PhenotypeFeature } from "@/phenora/types";

interface PhenotypeStageProps {
  result: PhenoraFlashResult | null;
}

export default function PhenotypeStage({ result }: PhenotypeStageProps) {
  const [selectedFeature, setSelectedFeature] = useState<PhenotypeFeature | null>(null);

  const phenotype = result?.phenotype;
  const confidence = phenotype?.overallConfidence ?? 82;

  return (
    <div className="p-6 max-w-5xl mx-auto font-mono space-y-6">
      {/* Header */}
      <div className="bg-[#0B1528] border border-slate-800 rounded-xl p-5 flex justify-between items-center">
        <div>
          <h2 className="text-base font-bold text-white mb-1">STAGE 4 — IMPEDANCE PHENOTYPE MATRIX</h2>
          <p className="text-xs text-slate-400">Structured feature extraction with explicit provenance tracking</p>
        </div>
        <div className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded">
          CONFIDENCE: <span className="text-emerald-400 font-bold">{confidence}%</span>
        </div>
      </div>

      {/* Phenotype Cards Grid */}
      <div className="grid grid-cols-2 gap-4 text-xs">
        {/* Spectral Card */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <h3 className="text-cyan-400 font-bold border-b border-slate-800 pb-1.5 flex items-center justify-between">
            <span>SPECTRAL PHENOTYPE</span>
            <span className="text-[10px] text-cyan-300 font-normal bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">DERIVED</span>
          </h3>
          {phenotype?.spectral.map((f, i) => (
            <div
              key={i}
              onClick={() => setSelectedFeature(f)}
              className="flex justify-between p-2 rounded bg-slate-900/60 hover:bg-slate-800 cursor-pointer transition-colors border border-transparent hover:border-cyan-500/40"
            >
              <span className="text-slate-300">{f.name}</span>
              <span className="font-bold text-cyan-300">{f.value} {f.unit}</span>
            </div>
          )) || <div className="text-slate-500 italic p-2">No spectral features</div>}
        </div>

        {/* Resistive Card */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <h3 className="text-cyan-400 font-bold border-b border-slate-800 pb-1.5 flex items-center justify-between">
            <span>RESISTIVE PHENOTYPE</span>
            <span className="text-[10px] text-cyan-300 font-normal bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">DERIVED</span>
          </h3>
          {phenotype?.resistive.map((f, i) => (
            <div
              key={i}
              onClick={() => setSelectedFeature(f)}
              className="flex justify-between p-2 rounded bg-slate-900/60 hover:bg-slate-800 cursor-pointer transition-colors border border-transparent hover:border-cyan-500/40"
            >
              <span className="text-slate-300">{f.name}</span>
              <span className="font-bold text-slate-200">{f.value} {f.unit}</span>
            </div>
          )) || <div className="text-slate-500 italic p-2">No resistive features</div>}
        </div>

        {/* Temporal Card */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <h3 className="text-cyan-400 font-bold border-b border-slate-800 pb-1.5 flex items-center justify-between">
            <span>TEMPORAL PHENOTYPE</span>
            <span className="text-[10px] text-amber-300 font-normal bg-amber-950 px-2 py-0.5 rounded border border-amber-800">INFERRED</span>
          </h3>
          {phenotype?.temporal.map((f, i) => (
            <div
              key={i}
              onClick={() => setSelectedFeature(f)}
              className="flex justify-between p-2 rounded bg-slate-900/60 hover:bg-slate-800 cursor-pointer transition-colors border border-transparent hover:border-cyan-500/40"
            >
              <span className="text-slate-300">{f.name}</span>
              <span className="font-bold text-cyan-300 uppercase">{f.value} {f.unit}</span>
            </div>
          )) || <div className="text-slate-500 italic p-2">No temporal features</div>}
        </div>

        {/* Quality Card */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <h3 className="text-cyan-400 font-bold border-b border-slate-800 pb-1.5 flex items-center justify-between">
            <span>QUALITY PHENOTYPE</span>
            <span className="text-[10px] text-emerald-300 font-normal bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">MEASURED</span>
          </h3>
          {phenotype?.quality.map((f, i) => (
            <div
              key={i}
              onClick={() => setSelectedFeature(f)}
              className="flex justify-between p-2 rounded bg-slate-900/60 hover:bg-slate-800 cursor-pointer transition-colors border border-transparent hover:border-cyan-500/40"
            >
              <span className="text-slate-300">{f.name}</span>
              <span className="font-bold text-emerald-400">{f.value} {f.unit}</span>
            </div>
          )) || <div className="text-slate-500 italic p-2">No quality features</div>}
        </div>
      </div>

      {/* Feature Provenance Inspector Modal */}
      {selectedFeature && (
        <div className="bg-slate-900 p-5 rounded-xl border border-cyan-500/60 text-xs space-y-4 shadow-2xl animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h4 className="font-bold text-cyan-300 text-sm">FEATURE PROVENANCE INSPECTOR</h4>
            <button
              onClick={() => setSelectedFeature(null)}
              className="text-slate-400 hover:text-white font-bold px-2 py-0.5 bg-slate-800 rounded"
            >
              ✕ CLOSE
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-[11px] text-slate-300">
            <div className="bg-slate-950 p-3 rounded border border-slate-800">
              <span className="text-slate-500 block text-[10px]">FEATURE NAME</span>
              <span className="font-bold text-white text-xs">{selectedFeature.name}</span>
            </div>
            <div className="bg-slate-950 p-3 rounded border border-slate-800">
              <span className="text-slate-500 block text-[10px]">OBSERVED / CALCULATED VALUE</span>
              <span className="font-bold text-cyan-400 text-xs">{selectedFeature.value} {selectedFeature.unit}</span>
            </div>
            <div className="bg-slate-950 p-3 rounded border border-slate-800">
              <span className="text-slate-500 block text-[10px]">DATA SOURCE</span>
              <span className="font-bold text-slate-200">{selectedFeature.source}</span>
            </div>
            <div className="bg-slate-950 p-3 rounded border border-slate-800">
              <span className="text-slate-500 block text-[10px]">PROVENANCE LEVEL</span>
              <span className="font-bold text-emerald-400">{selectedFeature.provenance} ({selectedFeature.status})</span>
            </div>
            <div className="col-span-2 bg-slate-950 p-3 rounded border border-slate-800">
              <span className="text-slate-500 block text-[10px]">COMPUTATION METHOD & FORMULA</span>
              <span className="font-bold text-slate-300 font-mono">{selectedFeature.calculation}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
