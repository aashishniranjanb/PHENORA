import { RawSignalSample } from "../core/signalTypes";

/**
 * Normalizes a raw sample value to physical voltage / unit representation.
 * Handles either raw integer ADC codes or already normalized floating point values.
 */
export function normalizeSample(
  sample: RawSignalSample | number,
  adcMax: number = 32767,
  vRef: number = 3.3
): number {
  if (typeof sample === "number") {
    return sample;
  }
  if (sample.rawAdc !== undefined) {
    // Convert integer ADC code to voltage [0, vRef]
    return (Math.max(0, sample.rawAdc) / adcMax) * vRef;
  }
  return sample.value;
}

/**
 * Deterministic moving-average low-pass filter.
 * Mirrors the simple sliding window filtering intended for edge FPGA logic.
 * 
 * @param values Array of numbers to filter
 * @param windowSize Window length for rolling average (must be >= 1)
 */
export function movingAverage(values: number[], windowSize: number): number[] {
  if (!values || values.length === 0) return [];
  const k = Math.max(1, Math.floor(windowSize));
  if (k === 1) return [...values];

  const result: number[] = new Array(values.length);
  let sum = 0;

  for (let i = 0; i < values.length; i++) {
    sum += values[i];
    if (i >= k) {
      sum -= values[i - k];
      result[i] = sum / k;
    } else {
      // For initial samples before full window, divide by accumulated count
      result[i] = sum / (i + 1);
    }
  }

  return result;
}

/**
 * Single-pole exponential moving average (EMA).
 * 
 * @param values Array of input values
 * @param alpha Smoothing factor between 0 (max smoothing) and 1 (no smoothing)
 */
export function exponentialMovingAverage(values: number[], alpha: number = 0.2): number[] {
  if (!values || values.length === 0) return [];
  const a = Math.max(0.001, Math.min(1.0, alpha));
  const result: number[] = new Array(values.length);
  
  result[0] = values[0];
  for (let i = 1; i < values.length; i++) {
    result[i] = a * values[i] + (1 - a) * result[i - 1];
  }
  return result;
}
