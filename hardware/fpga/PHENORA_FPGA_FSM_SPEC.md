# PHENORA FPGA Fixed-Point FSM Specification

Target Device: **Lattice iCE40UP5K (VSDSquadron Mini)**  
Clock Frequency: **12 MHz**  
Input Interface: **UART RX (115200 baud, 8N1)**  

## Fixed-Point Data Format

To avoid floating-point overhead on the iCE40UP5K, all $\Delta R$ differential feature inputs are formatted as 16-bit signed fixed-point integers (Q8.8 format):
- **1 Sign Bit**
- **7 Integer Bits** (Range: -128 to +127)
- **8 Fractional Bits** (Resolution: $\frac{1}{256} \approx 0.00390625$)

## Register Map & States

### State Encoding (2-bit `reg [1:0] state`)
- `2'b00` — **MEASURING** (System baseline acquisition)
- `2'b01` — **ANALYZING** (Signal slope actively diverging)
- `2'b10` — **STABLE** (Slope within stationary threshold)
- `2'b11` — **STOP** (Adaptive halting criteria satisfied)

### Processing Modules

```text
               ┌────────────────────────┐
               │    UART RX (115200)    │
               └───────────┬────────────┘
                           │ 16-bit Q8.8
                           ▼
               ┌────────────────────────┐
               │ MOVING AVERAGE (N=3)   │
               └───────────┬────────────┘
                           │ Filtered Q8.8
                           ▼
               ┌────────────────────────┐
               │   SLOPE DERIVATIVE     │
               │ S[n] = F[n] - F[n-2]   │
               └───────────┬────────────┘
                           │ Slope Q8.8
                           ▼
               ┌────────────────────────┐
               │  STABILITY COMPARATOR  │
               └───────────┬────────────┘
                           │ Match Flag
                           ▼
               ┌────────────────────────┐
               │   ADAPTIVE STATE FSM   │
               └───────────┬────────────┘
                           │ State Pin Output
                           ▼
                   LED_STOP / UART TX
```

## RTL Equivalence Testbench Requirement

The SystemVerilog testbench `tb_adaptive_fsm.sv` must load `simulation/adaptive/test_vectors.csv` and assert that the hardware state register matches `simulation/adaptive/expected_results.csv` on every single sample step across all 6 test vectors.

