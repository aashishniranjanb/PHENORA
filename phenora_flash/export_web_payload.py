"""
Export a deterministic PHENORA Flash payload for the Next.js front end.

Emits ONE JSON file shaped exactly like the props the /flash page needs, plus
a TypeScript module in the same style as web/src/data/*.ts so the page can be
built and deployed with zero backend. The FastAPI service (Phase 3) returns
the identical schema, so the page never changes when the API lands.

Usage:
    python3 export_web_payload.py --out web_payload
"""
import argparse, json, pickle
from pathlib import Path
import numpy as np

from phenora.pipeline import (CLASSES, FEATURES, STAGES, STAGE_ORDER,
                              STAGE_COST_MIN, ABX, GROWTH_T,
                              make_cartridge, run_cartridge)
from phenora.twin import GrowthTwin

# Plain-language layer. Every technical term in the payload gets a human
# sentence. The UI shows THIS first and the technical block only on expand.
PLAIN = {
    "NEGATIVE":      "No infection found. Nothing grew in the sample.",
    "E_COLI_S":      "E. coli — the most common cause of urine infections. This one responds to standard antibiotics.",
    "E_COLI_R":      "E. coli that resists standard antibiotics. Treatment needs to be chosen carefully.",
    "K_PNEUMONIAE":  "Klebsiella — a bacterium that often shrugs off first-choice antibiotics.",
    "E_FAECALIS":    "Enterococcus — a different family of bacteria that needs different drugs.",
    "P_MIRABILIS":   "Proteus — a bacterium that makes urine more alkaline and is linked to stones.",
}
STAGE_PLAIN = {
    "BULK_SCAN":      ("Quick check of the sample itself",
                       "Measures how salty and concentrated the sample is. Takes seconds. Tells us the sample is real and usable, not what is wrong with it."),
    "AFFINITY_PANEL": ("Look for inflammation markers",
                       "Coated sensors grab specific molecules the body makes when it is fighting an infection. First real clue."),
    "GROWTH_2H":      ("Let anything present start growing",
                       "The sample sits in a warm nutrient well for two hours. If bacteria are there, they multiply and change the electrical signal."),
    "AST_PANEL":      ("Test which antibiotics work",
                       "The same sample is split across wells containing different antibiotics. Wells where growth stops tell us which drug will work."),
    "GROWTH_4H":      ("Keep watching for slow growers",
                       "Extra time for organisms that start slowly. Skipped when the answer is already clear."),
}
DECISION_PLAIN = {
    "REPORT_SINGLE": "We have one clear answer.",
    "REPORT_SET":    "We narrowed it to a short list, not a single answer.",
    "ABSTAIN_QC":    "The measurement was not clean enough to trust. Please rerun.",
    "ABSTAIN_OUT_OF_DISTRIBUTION": "This does not match anything we were trained on. Send for standard lab culture.",
    "ABSTAIN_UNRESOLVED": "Too many possibilities remain. More testing needed.",
}


def build(seed=4242, truth="E_COLI_R"):
    with open("models.pkl", "rb") as fh:
        M = pickle.load(fh)
    panel, planner = M["panel"], M["planner"]
    rng = np.random.default_rng(seed)
    cart = make_cartridge(truth, rng)
    x, feats, qc, art = run_cartridge(cart, rng, keep_traces=True)

    band = art["bulk"]["recs"][1]
    dec = int(max(1, len(band["t"]) // 400))
    f = art["bulk"]["f"]; Z = art["bulk"]["Z"]; kk = art["bulk"]["kk"]

    # --- twin ---
    ctrl = art["growth"]["CTRL"]["nis"]; scale = 0.62
    twin = GrowthTwin()
    for k in range(1, 5):
        twin.step(GROWTH_T[k], float(ctrl[k] / scale), dt=0.5, trust=qc["score"])
    fc = twin.forecast_ensemble(list(np.arange(0.1, 2.01, 0.1)), rng=rng)

    # --- planner trace ---
    post = np.ones(len(CLASSES)) / len(CLASSES)
    remaining, done, elapsed, steps = list(STAGE_ORDER), [], 0.0, []
    while remaining:
        rows = planner.plan(post, remaining, rng, done=done)
        if not rows:
            break
        best = rows[0]
        cols = [FEATURES.index(n) for n in STAGES[best["action"]]]
        ll = planner._loglik(best["action"], x[cols]); ll -= ll.max()
        post = post * np.exp(ll); post /= post.sum()
        elapsed += best["cost_min"]; done.append(best["action"]); remaining.remove(best["action"])
        H = float(-np.sum(post * np.log2(post + 1e-12)))
        title, blurb = STAGE_PLAIN[best["action"]]
        steps.append(dict(
            action=best["action"], plainTitle=title, plainText=blurb,
            candidates=[dict(action=r["action"], eigBits=round(r["eig_bits"], 3),
                             costMin=r["cost_min"],
                             bitsPerMin=round(r["bits_per_min"], 5)) for r in rows],
            entropyBits=round(H, 3), elapsedMin=elapsed,
            posterior={c: round(float(p), 5) for c, p in zip(CLASSES, post)},
            leader=CLASSES[int(np.argmax(post))],
            stopped=bool(H < 0.25)))
        if H < 0.25:
            break

    rep = panel.report(x, qc)
    top, topp = rep["ranking"][0]

    ast = []
    if feats["ast_valid"] > 0.5:
        for a in ABX:
            r = feats[f"ast_{a}"]
            call = "SUSCEPTIBLE" if r < 0.35 else ("INTERMEDIATE" if r < 0.6 else "RESISTANT")
            ast.append(dict(drug=a.title(), ratio=round(r, 3), call=call,
                            plain={"SUSCEPTIBLE": "This antibiotic works.",
                                   "INTERMEDIATE": "Borderline — may need a higher dose.",
                                   "RESISTANT": "This antibiotic will not work."}[call]))

    return dict(
        meta=dict(schemaVersion="flash-1.0", generatedBy="phenora_flash/export_web_payload.py",
                  dataSource="SYNTHETIC", clinicalValidity="NOT ESTABLISHED",
                  seed=seed, groundTruth=truth),
        headline=dict(
            plain=f"Most likely: {PLAIN[top]}",
            organism=top, confidence=round(float(topp), 4),
            decision=rep["decision"], decisionPlain=DECISION_PLAIN[rep["decision"]],
            timeToAnswerMin=elapsed, comparatorHours=[24, 48],
            predictionSet=[str(s) for s in rep["pred_set"]],
            coverageTarget=rep["coverage_target"]),
        differential=[dict(organism=c, probability=round(float(p), 5),
                           inSet=c in [str(s) for s in rep["pred_set"]], plain=PLAIN[c])
                      for c, p in rep["ranking"]],
        susceptibility=ast,
        quality=dict(verdict=qc["verdict"], trust=round(qc["score"], 4),
                     kkChi2=qc["kk_chi2"], medianSnrDb=round(qc["median_snr_db"], 2),
                     flags=qc["flags"],
                     plain=("The measurement passed every self-check." if qc["verdict"] == "ACCEPT"
                            else "The measurement did not pass its self-checks.")),
        acquisition=dict(
            bands=len(art["bulk"]["meta"]["crest_factors"]),
            crestFactors=art["bulk"]["meta"]["crest_factors"],
            nTones=art["bulk"]["meta"]["n_tones"],
            parallelMs=round(art["bulk"]["meta"]["t_acq_parallel_s"] * 1e3, 1),
            steppedMs=round(art["bulk"]["meta"]["t_acq_stepped_equiv_s"] * 1e3, 1),
            speedup=round(art["bulk"]["meta"]["parallel_speedup"], 3),
            simultaneityMs=round(art["bulk"]["meta"]["simultaneity_window_s"] * 1e3, 1),
            medianSnrDb=round(art["bulk"]["meta"]["median_snr_db"], 2),
            trace=[dict(tMs=round(float(t) * 1e3, 5), iUa=round(float(i) * 1e6, 4))
                   for t, i in zip(band["t"][::dec], band["i"][::dec])]),
        spectrum=dict(
            nyquist=[dict(re=round(float(a), 4), im=round(float(-b), 4))
                     for a, b in zip(np.real(Z), np.imag(Z))],
            bode=[dict(f=round(float(a), 4), mag=round(float(abs(b)), 4),
                       phase=round(float(np.angle(b, deg=True)), 4))
                  for a, b in zip(f, Z)],
            kk=[dict(f=round(float(a), 4), resRe=round(float(b) * 100, 4),
                     resIm=round(float(c) * 100, 4))
                for a, b, c in zip(f, kk["res_re"], kk["res_im"])]),
        drt=[dict(tau=float(t), gamma=float(g))
             for t, g in zip(art["drt"]["tau"], art["drt"]["gamma"])],
        growth=dict(
            times=[float(t) for t in GROWTH_T],
            wells=[dict(well=w, label=("No antibiotic (control)" if w == "CTRL" else w.title()),
                        nis=[round(float(v), 5) for v in art["growth"][w]["nis"]])
                   for w in ["CTRL"] + ABX]),
        forecast=dict(
            calibrated=False,
            warning="Forecast intervals achieve ~41% empirical coverage against a nominal 95%. "
                    "Blocked from the reported result until the lag-aware model lands.",
            observedToH=2.0,
            points=[dict(h=round(2.0 + r["horizon_h"], 3), mean=round(r["mean"], 5),
                         lo=round(r["lo"], 5), hi=round(r["hi"], 5)) for r in fc],
            truth=[dict(h=float(t), g=round(float(v / scale), 5))
                   for t, v in zip(GROWTH_T, ctrl)]),
        planner=dict(priorEntropyBits=round(float(np.log2(len(CLASSES))), 3),
                     stopThresholdBits=0.25, steps=steps),
    )


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="web_payload")
    ap.add_argument("--seed", type=int, default=4242)
    ap.add_argument("--truth", default="E_COLI_R")
    a = ap.parse_args()
    out = Path(a.out); out.mkdir(exist_ok=True)
    payload = build(a.seed, a.truth)
    (out / "flashRun.json").write_text(json.dumps(payload, indent=2))
    ts = ("// AUTO-GENERATED by phenora_flash/export_web_payload.py - do not edit.\n"
          "// Synthetic data. No clinical validity.\n"
          "import type { FlashRun } from '@/types/flash';\n\n"
          f"export const flashRun: FlashRun = {json.dumps(payload, indent=2)} as const;\n")
    (out / "flashRun.ts").write_text(ts)
    print(f"wrote {out/'flashRun.json'}  ({(out/'flashRun.json').stat().st_size/1024:.0f} KB)")
    print(f"wrote {out/'flashRun.ts'}")


if __name__ == "__main__":
    main()
