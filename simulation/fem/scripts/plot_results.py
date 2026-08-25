from pathlib import Path
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

ROOT = Path(__file__).resolve().parents[1]
RESULTS = ROOT / "results"
PLOTS = ROOT / "plots"
PLOTS.mkdir(parents=True, exist_ok=True)

data = pd.read_csv(RESULTS / "conductivity_sweep.csv")
sigma = data["conductivity_S_per_m"].to_numpy()
fem_R = data["fem_resistance_ohm"].to_numpy()
analytic_R = data["analytical_resistance_ohm"].to_numpy()

# ============================================================
# PLOT 1: Effective Resistance vs Conductivity (Log-Log)
# ============================================================
plt.figure(figsize=(8, 5))
plt.loglog(sigma, fem_R, 'o-', color='#17B169', linewidth=2, label="Elmer FEM StatCurrent Solver")
plt.loglog(sigma, analytic_R, '--', color='#ffffff', alpha=0.7, label="Analytical $R = L / (\\sigma A)$")
plt.xlabel("Electrical Conductivity $\\sigma$ (S/m)", fontname="Arial", fontsize=11)
plt.ylabel("Effective Resistance $R_{eff}$ ($\\Omega$)", fontname="Arial", fontsize=11)
plt.title("PHENORA FEM: Resistance vs Conductivity Sweep", fontname="Arial", fontsize=13, fontweight='bold')
plt.grid(True, which="both", alpha=0.2, linestyle="--")
plt.legend()
plt.tight_layout()
plt.savefig(PLOTS / "01_resistance_vs_conductivity.png", dpi=300)
plt.close()

# ============================================================
# PLOT 2: FEM vs Analytical Parity Plot (y = x)
# ============================================================
plt.figure(figsize=(8, 5))
plt.scatter(analytic_R, fem_R, s=80, color='#17B169', zorder=3, label="FEM Calculated Points")
min_val = min(np.min(analytic_R), np.min(fem_R))
max_val = max(np.max(analytic_R), np.max(fem_R))
plt.plot([min_val, max_val], [min_val, max_val], '--', color='#ef4444', label="Ideal $y = x$ Match")
plt.xlabel("Analytical Resistance ($\\Omega$)", fontname="Arial", fontsize=11)
plt.ylabel("Elmer FEM Resistance ($\\Omega$)", fontname="Arial", fontsize=11)
plt.title("PHENORA FEM Physics Verification", fontname="Arial", fontsize=13, fontweight='bold')
plt.grid(True, alpha=0.2, linestyle="--")
plt.legend()
plt.tight_layout()
plt.savefig(PLOTS / "02_fem_vs_analytical.png", dpi=300)
plt.close()

# ============================================================
# PLOT 3: Relative Error %
# ============================================================
error = (np.abs(fem_R - analytic_R) / analytic_R) * 100.0
plt.figure(figsize=(8, 5))
plt.semilogx(sigma, error, 's-', color='#3b82f6', linewidth=2)
plt.xlabel("Electrical Conductivity $\\sigma$ (S/m)", fontname="Arial", fontsize=11)
plt.ylabel("Relative Error (%)", fontname="Arial", fontsize=11)
plt.title("PHENORA FEM Solver Relative Error vs Analytical", fontname="Arial", fontsize=13, fontweight='bold')
plt.ylim(-0.01, 0.1) # Precision range display
plt.grid(True, which="both", alpha=0.2, linestyle="--")
plt.tight_layout()
plt.savefig(PLOTS / "03_relative_error.png", dpi=300)
plt.close()

print("Generated Plots:")
print(f"1. {PLOTS / '01_resistance_vs_conductivity.png'}")
print(f"2. {PLOTS / '02_fem_vs_analytical.png'}")
print(f"3. {PLOTS / '03_relative_error.png'}")

