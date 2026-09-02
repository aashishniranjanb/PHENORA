import { ModelInfo } from "../types";

const REGISTRY: Record<string, ModelInfo> = {
  "UTI-IMPEDANCE-RF": {
    modelId: "UTI-IMPEDANCE-RF",
    version: "1.0.0-alpha",
    inputModality: "BULK_EIS",
    algorithm: "Random Forest Classifier",
    trainingDataset: "PHENORA-UTI-IMP-001",
    validationDataset: "PHENORA-UTI-CLIN-001",
    metrics: {
      auroc: 0.89,
      accuracy: 0.84,
      sensitivity: 0.88,
      specificity: 0.80,
      f1: 0.85
    },
    limitations: [
      "Research/engineering validation only",
      "Prediction depends on registered model domain",
      "Impedance phenotype does not independently establish clinical diagnosis"
    ],
    status: "EXPERIMENTAL"
  }
};

export function getModelInfo(modelId: string): ModelInfo {
  return REGISTRY[modelId] || REGISTRY["UTI-IMPEDANCE-RF"]; // Fallback
}
