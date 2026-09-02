"use client";

import React from "react";
import PlainTechBlock from "./PlainTechBlock";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

interface MatrixItem {
  feature: string;
  category: "V1 LIVE" | "V2 ROADMAP" | "OUT OF SCOPE";
  status: "LIVE" | "PLANNED" | "NO_CLAIM";
  spec: string;
  explanation: string;
}

const MATRIX_ITEMS: MatrixItem[] = [
  {
    feature: "Stepped Frequency Sweep (100 Hz – 100 kHz)",
    category: "V1 LIVE",
    status: "LIVE",
    spec: "AD5933 AFE, 12-bit ADC, MCLK divider circuit",
    explanation: "Live in V1. Fully captures interfacial double-layer capacitance and liquid metabolite conductivity."
  },
  {
    feature: "Dual-Well Growth Differential (AST)",
    category: "V1 LIVE",
    status: "LIVE",
    spec: "Control well vs Antibiotic wells (4-channel)",
    explanation: "Live in V1. Common-mode thermal drift is subtracted; phenotypic growth rates resolve in under 3 hours."
  },
  {
    feature: "Linear Kramers-Kronig Admissibility Gate",
    category: "V1 LIVE",
    status: "LIVE",
    spec: "Voigt RC Ladder, Chi-Square < 5e-4",
    explanation: "Live in V1. Discards measurements tainted by contact disconnection or motion artifacts."
  },
  {
    feature: "Conformal Uncertainty & Safe Abstention",
    category: "V1 LIVE",
    status: "LIVE",
    spec: "Split-conformal sets (90% target coverage)",
    explanation: "Live in V1. Emits single calls, candidate sets, or explicitly abstains when out-of-distribution."
  },
  {
    feature: "Parallel Multisine FPGA Demodulation",
    category: "V2 ROADMAP",
    status: "PLANNED",
    spec: "iCE40UP5K FPGA + Goertzel filter banks",
    explanation: "Roadmap V2. Allows true simultaneous sub-millisecond excitation across all frequency bins."
  },
  {
    feature: "Broadband 4-Electrode AFE Upgrade",
    category: "V2 ROADMAP",
    status: "PLANNED",
    spec: "Analog Devices AD5940/AD5941 (0 Hz – 200 kHz)",
    explanation: "Roadmap V2. Eliminates 2-electrode contact impedance variations with native potentiostat circuitry."
  },
  {
    feature: "Whole Blood Cellular β-Dispersion",
    category: "OUT OF SCOPE",
    status: "NO_CLAIM",
    spec: "1 MHz to 100 MHz RF Impedance",
    explanation: "Explicitly out of scope for V1. Blood cell membrane relaxations sit above 1 MHz and require specialized RF AFEs."
  },
  {
    feature: "Instant Zero-Incubation AST",
    category: "OUT OF SCOPE",
    status: "NO_CLAIM",
    spec: "Single-point electrical classification",
    explanation: "Physically impossible. Ablation proves electrical reading alone scores only 18.8%; growth biology is mandatory."
  }
];

export default function FeasibilityMatrix() {
  return (
    <PlainTechBlock
      id="feasibility"
      title="Hardware Feasibility & Transparency Matrix"
      plainSummary="We are uncompromisingly clear about what our current hardware does today, what is on the engineering roadmap, and what we do not claim."
      bullets={[
        "Green: Live and operational in the V1 prototype architecture.",
        "Amber: Planned for the V2 hardware upgrade (AD5940 / FPGA multisine).",
        "Red: Out of scope or physically impossible claims we explicitly reject."
      ]}
      status="VERIFIED"
      statusText="ENGINEERING SPEC"
      techTitle="Technical Detail: Component Constraints & Regulatory Anchors"
      technicalDetails={
        <p>
          Hardware feasibility budgets strictly enforce current limits (I_rms &lt; 400 µA),
          frequency bandwidth (3.3 decades on AD5933), and quantization headroom (14529x margin on 12/16-bit ADCs).
        </p>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {MATRIX_ITEMS.map((item, idx) => {
          const isLive = item.status === "LIVE";
          const isPlanned = item.status === "PLANNED";
          const isNoClaim = item.status === "NO_CLAIM";

          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                isLive
                  ? "bg-emerald-50/40 border-emerald-300 shadow-2xs"
                  : isPlanned
                  ? "bg-amber-50/40 border-amber-300 shadow-2xs"
                  : "bg-slate-50 border-slate-200 opacity-80"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-mono font-bold text-xs text-slate-900">
                    {item.feature}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-[8.5px] font-mono font-black uppercase px-2 py-0.5 rounded border ${
                      isLive
                        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                        : isPlanned
                        ? "bg-amber-100 text-amber-800 border-amber-300"
                        : "bg-red-100 text-red-800 border-red-300"
                    }`}
                  >
                    {isLive && <CheckCircle2 className="w-3 h-3" />}
                    {isPlanned && <Clock className="w-3 h-3" />}
                    {isNoClaim && <XCircle className="w-3 h-3" />}
                    <span>{item.category}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-600 font-medium leading-relaxed mb-2">
                  {item.explanation}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/80 text-[10px] font-mono text-slate-500">
                <span className="text-slate-400">Hardware Spec: </span>
                <span className="text-slate-700 font-bold">{item.spec}</span>
              </div>
            </div>
          );
        })}
      </div>
    </PlainTechBlock>
  );
}
