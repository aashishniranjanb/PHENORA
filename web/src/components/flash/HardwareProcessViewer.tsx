"use client";

import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import ChamberDualWell from "@/components/simulation/hardware/ChamberDualWell";
import ErrorBoundary from "@/components/flash/ErrorBoundary";
import { Play, ArrowRight, Layers, Eye, RefreshCw } from "lucide-react";
import { FlashRun } from "@/types/flash";

interface Props {
  run: FlashRun;
  isMeasuring?: boolean;
  onComplete?: () => void;
}

const STEPS = [
  {
    id: 0,
    title: "READY",
    what: "Awaiting sample loading.",
    why: "The dual-well chamber must be primed with the patient sample.",
    tech: "Microfluidic handling",
  },
  {
    id: 1,
    title: "LOAD",
    what: "Place sample into control and antibiotic wells.",
    why: "Divide the biological material to establish a baseline vs treated comparison.",
    tech: "Parallel fluidic isolation",
  },
  {
    id: 2,
    title: "MEASURE",
    what: "Probe the sample electrically.",
    why: "Detect changes caused by biological activity.",
    tech: "Multi-frequency impedance spectroscopy",
  },
  {
    id: 3,
    title: "GROW",
    what: "Track the sample over time.",
    why: "Living bacteria change the electrical environment as they grow.",
    tech: "Dynamic growth measurement",
  },
  {
    id: 4,
    title: "COMPARE",
    what: "Compare control vs antibiotic wells.",
    why: "Determine whether growth is suppressed.",
    tech: "Phenotypic AST",
  },
  {
    id: 5,
    title: "PREDICT",
    what: "Project the biological trajectory forward.",
    why: "Estimate what happens next.",
    tech: "Twin + predictive model",
  }
];

export default function HardwareProcessViewer({ run, isMeasuring = false, onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [cutawayMode, setCutawayMode] = useState(false);

  // Auto-start when measuring state changes from parent
  useEffect(() => {
    if (isMeasuring && step === 0 && !isPlaying) {
      setIsPlaying(true);
    }
  }, [isMeasuring, step, isPlaying]);

  // Derive biological properties from the selected sample safely
  const isResistant = run.susceptibility?.some(s => s?.call === "RESISTANT") ?? false;
  const isBlood = run.headline?.patient?.specimenType?.toLowerCase().includes("blood") ?? false;
  const isUrine = run.headline?.patient?.specimenType?.toLowerCase().includes("urine") ?? false;
  const cellConcentration = isBlood ? 0.3 : isUrine ? 0.8 : 0.6;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && step < 5) {
      timer = setTimeout(() => {
        setStep(s => s + 1);
      }, 2500); // 2.5 seconds per step
    } else if (isPlaying && step >= 5) {
      setIsPlaying(false);
      // Auto complete when finished playing
      if (onComplete) onComplete();
    }
    return () => clearTimeout(timer);
  }, [isPlaying, step, onComplete]);

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      if (onComplete) onComplete();
    }
  };

  const currentDef = STEPS[step];

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
      
      {/* TOP: 2D PROTOTYPE VIEW */}
      <div className="w-full bg-[#020813] relative border-b border-slate-800 flex flex-col">
        {/* Top Bar inside 2D View */}
        <div className="absolute top-0 left-0 w-full p-4 z-10 flex justify-between items-start pointer-events-none">
          <div>
            <h3 className="text-emerald-400 font-mono font-bold text-xs uppercase tracking-widest mb-1">
              PHENORA HARDWARE SIMULATION
            </h3>
            <p className="text-slate-400 text-sm">
              UNKNOWN SAMPLE → DIAGNOSTIC RESULT
            </p>
          </div>
        </div>

        {/* 2D Interactive Canvas */}
        <div className="w-full h-[400px] relative bg-[#0B1221] overflow-hidden flex flex-col items-center justify-center p-8">
          
          <div className="flex items-center justify-center gap-20 w-full max-w-md mt-16 relative">
            
            {/* Impedance Comparator (Step 4+) */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-1000 ${step >= 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}`}>
              <div className="bg-slate-900 border-2 border-emerald-500 p-3 rounded-xl flex flex-col items-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider mb-1">ΔZ Comparator</span>
                <span className="text-white font-mono font-bold text-sm">{isResistant ? "MATCH (RESISTANT)" : "DIVERGE (SUSCEPTIBLE)"}</span>
              </div>
              {/* Connecting wires to electrodes */}
              <div className="absolute top-1/2 -left-12 w-12 h-0.5 bg-emerald-500/50 -translate-y-1/2"></div>
              <div className="absolute top-1/2 -right-12 w-12 h-0.5 bg-emerald-500/50 -translate-y-1/2"></div>
            </div>

            {/* Control Well (Left) */}
            <div className="flex flex-col items-center gap-4 relative">
              
              {/* Electrode */}
              <div className={`absolute -top-16 left-1/2 -translate-x-1/2 w-1 bg-slate-400 transition-all duration-1000 z-10 flex flex-col items-center ${step >= 4 ? 'h-32' : 'h-0'}`}>
                <div className={`absolute bottom-0 w-6 h-2 bg-slate-300 rounded-b-sm transition-opacity duration-500 ${step >= 4 ? 'opacity-100' : 'opacity-0'}`}></div>
              </div>

              <div className={`relative w-28 h-36 rounded-b-3xl border-x-4 border-b-4 ${step >= 1 ? 'border-blue-500/50 bg-blue-900/30' : 'border-slate-700 bg-slate-800'} transition-all duration-1000 flex items-end justify-center overflow-hidden shadow-inner`}>
                
                {/* Fluid */}
                <div className={`absolute bottom-0 w-full bg-blue-600/60 transition-all duration-1000 ${step >= 1 ? 'h-4/5' : 'h-0'}`}></div>
                
                {/* Measuring Field (Step 2) */}
                {(step === 2 || step === 4) && (
                  <div className="absolute inset-0 bg-blue-400/20 animate-pulse border-y-2 border-blue-400"></div>
                )}
                
                {/* Biology (Step 1+) */}
                {step >= 1 && (
                  <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-2 p-4">
                    {Array.from({ length: step >= 3 ? 12 : 4 }).map((_, i) => (
                      <div key={i} className="w-2 h-2 bg-blue-300 rounded-full animate-bounce shadow-[0_0_8px_rgba(147,197,253,0.8)]" style={{ animationDelay: `${i * 0.1}s` }}></div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="px-2 py-1 bg-blue-950/80 border border-blue-800 rounded text-[9px] font-bold text-blue-400 tracking-wider">
                - ANTIBIOTIC (CONTROL) {step >= 3 && " (GROWING)"}
              </div>
            </div>

            {/* Test Well (Right) */}
            <div className="flex flex-col items-center gap-4 relative">
              
              {/* Electrode */}
              <div className={`absolute -top-16 left-1/2 -translate-x-1/2 w-1 bg-slate-400 transition-all duration-1000 z-10 flex flex-col items-center ${step >= 4 ? 'h-32' : 'h-0'}`}>
                <div className={`absolute bottom-0 w-6 h-2 bg-slate-300 rounded-b-sm transition-opacity duration-500 ${step >= 4 ? 'opacity-100' : 'opacity-0'}`}></div>
              </div>

              <div className={`relative w-28 h-36 rounded-b-3xl border-x-4 border-b-4 ${step >= 1 ? 'border-red-500/50 bg-red-900/30' : 'border-slate-700 bg-slate-800'} transition-all duration-1000 flex items-end justify-center overflow-hidden shadow-inner`}>
                
                {/* Fluid */}
                <div className={`absolute bottom-0 w-full bg-red-600/60 transition-all duration-1000 ${step >= 1 ? 'h-4/5' : 'h-0'}`}></div>
                
                {/* Measuring Field (Step 2) */}
                {(step === 2 || step === 4) && (
                  <div className="absolute inset-0 bg-red-400/20 animate-pulse border-y-2 border-red-400"></div>
                )}
                
                {/* Biology (Step 1+) */}
                {step >= 1 && (
                  <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-2 p-4">
                    {Array.from({ length: step >= 3 ? (isResistant ? 12 : 2) : 4 }).map((_, i) => (
                      <div key={i} className={`rounded-full shadow-[0_0_8px_rgba(248,113,113,0.8)] transition-all duration-1000 ${
                        step >= 3 && !isResistant ? "w-1 h-1 bg-red-900 opacity-20" : "w-2 h-2 bg-red-300 animate-pulse"
                      }`} style={{ animationDelay: `${i * 0.1}s` }}></div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="px-2 py-1 bg-red-950/80 border border-red-800 rounded text-[9px] font-bold text-red-400 tracking-wider">
                + ANTIBIOTIC {step >= 3 && (isResistant ? " (RESISTANT)" : " (SUPPRESSED)")}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM: NARRATIVE DASHBOARD */}
      <div className="w-full bg-slate-900 p-8 flex flex-col">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-8">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">Process Execution</h2>
          </div>

          {/* Stepper */}
          <div className="space-y-4 mb-12">
            {STEPS.slice(1).map((s, idx) => {
              const isActive = step === s.id;
              const isPast = step > s.id;
              return (
                <div key={s.id} className={`flex items-center gap-3 font-mono text-sm font-bold tracking-wider transition-all ${isActive ? 'text-emerald-400 scale-105 origin-left' : isPast ? 'text-slate-500' : 'text-slate-700'}`}>
                  <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-400' : isPast ? 'bg-slate-500' : 'bg-slate-700'}`}></div>
                  {s.title}
                </div>
              );
            })}
          </div>

          {/* Current Step Explanation */}
          {step > 0 && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 animate-in fade-in zoom-in-95 duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
              <h3 className="text-indigo-400 font-mono font-bold text-sm tracking-wider uppercase mb-6">
                STEP {step} — {currentDef.title}
              </h3>

              <div className="space-y-5">
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">WHAT</div>
                  <div className="text-white font-medium text-sm">
                    {step === 4 
                      ? (isResistant ? "Resistance detected! Cells are aggressively duplicating." : "Susceptibility detected! Cells are shrinking and dying.") 
                      : currentDef.what}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">SAMPLE CONTEXT</div>
                  <div className="text-slate-300 text-sm leading-relaxed">
                    {step === 1 ? `Loading ${run.headline.patient.specimenType} sample.` : currentDef.why}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">TECHNOLOGY</div>
                  <div className="inline-block bg-slate-950 text-emerald-400 border border-slate-800 text-xs font-mono px-2 py-1 rounded">
                    {currentDef.tech}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="pt-8 mt-8 border-t border-slate-800 flex flex-col sm:flex-row gap-4">
          <button 
            onClick={handleNext}
            disabled={isPlaying}
            className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-6 py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step >= 5 ? "VIEW RESULT" : "NEXT STEP"} <ArrowRight className="w-5 h-5" />
          </button>
          
          <button 
            onClick={() => {
              if (step >= 5) setStep(0);
              setIsPlaying(true);
            }}
            disabled={isPlaying}
            className="sm:w-32 bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700"
          >
            <Play className="w-4 h-4" /> PLAY ALL
          </button>
        </div>
      </div>

    </div>
  );
}
