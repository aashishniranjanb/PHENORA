import React from "react";
import StatusBadge from "./StatusBadge";

interface MeasurementQualityProps {
  signalQuality: "HIGH" | "MEDIUM" | "LOW";
  noise: "LOW" | "HIGH";
  drift: "LOW" | "HIGH";
  tempStable: boolean;
  electrodeGood: boolean;
  overall: "VALID" | "MEASURE AGAIN" | "INVALID";
}

export default function MeasurementQuality({
  signalQuality,
  noise,
  drift,
  tempStable,
  electrodeGood,
  overall,
}: MeasurementQualityProps) {
  let overallText = "MEASUREMENT VALID";
  let overallCls = "bg-[#17B169]/10 border-[#17B169]/30 text-[#17B169]";

  if (overall === "MEASURE AGAIN") {
    overallText = "ACCUMULATING EVIDENCE";
    overallCls = "bg-yellow-950/40 border-yellow-900/50 text-yellow-600";
  } else if (overall === "INVALID") {
    overallText = "INVALID / RECALIBRATE";
    overallCls = "bg-red-950/40 border-red-900/50 text-red-400";
  }

  return (
    <div className="bg-[#081324] border border-gray-800 rounded-xl p-5 shadow-xl flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] text-[#17B169] font-bold tracking-widest uppercase">QUALITY MONITOR</span>
              <StatusBadge status="PROTOTYPE" />
            </div>
            <h3 className="text-white text-base font-bold">Measurement Quality Engine</h3>
          </div>
        </div>

        {/* Overall Status Badge */}
        <div className={`p-2.5 rounded border text-center font-mono font-bold text-xs uppercase tracking-wider mb-4 transition-all duration-300 ${overallCls}`}>
          {overallText}
        </div>

        {/* Quality grid indicators */}
        <div className="space-y-2 text-[11px] font-mono">
          <div className="flex justify-between items-center bg-[#0A192F]/50 px-2 py-1.5 rounded border border-gray-800/80">
            <span className="text-gray-500 font-sans">Signal SNR</span>
            <span className={signalQuality === "HIGH" ? "text-[#17B169]" : "text-yellow-500"}>
              {signalQuality}
            </span>
          </div>

          <div className="flex justify-between items-center bg-[#0A192F]/50 px-2 py-1.5 rounded border border-gray-800/80">
            <span className="text-gray-500 font-sans">Environmental Noise</span>
            <span className={noise === "LOW" ? "text-[#17B169]" : "text-red-400"}>
              {noise}
            </span>
          </div>

          <div className="flex justify-between items-center bg-[#0A192F]/50 px-2 py-1.5 rounded border border-gray-800/80 relative">
            <span className="text-gray-500 font-sans flex items-center gap-1">
              Baseline Drift
              <span className="text-[6.5px] font-bold tracking-tight text-purple-400 border border-purple-900/50 px-1 rounded scale-90">V1.5 CONCEPT</span>
            </span>
            <span className={drift === "LOW" ? "text-[#17B169]" : "text-yellow-500"}>
              {drift}
            </span>
          </div>

          <div className="flex justify-between items-center bg-[#0A192F]/50 px-2 py-1.5 rounded border border-gray-800/80">
            <span className="text-gray-500 font-sans">Broth Temperature</span>
            <span className={tempStable ? "text-[#17B169]" : "text-red-400"}>
              {tempStable ? "STABLE" : "DRIFTING"}
            </span>
          </div>

          <div className="flex justify-between items-center bg-[#0A192F]/50 px-2 py-1.5 rounded border border-gray-800/80 relative">
            <span className="text-gray-500 font-sans flex items-center gap-1">
              Electrode Impedance Contact
              <span className="text-[6.5px] font-bold tracking-tight text-purple-400 border border-purple-900/50 px-1 rounded scale-90">V1.5 CONCEPT</span>
            </span>
            <span className={electrodeGood ? "text-[#17B169]" : "text-red-400"}>
              {electrodeGood ? "GOOD" : "POOR"}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-gray-800/80 text-[8.5px] text-gray-600 leading-snug">
        Evaluates signals against known parameters. Items marked with V1.5 represent conceptual baseline indicators simulated for validation testing.
      </div>
    </div>
  );
}
