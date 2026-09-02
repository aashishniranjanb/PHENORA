"use client";

import React, { useEffect } from 'react';
import { usePhenoraRuntime } from '../../core/usePhenoraRuntime';
import { RuntimeHeader } from './RuntimeHeader';
import { LiveSignalChart } from './LiveSignalChart';
import { SignalMetrics } from './SignalMetrics';
import { IntelligencePanel } from './IntelligencePanel';
import { DecisionPanel } from './DecisionPanel';
import { PipelineVisualizer } from './PipelineVisualizer';

export default function SpectraePage() {
  const {
    state,
    isRunning,
    setIsRunning,
    resetPipeline,
    stepPipeline,
    latestSamples
  } = usePhenoraRuntime();

  // If the user clicks start but it hits STOP/TIMEOUT, it will automatically pause.
  // We can handle auto-stopping here.
  useEffect(() => {
    if (isRunning && (state.decision.decision === "STOP" || state.decision.decision === "TIMEOUT")) {
      setIsRunning(false);
    }
  }, [isRunning, state.decision.decision, setIsRunning]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header (Scenario & Mode Control) */}
        <RuntimeHeader 
          mode={state.mode}
          isRunning={isRunning}
          scenario={state.scenario}
          onToggleRun={() => {
            if (!isRunning && (state.decision.decision === "STOP" || state.decision.decision === "TIMEOUT")) {
                resetPipeline(state.scenario);
            }
            setIsRunning(!isRunning);
          }}
          onScenarioChange={(s) => resetPipeline(s)}
          onDataSourceChange={(m) => {
            // Future hook to switch to real hardware
            console.log("Switching to", m);
          }}
        />

        {/* Core UI Story Flow */}
        <div className="flex flex-col items-center max-w-2xl mx-auto space-y-2">
          
          {/* 1. SIGNAL QUALITY */}
          <div className="w-full flex flex-col space-y-0 shadow-sm">
            <LiveSignalChart samples={latestSamples} baseline={state.signal.baseline} />
            <SignalMetrics signal={state.signal} />
          </div>

          {/* Arrow */}
          <div className="text-gray-400 py-2">▼</div>

          {/* 2. INTELLIGENCE */}
          <div className="w-full shadow-sm">
            <IntelligencePanel intelligence={state.intelligence} signalQuality={state.signal.quality} hasData={state.decision.measurementsTaken > 0} />
          </div>

          {/* Arrow */}
          <div className="text-gray-400 py-2">▼</div>

          {/* 3. EVIDENCE */}
          <div className="w-full bg-white border border-gray-200 p-6 font-mono text-center shadow-sm">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
              Evidence Accumulation
            </div>
            <div className="text-4xl font-black text-blue-600 mb-2">
              {state.decision.measurementsTaken === 0 ? "NIL" : `${state.intelligence.evidence.toFixed(1)}%`}
            </div>
            <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden">
              <div 
                className="bg-blue-500 h-full transition-all duration-300"
                style={{ width: `${state.decision.measurementsTaken === 0 ? 0 : state.intelligence.evidence}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-400 mt-2 uppercase">
              READINESS: {state.decision.measurementsTaken === 0 ? "NIL" : state.intelligence.readiness}
            </div>
          </div>

          {/* Arrow */}
          <div className="text-gray-400 py-2">▼</div>

          {/* 4. FPGA DECISION */}
          <div className="w-full shadow-sm">
            <DecisionPanel decision={state.decision} evidence={state.intelligence.evidence} hasData={state.decision.measurementsTaken > 0} />
          </div>
          
          {/* Loopback visual if measuring again */}
          {state.decision.decision === 'MEASURE_AGAIN' && (
            <div className="flex flex-col items-center text-blue-500 mt-4 animate-pulse">
              <div className="text-xs font-bold uppercase tracking-widest mb-1">New Measurement Required</div>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 4v16m0-16l-4 4m4-4l4 4" />
              </svg>
            </div>
          )}

        </div>

        {/* Explanatory Footer */}
        <div className="bg-white border border-gray-200 p-6 text-sm text-gray-600 font-mono mt-8">
          <h3 className="font-bold uppercase tracking-wider text-gray-900 mb-2 border-b border-gray-100 pb-2">Why?</h3>
          <p>
            The PHENORA pipeline continuously evaluates signal quality (Person A) and trajectory (Person B) 
            to determine exactly when additional measurement is necessary (Person C). If the signal is unstable or noisy, 
            confidence drops and the FPGA continues to acquire data until the evidence threshold is met.
          </p>
        </div>

      </div>
    </div>
  );
}
