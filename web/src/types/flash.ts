export type DataSource = 'SYNTHETIC' | 'HARDWARE';

export type DecisionType =
  | 'REPORT_SINGLE'
  | 'REPORT_SET'
  | 'ABSTAIN_QC'
  | 'ABSTAIN_OUT_OF_DISTRIBUTION'
  | 'ABSTAIN_UNRESOLVED';

export type SusceptibilityCall = 'SUSCEPTIBLE' | 'INTERMEDIATE' | 'RESISTANT';

export interface FlashRunMeta {
  schemaVersion: string;
  generatedBy?: string;
  dataSource: DataSource;
  clinicalValidity: string;
  seed: number;
  groundTruth?: string;
}

export interface PatientDemographics {
  id: string;
  age: number;
  gender: string;
  specimenType: string;
  resistanceGenes: string;
  outcome: string;
}

export interface FlashHeadline {
  plain: string;
  organism: string;
  confidence: number;
  decision: DecisionType;
  decisionPlain: string;
  timeToAnswerMin: number;
  comparatorHours: [number, number];
  predictionSet: string[];
  coverageTarget: number;
  patient?: PatientDemographics;
}

export interface DifferentialItem {
  organism: string;
  probability: number;
  inSet: boolean;
  plain: string;
}

export interface SusceptibilityItem {
  drug: string;
  ratio: number;
  call: SusceptibilityCall;
  plain: string;
}

export interface QualityGateData {
  verdict: 'ACCEPT' | 'REJECT';
  trust: number;
  kkChi2: number;
  medianSnrDb: number;
  flags: string[];
  plain: string;
}

export interface AcquisitionData {
  bands: number;
  crestFactors: number[];
  nTones: number;
  parallelMs: number;
  steppedMs: number;
  speedup: number;
  simultaneityMs: number;
  medianSnrDb: number;
  trace: { tMs: number; iUa: number }[];
}

export interface SpectrumData {
  nyquist: { re: number; im: number }[];
  bode: { f: number; mag: number; phase: number }[];
  kk: { f: number; resRe: number; resIm: number }[];
}

export interface DrtPoint {
  tau: number;
  gamma: number;
}

export interface GrowthWell {
  well: string;
  label: string;
  nis: number[];
}

export interface GrowthData {
  times: number[];
  wells: GrowthWell[];
}

export interface ForecastPoint {
  h: number;
  mean: number;
  lo: number;
  hi: number;
}

export interface ForecastTruthPoint {
  h: number;
  g: number;
}

export interface ForecastData {
  calibrated: boolean;
  warning: string;
  observedToH: number;
  points: ForecastPoint[];
  truth: ForecastTruthPoint[];
}

export interface PlannerCandidate {
  action: string;
  eigBits: number;
  costMin: number;
  bitsPerMin: number;
}

export interface PlannerStep {
  action: string;
  plainTitle: string;
  plainText: string;
  candidates: PlannerCandidate[];
  entropyBits: number;
  elapsedMin: number;
  posterior: Record<string, number>;
  leader: string;
  stopped: boolean;
}

export interface PlannerData {
  priorEntropyBits: number;
  stopThresholdBits: number;
  steps: PlannerStep[];
}

export interface IntegrityReport {
  sensitivity: number;
  specificity: number;
  falseRejections: number;
  escapes: number;
}

export interface ValidationData {
  mae: number;
  rmse: number;
  coverage: number;
  calibration: number;
}

export interface ProgressionData {
  ipi: number;
  velocity: number;
  state: 'Stable' | 'Early' | 'Active' | 'Critical';
}

export interface CounterfactualScenario {
  drug: string;
  effect: 'Growth ↑' | 'Growth ↓';
  risk: 'HIGH' | 'CONTROL' | 'FAILURE';
  trajectory: ForecastPoint[];
}

export interface CounterfactualData {
  scenarios: CounterfactualScenario[];
}

export interface FlashRun {
  meta: FlashRunMeta;
  headline: FlashHeadline;
  differential: DifferentialItem[];
  susceptibility: SusceptibilityItem[];
  quality: QualityGateData;
  acquisition: AcquisitionData;
  spectrum: SpectrumData;
  drt: DrtPoint[];
  growth: GrowthData;
  forecast: ForecastData;
  planner: PlannerData;
  integrity?: IntegrityReport;
  validation?: ValidationData;
  progression?: ProgressionData;
  counterfactual?: CounterfactualData;
}

export interface FlashEvidenceItem {
  claim: string;
  detail: string;
  citation: string;
  doi?: string;
  pmid?: string;
  category: 'BIOLOGY' | 'PHYSICS' | 'HARDWARE' | 'CLINICAL' | 'ALGORITHMS';
}
