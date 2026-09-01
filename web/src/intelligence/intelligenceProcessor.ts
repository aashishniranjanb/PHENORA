import { SignalFeatures } from "../core/types";
import {
  FeatureHistory,
  IntelligenceConfig,
  IntelligenceDebug,
  MLResult,
  ModelMetadata,
  TemporalFeatures,
} from "./intelligenceTypes";
import { QualityScorer, DEFAULT_QUALITY_CONFIG } from "./quality/qualityScorer";
import { TrajectoryClassifier, DEFAULT_TRAJECTORY_CONFIG } from "./trajectory/trajectoryClassifier";
import { AnomalyDetector, DEFAULT_ANOMALY_CONFIG } from "./anomaly/anomalyDetector";
import { ConfidenceEstimator, DEFAULT_CONFIDENCE_CONFIG } from "./confidence/confidenceEstimator";

export const DEFAULT_INTELLIGENCE_CONFIG: IntelligenceConfig = {
  historyMaxLength: 30,
  quality: DEFAULT_QUALITY_CONFIG,
  trajectory: DEFAULT_TRAJECTORY_CONFIG,
  anomaly: DEFAULT_ANOMALY_CONFIG,
  confidence: DEFAULT_CONFIDENCE_CONFIG,
};

export const MODEL_METADATA_V1: ModelMetadata = {
  modelName: "phenora-signal-intelligence",
  modelVersion: "v1.0",
  trained: false,
  trainingSource: "SYNTHETIC",
  featureVersion: "signal-features-v1",
};

export class IntelligenceProcessor {
  private config: IntelligenceConfig;
  private history: FeatureHistory;
  private qualityScorer: QualityScorer;
  private trajectoryClassifier: TrajectoryClassifier;
  private anomalyDetector: AnomalyDetector;
  private confidenceEstimator: ConfidenceEstimator;

  private lastDebug: IntelligenceDebug | null = null;

  constructor(config: Partial<IntelligenceConfig> = {}) {
    this.config = {
      ...DEFAULT_INTELLIGENCE_CONFIG,
      ...config,
      quality: { ...DEFAULT_QUALITY_CONFIG, ...config.quality },
      trajectory: { ...DEFAULT_TRAJECTORY_CONFIG, ...config.trajectory },
      anomaly: { ...DEFAULT_ANOMALY_CONFIG, ...config.anomaly },
      confidence: { ...DEFAULT_CONFIDENCE_CONFIG, ...config.confidence },
    };

    this.history = { points: [], maxLength: this.config.historyMaxLength };

    this.qualityScorer = new QualityScorer(this.config.quality);
    this.trajectoryClassifier = new TrajectoryClassifier(this.config.trajectory);
    this.anomalyDetector = new AnomalyDetector(this.config.anomaly);
    this.confidenceEstimator = new ConfidenceEstimator(this.config.confidence);
  }

  /** Reset internal rolling history */
  public reset(): void {
    this.history.points = [];
    this.lastDebug = null;
  }

  /** Process incoming Person A SignalFeatures stream sample */
  public process(features: SignalFeatures): MLResult {
    // 1. Maintain bounded rolling feature history
    this.history.points.push(features);
    if (this.history.points.length > this.history.maxLength) {
      this.history.points.shift();
    }

    // 2. Derive temporal features
    const temporal = this.computeTemporalFeatures();

    // 3. Compute signal quality score & reasons
    const qualityRes = this.qualityScorer.score(features);

    // 4. Classify trajectory & trajectory confidence
    const trajectoryRes = this.trajectoryClassifier.classify(
      features,
      temporal,
      this.history.points.length
    );

    // 5. Detect anomalies against rolling history
    const anomalyRes = this.anomalyDetector.detect(features, this.history.points);

    // 6. Estimate overall conservative confidence and usability
    const confidenceRes = this.confidenceEstimator.estimate(
      qualityRes.score,
      trajectoryRes.trajectory,
      trajectoryRes.confidence,
      anomalyRes.score,
      features.stability,
      features.drift,
      this.history.points.length
    );

    // Combine all human-readable & machine-readable reasons
    const allReasons = Array.from(
      new Set([
        ...qualityRes.reasons,
        ...anomalyRes.reasons,
        ...confidenceRes.reasons,
      ])
    );

    // Store debug breakdown for development inspection
    this.lastDebug = {
      qualityComponents: qualityRes.components,
      trajectoryEvidence: trajectoryRes.evidence,
      anomalyComponents: anomalyRes.components,
      temporalFeatures: temporal,
    };

    const mlResult: MLResult = {
      timestamp: features.timestamp,
      signalQuality: qualityRes.score,
      anomalyScore: anomalyRes.score,
      trajectory: trajectoryRes.trajectory,
      trajectoryConfidence: trajectoryRes.confidence,
      confidence: confidenceRes.overallConfidence,
      usable: confidenceRes.usable,
      reasons: allReasons,
      model: MODEL_METADATA_V1,
      // Backward-compatibility alias
      qualityScore: qualityRes.score,
    };

    return mlResult;
  }

  /** Retrieve latest internal debug state */
  public getDebugInfo(): IntelligenceDebug | null {
    return this.lastDebug;
  }

  /** Calculate temporal slope, variance, and trend consistency over rolling history */
  private computeTemporalFeatures(): TemporalFeatures {
    const points = this.history.points;
    if (points.length === 0) {
      return {
        meanSlope: 0,
        slopeVariance: 0,
        trendConsistency: 0,
        consecutiveStableWindows: 0,
        recentChange: 0,
        timeSinceTransition: 0,
      };
    }

    const slopes = points.map((p) => p.slope);
    const meanSlope = slopes.reduce((a, b) => a + b, 0) / slopes.length;
    const slopeVariance =
      slopes.reduce((a, b) => a + Math.pow(b - meanSlope, 2), 0) / slopes.length;

    // Trend consistency: fraction of slopes sharing the same sign as meanSlope
    const signMatches = slopes.filter(
      (s) => Math.sign(s) === Math.sign(meanSlope) && Math.abs(s) > 0.001
    ).length;
    const trendConsistency = Number((signMatches / slopes.length).toFixed(4));

    // Recent change (difference between latest slope and initial slope in window)
    const recentChange = slopes[slopes.length - 1] - slopes[0];

    // Consecutive stable windows
    let stableCount = 0;
    for (let i = slopes.length - 1; i >= 0; i--) {
      if (Math.abs(slopes[i]) <= this.config.trajectory.stableSlopeThreshold) {
        stableCount++;
      } else {
        break;
      }
    }

    return {
      meanSlope: Number(meanSlope.toFixed(6)),
      slopeVariance: Number(slopeVariance.toFixed(6)),
      trendConsistency,
      consecutiveStableWindows: stableCount,
      recentChange: Number(recentChange.toFixed(6)),
      timeSinceTransition: 0,
    };
  }
}

/** Convenience functional entry point */
export function processSignalIntelligence(
  features: SignalFeatures,
  processor?: IntelligenceProcessor
): MLResult {
  const p = processor || new IntelligenceProcessor();
  return p.process(features);
}
