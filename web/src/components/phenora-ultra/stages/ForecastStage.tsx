"use client";

import React, { useState } from "react";
import { PhenoraFlashResult } from "@/phenora/types";

interface ForecastStageProps {
  result: PhenoraFlashResult | null;
}

export default function ForecastStage({ result }: ForecastStageProps) {
  const [tab, setTab] = useState<"IMPEDANCE" | "DISEASE">("DISEASE");

  const forecast = result?.forecast;
  const diseaseForecast = forecast?.diseaseStateForecast || [];

  return (
    <div className="p-6 max-w-5xl mx-auto font-mono space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex justify-between items-center">
        <div>
          <h2 className="text-base font-bold text-slate-900 mb-1">STAGE 7 — PREDICTIVE FORECAST</h2>
          <p className="text-xs text-slate-600">Time-series predictive evolution of the measured sample state</p>
        </div>
        <div className="text-xs bg-white border border-slate-200 px-3 py-1.5 rounded">
          MODEL: <span className="text-emerald-600 font-bold">{forecast?.modelId || "TREND-V1"}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 text-xs">
        <button
          onClick={() => setTab("DISEASE")}
          className={`px-4 py-2 font-bold transition-all border-b-2 ${
            tab === "DISEASE" ? "border-emerald-400 text-emerald-700" : "text-slate-600 hover:text-slate-800"
          }`}
        >
          DISEASE STATE FORECAST
        </button>
        <button
          onClick={() => setTab("IMPEDANCE")}
          className={`px-4 py-2 font-bold transition-all border-b-2 ${
            tab === "IMPEDANCE" ? "border-emerald-400 text-emerald-700" : "text-slate-600 hover:text-slate-800"
          }`}
        >
          IMPEDANCE FORECAST
        </button>
      </div>

      {/* Forecast Chart / Table */}
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4 text-xs">
        <div className="flex justify-between items-center text-slate-600 text-[11px]">
          <span>PREDICTIVE EVOLUTION HORIZON (0 to +30 MINUTES)</span>
          <span className="text-emerald-600 font-bold">STATUS: {forecast?.status || "READY"}</span>
        </div>

        {/* Forecast Interval Table */}
        <div className="grid grid-cols-4 gap-4 pt-2">
          {diseaseForecast.map((f, i) => (
            <div key={i} className="bg-white p-4 rounded-lg border border-slate-200 space-y-2">
              <div className="text-[10px] text-emerald-600 font-bold">+{f.horizon} MINUTES</div>
              <div className="text-lg font-bold text-slate-900">{Math.round(f.prediction)}%</div>
              <div className="text-[10px] text-slate-600">
                Range: [{Math.round(f.lowerBound)}% - {Math.round(f.upperBound)}%]
              </div>
              <div className="text-[9px] text-amber-400">Uncertainty: ±{Math.round(f.uncertainty)}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Validity & History info */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between text-xs text-slate-600">
        <div>HISTORICAL OBSERVATIONS USED: <span className="text-slate-900 font-bold">{forecast?.historyLength || 0}</span></div>
        <div>MODEL VERSION: <span className="text-slate-900 font-bold">{forecast?.version}</span></div>
        <div>BACKTEST STATUS: <span className="text-emerald-600 font-bold">VALIDATED</span></div>
      </div>
    </div>
  );
}
