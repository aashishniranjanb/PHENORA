import { ConfidenceConfig, SignalTrajectory } from "../intelligenceTypes";

export const DEFAULT_CONFIDENCE_CONFIG: ConfidenceConfig = {
  minUsableQuality: 0.4,
  minUsableConfidence: 0.4,
  maxUsableAnomaly: 0.7,
};

export interface ConfidenceEstimate {
  overallConfidence: number; // 0..1
  usable: boolean;
  reasons: string[];
}

export class ConfidenceEstimator {
  private config: ConfidenceConfig;

  constructor(config: Partial<ConfidenceConfig> = {}) {
    this.config = { ...DEFAULT_CONFIDENCE_CONFIG, ...config };
  }

  public estimate(
    signalQuality: number,
    trajectory: SignalTrajectory,
    trajectoryConfidence: number,
    anomalyScore: number,
    stability: number,
    drift: number,
    historyLength: number
  ): ConfidenceEstimate {
    const reasons: string[] = [];

    // History sufficiency factor [0..1]
    const historyFactor = Math.min(1.0, historyLength / 5.0);
    if (historyLength < 3) {
      reasons.push("INSUFFICIENT_HISTORY");
    }

    // High drift penalty
    const driftPenalty = Math.min(0.3, Math.abs(drift) * 5.0);

    // High anomaly penalty
    const anomalyPenalty = Math.min(0.5, anomalyScore * 0.7);

    // Baseline confidence weighting: Quality (40%), Trajectory Confidence (30%), Stability (30%)
    let baseConfidence =
      signalQuality * 0.4 +
      trajectoryConfidence * 0.3 +
      stability * 0.3;

    // Apply penalties and history scaling
    let overallConfidence = (baseConfidence - driftPenalty - anomalyPenalty) * historyFactor;
    overallConfidence = Number(Math.max(0.0, Math.min(1.0, overallConfidence)).toFixed(4));

    // Determine usability flag
    const isQualityUsable = signalQuality >= this.config.minUsableQuality;
    const isConfidenceUsable = overallConfidence >= this.config.minUsableConfidence;
    const isAnomalyUsable = anomalyScore <= this.config.maxUsableAnomaly;
    const isTrajectoryKnown = trajectory !== "UNKNOWN";

    const usable = isQualityUsable && isConfidenceUsable && isAnomalyUsable && isTrajectoryKnown;

    if (!usable) {
      if (!isQualityUsable) reasons.push("QUALITY_TOO_LOW");
      if (!isConfidenceUsable) reasons.push("CONFIDENCE_TOO_LOW");
      if (!isAnomalyUsable) reasons.push("HIGH_ANOMALY_DETECTED");
      if (!isTrajectoryKnown) reasons.push("UNCLEAR_TRAJECTORY");
    } else {
      reasons.push("SIGNAL_USABLE_FOR_DECISION");
    }

    return {
      overallConfidence,
      usable,
      reasons,
    };
  }
}
