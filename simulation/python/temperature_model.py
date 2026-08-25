# Scientific Parameter Classifications:
# - TEMP_DRIFT_COEFF: LITERATURE-DERIVED
# - THERMAL_NOISE: ASSUMED / SYNTHETIC

import numpy as np

def generate_temperature_profile(time_points, base_temp=37.0, drift_rate=0.05, noise_std=0.02):
    """
    Simulates temperature trajectory over time representing incubator drift or ambient noise.
    T(t) = base_temp + drift_rate * t + random_noise
    """
    times = np.asarray(time_points)
    drift = drift_rate * times
    noise = np.random.normal(0, noise_std, size=len(times))
    return base_temp + drift + noise

