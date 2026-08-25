import numpy as np

def compute_impedance(frequencies, Rs, Rct, Cdl):
    """
    Computes complex impedance Z(f) for a Randles equivalent circuit:
    Z(f) = Rs + Rct / (1 + j * 2 * pi * f * Rct * Cdl)
    
    Parameters:
        frequencies (array-like): List of frequencies in Hz.
        Rs (float): Solution resistance (Ohms).
        Rct (float): Charge-transfer resistance (Ohms).
        Cdl (float): Double-layer capacitance (Farads).
        
    Returns:
        numpy.ndarray: Complex impedance values.
    """
    freqs = np.asarray(frequencies)
    omega = 2 * np.pi * freqs
    # Z_interface = Rct / (1 + j * omega * Rct * Cdl)
    numerator = Rct
    denominator = 1 + 1j * omega * Rct * Cdl
    Z = Rs + numerator / denominator
    return Z

def get_magnitude_and_phase(Z):
    """
    Calculates magnitude and phase angle from complex impedance.
    """
    magnitude = np.abs(Z)
    phase = np.angle(Z, deg=True)
    return magnitude, phase

