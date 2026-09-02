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
    <header className="h-14 bg-[#0B1528] border-b border-slate-800/80 px-4 flex items-center justify-between shrink-0 text-xs">
      {/* Brand & Subtitle */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
          <span className="font-bold text-sm tracking-wider text-white font-mono">
            PHENORA <span className="text-cyan-400">FLASH</span>
          </span>
        </div>
        <span className="text-slate-500 font-mono hidden md:inline">|</span>
        <span className="text-slate-400 hidden md:inline font-mono">
          Autonomous Bioimpedance Intelligence
        </span>
        {run && (
          <span className="bg-cyan-950/80 text-cyan-400 border border-cyan-700/50 px-2 py-0.5 rounded font-mono text-[11px]">
            {run.runId}
          </span>
        )}
      </div>

      {/* Scenario & Mode Switchers */}
      <div className="flex items-center space-x-4">
        {/* Scenario selector */}
        <div className="flex items-center space-x-2 bg-slate-900/80 border border-slate-700/60 rounded px-2 py-1">
          <span className="text-slate-400 font-mono">SCENARIO:</span>
          <select
            value={scenario}
            onChange={(e) => setScenario(e.target.value as SimulationScenario)}
            disabled={isRunning}
            className="bg-transparent text-cyan-300 font-mono focus:outline-none cursor-pointer"
          >
            <option value="STABLE" className="bg-slate-900 text-slate-200">Stable</option>
            <option value="RISING" className="bg-slate-900 text-slate-200">Rising (Growth)</option>
            <option value="FALLING" className="bg-slate-900 text-slate-200">Falling (Lysis/Inhibition)</option>
            <option value="NOISY" className="bg-slate-900 text-slate-200">Noisy Signal</option>
            <option value="DRIFTING" className="bg-slate-900 text-slate-200">Drifting Baseline</option>
            <option value="TRANSITION" className="bg-slate-900 text-slate-200">Transition Phase</option>
            <option value="ANOMALY" className="bg-slate-900 text-slate-200">Anomaly Spike</option>
            <option value="RECOVERY" className="bg-slate-900 text-slate-200">Recovery</option>
            <option value="OOD" className="bg-slate-900 text-slate-200">Out of Domain (OOD)</option>
            <option value="TIMEOUT" className="bg-slate-900 text-slate-200">Budget Timeout</option>
          </select>
        </div>

        {/* Start Button */}
        <button
          onClick={onStartSimulation}
          disabled={isRunning}
          className={`px-3 py-1.5 rounded font-mono font-semibold text-xs tracking-wide transition-all shadow-md ${
            isRunning
              ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
              : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20 border border-cyan-400"
          }`}
        >
          {isRunning ? "PROCESSING..." : "▶ RUN EXPERIMENT"}
        </button>

        {/* View Mode Selector */}
        <div className="flex bg-slate-900 rounded border border-slate-700/60 p-0.5 font-mono">
          {(["OPERATOR", "SCIENTIFIC", "ENGINEERING"] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-2.5 py-1 rounded transition-colors ${
                viewMode === mode
                  ? "bg-slate-700 text-white font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
