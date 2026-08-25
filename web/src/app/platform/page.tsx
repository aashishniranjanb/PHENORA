"use client";

import { CheckCircle2, AlertCircle, HelpCircle } from "lucide-react";

export default function Platform() {
  return (
    <div className="bg-[#0A192F] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12">
          <span className="text-[10px] text-[#17B169] font-extrabold tracking-widest uppercase block">Evolution Roadmap</span>
          <h1 className="text-4xl font-extrabold text-white mt-2">The PHENORA Platform</h1>
          <p className="text-gray-400 text-sm mt-2 max-w-2xl leading-relaxed">
            Discover the design transitions from the V1 proof-of-concept hardware prototype to the future V3 fully integrated clinical diagnostic vision.
          </p>
        </div>

        {/* Timeline details */}
        <div className="space-y-12">
          
          {/* V1 Block */}
          <div className="bg-[#081324] border border-gray-800 rounded-xl p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-green-950/40 border border-green-900/60 text-green-400 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
              V1 — Real MVP
            </div>
            
            <h2 className="text-2xl font-extrabold text-white mb-2">PHENORA V1</h2>
            <p className="text-[#17B169] text-xs font-mono font-bold mb-6">Bulk Differential Impedance + Adaptive Edge Computation</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-400 text-xs leading-relaxed mb-4">
                  The V1 architecture establishes the baseline electrical acquisition circuit. It integrates the AD5933 DDS generator, a dual-core ESP32-S3 microcontroller, and an FPGA evaluation module.
                </p>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Its primary purpose is <strong>calibrating the equivalent circuit parameters</strong>, testing noise-filtering filters under artificial incubator temperature drift, and validating the adaptive halting algorithm.
                </p>
              </div>
              
              <div className="bg-[#0A192F] p-5 rounded-lg border border-gray-800/80 text-xs">
                <h4 className="text-white font-bold uppercase tracking-wider mb-3">Verification Milestones</h4>
                <ul className="space-y-2 font-medium">
                  <li className="flex items-center space-x-2 text-gray-300">
                    <CheckCircle2 className="h-4 w-4 text-[#17B169] flex-shrink-0" />
                    <span>AD5933 calibration curves generated</span>
                  </li>
                  <li className="flex items-center space-x-2 text-gray-300">
                    <CheckCircle2 className="h-4 w-4 text-[#17B169] flex-shrink-0" />
                    <span>Heltec I2C communications verified</span>
                  </li>
                  <li className="flex items-center space-x-2 text-gray-300">
                    <CheckCircle2 className="h-4 w-4 text-[#17B169] flex-shrink-0" />
                    <span>FPGA UART reception and filtering active</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* V2 Block */}
          <div className="bg-[#081324] border border-gray-800 rounded-xl p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-yellow-950/40 border border-yellow-900/60 text-yellow-500 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
              V2 — Concept Under Development
            </div>
            
            <h2 className="text-2xl font-extrabold text-white mb-2">PHENORA V2</h2>
            <p className="text-yellow-500 text-xs font-mono font-bold mb-6">Multi-Well Sensing Matrix & Custom ASIC Spec</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-400 text-xs leading-relaxed mb-4">
                  V2 will transition from dual parallel wells to a multi-well diagnostic array card. This matrix allows testing different antibiotic types and concentration gradients simultaneously against a single patient specimen.
                </p>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Design planning involves evaluating high-density electrodes and low-power multi-channel multiplexing architectures.
                </p>
              </div>
              
              <div className="bg-[#0A192F] p-5 rounded-lg border border-gray-800/80 text-xs">
                <h4 className="text-white font-bold uppercase tracking-wider mb-3">Target Specs (Pre-calibration)</h4>
                <ul className="space-y-2 font-medium">
                  <li className="flex items-center space-x-2 text-gray-400">
                    <AlertCircle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                    <span>8-channel multiplexed measurement multiplexer card</span>
                  </li>
                  <li className="flex items-center space-x-2 text-gray-400">
                    <AlertCircle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                    <span>Low-profile planar electrode micro-arrays</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* V3 Block */}
          <div className="bg-[#081324] border border-gray-800 rounded-xl p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-pink-950/40 border border-pink-900/60 text-pink-400 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
              V3 — Future Platform Concept
            </div>
            
            <h2 className="text-2xl font-extrabold text-white mb-2">PHENORA V3</h2>
            <p className="text-pink-400 text-xs font-mono font-bold mb-6">Integrated Diagnostic Analyzer Instrument</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-400 text-xs leading-relaxed mb-4">
                  The V3 platform is the clinical target vision. Conceived as a benchtop diagnostic device hosting single-use cartridge kits, integrating fluidics pumps, on-cartridge sensors, incubator heaters, and a touch-screen analysis interface.
                </p>
                <p className="text-gray-400 text-xs leading-relaxed">
                  No clinical trials or performance figures have been simulated or fabricated for the V3 model. It stands purely as a product direction guideline.
                </p>
              </div>
              
              <div className="bg-[#0A192F] p-5 rounded-lg border border-gray-800/80 text-xs">
                <h4 className="text-white font-bold uppercase tracking-wider mb-3">Planned Features</h4>
                <ul className="space-y-2 font-medium">
                  <li className="flex items-center space-x-2 text-gray-400">
                    <HelpCircle className="h-4 w-4 text-pink-400 flex-shrink-0" />
                    <span>Single-use automated fluidic cartridges</span>
                  </li>
                  <li className="flex items-center space-x-2 text-gray-400">
                    <HelpCircle className="h-4 w-4 text-pink-400 flex-shrink-0" />
                    <span>WiFi telemetry diagnostic dashboard integration</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

