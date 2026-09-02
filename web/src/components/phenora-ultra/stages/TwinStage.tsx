"use client";

import React from "react";
import { PhenoraFlashResult } from "@/phenora/types";

interface TwinStageProps {
  result: PhenoraFlashResult | null;
}

export default function TwinStage({ result }: TwinStageProps) {
  const twin = result?.digitalTwin;

  return (
    <div className="p-6 max-w-5xl mx-auto font-mono space-y-6">
      {/* Header */}
      <div className="bg-[#0B1528] border border-slate-800 rounded-xl p-5 flex justify-between items-center">
        <div>
          <h2 className="text-base font-bold text-white mb-1">STAGE 6 — DIGITAL TWIN STATE</h2>
          <p className="text-xs text-slate-400">Structured multi-layer physical system state representation</p>
        </div>
        <div className="text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-emerald-400 font-bold">{twin?.twinId || "TWIN-ACTIVE"}</span>
        </div>
      </div>

      {/* 3 Columns: OBSERVED | INFERRED | PREDICTED */}
      <div className="grid grid-cols-3 gap-4 text-xs">
        {/* OBSERVED Column */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
          <h3 className="text-cyan-400 font-bold border-b border-slate-800 pb-2 text-[11px] uppercase tracking-wider flex items-center justify-between">
            <span>OBSERVED</span>
            <span className="text-[10px] text-slate-500 font-normal">MEASURED</span>
          </h3>
          <div className="space-y-2">
            {twin?.observed.map((v, i) => (
              <div key={i} className="p-3 bg-slate-900/80 rounded border border-slate-800">
                <div className="text-[10px] text-slate-400">{v.name}</div>
                <div className="text-sm font-bold text-white mt-0.5">{v.value} {v.unit}</div>
                <div className="text-[9px] text-emerald-400 mt-1">Confidence: {v.confidence}%</div>
              </div>
            )) || <div className="text-slate-500 italic">No observed variables</div>}
          </div>
        </div>

        {/* INFERRED Column */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
          <h3 className="text-cyan-400 font-bold border-b border-slate-800 pb-2 text-[11px] uppercase tracking-wider flex items-center justify-between">
            <span>INFERRED</span>
            <span className="text-[10px] text-slate-500 font-normal">DERIVED / MODEL</span>
          </h3>
          <div className="space-y-2">
            {twin?.inferred.map((v, i) => (
              <div key={i} className="p-3 bg-slate-900/80 rounded border border-slate-800">
                <div className="text-[10px] text-slate-400">{v.name}</div>
                <div className="text-sm font-bold text-cyan-300 mt-0.5">{v.value} {v.unit}</div>
                <div className="text-[9px] text-emerald-400 mt-1">Confidence: {v.confidence}%</div>
              </div>
            )) || <div className="text-slate-500 italic">No inferred variables</div>}
          </div>
        </div>

        {/* PREDICTED Column */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
          <h3 className="text-cyan-400 font-bold border-b border-slate-800 pb-2 text-[11px] uppercase tracking-wider flex items-center justify-between">
            <span>PREDICTED</span>
            <span className="text-[10px] text-slate-500 font-normal">FORECAST</span>
          </h3>
          <div className="space-y-2">
            <div className="p-3 bg-slate-900/80 rounded border border-slate-800">
              <div className="text-[10px] text-slate-400">Low-Freq |Z| (+10 min)</div>
              <div className="text-sm font-bold text-amber-300 mt-0.5">184 Ω ± 21 Ω</div>
              <div className="text-[9px] text-amber-400 mt-1">Horizon: +10 min</div>
            </div>
            <div className="p-3 bg-slate-900/80 rounded border border-slate-800">
              <div className="text-[10px] text-slate-400">Disease Probability (+10 min)</div>
              <div className="text-sm font-bold text-amber-300 mt-0.5">84% ± 18%</div>
              <div className="text-[9px] text-amber-400 mt-1">Horizon: +10 min</div>
            </div>
          </div>
        </div>
      </div>

      {/* Digital Twin Timeline Snapshots */}
      <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 text-xs">
        <h3 className="text-slate-400 font-bold border-b border-slate-800 pb-2 mb-4">
          TWIN STATE TIMELINE SNAPSHOTS
        </h3>
        <div className="flex items-center justify-between px-4 font-mono">
          {twin?.history.map((h, i) => (
            <div key={i} className="flex flex-col items-center group cursor-pointer">
              <div className="w-3 h-3 rounded-full bg-cyan-400 border-2 border-slate-900 group-hover:scale-125 transition-all"></div>
              <span className="text-[10px] text-slate-400 mt-1">T{i}</span>
              <span className="text-[9px] text-slate-600">Cycle {i + 1}</span>
            </div>
          )) || <div className="text-slate-500 italic">No history points yet</div>}
        </div>
      </div>

      {/* Uncertainty Map */}
      <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 text-xs">
        <h3 className="text-slate-400 font-bold border-b border-slate-800 pb-2 mb-3">
          TWIN UNCERTAINTY MAP
        </h3>
        <div className="grid grid-cols-5 gap-3 text-[11px]">
          <div className="bg-slate-900 p-2.5 rounded text-center"><span className="text-slate-500 block">SIGNAL</span><span className="font-bold text-emerald-400">{twin?.uncertaintyMap.signal || "LOW"}</span></div>
          <div className="bg-slate-900 p-2.5 rounded text-center"><span className="text-slate-500 block">PHENOTYPE</span><span className="font-bold text-emerald-400">{twin?.uncertaintyMap.phenotype || "LOW"}</span></div>
          <div className="bg-slate-900 p-2.5 rounded text-center"><span className="text-slate-500 block">DISEASE</span><span className="font-bold text-amber-400">{twin?.uncertaintyMap.disease || "MEDIUM"}</span></div>
          <div className="bg-slate-900 p-2.5 rounded text-center"><span className="text-slate-500 block">FORECAST</span><span className="font-bold text-red-400">{twin?.uncertaintyMap.forecast || "HIGH"}</span></div>
          <div className="bg-slate-900 p-2.5 rounded text-center"><span className="text-slate-500 block">OVERALL</span><span className="font-bold text-amber-400">{twin?.uncertaintyMap.overall || "MEDIUM"}</span></div>
        </div>
      </div>
    </div>
  );
}
