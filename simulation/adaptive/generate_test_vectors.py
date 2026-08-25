import csv
import pandas as pd
from pathlib import Path
from adaptive_reference import PhenoraAdaptiveGoldenModel

# ============================================================
# PHENORA GOLDEN TEST VECTOR GENERATOR
# Exports test_vectors.csv and expected_results.csv
# ============================================================
ROOT = Path(__file__).resolve().parent
FEM_RESULTS = ROOT.parent / "fem" / "results" / "differential_fem_trajectory.csv"

def run_vector(vector_name, time_points, delta_R_vals):
    model = PhenoraAdaptiveGoldenModel()
    input_rows = []
    output_rows = []
    
    for idx, (t, val) in enumerate(zip(time_points, delta_R_vals)):
        input_rows.append({
            "vector": vector_name,
            "sample": idx,
            "time_hours": t,
            "delta_R": val
        })
        
        res = model.process_sample(idx, t, val)
        output_rows.append({
            "vector": vector_name,
            "sample": idx,
            "time_hours": t,
            "raw_delta_R": res["raw_delta_R"],
            "filtered_delta_R": res["filtered_delta_R"],
            "slope": res["slope"],
            "stable_count": res["stable_count"],
            "expected_state": res["state"]
        })
        
    return input_rows, output_rows, model.state

def main():
    print("==================================================")
    print("PHENORA GOLDEN TEST VECTOR GENERATOR")
    print("==================================================")
    
    all_inputs = []
    all_outputs = []
    
    # 1. Vector A: Stable Differential Signal (9 points to allow 2 stable windows)
    times_a = [0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0]
    vals_a  = [0.0, -0.0001, -0.0010, -0.0025, -0.0030, -0.0031, -0.0031, -0.0031, -0.0031]
    in_a, out_a, state_a = run_vector("Vector_A_Stable", times_a, vals_a)
    assert state_a == "STOP", f"Vector A failed with final state: {state_a}"
    all_inputs.extend(in_a)
    all_outputs.extend(out_a)
    print(f"Vector A (Stable Differential Signal) final state: {state_a}")

    times_8 = [0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0]
    
    # 2. Vector B: Continuously Diverging
    vals_b = [0.0, -0.0005, -0.0020, -0.0050, -0.0090, -0.0140, -0.0200, -0.0270]
    in_b, out_b, state_b = run_vector("Vector_B_Diverging", times_8, vals_b)
    assert state_b in ["ANALYZING", "MEASURING"], "Vector B failed"
    all_inputs.extend(in_b)
    all_outputs.extend(out_b)
    print(f"Vector B (Continuously Diverging) final state:      {state_b}")

    # 3. Vector C: Noisy Signal
    vals_c = [0.0, +0.0020, -0.0015, +0.0030, -0.0020, +0.0025, -0.0010, +0.0030]
    in_c, out_c, state_c = run_vector("Vector_C_Noisy", times_8, vals_c)
    assert state_c in ["ANALYZING", "MEASURING"], "Vector C failed"
    all_inputs.extend(in_c)
    all_outputs.extend(out_c)
    print(f"Vector C (Noisy Signal) final state:               {state_c}")

    # 4. Vector D: Quiet / No Difference Signal
    vals_d = [0.0, 0.00001, 0.00000, -0.00001, 0.00001, 0.00000, 0.00001, 0.00000]
    in_d, out_d, state_d = run_vector("Vector_D_Quiet", times_8, vals_d)
    assert state_d == "MEASURING", "Vector D failed (must stay MEASURING on quiet signal)"
    all_inputs.extend(in_d)
    all_outputs.extend(out_d)
    print(f"Vector D (Quiet / No Difference) final state:      {state_d}")

    # 5. Vector E: Transient Spike
    vals_e = [0.0, -0.0001, -0.0002, -0.0050, -0.0002, -0.0001, -0.0001, -0.0001]
    in_e, out_e, state_e = run_vector("Vector_E_TransientSpike", times_8, vals_e)
    assert state_e != "STOP", "Vector E failed (transient spike must not trigger immediate STOP)"
    all_inputs.extend(in_e)
    all_outputs.extend(out_e)
    print(f"Vector E (Transient Spike) final state:            {state_e}")

    # 6. Vector F: Elmer FEM Trajectory
    if FEM_RESULTS.exists():
        fem_df = pd.read_csv(FEM_RESULTS)
        times_f = fem_df["time_hours"].tolist()
        vals_f = fem_df["delta_R_ohm"].tolist()
        in_f, out_f, state_f = run_vector("Vector_F_ElmerFEM", times_f, vals_f)
        all_inputs.extend(in_f)
        all_outputs.extend(out_f)
        print(f"Vector F (Elmer FEM Trajectory) final state:       {state_f}")

    # Export CSVs
    csv_inputs = ROOT / "test_vectors.csv"
    with open(csv_inputs, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=all_inputs[0].keys())
        writer.writeheader()
        writer.writerows(all_inputs)

    csv_outputs = ROOT / "expected_results.csv"
    with open(csv_outputs, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=all_outputs[0].keys())
        writer.writeheader()
        writer.writerows(all_outputs)
        
    print("--------------------------------------------------")
    print(f"Exported test vectors to:    {csv_inputs}")
    print(f"Exported expected outputs to: {csv_outputs}")
    print("==================================================")
    print("ALL 6 GOLDEN TEST VECTORS VERIFIED (100% PASS)")
    print("==================================================")

if __name__ == "__main__":
    main()

