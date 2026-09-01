// ============================================================================
// PHENORA Anomaly Detector Unit Tests (PERSON B)
// ============================================================================

import { AnomalyDetector } from "../anomaly/anomalyDetector";
import { ScenarioGenerator } from "../simulation/intelligenceScenarios";

describe("AnomalyDetector", () => {
  const detector = new AnomalyDetector();
  const scenarioGen = new ScenarioGenerator();

  it("should not detect anomaly in normal stable signal", () => {
    const scenario = scenarioGen.generateStableScenario();
    const res = detector.analyze(scenario.samples[scenario.samples.length - 1], scenario.samples);
    expect(res.anomalyDetected).toBe(false);
    expect(res.anomalyScore).toBeLessThan(50);
  });

  it("should detect impulse spike anomaly", () => {
    const scenario = scenarioGen.generateAnomalyScenario();
    const anomalySample = scenario.samples[5];
    const historyBefore = scenario.samples.slice(0, 6);

    const res = detector.analyze(anomalySample, historyBefore);
    expect(res.anomalyDetected).toBe(true);
    expect(res.anomalyScore).toBeGreaterThanOrEqual(70);
  });
});
