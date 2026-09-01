// ============================================================================
// PHENORA MAIN INTELLIGENCE ENGINE (PERSON B)
// Entry point combining Quality, Trajectory, Anomaly, Confidence & Explainability
// Outputs SignalIntelligence and compact DecisionEvidence for Person C's FPGA
// ============================================================================

import { AnomalyDetector } from "./anomaly/anomalyDetector";
import { ConfidenceEngine } from "./confidence/confidenceEngine";
import { ExplanationEngine } from "./explanation/explanationEngine";
import { QualityAnalyzer } from "./quality/qualityAnalyzer";
import { TrajectoryAnalyzer } from "./trajectory/trajectoryAnalyzer";
import {
  DecisionEvidence,
  ModelMetadata,
  SignalFeatures,
  SignalIntelligence,
} from "./intelligenceTypes";

export class IntelligenceEngine {
  private qualityAnalyzer = new QualityAnalyzer();
  private trajectoryAnalyzer = new TrajectoryAnalyzer();
  private anomalyDetector = new AnomalyDetector();
  private confidenceEngine = new ConfidenceEngine();
  private explanationEngine = new ExplanationEngine();

  private featureHistory: SignalFeatures[] = [];

  public reset(): void {
    this.featureHistory = [];
    this.confidenceEngine.resetEvidence();
  }

  public processSample(current: SignalFeatures): {
    intelligence: SignalIntelligence;
    fpgaEvidence: DecisionEvidence;
  } {
    this.featureHistory.push(current);

    // 1. Multi-dimensional Quality Analysis
    const quality = this.qualityAnalyzer.analyze(current, this.featureHistory.length);

    // 2. Trajectory Classification
    const trajectory = this.trajectoryAnalyzer.analyze(this.featureHistory);

    // 3. Anomaly Detection
    const anomaly = this.anomalyDetector.analyze(current, this.featureHistory);

    // 4. Transparent Confidence & Evidence Accumulation
    const confidence = this.confidenceEngine.analyze(
      quality.qualityScore,
      trajectory.trajectory,
      trajectory.trajectoryConfidence,
      anomaly.anomalyScore,
      current,
      this.featureHistory.length
    );

    // 5. Explainability
    const explanation = this.explanationEngine.generateExplanation(
      confidence,
      trajectory.trajectory,
      quality.qualityScore,
      anomaly.anomalyScore
    );

    const intelligence: SignalIntelligence = {
      timestamp: current.timestamp,
      qualityScore: quality.qualityScore,
      trajectory: trajectory.trajectory,
      trajectoryConfidence: trajectory.trajectoryConfidence,
      anomalyScore: anomaly.anomalyScore,
      anomalyDetected: anomaly.anomalyDetected,
      confidenceScore: confidence.confidenceScore,
      evidenceScore: confidence.evidenceScore,
      decisionReadiness: confidence.decisionReadiness,
      explanation,
    };

    // 6. Compact DecisionEvidence formatted for Person C's FPGA UART Transfer
    const fpgaEvidence = this.toFpgaEvidence(intelligence, quality.isUsable);

    return {
      intelligence,
      fpgaEvidence,
    };
  }

  public toFpgaEvidence(intel: SignalIntelligence, isUsable: boolean): DecisionEvidence {
    // Map Trajectory to Enum Code (0: UNRESOLVED, 1: STABLE, 2: RISING, 3: FALLING, 4: TRANSITION, 5: NOISY, 6: DRIFTING)
    const trajCodeMap: Record<string, number> = {
      UNRESOLVED: 0,
      STABLE: 1,
      RISING: 2,
      FALLING: 3,
      TRANSITION: 4,
      NOISY: 5,
      DRIFTING: 6,
    };

    const trajCode = trajCodeMap[intel.trajectory] ?? 0;

    // Construct UART Bitfield Flags:
    // bit 0 = signal usable
    // bit 1 = trajectory valid
    // bit 2 = noisy flag
    // bit 3 = drifting flag
    // bit 4 = anomaly flag
    // bit 5 = baseline valid flag
    let flags = 0;
    if (isUsable) flags |= 1 << 0;
    if (intel.trajectory !== "UNRESOLVED") flags |= 1 << 1;
    if (intel.trajectory === "NOISY") flags |= 1 << 2;
    if (intel.trajectory === "DRIFTING") flags |= 1 << 3;
    if (intel.anomalyDetected) flags |= 1 << 4;
    flags |= 1 << 5; // Baseline valid flag

    return {
      quality: Math.round((intel.qualityScore / 100) * 255),       // Scale to uint8
      confidence: Math.round((intel.confidenceScore / 100) * 255),// Scale to uint8
      anomaly: Math.round((intel.anomalyScore / 100) * 255),      // Scale to uint8
      trajectory: trajCode,
      flags,
    };
  }

  public getModelMetadata(): ModelMetadata {
    return {
      modelId: "PHENORA-INTEL-V1",
      version: "TR-0.1",
      algorithm: "Ensemble (Rule-Based Baseline + Statistical Anomaly + Sliding Trajectory)",
      trainingDate: "2026-08-26",
      featureSchemaVersion: "SignalFeatures-v1",
      datasetVersion: "synthetic-v1",
      status: "RULE_BASED",
    };
  }
}
