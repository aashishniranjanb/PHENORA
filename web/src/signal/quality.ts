import { ContactStatus, DriftLevel } from "../core/signalTypes";

/**
 * Signal Quality & Trend Dynamics
 * 
 * Implements finite-difference slope and stability metrics, plus an overall
 * 0-100 Signal Quality score based on combined measurement integrity checks.
 */

/**
 * Calculates finite-difference slope over a specified lag:
 * slope[n] = delta[n] - delta[n - lag]
 * 
 * @param values Array of sequential delta (or value) measurements
 * @param lag Number of steps backwards for finite difference (default: 4)
 */
export function calculateSlope(values: number[], lag: number = 4): number {
  if (!values || values.length === 0) return 0;
  const k = Math.max(1, Math.floor(lag));
  const n = values.length - 1;

  if (n < k) {
    // If not enough samples for full lag, use available span
    return values[n] - values[0];
  }

  return values[n] - values[n - k];
}

/**
 * Calculates the range of recent slope values:
 * range = max(recentSlopes) - min(recentSlopes)
 * 
 * A low range indicates that the trend is settling / stable.
 */
export function calculateSlopeRange(recentSlopes: number[]): number {
  if (!recentSlopes || recentSlopes.length === 0) return 0;
  let min = recentSlopes[0];
  let max = recentSlopes[0];

  for (let i = 1; i < recentSlopes.length; i++) {
    const s = recentSlopes[i];
    if (s < min) min = s;
    if (s > max) max = s;
  }

  return max - min;
}

/**
 * Converts recent slope range into a normalized stability index [0.0 - 1.0].
 * 
 * 1.0 = highly settled, steady trend (low slope fluctuation)
 * 0.0 = volatile, erratic oscillations
 * 
 * NOTE: stabilityRangeThreshold is an experimental development parameter,
 * not an instrument-certified clinical threshold.
 * 
 * @param recentSlopes Array of historical slope calculations
 * @param stabilityRangeThreshold Scaling parameter for stability normalization
 */
export function calculateStability(
  recentSlopes: number[],
  stabilityRangeThreshold: number = 0.05
): number {
  if (!recentSlopes || recentSlopes.length === 0) return 1.0;
  
  const range = calculateSlopeRange(recentSlopes);
  const threshold = Math.max(1e-4, stabilityRangeThreshold);

  // Smooth sigmoidal / rational transfer function bounded [0, 1]
  return 1.0 / (1.0 + (range / threshold));
}

/**
 * Computes an overall 0-100 Quality Score for the measurement window.
 * This aggregates noise, drift, and contact artifacts into a single 
 * confidence metric for downstream ML and Decision engines.
 * 
 * @param noise The measured variance/noise of the signal
 * @param drift The categorized drift level
 * @param contactStatus The physical contact evaluation
 * @param nominalNoiseFloor The expected baseline noise level
 */
export function calculateQualityScore(
  noise: number,
  drift: DriftLevel,
  contactStatus: ContactStatus,
  nominalNoiseFloor: number = 1e-5
): number {
  let score = 100;

  // 1. Penalize for contact issues (fatal flaw)
  if (contactStatus === "CONTACT_BAD") {
    return 0; // Completely untrustworthy
  } else if (contactStatus === "CONTACT_SUSPECT") {
    score -= 40;
  }

  // 2. Penalize for baseline drift
  if (drift === "HIGH") {
    score -= 30;
  } else if (drift === "MEDIUM") {
    score -= 10;
  }

  // 3. Penalize for excessive noise
  // We compare measured noise (variance) to the nominal floor.
  // E.g., if noise is 100x the floor, we heavily penalize.
  const noiseRatio = noise / Math.max(1e-9, nominalNoiseFloor);
  
  if (noiseRatio > 100) {
    score -= 40;
  } else if (noiseRatio > 20) {
    score -= 20;
  } else if (noiseRatio > 5) {
    score -= 5;
  }

  // Bound between 0 and 100
  return Math.max(0, Math.min(100, Math.round(score)));
}
