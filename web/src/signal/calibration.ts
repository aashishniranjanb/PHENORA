import { ProcessingConfig } from "../core/signalTypes";

/**
 * Signal Calibration Module
 * 
 * Maps raw integer ADC values into normalized physical electrical units,
 * and tracks calibration coefficients for engineering loads.
 */

export interface CalibrationReport {
  meanError: number;
  meanErrorPercent: number;
  stdDeviation: number;
  repeatabilityCv: number; // Coefficient of variation (%)
}

/**
 * Converts a raw integer ADC code (e.g. from a 16-bit ADS1115 or 12-bit ESP32 ADC)
 * into a physical voltage reading.
 * 
 * @param rawAdc Integer code from ADC
 * @param vRef Reference voltage of the ADC (e.g. 3.3V or 4.096V)
 * @param adcMax Maximum integer value (e.g. 32767 for 15-bit single-ended ADS1115)
 */
export function calibrateAdcToVoltage(
  rawAdc: number, 
  vRef: number = 3.3, 
  adcMax: number = 32767
): number {
  return (Math.max(0, rawAdc) / adcMax) * vRef;
}

/**
 * Validates known electrical loads against expected measurements
 * to produce a calibration and repeatability report.
 * 
 * @param expected Array of known true values (e.g. 1000, 10000 ohms)
 * @param measured Array of recorded values
 */
export function generateCalibrationReport(
  expected: number[], 
  measured: number[]
): CalibrationReport {
  if (!expected || !measured || expected.length === 0 || expected.length !== measured.length) {
    return { meanError: 0, meanErrorPercent: 0, stdDeviation: 0, repeatabilityCv: 0 };
  }

  const n = expected.length;
  let sumError = 0;
  let sumErrorPercent = 0;

  for (let i = 0; i < n; i++) {
    const err = measured[i] - expected[i];
    sumError += err;
    if (expected[i] !== 0) {
      sumErrorPercent += Math.abs(err / expected[i]);
    }
  }

  const meanError = sumError / n;
  const meanErrorPercent = (sumErrorPercent / n) * 100;

  let sumSqDiff = 0;
  for (let i = 0; i < n; i++) {
    const err = measured[i] - expected[i];
    const diff = err - meanError;
    sumSqDiff += diff * diff;
  }
  
  const variance = sumSqDiff / n;
  const stdDeviation = Math.sqrt(variance);
  
  // Calculate CV based on the measured mean
  let sumMeasured = 0;
  for (let i = 0; i < n; i++) {
    sumMeasured += measured[i];
  }
  const meanMeasured = sumMeasured / n;
  const repeatabilityCv = meanMeasured !== 0 ? (stdDeviation / meanMeasured) * 100 : 0;

  return {
    meanError,
    meanErrorPercent,
    stdDeviation,
    repeatabilityCv,
  };
}
