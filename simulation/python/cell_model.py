# Scientific Parameter Classifications:
# - MAXWELL_FRICKE_APPROX: LITERATURE-DERIVED
# - CELL_VOLUME_FRACTION (phi): SYNTHETIC / MODEL ASSUMED (depends on concentration)

def compute_effective_conductivity(medium_conductivity, cell_volume_fraction):
    """
    Applies the Maxwell-Fricke equation for non-conducting spherical inclusions:
    sigma_eff = sigma_m * (1 - phi) / (1 + phi / 2)
    
    Parameters:
        medium_conductivity (float): Conductivity of the electrolyte broth (S/m).
        cell_volume_fraction (float): Volume fraction phi of cells (0.0 to 0.1).
        
    Returns:
        float: Effective conductivity of the suspension.
    """
    phi = cell_volume_fraction
    # Bound check to avoid division by zero or negative conductivity
    if phi < 0:
        phi = 0.0
    if phi > 0.9:
        phi = 0.9
        
    numerator = 1.0 - phi
    denominator = 1.0 + (phi / 2.0)
    return medium_conductivity * (numerator / denominator)

