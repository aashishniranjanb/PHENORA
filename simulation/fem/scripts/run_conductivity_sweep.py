import os
import re
import csv
import shutil
import subprocess
from pathlib import Path

# ============================================================
# PHENORA FEM CONDUCTIVITY SWEEP ENGINE
# ============================================================
ROOT = Path(__file__).resolve().parents[1]
TEMPLATE_SIF = ROOT / "cases" / "v0" / "case.sif"
SWEEP_DIR = ROOT / "cases" / "sweep"
RESULTS_DIR = ROOT / "results"

SWEEP_DIR.mkdir(parents=True, exist_ok=True)
RESULTS_DIR.mkdir(parents=True, exist_ok=True)

ELMER_SOLVER = r"C:\msys64\ucrt64\bin\ElmerSolver.exe"

# Conductivity values (S/m) — Synthetic parameter sweep for engineering PoC
CONDUCTIVITIES = [0.25, 0.5, 1.0, 2.0, 4.0, 8.0]

def analytical_resistance(sigma):
    """
    R = L / (sigma * A)
    For 2D sample: L = 0.020 m, H = 0.010 m, unit depth = 1.0 m
    Area A = H * 1.0 = 0.010 m^2
    """
    L = 0.020
    H = 0.010
    A = H * 1.0
    return L / (sigma * A)

def create_case_instance(sigma, case_folder):
    case_folder.mkdir(parents=True, exist_ok=True)
    
    # Read base sif template
    sif_content = TEMPLATE_SIF.read_text()
    sif_content = sif_content.replace("Electric Conductivity = 1.0", f"Electric Conductivity = {sigma}")
    (case_folder / "case.sif").write_text(sif_content)
    
    # Copy mesh files from v0 case directory
    v0_dir = ROOT / "cases" / "v0"
    for file_name in ["mesh.header", "mesh.nodes", "mesh.elements", "mesh.boundary"]:
        shutil.copy2(v0_dir / file_name, case_folder / file_name)

def run_elmer_instance(case_folder):
    cmd = [ELMER_SOLVER, "case.sif"]
    res = subprocess.run(cmd, cwd=case_folder, capture_output=True, text=True)
    log_text = res.stdout + "\n" + res.stderr
    (case_folder / "elmer.log").write_text(log_text)
    if res.returncode != 0:
        raise RuntimeError(f"ElmerSolver failed in {case_folder}:\n{log_text}")
    return log_text

def parse_effective_resistance(log_text):
    pattern = r"Effective Resistance\s*:\s*([-+0-9.eE]+)"
    matches = re.findall(pattern, log_text)
    if matches:
        return float(matches[-1])
    return None

def main():
    rows = []
    print("==================================================")
    print("PHENORA FEM CONDUCTIVITY SWEEP (StatCurrent Solver)")
    print("==================================================")
    
    for sigma in CONDUCTIVITIES:
        case_folder = SWEEP_DIR / f"sigma_{sigma:g}"
        create_case_instance(sigma, case_folder)
        log = run_elmer_instance(case_folder)
        fem_r = parse_effective_resistance(log)
        analytic_r = analytical_resistance(sigma)
        
        rel_err = None
        if fem_r is not None:
            rel_err = (abs(fem_r - analytic_r) / analytic_r) * 100.0
            
        rows.append({
            "conductivity_S_per_m": sigma,
            "fem_resistance_ohm": fem_r,
            "analytical_resistance_ohm": analytic_r,
            "relative_error_percent": rel_err
        })
        
        print(f"sigma = {sigma:>5} S/m | FEM R = {fem_r:.6f} Ohm | Analytical R = {analytic_r:.6f} Ohm | Error = {rel_err:.4f}%")

    csv_path = RESULTS_DIR / "conductivity_sweep.csv"
    with open(csv_path, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)
        
    print("==================================================")
    print(f"Successfully saved conductivity sweep dataset to: {csv_path}")

if __name__ == "__main__":
    main()
