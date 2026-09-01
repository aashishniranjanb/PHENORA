// ============================================================================
// PHENORA Confidence Engine Unit Tests (PERSON B)
// ============================================================================

import { ConfidenceEngine } from "../confidence/confidenceEngine";
import { SignalFeatures } from "../intelligenceTypes";

describe("ConfidenceEngine", () => {
  const engine = new ConfidenceEngine();

  const mockFeatures: SignalFeatures = {
    timestamp: Date.now(),
    rawValue: 1.0,
    rms: 0.707,
    variance: 0.001,
    peakToPeak: 0.002,
    baseline: 1.0,
    delta: 0.0,
    slope: 0.0,
    stability: 0.95,
    snr: 35,
    drift: 0.0,
  };

  it("should accumulate evidence over consecutive high-quality windows", () => {
    engine.resetEvidence();

    const res1 = engine.analyze(90, "STABLE", 90, 0, mockFeatures, 3);
    const res2 = engine.analyze(90, "STABLE", 90, 0, mockFeatures, 4);
    const res3 = engine.analyze(90, "STABLE", 90, 0, mockFeatures, 5);

    expect(res3.evidenceScore).toBeGreaterThan(res1.evidenceScore);
    expect(res3.decisionReadiness).toBe("READY");
  });

  it("should penalize evidence when anomaly occurs", () => {
    engine.resetEvidence();
    engine.analyze(90, "STABLE", 90, 0, mockFeatures, 5);

    const anomalousRes = engine.analyze(90, "STABLE", 90, 80, mockFeatures, 6);
    expect(anomalousRes.confidenceScore).toBeLessThan(70);
  });
});
