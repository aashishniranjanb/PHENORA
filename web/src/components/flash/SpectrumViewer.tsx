"use client";

import React, { useState } from "react";
import type { SpectrumData, DrtPoint } from "@/types/flash";
import PlainTechBlock from "./PlainTechBlock";
import { Activity, Layers } from "lucide-react";

const W = 720;
const H = 240;
const PAD = { l: 55, r: 25, t: 25, b: 35 };

export default function SpectrumViewer({
  spectrum,
  drt
}: {
  spectrum: SpectrumData;
  drt: DrtPoint[];
}) {
  const [tab, setTab] = useState<"nyquist" | "bode" | "drt">("nyquist");

  // Nyquist coordinates
  const res = spectrum.nyquist.map((p) => p.re);
  const ims = spectrum.nyquist.map((p) => p.im);
  const reMin = Math.min(...res);
  const reMax = Math.max(...res);
  const imMin = Math.min(0, Math.min(...ims));
  const imMax = Math.max(...ims);

  const nxX = (re: number) => PAD.l + ((re - reMin) / (reMax - reMin || 1)) * (W - PAD.l - PAD.r);
  const nxY = (im: number) => H - PAD.b - ((im - imMin) / (imMax - imMin || 1)) * (H - PAD.t - PAD.b);

  const nyquistD = spectrum.nyquist
    .map((p, i) => `${i === 0 ? "M" : "L"}${nxX(p.re).toFixed(1)},${nxY(p.im).toFixed(1)}`)
    .join(" ");

  // Bode coordinates
  const fs = spectrum.bode.map((b) => Math.log10(Math.max(1, b.f)));
  const mags = spectrum.bode.map((b) => b.mag);
  const phases = spectrum.bode.map((b) => b.phase);

  const fMin = Math.min(...fs);
  const fMax = Math.max(...fs);
  const magMin = Math.min(...mags);
  const magMax = Math.max(...mags);
  const phMin = Math.min(...phases);
  const phMax = Math.max(...phases);

  const bdX = (lf: number) => PAD.l + ((lf - fMin) / (fMax - fMin || 1)) * (W - PAD.l - PAD.r);
  const bdYMag = (m: number) => H - PAD.b - ((m - magMin) / (magMax - magMin || 1)) * (H - PAD.t - PAD.b);
  const bdYPh = (ph: number) => H - PAD.b - ((ph - phMin) / (phMax - phMin || 1)) * (H - PAD.t - PAD.b);

  const bodeMagD = spectrum.bode
    .map((b, i) => `${i === 0 ? "M" : "L"}${bdX(fs[i]).toFixed(1)},${bdYMag(b.mag).toFixed(1)}`)
    .join(" ");

  const bodePhD = spectrum.bode
    .map((b, i) => `${i === 0 ? "M" : "L"}${bdX(fs[i]).toFixed(1)},${bdYPh(b.phase).toFixed(1)}`)
    .join(" ");

  // DRT coordinates
  const taus = drt.map((d) => Math.log10(Math.max(1e-9, d.tau)));
  const gammas = drt.map((d) => d.gamma);
  const tauMin = Math.min(...taus);
  const tauMax = Math.max(...taus);
  const gMin = 0;
  const gMax = Math.max(...gammas) * 1.15;

  const drtX = (lt: number) => PAD.l + ((lt - tauMin) / (tauMax - tauMin || 1)) * (W - PAD.l - PAD.r);
  const drtY = (g: number) => H - PAD.b - ((g - gMin) / (gMax - gMin || 1)) * (H - PAD.t - PAD.b);

  const drtD = drt
    .map((d, i) => `${i === 0 ? "M" : "L"}${drtX(taus[i]).toFixed(1)},${drtY(d.gamma).toFixed(1)}`)
    .join(" ");

  return (
    <PlainTechBlock
      id="spectrum"
      title="Multi-Frequency Impedance Spectroscopy"
      plainSummary="Instead of reading a single electrical number, we sweep frequencies from 100 Hz to 100 kHz. This captures the complete electrical fingerprint of the sample."
      bullets={[
        "Low frequencies (< 100 Hz) probe electrode and cell membrane boundaries.",
        "Mid-to-high frequencies (1 kHz – 100 kHz) probe bulk liquid conductivity and released bacterial metabolites.",
        "DRT (Distribution of Relaxation Times) cleanly separates electrode surface effects from pure liquid growth."
      ]}
      status="VERIFIED"
      statusText="100Hz–100kHz SPECTRUM"
      techTitle="Technical Detail: Nyquist, Bode & DRT Regularization"
      technicalDetails={
        <div className="space-y-2">
          <p>
            <strong>Impedance Physics & DRT Inversion:</strong> The continuous impedance spectrum is represented as
            Z(omega) = R_inf + R_pol * integral [gamma(tau) / (1 + j*omega*tau)] d(ln tau).
            Tikhonov-regularized Ridge regression deconvolves the distribution of relaxation times gamma(tau) 
            without pre-assuming an equivalent circuit topology.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[10px]">
            <div>
              <span className="text-slate-400 block">BANDWIDTH COVERED</span>
              <span className="text-emerald-400 font-bold">100 Hz to 100 kHz (3.3 Decades)</span>
            </div>
            <div>
              <span className="text-slate-400 block">AFE ARCHITECTURE</span>
              <span className="text-white font-bold">AD5933 Monolithic Stepped Sweep</span>
            </div>
            <div>
              <span className="text-slate-400 block">DRT RESOLUTION</span>
              <span className="text-purple-400 font-bold">{drt.length} Deconvolved Relaxation Tones</span>
            </div>
          </div>
        </div>
      }
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-inner">
        {/* Tab Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-white uppercase">
              {tab === "nyquist" && "Nyquist Impedance Plane (-Z'' vs Z')"}
              {tab === "bode" && "Bode Magnitude & Phase Response"}
              {tab === "drt" && "Distribution of Relaxation Times (DRT)"}
            </span>
          </div>

          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setTab("nyquist")}
              className={`px-3 py-1 rounded transition-all cursor-pointer font-bold ${
                tab === "nyquist" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-400 hover:text-white"
              }`}
            >
              Nyquist
            </button>
            <button
              onClick={() => setTab("bode")}
              className={`px-3 py-1 rounded transition-all cursor-pointer font-bold ${
                tab === "bode" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-400 hover:text-white"
              }`}
            >
              Bode
            </button>
            <button
              onClick={() => setTab("drt")}
              className={`px-3 py-1 rounded transition-all cursor-pointer font-bold ${
                tab === "drt" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-400 hover:text-white"
              }`}
            >
              DRT
            </button>
          </div>
        </div>

        {/* Tab 1: Nyquist View */}
        {tab === "nyquist" && (
          <div className="relative w-full overflow-x-auto">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto max-h-[240px]">
              {/* Grid Lines */}
              <line x1={PAD.l} x2={W - PAD.r} y1={H - PAD.b} y2={H - PAD.b} stroke="#334155" strokeWidth="1.5" />
              <line x1={PAD.l} x2={PAD.l} y1={PAD.t} y2={H - PAD.b} stroke="#334155" strokeWidth="1.5" />

              {/* Curve */}
              <path d={nyquistD} fill="none" stroke="#10b981" strokeWidth="2.5" />

              {/* Point Markers */}
              {spectrum.nyquist.map((p, idx) => (
                <circle
                  key={idx}
                  cx={nxX(p.re)}
                  cy={nxY(p.im)}
                  r={idx === 0 || idx === spectrum.nyquist.length - 1 ? 4 : 2.5}
                  fill={idx === 0 ? "#60a5fa" : idx === spectrum.nyquist.length - 1 ? "#f59e0b" : "#10b981"}
                />
              ))}

              {/* Axis labels */}
              <text x={PAD.l} y={H - 10} fontSize="9" fill="#94a3b8" fontFamily="monospace">
                Z&apos; = {reMin.toFixed(0)} Ω
              </text>
              <text x={W - PAD.r} y={H - 10} textAnchor="end" fontSize="9" fill="#94a3b8" fontFamily="monospace">
                Z&apos; = {reMax.toFixed(0)} Ω (Real Resistance)
              </text>
              <text x={PAD.l - 6} y={PAD.t + 10} textAnchor="end" fontSize="9" fill="#94a3b8" fontFamily="monospace">
                -Z&apos;&apos; = {imMax.toFixed(0)} Ω
              </text>
            </svg>
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mt-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400" /> 100 Hz (Interface Dominated)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> 100 kHz (Bulk Electrolyte Dominated)
              </span>
            </div>
          </div>
        )}

        {/* Tab 2: Bode View */}
        {tab === "bode" && (
          <div className="relative w-full overflow-x-auto">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto max-h-[240px]">
              <line x1={PAD.l} x2={W - PAD.r} y1={H - PAD.b} y2={H - PAD.b} stroke="#334155" strokeWidth="1.5" />
              <line x1={PAD.l} x2={PAD.l} y1={PAD.t} y2={H - PAD.b} stroke="#334155" strokeWidth="1.5" />

              {/* Magnitude Path */}
              <path d={bodeMagD} fill="none" stroke="#3b82f6" strokeWidth="2" />
              {/* Phase Path */}
              <path d={bodePhD} fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="4,2" />

              <text x={PAD.l} y={H - 10} fontSize="9" fill="#94a3b8" fontFamily="monospace">
                100 Hz
              </text>
              <text x={W / 2} y={H - 10} textAnchor="middle" fontSize="9" fill="#94a3b8" fontFamily="monospace">
                10 kHz
              </text>
              <text x={W - PAD.r} y={H - 10} textAnchor="end" fontSize="9" fill="#94a3b8" fontFamily="monospace">
                100 kHz
              </text>

              <text x={PAD.l - 6} y={PAD.t + 10} textAnchor="end" fontSize="9" fill="#60a5fa" fontFamily="monospace">
                |Z| {(magMax / 1000).toFixed(1)} kΩ
              </text>
              <text x={PAD.l - 6} y={H - PAD.b - 10} textAnchor="end" fontSize="9" fill="#c084fc" fontFamily="monospace">
                φ {phMin.toFixed(0)}°
              </text>
            </svg>
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mt-2">
              <span className="flex items-center gap-1.5 text-blue-400">
                <span className="w-3 h-0.5 bg-blue-400" /> Magnitude |Z| (Ω)
              </span>
              <span className="flex items-center gap-1.5 text-purple-400">
                <span className="w-3 h-0.5 bg-purple-400 border-dashed" /> Phase Angle φ (degrees)
              </span>
            </div>
          </div>
        )}

        {/* Tab 3: DRT View */}
        {tab === "drt" && (
          <div className="relative w-full overflow-x-auto">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto max-h-[240px]">
              <line x1={PAD.l} x2={W - PAD.r} y1={H - PAD.b} y2={H - PAD.b} stroke="#334155" strokeWidth="1.5" />
              <line x1={PAD.l} x2={PAD.l} y1={PAD.t} y2={H - PAD.b} stroke="#334155" strokeWidth="1.5" />

              {/* Area Fill */}
              <path
                d={`${drtD} L ${drtX(taus[taus.length - 1])} ${H - PAD.b} L ${drtX(taus[0])} ${H - PAD.b} Z`}
                fill="rgba(16, 185, 129, 0.15)"
              />
              <path d={drtD} fill="none" stroke="#10b981" strokeWidth="2.5" />

              <text x={PAD.l} y={H - 10} fontSize="9" fill="#94a3b8" fontFamily="monospace">
                τ = 10⁻⁶ s (Fast / High Freq)
              </text>
              <text x={W - PAD.r} y={H - 10} textAnchor="end" fontSize="9" fill="#94a3b8" fontFamily="monospace">
                τ = 10⁻² s (Slow / Interface)
              </text>
              <text x={PAD.l - 6} y={PAD.t + 10} textAnchor="end" fontSize="9" fill="#94a3b8" fontFamily="monospace">
                γ(τ)
              </text>
            </svg>
            <div className="text-[10px] font-mono text-slate-400 mt-2 text-center">
              DRT peaks reveal discrete physical processes: peak at 10⁻⁵ s corresponds to bulk electrolyte conduction, peak at 10⁻³ s corresponds to electrode double-layer polarization.
            </div>
          </div>
        )}
      </div>
    </PlainTechBlock>
  );
}
