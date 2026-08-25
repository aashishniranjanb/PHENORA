# PHENORA Elmer FEM Conduction Engine & Verification Package

This directory contains the Finite Element Method (FEM) electrical conduction model for PHENORA, built using **Gmsh** and **Elmer FEM** (`StatCurrentSolve`).

## Verification & Status Categorization

To maintain strict scientific integrity, all model outputs are classified into three distinct categories:

### 1. Verified (Physical & Numerical Consistency)
- **Geometry:** 20 mm x 10 mm 2D rectangular chamber ($L = 0.020 \, \text{m}, H = 0.010 \, \text{m}$).
- **Boundary Conditions:** Left electrode Dirichlet boundary condition ($1.0 \, \text{V}$), Right electrode Dirichlet boundary condition ($0.0 \, \text{V}$).
- **Solver Engine:** Elmer `StatCurrentSolve` steady-state conduction solver.
- **Analytical Solution:** FEM resistance matches the analytical equation $R = \frac{L}{\sigma A} = \frac{0.020}{\sigma (0.010)}$ with **$0.0000\%$ relative error**.
- **Conductivity Sweep:** Verified effective resistance $R_{\mathrm{eff}}$ scales inversely with conductivity ($\sigma \in [0.25, 8.0]$ S/m).

### 2. Computational Demonstration (Model Hypotheses)
- **Heterogeneous Specimen Region:** Central $8 \, \text{mm} \times 4 \, \text{mm}$ inclusion region representing specimen loading ($\sigma_{\mathrm{bio}}$).
- **Control vs. Test Differential:** Continuous dual-channel comparison $\Delta R(t) = R_{\mathrm{test}}(t) - R_{\mathrm{control}}(t)$.
- **Synthetic Time Trajectory:** Logistic cell density mapping $N(t) \to \sigma(t) \to R(t)$.
- **Adaptive Halting State Machine:** Evaluating differential trajectory slope $S(t) = \frac{d\Delta R(t)}{dt}$ to transition states (`MEASURING` $\to$ `STABLE` $\to$ `STOP`).

### 3. Not Yet Validated (Future Work)
- **Bacterial Metabolism:** Molecular metabolism and cell membrane ion transport dynamics.
- **Pharmacodynamics:** Pharmacological antibiotic kill kinetics.
- **Clinical AST:** Clinical Susceptibility/Resistance (S/I/R) classification and MIC predictions.

---

## Directory Structure & Outputs

```text
simulation/fem/
├── geometry/
│   ├── phenora_sample.geo            # Homogeneous 2D geometry
│   └── phenora_heterogeneous.geo     # Heterogeneous inclusion geometry
├── cases/
│   ├── v0/                           # Baseline 1.0 S/m case
│   ├── v1/                           # Heterogeneous region case
│   ├── sweep/                        # Conductivity sweep instances
│   └── differential/                 # Control vs Test trajectory cases
├── results/
│   ├── conductivity_sweep.csv
│   ├── differential_fem_trajectory.csv
│   ├── delta_sigma_sweep.csv
│   └── mesh_convergence.csv
├── scripts/
│   ├── run_conductivity_sweep.py
│   ├── run_differential_fem.py
│   ├── run_mesh_convergence.py
│   ├── run_delta_sigma_sweep.py
│   ├── adaptive_reference.py
│   └── plot_results.py
└── plots/
    ├── 01_resistance_vs_conductivity.png
    ├── 02_fem_vs_analytical.png
    ├── 03_relative_error.png
    ├── 04_delta_R_vs_delta_sigma.png
    └── 05_mesh_convergence.png
```
