import { SignalFeatures } from "../core/types";

export type ScenarioType =
  | "STABLE"
  | "RISING"
  | "FALLING"
  | "NOISY"
  | "DRIFTING"
  | "TRANSITION"
  | "ANOMALY"
  | "RECOVERY";

export function generateScenarioSequence(
  scenario: ScenarioType,
  count: number = 10,
  startPoint: number = 0
): SignalFeatures[] {
  const result: SignalFeatures[] = [];
  const baseTime = Date.now();

  for (let i = 0; i < count; i++) {
    const idx = startPoint + i;
    const timestamp = baseTime + idx * 1000;

    let rawValue = 1.0;
    let rms = 0.8;
    let variance = 0.001;
    let peakToPeak = 0.02;
    let baseline = 1.0;
    let delta = 0.0;
    let slope = 0.0;
    let stability = 0.95;
    let snr = 25.0;
    let drift = 0.001;

    switch (scenario) {
      case "STABLE":
        rawValue = 1.0 + Math.sin(idx * 0.1) * 0.005;
        slope = 0.0002;
        variance = 0.001;
        snr = 28.0;
        stability = 0.96;
        break;

      case "RISING":
        rawValue = 1.0 + idx * 0.015;
        delta = idx * 0.015;
        slope = 0.015;
        variance = 0.002;
        snr = 24.0;
        stability = 0.91;
        break;

      case "FALLING":
        rawValue = 1.0 - idx * 0.015;
        delta = -idx * 0.015;
        slope = -0.015;
        variance = 0.002;
        snr = 24.0;
        stability = 0.91;
        break;

      case "NOISY":
        rawValue = 1.0 + (Math.random() - 0.5) * 0.3;
        variance = 0.08;
        snr = 4.0;
        stability = 0.3;
        slope = (Math.random() - 0.5) * 0.05;
        break;

      case "DRIFTING":
        rawValue = 1.0 + idx * 0.02;
        drift = 0.03;
        slope = 0.001;
        variance = 0.003;
        stability = 0.75;
        break;

      case "TRANSITION":
        if (i < Math.floor(count / 2)) {
          slope = 0.012;
        } else {
          slope = -0.018;
        }
        rawValue = 1.0 + slope * idx;
        stability = 0.6;
        break;

      case "ANOMALY":
        if (i === Math.floor(count / 2)) {
          rms = 5.0;
          variance = 0.15;
          snr = 2.0;
          rawValue = 6.0;
        } else {
          rawValue = 1.0;
          rms = 0.8;
          variance = 0.001;
          snr = 25.0;
        }
        break;

      case "RECOVERY":
        if (i < 3) {
          variance = 0.09;
          snr = 5.0;
        } else {
          variance = 0.001;
          snr = 26.0;
          slope = 0.0003;
        }
        break;
    }

    result.push({
      timestamp,
      rawValue,
      rms,
      variance,
      peakToPeak,
      baseline,
      delta,
      slope,
      stability,
      snr,
      drift,
    });
  }

  return result;
}
