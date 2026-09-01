import { SignalFeatures } from "../../core/types";
import { AnomalyConfig } from "../intelligenceTypes";

export const DEFAULT_ANOMALY_CONFIG: AnomalyConfig = {
  zScoreThreshold: 2.5,
  historyWindow: 15,
  minPointsForAnomaly: 3,
};

export interface AnomalyResult {
  score: number; // 0..1
  reasons: string[];
  components: Record<string, number>;
}

export class AnomalyDetector {
  private config: AnomalyConfig;

  constructor(config: Partial<AnomalyConfig> = {}) {
    this.config = { ...DEFAULT_ANOMALY_CONFIG, ...config };
  }

  public detect(
    features: SignalFeatures,
    history: SignalFeatures[]
  ): AnomalyResult {
    const components: Record<string, number> = {};
    const reasons: string[] = [];

    if (history.length < this.config.minPointsForAnomaly) {
      return {
        score: 0.0,
        reasons: [],
        components: { baselineDeviation: 0, slopeDeviation: 0, varianceDeviation: 0 },
      };
    }

    const window = history.slice(-this.config.historyWindow);

    // Helper: calculate mean and stdev of a feature over window
    const calcStats = (key: keyof SignalFeatures) => {
      const vals = window.map((p) => Number(p[key]));
      const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
      const variance = vals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / vals.length;
      const stdev = Math.sqrt(variance) || 1e-6;
      return { mean, stdev };
    };

    // 1. RMS/Raw Value Spike (FEATURE_SPIKE)
    const rmsStats = calcStats("rms");
    const rmsZScore = Math.abs(features.rms - rmsStats.mean) / rmsStats.stdev;
    components.rmsZScore = Number(rmsZScore.toFixed(3));
    if (rmsZScore > this.config.zScoreThreshold) {
      reasons.push("FEATURE_SPIKE");
    }

    // 2. Slope abrupt shift (SLOPE_CHANGE)
    const slopeStats = calcStats("slope");
    const slopeZScore = Math.abs(features.slope - slopeStats.mean) / slopeStats.stdev;
    components.slopeZScore = Number(slopeZScore.toFixed(3));
    if (slopeZScore > this.config.zScoreThreshold) {
      reasons.push("SLOPE_CHANGE");
    }

    // 3. Variance explosion (VARIANCE_CHANGE)
    const varStats = calcStats("variance");
    const varZScore = Math.abs(features.variance - varStats.mean) / varStats.stdev;
    components.varZScore = Number(varZScore.toFixed(3));
    if (varZScore > this.config.zScoreThreshold) {
      reasons.push("VARIANCE_CHANGE");
    }

    // 4. SNR Collapse (SNR_COLLAPSE)
    const snrStats = calcStats("snr");
    const snrDrop = snrStats.mean - features.snr;
    components.snrDrop = Number(snrDrop.toFixed(3));
    if (snrDrop > 10.0 || (snrStats.mean > 15.0 && features.snr < 5.0)) {
      reasons.push("SNR_COLLAPSE");
    }

    // 5. Baseline sudden shift (BASELINE_SHIFT)
    const baseStats = calcStats("baseline");
    const baseZScore = Math.abs(features.baseline - baseStats.mean) / baseStats.stdev;
    components.baselineZScore = Number(baseZScore.toFixed(3));
    if (baseZScore > this.config.zScoreThreshold) {
      reasons.push("BASELINE_SHIFT");
    }

    // Combine max Z-score normalized to 0..1 scale
    const maxZ = Math.max(rmsZScore, slopeZScore, varZScore, baseZScore);
    const score = Number(Math.min(1.0, maxZ / (this.config.zScoreThreshold * 2.0)).toFixed(4));

    return {
      score: Math.max(0.0, score),
      reasons: Array.from(new Set(reasons)),
      components,
    };
  }
}
