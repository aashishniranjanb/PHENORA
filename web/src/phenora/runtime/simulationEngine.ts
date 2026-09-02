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

  /**
   * Executes a single measurement cycle in the simulation pipeline.
   * This mimics the real-time asynchronous flow, but executes synchronously for the demo.
   */
  public async executeMeasurementCycle(scenario: SimulationScenario, sampleId: string) {
    const run = this.orchestrator.getRun();
    if (!run) return;

    const builder = new ResultBuilder();
    builder.setRun(run);

    // 1. SAMPLE
    this.orchestrator.advancePhase("ACQUIRING", { SAMPLE: 'COMPLETE', ACQUISITION: 'ACTIVE' });
    builder.setSample({
      sampleId,
      sampleType: 'URINE',
      protocol: DEFAULT_PROTOCOL,
      volume: 100,
      environment: 25,
      device: DEFAULT_DEVICE,
      calibrationId: DEFAULT_CALIBRATION,
      timestamp: Date.now()
    });
    this.orchestrator.emit("MEASUREMENT_STARTED");

    // Simulate short delay for acquisition UX
    await new Promise(r => setTimeout(r, 800)); 

    // 2. ACQUISITION (Simulated)
    // We reuse the existing signalGenerator to create a baseline realistic-looking signal,
    // then map it to our multi-frequency impedance spectrum format.
    const rawSignal = generateSignal({ mode: scenario, duration: 1, sampleRate: 100 });
    const noiseLevel = scenario === 'NOISY' ? 30 : 5;
    const baseZ = scenario === 'FALLING' ? 200 - (run.measurementCycle * 10) : 
                  scenario === 'RISING' ? 120 + (run.measurementCycle * 8) : 
                  150;
                  
    const spectrum = this.generateSimulatedSpectrum(baseZ, noiseLevel);
    this.spectraHistory.push(spectrum);
    
    const acqResult: AcquisitionResult = {
      runId: run.runId,
      measurementIndex: run.measurementCycle,
      totalMeasurements: 12,
      elapsedMs: run.measurementCycle * 2000,
      spectrum,
      signalQuality: spectrum.overallQuality,
      noise: noiseLevel,
      drift: 0.05,
      status: 'COMPLETE'
    };
    
    builder.setAcquisition(acqResult);
    builder.setSpectrum(spectrum);
    this.orchestrator.advancePhase("PROCESSING", { ACQUISITION: 'COMPLETE', IMPEDANCE: 'ACTIVE' });
    this.orchestrator.emit("MEASUREMENT_COMPLETED", { acquisition: acqResult, spectrum });

    await new Promise(r => setTimeout(r, 400));

    // 3. IMPEDANCE (Bode, Nyquist, Temporal, FFT)
    const bode = calculateBode(spectrum);
    const nyquist = calculateNyquist(spectrum);
    const temporal = calculateTemporalImpedance(this.spectraHistory);
    const fft = calculateFFT(spectrum);
    const circuitFit = { fitRmse: 4.2, fitStatus: 'VALID' as const, status: 'FITTED' as const };
    
    builder.setBode(bode);
    builder.setNyquist(nyquist);
    builder.setTemporal(temporal);
    builder.setFFT(fft);
    builder.setCircuitFit(circuitFit as any);
    
    this.orchestrator.advancePhase("PHENOTYPING", { IMPEDANCE: 'COMPLETE', PHENOTYPE: 'ACTIVE' });
    this.orchestrator.emit("SPECTRUM_UPDATED", { bode, nyquist, temporal, fft });

    await new Promise(r => setTimeout(r, 400));

    // 4. PHENOTYPE
    const phenotype = this.phenotypeEngine.calculatePhenotype(spectrum, temporal);
    builder.setPhenotype(phenotype);
    
    this.orchestrator.advancePhase("DISEASE_ANALYSIS", { PHENOTYPE: 'COMPLETE', DISEASE: 'ACTIVE' });
    this.orchestrator.emit("PHENOTYPE_UPDATED", { phenotype });

    await new Promise(r => setTimeout(r, 600));

    // 5. DISEASE INTELLIGENCE
    const disease = this.diseaseEngine.analyzePhenotype(phenotype);
    builder.setDiseaseIntelligence(disease);

    this.orchestrator.advancePhase("TWIN_UPDATE", { DISEASE: 'COMPLETE', TWIN: 'ACTIVE' });
    this.orchestrator.emit("DISEASE_ANALYSIS_COMPLETED", { diseaseIntelligence: disease });

    await new Promise(r => setTimeout(r, 300));

    // 6. DIGITAL TWIN
    if (run.measurementCycle === 1) {
       this.twinEngine.initialize(sampleId);
    }
    const twinState = this.twinEngine.updateState(spectrum, phenotype, disease);
    builder.setDigitalTwin(twinState);

    this.orchestrator.advancePhase("FORECASTING", { TWIN: 'COMPLETE', FORECAST: 'ACTIVE' });
    this.orchestrator.emit("TWIN_UPDATED", { digitalTwin: twinState });

    await new Promise(r => setTimeout(r, 400));

    // 7. FORECAST
    const forecast = this.forecastEngine.generateForecast(twinState);
    builder.setForecast(forecast);

    this.orchestrator.advancePhase("AUTONOMOUS_EVALUATION", { FORECAST: 'COMPLETE', AUTONOMY: 'ACTIVE' });
    this.orchestrator.emit("FORECAST_UPDATED", { forecast });

    await new Promise(r => setTimeout(r, 500));

    // 8. AUTONOMOUS DECISION
    this.budgetTracker.recordMeasurement(2000);
    const decision = this.autonomousPlanner.evaluate(twinState, this.budgetTracker.getState());
    builder.setAutonomousDecision(decision);

    this.orchestrator.emit("AUTONOMOUS_DECISION_READY", { autonomousDecision: decision });

    // Finalize Cycle
    builder.setProvenance({
      runId: run.runId,
      startTimestamp: run.startTimestamp,
      device: DEFAULT_DEVICE,
      calibrationId: DEFAULT_CALIBRATION,
      protocol: DEFAULT_PROTOCOL,
      preprocessingVersion: "1.0",
      phenotypeVersion: "1.0",
      modelId: disease.modelInfo.modelId,
      modelVersion: disease.modelInfo.version,
      trainingDataset: disease.modelInfo.trainingDataset,
      validationDataset: disease.modelInfo.validationDataset,
      softwareVersion: "0.1",
      mode: 'SIMULATION'
    });

    builder.setValidity({
      valid: true,
      level: 'SIMULATION',
      limitations: ["Simulation mode only. Not real data."]
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

  private generateSimulatedSpectrum(baseZ: number, noiseLevel: number): ImpedanceSpectrum {
    const points = DEFAULT_FREQUENCIES.map((freq, i) => {
      // Simulate typical biological dispersion (Cole-Cole like)
      const w = 2 * Math.PI * freq;
      const tau = 1e-4; // Relaxation time
      const alpha = 0.8; 
      
      const rInf = baseZ * 0.4;
      const r0 = baseZ;
      const dR = r0 - rInf;
      
      // Cole-Cole denominator: 1 + (j * w * tau)^alpha
      const phaseVal = alpha * Math.PI / 2;
      const magVal = Math.pow(w * tau, alpha);
      const denomReal = 1 + magVal * Math.cos(phaseVal);
      const denomImag = magVal * Math.sin(phaseVal);
      const denomSq = denomReal*denomReal + denomImag*denomImag;
      
      let zReal = rInf + dR * (denomReal / denomSq);
      let zImag = -dR * (denomImag / denomSq);

      // Add noise
      zReal += (Math.random() - 0.5) * noiseLevel;
      zImag += (Math.random() - 0.5) * noiseLevel;
      
      const magnitude = Math.sqrt(zReal*zReal + zImag*zImag);
      const phase = Math.atan2(zImag, zReal) * (180 / Math.PI);
      
      return {
        frequency: freq,
        zReal,
        zImag,
        magnitude,
        phase,
        time: Date.now(),
        quality: 100 - (noiseLevel * 1.5),
        provenance: 'MEASURED' as const
      };
    });

    return {
      timestamp: Date.now(),
      points,
      frequencyRange: { min: DEFAULT_FREQUENCIES[0], max: DEFAULT_FREQUENCIES[DEFAULT_FREQUENCIES.length - 1] },
      numPoints: DEFAULT_FREQUENCIES.length,
      overallQuality: 100 - (noiseLevel * 1.5),
      calibrationId: DEFAULT_CALIBRATION,
      provenance: 'MEASURED'
    };
  }
}
