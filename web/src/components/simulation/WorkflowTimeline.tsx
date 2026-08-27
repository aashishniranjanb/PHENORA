import React from "react";

export interface WorkflowStep {
  phase: number;
  label: string;
  desc: string;
  compId: string;
}

interface WorkflowTimelineProps {
  activePhase: number | null;
  currentStep: number; // 0 to 7 based on state
}

const STEPS = [
  { id: "01", label: "SAMPLE", desc: "Dual chambers ready with baseline medium & cellular inclusion loading." },
  { id: "02", label: "ELECTRODES", desc: "Gold interface submerged. High-frequency AC excitation initiated." },
  { id: "03", label: "IMPEDANCE ACQUISITION", desc: "AD5933 performs on-board DFT. Raw Real & Imaginary registers compiled." },
  { id: "04", label: "DIFFERENTIAL SIGNAL", desc: "ESP32-S3 formats feature packet. FPGA calculates differential ΔF (Test - Control)." },
  { id: "05", label: "QUALITY CHECK", desc: "Drift rejection check. Evaluates SNR, temperature indices, and calibration." },
  { id: "06", label: "EDGE ANALYSIS", desc: "iCE40 FPGA executes N=4 moving-average filters & K=4 derivative calculations." },
  { id: "07", label: "DECISION", desc: "FSM stability counter triggers Stop or Measure Again." },
];

export default function WorkflowTimeline({ activePhase, currentStep }: WorkflowTimelineProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div className="mb-4">
        <span className="text-[10px] text-[#059669] font-black tracking-widest uppercase block">PHENORA MEASUREMENT WORKFLOW</span>
        <h3 className="text-slate-900 text-base font-extrabold">Synchronized Processing Timeline</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {STEPS.map((step, idx) => {
          const isCompleted = currentStep > idx;
          const isActive = currentStep === idx || activePhase === idx;

          let statusText = "WAITING";
          let borderCls = "border-slate-200 bg-slate-50 text-slate-500";
          
          if (isCompleted) {
            statusText = "✓ DONE";
            borderCls = "border-emerald-200 bg-emerald-50 text-emerald-800 font-semibold";
          } else if (isActive) {
            statusText = "ACTIVE";
            borderCls = "border-[#059669] bg-emerald-100/70 text-[#059669] shadow-sm font-bold";
          }

          return (
            <div
              key={step.id}
              className={`border rounded-lg p-3 flex flex-col justify-between min-h-[100px] transition-all duration-300 ${borderCls}`}
            >
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] font-mono font-bold text-slate-700">{step.id} {step.label}</span>
                  <span className="text-[7.5px] font-bold font-mono px-1.5 py-0.5 rounded bg-white border border-slate-200 shadow-2xs">{statusText}</span>
                </div>
                <p className="text-[9px] text-slate-600 leading-snug font-medium">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
