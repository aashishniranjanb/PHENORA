// ============================================================================
// PHENORA Explainability Engine (PERSON B)
// Generates transparent score explanations and model-development feature importances
// ============================================================================

import { ConfidenceAnalysis } from "../confidence/confidenceEngine";
import { IntelligenceExplanation } from "../intelligenceTypes";

export class ExplanationEngine {
  public generateExplanation(
    confidence: ConfidenceAnalysis,
    trajectoryName: string,
    qualityScore: number,
    anomalyScore: number
  ): IntelligenceExplanation {
    let overallReason = "";

    if (confidence.confidenceScore >= 80) {
      overallReason = `Signal is highly usable with clean ${trajectoryName} trajectory and strong temporal stability.`;
    } else if (anomalyScore > 50) {
      overallReason = `Confidence reduced due to statistical anomaly detected in current measurement window.`;
    } else if (qualityScore < 50) {
      overallReason = `Confidence limited by low signal-to-noise ratio or measurement variance.`;
    } else {
      overallReason = `Temporal evidence is currently building across measurement windows (${confidence.evidenceScore}% evidence accumulated).`;
    }

    const featureImportances = [
      { feature: "Slope Consistency", importance: 0.28 },
      { feature: "SNR Cleanliness", importance: 0.24 },
      { feature: "Stationary Stability", importance: 0.20 },
      { feature: "Low Anomaly Risk", importance: 0.15 },
      { feature: "Drift Control", importance: 0.08 },
      { feature: "Sample History Length", importance: 0.05 },
    ];

    return {
      overallReason,
      qualityFactor: confidence.qualityContribution,
      trajectoryFactor: confidence.trajectoryContribution,
      stabilityFactor: confidence.stabilityContribution,
      anomalyPenalty: confidence.anomalyPenalty,
      driftPenalty: confidence.driftPenalty,
      historyFactor: Math.round(confidence.historyFactor * 100),
      featureImportances,
    };
  }
}
