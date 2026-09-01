# PHENORA FPGA Edge Decision Engine (PERSON C)

**Target Board:** VSDSquadron FPGA Mini (Lattice iCE40UP5K SG48)  
**Clock Frequency:** 12 MHz Onboard Oscillator  
**Interface:** 3.3V UART (115200 8N1) from Heltec ESP32-S3  
**Data Format:** 16-bit Signed Fixed-Point ($Q8.8$)  

---

## 1. Overview & Architecture

Person C implements the edge decision layer for **PHENORA**, converting feature streams from Heltec ESP32-S3 into deterministic edge halting decisions (**STOP**, **MEASURE_AGAIN**, **TIMEOUT**).

```text
Heltec TX (115200)
    │
    ▼
┌────────────────────────┐
│  UART RX (115200 8N1)  │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ PACKET PARSER & SYNC   │ Frame: [AA 55] [TYPE] [SEQ] [FEAT:16] [FLAGS] [XOR]
└───────────┬────────────┘
            │ Q8.8 Feature
            ▼
┌────────────────────────┐
│ MOVING AVERAGE FILTER  │ N=3 Digital Filter
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│   BASELINE TRACKER     │ Latching F(t_before_dose) pre-dose reference
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│    DELTA & SLOPE       │ ΔF = F(t) - Baseline, S[n] = F[n] - F[n-k]
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│   STABILITY DETECTOR   │ Slope Range |S[n]| <= T_s Threshold
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│  CONFIDENCE GATING     │ Person B Quality & Anomaly Rejection
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│   ADAPTIVE FSM         │ MEASURING -> ANALYZING -> STABLE -> STOP
└───────────┬────────────┘
            │
            ├──────────────────────┬──────────────────────┐
            ▼                      ▼                      ▼
        RGB LED                UART TX                Status Registers
```

---

## 2. Directory Structure

```text
hardware/fpga/
├── rtl/
│   ├── top.v                        # Top-level module interconnecting all blocks
│   ├── package/
│   │   └── protocol_constants.v     # Header constants, encodings & parameters
│   ├── uart/
│   │   ├── uart_rx.v                # 115200 8N1 UART receiver
│   │   ├── uart_tx.v                # 115200 8N1 UART transmitter
│   │   └── uart_packet_parser.v     # Frame sync & XOR checksum validator
│   ├── signal/
│   │   ├── signal_filter.v          # N=3 moving average filter
│   │   ├── baseline_tracker.v       # Single-chamber pre-dose baseline tracker
│   │   ├── delta_calculator.v       # Signed differential calculator
│   │   ├── slope_calculator.v       # Slope derivative calculator
│   │   └── stability_detector.v     # Stationarity stability detector
│   ├── confidence/
│   │   └── confidence_engine.v      # Person B quality & anomaly gating
│   ├── decision/
│   │   ├── evidence_accumulator.v   # Consecutive stable window accumulator
│   │   └── adaptive_fsm.v           # Adaptive edge state machine
│   └── output/
│       ├── led_status.v             # Onboard RGB LED visual status driver
│       └── status_registers.v       # Telemetry & debug register bank
├── constraints/
│   └── vsdsquadron.pcf              # Physical pin assignment file for iCE40UP5K
├── tb/
│   ├── tb_adaptive_fsm.sv           # Golden vector RTL equivalence testbench
│   └── system_tb.v                  # End-to-end UART frame injection testbench
├── Makefile                         # iverilog, Yosys, NextPNR build script
└── README.md
```

---

## 3. Physical Pin Mapping (`vsdsquadron.pcf`)

| Signal Name | Physical Pin | Description |
|---|---|---|
| `clk_12mhz` | Pin 35 | 12 MHz Onboard Crystal Oscillator |
| `rst_n` | Pin 34 | Active-Low Master Reset Input |
| `uart_rx_pin` | Pin 6 | 3.3V UART Receiver Input from Heltec ESP32-S3 |
| `uart_tx_pin` | Pin 9 | 3.3V UART Transmitter Output to Heltec ESP32-S3 |
| `led_red_pin` | Pin 39 | Onboard RGB LED (Red) |
| `led_green_pin` | Pin 40 | Onboard RGB LED (Green) |
| `led_blue_pin` | Pin 41 | Onboard RGB LED (Blue) |

---

## 4. Visual Status LED Indicators

- **Blue (`FSM_MEASURING`)**: Acquiring baseline / initial measurement stream.
- **Yellow (`FSM_ANALYZING`)**: Active signal slope evolving.
- **Cyan (`FSM_STABLE`)**: Slope settled within stationarity threshold $T_s$.
- **Solid Green (`FSM_STOP`)**: Adaptive edge halting criteria satisfied (STOP).
- **Solid Red (`FSM_TIMEOUT` / `FSM_ERROR`)**: Max measurement windows reached without STOP.

---

## 5. How to Run Simulation & Build

### Simulation (Icarus Verilog)
```bash
make sim
```

### Synthesis & Bitstream Generation (Yosys + NextPNR)
```bash
make build
```

### Flashing to VSDSquadron FPGA Mini
```bash
make flash
```
