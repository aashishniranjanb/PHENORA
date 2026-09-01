import assert from "assert";
import { SignalFeatures } from "../../core/types";
import { IntelligenceEngine, IntelligenceProcessor } from "../intelligenceProcessor";
import { generateScenarioSequence } from "../../simulation/intelligenceScenarios";

function createMockFeatures(overrides: Partial<SignalFeatures> = {}): SignalFeatures {
  return {
    timestamp: Date.now(),
    rawValue: 1.0,
    rms: 0.8,
    variance: 0.001,
    peakToPeak: 0.02,
    baseline: 0.79,
    delta: 0.01,
    slope: 0.0005,
    stability: 0.95,
    snr: 25.0,
    drift: 0.001,
    ...overrides,
  };
}

export function runAllIntelligenceTests() {
  console.log("=== RUNNING PERSON B INTELLIGENCE ENGINE TESTS ===");

  // 1. Test STABLE Trajectory & Readiness
  {
    console.log("[Test 1] STABLE Trajectory & Evidence Accumulation");
    const engine = new IntelligenceEngine();
    let result;
    for (let i = 0; i < 6; i++) {
      result = engine.process(createMockFeatures({ slope: 0.0002, stability: 0.95, variance: 0.001 }));
    }
    assert.strictEqual(result?.trajectory, "STABLE", "Should classify as STABLE");
    assert.strictEqual(result?.usable, true, "Should be usable for decisions");
    assert(result.qualityScore >= 80, "Quality score should be >= 80");
    assert(result.confidenceScore >= 70, "Confidence score should be >= 70");
    assert(result.evidenceScore > 50, "Evidence score should accumulate");
    console.log("  ✓ Passed");
  }

  // 2. Test RISING Trajectory
  {
    console.log("[Test 2] RISING Trajectory");
    const engine = new IntelligenceEngine();
    let result;
    for (let i = 0; i < 6; i++) {
      result = engine.process(createMockFeatures({ slope: 0.015, stability: 0.90, variance: 0.002 }));
    }
    assert.strictEqual(result?.trajectory, "RISING", "Should classify as RISING");
    assert.strictEqual(result?.usable, true, "RISING signal should be usable");
    console.log("  ✓ Passed");
  }

  // 3. Test FALLING Trajectory
  {
    console.log("[Test 3] FALLING Trajectory");
    const engine = new IntelligenceEngine();
    let result;
    for (let i = 0; i < 6; i++) {
      result = engine.process(createMockFeatures({ slope: -0.015, stability: 0.90, variance: 0.002 }));
    }
    assert.strictEqual(result?.trajectory, "FALLING", "Should classify as FALLING");
    assert.strictEqual(result?.usable, true, "FALLING signal should be usable");
    console.log("  ✓ Passed");
  }

  // 4. Test NOISY Trajectory
  {
    console.log("[Test 4] NOISY Trajectory");
    const engine = new IntelligenceEngine();
    let result;
    for (let i = 0; i < 6; i++) {
      result = engine.process(createMockFeatures({ variance: 0.08, snr: 4.0, stability: 0.3 }));
    }
    assert.strictEqual(result?.trajectory, "NOISY", "Should classify as NOISY");
    assert.strictEqual(result?.usable, false, "NOISY signal must not be usable");
    assert(result.reasons.includes("LOW_SNR"), "Should include LOW_SNR reason");
    assert(result.reasons.includes("HIGH_VARIANCE"), "Should include HIGH_VARIANCE reason");
    console.log("  ✓ Passed");
  }

  // 5. Test DRIFTING Trajectory
  {
    console.log("[Test 5] DRIFTING Trajectory");
    const engine = new IntelligenceEngine();
    let result;
    for (let i = 0; i < 6; i++) {
      result = engine.process(createMockFeatures({ drift: 0.03, slope: 0.001, stability: 0.7 }));
    }
    assert.strictEqual(result?.trajectory, "DRIFTING", "Should classify as DRIFTING");
    assert(result.reasons.includes("BASELINE_DRIFT"), "Should include BASELINE_DRIFT reason");
    console.log("  ✓ Passed");
  }

  // 6. Test TRANSITION Trajectory
  {
    console.log("[Test 6] TRANSITION Trajectory");
    const engine = new IntelligenceEngine();
    for (let i = 0; i < 5; i++) {
      engine.process(createMockFeatures({ slope: 0.012 }));
    }
    const result = engine.process(createMockFeatures({ slope: -0.018 }));
    assert.strictEqual(result.trajectory, "TRANSITION", "Should detect TRANSITION when slope flips");
    console.log("  ✓ Passed");
  }

  // 7. Test Insufficient History / UNKNOWN
  {
    console.log("[Test 7] Insufficient History / UNKNOWN");
    const engine = new IntelligenceEngine();
    const result = engine.process(createMockFeatures());
    assert.strictEqual(result.trajectory, "UNKNOWN", "Initial point should be UNKNOWN");
    assert.strictEqual(result.decisionReadiness, "INSUFFICIENT");
    console.log("  ✓ Passed");
  }

  // 8. Test Feature Spike Anomaly
  {
    console.log("[Test 8] Feature Spike Anomaly");
    const engine = new IntelligenceEngine();
    for (let i = 0; i < 10; i++) {
      engine.process(createMockFeatures({ rms: 0.8 }));
    }
    const result = engine.process(createMockFeatures({ rms: 5.5 }));
    assert(result.anomalyScore > 40, "Anomaly score should spike");
    assert.strictEqual(result.anomalyDetected, true, "Anomaly should be detected");
    assert(result.reasons.includes("FEATURE_SPIKE"), "Should record FEATURE_SPIKE reason");
    console.log("  ✓ Passed");
  }

  // 9. Test Model Explanations Generation
  {
    console.log("[Test 9] Model Explanations Generation");
    const engine = new IntelligenceEngine();
    for (let i = 0; i < 5; i++) {
      engine.process(createMockFeatures());
    }
    const result = engine.process(createMockFeatures());
    assert(result.explanation.qualityFactors.length > 0, "Should contain quality explanation factors");
    assert(result.explanation.trajectoryFactors.length > 0, "Should contain trajectory explanation factors");
    assert(result.explanation.summary.length > 0, "Should contain summary string");
    console.log("  ✓ Passed");
  }

  // 10. Test FPGA UART DecisionEvidence Payload
  {
    console.log("[Test 10] FPGA UART DecisionEvidence Payload");
    const engine = new IntelligenceEngine();
    for (let i = 0; i < 5; i++) {
      engine.process(createMockFeatures());
    }
    const result = engine.process(createMockFeatures());
    assert(typeof result.evidencePayload.quality === "number", "Quality payload byte should be number");
    assert(typeof result.evidencePayload.confidence === "number", "Confidence payload byte should be number");
    assert(typeof result.evidencePayload.trajectory === "number", "Trajectory enum index should be number");
    assert(typeof result.evidencePayload.flags === "number", "Bitfield flags byte should be number");
    console.log("  ✓ Passed");
  }

  // 11. Test Synthetic Scenarios Sequence
  {
    console.log("[Test 11] Synthetic Scenarios Sequence Validation");
    const engine = new IntelligenceEngine();
    const scenarioPoints = generateScenarioSequence("RISING", 6);
    let result;
    for (const pt of scenarioPoints) {
      result = engine.process(pt);
    }
    assert.strictEqual(result?.trajectory, "RISING", "Scenario RISING should classify as RISING");
    console.log("  ✓ Passed");
  }

  console.log("\nALL 11 PERSON B INTELLIGENCE ENGINE TESTS PASSED SUCCESSFULLY! ✅");
}

if (require.main === module) {
  runAllIntelligenceTests();
}
