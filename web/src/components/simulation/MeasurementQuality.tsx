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
  let overallCls = "bg-emerald-50 border-emerald-300 text-emerald-800";

  if (overall === "MEASURE AGAIN") {
    overallText = "ACCUMULATING EVIDENCE";
    overallCls = "bg-amber-50 border-amber-300 text-amber-800";
  } else if (overall === "INVALID") {
    overallText = "INVALID / RECALIBRATE";
    overallCls = "bg-red-50 border-red-300 text-red-800";
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] text-[#059669] font-black tracking-widest uppercase">QUALITY MONITOR</span>
              <StatusBadge status="PROTOTYPE" />
            </div>
            <h3 className="text-slate-900 text-base font-extrabold">Measurement Quality Engine</h3>
          </div>
        </div>

        {/* Overall Status Badge */}
        <div className={`p-2.5 rounded border text-center font-mono font-black text-xs uppercase tracking-wider mb-4 transition-all duration-300 ${overallCls}`}>
          {overallText}
        </div>

        {/* Quality grid indicators */}
        <div className="space-y-2 text-[11px] font-mono">
          <div className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded border border-slate-200">
            <span className="text-slate-600 font-sans font-medium">Signal SNR</span>
            <span className={signalQuality === "HIGH" ? "text-[#059669] font-black" : "text-amber-600 font-black"}>
              {signalQuality}
            </span>
          </div>

          <div className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded border border-slate-200">
            <span className="text-slate-600 font-sans font-medium">Environmental Noise</span>
            <span className={noise === "LOW" ? "text-[#059669] font-black" : "text-red-600 font-black"}>
              {noise}
            </span>
          </div>

          <div className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded border border-slate-200 relative">
            <span className="text-slate-600 font-sans font-medium flex items-center gap-1">
              Baseline Drift
              <span className="text-[6.5px] font-bold tracking-tight text-purple-700 border border-purple-300 bg-purple-50 px-1 rounded">V1.5 CONCEPT</span>
            </span>
            <span className={drift === "LOW" ? "text-[#059669] font-black" : "text-amber-600 font-black"}>
              {drift}
            </span>
          </div>

          <div className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded border border-slate-200">
            <span className="text-slate-600 font-sans font-medium">Broth Temperature</span>
            <span className={tempStable ? "text-[#059669] font-black" : "text-red-600 font-black"}>
              {tempStable ? "STABLE" : "DRIFTING"}
            </span>
          </div>

          <div className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded border border-slate-200">
            <span className="text-slate-600 font-sans font-medium">Electrode Mismatch</span>
            <span className={electrodeGood ? "text-[#059669] font-black" : "text-red-600 font-black"}>
              {electrodeGood ? "NOMINAL" : "CHECK WELLS"}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-200 text-[8.5px] text-slate-500 leading-snug font-medium mt-3">
        Monitors signal variance, SNR bounds, and thermal stability in real time during measurement acquisition.
      </div>
    </div>
  );
}
