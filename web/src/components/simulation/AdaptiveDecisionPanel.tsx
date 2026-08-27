import React from "react";
import StatusBadge from "./StatusBadge";

interface AdaptiveDecisionPanelProps {
  state: string; // FSM state
  signal: number; // delta_F
  slope: number;
  noise: number; // simulated
  measurementCount: number;
  stabilityText: string;
}

export default function AdaptiveDecisionPanel({
  state,
  signal,
  slope,
  noise,
  measurementCount,
  stabilityText,
}: AdaptiveDecisionPanelProps) {
  // Map internal state to styling
  let stateLabel = state;
  let bgBorderCls = "bg-slate-100 border-slate-300 text-slate-700";
  let description = "Engine idle. Awaiting measurement start.";

  switch (state) {
    case "READY":
      stateLabel = "READY";
      bgBorderCls = "bg-slate-100 border-slate-300 text-slate-800";
      description = "Chamber calibrated. Electrodes initialized.";
      break;
    case "INITIALIZING":
      stateLabel = "INITIALIZING";
      bgBorderCls = "bg-blue-50 border-blue-200 text-blue-800";
      description = "Bootstrapping hardware interfaces. AD5933 clock lock check.";
      break;
    case "BASELINE":
      stateLabel = "BASELINE";
      bgBorderCls = "bg-purple-50 border-purple-200 text-purple-800";
      description = "Calibrating temperature common-mode offsets and broth parameters.";
      break;
    case "MEASURING":
      stateLabel = "MEASURING";
      bgBorderCls = "bg-blue-100/70 border-blue-300 text-blue-900";
      description = "Accumulating differential registers. Baseline stable, accumulating slope windows.";
      break;
    case "ANALYZING":
      stateLabel = "ANALYZING";
      bgBorderCls = "bg-amber-100/70 border-amber-300 text-amber-900 animate-pulse";
      description = "iCE40 FPGA performing N=4 moving average derivative analysis.";
      break;
    case "QUALITY_CHECK":
      stateLabel = "QUALITY CHECK";
      bgBorderCls = "bg-purple-100 border-purple-300 text-purple-900";
      description = "Evaluating drift coefficients and SNR envelope bounds.";
      break;
    case "MEASURE_AGAIN":
      stateLabel = "MEASURE AGAIN";
      bgBorderCls = "bg-amber-100 border-amber-300 text-amber-900";
      description = "Differential slope has not yet settled within threshold limits. Initiating next sample loop.";
      break;
    case "STOP":
      stateLabel = "STOP";
      bgBorderCls = "bg-emerald-100 border-emerald-300 text-emerald-900";
      description = "FSM halting trigger issued: differential trajectory slope is stable.";
      break;
    case "INVALID":
      stateLabel = "INVALID MEASUREMENT";
      bgBorderCls = "bg-red-100 border-red-300 text-red-900";
      description = "Signal quality criteria violated. Broth drift or electrode mismatch detected. Please recalibrate.";
      break;
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] text-[#059669] font-black tracking-widest uppercase">DECISION ENGINE</span>
              <StatusBadge status="COMPUTATIONAL DEMONSTRATION" />
            </div>
            <h3 className="text-slate-900 text-base font-extrabold">Adaptive Edge Decision</h3>
          </div>
        </div>

        {/* Big state indicator card */}
        <div className={`p-4 rounded-lg border text-center mb-4 transition-all duration-300 ${bgBorderCls}`}>
          <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
            Current FSM Decision State
          </span>
          <div className="font-mono text-base sm:text-lg font-black tracking-widest leading-none mb-1.5">
            {stateLabel}
          </div>
          <p className="text-[10.5px] leading-relaxed max-w-sm mx-auto font-medium">{description}</p>
        </div>

        {/* Live numerical panel values */}
        <div className="grid grid-cols-2 gap-3 text-xs font-mono mb-2">
          <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
            <span className="text-[8.5px] text-slate-500 block uppercase font-sans font-bold">Raw Signal (ΔF)</span>
            <span className="text-slate-900 text-sm font-black">{signal >= 0 ? "+" : ""}{signal.toFixed(4)} Ω</span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
            <span className="text-[8.5px] text-slate-500 block uppercase font-sans font-bold">Slope d(ΔF)/dt</span>
            <span className="text-slate-900 text-sm font-black">{slope >= 0 ? "+" : ""}{slope.toFixed(5)} Ω/h</span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
            <span className="text-[8.5px] text-slate-500 block uppercase font-sans font-bold">Stability Index</span>
            <span className={`text-sm font-black ${stabilityText === "HIGH" ? "text-[#059669]" : "text-amber-600"}`}>
              {stabilityText}
            </span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
            <span className="text-[8.5px] text-slate-500 block uppercase font-sans font-bold">Measurements</span>
            <span className="text-slate-900 text-sm font-black">{String(measurementCount).padStart(2, "0")} / 80</span>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-200 text-[8.5px] text-slate-500 leading-snug font-medium">
        Determines halt signal using fixed-point derivatives calculated over lagging interval windows in FPGA hardware simulation.
      </div>
    </div>
  );
}
