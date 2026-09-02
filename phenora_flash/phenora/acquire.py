"""
PHENORA Flash - Layer 1: parallel acquisition.

Concrete answer to "parallel execution". Instead of stepping one sine
across N frequencies (N x settling time), the band is split into a few
sub-bands and each sub-band is excited by a single crest-factor-optimised
multisine burst containing all of its tones at once. A bank of Goertzel
resonators demodulates every tone from the same record; on an FPGA those
resonators are independent and run concurrently, so acquisition time is
set by the lowest tone in each sub-band, not by the tone count.

Sub-band division also fixes the energy problem: concentrating the
compliance-limited excitation budget into fewer tones per burst raises
per-tone SNR, which matters because injected current is capped by sample
and patient safety limits rather than by electronics.

Simulated in floating point at bit-accurate word lengths so downstream
layers see realistic quantisation, noise, artefacts and leakage.
"""

import numpy as np

KB = 1.380649e-23


def snap_harmonics(f_lo, f_hi, n_tones, f_base):
    """Log-spaced tones snapped to exact DFT bins (coherent sampling)."""
    target = np.geomspace(f_lo, f_hi, n_tones)
    return np.unique(np.maximum(1, np.round(target / f_base).astype(int)))


def schroeder_phases(n):
    k = np.arange(1, n + 1)
    return -np.pi * k * (k - 1) / n


def build_multisine(harmonics, n_samples, amp):
    """Time-domain burst normalised to +/- amp. Returns (x, per_tone, CF, phases)."""
    n = np.arange(n_samples)
    phases = schroeder_phases(len(harmonics))
    raw = np.zeros(n_samples)
    for h, ph in zip(harmonics, phases):
        raw += np.cos(2 * np.pi * h * n / n_samples + ph)
    peak = np.max(np.abs(raw))
    crest = peak / np.sqrt(np.mean(raw ** 2))
    return raw / peak * amp, amp / peak, crest, phases


def quantise(x, n_bits, full_scale):
    lsb = 2.0 * full_scale / (2 ** n_bits)
    return np.clip(np.round(x / lsb) * lsb, -full_scale, full_scale)


def goertzel_bank(x, harmonics, n_samples):
    """One single-bin DFT per tone. On hardware these run concurrently."""
    n = np.arange(n_samples)
    out = np.empty(len(harmonics), dtype=complex)
    for idx, k in enumerate(harmonics):
        out[idx] = 2.0 * np.dot(x, np.exp(-2j * np.pi * k * n / n_samples)) / n_samples
    return out


def acquire_band(z_fun, f_lo, f_hi, n_tones, rng, periods=4, oversample=8,
                 i_amp=100e-6, adc_bits=16, v_fs=1.2, temp_k=310.0,
                 contact_quality=1.0, keep_trace=False):
    f_base = f_lo / periods
    n_samples = int(round((f_hi / f_lo) * periods * oversample))
    fs = f_base * n_samples
    harmonics = snap_harmonics(f_lo, f_hi, n_tones, f_base)
    freqs = harmonics * f_base

    i_t, tone_i, crest, phases = build_multisine(harmonics, n_samples, i_amp)
    Z_true = np.asarray(z_fun(freqs), dtype=complex)

    n = np.arange(n_samples)
    v_t = np.zeros(n_samples)
    for h, ph, z in zip(harmonics, phases, Z_true):
        v_t += tone_i * np.abs(z) * np.cos(
            2 * np.pi * h * n / n_samples + ph + np.angle(z))

    headroom = np.max(np.abs(v_t)) + 1e-15
    gain = float(np.clip(2.0 ** np.floor(np.log2(0.8 * v_fs / headroom)), 1e-3, 4096.0))

    r_eq = float(np.median(np.abs(Z_true)))
    poor = 1.0 - contact_quality
    v_noise = np.sqrt(4 * KB * temp_k * r_eq * fs / 2) + 12e-9 * np.sqrt(fs / 2)
    v_t = v_t + rng.normal(0.0, v_noise * (1.0 + 10.0 * poor), n_samples)
    if poor > 1e-6:
        v_t = v_t * (1.0 + poor * 0.4 * np.sin(
            2 * np.pi * rng.uniform(0.2, 3.0) * n / fs + rng.uniform(0, 6.28)))

    v_scaled = v_t * gain
    saturated = bool(np.any(np.abs(v_scaled) >= v_fs * 0.999))
    v_adc = quantise(v_scaled, adc_bits, v_fs)
    i_adc = quantise(i_t, adc_bits, i_amp * 1.5)

    V = goertzel_bank(v_adc / gain, harmonics, n_samples)
    I = goertzel_bank(i_adc, harmonics, n_samples)
    Z = V / I

    resid = v_adc / gain - v_t
    snr_db = 20 * np.log10(np.abs(V) / (np.std(resid) / np.sqrt(n_samples) + 1e-18))

    out = dict(f=freqs, Z=Z, Z_true=Z_true, snr_db=snr_db, crest=float(crest),
               fs=fs, n_samples=n_samples, t_acq=n_samples / fs,
               saturated=saturated, gain=gain)
    if keep_trace:
        out.update(t=n / fs, v=v_adc, i=i_adc, band=(f_lo, f_hi))
    return out


DEFAULT_BANDS = [(10.0, 1e3, 9), (1e3, 1e5, 9), (1e5, 1e6, 8)]


def acquire_spectrum(z_fun, rng, bands=None, keep_trace=False, **kw):
    """Run every sub-band. Returns (f, Z, Z_true, snr_db, meta, band_records)."""
    bands = bands or DEFAULT_BANDS
    recs = [acquire_band(z_fun, lo, hi, nt, rng, keep_trace=keep_trace, **kw)
            for lo, hi, nt in bands]
    f = np.concatenate([r['f'] for r in recs])
    Z = np.concatenate([r['Z'] for r in recs])
    Zt = np.concatenate([r['Z_true'] for r in recs])
    snr = np.concatenate([r['snr_db'] for r in recs])
    order = np.argsort(f)
    keep = np.concatenate([[True], np.diff(f[order]) > 1e-9])
    idx = order[keep]

    # Honest comparison: a stepped sweep needs `periods` cycles AT EACH tone,
    # so its cost is sum(periods / f_i), not n_tones x the longest record.
    t_par = float(sum(r['t_acq'] for r in recs))
    t_seq = float(sum(np.sum(4.0 / r['f']) for r in recs))
    meta = dict(t_acq_parallel_s=t_par,
                t_acq_stepped_equiv_s=t_seq,
                simultaneity_window_s=float(max(r['t_acq'] for r in recs)),
                parallel_speedup=t_seq / t_par,
                crest_factors=[round(r['crest'], 3) for r in recs],
                saturated=any(r['saturated'] for r in recs),
                n_tones=int(len(idx)),
                median_snr_db=float(np.median(snr[idx])))
    return f[idx], Z[idx], Zt[idx], snr[idx], meta, recs
