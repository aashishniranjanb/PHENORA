# PHENORA Signal Intelligence Pipeline (Person A)

> **IMPORTANT DISCLAIMER**  
> The signal processing algorithms and synthetic data generators in this module are **engineering and computational prototypes**. They provide transparent numerical signal representations for software architecture validation. They do **not** represent clinically validated biological biomarkers, antimicrobial susceptibility (AST) predictions, or validated diagnostic thresholds.

---

## 1. Overview & Architecture

The **Signal Intelligence Pipeline** provides a single canonical processing chain capable of ingesting raw electrical samples—either from the seeded synthetic signal generator or from the future physical hardware path (NE555 → safety-pin electrode → LM358 → ADS1115 → Heltec ESP32-S3)—and converting them into a standardized `SignalFeatures` contract consumed downstream by:
- **Person B (ML Intelligence)**: Quality, Trajectory, and Anomaly models.
- **Person C (Evidence & Decision Engine)**: Adaptive stopping and multi-evidence integration.

```
       INPUT ADAPTERS
             │
 ┌───────────┴───────────┐
 │                       │
 ▼                       ▼
Synthetic Generator     Future ADS1115 Adapter
(Seeded PRNG)           (Heltec ESP32-S3 I2C)
 │                       │
 └───────────┬───────────┘
             ▼
      RawSignalSample
             │
             ▼
     signalProcessor.ts
 ┌───────────┼───────────┐
 ▼           ▼           ▼
Filtering   Windowing   Baseline Establishment
 └───────────┬───────────┘
             ▼
     featureExtractor.ts
 ┌───────────┼───────────┐
 ▼           ▼           ▼
RMS      Variance      Peak-to-Peak
Delta    Slope         Stability
SNR      Drift
 └───────────┬───────────┘
             ▼
       SignalFeatures
             │
             ├──────────────────────────┐
             ▼                          ▼
      Person B: ML             Person C: Evidence
(Quality/Trajectory/Anomaly)       (Adaptive Stopping)
```

---

## 2. Data Contracts

### 2.1 Input: `RawSignalSample`
```typescript
interface RawSignalSample {
  timestamp: number;                  // Milliseconds timestamp
  value: number;                      // Normalized voltage reading (e.g. 0.0 - 3.3V)
  rawAdc?: number;                    // Raw integer code (e.g. 16-bit ADS1115)
  phase?: "ZERO" | "CONTROL_PRE_DOSE" | "TEST_POST_DOSE";
  runId?: string;                     // Acquisition run ID
  chamberId?: string;                 // Chamber / well identifier
}
```

### 2.2 Output: `SignalFeatures`
```typescript
interface SignalFeatures {
  timestamp: number;                  // Window evaluation timestamp
  rawValue: number;                   // Latest normalized raw value

  rms: number;                        // Root-mean-square of windowed signal
  variance: number;                   // Variance around arithmetic mean
  peakToPeak: number;                 // max(samples) - min(samples)

  baseline: number;                   // Pre-dose reference value (F_pre)
  delta: number;                      // Sequential delta: current - baseline
  slope: number;                      // Finite difference: delta[n] - delta[n - lag]
  stability: number;                  // Normalized stability index [0.0 - 1.0]

  snr: number;                        // Estimated signal-to-noise ratio (dB)
  drift: number;                      // Linear baseline drift rate per unit window
}
```

---

## 3. Mathematical Definitions & Algorithms

### 3.1 Normalization (`filters.ts`)
Converts raw integer ADC codes into normalized voltage:
$$\text{voltage} = \left(\frac{\text{rawAdc}}{\text{adcMax}}\right) \cdot v_{\text{ref}}$$

### 3.2 Low-Pass Filter (`filters.ts`)
Deterministic sliding-window moving average (mirrors the edge FPGA low-pass filter):
$$y[n] = \frac{1}{K} \sum_{i=0}^{K-1} x[n - i]$$

### 3.3 Statistical Dispersion (`statistics.ts`)
- **RMS**: $\text{RMS} = \sqrt{\frac{1}{N} \sum_{i=1}^N x_i^2}$
- **Variance**: $\text{Var} = \frac{1}{N} \sum_{i=1}^N (x_i - \bar{x})^2$
- **Peak-to-Peak**: $\text{P2P} = \max(X) - \min(X)$
- **SNR (dB)**: $\text{SNR}_{\text{dB}} = 10 \cdot \log_{10} \left(\frac{\text{RMS}(X_{\text{smoothed}})^2}{\text{Var}(X - X_{\text{smoothed}}) + \epsilon}\right)$

### 3.4 Baseline & Delta (`baseline.ts`)
PHENORA operates in a **sequential single-chamber** configuration (not simultaneous multi-channel differential):
$$\Delta F(t) = F(t) - \bar{F}_{\text{pre-dose}}$$

### 3.5 Slope & Stability (`quality.ts`)
- **Finite-Difference Slope** ($\text{lag} = 4$):
  $$\text{slope}[n] = \Delta F[n] - \Delta F[n - 4]$$
- **Slope Range**:
  $$\text{range} = \max(\text{slopes}) - \min(\text{slopes})$$
- **Stability Index** $[0, 1]$:
  $$\text{stability} = \frac{1}{1 + \left(\frac{\text{range}}{\theta_{\text{threshold}}}\right)}$$
  *(Where $\theta_{\text{threshold}}$ is a configurable experimental scaling parameter).*

---

## 4. Synthetic Signal Modes (`signalGenerator.ts`)

The generator produces time-series `RawSignalSample[]` (never precomputed features) with deterministic Mulberry32 PRNG seeds:

| Mode | Trend Formula / Description | Intended Test Case |
| :--- | :--- | :--- |
| `STABLE` | Micro-oscillation + low noise ($\sigma = 0.01$) | Steady state, high stability baseline |
| `RISING` | Monotonic positive trajectory ($+A \cdot t$) | Positive slope detection |
| `FALLING` | Monotonic negative trajectory ($-A \cdot t$) | Negative slope detection |
| `NOISY` | Multi-harmonic noise ($8\times$ noise level) | High variance, low SNR rejection |
| `DRIFTING` | Steady linear baseline offset ($v_{\text{drift}} \cdot t$) | Thermal/evaporative drift isolation |
| `TRANSITION` | Sigmoidal step from pre- to post-dose equilibrium | Full dynamic response curve |

---

## 5. Usage Example

```typescript
import { generateSignal, createSignalPipeline, createDemoSignalRun } from "@/signal";

// 1. One-line demo run
const demo = createDemoSignalRun("TRANSITION", { duration: 20, sampleRate: 10 });
console.log(`Generated ${demo.samples.length} samples -> ${demo.features.length} feature windows`);

// 2. Online streaming ingestion (e.g. from websocket or hardware polling)
const pipeline = createSignalPipeline({ featureWindowSize: 20, slopeLag: 4 });

const rawSamples = generateSignal({ mode: "STABLE", duration: 5 });
for (const sample of rawSamples) {
  const latestFeatures = pipeline.feed(sample);
  if (latestFeatures) {
    console.log("Extracted Features:", latestFeatures.stability, latestFeatures.snr);
  }
}
```

---

## 6. Testing

Run the automated test suite verifying all 10 acceptance criteria:
```bash
npx tsx src/signal/__tests__/signal.test.ts
```
