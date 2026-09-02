"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { 
  PhenoraFlashResult, 
  PhenoraRun, 
  RunMode, 
  SimulationScenario, 
  StageId, 
  ViewMode 
} from "@/phenora/types";
import { RunOrchestrator } from "@/phenora/runtime/runOrchestrator";
import { SimulationEngine } from "@/phenora/runtime/simulationEngine";
import { runtimeEventEmitter } from "@/phenora/runtime/runtimeEvents";

export function usePhenoraRun() {
  const orchestratorRef = useRef<RunOrchestrator | null>(null);
  const simulationEngineRef = useRef<SimulationEngine | null>(null);

  if (!orchestratorRef.current) {
    orchestratorRef.current = new RunOrchestrator();
    simulationEngineRef.current = new SimulationEngine(orchestratorRef.current);
  }

  const [run, setRun] = useState<PhenoraRun | null>(null);
  const [result, setResult] = useState<PhenoraFlashResult | null>(null);
  const [activeStage, setActiveStage] = useState<StageId>("SAMPLE");
  const [viewMode, setViewMode] = useState<ViewMode>("OPERATOR");
  const [scenario, setScenario] = useState<SimulationScenario>("STABLE");
  const [isRunning, setIsRunning] = useState(false);
  const [sampleId, setSampleId] = useState("URINE-017");

  useEffect(() => {
    const unsubscribe = runtimeEventEmitter.subscribe((event) => {
      if (event.data) {
        setResult((prev) => ({
          ...(prev || {}),
          ...event.data,
        } as PhenoraFlashResult));
      }

      if (orchestratorRef.current) {
        const currentRun = orchestratorRef.current.getRun();
        if (currentRun) {
          setRun({ ...currentRun });
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const startSimulation = useCallback(async (selectedScenario?: SimulationScenario) => {
    const sc = selectedScenario || scenario;
    if (!orchestratorRef.current || !simulationEngineRef.current) return;

    setIsRunning(true);
    const newRun = orchestratorRef.current.startRun("SIMULATION", sc);
    setRun({ ...newRun });
    setActiveStage("ACQUISITION");

    try {
      const res = await simulationEngineRef.current.executeMeasurementCycle(sc, sampleId);
      setResult(res);
    } catch (err) {
      console.error("Simulation run error:", err);
    } finally {
      setIsRunning(false);
    }
  }, [scenario, sampleId]);

  const runNextCycle = useCallback(async () => {
    if (!simulationEngineRef.current || isRunning) return;
    setIsRunning(true);

    try {
      const res = await simulationEngineRef.current.executeMeasurementCycle(scenario, sampleId);
      setResult(res);
    } catch (err) {
      console.error("Cycle error:", err);
    } finally {
      setIsRunning(false);
    }
  }, [scenario, sampleId, isRunning]);

  return {
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
  };
}
