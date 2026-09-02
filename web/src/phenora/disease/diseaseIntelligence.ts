import { DiseaseIntelligenceResult, ImpedancePhenotype, PredictionStatus } from "../types";
import { getModelInfo } from "./modelRegistry";
import { calculateOODScore } from "./oodDetector";

export class DiseaseIntelligenceEngine {
  
  public analyzePhenotype(phenotype: ImpedancePhenotype): DiseaseIntelligenceResult {
    const timestamp = phenotype.timestamp;
    
    // 1. Get Model Info
    const modelInfo = getModelInfo("UTI-IMPEDANCE-RF"); // Default for V1

    // 2. OOD Detection
    const oodScore = calculateOODScore(phenotype);
    
    // 3. Simple Rule-Based / Mock ML Prediction for V1
    let probability = 0;
    let confidence = 0;
    let uncertainty = 100;
    let status: PredictionStatus = "UNKNOWN";

    const temporalTrend = phenotype.temporal.find(f => f.name === "temporalTrend")?.value;
    const overallQuality = phenotype.quality.find(f => f.name === "overallQuality")?.value as number || 0;

    if (oodScore > 50) {
      status = "OUT_OF_DISTRIBUTION";
      probability = 0.5; // Unsure
      confidence = 10;
      uncertainty = 90;
    } else if (temporalTrend === "FALLING") {
      // Characteristic of certain metabolic inhibitions or lysis
      status = "SUPPORTED";
      probability = 0.85;
      confidence = Math.min(overallQuality, 85); // Cap confidence by quality
      uncertainty = 100 - confidence;
    } else if (temporalTrend === "RISING") {
      status = "SUPPORTED";
      probability = 0.72;
      confidence = Math.min(overallQuality, 75);
      uncertainty = 100 - confidence;
    } else {
      status = "LOW_CONFIDENCE";
      probability = 0.45;
      confidence = 30;
      uncertainty = 70;
    }

    // 4. Construct Result
    return {
      timestamp,
      primary: {
        condition: "UTI-associated phenotype",
        probability,
        confidence,
        uncertainty,
        oodScore,
        status,
        provenance: "PREDICTED"
      },
      alternatives: [
        {
          condition: "Bacteriuria-associated phenotype",
          probability: probability * 0.8,
          confidence: confidence * 0.8,
          uncertainty: 100 - (confidence * 0.8),
          oodScore,
          status: "SUPPORTED",
          provenance: "PREDICTED"
        },
        {
          condition: "Non-infectious urinary phenotype",
          probability: 1 - probability, // Complement
          confidence: 20,
          uncertainty: 80,
          oodScore,
          status: "LOW_CONFIDENCE",
          provenance: "PREDICTED"
        }
      ],
      confidenceDecomposition: {
        signalQuality: Math.round(overallQuality * 0.2),
        phenotypeConsistency: 20,
        modelAgreement: 15,
        temporalEvidence: temporalTrend ? 25 : 5,
        referenceSimilarity: 10,
        oodPenalty: Math.round(oodScore * -0.5),
        final: confidence
      },
      evidence: [
        {
          rank: 1,
          description: "Temporal impedance trajectory",
          observedValue: temporalTrend ? String(temporalTrend) : "UNKNOWN",
          contribution: "HIGH"
        },
        {
          rank: 2,
          description: "Signal quality",
          observedValue: `${overallQuality}/100`,
          contribution: "SUPPORTING"
        }
      ],
      modelInfo,
      modelAgreement: "MODERATE",
      provenance: "PREDICTED"
    };
  }
}
