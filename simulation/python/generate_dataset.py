import os
import json
import numpy as np
from impedance_model import compute_impedance, get_magnitude_and_phase
from conductivity_model import compute_medium_conductivity
from cell_model import compute_effective_conductivity
from electrode_model import map_conductivity_to_solution_resistance
from temperature_model import generate_temperature_profile
from ast_trajectory import simulate_growth_profiles

def run_full_simulation(treatment_type="susceptible", growth_rate=0.45):
    # Time parameters (hours)
    time_points = np.linspace(0, 10, 41) # 0 to 10 hours, 15-minute intervals
    
    # Frequency parameters (Hz) - 30 points log-spaced
    frequencies = np.logspace(2, 5, 30) # 100 Hz to 100 kHz
    
    # Base Physical Constants
    base_conductivity = 1.0 # S/m
    cell_constant = 120.0 # m^-1
    base_Rct = 4000.0 # Ohms
    base_Cdl = 5.0e-6 # Farads (5 uF)
    
    # Generate temperature drift (common-mode perturbation)
    temperatures = generate_temperature_profile(time_points, base_temp=37.0, drift_rate=0.08, noise_std=0.015)
    
    # Generate cell growth profiles
    phi_control, phi_test = simulate_growth_profiles(
        time_points, 
        treatment_type=treatment_type, 
        growth_rate=growth_rate,
        initial_fraction=0.0005,
        max_fraction=0.06
    )
    
    # Outputs lists
    trajectory_data = []
    
    # We will choose f = 1000 Hz as the single-frequency "impedance-derived feature" F(t)
    feature_freq = 1000.0
    
    for i, t in enumerate(time_points):
        temp = temperatures[i]
        
        # 1. Control channel calculations
        cond_m_ctrl = compute_medium_conductivity(base_conductivity, temp)
        cond_eff_ctrl = compute_effective_conductivity(cond_m_ctrl, phi_control[i])
        Rs_ctrl = map_conductivity_to_solution_resistance(cond_eff_ctrl, cell_constant)
        # Rct and Cdl can experience slight scaling with cell concentration or temp
        Rct_ctrl = base_Rct * (1.0 - 0.2 * (temp - 37.0)/37.0)
        Cdl_ctrl = base_Cdl
        
        # 2. Test channel calculations
        cond_m_test = compute_medium_conductivity(base_conductivity, temp)
        cond_eff_test = compute_effective_conductivity(cond_m_test, phi_test[i])
        Rs_test = map_conductivity_to_solution_resistance(cond_eff_test, cell_constant)
        Rct_test = base_Rct * (1.0 - 0.2 * (temp - 37.0)/37.0)
        Cdl_test = base_Cdl
        
        # Frequencies sweep for the current time point (for 3D spectrum curves)
        Z_ctrl_sweep = compute_impedance(frequencies, Rs_ctrl, Rct_ctrl, Cdl_ctrl)
        mag_ctrl_sweep, phase_ctrl_sweep = get_magnitude_and_phase(Z_ctrl_sweep)
        
        Z_test_sweep = compute_impedance(frequencies, Rs_test, Rct_test, Cdl_test)
        mag_test_sweep, phase_test_sweep = get_magnitude_and_phase(Z_test_sweep)
        
        # Feature acquisition at 1 kHz
        Z_ctrl_feat = compute_impedance([feature_freq], Rs_ctrl, Rct_ctrl, Cdl_ctrl)[0]
        F_control = np.abs(Z_ctrl_feat)
        
        Z_test_feat = compute_impedance([feature_freq], Rs_test, Rct_test, Cdl_test)[0]
        F_test = np.abs(Z_test_feat)
        
        # Differential Feature
        delta_F = F_test - F_control
        
        trajectory_data.append({
            "time": float(t),
            "temperature": float(temp),
            "phi_control": float(phi_control[i]),
            "phi_test": float(phi_test[i]),
            "F_control": float(F_control),
            "F_test": float(F_test),
            "delta_F": float(delta_F),
            "frequency_sweep": {
                "frequencies": frequencies.tolist(),
                "control_magnitude": mag_ctrl_sweep.tolist(),
                "control_phase": phase_ctrl_sweep.tolist(),
                "test_magnitude": mag_test_sweep.tolist(),
                "test_phase": phase_test_sweep.tolist()
            }
        })
        
    # FPGA decision loop simulation (running post-facto on the generated delta_F)
    # The decision changes from MEASURING -> STABLE -> STOP
    # We define status as:
    # 0 to 2 hours: MEASURING
    # 2 to 5 hours: STABLE (differential slope is establishing)
    # > 5 hours: STOP (clear decision available)
    # If resistant, delta_F stays near 0. If susceptible, delta_F rises significantly.
    for i in range(len(trajectory_data)):
        t = trajectory_data[i]["time"]
        delta_F = trajectory_data[i]["delta_F"]
        
        if t < 2.5:
            decision = "MEASURING"
            color_state = "blue"
        elif t < 5.0:
            decision = "STABLE"
            color_state = "yellow"
        else:
            decision = "STOP"
            color_state = "green"
            
        trajectory_data[i]["fpga_decision"] = decision
        trajectory_data[i]["fpga_state_color"] = color_state
        
    return {
        "metadata": {
            "title": "PHENORA V1 Differential Impedance Simulation",
            "treatment_type": treatment_type,
            "feature_frequency_hz": feature_freq,
            "parameter_classifications": {
                "base_medium_conductivity": "LITERATURE-DERIVED",
                "temperature_coefficient": "LITERATURE-DERIVED",
                "cell_volume_fraction": "SYNTHETIC / MODEL ASSUMED",
                "cell_constant": "LITERATURE / FITTED",
                "double_layer_capacitance": "LITERATURE-DERIVED",
                "charge_transfer_resistance": "LITERATURE / FITTED",
                "growth_rate": "SYNTHETIC / MODEL PARAMETER"
            }
        },
        "trajectory": trajectory_data
    }

if __name__ == "__main__":
    # Simulate both susceptible and resistant profiles and save them
    dataset = {
        "susceptible": run_full_simulation("susceptible"),
        "resistant": run_full_simulation("resistant")
    }
    
    output_dir = os.path.join("..", "..", "web", "public", "datasets")
    os.makedirs(output_dir, exist_ok=True)
    
    output_path = os.path.join(output_dir, "simulation_data.json")
    with open(output_path, "w") as f:
        json.dump(dataset, f, indent=2)
        
    print(f"Successfully generated PHENORA simulation dataset at: {output_path}")

