// ============================================================================
// PHENORA Statistical Anomaly Detector (PERSON B)
// Uses Rolling Z-Score, Median Absolute Deviation (MAD), and Spike Detection
// ============================================================================

import { SignalFeatures } from "../intelligenceTypes";

export interface AnomalyAnalysis {
  anomalyScore: number;     // 0-100 (0=normal, 100=extreme anomaly)
  anomalyDetected: boolean; // true if score >= threshold
  zScore: number;
  isSpike: boolean;
  notes: string[];
}

export class AnomalyDetector {
  private readonly anomalyThresholdScore = 50;

  public analyze(current: SignalFeatures, history: SignalFeatures[]): AnomalyAnalysis {
    const notes: string[] = [];
    if (history.length < 3) {
      return {
        anomalyScore: 0,
        anomalyDetected: false,
        zScore: 0,
        isSpike: false,
        notes: ["Insufficient history for anomaly baseline"],
      };
    }

    const deltas = history.map((h) => h.delta);
    const mean = deltas.reduce((a, b) => a + b, 0) / deltas.length;
    const stdDev = Math.sqrt(
      deltas.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / deltas.length
    ) || 0.0001;

    // Rolling Z-Score
    const zScore = Math.abs((current.delta - mean) / stdDev);

    // Median Absolute Deviation (MAD)
    const sorted = [...deltas].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    const mad = [...deltas].map((d) => Math.abs(d - median)).sort((a, b) => a - b)[Math.floor(deltas.length / 2)] || 0.0001;
    const modifiedZScore = 0.6745 * Math.abs(current.delta - median) / mad;

    // Impulse Spike Detection
    const prevDelta = history[history.length - 2]?.delta ?? current.delta;
    const deltaJump = Math.abs(current.delta - prevDelta);
    const isSpike = deltaJump > 0.02 && zScore > 3.0;

    let anomalyScore = 0;
    if (isSpike) {
      anomalyScore = 95;
      notes.push("Impulse spike anomaly detected");
    } else if (modifiedZScore > 3.5 || zScore > 3.5) {
      anomalyScore = Math.min(90, Math.round(zScore * 20));
      notes.push(`High statistical deviation (Z=${zScore.toFixed(2)})`);
    } else if (zScore > 2.0) {
      anomalyScore = Math.round(zScore * 15);
      notes.push(`Moderate deviation (Z=${zScore.toFixed(2)})`);
    } else {
      anomalyScore = 0;
    }

    const anomalyDetected = anomalyScore >= this.anomalyThresholdScore;

    return {
      anomalyScore,
      anomalyDetected,
      zScore,
      isSpike,
      notes,
    };
  }
}
