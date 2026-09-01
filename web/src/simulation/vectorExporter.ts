/**
 * Vector Exporter for Person C (FPGA Testing)
 */
import * as fs from "fs";
import * as path from "path";
import { createDemoSignalRun, SignalMode } from "../signal";

function exportVectors(mode: SignalMode, filename: string) {
  const demo = createDemoSignalRun(mode, { duration: 10, sampleRate: 10 });
  
  // We only export the features, which is what Person C expects
  const data = JSON.stringify(demo.features, null, 2);
  
  const outDir = path.join(process.cwd(), "test_vectors");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  
  const outPath = path.join(outDir, filename);
  fs.writeFileSync(outPath, data);
  console.log(`✅ Exported ${filename} (${demo.features.length} packets)`);
}

function runExports() {
  console.log("\n========================================================");
  console.log("  GENERATING FPGA TEST VECTORS (Person C) ");
  console.log("========================================================\n");
  
  exportVectors("STABLE", "stable_features.json");
  exportVectors("RISING", "rising_features.json");
  exportVectors("FALLING", "falling_features.json");
  exportVectors("NOISY", "noisy_features.json");
  exportVectors("TRANSITION", "transition_features.json");
  exportVectors("ANOMALY", "anomaly_features.json");
  
  console.log("\nDone.\n");
}

runExports();
