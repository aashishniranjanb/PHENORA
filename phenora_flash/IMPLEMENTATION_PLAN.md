# PHENORA Flash — Implementation Plan

**Target repo:** the existing PHENORA monorepo (`web/`, `simulation/`, `img2threejs/`)
**Adds:** `/flash` route, `PHENORA FLASH` navbar entry, `services/flash/` backend, `simulation/flash/` engine
**Constraint:** reuse the existing design system. This plan specifies **zero new colours, fonts or spacing values.**

---

## 0. Read this first — what your repo already tells me

I read `project_documentation__1_.md`. Three things changed my plan:

**1. You have already built most of the right architecture.** `ChamberDualWell`, `ast_trajectory.py`,
`AmrieInterpretationPanel`, `AdaptiveDecisionPanel`, `adaptive_reference.py` (`PhenoraAdaptiveFSM`).
You are already a **growth-based AST device with a dual well and an adaptive decision loop**. That is
exactly the architecture the ablation study says is the only one that works (GROWTH+AST = 94.8%,
bulk alone = 18.8% vs 16.7% chance). **Flash is not a pivot. It is the multi-frequency + calibrated-output
upgrade on top of what you have.** Say that in the copy — it is a much stronger story than a new product.

**2. Your AFE caps the frequency plan, and my spec was wrong for your hardware.**
`Ad5933Board.tsx` says AD5933. The AD5933 <cite index="55-1">covers 1 kHz to 100 kHz with a 12-bit, 1 MSPS ADC and 2 electrodes (4 only with additional circuitry)</cite>. Below 1 kHz you must divide MCLK — <cite index="56-1">Analog Devices' own guidance is to reduce MCLK, which increases calculation time and requires an external filter to attenuate harmonics; to reach 10 Hz you need MCLK ≈ 160 kHz</cite>. It has been pushed to <cite index="52-1">10 Hz–20 kHz using a clock-dividing circuit per AN-843</cite>.

So:
- **1 MHz is not reachable on AD5933.** My spec's 10 Hz–1 MHz plan does not run on your board.
- **Multisine is not reachable on AD5933 either.** It is a DDS single-tone generator with an on-chip DFT — stepped sweep only, by construction.
- Blood β-dispersion sits at <cite index="16-1">1–100 MHz</cite>. Out of reach. **Drop blood from V1** and say so.

**Resolution, and it is clean:** ship Flash V1 on a **stepped sweep, 100 Hz – 100 kHz**, which AD5933
does well and which covers the interface term and the metabolite-conductivity term the growth wells
actually use. Move multisine to the FPGA path (you already have `VsdFpgaBoard`) as a labelled roadmap
item. The web page shows both, with the FPGA path marked `PLANNED`, not `LIVE`. Your existing
`StatusBadge` component is presumably already built for exactly this.

**3. Your data layer is static TypeScript.** `web/src/data/{conductivitySweep,differentialTrajectory,meshConvergence,validationStatus}.ts`.
So the page should ship **static-first** in the same style, with the API as a later swap behind one flag.
That is why `export_web_payload.py` emits both `flashRun.json` and `flashRun.ts`.

### What I could not read from the documentation

The doc is a function index only — it contains no CSS, tokens or colour values. I am therefore
**not specifying any palette**. Every task below says "consume the existing token". Before Phase 1,
paste me these four files and I will write the components against your real tokens:
`web/src/app/globals.css`, `tailwind.config.*`, `web/src/components/ui/BorderGlow.tsx`,
`web/src/components/simulation/TechnicalDetails.tsx`.

---

## 1. The two-layer content rule (your "simple terms first" requirement)

You already have the components for this: `GeneralPublicMode.tsx` and `TechnicalDetails.tsx`.
**Do not build a new disclosure primitive. Extend those two.**

Every block on `/flash` follows the same shape, enforced by one wrapper component:

```
┌─────────────────────────────────────────────────────┐
│  PLAIN SENTENCE  (one line, no jargon, 14–18 words)  │  ← always visible
│  • bullet                                            │  ← always visible
│  • bullet                                            │     max 4, plain English
│  • bullet                                            │
│                                                      │
│  ▸ Technical detail                                  │  ← collapsed by default
└─────────────────────────────────────────────────────┘
```

**Hard rules for the plain layer.** These go in the lint config, not just in someone's head:

| Rule | Reason |
|---|---|
| No word longer than 12 characters unless it is an organism name | "electrochemical impedance spectroscopy" fails |
| Every organism name is followed by a plain gloss on first use | "Klebsiella — a bacterium that often shrugs off first-choice antibiotics" |
| No units in the plain layer | Ω, Hz, dB, χ² all live in the technical layer |
| No percentages except the headline confidence | numbers invite false precision |
| Verbs, not nouns | "we let it grow for two hours", not "a two-hour incubation phase" |

The plain strings are **already written** and live in `PLAIN`, `STAGE_PLAIN` and `DECISION_PLAIN`
in `export_web_payload.py`. They ship inside the payload, so the front end never invents copy.

**Worked example — the same fact, both layers:**

> **Plain:** The machine checked its own measurement and it passed.
> • Nothing was loose or noisy
> • The signal was clean enough to trust
> • If it had failed, we would not have given you a result at all
>
> ▸ **Technical** — Kramers–Kronig admissibility test, χ² = 1.35 × 10⁻⁴, worst local residual 2.17%,
> median tone SNR 109 dB, no ADC saturation. Trust score 0.755, verdict ACCEPT. KK holds for any
> linear, causal, stable, time-invariant system, so a failure indicates drift or contact loss rather
> than a biological finding. Gate sensitivity 0.883 / specificity 1.000 on the synthetic cohort.

---

## 2. Target file tree

```
PHENORA/
├── simulation/
│   └── flash/                          ← NEW. the engine you are downloading now
│       ├── phenora/
│       │   ├── physics.py              layer 0  forward models
│       │   ├── acquire.py              layer 1  multisine + Goertzel   [FPGA path]
│       │   ├── acquire_ad5933.py       layer 1  stepped sweep          [NEW, Phase 2]
│       │   ├── analyze.py              layer 2  KK gate, DRT, fits
│       │   ├── twin.py                 layer 3-4 EKF + ensemble forecast
│       │   ├── twin_baranyi.py         layer 3-4 lag-aware            [NEW, Phase 5]
│       │   └── pipeline.py             layer 5-7 cartridge, conformal, EIG planner
│       ├── build_cohort.py
│       ├── run_demo.py
│       ├── validate.py
│       ├── export_web_payload.py       → flashRun.json + flashRun.ts
│       └── PHENORA_FLASH_SPEC.md
│
├── services/
│   └── flash/                          ← NEW. Phase 3 only
│       ├── main.py                     FastAPI app
│       ├── schemas.py                  Pydantic mirrors of the JSON schema
│       ├── engine.py                   thin wrapper over simulation/flash
│       ├── store.py                    run persistence (SQLite → Postgres)
│       └── tests/
│
└── web/src/
    ├── app/flash/
    │   ├── page.tsx                    server component, loads payload
    │   └── loading.tsx
    ├── components/flash/
    │   ├── FlashHero.tsx
    │   ├── PlainTechBlock.tsx          ← the disclosure wrapper
    │   ├── SampleSelector.tsx
    │   ├── ResultCard.tsx
    │   ├── DifferentialBars.tsx
    │   ├── SusceptibilityPanel.tsx
    │   ├── QualityGate.tsx
    │   ├── PlannerTimeline.tsx
    │   ├── AcquisitionTrace.tsx
    │   ├── SpectrumViewer.tsx          Nyquist / Bode / KK / DRT tabs
    │   ├── GrowthChart.tsx
    │   ├── ForecastChart.tsx           renders with the miscalibration banner
    │   ├── AblationChart.tsx
    │   ├── EvidenceTable.tsx           the citation table
    │   └── FeasibilityMatrix.tsx
    ├── data/flashRun.ts                ← generated, committed
    ├── data/flashEvidence.ts           ← hand-written, the citation list
    └── types/flash.ts                  ← generated from schemas.py
```

---

## 3. Payload schema (frozen now, so front end and backend never diverge)

`export_web_payload.py` already emits this. The FastAPI service returns byte-identical shape.

```ts
type FlashRun = {
  meta: { schemaVersion: 'flash-1.0'; dataSource: 'SYNTHETIC' | 'HARDWARE';
          clinicalValidity: string; seed: number; groundTruth?: string }
  headline: { plain: string; organism: string; confidence: number
              decision: 'REPORT_SINGLE'|'REPORT_SET'|'ABSTAIN_QC'
                      |'ABSTAIN_OUT_OF_DISTRIBUTION'|'ABSTAIN_UNRESOLVED'
              decisionPlain: string; timeToAnswerMin: number
              comparatorHours: [number, number]
              predictionSet: string[]; coverageTarget: number }
  differential:   { organism; probability; inSet; plain }[]
  susceptibility: { drug; ratio; call: 'SUSCEPTIBLE'|'INTERMEDIATE'|'RESISTANT'; plain }[]
  quality:        { verdict; trust; kkChi2; medianSnrDb; flags: string[]; plain }
  acquisition:    { bands; crestFactors; nTones; parallelMs; steppedMs; speedup
                    simultaneityMs; medianSnrDb; trace: {tMs;iUa}[] }
  spectrum:       { nyquist: {re;im}[]; bode: {f;mag;phase}[]; kk: {f;resRe;resIm}[] }
  drt:            { tau; gamma }[]
  growth:         { times: number[]; wells: {well;label;nis:number[]}[] }
  forecast:       { calibrated: false; warning: string; observedToH
                    points: {h;mean;lo;hi}[]; truth: {h;g}[] }
  planner:        { priorEntropyBits; stopThresholdBits
                    steps: { action; plainTitle; plainText
                             candidates: {action;eigBits;costMin;bitsPerMin}[]
                             entropyBits; elapsedMin; posterior; leader; stopped }[] }
}
```

Two schema rules that are load-bearing:

- **`meta.dataSource` is never optional.** The UI must render a persistent `SYNTHETIC` badge whenever
  it is not `HARDWARE`. Wire it through `StatusBadge`.
- **`forecast.calibrated` is a boolean the UI must respect.** When `false`, `ForecastChart` renders
  greyed with the warning banner and the number is not repeated anywhere else on the page.
  This is not decoration — a 41%-coverage interval displayed as 95% is a false claim.

---

## 4. Phases

### Phase 0 — Foundations (½ day)

| # | Task | Done when |
|---|---|---|
| 0.1 | `git mv` the downloaded package into `simulation/flash/` | `pytest` green from repo root |
| 0.2 | Pin `numpy`, `scipy`, `scikit-learn`, `matplotlib` in `simulation/flash/requirements.txt` | fresh venv reproduces `cohort_report.json` |
| 0.3 | Run `build_cohort.py && validate.py`, commit outputs | `validation_output.txt` in repo |
| 0.4 | Paste me `globals.css`, `tailwind.config.*`, `BorderGlow.tsx`, `TechnicalDetails.tsx` | tokens documented in `web/src/components/flash/README.md` |
| 0.5 | Create `web/src/types/flash.ts` from the schema above | `tsc --noEmit` passes |

**Gate:** nothing in Phase 1+ starts until 0.4 is done. Everything after this depends on your tokens.

---

### Phase 1 — Navbar + route skeleton (½ day)

| # | Task | Detail |
|---|---|---|
| 1.1 | Add `PHENORA FLASH` to `Navbar.tsx` | Match the existing link array pattern. Order: Platform · Technology · **Flash** · Spectrae · Research · Team. Flash goes third because it is the flagship, not last. |
| 1.2 | Add the `NEW` pill | Reuse `StatusBadge`, not a new component. Remove after 60 days. |
| 1.3 | `app/flash/page.tsx` as a server component | Imports `flashRun` from `@/data/flashRun`. No `'use client'` at page level. |
| 1.4 | `app/flash/loading.tsx` | Reuse whatever skeleton `/spectrae` uses. |
| 1.5 | Metadata + OG image | `title: 'PHENORA Flash — Predictive Twin'` |
| 1.6 | Mobile nav | Verify the hamburger does not overflow at 6 items |

**Acceptance:** route renders, navbar highlights correctly, Lighthouse ≥ 90 on an empty page.

---

### Phase 2 — Backend engine, hardware-aligned (3–4 days)

This is the phase that fixes the AD5933 mismatch.

| # | Task | Detail |
|---|---|---|
| 2.1 | **`acquire_ad5933.py`** | Stepped sine, DDS model, on-chip 1024-point DFT, 12-bit ADC, gain-factor calibration against a known resistor. Same return signature as `acquire_spectrum` so `pipeline.py` is untouched. |
| 2.2 | Constrain the frequency plan | `100 Hz – 100 kHz`, ~20 points log-spaced. Document that <1 kHz needs divided MCLK plus an external anti-alias filter, per AN-1252. |
| 2.3 | Add `MODE` switch | `MULTISINE_FPGA` \| `STEPPED_AD5933`. Default `STEPPED_AD5933`. Payload carries the mode. |
| 2.4 | Re-run `build_cohort.py` in AD5933 mode | **Expect accuracy to drop.** Record the new ablation table. Do not reuse the 1 MHz numbers on the site. |
| 2.5 | Re-run `validate.py` in AD5933 mode | New V1–V4 numbers become the ones the page displays |
| 2.6 | Bridge to your existing sim | `pipeline.py` growth wells should call `simulation/python/ast_trajectory.compute_cell_fraction_trajectory` and `cell_model.compute_effective_conductivity` instead of my placeholder Gompertz, so Flash and the existing platform share one growth model |
| 2.7 | Bridge to `PhenoraAdaptiveFSM` | The EIG planner should emit actions the existing FSM can consume, or explicitly document why it supersedes it |

**Acceptance:** `validate.py` produces a full V1–V4 table under AD5933 constraints, committed as
`validation_output_ad5933.txt`. **This table, not the 1 MHz one, is what the website quotes.**

> ⚠ If 2.4 shows accuracy collapsing at 100 kHz ceiling, that is a real finding and the answer is a
> hardware task (AD5940 gives <cite index="55-1">0 Hz to 200 kHz with a 16-bit 800 kSPS ADC and native 4-electrode support</cite>), not a modelling fudge. Budget a week for the AFE decision.

---

### Phase 3 — Disease dataset + API service (3–4 days)

| # | Task | Detail |
|---|---|---|
| 3.1 | `services/flash/schemas.py` | Pydantic models mirroring §3. Generate `types/flash.ts` from them so they cannot drift. |
| 3.2 | `POST /api/flash/run` | Body `{organism?, seed?, contactQuality?, mode?}` → `FlashRun`. Organism omitted = random, which is the honest demo. |
| 3.3 | `GET /api/flash/panel` | The organism catalogue: plain gloss, gram status, typical resistance pattern, references |
| 3.4 | `GET /api/flash/validation` | V1–V4 numbers, served not hardcoded, so the site cannot quote stale figures |
| 3.5 | `GET /api/flash/evidence` | The citation list with DOIs |
| 3.6 | `store.py` | Persist runs by UUID; `GET /api/flash/run/{id}` for shareable permalinks |
| 3.7 | Rate limit + 8 s timeout | A cohort build must never be reachable from a public endpoint |
| 3.8 | Cache warm runs | One pre-baked run per organism so the demo is instant |

**Dataset design — the part you specifically asked about.**

The "disease dataset" is a **panel catalogue plus a generative model**, not a table of scraped values.
Six classes, each with: plain-language gloss, gram status, growth parameters (λ, μ_max, β), an
intrinsic/acquired resistance vector across three antibiotics, and inflammation-marker levels.
Everything lives in `PANEL` in `pipeline.py`.

**Be honest about where those parameters come from.** They are *plausible* and *literature-shaped*,
not measured. Two of them are mechanistically real and defensible in a demo:
- *P. mirabilis* has elevated β (urease → ammonium → conductivity jump) and intrinsic nitrofurantoin resistance
- *E. faecalis* is gram-positive, so the endotoxin channel reads near-blank, and it has intrinsic trimethoprim resistance

Everything else is an assumption and the code says so. **Task 3.9: add a `provenance` field to every
`PANEL` entry — `LITERATURE` | `MECHANISTIC` | `ASSUMED` — and surface it in the technical layer.**
That single field is what separates a research demo from a marketing mock-up.

---

### Phase 4 — The page itself (5–7 days)

Section order is deliberate. Answer first, method second, honesty third.

| # | Section | Component | Plain layer | Technical layer (collapsed) |
|---|---|---|---|---|
| 4.1 | Hero | `FlashHero` | "Find out which bacteria is causing an infection, and which antibiotic will stop it — in about three hours instead of two days." | architecture diagram, layer stack |
| 4.2 | Try it | `SampleSelector` | six sample buttons + a "surprise me" | seed, contact quality, mode toggle |
| 4.3 | **The answer** | `ResultCard` | organism gloss + "we have one clear answer" + time-to-answer vs 24–48 h | conformal set, q̂, coverage target, entropy |
| 4.4 | What else it could be | `DifferentialBars` | ranked bars, in-set highlighted | full posterior, per-class coverage caveat |
| 4.5 | Which drug works | `SusceptibilityPanel` | three drugs, works / borderline / will not work | growth ratios, breakpoint logic, `ast_valid` gate |
| 4.6 | Did we trust it | `QualityGate` | pass/fail + "if it fails you get no result" | KK χ², residual plot, SNR, trust score, gate sens/spec |
| 4.7 | How it decided | `PlannerTimeline` | four steps with plain titles, running clock | EIG bits, cost, bits/min, prerequisite graph, entropy curve |
| 4.8 | What it measured | `AcquisitionTrace` + `SpectrumViewer` | "we send a tiny electrical signal and listen to the echo" | burst trace, FFT comb, Nyquist, Bode, KK residuals, DRT |
| 4.9 | Watching it grow | `GrowthChart` | four wells, control vs three antibiotics | NIS derivation, Gompertz fit, λ / μ_max / t_detect |
| 4.10 | Looking ahead | `ForecastChart` | **greyed + banner** | ensemble method, H1 vs H2 diagnosis, coverage table |
| 4.11 | Where the answer comes from | `AblationChart` | "the electrical reading alone tells us almost nothing — the biology does the work" | full ablation table, chance line |
| 4.12 | Evidence | `EvidenceTable` | "every claim links to a published paper" | DOI table with claim mapping |
| 4.13 | What we do not claim | `FeasibilityMatrix` | green / amber / red honesty grid | full P0 / advanced / research checklist |

**Rendering.** Use whatever chart library `FemViewer` and `AdaptiveDecisionPanel` already use.
Do **not** add Recharts if you are on D3, or vice versa. Every chart reads its colours from your
existing tokens; the only semantic colours are pass/warn/fail, and those must map to the tokens
`StatusBadge` already uses.

**Motion.** `PlannerTimeline` is the one place that earns animation — steps reveal in sequence with
the clock ticking, ~400 ms apart, `prefers-reduced-motion` respected. Everything else is static.
`ShinyText` on the hero headline only. `BorderGlow` on `ResultCard` only. Restraint is the premium signal.

---

### Phase 5 — Fix what validation says is broken (1 week)

Do not ship a "predictive twin" page while the predictor fails its own calibration test.

| # | Task | Acceptance |
|---|---|---|
| 5.1 | `twin_baranyi.py` — three-state model with an explicit physiological-state variable | V2 coverage ≥ 90% at +1 h |
| 5.2 | Re-run V2, publish before/after | both tables on the page |
| 5.3 | Flip `forecast.calibrated` to `true`, remove the banner | only after 5.1 passes |
| 5.4 | Mondrian (class-conditional) conformal | V3 per-class coverage ≥ 85% for every class, including K. pneumoniae |
| 5.5 | Drive V1 escapes 7 → 0 | add a time-invariance check: split the record, compare halves, flag drift |
| 5.6 | Add a genuine OOD class | hold out one organism entirely from training; confirm `ABSTAIN_OUT_OF_DISTRIBUTION` fires |

**5.6 is the most important test on this list.** An abstention path that has never actually fired is
decoration. Make it fire on demand and put that in the demo — a diagnostic that knows when it does
not know is a far stronger sell than one that is always confident.

---

### Phase 6 — Polish and launch (3 days)

| # | Task |
|---|---|
| 6.1 | `SYNTHETIC DATA` badge persistent in the page header, not buried in a footnote |
| 6.2 | "Not for clinical use" in the footer of `/flash` specifically |
| 6.3 | Deep links: `/flash?organism=E_COLI_R&seed=4242` reproduce exactly |
| 6.4 | a11y — keyboard-navigable disclosures, `aria-expanded`, chart `<title>`/`<desc>`, AA contrast on the plain layer |
| 6.5 | Perf — payload is 45 KB; keep the acquisition trace decimated to ≤400 points, lazy-load `SpectrumViewer` |
| 6.6 | Print stylesheet — a one-page result summary is what a reviewer will actually want |
| 6.7 | Cross-link from `/platform` and `/technology`: "Flash is the next generation of this" |

---

## 5. Evidence table to build into `flashEvidence.ts`

Each site claim maps to a paper. Do not let a claim onto the page without a row here.

| Claim on the page | Source |
|---|---|
| Growth-based impedance AST works in ~3 h | <cite index="5-1">Microfluidic device with carbon screen-printed electrodes in diluted low-conductivity medium; normalised impedance signal from charge-transfer resistance correlates with concentration and susceptibility within 3 h incubation, for gram-positive and gram-negative organisms and multiple antibiotic modes of action</cite> |
| Growth impedance splits into medium and interface terms | <cite index="4-1">Total impedance during bacterial growth comprises medium/electrolyte and electrode/electrolyte interface components dominating in different frequency ranges, with the interface dominating below ~100 Hz</cite> |
| Rapid AST is a live clinical need with commercial traction | <cite index="8-1">The PA-100 AST System won the UK Longitude Prize for rapid UTI testing; a 45-minute test tracking growth profiles of E. coli, K. pneumoniae, P. mirabilis, E. faecalis and S. saprophyticus improves the optimal treatment recommendation versus routine clinical methods</cite> |
| Specificity comes from the recognition layer | <cite index="11-1">Impedance sensor with a synthetic cystatin-scaffold capture protein detected IL-8 in serum at ~90 fg/mL, below basal clinical levels, using phase shift at 0.1 Hz</cite> |
| Affinity EIS works in high-ionic-strength real matrices | <cite index="10-1">Affimer-based sensor achieved 1 pM detection of a protein biomarker in undiluted serum, which contains high concentrations of mobile ions</cite> |
| ML on impedance for cell discrimination is established | <cite index="31-1">236 impedance spectra at 10, 50, 100, 500 kHz and 1 MHz discriminated normal from cancerous urothelial cells; random forest reached 91.7% accuracy, 92.9% sensitivity</cite> |
| Impedance + ML for urine disease stratification | <cite index="30-1">Non-faradaic combinatorial urine biosensor transducing IL-6 and IL-8 at 1 pg/mL LOD, with a two-stage random forest producing four-state disease classification, using UTI as the proof-of-concept model</cite> |
| DRT separates interface from sample | <cite index="48-1">Applied to biological tissue, DRT identifies and removes the electrode-polarisation contribution in a two-electrode system and separates dispersions from counterion cloud, cell membrane, cell content and nucleus</cite> |
| DRT as a label-free fingerprint | <cite index="40-1">Time-constant-domain spectrum acts as an electrical fingerprint decoding composition and structure with high sensitivity, demonstrated on cell suspensions from 1 kHz to 1 MHz</cite> |
| Multisine is the right excitation for time-varying biology | <cite index="33-1">For biological objects whose electrical characteristics change quickly with time, frequency sweeps must be replaced by broadband excitation; the multisine burst optimises SNR at a limited set of spectral samples, limits energy to avoid biological stimulation, and minimises measurement time</cite> |
| Sub-band division improves SNR | <cite index="34-1">Dividing the spectrum into sub-bands excited sequentially concentrates available source energy into fewer tones, significantly improving SNR without substantially increasing total measurement time</cite> |
| Goertzel is the FPGA-efficient demodulator | <cite index="35-1">Goertzel-filter alternative to FFT/coherent demodulation is simpler, needs very few digital resources, is robust to harmonic fold-back, and demodulates 16 frequencies simultaneously with multisine excitation up to 1 MHz</cite> |
| AD5933 frequency ceiling | <cite index="55-1">AD5933/34 covers 1 kHz to 100 kHz, 12-bit 1 MSPS ADC, 2 electrodes (4 with additional circuitry); AD5940/41 covers 0 Hz to 200 kHz, 16-bit 800 kSPS, native 4-electrode</cite> |
| Sub-1 kHz needs MCLK division | <cite index="56-1">To measure below 1 kHz, reduce MCLK; this increases calculation time and requires an external filter to attenuate harmonics — for 10 Hz, MCLK ≈ 160 kHz</cite> |
| Blood dispersion is out of AFE range | <cite index="16-1">Only β-dispersion is observed in normal blood, from a Maxwell–Wagner relaxation of cell membranes in the 1–100 MHz region</cite> |
| Blood V1 target should be hematocrit | <cite index="17-1">Permittivity-change measurement from 10 Hz to 10 MHz tracks hematocrit with correlation 0.99 against centrifugation and stays stable despite plasma osmolarity and conductivity fluctuations</cite> |

---

## 6. Scalability — what breaks at 10, 100 and 1000 devices

| Scale | Breaks first | Mitigation, and which phase owns it |
|---|---|---|
| 1 device | nothing | — |
| 10 | gain-factor drift between AD5933 units; the chip needs calibration against a known impedance and that calibration is per-unit | Reference R/C module, per-device `calibrationId` in every spectrum. **Phase 2.** |
| 100 | functionalised electrode lot-to-lot variance. **This is the real manufacturing risk, not the electronics.** | Per-lot blank R_ct in the payload; normalise ΔR_ct against the lot blank, never a global constant. **Phase 3.** |
| 100 | thermal control — μ_max is strongly temperature-dependent, so an uncontrolled well makes the growth features meaningless | Closed-loop well heater; log temperature per timepoint; reject runs outside ±0.5 °C. **Phase 2.** |
| 1000 | model drift; the classifier was calibrated on one cohort | Conformal q̂ recomputed per deployment site on local calibration cartridges. This is a real advantage of conformal over softmax — recalibration needs only a labelled calibration split, not retraining. **Phase 5.** |
| 1000 | data governance the moment a real patient specimen is involved | De-identification, retention policy, ethics approval. **Not a Phase. A prerequisite before any clinical specimen touches the system.** |

---

## 7. Risk register

| Risk | Severity | Response |
|---|---|---|
| AD5933's 100 kHz ceiling degrades accuracy below usefulness | **High** | Phase 2.4 measures it. If it fails, move to AD5940 — a board respin, not a model change. |
| Someone quotes the synthetic 93.8% as a clinical accuracy | **High** | `dataSource` badge is non-dismissible; the number never appears without "synthetic cohort" adjacent |
| The forecast panel ships while miscalibrated | **High** | `forecast.calibrated` is a schema field, not a comment. Add a CI test that fails the build if `calibrated === false` and the banner component is absent. |
| Plain layer drifts into jargon over time | Medium | Lint rule from §1, run in CI on `flashRun.json` |
| Front end and backend schemas diverge | Medium | `types/flash.ts` generated from `schemas.py`; CI fails on diff |
| Functionalised electrode shelf life | Medium | Out of scope for the website; must be on the hardware roadmap |
| Overclaiming "digital twin" | Medium | Copy says "twin of the measurement", never "twin of the patient". Enforce in review. |

---

## 8. Timeline

```
Week 1   Phase 0 ──┐
         Phase 1 ──┘   route live, navbar shipped, tokens documented
Week 2   Phase 2       AD5933 acquisition path, revalidation
Week 3   Phase 3       API + panel catalogue + provenance flags
Week 4-5 Phase 4       the page
Week 6   Phase 5       Baranyi twin, Mondrian conformal, OOD test
Week 7   Phase 6       polish, a11y, launch
```

**Critical path:** Phase 2.4. If the AD5933 revalidation shows a collapse, everything downstream
quotes different numbers — so run 2.4 early, even before the API work, and take the result seriously.

---

## 9. Definition of done

- [ ] `/flash` reachable from the navbar on desktop and mobile
- [ ] Every section has a plain layer that passes the §1 lint rules
- [ ] Every technical claim has a row in `flashEvidence.ts` with a DOI
- [ ] `SYNTHETIC` badge visible without scrolling
- [ ] The forecast panel either passes V2 or carries its banner — no third option
- [ ] All four abstention paths are demonstrable from the UI, including OOD
- [ ] Numbers on the page come from `validation_output_ad5933.txt`, not from the 1 MHz spec
- [ ] `tsc --noEmit` clean, Lighthouse ≥ 90, AA contrast
- [ ] Deep links reproduce runs exactly
- [ ] `simulation/flash` tests green in CI

---

## 10. The one thing to get right in the copy

The temptation is to sell "AI predicts disease from a drop of urine." Do not.

The finding from the ablation is that the electrical measurement alone is worth **18.8% against a
16.7% chance baseline** — statistically nothing. The value is in the growth biology and the
recognition chemistry, with the spectrometer as a fast, cheap, label-free readout, and a decision
layer that knows when to abstain.

**That is a better product story, because it is true and it is defensible under questioning.**
The headline is time-to-answer and calibrated honesty:

> *Three hours instead of two days — and it tells you when it is not sure.*
