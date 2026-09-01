// ============================================================================
// PHENORA Signal Intelligence Data Contracts (PERSON B)
// ============================================================================

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
  | "UNRESOLVED";

export type DecisionReadiness =
  | "INSUFFICIENT"
  | "BUILDING"
  | "HIGH"
  | "READY";

export interface IntelligenceExplanation {
  overallReason: string;
  qualityFactor: number;
  trajectoryFactor: number;
  stabilityFactor: number;
  anomalyPenalty: number;
  driftPenalty: number;
  historyFactor: number;
  featureImportances: Array<{ feature: string; importance: number }>;
}

export interface SignalIntelligence {
  timestamp: number;
  qualityScore: number;                 // 0–100
  trajectory: TrajectoryClass;         // Classification
  trajectoryConfidence: number;         // 0–100
  anomalyScore: number;                 // 0–100
  anomalyDetected: boolean;             // Anomaly flag
  confidenceScore: number;              // 0–100 aggregated
  evidenceScore: number;                // 0–100 accumulated
  decisionReadiness: DecisionReadiness; // Readiness
  explanation: IntelligenceExplanation;// Explainability
}

// Compact decision payload formatted for FPGA UART transfer to Person C
export interface DecisionEvidence {
  quality: number;    // 0–255 uint8
  confidence: number; // 0–255 uint8
  anomaly: number;    // 0–255 uint8
  trajectory: number; // enum code 0-6
  flags: number;      // bitfield (bit 0: usable, bit 1: traj valid, bit 2: noisy, bit 3: drifting, bit 4: anomaly, bit 5: baseline valid)
}

export interface ModelMetadata {
  modelId: string;
  version: string;
  algorithm: string;
  trainingDate: string;
  featureSchemaVersion: string;
  datasetVersion: string;
  status: "EXPERIMENTAL" | "RULE_BASED" | "PROTOTYPE";
}
