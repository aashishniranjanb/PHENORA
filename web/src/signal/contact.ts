import { ContactStatus } from "../core/signalTypes";
import { calculateVariance, calculatePeakToPeak } from "./statistics";

/**
 * Signal Contact & Artifact Detection Module
 * 
 * Evaluates the raw signal window for physical contact issues
 * with the electrodes (e.g. open circuits, sudden movement, clipping).
 */

export interface ArtifactEvaluation {
  contactStatus: ContactStatus;
  anomalyDetected: boolean;
  reason?: string;
}

/**
 * Evaluates physical electrode contact quality and flags anomalies.
 * 
 * @param values The raw unnormalized or normalized voltage values
 * @param vRef The ADC reference voltage (default 3.3V)
 * @param clippingThreshold Ratio of vRef that is considered clipping (e.g. 0.98)
 * @param maxExpectedVariance Maximum reasonable variance before declaring bad contact
 */
export function evaluateContactQuality(
  values: number[],
  vRef: number = 3.3,
  clippingThreshold: number = 0.98,
  maxExpectedVariance: number = 0.5
): ArtifactEvaluation {
  if (!values || values.length < 2) {
    return { contactStatus: "CONTACT_SUSPECT", anomalyDetected: true, reason: "Insufficient samples" };
  }

  // 1. Check for missing signal / complete flatline at 0 (Open connection or short to ground)
  let allZero = true;
  let allMax = true;
  let suddenJump = false;

  const maxVal = vRef * clippingThreshold;
  
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    if (Math.abs(v) > 0.001) allZero = false;
    if (v < maxVal) allMax = false;

    if (i > 0) {
      // Delta between consecutive samples
      const jump = Math.abs(values[i] - values[i - 1]);
      if (jump > vRef * 0.5) { // 50% of range jump is considered an anomaly/artifact
        suddenJump = true;
      }
    }
  }

  if (allZero) {
    return { contactStatus: "CONTACT_BAD", anomalyDetected: true, reason: "Signal flatline at 0" };
  }

  if (allMax) {
    return { contactStatus: "CONTACT_BAD", anomalyDetected: true, reason: "Signal railing at max" };
  }

  // 2. Evaluate Noise / Variance
  const variance = calculateVariance(values);
  const p2p = calculatePeakToPeak(values);

  if (variance > maxExpectedVariance || p2p > vRef * 0.8) {
    return { contactStatus: "CONTACT_BAD", anomalyDetected: true, reason: "Extreme noise/variance" };
  }

  if (suddenJump) {
    return { contactStatus: "CONTACT_SUSPECT", anomalyDetected: true, reason: "Sudden amplitude jump" };
  }

  if (variance > maxExpectedVariance * 0.5 || p2p > vRef * 0.4) {
    return { contactStatus: "CONTACT_SUSPECT", anomalyDetected: false, reason: "Elevated noise" };
  }

  return { contactStatus: "CONTACT_GOOD", anomalyDetected: false };
}
