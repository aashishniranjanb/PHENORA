# PHENORA Adaptive Edge Halting Golden Model & Test Vectors

This package contains the ground-truth **Golden Reference Model** and deterministic unit test vectors for verifying the iCE40UP5K FPGA hardware implementation.

## Golden Model Pipeline

```text
UART INPUT (16-bit Fixed-Point Delta R)
   │
   ▼
MOVING AVERAGE FILTER (Window = 3)
   │
   ▼
SLOPE DERIVATIVE (S[n] = F[n] - F[n-2])
   │
   ▼
STABILITY DETECTOR (|S[n]| <= T_s for 2 consecutive windows)
   │
   ▼
STATE MACHINE (MEASURING -> ANALYZING -> STABLE -> STOP)
```

## Golden Test Vectors (Vectors A — F)

1. **Vector_A_Stable:** Trajectory diverges and stabilizes $\implies$ **STOP** (Sample 8).
2. **Vector_B_Diverging:** Continuously increasing slope $\implies$ **ANALYZING**.
3. **Vector_C_Noisy:** High-frequency noise oscillations $\implies$ **ANALYZING**.
4. **Vector_D_Quiet:** Flat signal ($\Delta R \approx 0.0000$) $\implies$ **MEASURING** (never falsely halts on quiet signals).
5. **Vector_E_TransientSpike:** Single impulse spike $\implies$ **ANALYZING** (prevents false halt on single noise impulse).
6. **Vector_F_ElmerFEM:** Actual differential Elmer FEM trajectory (`differential_fem_trajectory.csv`).

## Verification Workflow for FPGA Developers

1. Read `test_vectors.csv` into the SystemVerilog/VHDL testbench:
   ```bash
   python generate_test_vectors.py
   ```
2. Feed input samples (`delta_R`) step-by-step into the RTL simulation.
3. Compare hardware outputs (`filtered_val`, `slope`, `state`) against `expected_results.csv`.
4. The FPGA design passes when **100% of sample states match `expected_results.csv`**.

