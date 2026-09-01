// ============================================================================
// PHENORA Transparent Confidence & Evidence Engine (PERSON B)
// Computes aggregated confidenceScore, evidenceScore accumulation & decisionReadiness
// ============================================================================

import { DecisionReadiness, SignalFeatures, TrajectoryClass } from "../intelligenceTypes";

export interface ConfidenceAnalysis {
  confidenceScore: number;       // 0–100 aggregated
  evidenceScore: number;         // 0–100 accumulated over time
  decisionReadiness: DecisionReadiness;
  qualityContribution: number;
  trajectoryContribution: number;
  stabilityContribution: number;
  anomalyPenalty: number;
  driftPenalty: number;
  historyFactor: number;
}

export class ConfidenceEngine {
  private accumulatedEvidence = 0;

  public resetEvidence(): void {
    this.accumulatedEvidence = 0;
  }

  public analyze(
    qualityScore: number,
    trajectory: TrajectoryClass,
    trajectoryConfidence: number,
    anomalyScore: number,
    features: SignalFeatures,
    historyLength: number
  ): ConfidenceAnalysis {
    // 1. Quality Contribution (0-30)
    const qualityContribution = Math.round((qualityScore / 100) * 30);

    // 2. Trajectory Contribution (0-25)
    let trajectoryContribution = Math.round((trajectoryConfidence / 100) * 25);
    if (trajectory === "NOISY" || trajectory === "UNRESOLVED") {
      trajectoryContribution = Math.round(trajectoryContribution * 0.4);
    }

    // 3. Stability Contribution (0-25)
    const stabilityContribution = Math.round(features.stability * 25);

    // 4. Anomaly Penalty (0-20)
    const anomalyPenalty = Math.round((anomalyScore / 100) * 20);

    // 5. Drift Penalty (0-15)
    const driftPenalty = Math.round(Math.min(1.0, Math.abs(features.drift) / 0.1) * 15);

    // 6. History Factor (0.0 - 1.0)
    const historyFactor = Math.min(1.0, historyLength / 5);

    // Calculate aggregated confidence
    const rawConfidence =
      (qualityContribution + trajectoryContribution + stabilityContribution - anomalyPenalty - driftPenalty) *
      historyFactor;

    const confidenceScore = Math.round(Math.min(100, Math.max(0, rawConfidence + 20))); // Normalize base

    // Accumulate Evidence Over Time
    if (qualityScore >= 50 && anomalyScore < 50 && (trajectory === "STABLE" || trajectory === "RISING" || trajectory === "FALLING")) {
      this.accumulatedEvidence = Math.min(100, this.accumulatedEvidence + Math.round(confidenceScore * 0.2));
    } else {
      // Reset or decrement on unstable/anomalous window
      this.accumulatedEvidence = Math.max(0, this.accumulatedEvidence - 15);
    }

    const evidenceScore = this.accumulatedEvidence;

    // Decision Readiness Gating
    let decisionReadiness: DecisionReadiness = "INSUFFICIENT";
    if (historyLength < 3 || confidenceScore < 40) {
      decisionReadiness = "INSUFFICIENT";
    } else if (evidenceScore >= 80 && confidenceScore >= 75) {
      decisionReadiness = "READY";
    } else if (evidenceScore >= 50) {
      decisionReadiness = "HIGH";
    } else {
      decisionReadiness = "BUILDING";
    }

    return {
      confidenceScore,
      evidenceScore,
      decisionReadiness,
      qualityContribution,
      trajectoryContribution,
      stabilityContribution,
      anomalyPenalty,
      driftPenalty,
      historyFactor,
    };
  }
}
