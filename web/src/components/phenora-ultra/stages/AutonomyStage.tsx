"use client";

import React from "react";
import { PhenoraFlashResult } from "@/phenora/types";

interface AutonomyStageProps {
  result: PhenoraFlashResult | null;
  onRunNextCycle: () => void;
  isRunning: boolean;
}

export default function AutonomyStage({
  result,
  onRunNextCycle,
  isRunning,
}: AutonomyStageProps) {
  const dec = result?.autonomousDecision;
  const isStop = dec?.decision === "STOP";

  return (
    <div className="p-6 max-w-5xl mx-auto font-mono space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex justify-between items-center">
        <div>
          <h2 className="text-base font-bold text-slate-900 mb-1">STAGE 8 — AUTONOMOUS DECISION PLANNER</h2>
          <p className="text-xs text-slate-600">Information-value guided closed-loop measurement optimizer</p>
        </div>
        <div className="text-xs bg-white border border-slate-200 px-3 py-1.5 rounded">
          BUDGET: <span className="text-emerald-600 font-bold">{dec?.budget?.measurementsDone || 0}/{dec?.budget?.measurementsMax || 12}</span>
        </div>
      </div>

      {/* Decision Card */}
      <div className={`p-6 rounded-xl border font-mono space-y-3 shadow-2xl ${
        isStop ? "bg-emerald-50 border-emerald-300" : "bg-emerald-50 border-emerald-300"
      }`}>
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-700 font-bold uppercase tracking-wider">
            RECOMMENDED AUTONOMOUS DECISION
          </span>
          <span className={`text-xs font-bold px-3 py-1 rounded ${
            isStop ? "bg-emerald-100 text-emerald-700 border border-emerald-600" : "bg-emerald-100 text-emerald-700 border border-emerald-600"
          }`}>
            {dec?.decision || "MEASURE_AGAIN"}
          </span>
        </div>

        <div className="text-xl font-bold text-slate-900 tracking-wide">
          {isStop ? "● STOP MEASUREMENT PIPELINE" : "◉ EXECUTE MEASURE AGAIN CYCLE"}
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          {dec?.reason || "High model disagreement or phenotype uncertainty remaining."}
        </p>

        {!isStop && (
          <button
            onClick={onRunNextCycle}
            disabled={isRunning}
            className="mt-4 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded shadow-lg shadow-amber-500/20 text-xs uppercase tracking-wider transition-all"
          >
            {isRunning ? "MEASURING..." : "EXECUTE NEXT MEASUREMENT NOW"}
          </button>
        )}
      </div>

      {/* Candidate Measurements Options */}
      <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3 text-xs">
        <h3 className="text-slate-700 font-bold border-b border-slate-200 pb-2">
          CANDIDATE NEXT MEASUREMENTS (RANKED BY INFORMATION GAIN)
        </h3>

        <div className="space-y-2">
          {dec?.selectedMeasurement && (
            <div className="p-3 bg-emerald-100/40 border border-emerald-500/60 rounded-lg flex justify-between items-center">
              <div>
                <div className="font-bold text-emerald-700 text-sm">
                  {dec.selectedMeasurement.frequency > 0 ? `${dec.selectedMeasurement.frequency / 1000} kHz` : "FULL SPECTRUM SCAN"} (RECOMMENDED)
                </div>
                <div className="text-[10px] text-slate-600 mt-0.5">{dec.selectedMeasurement.reason}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-emerald-600">Info Gain: +{dec.selectedMeasurement.informationGain}</div>
                <div className="text-[10px] text-slate-600">Uncertainty -{dec.selectedMeasurement.uncertaintyReduction}%</div>
              </div>
            </div>
          )}

          {dec?.alternatives.map((alt, i) => (
            <div key={i} className="p-3 bg-white/60 border border-slate-200 rounded-lg flex justify-between items-center opacity-70">
              <div>
                <div className="font-bold text-slate-700">
                  {alt.frequency > 0 ? `${alt.frequency / 1000} kHz` : "FULL SPECTRUM SCAN"}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">{alt.reason}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-slate-600">Info Gain: +{alt.informationGain}</div>
                <div className="text-[10px] text-slate-500">Uncertainty -{alt.uncertaintyReduction}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Measurement Budget Tracking */}
      <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-xs space-y-3">
        <h3 className="text-slate-700 font-bold border-b border-slate-200 pb-2">
          MEASUREMENT BUDGET CONSUMPTION
        </h3>
        <div className="grid grid-cols-3 gap-4 text-[11px]">
          <div>
            <span className="text-slate-500 block">MEASUREMENTS EXECUTED</span>
            <span className="font-bold text-emerald-700">{dec?.budget?.measurementsDone || 1} / {dec?.budget?.measurementsMax || 12}</span>
          </div>
          <div>
            <span className="text-slate-500 block">TIME ELAPSED</span>
            <span className="font-bold text-slate-800">00:42 / 03:00 min</span>
          </div>
          <div>
            <span className="text-slate-500 block">RETRIES USED</span>
            <span className="font-bold text-slate-800">{dec?.budget?.retriesDone || 0} / {dec?.budget?.retriesMax || 3}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
