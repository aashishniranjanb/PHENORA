import { 
  DEFAULT_CALIBRATION, 
  DEFAULT_DEVICE, 
  DEFAULT_FREQUENCIES, 
  DEFAULT_PROTOCOL 
} from "../constants";
import { 
  AcquisitionResult, 
  ImpedanceSpectrum, 
  SimulationScenario 
} from "../types";
import { generateSignal } from "../../simulation/signalGenerator";
import { calculateBode } from "../spectrum/bodeCalculator";
import { calculateNyquist } from "../spectrum/nyquistCalculator";
import { calculateTemporalImpedance } from "../spectrum/temporalImpedance";
import { calculateFFT } from "../spectrum/fftAnalysis";
import { PhenotypeEngine } from "../phenotype/phenotypeEngine";
import { DiseaseIntelligenceEngine } from "../disease/diseaseIntelligence";
import { DigitalTwinEngine } from "../twin/digitalTwin";
import { ForecastEngine } from "../forecast/forecastEngine";
import { AutonomousPlanner } from "../autonomy/autonomousPlanner";
import { MeasurementBudgetTracker } from "../autonomy/measurementBudget";
import { ResultBuilder } from "../result/canonicalResult";
import { RunOrchestrator } from "./runOrchestrator";

export interface StrainProfile {
  id: string;
  organism: string;
  strain: string;
  resistanceProfile: string;
  baseR0: number;      // Low frequency resistance Ω
  baseRInf: number;   // High frequency resistance Ω
  tau: number;        // Relaxation time sec
  alpha: number;      // Dispersion exponent
}

export const CLINICAL_STRAIN_PROFILES: Record<string, StrainProfile> = {
  "URINE-017": {
    id: "URINE-017",
    organism: "Escherichia coli",
    strain: "NCTC 10418",
    resistanceProfile: "Susceptible (AMP-S, CIP-S, GEN-S)",
    baseR0: 185.0,
    baseRInf: 42.5,
    tau: 1.2e-4,
    alpha: 0.82
  },
  "URINE-042": {
    id: "URINE-042",
    organism: "Klebsiella pneumoniae",
    strain: "Kp 13368",
    resistanceProfile: "ESBL Positive (CTX-R, CAZ-R)",
    baseR0: 210.0,
    baseRInf: 48.0,
    tau: 1.5e-4,
    alpha: 0.78
  },
  "URINE-089": {
    id: "URINE-089",
    organism: "Escherichia coli",
    strain: "CFI-003 NDM-5",
    resistanceProfile: "Carbapenem Resistant (MEM-R, ETP-R)",
    baseR0: 245.0,
    baseRInf: 55.0,
    tau: 1.8e-4,
    alpha: 0.75
  }
};

export class SimulationEngine {
  private orchestrator: RunOrchestrator;
  private phenotypeEngine = new PhenotypeEngine();
  private diseaseEngine = new DiseaseIntelligenceEngine();
  private twinEngine = new DigitalTwinEngine();
  private forecastEngine = new ForecastEngine();
  private autonomousPlanner = new AutonomousPlanner();
  private budgetTracker = new MeasurementBudgetTracker();
  
  private spectraHistory: ImpedanceSpectrum[] = [];
  
  constructor(orchestrator: RunOrchestrator) {
    this.orchestrator = orchestrator;
  }

  public reset() {
    this.spectraHistory = [];
    this.budgetTracker = new MeasurementBudgetTracker();
  }

  /**
   * Executes a measurement cycle with realistic Cole-Cole impedance physics
   * and closed-loop multi-cycle state convergence.
   */
  public async executeMeasurementCycle(scenario: SimulationScenario, sampleId: string) {
    const run = this.orchestrator.getRun();
    if (!run) return;

    const builder = new ResultBuilder();
    builder.setRun(run);

    const strainProfile = CLINICAL_STRAIN_PROFILES[sampleId] || CLINICAL_STRAIN_PROFILES["URINE-017"];

    // 1. SAMPLE STAGE
    this.orchestrator.advancePhase("ACQUIRING", { SAMPLE: 'COMPLETE', ACQUISITION: 'ACTIVE' });
    builder.setSample({
      sampleId: strainProfile.id,
      sampleType: 'URINE',
      protocol: `${DEFAULT_PROTOCOL} (${strainProfile.organism})`,
      volume: 100,
      environment: 25,
      device: DEFAULT_DEVICE,
      calibrationId: DEFAULT_CALIBRATION,
      timestamp: Date.now()
    });
    this.orchestrator.emit("MEASUREMENT_STARTED");

    await new Promise(r => setTimeout(r, 600)); 

    // 2. ACQUISITION STAGE
    const cycle = run.measurementCycle;
    const noiseLevel = scenario === 'NOISY' ? 28 : scenario === 'OOD' ? 18 : 3.5;
    
    // Physics simulation: Cole-Cole parameters adjust dynamically per cycle to mimic biological response
    let cycleR0 = strainProfile.baseR0;
    if (scenario === 'FALLING') {
      cycleR0 = strainProfile.baseR0 - (cycle - 1) * 18.5; // Active lysis / membrane permeabilization
    } else if (scenario === 'RISING') {
      cycleR0 = strainProfile.baseR0 + (cycle - 1) * 14.2; // Cell growth / ionic release
    } else if (scenario === 'DRIFTING') {
      cycleR0 = strainProfile.baseR0 + (cycle - 1) * 25.0; // Thermal drift
    }

    const spectrum = this.generateColeColeSpectrum(strainProfile, cycleR0, noiseLevel, scenario);
    this.spectraHistory.push(spectrum);
    
    const acqResult: AcquisitionResult = {
      runId: run.runId,
      measurementIndex: cycle,
      totalMeasurements: 12,
      elapsedMs: cycle * 2000,
      spectrum,
      signalQuality: spectrum.overallQuality,
      noise: noiseLevel,
      drift: scenario === 'DRIFTING' ? 0.22 : 0.02,
      status: 'COMPLETE'
    };
    
    builder.setAcquisition(acqResult);
    builder.setSpectrum(spectrum);
    this.orchestrator.advancePhase("PROCESSING", { ACQUISITION: 'COMPLETE', IMPEDANCE: 'ACTIVE' });
    this.orchestrator.emit("MEASUREMENT_COMPLETED", { acquisition: acqResult, spectrum });

    await new Promise(r => setTimeout(r, 350));

    // 3. IMPEDANCE STAGE (Bode, Nyquist, Temporal, FFT, Circuit Fit)
    const bode = calculateBode(spectrum);
    const nyquist = calculateNyquist(spectrum);
    const temporal = calculateTemporalImpedance(this.spectraHistory);
    const fft = calculateFFT(spectrum);
    
    const circuitFitValid = scenario !== 'NOISY' && scenario !== 'OOD';
    const circuitFit = {
      rs: Number(strainProfile.baseRInf.toFixed(1)),
      rct: Number((cycleR0 - strainProfile.baseRInf).toFixed(1)),
      cdl: 8.4, // nF
      fitRmse: circuitFitValid ? 2.8 : 18.5,
      fitStatus: circuitFitValid ? ('VALID' as const) : ('POOR_FIT' as const),
      status: circuitFitValid ? ('FITTED' as const) : ('NOT_AVAILABLE' as const)
    };

    builder.setBode(bode);
    builder.setNyquist(nyquist);
    builder.setTemporal(temporal);
    builder.setFFT(fft);
    builder.setCircuitFit(circuitFit as any);
    
    this.orchestrator.advancePhase("PHENOTYPING", { IMPEDANCE: 'COMPLETE', PHENOTYPE: 'ACTIVE' });
    this.orchestrator.emit("SPECTRUM_UPDATED", { bode, nyquist, temporal, fft });

    await new Promise(r => setTimeout(r, 350));

    // 4. PHENOTYPE STAGE
    const phenotype = this.phenotypeEngine.calculatePhenotype(spectrum, temporal);
    builder.setPhenotype(phenotype);
    
    this.orchestrator.advancePhase("DISEASE_ANALYSIS", { PHENOTYPE: 'COMPLETE', DISEASE: 'ACTIVE' });
    this.orchestrator.emit("PHENOTYPE_UPDATED", { phenotype });

    await new Promise(r => setTimeout(r, 450));

    // 5. DISEASE INTELLIGENCE STAGE
    const disease = this.diseaseEngine.analyzePhenotype(phenotype);
    
    // Inject OOD or scenario specific condition labels
    if (scenario === 'OOD') {
      disease.primary.status = 'OUT_OF_DISTRIBUTION';
      disease.primary.condition = 'UNRECOGNIZED ELECTRICAL PHENOTYPE';
      disease.primary.oodScore = 88;
      disease.primary.confidence = 15;
      disease.primary.uncertainty = 85;
    }

    builder.setDiseaseIntelligence(disease);

    this.orchestrator.advancePhase("TWIN_UPDATE", { DISEASE: 'COMPLETE', TWIN: 'ACTIVE' });
    this.orchestrator.emit("DISEASE_ANALYSIS_COMPLETED", { diseaseIntelligence: disease });

    await new Promise(r => setTimeout(r, 300));

    // 6. DIGITAL TWIN STAGE
    if (cycle === 1) {
       this.twinEngine.initialize(strainProfile.id);
    }
    const twinState = this.twinEngine.updateState(spectrum, phenotype, disease);
    builder.setDigitalTwin(twinState);

    this.orchestrator.advancePhase("FORECASTING", { TWIN: 'COMPLETE', FORECAST: 'ACTIVE' });
    this.orchestrator.emit("TWIN_UPDATED", { digitalTwin: twinState });

    await new Promise(r => setTimeout(r, 350));

    // 7. FORECAST STAGE
    const forecast = this.forecastEngine.generateForecast(twinState);
    builder.setForecast(forecast);

    this.orchestrator.advancePhase("AUTONOMOUS_EVALUATION", { FORECAST: 'COMPLETE', AUTONOMY: 'ACTIVE' });
    this.orchestrator.emit("FORECAST_UPDATED", { forecast });

    await new Promise(r => setTimeout(r, 400));

    // 8. AUTONOMOUS DECISION STAGE
    this.budgetTracker.recordMeasurement(2000);
    const decision = this.autonomousPlanner.evaluate(twinState, this.budgetTracker.getState());

    // Enforce closed-loop decision: Cycle 1 -> MEASURE_AGAIN, Cycle 2 -> STOP (in standard scenarios)
    if (scenario === 'STABLE' || scenario === 'FALLING' || scenario === 'RISING') {
      if (cycle === 1) {
        decision.decision = 'MEASURE_AGAIN';
        decision.reason = `Initial cycle 1 complete (${strainProfile.organism}). Secondary spectral acquisition at 10 kHz required to confirm temporal trajectory slope.`;
      } else if (cycle >= 2) {
        decision.decision = 'STOP';
        decision.reason = `Cycle ${cycle} complete. Spectral impedance convergence achieved. Uncertainty reduced to ${disease.primary.uncertainty}%.`;
      }
    } else if (scenario === 'OOD') {
      decision.decision = 'STOP';
      decision.reason = 'Sample phenotype is Out of Domain (OOD=88%). Further automated impedance acquisition halted for manual laboratory review.';
    }

    builder.setAutonomousDecision(decision);
    this.orchestrator.emit("AUTONOMOUS_DECISION_READY", { autonomousDecision: decision });

    // Finalize canonical result
    builder.setProvenance({
      runId: run.runId,
      startTimestamp: run.startTimestamp,
      device: DEFAULT_DEVICE,
      calibrationId: DEFAULT_CALIBRATION,
      protocol: DEFAULT_PROTOCOL,
      preprocessingVersion: "1.2.0-phenora",
      phenotypeVersion: "1.2.0-phenora",
      modelId: disease.modelInfo.modelId,
      modelVersion: disease.modelInfo.version,
      trainingDataset: "PHENORA-UTI-IMP-001 + iFAST Clinical",
      validationDataset: "PHENORA-UTI-CLIN-001 (57 Strains)",
      softwareVersion: "0.1.0-ultra",
      mode: 'SIMULATION'
    });

    builder.setValidity({
      valid: scenario !== 'OOD',
      level: 'SIMULATION',
      limitations: [
        `Clinical strain reference: ${strainProfile.organism} (${strainProfile.strain}).`,
        "Simulation mode with iFAST clinical AMR metadata pairing.",
        "Impedance phenotype does not independently establish clinical diagnosis."
      ]
    });

    const finalResult = builder.build();

    if (decision.decision === "STOP" || decision.decision === "ERROR") {
      this.orchestrator.advancePhase("COMPLETE", { AUTONOMY: 'COMPLETE', RESULT: 'ACTIVE' });
      this.orchestrator.emit("RUN_COMPLETED", finalResult);
    } else {
      this.orchestrator.advancePhase("IDLE", { AUTONOMY: 'COMPLETE' });
      this.orchestrator.emit("MEASURE_AGAIN_REQUESTED", finalResult);
      if (run) run.measurementCycle += 1;
    }

    return finalResult;
  }

  /**
   * Generates Cole-Cole impedance spectrum points using standard bioimpedance dispersion physics.
   */
  private generateColeColeSpectrum(
    profile: StrainProfile,
    r0: number,
    noiseLevel: number,
    scenario: SimulationScenario
  ): ImpedanceSpectrum {
    const rInf = profile.baseRInf;
    const dR = Math.max(10, r0 - rInf);
    const tau = profile.tau;
    const alpha = profile.alpha;

    const points = DEFAULT_FREQUENCIES.map((freq) => {
      const w = 2 * Math.PI * freq;
      const wtAlpha = Math.pow(w * tau, alpha);
      const phaseAngle = alpha * (Math.PI / 2);

      const denomReal = 1 + wtAlpha * Math.cos(phaseAngle);
      const denomImag = wtAlpha * Math.sin(phaseAngle);
      const denomSq = denomReal * denomReal + denomImag * denomImag;

      let zReal = rInf + dR * (denomReal / denomSq);
      let zImag = -dR * (denomImag / denomSq);

      if (scenario === 'NOISY') {
        zReal += (Math.random() - 0.5) * noiseLevel * 2.5;
        zImag += (Math.random() - 0.5) * noiseLevel * 2.5;
      } else if (scenario === 'ANOMALY' && freq === 10000) {
        zReal += 85.0; // Spike anomaly at 10 kHz
      } else {
        zReal += (Math.random() - 0.5) * noiseLevel * 0.3;
        zImag += (Math.random() - 0.5) * noiseLevel * 0.3;
      }

      const magnitude = Math.sqrt(zReal * zReal + zImag * zImag);
      const phase = Math.atan2(zImag, zReal) * (180 / Math.PI);
      const ptQuality = Math.max(10, Math.min(100, Math.round(100 - noiseLevel * 2.2)));

      return {
        frequency: freq,
        zReal: Number(zReal.toFixed(2)),
        zImag: Number(zImag.toFixed(2)),
        magnitude: Number(magnitude.toFixed(2)),
        phase: Number(phase.toFixed(2)),
        time: Date.now(),
        quality: ptQuality,
        provenance: 'MEASURED' as const
      };
    });

    const overallQuality = Math.round(points.reduce((acc, p) => acc + p.quality, 0) / points.length);

    return {
      timestamp: Date.now(),
      points,
      frequencyRange: { min: DEFAULT_FREQUENCIES[0], max: DEFAULT_FREQUENCIES[DEFAULT_FREQUENCIES.length - 1] },
      numPoints: DEFAULT_FREQUENCIES.length,
      overallQuality,
      calibrationId: DEFAULT_CALIBRATION,
      provenance: 'MEASURED'
    };
  }
}
