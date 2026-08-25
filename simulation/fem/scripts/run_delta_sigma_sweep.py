import os
import re
import csv
import shutil
import subprocess
from pathlib import Path
import matplotlib.pyplot as plt
import numpy as np

# ============================================================
# PHENORA FEM DELTA-SIGMA PERTURBATION SWEEP
# ============================================================
ROOT = Path(__file__).resolve().parents[1]
TEMPLATE_SIF = ROOT / "cases" / "v1" / "case.sif"
SWEEP_DIR = ROOT / "cases" / "delta_sigma"
RESULTS_DIR = ROOT / "results"
PLOTS_DIR = ROOT / "plots"

SWEEP_DIR.mkdir(parents=True, exist_ok=True)
RESULTS_DIR.mkdir(parents=True, exist_ok=True)
PLOTS_DIR.mkdir(parents=True, exist_ok=True)

ELMER_SOLVER = r"C:\msys64\ucrt64\bin\ElmerSolver.exe"

# Delta sigma percentages (%)
DELTA_SIGMA_PCT = [-50.0, -25.0, -10.0, 0.0, 10.0, 25.0, 50.0]
SIGMA_MEDIUM_BASE = 1.0 # S/m

def run_fem_instance(sigma_medium, sigma_bio, folder_name):
    case_folder = SWEEP_DIR / folder_name
    case_folder.mkdir(parents=True, exist_ok=True)
    
    sif_text = TEMPLATE_SIF.read_text()
    sif_text = sif_text.replace("Electric Conductivity = 1.0", f"Electric Conductivity = {sigma_medium}", 1)
    sif_text = sif_text.replace("Electric Conductivity = 0.1", f"Electric Conductivity = {sigma_bio}", 1)
    (case_folder / "case.sif").write_text(sif_text)
    
    v1_dir = ROOT / "cases" / "v1"
    for fname in ["mesh.header", "mesh.nodes", "mesh.elements", "mesh.boundary"]:
        shutil.copy2(v1_dir / fname, case_folder / fname)
        
    res = subprocess.run([ELMER_SOLVER, "case.sif"], cwd=case_folder, capture_output=True, text=True)
    log_text = res.stdout + "\n" + res.stderr
    (case_folder / "elmer.log").write_text(log_text)
    
    pattern = r"Effective Resistance\s*:\s*([-+0-9.eE]+)"
    matches = re.findall(pattern, log_text)
    if matches:
        return float(matches[-1])
    return None

def main():
    print("==================================================")
    print("PHENORA FEM DELTA-SIGMA PERTURBATION SWEEP")
    print("==================================================")
    
    # Base homogeneous control resistance
    R_control_base = run_fem_instance(SIGMA_MEDIUM_BASE, SIGMA_MEDIUM_BASE, "control_base")
    print(f"Base Homogeneous Control R = {R_control_base:.6f} Ohm")
    print("--------------------------------------------------")
    
    rows = []
    for delta_pct in DELTA_SIGMA_PCT:
        # Biological region conductivity: sigma_bio = sigma_medium * (1 + delta_pct / 100)
        sigma_bio = SIGMA_MEDIUM_BASE * (1.0 + delta_pct / 100.0)
        
        folder = f"delta_{delta_pct:g}pct"
        R_test = run_fem_instance(SIGMA_MEDIUM_BASE, sigma_bio, folder)
        delta_R = R_test - R_control_base
        
        rows.append({
            "delta_sigma_percent": delta_pct,
            "sigma_bio_S_per_m": sigma_bio,
            "R_test_ohm": R_test,
            "R_control_ohm": R_control_base,
            "delta_R_ohm": delta_R
        })
        
        print(f"Delta sigma = {delta_pct:>+5.1f}% | sigma_bio = {sigma_bio:.3f} S/m | R_test = {R_test:.6f} Ohm | Delta R = {delta_R:>+9.6f} Ohm")

    csv_path = RESULTS_DIR / "delta_sigma_sweep.csv"
    with open(csv_path, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)
        
    print(f"Saved perturbation sweep dataset to: {csv_path}")
    
    # Plot Delta R vs Delta Sigma
    delta_sigmas = [r["delta_sigma_percent"] for r in rows]
    delta_Rs = [r["delta_R_ohm"] for r in rows]
    
    plt.figure(figsize=(8, 5))
    plt.plot(delta_sigmas, delta_Rs, 's-', color='#17B169', linewidth=2, label="Differential Resistance $\\Delta R = R_{test} - R_{control}$")
    plt.axhline(0, color='#6b7280', linestyle='--', alpha=0.6)
    plt.axvline(0, color='#6b7280', linestyle='--', alpha=0.6)
    plt.xlabel("Modeled Inclusion Conductivity Perturbation $\\Delta\\sigma$ (%)", fontname="Arial", fontsize=11)
    plt.ylabel("Differential Resistance Response $\\Delta R$ ($\\Omega$)", fontname="Arial", fontsize=11)
    plt.title("PHENORA FEM: Differential Response vs. Conductivity Perturbation", fontname="Arial", fontsize=13, fontweight='bold')
    plt.grid(True, alpha=0.2, linestyle='--')
    plt.legend()
    plt.tight_layout()
    plt.savefig(PLOTS_DIR / "04_delta_R_vs_delta_sigma.png", dpi=300)
    plt.close()
    
    print(f"Saved perturbation plot to: {PLOTS_DIR / '04_delta_R_vs_delta_sigma.png'}")

if __name__ == "__main__":
    main()

