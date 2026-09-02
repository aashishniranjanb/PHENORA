/**
 * PHENORA Flash — Canonical Data Contracts
 *
 * Provenance hierarchy (never collapse):
 *   MEASURED → DERIVED → FITTED → INFERRED → PREDICTED
 *
 * These types define the single source of truth for the entire pipeline.
 * The UI consumes these; it does NOT independently calculate any scientific value.
 */

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

export type ProvenanceLevel =
  | 'MEASURED'
  | 'DERIVED'
  | 'FITTED'
  | 'INFERRED'
  | 'PREDICTED';

export type FeatureStatus =
  | 'RAW_DIRECT'
  | 'DERIVED'
  | 'MODEL_INFERRED'
  | 'REQUIRES_SPECTRUM'
  | 'REQUIRES_TIME_SERIES'
  | 'NOT_AVAILABLE'
  | 'INSUFFICIENT_DATA'
  | 'SIMULATION';

export type SampleType =
  | 'URINE'
  | 'BLOOD'
  | 'SERUM'
  | 'PLASMA'
  | 'CONTROL'
  | 'CUSTOM';

export type RunMode =
  | 'SIMULATION'
  | 'HARDWARE'
  | 'RESEARCH'
  | 'ENGINEERING_VALIDATION';

export type StageId =
  | 'SAMPLE'
  | 'ACQUISITION'
  | 'IMPEDANCE'
  | 'PHENOTYPE'
  | 'DISEASE'
  | 'TWIN'
  | 'FORECAST'
  | 'AUTONOMY'
  | 'RESULT';

export type StageState =
  | 'LOCKED'
  | 'READY'
  | 'ACTIVE'
  | 'PROCESSING'
  | 'COMPLETE'
  | 'WARNING'
  | 'UNCERTAIN'
  | 'FAILED'
  | 'SKIPPED';

export type ViewMode =
  | 'OPERATOR'
  | 'SCIENTIFIC'
  | 'ENGINEERING';

export type PipelinePhase =
  | 'IDLE'
  | 'SAMPLE_READY'
  | 'INITIALIZING'
  | 'ACQUIRING'
  | 'PROCESSING'
  | 'PHENOTYPING'
  | 'DISEASE_ANALYSIS'
  | 'TWIN_UPDATE'
  | 'FORECASTING'
  | 'AUTONOMOUS_EVALUATION'
  | 'COMPLETE'
  | 'ERROR';

export type AutonomyDecision =
  | 'STOP'
  | 'MEASURE_AGAIN'
  | 'CHANGE_FREQUENCY'
  | 'EXTEND_MEASUREMENT'
  | 'INSUFFICIENT_DATA'
  | 'ERROR';

export type PredictionStatus =
  | 'SUPPORTED'
  | 'LOW_CONFIDENCE'
  | 'UNKNOWN'
  | 'OUT_OF_DISTRIBUTION'
  | 'NOT_AVAILABLE'
  | 'SIMULATION_OUTPUT';

export type ForecastStatus =
  | 'READY'
  | 'INSUFFICIENT_HISTORY'
  | 'LOW_CONFIDENCE'
  | 'UNSTABLE'
  | 'OUT_OF_DOMAIN';

export type DatasetAccess =
  | 'AVAILABLE'
  | 'ACCESS_REQUIRED'
  | 'NOT_AVAILABLE';

export type DataModality =
  | 'BULK_EIS'
  | 'IMPEDANCE_CYTOMETRY'
  | 'REAL_CLINICAL'
  | 'AUXILIARY_BIOLOGICAL'
  | 'SIMULATED_PAIRED';

export type SimulationScenario =
  | 'STABLE'
  | 'RISING'
  | 'FALLING'
  | 'NOISY'
  | 'DRIFTING'
  | 'TRANSITION'
  | 'ANOMALY'
  | 'RECOVERY'
  | 'OOD'
  | 'TIMEOUT';

// ============================================================================
// 1. SAMPLE
// ============================================================================

export interface SampleMetadata {
  sampleId: string;
  sampleType: SampleType;
  protocol: string;
  volume?: number;        // µL
  environment?: number;   // °C
  device: string;
  calibrationId: string;
  timestamp: number;
}

// ============================================================================
// 2. IMPEDANCE MEASUREMENT
// ============================================================================

/** A single impedance measurement at one frequency and one time point */
export interface ImpedancePoint {
  frequency: number;      // Hz
  zReal: number;          // Ω (Z')
  zImag: number;          // Ω (Z'')
  magnitude: number;      // |Z| Ω
  phase: number;          // degrees
  time: number;           // ms since run start
  quality: number;        // 0–100
  provenance: ProvenanceLevel;
}

/** Full impedance spectrum at a single time point */
export interface ImpedanceSpectrum {
  timestamp: number;
  points: ImpedancePoint[];
  frequencyRange: { min: number; max: number };
  numPoints: number;
  overallQuality: number;
  calibrationId: string;
  provenance: ProvenanceLevel;
}

/** Acquisition result for the measurement stage */
export interface AcquisitionResult {
  runId: string;
  measurementIndex: number;
  totalMeasurements: number;
  elapsedMs: number;
  spectrum: ImpedanceSpectrum;
  signalQuality: number;
  noise: number;
  drift: number;
  status: 'COMPLETE' | 'IN_PROGRESS' | 'ERROR';
}

// ============================================================================
// 3. SPECTRAL ANALYSIS
// ============================================================================

export interface BodeData {
  frequencies: number[];      // Hz
  magnitudes: number[];       // |Z| Ω
  phases: number[];           // degrees
  logFrequencies: number[];   // log10(f)
  status: FeatureStatus;
}

export interface NyquistData {
  zReal: number[];            // Z' Ω
  zImagNeg: number[];         // -Z'' Ω (convention: positive upward)
  arcDiameter?: number;       // Ω
  peakFrequency?: number;     // Hz
  curveQuality: number;       // 0–100
  status: FeatureStatus;
}

export interface TemporalImpedanceData {
  timestamps: number[];
  impedance: number[];        // |Z| at reference frequency
  deltaZ: number[];           // ΔZ from baseline
  relativeChange: number[];   // ΔZ/Z_baseline (fraction)
  baseline: number;           // Baseline |Z|
  baselineTime: number;
  referenceFrequency: number;
  status: FeatureStatus;
}

export interface FFTAnalysisData {
  frequencies: number[];      // Hz (frequency bins)
  amplitudes: number[];       // Amplitude spectrum
  fundamental?: number;       // Hz
  harmonics: Array<{ order: number; frequency: number; amplitudeDb: number }>;
  signalIntegrity: 'GOOD' | 'WARNING' | 'POOR';
  status: FeatureStatus;
}

export interface CircuitFitData {
  rs?: number;                // Ω — solution resistance
  rct?: number;               // Ω — charge transfer resistance
  cdl?: number;               // F — double-layer capacitance
  warburg?: number;           // Ω·s^(-1/2)
  cpe?: { q: number; n: number };
  fitRmse: number;            // % RMSE
  fitStatus: 'VALID' | 'POOR_FIT' | 'UNAVAILABLE';
  status: FeatureStatus;
}

// ============================================================================
// 4. IMPEDANCE PHENOTYPE
// ============================================================================

export interface PhenotypeFeature {
  name: string;
  value: number | string;
  unit: string;
  source: string;
  calculation: string;
  status: FeatureStatus;
  provenance: ProvenanceLevel;
  version: string;
}

export interface ImpedancePhenotype {
  timestamp: number;

  spectral: PhenotypeFeature[];
  resistive: PhenotypeFeature[];
  reactive: PhenotypeFeature[];
  temporal: PhenotypeFeature[];
  quality: PhenotypeFeature[];

  referenceDistance: number;        // distance from known reference phenotypes
  embeddingVector?: number[];       // optional latent embedding
  oodScore: number;                 // 0–100 (higher = more OOD)

  overallConfidence: number;        // 0–100
  status: FeatureStatus;
  provenance: ProvenanceLevel;
}

// ============================================================================
// 5. DISEASE INTELLIGENCE
// ============================================================================

export interface DiseasePrediction {
  condition: string;                // e.g. "UTI-associated phenotype"
  probability: number;              // 0–1 model output probability
  confidence: number;               // 0–100
  uncertainty: number;              // 0–100
  oodScore: number;                 // 0–100
  status: PredictionStatus;
  provenance: ProvenanceLevel;
}

export interface ConfidenceDecomposition {
  signalQuality: number;
  phenotypeConsistency: number;
  modelAgreement: number;
  temporalEvidence: number;
  referenceSimilarity: number;
  oodPenalty: number;
  final: number;
}

export interface DiseaseEvidence {
  rank: number;
  description: string;
  observedValue: string;
  contribution: 'HIGH' | 'MEDIUM' | 'LOW' | 'SUPPORTING';
}

export interface ModelInfo {
  modelId: string;
  version: string;
  inputModality: DataModality;
  algorithm: string;
  trainingDataset: string;
  validationDataset: string;
  metrics: {
    auroc?: number;
    accuracy?: number;
    sensitivity?: number;
    specificity?: number;
    f1?: number;
  };
  limitations: string[];
  status: 'EXPERIMENTAL' | 'RULE_BASED' | 'PROTOTYPE' | 'VALIDATED';
}

export interface DiseaseIntelligenceResult {
  timestamp: number;
  primary: DiseasePrediction;
  alternatives: DiseasePrediction[];
  confidenceDecomposition: ConfidenceDecomposition;
  evidence: DiseaseEvidence[];
  modelInfo: ModelInfo;
  modelAgreement: 'HIGH' | 'MODERATE' | 'LOW' | 'SINGLE_MODEL';
  provenance: ProvenanceLevel;
}

// ============================================================================
// 6. TWIN
// ============================================================================

export interface TwinVariable {
  name: string;
  value: number | string;
  unit: string;
  confidence: number;              // 0–100
  uncertainty?: number;            // 0–100
  category: 'OBSERVED' | 'INFERRED' | 'PREDICTED';
  provenance: ProvenanceLevel;
}

export interface DigitalTwinState {
  twinId: string;
  sampleId: string;
  status: 'ACTIVE' | 'STALE' | 'INVALID';
  lastUpdateTimestamp: number;
  updateSequence: number;

  observed: TwinVariable[];
  inferred: TwinVariable[];
  predicted: TwinVariable[];

  uncertaintyMap: {
    signal: 'LOW' | 'MEDIUM' | 'HIGH';
    phenotype: 'LOW' | 'MEDIUM' | 'HIGH';
    disease: 'LOW' | 'MEDIUM' | 'HIGH';
    forecast: 'LOW' | 'MEDIUM' | 'HIGH';
    overall: 'LOW' | 'MEDIUM' | 'HIGH';
  };

  history: Array<{
    timestamp: number;
    snapshot: { observed: TwinVariable[]; inferred: TwinVariable[] };
  }>;

  provenance: ProvenanceLevel;
}

// ============================================================================
// 7. FORECAST
// ============================================================================

export interface ForecastPoint {
  horizon: number;                  // minutes from now
  prediction: number;
  lowerBound: number;
  upperBound: number;
  confidence: number;               // 0–100
  uncertainty: number;              // 0–100
}

export interface PredictiveForecast {
  timestamp: number;
  modelId: string;
  version: string;

  impedanceForecast: ForecastPoint[];
  phenotypeForecast: ForecastPoint[];
  diseaseStateForecast: ForecastPoint[];

  historyLength: number;
  status: ForecastStatus;
  provenance: ProvenanceLevel;
}

// ============================================================================
// 8. AUTONOMOUS MEASUREMENT
// ============================================================================

export interface MeasurementCandidate {
  frequency: number;                // Hz
  duration: number;                 // seconds
  informationGain: number;          // 0–1
  uncertaintyReduction: number;     // 0–1 (fraction)
  cost: 'LOW' | 'MEDIUM' | 'HIGH';
  feasible: boolean;
  recommended: boolean;
  reason: string;
}

export interface MeasurementBudgetState {
  measurementsDone: number;
  measurementsMax: number;
  elapsedMs: number;
  maxDurationMs: number;
  retriesDone: number;
  retriesMax: number;
}

export interface AutonomousDecisionResult {
  timestamp: number;
  decision: AutonomyDecision;
  reason: string;
  expectedInformationGain: number;
  expectedUncertaintyReduction: number;
  selectedMeasurement?: MeasurementCandidate;
  alternatives: MeasurementCandidate[];
  budget: MeasurementBudgetState;
  provenance: ProvenanceLevel;
}

// ============================================================================
// 9. RUN & RESULT
// ============================================================================

export interface RunProvenance {
  runId: string;
  startTimestamp: number;
  endTimestamp?: number;
  device: string;
  calibrationId: string;
  protocol: string;
  preprocessingVersion: string;
  phenotypeVersion: string;
  modelId: string;
  modelVersion: string;
  trainingDataset: string;
  validationDataset: string;
  softwareVersion: string;
  mode: RunMode;
}

export interface ResultValidity {
  valid: boolean;
  level: 'RESEARCH_USE' | 'ENGINEERING_VALIDATION' | 'SIMULATION' | 'INVALID';
  limitations: string[];
}

export interface PhenoraRun {
  runId: string;
  phase: PipelinePhase;
  measurementCycle: number;       // increments on MEASURE_AGAIN loops
  stages: Record<StageId, StageState>;
  startTimestamp: number;
  mode: RunMode;
  simulation?: {
    enabled: boolean;
    scenario: SimulationScenario;
  };
}

/** The canonical final result — THE backend source of truth consumed by UI */
export interface PhenoraFlashResult {
  run: PhenoraRun;
  sample: SampleMetadata;
  acquisition: AcquisitionResult;
  spectrum: ImpedanceSpectrum;
  bode: BodeData;
  nyquist: NyquistData;
  temporal: TemporalImpedanceData;
  fft: FFTAnalysisData;
  circuitFit: CircuitFitData;
  phenotype: ImpedancePhenotype;
  diseaseIntelligence: DiseaseIntelligenceResult;
  digitalTwin: DigitalTwinState;
  forecast: PredictiveForecast;
  autonomousDecision: AutonomousDecisionResult;
  validity: ResultValidity;
  provenance: RunProvenance;
}

// ============================================================================
// 10. UI STATE
// ============================================================================

export interface UIExperimentState {
  run: PhenoraRun | null;
  result: PhenoraFlashResult | null;
  activeStage: StageId;
  viewMode: ViewMode;
  simulation: {
    enabled: boolean;
    scenario: SimulationScenario;
  };
  connection: {
    backend: boolean;
    device: boolean;
    fpga: boolean;
    adc: boolean;
  };
}

// ============================================================================
// 11. RUNTIME EVENTS
// ============================================================================

export type RuntimeEventType =
  | 'RUN_STARTED'
  | 'MEASUREMENT_STARTED'
  | 'MEASUREMENT_COMPLETED'
  | 'SPECTRUM_UPDATED'
  | 'PHENOTYPE_UPDATED'
  | 'DISEASE_ANALYSIS_COMPLETED'
  | 'TWIN_UPDATED'
  | 'FORECAST_UPDATED'
  | 'AUTONOMOUS_DECISION_READY'
  | 'MEASURE_AGAIN_REQUESTED'
  | 'RUN_COMPLETED'
  | 'RUN_ERROR';

export interface RuntimeEvent {
  type: RuntimeEventType;
  timestamp: number;
  runId: string;
  phase: PipelinePhase;
  data?: Partial<PhenoraFlashResult>;
  error?: string;
}
