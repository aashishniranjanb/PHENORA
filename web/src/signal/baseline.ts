import { RawSignalSample, DriftLevel } from "../core/signalTypes";
import { normalizeSample } from "./filters";

/**
 * Establishes a pre-dose baseline reference value from pre-dose/control samples.
 * Uses the mean of the provided baseline window.
 */
export function establishBaseline(samples: (RawSignalSample | number)[]): number {
  if (!samples || samples.length === 0) return 0;

  let sum = 0;
  for (let i = 0; i < samples.length; i++) {
    sum += normalizeSample(samples[i]);
  }
  return sum / samples.length;
}

/**
 * Sequential single-chamber differential calculation:
 * delta = currentFeature - preDoseBaseline
 * 
 * NOTE: Consistent with sequential single-chamber architecture,
 * comparing post-dose trajectory against the sample's own pre-dose baseline.
 */
export function calculateDelta(currentValue: number, baseline: number): number {
  return currentValue - baseline;
}

/**
 * Calculates the baseline drift over the window using linear regression slope.
 * Returns the estimated drift rate per sample (or unit time).
 * 
 * @param values Array of signal values across the window
 */
export function calculateDrift(values: number[]): number {
  const n = values.length;
  if (n < 2) return 0;

  // Simple linear regression slope: beta = cov(x, y) / var(x)
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  for (let i = 0; i < n; i++) {
    const x = i;
    const y = values[i];
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
  }

  const denominator = n * sumXX - sumX * sumX;
  if (denominator === 0) return 0;

  const slope = (n * sumXY - sumX * sumY) / denominator;
  // Total drift over the window duration
  return slope * (n - 1);
}

/**
 * Categorizes the calculated drift rate into a semantic DriftLevel
 * based on experimental thresholds.
 */
export function categorizeDrift(
  driftRate: number, 
  mediumThreshold: number = 0.02, 
  highThreshold: number = 0.1
): DriftLevel {
  const absDrift = Math.abs(driftRate);
  if (absDrift >= highThreshold) return "HIGH";
  if (absDrift >= mediumThreshold) return "MEDIUM";
  return "LOW";
}
