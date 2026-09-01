import { RawSignalSample, SignalPhase } from "../core/signalTypes";

export type SignalMode =
  | "STABLE"
  | "RISING"
  | "FALLING"
  | "NOISY"
  | "DRIFTING"
  | "TRANSITION"
  | "ANOMALY";

export interface SignalGeneratorConfig {
  /** Signal generation behavioral mode */
  mode: SignalMode;
  /** Total duration in seconds (default: 30) */
  duration: number;
  /** Sample rate in Hz (samples per second, default: 10) */
  sampleRate: number;
  /** Baseline signal voltage / amplitude center (default: 1.0) */
  baseline: number;
  /** Dynamic signal amplitude scale (default: 0.1) */
  amplitude: number;
  /** Noise standard deviation / amplitude (default: 0.01) */
  noiseLevel: number;
  /** Linear baseline drift rate per second (default: 0.005) */
  driftRate: number;
  /** Deterministic PRNG seed for exact reproducibility */
  seed?: number;
  /** Protocol phase tag */
  phase?: SignalPhase;
  /** Run ID */
  runId?: string;
  /** Chamber ID */
  chamberId?: string;
}

export const DEFAULT_GENERATOR_CONFIG: SignalGeneratorConfig = {
  mode: "STABLE",
  duration: 30,
  sampleRate: 10,
  baseline: 1.0,
  amplitude: 0.15,
  noiseLevel: 0.01,
  driftRate: 0.005,
  seed: 42,
  phase: "TEST_POST_DOSE",
  runId: "SIM-RUN-001",
  chamberId: "CH-01",
};

/**
 * Fast, deterministic Mulberry32 Pseudo-Random Number Generator (PRNG).
 * Produces uniform float [0, 1) given a 32-bit integer seed.
 */
function createPrng(seed: number) {
  let s = seed >>> 0;
  return function next(): number {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generates Gaussian (normal) distributed noise with mean=0 and stdDev=1
 * using the Box-Muller transform.
 */
function createGaussianPrng(prng: () => number) {
  return function nextGaussian(): number {
    let u1 = prng();
    let u2 = prng();
    // Guard against u1 = 0 for Math.log
    while (u1 === 0) u1 = prng();
    return Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  };
}

/**
 * Generates an array of synthetic RawSignalSamples based on the requested mode and config.
 * 
 * Output is ALWAYS raw time-series electrical samples (RawSignalSample[]),
 * never precalculated features.
 */
export function generateSignal(
  config: Partial<SignalGeneratorConfig> = {}
): RawSignalSample[] {
  const cfg: SignalGeneratorConfig = { ...DEFAULT_GENERATOR_CONFIG, ...config };
  const totalSamples = Math.max(1, Math.floor(cfg.duration * cfg.sampleRate));
  const dt = 1000 / cfg.sampleRate; // milliseconds per sample
  const baseTimestamp = Date.now();

  const prng = createPrng(cfg.seed ?? 42);
  const gaussian = createGaussianPrng(prng);

  const samples: RawSignalSample[] = new Array(totalSamples);

  for (let i = 0; i < totalSamples; i++) {
    const tSec = i / cfg.sampleRate;
    const progress = i / totalSamples;
    let trend = 0;
    let currentNoiseLevel = cfg.noiseLevel;

    switch (cfg.mode) {
      case "STABLE":
        // Slight natural micro-oscillation + small Gaussian noise
        trend = 0.002 * Math.sin(2 * Math.PI * 0.2 * tSec);
        break;

      case "RISING":
        // Monotonic positive trajectory (e.g. bacterial metabolism / ionic release proxy)
        trend = cfg.amplitude * progress;
        break;

      case "FALLING":
        // Monotonic decreasing trajectory (e.g. lysis / active inhibition proxy)
        trend = -cfg.amplitude * progress;
        break;

      case "NOISY":
        // Highly turbulent noise (environmental / loose electrode contact)
        currentNoiseLevel = cfg.noiseLevel * 8.0;
        trend = 0.02 * Math.sin(2 * Math.PI * 1.5 * tSec);
        break;

      case "DRIFTING":
        // Steady baseline drift (thermal drift / evaporation proxy)
        trend = cfg.driftRate * tSec;
        break;

      case "TRANSITION":
        // Sigmoidal transition from pre-dose steady state to inhibited/stimulated steady state
        // Sigmoid centered at 40% of duration
        const k = 12; // steepness
        const x0 = 0.4;
        const sigmoid = 1.0 / (1.0 + Math.exp(-k * (progress - x0)));
        trend = -cfg.amplitude * sigmoid;
        break;

      case "ANOMALY":
        // Introduce a sudden spike in the middle of the window
        trend = 0;
        if (progress > 0.45 && progress < 0.55) {
            trend = 1.5; // Huge spike
        }
        break;
    }

    const noise = currentNoiseLevel * gaussian();
    const rawVal = cfg.baseline + trend + noise;

    samples[i] = {
      timestamp: baseTimestamp + Math.round(i * dt),
      value: rawVal,
      phase: cfg.phase,
      runId: cfg.runId,
      chamberId: cfg.chamberId,
    };
  }

  return samples;
}
