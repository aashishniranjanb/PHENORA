# Scientific Parameter Classifications:
# - LOGISTIC_GROWTH_RATE: SYNTHETIC / MODEL PARAMETER
# - INHIBITION_FACTOR: SYNTHETIC / MODEL PARAMETER
# - CELL_VOLUME_FRACTION: SYNTHETIC / MODEL ASSUMED

import numpy as np

def compute_cell_fraction_trajectory(time_hours, initial_fraction=0.001, max_fraction=0.08, growth_rate=0.4):
    """
    Computes cell volume fraction over time using a logistic growth model.
    phi(t) = max_fraction / (1 + A * e^(-growth_rate * t))
    where A = (max_fraction - initial_fraction) / initial_fraction
    """
    t = np.asarray(time_hours)
    A = (max_fraction - initial_fraction) / initial_fraction
    phi = max_fraction / (1.0 + A * np.exp(-growth_rate * t))
    return phi

def simulate_growth_profiles(time_hours, treatment_type="susceptible", growth_rate=0.4, initial_fraction=0.001, max_fraction=0.08):
    """
    Simulates cell fraction trajectories for:
    1. Control (normal growth)
    2. Test (antibiotic treated, which varies depending on susceptibility)
    
    treatment_type options: "susceptible" (inhibited), "resistant" (grows like control), "none" (no growth)
    """
    t = np.asarray(time_hours)
    
    # Control Growth
    phi_control = compute_cell_fraction_trajectory(t, initial_fraction, max_fraction, growth_rate)
    
    # Test Growth
    if treatment_type == "susceptible":
        # Susceptible: growth rate is severely reduced or negative (lysing)
        phi_test = compute_cell_fraction_trajectory(t, initial_fraction, max_fraction, growth_rate * -0.2)
    elif treatment_type == "resistant":
        # Resistant: growth matches control
        phi_test = compute_cell_fraction_trajectory(t, initial_fraction, max_fraction, growth_rate * 0.95)
    else:
        # Static
        phi_test = np.full_like(t, initial_fraction)
        
    return phi_control, phi_test

