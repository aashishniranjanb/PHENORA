import { SignalFeatures } from "../core/types";

export type TrajectoryClass =
  | "STABLE"
  | "RISING"
  | "FALLING"
  | "TRANSITION"
  | "NOISY"
  | "DRIFTING"
  | "UNRESOLVED"
  | "UNKNOWN";

/** Alias for backward compatibility */
export type SignalTrajectory = TrajectoryClass;

export type DecisionReadiness =
  | "INSUFFICIENT"
  | "BUILDING"
  | "HIGH"
  | "READY";

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

/** Compact byte-friendly payload for FPGA / Person C UART integration */
export interface DecisionEvidence {
  quality: number;       // 0–255
  confidence: number;    // 0–255
  anomaly: number;       // 0–255
  trajectory: number;    // uint8 enum index
  flags: number;         // uint8 bitfield
}

export interface IntelligenceExplanation {
  qualityFactors: string[];
  trajectoryFactors: string[];
  confidenceBreakdown: {
    qualityContribution: number;
    trajectoryContribution: number;
    stabilityContribution: number;
    anomalyPenalty: number;
    driftPenalty: number;
    historyBonus: number;
  };
  summary: string;
}

export interface SignalIntelligence {
  timestamp: number;

  qualityScore: number;          // 0–100

  trajectory: TrajectoryClass;
  trajectoryConfidence: number;  // 0–100

  anomalyScore: number;          // 0–100
  anomalyDetected: boolean;

  confidenceScore: number;       // 0–100

  evidenceScore: number;         // 0–100

  decisionReadiness: DecisionReadiness;

  explanation: IntelligenceExplanation;

  evidencePayload: DecisionEvidence;

  reasons: string[];

  usable: boolean;

  model: ModelMetadata;
}

/** Backward-compatible alias */
export interface MLResult extends SignalIntelligence {
  signalQuality: number; // 0..1
}

export interface DecisionInput {
  signal: SignalFeatures;
  intelligence: SignalIntelligence;
}

export interface FeatureHistory {
  points: SignalFeatures[];
  maxLength: number;
}

export interface TemporalFeatures {
  meanSlope: number;
  slopeVariance: number;
  trendConsistency: number;
  consecutiveStableWindows: number;
  recentChange: number;
  timeSinceTransition: number;
}

export interface QualityConfig {
  minSnr: number;
  maxVariance: number;
  maxDrift: number;
  minStability: number;
}

export interface TrajectoryConfig {
  stableSlopeThreshold: number;
  minRisingSlope: number;
  minFallingSlope: number;
  maxNoiseVariance: number;
  minDriftThreshold: number;
  transitionSlopeChangeRatio: number;
}

export interface AnomalyConfig {
  zScoreThreshold: number;
  historyWindow: number;
  minPointsForAnomaly: number;
}

export interface ConfidenceConfig {
  minUsableQuality: number;
  minUsableConfidence: number;
  maxUsableAnomaly: number;
}

export interface IntelligenceConfig {
  historyMaxLength: number;
  quality: QualityConfig;
  trajectory: TrajectoryConfig;
  anomaly: AnomalyConfig;
  confidence: ConfidenceConfig;
}

export interface IntelligenceDebug {
  qualityComponents: {
    snrScore: number;
    varianceScore: number;
    stabilityScore: number;
    driftScore: number;
  };
  trajectoryEvidence: {
    positiveSlopeEvidence: number;
    negativeSlopeEvidence: number;
    stableEvidence: number;
    transitionEvidence: number;
  };
  anomalyComponents: Record<string, number>;
  temporalFeatures: TemporalFeatures;
}
