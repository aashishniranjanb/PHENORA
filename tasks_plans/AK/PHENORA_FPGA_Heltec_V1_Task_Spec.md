# PHENORA V1 — FPGA + Heltec WiFi Kit 32 V3 Integration Task Specification

**Version:** V1.0  
**Date:** 26 August 2026  
**Target:** Hackathon MVP  
**FPGA:** VSDSquadron FPGA Mini (FM), Lattice iCE40UP5K  
**MCU:** Heltec WiFi Kit 32 V3, ESP32-S3FN8  
**Primary impedance front-end:** AD5933  
**Fallback:** 555 + analog front-end + ADS1115

---

## 0. Mission

The FPGA engineer owns two layers:

1. **FPGA edge-processing layer**
2. **Heltec ↔ FPGA communication/integration layer**

The intended V1 pipeline is:

```text
AD5933
   │
   │ I²C
   ▼
Heltec WiFi Kit 32 V3
   │
   │ calculate calibrated impedance feature
   │
   │ UART
   ▼
VSDSquadron FPGA Mini
   │
   ├── packet parser
   ├── filter
   ├── differential calculation
   ├── slope
   ├── stability
   └── adaptive FSM
   │
   └── STOP / REPEAT / ERROR
   │
   ▼
Heltec
   │
   ├── OLED
   ├── USB serial
   └── optional Wi-Fi dashboard
```

### Critical scope rule

The FPGA is **not** the AD5933 driver.

The Heltec owns the AD5933 I²C interface and host-side arithmetic.

The FPGA receives a clean integer feature stream and performs deterministic edge processing.

---

# 1. What the FPGA must NOT do in V1

Do not spend hackathon time implementing:

- floating-point arithmetic
- square root
- division-based confidence
- AD5933 I²C driver
- DFT
- FFT
- nonlinear Randles fitting
- Rct extraction inside FPGA
- machine learning
- Bayesian inference
- SPRT
- cloud communication
- clinical S/I/R classification

These can be future versions.

---

# 2. What the FPGA MUST do

Required V1 functions:

- UART RX
- UART TX
- packet synchronization
- packet validation
- sequence tracking
- feature register
- moving-average filter
- control/test differential calculation
- slope calculation
- stability calculation
- threshold comparison
- consecutive-stability counter
- timeout
- adaptive state machine
- status output
- debug LEDs
- synthetic test mode

---

# 3. Scientific meaning of the FPGA input

The FPGA receives a generic numerical feature.

Call it:

```text
feature
```

Do NOT call it:

```text
AST_result
bacterial_signal
resistance
```

unless the Heltec has explicitly calculated that quantity.

For V1 the first feature can be:

```text
|Z|
```

Later the feature can become:

```text
phase
real(Z)
imaginary(Z)
Rct
normalized impedance
```

The FPGA architecture should not change when the feature changes.

---

# 4. Hardware connection

## 4.1 AD5933 → Heltec

The Heltec communicates with the AD5933 over I²C.

Conceptually:

```text
AD5933 SDA ───────── Heltec I²C SDA
AD5933 SCL ───────── Heltec I²C SCL
AD5933 GND ───────── Heltec GND
```

The exact AD5933 module supply and I²C pull-up arrangement must be checked against the module schematic before wiring.

Do not assume every third-party AD5933 breakout has the same power circuitry.

---

# 5. Heltec → FPGA physical UART connection

Use a simple 3-wire UART connection.

```text
HELTEC V3                         VSDSQUADRON FM

GPIO1 / UART TX  ───────────────► FPGA UART RX

GPIO2 / UART RX  ◄─────────────── FPGA UART TX

GND              ──────────────── GND
```

### Why GPIO1/GPIO2?

Heltec's current official V3 GPIO guide identifies GPIO1, GPIO2, GPIO4, GPIO5, GPIO6, GPIO7, GPIO19, GPIO20, GPIO47 and GPIO48 as suitable external-use GPIOs. The guide also warns against using boot/flash/USB-reserved pins casually. citeturn0search0

The ESP32-S3 itself has three UART controllers and allows UART signals to be routed through the GPIO matrix. citeturn0search37

### Important

Do NOT reuse Heltec GPIO43/GPIO44 for this connection unless you intentionally want to sacrifice the normal USB/UART debug path.

Heltec documents GPIO43/GPIO44 as associated with the USB serial/download interface. citeturn0search0turn0search37

---

# 6. Voltage / ground rule

Both boards should use compatible 3.3 V logic.

The VSDSquadron FM provides 3.3 V I/O, and its documentation exposes 32 FPGA GPIOs for prototyping. citeturn1search4turn1search25

The ESP32-S3 GPIO domain is also 3.3 V logic.

### MUST:

```text
Heltec GND ───── FPGA GND
```

Without a common ground, UART communication may be unreliable.

### DO NOT:

- connect 5 V directly to an FPGA GPIO
- connect 5 V directly to an ESP32 GPIO
- connect TX to TX
- connect RX to RX

Correct:

```text
TX → RX
RX → TX
GND → GND
```

---

# 7. FPGA physical pin assignment

The FPGA engineer must create a project-specific `.pcf`.

Do NOT assume that the number printed in an online example is automatically the correct physical header position on your board.

The VSDSquadron FM board documentation provides the FPGA package/I/O information and 32 accessible GPIOs. citeturn1search4turn1search25

Select two unused accessible FPGA GPIOs:

```text
fpga_uart_rx  → chosen accessible GPIO
fpga_uart_tx  → chosen accessible GPIO
```

Then map them in:

```text
VSDSquadronFM.pcf
```

Example structure:

```text
set_io fpga_uart_rx <VERIFIED_FPGA_PIN>
set_io fpga_uart_tx <VERIFIED_FPGA_PIN>
```

### DO NOT copy a random pin number from GitHub without checking the board PCF/schematic.

Existing VSDSquadron examples demonstrate UART projects and show that the PCF is the authoritative mapping between HDL signals and board pins. citeturn2search0turn2search1

---

# 8. Recommended physical wiring

Use short jumper wires.

```text
                 UART

        HELTEC V3
       ┌───────────┐
       │           │
       │ GPIO1 TX  ├──────────────────► FPGA RX
       │           │
       │ GPIO2 RX  │◄────────────────── FPGA TX
       │           │
       │ GND       ├─────────────────── FPGA GND
       │           │
       └───────────┘


              VSDSQUADRON FM
```

For the first test, do not connect the AD5933.

First prove:

```text
Heltec ↔ FPGA
```

---

# 9. Communication protocol

## V1 physical layer

UART:

```text
Baud rate: 115200
Data:      8 bits
Parity:    None
Stop:      1
Flow:      None
```

Format:

```text
115200 8N1
```

Both devices MUST use exactly the same baud configuration.

---

# 10. V1 packet format

Use binary packets.

Do not make the primary protocol ASCII.

### DATA packet

```text
BYTE 0   0xAA        Header 1
BYTE 1   0x55        Header 2
BYTE 2   0x01        Packet type = DATA
BYTE 3   sequence    8-bit sequence number
BYTE 4   feature[15:8]
BYTE 5   feature[7:0]
BYTE 6   flags
BYTE 7   checksum
```

Total:

```text
8 bytes
```

---

# 11. Checksum

For V1 use a simple XOR checksum.

```text
checksum =
    byte2 XOR
    byte3 XOR
    byte4 XOR
    byte5 XOR
    byte6
```

The FPGA rejects the packet if the checksum does not match.

Later versions can use CRC-8.

---

# 12. Packet types

```text
0x01 = DATA
0x02 = CONFIG
0x03 = START
0x04 = RESET
0x05 = HEARTBEAT
0x06 = STATUS_REQUEST
0x07 = SYNTHETIC_TEST
```

FPGA response:

```text
0x81 = DATA_ACK
0x82 = CONFIG_ACK
0x83 = STATUS
0x84 = ERROR
```

---

# 13. First packet test

Heltec sends:

```text
AA 55 01 01 03 E8 00 XX
```

Interpretation:

```text
AA 55 = header
01    = DATA
01    = sequence
03E8  = 1000
00    = flags
XX    = checksum
```

The FPGA must decode:

```text
feature = 1000
```

and return an ACK/status packet.

---

# 14. FPGA UART modules

Create:

```text
uart_rx.v
uart_tx.v
packet_rx.v
packet_tx.v
checksum.v
```

### uart_rx.v

Responsibilities:

- detect start bit
- sample 8 data bits
- verify stop bit
- produce:

```text
rx_data
rx_valid
rx_error
```

### uart_tx.v

Responsibilities:

- accept byte
- generate start bit
- transmit 8 data bits LSB first
- generate stop bit
- produce:

```text
tx_busy
tx_done
```

---

# 15. Packet parser FSM

Implement:

```text
WAIT_HEADER_1
WAIT_HEADER_2
READ_TYPE
READ_SEQUENCE
READ_FEATURE_MSB
READ_FEATURE_LSB
READ_FLAGS
READ_CHECKSUM
VALIDATE
DISPATCH
```

If an invalid header appears:

```text
return to WAIT_HEADER_1
```

If checksum fails:

```text
ERROR
```

Do not crash or hang the parser.

---

# 16. FPGA top-level architecture

Recommended RTL structure:

```text
top.v
│
├── clock_gen.v
├── reset_sync.v
│
├── uart_rx.v
├── uart_tx.v
│
├── packet_rx.v
├── packet_tx.v
├── checksum.v
│
├── feature_filter.v
├── differential.v
├── slope.v
├── stability.v
├── threshold.v
│
├── adaptive_fsm.v
│
├── synthetic_generator.v
└── debug_leds.v
```

---

# 17. Clock

The VSDSquadron FM documentation identifies an onboard 12 MHz clock and also supports the iCE40 internal oscillator. citeturn1search25

For the first implementation, use the verified board clock/clocking arrangement from the board example project.

If using a 12 MHz clock:

```text
Fclk = 12 MHz
```

UART divisor for 115200 baud is approximately:

```text
12,000,000 / 115,200 ≈ 104.17
```

Use a UART baud-rate generator with an appropriate integer/fractional timing strategy.

Do not blindly assume one divider gives perfect timing.

The UART implementation must be verified in simulation and hardware.

---

# 18. First FPGA task — FPGA HELLO

Create:

```text
fpga_hello/
```

Files:

```text
top.v
uart_tx.v
VSDSquadronFM.pcf
Makefile
```

Behavior:

```text
FPGA power on
     ↓
initialize
     ↓
wait
     ↓
send "FPGA_READY"
     ↓
repeat every ~1 second
```

Success:

PC serial terminal receives:

```text
FPGA_READY
FPGA_READY
FPGA_READY
...
```

This proves:

- FPGA clock
- UART TX
- pin assignment
- synthesis
- flashing
- serial output

---

# 19. Second task — UART RX

Create:

```text
uart_rx_test/
```

Heltec sends:

```text
0x55
```

FPGA receives it.

When received:

```text
RGB LED = GREEN
```

or another clearly defined status.

Success:

```text
Heltec TX
   ↓
FPGA RX
   ↓
LED/status changes
```

---

# 20. Third task — UART loopback

Create:

```text
uart_loopback/
```

Behavior:

```text
Heltec
   ↓
FPGA RX
   ↓
FPGA TX
   ↓
Heltec
```

If Heltec sends:

```text
HELLO
```

it should receive:

```text
HELLO
```

This must work before the PHENORA packet protocol.

---

# 21. Fourth task — binary packet parser

Send:

```text
AA 55 01 01 03 E8 00 XX
```

FPGA extracts:

```text
packet_type = 1
sequence    = 1
feature     = 1000
flags       = 0
```

Return:

```text
ACK
```

---

# 22. Fifth task — synthetic feature mode

The FPGA must be testable without the AD5933.

The Heltec can generate synthetic data.

Preferred:

```text
Heltec
   ↓
synthetic feature stream
   ↓
UART
   ↓
FPGA
```

Do NOT use an LDR unless you specifically want an extra physical demo.

Synthetic numerical data is cleaner and deterministic.

---

# 23. Synthetic test pattern A — stable

Send:

```text
1000
1001
1000
1001
1000
1001
...
```

Expected:

```text
STABLE
```

---

# 24. Synthetic test pattern B — slow drift

Send:

```text
1000
1002
1004
1006
1008
1010
...
```

Expected:

```text
MEASURING
```

Do not immediately stop unless the stability criteria are met.

---

# 25. Synthetic test pattern C — strong stable divergence

Example:

```text
1000
1002
1005
1010
1020
1030
1040
1041
1040
1041
1040
1041
...
```

Expected:

```text
confidence condition met
     ↓
STOP
```

---

# 26. Synthetic test pattern D — unstable

```text
1000
1100
950
1150
900
1200
870
1250
...
```

Expected:

```text
REPEAT
```

---

# 27. Differential architecture

For a future two-channel implementation:

```text
CONTROL
   │
   ▼
control_feature

TEST
   │
   ▼
test_feature
```

Then:

```text
delta = test_feature - control_feature
```

Use signed arithmetic.

---

# 28. Important V1 integration simplification

For the very first FPGA integration, use ONE feature stream.

```text
Heltec
   ↓
feature
   ↓
FPGA
```

Once this works, add:

```text
control_feature
test_feature
```

Do not debug UART, two channels, AD5933, filtering, and adaptive logic simultaneously.

---

# 29. Differential packet — V1.1

When one-channel mode works, expand DATA packet:

```text
BYTE 0   0xAA
BYTE 1   0x55
BYTE 2   0x10
BYTE 3   sequence

BYTE 4   control[15:8]
BYTE 5   control[7:0]

BYTE 6   test[15:8]
BYTE 7   test[7:0]

BYTE 8   temperature[15:8]
BYTE 9   temperature[7:0]

BYTE 10  flags
BYTE 11  checksum
```

Then FPGA calculates:

```text
delta = test - control
```

---

# 30. Feature filter

Use a 4-sample moving average.

```text
y[n] =
(x[n] +
 x[n-1] +
 x[n-2] +
 x[n-3]) >> 2
```

Advantages:

- no division hardware
- deterministic
- tiny resource usage
- easy to verify

---

# 31. Filter module

File:

```text
feature_filter.v
```

Inputs:

```text
clk
reset
sample_valid
sample_in
```

Outputs:

```text
sample_out
sample_out_valid
```

Required:

- 4-sample history
- accumulator
- right shift
- valid pipeline

---

# 32. Differential module

File:

```text
differential.v
```

Inputs:

```text
control
test
valid
```

Output:

```text
delta
valid
```

Use signed two's-complement arithmetic.

---

# 33. Slope module

File:

```text
slope.v
```

V1:

```text
slope[n] =
delta[n] - delta[n-4]
```

Therefore maintain a 4-sample delay line.

Output:

```text
slope
slope_valid
```

---

# 34. Absolute value

Use signed integer logic.

Concept:

```text
if x < 0:
    abs_x = -x
else:
    abs_x = x
```

Use enough bits to prevent overflow on the most-negative signed value.

---

# 35. Stability module

Do NOT calculate floating-point variance.

Use:

```text
max_slope
min_slope

range =
max_slope - min_slope
```

Stable if:

```text
range < STABILITY_THRESHOLD
```

Use a configurable window.

Initial:

```text
WINDOW = 8
```

---

# 36. Adaptive state machine

File:

```text
adaptive_fsm.v
```

States:

```text
IDLE
MEASURING
LOW_SIGNAL
UNSTABLE
STABLE_CHECK
STOP
TIMEOUT
ERROR
```

---

# 37. Recommended decision logic

V1 should NOT use:

```text
confidence =
abs(delta) / sigma
```

because that introduces unnecessary division and can become numerically unstable.

Instead:

```text
signal_ok =
abs(delta) >= SIGNAL_THRESHOLD

slope_ok =
abs(slope) <= SLOPE_THRESHOLD

stable_ok =
slope_range <= STABILITY_THRESHOLD
```

Then:

```text
if !signal_ok:
    LOW_SIGNAL

else if !stable_ok:
    UNSTABLE

else:
    stable_count++

if stable_count >= STABLE_REQUIRED:
    STOP
```

---

# 38. Consecutive stability

Never stop after one stable sample.

Use:

```text
STABLE_REQUIRED = 5
```

Example:

```text
stable
stable
stable
stable
stable
     ↓
STOP
```

If instability appears:

```text
stable_count = 0
```

---

# 39. Timeout

Use:

```text
MAX_SAMPLES
```

If:

```text
sample_count >= MAX_SAMPLES
```

then:

```text
TIMEOUT
```

Output:

```text
INCONCLUSIVE
```

Do not force STOP.

---

# 40. FPGA status output

Return:

```text
state
delta
slope
sample_count
flags
```

Suggested status states:

```text
0x00 IDLE
0x01 MEASURING
0x02 LOW_SIGNAL
0x03 UNSTABLE
0x04 STABLE_CHECK
0x05 STOP
0x06 TIMEOUT
0x07 ERROR
```

---

# 41. Debug LEDs

Use onboard RGB LED.

Suggested:

```text
BLUE   = FPGA alive
GREEN  = UART packet received
YELLOW = measuring
RED    = error
WHITE  = STOP
```

If RGB behavior is active-low/current-controlled on the board, verify polarity using the board example.

Existing VSDSquadron examples use pins 39/40/41 for RGB LED control. citeturn1search0turn2search1

---

# 42. Heltec software responsibilities

Create:

```text
phenora_heltec/
│
├── main.cpp
├── ad5933_driver.cpp
├── ad5933_driver.h
├── calibration.cpp
├── calibration.h
├── feature.cpp
├── feature.h
├── fpga_uart.cpp
├── fpga_uart.h
├── protocol.cpp
├── protocol.h
└── dashboard.cpp
```

---

# 43. Heltec boot sequence

```text
BOOT
 ↓
initialize serial
 ↓
initialize FPGA UART
 ↓
initialize I2C
 ↓
initialize AD5933
 ↓
test FPGA link
 ↓
test AD5933
 ↓
enter measurement loop
```

If FPGA is not detected:

```text
FPGA_LINK_ERROR
```

If AD5933 is not detected:

```text
AD5933_ERROR
```

Do not silently continue.

---

# 44. Heltec FPGA UART

Use a dedicated ESP32-S3 UART peripheral.

Example conceptual Arduino configuration:

```cpp
HardwareSerial FPGA_UART(1);

FPGA_UART.begin(
    115200,
    SERIAL_8N1,
    FPGA_RX_PIN,
    FPGA_TX_PIN
);
```

With the proposed wiring:

```text
FPGA_RX_PIN = GPIO2
FPGA_TX_PIN = GPIO1
```

Be careful with naming:

From the Heltec perspective:

```text
GPIO1 = MCU TX → FPGA RX
GPIO2 = MCU RX ← FPGA TX
```

---

# 45. Do NOT use the same UART for debugging

Keep:

```text
USB serial / Serial
```

for debugging.

Use:

```text
HardwareSerial(1)
```

for FPGA communication.

This prevents debug logs from corrupting the binary FPGA protocol.

---

# 46. Heltec packet sender

Create:

```cpp
sendDataPacket(feature, sequence);
```

Responsibilities:

1. construct header
2. insert packet type
3. insert sequence
4. encode 16-bit feature
5. add flags
6. calculate XOR checksum
7. transmit bytes

---

# 47. Heltec packet receiver

Create:

```cpp
readFpgaStatus();
```

It should:

- find 0xAA
- find 0x55
- read packet type
- read sequence
- read state
- read values
- verify checksum
- update OLED/debug output

---

# 48. Endianness

Use:

```text
MSB first
```

for all multi-byte values.

Example 1000 decimal:

```text
1000 = 0x03E8

MSB = 0x03
LSB = 0xE8
```

Packet:

```text
03 E8
```

This must be identical in Heltec and FPGA.

---

# 49. Signed vs unsigned

Define explicitly.

Feature:

```text
uint16_t
```

if always positive.

Delta:

```text
int16_t
```

Slope:

```text
int16_t
```

Temperature:

```text
int16_t
```

if using fixed-point representation.

Do not mix signed and unsigned silently.

---

# 50. Fixed-point temperature

If temperature is transmitted:

Use 0.1°C units.

Example:

```text
25.4°C
```

becomes:

```text
254
```

FPGA can treat it as an integer.

---

# 51. Sequence numbers

Every DATA packet increments:

```text
0
1
2
...
255
0
...
```

FPGA detects missing packets.

Example:

expected:

```text
10
```

received:

```text
12
```

Then:

```text
packet_loss = 1
```

Set an error flag.

---

# 52. Heartbeat

Every ~1 second:

```text
HELTEC → HEARTBEAT
```

FPGA responds:

```text
STATUS
```

If no heartbeat/data for a configurable timeout:

```text
COMMUNICATION_ERROR
```

---

# 53. AD5933 integration sequence

Do NOT connect AD5933 first.

Order:

```text
1. FPGA hello
2. UART RX
3. UART loopback
4. packet parser
5. synthetic data
6. adaptive FSM
7. Heltec + FPGA
8. AD5933
```

Only then:

```text
AD5933 → Heltec → FPGA
```

---

# 54. AD5933 host-side pipeline

Heltec:

```text
AD5933
 ↓
status
 ↓
read real
 ↓
read imaginary
 ↓
magnitude
 ↓
calibration
 ↓
feature
 ↓
packet
 ↓
FPGA
```

The AD5933 documentation defines the real/imaginary measurement registers and the host-side impedance calculation/calibration flow.

---

# 55. First AD5933 frequency

Start with one frequency.

Suggested engineering starting point:

```text
10 kHz
```

This is a characterization choice, not a biological claim.

Do not start with a full frequency sweep.

---

# 56. First AD5933 load

Use:

```text
10 kΩ precision resistor
```

Then:

```text
1 kΩ
10 kΩ
100 kΩ
```

Record:

```text
expected
measured
error %
```

---

# 57. Do not put biology into the FPGA test

The FPGA should receive:

```text
1000
1001
1000
...
```

It does not care whether the source is:

- resistor
- liquid
- bacterial sample
- synthetic signal

This separation is intentional.

---

# 58. Software reference model

Before final FPGA logic, create a Python reference model.

Input:

```text
feature stream
```

Output:

```text
filtered
delta
slope
stability
state
```

The FPGA output must match the reference model.

This is the most important verification technique for the adaptive algorithm.

---

# 59. Verification strategy

Use three levels.

## Level 1 — unit simulation

Test:

```text
uart_rx
uart_tx
packet_parser
filter
differential
slope
stability
fsm
```

with Icarus Verilog/GTKWave or equivalent.

## Level 2 — hardware synthetic data

```text
Heltec
 ↓
synthetic generator
 ↓
UART
 ↓
FPGA
```

## Level 3 — real AD5933

```text
AD5933
 ↓
Heltec
 ↓
UART
 ↓
FPGA
```

---

# 60. Required simulation test vectors

### Vector A — constant

```text
1000
1000
1000
1000
...
```

Expected:

```text
stable
```

### Vector B — small noise

```text
999
1001
1000
1002
999
...
```

Expected:

```text
stable if thresholds permit
```

### Vector C — sudden change

```text
1000
1000
1000
1200
1300
...
```

Expected:

```text
UNSTABLE
```

### Vector D — plateau

```text
1000
1020
1040
1060
1080
1081
1080
1081
...
```

Expected:

```text
eventually STOP
```

### Vector E — communication loss

No packets.

Expected:

```text
TIMEOUT / ERROR
```

---

# 61. Definition of DONE — FPGA

The FPGA task is complete when all are true:

- [ ] board programs
- [ ] clock works
- [ ] LED test works
- [ ] UART TX works
- [ ] UART RX works
- [ ] loopback works
- [ ] binary packet parser works
- [ ] checksum works
- [ ] sequence tracking works
- [ ] feature register works
- [ ] synthetic input works
- [ ] moving average works
- [ ] differential works
- [ ] slope works
- [ ] stability works
- [ ] timeout works
- [ ] adaptive FSM works
- [ ] status packet works
- [ ] Heltec can drive the FPGA
- [ ] FPGA can return STOP/REPEAT
- [ ] real AD5933 data reaches FPGA

---

# 62. Definition of DONE — Heltec

- [ ] ESP32-S3 boots
- [ ] dedicated UART initialized
- [ ] FPGA detected
- [ ] FPGA loopback works
- [ ] binary packet sender works
- [ ] binary packet receiver works
- [ ] synthetic data mode works
- [ ] AD5933 detected
- [ ] AD5933 real/imaginary data read
- [ ] calibration works
- [ ] feature calculated
- [ ] feature transmitted
- [ ] FPGA state displayed
- [ ] OLED displays status
- [ ] optional Wi-Fi dashboard works

---

# 63. Optional cloud layer

Cloud is NOT on the critical path.

Architecture:

```text
                    FPGA
                      │
                 STOP/REPEAT
                      │
                    Heltec
                  /         \
                 /           \
             USB/OLED       Wi-Fi
                              │
                              ▼
                         Dashboard
```

The cloud should be read-only for V1.

Do NOT make:

```text
Cloud → FPGA → measurement control
```

The adaptive loop must work locally.

---

# 64. Suggested dashboard fields

```text
PHENORA V1

Connection:
  FPGA: CONNECTED
  AD5933: CONNECTED

Frequency:
  10 kHz

Feature:
  10542

Control:
  10120

Test:
  10542

Delta:
  +422

Slope:
  +18

Stability:
  STABLE

Temperature:
  25.4 °C

Samples:
  42

STATE:
  MEASURING

DECISION:
  CONTINUE
```

When enough stable windows occur:

```text
STATE:
  STOP

DECISION:
  MEASUREMENT SUFFICIENT
```

Do not display:

```text
SUSCEPTIBLE
RESISTANT
```

until biological validation exists.

---

# 65. Critical fallback tree

## If UART fails

Stop.

Fix:

```text
GPIO
GND
baud
TX/RX crossing
PCF
```

before touching AD5933.

## If FPGA synthesis fails

Reduce scope:

```text
UART
+
simple FSM
```

first.

## If FPGA adaptive algorithm fails

Run the reference algorithm on Heltec/Python.

Keep FPGA as communication/status hardware.

## If AD5933 fails

Switch to:

```text
555 + analog front-end + ADS1115
```

but keep the exact same:

```text
Heltec → FEATURE → FPGA
```

protocol.

## If cloud fails

Ignore cloud.

The local loop is the product demonstration.

---

# 66. Team handoff

## FPGA person owns

```text
VSDSquadron FM
    ↓
UART
    ↓
packet parser
    ↓
DSP
    ↓
FSM
```

## Electronics person owns

```text
AD5933
    ↓
calibration
    ↓
frequency
    ↓
electrode interface
```

## Biotech person owns

```text
biological mechanism
    ↓
organism
    ↓
antibiotic
    ↓
medium
    ↓
validation
```

## System lead owns

```text
integration
    ↓
data model
    ↓
demo
    ↓
novelty
    ↓
product architecture
```

---

# 67. Exact first-day schedule

## Hour 0–1

FPGA:

```text
install/check:
yosys
nextpnr-ice40
icestorm
iverilog
```

VSDSquadron examples use this open-source toolchain family. citeturn1search10

Heltec:

```text
compile basic ESP32-S3 program
```

---

## Hour 1–2

FPGA:

```text
blink RGB
```

Heltec:

```text
Serial.println("HELTEC_READY")
```

---

## Hour 2–4

FPGA:

```text
UART TX
UART RX
```

Heltec:

```text
dedicated UART
```

---

## Hour 4–6

Build:

```text
Heltec ↔ FPGA
```

Test:

```text
HELLO
```

---

## Hour 6–8

Implement:

```text
binary packet
checksum
sequence
```

---

## Hour 8–12

Implement:

```text
filter
delta
slope
stability
```

---

## Hour 12–16

Implement:

```text
adaptive FSM
```

---

## Hour 16–20

Synthetic data:

```text
stable
unstable
divergence
plateau
timeout
```

---

## Hour 20–24

Integrate:

```text
AD5933 → Heltec → FPGA
```

---

# 68. Final architecture

```text
                    PHENORA V1

                     SAMPLE
                       │
                       ▼
              ELECTRODE INTERFACE
                       │
                       ▼
                    AD5933
                       │
                      I²C
                       │
                       ▼
              ┌─────────────────┐
              │    HELTEC V3    │
              │   ESP32-S3      │
              │                 │
              │ AD5933 driver   │
              │ calibration     │
              │ R/I processing  │
              │ feature calc    │
              └────────┬────────┘
                       │
                    UART 8N1
                       │
                       ▼
              ┌─────────────────┐
              │ VSDSQUADRON FM  │
              │ iCE40UP5K       │
              │                 │
              │ UART RX         │
              │ packet parser   │
              │ filter          │
              │ Δfeature        │
              │ slope           │
              │ stability       │
              │ adaptive FSM    │
              │ UART TX         │
              └────────┬────────┘
                       │
                  STOP/REPEAT
                       │
                       ▼
                    HELTEC
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
           OLED                Wi-Fi
                                 │
                                 ▼
                            Dashboard
```

---

# 69. Non-negotiable engineering rule

Do not integrate all components simultaneously.

The correct sequence is:

```text
FPGA alone
   ↓
FPGA UART
   ↓
Heltec ↔ FPGA
   ↓
synthetic feature
   ↓
adaptive FSM
   ↓
AD5933 → Heltec
   ↓
real feature → FPGA
   ↓
two-channel differential
   ↓
biological validation
```

This sequencing is the difference between a debuggable system and a 48-hour integration failure.

---

# 70. Final objective

At the end of the hackathon, the strongest demonstrable loop is:

```text
MEASURE
   ↓
FEATURE
   ↓
FPGA
   ↓
FILTER
   ↓
DIFFERENTIAL
   ↓
SLOPE
   ↓
STABILITY
   ↓
DECISION
   ↓
       ┌──────────────┐
       │              │
       ▼              ▼
    REPEAT           STOP
```

The FPGA is therefore the **local adaptive decision engine**, while the Heltec is the **sensor host, protocol gateway, display and optional wireless gateway**.

Do not let Wi-Fi/cloud development delay the local closed loop.
