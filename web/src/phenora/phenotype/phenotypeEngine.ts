import { ImpedancePhenotype, ImpedanceSpectrum, PhenotypeFeature, TemporalImpedanceData } from "../types";
import { createFeature } from "./featureProvenance";

export class PhenotypeEngine {
  private version = "1.0.0-alpha";

  public calculatePhenotype(
    spectrum: ImpedanceSpectrum, 
    temporal: TemporalImpedanceData
  ): ImpedancePhenotype {
    
    const timestamp = spectrum.timestamp;
    
    // Spectral features
    const spectral: PhenotypeFeature[] = [];
    if (spectrum.points.length > 0) {
      // Sort points by frequency
      const sorted = [...spectrum.points].sort((a, b) => a.frequency - b.frequency);
      const lowFreq = sorted[0];
      const highFreq = sorted[sorted.length - 1];

      spectral.push(createFeature(
        "highFrequencyMagnitude", highFreq.magnitude, "Ω", "ImpedanceSpectrum", 
        "max(frequency)", "DERIVED", this.version
      ));
      
      spectral.push(createFeature(
        "lowFrequencyMagnitude", lowFreq.magnitude, "Ω", "ImpedanceSpectrum", 
        "min(frequency)", "DERIVED", this.version
      ));

      // Estimate slope
      if (sorted.length > 1) {
        const dMag = highFreq.magnitude - lowFreq.magnitude;
        const dLogF = Math.log10(highFreq.frequency) - Math.log10(lowFreq.frequency);
        const slope = dLogF !== 0 ? dMag / dLogF : 0;
        spectral.push(createFeature(
          "spectralSlope", Number(slope.toFixed(3)), "", "ImpedanceSpectrum", 
          "d|Z|/dLog(f)", "DERIVED", this.version
        ));
      }
    }

    // Resistive features
    const resistive: PhenotypeFeature[] = [];
    if (spectrum.points.length > 0) {
      const sorted = [...spectrum.points].sort((a, b) => a.frequency - b.frequency);
      const lowFreq = sorted[0];
      const highFreq = sorted[sorted.length - 1];
      
      resistive.push(createFeature(
        "highFrequencyResistance", highFreq.zReal, "Ω", "ImpedanceSpectrum", 
        "Z'(max(f))", "DERIVED", this.version
      ));
      resistive.push(createFeature(
        "lowFrequencyResistance", lowFreq.zReal, "Ω", "ImpedanceSpectrum", 
        "Z'(min(f))", "DERIVED", this.version
      ));
    }

    // Reactive features (Placeholder for now)
    const reactive: PhenotypeFeature[] = [];
    
    // Temporal features
    const temporalFeatures: PhenotypeFeature[] = [];
    if (temporal.deltaZ.length > 0) {
      const currentDeltaZ = temporal.deltaZ[temporal.deltaZ.length - 1];
      temporalFeatures.push(createFeature(
        "currentDeltaZ", currentDeltaZ, "Ω", "TemporalImpedanceData", 
        "Z(t) - Z(0)", "DERIVED", this.version
      ));

      // Calculate recent slope if we have enough points
      if (temporal.deltaZ.length > 5) {
         const recent = temporal.deltaZ.slice(-5);
         const dt = (temporal.timestamps[temporal.timestamps.length - 1] - temporal.timestamps[temporal.timestamps.length - 5]) / 1000 / 60; // mins
         const dz = recent[4] - recent[0];
         const slope = dt > 0 ? dz / dt : 0;
         
         let trend = "STABLE";
         if (slope > 0.5) trend = "RISING";
         if (slope < -0.5) trend = "FALLING";

         temporalFeatures.push(createFeature(
          "temporalTrend", trend, "", "TemporalImpedanceData", 
          "Linear regression over last 5 points", "MODEL_INFERRED", this.version
         ));
      }
    }

    // Quality features
    const quality: PhenotypeFeature[] = [
      createFeature(
        "overallQuality", spectrum.overallQuality, "/100", "ImpedanceSpectrum", 
        "Aggregated point quality", "DERIVED", this.version
      )
    ];

    return {
      timestamp,
      spectral,
      resistive,
      reactive,
      temporal: temporalFeatures,
      quality,
      referenceDistance: 0.5, // Placeholder
      oodScore: 10,           // Placeholder
      overallConfidence: spectrum.overallQuality > 80 ? 90 : 60,
      status: "DERIVED",
      provenance: "DERIVED"
    };
  }
}
