"""
PHENORA Flash - Layer -1: the hardware the architecture actually requires.

This module does not just list parts. It computes whether the parts close
the loop: frequency coverage against what the assay needs, injected current
against safety, noise floor against the smallest feature we ask a model to
read, channel count against the simultaneity requirement, and thermal
stability against the sensitivity of growth rate to temperature.

Run it:  python3 -m phenora.hardware
"""

import numpy as np

# ----------------------------------------------------------------------
# What the assay needs, derived from the rest of the codebase
# ----------------------------------------------------------------------

REQUIREMENTS = {
    "f_low_hz": 100.0,
    "f_high_hz": 200_000.0,
    "reason_low": "electrode-interface term dominates below ~1 kHz and carries "
                  "the charge-transfer signal the affinity channels transduce",
    "reason_high": "medium conductance and the interfacial arc are resolved well "
                   "below 200 kHz; nothing in the assay lives above it",
    "channels": 8,
    "simultaneity": "control and antibiotic wells must be sampled inside one "
                    "window, otherwise the ratio compares two different moments",
    "smallest_feature": 2e-3,   # relative dZ/Z the classifier must resolve
    "temp_setpoint_c": 37.0,
    "temp_tolerance_c": 0.5,
}

# ----------------------------------------------------------------------
# The bill of materials. One row per decision, with the alternative that
# was considered and the reason it lost.
# ----------------------------------------------------------------------

BOM = [
    dict(
        block="Analog front end",
        part="AD5941 (Analog Devices)",
        qty=4,
        role="Impedance and electrochemical AFE. One device serves two "
             "cartridge channels.",
        why="Covers 0.015 Hz to 200 kHz across two excitation loops, which is "
            "the entire band the assay uses. Carries a 16-bit 800 kSPS SAR ADC, "
            "a hardware DFT accelerator, a low-noise potentiostat for the "
            "redox-probe affinity channels, a high-speed TIA for the growth "
            "channels, and a switch matrix with a dedicated path for an "
            "external calibration resistor.",
        rejected=[
            ("AD5933", "1 kHz-100 kHz only, 12-bit, two-electrode, and no "
                       "potentiostat. It cannot bias a redox-probe affinity "
                       "electrode, which is where specificity comes from."),
            ("Discrete DDS + Howland source + INA + SAR",
             "Higher performance ceiling and true multisine, but it is a "
             "6-month analog design programme. Correct for v2, wrong for v1."),
        ],
        package="48-lead LFCSP",
        note="Choose AD5941 over AD5940: same silicon, leadframe package "
             "instead of WLCSP, so it can be hand-assembled and reworked on "
             "prototype boards.",
    ),
    dict(
        block="Channel multiplexing",
        part="ADG1607 (2x)",
        qty=2,
        role="Routes one AFE across its two cartridge channels.",
        why="Low charge injection matters here. A mux that dumps charge into "
            "an electrode double layer on every switch corrupts the very "
            "interfacial measurement the affinity channel depends on.",
        rejected=[("CD4051", "Charge injection and Ron flatness are both an "
                             "order of magnitude worse. Fine for logic, not "
                             "for an electrochemical interface.")],
        package="TSSOP-16",
    ),
    dict(
        block="Calibration reference",
        part="Vishay VSMP series 0.01% 25 ppm/degC, plus a known RC network",
        qty=8,
        role="On-board known impedance for the gain-factor calibration the "
             "AFE requires, run before every cartridge.",
        why="Every AD5941 must be calibrated against a known impedance or its "
            "readings are arbitrary. Making this a permanent on-board network "
            "rather than a bench procedure is what makes device-to-device "
            "agreement possible at scale.",
        rejected=[("0.1% thin film", "Its tempco swamps the drift budget the "
                                     "calibration is meant to remove.")],
    ),
    dict(
        block="Controller",
        part="STM32U585 (or STM32H563)",
        qty=1,
        role="Sequencer, SPI master to four AFEs, thermal PID loop, USB.",
        why="Needs four independent SPI chip-selects, a hardware timer that "
            "can fire a shared sync line, enough RAM to buffer four spectra, "
            "and USB for the host. The U5 has all of it with margin and is "
            "widely stocked.",
        rejected=[("ESP32", "Wireless is a liability, not a feature, in a "
                            "device that will eventually touch clinical data."),
                  ("ADuCM3029", "Convenient because it is ADI's own reference "
                                "platform, but short on RAM once four AFEs "
                                "stream concurrently.")],
    ),
    dict(
        block="Thermal control",
        part="TMP117 sensor + polyimide film heater + DRV8871 driver",
        qty=1,
        role="Holds the growth block at 37 degC under closed-loop PID.",
        why="Growth rate is strongly temperature-dependent, so an uncontrolled "
            "well makes every kinetic feature meaningless. The TMP117 is "
            "accurate to about 0.1 degC without calibration, which leaves "
            "the whole tolerance budget for the control loop.",
        rejected=[("NTC thermistor", "Needs individual calibration and drifts. "
                                     "Saves a dollar, costs a validation study."),
                  ("Peltier", "Bidirectional control is unnecessary when the "
                              "setpoint is always above ambient. Adds cost, "
                              "power, and a condensation failure mode.")],
    ),
    dict(
        block="Affinity electrodes",
        part="Screen-printed gold 3-electrode, functionalised",
        qty=3,
        role="Antibody or aptamer capture surface with an on-chip Ag/AgCl "
             "pseudo-reference.",
        why="Gold takes established thiol self-assembled-monolayer chemistry, "
            "and screen printing gives a disposable, single-use surface, which "
            "is what a diagnostic cartridge needs.",
        rejected=[("Reusable macro-electrode", "Regeneration between samples "
                                               "is the dominant source of "
                                               "carry-over in EIS biosensing.")],
        risk="Lot-to-lot variance of the functionalised surface is the largest "
             "manufacturing risk in this device. Not the electronics.",
    ),
    dict(
        block="Growth electrodes",
        part="Interdigitated gold, ~10 um finger and gap",
        qty=4,
        role="Control well plus three antibiotic wells.",
        why="Interdigitated geometry concentrates the field in a thin layer at "
            "the surface, where metabolite-driven conductance change is "
            "largest, and needs only a small sample volume.",
        rejected=[("Parallel plate", "Larger volume, lower sensitivity to the "
                                     "near-surface change that carries the "
                                     "growth signal.")],
    ),
    dict(
        block="Bulk electrode",
        part="Four-terminal cell, platinised",
        qty=1,
        role="Matrix state and quality control only.",
        why="Four-terminal separates the electrode interface from the sample. "
            "Kept because it catches bad specimens, not because it diagnoses.",
        rejected=[("Two-terminal", "Interface impedance dominates and cannot "
                                   "be separated from the sample.")],
        note="Demoted deliberately. On its own this channel classifies at "
             "18.8% against a 16.7% chance baseline.",
    ),
]


# ----------------------------------------------------------------------
# Feasibility budgets. These are computed, not asserted.
# ----------------------------------------------------------------------

def frequency_budget(afe_low=0.015, afe_high=200_000.0):
    need_lo, need_hi = REQUIREMENTS["f_low_hz"], REQUIREMENTS["f_high_hz"]
    decades_needed = np.log10(need_hi / need_lo)
    decades_have = np.log10(afe_high / afe_low)
    return dict(
        need=(need_lo, need_hi), have=(afe_low, afe_high),
        decades_needed=round(float(decades_needed), 2),
        decades_available=round(float(decades_have), 2),
        margin_low_decades=round(float(np.log10(need_lo / afe_low)), 2),
        margin_high_decades=round(float(np.log10(afe_high / need_hi)), 2),
        pass_=bool(afe_low <= need_lo and afe_high >= need_hi),
    )


def current_budget(v_pp=0.2, z_min_ohm=50.0, r_limit_ohm=560.0,
                   limit_rms_ua=400.0):
    """Injected current against the ceiling.

    The first pass of this budget FAILED: a 200 mVpp excitation into a
    50 ohm well draws 1414 uA rms, three and a half times the limit. A
    series current-limiting resistor is the standard fix and is what the
    AFE reference designs use. It is included here because the budget
    found the problem, not because it was assumed from the start.
    """
    z_total = z_min_ohm + r_limit_ohm
    i_pk = v_pp / 2.0 / z_total
    i_rms_ua = i_pk / np.sqrt(2) * 1e6
    unlimited = (v_pp / 2.0 / z_min_ohm) / np.sqrt(2) * 1e6
    return dict(excitation_v_pp=v_pp, z_min_ohm=z_min_ohm,
                r_limit_ohm=r_limit_ohm,
                i_rms_ua_without_limiter=round(float(unlimited), 1),
                i_rms_ua=round(float(i_rms_ua), 1),
                limit_rms_ua=limit_rms_ua,
                headroom_x=round(float(limit_rms_ua / i_rms_ua), 2),
                pass_=bool(i_rms_ua < limit_rms_ua),
                note="In-vitro cartridge with no patient contact, so the real "
                     "constraints are sample heating and driving the electrode "
                     "out of its linear range. The wearable limit is kept as a "
                     "conservative anchor. Without the series resistor this "
                     "budget fails outright.")


def noise_budget(adc_bits=16, n_avg=1024, pga=1.0):
    """Can the front end resolve the smallest feature the model reads?"""
    lsb_rel = 1.0 / (2 ** adc_bits)
    quant = lsb_rel / np.sqrt(12) / np.sqrt(n_avg) / pga
    target = REQUIREMENTS["smallest_feature"]
    return dict(adc_bits=adc_bits, averages=n_avg,
                quantisation_floor=float(f"{quant:.2e}"),
                smallest_feature=target,
                margin_x=int(target / quant),
                pass_=bool(quant < target / 10),
                note="Quantisation is not the limit. Electrode and contact "
                     "repeatability at roughly 1e-3 is, which is why the "
                     "Kramers-Kronig gate exists.")


def parallelism_budget(n_afe=4, ch_per_afe=2, sync_jitter_us=1.0,
                       sweep_time_s=1.2):
    """Channel-domain parallelism, which is the form that actually matters."""
    total = n_afe * ch_per_afe
    seq = total * sweep_time_s
    par = ch_per_afe * sweep_time_s
    return dict(afes=n_afe, channels=total,
                sequential_s=round(seq, 2), parallel_s=round(par, 2),
                speedup=round(seq / par, 2),
                sync_jitter_us=sync_jitter_us,
                pass_=bool(total >= REQUIREMENTS["channels"]),
                note="Parallelism here is across CHANNELS, not frequencies. "
                     "A susceptibility ratio compares a control well against "
                     "an antibiotic well, so the two must be read inside one "
                     "window. A shared hardware sync line gives microsecond "
                     "alignment. Frequency-domain parallelism (multisine) buys "
                     "far less and needs a different front end.")


def thermal_budget(sensor_acc_c=0.1, loop_err_c=0.25, q10=2.0):
    """Temperature error translated into growth-rate error."""
    total = sensor_acc_c + loop_err_c
    mu_err = q10 ** (total / 10.0) - 1.0
    return dict(sensor_accuracy_c=sensor_acc_c, loop_error_c=loop_err_c,
                total_error_c=round(total, 2),
                tolerance_c=REQUIREMENTS["temp_tolerance_c"],
                growth_rate_error_pct=round(float(mu_err * 100), 2),
                pass_=bool(total <= REQUIREMENTS["temp_tolerance_c"]),
                note="Q10 of about 2 near 37 degC, so 0.35 degC of error is "
                     "roughly 2.5% on growth rate. That sits under the "
                     "well-to-well biological variation, so it is not the "
                     "limiting term.")


def summary():
    return dict(frequency=frequency_budget(), current=current_budget(),
                noise=noise_budget(), parallelism=parallelism_budget(),
                thermal=thermal_budget())


def main():
    print("=" * 72)
    print("  PHENORA FLASH - HARDWARE FEASIBILITY BUDGETS")
    print("=" * 72)
    for name, b in summary().items():
        ok = "PASS" if b["pass_"] else "FAIL"
        print(f"\n  [{ok}] {name.upper()}")
        for k, v in b.items():
            if k in ("pass_", "note"):
                continue
            print(f"        {k:<26s} {v}")
        if "note" in b:
            for line in _wrap(b["note"], 60):
                print(f"        > {line}")

    print("\n" + "=" * 72)
    print("  BILL OF MATERIALS")
    print("=" * 72)
    for r in BOM:
        print(f"\n  {r['block']}")
        print(f"    part      {r['part']}  x{r['qty']}")
        print(f"    role      {r['role']}")
        for line in _wrap(r["why"], 62):
            print(f"    why       {line}" if line == _wrap(r["why"], 62)[0]
                  else f"              {line}")
        for alt, reason in r.get("rejected", []):
            wrapped = _wrap(reason, 54)
            print(f"    not       {alt}: {wrapped[0]}")
            for line in wrapped[1:]:
                print(f"              {line}")
        if r.get("risk"):
            for line in _wrap(r["risk"], 62):
                print(f"    RISK      {line}")


def _wrap(text, width):
    words, lines, cur = text.split(), [], ""
    for w in words:
        if len(cur) + len(w) + 1 > width:
            lines.append(cur)
            cur = w
        else:
            cur = f"{cur} {w}".strip()
    if cur:
        lines.append(cur)
    return lines


if __name__ == "__main__":
    main()
