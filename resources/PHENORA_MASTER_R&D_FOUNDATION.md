# PHENORA — Master R&D Foundation
**Document Version:** V1.0 — Finalized Hackathon Foundation
**Status:** Single source of truth for team + future iterations
**Scope covers:** Innovest DeepSprint Hackathon 2026 Round 2/Final, and the V1→V5 startup roadmap

> **Evidence labels used throughout:** `ESTABLISHED` (primary source or validated PHENORA experiment) · `STRONGLY_SUPPORTED` (multiple credible sources) · `PLAUSIBLE` (technically reasonable, not yet demonstrated by PHENORA) · `HYPOTHESIS` (needs experimental validation) · `FUTURE` (not part of current V1) · `UNKNOWN` (insufficient evidence).

---

## 1. Executive Summary

PHENORA (RAPID-AST EDGE) is a low-cost diagnostic edge-hardware platform investigating whether a **confidence-driven, closed-loop measurement architecture** can make phenotypic antibiotic susceptibility testing (AST) more time-efficient. Instead of running a fixed-length test and reading an endpoint, the system continuously senses a bacterial culture's electrical (impedance) response to an antibiotic, extracts features at the edge, and **adaptively decides** whether enough evidence exists to stop, or whether to keep measuring.

**V1 (hackathon MVP) is a bulk differential impedance sensing prototype** — not a clinically validated AST device. It is built from an AD5933 impedance front-end, a Heltec WiFi/ESP32-S3 controller, and a VSDSquadron iCE40UP5K FPGA running the adaptive decision logic. `ESTABLISHED` (architecture — team decision, documented below)

---

## 2. Problem Definition

Antibiotic susceptibility cannot be determined until the pathogen produces a measurable biological response — biology, not computation, is the bottleneck in conventional phenotypic AST. `ESTABLISHED` (team problem statement, consistent with published rapid-AST framing)

Affected stakeholders: clinicians selecting empirical vs targeted therapy, microbiology labs running AST workflows, hospitals managing antimicrobial stewardship, and — per PHENORA's target deployment — district/rural health facilities with limited lab infrastructure.

---

## 3. Why Rapid AST Matters

Antimicrobial resistance (AMR) is a recognized global health threat, and time-to-appropriate-therapy is a recognized lever for outcomes and stewardship. `STRONGLY_SUPPORTED` (broad AMR/rapid-diagnostics literature; not independently re-verified line-by-line in this document — treat as background context, not a PHENORA-specific claim)

---

## 4. Existing AST Workflow and Bottlenecks

```
PATIENT → SAMPLE → CULTURE/ISOLATION → AST SETUP → INCUBATION → ENDPOINT READING → S/I/R RESULT
```

Conventional phenotypic AST (disk diffusion, broth microdilution) requires bacterial growth to a fixed endpoint (typically 16–24h culture-dependent steps) before a result is available, regardless of how early the underlying evidence becomes clear. `ESTABLISHED` (standard CLSI/EUCAST methodology, well established in the field)

Digital tools (e.g., smartphone interpretation) improve reading and reporting but do not remove the underlying biological response time. `PLAUSIBLE`

---

## 5. Competitive Landscape

| Approach | Principle | Speed | Sample handling | PHENORA's opportunity | Limitation |
|---|---|---|---|---|---|
| Conventional AST (CLSI/EUCAST) | Disk diffusion / broth microdilution, endpoint read | 16–24h | Standardized, lab-grade | Continuous response monitoring instead of fixed endpoint | Long biological workflow, endpoint dependence |
| Antibiogo (smartphone) | Photographs an already-incubated antibiogram, ML reads inhibition zones | Interprets existing plate, doesn't speed up the biology | Smartphone + printed disks | Measure + process + adapt (PHENORA creates a new sensing layer, Antibiogo interprets an existing one) | Doesn't accelerate the underlying AST; still endpoint-dependent |
| iFAST (single-cell impedance cytometry) | High-frequency microfluidic impedance on individual cells; electrical radius (size) + opacity (membrane integrity) per cell | 2020: ~3 min measurement after 30+30 min prep; 2025 UTI study: ~2h exposure, clinical concordance ≥74/80 samples | Microfluidic flow, instrument-grade | Benchmark for what mature impedance-AST can achieve | Requires flow-cytometry-grade instrumentation, not a benchtop build |
| Bulk EIS AST (2025 Scientific Reports, carbon SPEs) | Population-level charge-transfer resistance (Rct) via EIS in a microfluidic device, low-conductivity medium | Signals over ~hours in the published study | Screen-printed carbon electrodes, diluted nutrient medium | Closest published precedent to PHENORA's V1 sensing principle | Bulk/population signal, slower than single-cell approaches |
| LOSC / SiNWFET metabolic pH sensing (2026 Uppsala paper) | Microfluidic cell concentration into pL chambers + SiNWFET pH sensing of metabolic acidification | Sub-20-min sample-to-result in the paper's tested conditions | Cleanroom-fabricated chip, semiconductor parameter analyzer readout | North-star benchmark for "sense before growth" logic; NOT reproduced by PHENORA | Requires SOI wafers, e-beam lithography, ALD HfO2, HP4155A-class instrumentation — orders of magnitude beyond hackathon/startup-bench feasibility |
| PHENORA V1 | Bulk differential impedance + FPGA adaptive stop/repeat decision | Target 30 min–3h (bulk-impedance realistic range) | Static wells, benchtop AD5933/AD5941-class AFE | Closed-loop sensing + FPGA processing + adaptive decision (this is the actual novelty candidate) | Requires biological validation; bulk signal, not single-cell |

`STRONGLY_SUPPORTED` for iFAST, bulk-EIS, and LOSC rows (drawn from the primary papers referenced in this project's research). `ESTABLISHED` for PHENORA row (internal architecture decision).

**Rule applied throughout:** PHENORA is not claimed unique merely because no competitor uses the exact same components. Novelty is assessed separately at the sensor, architecture, algorithm, and workflow level (see Section 40).

---

## 6. iFAST — What It Does and What PHENORA Learns From It

iFAST (Spencer et al., *Nature Communications*, 2020) performs single-cell microfluidic impedance cytometry: bacteria flow individually through a channel where high-frequency impedance captures electrical radius (size proxy) and opacity (membrane-integrity proxy) per cell. Susceptible cells show detectable morphology/membrane shifts; resistant/untreated cells don't. Workflow: overnight culture → 30 min revival → 30 min antibiotic exposure → 3 min measurement. `STRONGLY_SUPPORTED`

The 2025 Journal of Infection follow-up validated the same underlying platform clinically: 58 *E. coli*/*K. pneumoniae* strains against 8 UTI antibiotics, single-cell-count drop after 2h exposure used to call susceptibility, 100% agreement with broth microdilution on lab strains, and concordance in at least 74/80 clinical samples. A 96-well commercialized descendant aims for full AST+MIC panels in ~3h. `STRONGLY_SUPPORTED`

**Three real gaps between iFAST and PHENORA (not cosmetic):**
1. **Signal type** — iFAST reads individual-cell electrical morphology at MHz-range frequency; PHENORA V1 reads aggregate medium conductivity at low frequency (100 Hz–10 kHz), a population-level metabolic proxy closer to classical impedance microbiology (Bactometer/RABIT-style) than to iFAST.
2. **Hardware class** — iFAST needs microfluidic flow-cytometry-grade instrumentation; PHENORA is deliberately a benchtop-cost build (AD5933/AD5941 + static-well IDEs), not attempting single-cell resolution.
3. **Validation maturity** — iFAST has clinical concordance data; PHENORA V1 is at bench-prototype/protocol stage.

**Where they converge:** the electrical-MIC (eMIC) concept — dose-response across a two-fold dilution series regressed against reference broth-microdilution MIC — is the same logic in iFAST 2025 and in PHENORA's proposed DIR/eMIC framework (Section 20). `STRONGLY_SUPPORTED`

---

## 7. Bulk Impedance AST Literature

Key precedents establishing that bulk/population-level impedance AST is a legitimate, published research direction:

- **Karmakar/Gopalakrishnan et al., *Scientific Reports*, 2025 (s41598-024-84286-3)** — carbon screen-printed electrodes in a microfluidic device, diluted low-conductivity nutrient medium (10% tryptone nutrient medium, TNM, selected specifically for higher impedance baseline while preserving growth), charge-transfer resistance (Rct) extracted from a Randles-type equivalent circuit, tested on *E. coli* and *B. subtilis* with ampicillin/tetracycline. `STRONGLY_SUPPORTED` — this is the closest published precedent to PHENORA's V1 sensing principle.
- **Swami et al., *Biosensors and Bioelectronics*, 2022 (200:113876)** — low-conductivity zwitterionic growth buffer (LCGB) on interdigitated electrodes (IDEs), reported to enable AST in ~20 min (death-based) to 60–80 min (growth-based/MIC) at 2×10⁵ CFU, described as 8–9x faster than LB. Exact numeric thresholds and frequency could not be independently re-verified from open sources (paywalled) — treat specific numbers as `PLAUSIBLE`, general direction as `STRONGLY_SUPPORTED`.
- **Spencer et al., ACS Sensors, 2023** — "Electrical Broth Micro-Dilution" defines electrical-MIC (eMIC) via normalized-conductivity threshold (falls below 50% at MIC; a stricter 10% cutoff gives ±one two-fold-dilution accuracy vs reference MIC), 100 nL volume, n=3 biological repeats. `STRONGLY_SUPPORTED`
- **Classic impedance microbiology** (Bactometer, RABIT, Malthus, BacTrac) — "detection time" defined as the point where the impedance/conductance curve deviates from baseline by a fixed threshold (BacTrac uses 5%). `ESTABLISHED` (established commercial/industrial methodology)
- **Hannah et al. (Strathclyde, 2019/2020)** — validated AST on commercial screen-printed gold electrodes with antibiotic-seeded agarose hydrogel, distinguishing susceptible *S. aureus* from MRSA and susceptible/resistant *E. coli* in 45–60 min; spun into commercial venture Microplate Dx. `STRONGLY_SUPPORTED`

**The core physical relationship PHENORA V1 relies on:**

Impedance magnitude is inversely related to medium conductivity: |Z| ∝ 1/(σ·ω·geometry). A **low-conductivity medium** raises both baseline |Z| and the fractional impedance change produced by each increment of metabolically generated ions — this is why the literature above deliberately dilutes broth or uses zwitterionic buffers rather than high-ionic-strength media. `STRONGLY_SUPPORTED`

---

## 8. 2025 Scientific Reports Reference — Deep Analysis

**Karmakar/Gopalakrishnan et al., 2025, Scientific Reports.** This paper is PHENORA's primary architectural precedent because it is the closest published system to what V1 is attempting: bulk (not single-cell) impedance, screen-printed carbon electrodes (not exotic microfabrication), a simple microfluidic/well geometry, and a normalized Rct-based signal rather than raw impedance magnitude. `STRONGLY_SUPPORTED`

Key transferable design decisions for PHENORA:
- Use a **derived feature** (Rct or normalized impedance), not raw |Z|, as the biological signal — see Section 20.
- Use **diluted/low-conductivity medium**, not full-strength broth or saline.
- Use **control (no antibiotic) vs test (+antibiotic)** differential comparison, not an absolute single-well reading.
- Carbon electrodes are commodity and reproducible — a realistic V2 electrode upgrade path once bench-fabricated/simple wire electrodes have proven the electronics chain.

What this paper does **not** give PHENORA: an adaptive/edge-computing decision layer, or a validated stopping criterion faster than its own multi-hour signal window. That gap is exactly where PHENORA's proposed novelty sits (Section 40).

---

## 9. PHENORA Core Hypothesis

> A low-cost bulk impedance system may be capable of detecting reproducible electrical changes associated with biological or chemical perturbations, while an adaptive edge-computing layer may reduce unnecessary repeated measurements by deciding when the electrical evidence is sufficiently stable. `HYPOTHESIS`

**Important distinction, stated explicitly and repeated throughout this document:** PHENORA V1 does **not** claim to have demonstrated clinical antibiotic susceptibility testing. It demonstrates and validates the sensing, differential-measurement, and adaptive edge-computation architecture. Biological AST validation is a distinct, future, supervised-laboratory activity.

---

## 10. What PHENORA Measures Physically

V1 measures **complex electrical impedance** Z(f) = R + jX between a control-well electrode pair and a test-well electrode pair, at one or more frequencies, over time. The AD5933 returns real/imaginary components via on-chip DFT after AC excitation. `ESTABLISHED` (AD5933 datasheet, Analog Devices)

---

## 11. Why Impedance Can Change

Documented mechanisms by which bulk impedance of a bacterial culture can shift over time (`STRONGLY_SUPPORTED`, from the bulk-EIS and impedance-microbiology literature in Sections 7 and the uploaded impedance-design reference):

- Bacterial growth/metabolism altering ionic composition of the medium (metabolic byproducts change conductivity).
- Cell death and release of intracellular ions into the medium.
- Electrode/electrolyte interface effects (double-layer capacitance, charge-transfer resistance shifts).
- Non-biological confounders: temperature (~2%/°C conductivity coefficient), evaporation, electrode drift/polarization — these must be measured and controlled for, not attributed to biology by default.

---

## 12. What PHENORA Is NOT Measuring

- Not single-cell morphology or membrane integrity (that is iFAST's domain).
- Not a direct viable-cell count.
- Not pH directly (V1 does not use a pH sensor — that was explicitly rejected for V1, see Section list of rejected items below).
- Not validated clinical MIC or S/I/R in the current hackathon build.

---

## 13. V1 System Architecture

```
                 PHENORA V1

       CONTROL             TEST
     (no antibiotic)     (+antibiotic)
          │                  │
          └───────┬──────────┘
                  ↓
             ELECTRODES
                  ↓
              AD5933              (excitation + ADC + on-chip DFT → real/imaginary Z)
                  ↓ I²C
             HELTEC V3            (ESP32-S3: AD5933 config/calibration, |Z|/phase calc, feature gen)
                  ↓ UART
        VSDSQUADRON iCE40UP5K FPGA
                  ↓
       filter → ΔF → slope → stability
                  ↓
          ┌───────┴────────┐
          ↓                ↓
       REPEAT             STOP
          │                │
          └──────→ HELTEC ←┘
                     ↓
               OLED / Wi-Fi dashboard
```

`ESTABLISHED` as the team's finalized V1 architecture (supersedes earlier optical, pH, and DEP-first proposals — see Section 50 Decision Log).

---

## 14. AD5933 Architecture

Single-chip impedance converter: DDS sine-wave generator, 12-bit 1 MSPS ADC, on-chip DFT engine returning real (R) and imaginary (I) components. Native excitation frequency range ~1 kHz–100 kHz; native impedance measurement range ~1 kΩ–10 MΩ (lower impedance needs additional front-end circuitry). I²C-controlled, supports programmable frequency sweeps. `ESTABLISHED` (Analog Devices AD5933 datasheet)

**Limitation for this project:** the AD5933's 1 kHz floor sits above the 100 Hz–1 kHz region where medium-conductivity effects from bacterial metabolism are often strongest in the literature (Section 7); it is natively 2-electrode (4-wire suppression of electrode-polarization drift needs extra circuitry). `STRONGLY_SUPPORTED`

**Alternative considered (documented, not adopted for V1):** AD5941/AD5940 — 16-bit, ~0.015 Hz–200 kHz range, integrated potentiostat/TIA, native 4-wire measurement, better suited to the low-frequency region and multi-hour drift suppression. Bare IC ~$14, EVAL-AD5941 daughterboard ~$205 (Aug 2026 DigiKey pricing). Not selected for V1 due to hackathon-timeline sourcing constraints; flagged as a strong **V2 candidate** for improved sensitivity. `STRONGLY_SUPPORTED` (component pricing per DigiKey, Aug 2026 — subject to change)

---

## 15. Heltec Architecture

Heltec WiFi Kit 32 V3 (ESP32-S3) is responsible for: AD5933 I²C configuration and calibration, real/imaginary acquisition, magnitude/phase calculation, feature generation, UART communication to the FPGA, OLED status display, logging, and optional Wi-Fi/cloud telemetry. `ESTABLISHED` (team architecture decision; ESP32-S3 I²C/UART capability per Heltec/Espressif documentation)

**Note (device correction from earlier planning):** if the team's on-hand board is an **ESP8266** rather than the Heltec ESP32-S3, be aware ESP8266 has only one weak analog input and should not be used for direct analog signal capture — but since all impedance data arrives digitally over I²C from the AD5933 (not via an analog pin), this limitation does not block the architecture. ESP8266 I²C (typically D1/D2) is sufficient for AD5933 communication.

---

## 16. FPGA Architecture

VSDSquadron FPGA Mini (Lattice iCE40UP5K, 5.3K LUTs, 1Mb SPRAM, 120Kb DPRAM, 32 GPIO, FTDI-based onboard programmer, open toolchain: Yosys/nextpnr/Project IceStorm). `ESTABLISHED` (VSDSquadron FM datasheet)

FPGA responsibilities: UART RX/TX, packet parsing, feature buffering, fixed-point digital filtering, differential (ΔF) calculation, slope estimation, stability/variance estimation, consecutive-stability counting, timeout handling, and the STOP/REPEAT finite state machine (FSM), plus status reporting back to Heltec.

**Architectural principle:** the AD5933 already performs excitation, ADC, and DFT — do not recreate this inside the FPGA. The FPGA's job is everything **above** that layer: R,I → |Z|,φ → ΔZ/ΔF → features → confidence → adaptive FSM. There is direct precedent for AD5933+FPGA integration (Analog Devices publishes an AD5933 Pmod Xilinx FPGA reference design), so this partition is technically credible, not arbitrary. `STRONGLY_SUPPORTED`

---

## 17. Heltec ↔ FPGA Communication

```
Physical:  Heltec TX → FPGA RX
           Heltec RX ← FPGA TX
           Heltec GND ↔ FPGA GND
           (3.3V logic on both sides — verify before connecting; do not feed 5V into either board)

Protocol:  UART, 115200 baud, 8N1
Packet:    [Header AA 55] [Type: DATA] [Sequence: 8-bit] [Feature: 16-bit] [Flags: 8-bit] [Checksum: XOR]
```

`PLAUSIBLE` (protocol design — not yet hardware-verified; XOR checksum is a placeholder for initial bring-up, not a final-quality choice). **Rule:** do not hard-code FPGA physical GPIO numbers without checking the VSDSquadron board's exact PCF/constraint file — the board-specific constraint file is authoritative, not this document.

---

## 18. FPGA Algorithm (V1)

Deliberately simple, fixed-point, no floating-point/square-root/division-heavy operations, no ML:

- **Filter:** 4-sample moving average (avoids floating-point/division cost)
- **Differential:** `delta = test − control`
- **Slope:** `slope[n] = delta[n] − delta[n−4]`
- **Stability:** `range = max(recent slopes) − min(recent slopes)`
- **Stopping condition:** signal above minimum threshold AND sufficient stability AND required number of consecutive stable windows → **STOP**
- **Otherwise:** **MEASURE AGAIN**
- **Timeout:** if no stable/threshold condition reached within a bounded window → **INCONCLUSIVE / TIMEOUT**

`PLAUSIBLE` (algorithm design, matches team decision; not yet hardware-validated on real or synthetic data at time of writing this document — see Section 26 for the validation plan that proves it).

**Explicitly avoided in V1:** floating-point, square-root hardware, division-based confidence scores, full variance hardware, nonlinear equivalent-circuit fitting on-chip, machine learning/neural networks, SPRT (sequential probability ratio test) as a first implementation. These are documented as deliberate V1 exclusions, not oversights (see Section 44 roadmap for where they reappear).

---

## 19. Adaptive STOP/REPEAT Logic — Why It's the Actual Novelty Candidate

```
Z(t) → features → confidence/stability → measurement policy → next action ∈ {STOP, REPEAT}
```

Most rapid-AST research (Sections 6–8) focuses on making the underlying measurement itself faster or more sensitive. PHENORA's proposed research question is different: **can the system use the response observed so far to decide what to measure next?** This closed-loop, confidence-driven measurement-scheduling layer — not the impedance sensor itself — is where PHENORA's differentiated contribution is proposed to sit. `HYPOTHESIS` (proposed novelty, not yet validated against systematic prior art — see Section 40).

---

## 20. Mathematical Definitions

| Symbol | Definition |
|---|---|
| F | A validated impedance-derived feature (candidate: \|Z\|; future candidates: real(Z), imaginary(Z), phase, Rct, normalized impedance) |
| ΔF(t) | `F_test(t) − F_control(t)` — the differential signal |
| DIR(t) | Differential Impedance Ratio = `ΔZ_antibiotic(t) / ΔZ_growth-control(t)`. DIR ≈ 1 → drug did not inhibit metabolism → resistant-like signature; DIR ≈ 0 → metabolism suppressed → susceptible-like signature |
| Noise floor | mean + 3×SD of the sterility control's impedance fluctuation over the run (analogous to the reference paper's ΔVth > 20 mV = max-SEM rule) |
| eMIC | Electrical-MIC — lowest antibiotic concentration where normalized conductivity/impedance change drops below a chosen threshold (~50% for nominal MIC; ~10% cutoff for ±one two-fold-dilution accuracy vs reference MIC), per Spencer et al. ACS Sensors 2023 convention |
| TTD | Time-to-Detection — time for growth-control ΔZ to first cross the noise floor |

`STRONGLY_SUPPORTED` — these definitions are adapted directly from Spencer et al. 2023 and the bulk-EIS literature (Section 7), not invented for this document. **Rule:** F is not assumed to be |Z| permanently — the final feature must be selected based on measurement quality and experimental evidence (Stage 1–2 validation, Section 21).

---

## 21. Experimental Validation Ladder

Because controlled bacterial culture, antibiotic exposure, and reference AST could not be responsibly completed within the hackathon timeline, validation is explicitly separated into **engineering validation** (achievable now) and **future biological validation** (a distinct, supervised, later stage).

```
LEVEL 1  Known resistors            → Can AD5933 measure impedance correctly?
LEVEL 2  Known liquids/electrolyte  → Can electrodes distinguish controlled conductivity differences?
LEVEL 3  Controlled perturbation    → Can the system track a deliberately changing electrical environment?
LEVEL 4  FPGA adaptive algorithm    → Can it decide STOP vs REPEAT correctly (synthetic data)?
LEVEL 5  Biological validation      → ONLY in an appropriate supervised laboratory setting (FUTURE)
```

---

## 22. Electrical Validation (Stage 1)

**Purpose:** verify AD5933 acquisition/calibration against known loads.

| Test | Expected Z | Measured Z | % Error | Repeatability (SD) |
|---|---|---|---|---|
| 1 kΩ resistor | — | *(record)* | *(record)* | *(record)* |
| 10 kΩ resistor | — | *(record)* | *(record)* | *(record)* |
| 100 kΩ resistor | — | *(record)* | *(record)* | *(record)* |

**Success criterion:** stable, repeatable measurement across repeated runs, with error within an acceptable band established by the team's electronics lead before biological-adjacent testing proceeds.

---

## 23. Electrolyte Validation (Stage 2)

**Purpose:** demonstrate controlled, repeatable impedance separation using reproducible salt/electrolyte conductivity levels (e.g., low/medium/higher salt concentration in water).

Metric: `ΔZ = Z_B − Z_A` between two known-different conditions; success requires `σ_repeat ≪ |μ_B − μ_A|` (repeat-measurement noise much smaller than the between-condition separation).

---

## 24. Curd Complex-Matrix Demonstration (Stage 3)

**Purpose:** demonstrate the system operating on a complex biological/food matrix — **explicitly not an AST claim.**

Rationale for using curd: published EIS work has characterized fermented dairy/yogurt matrices (e.g., across 50 Hz–1 MHz) and correlated electrical conductivity with lactic-acid-bacteria fermentation progress and pH changes. `STRONGLY_SUPPORTED` (published dairy-EIS literature; general precedent, not PHENORA-specific validation)

Recommended tests:
- Curd vs reference electrolyte (baseline comparison)
- Curd dilution series (100% / 75% / 50% / 25% curd-in-water) — demonstrates resolution of a controlled biological-matrix gradient, not a bacterial-concentration quantification
- Optional: temperature perturbation on the same sample (see Stage 4)

**Required language, used consistently:** call this *"complex biological-matrix impedance characterization,"* never *"antibiotic susceptibility testing."* **Prohibited claims:** curd is not an AST model; curd cannot demonstrate antibiotic susceptibility; do not use uncontrolled environmental bacteria, home culturing, pH/acid-based "cell-breaking" experiments, or unknown antibiotics applied to uncontrolled biological material as AST evidence.

---

## 25. Temperature/Confounder Testing (Stage 4)

**Purpose:** determine how environmental variation (primarily temperature, ~2%/°C conductivity coefficient) affects the impedance signal, and whether the differential (control vs test) architecture suppresses common-mode drift.

Design: same sample measured at two controlled temperature conditions; log Z(t) and T(t) together. This directly addresses one of the strongest criticisms of any impedance-AST system — that temperature drift can visually mimic a biological signal.

---

## 26. Synthetic FPGA Validation (Stage 5)

**Purpose:** validate STOP/REPEAT FSM behavior independent of any physical sensor, using synthetic or literature-derived signal patterns:

| Pattern | Expected FPGA output |
|---|---|
| Stable, low-noise signal | STOP (after minimum window) |
| Slow drift | REPEAT, eventually STOP if it plateaus |
| Sudden step change | REPEAT until re-stabilized |
| Unstable/noisy signal | REPEAT (never falsely STOPs) |
| Stable plateau after transient | STOP |
| Communication timeout / dropped packets | INCONCLUSIVE / TIMEOUT |

This is the **strongest, lowest-risk demo asset** available before biology is involved — it directly demonstrates the claimed computational novelty (Section 19) without any biological-validity caveats attached.

---

## 27. Future Biological Validation (Stage 6 — FUTURE)

Requirements before any biological AST claim can be made: defined organism (e.g., *E. coli* ATCC 25922 susceptible reference vs ATCC 35218 ampicillin-resistant reference, both CLSI/EUCAST QC strains), defined antibiotic panel, defined low-conductivity medium, growth control + sterility control + test wells in biological triplicate, an approved/supervised laboratory, and a reference AST method (broth microdilution/E-test) for correlation. `STRONGLY_SUPPORTED` (strain pairing and QC-strain sourcing per CLSI/EUCAST convention) — **status: NOT part of the current hackathon MVP.**

---

## 28. Biological Workflow (Future Protocol Sketch)

```
0.5 McFarland inoculum → dilute to CLSI-standard 5×10⁵ CFU/mL
         │
   ┌─────┼──────────────┐
   ▼     ▼              ▼
TEST   GROWTH CONTROL  STERILITY CONTROL
(inoculum          (inoculum,        (medium + antibiotic,
+ antibiotic)      no antibiotic)     no inoculum)
   │                  │                  │
   └──────────────────┴──────────────────┘
                       ▼
         Impedance sweep, locked frequency, every 1–5 min, 3–4h
                       ▼
         ΔZ, DIR(t), noise floor from sterility control
                       ▼
         Susceptibility call at TTD + DIR stabilization
```

Media: primary low-conductivity growth buffer (glucose + minimal NaCl + HEPES zwitterionic buffer, OR 5–10% diluted Mueller-Hinton broth), with a parallel CAMHB (cation-adjusted Mueller-Hinton broth) reference arm to keep calls traceable to CLSI-standard methodology. Incubation 35–37°C, actively temperature-logged given the ~2%/°C conductivity sensitivity; evaporation controlled via mineral-oil overlay or sealed humidified chamber. `STRONGLY_SUPPORTED` (adapted from the bulk-EIS design literature, Sections 7–8, 10)

**This entire section is FUTURE / not part of the hackathon submission.**

---

## 29. Electrode Strategy

| Stage | Electrode | Rationale |
|---|---|---|
| Hackathon V1 (today) | Simple wire/stainless-steel/graphite electrodes | Immediately sourceable, sufficient for electronics/differential-architecture proof |
| V2 (near-term) | DIY ENIG-gold PCB interdigitated electrodes (~150–200µm features) or gold-leaf/laser-ablated electrodes | Low-cost (a few dollars/board), reproducible, published precedent for impedance biosensing |
| V3+ (research-grade) | Commercial screen-printed gold IDEs (e.g., Metrohm DropSens G-IDEAU10/G-IDEAU5, 5–10µm gaps) or carbon SPEs as in the 2025 Scientific Reports paper | Matches the literature precedent directly; 5–10µm gap is a reasonable compromise between surface sensitivity and bulk-conductivity sampling per simulation/patent literature |

`STRONGLY_SUPPORTED` for the geometry/gap guidance; `PLAUSIBLE` for exact PHENORA electrode performance until bench-characterized (Stage 1–2 validation).

---

## 30. Frequency Strategy

**V1 rule:** do not hard-code a frequency range based on convenience. Perform a frequency sweep (target 100 Hz–1 MHz where feasible) on a growth-control vs sterility-control (or, for hackathon purposes, control vs test electrolyte) to identify the frequency of maximum separation, then lock that frequency for high-cadence monitoring. Classic commercial impedance-microbiology systems typically operate in the 2–10 kHz range where capacitance changes are most pronounced; this is a starting reference, not a fixed PHENORA specification. `STRONGLY_SUPPORTED`

**AD5933 constraint:** native range is ~1 kHz–100 kHz — below 1 kHz requires additional analog front-end circuitry (published academic groups have extended it to ~10 Hz). This is a known V1 hardware limitation, documented rather than hidden.

---

## 31. Calibration Strategy

1. Measure known resistive loads (1kΩ/10kΩ/100kΩ) across the intended frequency range to establish the AD5933's gain-factor calibration.
2. Characterize electrode-pair repeatability and baseline drift in a controlled electrolyte before any differential or biological-adjacent test.
3. Re-calibrate whenever electrodes, medium, or temperature conditions change meaningfully.

---

## 32. Data Pipeline

```
AD5933 (I2C, R+jI) → Heltec (|Z|, phase, feature calc) → UART packet → FPGA (filter, ΔF, slope, stability, FSM) → UART → Heltec (OLED/log/Wi-Fi)
```

---

## 33. Firmware Architecture

Heltec firmware responsibilities: AD5933 register configuration (start frequency, frequency increment, number of increments, settling cycles), triggering sweeps, reading R/I registers, computing |Z| and phase, packaging into the UART protocol (Section 17), and rendering OLED status. `PLAUSIBLE` (design-level; implementation not yet complete at time of writing)

---

## 34. FPGA Task Breakdown

UART receiver → packet validator (checksum) → feature buffer (ring buffer, N=4 minimum for the moving-average filter) → differential unit → slope unit → stability/range unit → consecutive-stable counter → FSM (IDLE → MEASURING → STABLE_CHECK → STOP/REPEAT/TIMEOUT) → UART transmitter (status back to Heltec).

---

## 35. Team Responsibilities

| Role | Deliverables |
|---|---|
| **System/Startup/Research Lead** | Architecture, research synthesis, competitor analysis, prior-art analysis, novelty claim, integration, demo, startup roadmap, risk management |
| **Electronics (Impedance Sensing)** | AD5933 bring-up, known-resistor calibration, frequency characterization, electrode characterization, controlled-electrolyte experiments, temperature logging, measurement repeatability |
| **FPGA/Embedded** | FPGA bring-up, UART, packet protocol, synthetic signal mode, filter, differential, slope, stability, adaptive FSM, STOP/REPEAT, Heltec integration, hardware verification |
| **Biotechnology** | Interpret biological mechanism behind impedance changes, analyze 2025 bulk-EIS literature, define future organism/antibiotic/medium selection, define controls and reference AST, identify biological confounders, prepare future supervised validation protocol. **No biological AST experiment is to be fabricated for the hackathon.** |

---

## 36. BOM (Bill of Materials)

| Component | Status | Role | Notes |
|---|---|---|---|
| VSDSquadron FPGA Mini (iCE40UP5K) | Already owned | Adaptive decision FPGA | — |
| Heltec WiFi Kit 32 V3 (ESP32-S3) / ESP8266 | Already owned (confirm exact board) | Controller/I2C-UART bridge | If ESP8266: fine for I2C control, do not use its analog pin for signal capture |
| AD5933 module | To source | Impedance front-end (V1 preferred) | Local sourcing only for hackathon timeline (imported units have multi-week lead times) |
| ADS1115 16-bit ADC | To buy (cheap, ~₹140–250) | Fallback/auxiliary ADC, discrete-front-end path | Buy regardless of AD5933 outcome — cheap insurance |
| NE555 / LM555, LM358 | To buy if AD5933 unavailable | Discrete AC excitation + signal conditioning fallback | See fallback checklist document |
| Calibration resistors (1k/10k/100kΩ) | To buy | AD5933/instrument calibration | — |
| Electrode pairs (control + test) | To buy | Sensing interface | Simple wire/steel/graphite for V1; SPE/PCB-IDE for V2+ |
| Sample containers/wells | To buy | Control/test chambers | — |
| Temperature sensor | To buy if available | Confounder logging | — |
| Breadboard, jumper wires, misc | To buy | Prototyping | — |

**Instruction preserved from source prompt:** do not invent prices beyond what has been explicitly sourced and dated; all INR pricing in this project's companion checklist (`PHENORA_V1_Component_Checklist.md`) is dated and sourced separately. USD pricing for AD5941/AD5933 eval boards above is from DigiKey, accessed Aug 2026, and is subject to change/lead-time variation.

---

## 37. Risk Register

| Risk | Category | Probability | Impact | Early Detection | Mitigation | Fallback | Relevance |
|---|---|---|---|---|---|---|---|
| Bulk impedance signal too weak/noisy to resolve reliably | Scientific | High | High | Stage 1–2 validation fails to show clean separation | Switch feature from raw \|Z\| to Rct/normalized impedance; lower medium conductivity | Report as an honest negative result; pivot novelty claim to architecture-only | V1 |
| Electrode polarization/drift dominates over hours | Electrode | High | High | Baseline drift visible in Stage 1 repeated measurements | Move to 4-wire measurement (AD5941 path) in V2 | Shorten measurement window; use differential (control−test) to cancel common drift | V1–V2 |
| Temperature confounds signal | Temperature | High | High | Stage 4 confounder test shows Z correlates with T more than with expected biological signal | Active temperature logging + control; differential architecture | Report temperature as an explicit confounder channel, not hide it | V1 |
| Medium conductivity too high (masks metabolic signal) | Medium conductivity | Medium | High | Weak ΔZ despite known active culture (future stage) | Use diluted broth or zwitterionic buffer per literature (Section 7) | Document as a required V1→biological-validation transition parameter | Future |
| AD5933 unavailable locally in time | Electronics | Medium | Medium | Sourcing check on procurement day | Discrete 555+op-amp+ADS1115 fallback | Documented fallback architecture, ADS1115 bought regardless | V1 |
| FPGA implementation slips before deadline | FPGA implementation | Medium | Medium | Integration testing timeline | Prove algorithm in Python/ESP32 first, port only once proven | Demo the Python/serial pipeline live, state FPGA port as in-progress | V1 |
| No biological validation access | Biological validation | High | High (for long-term credibility) | Known from project start | Explicit two-track validation (engineering now, biology later) | State honestly in all submissions/pitches | V1–V5 |
| Novelty claim over-stated / prior art missed | Commercial/regulatory/prior art | Medium | High (credibility, future IP) | Judge/reviewer questioning | Use "investigates"/"proposes" language; formal prior-art search before any patent filing | Reframe as research hypothesis, not established claim | V1–V5 |
| FPGA doesn't add measurable value over software | FPGA implementation | Medium | Medium | Compare Python-only pipeline latency/determinism vs FPGA | Emphasize determinism/parallelism/no-cloud-dependency value proposition | If unconvincing, honestly narrow the FPGA's claimed role | V1 |

---

## 38. Failure Modes

- **False STOP:** system halts on a noise spike misread as a stable signal → mitigated by requiring N consecutive stable windows, not a single sample.
- **False REPEAT forever (never stops):** overly strict stability/threshold parameters → mitigated by a timeout state (INCONCLUSIVE) rather than infinite measurement.
- **Communication failure (UART drop):** Heltec↔FPGA packet loss → mitigated by checksum validation and a defined timeout/error state.
- **Electrode fouling/contamination between runs:** not yet mitigated in V1 — flagged as an open issue for V2 (disposable electrode strategy).

---

## 39. Prior Art

Closest identified prior art, to be treated as a starting point for — not a substitute for — a formal prior-art/patentability search before any filing:

- iFAST (single-cell impedance AST) — Spencer et al., *Nature Communications* 2020; Journal of Infection 2025 clinical study.
- Bulk EIS AST with carbon SPEs — Karmakar/Gopalakrishnan et al., *Scientific Reports* 2025.
- Low-conductivity zwitterionic buffer AST — Swami et al., *Biosensors and Bioelectronics* 2022.
- Electrical Broth Micro-Dilution / eMIC — Spencer et al., *ACS Sensors* 2023.
- Classic impedance microbiology instruments (Bactometer, RABIT, Malthus, BacTrac) — established commercial detection-time methodology.
- Screen-printed gold IDE AST — Hannah et al. (Strathclyde) / Microplate Dx.
- AD5933+FPGA reference designs — Analog Devices official Pmod/Xilinx reference design (establishes the AD5933+FPGA pairing as technically unremarkable on its own; PHENORA's claim must rest on the adaptive layer, not this pairing).

**None of the above explicitly combine bulk/population impedance sensing with an FPGA-based confidence-driven adaptive stop/repeat measurement-scheduling layer**, based on the sources reviewed for this project — but this has **not** been confirmed via a systematic, professional prior-art/patent search. `UNKNOWN` pending formal search.

---

## 40. Novelty Analysis

Separated by layer, per the source prompt's explicit instruction:

| Layer | Claim | Status |
|---|---|---|
| Sensor (impedance sensing of bacteria) | Not novel — extensively published (Section 7) | Commodity |
| Architecture (AD5933 + MCU + FPGA) | Not inherently novel — AD5933+FPGA reference designs exist | Commodity-adjacent |
| Algorithm (confidence-driven stop/repeat measurement scheduling applied to impedance-AST) | Proposed as the differentiated contribution | `HYPOTHESIS` — requires prior-art confirmation |
| Workflow (closed-loop sense→process→decide→adapt for phenotypic AST specifically) | Proposed as differentiated when combined with the algorithm above | `HYPOTHESIS` |
| Product (decentralized district/rural adaptive AST reader) | Differentiated on deployment context, not sensing physics | `PLAUSIBLE` |

**Current working novelty claim (wording rules enforced):**
> "PHENORA investigates a confidence-driven closed-loop measurement layer for impedance-based phenotypic AST, in which impedance-derived feature trajectories are processed at the edge to determine whether additional measurements are necessary."

Do not say "nobody has done this" without a systematic search. Do not convert this hypothesis into an established fact in pitches or documentation.

---

## 41. Competitive Differentiation

See the table in Section 5. Summary: PHENORA does not compete on raw speed or sensitivity against iFAST or LOSC/SiNWFET — it competes on **cost, buildability, and a proposed adaptive-measurement layer** layered on top of an already-published sensing principle (bulk impedance), targeted at decentralized/resource-limited deployment.

---

## 42. Product Architecture (Startup-Level)

```
Disposable cartridge: CONTROL │ ABX-1 │ ABX-2 │ ABX-3   (V3+ — not V1)
Reader: cartridge → excitation → impedance AFE → ADC → FPGA → feature extraction
        → adaptive engine → S/I/R + confidence → phone/display
```

Revenue model (as pitched): one-time hardware sale (target ₹49,900 launch price, FPGA-based), recurring consumable/cartridge revenue (~₹299/test target), optional data/software layer. ASIC migration (~₹34,900 target) explicitly deferred to a post-validation, high-volume (>10,000 units/year) scale stage. `PLAUSIBLE` — these are **target prices, not BOM-validated costs**; do not present them as calculated economics without a completed BOM/manufacturing cost analysis.

---

## 43. V1→V5 Roadmap

| Version | Scope |
|---|---|
| **V1** | Bulk differential impedance (AD5933/discrete fallback) + Heltec + FPGA adaptive STOP/REPEAT; electrical + complex-matrix (curd) + confounder + synthetic validation only |
| **V2** | Improved electrode/interface (DIY gold PCB IDEs or commercial SPEs), possible AD5941 4-wire upgrade for drift suppression, initial supervised biological validation with QC reference strains |
| **V3** | Multi-well/multi-antibiotic cartridge (via analog mux or multiple AFEs), possible equivalent-circuit feature refinement (Rct extraction), more advanced adaptive inference (e.g., toward SPRT) |
| **V4** | Sample preparation, cartridge integration, workflow productization |
| **V5** | Laboratory validation, reference AST (broth microdilution/E-test) correlation, eMIC regression (target R²>0.9, ±one two-fold-dilution), clinical pathway exploration |

**Explicitly deferred beyond V1 (rejected for now, not rejected forever):** DEP (dielectrophoresis), microfluidic cell concentration, interdigitated electrode fabrication, pH as a primary sensing layer, optical sensing as a primary layer, machine learning/neural networks, full nonlinear equivalent-circuit fitting inside the FPGA, SPRT as the first adaptive algorithm, floating-point FPGA implementation, cloud-dependent measurement control.

---

## 44. Startup/Product Strategy

Target beachhead: district/rural health facilities and decentralized diagnostic labs (per the hackathon deck's customer analysis — 441 district public health laboratories and 60 state medical-college labs in India's existing NARS-Net, cited as an integration opportunity). `ESTABLISHED` (as stated in the team's own hackathon deck; figures as presented there, not independently re-verified in this document)

Strategic sequencing rule (repeated from the source conversation): every spending/build step should unlock the next technical decision — do not spend on V3+ hardware before V1's electronics and algorithm are proven.

---

## 45. Regulatory and Clinical Reality

No regulatory pathway work has been started. No patent has been filed (see Section 39). No clinical or biological AST validation exists yet. Any diagnostic-device regulatory pathway (e.g., in India: CDSCO medical device classification) is a **FUTURE** consideration, not applicable to the current hackathon-stage prototype. Claims in pitches must reflect TRL 3 (experimental proof of concept) status, as stated in the team's own deck.

---

## 46. What Is Proven

- The team has a simulation-validated system architecture concept (TRL 3, per the team's own hackathon deck). `ESTABLISHED`
- The AD5933 and iCE40UP5K FPGA are real, datasheet-documented, sourceable components capable in principle of the described roles. `ESTABLISHED`
- Published literature supports bulk impedance as a viable (if slower, coarser) AST signal compared to single-cell approaches. `STRONGLY_SUPPORTED`

## 47. What Is Only Hypothesized

- That PHENORA's specific bulk-impedance signal, at whatever electrode/frequency configuration the team ultimately builds, will show a usable, repeatable, biologically-meaningful ΔZ or DIR. `HYPOTHESIS`
- That the proposed adaptive STOP/REPEAT layer meaningfully reduces measurement time or improves reliability compared to a fixed-schedule measurement. `HYPOTHESIS`
- That this specific architecture combination is patentable/novel beyond what a formal prior-art search would reveal. `HYPOTHESIS`

## 48. What Must Be Experimentally Proven Next

1. AD5933 (or fallback) measures known resistive loads accurately and repeatably (Stage 1).
2. Electrodes resolve controlled electrolyte differences reliably (Stage 2).
3. The differential (control−test) architecture rejects common-mode drift better than a single-well absolute reading (Stage 3–4).
4. The FPGA FSM correctly classifies synthetic signal patterns into STOP/REPEAT/TIMEOUT without false positives (Stage 5).
5. (Future, supervised) a defined organism/antibiotic pair shows a DIR/ΔZ signature that correlates with reference broth-microdilution results.

---

## 49. Hackathon Demo Plan

Given the Round 2 requirement (video pitch, <2 minutes, showing actual current development stage), the demo should show, in order: (1) the physical control/test well + electrode setup, (2) a live or captured ΔZ/feature trace over time, (3) the confidence/stability metric climbing, (4) a STOP decision firing on screen, (5) one honest sentence on what's next (biological validation, FPGA port completion if still in progress). This mirrors Section 26's synthetic validation as the lowest-risk, most defensible demo asset if live biological or even live curd/electrolyte data proves unreliable on camera.

---

## 50. Final Decision Log

| Decision | Why |
|---|---|
| Bulk impedance selected over optical | Optical sensing risked being perceived as "a worse Antibiogo" (camera + inhibition-zone reading is already occupied territory); impedance offers a "sense before/without visible growth" narrative and stronger deep-tech positioning for the hackathon's stated deep-tech emphasis |
| Optical not selected as V1 primary | Learned during ideation that optical growth sensing, while easy, is not sufficiently differentiated as a startup narrative |
| AD5933 selected as primary front-end | Cheapest widely-referenced impedance-converter IC with on-chip DFT and I2C interface; strong published precedent (Section 7, 39) |
| AD5941 documented but not selected for V1 | Better electrical fit (4-wire, lower frequency floor) but higher cost/sourcing complexity than the hackathon timeline allows; explicitly flagged as V2 |
| FPGA included in the architecture | Provides deterministic, parallel, low-latency, cloud-independent processing — matches the hackathon's stated "why hardware acceleration" rationale; the team's core differentiation claim depends on demonstrating this layer meaningfully, not just having it |
| Heltec/MCU handles AD5933 arithmetic, not the FPGA | Keeps the FPGA focused on the differentiated adaptive-decision logic rather than re-implementing what the AD5933 and a simple MCU already do well |
| DEP explicitly deferred | Would introduce field-geometry physics, high-voltage switching, cell-viability-under-field, and fabrication risk simultaneously — turning one risky project into several; not appropriate for a hackathon timeline |
| Biological AST not claimed for V1 | No approved bacterial culture/testing pipeline available on the hackathon timeline; fabricating a home bacterial experiment would be both scientifically indefensible and potentially unsafe |
| Controlled electrical + curd validation used instead | Provides a genuine, honest, repeatable validation ladder (resistors → electrolyte → complex matrix → confounder → synthetic FSM) without overclaiming biological relevance |
| Cloud made optional, not core | Keeps the core measurement/decision loop functional offline, consistent with the target rural/district deployment context |
| STOP/REPEAT framed as the current computational-novelty hypothesis | This is the one layer of the system that is not already commodity/published (Section 40) — it is therefore the most important thing to actually validate and defend, not the sensor itself |

---

## 51. References

1. Karmakar, S. et al. (2025). *Rapid antimicrobial susceptibility testing using carbon screen printed electrodes in a microfluidic device.* Scientific Reports. DOI: 10.1038/s41598-024-84286-3.
2. Spencer, D. et al. (2020). Single-cell impedance-based antimicrobial susceptibility testing (iFAST). *Nature Communications.*
3. (2025). Rapid impedance-based Antimicrobial Susceptibility Testing (iFAST) of Enterobacterales in urinary tract infections. *Journal of Infection.*
4. Swami, K. et al. (2022). Low-conductivity zwitterionic growth buffer for rapid impedance-based AST. *Biosensors and Bioelectronics*, 200:113876.
5. Spencer, D., Li, H., Zhu, J., Sutton, S., Morgan, H. (2023). Electrical Broth Micro-Dilution for Rapid Antibiotic Resistance Testing. *ACS Sensors*, 8(3):1101–1108.
6. Analog Devices. *AD5933 1 MSPS, 12-Bit Impedance Converter, Network Analyzer Datasheet.*
7. Analog Devices. *UG-364: Evaluating the AD5933.*
8. Analog Devices. *AD5940/AD5941 product documentation* (bare IC / EVAL-AD5941 / EVAL-AD5940BIOZ, DigiKey pricing accessed Aug 2026).
9. Analog Devices Wiki — *AD5933 Pmod Xilinx FPGA Reference Design.*
10. Heltec Automation — *WiFi LoRa 32 V3 official documentation/pin map.*
11. VLSI System Design (VSD) — *VSDSquadron FPGA Mini (FM) User Guide, DS-VSQF-REV1.*
12. Hannah, S. et al. (Strathclyde, 2019/2020) — screen-printed gold electrode AST with antibiotic-seeded hydrogel; commercialized as Microplate Dx.
13. Uploaded 2026 paper — SiNWFET lab-on-silicon-chip (LOSC) metabolic pH sensing for sub-20-minute AST (Uppsala group), used as a north-star benchmark, not a reproduced architecture.
14. Team hackathon deck — *PHENORA / RAPID-AST EDGE, Innovest DeepSprint Hackathon 2026, Chennai Institute of Technology* (problem statement, solution architecture, IP/novelty statement, business model, TRL status as self-reported by the team).
15. "Low-Cost Differential Impedance AST Prototype: Complete Buildable Design and Validation Protocol" (uploaded project research document, Aug 2026) — AD5941/AD5933 component pricing and buildable-design comparison against the LOSC paper.

*Note: several component prices in this document (USD, DigiKey, Aug 2026; INR, various Indian suppliers, Aug 2026) are time-sensitive and should be re-verified before any purchasing or budgeting decision beyond the immediate hackathon window.*
