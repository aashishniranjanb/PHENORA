/**
 * Integration Test: Person A (Signal Pipeline) -> Person B (Intelligence Mock)
 */

import {
  SignalFeatures,
  TrajectoryClass
} from "../../core/signalTypes";
import {
  createDemoSignalRun,
  SignalMode
} from "../index";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

// ---------------------------------------------------------
// MOCK PERSON B (Intelligence Processor)
// ---------------------------------------------------------
export interface SignalIntelligence {
  trajectory: TrajectoryClass;
  confidence: number;
  anomalyDetected: boolean;
}

export class MockIntelligenceProcessor {
  public analyze(features: SignalFeatures): SignalIntelligence {
    let confidence = features.quality;
    if (features.anomaly) {
      confidence = Math.max(0, confidence - 50);
    }

    return {
      trajectory: features.trajectory,
      confidence,
      anomalyDetected: features.anomaly || !features.valid
    };
  }
}

// ---------------------------------------------------------
// INTEGRATION TESTS
// ---------------------------------------------------------
function testIntegration(mode: SignalMode, expectedTrajectory: TrajectoryClass, expectedConfidenceHigh: boolean) {
  console.log(`--- Testing Integration Scenario: ${mode} ---`);
  
  // Person A Pipeline creates features
  const demo = createDemoSignalRun(mode, { duration: 10, sampleRate: 10 });
  const finalFeatures = demo.features[demo.features.length - 1];
  console.log(`[DEBUG] stability: ${finalFeatures.stability}, slope: ${finalFeatures.slope}, trajectory: ${finalFeatures.trajectory}`);
  
  // Person B Pipeline consumes features
  const personB = new MockIntelligenceProcessor();
  const intelligence = personB.analyze(finalFeatures);
  
  assert(intelligence.trajectory === expectedTrajectory, `Expected trajectory ${expectedTrajectory}, got ${intelligence.trajectory}`);
  
  let minConfidence = 100;
  for (const f of demo.features) {
    const b = personB.analyze(f);
    if (b.confidence < minConfidence) minConfidence = b.confidence;
  }
  
  if (expectedConfidenceHigh) {
    assert(intelligence.confidence >= 80, `Expected high final confidence, got ${intelligence.confidence}`);
  } else if (mode === "ANOMALY") {
    assert(minConfidence < 80, `Expected confidence to drop during anomaly, but min was ${minConfidence}`);
  } else {
    assert(intelligence.confidence < 80, `Expected lower final confidence, got ${intelligence.confidence}`);
  }
}

function runIntegrationTests() {
  console.log("\n========================================================");
  console.log("  PHENORA A -> B INTEGRATION TESTS  ");
  console.log("========================================================\n");

  let passed = 0;
  let total = 0;

  function run(fn: () => void) {
    total++;
    try {
      fn();
      passed++;
    } catch (e: any) {
      console.error(`Error:`, e.message);
    }
    console.log("");
  }

  run(() => testIntegration("STABLE", "FLAT", true));
  run(() => testIntegration("RISING", "RISING", true));
  run(() => testIntegration("FALLING", "FALLING", true));
  run(() => testIntegration("NOISY", "UNSTABLE", false));
  run(() => testIntegration("ANOMALY", "FLAT", false));

  console.log("========================================================");
  console.log(`  RESULTS: ${passed} / ${total} TESTS PASSED`);
  console.log("========================================================\n");

  if (passed !== total) {
    process.exit(1);
  }
}

runIntegrationTests();
