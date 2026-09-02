import { SignalMode } from "../simulation/signalGenerator";
import { TrajectoryClass } from "./signalTypes";
import { DecisionState } from "./types";

export interface PhenoraRuntimeState {
  mode: "SIMULATION" | "HARDWARE";
  scenario: SignalMode; // e.g. "STABLE", "RISING", "ANOMALY"

  // Person A (Measurement Integrity)
  signal: {
    rawValue: number;
    baseline: number;
    delta: number;
    slope: number;
    noise: number;
    drift: number;
    stability: number;
    quality: number;
    sampleCount: number;
  };

  // Person B (Signal Intelligence)
  intelligence: {
    trajectory: TrajectoryClass;
    trajectoryConfidence: number;
    confidence: number;
    anomalyScore: number;
    anomalyLevel: "LOW" | "MEDIUM" | "HIGH";
    evidence: number;
    readiness: "INSUFFICIENT" | "BUILDING" | "READY";
    explanation: string[];
  };

  // Person C (FPGA Evidence/Decision)
  decision: {
    state: DecisionState;
    decision: "STOP" | "MEASURE_AGAIN" | "TIMEOUT";
    reason: string;
    measurementsTaken: number;
    stableWindows: number;
  };
}

export const INITIAL_RUNTIME_STATE: PhenoraRuntimeState = {
  mode: "SIMULATION",
  scenario: "STABLE",
  signal: {
    rawValue: 0,
    baseline: 0,
    delta: 0,
    slope: 0,
    noise: 0,
    drift: 0,
    stability: 0,
    quality: 0,
    sampleCount: 0,
  },
  intelligence: {
    trajectory: "UNKNOWN",
    trajectoryConfidence: 0,
    confidence: 0,
    anomalyScore: 0,
    anomalyLevel: "LOW",
    evidence: 0,
    readiness: "INSUFFICIENT",
    explanation: ["Waiting for initial data..."],
  },
  decision: {
    state: "ACQUIRING",
    decision: "MEASURE_AGAIN",
    reason: "Initializing system...",
    measurementsTaken: 0,
    stableWindows: 0,
  }
};
