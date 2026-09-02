import { ImpedancePoint, ImpedanceSpectrum } from "../types";

export function createEmptySpectrum(): ImpedanceSpectrum {
  return {
    timestamp: Date.now(),
    points: [],
    frequencyRange: { min: 0, max: 0 },
    numPoints: 0,
    overallQuality: 0,
    calibrationId: "NONE",
    provenance: "MEASURED"
  };
}

export function validateSpectrum(spectrum: ImpedanceSpectrum): boolean {
  if (!spectrum || !spectrum.points || spectrum.points.length === 0) {
    return false;
  }
  return spectrum.overallQuality >= 50;
}

export function aggregateSpectrumQuality(points: ImpedancePoint[]): number {
  if (points.length === 0) return 0;
  const sum = points.reduce((acc, p) => acc + p.quality, 0);
  return Math.round(sum / points.length);
}
