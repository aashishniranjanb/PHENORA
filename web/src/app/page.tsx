"use client";

import Link from "next/link";
import ProductViewer from "@/components/product/ProductViewer";
import { ShieldAlert, ArrowRight, Activity, Layers, Cpu } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-[#0A192F] min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-28 lg:pb-24 border-b border-gray-900">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#17B169] via-[#0A192F] to-[#0A192F]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#17B169]/10 text-[#17B169] mb-6 border border-[#17B169]/20 tracking-wider uppercase">
              V1 Engineering Prototype Platform
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-none mb-6">
              PHENORA
            </h1>
            <div className="text-xl sm:text-2xl text-gray-300 font-semibold tracking-wide mb-4 text-display">
              <span className="text-[#17B169]">Adaptive Impedance.</span> Biological Precision. Edge Intelligence.
            </div>
            <p className="text-base sm:text-lg text-gray-400 max-w-2xl leading-relaxed mb-8">
              An adaptive differential impedance platform for rapid biological susceptibility measurement. Investigating bulk differential impedance sensing with real-time hardware-accelerated decision loops. Measure continuously, filter environmental noise, and conclude susceptibility as soon as sufficient evidence exists.
            </p>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
              <Link
                href="/spectrae"
                className="inline-flex items-center justify-center px-6 py-3.5 bg-[#17B169] hover:bg-[#139457] text-[#0A192F] font-bold tracking-wider rounded transition-all duration-200 text-sm"
              >
                EXPLORE PHENORA V1 <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/spectrae"
                className="inline-flex items-center justify-center px-6 py-3.5 border border-gray-700 hover:border-gray-500 hover:bg-gray-800/40 text-white font-bold tracking-wider rounded transition-all duration-200 text-sm"
              >
                EXPLORE SPECTRAE
              </Link>
            </div>

            {/* V1 Signal flow chart */}
            <div className="pt-6 border-t border-gray-800">
              <span className="text-[10px] text-[#17B169] font-extrabold tracking-widest uppercase block mb-3">V1 System Signal Pipeline</span>
              <div className="flex flex-wrap items-center gap-2 font-mono text-[9px] sm:text-[10px] text-gray-400">
                <span className="px-2.5 py-1 bg-[#081324] rounded border border-gray-800 text-white font-semibold">SAMPLE</span>
                <span className="text-[#17B169]">→</span>
                <span className="px-2.5 py-1 bg-[#081324] rounded border border-gray-800 text-yellow-500 font-semibold">ELECTRODES</span>
                <span className="text-[#17B169]">→</span>
                <span className="px-2.5 py-1 bg-[#081324] rounded border border-gray-800 text-purple-400 font-semibold">AD5933</span>
                <span className="text-[#17B169]">→</span>
                <span className="px-2.5 py-1 bg-[#081324] rounded border border-gray-800 text-green-400 font-semibold">HELTEC ESP32-S3</span>
                <span className="text-[#17B169]">→</span>
                <span className="px-2.5 py-1 bg-[#081324] rounded border border-gray-800 text-pink-400 font-semibold">FPGA</span>
                <span className="text-[#17B169]">→</span>
                <span className="px-2.5 py-1 bg-[#17B169]/10 text-[#17B169] rounded border border-[#17B169]/30 font-bold">ADAPTIVE DECISION</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-[#081324] border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-1">
              <span className="text-[10px] text-[#17B169] font-extrabold tracking-widest uppercase">The AST Problem</span>
              <h2 className="text-3xl font-extrabold text-white mt-2 mb-6">Why current diagnostics are too slow</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Traditional culture-based AST requires overnight incubation (18–24 hours). In critical care settings, this delay forces clinicians to prescribe broad-spectrum antibiotics, exacerbating patient risks and driving global antimicrobial resistance.
              </p>
            </div>
            
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-[#0A192F] p-6 rounded-lg border border-gray-800 shadow-lg">
                <ShieldAlert className="h-8 w-8 text-red-500 mb-4" />
                <h3 className="text-white text-base font-bold mb-2">Time-to-Result Bottleneck</h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Optical density (OD) measurements require bulk bacterial growth to produce visible turbidity changes, wasting precious hours waiting for geometric cell division.
                </p>
              </div>

              <div className="bg-[#0A192F] p-6 rounded-lg border border-gray-800 shadow-lg">
                <Activity className="h-8 w-8 text-[#ffb703] mb-4" />
                <h3 className="text-white text-base font-bold mb-2">Environmental Drift & Noise</h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Highly sensitive micro-measurements are vulnerable to incubator temperature drifts, which produce impedance changes that mimic growth curves.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Hardware Explorer Section */}
      <section className="py-20 border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[10px] text-[#17B169] font-extrabold tracking-widest uppercase">Physical Architecture</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4">Inside the PHENORA V1 System</h2>
            <p className="text-gray-400 text-sm">
              Click and rotate the active hardware assembly below to inspect the sensor wells, acquisition chips, and real-time edge processing circuits.
            </p>
          </div>

          <ProductViewer />
        </div>
      </section>

      {/* Computational Philosophy / Decision Block */}
      <section className="py-20 bg-[#081324] border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[10px] text-[#17B169] font-extrabold tracking-widest uppercase">Computational Philosophy</span>
              <h2 className="text-3xl font-extrabold text-white mt-2 mb-6">Adaptive Stopping vs. Fixed Duration</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Most AST platforms run for a predefined 8 to 16 hours. PHENORA utilizes hardware-level filters on an FPGA to monitor the slope of the differential impedance signal ($\Delta F(t)$).
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="mt-1 bg-[#17B169]/10 p-1.5 rounded border border-[#17B169]/20">
                    <Layers className="h-4 w-4 text-[#17B169]" />
                  </div>
                  <div>
                    <h4 className="text-white text-xs font-bold uppercase tracking-wider">Common-Mode Rejection</h4>
                    <p className="text-gray-400 text-xs mt-1">Subtracting the control well feature from the test well cancels out temperature fluctuations and medium evaporation.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="mt-1 bg-[#17B169]/10 p-1.5 rounded border border-[#17B169]/20">
                    <Cpu className="h-4 w-4 text-[#17B169]" />
                  </div>
                  <div>
                    <h4 className="text-white text-xs font-bold uppercase tracking-wider">Edge State Engine</h4>
                    <p className="text-gray-400 text-xs mt-1">The FPGA evaluates local stability. The moment the trajectory slope becomes stationary, a STOP command is outputted, halting the test.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#0A192F] p-8 rounded-xl border border-gray-800 flex flex-col justify-center">
              <h3 className="text-white text-base font-bold mb-6 text-center uppercase tracking-widest text-gray-400">FPGA Edge State Flow</h3>
              <div className="space-y-4 font-mono text-xs">
                <div className="bg-gray-900/60 p-3 rounded border border-gray-800 flex items-center justify-between">
                  <span>1. AC Signal Input</span>
                  <span className="text-[#17B169]">100 Hz - 100 kHz</span>
                </div>
                <div className="bg-gray-900/60 p-3 rounded border border-gray-800 flex items-center justify-between">
                  <span>2. Dual ADC DFT</span>
                  <span className="text-[#ffb703]">R + jX registers</span>
                </div>
                <div className="bg-gray-900/60 p-3 rounded border border-gray-800 flex items-center justify-between">
                  <span>3. Differential Filter</span>
                  <span className="text-blue-400">F_test - F_control</span>
                </div>
                <div className="bg-gray-900/60 p-3 rounded border border-gray-800 flex items-center justify-between">
                  <span>4. Adaptive Check</span>
                  <span className="text-[#ff006e]">Evaluate d(ΔF)/dt</span>
                </div>
                <div className="bg-[#17B169]/10 p-3 rounded border border-[#17B169]/30 flex items-center justify-between">
                  <span className="text-[#17B169] font-bold">5. Decision Halt</span>
                  <span className="bg-[#17B169] text-[#0A192F] font-bold px-2 py-0.5 rounded text-[10px]">STOP / REPORT</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Roadmap Timeline */}
      <section className="py-20 border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[10px] text-[#17B169] font-extrabold tracking-widest uppercase">Diagnostic Milestones</span>
            <h2 className="text-3xl font-extrabold text-white mt-2">Evolution of the PHENORA Platform</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="bg-[#081324] p-8 rounded-xl border border-gray-800 shadow-xl relative flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-white text-xl font-bold">V1 — CURRENT</h3>
                  <span className="px-2 py-0.5 rounded bg-[#17B169]/10 text-[#17B169] text-[9px] font-bold tracking-widest uppercase border border-[#17B169]/20">
                    PROTOTYPE
                  </span>
                </div>
                <p className="text-[#17B169] text-xs font-mono font-semibold mb-4 uppercase tracking-wider">BULK DIFFERENTIAL IMPEDANCE</p>
                
                <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-wide mb-2">Components</span>
                <ul className="space-y-1 text-xs text-gray-400 mb-6 list-disc list-inside">
                  <li>Control / Test wells</li>
                  <li>Electrodes</li>
                  <li>AD5933 Chip</li>
                  <li>Heltec ESP32-S3 MCU</li>
                  <li>VSD FPGA State Loop</li>
                  <li>Adaptive decision logic</li>
                </ul>
              </div>
              <div className="text-[10px] text-gray-500 font-bold font-mono border-t border-gray-800/80 pt-3">
                STATUS: COMPUTATIONALLY VERIFIED
              </div>
            </div>

            <div className="bg-[#081324] p-8 rounded-xl border border-gray-800 shadow-xl relative flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-white text-xl font-bold">V2 — UPCOMING</h3>
                  <span className="px-2 py-0.5 rounded bg-yellow-950/40 text-yellow-500 text-[9px] font-bold tracking-widest uppercase border border-yellow-900/20">
                    CONCEPT
                  </span>
                </div>
                <p className="text-yellow-500 text-xs font-mono font-semibold mb-4 uppercase tracking-wider">ADAPTIVE MULTI-FREQUENCY</p>
                
                <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-wide mb-2">Potential Features</span>
                <ul className="space-y-1 text-xs text-gray-400 mb-6 list-disc list-inside">
                  <li>Multi-frequency fingerprints</li>
                  <li>Temperature compensation</li>
                  <li>Electrode condition checks</li>
                  <li>Reference channel isolation</li>
                  <li>Adaptive frequency sweep</li>
                  <li>Improved measurement QC</li>
                </ul>
              </div>
              <div className="text-[10px] text-gray-500 font-bold font-mono border-t border-gray-800/80 pt-3">
                STATUS: UPCOMING (NOT IMPLEMENTED)
              </div>
            </div>

            <div className="bg-[#081324] p-8 rounded-xl border border-gray-800 shadow-xl relative flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-white text-xl font-bold">V3 — FUTURE</h3>
                  <span className="px-2 py-0.5 rounded bg-red-950/40 text-red-400 text-[9px] font-bold tracking-widest uppercase border border-red-900/20">
                    VISION
                  </span>
                </div>
                <p className="text-red-400 text-xs font-mono font-semibold mb-4 uppercase tracking-wider">PRODUCT / ASSAY PLATFORM</p>
                
                <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-wide mb-2">Target Direction</span>
                <ul className="space-y-1 text-xs text-gray-400 mb-6 list-disc list-inside">
                  <li>Disposable automated cartridge</li>
                  <li>On-board sample fluidics</li>
                  <li>Biological AST validation</li>
                  <li>Multi-antibiotic concurrent matrix</li>
                  <li>Rigorous clinical trial validation</li>
                </ul>
              </div>
              <div className="text-[10px] text-gray-500 font-bold font-mono border-t border-gray-800/80 pt-3">
                STATUS: FUTURE
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 27: Final Judge View */}
      <section className="py-20 bg-[#081324] border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[10px] text-[#17B169] font-extrabold tracking-widest uppercase">Start-Up Evaluation</span>
            <h2 className="text-3xl font-extrabold text-white mt-2">What PHENORA Has Proven</h2>
            <p className="text-gray-400 text-sm mt-2">
              A transparent breakdown of computational proofs, active engineering integrations, and remaining medical hurdles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#0A192F] p-6 rounded-xl border border-green-900/40 shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-[#17B169] mb-4 block uppercase tracking-widest font-mono">✓ WHAT WE HAVE PROVEN</span>
                <ul className="space-y-3 text-xs text-gray-300">
                  <li className="flex items-start space-x-2">
                    <span className="text-[#17B169] font-bold">✓</span>
                    <span>Analytical electrical conduction model</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#17B169] font-bold">✓</span>
                    <span>FEM numerical agreement (Elmer StatCurrent solver)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#17B169] font-bold">✓</span>
                    <span>Rigorous mesh convergence (0.0000% error relative to math)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#17B169] font-bold">✓</span>
                    <span>Conductivity perturbation response characterization</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#17B169] font-bold">✓</span>
                    <span>Differential sensing model & common-mode rejection physics</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#17B169] font-bold">✓</span>
                    <span>Adaptive reference halting FSM algorithm in code tests</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-800 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                COMPUTATIONALLY SOLID & VERIFIED
              </div>
            </div>

            <div className="bg-[#0A192F] p-6 rounded-xl border border-yellow-900/40 shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-yellow-500 mb-4 block uppercase tracking-widest font-mono">◐ WHAT WE ARE BUILDING</span>
                <ul className="space-y-3 text-xs text-gray-300">
                  <li className="flex items-start space-x-2">
                    <span className="text-yellow-500 font-bold">◐</span>
                    <span>AD5933 hardware impedance signal acquisition loop</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-yellow-500 font-bold">◐</span>
                    <span>Heltec microcontroller I2C firmware driver loops</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-yellow-500 font-bold">◐</span>
                    <span>FPGA edge hardware moving-average filters & FSM engine</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-800 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                ACTIVE ELECTRONIC DEVELOPMENT
              </div>
            </div>

            <div className="bg-[#0A192F] p-6 rounded-xl border border-red-950 shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-red-400 mb-4 block uppercase tracking-widest font-mono">○ WHAT REMAINS</span>
                <ul className="space-y-3 text-xs text-gray-300">
                  <li className="flex items-start space-x-2">
                    <span className="text-red-500 font-bold">○</span>
                    <span>Biological suspension calibration in controlled media</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-500 font-bold">○</span>
                    <span>AST verification (Minimum Inhibitory Concentration validation)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-500 font-bold">○</span>
                    <span>Clinical trial validation using diagnostic patient specimens</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-800 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                FUTURE CLINICAL MILESTONES
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 28: Final CTA */}
      <section className="py-20 text-center bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#17B169]/10 via-[#0A192F] to-[#0A192F]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 uppercase">
            PHENORA
          </h2>
          <p className="text-lg sm:text-xl text-[#17B169] font-mono italic mb-8">
            "Measure only as much as the evidence requires."
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/spectrae"
              className="px-6 py-3 bg-[#17B169] hover:bg-[#139457] text-[#0A192F] font-bold rounded tracking-wider text-xs transition-all duration-200 uppercase"
            >
              Explore V1
            </Link>
            <Link
              href="/spectrae"
              className="px-6 py-3 border border-gray-750 hover:border-gray-600 hover:bg-gray-800/40 text-white font-bold rounded tracking-wider text-xs transition-all duration-200 uppercase"
            >
              Open SPECTRAE
            </Link>
            <Link
              href="/research"
              className="px-6 py-3 border border-gray-750 hover:border-gray-600 hover:bg-gray-800/40 text-white font-bold rounded tracking-wider text-xs transition-all duration-200 uppercase"
            >
              Research
            </Link>
          </div>
        </div>
      </section>

      {/* Scientific Disclaimer banner */}
      <section className="bg-red-950/20 border-y border-red-900/50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <ShieldAlert className="h-6 w-6 text-red-500 flex-shrink-0" />
            <p className="text-xs text-red-200/80 leading-relaxed max-w-3xl">
              <strong>Mandatory Scientific Disclaimer:</strong> PHENORA is an investigational engineering platform. The mathematical models and circuit schematics are developed to support hardware calibration and computational research. The system is not clinically validated for diagnostic workflows.
            </p>
          </div>
          <Link
            href="/research"
            className="flex-shrink-0 inline-flex items-center text-xs text-[#17B169] hover:underline font-bold"
          >
            VIEW RESEARCH BASIS <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
