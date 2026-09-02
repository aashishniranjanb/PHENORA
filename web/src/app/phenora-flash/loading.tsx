import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-sm w-full text-center">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-[#059669] animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="w-3 h-3 rounded-full bg-[#059669] animate-pulse" />
          </div>
        </div>
        <div>
          <h3 className="font-mono font-bold text-sm text-slate-900 uppercase tracking-wider">
            Loading PHENORA Flash
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Initializing autonomous predictive bioimpedance twin...
          </p>
        </div>
      </div>
    </div>
  );
}
