import React from "react";

export default function GeneralPublicMode() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <span className="text-[10px] text-[#059669] font-black tracking-widest uppercase block mb-3">General Public Explainer</span>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <h4 className="text-slate-900 text-xs font-extrabold mb-1 uppercase tracking-wide">What is Impedance?</h4>
          <p className="text-slate-600 text-[10px] leading-relaxed font-medium">
            Impedance describes how a material or biological sample resists or shifts an applied electrical signal. By analyzing impedance at different frequencies, we can infer cell loading density in the chamber.
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <h4 className="text-slate-900 text-xs font-extrabold mb-1 uppercase tracking-wide">What is Differential?</h4>
          <p className="text-slate-600 text-[10px] leading-relaxed font-medium">
            PHENORA measures two chambers side-by-side: a control well and a test well. Subtracting the control signal from the test signal cancels out environmental noise like temperature drift.
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <h4 className="text-slate-900 text-xs font-extrabold mb-1 uppercase tracking-wide">What does Adaptive mean?</h4>
          <p className="text-slate-600 text-[10px] leading-relaxed font-medium">
            Instead of running for a fixed 8–16 hours, the system monitors signal slope in real-time. It halts the test immediately once stability is reached, saving precious hours in diagnostics.
          </p>
        </div>
      </div>
    </div>
  );
}
