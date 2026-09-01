"use client";

import { useState } from "react";
import { Cpu, Activity, Zap, Layers, RefreshCw, ArrowRight, X } from "lucide-react";
import Image from "next/image";
import BorderGlow from "@/components/ui/BorderGlow";

export default function Technology() {
  const [previewImage, setPreviewImage] = useState<string>("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <div className="bg-slate-50 min-h-screen py-16 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm mb-12">
          <span className="text-[10px] text-[#059669] font-black tracking-widest uppercase">System Specifications</span>
          <h1 className="text-4xl font-black text-slate-900 mt-2">Technical Architecture</h1>
          <p className="text-slate-600 text-sm mt-2 max-w-2xl leading-relaxed font-medium">
            Deep dive into the electrical interfaces, hardware layers, and digital filtering algorithms powering PHENORA V1 through V3 roadmap evolution.
          </p>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            ARCHITECTURE EVOLUTION — V1 / V2 / V3
            ═══════════════════════════════════════════════════════════════ */}
        <section className="mb-14">
          <div className="text-center mb-10">
            <span className="text-[10px] text-[#059669] font-black tracking-widest uppercase">Architecture Roadmap</span>
            <h2 className="text-3xl font-black text-slate-900 mt-2 mb-3">PHENORA Architecture Evolution</h2>
            <p className="text-slate-600 text-sm max-w-xl mx-auto font-medium">
              From a single-frequency benchtop prototype to a multi-well, multi-frequency clinical-grade architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* V1 ARCH */}
            <BorderGlow glowColor="16, 185, 129" borderRadius={16}>
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg hover:shadow-xl transition-all group h-full w-full flex flex-col">
                <div className="relative h-64 w-full bg-slate-50 overflow-hidden flex items-center justify-center p-4 border-b border-slate-100">
                  <img
                    src="/images/PHENORA V1 ARCH.png"
                    alt="PHENORA V1 Architecture Diagram"
                    className="max-h-full max-w-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                    onClick={() => { setPreviewImage("/images/PHENORA V1 ARCH.png"); setIsPreviewOpen(true); }}
                  />
                  <span className="absolute top-4 left-4 px-3 py-1 bg-[#059669] text-white text-[10px] font-black tracking-widest uppercase rounded shadow-sm">
                    V1 Architecture
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-slate-900 text-xl font-extrabold mb-2">V1 — Single Frequency Prototype</h3>
                  <p className="text-slate-600 text-xs leading-relaxed mb-4">
                    NE555 AC excitation → 4-electrode dual wells → LM358 signal conditioning → ESP32-S3 ADC → iCE40UP5K FPGA adaptive halt FSM. First demonstration of closed-loop impedance-based susceptibility testing.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-800">
                    <div className="bg-emerald-50/80 p-2 rounded border border-emerald-200 font-bold">✓ Single-Freq NE555</div>
                    <div className="bg-emerald-50/80 p-2 rounded border border-emerald-200 font-bold">✓ FPGA FSM Edge</div>
                    <div className="bg-emerald-50/80 p-2 rounded border border-emerald-200 font-bold">✓ Dual Isolated Wells</div>
                    <div className="bg-emerald-50/80 p-2 rounded border border-emerald-200 font-bold">✓ 30–60 min Target</div>
                  </div>
                </div>
              </div>
            </BorderGlow>

            {/* V2 ARCH */}
            <BorderGlow glowColor="249, 115, 22" borderRadius={16}>
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg hover:shadow-xl transition-all group h-full w-full flex flex-col">
                <div className="relative h-64 w-full bg-slate-50 overflow-hidden flex items-center justify-center p-4 border-b border-slate-100">
                  <img
                    src="/images/PHENORA V2 ARCH.png"
                    alt="PHENORA V2 Architecture Diagram"
                    className="max-h-full max-w-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                    onClick={() => { setPreviewImage("/images/PHENORA V2 ARCH.png"); setIsPreviewOpen(true); }}
                  />
                  <span className="absolute top-4 left-4 px-3 py-1 bg-blue-600 text-white text-[10px] font-black tracking-widest uppercase rounded shadow-sm">
                    V2 Architecture
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-slate-900 text-xl font-extrabold mb-2">V2 — Multi-Frequency Analyzer</h3>
                  <p className="text-slate-600 text-xs leading-relaxed mb-4">
                    Replaces NE555 with AD5933 monolithic impedance IC for true multi-frequency sweeps (100 Hz–100 kHz). Temperature compensation via integrated sensor. Enhanced OLED real-time display.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-800">
                    <div className="bg-blue-50/80 p-2 rounded border border-blue-200 font-bold">✓ AD5933 True Z(f)</div>
                    <div className="bg-blue-50/80 p-2 rounded border border-blue-200 font-bold">✓ Temp Compensation</div>
                    <div className="bg-blue-50/80 p-2 rounded border border-blue-200 font-bold">✓ Multi-Layer Stack</div>
                    <div className="bg-blue-50/80 p-2 rounded border border-blue-200 font-bold">✓ OLED Live Display</div>
                  </div>
                </div>
              </div>
            </BorderGlow>

            {/* V3 ARCH */}
            <BorderGlow glowColor="168, 85, 247" borderRadius={16}>
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg hover:shadow-xl transition-all group h-full w-full flex flex-col">
                <div className="relative h-64 w-full bg-slate-50 overflow-hidden flex items-center justify-center p-4 border-b border-slate-100">
                  <img
                    src="/images/PHENORA V3 ARCH.png"
                    alt="PHENORA V3 Architecture Diagram"
                    className="max-h-full max-w-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                    onClick={() => { setPreviewImage("/images/PHENORA V3 ARCH.png"); setIsPreviewOpen(true); }}
                  />
                  <span className="absolute top-4 left-4 px-3 py-1 bg-purple-600 text-white text-[10px] font-black tracking-widest uppercase rounded shadow-sm">
                    V3 Architecture
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-slate-900 text-xl font-extrabold mb-2">V3 — Clinical-Grade Platform</h3>
                  <p className="text-slate-600 text-xs leading-relaxed mb-4">
                    Multi-well cartridge system, onboard microfluidics, cloud telemetry pipeline, and ML-augmented resistance classification. Designed for regulatory pathway compliance.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-800">
                    <div className="bg-purple-50/80 p-2 rounded border border-purple-200 font-bold">✓ Multi-Well Cartridge</div>
                    <div className="bg-purple-50/80 p-2 rounded border border-purple-200 font-bold">✓ Cloud Telemetry</div>
                    <div className="bg-purple-50/80 p-2 rounded border border-purple-200 font-bold">✓ ML Classification</div>
                    <div className="bg-purple-50/80 p-2 rounded border border-purple-200 font-bold">✓ Regulatory Ready</div>
                  </div>
                </div>
              </div>
            </BorderGlow>
          </div>
        </section>

        {/* Section 1: What is impedance */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 mb-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-[10px] text-[#059669] font-black tracking-widest uppercase block mb-2">Fundamental Physics</span>
              <h2 className="text-2xl font-black text-slate-900 mb-4">Electrical Impedance Spectroscopy (EIS)</h2>
              <p className="text-slate-600 text-xs leading-relaxed mb-4 font-medium">
                Impedance ($Z$) measures a medium's opposition to sinusoidal AC current flow as a function of frequency ($f$). It is expressed as a complex quantity comprising resistance ($R$) and reactance ($X$):
              </p>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 font-mono text-center text-[#059669] text-base font-black mb-4">
                Z(f) = R(f) + jX(f)
              </div>
              <p className="text-slate-600 text-xs leading-relaxed font-medium">
                As bacterial cell density increases, cells behave as insulating spheres, decreasing the overall suspension conductivity. By sweeping across frequency bands (100 Hz to 100 kHz), we isolate bulk medium effects from electrode double-layer interface capacitances.
              </p>
            </div>
            
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <h3 className="text-slate-900 text-xs font-extrabold uppercase tracking-wider mb-4 text-center">Acquisition Sequence</h3>
              <div className="space-y-3 text-xs font-mono">
                <div className="flex items-center space-x-2">
                  <span className="bg-emerald-100 text-[#059669] w-7 h-7 rounded-full flex items-center justify-center font-black text-sm">1</span>
                  <span className="text-slate-800 font-bold">Generate sinusoidal AC excitation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-emerald-100 text-[#059669] w-7 h-7 rounded-full flex items-center justify-center font-black text-sm">2</span>
                  <span className="text-slate-800 font-bold">Pass signal through specimen & electrodes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-emerald-100 text-[#059669] w-7 h-7 rounded-full flex items-center justify-center font-black text-sm">3</span>
                  <span className="text-slate-800 font-bold">Measure response current via ADC</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-emerald-100 text-[#059669] w-7 h-7 rounded-full flex items-center justify-center font-black text-sm">4</span>
                  <span className="text-slate-800 font-bold">Compute Discrete Fourier Transform (DFT)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-emerald-100 text-[#059669] w-7 h-7 rounded-full flex items-center justify-center font-black text-sm">5</span>
                  <span className="text-slate-800 font-bold">Extract Real & Imaginary components</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Hardware Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          <BorderGlow glowColor="168, 85, 247" borderRadius={12}>
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all h-full w-full">
              <Layers className="h-6 w-6 text-purple-600 mb-3" />
              <h3 className="text-slate-900 text-base font-extrabold mb-1">AD5933 Chip</h3>
              <p className="text-slate-600 text-xs leading-relaxed font-medium">
                Provides the master DDS signal generator and high-speed DFT analyzer. Calibrated using known precision resistors to map pure resistance ratios.
              </p>
            </div>
          </BorderGlow>

          <BorderGlow glowColor="16, 185, 129" borderRadius={12}>
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all h-full w-full">
              <Cpu className="h-6 w-6 text-[#059669] mb-3" />
              <h3 className="text-slate-900 text-base font-extrabold mb-1">Heltec ESP32-S3</h3>
              <p className="text-slate-600 text-xs leading-relaxed font-medium">
                Manages calibration values, calculates impedance magnitudes $|Z|$, and transmits computed single-frequency features via serial communication to the FPGA logic.
              </p>
            </div>
          </BorderGlow>

          <BorderGlow glowColor="236, 72, 153" borderRadius={12}>
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all h-full w-full">
              <Activity className="h-6 w-6 text-pink-500 mb-3" />
              <h3 className="text-slate-900 text-base font-extrabold mb-1">FPGA Logic</h3>
              <p className="text-slate-600 text-xs leading-relaxed font-medium">
                Runs hardware-accelerated digital filters (moving average filters) on the differential feature to filter high-frequency noise and calculate local slopes.
              </p>
            </div>
          </BorderGlow>

          <BorderGlow glowColor="245, 158, 11" borderRadius={12}>
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all h-full w-full">
              <Zap className="h-6 w-6 text-amber-500 mb-3" />
              <h3 className="text-slate-900 text-base font-extrabold mb-1">Micro-Wells</h3>
              <p className="text-slate-600 text-xs leading-relaxed font-medium">
                Dual parallel chambers housing biological suspensions. Designed to eliminate spatial discrepancies between control and test.
              </p>
            </div>
          </BorderGlow>

        </section>

        {/* Section 4: Edge Intelligence & Adaptive Decision */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-black text-slate-900 mb-6">FPGA Adaptive Stopping Logic</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <BorderGlow glowColor="16, 185, 129" borderRadius={12}>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 h-full w-full">
                <span className="text-[10px] text-[#059669] font-black tracking-widest uppercase block mb-1">State 1</span>
                <h3 className="text-slate-900 text-sm font-extrabold mb-2">Continuous Measurement</h3>
                <p className="text-slate-600 text-xs leading-relaxed font-medium">
                  The FPGA receives real-time impedance features {"$F_{test}(t)$"} and {"$F_{control}(t)$"}. It computes the differential difference: {"$\\Delta F(t) = F_{test}(t) - F_{control}(t)$"}.
                </p>
              </div>
            </BorderGlow>
            
            <BorderGlow glowColor="245, 158, 11" borderRadius={12}>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 h-full w-full">
                <span className="text-[10px] text-amber-600 font-black tracking-widest uppercase block mb-1">State 2</span>
                <h3 className="text-slate-900 text-sm font-extrabold mb-2">Slope Evaluation</h3>
                <p className="text-slate-600 text-xs leading-relaxed font-medium">
                  The FPGA computes the derivative of the differential signal: $d(\Delta F)/dt$. If the slope stabilizes (stationary state), it confirms physical susceptibility or resistance.
                </p>
              </div>
            </BorderGlow>

            <BorderGlow glowColor="236, 72, 153" borderRadius={12}>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 h-full w-full">
                <span className="text-[10px] text-pink-600 font-black tracking-widest uppercase block mb-1">State 3</span>
                <h3 className="text-slate-900 text-sm font-extrabold mb-2">Halt Execution</h3>
                <p className="text-slate-600 text-xs leading-relaxed font-medium">
                  When stability is satisfied, the system halts AC excitation and outputs the susceptibility result, preventing unnecessary incubator time.
                </p>
              </div>
            </BorderGlow>
          </div>
        </section>

      </div>

      {/* Image Preview Modal - Persistent DOM node for zero-lag transitions */}
      <div 
        className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4 sm:p-8 cursor-pointer transition-opacity duration-300 ease-in-out will-change-opacity ${isPreviewOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsPreviewOpen(false)}
      >
        <button 
          className="absolute top-6 right-6 sm:top-8 sm:right-8 z-50 text-white/70 hover:text-white bg-slate-800/50 hover:bg-slate-700 p-2.5 rounded-full backdrop-blur-md transition-all shadow-lg"
          onClick={(e) => { e.stopPropagation(); setIsPreviewOpen(false); }}
          aria-label="Close preview"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className={`relative w-full h-full max-w-5xl max-h-[90vh] flex items-center justify-center transition-all duration-300 ease-out will-change-transform ${isPreviewOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          {previewImage && (
            <img 
              src={previewImage} 
              alt="Architecture Preview" 
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl drop-shadow-2xl cursor-default"
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      </div>
    </div>
  );
}
