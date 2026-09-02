"use client";

import React, { useState } from "react";
import { PhenoraFlashResult } from "@/phenora/types";

interface DiseaseStageProps {
  result: PhenoraFlashResult | null;
}

export default function DiseaseStage({ result }: DiseaseStageProps) {
  const [showModelDetails, setShowModelDetails] = useState(false);

  const disease = result?.diseaseIntelligence;
  const primary = disease?.primary;
  const oodScore = primary?.oodScore ?? 0;
  const isOod = oodScore > 30 || primary?.status === "OUT_OF_DISTRIBUTION";

  return (
    <div className="p-6 max-w-5xl mx-auto font-mono space-y-6">
      {/* Header */}
      <div className="bg-[#0B1528] border border-slate-800 rounded-xl p-5 flex justify-between items-center">
        <div>
          <h2 className="text-base font-bold text-white mb-1">STAGE 5 — DISEASE INTELLIGENCE & REASONING</h2>
          <p className="text-xs text-slate-400">Model output interpretation from electrical phenotype matrix</p>
        </div>
        <div className="text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded">
          MODEL: <span className="text-cyan-400 font-bold">{disease?.modelInfo?.modelId || "UTI-IMPEDANCE-RF"}</span>
        </div>
      </div>

      {/* OOD Warning Banner */}
      {isOod && (
        <div className="bg-amber-950/80 border border-amber-500/60 rounded-xl p-4 text-xs text-amber-200 shadow-xl animate-pulse">
          <div className="font-bold flex items-center space-x-2 text-amber-400 mb-1">
            <span>⚠ OUT-OF-DISTRIBUTION WARNING (OOD SCORE: {oodScore})</span>
          </div>
          <p className="leading-relaxed text-[11px] text-amber-300/90">
            The observed impedance phenotype is outside the validated model domain. Model outputs are marked UNKNOWN / UNSUPPORTED and must not be treated as clinically valid. Recommended action: <strong>MEASURE AGAIN</strong> or manual lab review.
          </p>
        </div>
      )}

      {/* Primary Output & Alternative Hypotheses Grid */}
      <div className="grid grid-cols-3 gap-4 text-xs">
        {/* Primary Prediction */}
        <div className="col-span-2 bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h3 className="text-slate-400 font-bold text-[11px] uppercase tracking-wider">
              PRIMARY MODEL OUTPUT
            </h3>
            <span className="text-[10px] text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
              PROVENANCE: PREDICTED
            </span>
          </div>

          <div className="text-lg font-bold text-cyan-300">
            {primary?.condition || "UTI-ASSOCIATED PHENOTYPE"}
          </div>

          <div className="grid grid-cols-4 gap-2 pt-2 text-[11px]">
            <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
              <span className="text-slate-500 block">PROBABILITY</span>
              <span className="font-bold text-cyan-400 text-sm">
                {primary ? `${Math.round(primary.probability * 100)}%` : "--"}
              </span>
            </div>
            <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
              <span className="text-slate-500 block">CONFIDENCE</span>
              <span className="font-bold text-emerald-400 text-sm">
                {primary ? `${primary.confidence}%` : "--"}
              </span>
            </div>
            <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
              <span className="text-slate-500 block">UNCERTAINTY</span>
              <span className="font-bold text-amber-400 text-sm">
                {primary ? `${primary.uncertainty}%` : "--"}
              </span>
            </div>
            <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
              <span className="text-slate-500 block">STATUS</span>
              <span className={`font-bold text-xs mt-0.5 block ${isOod ? "text-amber-400" : "text-emerald-400"}`}>
                {primary?.status || "UNKNOWN"}
              </span>
            </div>
          </div>
        </div>

        {/* Alternative Hypotheses */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
          <h3 className="text-slate-400 font-bold text-[11px] uppercase tracking-wider border-b border-slate-800 pb-2">
            ALTERNATIVE HYPOTHESES
          </h3>
          {disease?.alternatives.map((alt, i) => (
            <div key={i} className="flex justify-between items-center p-2 rounded bg-slate-900/60 text-[11px] border border-slate-800">
              <span className="text-slate-300 leading-tight pr-2">{alt.condition}</span>
              <span className="font-bold text-cyan-400 shrink-0">
                {Math.round(alt.probability * 100)}%
              </span>
            </div>
          )) || <div className="text-slate-500 italic text-[11px]">No alternatives</div>}
        </div>
      </div>

      {/* Confidence Decomposition & Evidence Breakdown */}
      <div className="grid grid-cols-2 gap-4 text-xs">
        {/* Confidence Decomposition */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
          <h3 className="text-slate-300 font-bold border-b border-slate-800 pb-2 flex justify-between">
            <span>CONFIDENCE DECOMPOSITION</span>
            <span className="text-emerald-400 font-bold">{primary?.confidence || 0}%</span>
          </h3>
          <div className="space-y-2 text-[11px] text-slate-300 font-mono">
            <div className="flex justify-between p-1.5 bg-slate-900 rounded"><span>Measurement Quality</span><span className="text-emerald-400">+{disease?.confidenceDecomposition.signalQuality}</span></div>
            <div className="flex justify-between p-1.5 bg-slate-900 rounded"><span>Phenotype Consistency</span><span className="text-emerald-400">+{disease?.confidenceDecomposition.phenotypeConsistency}</span></div>
            <div className="flex justify-between p-1.5 bg-slate-900 rounded"><span>Model Agreement</span><span className="text-emerald-400">+{disease?.confidenceDecomposition.modelAgreement}</span></div>
            <div className="flex justify-between p-1.5 bg-slate-900 rounded"><span>Temporal Trajectory Evidence</span><span className="text-emerald-400">+{disease?.confidenceDecomposition.temporalEvidence}</span></div>
            <div className="flex justify-between p-1.5 bg-slate-900 rounded"><span>Reference Domain Similarity</span><span className="text-emerald-400">+{disease?.confidenceDecomposition.referenceSimilarity}</span></div>
            <div className="flex justify-between p-1.5 bg-slate-900 rounded"><span>OOD Penalty</span><span className="text-red-400">{disease?.confidenceDecomposition.oodPenalty}</span></div>
          </div>
        </div>

        {/* Evidence Breakdown */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
          <h3 className="text-slate-300 font-bold border-b border-slate-800 pb-2">WHY THE MODEL REACHED THIS RESULT</h3>
          <div className="space-y-2 text-[11px]">
            {disease?.evidence.map((ev, i) => (
              <div key={i} className="p-2.5 bg-slate-900/80 rounded border border-slate-800 flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-200">{ev.description}</div>
                  <div className="text-[10px] text-slate-400">Observed: {ev.observedValue}</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {ev.contribution}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expandable Model Details Drawer */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs">
        <button
          onClick={() => setShowModelDetails(!showModelDetails)}
          className="w-full flex justify-between items-center font-bold text-slate-400 hover:text-cyan-300"
        >
          <span>REGISTERED MODEL SPECIFICATIONS & VALIDATION DATASET {showModelDetails ? "▲" : "▼"}</span>
          <span className="text-[10px] text-slate-500">{disease?.modelInfo?.modelId} v{disease?.modelInfo?.version}</span>
        </button>

        {showModelDetails && (
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-800 text-[11px] text-slate-300">
            <div><span className="text-slate-500 block">ALGORITHM</span><span className="font-bold text-white">{disease?.modelInfo?.algorithm}</span></div>
            <div><span className="text-slate-500 block">MODALITY</span><span className="font-bold text-cyan-400">{disease?.modelInfo?.inputModality}</span></div>
            <div><span className="text-slate-500 block">TRAINING DATASET</span><span className="font-bold text-slate-200">{disease?.modelInfo?.trainingDataset}</span></div>
            <div><span className="text-slate-500 block">AUROC</span><span className="font-bold text-emerald-400">{disease?.modelInfo?.metrics.auroc}</span></div>
            <div><span className="text-slate-500 block">ACCURACY</span><span className="font-bold text-emerald-400">{disease?.modelInfo?.metrics.accuracy}</span></div>
            <div><span className="text-slate-500 block">STATUS</span><span className="font-bold text-amber-400">{disease?.modelInfo?.status}</span></div>
          </div>
        )}
      </div>
    </div>
  );
}
