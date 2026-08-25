# PHENORA V1 — Component Checklist & Build BOM
**Confidence-Driven Adaptive Impedance AST — Hackathon Prototype**
Deadline: Video pitch submission 27 Aug 2026, 2:00 PM

---

## 0. What you already own (do not buy again)

- [x] **VSDSquadron FPGA Mini (FM)** — Lattice ICE40UP5K, 32 GPIO, onboard FTDI programmer
- [x] **ESP8266** dev board (NodeMCU/Wemos-style)

**Important correction for ESP8266 (vs the earlier ESP32 assumption):**
- ESP8266 has **only one analog input (A0)**, range typically 0–1V or 0–3.2V depending on board, and it is noisy/low-resolution. **Do not rely on ESP8266's onboard ADC for your impedance signal.**
- ESP8266 **does** have I2C (usually D1=SCL, D2=SDA) — this is enough to talk to both the AD5933 and the ADS1115. So ESP8266 is fine as your controller in **both** versions below, as long as the actual measurement goes through an external I2C sensor/ADC, not the ESP8266's own analog pin.
- FPGA Mini talks to ESP8266 over UART or SPI/GPIO — plan for **3.3V logic on both sides** (ICE40UP5K I/O is 3.3V-capable, ESP8266 is 3.3V — safe, no level shifting needed as long as you don't feed 5V into either).

---

## 1. Decision rule (pick ONE version tonight, do not switch later)

```
Go to Ritchie Street / local supplier TODAY and ask specifically for:
  "AD5933 impedance converter network analyzer module"

FOUND, working, ≤ ₹3,500  →  BUILD VERSION A (AD5933)
NOT FOUND / too expensive / seller can't demo it  →  BUILD VERSION B (555 + Op-Amp + ADS1115)

Whichever you pick — commit. No mid-build switching.
```

---

## VERSION A — AD5933 Impedance Front-End

### A.1 Components to buy

| # | Item | Qty | Purpose | Fallback if unavailable |
|---|------|-----|---------|--------------------------|
| 1 | AD5933 impedance converter module | 1 | Excitation + ADC + on-chip DFT → gives real/imaginary Z directly over I2C | → Switch to **Version B** entirely |
| 2 | Calibration resistors: 1kΩ, 10kΩ, 100kΩ (1% tolerance if possible) | 1 each | Calibrate |Z| vs known load before any liquid test | Any resistor pack; 5% tolerance acceptable if 1% unavailable |
| 3 | Electrode pair (control) | 1 pair | Control well electrical contact | Stainless steel pins / bare copper wire / pencil graphite leads |
| 4 | Electrode pair (test) | 1 pair | Test well electrical contact | Same as above |
| 5 | Small transparent sample containers/cuvettes | 2 | Control + test wells | Small glass vials, cut medicine bottles, 3D-printed wells |
| 6 | Breadboard | 1 | Prototyping | — |
| 7 | Jumper wires (M-M, M-F) | 1 set | Wiring | — |
| 8 | Misc: electrical tape, hot glue, small clips | — | Mechanical stability — **prevents assembly failure** | — |

### A.2 Signal path

```
CONTROL well electrodes ──┐
                           ├──> AD5933 (I2C) ──> ESP8266 ──> FPGA Mini (UART/GPIO)
TEST well electrodes ──────┘
```

### A.3 Cost (INR)

| Item | Est. cost |
|---|---|
| AD5933 module (local, if found) | ₹2,000–3,500 |
| Calibration resistors | ₹30–50 |
| Electrodes (2 pairs) | ₹100–200 |
| Containers (2) | ₹40–80 |
| Breadboard | ₹60–80 |
| Jumper wires | ₹60–80 |
| Misc (tape/glue/clips) | ₹100 |
| **Total** | **≈ ₹2,400–4,100** |

**Hard rule:** if the local AD5933 module quote is above ₹3,500, or the seller can't demonstrate it powers up and responds over I2C, walk away and build Version B instead. Do not gamble the submission on an untested imported part.

---

## VERSION B — Discrete AC Impedance Front-End (555 + Op-Amp + ADS1115)

This is the **safer, faster-to-source path** given a same-day deadline. Everything here is standard stock at any electronics shop.

### B.1 Components to buy

| # | Item | Qty | Purpose | Fallback if unavailable |
|---|------|-----|---------|--------------------------|
| 1 | NE555 / LM555 timer IC | 2 | AC excitation source (astable oscillator, ~1–10 kHz) for control + test channel | ICM7555 (CMOS version) — same pinout |
| 2 | LM358 dual op-amp | 2 | Signal conditioning / buffering / simple rectification of the AC response | TL072, LM324, or any general-purpose op-amp in stock |
| 3 | **ADS1115** 16-bit I2C ADC module | 1 | Digitizes the conditioned control/test signals for ESP8266 | ADS1015 (12-bit, faster, lower resolution — acceptable fallback) |
| 4 | Resistors: mix of 1kΩ, 10kΩ, 100kΩ, 220Ω | 1 assortment pack | Timing resistors for 555, gain-setting resistors for op-amp, current-limiting | Any generic resistor kit |
| 5 | Capacitors: 0.01µF, 0.1µF, 1µF, 10µF (ceramic + electrolytic mix) | 1 assortment pack | Timing caps for 555, filtering/coupling caps for op-amp stage | Any generic capacitor kit |
| 6 | Diodes (1N4148) | 2–4 | Simple rectification of AC signal to DC-ish envelope before ADC | 1N4001 (slower, still usable at these low frequencies) |
| 7 | Electrode pair (control) | 1 pair | Control well contact | Stainless steel pins / copper wire / pencil graphite |
| 8 | Electrode pair (test) | 1 pair | Test well contact | Same as above |
| 9 | Small transparent sample containers | 2 | Control + test wells | Glass vials / cut bottles |
| 10 | Breadboard(s) | 1–2 | Prototyping (recommend 2: one per channel, keeps wiring untangled) | — |
| 11 | Jumper wires (M-M, M-F) | 1–2 sets | Wiring | — |
| 12 | Misc: tape, hot glue, small clips, spare wire | — | Mechanical stability | — |

### B.2 Signal path

```
ESP8266 (I2C) ──> ADS1115 ──> [CH0: control signal] [CH1: test signal]
                                     ▲                      ▲
                              LM358 buffer/rect     LM358 buffer/rect
                                     ▲                      ▲
                              CONTROL electrodes      TEST electrodes
                                     ▲                      ▲
                              NE555 AC excitation #1  NE555 AC excitation #2
                                     (or one 555 driving both, split via resistor divider)

ESP8266 ──(UART/GPIO)──> FPGA Mini (feature extraction + adaptive decision)
```

**Simplification tip:** you can drive both control and test electrodes from **one shared 555 oscillator** (just split the output with a resistor to each electrode pair) instead of two separate 555s — halves your wiring and removes one variable (frequency mismatch between channels). Recommended for speed. Keep the second 555 as a physical spare only.

### B.3 Cost (INR)

| Item | Qty | Est. cost |
|---|---|---|
| NE555 ×2 | 2 | ₹15–30 |
| LM358 ×2 | 2 | ₹30–60 |
| ADS1115 module | 1 | ₹140–250 |
| Resistor assortment | 1 | ₹50–100 |
| Capacitor assortment | 1 | ₹50–100 |
| Diodes (1N4148 ×4) | 4 | ₹10–20 |
| Electrodes (2 pairs) | 2 | ₹100–200 |
| Containers (2) | 2 | ₹40–80 |
| Breadboard(s) | 1–2 | ₹60–150 |
| Jumper wires | 1–2 sets | ₹60–150 |
| Misc (tape/glue/clips) | — | ₹100 |
| **Total** | | **≈ ₹1,100–1,600** |

---

## 2. Full checklist (either version) — check off as you go

### Sourcing (today, Aug 25)
- [ ] Call/visit Ritchie Street or nearest electronics shop before traveling — confirm AD5933 stock by phone first
- [ ] If AD5933 not confirmed in stock by evening → commit to Version B, stop searching
- [ ] Buy all components for the chosen version in one trip (avoid a second trip tomorrow)
- [ ] Buy **one spare** of each small/fragile part (extra 555, extra electrode pair, extra jumper wires) — cheap insurance against a dead component the night before submission

### Assembly (Aug 26)
- [ ] Breadboard wiring done for one channel first — get **one** signal working before duplicating to two channels
- [ ] Calibrate: known resistor loads (1k/10k/100k) → confirm your signal chain gives a distinguishable, repeatable reading for each
- [ ] Wire second channel (test), confirm it independently reads correctly before combining
- [ ] Connect ESP8266 → verify I2C communication (scan for ADS1115/AD5933 address, confirm non-garbage reads)
- [ ] Log raw signal to laptop over serial — get a live number/graph before touching the FPGA
- [ ] Two-well differential test: fill control with saline, test with a different-conductivity liquid (e.g., salt water vs plain water) → confirm ΔZ (or Δvoltage) is visible and repeatable
- [ ] Implement ΔZ, slope, noise/variance, confidence score in Python/serial first
- [ ] Port working feature-extraction logic to FPGA Mini (Yosys/nextpnr toolchain, as in the datasheet's blink_led workflow) — only after the Python version is proven
- [ ] Full dry run of the exact demo sequence you'll film tomorrow

### Pre-submission (Aug 27 morning)
- [ ] Record video — multiple takes, more footage than needed
- [ ] Confirm exported video is under 100MB and under 2:00 minutes
- [ ] Submit via Google Form **before 12:00 PM** (2-hour buffer before the 2:00 PM deadline)

---

## 3. Hard "do not buy" list (for both versions)

- ❌ pH sensors / pH probes
- ❌ LEDs / photodiodes as a primary sensor
- ❌ Microfluidic chips or custom cartridges
- ❌ A second FPGA board (use the one you have)
- ❌ Any imported part with >3-day shipping
- ❌ Multi-channel cartridge hardware (V3+ scope, not now)

---

## 4. One-line fallback logic if something breaks tonight

```
AD5933 dead/unavailable      → Version B (555+opamp+ADS1115)
ADS1115 dead                  → ADS1015, or (last resort) ESP8266 A0 pin — expect noisy data, still demoable
555 not oscillating           → check timing resistor/cap values, swap for spare 555 first before re-wiring
No clean ΔZ separation        → change test liquid conductivity (add more/less salt) rather than redesigning circuit
FPGA port not done in time    → demo the Python/ESP8266 feature-extraction pipeline live; state "FPGA port in progress" honestly in the video — this is acceptable per the Round 2 brief ("irrespective of current development stage")
```
