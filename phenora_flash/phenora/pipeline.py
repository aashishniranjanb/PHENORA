"""
PHENORA Flash - Layers 5-7: cartridge, staged features, calibrated
classification, and the autonomous measurement planner.

Read this file as the answer to "what actually comes out of the box".

The cartridge is a multi-channel object, not a single electrode pair:

    BULK        bare 4-electrode cell        -> matrix physical state
    AFF x3      functionalised electrodes    -> analyte specificity
    GROWTH x4   control + 3 antibiotic wells -> organism behaviour + AST

Specificity does not come from the spectrum. It comes from the
recognition chemistry on the affinity electrodes and from the biology in
the growth wells. The spectrum is the transducer. This is the single most
important design decision in the whole platform, and it is the reason a
"put blood in, get a disease name out" architecture built on bare
electrodes alone cannot work.

Output is a conformal prediction SET with a coverage guarantee, plus an
explicit ABSTAIN path, not a single label with a softmax number.
"""

import numpy as np
from dataclasses import dataclass

from .physics import BulkCell, AffinityCell, GrowthWell
from .acquire import acquire_spectrum, acquire_band
from .analyze import (linear_kk, integrity_score, fit_electrolyte,
                      fit_randles, fit_gompertz, compute_drt)

# ----------------------------------------------------------------------
# Panel definition (urine, UTI panel)
# ----------------------------------------------------------------------

CLASSES = ['NEGATIVE', 'E_COLI_S', 'E_COLI_R', 'K_PNEUMONIAE',
           'E_FAECALIS', 'P_MIRABILIS']

ABX = ['NITROFURANTOIN', 'CIPROFLOXACIN', 'TRIMETHOPRIM']
AFF = ['CRP', 'IL6', 'ENDOTOXIN']

# growth kinetics + intrinsic/acquired resistance profile per class
# inhibition 1.0 = fully suppressed, 0.0 = grows freely
PANEL = {
    'NEGATIVE':      dict(mu=0.02, lag=6.0, beta=0.03, gram=None,
                          inhib=[1.0, 1.0, 1.0], crp=2e-11, il6=1e-12),
    'E_COLI_S':      dict(mu=1.50, lag=1.05, beta=0.62, gram='neg',
                          inhib=[0.95, 0.96, 0.90], crp=9e-10, il6=4e-11),
    'E_COLI_R':      dict(mu=1.42, lag=1.20, beta=0.60, gram='neg',
                          inhib=[0.18, 0.15, 0.10], crp=1.1e-9, il6=5e-11),
    'K_PNEUMONIAE':  dict(mu=1.18, lag=1.45, beta=0.55, gram='neg',
                          inhib=[0.45, 0.90, 0.55], crp=8e-10, il6=3.5e-11),
    'E_FAECALIS':    dict(mu=0.85, lag=1.95, beta=0.40, gram='pos',
                          inhib=[0.90, 0.30, 0.12], crp=6e-10, il6=2.5e-11),
    'P_MIRABILIS':   dict(mu=1.10, lag=1.35, beta=0.98, gram='neg',
                          inhib=[0.20, 0.85, 0.70], crp=7e-10, il6=3e-11),
}

GROWTH_T = np.arange(0.0, 4.01, 0.5)          # hours
GROWTH_BAND = (100.0, 1e4, 5)


# ----------------------------------------------------------------------
# Cartridge construction
# ----------------------------------------------------------------------

@dataclass
class Cartridge:
    label: str
    bulk: BulkCell
    aff: dict
    wells: dict
    contact_quality: float
    temperature_c: float


def make_cartridge(label, rng, force_bad_contact=False):
    p = PANEL[label]
    j = lambda m, s: float(m * np.exp(rng.normal(0, s)))     # lognormal jitter

    # Hydration is a nuisance factor: it moves bulk conductivity a lot and
    # carries no diagnostic information. It is in here on purpose.
    sigma_dc = j(1.55, 0.28)
    if label == 'P_MIRABILIS':
        sigma_dc *= j(1.25, 0.08)                            # urease -> ammonium

    bulk = BulkCell(k_cell=120.0, sigma_dc=sigma_dc, hct=0.0,
                    f_beta=j(6e5, 0.25), alpha_beta=float(np.clip(rng.normal(0.16, 0.04), 0.02, 0.45)),
                    Q_ep=j(3.0e-5, 0.20), n_ep=float(np.clip(rng.normal(0.88, 0.02), 0.7, 0.98)))

    endo = j(6e-10, 0.35) if p['gram'] == 'neg' else (j(2e-12, 0.5) if p['gram'] == 'pos' else j(6e-13, 0.6))
    aff = {
        'CRP':       AffinityCell('CRP', Rct0=j(480, 0.10), Kd=1.0e-9, conc=j(p['crp'], 0.40)),
        'IL6':       AffinityCell('IL6', Rct0=j(520, 0.10), Kd=5.0e-11, conc=j(p['il6'], 0.45)),
        'ENDOTOXIN': AffinityCell('ENDOTOXIN', Rct0=j(610, 0.10), Kd=5.0e-10, conc=endo),
    }

    mu = j(p['mu'], 0.16) if p['mu'] > 0.1 else j(p['mu'], 0.5)
    lag = float(np.clip(rng.normal(p['lag'], 0.22), 0.2, 8.0))
    beta = j(p['beta'], 0.15)
    logN0 = float(np.clip(rng.normal(4.2, 0.55), 2.5, 6.0))

    wells = {'CTRL': GrowthWell(logN0=logN0, mu=mu, lag=lag, beta_sigma=beta,
                                sigma0=j(0.12, 0.08), inhibition=0.0)}
    for name, inh in zip(ABX, p['inhib']):
        wells[name] = GrowthWell(logN0=logN0, mu=mu, lag=lag, beta_sigma=beta,
                                 sigma0=j(0.12, 0.08),
                                 inhibition=float(np.clip(rng.normal(inh, 0.09), 0.0, 1.0)))

    cq = 0.45 + 0.2 * rng.random() if force_bad_contact else float(np.clip(rng.normal(0.95, 0.035), 0.5, 0.999))
    return Cartridge(label, bulk, aff, wells, cq, float(rng.normal(36.8, 0.4)))


# ----------------------------------------------------------------------
# Staged acquisition -> features
# Each stage corresponds to one action the autonomous planner can take.
# ----------------------------------------------------------------------

STAGES = {
    'BULK_SCAN':      ['bulk_logRs', 'bulk_logQ', 'bulk_n', 'bulk_phase100'],
    'AFFINITY_PANEL': ['aff_CRP_dRct', 'aff_IL6_dRct', 'aff_ENDOTOXIN_dRct'],
    'GROWTH_2H':      ['g2_nis', 'g2_slope'],
    'GROWTH_4H':      ['g4_mu', 'g4_lag', 'g4_tdet', 'g4_plateau', 'g4_logtau'],
    'AST_PANEL':      ['ast_NITROFURANTOIN', 'ast_CIPROFLOXACIN',
                      'ast_TRIMETHOPRIM', 'ast_valid'],
}
FEATURES = [f for s in STAGES.values() for f in s]
STAGE_ORDER = list(STAGES.keys())
STAGE_COST_MIN = {'BULK_SCAN': 0.4, 'AFFINITY_PANEL': 6.0,
                  'GROWTH_2H': 120.0, 'AST_PANEL': 60.0, 'GROWTH_4H': 120.0}

# Physical prerequisites. An AST readout at t=3h is meaningless unless the
# wells have already been incubating, so the planner is not permitted to
# schedule it first no matter how much information it promises. Cost is the
# INCREMENTAL cost once prerequisites are met.
STAGE_REQUIRES = {'BULK_SCAN': [], 'AFFINITY_PANEL': [],
                  'GROWTH_2H': [], 'AST_PANEL': ['GROWTH_2H'],
                  'GROWTH_4H': ['GROWTH_2H']}


def available_stages(done, remaining):
    return [s for s in remaining if all(r in done for r in STAGE_REQUIRES[s])]


def _growth_signal(well, rng, cq, times=GROWTH_T):
    """Normalised impedance signal NIS(t) from the solution-resistance term."""
    vals = []
    lo, hi, nt = GROWTH_BAND
    for t in times:
        rec = acquire_band(lambda f: well.spectrum(f, t), lo, hi, nt, rng,
                           i_amp=20e-6, contact_quality=cq)
        vals.append(float(np.max(np.real(rec['Z']))))     # ~ Rs + Rct arc top
    v = np.asarray(vals)
    return (v[0] - v) / max(abs(v[0]), 1e-9)              # rises as biomass grows


def run_cartridge(cart, rng, keep_traces=False):
    """Full acquisition of one cartridge. Returns features + QC + artefacts."""
    art = {}

    # --- BULK ---------------------------------------------------------
    f, Z, Zt, snr, meta, recs = acquire_spectrum(
        cart.bulk.spectrum, rng, contact_quality=cart.contact_quality,
        i_amp=100e-6, keep_trace=keep_traces)
    kk = linear_kk(f, Z)
    qc = integrity_score(kk, snr, meta['saturated'])
    elec = fit_electrolyte(f, Z)
    feats = {
        'bulk_logRs':     np.log10(max(elec['Rs'], 1e-3)),
        'bulk_logQ':      np.log10(max(elec['Q_ep'], 1e-12)),
        'bulk_n':         elec['n_ep'],
        'bulk_phase100':  elec['phase_100Hz'],
    }
    art['bulk'] = dict(f=f, Z=Z, Z_true=Zt, snr=snr, meta=meta, kk=kk, qc=qc,
                       elec=elec, recs=recs if keep_traces else None)

    # --- AFFINITY -----------------------------------------------------
    art['aff'] = {}
    for name, cell in cart.aff.items():
        fa, Za, Zat, snra, metaa, _ = acquire_spectrum(
            cell.spectrum, rng, bands=[(10.0, 1e3, 9), (1e3, 1e5, 9)],
            contact_quality=cart.contact_quality, i_amp=5e-6)
        rand = fit_randles(fa, Za)
        kka = linear_kk(fa, Za)
        blank = cell.Rct0
        feats[f'aff_{name}_dRct'] = np.log10(max(rand['Rct'], 1e-3) / blank)
        art['aff'][name] = dict(f=fa, Z=Za, randles=rand, kk=kka, snr=snra)

    # --- GROWTH -------------------------------------------------------
    art['growth'] = {}
    nis = {}
    for wname, well in cart.wells.items():
        y = _growth_signal(well, rng, cart.contact_quality)
        nis[wname] = y
        art['growth'][wname] = dict(t=GROWTH_T, nis=y)

    ctrl = nis['CTRL']
    i2 = int(np.argmin(np.abs(GROWTH_T - 2.0)))
    feats['g2_nis'] = float(ctrl[i2])
    feats['g2_slope'] = float((ctrl[i2] - ctrl[max(i2 - 2, 0)]) / 1.0)

    gfit = fit_gompertz(GROWTH_T, ctrl)
    art['growth']['CTRL']['fit'] = gfit
    feats['g4_mu'] = gfit['mu_max']
    feats['g4_lag'] = gfit['lag']
    feats['g4_tdet'] = gfit['t_detect_h'] if np.isfinite(gfit['t_detect_h']) else 8.0
    feats['g4_plateau'] = gfit['A']

    fz, Zz, _, _, _, _ = acquire_spectrum(
        lambda ff: cart.wells['CTRL'].spectrum(ff, GROWTH_T[-1]), rng,
        bands=[(10.0, 1e3, 9), (1e3, 1e5, 9)], contact_quality=cart.contact_quality, i_amp=20e-6)
    drt = compute_drt(fz, Zz)
    feats['g4_logtau'] = float(np.log10(drt['peaks'][0][0])) if drt['peaks'] else -4.0
    art['drt'] = drt

    # --- AST ----------------------------------------------------------
    # AST is only interpretable if the growth CONTROL actually grew. Without
    # that, a susceptibility ratio is a division by noise. The instrument
    # reports NOT_APPLICABLE rather than a confident number.
    i3 = int(np.argmin(np.abs(GROWTH_T - 3.0)))
    ctrl_grew = bool(ctrl[i3] > 0.06)
    for a in ABX:
        feats[f'ast_{a}'] = (float(np.clip(nis[a][i3] / ctrl[i3], -0.2, 1.5))
                             if ctrl_grew else 0.0)
    feats['ast_valid'] = 1.0 if ctrl_grew else 0.0

    x = np.array([feats[k] for k in FEATURES], float)
    x = np.nan_to_num(x, nan=0.0, posinf=0.0, neginf=0.0)
    return x, feats, qc, art


# ----------------------------------------------------------------------
# Conformal classifier
# ----------------------------------------------------------------------

class ConformalPanel:
    """Gradient-boosted classifier wrapped in split conformal prediction.

    The point is not the accuracy number. The point is that the output is
    a SET whose marginal coverage is guaranteed at 1-alpha under exchange-
    ability, and that the set is allowed to be large - or the instrument
    is allowed to abstain - when the evidence does not support a call.
    """

    def __init__(self, alpha=0.10, seed=0):
        from sklearn.ensemble import HistGradientBoostingClassifier
        self.alpha = alpha
        self.clf = HistGradientBoostingClassifier(
            max_iter=300, learning_rate=0.08, max_depth=None,
            l2_regularization=1.0, random_state=seed)
        self.qhat = None
        self.classes_ = None

    def fit(self, Xtr, ytr, Xcal, ycal):
        self.clf.fit(Xtr, ytr)
        self.classes_ = self.clf.classes_
        p = self.clf.predict_proba(Xcal)
        idx = np.array([list(self.classes_).index(c) for c in ycal])
        scores = 1.0 - p[np.arange(len(ycal)), idx]
        n = len(scores)
        q = np.ceil((n + 1) * (1 - self.alpha)) / n
        self.qhat = float(np.quantile(scores, min(q, 1.0), method='higher'))
        return self

    def predict_set(self, X):
        p = self.clf.predict_proba(X)
        keep = p >= (1.0 - self.qhat)
        sets = [[self.classes_[j] for j in np.where(row)[0]] for row in keep]
        return sets, p

    def report(self, x, qc, min_trust=0.55):
        p = self.clf.predict_proba(x.reshape(1, -1))[0]
        order = np.argsort(-p)
        pset = [self.classes_[j] for j in np.where(p >= 1.0 - self.qhat)[0]]
        H = float(-np.sum(p * np.log(p + 1e-12)) / np.log(len(p)))
        if qc['verdict'] == 'REJECT' or qc['score'] < min_trust:
            decision = 'ABSTAIN_QC'
        elif len(pset) == 0:
            decision = 'ABSTAIN_OUT_OF_DISTRIBUTION'
        elif len(pset) == 1:
            decision = 'REPORT_SINGLE'
        elif len(pset) <= 3:
            decision = 'REPORT_SET'
        else:
            decision = 'ABSTAIN_UNRESOLVED'
        return dict(probs=p, ranking=[(self.classes_[j], float(p[j])) for j in order],
                    pred_set=pset, entropy=H, decision=decision,
                    coverage_target=1 - self.alpha, qhat=self.qhat, qc=qc)


# ----------------------------------------------------------------------
# Autonomous planner: expected information gain over next actions
# ----------------------------------------------------------------------

class EIGPlanner:
    """Chooses the next measurement by expected reduction in posterior entropy.

    Class-conditional Gaussians are fitted to each stage's feature block on
    the training set. For a candidate action a:

        EIG(a) = H(posterior) - E_{y ~ posterior, x_a ~ p(x_a | y)} H(posterior | x_a)

    The expectation is taken under the model's OWN current belief, so the
    planner never peeks at ground truth. Cost-normalised EIG (bits per
    minute) decides what to run next.
    """

    def __init__(self, classes):
        self.classes = list(classes)
        self.stats = {}

    def fit(self, X, y):
        for stage, names in STAGES.items():
            cols = [FEATURES.index(n) for n in names]
            per = {}
            for c in self.classes:
                m = X[np.asarray(y) == c][:, cols]
                mu = m.mean(0)
                sd = m.std(0) + 1e-6
                per[c] = (mu, sd)
            self.stats[stage] = (cols, per)
        return self

    def _loglik(self, stage, xa):
        cols, per = self.stats[stage]
        out = np.empty(len(self.classes))
        for i, c in enumerate(self.classes):
            mu, sd = per[c]
            out[i] = float(np.sum(-0.5 * ((xa - mu) / sd) ** 2 - np.log(sd)))
        return out

    @staticmethod
    def _H(p):
        p = np.clip(p, 1e-12, 1.0)
        return float(-np.sum(p * np.log2(p)))

    def eig(self, posterior, stage, rng, n_mc=160):
        cols, per = self.stats[stage]
        H0 = self._H(posterior)
        acc = 0.0
        for _ in range(n_mc):
            c = rng.choice(self.classes, p=posterior)
            mu, sd = per[c]
            xa = rng.normal(mu, sd)
            ll = self._loglik(stage, xa)
            ll -= ll.max()
            post = posterior * np.exp(ll)
            post = post / post.sum()
            acc += self._H(post)
        return H0 - acc / n_mc

    def plan(self, posterior, remaining, rng, done=()):
        rows = []
        for stage in available_stages(list(done), remaining):
            g = self.eig(posterior, stage, rng)
            cost = STAGE_COST_MIN[stage]
            rows.append(dict(action=stage, eig_bits=g, cost_min=cost,
                             bits_per_min=g / cost))
        rows.sort(key=lambda r: -r['bits_per_min'])
        return rows
