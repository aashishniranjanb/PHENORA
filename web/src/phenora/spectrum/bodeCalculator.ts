import { BodeData, ImpedanceSpectrum } from "../types";

export function calculateBode(spectrum: ImpedanceSpectrum): BodeData {
  if (!spectrum || spectrum.points.length === 0) {
    return {
      frequencies: [],
      magnitudes: [],
      phases: [],
      logFrequencies: [],
      status: "INSUFFICIENT_DATA"
    };
  }

  // Sort by frequency ascending
  const sortedPoints = [...spectrum.points].sort((a, b) => a.frequency - b.frequency);

  const frequencies = sortedPoints.map(p => p.frequency);
  const magnitudes = sortedPoints.map(p => p.magnitude);
  const phases = sortedPoints.map(p => p.phase);
  const logFrequencies = frequencies.map(f => Math.log10(f));

  return {
    frequencies,
    magnitudes,
    phases,
    logFrequencies,
    status: "DERIVED"
  };
}
