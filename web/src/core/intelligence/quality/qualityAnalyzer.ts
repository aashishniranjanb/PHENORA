// ============================================================================
// PHENORA Multi-Dimensional Signal Quality Analyzer (PERSON B)
// Combines SNR, Drift, Stability, Variance, and History into 0-100 Quality Score
// ============================================================================

import { SignalFeatures } from "../intelligenceTypes";

export interface QualityAnalysis {
  qualityScore: number;       // 0–100
  snrContribution: number;    // 0–25
  driftContribution: number;  // 0–25
  stabilityContribution: number; // 0–25
  cleanlinessContribution: number; // 0–25
  isUsable: boolean;
  notes: string[];
}

export class QualityAnalyzer {
  public analyze(features: SignalFeatures, historyLength: number): QualityAnalysis {
    const notes: string[] = [];

    // 1. SNR Contribution (0-25)
    let snrContribution = 25;
    if (features.snr < 10) {
      snrContribution = 5;
      notes.push("SNR Critical (<10 dB)");
    } else if (features.snr < 20) {
      snrContribution = 15;
      notes.push("SNR Low (10-20 dB)");
    } else if (features.snr >= 30) {
      snrContribution = 25;
      notes.push("SNR High (>30 dB)");
    } else {
      snrContribution = 20;
    }

    // 2. Drift Contribution (0-25)
    let driftContribution = 25;
    const absDrift = Math.abs(features.drift);
    if (absDrift > 0.1) {
      driftContribution = 5;
      notes.push("High instrument/environmental drift detected");
    } else if (absDrift > 0.05) {
      driftContribution = 15;
      notes.push("Moderate drift detected");
    } else {
      driftContribution = 25;
    }

    // 3. Stability Contribution (0-25)
    let stabilityContribution = 25;
    if (features.stability < 0.5) {
      stabilityContribution = 10;
      notes.push("Low signal stability");
    } else if (features.stability >= 0.8) {
      stabilityContribution = 25;
    } else {
      stabilityContribution = 18;
    }

    // 4. Cleanliness / Variance Contribution (0-25)
    let cleanlinessContribution = 25;
    if (features.variance > 0.1) {
      cleanlinessContribution = 5;
      notes.push("High sample variance / high frequency noise");
    } else if (features.variance > 0.03) {
      cleanlinessContribution = 15;
    } else {
      cleanlinessContribution = 25;
    }

    // History completeness scaling factor
    const historyScale = Math.min(1.0, historyLength / 3);

    const rawScore = snrContribution + driftContribution + stabilityContribution + cleanlinessContribution;
    const qualityScore = Math.round(Math.min(100, Math.max(0, rawScore * historyScale)));
    const isUsable = qualityScore >= 50 && snrContribution >= 10;

    return {
      qualityScore,
      snrContribution,
      driftContribution,
      stabilityContribution,
      cleanlinessContribution,
      isUsable,
      notes,
    };
  }
}
