"use client";

import React from "react";
import type { ForecastData } from "@/types/flash";
import PlainTechBlock from "./PlainTechBlock";
import { AlertTriangle, TrendingUp, ShieldAlert } from "lucide-react";

const W = 720;
const H = 220;
const PAD = { l: 50, r: 25, t: 25, b: 35 };

export default function ForecastChart({ forecast }: { forecast: ForecastData }) {
  const { calibrated, warning, observedToH, points, truth } = forecast;

  const allH = [...points.map((p) => p.h), ...truth.map((t) => t.h)];
  const allV = [
    ...points.map((p) => p.hi),
    ...points.map((p) => p.lo),
    ...truth.map((t) => t.g)
  ];

  const hMin = 0;
  const hMax = Math.max(4.0, Math.max(...allH));
  const vMin = 0;
  const vMax = Math.max(1.2, Math.max(...allV) * 1.15);

  const x = (h: number) => PAD.l + ((h - hMin) / (hMax - hMin || 1)) * (W - PAD.l - PAD.r);
  const y = (v: number) => H - PAD.b - ((v - vMin) / (vMax - vMin || 1)) * (H - PAD.t - PAD.b);

  // Observed truth up to 2.0h
  const observedTruth = truth.filter((t) => t.h <= observedToH);
  const futureTruth = truth.filter((t) => t.h >= observedToH);

  const obsPath = observedTruth
    .map((t, idx) => `${idx === 0 ? "M" : "L"}${x(t.h).toFixed(1)},${y(t.g).toFixed(1)}`)
    .join(" ");

  const futureTruthPath = futureTruth
    .map((t, idx) => `${idx === 0 ? "M" : "L"}${x(t.h).toFixed(1)},${y(t.g).toFixed(1)}`)
    .join(" ");

  // Forecast Mean Path
  const forecastMeanPath = points
    .map((p, idx) => `${idx === 0 ? "M" : "L"}${x(p.h).toFixed(1)},${y(p.mean).toFixed(1)}`)
    .join(" ");

  // Forecast Area Bounds Path
  const upperPath = points.map((p) => `${x(p.h).toFixed(1)},${y(p.hi).toFixed(1)}`);
  const lowerPath = [...points].reverse().map((p) => `${x(p.h).toFixed(1)},${y(p.lo).toFixed(1)}`);
  const boundsPathD = `M ${upperPath.join(" L ")} L ${lowerPath.join(" L ")} Z`;

  return (
    <PlainTechBlock
      id="forecast"
      title="Predictive Twin: Looking Ahead"
      plainSummary="Instead of just plotting the present moment, our Extended Kalman Filter projects where the biological system is heading over the next 1 to 2 hours with explicit uncertainty bounds."
      bullets={[
        `Observed state up to ${observedToH.toFixed(1)} hours (solid emerald line).`,
        "Ensemble trajectory forecast projecting future growth (dashed purple line).",
        "Uncertainty envelope showing 95% predictive bounds.",
        !calibrated
          ? "Calibration gate active: System flags empirical coverage before clinical trust."
          : "Fully calibrated empirical uncertainty bounds."
      ]}
      status={calibrated ? "VERIFIED" : "PROTOTYPE"}
      statusText={calibrated ? "CALIBRATED TWIN" : "CALIBRATION IN PROGRESS"}
      techTitle="Technical Detail: Baranyi Differential State Equations & EKF Uncertainty"
      technicalDetails={
        <div className="space-y-2">
          <p>
            <strong>State-Space Baranyi-Roberts Formulation:</strong> State vector x_t = [y_t, q_t, mu_max, K]^T,
            where y = ln(N/N_0) is biomass and q is intracellular critical substance governing lag.
            dy/dt = mu_max * alpha(q) * (1 - N/N_max) with adjustment function alpha(q) = q / (1 + q).
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-[10px]">
            <div>
              <span className="text-slate-400 block">OBSERVATION HORIZON</span>
              <span className="text-white font-bold">t = 0.0 to 2.0 h</span>
            </div>
            <div>
              <span className="text-slate-400 block">FORECAST HORIZON</span>
              <span className="text-purple-400 font-bold">+2.0 Hours Forward</span>
            </div>
            <div>
              <span className="text-slate-400 block">FILTER TYPE</span>
              <span className="text-emerald-400 font-bold">Extended Kalman Filter (EKF)</span>
            </div>
            <div>
              <span className="text-slate-400 block">CALIBRATION GATE</span>
              <span className={calibrated ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                {calibrated ? "PASS (>=90%)" : "ACTIVE NOTICE"}
              </span>
            </div>
          </div>
        </div>
      }
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-inner">
        {/* Honesty Banner if not fully calibrated */}
        {!calibrated && (
          <div className="mb-4 p-3.5 rounded-xl bg-amber-950/50 border border-amber-500/40 text-amber-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs font-mono">
              <strong className="text-amber-300 block mb-0.5 uppercase tracking-wide">
                Honesty Gate: Predictive Calibration Warning
              </strong>
              <p className="text-amber-200/90 leading-relaxed font-sans text-[11px]">
                {warning}
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-2 border-b border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-white font-bold">Baranyi Predictive Twin Forecast vs Ground Truth</span>
          </div>
          <span className="text-slate-400 text-[11px] font-mono">
            Observation boundary: t = {observedToH.toFixed(1)} h
          </span>
        </div>

        {/* SVG Forecast Plot */}
        <div className="relative w-full overflow-x-auto">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto max-h-[220px]">
            {/* Grid */}
            {[0.0, 0.5, 1.0].map((v) => (
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
                  {v.toFixed(1)}
                </text>
              </g>
            ))}

            {/* Time Axis */}
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

            {/* Observation Boundary Vertical Line */}
            <line
              x1={x(observedToH)}
              x2={x(observedToH)}
              y1={PAD.t}
              y2={H - PAD.b}
              stroke="#e2e8f0"
              strokeWidth="1.5"
              strokeDasharray="4,4"
            />
            <text
              x={x(observedToH) + 4}
              y={PAD.t + 12}
              fontSize="9"
              fill="#e2e8f0"
              fontFamily="monospace"
              fontWeight="bold"
            >
              NOW (t=2.0h)
            </text>

            {/* Forecast Uncertainty Envelope Fill */}
            <path d={boundsPathD} fill="rgba(168, 85, 247, 0.18)" />

            {/* Observed History */}
            <path d={obsPath} fill="none" stroke="#10b981" strokeWidth="3" />
            {observedTruth.map((t, idx) => (
              <circle key={`obs-${idx}`} cx={x(t.h)} cy={y(t.g)} r="3.5" fill="#10b981" />
            ))}

            {/* Future Ground Truth (Dotted gray) */}
            <path d={futureTruthPath} fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="3,3" />
            {futureTruth.map((t, idx) => (
              <circle key={`fut-${idx}`} cx={x(t.h)} cy={y(t.g)} r="2.5" fill="#64748b" />
            ))}

            {/* Forecast Mean Line */}
            <path d={forecastMeanPath} fill="none" stroke="#c084fc" strokeWidth="2.5" />
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between text-[10px] font-mono text-slate-400 mt-3 pt-3 border-t border-slate-800">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-3 h-1 bg-emerald-400 rounded-full" />
              <span>Observed History (0 to 2h)</span>
            </span>
            <span className="flex items-center gap-1.5 text-purple-400">
              <span className="w-3 h-1 bg-purple-400 rounded-full" />
              <span>Forecast Mean Trajectory</span>
            </span>
            <span className="flex items-center gap-1.5 text-purple-300">
              <span className="w-3 h-2 bg-purple-500/30 rounded" />
              <span>95% Uncertainty Envelope</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-3 h-1 bg-slate-500 border-dashed" />
              <span>Unseen Ground Truth</span>
            </span>
          </div>
        </div>
      </div>
    </PlainTechBlock>
  );
}
