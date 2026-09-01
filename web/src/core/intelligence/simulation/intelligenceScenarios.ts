// ============================================================================
// PHENORA Synthetic Scenario Generator (PERSON B)
// Generates STABLE, RISING, FALLING, NOISY, DRIFTING, TRANSITION, ANOMALY, RECOVERY
// ============================================================================

import { SignalFeatures } from "../intelligenceTypes";

export interface ScenarioDataset {
  name: string;
  description: string;
  expectedTrajectory: string;
  samples: SignalFeatures[];
}

export class ScenarioGenerator {
  public generateStableScenario(): ScenarioDataset {
    const samples: SignalFeatures[] = [];
    const baseTimestamp = Date.now();
    const len = 10;

    for (let i = 0; i < len; i++) {
      samples.push({
        timestamp: baseTimestamp + i * 3600000,
        rawValue: 1.0 + (Math.random() * 0.001 - 0.0005),
        rms: 0.707,
        variance: 0.001,
        peakToPeak: 0.002,
        baseline: 1.0,
        delta: 0.0001,
        slope: 0.0,
        stability: 0.95,
        snr: 35,
        drift: 0.005,
      });
    }

    return {
      name: "STABLE",
      description: "Flat signal stationary baseline within stable threshold",
      expectedTrajectory: "STABLE",
      samples,
    };
  }

  public generateRisingScenario(): ScenarioDataset {
    const samples: SignalFeatures[] = [];
    const baseTimestamp = Date.now();
    const len = 10;

    for (let i = 0; i < len; i++) {
      const delta = i * 0.005;
      samples.push({
        timestamp: baseTimestamp + i * 3600000,
        rawValue: 1.0 + delta,
        rms: 0.75,
        variance: 0.005,
        peakToPeak: 0.01,
        baseline: 1.0,
        delta,
        slope: 0.005,
        stability: 0.90,
        snr: 32,
        drift: 0.01,
      });
    }

    return {
      name: "RISING",
      description: "Consistent positive slope trajectory post-dose",
      expectedTrajectory: "RISING",
      samples,
    };
  }

  public generateNoisyScenario(): ScenarioDataset {
    const samples: SignalFeatures[] = [];
    const baseTimestamp = Date.now();
    const len = 10;

    for (let i = 0; i < len; i++) {
      const noise = (i % 2 === 0 ? 1 : -1) * (0.05 + Math.random() * 0.02);
      samples.push({
        timestamp: baseTimestamp + i * 3600000,
        rawValue: 1.0 + noise,
        rms: 0.9,
        variance: 0.12,
        peakToPeak: 0.15,
        baseline: 1.0,
        delta: noise,
        slope: noise * 0.5,
        stability: 0.3,
        snr: 12,
        drift: 0.04,
      });
    }

    return {
      name: "NOISY",
      description: "High variance noisy oscillation signal",
      expectedTrajectory: "NOISY",
      samples,
    };
  }

  public generateAnomalyScenario(): ScenarioDataset {
    const samples = this.generateStableScenario().samples;
    // Inject impulse spike at index 5
    samples[5] = {
      ...samples[5],
      rawValue: 5.0,
      delta: 4.0,
      slope: 3.99,
      variance: 0.8,
    };

    return {
      name: "ANOMALY",
      description: "Single impulse spike anomaly embedded in stable signal",
      expectedTrajectory: "STABLE",
      samples,
    };
  }
}
