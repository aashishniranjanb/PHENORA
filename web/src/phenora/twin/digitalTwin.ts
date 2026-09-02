import { 
  DigitalTwinState, 
  DiseaseIntelligenceResult, 
  ImpedancePhenotype, 
  ImpedanceSpectrum, 
  TwinVariable 
} from "../types";

export class DigitalTwinEngine {
  private state: DigitalTwinState | null = null;
  private historyMax = 50;

  public initialize(sampleId: string): DigitalTwinState {
    this.state = {
      twinId: `TWIN-${sampleId}`,
      sampleId,
      status: "ACTIVE",
      lastUpdateTimestamp: Date.now(),
      updateSequence: 0,
      observed: [],
      inferred: [],
      predicted: [],
      uncertaintyMap: {
        signal: 'LOW',
        phenotype: 'LOW',
        disease: 'LOW',
        forecast: 'LOW',
        overall: 'LOW'
      },
      history: [],
      provenance: "INFERRED"
    };
    return this.state;
  }

  public updateState(
    spectrum: ImpedanceSpectrum,
    phenotype: ImpedancePhenotype,
    disease: DiseaseIntelligenceResult
  ): DigitalTwinState {
    if (!this.state) {
      throw new Error("Twin not initialized");
    }

    const timestamp = Date.now();

    // 1. Observed variables
    const observed: TwinVariable[] = [
      {
        name: "Low-Frequency |Z|",
        value: spectrum.points[0]?.magnitude || 0,
        unit: "Ω",
        confidence: spectrum.overallQuality,
        category: "OBSERVED",
        provenance: "MEASURED"
      },
      {
        name: "High-Frequency |Z|",
        value: spectrum.points[spectrum.points.length - 1]?.magnitude || 0,
        unit: "Ω",
        confidence: spectrum.overallQuality,
        category: "OBSERVED",
        provenance: "MEASURED"
      },
      {
        name: "Quality",
        value: spectrum.overallQuality,
        unit: "/100",
        confidence: 100,
        category: "OBSERVED",
        provenance: "MEASURED"
      }
    ];

    // 2. Inferred variables
    const inferred: TwinVariable[] = [
      {
        name: "Phenotype Trend",
        value: phenotype.temporal.find(f => f.name === "temporalTrend")?.value || "UNKNOWN",
        unit: "",
        confidence: phenotype.overallConfidence,
        category: "INFERRED",
        provenance: "INFERRED"
      },
      {
        name: "Primary Condition",
        value: disease.primary.condition,
        unit: "",
        confidence: disease.primary.confidence,
        uncertainty: disease.primary.uncertainty,
        category: "INFERRED",
        provenance: "INFERRED"
      }
    ];

    // Map uncertainty levels
    const getLevel = (u: number) => u > 50 ? 'HIGH' : u > 20 ? 'MEDIUM' : 'LOW';

    this.state.observed = observed;
    this.state.inferred = inferred;
    this.state.updateSequence += 1;
    this.state.lastUpdateTimestamp = timestamp;
    this.state.uncertaintyMap = {
      signal: getLevel(100 - spectrum.overallQuality),
      phenotype: getLevel(100 - phenotype.overallConfidence),
      disease: getLevel(disease.primary.uncertainty),
      forecast: 'HIGH', // Until forecast runs
      overall: getLevel((100 - spectrum.overallQuality + 100 - phenotype.overallConfidence + disease.primary.uncertainty) / 3)
    };

    // Store snapshot
    this.state.history.push({
      timestamp,
      snapshot: { observed, inferred }
    });

    if (this.state.history.length > this.historyMax) {
      this.state.history.shift();
    }

    return this.state;
  }

  public getState(): DigitalTwinState | null {
    return this.state;
  }
}
