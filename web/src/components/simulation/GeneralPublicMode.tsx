import React from "react";

export default function GeneralPublicMode() {
  return (
    <div className="bg-[#081324] border border-gray-800 rounded-xl p-5 shadow-xl">
      <span className="text-[10px] text-[#17B169] font-bold tracking-widest uppercase block mb-3">General Public Explainer</span>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0A192F]/50 p-3.5 rounded-lg border border-gray-800/80">
          <h4 className="text-white text-xs font-bold mb-1 uppercase tracking-wide">What is Impedance?</h4>
          <p className="text-gray-400 text-[10px] leading-relaxed">
            Impedance describes how a material or biological sample resists or shifts an applied electrical signal. By analyzing impedance at different frequencies, we can infer cell loading density in the chamber.
          </p>
        </div>

        <div className="bg-[#0A192F]/50 p-3.5 rounded-lg border border-gray-800/80">
          <h4 className="text-white text-xs font-bold mb-1 uppercase tracking-wide">What is Differential?</h4>
          <p className="text-gray-400 text-[10px] leading-relaxed">
            PHENORA measures two chambers side-by-side: a control well and a test well. Subtracting the control signal from the test signal cancels out environmental noise like temperature drift.
          </p>
        </div>

        <div className="bg-[#0A192F]/50 p-3.5 rounded-lg border border-gray-800/80">
          <h4 className="text-white text-xs font-bold mb-1 uppercase tracking-wide">What does Adaptive mean?</h4>
          <p className="text-gray-400 text-[10px] leading-relaxed">
            Instead of running for a fixed 8–16 hours, the system monitors signal slope in real-time. It halts the test immediately once stability is reached, saving precious hours in diagnostics.
          </p>
        </div>
      </div>
    </div>
  );
}
