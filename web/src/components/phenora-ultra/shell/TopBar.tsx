"use client";

import React from "react";
import { PhenoraRun, ViewMode, SimulationScenario } from "@/phenora/types";

interface TopBarProps {
  run: PhenoraRun | null;
  viewMode: ViewMode;
  setViewMode: (m: ViewMode) => void;
  scenario: SimulationScenario;
  setScenario: (s: SimulationScenario) => void;
  isRunning: boolean;
  onStartSimulation: () => void;
}

export default function TopBar({
  run,
  viewMode,
  setViewMode,
  scenario,
  setScenario,
  isRunning,
  onStartSimulation,
}: TopBarProps) {
  return (
    <header className="h-14 bg-white border-b border-slate-200/80 px-4 flex items-center justify-between shrink-0 text-xs">
      {/* Brand & Subtitle */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
          <span className="font-bold text-sm tracking-wider text-slate-900 font-mono">
            PHENORA <span className="text-emerald-600">ULTRA</span>
          </span>
        </div>
        <span className="text-slate-500 font-mono hidden md:inline">|</span>
        <span className="text-slate-600 hidden md:inline font-mono">
          Autonomous Bioimpedance Intelligence
        </span>
        {run && (
          <span className="bg-emerald-100/80 text-emerald-600 border border-emerald-700/50 px-2 py-0.5 rounded font-mono text-[11px]">
            {run.runId}
          </span>
        )}
      </div>

      {/* Scenario & Mode Switchers */}
      <div className="flex items-center space-x-4">
        {/* Scenario selector */}
        <div className="flex items-center space-x-2 bg-white/80 border border-slate-300/60 rounded px-2 py-1">
          <span className="text-slate-600 font-mono">SCENARIO:</span>
          <select
            value={scenario}
            onChange={(e) => setScenario(e.target.value as SimulationScenario)}
            disabled={isRunning}
            className="bg-transparent text-emerald-700 font-mono focus:outline-none cursor-pointer"
          >
            <option value="STABLE" className="bg-white text-slate-800">Stable</option>
            <option value="RISING" className="bg-white text-slate-800">Rising (Growth)</option>
            <option value="FALLING" className="bg-white text-slate-800">Falling (Lysis/Inhibition)</option>
            <option value="NOISY" className="bg-white text-slate-800">Noisy Signal</option>
            <option value="DRIFTING" className="bg-white text-slate-800">Drifting Baseline</option>
            <option value="TRANSITION" className="bg-white text-slate-800">Transition Phase</option>
            <option value="ANOMALY" className="bg-white text-slate-800">Anomaly Spike</option>
            <option value="RECOVERY" className="bg-white text-slate-800">Recovery</option>
            <option value="OOD" className="bg-white text-slate-800">Out of Domain (OOD)</option>
            <option value="TIMEOUT" className="bg-white text-slate-800">Budget Timeout</option>
          </select>
        </div>

        {/* Start Button */}
        <button
          onClick={onStartSimulation}
          disabled={isRunning}
          className={`px-3 py-1.5 rounded font-mono font-semibold text-xs tracking-wide transition-all shadow-md ${
            isRunning
              ? "bg-slate-100 text-slate-500 cursor-not-allowed border border-slate-300"
              : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20 border border-emerald-400"
          }`}
        >
          {isRunning ? "PROCESSING..." : "▶ RUN EXPERIMENT"}
        </button>
      </div>
    </header>
  );
}
