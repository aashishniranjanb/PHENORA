import React from "react";
import { Clock, CheckCircle } from "lucide-react";

export default function PredictionClock() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-full flex flex-col justify-center">
      <div className="text-center mb-8">
        <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-1">
          Predictive Horizon
        </h3>
        <p className="text-[10px] text-slate-400">Continuous Forward Simulation</p>
      </div>

      <div className="relative w-48 h-48 mx-auto mb-8">
        {/* Clock Circle */}
        <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
        <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent border-r-transparent transform -rotate-45" />
        
        {/* Clock Ticks */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-mono text-slate-400 font-bold">NOW</div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 font-bold">+1h</div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-mono text-slate-400 font-bold">+2h</div>
        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 font-bold">+3h</div>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Clock className="w-6 h-6 text-purple-500 mb-1" />
          <span className="text-2xl font-black text-slate-900 leading-none">2.0 h</span>
        </div>
      </div>

      <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 text-center">
        <p className="text-xs text-purple-800 font-medium leading-relaxed">
          At this point, the twin predicts continued active growth with <strong>91% calibrated confidence</strong>.
        </p>
        <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] font-bold font-mono text-purple-600 bg-white border border-purple-100 py-1 px-3 rounded-full mx-auto w-fit">
          <CheckCircle className="w-3 h-3" />
          CALIBRATED
        </div>
      </div>
    </div>
  );
}
