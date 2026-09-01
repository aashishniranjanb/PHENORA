// ============================================================================
// PHENORA Main Intelligence Engine Unit Tests (PERSON B)
// ============================================================================

import { IntelligenceEngine } from "../intelligenceEngine";
import { ScenarioGenerator } from "../simulation/intelligenceScenarios";

describe("IntelligenceEngine", () => {
  const engine = new IntelligenceEngine();
  const scenarioGen = new ScenarioGenerator();

  beforeEach(() => {
    engine.reset();
  });

  it("should process stable scenario samples and output compact FPGA payload", () => {
    const scenario = scenarioGen.generateStableScenario();
    let lastResult;

    for (const sample of scenario.samples) {
      lastResult = engine.processSample(sample);
    }

    expect(lastResult).toBeDefined();
    expect(lastResult?.intelligence.trajectory).toBe("STABLE");
    expect(lastResult?.intelligence.confidenceScore).toBeGreaterThanOrEqual(70);

    // Verify compact FPGA DecisionEvidence UART bitfield & byte payload
    const fpgaEv = lastResult?.fpgaEvidence;
    expect(fpgaEv).toBeDefined();
    expect(fpgaEv?.quality).toBeGreaterThanOrEqual(180);
    expect(fpgaEv?.trajectory).toBe(1); // 1 = STABLE
    expect(fpgaEv?.flags & 1).toBe(1);  // Bit 0 usable = 1
  });
});
