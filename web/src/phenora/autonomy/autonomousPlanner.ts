import { 
  AutonomousDecisionResult, 
  AutonomyDecision, 
  DigitalTwinState, 
  MeasurementBudgetState, 
  MeasurementCandidate 
} from "../types";

export class AutonomousPlanner {
  
  public evaluate(
    twinState: DigitalTwinState,
    budget: MeasurementBudgetState
  ): AutonomousDecisionResult {
    
    const timestamp = Date.now();
    const diseaseUncertainty = twinState.uncertaintyMap.disease;
    
    // Check Budget First
    if (budget.measurementsDone >= budget.measurementsMax) {
      return this.createDecision(timestamp, "STOP", "Measurement budget exhausted", budget);
    }
    if (budget.elapsedMs >= budget.maxDurationMs) {
      return this.createDecision(timestamp, "STOP", "Maximum time budget exhausted", budget);
    }

    // 1. Are we confident enough to STOP?
    // In V1, "confident enough" means disease uncertainty is LOW and we have at least 3 measurements
    if (diseaseUncertainty === 'LOW' && budget.measurementsDone >= 3) {
      return this.createDecision(
        timestamp, 
        "STOP", 
        "Evidence is sufficient for the current measurement objective.", 
        budget,
        0, 0
      );
    }

    // 2. We need more information. Generate candidates.
    const candidates = this.generateCandidates();
    
    // Select best candidate (highest recommended)
    const selected = candidates.find(c => c.recommended) || candidates[0];

    return {
      timestamp,
      decision: "MEASURE_AGAIN",
      reason: "High model disagreement or uncertainty remains.",
      expectedInformationGain: selected.informationGain,
      expectedUncertaintyReduction: selected.uncertaintyReduction,
      selectedMeasurement: selected,
      alternatives: candidates.filter(c => c !== selected),
      budget,
      provenance: "PREDICTED"
    };
  }

  private createDecision(
    timestamp: number, 
    decision: AutonomyDecision, 
    reason: string, 
    budget: MeasurementBudgetState,
    infoGain = 0,
    uncertRed = 0
  ): AutonomousDecisionResult {
    return {
      timestamp,
      decision,
      reason,
      expectedInformationGain: infoGain,
      expectedUncertaintyReduction: uncertRed,
      alternatives: [],
      budget,
      provenance: "PREDICTED"
    };
  }

  private generateCandidates(): MeasurementCandidate[] {
    return [
      {
        frequency: 10000,
        duration: 2,
        informationGain: 0.42,
        uncertaintyReduction: 18,
        cost: "LOW",
        feasible: true,
        recommended: true,
        reason: "Highest expected information gain for current phenotype uncertainty."
      },
      {
        frequency: 40000,
        duration: 2,
        informationGain: 0.31,
        uncertaintyReduction: 12,
        cost: "LOW",
        feasible: true,
        recommended: false,
        reason: "Alternative frequency providing secondary structural information."
      },
      {
        frequency: -1, // Special flag for full scan
        duration: 15,
        informationGain: 0.51,
        uncertaintyReduction: 23,
        cost: "HIGH",
        feasible: true,
        recommended: false,
        reason: "Complete spectral update. High time cost."
      }
    ];
  }
}
