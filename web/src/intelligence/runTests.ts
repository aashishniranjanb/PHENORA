import { runAllIntelligenceTests } from "./__tests__/intelligenceProcessor.test";

try {
  runAllIntelligenceTests();
  process.exit(0);
} catch (err) {
  console.error("TEST FAILED:", err);
  process.exit(1);
}
