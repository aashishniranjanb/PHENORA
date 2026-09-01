// ============================================================================
// PHENORA Trajectory Classifier Unit Tests (PERSON B)
// ============================================================================

import { TrajectoryAnalyzer } from "../trajectory/trajectoryAnalyzer";
import { ScenarioGenerator } from "../simulation/intelligenceScenarios";

describe("TrajectoryAnalyzer", () => {
  const analyzer = new TrajectoryAnalyzer();
  const scenarioGen = new ScenarioGenerator();

  it("should classify stable scenario as STABLE", () => {
    const scenario = scenarioGen.generateStableScenario();
    const res = analyzer.analyze(scenario.samples);
    expect(res.trajectory).toBe("STABLE");
    expect(res.trajectoryConfidence).toBeGreaterThanOrEqual(80);
  });

  it("should classify rising scenario as RISING", () => {
    const scenario = scenarioGen.generateRisingScenario();
    const res = analyzer.analyze(scenario.samples);
    expect(res.trajectory).toBe("RISING");
    expect(res.slopeMean).toBeGreaterThan(0);
  });

  it("should classify noisy scenario as NOISY", () => {
    const scenario = scenarioGen.generateNoisyScenario();
    const res = analyzer.analyze(scenario.samples);
    expect(res.trajectory).toBe("NOISY");
    expect(res.slopeVariance).toBeGreaterThan(0.01);
  });
});
