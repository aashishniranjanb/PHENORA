"use client";

import React, { useState } from "react";
import { AlertTriangle, CheckCircle, BrainCircuit, RefreshCw } from "lucide-react";

interface Props {
  isMysteryMode: boolean;
  onResolve: () => void;
}

export default function AdaptiveLoop({ isMysteryMode, onResolve }: Props) {
  const [isResolving, setIsResolving] = useState(false);

  if (!isMysteryMode) return null;

  const handleResolve = () => {
    setIsResolving(true);
    setTimeout(() => {
      setIsResolving(false);
      onResolve();
    }, 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl relative overflow-hidden mb-8">
      {/* Background trace effect */}
      <div className="absolute -right-20 -top-20 opacity-10">
        <BrainCircuit className="w-64 h-64 text-emerald-500" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-black tracking-widest uppercase text-amber-500 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">
              CONFORMAL ABSTENTION
            </span>
          </div>
          <h3 className="text-xl font-black text-white tracking-tight mb-2">
            Can PHENORA trust this prediction?
          </h3>
          <p className="text-sm text-slate-400 font-medium max-w-md">
            The neural network is uncertain. The statistical conformal bounds indicate that predicting the organism and trajectory now would carry a high risk of error.
          </p>
        </div>

        <div className="w-full md:w-auto bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 min-w-[250px]">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-400">SIGNAL QUALITY</span>
            <span className="text-emerald-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> PASS</span>
          </div>
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-400">MODEL DOMAIN</span>
            <span className="text-emerald-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> PASS</span>
          </div>
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-400">UNCERTAINTY</span>
            <span className="text-amber-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> HIGH</span>
          </div>
          <div className="pt-3 border-t border-slate-800 flex justify-center">
            <span className="text-amber-500 font-bold font-mono tracking-widest uppercase">
              ABSTAIN
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-800 relative z-10 flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div className="text-sm text-slate-300">
          <strong className="text-white">Active Intelligence:</strong> PHENORA refuses to make a confident prediction.
        </div>
        
        <button
          onClick={handleResolve}
          disabled={isResolving}
          className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
        >
          {isResolving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Acquiring Data...
            </>
          ) : (
            <>
              <BrainCircuit className="w-4 h-4" />
              Acquire Next Measurement
            </>
          )}
        </button>
      </div>
    </div>
  );
}
