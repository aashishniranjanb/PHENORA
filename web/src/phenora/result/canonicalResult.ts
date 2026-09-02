import { PhenoraFlashResult } from "../types";

export class ResultBuilder {
  private result: Partial<PhenoraFlashResult> = {};

  public setSample(sample: PhenoraFlashResult['sample']) { this.result.sample = sample; }
  public setRun(run: PhenoraFlashResult['run']) { this.result.run = run; }
  public setAcquisition(acq: PhenoraFlashResult['acquisition']) { this.result.acquisition = acq; }
  public setSpectrum(spec: PhenoraFlashResult['spectrum']) { this.result.spectrum = spec; }
  public setBode(bode: PhenoraFlashResult['bode']) { this.result.bode = bode; }
  public setNyquist(nyq: PhenoraFlashResult['nyquist']) { this.result.nyquist = nyq; }
  public setTemporal(temp: PhenoraFlashResult['temporal']) { this.result.temporal = temp; }
  public setFFT(fft: PhenoraFlashResult['fft']) { this.result.fft = fft; }
  public setCircuitFit(fit: PhenoraFlashResult['circuitFit']) { this.result.circuitFit = fit; }
  public setPhenotype(pheno: PhenoraFlashResult['phenotype']) { this.result.phenotype = pheno; }
  public setDiseaseIntelligence(dis: PhenoraFlashResult['diseaseIntelligence']) { this.result.diseaseIntelligence = dis; }
  public setDigitalTwin(twin: PhenoraFlashResult['digitalTwin']) { this.result.digitalTwin = twin; }
  public setForecast(forecast: PhenoraFlashResult['forecast']) { this.result.forecast = forecast; }
  public setAutonomousDecision(dec: PhenoraFlashResult['autonomousDecision']) { this.result.autonomousDecision = dec; }
  public setValidity(val: PhenoraFlashResult['validity']) { this.result.validity = val; }
  public setProvenance(prov: PhenoraFlashResult['provenance']) { this.result.provenance = prov; }

  public build(): PhenoraFlashResult {
    // In a real app, we'd validate that all required fields are present here.
    return this.result as PhenoraFlashResult;
  }
}
