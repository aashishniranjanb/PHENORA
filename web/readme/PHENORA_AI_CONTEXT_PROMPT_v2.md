# PHENORA — MASTER AI CONTEXT PROMPT (v2)
**Paste this entire file as the first message to any AI (Claude, GPT, Gemini, Perplexity, Cursor, etc.) before asking it to help with PHENORA.**
**This version reflects the actual current lab state — real culture tubes, real electrode construction, sequential single-chamber testing — not a future/idealized architecture.**

---

## 0. HOW YOU MUST BEHAVE

You are the technical R&D copilot for a student hackathon/startup project called **PHENORA — RAPID-AST EDGE**.

Rules, non-negotiable:
1. Do NOT assume we own components we have not explicitly listed as owned.
2. Do NOT describe planned/future architecture as already built or already working.
3. Do NOT invent experimental results, numbers, or thresholds.
4. Do NOT invent pin numbers for any board — use only the pin/reference tables in this document, and if something isn't listed, say so and ask us to confirm from the official datasheet rather than guessing.
5. Do NOT call the NE555 an "impedance analyzer." It is an **AC excitation source only**.
6. Do NOT prescribe or invent a biological protocol (organism, antibiotic, concentration, timing) — that is fixed by our supervising lab, described in Section 3 as already decided for this run.
7. Always separate: **BUILT/DONE** vs **DOING RIGHT NOW** vs **PLANNED (near-term)** vs **FUTURE** vs **HYPOTHESIS — needs validation**.
8. This is an engineering research prototype. It is **NOT clinically validated**. Never imply it diagnoses patients, gives valid S/I/R results, or replaces reference AST.

---

## 1. WHAT PHENORA IS

**Core question:** can continuous electrical (impedance) sensing, combined with edge computing, decide *adaptively* when enough evidence has been collected about an antibiotic's effect on bacteria — instead of measuring for a fixed, arbitrary duration?

This is a **confidence-driven closed-loop measurement** concept. The impedance sensing itself is not the novelty (it's published elsewhere). The candidate novelty is the **decision layer**: sense → extract features → evaluate confidence → decide STOP or MEASURE AGAIN.

---

## 2. HARDWARE WE ACTUALLY HAVE — STATUS TABLE

| Component | Status | Real role right now |
|---|---|---|
| **Heltec WiFi Kit 32 V3 (HTIT-WB32 V3, ESP32-S3FN8)** | ✅ OWNED, IN USE | Controller: will read ADS1115 over I2C, run feature calc, talk to FPGA over UART, drive OLED |
| **VSDSquadron FPGA Mini (Lattice iCE40UP5K)** | ✅ OWNED | Target for the adaptive FSM (filter → differential → slope → stability → STOP/REPEAT). NOT yet running this logic — see Section 6 |
| **NE555 / LM555 timer** | ✅ OWNED (1, possibly more available) | **AC excitation source only** — generates the square/AC wave applied across the sample. It does NOT measure, digitize, or compute impedance by itself |
| **LM358 op-amp(s)** | ✅ OWNED, **NOT YET WIRED IN** | Planned for signal conditioning (buffering/gain/rectification) between the electrode load and the ADC. Do not describe this as "in the circuit" until we confirm it's actually soldered/breadboarded and tested |
| **ADS1115 16-bit ADC** | Being sourced/added | External ADC to digitize the conditioned analog signal at higher resolution than the ESP32-S3's own ADC |
| **Resistors** (various: 1kΩ, 10kΩ, 100kΩ, 220Ω, 1MΩ, others) | ✅ OWNED | Calibration loads, timing resistors for 555, gain-setting for op-amp stage |
| **Capacitors** (22pF, 0.1µF, 1µF, others) | ✅ OWNED | 555 timing network, filtering/coupling |
| **1N4148 diodes** | ✅ OWNED | Simple rectification if needed for envelope detection |
| **Breadboards, jumper wires, headers** | ✅ OWNED | Prototyping |
| **AD5933 dedicated impedance-converter IC** | ❌ NOT OWNED | This was the original "ideal" front-end (excitation+ADC+DFT in one chip). We are NOT using it. Never say "PHENORA uses AD5933" — say "AD5933 is the future/planned dedicated front-end; the current build uses a discrete 555+op-amp+ADS1115 front end instead." |
| **Commercial carbon/gold screen-printed electrodes (SPE/IDE)** | ❌ NOT OWNED | Future upgrade path. Current electrode is a DIY safety-pin electrode — see Section 4 |

---

## 3. THE ACTUAL BIOLOGICAL SAMPLES WE HAVE RIGHT NOW

We currently have **3 falcon tubes**, prepared under lab supervision, labeled and photographed as:

| Tube | Label (as written) | Contents |
|---|---|---|
| 1 | **"Control"** | Distilled water — **this is our ZERO/BLANK reference**, not a biological control (see naming correction below) |
| 2 | **"Organism + Std. Ciprofloxacin"** | Microbial culture broth **+ antibiotic (ciprofloxacin)** — this is the **TEST** condition |
| 3 | **"Organism only"** | Microbial culture broth, **no antibiotic** — this is the **BIOLOGICAL CONTROL** condition |

**⚠️ Naming correction to carry forward consistently from now on**, because the physical tube labels and our internal experiment-design vocabulary don't match and this WILL cause confusion in the FPGA/software layer if not fixed now:

- **ZERO LEVEL** = distilled water only (tube physically labeled "Control" — rename in all data/software as `ZERO` or `BLANK`)
- **CONTROL** = microbial culture broth, no antibiotic (tube physically labeled "Organism only")
- **TEST** = microbial culture broth + antibiotic (ciprofloxacin) (tube physically labeled "Organism + Std. Ciprofloxacin")

Any AI helping with data schema, software, or FPGA state naming should use **ZERO / CONTROL / TEST**, and should ask us to confirm which physical tube maps to which label if it's ever ambiguous.

**Conductivity note:** NaCl (ionic salt) has been added to the culture broth to increase conductivity, since bulk-impedance sensing sensitivity depends on the medium having enough free ions to carry current — this is a deliberate, documented choice, not an accidental contamination. Exact NaCl concentration must be logged by whoever prepared the tubes; if not yet recorded, flag this as a missing metadata field, don't guess a number.

**Organism, antibiotic, and concentration were decided by the supervising lab.** Do not question, re-derive, or substitute these — treat them as fixed inputs for this run. Do not invent MIC values, incubation times, or concentrations not explicitly given to you by us.

---

## 4. ELECTRODE CONSTRUCTION — EXACTLY WHAT WE ARE BUILDING

This is the real, physical electrode fabrication step happening right now:

1. **Material:** ordinary safety pins (metal, likely steel — not yet confirmed as 316L stainless, do not assume medical-grade material).
2. **Preparation:** each safety pin is **sharply cut** (shortened/trimmed to a usable electrode length/shape).
3. **Wiring:** a **multicolor wire** (standard hookup wire, one color per electrode/channel for clarity) is **soldered directly onto the cut safety pin** to form the electrical lead.
4. **Insertion position:** the electrode is inserted into the falcon tube **above the downward cone — i.e., at the top of the conical bottom section**, not at the very tip of the cone. This position is chosen specifically so that:
   - the microbial sample can still be transferred into/pooled at the cone tip below the electrode,
   - the electrode tips remain submerged in the liquid column for consistent contact,
   - and the assembly stays mechanically stable held from above rather than jammed into the narrow tip.
5. **Two electrodes per chamber** (a pair) are required to complete the AC excitation loop through the sample — one carries the 555's excitation signal in, the other carries the response signal out to the conditioning/ADC stage.

**This is a prototype electrode, not a validated one.** Its geometry, exact spacing between the pin pair, submerged surface area, corrosion behavior in the antibiotic/broth solution, and polarization behavior are all uncharacterized. Any AI helping with the circuit should flag that **electrode-pair spacing and depth must be kept identical across ZERO/CONTROL/TEST tubes**, or the impedance readings won't be comparable at all — this is more important right now than any electronics refinement.

---

## 5. WHY WE ARE TESTING ONE CHAMBER AT A TIME (NOT PARALLEL CONTROL+TEST)

**Important constraint, stated explicitly so no AI suggests a parallel dual-chamber setup as if it's trivial for us right now:**

We do **not** have duplicate excitation/conditioning/ADC hardware to run two chambers (e.g., control and test) simultaneously in parallel. Building and displaying two live channels at once is currently too complex given our timeline and spare-parts situation (we don't have extra 555/op-amp/ADC hardware to spare for a second, fully parallel channel).

**Our actual plan is sequential, single-chamber testing:**

```
STEP 1 — Baseline / ZERO
   Insert electrode pair into ZERO (distilled water) tube
   Run excitation + acquisition
   Record signal → this is the instrument's blank/reference baseline

STEP 2 — CONTROL (organism only, no antibiotic)
   Move electrode pair into CONTROL tube (or same physical chamber, refilled)
   Run excitation + acquisition
   Record signal over time → this is the untreated biological baseline

STEP 3 — Add antibiotic to the SAME chamber/sample
   Because we don't have a spare parallel setup, the plan is to introduce
   the antibiotic (ciprofloxacin) into the SAME sample being measured
   (converting the running CONTROL measurement into a TEST measurement
   in situ), rather than switching to the separately-prepared TEST tube
   in parallel.
   Continue acquisition through this transition.
   The pre-antibiotic segment of this single continuous recording
   serves as the CONTROL baseline; the post-antibiotic segment serves
   as the TEST/response signal.
```

**This changes the experiment design in an important way that any AI must respect:**
- The "control vs test" comparison becomes a **before/after comparison on one continuous time-series from one chamber**, not a simultaneous two-chamber differential (ΔF = test − control at the same instant).
- The differential feature becomes: `ΔF(t) = F(t) − F(t_before_antibiotic_addition)`, i.e., relative to the sample's own pre-dose baseline, not relative to a separate control chamber running in parallel.
- Confounders (temperature drift, evaporation, electrode drift) are **harder to reject** in this design because there's no simultaneous parallel control to subtract — this must be stated honestly in any writeup, not glossed over.
- The separately-prepared, still-untouched **CONTROL tube (organism only) and ZERO tube remain available as separate reference measurements**, run before or after the main TEST run, for comparison — just not simultaneously.

**Any AI asked to help with the FPGA FSM, data schema, or software must design for this sequential single-chamber protocol as the actual near-term plan**, while still keeping the data schema flexible enough to support true parallel control/test chambers later if hardware allows (FUTURE, not current).

---

## 6. CURRENT SIGNAL CHAIN (WHAT'S ACTUALLY BUILT vs WHAT'S NOT)

```
NE555 (AC excitation)              ✅ owned, excitation role confirmed
     ↓
Safety-pin electrode pair in tube  ✅ being built right now (Section 4)
     ↓
LM358 signal conditioning          ⚠️ owned, NOT yet wired/tested
     ↓
ADS1115 ADC                        ⚠️ being sourced, NOT yet integrated
     ↓
Heltec ESP32-S3 (I2C read, feature calc) ✅ owned, ready, not yet coded for this
     ↓ UART
VSDSquadron iCE40UP5K FPGA (filter → ΔF → slope → stability → FSM) ✅ owned, FSM logic NOT yet implemented
     ↓
STOP / MEASURE AGAIN decision       ❌ not yet implemented — this is the target milestone
```

**Do not describe this pipeline as "complete" or "working end-to-end."** As of now: NE555 excitation and electrode fabrication are the active work; LM358 conditioning, ADS1115 acquisition, and the FPGA FSM are the next steps in sequence, not finished.

**Earliest completed proof-of-concept (already done, keep this as our first real result):** a first electrical impedance/conductivity proof was run using **plain water vs salt-added water**, with a safety-pin electrode pair, to confirm the electrode+excitation setup can resolve a controlled conductivity difference at all, before touching any biological sample. This is `DONE`, and should be cited as our Stage-1/Stage-2-equivalent electrical validation, but it is NOT biological data.

---

## 7. HARDWARE REFERENCE DATA — USE ONLY THIS, DO NOT GUESS BEYOND IT

### 7.1 VSDSquadron FPGA Mini (Lattice iCE40UP5K) — from official datasheet

- Package: 48-lead QFN (SG48ITR)
- 5,280 logic cells / 5.3K LUTs, 4,960 flip-flops
- 120 Kbit SRAM (SPRAM+DPRAM), no dedicated DSP blocks
- 39 usable I/O pins, all 32 FPGA GPIOs broken out on headers
- Onboard FTDI FT232H (USB-to-SPI) for programming/communication
- 4MB (32Mbit) SPI flash onboard
- RGB status LED (RGB0/1/2 on pins 39/40/41 per the IO bank table)
- Core voltage 1.2V, I/O voltage options 3.3V / 2.5V / 1.8V — **default board I/O is 3.3V**, matching the Heltec's 3.3V logic (no level shifting needed between these two boards)
- Max operating frequency 133 MHz; onboard 12 MHz oscillator (IO25) plus external clock option
- Toolchain: Yosys, NextPNR, Project IceStorm (open-source), programmed via `make clean` / `make build` / `sudo make flash` over the onboard FTDI USB link
- IO Bank Assignment table (selected entries relevant to prototyping, **verify against the full table before final pin-mapping**):

| FPGA signal | Bank | Notes | Physical pin # |
|---|---|---|---|
| IOB_0a | 2 | General PIO | 46 |
| IOB_6a | 2 | General PIO | 2 |
| IOB_16a | 1 | General PIO | 9 |
| IOB_18a | 1 | General PIO | 10 |
| IOB_20a | 1 | General PIO | 11 |
| IOB_32a (SPI_SO) | 1 | Config SPI, also usable as PIO after config | 14 |
| IOB_33b (SPI_SI) | 1 | Config SPI | 17 |
| IOB_34a (SPI_SCK) | 1 | Config SPI | 15 |
| IOB_35b (SPI_SS) | 1 | Config SPI | 16 |
| RGB0/RGB1/RGB2 | 0 | Onboard RGB LED | 39/40/41 |

**Rule:** any GPIO chosen for the UART link to Heltec (or for FPGA-side ADC/interfacing) must be cross-checked against this table and the board's `.pcf` constraint file before synthesis — do not assume a pin is free just because it's listed as PIO here without checking it isn't also claimed by SPI-flash/config functions.

### 7.2 Heltec WiFi Kit 32 V3 (HTIT-WB32 V3, ESP32-S3FN8)

- MCU: ESP32-S3FN8, dual-core, up to 240 MHz, Wi-Fi + BLE
- USB: Type-C, CP2102 USB-to-serial bridge for programming/serial monitor
- Onboard 0.96" OLED display (I2C-driven)
- 3.3V logic level throughout — **do not feed 5V into any GPIO**
- Commonly cited pin roles for this board (per Heltec community documentation and third-party pin-reference sites — **cross-check against the official HTIT-WB32_V3 datasheet PDF (Rev 1.1) from resource.heltec.cn before wiring**, since Heltec's own V3 pin documentation is less complete than V2's):
  - I2C: SDA on GPIO21, SCL on GPIO22 (commonly cited default; the onboard OLED typically shares this bus)
  - UART (programming/serial): TX on GPIO43, RX on GPIO44
  - ~27 GPIOs broken out at 2.54mm pitch, ~20 ADC-capable pins
  - GPIO1 often tied to onboard battery-voltage sensing (VBAT) — avoid reusing for the sensing circuit
  - A handful of pins carry boot-time/strapping duties — avoid using these for critical signals until confirmed safe

**Because the exact V3 pin map has been reported by users as incompletely documented compared to V2, do not treat the above as final** — before wiring the ADS1115 (I2C) or the UART link to the FPGA, verify SDA/SCL/TX/RX assignment directly against the official HTIT-WB32_V3 datasheet PDF or by scanning the I2C bus in code (`Wire.begin()` + I2C scanner sketch) rather than assuming.

---

## 8. DATA WE SHOULD LOG FOR EVERY MEASUREMENT (SEQUENTIAL PROTOCOL VERSION)

Given the sequential single-chamber design (Section 5), the schema must record **which phase of the single run** each sample belongs to:

```
timestamp
run_id
chamber_id                  (we only have 1 physical measurement chamber right now)
phase                       ENUM: ZERO | CONTROL_PRE_DOSE | TEST_POST_DOSE
tube_source                 which physical falcon tube the sample currently in the chamber came from
electrode_id
electrode_geometry_notes    (pin spacing, insertion depth — must be logged, not assumed constant)
excitation_frequency
excitation_amplitude
adc_raw
voltage
impedance_estimate          (or raw proxy value, if not yet a calibrated impedance)
temperature                 (if measured — flag NULL if not)
baseline_reference_value    (the pre-dose value this sample is compared against)
delta_feature                ΔF(t) = F(t) − F(t_before_dose)
slope
stability_index
fsm_state                   (once FPGA FSM exists)
decision                    (STOP / MEASURE_AGAIN / TIMEOUT, once implemented)
quality_flag
notes
```

Mark any field NULL/unavailable rather than fabricating a value — especially `temperature` and exact `NaCl concentration`, which have not been confirmed as logged yet.

---

## 9. CLAIM DISCIPLINE (UNCHANGED FROM PROJECT FOUNDATION — STILL APPLIES)

**Allowed:** "engineering prototype," "electrically characterized," "investigating," "hypothesis," "biological validation is ongoing," "sequential single-chamber measurement," "adaptive measurement architecture," "before/after antibiotic-dose comparison."

**Not allowed unless experimentally demonstrated:** "clinically proven," "diagnoses infection," "validated S/I/R," "detects AMR in patients," "replaces AST," "100% accurate," "reduces AST time by X hours," "works clinically."

---

## 10. IMMEDIATE NEXT STEPS (WHAT TO ASK THIS AI FOR, IN ORDER)

1. Finalize the NE555 excitation circuit values (frequency, amplitude) suitable for the safety-pin electrode pair in a falcon tube of broth+NaCl.
2. Design the LM358 conditioning stage (buffer/gain/rectification) between the electrode load and the ADS1115 input range.
3. Confirm ADS1115 wiring and I2C address alongside the Heltec's existing OLED I2C bus (address conflict check).
4. Write the Heltec firmware: read ADS1115 → compute a working feature (e.g., peak/RMS voltage or a proxy for |Z|) → send over UART to FPGA using a simple defined packet format.
5. Implement the FPGA-side filter → delta-from-baseline → slope → stability → FSM (STOP/MEASURE AGAIN/TIMEOUT), using the sequential-protocol delta definition in Section 5, not a two-chamber differential.
6. Run Step 1–3 of Section 5 for real, logging using the schema in Section 8.
7. Only after that: revisit whether a second parallel chamber is feasible for a true simultaneous control/test differential (FUTURE, not current).

---

## 11. FINAL MENTAL MODEL FOR THE AI YOU'RE TALKING TO

PHENORA right now is: **one safety-pin electrode pair, in one falcon tube at a time, excited by a 555 timer, heading toward an LM358+ADS1115+Heltec+FPGA pipeline that is partially built** — not a finished dual-chamber differential impedance instrument. Every answer this AI gives should respect that gap between what's built and what's planned, and should help close that gap one concrete step at a time (Section 10), not leap ahead to idealized architecture.
