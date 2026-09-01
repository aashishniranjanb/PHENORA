// Core type barrel — re-exports from sub-modules
// SignalFeatures, TrajectoryClass, SignalTrajectory defined in signalTypes.ts
export * from "./signalTypes";

// Intelligence contracts (SignalIntelligence, DecisionEvidence, ModelMetadata, etc.)
// Defined in core/intelligence/intelligenceTypes.ts
export * from "./intelligence/intelligenceTypes";

export interface MLResult {
  qualityScore: number;
  anomalyScore: number;

  trajectory: Trajectory;
  trajectoryConfidence: number;
}

export type Trajectory =
  | "STABLE"
  | "RISING"
  | "FALLING"
  | "TRANSITION"
  | "NOISY"
  | "DRIFTING"
  | "UNRESOLVED"
  | "UNKNOWN";

export interface EvidenceResult {
  evidenceScore: number;
  confidence: number;

  qualityContribution: number;
  stabilityContribution: number;
  trajectoryContribution: number;
  anomalyContribution: number;
  driftContribution: number;
}

export type DecisionState =
  | "ACQUIRING"
  | "MEASURE_AGAIN"
  | "STOP"
  | "TIMEOUT"
  | "INVALID";

export interface DecisionResult {
  state: DecisionState;
  reason: string;
  evidenceScore: number;
}
