/**
 * PHENORA Signal Measurement Integrity Test Suite
 */

import {
  generateSignal,
  calculateVariance,
  calculatePeakToPeak,
  calculateDelta,
  extractFeatures,
  createDemoSignalRun,
  calibrateAdcToVoltage,
  generateCalibrationReport
} from "../index";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

function runAllTests() {
  console.log("\n========================================================");
  console.log("  PHENORA MEASUREMENT INTEGRITY PIPELINE TEST SUITE (V2)  ");
  console.log("========================================================\n");

  let passed = 0;
  let total = 0;

  function test(name: string, fn: () => void) {
    total++;
    console.log(`--- Test ${total}: ${name} ---`);
    try {
      fn();
      passed++;
    } catch (e: any) {
      console.error(`Error in test "${name}":`, e.message);
    }
    console.log("");
  }

  test("Calibration: ADC converts to Voltage correctly", () => {
    const v = calibrateAdcToVoltage(16383, 3.3, 32767);
    assert(Math.abs(v - 1.649) < 0.01, `Expected ~1.65V, got ${v}`);
  });

  test("Calibration: Generates correct statistics report", () => {
    const expected = [1000, 1000, 1000];
    const measured = [990, 1005, 995];
    const report = generateCalibrationReport(expected, measured);
    
    assert(Math.abs(report.meanError - (-3.33)) < 0.1, `Expected mean error -3.33, got ${report.meanError}`);
    assert(report.repeatabilityCv > 0 && report.repeatabilityCv < 1, `CV should be small, got ${report.repeatabilityCv}%`);
  });

  test("Trajectory: Rising signal produces RISING classification", () => {
    const rising = generateSignal({ mode: "RISING", duration: 10, sampleRate: 10, amplitude: 0.5, noiseLevel: 0.001 });
    const features = extractFeatures(rising);
    assert(features.trajectory === "RISING", `Expected RISING, got ${features.trajectory}`);
  });

  test("Trajectory: Falling signal produces FALLING classification", () => {
    const falling = generateSignal({ mode: "FALLING", duration: 10, sampleRate: 10, amplitude: 0.5, noiseLevel: 0.001 });
    const features = extractFeatures(falling);
    assert(features.trajectory === "FALLING", `Expected FALLING, got ${features.trajectory}`);
  });

  test("Quality: Stable signal produces high quality score", () => {
    const stable = generateSignal({ mode: "STABLE", duration: 10, sampleRate: 10, noiseLevel: 0.001 });
    const features = extractFeatures(stable);
    assert(features.quality > 90, `Expected quality > 90 for STABLE signal, got ${features.quality}`);
  });

  test("Quality: Noisy signal produces lower quality score", () => {
    const noisy = generateSignal({ mode: "NOISY", duration: 10, sampleRate: 10, noiseLevel: 0.1 });
    const features = extractFeatures(noisy);
    assert(features.quality < 90, `Noisy quality should be lower, got ${features.quality}`);
  });

  test("Contact: Excessive noise flags CONTACT_BAD and anomaly", () => {
    // Extreme noise simulating a loose wire
    const extremeNoise = generateSignal({ mode: "NOISY", duration: 10, sampleRate: 10, noiseLevel: 2.0 });
    const features = extractFeatures(extremeNoise);
    assert(features.contact_status === "CONTACT_BAD", `Expected CONTACT_BAD, got ${features.contact_status}`);
    assert(features.anomaly === true, "Expected anomaly=true for bad contact");
    assert(features.quality === 0, "Expected quality=0 for bad contact");
  });

  test("Drift: Drifting signal flags MEDIUM or HIGH drift", () => {
    const drifting = generateSignal({ mode: "DRIFTING", duration: 10, sampleRate: 10, driftRate: 0.05, noiseLevel: 0.001 });
    const features = extractFeatures(drifting);
    assert(features.drift === "HIGH" || features.drift === "MEDIUM", `Expected drift HIGH or MEDIUM, got ${features.drift}`);
  });

  test("Full pipeline produces valid new SignalFeatures contract", () => {
    const demo = createDemoSignalRun("TRANSITION", { duration: 5, sampleRate: 10 });
    assert(demo.samples.length === 50, `Expected 50 samples`);
    
    const latest = demo.features[demo.features.length - 1];
    assert(typeof latest.filteredValue === "number", "Primary feature is extracted");
    assert(typeof latest.quality === "number", "Quality score exists");
    assert(typeof latest.trajectory === "string", "Trajectory classification exists");
    assert(typeof latest.contact_status === "string", "Contact status exists");
  });

  console.log("========================================================");
  console.log(`  RESULTS: ${passed} / ${total} TESTS PASSED`);
  console.log("========================================================\n");

  if (passed !== total) {
    process.exit(1);
  }
}

runAllTests();
