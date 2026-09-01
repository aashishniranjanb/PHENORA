import { IntelligenceExplanation, TrajectoryClass } from "../intelligenceTypes";

export class ExplanationEngine {
  public generateExplanation(
    qualityScore: number,
    trajectory: TrajectoryClass,
    trajectoryConfidence: number,
    anomalyScore: number,
    stability: number,
    drift: number,
    historyLength: number,
    reasons: string[]
  ): IntelligenceExplanation {
    const qualityFactors: string[] = [];
    const trajectoryFactors: string[] = [];

    // Quality explanations
    if (reasons.includes("HIGH_SNR")) qualityFactors.push("High Signal-to-Noise Ratio (+SNR)");
    if (reasons.includes("LOW_VARIANCE")) qualityFactors.push("Low baseline variance (+Clean)");
    if (reasons.includes("STABLE_SLOPE")) qualityFactors.push("High slope stability (+Stable)");
    if (reasons.includes("LOW_DRIFT")) qualityFactors.push("Low baseline drift (+LowDrift)");

    if (reasons.includes("LOW_SNR")) qualityFactors.push("Low SNR detected (-Noise)");
    if (reasons.includes("HIGH_VARIANCE")) qualityFactors.push("Elevated variance (-Fluctuation)");
    if (reasons.includes("BASELINE_DRIFT")) qualityFactors.push("Significant baseline drift (-Drift)");

    // Trajectory explanations
    trajectoryFactors.push(`Trajectory classified as ${trajectory} (${trajectoryConfidence}% confidence)`);
    if (trajectory === "STABLE") trajectoryFactors.push("Signal derivative near zero across rolling window");
    if (trajectory === "RISING") trajectoryFactors.push("Positive differential impedance trend detected");
    if (trajectory === "FALLING") trajectoryFactors.push("Negative differential impedance trend detected");
    if (trajectory === "NOISY") trajectoryFactors.push("High variance & instability obscuring trend");
    if (trajectory === "TRANSITION") trajectoryFactors.push("Slope direction shift in progress (unsettled)");

    // Confidence breakdown components (0-100 scale)
    const qualityContribution = Math.round(qualityScore * 0.35);
    const trajectoryContribution = Math.round(trajectoryConfidence * 0.30);
    const stabilityContribution = Math.round(stability * 100 * 0.25);
    const anomalyPenalty = Math.round(anomalyScore * 0.4);
    const driftPenalty = Math.round(Math.min(30, Math.abs(drift) * 500));
    const historyBonus = Math.round(Math.min(10, (historyLength / 10) * 10));

    const totalConfidence = Math.max(
      0,
      Math.min(
        100,
        qualityContribution +
          trajectoryContribution +
          stabilityContribution +
          historyBonus -
          anomalyPenalty -
          driftPenalty
      )
    );

    const summary = `Overall confidence is ${totalConfidence}%. Quality is ${qualityScore}%, Trajectory is ${trajectory} (${trajectoryConfidence}%), and Anomaly Risk is ${anomalyScore}%.`;

    return {
      qualityFactors,
      trajectoryFactors,
      confidenceBreakdown: {
        qualityContribution,
        trajectoryContribution,
        stabilityContribution,
        anomalyPenalty,
        driftPenalty,
        historyBonus,
      },
      summary,
    };
  }
}
