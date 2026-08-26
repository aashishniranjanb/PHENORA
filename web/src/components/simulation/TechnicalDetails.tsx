import React, { useState } from "react";
import StatusBadge from "./StatusBadge";

export default function TechnicalDetails() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-[#081324] border border-gray-800 rounded-xl p-5 shadow-xl transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left text-white font-bold cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#17B169] font-bold tracking-widest uppercase">TECHNICAL DETAILS</span>
          <StatusBadge status="VERIFIED" />
        </div>
        <span className="text-xs text-gray-500 font-mono">{isOpen ? "[- Hide]" : "[+ Expand]"}</span>
      </button>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-gray-800 space-y-4 text-xs text-gray-400">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 leading-relaxed">
            {/* Electrical Physics model */}
            <div>
              <h4 className="text-white text-[11px] font-bold uppercase mb-2 tracking-wide">Randles Impedance Model</h4>
              <p className="mb-2">
                The complex electrical impedance of each well is simulated using the Randles equivalent-circuit model representing the electrolyte-electrode boundary:
              </p>
              <div className="bg-[#0A192F] p-2.5 rounded border border-gray-900 font-mono text-[10px] text-gray-300 mb-2">
                Z(f) = Rs + Rct / (1 + j * 2 * pi * f * Rct * Cdl)
              </div>
              <ul className="list-disc list-inside space-y-1 text-gray-500">
                <li><strong className="text-gray-300">Rs (Solution Resistance):</strong> models bulk electrolyte conductivity and geometry path.</li>
                <li><strong className="text-gray-300">Rct (Charge Transfer Resistance):</strong> models charge leakage across the electrode interface.</li>
                <li><strong className="text-gray-300">Cdl (Double Layer Capacitance):</strong> models ion accumulation capacitance.</li>
              </ul>
            </div>

            {/* FPGA Signal processing logic */}
            <div>
              <h4 className="text-white text-[11px] font-bold uppercase mb-2 tracking-wide">FPGA Signal Processing Chain</h4>
              <p className="mb-2">
                The Verilog-simulated co-processor processes the differential magnitude value ΔF(t) to filter noise and detect stability:
              </p>
              <div className="space-y-1.5 font-mono text-[10px]">
                <div className="bg-[#0A192F] p-1.5 rounded border border-gray-900">
                  <span className="text-gray-500 block text-[8px] uppercase">1. Moving Average Filter (Window N=4)</span>
                  F_filtered[n] = (1/4) * sum(i=0..3, delta_F[n-i])
                </div>
                <div className="bg-[#0A192F] p-1.5 rounded border border-gray-900">
                  <span className="text-gray-500 block text-[8px] uppercase">2. Derivative / Slope (Lag K=4)</span>
                  S[n] = F_filtered[n] - F_filtered[n-4]
                </div>
                <div className="bg-[#0A192F] p-1.5 rounded border border-gray-900">
                  <span className="text-gray-500 block text-[8px] uppercase">3. FSM Stability Logic</span>
                  If |S[n]| &lt; threshold (0.0600) for 15 consecutive samples, state transitions to STOP.
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-4 grid grid-cols-1 md:grid-cols-2 gap-5 leading-relaxed">
            {/* Elmer FEM Config details */}
            <div>
              <h4 className="text-white text-[11px] font-bold uppercase mb-2 tracking-wide">Elmer FEM Solver Configuration</h4>
              <p className="mb-2">
                Finite Element Method calculations solve the electrostatic current conduction equation:
              </p>
              <div className="bg-[#0A192F] p-2.5 rounded border border-gray-900 font-mono text-[10px] text-gray-300">
                div(sigma * grad(V)) = 0
              </div>
              <ul className="list-disc list-inside space-y-1 text-gray-500 mt-2">
                <li><strong className="text-gray-300">Electrodes:</strong> V = 1.0V (anode), V = 0V (cathode).</li>
                <li><strong className="text-gray-300">Chamber boundaries:</strong> dV/dn = 0 (perfect insulation).</li>
                <li><strong className="text-gray-300">Cell Constant (K_cell):</strong> calculated at 2.000 cm^-1 for the parallel gold electrode layout.</li>
              </ul>
            </div>

            {/* V1 Platform constraints */}
            <div>
              <h4 className="text-white text-[11px] font-bold uppercase mb-2 tracking-wide">V1 Constraints & Verilog Details</h4>
              <ul className="list-disc list-inside space-y-1.5 text-gray-500">
                <li>Uses fixed-point arithmetic (16-bit fractional part) to execute logic on iCE40UP5K without floating-point units.</li>
                <li>Avoids square root or division algorithms on-chip to maintain high execution frequency and small FPGA resource utilization.</li>
                <li>Communication payload is serialized via standard UART (8 data bits, no parity, 1 stop bit) at 115200 bps.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
