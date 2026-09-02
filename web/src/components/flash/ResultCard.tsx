"use client";

import React from "react";
import type { FlashRun } from "@/types/flash";
import BorderGlow from "@/components/ui/BorderGlow";
import PlainTechBlock from "./PlainTechBlock";
import { Clock, CheckCircle2, AlertTriangle, User } from "lucide-react";

export default function ResultCard({ run, isMysteryMode }: { run: FlashRun, isMysteryMode?: boolean }) {
  const { headline, meta } = run;
  const isAbstain = headline.decision.startsWith("ABSTAIN");
  const isSingle = headline.decision === "REPORT_SINGLE";

  const glowColor = isAbstain ? "217, 119, 6" : isSingle ? "5, 150, 105" : "59, 130, 246";

  return (
    <PlainTechBlock
      id="result"
      title="Diagnostic Twin Snapshot"
      plainSummary={headline.plain}
      bullets={[
        `Decision Strategy: ${headline.decisionPlain}`,
        `Simulated Time to Answer: ${(headline.timeToAnswerMin / 60).toFixed(1)} hours`,
        `Patient Genotype: ${headline.patient?.resistanceGenes || 'Unknown'}`,
      ]}
      status={isAbstain ? "PROTOTYPE" : "VERIFIED"}
      statusText={isAbstain ? "SAFE ABSTAIN" : "CONFORMAL ACCEPT"}
      techTitle="Technical Detail: Conformal Prediction Set & Abstention Bounds"
      technicalDetails={
        <div className="space-y-2">
          <p>
            <strong>Conformal Formulation:</strong> Non-conformity score s(x, y) = 1 - P(y|x). 
            With calibration set size n = 60 and error rate α = 0.10, empirical quantile q-hat = 0.942.
            The prediction set C(x) = [organisms with P(y|x) &gt;= 1 - q-hat] satisfies marginal validity: 
            P(Y in C(X)) &gt;= 1 - α.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 font-mono text-[10px]">
            <div>
              <span className="text-slate-400 block">DECISION CODE</span>
              <span className="text-white font-bold">{headline.decision}</span>
            </div>
            <div>
              <span className="text-slate-400 block">POSTERIOR CONFIDENCE</span>
              <span className="text-emerald-400 font-bold">{(headline.confidence * 100).toFixed(2)}%</span>
            </div>
            <div>
              <span className="text-slate-400 block">TIME ACCELERATION</span>
              <span className="text-blue-400 font-bold">
                {((24 * 60) / headline.timeToAnswerMin).toFixed(1)}x faster
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">SOURCE PROVENANCE</span>
              <span className="text-amber-400 font-bold">{meta.dataSource}</span>
            </div>
          </div>
        </div>
      }
    >
      <BorderGlow
        glowColor={glowColor}
        borderRadius={16}
        glowRadius={160}
        glowIntensity={0.85}
        className="w-full"
      >
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
          {/* Subtle background pill */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2">
              {isAbstain ? (
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              )}
              <span className="font-mono text-xs uppercase font-bold tracking-widest text-slate-300">
                {isAbstain ? "SAFEGUARD PATH ACTIVATED" : "AUTONOMOUS RESULT VALIDATED"}
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1 rounded-full text-xs font-mono text-slate-300 border border-slate-700">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>{(headline.timeToAnswerMin / 60).toFixed(1)} h elapsed</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400">24–48 h std</span>
            </div>
          </div>

          {/* Main call presentation */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-3">
              {headline.patient && (
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
                  <User className="w-4 h-4" />
                  <span>Patient {isMysteryMode ? "????" : headline.patient.id} — {headline.patient.age}yo {headline.patient.gender}</span>
                  <span className="text-slate-500 px-2">•</span>
                  <span className="text-blue-400">{headline.patient.specimenType}</span>
                </div>
              )}
              
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {isMysteryMode ? "Unknown Infection" : `${headline.organism.replace(/_/g, " ")} Infection`}
              </h3>
              
              <p className="text-slate-300 text-sm font-medium leading-relaxed max-w-xl">
                {isMysteryMode ? "The organism identity and phenotypic behavior are currently masked." : headline.plain}
              </p>
              
              {headline.patient && (
                <div className="inline-flex mt-4 items-center gap-2 bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono">
                  <span className="text-slate-400">CLINICAL OUTCOME:</span>
                  <span className={`font-bold ${!isMysteryMode && headline.patient.outcome === 'ICU' ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {isMysteryMode ? "???" : headline.patient.outcome.toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Confidence & Set Box */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-mono text-slate-400 font-bold">CONFIDENCE</span>
                <span className="text-2xl font-black font-mono text-emerald-400">
                  {(headline.confidence * 100).toFixed(1)}%
                </span>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                  <span>CONFORMAL SET ({headline.predictionSet.length})</span>
                  <span>{headline.coverageTarget * 100}% TARGET</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {headline.predictionSet.map((item) => (
                    <span
                      key={item}
                      className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold px-2 py-0.5 rounded"
                    >
                      {item.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>Resistance Mechanism:</span>
                <span className={`font-bold ${headline.patient?.resistanceGenes !== 'None' ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {headline.patient?.resistanceGenes || 'Unknown'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </BorderGlow>
    </PlainTechBlock>
  );
}
