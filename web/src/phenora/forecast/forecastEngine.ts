import { 
  DigitalTwinState, 
  ForecastPoint, 
  ForecastStatus, 
  PredictiveForecast 
} from "../types";

export class ForecastEngine {
  private modelId = "TREND-V1";
  private version = "1.0.0-alpha";

  public generateForecast(twinState: DigitalTwinState): PredictiveForecast {
    const timestamp = Date.now();
    const history = twinState.history;

    if (history.length < 3) {
      return this.createInsufficientForecast(history.length);
    }

    // Simple linear extrapolation for V1 based on recent history
    const horizons = [5, 10, 20, 30]; // minutes

    // 1. Impedance Forecast (based on low freq Z)
    const zHistory = history.map(h => {
      const zVar = h.snapshot.observed.find(o => o.name === "Low-Frequency |Z|");
      return { t: h.timestamp, val: zVar ? Number(zVar.value) : 0 };
    }).filter(h => h.val > 0);

    const impedanceForecast: ForecastPoint[] = [];
    if (zHistory.length >= 3) {
      const { slope, intercept } = this.linearRegression(zHistory);
      
      horizons.forEach(h => {
        const futureT = timestamp + (h * 60 * 1000);
        const predictedVal = slope * futureT + intercept;
        // Uncertainty grows non-linearly with horizon
        const baseUncertainty = 10;
        const uncertainty = Math.min(100, baseUncertainty + (h * 1.5));
        
        impedanceForecast.push({
          horizon: h,
          prediction: predictedVal,
          lowerBound: predictedVal * (1 - (uncertainty/100)),
          upperBound: predictedVal * (1 + (uncertainty/100)),
          confidence: 100 - uncertainty,
          uncertainty
        });
      });
    }

    // 2. Disease State Forecast (Probability extrapolation)
    const diseaseHistory = history.map(h => {
      const dVar = h.snapshot.inferred.find(i => i.name === "Primary Condition");
      // Fallback logic for mock probability if not explicitly stored as a number in twin
      // For V1, we just mock this growing or shrinking based on the condition
      const currentProb = dVar ? 75 : 50; 
      return { t: h.timestamp, val: currentProb };
    });

    const diseaseStateForecast: ForecastPoint[] = [];
    
    // Mock disease forecast
    horizons.forEach((h, i) => {
      const baseProb = 78;
      const predictedVal = Math.min(100, baseProb + (i * 2)); // Slowly rising probability
      const uncertainty = Math.min(100, 15 + (h * 1.2));

      diseaseStateForecast.push({
        horizon: h,
        prediction: predictedVal,
        lowerBound: Math.max(0, predictedVal - uncertainty),
        upperBound: Math.min(100, predictedVal + uncertainty),
        confidence: 100 - uncertainty,
        uncertainty
      });
    });

    // Update twin forecast uncertainty based on 10 min horizon
    const tenMinForecast = diseaseStateForecast.find(f => f.horizon === 10);
    if (tenMinForecast) {
       twinState.uncertaintyMap.forecast = tenMinForecast.uncertainty > 40 ? 'HIGH' : tenMinForecast.uncertainty > 20 ? 'MEDIUM' : 'LOW';
    }

    return {
      timestamp,
      modelId: this.modelId,
      version: this.version,
      impedanceForecast,
      phenotypeForecast: [], // Placeholder for V1
      diseaseStateForecast,
      historyLength: history.length,
      status: "READY",
      provenance: "PREDICTED"
    };
  }

  private createInsufficientForecast(historyLength: number): PredictiveForecast {
    return {
      timestamp: Date.now(),
      modelId: this.modelId,
      version: this.version,
      impedanceForecast: [],
      phenotypeForecast: [],
      diseaseStateForecast: [],
      historyLength,
      status: "INSUFFICIENT_HISTORY",
      provenance: "PREDICTED"
    };
  }

  private linearRegression(data: {t: number, val: number}[]) {
    const n = data.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    
    // Normalize time to start at 0 to avoid precision issues with large timestamps
    const t0 = data[0].t;

    for (const point of data) {
      const x = point.t - t0;
      const y = point.val;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumXX += x * x;
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Adjust intercept back to absolute time
    return { slope, intercept: intercept - slope * t0 };
  }
}
