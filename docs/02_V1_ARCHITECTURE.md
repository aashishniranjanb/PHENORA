# PHENORA V1 Architecture

This document specifies the technical details of the PHENORA V1 prototype.

## Hardware Stack

1. **Control / Test Wells:** Dual chamber cell configuration to host the control suspension and the antibiotic test suspension.
2. **Electrodes:** Custom physical interfaces to apply excitation signals and read electrical impedance changes.
3. **AD5933 Impedance Analyzer:** 
   - Generates AC excitation voltage (up to 100 kHz).
   - Collects response current, processes it via on-board ADC and discrete Fourier transform (DFT).
   - Outputs Real ($R$) and Imaginary ($I$) components via I2C interface.
4. **Heltec ESP32-S3:**
   - Controls and configures the AD5933 sweep parameters via I2C.
   - Triggers measurement cycles, applies calibration coefficients, and calculates impedance magnitude $|Z|$ and phase $\theta$.
   - Formulates the impedance feature $F(t)$ and transmits it via UART to the FPGA.
5. **FPGA (VSDSquadron Mini):**
   - Implements hardware-accelerated digital filtering.
   - Calculates the differential impedance $\Delta F(t) = F_{test}(t) - F_{control}(t)$.
   - Computes local slope, stability statistics, and runs the decision state machine to output STOP/REPEAT signals.

## Signal Flow Diagram

```text
BIOLOGICAL SAMPLE (Control & Test Suspension)
        │
   [Electrodes]
        │
 [AD5933 Analyzer]  <-- AC Excitation & DFT
        │
   (I2C Link)
        │
 [Heltec ESP32-S3]  <-- Feature Extraction
        │
   (UART Link)
        │
     [FPGA]         <-- Filter & Adaptive Decision
        │
 [STOP / REPEAT]    <-- Control Command Output
```

