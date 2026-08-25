"use client";

import Link from "next/link";
import ProductViewer from "@/components/product/ProductViewer";
import { ShieldAlert, Cpu, Activity, ArrowRight, Layers, FileText } from "lucide-react";

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
            <p className="text-xl sm:text-2xl text-gray-300 font-semibold tracking-wide mb-4 text-display">
              Adaptive Impedance Intelligence for Rapid AST
            </p>
            <p className="text-base sm:text-lg text-gray-400 max-w-2xl leading-relaxed mb-8">
              Investigating bulk differential impedance sensing with real-time hardware-accelerated decision loops. Measure continuously, filter environmental noise, and conclude susceptibility as soon as sufficient evidence exists.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/simulation"
                className="inline-flex items-center justify-center px-6 py-3.5 bg-[#17B169] hover:bg-[#139457] text-[#0A192F] font-bold tracking-wider rounded transition-all duration-200 text-sm"
              >
                EXPLORE V1 SIMULATOR <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/technology"
                className="inline-flex items-center justify-center px-6 py-3.5 border border-gray-700 hover:border-gray-500 hover:bg-gray-800/40 text-white font-bold tracking-wider rounded transition-all duration-200 text-sm"
              >
                RESEARCH & ARCHITECTURE
              </Link>
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
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[10px] text-[#17B169] font-extrabold tracking-widest uppercase">Diagnostic Milestones</span>
            <h2 className="text-3xl font-extrabold text-white mt-2">Evolution of the PHENORA Platform</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="bg-[#081324] p-8 rounded-xl border border-gray-800 shadow-xl relative">
              <span className="absolute top-4 right-4 px-2 py-0.5 rounded bg-[#17B169]/25 text-[#17B169] text-[9px] font-bold tracking-widest uppercase">Current V1</span>
              <h3 className="text-white text-xl font-bold mb-3">V1 Prototype</h3>
              <p className="text-gray-500 text-xs font-semibold mb-4 uppercase tracking-wider">Electrical & FPGA Validation</p>
              <p className="text-gray-400 text-xs leading-relaxed">
                Demonstrates bulk differential measurements and microchip synchronization. Provides the hardware foundation for computational model training.
              </p>
            </div>

            <div className="bg-[#081324] p-8 rounded-xl border border-gray-800 shadow-xl relative">
              <span className="absolute top-4 right-4 px-2 py-0.5 rounded bg-gray-800 text-gray-500 text-[9px] font-bold tracking-widest uppercase">Upcoming V2</span>
              <h3 className="text-white text-xl font-bold mb-3">V2 Concept</h3>
              <p className="text-[#ffb703] text-xs font-semibold mb-4 uppercase tracking-wider">Under Development</p>
              <p className="text-gray-400 text-xs leading-relaxed">
                Will integrate micro-well sensor matrix layouts and upgraded electrode systems for testing multiple antibiotics concurrently.
              </p>
            </div>

            <div className="bg-[#081324] p-8 rounded-xl border border-gray-800 shadow-xl relative">
              <span className="absolute top-4 right-4 px-2 py-0.5 rounded bg-gray-800 text-gray-500 text-[9px] font-bold tracking-widest uppercase">Upcoming V3</span>
              <h3 className="text-white text-xl font-bold mb-3">V3 Platform</h3>
              <p className="text-[#ff006e] text-xs font-semibold mb-4 uppercase tracking-wider">Future Diagnostic Vision</p>
              <p className="text-gray-400 text-xs leading-relaxed">
                Conceived as a fully integrated, automated clinical Susceptibility Testing instrument, combining microfluidics and on-board telemetry.
              </p>
            </div>
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
