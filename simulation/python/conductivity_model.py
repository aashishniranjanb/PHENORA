# Scientific Parameter Classifications:
# - BASE_MEDIUM_CONDUCTIVITY: LITERATURE-DERIVED (~0.8 S/m to 1.6 S/m for standard broths like MHB)
# - TEMPERATURE_COEFFICIENT: LITERATURE-DERIVED (~2% per °C for electrolytes)
# - CELL_VOLUME_FRACTION: SYNTHETIC / MODEL ASSUMED

def compute_medium_conductivity(base_conductivity, temperature, temp_coeff=0.02, ref_temp=25.0):
    """
    Computes conductivity of the growth medium adjusted for temperature.
    sigma_m(T) = sigma_0 * (1 + alpha * (T - T_ref))
    """
    return base_conductivity * (1.0 + temp_coeff * (temperature - ref_temp))

