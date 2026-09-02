import { MeasurementBudgetState } from "../types";

export class MeasurementBudgetTracker {
  private state: MeasurementBudgetState;

  constructor(maxMeasurements = 12, maxDurationMinutes = 3, maxRetries = 3) {
    this.state = {
      measurementsDone: 0,
      measurementsMax: maxMeasurements,
      elapsedMs: 0,
      maxDurationMs: maxDurationMinutes * 60 * 1000,
      retriesDone: 0,
      retriesMax: maxRetries
    };
  }

  public recordMeasurement(durationMs: number) {
    this.state.measurementsDone += 1;
    this.state.elapsedMs += durationMs;
  }

  public recordRetry() {
    this.state.retriesDone += 1;
  }

  public getState(): MeasurementBudgetState {
    return { ...this.state };
  }
  
  public updateElapsed(elapsedMs: number) {
      this.state.elapsedMs = elapsedMs;
  }
}
