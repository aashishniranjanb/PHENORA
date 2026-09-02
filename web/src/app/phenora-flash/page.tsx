"use client";

import React, { useState } from "react";
import TwinHero from "@/components/flash/TwinHero";
import SampleSelector from "@/components/flash/SampleSelector";
import ResultCard from "@/components/flash/ResultCard";
import SusceptibilityPanel from "@/components/flash/SusceptibilityPanel";
import AdaptiveLoop from "@/components/flash/AdaptiveLoop";
import QualityGate from "@/components/flash/QualityGate";
import HardwareProcessViewer from "@/components/flash/HardwareProcessViewer";
import PlannerTimeline from "@/components/flash/PlannerTimeline";
import AcquisitionTrace from "@/components/flash/AcquisitionTrace";
import SpectrumViewer from "@/components/flash/SpectrumViewer";
import GrowthChart from "@/components/flash/GrowthChart";
import ForecastChart from "@/components/flash/ForecastChart";
import ProgressionIndex from "@/components/flash/ProgressionIndex";
import CounterfactualSimulator from "@/components/flash/CounterfactualSimulator";
import ValidationMetrics from "@/components/flash/ValidationMetrics";
import PredictionClock from "@/components/flash/PredictionClock";
import AblationChart from "@/components/flash/AblationChart";
import EvidenceTable from "@/components/flash/EvidenceTable";
import FeasibilityMatrix from "@/components/flash/FeasibilityMatrix";
import MLDashboardOverlay from "@/components/flash/MLDashboardOverlay";
import { SAMPLE_RUNS } from "@/data/flashSamples";
import { flashRun as initialRun } from "@/data/flashRun";
import { ShieldAlert, Cpu, ChevronUp, Activity, GitBranch, Target, CheckCircle, Play } from "lucide-react";

export default function PhenoraTwinPage() {
  const [selectedKey, setSelectedKey] = useState<string>("P0025");
  const [seed, setSeed] = useState<number>(4242);
  const [runState, setRunState] = useState<'IDLE' | 'MEASURING' | 'COMPLETED'>('IDLE');
  const [isMysteryMode, setIsMysteryMode] = useState(false);
  const [isMLDashboardOpen, setIsMLDashboardOpen] = useState(false);

  const [dynamicRun, setDynamicRun] = useState<any>(null);

  const currentRun = dynamicRun || SAMPLE_RUNS[selectedKey] || initialRun;

  const handleSelectSample = (sampleKey: string, isMystery: boolean, patient?: any) => {
    setSelectedKey(sampleKey);
    setIsMysteryMode(isMystery);
    setRunState('IDLE');
    if (patient && !SAMPLE_RUNS[sampleKey]) {
      // Build a dynamic run from the patient pill
      setDynamicRun({
        ...initialRun,
        headline: {
          ...initialRun.headline,
          plain: patient.story,
          decisionPlain: "Uploaded from user dataset.",
          patient: {
            id: patient.id,
            age: parseInt(patient.story.match(/\d+/)?.[0] || "50"),
            gender: patient.story.includes("F") ? "Female" : "Male",
            specimenType: patient.story.split(',')[1]?.trim() || "Sample",
            resistanceGenes: patient.story.includes("Suspected") ? patient.story.split("Suspected")[1].trim() : "None",
            outcome: patient.story.split(',')[2]?.trim() || "Unknown"
          }
        }
      });
    } else {
      setDynamicRun(null);
    }
  };

  const handleStartRun = () => {
    setRunState('MEASURING');
  };

  const handleRegenerateSeed = () => setSeed(Math.floor(1000 + Math.random() * 9000));
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const menuItems = [
    { id: 'section-live', label: '01 · LIVE', icon: Activity },
    { id: 'section-twin', label: '02 · TWIN', icon: Target },
    { id: 'section-forecast', label: '03 · FORECAST', icon: GitBranch },
    { id: 'section-whatif', label: '04 · WHAT-IF', icon: Cpu },
    { id: 'section-validate', label: '05 · VALIDATE', icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* Status Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 uppercase tracking-widest">PHENORA</h1>
              <p className="text-[10px] font-mono text-slate-500 font-medium">Predictive Infection Twin</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-mono font-bold tracking-wider">
            <span className="flex items-center gap-1.5 text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> MEASURING
            </span>
            <span className="flex items-center gap-1.5 text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> TWIN READY
            </span>
            <span className="flex items-center gap-1.5 text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> FORECAST VALID
            </span>
          </div>
        </div>

        {/* The New Hero Chart: NOW -> FUTURE */}
        <TwinHero run={currentRun} />
        
        {/* Permanent Hardware Simulator + Sample Selector (Side-by-Side) */}
        <div className="flex flex-col gap-6 mt-12 bg-white p-6 rounded-3xl shadow-xl border border-slate-200">
          
          <div className="flex flex-col lg:flex-row gap-8 w-full">
            {/* LEFT: Hardware Simulator */}
            <div className="w-full lg:w-2/3">
              <HardwareProcessViewer 
                run={currentRun} 
                isMeasuring={runState === 'MEASURING'}
                onComplete={() => setRunState('COMPLETED')}
              />
            </div>

            {/* RIGHT: Scenarios */}
            <div className="w-full lg:w-1/3 bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <SampleSelector 
                selectedSample={selectedKey}
                onSelectSample={handleSelectSample}
                seed={seed}
                onRegenerateSeed={handleRegenerateSeed}
                runState={runState}
                onStartRun={handleStartRun}
                onCSVLoaded={() => setIsMLDashboardOpen(true)}
              />
            </div>
          </div>

          {/* The Run Banner (Appears when a sample is selected and IDLE) */}
          {runState === 'IDLE' && (
            <div className="p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
              
              <div className="relative z-10">
                <h3 className="text-xl font-black mb-1">
                  {isMysteryMode ? `UNKNOWN SAMPLE ${selectedKey}` : `PATIENT ${selectedKey}`}
                </h3>
                <p className="text-sm text-slate-400 font-medium">
                  {isMysteryMode ? "The identity and antibiotic response of this sample are hidden. What would you do?" : "Ready to analyze the electrical phenotype."}
                </p>
              </div>
              
              <button 
                onClick={handleStartRun}
                className="relative z-10 bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-8 py-4 rounded-xl font-black text-lg shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all flex items-center gap-2"
              >
                <Play className="w-5 h-5 fill-current" />
                START PHENORA RUN
              </button>
            </div>
          )}
          
        </div>

        <MLDashboardOverlay 
          isOpen={isMLDashboardOpen} 
          onClose={() => setIsMLDashboardOpen(false)} 
        />

        {/* Full Sequential Data Render */}
        {runState === 'COMPLETED' && (
          <div className="space-y-16">
            {/* SECTION 1: LIVE */}
            <div id="section-live" className="space-y-8 pt-8 scroll-mt-48">
              <h2 className="text-sm font-mono font-bold tracking-widest text-slate-400 uppercase border-b border-slate-200 pb-2 mb-8">01 · LIVE SENSOR & DIAGNOSTIC</h2>
              <AdaptiveLoop isMysteryMode={isMysteryMode} onResolve={() => setIsMysteryMode(false)} />
              <ResultCard run={currentRun} isMysteryMode={isMysteryMode} />
              <SusceptibilityPanel items={currentRun.susceptibility} isMysteryMode={isMysteryMode} />
            </div>

            {/* SECTION 2: TWIN */}
            <div id="section-twin" className="space-y-8 pt-8 scroll-mt-32">
              <h2 className="text-sm font-mono font-bold tracking-widest text-slate-400 uppercase border-b border-slate-200 pb-2 mb-8">02 · BIOLOGICAL TWIN</h2>
              <ProgressionIndex progression={currentRun.progression} />
            </div>

            {/* SECTION 3: FORECAST */}
            <div id="section-forecast" className="space-y-8 pt-8 scroll-mt-32">
              <h2 className="text-sm font-mono font-bold tracking-widest text-slate-400 uppercase border-b border-slate-200 pb-2 mb-8">03 · PREDICTIVE FORECAST</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <ForecastChart forecast={currentRun.forecast} />
                </div>
                <div className="lg:col-span-1">
                  <PredictionClock />
                </div>
              </div>
            </div>

            {/* SECTION 4: WHAT-IF */}
            <div id="section-whatif" className="space-y-8 pt-8 scroll-mt-32">
              <h2 className="text-sm font-mono font-bold tracking-widest text-slate-400 uppercase border-b border-slate-200 pb-2 mb-8">04 · WHAT-IF SIMULATOR</h2>
              <CounterfactualSimulator counterfactual={currentRun.counterfactual} />
            </div>

            {/* SECTION 5: VALIDATE */}
            <div id="section-validate" className="space-y-8 pt-8 scroll-mt-32">
              <h2 className="text-sm font-mono font-bold tracking-widest text-slate-400 uppercase border-b border-slate-200 pb-2 mb-8">05 · VALIDATION & ENGINEERING</h2>
              <ValidationMetrics validation={currentRun.validation} />
              <AblationChart />
              <EvidenceTable />
              <FeasibilityMatrix />
            </div>
          </div>
        )}

        {/* Hanging Disclaimer */}
        <div className="max-w-2xl mx-auto flex items-start justify-center gap-3 text-left bg-red-50/80 backdrop-blur p-4 rounded-xl border border-red-200 text-xs text-red-800 font-medium leading-relaxed shadow-sm -mt-6 relative z-10">
          <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-red-900 block mb-1">COMPUTATIONAL PROTOTYPE DISCLAIMER:</strong>
            PHENORA Predictive Infection Twin is a computational demonstration simulating future biological trajectories. It is not approved for clinical medical decision-making. No definitive patient diagnostic profiles are established without standard microbiological confirmation.
          </div>
        </div>

        {/* Footer Regulatory Notice */}
        <footer className="pt-12 pb-8 text-center space-y-4 mt-8">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500 pt-4 border-t border-slate-200 max-w-4xl mx-auto">
            <span>PHENORA V2 Predictive Architecture</span>
            <button onClick={scrollToTop} className="inline-flex items-center gap-1 text-emerald-600 hover:underline font-bold cursor-pointer">
              <span>Back to top</span>
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}
