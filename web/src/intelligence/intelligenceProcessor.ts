import { SignalFeatures } from "../core/types";
import {
  DecisionEvidence,
  DecisionReadiness,
  FeatureHistory,
  IntelligenceConfig,
  IntelligenceDebug,
  MLResult,
  ModelMetadata,
  SignalIntelligence,
  TemporalFeatures,
  TrajectoryClass,
} from "./intelligenceTypes";
import { QualityScorer, DEFAULT_QUALITY_CONFIG } from "./quality/qualityScorer";
import { TrajectoryClassifier, DEFAULT_TRAJECTORY_CONFIG } from "./trajectory/trajectoryClassifier";
import { AnomalyDetector, DEFAULT_ANOMALY_CONFIG } from "./anomaly/anomalyDetector";
import { ConfidenceEstimator, DEFAULT_CONFIDENCE_CONFIG } from "./confidence/confidenceEstimator";
import { ExplanationEngine } from "./explanation/explanationEngine";

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
  status: "EXPERIMENTAL",
};

export class IntelligenceProcessor {
  private config: IntelligenceConfig;
  private history: FeatureHistory;
  private qualityScorer: QualityScorer;
  private trajectoryClassifier: TrajectoryClassifier;
  private anomalyDetector: AnomalyDetector;
  private confidenceEstimator: ConfidenceEstimator;
  private explanationEngine: ExplanationEngine;

  private accumulatedEvidence: number = 0;
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
    this.explanationEngine = new ExplanationEngine();
  }

  /** Reset internal rolling history and evidence accumulation */
  public reset(): void {
    this.history.points = [];
    this.accumulatedEvidence = 0;
    this.lastDebug = null;
  }

  /** Process incoming Person A SignalFeatures sample */
  public process(features: SignalFeatures): SignalIntelligence {
    // 1. Maintain bounded rolling feature history
    this.history.points.push(features);
    if (this.history.points.length > this.history.maxLength) {
      this.history.points.shift();
    }

    // 2. Derive temporal features
    const temporal = this.computeTemporalFeatures();

    // 3. Compute signal quality (0..1 -> 0..100)
    const qualityRes = this.qualityScorer.score(features);
    const qualityScore100 = Math.round(qualityRes.score * 100);

    // 4. Classify trajectory & trajectory confidence
    const trajectoryRes = this.trajectoryClassifier.classify(
      features,
      temporal,
      this.history.points.length
    );
    const trajConfidence100 = Math.round(trajectoryRes.confidence * 100);

    // 5. Detect anomalies against rolling history
    const anomalyRes = this.anomalyDetector.detect(features, this.history.points);
    const anomalyScore100 = Math.round(anomalyRes.score * 100);
    const anomalyDetected = anomalyScore100 > 50;

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
    const confidenceScore100 = Math.round(confidenceRes.overallConfidence * 100);

    // 7. Accumulate Evidence Score across sequential windows
    if (confidenceRes.usable && !anomalyDetected) {
      const windowIncrement = (qualityRes.score * 0.4 + trajectoryRes.confidence * 0.6) * 15;
      this.accumulatedEvidence = Math.min(100, this.accumulatedEvidence + windowIncrement);
    } else {
      this.accumulatedEvidence = Math.max(0, this.accumulatedEvidence - 10);
    }
    const evidenceScore100 = Math.round(this.accumulatedEvidence);

    // 8. Determine Decision Readiness
    let decisionReadiness: DecisionReadiness = "INSUFFICIENT";
    if (evidenceScore100 >= 80 && confidenceScore100 >= 75) {
      decisionReadiness = "READY";
    } else if (evidenceScore100 >= 60 && confidenceScore100 >= 60) {
      decisionReadiness = "HIGH";
    } else if (evidenceScore100 >= 30) {
      decisionReadiness = "BUILDING";
    }

    // Combine reasons
    const allReasons = Array.from(
      new Set([
        ...qualityRes.reasons,
        ...anomalyRes.reasons,
        ...confidenceRes.reasons,
      ])
    );

    // 9. Generate Explanation Breakdown
    const explanation = this.explanationEngine.generateExplanation(
      qualityScore100,
      trajectoryRes.trajectory,
      trajConfidence100,
      anomalyScore100,
      features.stability,
      features.drift,
      this.history.points.length,
      allReasons
    );

    // 10. Construct compact DecisionEvidence payload for Person C (FPGA UART)
    const evidencePayload: DecisionEvidence = {
      quality: Math.min(255, Math.round((qualityScore100 / 100) * 255)),
      confidence: Math.min(255, Math.round((confidenceScore100 / 100) * 255)),
      anomaly: Math.min(255, Math.round((anomalyScore100 / 100) * 255)),
      trajectory: this.mapTrajectoryToEnumIndex(trajectoryRes.trajectory),
      flags: (confidenceRes.usable ? 1 : 0) | (anomalyDetected ? 2 : 0) | (decisionReadiness === "READY" ? 4 : 0),
    };

    // Store debug breakdown for development
    this.lastDebug = {
      qualityComponents: qualityRes.components,
      trajectoryEvidence: trajectoryRes.evidence,
      anomalyComponents: anomalyRes.components,
      temporalFeatures: temporal,
    };

    const result: SignalIntelligence & { signalQuality: number } = {
      timestamp: features.timestamp,
      qualityScore: qualityScore100,
      signalQuality: qualityRes.score,
      anomalyScore: anomalyScore100,
      anomalyDetected,
      trajectory: trajectoryRes.trajectory,
      trajectoryConfidence: trajConfidence100,
      confidenceScore: confidenceScore100,
      confidence: confidenceRes.overallConfidence,
      evidenceScore: evidenceScore100,
      decisionReadiness,
      explanation,
      evidencePayload,
      usable: confidenceRes.usable,
      reasons: allReasons,
      model: MODEL_METADATA_V1,
      qualityScoreAlias: qualityRes.score,
    } as any;

    return result;
  }

  public getDebugInfo(): IntelligenceDebug | null {
    return this.lastDebug;
  }

  private mapTrajectoryToEnumIndex(traj: TrajectoryClass): number {
    switch (traj) {
      case "STABLE": return 0;
      case "RISING": return 1;
      case "FALLING": return 2;
      case "TRANSITION": return 3;
      case "NOISY": return 4;
      case "DRIFTING": return 5;
      default: return 6; // UNRESOLVED
    }
  }

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

    const signMatches = slopes.filter(
      (s) => Math.sign(s) === Math.sign(meanSlope) && Math.abs(s) > 0.001
    ).length;
    const trendConsistency = Number((signMatches / slopes.length).toFixed(4));
    const recentChange = slopes[slopes.length - 1] - slopes[0];

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

/** Alias class export for PHENORA INTELLIGENCE ENGINE */
export const IntelligenceEngine = IntelligenceProcessor;

/** Convenience functional entry point */
export function processSignalIntelligence(
  features: SignalFeatures,
  processor?: IntelligenceProcessor
): SignalIntelligence {
  const p = processor || new IntelligenceProcessor();
  return p.process(features);
}
