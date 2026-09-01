/**
 * Signal Feature Selection Module
 * 
 * Supports the evaluation of complex impedance inputs (e.g. from AD5933)
 * to automatically determine the most stable and separated feature 
 * (|Z|, Phase, Real, Imaginary, or Rct proxy).
 */

export type FeatureType = "MAGNITUDE" | "PHASE" | "REAL" | "IMAGINARY";

export interface ComplexSample {
  real: number;
  imaginary: number;
}

/**
 * Extracts a specific mathematical feature from a complex sample.
 */
export function extractComplexFeature(sample: ComplexSample, featureType: FeatureType): number {
  switch (featureType) {
    case "MAGNITUDE":
      return Math.sqrt(sample.real * sample.real + sample.imaginary * sample.imaginary);
    
    case "PHASE":
      return Math.atan2(sample.imaginary, sample.real);
      
    case "REAL":
      return sample.real;
      
    case "IMAGINARY":
      return sample.imaginary;
  }
}

/**
 * Normalizes an array of complex measurements into an array of scalar values
 * based on the selected feature type.
 */
export function processComplexWindow(samples: ComplexSample[], featureType: FeatureType): number[] {
  return samples.map(s => extractComplexFeature(s, featureType));
}
