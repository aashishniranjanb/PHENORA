"use client";

import React from "react";
import type { AcquisitionData } from "@/types/flash";
import PlainTechBlock from "./PlainTechBlock";
import { Zap, Gauge, Check } from "lucide-react";

const W = 720;
const H = 160;
const PAD = { l: 50, r: 20, t: 15, b: 30 };

export default function AcquisitionTrace({ acquisition }: { acquisition: AcquisitionData }) {
  const { trace, crestFactors, parallelMs, steppedMs, speedup, medianSnrDb } = acquisition;

  const ts = trace.map((d) => d.tMs);
  const is_ = trace.map((d) => d.iUa);

  const tMin = Math.min(...ts);
  const tMax = Math.max(...ts);
  const iMax = Math.max(80, Math.max(...is_.map(Math.abs)) * 1.15);

  const x = (t: number) => PAD.l + ((t - tMin) / (tMax - tMin || 1)) * (W - PAD.l - PAD.r);
  const y = (iVal: number) => (H - PAD.b + PAD.t) / 2 - (iVal / iMax) * ((H - PAD.t - PAD.b) / 2);

  const pathD = trace.map((d, idx) => `${idx === 0 ? "M" : "L"}${x(d.tMs).toFixed(1)},${y(d.iUa).toFixed(1)}`).join(" ");

  return (
    <PlainTechBlock
      id="acquisition"
      title="High-Speed Electrical Excitation Burst"
      plainSummary="We send a tiny, non-damaging electrical current into the well and measure how the liquid and cells respond across multiple frequencies simultaneously."
      bullets={[
        "Sub-millisecond multi-frequency burst keeps acquisition extremely fast.",
        "Injected current stays well below safe limits (< 400 µA rms) to avoid heating.",
        `High signal-to-noise ratio: ${medianSnrDb.toFixed(1)} dB median SNR across all frequency tones.`,
        `Speedup: ${speedup.toFixed(2)}x faster than legacy single-frequency stepped hardware.`
      ]}
      status="VERIFIED"
      statusText="HARDWARE BURST TRACE"
      techTitle="Technical Detail: Crest Factor Minimization & Sub-Band Demodulation"
      technicalDetails={
        <div className="space-y-2">
          <p>
            <strong>Parallel Multisine & AFE Limits:</strong> The excitation waveform is synthesized using 
            frequency-domain phase optimization (Schroeder / Newman phasing) to minimize the crest factor CF = I_peak / I_rms.
            Crest factors: {crestFactors.join(", ")}. Injected current strictly satisfies I_rms &lt; 400 µA into a 50 Ω well.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-[10px]">
            <div>
              <span className="text-slate-400 block">PARALLEL DURATION</span>
              <span className="text-emerald-400 font-bold">{parallelMs.toFixed(1)} ms</span>
            </div>
            <div>
              <span className="text-slate-400 block">STEPPED EQUIVALENT</span>
              <span className="text-slate-400 font-bold">{steppedMs.toFixed(1)} ms</span>
            </div>
            <div>
              <span className="text-slate-400 block">PARALLEL SPEEDUP</span>
              <span className="text-blue-400 font-bold">{speedup.toFixed(2)}x</span>
            </div>
            <div>
              <span className="text-slate-400 block">ACTIVE FREQ TONES</span>
              <span className="text-white font-bold">{acquisition.nTones} Simultaneous</span>
            </div>
          </div>
        </div>
      }
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-inner">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-2 border-b border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-white font-bold">Sub-Band Electrical Waveform (Time Domain)</span>
          </div>
          <span className="text-slate-400 text-[11px] font-mono">
            Acquisition window: {tMax.toFixed(2)} ms · Peak I_pk: ±{Math.round(iMax)} µA
          </span>
        </div>

        {/* SVG Time Trace */}
        <div className="relative w-full overflow-x-auto">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto max-h-[180px]">
            {/* Zero line */}
            <line
              x1={PAD.l}
              x2={W - PAD.r}
              y1={y(0)}
              y2={y(0)}
              stroke="#475569"
              strokeWidth="1.5"
            />
            {/* Plus/minus threshold lines */}
            {[-50, 50].map((v) => (
              <g key={v}>
                <line
                  x1={PAD.l}
                  x2={W - PAD.r}
                  y1={y(v)}
                  y2={y(v)}
                  stroke="#334155"
                  strokeWidth="1"
                  strokeDasharray="3,3"
                />
                <text
                  x={PAD.l - 6}
                  y={y(v) + 3}
                  textAnchor="end"
                  fontSize="9"
                  fill="#64748b"
                  fontFamily="monospace"
                >
                  {v > 0 ? `+${v}` : v} µA
                </text>
              </g>
            ))}

            {/* Injected waveform */}
            <path d={pathD} fill="none" stroke="#34d399" strokeWidth="1.8" />

            {/* Time labels */}
            <text x={PAD.l} y={H - 8} fontSize="9" fill="#94a3b8" fontFamily="monospace">
              0.0 ms
            </text>
            <text x={W / 2} y={H - 8} textAnchor="middle" fontSize="9" fill="#94a3b8" fontFamily="monospace">
              {(tMax / 2).toFixed(2)} ms
            </text>
            <text x={W - PAD.r} y={H - 8} textAnchor="end" fontSize="9" fill="#94a3b8" fontFamily="monospace">
              {tMax.toFixed(2)} ms
            </text>
          </svg>
        </div>

        {/* Mini stats banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-300">
          <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
            <span className="text-slate-500 block">TOTAL TONES</span>
            <span className="font-bold text-white">{acquisition.nTones} Tones</span>
          </div>
          <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
            <span className="text-slate-500 block">BURST SPEEDUP</span>
            <span className="font-bold text-emerald-400">{speedup.toFixed(2)}x Faster</span>
          </div>
          <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
            <span className="text-slate-500 block">SUB-BANDS</span>
            <span className="font-bold text-blue-400">{acquisition.bands} Bands</span>
          </div>
          <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
            <span className="text-slate-500 block">MEDIAN SNR</span>
            <span className="font-bold text-purple-400">{medianSnrDb.toFixed(1)} dB</span>
          </div>
        </div>
      </div>
    </PlainTechBlock>
  );
}
