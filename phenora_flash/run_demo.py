"""
PHENORA Flash - end-to-end demonstration on one unknown sample.

Shows the full loop the product claims to perform:

    acquire (parallel multisine)
      -> validate (Kramers-Kronig integrity gate)
      -> extract (Cole / Randles / DRT / growth kinetics)
      -> estimate + forecast (EKF twin, with uncertainty)
      -> decide (conformal prediction set, or abstain)
      -> plan (expected information gain per minute)
      -> acquire again

The operator sees, at every step, WHY the instrument did what it did.
"""
import pickle
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

from phenora.pipeline import (CLASSES, FEATURES, STAGES, STAGE_ORDER,
                              STAGE_COST_MIN, make_cartridge, run_cartridge,
                              GROWTH_T, ABX)
from phenora.analyze import linear_kk
from phenora.twin import GrowthTwin
from phenora.acquire import acquire_band

INK = '#12161c'
ACC = '#2f6fd0'
WARN = '#c2410c'
OK = '#15803d'
plt.rcParams.update({'font.size': 8.5, 'axes.edgecolor': '#8a919b',
                     'axes.labelcolor': INK, 'text.color': INK,
                     'xtick.color': '#4b5563', 'ytick.color': '#4b5563',
                     'axes.titlesize': 9, 'figure.dpi': 150,
                     'axes.grid': True, 'grid.alpha': 0.25,
                     'grid.linewidth': 0.5, 'axes.axisbelow': True})


def banner(t):
    print("\n" + "=" * 74)
    print(f"  {t}")
    print("=" * 74)


def main():
    with open('models.pkl', 'rb') as fh:
        M = pickle.load(fh)
    panel, planner = M['panel'], M['planner']

    rng = np.random.default_rng(4242)
    truth = 'E_COLI_R'          # withheld from every algorithm below
    cart = make_cartridge(truth, rng)

    banner("PHENORA FLASH - UNKNOWN SPECIMEN, AUTONOMOUS RUN")
    print(f"  matrix            : urine, 200 uL")
    print(f"  cartridge         : 1 bulk + 3 affinity + 4 growth channels")
    print(f"  operator sees     : nothing about the answer")

    # ---------------------------------------------------------------
    # Gate 0 - can a bare bulk scan even see this?
    # ---------------------------------------------------------------
    banner("GATE 0  DETECTABILITY BUDGET (run before anything else)")
    V = 1e-18
    for cfu in [1e5, 1e8]:
        phi = cfu * 1e6 * V
        print(f"  raw urine @ {cfu:.0e} CFU/mL -> volume fraction {phi:.1e}"
              f" -> |dZ/Z| ~ {1.5*phi:.1e}")
    print(f"  instrument repeatability (AFE + contact)  ~ 1e-3")
    print(f"  VERDICT: bulk EIS of the RAW sample cannot see the organism.")
    print(f"           Signal must be amplified biologically (growth wells)")
    print(f"           or chemically (affinity capture). Bulk channel is")
    print(f"           demoted to matrix QC / nuisance tracking.")

    # ---------------------------------------------------------------
    # Full acquisition (all stages measured up front; the planner
    # chooses the ORDER in which it is allowed to look at them)
    # ---------------------------------------------------------------
    x, feats, qc, art = run_cartridge(cart, rng, keep_traces=True)

    banner("LAYER 1  PARALLEL ACQUISITION")
    m = art['bulk']['meta']
    print(f"  sub-band multisine bursts   : {len(m['crest_factors'])}")
    print(f"  crest factors               : {m['crest_factors']}")
    print(f"  tones recovered             : {m['n_tones']} (10 Hz - 1 MHz)")
    print(f"  wall-clock, parallel        : {m['t_acq_parallel_s']*1e3:.0f} ms")
    print(f"  wall-clock, stepped sine    : {m['t_acq_stepped_equiv_s']*1e3:.0f} ms")
    print(f"  throughput gain             : {m['parallel_speedup']:.2f}x")
    print(f"  simultaneity window         : {m['simultaneity_window_s']*1e3:.0f} ms")
    print(f"    -> the real win is not raw speed. Every tone is sampled")
    print(f"       within ONE window, so a drifting sample cannot smear")
    print(f"       the spectrum. That is what makes Z(f,t) meaningful.")
    print(f"  median tone SNR             : {m['median_snr_db']:.1f} dB")

    banner("LAYER 2  MEASUREMENT INTEGRITY (KK gate)")
    print(f"  Kramers-Kronig chi^2        : {qc['kk_chi2']:.2e}")
    print(f"  worst local residual        : {art['bulk']['kk']['max_abs_res']*100:.2f} %")
    print(f"  trust score                 : {qc['score']:.3f}")
    print(f"  flags                       : {qc['flags'] or 'none'}")
    print(f"  VERDICT                     : {qc['verdict']}")
    if qc['verdict'] == 'REJECT':
        print("  -> pipeline halted. No classification is attempted.")
        return

    # ---------------------------------------------------------------
    # Digital twin on the growth control well
    # ---------------------------------------------------------------
    banner("LAYER 3/4  DIGITAL TWIN - STATE ESTIMATE AND FORECAST")
    ctrl = art['growth']['CTRL']['nis']
    scale = 0.62
    twin = GrowthTwin(g0=0.02, mu0=0.8)
    obs_end = 5                                    # observe only to t = 2.0 h
    for k in range(1, obs_end):
        twin.step(GROWTH_T[k], float(ctrl[k] / scale), dt=0.5, trust=qc['score'])
    st = twin.state
    print(f"  observed to t = {GROWTH_T[obs_end-1]:.1f} h")
    print(f"  state g   = {st['g']:.3f} +/- {st['sd_g']:.3f}   (0 = blank, 1 = plateau)")
    print(f"  state mu  = {st['mu']:.3f} +/- {st['sd_mu']:.3f}  1/h")
    print(f"\n  {'horizon':>9s} {'predicted g':>12s} {'95% interval':>18s} {'conf':>7s}")
    fc = twin.forecast_ensemble([0.5, 1.0, 2.0], rng=rng)
    for r in fc:
        print(f"  {r['horizon_h']:>7.1f} h {r['mean']:>12.3f} "
              f"{'[%.3f, %.3f]' % (r['lo'], r['hi']):>18s} {r['confidence']*100:>6.0f}%")
    tt = twin.time_to_threshold(0.5)
    if tt['reached']:
        print(f"\n  time to detection threshold : {tt['t_expected_h']:.2f} h "
              f"(earliest {tt['t_earliest_h']:.2f} h)")
    print(f"  actual measured at t=4.0 h  : g = {ctrl[-1]/scale:.3f}"
          f"   [forecast was blind to this]")
    print(f"\n  *** CALIBRATION WARNING (see validate.py, V2) ***")
    print(f"  These intervals achieve ~41% empirical coverage against a")
    print(f"  nominal 95%. The forecaster is BIASED HIGH by ~0.1 in g.")
    print(f"  It is shown here because it is part of the architecture, and")
    print(f"  it is BLOCKED from the reported result until the lag-aware")
    print(f"  process model lands. Nothing downstream consumes it.")

    # ---------------------------------------------------------------
    # Autonomous staged reveal driven by expected information gain
    # ---------------------------------------------------------------
    banner("LAYER 5/6  AUTONOMOUS MEASUREMENT PLANNING")
    posterior = np.ones(len(CLASSES)) / len(CLASSES)
    remaining = list(STAGE_ORDER)
    done, elapsed, trace = [], 0.0, []
    print(f"  start: uniform prior over {len(CLASSES)} classes, "
          f"H = {np.log2(len(CLASSES)):.2f} bits\n")
    while remaining:
        rows = planner.plan(posterior, remaining, rng, done=done)
        best = rows[0]
        print(f"  candidate actions:")
        for r in rows:
            mark = '<<' if r['action'] == best['action'] else '  '
            print(f"    {mark} {r['action']:<16s} EIG {r['eig_bits']:5.2f} bits"
                  f"  cost {r['cost_min']:6.1f} min"
                  f"  -> {r['bits_per_min']*1000:7.2f} mbits/min")
        cols = [FEATURES.index(n) for n in STAGES[best['action']]]
        ll = planner._loglik(best['action'], x[cols])
        ll -= ll.max()
        posterior = posterior * np.exp(ll)
        posterior /= posterior.sum()
        elapsed += best['cost_min']
        done.append(best['action'])
        remaining.remove(best['action'])
        H = -np.sum(posterior * np.log2(posterior + 1e-12))
        top = CLASSES[int(np.argmax(posterior))]
        trace.append((best['action'], H, posterior.copy(), elapsed))
        print(f"     executed {best['action']}  ->  H = {H:5.2f} bits,"
              f"  leader {top} ({posterior.max()*100:.1f}%),"
              f"  t+{elapsed:.0f} min")
        if H < 0.25:
            print(f"     STOP: posterior entropy below threshold, "
                  f"{len(remaining)} action(s) skipped")
            break
        print()

    # ---------------------------------------------------------------
    # Final calibrated report
    # ---------------------------------------------------------------
    rep = panel.report(x, qc)
    banner("OUTPUT  CALIBRATED RESULT")
    print(f"  DECISION                    : {rep['decision']}")
    print(f"  conformal prediction set    : {[str(v) for v in rep['pred_set']]}")
    print(f"  coverage guarantee          : {rep['coverage_target']*100:.0f}% "
          f"(marginal, under exchangeability)")
    print(f"  normalised entropy          : {rep['entropy']:.3f}")
    print(f"  measurement trust           : {qc['score']:.3f} [{qc['verdict']}]\n")
    print(f"  {'organism':<16s} {'posterior':>10s}  {'in set':>7s}")
    for name, p in rep['ranking']:
        print(f"  {name:<16s} {p*100:>9.1f}%  {'YES' if name in rep['pred_set'] else '-':>7s}")

    print(f"\n  SUSCEPTIBILITY (reported only if control well grew)")
    if feats['ast_valid'] > 0.5:
        for a in ABX:
            r = feats[f'ast_{a}']
            call = 'SUSCEPTIBLE' if r < 0.35 else ('INTERMEDIATE' if r < 0.6 else 'RESISTANT')
            bar = '#' * int(round(r * 24))
            print(f"    {a:<16s} growth ratio {r:5.2f}  {bar:<26s} {call}")
    else:
        print("    NOT APPLICABLE - control well showed no significant growth")

    print(f"\n  --- provenance -------------------------------------------")
    print(f"  ground truth (simulation only)   : {truth}")
    print(f"  correct                          : "
          f"{truth in rep['pred_set']}  (in set), "
          f"{rep['ranking'][0][0] == truth} (top-1)")
    print(f"  data source                      : SYNTHETIC, generated by")
    print(f"                                     phenora/physics.py")
    print(f"  clinical validity                : NOT ESTABLISHED")

    make_figures(art, twin, ctrl, scale, trace, rep, qc)
    print("\n  figures written to figures/")


# ----------------------------------------------------------------------
def make_figures(art, twin, ctrl, scale, trace, rep, qc):
    # --- Fig 1: acquisition + spectra + KK ---------------------------
    f = art['bulk']['f']; Z = art['bulk']['Z']
    kk = art['bulk']['kk']
    rec = art['bulk']['recs'][1]

    fig, ax = plt.subplots(2, 3, figsize=(11, 5.6))
    a = ax[0, 0]
    n = min(len(rec['t']), 900)
    a.plot(rec['t'][:n] * 1e3, rec['i'][:n] * 1e6, lw=0.7, color=ACC)
    a.set_title(f"multisine burst, band {rec['band'][0]:.0f}-{rec['band'][1]:.0f} Hz\n"
                f"9 tones at once, CF = {rec['crest']:.2f}")
    a.set_xlabel('time (ms)'); a.set_ylabel('excitation current (uA)')

    a = ax[0, 1]
    sp = np.abs(np.fft.rfft(rec['i'])) / len(rec['i']) * 2
    fr = np.fft.rfftfreq(len(rec['i']), 1 / rec['fs'])
    a.semilogx(fr[1:], 20 * np.log10(sp[1:] / sp.max() + 1e-12), lw=0.6, color=ACC)
    a.set_ylim(-90, 5); a.set_xlim(1, rec['fs'] / 2)
    a.set_title('FFT of the burst\ncomb of coherent tones, no leakage')
    a.set_xlabel('frequency (Hz)'); a.set_ylabel('dB rel. peak')

    a = ax[0, 2]
    a.plot(np.real(Z), -np.imag(Z), 'o-', ms=3, lw=0.8, color=ACC, label='recovered')
    a.plot(np.real(art['bulk']['Z_true']), -np.imag(art['bulk']['Z_true']),
           '-', lw=1.0, color='#9ca3af', alpha=0.9, label='forward model')
    a.set_title('Nyquist - bulk channel'); a.legend(frameon=False, fontsize=7)
    a.set_xlabel("Z' (ohm)"); a.set_ylabel("-Z'' (ohm)")

    a = ax[1, 0]
    a.loglog(f, np.abs(Z), 'o-', ms=3, lw=0.8, color=ACC)
    a.set_xlabel('frequency (Hz)'); a.set_ylabel('|Z| (ohm)'); a.set_title('Bode magnitude')
    a2 = ax[1, 1]
    a2.semilogx(f, np.angle(Z, deg=True), 'o-', ms=3, lw=0.8, color=WARN)
    a2.set_xlabel('frequency (Hz)'); a2.set_ylabel('phase (deg)'); a2.set_title('Bode phase')

    a = ax[1, 2]
    a.semilogx(f, kk['res_re'] * 100, 'o-', ms=2.5, lw=0.7, color=ACC, label="Re")
    a.semilogx(f, kk['res_im'] * 100, 's-', ms=2.5, lw=0.7, color=WARN, label="Im")
    a.axhline(0, color='#9ca3af', lw=0.6)
    a.set_title(f"Kramers-Kronig residuals\nchi2 = {kk['chi2']:.1e} -> {qc['verdict']}")
    a.set_xlabel('frequency (Hz)'); a.set_ylabel('residual (%)')
    a.legend(frameon=False, fontsize=7)
    fig.suptitle('PHENORA Flash - Layer 1/2: parallel acquisition and integrity gate  '
                 '[synthetic data]', fontsize=10)
    fig.tight_layout(rect=[0, 0, 1, 0.95])
    fig.savefig('figures/01_acquisition_qc.png', bbox_inches='tight')
    plt.close(fig)

    # --- Fig 2: growth, twin forecast, DRT ---------------------------
    fig, ax = plt.subplots(1, 3, figsize=(11, 3.3))
    a = ax[0]
    for w, c in zip(['CTRL'] + ABX, [INK, ACC, OK, WARN]):
        a.plot(GROWTH_T, art['growth'][w]['nis'], 'o-', ms=3, lw=1.0,
               color=c, label=w.title()[:12])
    a.set_xlabel('incubation time (h)'); a.set_ylabel('normalised impedance signal')
    a.set_title('growth wells: control vs 3 antibiotics')
    a.legend(frameon=False, fontsize=7)

    a = ax[1]
    obs_t = [h[0] for h in twin.history]
    obs_g = [float(h[1][0]) for h in twin.history]
    a.plot(obs_t, obs_g, 'o', ms=4, color=ACC, label='EKF filtered (observed)')
    hz = np.arange(0.1, 2.01, 0.1)
    fc = twin.forecast_ensemble(list(hz), rng=np.random.default_rng(5))
    t_f = np.array([twin.history[-1][0] + r['horizon_h'] for r in fc])
    mu_f = np.array([r['mean'] for r in fc])
    lo = np.array([r['lo'] for r in fc]); hi = np.array([r['hi'] for r in fc])
    a.plot(t_f, mu_f, '-', lw=1.4, color=WARN, label='forecast')
    a.fill_between(t_f, lo, hi, color=WARN, alpha=0.18, label='95% band')
    a.plot(GROWTH_T, ctrl / scale, 'x', ms=5, color='#6b7280',
           label='truth (withheld)')
    a.axvline(twin.history[-1][0], color='#9ca3af', ls='--', lw=0.8)
    a.set_ylim(-0.1, 1.35)
    a.set_xlabel('time (h)'); a.set_ylabel('twin state g')
    a.set_title('digital twin forecast\n[MISCALIBRATED - see V2]', color=WARN)
    a.legend(frameon=False, fontsize=6.5, loc='upper left')

    a = ax[2]
    drt = art['drt']
    a.semilogx(drt['tau'], drt['gamma'], lw=1.3, color=ACC)
    for tau, g in drt['peaks']:
        a.axvline(tau, color=WARN, ls=':', lw=0.9)
        a.annotate(f'{tau:.1e}s', (tau, g), fontsize=6.5,
                   xytext=(3, 3), textcoords='offset points')
    a.set_xlabel('relaxation time tau (s)'); a.set_ylabel('gamma (ohm)')
    a.set_title('DRT - resolves interface from bulk\nwithout assuming a circuit')
    fig.suptitle('PHENORA Flash - Layer 3/4: kinetics, twin forecast, non-parametric structure  '
                 '[synthetic data]', fontsize=10)
    fig.tight_layout(rect=[0, 0, 1, 0.92])
    fig.savefig('figures/02_twin_forecast.png', bbox_inches='tight')
    plt.close(fig)

    # --- Fig 3: planner + posterior + result -------------------------
    fig, ax = plt.subplots(1, 3, figsize=(11, 3.3))
    a = ax[0]
    steps = ['prior'] + [t[0] for t in trace]
    H = [np.log2(len(CLASSES))] + [t[1] for t in trace]
    a.plot(range(len(H)), H, 'o-', color=ACC, lw=1.4, ms=5)
    a.axhline(0.25, color=WARN, ls='--', lw=0.9)
    a.annotate('stop threshold', (0.1, 0.32), color=WARN, fontsize=6.5)
    a.set_xticks(range(len(H)))
    a.set_xticklabels([s.replace('_', '\n') for s in steps], fontsize=6, rotation=0)
    a.set_ylabel('posterior entropy (bits)')
    a.set_title('information gained per autonomous action')

    a = ax[1]
    P = np.array([t[2] for t in trace])
    im = a.imshow(P.T, aspect='auto', cmap='Blues', vmin=0, vmax=1)
    a.set_yticks(range(len(CLASSES)))
    a.set_yticklabels(CLASSES, fontsize=6.5)
    a.set_xticks(range(len(trace)))
    a.set_xticklabels([t[0].replace('_', '\n') for t in trace], fontsize=6)
    a.set_title('posterior evolution')
    a.grid(False)
    fig.colorbar(im, ax=a, fraction=0.04, pad=0.02)

    a = ax[2]
    names = [r[0] for r in rep['ranking']][::-1]
    vals = [r[1] for r in rep['ranking']][::-1]
    cols = [OK if n in rep['pred_set'] else '#cbd5e1' for n in names]
    a.barh(names, vals, color=cols)
    a.set_xlim(0, 1); a.set_xlabel('posterior probability')
    a.tick_params(labelsize=6.5)
    a.set_title(f"conformal set (90% coverage)\ndecision: {rep['decision']}")
    fig.suptitle('PHENORA Flash - Layer 5/6: autonomous planning and calibrated output  '
                 '[synthetic data]', fontsize=10)
    fig.tight_layout(rect=[0, 0, 1, 0.92])
    fig.savefig('figures/03_planner_result.png', bbox_inches='tight')
    plt.close(fig)


if __name__ == '__main__':
    main()
