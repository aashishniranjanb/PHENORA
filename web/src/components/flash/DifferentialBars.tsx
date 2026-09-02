"use client";

import React from "react";
import type { DifferentialItem } from "@/types/flash";
import PlainTechBlock from "./PlainTechBlock";

export default function DifferentialBars({ items }: { items: DifferentialItem[] }) {
  return (
    <PlainTechBlock
      id="differential"
      title="Differential Organism Probability"
      plainSummary="How the model weighs each possibility after observing electrical impedance and metabolic growth."
      bullets={[
        "The top bar represents the most statistically probable organism.",
        "Highlighted green rows are included in the formal conformal prediction set.",
        "Lower probability candidates are evaluated and ruled out sequentially."
      ]}
      status="VERIFIED"
      statusText="BAYESIAN POSTERIOR"
      techTitle="Technical Detail: Class Conditional Posterior & Conformal Inclusions"
      technicalDetails={
        <div className="space-y-2">
          <p>
            <strong>Posterior Estimation:</strong> Given feature vector x in R^14, 
            class log-likelihoods log p(x|y) are modeled under regularized class-covariance Gaussians.
            Posterior probabilities p(y|x) = p(x|y)p(y) / sum_c p(x|c)p(c).
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[10px]">
            <div>
              <span className="text-slate-400 block">PANEL SIZE</span>
              <span className="text-white font-bold">6 Target Classes</span>
            </div>
            <div>
              <span className="text-slate-400 block">MAX POSTERIOR</span>
              <span className="text-emerald-400 font-bold">
                {(Math.max(...items.map((i) => i.probability)) * 100).toFixed(2)}%
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">SET INCLUSIONS</span>
              <span className="text-blue-400 font-bold">
                {items.filter((i) => i.inSet).length} class(es)
              </span>
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-3">
        {items.map((item) => {
          const pct = item.probability * 100;
          return (
            <div
              key={item.organism}
              className={`p-3.5 rounded-xl border transition-all ${
                item.inSet
                  ? "bg-emerald-50/40 border-emerald-300 ring-1 ring-emerald-400/30"
                  : "bg-slate-50/70 border-slate-200 opacity-75"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs sm:text-sm text-slate-900 font-mono">
                    {item.organism.replace(/_/g, " ")}
                  </span>
                  {item.inSet && (
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded border border-emerald-300">
                      IN PREDICTION SET
                    </span>
                  )}
                </div>
                <span className="text-xs sm:text-sm font-mono font-black text-slate-900">
                  {pct > 0.01 ? `${pct.toFixed(2)}%` : "<0.01%"}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden mb-1.5">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.inSet ? "bg-[#059669]" : "bg-slate-400"
                  }`}
                  style={{ width: `${Math.max(pct > 0 ? 1 : 0, Math.min(100, pct))}%` }}
                />
              </div>

              <div className="text-[11px] text-slate-600 font-medium leading-snug">
                {item.plain}
              </div>
            </div>
          );
        })}
      </div>
    </PlainTechBlock>
  );
}
