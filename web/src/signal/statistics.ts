import { movingAverage } from "./filters";

/**
 * Calculates the Root Mean Square (RMS) of an array of numeric values.
 * Represents overall signal magnitude.
 */
export function calculateRms(values: number[]): number {
  if (!values || values.length === 0) return 0;
  let sumSq = 0;
  for (let i = 0; i < values.length; i++) {
    sumSq += values[i] * values[i];
  }
  return Math.sqrt(sumSq / values.length);
}

/**
 * Calculates the variance of an array of values around their arithmetic mean.
 * 
 * @param values Array of numbers
 * @param sampleVariance If true, divides by (N - 1); otherwise population variance (N)
 */
export function calculateVariance(values: number[], sampleVariance: boolean = false): number {
  if (!values || values.length <= (sampleVariance ? 1 : 0)) return 0;
  
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
  }
  const mean = sum / values.length;

  let sumSqDiff = 0;
  for (let i = 0; i < values.length; i++) {
    const diff = values[i] - mean;
    sumSqDiff += diff * diff;
  }

  const denominator = sampleVariance ? values.length - 1 : values.length;
  return sumSqDiff / denominator;
}

/**
 * Calculates Peak-to-Peak amplitude: max(values) - min(values).
 */
export function calculatePeakToPeak(values: number[]): number {
  if (!values || values.length === 0) return 0;
  let min = values[0];
  let max = values[0];

  for (let i = 1; i < values.length; i++) {
    const v = values[i];
    if (v < min) min = v;
    if (v > max) max = v;
  }

  return max - min;
}

/**
 * Transparent signal-to-noise ratio (SNR) estimate in decibels (dB).
 * Compares signal magnitude power to local residual noise variance.
 * 
 * SNR_dB = 10 * log10( (mean(signal)^2 + var(signal)) / (var(noise_residuals) + nominalNoiseFloor) )
 * 
 * @param rawValues The unfiltered window values
 * @param nominalNoiseFloor Baseline floor constant to prevent division by zero
 */
export function calculateSnr(
  rawValues: number[],
  nominalNoiseFloor: number = 1e-6
): number {
  if (!rawValues || rawValues.length < 2) return 0;

  // Derive local smoothed trend using small moving average
  const smoothed = movingAverage(rawValues, Math.min(5, Math.max(2, Math.floor(rawValues.length / 3))));
  
  // Calculate noise residuals
  const residuals: number[] = new Array(rawValues.length);
  for (let i = 0; i < rawValues.length; i++) {
    residuals[i] = rawValues[i] - smoothed[i];
  }

  const noiseVariance = calculateVariance(residuals, false);
  const signalMagnitude = calculateRms(smoothed);
  const signalPower = signalMagnitude * signalMagnitude;
  const totalNoisePower = Math.max(noiseVariance, nominalNoiseFloor);

  if (signalPower <= 0) return 0;

  const snrLinear = signalPower / totalNoisePower;
  return 10 * Math.log10(Math.max(1, snrLinear));
}
