"use client";

import React from "react";
import type { PlannerData } from "@/types/flash";
import PlainTechBlock from "./PlainTechBlock";
import { Clock, ArrowRight, Zap, CheckCircle2 } from "lucide-react";

export default function PlannerTimeline({ planner }: { planner: PlannerData }) {
  const { steps, priorEntropyBits, stopThresholdBits } = planner;

  return (
    <PlainTechBlock
      id="planner"
      title="How the Machine Decided What to Do Next"
      plainSummary="Nobody programmed a rigid, fixed sequence. Before each move, the instrument calculates which measurement will teach it the most for the time it takes, and performs that one. Once it knows the answer, it stops."
      bullets={[
        "Autonomous next-action selection based on information gain per minute.",
        "Halts testing early once uncertainty drops below the stopping threshold.",
        `Prior uncertainty started at ${priorEntropyBits.toFixed(2)} bits and was reduced step-by-step.`,
        "Saves hours of unnecessary incubation compared to static schedules."
      ]}
      status="VERIFIED"
      statusText="EIG AUTONOMOUS AGENT"
      techTitle="Technical Detail: Expected Information Gain (EIG) & Shannon Entropy"
      technicalDetails={
        <div className="space-y-3">
          <p>
            <strong>Expected Information Gain Optimization:</strong> For candidate action a, 
            EIG(a) = H(posterior) - E[H(posterior | x_a)]. 
            The action with maximal rate EIG(a) / Cost(a) is scheduled, subject to physical
            biological prerequisites (e.g., AST cannot precede growth baseline).
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[10px] border-collapse">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400">
                  <th className="py-1.5 pr-3">STEP</th>
                  <th className="py-1.5 pr-3">ACTION KEY</th>
                  <th className="py-1.5 pr-3">TIME COST</th>
                  <th className="py-1.5 pr-3">EIG GAIN</th>
                  <th className="py-1.5 pr-3">EFFICIENCY</th>
                  <th className="py-1.5">ENTROPY AFTER</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {steps.map((s, idx) => {
                  const chosen = s.candidates.find((c) => c.action === s.action) || s.candidates[0];
                  return (
                    <tr key={s.action} className="text-slate-300">
                      <td className="py-1.5 font-bold text-emerald-400">#{idx + 1}</td>
                      <td className="py-1.5 font-bold text-white">{s.action}</td>
                      <td className="py-1.5 text-slate-400">{chosen?.costMin || 0} min</td>
                      <td className="py-1.5 text-emerald-400">+{chosen?.eigBits.toFixed(3) || "0.000"} bits</td>
                      <td className="py-1.5 text-blue-400">{chosen?.bitsPerMin.toFixed(4) || "0.0000"} b/m</td>
                      <td className="py-1.5 font-bold text-purple-300">{s.entropyBits.toFixed(3)} bits</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {steps.map((step, idx) => {
          const isFinal = idx === steps.length - 1;
          const timeLabel =
            step.elapsedMin < 60
              ? `${Math.round(step.elapsedMin)} min`
              : `${(step.elapsedMin / 60).toFixed(1)} h`;

          return (
            <div
              key={step.action}
              className={`p-4 rounded-2xl border transition-all ${
                isFinal
                  ? "bg-slate-900 text-white border-slate-800 shadow-md ring-1 ring-emerald-500/40"
                  : "bg-slate-50 border-slate-200 text-slate-800"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-black ${
                      isFinal ? "bg-emerald-500 text-slate-950" : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="font-bold text-sm sm:text-base font-mono">
                    {step.plainTitle}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full ${
                      isFinal ? "bg-slate-800 text-slate-300" : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    <Clock className="w-3 h-3 text-emerald-500" />
                    <span>T = {timeLabel}</span>
                  </span>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isFinal
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    H = {step.entropyBits.toFixed(2)} bits
                  </span>
                </div>
              </div>

              <p
                className={`text-xs leading-relaxed font-medium mb-3 ${
                  isFinal ? "text-slate-300" : "text-slate-600"
                }`}
              >
                {step.plainText}
              </p>

              {/* Leader Call at this stage */}
              <div
                className={`pt-2 border-t flex flex-wrap items-center justify-between text-[10px] font-mono ${
                  isFinal ? "border-slate-800 text-slate-400" : "border-slate-200 text-slate-500"
                }`}
              >
                <span>Current Leader: <strong className={isFinal ? "text-emerald-400" : "text-slate-800"}>{step.leader.replace(/_/g, " ")}</strong></span>
                {step.stopped && (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Halted: Threshold Reached (&lt; {stopThresholdBits} bits)</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </PlainTechBlock>
  );
}
