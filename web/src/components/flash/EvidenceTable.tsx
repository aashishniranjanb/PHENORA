"use client";

import React, { useState } from "react";
import { flashEvidence } from "@/data/flashEvidence";
import PlainTechBlock from "./PlainTechBlock";
import { BookOpen, ExternalLink, Filter } from "lucide-react";

export default function EvidenceTable() {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

  const categories = ["ALL", "CLINICAL", "BIOLOGY", "PHYSICS", "HARDWARE", "ALGORITHMS"];

  const filtered = activeCategory === "ALL"
    ? flashEvidence
    : flashEvidence.filter((item) => item.category === activeCategory);

  return (
    <PlainTechBlock
      id="evidence"
      title="Peer-Reviewed Scientific Evidence"
      plainSummary="Every technical claim, physical equation, and clinical capability built into PHENORA Flash is grounded in published peer-reviewed academic literature."
      bullets={[
        "Zero invented claims: All physical and biological assumptions map directly to validated papers.",
        "Covers rapid impedance AST, multi-frequency physics, Kramers-Kronig causality, and microfluidics.",
        "Click any DOI to view the original study on PubMed / publisher websites."
      ]}
      status="VERIFIED"
      statusText="PEER-REVIEWED LITERATURE"
      techTitle="Technical Detail: Academic Citations & Mechanistic Basis"
      technicalDetails={
        <p>
          The PHENORA Flash mathematical architecture synthesizes key breakthroughs in microfluidic rapid AST 
          (Bespinar 2020), multi-frequency non-faradaic affinity EIS (Actis 2022), Distribution of Relaxation Times
          in biological media (Wan 2015), and causality-enforcing Kramers-Kronig admissibility filters (Boukamp 1995).
        </p>
      }
    >
      <div className="space-y-4">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-100 text-xs font-mono">
          <span className="text-slate-400 flex items-center gap-1 mr-1 text-[10px] font-bold uppercase">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer text-[10px] font-bold ${
                activeCategory === cat
                  ? "bg-[#059669] text-white border-[#059669] shadow-2xs"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Evidence List */}
        <div className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-slate-50/50">
          {filtered.map((item, idx) => (
            <div key={idx} className="p-4 bg-white hover:bg-slate-50 transition-all flex flex-col justify-between gap-2">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <span className="font-bold text-xs sm:text-sm text-slate-900 font-mono">
                    {item.claim}
                  </span>
                  <span className="bg-slate-100 text-slate-700 text-[8.5px] font-mono font-black uppercase px-2 py-0.5 rounded border border-slate-200">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed mb-2">
                  {item.detail}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[10.5px] font-mono">
                <span className="text-slate-500 font-bold flex items-center gap-1.5">
                  <BookOpen className="w-3 h-3 text-[#059669]" />
                  {item.citation}
                </span>

                {item.doi && (
                  <a
                    href={`https://doi.org/${item.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#059669] hover:text-[#047857] font-bold hover:underline"
                  >
                    <span>DOI: {item.doi}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PlainTechBlock>
  );
}
