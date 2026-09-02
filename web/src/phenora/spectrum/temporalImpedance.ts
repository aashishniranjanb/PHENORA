import { TemporalImpedanceData, ImpedanceSpectrum } from "../types";

export function calculateTemporalImpedance(
  spectraHistory: ImpedanceSpectrum[], 
  referenceFrequency: number = 10000 // default 10kHz
): TemporalImpedanceData {
  
  if (!spectraHistory || spectraHistory.length === 0) {
    return {
      timestamps: [],
      impedance: [],
      deltaZ: [],
      relativeChange: [],
      baseline: 0,
      baselineTime: 0,
      referenceFrequency,
      status: "INSUFFICIENT_DATA"
    };
  }

  const timestamps: number[] = [];
  const impedance: number[] = [];
  
  // Find baseline (first valid point at reference frequency)
  let baseline = 0;
  let baselineTime = 0;
  let baselineSet = false;

  for (const spectrum of spectraHistory) {
      // Find closest point to reference frequency
      if (spectrum.points.length === 0) continue;
      
      let closestPoint = spectrum.points[0];
      let minDiff = Math.abs(closestPoint.frequency - referenceFrequency);
      
      for (let i = 1; i < spectrum.points.length; i++) {
          const diff = Math.abs(spectrum.points[i].frequency - referenceFrequency);
          if (diff < minDiff) {
              minDiff = diff;
              closestPoint = spectrum.points[i];
          }
      }
      
      timestamps.push(spectrum.timestamp);
      impedance.push(closestPoint.magnitude);
      
      if (!baselineSet) {
          baseline = closestPoint.magnitude;
          baselineTime = spectrum.timestamp;
          baselineSet = true;
      }
  }

  const deltaZ = impedance.map(z => z - baseline);
  const relativeChange = impedance.map(z => baseline !== 0 ? (z - baseline) / baseline : 0);

  return {
    timestamps,
    impedance,
    deltaZ,
    relativeChange,
    baseline,
    baselineTime,
    referenceFrequency,
    status: "DERIVED"
  };
}
