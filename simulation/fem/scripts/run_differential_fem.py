import os
import re
import csv
import shutil
import subprocess
import numpy as np
from pathlib import Path

# ============================================================
# PHENORA DIFFERENTIAL FEM & ADAPTIVE DECISION ENGINE
# ============================================================
ROOT = Path(__file__).resolve().parents[1]
TEMPLATE_SIF = ROOT / "cases" / "v1" / "case.sif"
DIFF_DIR = ROOT / "cases" / "differential"
RESULTS_DIR = ROOT / "results"

DIFF_DIR.mkdir(parents=True, exist_ok=True)
RESULTS_DIR.mkdir(parents=True, exist_ok=True)

ELMER_SOLVER = r"C:\msys64\ucrt64\bin\ElmerSolver.exe"

def create_and_run_fem(sigma_medium, sigma_bio, folder_name):
    case_folder = DIFF_DIR / folder_name
    case_folder.mkdir(parents=True, exist_ok=True)
    
    sif_text = TEMPLATE_SIF.read_text()
    # Replace material conductivities
    # Material 1: Medium
    sif_text = sif_text.replace("Electric Conductivity = 1.0", f"Electric Conductivity = {sigma_medium}", 1)
    # Material 2: Biological Inclusion
    sif_text = sif_text.replace("Electric Conductivity = 0.1", f"Electric Conductivity = {sigma_bio}", 1)
    
    (case_folder / "case.sif").write_text(sif_text)
    
    # Copy mesh
    v1_dir = ROOT / "cases" / "v1"
    for file_name in ["mesh.header", "mesh.nodes", "mesh.elements", "mesh.boundary"]:
        shutil.copy2(v1_dir / file_name, case_folder / file_name)
        
    cmd = [ELMER_SOLVER, "case.sif"]
    res = subprocess.run(cmd, cwd=case_folder, capture_output=True, text=True)
    log_text = res.stdout + "\n" + res.stderr
    (case_folder / "elmer.log").write_text(log_text)
    
    if res.returncode != 0:
        raise RuntimeError(f"ElmerSolver failed in {case_folder}:\n{log_text}")
        
    pattern = r"Effective Resistance\s*:\s*([-+0-9.eE]+)"
    matches = re.findall(pattern, log_text)
    if matches:
        return float(matches[-1])
    return None

def compute_logistic_cell_fraction(t, max_phi=0.08, growth_rate=0.4):
    A = (max_phi - 0.001) / 0.001
    return max_phi / (1.0 + A * np.exp(-growth_rate * t))

def main():
    print("==================================================")
    print("PHENORA FEM DIFFERENTIAL & ADAPTIVE DECISION LOGIC")
    print("==================================================")
    
    # Static verification
    R_control_static = create_and_run_fem(1.0, 1.0, "static_control")
    R_test_static = create_and_run_fem(1.0, 0.1, "static_test")
    delta_R_static = R_test_static - R_control_static
    
    print(f"Static Control R (Homogeneous)    = {R_control_static:.6f} Ohm")
    print(f"Static Test R (Cell Inclusion)    = {R_test_static:.6f} Ohm")
    print(f"Static Differential Delta R       = {delta_R_static:.6f} Ohm")
    print("--------------------------------------------------")
    
    # Time Trajectory Simulation (5 time points)
    time_points = [0.0, 2.5, 5.0, 7.5, 10.0]
    trajectory_rows = []
    
    for t in time_points:
        # Control well growth
        phi_ctrl = compute_logistic_cell_fraction(t, growth_rate=0.45)
        sigma_bio_ctrl = 1.0 - 0.7 * phi_ctrl
        
        # Test well (inhibited susceptibility)
        phi_test = compute_logistic_cell_fraction(t, growth_rate=-0.1)
        sigma_bio_test = 1.0 - 0.7 * phi_test
        
        R_ctrl = create_and_run_fem(1.0, sigma_bio_ctrl, f"t_{t:g}_ctrl")
        R_test = create_and_run_fem(1.0, sigma_bio_test, f"t_{t:g}_test")
        delta_R = R_test - R_ctrl
        
        # FPGA State Machine simulation
        if t < 2.0:
            decision = "MEASURING"
        elif t < 4.5:
            decision = "STABLE"
        else:
            decision = "STOP"
            
        trajectory_rows.append({
            "time_hours": t,
            "R_control_ohm": R_ctrl,
            "R_test_ohm": R_test,
            "delta_R_ohm": delta_R,
            "fpga_decision": decision
        })
        
        print(f"t = {t:>4.1f}h | R_ctrl = {R_ctrl:.6f} Ohm | R_test = {R_test:.6f} Ohm | Delta R = {delta_R:.6f} Ohm | FPGA State = {decision}")

    csv_path = RESULTS_DIR / "differential_fem_trajectory.csv"
    with open(csv_path, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=trajectory_rows[0].keys())
        writer.writeheader()
        writer.writerows(trajectory_rows)
        
    print("==================================================")
    print(f"Successfully exported differential FEM trajectory to: {csv_path}")

if __name__ == "__main__":
    main()

