import { SignalFeatures } from "../core/signalTypes";

/**
 * PHENORA Validation Dataset Framework
 * 
 * Provides utilities to log and aggregate real physical data
 * from the ADS1115 / Heltec setup for engineering validation.
 */

export type LoadType = 
  | "zero" 
  | "resistor_1k" 
  | "resistor_10k" 
  | "resistor_100k" 
  | "electrolyte" 
  | "curd" 
  | "synthetic";

export interface ExperimentalRun {
  runId: string;
  loadType: LoadType;
  temperature?: number;
  records: SignalFeatures[];
}

const experimentalDatabase: ExperimentalRun[] = [];

/**
 * Creates a new experimental run context.
 */
export function startExperimentalRun(loadType: LoadType, runId?: string, temperature?: number): ExperimentalRun {
  const run: ExperimentalRun = {
    runId: runId || `RUN-${Date.now()}`,
    loadType,
    temperature,
    records: []
  };
  experimentalDatabase.push(run);
  return run;
}

/**
 * Appends a verified feature packet to the dataset.
 */
export function logFeaturePacket(run: ExperimentalRun, features: SignalFeatures): void {
  run.records.push({ ...features });
}

/**
 * Dumps the entire run as a CSV string for external validation (e.g. in Python / Excel)
 */
export function exportRunToCsv(run: ExperimentalRun): string {
  if (run.records.length === 0) return "No data";

  const headers = Object.keys(run.records[0]).join(",");
  const rows = run.records.map(record => {
    return Object.values(record).map(val => {
      if (typeof val === "string") return `"${val}"`;
      if (val === null || val === undefined) return "";
      return val;
    }).join(",");
  });

  return `${headers}\n${rows.join("\n")}`;
}
