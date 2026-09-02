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
          <h2 className="text-base font-bold text-white mb-1">STAGE 4 — IMPEDANCE PHENOTYPE</h2>
          <p className="text-xs text-slate-400">Structured electrical representation of the sample</p>
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
            <span className="text-[10px] text-slate-500 font-normal">DERIVED</span>
          </h3>
          {phenotype?.spectral.map((f, i) => (
            <div
              key={i}
              onClick={() => setSelectedFeature(f)}
              className="flex justify-between p-2 rounded bg-slate-900/60 hover:bg-slate-800 cursor-pointer transition-colors"
            >
              <span className="text-slate-400">{f.name}</span>
              <span className="font-bold text-slate-200">{f.value} {f.unit}</span>
            </div>
          )) || <div className="text-slate-500 italic p-2">No spectral features</div>}
        </div>

        {/* Resistive Card */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <h3 className="text-cyan-400 font-bold border-b border-slate-800 pb-1.5 flex items-center justify-between">
            <span>RESISTIVE PHENOTYPE</span>
            <span className="text-[10px] text-slate-500 font-normal">DERIVED</span>
          </h3>
          {phenotype?.resistive.map((f, i) => (
            <div
              key={i}
              onClick={() => setSelectedFeature(f)}
              className="flex justify-between p-2 rounded bg-slate-900/60 hover:bg-slate-800 cursor-pointer transition-colors"
            >
              <span className="text-slate-400">{f.name}</span>
              <span className="font-bold text-slate-200">{f.value} {f.unit}</span>
            </div>
          )) || <div className="text-slate-500 italic p-2">No resistive features</div>}
        </div>

        {/* Temporal Card */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <h3 className="text-cyan-400 font-bold border-b border-slate-800 pb-1.5 flex items-center justify-between">
            <span>TEMPORAL PHENOTYPE</span>
            <span className="text-[10px] text-slate-500 font-normal">INFERRED</span>
          </h3>
          {phenotype?.temporal.map((f, i) => (
            <div
              key={i}
              onClick={() => setSelectedFeature(f)}
              className="flex justify-between p-2 rounded bg-slate-900/60 hover:bg-slate-800 cursor-pointer transition-colors"
            >
              <span className="text-slate-400">{f.name}</span>
              <span className="font-bold text-cyan-300 uppercase">{f.value} {f.unit}</span>
            </div>
          )) || <div className="text-slate-500 italic p-2">No temporal features</div>}
        </div>

        {/* Quality Card */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <h3 className="text-cyan-400 font-bold border-b border-slate-800 pb-1.5 flex items-center justify-between">
            <span>QUALITY PHENOTYPE</span>
            <span className="text-[10px] text-slate-500 font-normal">MEASURED</span>
          </h3>
          {phenotype?.quality.map((f, i) => (
            <div
              key={i}
              onClick={() => setSelectedFeature(f)}
              className="flex justify-between p-2 rounded bg-slate-900/60 hover:bg-slate-800 cursor-pointer transition-colors"
            >
              <span className="text-slate-400">{f.name}</span>
              <span className="font-bold text-emerald-400">{f.value} {f.unit}</span>
            </div>
          )) || <div className="text-slate-500 italic p-2">No quality features</div>}
        </div>
      </div>

      {/* Feature Provenance Modal / Inspector */}
      {selectedFeature && (
        <div className="bg-slate-900 p-5 rounded-xl border border-cyan-500/40 text-xs space-y-3">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h4 className="font-bold text-cyan-300">FEATURE PROVENANCE INSPECTOR</h4>
            <button
              onClick={() => setSelectedFeature(null)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-[11px] text-slate-300">
            <div><span className="text-slate-500 block">FEATURE</span><span className="font-bold text-white">{selectedFeature.name}</span></div>
            <div><span className="text-slate-500 block">VALUE</span><span className="font-bold text-cyan-400">{selectedFeature.value} {selectedFeature.unit}</span></div>
            <div><span className="text-slate-500 block">SOURCE</span><span className="font-bold text-slate-200">{selectedFeature.source}</span></div>
            <div><span className="text-slate-500 block">COMPUTATION</span><span className="font-bold text-slate-200">{selectedFeature.calculation}</span></div>
            <div><span className="text-slate-500 block">STATUS</span><span className="font-bold text-emerald-400">{selectedFeature.status}</span></div>
            <div><span className="text-slate-500 block">VERSION</span><span className="font-bold text-slate-400">{selectedFeature.version}</span></div>
          </div>
        </div>
      )}
    </div>
  );
}
