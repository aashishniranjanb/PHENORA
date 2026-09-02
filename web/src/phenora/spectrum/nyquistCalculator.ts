import { ImpedanceSpectrum, NyquistData } from "../types";

export function calculateNyquist(spectrum: ImpedanceSpectrum): NyquistData {
  if (!spectrum || spectrum.points.length === 0) {
    return {
      zReal: [],
      zImagNeg: [],
      curveQuality: 0,
      status: "INSUFFICIENT_DATA"
    };
  }

  const zReal = spectrum.points.map(p => p.zReal);
  const zImagNeg = spectrum.points.map(p => -p.zImag);

  // Basic curve quality estimation (placeholder for more complex logic)
  const curveQuality = spectrum.overallQuality; 

  return {
    zReal,
    zImagNeg,
    curveQuality,
    status: "DERIVED"
  };
}
