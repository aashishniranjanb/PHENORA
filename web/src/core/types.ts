export * from "./signalTypes";

export interface MLResult {
  qualityScore: number;
  anomalyScore: number;

  trajectory: Trajectory;
  trajectoryConfidence: number;
}

import { TrajectoryClass } from "./signalTypes";
export type Trajectory = TrajectoryClass;

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
