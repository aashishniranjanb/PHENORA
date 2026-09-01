/**
 * PHENORA Core Signal Types & Contracts
 * 
 * Standardized data interfaces for the Measurement Integrity pipeline.
 * Shared contract consumed by downstream ML (Person B) and Evidence/Decision (Person C).
 * 
 * NOTE: These represent engineering and electrical signal representations,
 * not clinically validated biological biomarkers.
 */

export type SignalPhase =
  | "ZERO"
  | "CONTROL_PRE_DOSE"
  | "TEST_POST_DOSE";

export type ContactStatus = 
  | "CONTACT_GOOD" 
  | "CONTACT_SUSPECT" 
  | "CONTACT_BAD";

export type TrajectoryClass =
  | "STABLE"
  | "RISING"
  | "FALLING"
  | "FLAT"
  | "TRANSITION"
  | "NOISY"
  | "DRIFTING"
  | "UNSTABLE"
  | "UNRESOLVED"
  | "UNKNOWN";

export type SignalTrajectory = TrajectoryClass;
export type Trajectory = TrajectoryClass;

export type DriftLevel = "LOW" | "MEDIUM" | "HIGH";

export interface RawSignalSample {
  /** Timestamp of acquisition in milliseconds */
  timestamp: number;
  /** Normalized voltage or physical electrical reading (e.g. 0.0 to 3.3V) */
  value: number;
  /** Optional raw integer from ADC (e.g. 16-bit ADS1115 or 12-bit ESP32 ADC) */
  rawAdc?: number;
  /** Sequential protocol measurement phase */
  phase?: SignalPhase;
  /** Run identifier for traceability */
  runId?: string;
  /** Chamber / Well ID */
  chamberId?: string;
  /** Optional metadata / excitation parameters (null if unavailable) */
  excitationFrequency?: number;
  excitationAmplitude?: number;
  temperature?: number;
}

/**
 * Rich, validated signal contract for downstream intelligence.
 * Replaces the basic features with a complete integrity assessment.
 */
export interface SignalFeatures {
  /** Timestamp corresponding to the end of the evaluated window */
  timestamp: number;
  /** Sequence number for packet tracking */
  sequence: number;

  /** Latest raw integer ADC code if available */
  raw_adc?: number;
  /** Latest normalized raw voltage */
  rawValue: number;
  /** The primary extracted numerical feature (e.g., |Z|, Phase, filtered voltage) */
  filteredValue: number;
  
  /** Number of samples processed in this window */
  sampleCount: number;
  
  /** Overall validity of the feature packet */
  valid: boolean;
  
  /** Detailed flags indicating why a packet might be invalid or suspect */
  qualityFlags: {
    insufficientSamples: boolean;
    adcSaturated: boolean;
    invalidSample: boolean;
    excessiveNoise: boolean;
    excessiveDrift: boolean;
    baselineMissing: boolean;
  };

  /** Estimated local noise standard deviation */
  noise: number;
  /** Signal-to-Noise Ratio estimate (dB) */
  snr: number;
  /** Comprehensive quality score [0 - 100] */
  quality: number;

  /** Estimated baseline drift severity */
  drift: number;
  /** Classified trajectory of the signal */
  trajectory: TrajectoryClass;

  /** True if sudden artifacts or anomalies are detected in the window */
  anomaly: boolean;
  /** Overall confidence in the feature extraction [0 - 100] */
  confidence: number;

  /** Current sequential phase */
  phase?: SignalPhase;
  /** True if the pre-dose baseline has been successfully established */
  baseline_valid: boolean;
  /** Electrode contact status assessment */
  contact_status: ContactStatus;

  // Legacy/Mathematical underlying variables (preserved for Person C FPGA mirroring)
  /** Root Mean Square of the windowed signal */
  rms: number;
  /** Variance of the windowed signal around its mean */
  variance: number;
  /** Peak-to-Peak amplitude (max - min) */
  peakToPeak: number;
  /** Pre-dose established baseline reference value */
  baseline: number;
  /** Sequential delta: currentFeature - baseline */
  delta: number;
  /** Finite-difference slope: delta[n] - delta[n - lag] */
  slope: number;
  /** Normalized stability score [0.0 - 1.0] (1.0 = highly settled) */
  stability: number;
}

export interface SignalWindow {
  /** Array of raw samples in this window */
  samples: RawSignalSample[];
  /** Window start timestamp (ms) */
  startTimestamp: number;
  /** Window end timestamp (ms) */
  endTimestamp: number;
}

export interface ProcessingConfig {
  /** Number of samples to include in the rolling low-pass filter window */
  filterWindowSize: number;
  /** Number of samples evaluated in each feature extraction window */
  featureWindowSize: number;
  /** Lag n for finite-difference slope: delta[n] - delta[n - lag] */
  slopeLag: number;
  /** Number of recent slope calculations used to determine stability */
  stabilityWindowSize: number;
  /** Development threshold for slope range stability (lower = stricter) */
  stabilityRangeThreshold: number;
  /** Default ADC full-scale value if raw ADC is supplied (e.g. 32767 for ADS1115) */
  adcMax: number;
  /** Reference voltage for ADC normalization */
  vRef: number;
  /** Estimated noise floor variance for SNR calculations */
  nominalNoiseFloor: number;
  /** Tolerance threshold for contact clipping/railing */
  contactClippingThreshold: number;
}

export const DEFAULT_PROCESSING_CONFIG: ProcessingConfig = {
  filterWindowSize: 5,
  featureWindowSize: 20,
  slopeLag: 4,
  stabilityWindowSize: 8,
  stabilityRangeThreshold: 0.05,
  adcMax: 32767,
  vRef: 3.3,
  nominalNoiseFloor: 1e-5,
  contactClippingThreshold: 0.98, // E.g., if signal exceeds 98% of vRef, it might be clipping
};
