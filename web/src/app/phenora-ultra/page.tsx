"use client";

import React from "react";
import { usePhenoraRun } from "@/hooks/phenora/usePhenoraRun";

import TopBar from "@/components/phenora-ultra/shell/TopBar";
import StatusBar from "@/components/phenora-ultra/shell/StatusBar";
import ExperimentTimeline from "@/components/phenora-ultra/timeline/ExperimentTimeline";
import IntelligencePanel from "@/components/phenora-ultra/panels/IntelligencePanel";

import SampleStage from "@/components/phenora-ultra/stages/SampleStage";
import AcquisitionStage from "@/components/phenora-ultra/stages/AcquisitionStage";
import ImpedanceStage from "@/components/phenora-ultra/stages/ImpedanceStage";
import PhenotypeStage from "@/components/phenora-ultra/stages/PhenotypeStage";
import DiseaseStage from "@/components/phenora-ultra/stages/DiseaseStage";
import TwinStage from "@/components/phenora-ultra/stages/TwinStage";
import ForecastStage from "@/components/phenora-ultra/stages/ForecastStage";
import AutonomyStage from "@/components/phenora-ultra/stages/AutonomyStage";
import ResultStage from "@/components/phenora-ultra/stages/ResultStage";

export default function PhenoraUltraPage() {
  const {
    run,
    result,
    activeStage,
    setActiveStage,
    viewMode,
    setViewMode,
    scenario,
    setScenario,
    isRunning,
    sampleId,
    setSampleId,
    startSimulation,
    runNextCycle,
  } = usePhenoraRun();

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 overflow-hidden font-mono">
      {/* 1. Global Top Bar */}
      <TopBar
        run={run}
        viewMode={viewMode}
        setViewMode={setViewMode}
        scenario={scenario}
        setScenario={setScenario}
        isRunning={isRunning}
        onStartSimulation={startSimulation}
      />

      {/* 2. Defining Horizontal Timeline */}
      <ExperimentTimeline
        run={run}
        activeStage={activeStage}
        onSelectStage={setActiveStage}
      />

      {/* 3. Main Stage Content Area + Right Intelligence Panel */}
      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-slate-50 p-2">
          {activeStage === "SAMPLE" && (
            <SampleStage
              sampleId={sampleId}
              setSampleId={setSampleId}
              onVerify={startSimulation}
            />
          )}

          {activeStage === "ACQUISITION" && (
            <AcquisitionStage result={result} isRunning={isRunning} />
          )}

          {activeStage === "IMPEDANCE" && (
            <ImpedanceStage result={result} />
          )}

          {activeStage === "PHENOTYPE" && (
            <PhenotypeStage result={result} />
          )}

          {activeStage === "DISEASE" && (
            <DiseaseStage result={result} />
          )}

          {activeStage === "TWIN" && (
            <TwinStage result={result} />
          )}

          {activeStage === "FORECAST" && (
            <ForecastStage result={result} />
          )}

          {activeStage === "AUTONOMY" && (
            <AutonomyStage
              result={result}
              onRunNextCycle={runNextCycle}
              isRunning={isRunning}
            />
          )}

          {activeStage === "RESULT" && (
            <ResultStage
              result={result}
              onRunAgain={startSimulation}
            />
          )}
        </main>

        {/* 4. Global Right-Side Intelligence Panel */}
        <IntelligencePanel
          result={result}
          onRunNextCycle={runNextCycle}
          isRunning={isRunning}
        />
      </div>

      {/* 5. Global Bottom Status Bar */}
      <StatusBar run={run} result={result} isRunning={isRunning} />
    </div>
  );
}
