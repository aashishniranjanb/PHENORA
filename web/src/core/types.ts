export * from "./signalTypes";

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
  | "UNRESOLVED";

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
