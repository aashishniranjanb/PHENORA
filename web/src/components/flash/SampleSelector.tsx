"use client";

import React, { useState } from "react";
import { Sparkles, ShieldCheck, User, FlaskConical, Play } from "lucide-react";

interface SampleSelectorProps {
  selectedSample: string;
  onSelectSample: (sampleKey: string, isMystery: boolean, patient?: PatientPill) => void;
  seed: number;
  onRegenerateSeed: () => void;
  runState: 'IDLE' | 'MEASURING' | 'COMPLETED';
  onStartRun: () => void;
  onCSVLoaded?: () => void;
}

interface PatientPill {
  id: string;
  scenario: string;
  story: string;
  type: "routine" | "icu" | "uncertain" | "critical" | "followup";
}

const INITIAL_PATIENTS: PatientPill[] = [
  { id: "P0025", scenario: "🟢 Routine", story: "65F, wound swab, symptoms improving", type: "routine" },
  { id: "P0003", scenario: "🔴 ICU", story: "13F, urine, suspected carbapenem resistance", type: "icu" },
  { id: "P0008", scenario: "🟠 Uncertain", story: "75M, sputum, conflicting preliminary results", type: "uncertain" },
  { id: "P0009", scenario: "🔴 Critical", story: "46M, blood, NDM-1 suspected", type: "critical" },
  { id: "P0021", scenario: "🟡 Follow-up", story: "34F, blood, VIM isolated previously", type: "followup" },
];

export default function SampleSelector({
  selectedSample,
  onSelectSample,
  seed,
  onRegenerateSeed,
  runState,
  onStartRun
}: SampleSelectorProps) {
  const [isMystery, setIsMystery] = useState(false);
  const [patients, setPatients] = useState<PatientPill[]>(INITIAL_PATIENTS);

  const handleSelect = (id: string) => {
    setIsMystery(false);
    onSelectSample(id, false, patients.find(p => p.id === id));
  };

  const handleMystery = () => {
    const keys = patients.map((p) => p.id);
    const remaining = keys.filter((k) => k !== selectedSample);
    const chosen = remaining[Math.floor(Math.random() * remaining.length)];
    setIsMystery(true);
    onSelectSample(chosen, true, patients.find(p => p.id === chosen));
    onRegenerateSeed();
  };

  const [isCsvLoaded, setIsCsvLoaded] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').map(l => l.trim()).filter(l => l);
      if (lines.length < 2) return;
      
      // Confirm CSV is loaded without replacing the 5 scenarios
      setIsCsvLoaded(true);
      
      if (onCSVLoaded) onCSVLoaded();
    };
    reader.readAsText(file);
  };

  return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6 h-full flex flex-col">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight mb-1 flex items-center gap-2">
              <FlaskConical className="w-6 h-6 text-indigo-500" />
              Can you identify what is happening inside this sample?
            </h2>
            <div className="text-sm text-slate-500 font-medium flex items-center gap-1.5 group relative w-fit">
              We've provided 5 common scenarios below. Select one to see how our predictive model analyzes it.
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-indigo-100 text-indigo-600 font-bold text-[10px] cursor-help">
                ?
              </span>
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 w-64 p-3 bg-slate-900 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                <strong className="text-emerald-400 block mb-1">Random Forest Classifier</strong>
                Analyzes continuous impedance features (capacitance, resistance, growth rate) from the CSV to classify the biological state and predict antibiotic resistance.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* CSV Upload Button */}
            <label className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${isCsvLoaded ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-700' : 'bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-700'}`}>
              {isCsvLoaded ? (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              )}
              <span>{isCsvLoaded ? "CSV Loaded" : "Upload CSV"}</span>
              <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-4 flex-1">
          {/* The Hero Button */}
          <button
            onClick={handleMystery}
            className={`w-full p-4 rounded-2xl border-2 flex flex-col items-center justify-center text-center transition-all cursor-pointer shadow-sm ${
              isMystery
                ? "bg-indigo-900 border-indigo-700 text-white ring-4 ring-indigo-500/30"
                : "bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-900 hover:border-indigo-300"
            }`}
          >
            <Sparkles className={`w-6 h-6 mb-2 ${isMystery ? "text-indigo-300" : "text-indigo-600"}`} />
            <span className="font-black text-md mb-1">🎲 Give me a mystery sample</span>
            <span className={`text-[10px] font-medium ${isMystery ? "text-indigo-200" : "text-indigo-700/70"}`}>The ultimate diagnostic challenge</span>
          </button>

          {/* The Specific Cases */}
          <div className="flex flex-col gap-3">
            {patients.map((pt) => {
              const isSelected = !isMystery && selectedSample === pt.id;
              
              return (
                <button
                  key={pt.id}
                  onClick={() => handleSelect(pt.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-emerald-500/50"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold font-mono text-xs">{pt.scenario}</span>
                    </div>
                    <div className={`text-xs font-medium leading-relaxed ${isSelected ? "text-slate-300" : "text-slate-600"}`}>
                      {pt.story}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 text-[10px] font-mono text-slate-500 border-t border-slate-100 pt-3">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Deterministic seed: <strong>#{seed}</strong></span>
          </span>
        </div>
      </div>
    );
  }
