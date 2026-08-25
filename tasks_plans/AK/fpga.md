# PHENORA V1 — FPGA + Heltec Integration Specification

## Status

VERSION: V1.0
PURPOSE: Hackathon prototype
TARGET FPGA: VSDSquadron FPGA Mini
FPGA: Lattice iCE40UP5K
HOST MCU: Heltec WiFi Kit V3
HOST MCU: ESP32-S3
PRIMARY SENSOR FRONT-END: AD5933
FALLBACK FRONT-END: 555 + analog front-end + ADS1115

---

# 1. PROJECT DEFINITION

PHENORA is a prototype for a confidence-driven adaptive impedance measurement system.

The system is NOT yet a clinically validated AST device.

V1 objective:

    impedance measurement
        ↓
    host-side conversion
        ↓
    streaming feature
        ↓
    FPGA filtering
        ↓
    differential measurement
        ↓
    slope / stability analysis
        ↓
    measurement confidence
        ↓
    STOP / MEASURE AGAIN

The FPGA's job is NOT to perform the complete impedance calculation.

The FPGA is the deterministic edge-processing and adaptive-decision layer.

---

# 2. SYSTEM ARCHITECTURE

Current architecture:

                         CONTROL
                            │
                            │
                     ┌──────┴──────┐
                     │             │
                     │  AD5933     │
                     │             │
                     └──────┬──────┘
                            │
                           I2C
                            │
                            ▼
                  ┌──────────────────┐
                  │   HELTEC V3      │
                  │   ESP32-S3       │
                  │                  │
                  │ AD5933 driver    │
                  │ R/I acquisition │
                  │ magnitude        │
                  │ feature calc     │
                  └────────┬─────────┘
                           │
                     UART / SPI
                           │
                           ▼
                ┌──────────────────────┐
                │ VSDSQUADRON FPGA MINI│
                │ Lattice iCE40UP5K    │
                │                      │
                │ Input parser         │
                │ Filter               │
                │ Differential logic   │
                │ Slope                │
                │ Stability            │
                │ Confidence           │
                │ Adaptive FSM          │
                └──────────┬───────────┘
                           │
                    STOP / REPEAT
                           │
                           ▼
                      HELTEC / PC
                           │
                           ▼
                       Dashboard

IMPORTANT:

The Heltec is the computational host.
The FPGA is the deterministic edge-processing engine.

---

# 3. HARDWARE RESPONSIBILITIES

## 3.1 AD5933

Responsible for:

- AC excitation
- ADC acquisition
- DFT
- real component
- imaginary component
- frequency sweep
- measurement status

The AD5933 returns real and imaginary measurement registers after
a frequency point has completed.

The AD5933 does NOT directly return calibrated impedance in ohms.

Calibration and impedance conversion are performed by the host.

---

## 3.2 HELTEC WIFI KIT V3

Responsible for:

- I2C communication with AD5933
- AD5933 configuration
- frequency control
- reading real/imaginary registers
- gain-factor calibration
- magnitude calculation
- phase calculation
- optional feature calculation
- temperature acquisition
- serial communication with FPGA
- optional WiFi/cloud communication
- debug logging

The Heltec should initially run the complete system without FPGA.

This creates a known-good reference implementation.

---

## 3.3 FPGA

Responsible for:

- receiving feature stream
- input validation
- filtering
- control/test differential calculation
- rolling statistics
- slope estimation
- stability detection
- confidence/state logic
- STOP / REPEAT decision
- status reporting

The FPGA should NOT initially perform:

- floating-point arithmetic
- square root
- division
- full impedance calibration
- nonlinear equivalent-circuit fitting
- FFT/DFT
- machine learning

Those belong outside the FPGA in V1.

---

# 4. WHY THIS PARTITION EXISTS

The AD5933 already performs the high-frequency acquisition and DFT.

The Heltec ESP32-S3 is capable of handling:

    sqrt(R² + I²)

and other host-side arithmetic.

Trying to reproduce this in Verilog is unnecessary for the hackathon.

The FPGA should instead process a clean integer feature stream.

This minimizes:

- FPGA development time
- fixed-point complexity
- timing problems
- synthesis risk
- debugging time

---

# 5. FPGA INPUT

The first implementation should use UART.

SPI may be added later.

## V1 communication

HELTEC → UART TX → FPGA UART RX

FPGA → UART TX → HELTEC RX

Recommended:

    115200 baud
    8 data bits
    no parity
    1 stop bit

Format:

    8N1

---

# 6. DATA PACKET

Use a binary packet.

Do NOT send ASCII during the primary implementation.

Packet:

BYTE 0   = 0xAA
BYTE 1   = 0x55
BYTE 2   = packet type
BYTE 3   = sequence number
BYTE 4   = feature MSB
BYTE 5   = feature LSB
BYTE 6   = control feature MSB
BYTE 7   = control feature LSB
BYTE 8   = test feature MSB
BYTE 9   = test feature LSB
BYTE 10  = temperature MSB
BYTE 11  = temperature LSB
BYTE 12  = flags
BYTE 13  = checksum

Initial implementation may simplify this to:

    HEADER
    SEQUENCE
    FEATURE
    CHECKSUM

But implement the parser so additional fields can be added.

---

# 7. RECOMMENDED INITIAL PACKET

For the first working FPGA version:

BYTE 0 = 0xAA
BYTE 1 = 0x55
BYTE 2 = 0x01       // DATA packet
BYTE 3 = sequence
BYTE 4 = feature[15:8]
BYTE 5 = feature[7:0]
BYTE 6 = checksum

Feature is a signed or unsigned 16-bit fixed-point value.

Recommended first feature:

    |Z|

Do NOT initially transmit floating-point values.

---

# 8. FUTURE PACKET TYPES

Packet type:

0x01 = DATA
0x02 = CONFIG
0x03 = START
0x04 = STOP
0x05 = STATUS
0x06 = HEARTBEAT
0x07 = TEMPERATURE
0x08 = ERROR

---

# 9. FPGA OUTPUT PACKET

FPGA should return:

BYTE 0 = 0xAA
BYTE 1 = 0x55
BYTE 2 = STATUS
BYTE 3 = sequence
BYTE 4 = state
BYTE 5 = confidence MSB
BYTE 6 = confidence LSB
BYTE 7 = slope MSB
BYTE 8 = slope LSB
BYTE 9 = flags
BYTE 10 = checksum

---

# 10. FPGA STATE MACHINE

Required states:

IDLE
WAIT_DATA
FILTER
CALCULATE_DIFF
CALCULATE_SLOPE
CALCULATE_STABILITY
DECIDE
STOP
REPEAT
ERROR

State flow:

                    ┌───────────┐
                    │   IDLE    │
                    └─────┬─────┘
                          │ START
                          ▼
                    ┌───────────┐
                    │WAIT_DATA  │
                    └─────┬─────┘
                          │ DATA
                          ▼
                    ┌───────────┐
                    │  FILTER   │
                    └─────┬─────┘
                          ▼
                  ┌────────────────┐
                  │ CALCULATE DIFF │
                  └───────┬────────┘
                          ▼
                  ┌────────────────┐
                  │    SLOPE       │
                  └───────┬────────┘
                          ▼
                  ┌────────────────┐
                  │   STABILITY    │
                  └───────┬────────┘
                          ▼
                     ┌──────────┐
                     │ DECISION │
                     └────┬─────┘
                          │
              ┌───────────┴───────────┐
              │                       │
              ▼                       ▼
           REPEAT                    STOP
              │                       │
              └─────────→             │
                                      ▼
                                     IDLE

---

# 11. FPGA PIPELINE

INPUT

    feature[n]

↓

FILTER

    filtered[n]

↓

DIFFERENTIAL

    delta[n]

↓

SLOPE

    slope[n]

↓

STABILITY

    variance/range of recent slope

↓

DECISION

    STOP / REPEAT

---

# 12. IMPORTANT: FEATURE DEFINITIONS

V1 should support:

    F = |Z|

Future versions:

    F = phase
    F = real(Z)
    F = imaginary(Z)
    F = Rct
    F = normalized impedance

Therefore use a generic variable name:

    feature

NOT:

    bacterial_signal

NOT:

    AST_signal

The FPGA does not know whether the feature represents biological response.

It only processes the numerical stream.

---

# 13. DIFFERENTIAL MEASUREMENT

If both control and test features are available:

    delta[n] = test[n] - control[n]

Use signed fixed-point arithmetic.

Example:

    control = 10200
    test    = 10500

    delta = +300

If:

    control = 10500
    test    = 10200

    delta = -300

Use two's-complement signed representation.

---

# 14. FIRST IMPLEMENTATION

Do NOT begin with complex statistics.

Implement:

    delta = test - control

Then:

    slope = delta[n] - delta[n-k]

Then:

    stable if abs(slope) < SLOPE_THRESHOLD

Then:

    confidence condition

This is sufficient for V1.

---

# 15. FILTER

Use a moving average.

First implementation:

    N = 4

    filtered[n] =
        (x[n] +
         x[n-1] +
         x[n-2] +
         x[n-3]) / 4

Because division by 4 is simply a right shift:

    filtered = sum >> 2

This is FPGA-friendly.

Do not implement floating point.

---

# 16. SLOPE

Use:

    slope[n] = delta[n] - delta[n-k]

Start with:

    k = 4

This is intentionally simple.

Later:

    k = configurable

The FPGA should expose k as a register.

---

# 17. STABILITY

Do NOT implement floating-point standard deviation in V1.

Instead use a range-based stability metric.

For a window:

    slope[0]
    slope[1]
    ...
    slope[N-1]

calculate:

    max_slope
    min_slope

Then:

    range = max_slope - min_slope

Stable:

    range < STABILITY_THRESHOLD

This is far easier to implement than variance.

---

# 18. CONFIDENCE

DO NOT implement:

    confidence =
        abs(delta) / sigma

in V1.

Division is unnecessary.

Instead define:

    SIGNAL_THRESHOLD
    SLOPE_THRESHOLD
    STABILITY_THRESHOLD
    MIN_SAMPLES

Decision:

    if abs(delta) < SIGNAL_THRESHOLD:
        REPEAT

    else if abs(slope) < SLOPE_THRESHOLD:
        REPEAT

    else if slope_range > STABILITY_THRESHOLD:
        REPEAT

    else:
        STOP

This is a prototype measurement-confidence rule.

It is NOT clinical confidence.

---

# 19. BETTER V1 DECISION LOGIC

Require consecutive stable windows.

Example:

    STABLE_REQUIRED = 5

Every time a stable window occurs:

    stable_count += 1

If:

    stable_count >= 5

then:

    STOP

If instability occurs:

    stable_count = 0

This prevents one lucky sample from triggering STOP.

---

# 20. TIMEOUT

There MUST be a maximum measurement count.

Example:

    MAX_SAMPLES = 1000

If:

    sample_count >= MAX_SAMPLES

then:

    TIMEOUT

and report:

    INCONCLUSIVE / CONTINUE

Do NOT force a biological result.

---

# 21. STATE OUTPUT CODES

Use:

0x00 = IDLE
0x01 = MEASURING
0x02 = FILTERING
0x03 = LOW_SIGNAL
0x04 = UNSTABLE
0x05 = REPEAT
0x06 = CONFIDENT
0x07 = STOP
0x08 = TIMEOUT
0x09 = ERROR

---

# 22. LED DEBUGGING

Use onboard/external LEDs for immediate debugging.

LED 0:

    FPGA alive

LED 1:

    UART packet received

LED 2:

    MEASURING

LED 3:

    REPEAT

LED 4:

    STOP

This is mandatory for initial integration.

---

# 23. UART DEBUG MODE

Before binary packet mode works, implement an optional debug mode.

FPGA should be able to output:

    RX OK
    FEATURE = xxxx
    DELTA = xxxx
    SLOPE = xxxx
    STATE = xx

This is only for debugging.

Final demo should use binary packets/dashboard.

---

# 24. HELTEC SOFTWARE ARCHITECTURE

Create these modules:

    ad5933_driver.cpp
    impedance.cpp
    calibration.cpp
    feature.cpp
    uart_fpga.cpp
    telemetry.cpp
    main.cpp

---

# 25. AD5933 DRIVER

Required functions:

    ad5933_init()

    ad5933_reset()

    ad5933_config_frequency()

    ad5933_start_measurement()

    ad5933_read_status()

    ad5933_read_real()

    ad5933_read_imaginary()

    ad5933_read_temperature()

---

# 26. AD5933 CALIBRATION

The AD5933 outputs raw real/imaginary data.

For calibration impedance:

    Zcal

calculate:

    magnitude =
        sqrt(real² + imaginary²)

Gain factor:

    GF =
        1 / (magnitude * Zcal)

Then for unknown impedance:

    magnitude =
        sqrt(real² + imaginary²)

    Z =
        1 / (magnitude * GF)

The exact implementation must follow the AD5933 datasheet and selected excitation/gain configuration.

IMPORTANT:

The gain factor depends on the excitation/gain configuration.

Do not use one GF across incompatible configurations.

---

# 27. FIRST AD5933 TEST

Use:

    Zcal = 10 kΩ

Initial frequency:

    10 kHz

Single frequency only.

Do NOT begin with a full sweep.

Expected sequence:

    configure
        ↓
    initialize
        ↓
    start frequency
        ↓
    wait for valid data
        ↓
    read R
        ↓
    read I
        ↓
    calculate magnitude
        ↓
    calculate Z
        ↓
    send feature to FPGA

---

# 28. SECOND AD5933 TEST

After the 10 kΩ test works:

    1 kΩ
    10 kΩ
    100 kΩ

Compare measured vs expected.

Record:

    expected
    measured
    error %

Do not proceed to biological testing until this works.

---

# 29. FREQUENCY SWEEP

Only after single-frequency mode is stable.

Potential V1 sweep:

    5 kHz
    10 kHz
    20 kHz
    50 kHz

These are engineering characterization points, NOT yet a biological optimum.

The AD5933 supports programmable frequency sweeps and provides real/imaginary output at each completed frequency point.

---

# 30. TEMPERATURE

Read AD5933 internal temperature.

Transmit temperature to FPGA or PC.

Do not implement thermal compensation initially.

Simply log:

    timestamp
    feature
    temperature

This allows later analysis of temperature-feature correlation.

---

# 31. OPTIONAL CLOUD

Cloud is NOT part of the critical path.

Priority:

    AD5933
       ↓
    Heltec
       ↓
    FPGA
       ↓
    STOP/REPEAT

ONLY AFTER THIS WORKS:

    Heltec
       ↓
      WiFi
       ↓
    dashboard/cloud

Cloud should never control the measurement loop in V1.

---

# 32. OPTIONAL WEB DASHBOARD

If time allows:

Display:

    impedance
    frequency
    control
    test
    delta
    slope
    state
    temperature
    sample count

Example:

------------------------------------
PHENORA LIVE
------------------------------------

Feature       10,542
Control       10,120
Test          10,542
Delta            422

Slope             18

Temperature     25.4 C

State          MEASURING

Confidence     BUILDING...

Stable windows: 3 / 5

------------------------------------

---

# 33. FPGA REGISTER MAP

Create a simple register interface.

REGISTER 0x00

    CONTROL

bit 0 = START
bit 1 = RESET
bit 2 = ENABLE
bit 3 = DEBUG

REGISTER 0x01

    STATUS

bit 0 = RUNNING
bit 1 = STOP
bit 2 = REPEAT
bit 3 = ERROR
bit 4 = TIMEOUT

REGISTER 0x02

    SIGNAL_THRESHOLD

REGISTER 0x03

    SLOPE_THRESHOLD

REGISTER 0x04

    STABILITY_THRESHOLD

REGISTER 0x05

    STABLE_REQUIRED

REGISTER 0x06

    SAMPLE_COUNT

---

# 34. FIXED-POINT

Do not use float in FPGA.

Recommended initial format:

    signed 16-bit

If range becomes insufficient:

    signed 32-bit

Keep arithmetic wider internally.

Example:

16-bit input

    +
16-bit input

→

17-bit accumulator

For moving average:

    4 samples

Use:

    18-bit accumulator

then:

    >> 2

---

# 35. ABSOLUTE VALUE

For signed two's complement x:

    if x < 0:
        abs_x = -x
    else:
        abs_x = x

Handle minimum negative number carefully.

---

# 36. OVERFLOW PROTECTION

Every arithmetic block must have saturation or enough guard bits.

Especially:

    sum
    delta
    slope
    max/min
    counters

Do not allow silent wraparound.

---

# 37. SYNTHETIC TEST MODE

This is extremely important.

The FPGA must support synthetic input.

Instead of requiring AD5933:

    synthetic feature generator
        ↓
       FPGA
        ↓
    adaptive FSM

Test patterns:

PATTERN 0:
constant

PATTERN 1:
slow drift

PATTERN 2:
step change

PATTERN 3:
noise

PATTERN 4:
slow biological-like divergence

PATTERN 5:
unstable signal

This allows FPGA development before the analog hardware is finished.

---

# 38. REQUIRED FPGA TEST CASES

TEST 1

constant signal

Expected:

    stable

TEST 2

small noisy signal

Expected:

    REPEAT

TEST 3

large unstable change

Expected:

    REPEAT

TEST 4

large stable change

Expected:

    STOP

TEST 5

signal returns to baseline

Expected:

    REPEAT / RESET

TEST 6

no packets

Expected:

    TIMEOUT / ERROR

---

# 39. SYNTHETIC BIOLOGICAL DEMO

Do NOT claim the synthetic signal is bacterial data.

Use it only to demonstrate the algorithm.

Example:

CONTROL:

    1000
    1002
    1001
    1003
    ...

TEST:

    1000
    1002
    1001
    1010
    1025
    1040
    1050
    1052
    1051
    1052

The FPGA should detect:

    divergence
        ↓
    slope
        ↓
    stable plateau
        ↓
    STOP

The dashboard can display:

    MEASUREMENT SUFFICIENT
    STOP

---

# 40. IMPORTANT SCIENTIFIC LANGUAGE

Never label the synthetic demo:

    ANTIBIOTIC RESISTANT
    ANTIBIOTIC SUSCEPTIBLE

Label it:

    SYNTHETIC TEST SIGNAL

or:

    ELECTRICAL ALGORITHM VALIDATION

Biological AST interpretation comes later.

---

# 41. DEVELOPMENT ORDER

DO NOT start by implementing everything.

Follow this exact order.

## DAY 1

### TASK 1

Blink FPGA LED.

SUCCESS:

    FPGA programmed
    clock works

---

### TASK 2

UART RX.

SUCCESS:

    FPGA receives 0xAA

---

### TASK 3

UART TX.

SUCCESS:

    FPGA sends ACK

---

### TASK 4

Packet parser.

SUCCESS:

    feature received

---

### TASK 5

Register feature.

SUCCESS:

    feature visible in debug output

---

### TASK 6

Moving average.

SUCCESS:

    filtered signal correct

---

## DAY 2

### TASK 7

Differential calculation.

SUCCESS:

    test - control

---

### TASK 8

Slope.

SUCCESS:

    delta[n] - delta[n-k]

---

### TASK 9

Stability.

SUCCESS:

    max-min window

---

### TASK 10

FSM.

SUCCESS:

    STOP / REPEAT

---

### TASK 11

Heltec integration.

SUCCESS:

    AD5933 → Heltec → FPGA

---

### TASK 12

Dashboard.

ONLY IF TIME REMAINS.

---

# 42. CRITICAL FALLBACK

If FPGA integration fails:

DO NOT stop the project.

Run:

    AD5933
       ↓
    Heltec
       ↓
    Python/dashboard

and demonstrate the algorithm in software.

The FPGA can still display:

    READY
    MEASURE
    STOP

But the primary algorithm should remain available in the Heltec/Python reference implementation.

---

# 43. SECOND FALLBACK

If AD5933 fails:

    555
      ↓
    analog front-end
      ↓
    ADS1115
      ↓
    Heltec
      ↓
    FPGA

The FPGA interface should NOT change.

The Heltec should simply produce the same:

    FEATURE

packet.

This is why the FPGA must not know whether the source is AD5933 or ADS1115.

---

# 44. HARDWARE ABSTRACTION

The FPGA receives:

    FEATURE

It does NOT receive:

    "AD5933 data"

The Heltec converts hardware-specific information into a generic feature stream.

Therefore:

AD5933

OR

555 + ADS1115

can use exactly the same FPGA pipeline.

---

# 45. V1 DATA FLOW

Final intended data flow:

AD5933

    ↓ I2C

Heltec

    ↓

R/I

    ↓

magnitude / feature

    ↓ UART

FPGA

    ↓

filter

    ↓

delta

    ↓

slope

    ↓

stability

    ↓

adaptive FSM

    ↓ UART

Heltec

    ↓

dashboard / cloud

---

# 46. SUCCESS CRITERIA

V1 FPGA is considered COMPLETE when:

[ ] FPGA programs successfully

[ ] UART RX works

[ ] UART TX works

[ ] packet parser works

[ ] synthetic data mode works

[ ] moving average works

[ ] differential calculation works

[ ] slope calculation works

[ ] stability calculation works

[ ] STOP state works

[ ] REPEAT state works

[ ] timeout works

[ ] Heltec can send feature data

[ ] FPGA returns state

[ ] complete loop works

---

# 47. NOT REQUIRED FOR V1

Do NOT implement:

[ ] machine learning

[ ] neural network

[ ] Bayesian inference

[ ] SPRT

[ ] Kalman filter

[ ] floating-point arithmetic

[ ] nonlinear Randles fitting

[ ] Rct extraction in FPGA

[ ] cloud-dependent control

[ ] clinical S/I/R classification

[ ] DEP

[ ] microfluidics

These are future research directions.

---

# 48. FUTURE VERSION

V2:

    complex impedance vector
       ↓
    multiple frequencies
       ↓
    equivalent circuit
       ↓
    Rct / Cdl
       ↓
    adaptive feature selection

V3:

    DEP concentration
       ↓
    interfacial sensing
       ↓
    adaptive EIS

V4:

    sample preparation
       ↓
    cartridge

V5:

    clinical validation
       ↓
    positive blood culture
       ↓
    rapid AST

---

# 49. THE CORE FPGA IDEA

The FPGA is NOT the impedance analyzer.

The FPGA is the:

    EDGE DECISION ENGINE

It receives a stream of measurements and asks:

    "Do I have enough stable evidence to stop measuring?"

That is the core PHENORA computational concept.

---

# 50. FINAL IMPLEMENTATION TARGET

                    SENSOR
                      │
                      ▼
                  AD5933
                      │
                      ▼
                   HELTEC
                      │
                FEATURE STREAM
                      │
                      ▼
                ┌─────────────┐
                │    FPGA     │
                │             │
                │ FILTER      │
                │     ↓       │
                │ ΔFEATURE    │
                │     ↓       │
                │ SLOPE       │
                │     ↓       │
                │ STABILITY   │
                │     ↓       │
                │ FSM         │
                └──────┬──────┘
                       │
                 STOP / REPEAT
                       │
                       ▼
                    HELTEC
                       │
                       ▼
                 DASHBOARD

This is the V1 target.

DO NOT expand the scope until this works.