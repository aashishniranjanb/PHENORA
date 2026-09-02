"use client";

import React, { useState } from "react";
import { PhenoraFlashResult } from "@/phenora/types";

interface ResultStageProps {
  result: PhenoraFlashResult | null;
  onRunAgain: () => void;
}

export default function ResultStage({ result, onRunAgain }: ResultStageProps) {
  const [showProvenance, setShowProvenance] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const primary = result?.diseaseIntelligence?.primary;
  const prov = result?.provenance;

  const reasoningNodes = [
    { title: "SAMPLE", level: "MEASURED", desc: "Sample ID, clinical strain pairing & volume validation" },
    { title: "ACQUISITION", level: "MEASURED", desc: "860 SPS 16-bit time-domain stream & quality scoring" },
    { title: "IMPEDANCE", level: "DERIVED", desc: "Bode log-log spectrum, Nyquist Cole-Cole arc & temporal Z(t)" },
    { title: "SIGNAL FEATURES", level: "DERIVED", desc: "RMS, peak-to-peak, baseline drift, and SNR metrics" },
    { title: "PHENOTYPE", level: "DERIVED", desc: "Structured phenotype matrix across spectral & resistive domains" },
    { title: "DISEASE MODEL", level: "PREDICTED", desc: "UTI-associated phenotype probability & alternative hypotheses" },
    { title: "DIGITAL TWIN", level: "INFERRED", desc: "3-column observed/inferred/predicted state synchronization" },
    { title: "FORECAST", level: "PREDICTED", desc: "Time-series trajectory extrapolation for +5m to +30m horizons" },
    { title: "AUTONOMY", level: "PREDICTED", desc: "Closed-loop decision planner evaluating information gain" },
    { title: "FINAL RESULT", level: "PREDICTED", desc: "Canonical PhenoraFlashResult payload" }
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto font-mono space-y-6">
      {/* Result Header */}
      <div className="bg-[#0B1528] border border-slate-800 rounded-xl p-5 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-white mb-1">PHENORA FLASH RESULT SUMMARY</h2>
          <p className="text-xs text-slate-400">Run: {prov?.runId || "PF-2026-00042"} | Sample: {result?.sample?.sampleId || "URINE-017"}</p>
        </div>
        <div className="text-xs bg-emerald-950 border border-emerald-700 text-emerald-300 px-3 py-1.5 rounded font-bold">
          STATUS: COMPLETE (RESEARCH VALIDATED)
        </div>
      </div>

      {/* Primary Result Summary Box */}
      <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4 text-xs">
        <h3 className="text-slate-400 font-bold border-b border-slate-800 pb-2 uppercase tracking-wider">
          FINAL EXPERIMENT SUMMARY
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-[10px] text-slate-500">SAMPLE & STRAIN</div>
            <div className="text-sm font-bold text-white mt-0.5">{result?.sample?.sampleId} ({result?.sample?.protocol})</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500">IMPEDANCE PHENOTYPE</div>
            <div className="text-sm font-bold text-cyan-300 mt-0.5">CHARACTERIZED (FULL SPECTRUM)</div>
          </div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-lg border border-slate-800 space-y-2">
          <div className="text-[10px] text-slate-400">PRIMARY MODEL OUTPUT</div>
          <div className="text-lg font-bold text-cyan-400">{primary?.condition || "UTI-ASSOCIATED PHENOTYPE"}</div>
          <div className="grid grid-cols-4 gap-2 pt-2 text-[11px]">
            <div><span className="text-slate-500 block">PROBABILITY</span><span className="font-bold text-white">{primary ? `${Math.round(primary.probability * 100)}%` : "--"}</span></div>
            <div><span className="text-slate-500 block">CONFIDENCE</span><span className="font-bold text-emerald-400">{primary ? `${primary.confidence}%` : "--"}</span></div>
            <div><span className="text-slate-500 block">UNCERTAINTY</span><span className="font-bold text-amber-400">{primary ? `${primary.uncertainty}%` : "--"}</span></div>
            <div><span className="text-slate-500 block">DECISION</span><span className="font-bold text-cyan-300">{result?.autonomousDecision?.decision}</span></div>
          </div>
        </div>
      </div>

      {/* Clickable End-to-End Reasoning Chain Trace */}
      <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 text-xs space-y-3">
        <h3 className="text-slate-400 font-bold border-b border-slate-800 pb-3">
          CLICKABLE REASONING CHAIN TRACE & PROVENANCE MAP
        </h3>
        <div className="flex flex-wrap items-center justify-between text-[10px] gap-2 font-mono">
          {reasoningNodes.map((node, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="text-slate-600">➔</span>}
              <button
                onClick={() => setSelectedNode(node.title)}
                className={`px-2.5 py-1.5 rounded font-bold transition-all border ${
                  selectedNode === node.title
                    ? "bg-cyan-400 text-slate-950 border-white scale-105"
                    : "bg-slate-900 border-slate-700 text-cyan-300 hover:border-cyan-400"
                }`}
              >
                {node.title}
              </button>
            </React.Fragment>
          ))}
        </div>

        {selectedNode && (
          <div className="p-3 bg-slate-900 border border-cyan-500/50 rounded-lg text-[11px] text-slate-200 mt-3 animate-fade-in">
            <div className="font-bold text-cyan-300 text-xs mb-1">NODE: {selectedNode}</div>
            {reasoningNodes.find(n => n.title === selectedNode)?.desc}
            <div className="text-[10px] text-emerald-400 mt-1 font-bold">
              PROVENANCE LEVEL: {reasoningNodes.find(n => n.title === selectedNode)?.level}
            </div>
          </div>
        )}
      </div>

      {/* Limitations Disclaimer (Mandatory) */}
      <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 text-xs space-y-2">
        <h3 className="text-amber-400 font-bold border-b border-slate-800 pb-2">
          SCIENTIFIC LIMITATIONS & DISCLOSURE
        </h3>
        <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
          <li>Research and engineering validation use only.</li>
          <li>Prediction depends on registered model domain ({prov?.modelId}).</li>
          <li>Impedance phenotype does not independently establish clinical diagnosis.</li>
          <li>OOD detection may fail outside validated sample distributions.</li>
        </ul>
      </div>

      {/* Expandable Full Provenance Panel */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs">
        <button
          onClick={() => setShowProvenance(!showProvenance)}
          className="w-full flex justify-between items-center font-bold text-slate-400 hover:text-cyan-300"
        >
          <span>FULL SYSTEM PROVENANCE CHAIN {showProvenance ? "▲" : "▼"}</span>
          <span className="text-[10px] text-slate-500">{prov?.runId}</span>
        </button>

        {showProvenance && (
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-800 text-[11px] text-slate-300">
            <div><span className="text-slate-500 block">RUN ID</span><span className="font-bold text-white">{prov?.runId}</span></div>
            <div><span className="text-slate-500 block">DEVICE</span><span className="font-bold text-white">{prov?.device}</span></div>
            <div><span className="text-slate-500 block">CALIBRATION</span><span className="font-bold text-slate-200">{prov?.calibrationId}</span></div>
            <div><span className="text-slate-500 block">PROTOCOL</span><span className="font-bold text-slate-200">{prov?.protocol}</span></div>
            <div><span className="text-slate-500 block">MODEL</span><span className="font-bold text-cyan-400">{prov?.modelId} v{prov?.modelVersion}</span></div>
            <div><span className="text-slate-500 block">SOFTWARE</span><span className="font-bold text-slate-400">PHENORA Flash v{prov?.softwareVersion}</span></div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={onRunAgain}
          className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg shadow-lg shadow-cyan-500/20 text-xs tracking-wider uppercase transition-all"
        >
          NEW EXPERIMENT / RUN AGAIN
        </button>
      </div>
    </div>
  );
}
