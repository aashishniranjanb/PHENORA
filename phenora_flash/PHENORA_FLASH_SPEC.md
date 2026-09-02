# PHENORA Flash — Confirmed Architecture and Feasibility Verdict

**Status:** architecture frozen · software validated on synthetic data · **no clinical validity**
**Date:** 2026-09-02
**Scope of this document:** answers "confirm everything, fix every layer" for the in-vitro
biofluid diagnostic direction (urine, blood). Every number in here is either from cited
literature or from the simulation in `phenora/`. Nothing is asserted from memory.

---

## 0. The one thing that has to change

The concept as written asks for:

```
urine / blood  →  multi-frequency EIS  →  ML  →  disease name + accuracy score
```

**That chain has a break in it, and it is not a software problem.** A bulk impedance
spectrum of a biofluid measures ionic conductivity, cell volume fraction, and membrane
polarisation. It does not measure *which pathogen* or *which disease*. Those are chemical
identities, and a bare electrode pair cannot resolve them.

The break is quantitative, not philosophical. From `run_demo.py`, Gate 0:

| Raw urine at | bacterial volume fraction φ | resulting \|ΔZ/Z\| |
|---|---|---|
| 10⁵ CFU/mL (the clinical bacteriuria threshold) | 1.0 × 10⁻⁷ | **1.5 × 10⁻⁷** |
| 10⁸ CFU/mL | 1.0 × 10⁻⁴ | 1.5 × 10⁻⁴ |

Realistic analogue-front-end plus contact repeatability is ~10⁻³. **At the clinical
decision threshold the organism's contribution to bulk impedance is roughly four orders
of magnitude below the noise floor.** No amount of ML recovers that. This is confirmed
empirically by the ablation study (§6, V4): a classifier given only bulk-spectrum features
scores 18.8% against a 16.7% chance baseline.

### The fix

Specificity has to be *manufactured* before the spectrometer sees it. There are exactly
three physically available amplifiers, and all three are established in the literature:

1. **Biological amplification — growth wells.** Incubate; let the organism multiply from
   10⁵ to 10⁸–10⁹ and convert uncharged nutrients into charged metabolites. This is
   impedance microbiology, in use since the 1970s. Modern work confirms it: <cite index="5-1">a microfluidic device using low-cost carbon screen-printed electrodes and a diluted low-conductivity medium tracks the change in charge-transfer resistance caused by antibiotic exposure, correlating a normalised impedance signal with bacterial concentration and susceptibility within a 3-hour incubation, across both gram-positive and gram-negative organisms and several antibiotic mechanisms</cite>. <cite index="4-1">Total impedance during bacterial growth splits into a medium/electrolyte component and an electrode-interface component, and the two dominate in different frequency ranges — below roughly 100 Hz the interface dominates</cite>, which is why the growth channel must be multi-frequency rather than a single conductance reading.

2. **Chemical amplification — functionalised electrodes.** Immobilise a recognition
   element (antibody, aptamer, affimer) and let binding modulate charge transfer. This is
   where disease-specific signal actually originates. <cite index="11-1">A label-free impedance sensor using a synthetic cystatin-scaffold capture protein detected human IL-8 in serum with a detection limit near 90 fg/mL, well below basal clinical levels, using the phase shift at 0.1 Hz as the quantity</cite>. <cite index="10-1">An affimer-based sensor reached a 1 pM limit of detection for a protein biomarker in undiluted serum, which contains high concentrations of mobile ions</cite> — the high-ionic-strength case is the hard one, and it has been solved.

3. **Geometric amplification — micro-electrodes and flow cytometry.** Confine the field to
   single-cell dimensions so one cell occupies a large field fraction. <cite index="31-1">Combining micro-dimensional EIS at 10, 50, 100, 500 kHz and 1 MHz with machine learning discriminated normal from cancerous urothelial cells across 236 spectra, with random forest reaching 91.7% accuracy</cite>. This is Phase 2 for us.

**Confirmed product statement:**

> PHENORA Flash is a **multi-channel impedance transducer** wrapped around biological and
> chemical amplification. The spectrometer is the readout. The assay is the chemistry in
> the wells. Anyone selling "bare electrodes → disease name" is selling the readout as
> though it were the assay.

---

## 1. Confirmed cartridge

Eight channels, three physically distinct roles. This replaces the single sensing site in
the current concept.

| # | Channel | Geometry | What it actually measures | Diagnostic weight |
|---|---|---|---|---|
| 1 | `BULK` | 4-electrode | ionic strength, specific-gravity proxy, matrix state | **nuisance / QC only** |
| 2–4 | `AFF_CRP`, `AFF_IL6`, `AFF_ENDOTOXIN` | 3-electrode SPE, functionalised, redox probe | analyte concentration via ΔR_ct | **high** |
| 5 | `GROWTH_CTRL` | interdigitated, low-conductivity medium | growth kinetics | **high** |
| 6–8 | `GROWTH_ABX×3` | as above + antibiotic at breakpoint | susceptibility | **highest** |

Four electrodes on the bulk channel, not two: <cite index="4-1">the electrode-interface impedance is a separate and dominant term at low frequency</cite>, and a four-terminal configuration removes it from the measurement rather than requiring it to be modelled out.

The endotoxin channel is doing real work and is worth calling out: it separates gram-negative
from gram-positive organisms by a mechanism that is independent of growth rate, which is why
the ablation shows affinity and growth features are complementary rather than redundant.

---

## 2. Confirmed acquisition method (this is the "advanced method" decision)

**Excitation: sub-band optimised multisine bursts, Schroeder-phased.**
Not a stepped sweep, not a single wideband chirp.

Multisine is the literature-supported answer: <cite index="33-1">for biological systems whose electrical characteristics change quickly with time, classical frequency sweeps must be replaced by broadband excitation, and the multisine burst simultaneously optimises SNR at a chosen set of spectral samples, limits injected energy to avoid biological stimulation, and minimises measurement time</cite>. Sub-band division is the refinement: <cite index="34-1">dividing the spectrum into sub-bands excited sequentially by different multisines concentrates the available source energy into fewer tones per step, significantly improving SNR without substantially increasing total measurement time</cite>.

**Demodulation: Goertzel resonator bank on FPGA.**
<cite index="35-1">A Goertzel-filter architecture replaces FFT or coherent demodulation, is simpler, requires very few digital resources, is robust to harmonic fold-back, and has been demonstrated demodulating 16 frequencies simultaneously with multisine excitation up to 1 MHz</cite>. One resonator per tone, all concurrent — this is the concrete meaning of "parallel execution" in the FPGA.

### Measured performance of the implementation

From `run_demo.py`, three sub-bands spanning 10 Hz – 1 MHz, 24 tones:

| Metric | Value |
|---|---|
| Crest factors | 3.41 / 3.41 / 2.94 |
| Wall clock, parallel multisine | 404 ms |
| Wall clock, equivalent stepped sine | 920 ms |
| Throughput gain | **2.28×** |
| Simultaneity window | 400 ms |
| Median per-tone SNR | ~109 dB |

**Honest reading of that 2.28×.** The original concept implies parallel acquisition is a
large speed win. It is a modest one, because a stepped sweep only needs a few cycles at each
tone and its cost is dominated by the lowest frequency, which the multisine also has to pay.
**The real win is the simultaneity window**: every tone is sampled inside one 400 ms record,
so a drifting sample cannot smear the spectrum across frequency. That is what makes Z(f,t)
a meaningful object rather than an artefact of sweep direction. Sell simultaneity, not speed.

---

## 3. Confirmed analysis stack

Three layers, in strict order. Nothing downstream may consume a spectrum that fails layer 1.

### 3.1 Kramers–Kronig admissibility gate — the most important feature in the product

KK relations hold for any linear, causal, stable, time-invariant system regardless of what
that system physically is. So a KK failure means drift, non-linearity, or a bad contact —
it is never an interesting biological finding. Implemented as a linear KK test (RC-ladder
measurement model, linear in the resistances, no optimiser to get stuck).

**This is the defence against the characteristic failure mode of impedance diagnostics:
a model confidently classifying an artefact.** Validation (§6, V1): sensitivity 0.88,
specificity 1.00, zero false rejections, 7 escapes in 60. The escape count is the number to
drive down before anything ships.

### 3.2 Distribution of relaxation times — non-parametric structure

Tikhonov-regularised, non-negative, on Im(Z). Maps Z(f) to γ(τ) without committing to an
equivalent circuit first. <cite index="48-1">Applied to biological tissue, DRT identifies and simply removes the electrode-polarisation contribution in a two-electrode system, and separates dispersions associated with different compartments — counterion cloud, cell membrane, cell content, nucleus — quantifying each one's contribution to total DC resistance</cite>. <cite index="40-1">The resulting time-constant-domain spectrum acts as an electrical fingerprint that decodes composition and structure with high sensitivity and resolution, demonstrated on cell suspensions between 1 kHz and 1 MHz</cite>.

Use DRT to *choose* the equivalent circuit, then fit it. Not the other way round.

### 3.3 Parametric descriptors — auditable features

| Channel | Model | Why this one |
|---|---|---|
| `BULK` (urine) | R_s + CPE | **Corrected.** Cell-free urine has no β-dispersion. Forcing a Cole model onto it drives ΔR→0 and α→bound, producing two junk features. This bug was present in the first implementation and caught by the smoke test. |
| `BULK` (blood) | Cole–Cole + CPE | <cite index="16-1">Only β-dispersion is observed in normal blood, arising from a Maxwell–Wagner relaxation of the cell membranes in the 1–100 MHz region, with a Cole–Cole distribution around a characteristic relaxation time</cite> |
| `AFF_*` | Randles + CPE + Warburg | binding blocks electron transfer → R_ct rises |
| `GROWTH_*` | R_s(t) + (R_ct(t) ‖ CPE) | metabolites raise conductance, biomass lowers R_ct |
| growth curve | modified Gompertz | λ, μ_max, plateau, time-to-detection |

**Blood note.** If you take the blood matrix forward, the honest V1 target is **hematocrit and
plasma state**, not disease. <cite index="17-1">Permittivity-change measurement between 10 Hz and 10 MHz tracks hematocrit with correlation 0.99 against centrifugation, and remains stable despite fluctuations in plasma osmolarity and conductivity</cite>. That is a real, defensible, sellable measurement. "Disease from blood impedance" is not.

---

## 4. Confirmed output contract

The concept asks for "disease name + accuracy score". **A softmax number is not an accuracy
score.** Replace it with conformal prediction:

```
score s = 1 − p̂[true class] on a held-out calibration split
q̂       = ⌈(n+1)(1−α)⌉/n quantile of those scores
output  = { y : p̂[y] ≥ 1 − q̂ }
```

This gives a **prediction set with a marginal coverage guarantee of 1−α** under
exchangeability. The set is allowed to contain three organisms when the evidence supports
three, and the instrument is allowed to abstain. Four abstention paths, all wired:

| Decision | Trigger |
|---|---|
| `REPORT_SINGLE` | set size 1, QC accepted |
| `REPORT_SET` | set size 2–3 |
| `ABSTAIN_QC` | KK gate rejected, or trust < 0.55 |
| `ABSTAIN_OUT_OF_DISTRIBUTION` | empty set — nothing in the panel explains the sample |
| `ABSTAIN_UNRESOLVED` | set size > 3 |

The empty-set case is the one that matters clinically: it is how the box says *"this is
something I was not trained on"* instead of forcing it into the nearest known class.

Susceptibility is gated separately: **an AST ratio is reported only if the growth control
actually grew.** Otherwise it is a division by noise, and the output is `NOT_APPLICABLE`.

---

## 5. Confirmed pipeline (this is the frozen architecture)

```
SPECIMEN (urine 200 µL)
   │
   ├─► BULK 4-electrode ──────┐
   ├─► AFF ×3 (functionalised)┤   sub-band multisine burst
   └─► GROWTH ×4 (incubated)  ┘   Schroeder phases, CF ≈ 3
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
     GOERTZEL BANK (FPGA)             ADC 16-bit, PGA autoranged
     N resonators, concurrent
              │
              ▼
   ╔══════════════════════════════════════════╗
   ║  KRAMERS–KRONIG ADMISSIBILITY GATE       ║   ← HARD STOP
   ║  χ² · residual profile · SNR · saturation║
   ║  → trust score → ACCEPT / REVIEW / REJECT║
   ╚══════════════════════════════════════════╝
              │ ACCEPT only
              ▼
     DRT (non-parametric)  →  circuit selection
              │
              ▼
     PARAMETRIC FIT per channel  →  named features
     R_s, CPE(Q,n) │ R_ct, Warburg │ λ, µ_max, t_detect
              │
              ▼
     DIGITAL TWIN (EKF, growth wells only)
     state [g, µ] · ensemble forecast · time-to-threshold
              │  ⚠ currently BLOCKED from output — see §6 V2
              ▼
     CONFORMAL PANEL
     → prediction SET + coverage guarantee + abstain
              │
              ▼
     EIG PLANNER
     argmax bits/minute, subject to physical prerequisites
              │
              └──────────► next action ──────► loop
```

### The planner, concretely

Expected information gain under the model's **own** current posterior — it never peeks at
ground truth:

```
EIG(a) = H(posterior) − E[ H(posterior | x_a) ]     x_a ~ p(x_a | y), y ~ posterior
```

normalised by action cost in minutes, and **filtered by physical prerequisites**. The first
implementation scheduled the AST readout before the incubation it depends on, because AST
promised the most bits. Prerequisites were added; the planner now produces a coherent
schedule:

| Step | Action | Cost | Cumulative | Entropy | Leader |
|---|---|---|---|---|---|
| 0 | prior | — | 0 min | 2.58 bits | — |
| 1 | `BULK_SCAN` | 0.4 min | 0 min | 2.48 bits | — |
| 2 | `AFFINITY_PANEL` | 6 min | 6 min | 1.78 bits | E_COLI_R (48%) |
| 3 | `GROWTH_2H` | 120 min | 126 min | 1.44 bits | E_COLI_R (54%) |
| 4 | `AST_PANEL` | 60 min | **186 min** | 0.00 bits | E_COLI_R (100%) |

It then **stopped**, skipping `GROWTH_4H`, because the entropy threshold was met. Species
call plus susceptibility in ~3.1 h against 24–48 h for reference culture. That time-to-answer
is the product's actual value proposition — not the impedance spectrum.

---

## 6. Validation results (`validate.py`, synthetic cohort n=480)

> These validate the **software**, not the assay. Separability in this cohort is a property
> of the generative model in `phenora/physics.py`. It says nothing about real-world accuracy.

### V1 — integrity gate: **PASS with a caveat**
sensitivity 0.883 · specificity 1.000 · false rejections 0 · **7 escapes / 60**

### V2 — twin forecast calibration: **FAIL**

| Horizon | 95% interval coverage | width | signed bias |
|---|---|---|---|
| +0.5 h | 45.6% | 0.210 | **+0.069** |
| +1.0 h | 41.1% | 0.275 | **+0.113** |
| +1.5 h | 37.8% | 0.250 | **+0.091** |
| +2.0 h | 40.0% | 0.212 | **+0.029** |

Two hypotheses were tested rather than guessed at:

- **H1, variance under-propagation.** EKF linearisation through a convex map understates
  spread. Replaced with 600-particle ensemble propagation. Coverage moved ~30% → ~41%. Real,
  but small.
- **H2, structural bias.** The logistic process model has no lag state, so a filter fitted
  during the lag→exponential transition reads acceleration as high µ and overshoots.

The large *positive* signed bias is H2's signature, and it does not shrink with more
particles. **H2 dominates.**

**Consequence, and it applies directly to the original concept.** The mock-ups showing
`+30 min → 147 Ω, confidence 72%` describe exactly this forecaster. As built, that 72% would
be a lie by a factor of two. The forecast is therefore **computed, displayed with a
calibration warning, and blocked from the reported result**. Nothing downstream consumes it.

**Fix:** three-state Baranyi model with an explicit physiological-state variable, then re-run
V2. Adding process noise would buy coverage only by making the forecast useless.

### V3 — conformal coverage: **PASS marginally, FAIL per class**

overall 93.8% against a 90% target — but K. pneumoniae sits at **69.2%**. Split conformal
guarantees only *marginal* coverage. A **Mondrian (class-conditional) variant is mandatory**
before any clinical claim, otherwise the guarantee silently fails on the rarest and hardest
class.

### V4 — information ablation: **the decisive result**

| Channels used | dims | top-1 | mean set size |
|---|---|---|---|
| **BULK only** | 4 | **18.8%** | 5.72 |
| BULK + AFFINITY | 7 | 59.4% | 2.38 |
| BULK + GROWTH(4h) | 11 | 65.6% | 2.15 |
| AFFINITY only | 3 | 60.4% | 2.40 |
| GROWTH(4h) only | 7 | 64.6% | 2.09 |
| AST only | 4 | 76.0% | 1.85 |
| **GROWTH + AST** | 11 | **94.8%** | 1.05 |
| FULL cartridge | 18 | 93.8% | 1.00 |

Chance is 16.7%. **The bulk spectrum alone is indistinguishable from chance.** Every usable
bit comes from the recognition chemistry and the growth biology. Adding the bulk channel to
GROWTH+AST slightly *hurts* (94.8% → 93.8%) — it contributes nuisance variance, mostly
hydration.

This is the quantitative form of §0, and it is the single most important number in the
project.

---

## 7. Corrected feature checklist

Reclassified against the evidence above. Changes from the previous checklist are marked.

### P0 — must have, confirmed feasible

| Feature | Status | Note |
|---|---|---|
| Sub-band multisine excitation, Schroeder-phased | ✅ implemented | CF ≈ 3 achieved |
| Goertzel demodulation bank | ✅ implemented | FPGA-mappable, few resources |
| 16-bit ADC + autoranging PGA | ✅ modelled | |
| **Kramers–Kronig admissibility gate** | ✅ implemented | **promoted to the top of the stack** |
| Measurement trust score + flags | ✅ implemented | |
| 4-electrode bulk cell | ✅ | removes interface term |
| **Functionalised affinity channels** | ⬆️ **promoted to P0** | was not in the original list; without it there is no assay |
| **Growth wells + AST wells** | ⬆️ **promoted to P0** | the only channel where time carries information |
| Reference calibration module (R/C network) | ✅ retained P0 | attacks device-to-device variance |
| Standardised spectral schema + provenance | ✅ retained P0 | |
| DRT | ⬆️ promoted from "advanced" | needed to pick the circuit honestly |
| Conformal prediction + abstention | ⬆️ **new P0** | replaces "accuracy score" |
| EIG planner with prerequisite constraints | ✅ implemented | rule-based, not RL |
| Simulation / hardware mode separation | ✅ implemented | |
| Audit log | ✅ retained P0 | |

### Demoted

| Feature | Was | Now | Why |
|---|---|---|---|
| Bulk `Z(f)` as diagnostic input | P0 core | **QC / nuisance only** | 18.8% vs 16.7% chance (V4) |
| Multi-horizon forecast display | centrepiece | **blocked pending recalibration** | 41% coverage at nominal 95% (V2) |
| "Impedance digital twin" of the specimen | headline | twin of the **measurement**, growth wells only | a twin needs a validated forward model; only the growth channel has one |
| 3D state visualisation | flagship screen | cosmetic, last | contributes zero bits |
| Fleet intelligence / cloud analytics | P0-adjacent | Phase 3 | premature before device-to-device variance is measured |

### Still not promisable

Unchanged from your list, and now with a reason attached: universal biological digital twin ·
disease prediction from bulk impedance · clinical diagnosis · autonomous therapy · population
generalisation. Add one: **any confidence number on a forecast**, until V2 passes.

---

## 8. Hardware feasibility — the questions that now have answers

| Question | Answer | Confidence |
|---|---|---|
| Frequency range? | 10 Hz – 1 MHz, three sub-bands | high — covers β-dispersion and the interface term |
| Simultaneous frequencies? | 8–9 per burst, 24 total | high — <cite index="35-1">16 simultaneous tones to 1 MHz is demonstrated</cite> |
| Single-tone or multisine? | **multisine, sub-band divided** | high |
| Separation method? | **Goertzel bank, coherent sampling, zero leakage** | high |
| Excitation amplitude? | 100 µA bulk, 5 µA affinity, 20 µA growth | needs formal IEC 60601 auxiliary-current review — **open** |
| ADC? | 16-bit, ≥8× oversampling of top tone, autoranged PGA | high |
| Electrodes? | **4-terminal bulk, 3-electrode affinity SPE, interdigitated growth** | high |
| Reproducible placement? | in-vitro cartridge, not on-body — this problem largely disappears | high |

**Open hardware items:** electrical safety review of injected current; crosstalk between
adjacent wells in a multiplexed cartridge; thermal control of the incubated wells (growth
rate is strongly temperature-dependent, so an uncontrolled well makes µ_max meaningless);
shelf-life and lot-to-lot variance of the functionalised electrodes — **this is the real
manufacturing risk, not the electronics.**

---

## 9. Data reality check

There is **no public dataset** matching "clinical biofluid EIS spectra labelled with disease".
Do not plan around finding one. What exists is fragmentary and small — for example
<cite index="31-1">236 impedance spectra across two urothelial cell lines at five frequencies</cite>. Useful for method development; not a training corpus.

**Consequence:** you generate your own data. The order is:

1. **Reference networks** (known R/C) — proves the instrument, gives absolute accuracy.
2. **Spiked matrices** — known organism, known CFU/mL, into pooled negative urine. This is
   where the growth model gets its real λ, µ_max and β parameters, replacing the assumed
   values in `physics.py`.
3. **Residual clinical specimens** with reference culture + BMD as ground truth, under ethics
   approval. Needs a formal sample-size calculation against a target sensitivity/specificity
   and the expected class prevalences — not "collect until it looks good".

Every one of these needs its own protocol, and the biological feasibility checklist from
your original document stands unchanged and unticked. **A system can be engineering-feasible
and biologically unvalidated. Track those as two separate statuses.**

---

## 10. What is frozen, and what happens next

**Frozen:**
- Eight-channel cartridge with three amplification roles
- Sub-band multisine + Goertzel acquisition
- KK gate as a hard stop ahead of everything
- DRT → circuit selection → parametric fit
- Conformal set output with four abstention paths
- EIG planner with physical prerequisites

**Immediate work queue, in order:**

1. **Baranyi three-state twin.** Re-run V2. No confidence number ships until coverage ≥ 90%.
2. **Mondrian conformal.** Fix the 69.2% class-conditional gap in V3.
3. **Drive V1 escapes to zero.** Seven bad spectra in sixty reached the model.
4. **Electrical safety review** of the excitation amplitudes.
5. **Reference-network bring-up on real hardware.** Compare measured Z against the R/C
   network; this is the first moment any of this stops being simulation.
6. Only then: spiked-matrix study to replace the assumed growth parameters.

**Deliberately deferred:** 3D visualisation, cloud fleet analytics, multi-site multiplexing,
wearable form factor, RL-based planning, blood matrix, any clinical claim.

---

## Provenance

All quantitative results are reproducible: `python3 build_cohort.py && python3 run_demo.py &&
python3 validate.py`. All data is synthetic, generated by `phenora/physics.py`. Literature
claims are cited inline to sources retrieved 2026-09-02. Values described as "assumed" or
"plausible" are exactly that and are marked as such in the code.
