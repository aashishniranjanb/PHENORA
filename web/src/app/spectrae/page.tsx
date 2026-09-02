"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function SpectraeRoot() {
  const [activeView, setActiveView] = useState<"SIMULATION" | "HARDWARE">("SIMULATION");

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-mono p-8">
      <div className="max-w-4xl mx-auto w-full bg-slate-950 border border-slate-800 rounded-xl p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h1 className="text-xl font-bold text-cyan-400">PHENORA SPECTRAE WORKSPACE</h1>
          <span className="text-xs bg-cyan-950 text-cyan-300 border border-cyan-800 px-3 py-1 rounded">
            V2 PLATFORM
          </span>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          Welcome to the PHENORA Impedance Spectroscopy research suite. The next-generation autonomous multi-frequency bioimpedance platform is available in <strong>PHENORA ULTRA</strong>.
        </p>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-white mb-1">PHENORA ULTRA PLATFORM</h2>
            <p className="text-xs text-slate-400">Horizontal experimental workflow with closed-loop autonomous measurement planner.</p>
          </div>
          <Link
            href="/phenora-ultra"
            className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded text-xs tracking-wider uppercase transition-all"
          >
            OPEN ULTRA PLATFORM ➔
          </Link>
        </div>
      </div>
    </div>
  );
}

