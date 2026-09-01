// ============================================================================
// PHENORA Trajectory & Transition Classifier (PERSON B)
// Sliding Window Classification: STABLE, RISING, FALLING, TRANSITION, NOISY, DRIFTING
// ============================================================================

import { SignalFeatures, TrajectoryClass } from "../intelligenceTypes";

export interface TrajectoryAnalysis {
  trajectory: TrajectoryClass;
  trajectoryConfidence: number; // 0-100
  slopeMean: number;
  slopeVariance: number;
  transitionDetected: boolean;
  notes: string[];
}

export class TrajectoryAnalyzer {
  public analyze(history: SignalFeatures[], windowSize: number = 5): TrajectoryAnalysis {
    const notes: string[] = [];

    if (history.length < 2) {
      return {
        trajectory: "UNRESOLVED",
        trajectoryConfidence: 50,
        slopeMean: 0,
        slopeVariance: 0,
        transitionDetected: false,
        notes: ["Insufficient sample window"],
      };
    }

    const window = history.slice(-windowSize);
    const deltas = window.map((f) => f.delta);
    const slopes = window.map((f) => f.slope);

    // Compute metrics
    const slopeMean = slopes.reduce((a, b) => a + b, 0) / slopes.length;
    const slopeVariance =
      slopes.reduce((acc, val) => acc + Math.pow(val - slopeMean, 2), 0) / slopes.length;
    const deltaRange = Math.max(...deltas) - Math.min(...deltas);

    // Detect Transition (e.g. flat signal suddenly starting to rise or fall)
    let transitionDetected = false;
    if (window.length >= 4) {
      const earlySlope = (window[1].delta - window[0].delta);
      const lateSlope = (window[window.length - 1].delta - window[window.length - 2].delta);
      if (Math.abs(lateSlope - earlySlope) > 0.005) {
        transitionDetected = true;
        notes.push("Slope transition detected across window");
      }
    }

    let trajectory: TrajectoryClass = "UNRESOLVED";
    let trajectoryConfidence = 85;

    if (slopeVariance > 0.05) {
      trajectory = "NOISY";
      trajectoryConfidence = Math.max(60, 95 - Math.round(slopeVariance * 200));
      notes.push("High slope variance indicates noisy trajectory");
    } else if (transitionDetected) {
      trajectory = "TRANSITION";
      trajectoryConfidence = 80;
    } else if (Math.abs(slopeMean) < 0.0005 && deltaRange < 0.002) {
      trajectory = "STABLE";
      trajectoryConfidence = 92;
      notes.push("Slope stationary within stable threshold");
    } else if (slopeMean > 0.001) {
      trajectory = "RISING";
      trajectoryConfidence = Math.min(98, 80 + Math.round(slopeMean * 1000));
      notes.push("Consistent positive slope trend");
    } else if (slopeMean < -0.001) {
      trajectory = "FALLING";
      trajectoryConfidence = Math.min(98, 80 + Math.round(Math.abs(slopeMean) * 1000));
      notes.push("Consistent negative slope trend");
    } else if (Math.abs(history[history.length - 1].drift) > 0.08) {
      trajectory = "DRIFTING";
      trajectoryConfidence = 75;
      notes.push("Instrument drift dominates signal");
    } else {
      trajectory = "STABLE";
      trajectoryConfidence = 85;
    }

    return {
      trajectory,
      trajectoryConfidence,
      slopeMean,
      slopeVariance,
      transitionDetected,
      notes,
    };
  }
}
