"use client";

import React, { useState } from "react";
import { PhenoraFlashResult } from "@/phenora/types";
import BodePlot from "../charts/BodePlot";
import NyquistPlot from "../charts/NyquistPlot";
import TemporalPlot from "../charts/TemporalPlot";
import FFTPlot from "../charts/FFTPlot";

interface ImpedanceStageProps {
  result: PhenoraFlashResult | null;
}

type TabType = "BODE" | "NYQUIST" | "TEMPORAL" | "FFT" | "CIRCUIT" | "QUALITY";

export default function ImpedanceStage({ result }: ImpedanceStageProps) {
  const [activeTab, setActiveTab] = useState<TabType>("BODE");

  return (
    <div className="p-6 max-w-5xl mx-auto font-mono space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex justify-between items-center">
        <div>
          <h2 className="text-base font-bold text-slate-900 mb-1">STAGE 3 — IMPEDANCE SPECTRUM</h2>
          <p className="text-xs text-slate-600">Multi-frequency electrical response analysis</p>
        </div>
        <div className="text-xs text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded">
          POINTS: <span className="text-emerald-600 font-bold">{result?.spectrum?.numPoints || 0}</span> | RANGE: 10Hz–1MHz
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-slate-200 text-xs">
        {(["BODE", "NYQUIST", "TEMPORAL", "FFT", "CIRCUIT", "QUALITY"] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-bold transition-all border-b-2 ${
              activeTab === tab
                ? "border-emerald-400 text-emerald-700 bg-white/60"
                : "border-transparent text-slate-600 hover:text-slate-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Active Tab View */}
      <div>
        {activeTab === "BODE" && <BodePlot data={result?.bode} />}
        {activeTab === "NYQUIST" && <NyquistPlot data={result?.nyquist} />}
        {activeTab === "TEMPORAL" && <TemporalPlot data={result?.temporal} />}
        {activeTab === "FFT" && <FFTPlot data={result?.fft} />}

        {activeTab === "CIRCUIT" && (
          <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 text-xs space-y-4">
            <h3 className="text-slate-700 font-bold border-b border-slate-200 pb-2">EQUIVALENT CIRCUIT MODEL FIT (Randles Cell)</h3>
            <div className="bg-white/80 p-4 rounded border border-slate-200 text-center font-mono text-emerald-700">
              ───( Rs: 42.1 Ω )───┬───( Rct: 103.4 Ω )───┬───<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└───( Cdl: 8.4 nF )───┘
            </div>
            <div className="grid grid-cols-4 gap-4 pt-2 text-[11px]">
              <div><span className="text-slate-500 block">Rs</span><span className="font-bold text-slate-800">42.1 Ω</span></div>
              <div><span className="text-slate-500 block">Rct</span><span className="font-bold text-slate-800">103.4 Ω</span></div>
              <div><span className="text-slate-500 block">Cdl</span><span className="font-bold text-slate-800">8.4 nF</span></div>
              <div><span className="text-slate-500 block">FIT RMSE</span><span className="font-bold text-emerald-600">4.2% (VALID)</span></div>
            </div>
          </div>
        )}

        {activeTab === "QUALITY" && (
          <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 text-xs space-y-3">
            <h3 className="text-slate-700 font-bold border-b border-slate-200 pb-2">SPECTRAL MEASUREMENT QUALITY</h3>
            <div className="grid grid-cols-2 gap-4 text-[11px]">
              <div className="bg-white p-3 rounded">
                <span className="text-slate-600 block mb-1">SNR</span>
                <span className="font-bold text-emerald-600">91 / 100</span>
              </div>
              <div className="bg-white p-3 rounded">
                <span className="text-slate-600 block mb-1">REPEATABILITY</span>
                <span className="font-bold text-emerald-600">96 / 100</span>
              </div>
              <div className="bg-white p-3 rounded">
                <span className="text-slate-600 block mb-1">VALID POINTS</span>
                <span className="font-bold text-emerald-600">100%</span>
              </div>
              <div className="bg-white p-3 rounded">
                <span className="text-slate-600 block mb-1">K-K CONSISTENCY</span>
                <span className="font-bold text-emerald-600">92 / 100</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
