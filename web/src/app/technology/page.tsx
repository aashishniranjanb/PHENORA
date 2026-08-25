"use client";

import { Cpu, Activity, Zap, Layers, RefreshCw } from "lucide-react";

export default function Technology() {
  return (
    <div className="bg-[#0A192F] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12">
          <span className="text-[10px] text-[#17B169] font-extrabold tracking-widest uppercase">System Specifications</span>
          <h1 className="text-4xl font-extrabold text-white mt-2">Technical Architecture</h1>
          <p className="text-gray-400 text-sm mt-2 max-w-2xl leading-relaxed">
            Deep dive into the electrical interfaces, hardware layers, and digital filtering algorithms powering PHENORA V1.
          </p>
        </div>

        {/* Section 1: What is impedance */}
        <section className="bg-[#081324] border border-gray-800 rounded-xl p-8 mb-12 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-[10px] text-[#17B169] font-bold tracking-widest uppercase block mb-2">Fundamental Physics</span>
              <h2 className="text-2xl font-extrabold text-white mb-4">Electrical Impedance Spectroscopy (EIS)</h2>
              <p className="text-gray-400 text-xs leading-relaxed mb-4">
                Impedance ($Z$) measures a medium's opposition to sinusoidal AC current flow as a function of frequency ($f$). It is expressed as a complex quantity comprising resistance ($R$) and reactance ($X$):
              </p>
              <div className="bg-gray-900/60 p-4 rounded border border-gray-800 font-mono text-center text-[#17B169] text-base mb-4">
                Z(f) = R(f) + jX(f)
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">
                As bacterial cell density increases, cells behave as insulating spheres, decreasing the overall suspension conductivity. By sweeping across frequency bands (100 Hz to 100 kHz), we isolate bulk medium effects from electrode double-layer interface capacitances.
              </p>
            </div>
            
            <div className="border border-gray-800/80 rounded-lg p-6 bg-[#0c1a2f]/40">
              <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-4 text-center">Acquisition Sequence</h3>
              <div className="space-y-3 text-xs font-mono">
                <div className="flex items-center space-x-2">
                  <span className="bg-[#17B169]/15 text-[#17B169] w-6 h-6 rounded-full flex items-center justify-center font-bold">1</span>
                  <span className="text-gray-300">Generate sinusoidal AC excitation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-[#17B169]/15 text-[#17B169] w-6 h-6 rounded-full flex items-center justify-center font-bold">2</span>
                  <span className="text-gray-300">Pass signal through specimen & electrodes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-[#17B169]/15 text-[#17B169] w-6 h-6 rounded-full flex items-center justify-center font-bold">3</span>
                  <span className="text-gray-300">Measure response current via ADC</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-[#17B169]/15 text-[#17B169] w-6 h-6 rounded-full flex items-center justify-center font-bold">4</span>
                  <span className="text-gray-300">Compute Discrete Fourier Transform (DFT)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-[#17B169]/15 text-[#17B169] w-6 h-6 rounded-full flex items-center justify-center font-bold">5</span>
                  <span className="text-gray-300">Extract Real & Imaginary components</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: PHENORA Architecture Diagram */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">Functional Signal Flow</h2>
          <div className="bg-[#081324] border border-gray-800 rounded-xl p-8 overflow-x-auto shadow-xl">
            <div className="min-w-[650px] flex items-center justify-between text-center font-mono text-xs">
              
              <div className="flex flex-col gap-2">
                <div className="bg-[#0A192F] border border-gray-700 p-4 rounded-lg w-28">
                  <span className="text-white block font-bold">CONTROL</span>
                  <span className="text-gray-500 text-[10px]">No Antibiotic</span>
                </div>
                <div className="bg-[#0A192F] border border-gray-700 p-4 rounded-lg w-28">
                  <span className="text-white block font-bold">TEST</span>
                  <span className="text-gray-500 text-[10px]">+ Antibiotic</span>
                </div>
              </div>
              
              <div className="text-gray-500 font-bold">→</div>

              <div className="bg-[#0A192F] border border-yellow-500/40 p-4 rounded-lg w-28 text-yellow-500">
                <span className="block font-bold">ELECTRODES</span>
                <span className="text-[10px] text-gray-500">Current Pick</span>
              </div>
              
              <div className="text-gray-500 font-bold">→</div>

              <div className="bg-[#0A192F] border border-purple-500/40 p-4 rounded-lg w-28 text-purple-400">
                <span className="block font-bold">AD5933</span>
                <span className="text-[10px] text-gray-500">DFT / ADC</span>
              </div>

              <div className="text-gray-500 font-bold">→</div>

              <div className="bg-[#0A192F] border border-green-500/40 p-4 rounded-lg w-28 text-[#17B169]">
                <span className="block font-bold">HELTEC MCU</span>
                <span className="text-[10px] text-gray-500">I2C Control</span>
              </div>

              <div className="text-gray-500 font-bold">→</div>

              <div className="bg-[#0A192F] border border-pink-500/40 p-4 rounded-lg w-32 text-pink-400">
                <span className="block font-bold">FPGA</span>
                <span className="text-[10px] text-gray-500">Adaptive Decision</span>
              </div>
              
            </div>
          </div>
        </section>

        {/* Section 3: Hardware Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          <div className="bg-[#081324] border border-gray-800 p-6 rounded-lg shadow-md">
            <Layers className="h-6 w-6 text-purple-400 mb-3" />
            <h3 className="text-white text-base font-bold mb-1">AD5933 Chip</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Provides the master DDS signal generator and high-speed DFT analyzer. Calibrated using known precision resistors to map pure resistance ratios.
            </p>
          </div>

          <div className="bg-[#081324] border border-gray-800 p-6 rounded-lg shadow-md">
            <Cpu className="h-6 w-6 text-[#17B169] mb-3" />
            <h3 className="text-white text-base font-bold mb-1">Heltec ESP32-S3</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Manages calibration values, calculates impedance magnitudes $|Z|$, and transmits computed single-frequency features via serial communication to the FPGA logic.
            </p>
          </div>

          <div className="bg-[#081324] border border-gray-800 p-6 rounded-lg shadow-md">
            <Activity className="h-6 w-6 text-pink-400 mb-3" />
            <h3 className="text-white text-base font-bold mb-1">FPGA Logic</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Runs hardware-accelerated digital filters (moving average filters) on the differential feature to filter high-frequency noise and calculate local slopes.
            </p>
          </div>

          <div className="bg-[#081324] border border-gray-800 p-6 rounded-lg shadow-md">
            <Zap className="h-6 w-6 text-yellow-500 mb-3" />
            <h3 className="text-white text-base font-bold mb-1">Micro-Wells</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Dual parallel chambers housing biological suspensions. Designed to eliminate spatial discrepancies between control and test.
            </p>
          </div>

        </section>

        {/* Section 4: Edge Intelligence & Adaptive Decision */}
        <section className="bg-[#081324] border border-gray-800 rounded-xl p-8 shadow-xl">
          <h2 className="text-2xl font-extrabold text-white mb-6">FPGA Adaptive stopping logic</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-[#0A192F] p-6 rounded-lg border border-gray-800">
              <span className="text-[10px] text-[#17B169] font-bold tracking-widest uppercase block mb-1">State 1</span>
              <h3 className="text-white text-sm font-bold mb-2">Continuous Measurement</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                The FPGA receives real-time impedance features {"$F_{test}(t)$"} and {"$F_{control}(t)$"}. It computes the differential difference: {"$\\Delta F(t) = F_{test}(t) - F_{control}(t)$"}.
              </p>
            </div>
            
            <div className="bg-[#0A192F] p-6 rounded-lg border border-gray-800">
              <span className="text-[10px] text-yellow-500 font-bold tracking-widest uppercase block mb-1">State 2</span>
              <h3 className="text-white text-sm font-bold mb-2">Slope Evaluation</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                The FPGA computes the derivative of the differential signal: $d(\Delta F)/dt$. If the slope stabilizes (stationary state), it confirms physical susceptibility or resistance.
              </p>
            </div>

            <div className="bg-[#0A192F] p-6 rounded-lg border border-gray-800">
              <span className="text-[10px] text-pink-400 font-bold tracking-widest uppercase block mb-1">State 3</span>
              <h3 className="text-white text-sm font-bold mb-2">Halt Execution</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                When stability is satisfied, the system halts AC excitation and outputs the susceptibility result, preventing unnecessary incubator time.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

