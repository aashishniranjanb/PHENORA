/**
 * PHENORA Flash — Canonical Constants
 */

export const PHENORA_VERSION = "0.1.0-alpha";

export const DEFAULT_DEVICE = "PHENORA-01-VIRTUAL";
export const DEFAULT_CALIBRATION = "CAL-0042";
export const DEFAULT_PROTOCOL = "UTI-EIS-V1";

export const DEFAULT_FREQUENCIES = [
  10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000,
  200000, 500000, 1000000
];

export const PIPELINE_STAGES = [
  'SAMPLE',
  'ACQUISITION',
  'IMPEDANCE',
  'PHENOTYPE',
  'DISEASE',
  'TWIN',
  'FORECAST',
  'AUTONOMY',
  'RESULT'
] as const;

export const SIMULATION_SCENARIOS = [
  'STABLE',
  'RISING',
  'FALLING',
  'NOISY',
  'DRIFTING',
  'TRANSITION',
  'ANOMALY',
  'RECOVERY',
  'OOD',
  'TIMEOUT'
] as const;
