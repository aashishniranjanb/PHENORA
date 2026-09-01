import { SignalFeatures } from "../../core/types";
import { QualityConfig } from "../intelligenceTypes";

export const DEFAULT_QUALITY_CONFIG: QualityConfig = {
  minSnr: 10.0,         // Target SNR >= 10 dB
  maxVariance: 0.05,    // Max acceptable variance
  maxDrift: 0.02,       // Max acceptable baseline drift
  minStability: 0.70,   // Min stability index
};

export interface QualityResult {
  score: number; // 0..1
  reasons: string[];
  components: {
    snrScore: number;
    varianceScore: number;
    stabilityScore: number;
    driftScore: number;
  };
}

export class QualityScorer {
  private config: QualityConfig;

  constructor(config: Partial<QualityConfig> = {}) {
    this.config = { ...DEFAULT_QUALITY_CONFIG, ...config };
  }

  public score(features: SignalFeatures): QualityResult {
    const reasons: string[] = [];

    // 1. SNR score: 0 dB -> 0, minSnr -> 0.7, 30+ dB -> 1.0
    const snrNorm = Math.max(0, features.snr);
    const snrScore = Math.min(1.0, snrNorm / (this.config.minSnr * 1.5));
    if (features.snr < this.config.minSnr) {
      reasons.push("LOW_SNR");
    } else {
      reasons.push("HIGH_SNR");
    }

    // 2. Variance score: 0 -> 1.0, maxVariance -> 0.0
    const varRatio = Math.min(1.0, features.variance / this.config.maxVariance);
    const varianceScore = Math.max(0.0, 1.0 - varRatio);
    if (features.variance > this.config.maxVariance) {
      reasons.push("HIGH_VARIANCE");
    } else {
      reasons.push("LOW_VARIANCE");
    }

    // 3. Stability score: linear mapping of stability feature [0..1]
    const stabilityScore = Math.max(0.0, Math.min(1.0, features.stability));
    if (features.stability < this.config.minStability) {
      reasons.push("LOW_STABILITY");
    } else {
      reasons.push("STABLE_SLOPE");
    }

    // 4. Drift score: low drift -> high score
    const driftRatio = Math.min(1.0, Math.abs(features.drift) / this.config.maxDrift);
    const driftScore = Math.max(0.0, 1.0 - driftRatio);
    if (Math.abs(features.drift) > this.config.maxDrift) {
      reasons.push("BASELINE_DRIFT");
    } else {
      reasons.push("LOW_DRIFT");
    }

    // Weighted average: SNR (35%), Variance (25%), Stability (25%), Drift (15%)
    const compositeScore = Number(
      (
        snrScore * 0.35 +
        varianceScore * 0.25 +
        stabilityScore * 0.25 +
        driftScore * 0.15
      ).toFixed(4)
    );

    if (compositeScore >= 0.75) {
      reasons.push("GOOD_SIGNAL_QUALITY");
    }

    return {
      score: Math.max(0.0, Math.min(1.0, compositeScore)),
      reasons,
      components: {
        snrScore: Number(snrScore.toFixed(4)),
        varianceScore: Number(varianceScore.toFixed(4)),
        stabilityScore: Number(stabilityScore.toFixed(4)),
        driftScore: Number(driftScore.toFixed(4)),
      },
    };
  }
}
