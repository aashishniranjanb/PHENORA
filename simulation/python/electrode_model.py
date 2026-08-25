# Scientific Parameter Classifications:
# - CELL_CONSTANT (k_cell): LITERATURE / FITTED (based on electrode geometry, e.g., 100 to 500 m^-1)
# - DOUBLE_LAYER_CAPACITANCE (Cdl): LITERATURE-DERIVED (~1 uF to 50 uF per cm^2)
# - CHARGE_TRANSFER_RESISTANCE (Rct): LITERATURE / FITTED (~1k to 100k Ohms)

def map_conductivity_to_solution_resistance(effective_conductivity, cell_constant=250.0):
    """
    Maps effective suspension conductivity to bulk solution resistance Rs:
    Rs = cell_constant / effective_conductivity
    """
    if effective_conductivity <= 0:
        return 1e6 # Very high resistance if zero conductivity
    return cell_constant / effective_conductivity

