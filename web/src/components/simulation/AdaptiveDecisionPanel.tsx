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
  let bgBorderCls = "bg-[#0A192F] border-gray-800 text-gray-400";
  let description = "Engine idle. Awaiting measurement start.";

  switch (state) {
    case "READY":
      stateLabel = "READY";
      bgBorderCls = "bg-gray-900/40 border-gray-800 text-gray-300";
      description = "Chamber calibrated. Electrodes initialized.";
      break;
    case "INITIALIZING":
      stateLabel = "INITIALIZING";
      bgBorderCls = "bg-blue-950/20 border-blue-900/40 text-blue-300";
      description = "Bootstrapping hardware interfaces. AD5933 clock lock check.";
      break;
    case "BASELINE":
      stateLabel = "BASELINE";
      bgBorderCls = "bg-purple-950/20 border-purple-900/40 text-purple-300";
      description = "Calibrating temperature common-mode offsets and broth parameters.";
      break;
    case "MEASURING":
      stateLabel = "MEASURING";
      bgBorderCls = "bg-blue-900/35 border-blue-700/50 text-blue-400";
      description = "Accumulating differential registers. Baseline stable, accumulating slope windows.";
      break;
    case "ANALYZING":
      stateLabel = "ANALYZING";
      bgBorderCls = "bg-yellow-900/35 border-yellow-700/50 text-yellow-500 animate-pulse";
      description = "iCE40 FPGA performing N=4 moving average derivative analysis.";
      break;
    case "QUALITY_CHECK":
      stateLabel = "QUALITY CHECK";
      bgBorderCls = "bg-[#8338ec]/10 border-[#8338ec]/30 text-[#8338ec]";
      description = "Evaluating drift coefficients and SNR envelope bounds.";
      break;
    case "MEASURE_AGAIN":
      stateLabel = "MEASURE AGAIN";
      bgBorderCls = "bg-yellow-950/40 border-yellow-900/50 text-yellow-600";
      description = "Differential slope has not yet settled within threshold limits. Initiating next sample loop.";
      break;
    case "STOP":
      stateLabel = "STOP";
      bgBorderCls = "bg-green-950/40 border-[#17B169]/50 text-[#17B169]";
      description = "FSM halting trigger issued: differential trajectory slope is stable.";
      break;
    case "INVALID":
      stateLabel = "INVALID MEASUREMENT";
      bgBorderCls = "bg-red-950/40 border-red-900/50 text-red-400";
      description = "Signal quality criteria violated. Broth drift or electrode mismatch detected. Please recalibrate.";
      break;
  }

  return (
    <div className="bg-[#081324] border border-gray-800 rounded-xl p-5 shadow-xl flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] text-[#17B169] font-bold tracking-widest uppercase">DECISION ENGINE</span>
              <StatusBadge status="COMPUTATIONAL DEMONSTRATION" />
            </div>
            <h3 className="text-white text-base font-bold">Adaptive Edge Decision</h3>
          </div>
        </div>

        {/* Big state indicator card */}
        <div className={`p-4 rounded-lg border text-center mb-4 transition-all duration-300 ${bgBorderCls}`}>
          <span className="text-[8px] text-gray-500 font-bold uppercase tracking-wider block mb-1">
            Current FSM Decision State
          </span>
          <div className="font-mono text-base sm:text-lg font-extrabold tracking-widest leading-none mb-1.5">
            {stateLabel}
          </div>
          <p className="text-[10.5px] leading-relaxed max-w-sm mx-auto">{description}</p>
        </div>

        {/* Live numerical panel values */}
        <div className="grid grid-cols-2 gap-3 text-xs font-mono mb-2">
          <div className="bg-[#0A192F] p-2.5 rounded border border-gray-800/80">
            <span className="text-[8.5px] text-gray-600 block uppercase font-sans">Raw Signal (ΔF)</span>
            <span className="text-white text-sm font-bold">{signal >= 0 ? "+" : ""}{signal.toFixed(4)} Ω</span>
          </div>

          <div className="bg-[#0A192F] p-2.5 rounded border border-gray-800/80">
            <span className="text-[8.5px] text-gray-600 block uppercase font-sans">Slope d(ΔF)/dt</span>
            <span className="text-white text-sm font-bold">{slope >= 0 ? "+" : ""}{slope.toFixed(5)} Ω/h</span>
          </div>

          <div className="bg-[#0A192F] p-2.5 rounded border border-gray-800/80">
            <span className="text-[8.5px] text-gray-600 block uppercase font-sans">Stability Index</span>
            <span className={`text-sm font-bold ${stabilityText === "HIGH" ? "text-[#17B169]" : "text-yellow-500"}`}>
              {stabilityText}
            </span>
          </div>

          <div className="bg-[#0A192F] p-2.5 rounded border border-gray-800/80">
            <span className="text-[8.5px] text-gray-600 block uppercase font-sans">Measurements</span>
            <span className="text-white text-sm font-bold">{String(measurementCount).padStart(2, "0")} / 80</span>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-gray-800/80 text-[8.5px] text-gray-600 leading-snug">
        Determines halt signal using fixed-point derivatives calculated over lagging interval windows in FPGA hardware simulation.
      </div>
    </div>
  );
}
