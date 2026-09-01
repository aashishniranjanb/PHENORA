import { RawSignalSample } from "../core/signalTypes";

/**
 * Raw Sample Validation & Acquisition Abstraction
 * 
 * Ensures that invalid samples (NaN, Infinity, saturated, out-of-range)
 * do not enter the signal processing pipeline.
 */

export interface ValidationResult {
  valid: boolean;
  sample: RawSignalSample;
  reason?: string;
  isSaturated: boolean;
}

export interface AcquisitionConfig {
  /** Maximum valid raw ADC code (e.g. 32767 for ADS1115 single-ended) */
  adcMax: number;
  /** Minimum valid raw ADC code */
  adcMin: number;
  /** Value at which we consider the ADC saturated/railing */
  saturationThreshold: number;
}

const DEFAULT_ACQ_CONFIG: AcquisitionConfig = {
  adcMax: 32767,
  adcMin: -32768,
  saturationThreshold: 32700, // Near the max for 15-bit single-ended
};

/**
 * Validates a single incoming RawSignalSample before it enters the feature extractor.
 */
export function validateSample(
  sample: RawSignalSample,
  config: Partial<AcquisitionConfig> = {}
): ValidationResult {
  const cfg = { ...DEFAULT_ACQ_CONFIG, ...config };

  // 1. Check for basic numerics
  if (typeof sample.value !== "number" || isNaN(sample.value) || !isFinite(sample.value)) {
    return { valid: false, sample, reason: "Invalid numeric value (NaN or Infinity)", isSaturated: false };
  }

  // 2. Check for missing timestamp
  if (typeof sample.timestamp !== "number" || isNaN(sample.timestamp)) {
    return { valid: false, sample, reason: "Missing or invalid timestamp", isSaturated: false };
  }

  // 3. Check raw ADC bounds if provided
  let isSaturated = false;
  if (sample.rawAdc !== undefined) {
    if (sample.rawAdc > cfg.adcMax || sample.rawAdc < cfg.adcMin) {
      return { valid: false, sample, reason: "Raw ADC value out of bounds", isSaturated: false };
    }
    if (sample.rawAdc >= cfg.saturationThreshold) {
      isSaturated = true;
    }
  }

  return { valid: true, sample, isSaturated };
}
