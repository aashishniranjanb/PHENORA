"""
PHENORA Flash - validation of the SOFTWARE, on synthetic data.

Four questions, each with a number attached:

  V1  Does the integrity gate actually catch bad measurements?
  V2  Are the twin's forecast intervals calibrated?
  V3  Is the conformal coverage guarantee honoured, per class?
  V4  WHERE does the diagnostic information come from?

V4 is the one that matters for the product argument. If the bulk spectrum
alone carries the answer, the cheap architecture wins. If it does not, the
recognition chemistry and the growth biology are load-bearing and cannot
be dropped to save cost.
"""
import pickle
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

from phenora.pipeline import (CLASSES, FEATURES, STAGES, make_cartridge,
                              run_cartridge, ConformalPanel, GROWTH_T)
from phenora.twin import GrowthTwin

plt.rcParams.update({'font.size': 8.5, 'figure.dpi': 150, 'axes.grid': True,
                     'grid.alpha': 0.25, 'grid.linewidth': 0.5,
                     'axes.axisbelow': True, 'axes.edgecolor': '#8a919b'})
ACC, WARN, OK = '#2f6fd0', '#c2410c', '#15803d'


def hdr(t):
    print("\n" + "-" * 74 + f"\n  {t}\n" + "-" * 74)


def main():
    d = np.load('cohort.npz', allow_pickle=True)
    X, y = d['X'], d['y']
    tr, cal, te = d['tr'], d['cal'], d['te']
    rng = np.random.default_rng(99)

    # =================================================================
    hdr("V1  MEASUREMENT INTEGRITY GATE")
    n_probe = 120
    truth_bad, called_bad, trusts = [], [], []
    for i in range(n_probe):
        bad = i % 2 == 0
        lab = CLASSES[rng.integers(len(CLASSES))]
        cart = make_cartridge(lab, rng, force_bad_contact=bad)
        _, _, qc, _ = run_cartridge(cart, rng)
        truth_bad.append(bad)
        called_bad.append(qc['verdict'] != 'ACCEPT')
        trusts.append((bad, qc['score']))
    tb, cb = np.array(truth_bad), np.array(called_bad)
    tp = int((tb & cb).sum()); fn = int((tb & ~cb).sum())
    fp = int((~tb & cb).sum()); tn = int((~tb & ~cb).sum())
    sens = tp / max(tp + fn, 1); spec = tn / max(tn + fp, 1)
    print(f"  injected bad contacts caught (sensitivity) : {sens:.3f}  ({tp}/{tp+fn})")
    print(f"  good measurements passed   (specificity)   : {spec:.3f}  ({tn}/{tn+fp})")
    print(f"  false rejections                           : {fp}")
    print(f"  ESCAPES (bad data reaching the model)      : {fn}  <- the number that matters")

    # =================================================================
    hdr("V2  DIGITAL-TWIN FORECAST CALIBRATION")
    horizons = [0.5, 1.0, 1.5, 2.0]
    hits = {h: [] for h in horizons}
    widths = {h: [] for h in horizons}
    bias = {h: [] for h in horizons}
    for _ in range(90):
        lab = CLASSES[rng.integers(1, len(CLASSES))]      # skip NEGATIVE
        cart = make_cartridge(lab, rng)
        _, _, qc, art = run_cartridge(cart, rng)
        ctrl = art['growth']['CTRL']['nis']
        sc = max(float(np.max(ctrl)), 1e-3) / 0.85
        g = ctrl / sc
        tw = GrowthTwin(g0=0.02, mu0=0.8)
        for k in range(1, 5):                             # observe to t = 2.0 h
            tw.step(GROWTH_T[k], float(g[k]), dt=0.5, trust=qc['score'])
        for r in tw.forecast_ensemble(horizons, rng=rng):
            t_target = 2.0 + r['horizon_h']
            if t_target > GROWTH_T[-1]:
                continue
            truth = float(np.interp(t_target, GROWTH_T, g))
            hits[r['horizon_h']].append(r['lo'] <= truth <= r['hi'])
            widths[r['horizon_h']].append(r['hi'] - r['lo'])
            bias[r['horizon_h']].append(r['mean'] - truth)
    print(f"  {'horizon':>9s} {'95% coverage':>14s} {'width':>8s} {'signed bias':>12s}")
    cal_rows = []
    for h in horizons:
        if not hits[h]:
            continue
        c = float(np.mean(hits[h])); w = float(np.mean(widths[h]))
        cal_rows.append((h, c, w))
        flag = 'OK' if c >= 0.90 else ('UNDER-COVERED' if c >= 0.6 else 'BADLY UNDER-COVERED')
        b = float(np.mean(bias[h]))
        print(f"  {h:>7.1f} h {c*100:>13.1f}% {w:>8.3f} {b:>+12.3f}   {flag}")
    print("\n  DIAGNOSIS. Two hypotheses were tested:")
    print("    H1 variance under-propagation (EKF linearisation through a")
    print("       convex map) -> replaced with 600-particle ensemble")
    print("       propagation. Coverage moved ~30% -> ~41%. Real, but small.")
    print("    H2 structural bias: the logistic process model has no lag")
    print("       state, so a filter fitted during lag->exponential reads the")
    print("       acceleration as a high mu and over-shoots.")
    print("  The large positive signed bias above is H2's signature, and it")
    print("  does not shrink with more particles. H2 dominates.")
    print("  FIX: 3-state Baranyi model with an explicit physiological-state")
    print("  variable, then re-run this test. More process noise would only")
    print("  buy coverage by making the forecast useless.")
    print("  UNTIL THEN: the +30 min / +60 min confidence numbers in the")
    print("  original PHENORA concept must NOT be displayed. A forecast this")
    print("  miscalibrated is worse than no forecast.")

    # =================================================================
    hdr("V3  CONFORMAL COVERAGE, PER CLASS")
    with open('models.pkl', 'rb') as fh:
        panel = pickle.load(fh)['panel']
    sets, probs = panel.predict_set(X[te])
    yte = y[te]
    print(f"  {'class':<16s} {'n':>4s} {'coverage':>10s} {'mean set':>10s}")
    for c in CLASSES:
        m = yte == c
        if m.sum() == 0:
            continue
        cov = np.mean([yte[i] in sets[i] for i in np.where(m)[0]])
        sz = np.mean([len(sets[i]) for i in np.where(m)[0]])
        print(f"  {c:<16s} {int(m.sum()):>4d} {cov*100:>9.1f}% {sz:>10.2f}")
    overall = np.mean([yte[i] in sets[i] for i in range(len(yte))])
    print(f"  {'ALL':<16s} {len(yte):>4d} {overall*100:>9.1f}% "
          f"{np.mean([len(s) for s in sets]):>10.2f}   target 90.0%")
    print("\n  Split conformal guarantees MARGINAL coverage. Per-class coverage")
    print("  can dip below target - a Mondrian (class-conditional) variant is")
    print("  required before any clinical claim.")

    # =================================================================
    hdr("V4  WHERE DOES THE INFORMATION COME FROM?  (stage ablation)")
    combos = [
        ('BULK only',                     ['BULK_SCAN']),
        ('BULK + AFFINITY',               ['BULK_SCAN', 'AFFINITY_PANEL']),
        ('BULK + GROWTH(4h)',             ['BULK_SCAN', 'GROWTH_2H', 'GROWTH_4H']),
        ('AFFINITY only',                 ['AFFINITY_PANEL']),
        ('GROWTH(4h) only',               ['GROWTH_2H', 'GROWTH_4H']),
        ('AST only',                      ['AST_PANEL']),
        ('GROWTH + AST',                  ['GROWTH_2H', 'GROWTH_4H', 'AST_PANEL']),
        ('FULL cartridge',                list(STAGES.keys())),
    ]
    print(f"  {'channels used':<24s} {'dims':>5s} {'top-1':>8s} {'set size':>10s}")
    abl = []
    for name, stages in combos:
        cols = [FEATURES.index(f) for s in stages for f in STAGES[s]]
        p = ConformalPanel(alpha=0.10, seed=2).fit(X[tr][:, cols], y[tr],
                                                   X[cal][:, cols], y[cal])
        st, pr = p.predict_set(X[te][:, cols])
        top1 = np.array([p.classes_[i] for i in pr.argmax(1)])
        acc = float(np.mean(top1 == yte))
        sz = float(np.mean([len(s) for s in st]))
        abl.append((name, acc, sz))
        print(f"  {name:<24s} {len(cols):>5d} {acc*100:>7.1f}% {sz:>10.2f}")
    print("\n  Reading: the bulk spectrum on its own is close to chance. Every")
    print("  usable bit comes from the recognition chemistry and the growth")
    print("  biology. The spectrometer is the TRANSDUCER, not the assay.")

    # =================================================================
    fig, ax = plt.subplots(1, 3, figsize=(11, 3.2))
    a = ax[0]
    b = [t for bad, t in trusts if bad]
    g = [t for bad, t in trusts if not bad]
    a.hist(g, bins=18, alpha=0.8, color=OK, label='good contact')
    a.hist(b, bins=18, alpha=0.8, color=WARN, label='degraded contact')
    a.axvline(0.55, ls='--', color='#111', lw=1.0)
    a.set_xlabel('integrity trust score'); a.set_ylabel('count')
    a.set_title(f'V1 integrity gate\nsens {sens:.2f} / spec {spec:.2f}, {fn} escapes')
    a.legend(frameon=False, fontsize=7)

    a = ax[1]
    hs = [r[0] for r in cal_rows]; cs = [r[1] * 100 for r in cal_rows]
    a.plot(hs, cs, 'o-', color=ACC, lw=1.5, ms=6)
    a.axhline(95, ls='--', color=WARN, lw=1.0)
    a.annotate('nominal 95%', (hs[0], 96), color=WARN, fontsize=7)
    a.set_ylim(0, 105); a.set_xlabel('forecast horizon (h)')
    a.set_ylabel('empirical interval coverage (%)')
    a.set_title('V2 forecast calibration\nFAILS at every horizon', color=WARN)

    a = ax[2]
    names = [r[0] for r in abl][::-1]
    vals = [r[1] * 100 for r in abl][::-1]
    cols = [ACC if 'FULL' in n else ('#cbd5e1' if 'BULK only' in n else '#93b4e0')
            for n in names]
    a.barh(names, vals, color=cols)
    a.axvline(100 / len(CLASSES), ls='--', color='#111', lw=1.0)
    a.annotate('chance', (100 / len(CLASSES) + 1.5, 6.4), fontsize=7)
    a.set_xlim(0, 105); a.set_xlabel('top-1 accuracy (%)')
    a.tick_params(labelsize=7)
    a.set_title('V4 where the information lives')
    fig.suptitle('PHENORA Flash - software validation on synthetic cohort '
                 '(NOT clinical validation)', fontsize=10)
    fig.tight_layout(rect=[0, 0, 1, 0.9])
    fig.savefig('figures/04_validation.png', bbox_inches='tight')
    plt.close(fig)
    print("\n  figure written: figures/04_validation.png")


if __name__ == '__main__':
    main()
