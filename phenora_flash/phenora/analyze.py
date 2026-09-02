"""
PHENORA Flash - Layer 2: spectral intelligence and measurement integrity.

Three jobs, in this order:

1. QC / trust.  A Kramers-Kronig consistency test (linear KK, Boukamp's
   measurement-model formulation) decides whether the spectrum is even
   admissible. KK holds for any linear, causal, stable, time-invariant
   system regardless of what the system physically is, so a KK failure
   means drift, non-linearity or a bad contact - not an interesting
   biological finding. Nothing downstream is allowed to consume a
   spectrum that fails this gate. This is the single most important
   defence against the classic failure mode of impedance diagnostics:
   a model confidently classifying an artefact.

2. Non-parametric structure.  Distribution of relaxation times maps
   Z(f) onto a time-constant spectrum gamma(tau) without committing to an
   equivalent circuit first. It separates electrode polarisation from the
   sample's own dispersions, which is exactly the confound that ruins
   two-electrode biofluid measurements.

3. Parametric descriptors.  Cole and Randles fits give the small,
   physically named feature set that a model can be audited against.
"""

import numpy as np
from scipy.optimize import least_squares, nnls

from .physics import z_cpe, z_warburg, z_parallel


# ----------------------------------------------------------------------
# 1. Kramers-Kronig admissibility test
# ----------------------------------------------------------------------

def linear_kk(f, Z, n_rc=None, add_inductance=True):
    """Fit a series of fixed-tau RC elements; residuals reveal KK violation.

    The RC ladder is KK-transformable by construction, so if it can fit the
    data to within noise the data are KK-consistent. Fit is linear in the
    resistances, so there is no optimiser to get stuck.
    """
    f = np.asarray(f, float)
    Z = np.asarray(Z, complex)
    w = 2 * np.pi * f
    n_rc = n_rc or max(8, min(len(f) - 2, 3 * len(f) // 4))
    taus = 1.0 / (2 * np.pi * np.geomspace(f.min(), f.max(), n_rc))

    cols = [1.0 / (1.0 + 1j * np.outer(w, taus))]          # RC ladder
    basis = np.hstack(cols)
    extra = [np.ones((len(f), 1), complex)]                # series R
    extra.append((1.0 / (1j * w))[:, None])                # series C
    if add_inductance:
        extra.append((1j * w)[:, None])                    # series L
    A = np.hstack([basis] + extra)

    # Weight by 1/|Z| (proportional error structure), stack Re and Im.
    wt = 1.0 / np.abs(Z)
    M = np.vstack([np.real(A) * wt[:, None], np.imag(A) * wt[:, None]])
    y = np.concatenate([np.real(Z) * wt, np.imag(Z) * wt])
    coef, *_ = np.linalg.lstsq(M, y, rcond=None)
    Z_fit = A @ coef.astype(complex)

    res_re = (np.real(Z) - np.real(Z_fit)) / np.abs(Z)
    res_im = (np.imag(Z) - np.imag(Z_fit)) / np.abs(Z)
    chi2 = float(np.mean(res_re ** 2 + res_im ** 2))
    return dict(Z_fit=Z_fit, res_re=res_re, res_im=res_im, chi2=chi2,
                max_abs_res=float(np.max(np.abs(np.concatenate([res_re, res_im])))))


def integrity_score(kk, snr_db, saturated, contact_hint=None):
    """Collapse QC evidence into one 0-1 trust score plus a verdict.

    Deliberately conservative: a spectrum has to earn its way in.
    """
    kk_term = float(np.exp(-kk['chi2'] / 2e-4))
    snr_term = float(np.clip((np.median(snr_db) - 20.0) / 40.0, 0.0, 1.0))
    sat_term = 0.0 if saturated else 1.0
    score = 0.5 * kk_term + 0.35 * snr_term + 0.15 * sat_term
    flags = []
    if kk['chi2'] > 5e-4:
        flags.append('KK_INCONSISTENT')
    if np.median(snr_db) < 25:
        flags.append('LOW_SNR')
    if saturated:
        flags.append('ADC_SATURATION')
    if kk['max_abs_res'] > 0.05:
        flags.append('LOCAL_KK_OUTLIER')
    verdict = 'ACCEPT' if not flags else ('REVIEW' if score > 0.55 else 'REJECT')
    return dict(score=float(np.clip(score, 0, 1)), flags=flags, verdict=verdict,
                kk_chi2=kk['chi2'], median_snr_db=float(np.median(snr_db)))


# ----------------------------------------------------------------------
# 2. Distribution of relaxation times
# ----------------------------------------------------------------------

def compute_drt(f, Z, n_tau=64, lam=1e-3, subtract_ohmic=True):
    """Tikhonov-regularised, non-negative DRT on the imaginary part.

    Z(w) = R_inf + integral gamma(ln tau) / (1 + jw tau) d ln tau
    Solved as a non-negative least squares problem with a first-difference
    smoothness penalty. Using Im(Z) alone removes the R_inf nuisance term.
    """
    f = np.asarray(f, float)
    Z = np.asarray(Z, complex)
    w = 2 * np.pi * f
    taus = np.geomspace(1.0 / (2 * np.pi * f.max()) / 10,
                        1.0 / (2 * np.pi * f.min()) * 10, n_tau)

    K = -(np.outer(w, taus)) / (1.0 + (np.outer(w, taus)) ** 2)   # Im part kernel
    y = np.imag(Z).copy()
    scale = np.max(np.abs(y)) + 1e-18
    y = y / scale

    D = np.diff(np.eye(n_tau), axis=0)                            # smoothness
    A = np.vstack([K, np.sqrt(lam) * D * n_tau])
    b = np.concatenate([y, np.zeros(D.shape[0])])
    gamma, _ = nnls(A, b)
    gamma = gamma * scale

    peaks = []
    for i in range(1, n_tau - 1):
        if gamma[i] > gamma[i - 1] and gamma[i] >= gamma[i + 1] and gamma[i] > 0.05 * gamma.max():
            peaks.append((taus[i], gamma[i]))
    peaks.sort(key=lambda p: -p[1])
    return dict(tau=taus, gamma=gamma, peaks=peaks[:3])


# ----------------------------------------------------------------------
# 3. Parametric fits
# ----------------------------------------------------------------------

def fit_cole(f, Z):
    """Fit Cole model + residual electrode CPE. Returns named parameters."""
    f = np.asarray(f, float)
    Z = np.asarray(Z, complex)
    Rinf0 = float(np.min(np.abs(Z)))
    R00 = float(np.abs(Z[np.argmin(f)]))
    p0 = [max(R00, Rinf0 * 1.05), Rinf0, 3e5, 0.1, 3e-5, 0.88]

    def model(p):
        R0, Rinf, fc, a, Q, n = p
        zc = Rinf + (R0 - Rinf) / (1.0 + (1j * f / fc) ** (1.0 - a))
        return zc + z_cpe(f, Q, n)

    def resid(p):
        d = (model(p) - Z) / np.abs(Z)
        return np.concatenate([d.real, d.imag])

    lo = [1e-3, 1e-3, 1e2, 0.0, 1e-9, 0.5]
    hi = [1e9, 1e9, 1e8, 0.6, 1e-2, 1.0]
    p0 = list(np.clip(p0, lo, hi))
    try:
        r = least_squares(resid, p0, bounds=(lo, hi), max_nfev=4000)
        p = r.x
        ok = True
    except Exception:
        p, ok = p0, False
    keys = ['R0', 'Rinf', 'fc', 'alpha', 'Q_ep', 'n_ep']
    out = {k: float(v) for k, v in zip(keys, p)}
    out['cole_rmse'] = float(np.sqrt(np.mean(resid(p) ** 2)))
    out['cole_ok'] = ok
    out['dR'] = out['R0'] - out['Rinf']
    return out


def fit_electrolyte(f, Z):
    """Fit Rs + CPE - the correct model for a CELL-FREE electrolyte.

    Raw urine has no appreciable cell volume fraction, so it shows no
    beta-dispersion: forcing a Cole model onto it drives dR to zero and
    alpha to its bound, producing two junk features. Rs maps to bulk
    conductivity (a specific-gravity / ionic-strength proxy) and the CPE
    reports on the electrode interface, which is a QC signal, not a
    diagnostic one.
    """
    f = np.asarray(f, float)
    Z = np.asarray(Z, complex)
    p0 = [max(float(np.min(np.real(Z))), 1e-3), 3e-5, 0.88]

    def model(p):
        Rs, Q, n = p
        return Rs + z_cpe(f, Q, n)

    def resid(p):
        d = (model(p) - Z) / np.abs(Z)
        return np.concatenate([d.real, d.imag])

    lo, hi = [1e-3, 1e-10, 0.5], [1e8, 1e-1, 1.0]
    p0 = list(np.clip(p0, lo, hi))
    try:
        r = least_squares(resid, p0, bounds=(lo, hi), max_nfev=3000)
        p = r.x
    except Exception:
        p = p0
    out = dict(zip(['Rs', 'Q_ep', 'n_ep'], map(float, p)))
    out['elec_rmse'] = float(np.sqrt(np.mean(resid(p) ** 2)))
    ph = np.angle(Z, deg=True)
    out['phase_100Hz'] = float(np.interp(np.log10(100.0), np.log10(f), ph))
    out['phase_10kHz'] = float(np.interp(np.log10(1e4), np.log10(f), ph))
    return out


def fit_randles(f, Z):
    """Fit Rs + (Rct + W) || CPE. The affinity-channel workhorse."""
    f = np.asarray(f, float)
    Z = np.asarray(Z, complex)
    Rs0 = float(np.min(np.real(Z)))
    Rct0 = max(float(np.max(np.real(Z)) - Rs0), 1.0)
    p0 = [Rs0, Rct0, 1e-6, 0.9, 200.0]

    def model(p):
        Rs, Rct, Q, n, sw = p
        far = Rct + z_warburg(f, sw)
        return Rs + z_parallel(far, z_cpe(f, Q, n))

    def resid(p):
        d = (model(p) - Z) / np.abs(Z)
        return np.concatenate([d.real, d.imag])

    lo = [1e-3, 1e-2, 1e-11, 0.5, 1e-2]
    hi = [1e7, 1e9, 1e-2, 1.0, 1e6]
    p0 = list(np.clip(p0, lo, hi))
    try:
        r = least_squares(resid, p0, bounds=(lo, hi), max_nfev=4000)
        p = r.x
    except Exception:
        p = p0
    keys = ['Rs', 'Rct', 'Q', 'n', 'sigma_w']
    out = {k: float(v) for k, v in zip(keys, p)}
    out['randles_rmse'] = float(np.sqrt(np.mean(resid(p) ** 2)))
    return out


# ----------------------------------------------------------------------
# 4. Growth kinetics
# ----------------------------------------------------------------------

def fit_gompertz(t, y):
    """Modified Gompertz on a normalised impedance signal.

    Returns lag, mu_max, plateau and the detection time (first crossing of
    a fixed threshold above baseline).
    """
    t = np.asarray(t, float)
    y = np.asarray(y, float)
    A0 = max(float(np.max(y) - np.min(y)), 1e-6)

    def model(p):
        A, mu, lag, y0 = p
        arg = np.clip((mu * np.e / max(A, 1e-9)) * (lag - t) + 1.0, -30, 30)
        return y0 + A * np.exp(-np.exp(arg))

    p0 = [A0, max(A0 / max(t.max(), 1e-6), 1e-3), t.mean() * 0.4, float(y[0])]
    lo = [1e-6, 1e-5, -2.0, -1.0]
    hi = [10.0, 50.0, float(t.max()) + 5, 2.0]
    p0 = list(np.clip(p0, lo, hi))
    try:
        r = least_squares(lambda p: model(p) - y, p0, bounds=(lo, hi), max_nfev=3000)
        A, mu, lag, y0 = r.x
    except Exception:
        A, mu, lag, y0 = p0

    thr = y0 + 0.10 * max(A, 1e-9)
    above = np.where(y >= thr)[0]
    tdet = float(t[above[0]]) if len(above) else float('nan')
    return dict(A=float(A), mu_max=float(mu), lag=float(lag), y0=float(y0),
                t_detect_h=tdet, curve=model([A, mu, lag, y0]))
