"use client";

import Link from "next/link";
import ProductViewer from "@/components/product/ProductViewer";
import { ShieldAlert, ArrowRight, Activity, Layers, Cpu } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-slate-50 min-h-screen text-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-16 lg:pt-24 lg:pb-20 border-b border-slate-200 bg-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-100 via-white to-white"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-[#059669] mb-6 border border-emerald-200 tracking-wider uppercase shadow-sm">
              V1 Engineering Prototype Platform
            </span>
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-none mb-6">
              PHENORA
            </h1>
            <div className="text-xl sm:text-2xl text-slate-700 font-bold tracking-wide mb-4">
              <span className="text-[#059669]">Adaptive Impedance.</span> Biological Precision. Edge Intelligence.
            </div>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed mb-8">
              An adaptive differential impedance platform for rapid biological susceptibility measurement. Investigating bulk differential impedance sensing with real-time hardware-accelerated decision loops. Measure continuously, filter environmental noise, and conclude susceptibility as soon as sufficient evidence exists.
            </p>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
              <Link
                href="/spectrae"
                className="inline-flex items-center justify-center px-6 py-3.5 bg-[#059669] hover:bg-[#047857] text-white font-bold tracking-wider rounded transition-all duration-200 text-sm shadow-md"
              >
                EXPLORE PHENORA V1 <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/spectrae"
                className="inline-flex items-center justify-center px-6 py-3.5 border border-slate-300 hover:border-slate-400 hover:bg-slate-100 text-slate-800 font-bold tracking-wider rounded transition-all duration-200 text-sm shadow-sm"
              >
                EXPLORE SPECTRAE
              </Link>
            </div>

            {/* V1 Signal flow chart */}
            <div className="pt-6 border-t border-slate-200">
              <span className="text-[10px] text-[#059669] font-black tracking-widest uppercase block mb-3">V1 System Signal Pipeline</span>
              <div className="flex flex-wrap items-center gap-2 font-mono text-[9px] sm:text-[10px] text-slate-700">
                <span className="px-2.5 py-1 bg-slate-100 rounded border border-slate-200 text-slate-900 font-bold">SAMPLE</span>
                <span className="text-[#059669] font-bold">→</span>
                <span className="px-2.5 py-1 bg-amber-50 rounded border border-amber-200 text-amber-800 font-bold">ELECTRODES</span>
                <span className="text-[#059669] font-bold">→</span>
                <span className="px-2.5 py-1 bg-purple-50 rounded border border-purple-200 text-purple-800 font-bold">AD5933</span>
                <span className="text-[#059669] font-bold">→</span>
                <span className="px-2.5 py-1 bg-emerald-50 rounded border border-emerald-200 text-emerald-800 font-bold">HELTEC ESP32-S3</span>
                <span className="text-[#059669] font-bold">→</span>
                <span className="px-2.5 py-1 bg-pink-50 rounded border border-pink-200 text-pink-800 font-bold">FPGA</span>
                <span className="text-[#059669] font-bold">→</span>
                <span className="px-2.5 py-1 bg-emerald-100 text-[#059669] rounded border border-emerald-300 font-extrabold">ADAPTIVE DECISION</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-slate-100/80 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-1">
              <span className="text-[10px] text-[#059669] font-black tracking-widest uppercase">The AST Problem</span>
              <h2 className="text-3xl font-black text-slate-900 mt-2 mb-6">Why current diagnostics are too slow</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Traditional culture-based AST requires overnight incubation (18–24 hours). In critical care settings, this delay forces clinicians to prescribe broad-spectrum antibiotics, exacerbating patient risks and driving global antimicrobial resistance.
              </p>
            </div>
            
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <ShieldAlert className="h-8 w-8 text-red-600 mb-4" />
                <h3 className="text-slate-900 text-base font-bold mb-2">Time-to-Result Bottleneck</h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Optical density (OD) measurements require bulk bacterial growth to produce visible turbidity changes, wasting precious hours waiting for geometric cell division.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <Activity className="h-8 w-8 text-amber-500 mb-4" />
                <h3 className="text-slate-900 text-base font-bold mb-2">Environmental Drift & Noise</h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Highly sensitive micro-measurements are vulnerable to incubator temperature drifts, which produce impedance changes that mimic growth curves.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Hardware Explorer Section */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[10px] text-[#059669] font-black tracking-widest uppercase">Physical Architecture</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2 mb-4">Inside the PHENORA System</h2>
            <p className="text-slate-600 text-sm">
              Click and rotate the active hardware assembly below to inspect the dual sensor wells, acquisition chips, and real-time edge processing circuits.
            </p>
          </div>

          <ProductViewer />
        </div>
      </section>

      {/* Hardware Enclosure Prototypes Showcase (V1 & V2) */}
      <section className="py-20 bg-slate-100/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-[10px] text-[#059669] font-black tracking-widest uppercase">Hardware Prototypes</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2 mb-4">PHENORA Enclosure & System Designs</h2>
            <p className="text-slate-600 text-sm">
              From the V1 benchtop prototype to the V2 integrated multi-frequency analyzer architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* V1 Prototype Card */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg hover:shadow-xl transition-all">
              <div className="relative h-72 w-full bg-slate-50 overflow-hidden flex items-center justify-center p-4 border-b border-slate-100">
                <img
                  src="/images/PHENORA V1.png"
                  alt="PHENORA V1 Benchtop Prototype"
                  className="max-h-full max-w-full object-contain rounded-lg hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 px-3 py-1 bg-[#059669] text-white text-[10px] font-black tracking-widest uppercase rounded shadow-sm">
                  V1 PROTOTYPE
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-slate-900 text-xl font-extrabold mb-2 flex items-center justify-between">
                  <span>PHENORA V1 Analyzer</span>
                  <span className="text-[#059669] text-xs font-mono font-bold">30-60 min AST</span>
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-4">
                  Benchtop differential impedance analyzer featuring isolated Control & Test sample wells with integrated 4-point gold electrodes. Driven by NE555 excitation, LM358 signal conditioning, ESP32-S3 ADC, and iCE40UP5K FPGA edge state loop.
                </p>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-800">
                  <div className="bg-emerald-50/80 p-2 rounded border border-emerald-200">✓ Dual Isolated Wells</div>
                  <div className="bg-emerald-50/80 p-2 rounded border border-emerald-200">✓ AC Excitation (NE555)</div>
                  <div className="bg-emerald-50/80 p-2 rounded border border-emerald-200">✓ FPGA Filter Engine</div>
                  <div className="bg-emerald-50/80 p-2 rounded border border-emerald-200">✓ Adaptive FSM Halt</div>
                </div>
              </div>
            </div>

            {/* V2 Prototype Card */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg hover:shadow-xl transition-all">
              <div className="relative h-72 w-full bg-slate-50 overflow-hidden flex items-center justify-center p-4 border-b border-slate-100">
                <img
                  src="/images/PHENORA V2.png"
                  alt="PHENORA V2 Multi-Frequency Analyzer"
                  className="max-h-full max-w-full object-contain rounded-lg hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 px-3 py-1 bg-blue-600 text-white text-[10px] font-black tracking-widest uppercase rounded shadow-sm">
                  V2 NEXT-GEN
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-slate-900 text-xl font-extrabold mb-2 flex items-center justify-between">
                  <span>PHENORA V2 Architecture</span>
                  <span className="text-blue-600 text-xs font-mono font-bold">Multi-Frequency</span>
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-4">
                  Multi-layer stacked enclosure combining an integrated AD5933 Analog Front-End, multi-frequency excitation (R, X, |Z|, phase), temperature sensing & compensation, and an intuitive touchscreen UI with real-time impedance trajectories.
                </p>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-800">
                  <div className="bg-blue-50/80 p-2 rounded border border-blue-200">✓ AD5933 True Impedance</div>
                  <div className="bg-blue-50/80 p-2 rounded border border-blue-200">✓ Temp Compensation</div>
                  <div className="bg-blue-50/80 p-2 rounded border border-blue-200">✓ Multi-Layer Stack</div>
                  <div className="bg-blue-50/80 p-2 rounded border border-blue-200">✓ Live Display & Data</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Computational Philosophy / Decision Block */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[10px] text-[#059669] font-black tracking-widest uppercase">Computational Philosophy</span>
              <h2 className="text-3xl font-black text-slate-900 mt-2 mb-6">Adaptive Stopping vs. Fixed Duration</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Most AST platforms run for a predefined 8 to 16 hours. PHENORA utilizes hardware-level filters on an FPGA to monitor the slope of the differential impedance signal ($\Delta F(t)$).
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="mt-1 bg-emerald-50 p-2 rounded border border-emerald-200">
                    <Layers className="h-4 w-4 text-[#059669]" />
                  </div>
                  <div>
                    <h4 className="text-slate-900 text-xs font-bold uppercase tracking-wider">Common-Mode Rejection</h4>
                    <p className="text-slate-600 text-xs mt-1">Subtracting the control well feature from the test well cancels out temperature fluctuations and medium evaporation.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="mt-1 bg-emerald-50 p-2 rounded border border-emerald-200">
                    <Cpu className="h-4 w-4 text-[#059669]" />
                  </div>
                  <div>
                    <h4 className="text-slate-900 text-xs font-bold uppercase tracking-wider">Edge State Engine</h4>
                    <p className="text-slate-600 text-xs mt-1">The FPGA evaluates local stability. The moment the trajectory slope becomes stationary, a STOP command is outputted, halting the test.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-8 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
              <h3 className="text-slate-900 text-base font-bold mb-6 text-center uppercase tracking-widest text-slate-700">FPGA Edge State Flow</h3>
              <div className="space-y-3 font-mono text-xs">
                <div className="bg-white p-3 rounded border border-slate-200 flex items-center justify-between text-slate-800 shadow-xs">
                  <span>1. AC Signal Input</span>
                  <span className="text-[#059669] font-bold">100 Hz - 100 kHz</span>
                </div>
                <div className="bg-white p-3 rounded border border-slate-200 flex items-center justify-between text-slate-800 shadow-xs">
                  <span>2. Dual ADC DFT</span>
                  <span className="text-amber-600 font-bold">R + jX registers</span>
                </div>
                <div className="bg-white p-3 rounded border border-slate-200 flex items-center justify-between text-slate-800 shadow-xs">
                  <span>3. Differential Filter</span>
                  <span className="text-blue-600 font-bold">F_test - F_control</span>
                </div>
                <div className="bg-white p-3 rounded border border-slate-200 flex items-center justify-between text-slate-800 shadow-xs">
                  <span>4. Adaptive Check</span>
                  <span className="text-purple-600 font-bold">Evaluate d(ΔF)/dt</span>
                </div>
                <div className="bg-emerald-100/70 p-3 rounded border border-emerald-300 flex items-center justify-between">
                  <span className="text-[#059669] font-extrabold">5. Decision Halt</span>
                  <span className="bg-[#059669] text-white font-bold px-2 py-0.5 rounded text-[10px]">STOP / REPORT</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Roadmap Timeline */}
      <section className="py-20 bg-slate-100/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[10px] text-[#059669] font-black tracking-widest uppercase">Diagnostic Milestones</span>
            <h2 className="text-3xl font-black text-slate-900 mt-2">Evolution of the PHENORA Platform</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-md relative flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-slate-900 text-xl font-black">V1 — CURRENT</h3>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-[#059669] text-[9px] font-extrabold tracking-widest uppercase border border-emerald-200">
                    PROTOTYPE
                  </span>
                </div>
                <p className="text-[#059669] text-xs font-mono font-bold mb-4 uppercase tracking-wider">BULK DIFFERENTIAL IMPEDANCE</p>
                
                <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wide mb-2">Components</span>
                <ul className="space-y-1.5 text-xs text-slate-600 mb-6 list-disc list-inside">
                  <li>Control / Test wells</li>
                  <li>Electrodes</li>
                  <li>AD5933 Chip</li>
                  <li>Heltec ESP32-S3 MCU</li>
                  <li>VSD FPGA State Loop</li>
                  <li>Adaptive decision logic</li>
                </ul>
              </div>
              <div className="text-[10px] text-slate-500 font-bold font-mono border-t border-slate-200 pt-3">
                STATUS: COMPUTATIONALLY VERIFIED
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-md relative flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-slate-900 text-xl font-black">V2 — UPCOMING</h3>
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[9px] font-extrabold tracking-widest uppercase border border-amber-200">
                    CONCEPT
                  </span>
                </div>
                <p className="text-amber-700 text-xs font-mono font-bold mb-4 uppercase tracking-wider">ADAPTIVE MULTI-FREQUENCY</p>
                
                <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wide mb-2">Potential Features</span>
                <ul className="space-y-1.5 text-xs text-slate-600 mb-6 list-disc list-inside">
                  <li>Multi-frequency fingerprints</li>
                  <li>Temperature compensation</li>
                  <li>Electrode condition checks</li>
                  <li>Reference channel isolation</li>
                  <li>Adaptive frequency sweep</li>
                  <li>Improved measurement QC</li>
                </ul>
              </div>
              <div className="text-[10px] text-slate-500 font-bold font-mono border-t border-slate-200 pt-3">
                STATUS: UPCOMING (NOT IMPLEMENTED)
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-md relative flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-slate-900 text-xl font-black">V3 — FUTURE</h3>
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[9px] font-extrabold tracking-widest uppercase border border-blue-200">
                    VISION
                  </span>
                </div>
                <p className="text-blue-700 text-xs font-mono font-bold mb-4 uppercase tracking-wider">PRODUCT / ASSAY PLATFORM</p>
                
                <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wide mb-2">Target Direction</span>
                <ul className="space-y-1.5 text-xs text-slate-600 mb-6 list-disc list-inside">
                  <li>Disposable automated cartridge</li>
                  <li>On-board sample fluidics</li>
                  <li>Biological AST validation</li>
                  <li>Multi-antibiotic concurrent matrix</li>
                  <li>Rigorous clinical trial validation</li>
                </ul>
              </div>
              <div className="text-[10px] text-slate-500 font-bold font-mono border-t border-slate-200 pt-3">
                STATUS: FUTURE
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Start-Up Evaluation */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[10px] text-[#059669] font-black tracking-widest uppercase">Start-Up Evaluation</span>
            <h2 className="text-3xl font-black text-slate-900 mt-2">What PHENORA Has Proven</h2>
            <p className="text-slate-600 text-sm mt-2">
              A transparent breakdown of computational proofs, active engineering integrations, and remaining medical hurdles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-6 rounded-xl border border-emerald-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-[#059669] mb-4 block uppercase tracking-widest font-mono">✓ WHAT WE HAVE PROVEN</span>
                <ul className="space-y-3 text-xs text-slate-700">
                  <li className="flex items-start space-x-2">
                    <span className="text-[#059669] font-bold">✓</span>
                    <span>Analytical electrical conduction model</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#059669] font-bold">✓</span>
                    <span>FEM numerical agreement (Elmer StatCurrent solver)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#059669] font-bold">✓</span>
                    <span>Rigorous mesh convergence (0.0000% error relative to math)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#059669] font-bold">✓</span>
                    <span>Conductivity perturbation response characterization</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#059669] font-bold">✓</span>
                    <span>Differential sensing model & common-mode rejection physics</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#059669] font-bold">✓</span>
                    <span>Adaptive reference halting FSM algorithm in code tests</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                COMPUTATIONALLY SOLID & VERIFIED
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-amber-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-amber-600 mb-4 block uppercase tracking-widest font-mono">◐ WHAT WE ARE BUILDING</span>
                <ul className="space-y-3 text-xs text-slate-700">
                  <li className="flex items-start space-x-2">
                    <span className="text-amber-600 font-bold">◐</span>
                    <span>AD5933 hardware impedance signal acquisition loop</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-amber-600 font-bold">◐</span>
                    <span>Heltec microcontroller I2C firmware driver loops</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-amber-600 font-bold">◐</span>
                    <span>FPGA edge hardware moving-average filters & FSM engine</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                ACTIVE ELECTRONIC DEVELOPMENT
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-blue-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-blue-600 mb-4 block uppercase tracking-widest font-mono">○ WHAT REMAINS</span>
                <ul className="space-y-3 text-xs text-slate-700">
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600 font-bold">○</span>
                    <span>Biological suspension calibration in controlled media</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600 font-bold">○</span>
                    <span>AST verification (Minimum Inhibitory Concentration validation)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600 font-bold">○</span>
                    <span>Clinical trial validation using diagnostic patient specimens</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                FUTURE CLINICAL MILESTONES
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 text-center bg-emerald-50/60 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4 uppercase">
            PHENORA
          </h2>
          <p className="text-lg sm:text-xl text-[#059669] font-mono italic mb-8 font-semibold">
            "Measure only as much as the evidence requires."
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/spectrae"
              className="px-6 py-3.5 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded tracking-wider text-xs transition-all duration-200 uppercase shadow-md"
            >
              Explore V1
            </Link>
            <Link
              href="/spectrae"
              className="px-6 py-3.5 border border-slate-300 hover:border-slate-400 hover:bg-white text-slate-800 font-bold rounded tracking-wider text-xs transition-all duration-200 uppercase shadow-sm"
            >
              Open SPECTRAE
            </Link>
            <Link
              href="/research"
              className="px-6 py-3.5 border border-slate-300 hover:border-slate-400 hover:bg-white text-slate-800 font-bold rounded tracking-wider text-xs transition-all duration-200 uppercase shadow-sm"
            >
              Research
            </Link>
          </div>
        </div>
      </section>

      {/* Scientific Disclaimer banner */}
      <section className="bg-red-50 border-y border-red-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <ShieldAlert className="h-6 w-6 text-red-600 flex-shrink-0" />
            <p className="text-xs text-red-950 leading-relaxed max-w-3xl">
              <strong>Mandatory Scientific Disclaimer:</strong> PHENORA is an investigational engineering platform. The mathematical models and circuit schematics are developed to support hardware calibration and computational research. The system is not clinically validated for diagnostic workflows.
            </p>
          </div>
          <Link
            href="/research"
            className="flex-shrink-0 inline-flex items-center text-xs text-red-700 hover:underline font-extrabold"
          >
            VIEW RESEARCH BASIS <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
