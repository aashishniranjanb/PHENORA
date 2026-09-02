import { ImpedancePhenotype } from "../types";

export function calculateOODScore(phenotype: ImpedancePhenotype): number {
  // In a real system, this would be a Mahalanobis distance, Isolation Forest, 
  // or deep ensemble uncertainty metric.
  // For V1, we compute a simple heuristic based on quality and completeness.

  const qualityFeature = phenotype.quality.find(f => f.name === "overallQuality");
  const quality = qualityFeature ? (qualityFeature.value as number) : 50;

  // 0 is perfectly in-distribution, 100 is completely out-of-distribution
  let oodScore = 100 - quality; 
  
  // Hard cap to 0-100
  oodScore = Math.max(0, Math.min(100, oodScore));
  
  return oodScore;
}
