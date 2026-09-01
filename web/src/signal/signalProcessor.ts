import {
  RawSignalSample,
  SignalFeatures,
  SignalWindow,
  ProcessingConfig,
  DEFAULT_PROCESSING_CONFIG,
} from "../core/signalTypes";
import { extractFeatures } from "./featureExtractor";
import { establishBaseline } from "./baseline";
import { validateSample, ValidationResult } from "./acquisition";
import { generateSignal, SignalGeneratorConfig, SignalMode } from "../simulation/signalGenerator";

/**
 * Creates a SignalWindow struct from an array of samples.
 */
export function createWindow(
  samples: RawSignalSample[],
  size?: number,
  startIndex: number = 0
): SignalWindow {
  const windowSize = size ?? samples.length;
  const sliced = samples.slice(startIndex, startIndex + windowSize);
  const startTimestamp = sliced.length > 0 ? sliced[0].timestamp : 0;
  const endTimestamp = sliced.length > 0 ? sliced[sliced.length - 1].timestamp : 0;

  return {
    samples: sliced,
    startTimestamp,
    endTimestamp,
  };
}

/**
 * Main canonical processor function:
 * Takes a SignalWindow and executes the full deterministic signal processing chain.
 * 
 * @param window The SignalWindow containing raw ADC or voltage samples
 * @param config Optional processing configuration overrides
 * @param baselineVal Optional pre-established baseline value
 */
export function processSignalWindow(
  window: SignalWindow,
  config: Partial<ProcessingConfig> = {},
  baselineVal?: number,
  sequenceNum: number = 0
): SignalFeatures {
  const cfg = { ...DEFAULT_PROCESSING_CONFIG, ...config };
  return extractFeatures(window.samples, cfg, baselineVal, undefined, sequenceNum);
}

export interface StreamingSignalPipeline {
  /** Ingests a new raw sample and returns updated features if window is full */
  /** Ingests a new raw sample and returns updated features if window is full */
  feed(sample: RawSignalSample): SignalFeatures | null;
  /** Returns the current established baseline */
  getBaseline(): number | null;
  /** Manually triggers the capture and freezing of the baseline from the current window */
  captureBaseline(): void;
  /** Sets or resets the pre-dose baseline */
  setBaseline(baseline: number): void;
  /** Resets the internal buffers */
  reset(): void;
  /** Returns all accumulated historical features */
  getHistoricalFeatures(): SignalFeatures[];
}

/**
 * Creates an online streaming signal processor instance.
 * Suitable for live acquisition from WebSocket / Serial / ADS1115 or animated simulation loops.
 */
export function createSignalPipeline(
  config: Partial<ProcessingConfig> = {}
): StreamingSignalPipeline {
  const cfg: ProcessingConfig = { ...DEFAULT_PROCESSING_CONFIG, ...config };
  
  let sampleBuffer: RawSignalSample[] = [];
  let slopeHistory: number[] = [];
  let establishedBaseline: number | null = null;
  let featureHistory: SignalFeatures[] = [];

  return {
    feed(sample: RawSignalSample): SignalFeatures | null {
      const validation = validateSample(sample, cfg);
      if (!validation.valid) {
        // We log it or handle it, but do not push invalid samples into the pipeline
        console.warn("Invalid sample rejected:", validation.reason);
        return null;
      }

      sampleBuffer.push(sample);

      // Keep buffer at featureWindowSize
      if (sampleBuffer.length > cfg.featureWindowSize) {
        sampleBuffer.shift();
      }

      if (sampleBuffer.length < Math.min(cfg.featureWindowSize, 5)) {
        return null; // Buffer warming up
      }

      const features = extractFeatures(
        sampleBuffer,
        cfg,
        establishedBaseline ?? undefined,
        slopeHistory,
        featureHistory.length + 1
      );

      slopeHistory.push(features.slope);
      if (slopeHistory.length > cfg.stabilityWindowSize * 2) {
        slopeHistory.shift();
      }

      featureHistory.push(features);
      return features;
    },

    getBaseline(): number | null {
      return establishedBaseline;
    },

    captureBaseline(): void {
      if (sampleBuffer.length >= cfg.filterWindowSize) {
        establishedBaseline = establishBaseline(sampleBuffer);
      } else {
        console.warn("Cannot capture baseline: Insufficient samples in buffer.");
      }
    },

    setBaseline(baseline: number): void {
      establishedBaseline = baseline;
    },

    reset(): void {
      sampleBuffer = [];
      slopeHistory = [];
      establishedBaseline = null;
      featureHistory = [];
    },

    getHistoricalFeatures(): SignalFeatures[] {
      return [...featureHistory];
    },
  };
}

/**
 * Demo Adapter:
 * Generates a complete synthetic run and processes all samples through the pipeline.
 * Enables the UI and Person B / C to test immediately with a single function call.
 */
export function createDemoSignalRun(
  mode: SignalMode = "STABLE",
  generatorConfig: Partial<SignalGeneratorConfig> = {},
  processingConfig: Partial<ProcessingConfig> = {}
): { samples: RawSignalSample[]; features: SignalFeatures[] } {
  const samples = generateSignal({ mode, ...generatorConfig });
  const pipeline = createSignalPipeline(processingConfig);
  const features: SignalFeatures[] = [];

  for (const sample of samples) {
      if (sample.phase === "CONTROL_PRE_DOSE") {
          // Keep updating baseline during the pre-dose phase
          pipeline.captureBaseline();
      }
      
      const feat = pipeline.feed(sample);
      if (feat) {
        features.push(feat);
      }
  }

  return { samples, features };
}
