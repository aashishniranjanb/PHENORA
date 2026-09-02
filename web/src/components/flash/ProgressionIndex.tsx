import React from "react";
import { ProgressionData } from "@/types/flash";
import { Activity, ArrowUpRight, ArrowRight, ArrowDownRight } from "lucide-react";

interface Props {
  progression?: ProgressionData;
}

export default function ProgressionIndex({ progression }: Props) {
  if (!progression) return null;

  const isAccelerating = progression.velocity > 5;
  const isStable = progression.velocity >= 0 && progression.velocity <= 5;
  const isSuppressing = progression.velocity < 0;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
        <Activity className="w-5 h-5 text-emerald-500" />
        <h2 className="text-lg font-bold text-slate-900">Current Biological State</h2>
        <span className="ml-auto text-xs font-mono bg-amber-50 text-amber-700 px-2 py-1 rounded border border-amber-200">
          PROTOTYPE INDEX
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* IPI Score Display */}
        <div>
          <div className="text-xs font-mono text-slate-500 font-bold mb-2 uppercase tracking-wider">
            Infection Progression Index (IPI)
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-end gap-3">
              <span className="text-5xl font-black text-slate-900 leading-none">{progression.ipi}</span>
              <span className="text-sm font-bold text-slate-400 mb-1">/ 100</span>
            </div>
            
            <div className="w-full max-w-sm h-3 bg-slate-100 rounded-full overflow-hidden flex">
              <div 
                className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 transition-all duration-1000"
                style={{ width: `${progression.ipi}%` }}
              />
            </div>
            
            <div className="flex justify-between max-w-sm text-[10px] font-mono text-slate-400 font-bold uppercase">
              <span>Stable</span>
              <span>Early</span>
              <span>Active</span>
              <span>Critical</span>
            </div>
          </div>
        </div>

        {/* Trajectory Velocity Display */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <div className="text-xs font-mono text-slate-500 font-bold mb-3 uppercase tracking-wider">
            Trajectory Velocity
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${
              isAccelerating ? 'bg-rose-100 text-rose-600 border border-rose-200' :
              isStable ? 'bg-amber-100 text-amber-600 border border-amber-200' :
              'bg-emerald-100 text-emerald-600 border border-emerald-200'
            }`}>
              {isAccelerating ? <ArrowUpRight className="w-6 h-6" /> :
               isStable ? <ArrowRight className="w-6 h-6" /> :
               <ArrowDownRight className="w-6 h-6" />}
            </div>
            
            <div>
              <div className="text-2xl font-black text-slate-900">
                {progression.velocity > 0 ? '+' : ''}{progression.velocity.toFixed(1)} <span className="text-sm text-slate-500">units/hr</span>
              </div>
              <div className={`text-xs font-bold ${
                isAccelerating ? 'text-rose-600' : isStable ? 'text-amber-600' : 'text-emerald-600'
              }`}>
                {isAccelerating ? 'Accelerating Growth' : isStable ? 'Stable' : 'Biological Suppression'}
              </div>
            </div>
          </div>

          <p className="mt-4 text-[11px] text-slate-500 leading-relaxed">
            The progression index combines bacterial burden (B), instantaneous growth rate (μ), metabolic activity (M), and impedance state (Z) into a single trajectory velocity.
          </p>
        </div>
      </div>
    </div>
  );
}
