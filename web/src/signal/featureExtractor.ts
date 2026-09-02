import {
  RawSignalSample,
  SignalFeatures,
  ProcessingConfig,
  DEFAULT_PROCESSING_CONFIG,
} from "../core/signalTypes";
import { normalizeSample, movingAverage } from "./filters";
import {
  calculateRms,
  calculateVariance,
  calculatePeakToPeak,
  calculateSnr,
} from "./statistics";
import { calculateDelta, calculateDrift, categorizeDrift } from "./baseline";
import { calculateSlope, calculateStability, calculateQualityScore } from "./quality";
import { evaluateContactQuality } from "./contact";
import { classifyTrajectory } from "./trajectory";

/**
 * Extracts a complete standardized SignalFeatures packet from an array of samples.
 * 
 * New Pipeline:
 * 1. Normalize values (ADC / voltage)
 * 2. Contact & Artifact detection
 * 3. Low-pass filter (moving average)
 * 4. Magnitude & dispersion statistics (RMS, Variance, Peak-to-Peak)
 * 5. Single-chamber differential (Baseline, Delta)
 * 6. Dynamic metrics (Slope, Stability, SNR, Drift)
 * 7. Quality Score & Trajectory Classification
 */
export function extractFeatures(
  samples: (RawSignalSample | number)[],
  config: Partial<ProcessingConfig> = {},
  baselineReference?: number,
  historicalSlopes?: number[],
  sequenceNum: number = 0
): SignalFeatures {
  const cfg = { ...DEFAULT_PROCESSING_CONFIG, ...config };
  const fallbackTimestamp = Date.now();

  if (!samples || samples.length === 0) {
    return {
      timestamp: fallbackTimestamp,
      sequence: sequenceNum,
      rawValue: 0,
      filteredValue: 0,
      sampleCount: 0,
      valid: false,
      qualityFlags: {
        insufficientSamples: true,
        adcSaturated: false,
        invalidSample: false,
        excessiveNoise: false,
        excessiveDrift: false,
        baselineMissing: true,
      },
      noise: 0,
      snr: 0,
      quality: 0,
      drift: 0,
      trajectory: "UNKNOWN",
      anomaly: true,
      confidence: 0,
      baseline_valid: false,
      contact_status: "CONTACT_BAD",
      rms: 0,
      variance: 0,
      peakToPeak: 0,
      baseline: 0,
      delta: 0,
      slope: 0,
      stability: 1.0,
    };
  }

  // 1. Extract raw voltages
  const rawValues = samples.map((s) => normalizeSample(s, cfg.adcMax, cfg.vRef));
  const latestSample = samples[samples.length - 1];
  const timestamp = typeof latestSample === "number" ? fallbackTimestamp : latestSample.timestamp;
  const rawAdc = typeof latestSample === "number" ? undefined : latestSample.rawAdc;
  const phase = typeof latestSample === "number" ? undefined : latestSample.phase;
  const voltage = rawValues[rawValues.length - 1];

  // 2. Contact Quality & Artifact Detection
  const contactEval = evaluateContactQuality(rawValues, cfg.vRef, cfg.contactClippingThreshold);

  // 3. Filter (moving average)
  const filtered = movingAverage(rawValues, cfg.filterWindowSize);
  const currentFiltered = filtered[filtered.length - 1];

  // 4. Statistical Features (Noise estimation)
  const rms = calculateRms(filtered);
  const variance = calculateVariance(filtered, false);
  const peakToPeak = calculatePeakToPeak(filtered);
  const noise = calculateVariance(rawValues, false);

  // 5. Baseline & Delta
  const baseline_valid = baselineReference !== undefined;
  const baseline = baseline_valid ? baselineReference! : filtered[0];
  const delta = calculateDelta(currentFiltered, baseline);

  // 6. Finite-difference Slope & Stability
  const deltas = filtered.map((val) => calculateDelta(val, baseline));
  const currentSlope = calculateSlope(deltas, cfg.slopeLag);

  const slopesForStability = historicalSlopes && historicalSlopes.length > 0
    ? [...historicalSlopes.slice(-cfg.stabilityWindowSize + 1), currentSlope]
    : [currentSlope];
  
  const stability = calculateStability(slopesForStability, cfg.stabilityRangeThreshold);

  // 7. SNR & Drift
  const snr = calculateSnr(rawValues, cfg.nominalNoiseFloor);
  const driftRate = calculateDrift(filtered);
  const driftLevel = categorizeDrift(driftRate, 0.02, 0.1);

  // 8. Quality Score & Trajectory
  const quality = calculateQualityScore(noise, driftLevel, contactEval.contactStatus, cfg.nominalNoiseFloor);
  const trajectory = classifyTrajectory(slopesForStability, stability);

  // Confidence is currently mapped to quality, but can be scaled later by ML (Person B)
  const confidence = quality;

  const isAdcSaturated = contactEval.contactStatus === "CONTACT_BAD" && contactEval.reason?.includes("railing");
  const isBaselineMissing = !baseline_valid;
  const isExcessiveNoise = noise > cfg.nominalNoiseFloor * 100;
  const isExcessiveDrift = driftLevel === "HIGH";

  const qualityFlags = {
    insufficientSamples: samples.length < cfg.filterWindowSize,
    adcSaturated: isAdcSaturated || false,
    invalidSample: false, // assuming samples passed validateSample upstream
    excessiveNoise: isExcessiveNoise,
    excessiveDrift: isExcessiveDrift,
    baselineMissing: isBaselineMissing,
  };

  const valid = !qualityFlags.insufficientSamples && 
                !qualityFlags.adcSaturated && 
                !qualityFlags.invalidSample &&
                !qualityFlags.baselineMissing;

  return {
    timestamp,
    sequence: sequenceNum,
    raw_adc: rawAdc,
    rawValue: voltage,
    filteredValue: currentFiltered,
    sampleCount: samples.length,
    valid,
    qualityFlags,
    noise,
    snr,
    quality,
    drift: driftRate,
    trajectory,
    anomaly: contactEval.anomalyDetected,
    confidence,
    phase,
    baseline_valid,
    contact_status: contactEval.contactStatus,
    // Legacy metrics for FPGA verification
    rms,
    variance,
    peakToPeak,
    baseline,
    delta,
    slope: currentSlope,
    stability,
  };
}
