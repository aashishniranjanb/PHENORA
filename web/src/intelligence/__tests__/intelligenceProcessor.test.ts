import assert from "assert";
import { SignalFeatures } from "../../core/types";
import { IntelligenceProcessor } from "../intelligenceProcessor";

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
  console.log("=== RUNNING PERSON B SIGNAL INTELLIGENCE TESTS ===");

  // 1. Test STABLE trajectory
  {
    console.log("[Test 1] STABLE Trajectory");
    const processor = new IntelligenceProcessor();
    let result;
    for (let i = 0; i < 5; i++) {
      result = processor.process(createMockFeatures({ slope: 0.0002, stability: 0.95, variance: 0.001 }));
    }
    assert.strictEqual(result?.trajectory, "STABLE", "Should classify as STABLE");
    assert.strictEqual(result?.usable, true, "Should be usable for decisions");
    assert(result.signalQuality > 0.8, "Signal quality should be high");
    assert(result.confidence > 0.7, "Confidence should be high");
    console.log("  ✓ Passed");
  }

  // 2. Test RISING trajectory
  {
    console.log("[Test 2] RISING Trajectory");
    const processor = new IntelligenceProcessor();
    let result;
    for (let i = 0; i < 5; i++) {
      result = processor.process(createMockFeatures({ slope: 0.015, stability: 0.90, variance: 0.002 }));
    }
    assert.strictEqual(result?.trajectory, "RISING", "Should classify as RISING");
    assert.strictEqual(result?.usable, true, "RISING signal should be usable");
    console.log("  ✓ Passed");
  }

  // 3. Test FALLING trajectory
  {
    console.log("[Test 3] FALLING Trajectory");
    const processor = new IntelligenceProcessor();
    let result;
    for (let i = 0; i < 5; i++) {
      result = processor.process(createMockFeatures({ slope: -0.015, stability: 0.90, variance: 0.002 }));
    }
    assert.strictEqual(result?.trajectory, "FALLING", "Should classify as FALLING");
    assert.strictEqual(result?.usable, true, "FALLING signal should be usable");
    console.log("  ✓ Passed");
  }

  // 4. Test NOISY trajectory
  {
    console.log("[Test 4] NOISY Trajectory");
    const processor = new IntelligenceProcessor();
    let result;
    for (let i = 0; i < 5; i++) {
      result = processor.process(createMockFeatures({ variance: 0.08, snr: 4.0, stability: 0.3 }));
    }
    assert.strictEqual(result?.trajectory, "NOISY", "Should classify as NOISY");
    assert.strictEqual(result?.usable, false, "NOISY signal must not be usable");
    assert(result.reasons.includes("LOW_SNR"), "Should include LOW_SNR reason");
    assert(result.reasons.includes("HIGH_VARIANCE"), "Should include HIGH_VARIANCE reason");
    console.log("  ✓ Passed");
  }

  // 5. Test DRIFTING trajectory
  {
    console.log("[Test 5] DRIFTING Trajectory");
    const processor = new IntelligenceProcessor();
    let result;
    for (let i = 0; i < 5; i++) {
      result = processor.process(createMockFeatures({ drift: 0.03, slope: 0.001, stability: 0.7 }));
    }
    assert.strictEqual(result?.trajectory, "DRIFTING", "Should classify as DRIFTING");
    assert(result.reasons.includes("BASELINE_DRIFT"), "Should include BASELINE_DRIFT reason");
    console.log("  ✓ Passed");
  }

  // 6. Test TRANSITION trajectory
  {
    console.log("[Test 6] TRANSITION Trajectory");
    const processor = new IntelligenceProcessor();
    for (let i = 0; i < 5; i++) {
      processor.process(createMockFeatures({ slope: 0.01 }));
    }
    // Sudden shift in slope direction
    const result = processor.process(createMockFeatures({ slope: -0.02 }));
    assert.strictEqual(result.trajectory, "TRANSITION", "Should detect TRANSITION when slope flips");
    console.log("  ✓ Passed");
  }

  // 7. Test Insufficient History / UNKNOWN
  {
    console.log("[Test 7] Insufficient History / UNKNOWN");
    const processor = new IntelligenceProcessor();
    const result = processor.process(createMockFeatures());
    assert.strictEqual(result.trajectory, "UNKNOWN", "Initial point should be UNKNOWN");
    assert(result.reasons.includes("INSUFFICIENT_HISTORY"), "Should flag INSUFFICIENT_HISTORY");
    console.log("  ✓ Passed");
  }

  // 8. Test Feature Spike Anomaly
  {
    console.log("[Test 8] Feature Spike Anomaly");
    const processor = new IntelligenceProcessor();
    for (let i = 0; i < 10; i++) {
      processor.process(createMockFeatures({ rms: 0.8 }));
    }
    // Spike in RMS value
    const result = processor.process(createMockFeatures({ rms: 5.5 }));
    assert(result.anomalyScore > 0.4, "Anomaly score should spike");
    assert(result.reasons.includes("FEATURE_SPIKE"), "Should record FEATURE_SPIKE reason");
    console.log("  ✓ Passed");
  }

  // 9. Test SNR Collapse Anomaly
  {
    console.log("[Test 9] SNR Collapse Anomaly");
    const processor = new IntelligenceProcessor();
    for (let i = 0; i < 10; i++) {
      processor.process(createMockFeatures({ snr: 25.0 }));
    }
    const result = processor.process(createMockFeatures({ snr: 2.0 }));
    assert(result.reasons.includes("SNR_COLLAPSE"), "Should record SNR_COLLAPSE reason");
    console.log("  ✓ Passed");
  }

  // 10. Test Model Metadata Verification
  {
    console.log("[Test 10] Model Metadata Verification");
    const processor = new IntelligenceProcessor();
    const result = processor.process(createMockFeatures());
    assert.strictEqual(result.model.modelName, "phenora-signal-intelligence");
    assert.strictEqual(result.model.trainingSource, "SYNTHETIC");
    assert.strictEqual(result.model.trained, false);
    console.log("  ✓ Passed");
  }

  // 11. Test Deterministic Repeatability
  {
    console.log("[Test 11] Deterministic Repeatability");
    const p1 = new IntelligenceProcessor();
    const p2 = new IntelligenceProcessor();

    const sample = createMockFeatures({ slope: 0.008, snr: 22 });
    const r1 = p1.process(sample);
    const r2 = p2.process(sample);

    assert.strictEqual(r1.confidence, r2.confidence, "Confidence should be identical");
    assert.strictEqual(r1.signalQuality, r2.signalQuality, "Quality should be identical");
    assert.strictEqual(r1.trajectory, r2.trajectory, "Trajectory should be identical");
    console.log("  ✓ Passed");
  }

  console.log("\nALL 11 PERSON B SIGNAL INTELLIGENCE TESTS PASSED SUCCESSFULLY! ✅");
}

// Auto-run if executed directly via ts-node or script execution
if (require.main === module) {
  runAllIntelligenceTests();
}
