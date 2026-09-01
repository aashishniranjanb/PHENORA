// ============================================================================
// PHENORA Quality Analyzer Unit Tests (PERSON B)
// ============================================================================

import { QualityAnalyzer } from "../quality/qualityAnalyzer";
import { SignalFeatures } from "../intelligenceTypes";

describe("QualityAnalyzer", () => {
  const analyzer = new QualityAnalyzer();

  const mockCleanSignal: SignalFeatures = {
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
    drift: 0.001,
  };

  it("should score clean high SNR signal above 80", () => {
    const res = analyzer.analyze(mockCleanSignal, 5);
    expect(res.qualityScore).toBeGreaterThanOrEqual(80);
    expect(res.isUsable).toBe(true);
  });

  it("should penalize low SNR signals", () => {
    const lowSnrSignal: SignalFeatures = { ...mockCleanSignal, snr: 8 };
    const res = analyzer.analyze(lowSnrSignal, 5);
    expect(res.snrContribution).toBeLessThanOrEqual(10);
    expect(res.notes).toContain("SNR Critical (<10 dB)");
  });

  it("should penalize high drift signals", () => {
    const highDriftSignal: SignalFeatures = { ...mockCleanSignal, drift: 0.15 };
    const res = analyzer.analyze(highDriftSignal, 5);
    expect(res.driftContribution).toBeLessThanOrEqual(10);
    expect(res.notes).toContain("High instrument/environmental drift detected");
  });
});
