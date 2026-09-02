"use client";

import React, { useState } from "react";
import StatusBadge from "@/components/simulation/StatusBadge";
import ShinyText from "@/components/ui/ShinyText";
import { Zap, Clock, ShieldCheck, Activity, Cpu, Layers } from "lucide-react";

export default function FlashHero() {
  const [showArch, setShowArch] = useState(false);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#0A192F] via-[#0F2342] to-[#0A192F] text-white rounded-3xl p-6 md:p-12 border border-slate-700/60 shadow-2xl mb-8">
      {/* Background ambient lighting */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner & Status Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-black uppercase px-3 py-1 rounded-full tracking-widest flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            FLAGSHIP PLATFORM
          </span>
          <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-mono font-bold uppercase px-3 py-1 rounded-full tracking-wider">
            STEPPED SWEEP 100Hz–100kHz
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-mono font-black uppercase px-2.5 py-1 rounded">
            SYNTHETIC COHORT V1
          </span>
          <StatusBadge status="COMPUTATIONAL DEMONSTRATION" />
        </div>
      </div>

      {/* Main Headline */}
      <div className="max-w-4xl space-y-4 mb-8 relative z-10">
        <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
          <Zap className="w-4 h-4 text-emerald-400" />
          Autonomous Predictive Bioimpedance Engine
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-none">
          <ShinyText text="PHENORA FLASH" className="text-white" />
        </h1>

        <p className="text-lg sm:text-2xl font-bold text-slate-200 leading-snug">
          Find out which bacteria is causing an infection, and which antibiotic will stop it — in{" "}
          <span className="text-emerald-400 underline decoration-emerald-500/60 decoration-2 underline-offset-4">
            about three hours
          </span>{" "}
          instead of two days.
        </p>

        <p className="text-xs sm:text-sm text-slate-300/90 max-w-3xl leading-relaxed font-medium">
          Not a sensor with a dashboard. A multi-frequency impedance system that builds a
          predictive computational twin of bacterial growth, bounds its own uncertainty with conformal prediction,
          and tells you when it is not sure.
        </p>
      </div>

      {/* High-Level Feature Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10 mb-6">
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold mb-1">
            <Clock className="w-4 h-4" />
            <span>TIME TO ANSWER</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">~3.1 h</div>
          <div className="text-[10px] text-slate-400 font-medium mt-0.5">vs 24–48 h standard</div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-blue-400 text-xs font-mono font-bold mb-1">
            <Activity className="w-4 h-4" />
            <span>SPECTRAL RANGE</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">100k</div>
          <div className="text-[10px] text-slate-400 font-medium mt-0.5">100 Hz – 100 kHz sweep</div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-bold mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>CONFORMAL SET</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">90.0%</div>
          <div className="text-[10px] text-slate-400 font-medium mt-0.5">Guaranteed coverage</div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold mb-1">
            <Cpu className="w-4 h-4" />
            <span>DECISION LOOP</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">EIG</div>
          <div className="text-[10px] text-slate-400 font-medium mt-0.5">Max bits / minute</div>
        </div>
      </div>

      {/* Architecture Toggle Button */}
      <div className="pt-2 relative z-10">
        <button
          onClick={() => setShowArch(!showArch)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600 text-xs font-mono font-bold text-slate-200 transition-all cursor-pointer"
        >
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>{showArch ? "Hide Architecture Flow" : "View Flash Autonomous Loop Architecture"}</span>
        </button>

        {showArch && (
          <div className="mt-4 p-5 rounded-2xl bg-slate-950/90 border border-slate-800 font-mono text-xs text-slate-300 space-y-4">
            <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
              Autonomous Biological State & Decision Engine
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[9px] text-slate-500 font-bold block mb-1">STAGE 1</span>
                <span className="text-white font-bold block">Stepped Sweep EIS</span>
                <span className="text-[9px] text-slate-400 block mt-1">Z(f) 100Hz–100kHz</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[9px] text-slate-500 font-bold block mb-1">STAGE 2</span>
                <span className="text-white font-bold block">KK Consistency</span>
                <span className="text-[9px] text-slate-400 block mt-1">Admissibility Gate</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[9px] text-slate-500 font-bold block mb-1">STAGE 3</span>
                <span className="text-white font-bold block">Baranyi Twin</span>
                <span className="text-[9px] text-slate-400 block mt-1">Lag-Aware Growth EKF</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[9px] text-slate-500 font-bold block mb-1">STAGE 4</span>
                <span className="text-white font-bold block">EIG Next Action</span>
                <span className="text-[9px] text-slate-400 block mt-1">Shannon Entropy Min</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-emerald-600/50 bg-emerald-950/30">
                <span className="text-[9px] text-emerald-400 font-bold block mb-1">STAGE 5</span>
                <span className="text-emerald-300 font-bold block">Conformal Decision</span>
                <span className="text-[9px] text-emerald-400/80 block mt-1">Report or Abstain</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
