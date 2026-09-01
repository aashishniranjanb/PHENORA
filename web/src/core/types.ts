export interface SignalFeatures {
  timestamp: number;
  rawValue: number;

  rms: number;
  variance: number;
  peakToPeak: number;

  baseline: number;
  delta: number;
  slope: number;
  stability: number;

  snr: number;
  drift: number;
}

export type TrajectoryClass =
  | "STABLE"
  | "RISING"
  | "FALLING"
  | "TRANSITION"
  | "NOISY"
  | "DRIFTING"
  | "UNRESOLVED"
  | "UNKNOWN";

export type SignalTrajectory = TrajectoryClass;
export type Trajectory = TrajectoryClass;

export interface ModelMetadata {
  modelName: string;
  modelVersion: string;
  trained: boolean;
  trainingSource:
    | "SYNTHETIC"
    | "ELECTRICAL_VALIDATION"
    | "BIOLOGICAL"
    | "UNKNOWN";
  featureVersion: string;
  status: "EXPERIMENTAL" | "RULE_BASED" | "PROTOTYPE";
}

export interface MLResult {
  timestamp: number;

  signalQuality: number;
  anomalyScore: number;

  trajectory: SignalTrajectory;
  trajectoryConfidence: number;

  confidence: number;

  usable: boolean;

  reasons: string[];

  model: ModelMetadata;

  /** Alias for backward compatibility */
  qualityScore?: number;
}

export interface DecisionInput {
  signal: SignalFeatures;
  intelligence: MLResult;
}

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
