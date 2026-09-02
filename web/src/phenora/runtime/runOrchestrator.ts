import { 
  PhenoraRun, 
  PipelinePhase, 
  RunMode, 
  SimulationScenario, 
  StageId, 
  StageState 
} from "../types";
import { runtimeEventEmitter } from "./runtimeEvents";

export class RunOrchestrator {
  private runState: PhenoraRun | null = null;
  
  public startRun(
    mode: RunMode, 
    simulationScenario?: SimulationScenario
  ): PhenoraRun {
    const runId = `PF-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    
    this.runState = {
      runId,
      phase: "SAMPLE_READY",
      measurementCycle: 1,
      stages: this.getInitialStages(),
      startTimestamp: Date.now(),
      mode,
      simulation: mode === 'SIMULATION' ? {
        enabled: true,
        scenario: simulationScenario || 'STABLE'
      } : undefined
    };

    this.emit("RUN_STARTED");
    return this.runState;
  }

  public advancePhase(newPhase: PipelinePhase, stageUpdates?: Partial<Record<StageId, StageState>>) {
    if (!this.runState) return;
    
    this.runState.phase = newPhase;
    
    if (stageUpdates) {
      this.runState.stages = { ...this.runState.stages, ...stageUpdates };
    }
  }

  public getRun(): PhenoraRun | null {
    return this.runState;
  }

  public emit(type: import("../types").RuntimeEventType, data?: any) {
    if (!this.runState) return;
    runtimeEventEmitter.emit({
      type,
      timestamp: Date.now(),
      runId: this.runState.runId,
      phase: this.runState.phase,
      data
    });
  }

  private getInitialStages(): Record<StageId, StageState> {
    return {
      SAMPLE: 'ACTIVE',
      ACQUISITION: 'LOCKED',
      IMPEDANCE: 'LOCKED',
      PHENOTYPE: 'LOCKED',
      DISEASE: 'LOCKED',
      TWIN: 'LOCKED',
      FORECAST: 'LOCKED',
      AUTONOMY: 'LOCKED',
      RESULT: 'LOCKED'
    };
  }
}
