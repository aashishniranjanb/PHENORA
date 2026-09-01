import { SignalFeatures } from "../../core/types";
import { SignalTrajectory, TemporalFeatures, TrajectoryConfig } from "../intelligenceTypes";

export const DEFAULT_TRAJECTORY_CONFIG: TrajectoryConfig = {
  stableSlopeThreshold: 0.002,
  minRisingSlope: 0.005,
  minFallingSlope: -0.005,
  maxNoiseVariance: 0.04,
  minDriftThreshold: 0.015,
  transitionSlopeChangeRatio: 0.5,
};

export interface TrajectoryResult {
  trajectory: SignalTrajectory;
  confidence: number;
  evidence: {
    positiveSlopeEvidence: number;
    negativeSlopeEvidence: number;
    stableEvidence: number;
    transitionEvidence: number;
  };
}

export class TrajectoryClassifier {
  private config: TrajectoryConfig;

  constructor(config: Partial<TrajectoryConfig> = {}) {
    this.config = { ...DEFAULT_TRAJECTORY_CONFIG, ...config };
  }

  public classify(
    features: SignalFeatures,
    temporal: TemporalFeatures,
    historyLength: number
  ): TrajectoryResult {
    // Default fallback for insufficient history
    if (historyLength < 2) {
      return {
        trajectory: "UNKNOWN",
        confidence: 0.2,
        evidence: {
          positiveSlopeEvidence: 0,
          negativeSlopeEvidence: 0,
          stableEvidence: 0.5,
          transitionEvidence: 0,
        },
      };
    }

    const { slope, variance, snr, drift, stability } = features;
    const { meanSlope, slopeVariance, trendConsistency } = temporal;

    const absSlope = Math.abs(meanSlope);
    const isStableSlope = absSlope <= this.config.stableSlopeThreshold;
    const isRisingSlope = meanSlope >= this.config.minRisingSlope;
    const isFallingSlope = meanSlope <= this.config.minFallingSlope;

    const noiseFactor = Math.min(1.0, variance / this.config.maxNoiseVariance);
    const isHighNoise = noiseFactor > 0.6 || snr < 6.0;

    const isDrifting = Math.abs(drift) >= this.config.minDriftThreshold && Math.abs(drift) > absSlope * 1.5;

    // Detect state transitions:
    // 1. High slope variance across window
    // 2. Trend consistency drops below 0.7 during non-zero mean slope
    // 3. Current sample slope sign opposes history mean slope when both are significant
    const isSignFlip =
      Math.abs(features.slope) > this.config.stableSlopeThreshold &&
      Math.abs(meanSlope) > this.config.stableSlopeThreshold &&
      Math.sign(features.slope) !== Math.sign(meanSlope);

    const isTransitioning =
      slopeVariance > 0.00015 ||
      isSignFlip ||
      (trendConsistency < 0.7 && absSlope > this.config.stableSlopeThreshold);

    let trajectory: SignalTrajectory = "UNKNOWN";
    let confidence = 0.5;

    // Decision hierarchy
    if (isHighNoise && stability < 0.5) {
      trajectory = "NOISY";
      confidence = Number((0.6 + noiseFactor * 0.3).toFixed(4));
    } else if (isTransitioning) {
      trajectory = "TRANSITION";
      confidence = Number((0.6 + (1 - trendConsistency) * 0.3).toFixed(4));
    } else if (isDrifting) {
      trajectory = "DRIFTING";
      confidence = Number((0.7 + Math.min(0.25, Math.abs(drift) * 10)).toFixed(4));
    } else if (isRisingSlope) {
      trajectory = "RISING";
      const slopeMagnitudeConfidence = Math.min(0.4, (meanSlope / 0.05) * 0.4);
      confidence = Number((0.55 + trendConsistency * 0.3 + slopeMagnitudeConfidence).toFixed(4));
    } else if (isFallingSlope) {
      trajectory = "FALLING";
      const slopeMagnitudeConfidence = Math.min(0.4, (Math.abs(meanSlope) / 0.05) * 0.4);
      confidence = Number((0.55 + trendConsistency * 0.3 + slopeMagnitudeConfidence).toFixed(4));
    } else if (isStableSlope && stability >= 0.6) {
      trajectory = "STABLE";
      confidence = Number((0.6 + stability * 0.3 + (1 - noiseFactor) * 0.1).toFixed(4));
    } else {
      trajectory = "UNKNOWN";
      confidence = 0.4;
    }

    // Clamp confidence
    confidence = Math.max(0.1, Math.min(1.0, confidence));

    return {
      trajectory,
      confidence,
      evidence: {
        positiveSlopeEvidence: isRisingSlope ? Math.min(1.0, meanSlope / 0.02) : 0,
        negativeSlopeEvidence: isFallingSlope ? Math.min(1.0, Math.abs(meanSlope) / 0.02) : 0,
        stableEvidence: isStableSlope ? stability : 0,
        transitionEvidence: isTransitioning ? 1.0 - trendConsistency : 0,
      },
    };
  }
}
