import { SignalFeatures } from "../../core/types";
import { MLResult, ModelMetadata, SignalTrajectory } from "../intelligenceTypes";

export interface FeatureVector {
  rms: number;
  variance: number;
  peakToPeak: number;
  delta: number;
  slope: number;
  stability: number;
  snr: number;
  drift: number;
  // Optional temporal extensions
  meanSlope?: number;
  slopeVariance?: number;
  trendConsistency?: number;
}

export interface ModelPrediction {
  signalQuality: number;
  anomalyScore: number;
  trajectory: SignalTrajectory;
  trajectoryConfidence: number;
  confidence: number;
  reasons: string[];
}

export interface IntelligenceModel {
  predict(features: FeatureVector, rawSignal: SignalFeatures): ModelPrediction;
  getMetadata(): ModelMetadata;
}
