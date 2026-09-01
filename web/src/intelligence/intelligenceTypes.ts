import { SignalFeatures } from "../core/types";

export type SignalTrajectory =
  | "STABLE"
  | "RISING"
  | "FALLING"
  | "NOISY"
  | "DRIFTING"
  | "TRANSITION"
  | "UNKNOWN";

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

  /** Backward-compatibility alias */
  qualityScore?: number;
}

export interface DecisionInput {
  signal: SignalFeatures;
  intelligence: MLResult;
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
