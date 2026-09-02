"use client";

import React, { useState } from "react";
import type { GrowthData } from "@/types/flash";
import PlainTechBlock from "./PlainTechBlock";
import { TrendingUp, Clock } from "lucide-react";

const W = 720;
const H = 220;
const PAD = { l: 50, r: 20, t: 20, b: 35 };

const WELL_COLORS: Record<string, string> = {
  CTRL: "#10b981", // Emerald for control
  nitrofurantoin: "#ef4444", // Red
  ciprofloxacin: "#3b82f6", // Blue
  trimethoprim: "#a855f7" // Purple
};

export default function GrowthChart({ growth }: { growth: GrowthData }) {
  const { times, wells } = growth;
  const [activeWells, setActiveWells] = useState<Record<string, boolean>>({
    CTRL: true,
    nitrofurantoin: true,
    ciprofloxacin: true,
    trimethoprim: true
  });

  const tMin = 0;
  const tMax = Math.max(...times, 4.0);

  const allNis = wells.flatMap((w) => w.nis);
  const nisMin = 0;
  const nisMax = Math.max(1.0, Math.max(...allNis) * 1.1);

  const x = (t: number) => PAD.l + ((t - tMin) / (tMax - tMin || 1)) * (W - PAD.l - PAD.r);
  const y = (nisVal: number) => H - PAD.b - ((nisVal - nisMin) / (nisMax - nisMin || 1)) * (H - PAD.t - PAD.b);

  const toggleWell = (wId: string) => {
    setActiveWells((prev) => ({ ...prev, [wId]: !prev[wId] }));
  };

  return (
    <PlainTechBlock
      id="growth"
      title="Real-Time Growth & Metabolism Tracking"
      plainSummary="As living bacteria metabolize nutrients in the warm well, they release charged ions that alter the liquid's electrical conductivity. We watch this happen minute-by-minute."
      bullets={[
        "The Control Well (green curve) shows how fast the bacteria multiply without drugs.",
        "Antibiotic wells that stay flat demonstrate complete bacterial inhibition.",
        "Divergence becomes statistically unmistakable in under 3 hours."
      ]}
      status="VERIFIED"
      statusText="DUAL-WELL NIS CURVES"
      techTitle="Technical Detail: Normalized Impedance Signal (NIS) & Gompertz Fits"
      technicalDetails={
        <div className="space-y-2">
          <p>
            <strong>Normalized Impedance Signal (NIS):</strong> NIS(t) = Delta sigma(t) / sigma_0 = (R_0 - R(t)) / R_0.
            Growth kinetics are modeled under modified Gompertz equation: 
            ln(NIS(t)) = A * exp(-exp((mu_max * e / A)*(lambda - t) + 1)),
            yielding lag time lambda ≈ 0.8 h and maximum specific growth rate mu_max ≈ 0.72 h^-1.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-[10px]">
            <div>
              <span className="text-slate-400 block">OBSERVATION WINDOW</span>
              <span className="text-white font-bold">0.0 to 4.0 Hours</span>
            </div>
            <div>
              <span className="text-slate-400 block">DETECTION THRESHOLD</span>
              <span className="text-emerald-400 font-bold">NIS &gt; 0.05 (at ~1.6 h)</span>
            </div>
            <div>
              <span className="text-slate-400 block">ACTIVE CHANNELS</span>
              <span className="text-blue-400 font-bold">4 Micro-Wells</span>
            </div>
            <div>
              <span className="text-slate-400 block">COMMON-MODE DRIFT</span>
              <span className="text-purple-400 font-bold">Subtracted via Control</span>
            </div>
          </div>
        </div>
      }
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-inner">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-2 border-b border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-white font-bold">Normalized Impedance Signal (NIS) vs Incubation Time</span>
          </div>
          <span className="text-slate-400 text-[11px] font-mono">
            4-Hour Continuous AST Trajectory
          </span>
        </div>

        {/* SVG Growth Plot */}
        <div className="relative w-full overflow-x-auto">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto max-h-[220px]">
            {/* Horizontal Grid */}
            {[0.0, 0.25, 0.5, 0.75, 1.0].map((v) => (
              <g key={v}>
                <line
                  x1={PAD.l}
                  x2={W - PAD.r}
                  y1={y(v)}
                  y2={y(v)}
                  stroke="#334155"
                  strokeWidth="1"
                  strokeDasharray={v === 0 ? undefined : "3,3"}
                />
                <text
                  x={PAD.l - 6}
                  y={y(v) + 3}
                  textAnchor="end"
                  fontSize="9"
                  fill="#94a3b8"
                  fontFamily="monospace"
                >
                  {v.toFixed(2)}
                </text>
              </g>
            ))}

            {/* Time Axis Grid */}
            {[0, 1, 2, 3, 4].map((t) => (
              <g key={t}>
                <line
                  x1={x(t)}
                  x2={x(t)}
                  y1={PAD.t}
                  y2={H - PAD.b}
                  stroke="#1e293b"
                  strokeWidth="1"
                />
                <text
                  x={x(t)}
                  y={H - 10}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#94a3b8"
                  fontFamily="monospace"
                >
                  {t}.0 h
                </text>
              </g>
            ))}

            {/* Render lines for each well */}
            {wells.map((w) => {
              if (!activeWells[w.well]) return null;
              const color = WELL_COLORS[w.well] || "#64748b";
              const pathD = w.nis
                .map((val, idx) => `${idx === 0 ? "M" : "L"}${x(times[idx]).toFixed(1)},${y(val).toFixed(1)}`)
                .join(" ");

              return (
                <g key={w.well}>
                  <path
                    d={pathD}
                    fill="none"
                    stroke={color}
                    strokeWidth={w.well === "CTRL" ? 3 : 2}
                  />
                  {w.nis.map((val, idx) => (
                    <circle
                      key={idx}
                      cx={x(times[idx])}
                      cy={y(val)}
                      r={w.well === "CTRL" ? 3.5 : 2.5}
                      fill={color}
                    />
                  ))}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Interactive Legend Toggles */}
        <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-slate-800 text-[11px] font-mono">
          {wells.map((w) => {
            const color = WELL_COLORS[w.well] || "#64748b";
            const isActive = activeWells[w.well];
            return (
              <button
                key={w.well}
                onClick={() => toggleWell(w.well)}
                className={`px-3 py-1 rounded-lg border flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? "bg-slate-800 border-slate-700 text-white"
                    : "bg-slate-950 border-slate-900 text-slate-500 opacity-60"
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="font-bold">{w.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </PlainTechBlock>
  );
}
