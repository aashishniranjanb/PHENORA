import React, { useState } from "react";
import StatusBadge from "./StatusBadge";

export default function TechnicalDetails() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left text-slate-900 font-bold cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#059669] font-black tracking-widest uppercase">TECHNICAL DETAILS</span>
          <StatusBadge status="VERIFIED" />
        </div>
        <span className="text-xs text-slate-500 font-mono font-bold">{isOpen ? "[- Hide]" : "[+ Expand]"}</span>
      </button>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-slate-200 space-y-4 text-xs text-slate-600">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 leading-relaxed">
            {/* Electrical Physics model */}
            <div>
              <h4 className="text-slate-900 text-[11px] font-extrabold uppercase mb-2 tracking-wide">Randles Impedance Model</h4>
              <p className="mb-2">
                The complex electrical impedance of each well is simulated using the Randles equivalent-circuit model representing the electrolyte-electrode boundary:
              </p>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200 font-mono text-[10px] text-slate-900 font-bold mb-2">
                Z(f) = Rs + Rct / (1 + j * 2 * pi * f * Rct * Cdl)
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li><strong className="text-slate-900">Rs (Solution Resistance):</strong> models bulk electrolyte conductivity and geometry path.</li>
                <li><strong className="text-slate-900">Rct (Charge Transfer Resistance):</strong> models charge leakage across the electrode interface.</li>
                <li><strong className="text-slate-900">Cdl (Double Layer Capacitance):</strong> models ion accumulation capacitance.</li>
              </ul>
            </div>

            {/* FPGA Signal processing logic */}
            <div>
              <h4 className="text-slate-900 text-[11px] font-extrabold uppercase mb-2 tracking-wide">FPGA Signal Processing Chain</h4>
              <p className="mb-2">
                The Verilog-simulated co-processor processes the differential magnitude value ΔF(t) to filter noise and detect stability:
              </p>
              <div className="space-y-1.5 font-mono text-[10px]">
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="text-slate-500 block text-[8px] uppercase font-bold">1. Moving Average Filter (Window N=4)</span>
                  <span className="text-slate-900 font-bold">F_filtered[n] = (1/4) * sum(i=0..3, delta_F[n-i])</span>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="text-slate-500 block text-[8px] uppercase font-bold">2. Derivative / Slope (Lag K=4)</span>
                  <span className="text-slate-900 font-bold">S[n] = F_filtered[n] - F_filtered[n-4]</span>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="text-slate-500 block text-[8px] uppercase font-bold">3. FSM Stability Logic</span>
                  <span className="text-slate-900 font-bold">If |S[n]| &lt; threshold (0.0600) for 15 consecutive samples, state transitions to STOP.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
