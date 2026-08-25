import os
import re
import csv
import shutil
import subprocess
from pathlib import Path
import matplotlib.pyplot as plt
import numpy as np

# ============================================================
# PHENORA FEM MESH CONVERGENCE ENGINE
# ============================================================
ROOT = Path(__file__).resolve().parents[1]
GEOMETRY_DIR = ROOT / "geometry"
CASES_DIR = ROOT / "cases" / "convergence"
RESULTS_DIR = ROOT / "results"
PLOTS_DIR = ROOT / "plots"

CASES_DIR.mkdir(parents=True, exist_ok=True)
RESULTS_DIR.mkdir(parents=True, exist_ok=True)
PLOTS_DIR.mkdir(parents=True, exist_ok=True)

GMSH_BIN = r"C:\Users\Home\Downloads\gmsh-stable-Windows64\gmsh-4.15.2-Windows64\gmsh.exe"
ELMER_GRID = r"C:\msys64\ucrt64\bin\ElmerGrid.exe"
ELMER_SOLVER = r"C:\msys64\ucrt64\bin\ElmerSolver.exe"

# Target mesh sizes (mm -> m)
MESH_SIZES_MM = [1.0, 0.5, 0.25, 0.125]
ANALYTICAL_R = 2.000000 # Ohms for L=0.02, H=0.01, sigma=1.0

def build_geo_file(lc_m, geo_path):
    content = f"""// PHENORA 2D MESH CONVERGENCE
L = 20e-3;
H = 10e-3;
lc = {lc_m:.6e};

Point(1) = {{0, 0, 0, lc}};
Point(2) = {{L, 0, 0, lc}};
Point(3) = {{L, H, 0, lc}};
Point(4) = {{0, H, 0, lc}};

Line(1) = {{1, 2}};
Line(2) = {{2, 3}};
Line(3) = {{3, 4}};
Line(4) = {{4, 1}};

Line Loop(1) = {{1, 2, 3, 4}};
Plane Surface(1) = {{1}};

Physical Surface(1) = {{1}};
Physical Line(1) = {{1}};
Physical Line(2) = {{2}};
Physical Line(3) = {{3}};
Physical Line(4) = {{4}};
"""
    geo_path.write_text(content)

def run_case_convergence(lc_mm):
    lc_m = lc_mm * 1e-3
    case_folder = CASES_DIR / f"lc_{lc_mm:g}mm"
    case_folder.mkdir(parents=True, exist_ok=True)
    
    geo_path = case_folder / "phenora_conv.geo"
    build_geo_file(lc_m, geo_path)
    
    # 1. Run Gmsh
    msh_path = case_folder / "phenora_conv.msh"
    subprocess.run([GMSH_BIN, str(geo_path), "-2", "-format", "msh2", "-o", str(msh_path)], capture_output=True, text=True)
    
    # 2. Run ElmerGrid
    subprocess.run([ELMER_GRID, "14", "2", "phenora_conv.msh", "-autoclean"], cwd=case_folder, capture_output=True, text=True)
    
    # Copy converted mesh files to root of case_folder
    elmer_mesh_dir = case_folder / "phenora_conv"
    if elmer_mesh_dir.exists():
        for fname in ["mesh.header", "mesh.nodes", "mesh.elements", "mesh.boundary"]:
            if (elmer_mesh_dir / fname).exists():
                shutil.copy2(elmer_mesh_dir / fname, case_folder / fname)
                
    # 3. Create case.sif
    v0_sif = (ROOT / "cases" / "v0" / "case.sif").read_text()
    (case_folder / "case.sif").write_text(v0_sif)
    
    # Read element and node counts from mesh.header
    header_text = (case_folder / "mesh.header").read_text().split()
    node_count = int(header_text[0])
    elem_count = int(header_text[1])
    
    # 4. Run ElmerSolver
    res = subprocess.run([ELMER_SOLVER, "case.sif"], cwd=case_folder, capture_output=True, text=True)
    log_text = res.stdout + "\n" + res.stderr
    (case_folder / "elmer.log").write_text(log_text)
    
    # Parse R_fem
    pattern = r"Effective Resistance\s*:\s*([-+0-9.eE]+)"
    matches = re.findall(pattern, log_text)
    fem_r = float(matches[-1]) if matches else None
    
    rel_err = (abs(fem_r - ANALYTICAL_R) / ANALYTICAL_R) * 100.0 if fem_r else None
    
    return {
        "mesh_size_mm": lc_mm,
        "nodes": node_count,
        "elements": elem_count,
        "fem_resistance_ohm": fem_r,
        "analytical_resistance_ohm": ANALYTICAL_R,
        "relative_error_percent": rel_err
    }

def main():
    print("==================================================")
    print("PHENORA FEM MESH CONVERGENCE TEST")
    print("==================================================")
    
    results = []
    for lc in MESH_SIZES_MM:
        row = run_case_convergence(lc)
        results.append(row)
        print(f"lc = {row['mesh_size_mm']:>5.3f} mm | Nodes = {row['nodes']:>5} | Elements = {row['elements']:>5} | FEM R = {row['fem_resistance_ohm']:.6f} Ohm | Error = {row['relative_error_percent']:.6f}%")

    csv_path = RESULTS_DIR / "mesh_convergence.csv"
    with open(csv_path, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=results[0].keys())
        writer.writeheader()
        writer.writerows(results)
        
    print(f"Saved convergence dataset to: {csv_path}")
    
    # Plot Convergence Graph
    elements = [r["elements"] for r in results]
    errors = [r["relative_error_percent"] for r in results]
    r_fems = [r["fem_resistance_ohm"] for r in results]
    
    plt.figure(figsize=(8, 5))
    plt.plot(elements, r_fems, 'o-', color='#17B169', linewidth=2, label="Elmer FEM Solved R ($R_{eff}$)")
    plt.axhline(ANALYTICAL_R, color='#ef4444', linestyle='--', label="Exact Analytical Solution ($2.000000 \\Omega$)")
    plt.xlabel("Mesh Element Count", fontname="Arial", fontsize=11)
    plt.ylabel("Effective Resistance ($R_{eff}$ in $\\Omega$)", fontname="Arial", fontsize=11)
    plt.title("PHENORA FEM Mesh Convergence Test", fontname="Arial", fontsize=13, fontweight='bold')
    plt.grid(True, alpha=0.2, linestyle='--')
    plt.legend()
    plt.tight_layout()
    plt.savefig(PLOTS_DIR / "05_mesh_convergence.png", dpi=300)
    plt.close()
    
    print(f"Saved convergence plot to: {PLOTS_DIR / '05_mesh_convergence.png'}")

if __name__ == "__main__":
    main()

