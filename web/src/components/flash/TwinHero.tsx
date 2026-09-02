"use client";

import React, { useState } from "react";
import StatusBadge from "@/components/simulation/StatusBadge";
import { Zap, Target, GitBranch, ShieldCheck, Cpu } from "lucide-react";
import { FlashRun } from "@/types/flash";

interface Props {
  run: FlashRun;
}

export default function TwinHero({ run }: Props) {
  const [showArch, setShowArch] = useState(false);

  return (
    <div className="relative overflow-hidden bg-white text-slate-900 rounded-3xl p-6 lg:p-8 border border-slate-200 shadow-xl mb-8 flex flex-col md:flex-row items-center gap-8">
      {/* Background ambient lighting */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="flex-1 relative z-10 space-y-4">
        {/* Top Banner & Status Badges */}
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-black uppercase px-3 py-1 rounded-full tracking-widest flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            SYSTEM READY
          </span>
          <StatusBadge status="COMPUTATIONAL DEMONSTRATION" />
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-none">
          Predictive Infection Twin
        </h1>

        <p className="text-lg sm:text-xl font-bold text-slate-600 leading-snug max-w-2xl">
          See exactly how antibiotics affect this sample in real-time.
        </p>

        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed font-medium">
          Upload a sample to our 3D simulation. We continuously measure the electrical fingerprint to detect live biological changes, instantly reconstruct its digital twin, and predict exactly what will happen in the future.
        </p>
      </div>
      
      {/* Placeholder for the 3D Model side-by-side on desktop */}
      <div className="hidden lg:flex flex-col items-center justify-center w-full lg:w-[400px] xl:w-[500px] h-full opacity-0 pointer-events-none">
        {/* This takes up space so the 3D model can be absolutely positioned over it if needed, or we just put the model next to it in page.tsx */}
      </div>
    </div>
  );
}
