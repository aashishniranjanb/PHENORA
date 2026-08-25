Low-Cost Differential
Impedance AST Prototype:
Complete Buildable Design
and Validation Protocol
```
TL;DR
```
A practical, benchtop differential-
impedance AST prototype can be built for
```
roughly $350–$700 (turnkey eval boards)
```
```
or $150–$300 (bare-IC custom build)
```
using an Analog Devices AD5941-based
```
impedance analog front end (bare
```
AD5941BCPZ IC ~$14, EVAL-AD5941
daughterboard ~$205, or EVAL-
```
AD5940BIOZ shield ~$439), or an AD5933
```
```
board (EVAL-AD5933EBZ ~$68 at DigiKey),
```
plus commercial screen-printed
interdigitated gold electrodes
```
(DropSens/Metrohm G-IDEAU10, quote-
```
```
only) or DIY ENIG-gold PCB electrodes, a
```
microcontroller, a ~$30–$100 thermostatic
heater, and disposable low-volume wells —
one to three orders of magnitude cheaper
and far simpler than the SiNWFET lab-on-
```
silicon-chip (LOSC) in the uploaded paper,
```
which requires cleanroom EBL/RIE, ALD
HfO2, and an HP4155A semiconductor
parameter analyzer.
The paper's two acceleration strategies
translate to impedance sensing with one
critical inversion: low-ionic-strength media
accelerates detection even more for
impedance than for pH because impedance
sensitivity scales inversely with baseline
medium conductivity — but the paper's
```
0.9% NaCl (high conductivity) is the wrong
```
```
choice for impedance; use a HEPES-based
```
low-conductivity zwitterionic growth buffer
or diluted broth instead. Published work
```
(Swami et al. 2022;
```
```
Karmakar/Gopalakrishnan et al. 2025)
```
shows low-conductivity media enables 20–
80 min impedance AST. Volumetric cell
```
concentration also helps but adds cost;
```
skip picoliter microfluidics for v1.
Set the susceptibility call using a
biological-replicate statistical threshold
directly analogous to the paper's ΔVth > 20
```
mV (= max SEM) rule: define the noise floor
```
as mean + 3×SD of the sterility control's
impedance fluctuation, compute the
```
Differential Impedance Ratio DIR(t) =
```
```
ΔZ_antibiotic/ΔZ_growth-control (≈1 =
```
```
resistant, ≈0 = susceptible), and extract an
```
electrical-MIC where normalized
conductivity change falls below threshold
— validated against E-test/broth
microdilution MICs.
Key Findings
1. Hardware: The AD5933 (1 kHz–100 kHz
sweep, 12-bit, DFT-based, EVAL-
```
AD5933EBZ ~$68 at DigiKey) and the
```
```
newer AD5941/AD5940 (~0.015 Hz–200
```
kHz, 16-bit, 4-wire, integrated
```
potentiostat/TIA) are the two dominant
```
low-cost bioimpedance front ends. The
AD5941 is the better fit for bacterial growth
impedance because it reaches the low
frequencies where medium-conductivity
change dominates, offers 4-wire
measurement to suppress electrode
polarization drift over hours-long runs, and
has higher resolution. The AD5933's native
1 kHz floor can be extended down to ~10
Hz with external analog front-end circuitry,
as multiple published groups have done.
2. Electrodes: Commercial screen-printed
```
interdigitated gold electrodes (Metrohm
```
```
DropSens G-IDEAU10, 10 μm lines/gaps; or
```
```
G-IDEAU5, 5 μm, 250 finger pairs on glass)
```
```
are the fastest path; DIY PCB ENIG-gold
```
```
interdigitated electrodes (~150–200 μm
```
```
features) and gold-leaf/laser-ablated
```
electrodes are viable ultra-low-cost
alternatives. Sensitivity is dominated by
finger gap: smaller gaps concentrate the
field near the surface and raise sensitivity,
but a substantial fraction of the field must
sample the bulk medium to detect
metabolic conductivity changes, so ~5–10
μm gaps are a good compromise for bulk-
conductivity sensing.
3. Acceleration strategy translation:
```
Impedance magnitude ∝ 1/(medium
```
```
conductivity), so a low-conductivity
```
medium raises both baseline impedance
and the fractional change per unit of
metabolic ion production — a direct win.
The tradeoff versus pH sensing: 0.9% NaCl
```
(~150 mM) is ideal for unbuffered pH
```
dynamic range but is high-conductivity for
```
impedance and swamps the signal; a
```
zwitterionic HEPES buffer or diluted broth
```
(1–10%) gives much higher impedance
```
dynamic range while still supporting 1–2
doubling cycles.
4. Threshold methodology: Classic
```
impedance microbiology (Bactometer,
```
```
RABIT, Malthus, BacTrac) defines "detection
```
time" as the point where the
impedance/conductance curve deviates
```
from baseline by a set threshold (BacTrac
```
```
uses 5%). Modern impedance AST papers
```
use normalized metrics: Spencer et al.
```
2023 (ACS Sensors) define the electrical-
```
MIC via a normalized-conductivity
```
threshold; Spencer et al. 2020 (Nat
```
```
Commun) use a 50% cell-count gate with a
```
t-test.
5. Cost/complexity vs LOSC: The LOSC paper
requires SOI wafers, e-beam lithography,
reactive-ion etching, ALD HfO2 gate
dielectric, on-chip AgCl/Ag pseudo-
reference electrodes, PDMS bonding, and
an HP4155A semiconductor parameter
analyzer. The impedance prototype needs
none of this — an off-the-shelf AFE IC,
commercial or PCB electrodes, and an
Arduino/Raspberry Pi.
Details
1. Low-Cost Impedance Measurement
Hardware
```
AD5933 (Analog Devices). A single-chip
```
impedance converter combining a DDS sine
generator, 12-bit 1-MSPS ADC, and on-chip
DSP that returns real and imaginary
impedance via DFT. Native frequency range 1
```
kHz–100 kHz; measures 1 kΩ–10 MΩ natively.
```
```
The EVAL-AD5933EBZ is listed at $68.24 (qty
```
```
1), In-Stock 78, 10-week standard lead time
```
```
(DigiKey PN 505-EVAL-AD5933EBZ-ND,
```
```
accessed Aug 2026); other distributors quote
```
up to ~$88. Strengths: cheapest turnkey
```
option; the single most-used bioimpedance IC
```
```
since 2005; DFT rather than I/Q demodulation.
```
```
Limitations: the 1 kHz floor sits above the 100
```
Hz–1 kHz region where medium-conductivity
```
effects are strongest; 2-electrode by default (4-
```
```
wire needs extra circuitry); 12-bit resolution.
```
Academic groups have added front-end
circuits to extend it to ~10 Hz and enable 4-
electrode measurement.
```
AD5941 / AD5940 (Analog Devices) —
```
recommended core. 16-bit 800-kSPS SAR ADC,
dual excitation loops, integrated ultra-low-
noise potentiostat and transimpedance
amplifier, Mouser native 4-wire impedance,
frequency range spanning roughly 0.015 Hz to
```
200 kHz. DigiKey pricing (Aug 2026): bare
```
```
AD5941BCPZ IC $13.65 (AD5941BCPZ-RL7
```
```
$14.06); EVAL-AD5941 daughterboard ~$205;
```
EVAL-AD5940BIOZ bio-impedance shield
```
(Arduino form factor) $439.08; ADICUP3029
```
Cortex-M3 host ~$64. The AD5940/41 is
recommended because it reaches the low
frequencies where metabolic conductivity
change is largest, its 4-wire capability
```
suppresses electrode-polarization drift (critical
```
```
for multi-hour growth monitoring), and Analog
```
Devices publishes open BIA/EDA firmware
examples on GitHub. GitHub
```
Other options (DigiKey, Aug 2026):
```
MAX30001EVSYS# bioimpedance/ECG AFE
```
eval kit $162.21 (optimized for
```
respiration/body impedance, narrow band —
```
less suitable); EVAL-CN0565-ARDZ
```
```
EIT/impedance Arduino shield $196.22; EVAL-
```
```
ADUCM355QSPZ $223.17 (ARM Cortex-M3 +
```
```
dual potentiostats + impedance in one chip);
```
```
AFE4300 (1 kHz–255 kHz, body-composition).
```
Recommended architecture: AD5941
daughterboard + ADICUP3029 Mouser
```
Electronics (or Raspberry Pi 4 / ESP32 via SPI)
```
as controller/data logger, with an ADG-series
analog multiplexer to sweep multiple wells
```
(test, growth control, sterility control)
```
sequentially through one AFE — the same
```
multiplexing approach Scherer et al. (Lab on a
```
```
Chip 2021) used to read many nanoliter
```
chambers in parallel.
2. Electrode Options
```
Commercial screen-printed IDEs (fastest
```
```
path). Metrohm DropSens interdigitated gold
```
electrodes are the reference choice in this
```
literature:
```
```
G-IDEAU10 (DRP-G-IDEAU10-U20): gold, 10
```
μm lines/gaps, glass substrate 22.9 × 7.6
mm, Metrohm sold in packs of 20.
```
G-IDEAU5: gold, 5 μm lines/gaps; the G-
```
IDEAU5 has 250 digit pairs, 5 μm width,
6.76 mm length with a well-characterized
cell constant in the literature.
```
Platinum (G-IDEPT5/10) and cheaper
```
carbon variants also exist. Metrohm Pricing
```
is quote-only — no public list price; request
```
a quote from Metrohm DropSens
```
(info.dropsens@metrohm.com) or
```
distributor nLab.
```
Hannah et al. (2019/2020, Strathclyde) built
```
a validated AST on commercial screen-
printed gold electrodes with an antibiotic-
seeded agarose hydrogel, distinguishing
susceptible S. aureus from MRSA and
susceptible/resistant E. coli in under 45–60
min — a strong precedent for this exact
electrode class. That work has since spun
```
into a commercial venture (Microplate Dx).
```
```
DIY PCB gold (ENIG) interdigitated electrodes
```
```
(lowest cost at volume). Standard PCB
```
fabrication with electroless-nickel-immersion-
```
gold (ENIG) finish yields gold-surfaced
```
interdigitated combs at feature sizes down to
~150–200 μm for a few dollars per board from
any PCB house. Published groups have used
ENIG PCB electrodes for impedance
```
biosensing (SARS-CoV-2 spike protein, cancer-
```
cell ECIS, Salmonella detection with 200 μm
```
width/spacing). Tradeoff: the nickel underlayer
```
and coarser features reduce sensitivity and
add electrochemical background versus pure-
```
gold thin-film IDEs; some groups add
```
supplemental gold electroplating.
```
Gold-leaf / laser-ablated electrodes (ultra-
```
```
cheap DIY). 24-karat gold leaf laminated to
```
PVC adhesive and patterned by laser ablation
produces reproducible interdigitated
electrodes suitable for EIS at very low cost
```
without cleanroom access (demonstrated for
```
E. coli immunodetection).
Geometry guidance. For sensing bulk-medium
```
conductivity changes from metabolism (rather
```
```
than surface capture), the electric field must
```
penetrate the bulk, and field penetration depth
```
scales with finger pitch. Very small gaps (sub-
```
```
μm to few-μm) confine the field near the
```
surface and maximize surface-event sensitivity
```
but sample less bulk; larger gaps (10–200 μm)
```
sample more bulk. A 5–10 μm gap gold IDE is
the compromise. Simulation and patent
literature agree that reducing gap size raises
sensitivity, with gap having greater influence
on E-field intensity than finger width.
3. Translating the LOSC Paper's
Acceleration Strategies to Impedance
```
Strategy (a) — unbuffered, low-ionic-strength
```
media. In the paper, replacing LB with
unbuffered 0.9% NaCl + 1% glucose
accelerated the detectable metabolic pH signal
from 50–70 min to 20 min by removing
buffering capacity so acidic overflow
```
metabolites (acetate, pyruvate, succinate) shift
```
pH fast. For impedance the physics is even
more favorable, but the optimal medium
```
differs. Because |Z| ∝ 1/(σ·ω·geometry):
```
A low-conductivity medium raises baseline
|Z| and, crucially, raises the fractional
impedance change produced by each
increment of metabolically generated ions.
```
This is exactly why Swami et al. (Biosens.
```
Bioelectron. 2022, 200:113876, IIT Delhi,
```
PMID 34974262) introduced a low-
```
conductivity zwitterionic growth buffer: "a
low conductivity zwitterionic buffer is used
for boosting impedance sensitivity in simple
```
interdigitated electrodes (IDEs) allowing
```
rapid AST in just 20 min without any liquid
```
flow"; their LCGB "allows rapid MIC
```
determination in 80 min and antibiotic
sensitivity analysis in just 60 min, which is at
least 8–9 times faster" than LB, at 2×10⁵
CFU. Likewise, Karmakar/Gopalakrishnan
```
et al. (Sci. Rep. 2025, s41598-024-84286-3)
```
chose "a diluted nutrient medium as an
electrolyte since it provides a higher charge
transfer baseline signal for better sensitivity."
The key inversion versus pH sensing: 0.9%
```
NaCl (~150 mM) is excellent for unbuffered
```
pH dynamic range but is high-conductivity
from an impedance standpoint — the added
ions swamp the metabolic signal. For
impedance you want to minimize
background ionic strength: use a HEPES-
based zwitterionic low-conductivity buffer
```
(zwitterions carry little net charge, so
```
conductivity is low while osmolarity/pH
```
support growth) or dilute the broth (1–10%
```
```
LB / diluted Mueller-Hinton). ScienceDirect
```
This is the single most important design
```
translation: keep the glucose (metabolic
```
```
fuel) but replace most of the NaCl with a
```
zwitterionic buffer or dilution to maximize
impedance dynamic range.
```
Strategy (b) — volumetric confinement / cell
```
concentration. The paper concentrated cells
```
~2 orders of magnitude (to ~3×10⁸ cells/mL)
```
in 35-pL chambers, dramatically boosting local
metabolic signal. For impedance this also
```
helps (higher cell density → faster measurable
```
```
conductivity change), and the classic
```
impedance-microbiology "detection time"
corresponds to reaching ~10⁶–10⁷ cells/mL.
But microfluidic pre-concentration adds cost
and complexity that conflicts with the low-cost
goal. Recommended compromise: use a small
```
static well (10–100 μL) with the CLSI-standard
```
starting inoculum of 5×10⁵ CFU/mL, accept a
```
somewhat longer time-to-detection (30 min–3
```
```
h vs 20 min), and recover speed instead
```
through low-conductivity medium and low-
frequency measurement. If faster results are
needed, add a simple membrane-filter or
centrifugal pre-concentration step rather than
picoliter chambers.
Net tradeoff summary: Low-conductivity
medium is a free lunch for impedance
```
(cheaper AND faster AND more sensitive).
```
Volumetric confinement is beneficial but
```
expensive; skip it for v1.
```
4. Experimental Design / Protocol
```
Strains (mirroring the paper, using accessible
```
```
ATCC equivalents). The paper used E. coli
```
```
MG1655 (susceptible) with isogenic AMP-R
```
```
(lacIZYA::bla), CIP-R (gyrA), and NIT-R (ΔnfsAB)
```
strains plus UPEC536. For an accessible
reference-strain validation:
Susceptible reference: E. coli ATCC 25922
```
(CLSI/EUCAST QC strain; published
```
```
ampicillin MIC QC range and breakpoints).
```
Resistant reference: E. coli ATCC 35218
```
(TEM-1 β-lactamase producer, ampicillin-
```
```
resistant; a CLSI/EUCAST QC strain used to
```
```
check β-lactam/inhibitor components).
```
This provides a clean AMP
susceptible/resistant pair from
```
authenticated QC strains; sold ready-to-use
```
```
(ATCC MINI-PACK, Microbiologics pellets).
```
Gram-positive control: S. aureus ATCC
```
29213 (MIC QC strain). uspto
```
Optionally add clinical CIP-R and NIT-R
isolates to mirror the paper's full panel.
```
Antibiotic panel (adapted from paper's
```
```
AMP/CIP/NIT).
```
```
Ampicillin (β-lactam, bactericidal): the
```
```
paper used 30 μg/mL; test around the E.
```
```
coli breakpoint (EUCAST S ≤ 8 mg/L) with a
```
```
dose series (0, 2, 4, 8, 16, 32, 64 mg/L) for
```
eMIC extraction.
```
Ciprofloxacin (fluoroquinolone,
```
```
bactericidal): paper used 2 μg/mL (near the
```
```
clinical breakpoint); dose series 0.06–4
```
mg/L.
```
Nitrofurantoin: paper used 200 μg/mL;
```
dose series around the 64 mg/L breakpoint.
Media. Primary: low-conductivity growth buffer
= 1% glucose + minimal NaCl + HEPES-based
zwitterionic buffer, OR diluted Mueller-Hinton
```
broth (5–10%). Run a parallel arm in standard
```
```
cation-adjusted Mueller-Hinton broth (CAMHB)
```
as the CLSI-reference comparator so
susceptibility calls remain traceable to
standard methods. Justify the low-conductivity
choice by the 1/σ impedance-sensitivity
argument above.
Inoculum. 0.5 McFarland adjusted, diluted to
```
the CLSI-standard final 5×10⁵ CFU/mL (the
```
density used in reference broth microdilution
```
and in Spencer's single-cell work).
```
Well/replicate structure per antibiotic per
```
strain:
```
Test wells: inoculum + antibiotic at each
concentration.
Growth control: inoculum, no antibiotic
```
(defines maximal ΔZ, the denominator of
```
```
DIR).
```
Sterility control: medium + antibiotic, no
```
inoculum (defines noise floor; corrects for
```
```
abiotic drift/evaporation).
```
```
Biological triplicates minimum (the paper
```
used triplicates and defined its threshold
```
from replicate SEM); ideally n ≥ 3 on
```
separate days.
Incubation / evaporation control. 35–37 °C
```
(CLSI standard). Because conductivity
```
changes ~2%/°C, temperature must be actively
```
controlled and logged (use the
```
AD5933/AD5941 on-chip temperature sensor
```
or a dedicated NTC/thermistor per well); a PID-
```
controlled resistive heater or heating block
suffices. Prevent evaporation with a mineral-oil
```
overlay (as the paper used oil sealing) or a
```
sealed humidified chamber — the sterility
control differentially subtracts residual drift.
Frequency selection protocol. At assay start,
sweep 100 Hz–1 MHz on a growth control vs
sterility control and identify the frequency with
the maximum |ΔZ| separation over the first 1–
```
2 h (typically 100 Hz–10 kHz, where bulk-
```
```
conductivity effects dominate; classic
```
commercial systems operate 2–10 kHz with
capacitance changes most pronounced near 2
```
kHz). Lock that single optimal frequency for
```
high-cadence monitoring.
Measurement cadence and run length. Log |Z|
```
and phase (or R and C) at the locked frequency
```
every 1–5 min for up to 3–4 h. Death-based
```
(bactericidal) signatures can appear in 20–90
```
```
min; growth-based signatures in 1–3 h in low-
```
conductivity medium.
5. Quantitative Impedance Threshold for
"Evidence of Antibiotic Response"
```
Baseline noise floor (analogous to the paper's
```
```
max-SEM rule). The uploaded paper set ΔVth
```
> 20 mV — the maximum SEM across
biological replicates — as its fixed
susceptibility threshold. The impedance
```
analog: compute the sterility control's
```
impedance fluctuation over the run and define
the noise floor = mean + 3×SD of that
```
fluctuation (equivalently, use the maximum
```
inter-replicate SEM of the growth-control
```
baseline). Any ΔZ excursion must exceed this
```
to count as real.
Differential metrics.
```
ΔZ(t) = Z_test(t) − Z_sterility-control(t)
```
```
(abiotic-corrected signal).
```
Normalized impedance change:
```
ΔZ_norm(t) = [Z(t) − Z(0)] / [Z(0) −
```
Z_empty], following the normalized-
resistance convention of Yang/Ekinci
```
(2020, PNAS) and the normalized-
```
conductivity Δκ of Spencer 2023.
```
Differential Impedance Ratio: DIR(t) =
```
```
ΔZ_antibiotic(t) / ΔZ_growth-control(t).
```
DIR ≈ 1 → the drug did not inhibit
```
metabolism → resistant; DIR ≈ 0 →
```
metabolism suppressed → susceptible.
This mirrors the resistant/susceptible ratio
ΔI_ABX/ΔI_control > T_R used in optical
```
AST (where a resistance threshold near 0.5
```
```
is applied).
```
```
Time-to-Detection (TTD). The time for the
```
growth-control ΔZ to first cross the noise floor
```
(mean + 3×SD). Report susceptibility only once
```
```
the growth control has crossed TTD (proving
```
```
the assay is live) AND the DIR has stabilized
```
above/below the call threshold.
Susceptibility call threshold. Set a DIR cutoff
from the separation of susceptible vs resistant
reference pairs across biological replicates —
choose the DIR value between the resistant
```
cluster (near 1) and susceptible cluster (near
```
```
0) that maximizes categorical agreement,
```
requiring it to exceed the replicate-SEM band
```
(the direct analog of the paper's "20 mV = max
```
```
SEM" logic). Published precedents: BacTrac
```
calls detection at a 5% impedance-curve
```
deviation; Safavieh et al. reported (per Spencer
```
```
et al. ACS Sensors 2023) that "the medium
```
resistance of an E. coli suspension or a
methicillin-resistant Staphylococcus aureus
```
(MRSA) suspension reduced by >50% within 1 h,
```
when the initial bacterial concentration was 10⁶
CFU/mL," enabling an end-point susceptibility
call after 90 min.
Electrical-MIC extraction and validation
```
(analogous to the paper's Fig. S18 dose-
```
```
response). For each antibiotic, plot the fixed-
```
```
time (e.g., 60 min) normalized
```
conductivity/impedance change versus
```
log(antibiotic concentration). Spencer, Li, Zhu,
```
```
Sutton & Morgan ("Electrical Broth Micro-
```
Dilution for Rapid Antibiotic Resistance
```
Testing," ACS Sensors 2023, 8(3):1101-1108,
```
```
Univ. Southampton/UKHSA/KCL) define the
```
```
electrical-MIC (eMIC) from this curve:
```
normalized conductivity "falls below 50% at the
MIC," and "the data demonstrate the utility of a
fast electrical-MIC test, where setting the
threshold for conductivity to, e.g., 10% would
correctly identify the MIC within +/– twofold
```
dilution" (normalized at 60 min, n = 3 biological
```
```
repeats, 100 nL measurement volume). Adopt
```
this convention: define eMIC as the lowest
concentration where normalized conductivity
change drops below the chosen threshold
```
(~50% for the nominal MIC, with a stricter
```
~10% cutoff giving ±one two-fold-dilution
```
accuracy). Validate by linear regression of
```
eMIC against E-test/reference broth-
microdilution MIC across the panel and report
R² — the uploaded paper reported R² = 0.99 for
```
its pH-based MIC-equivalent vs E-test; target
```
```
comparable linearity (R² > 0.9). Also report a
```
"fast-criterion" eMIC at a fixed early timepoint,
as the paper did with its 5-minute criterion.
6. Cost Estimate (Bill of Materials)
Low-cost differential impedance AST
```
prototype (benchtop, single-AFE, multiplexed
```
```
multi-well):
```
Component Choice
Approx.
cost
```
(USD,
```
Aug
```
2026)
```
Impedance
AFE
EVAL-AD5941
daughterboard
```
($205), or bare
```
AD5941BCPZ IC
```
($13.65) for a
```
custom PCB
$14–
$205
Host
controller
ADICUP3029
```
($64), Raspberry
```
```
Pi 4 ($55), or
```
```
ESP32 (~$10)
```
$10–
$64
Electrodes
DropSens G-
IDEAU10 gold
```
IDE (quote-only),
```
or DIY ENIG PCB
IDEs
~$2–
$25
each
Analog
multiplexer
ADG-series for
multi-well
sequencing
$5–$20
Component Choice
Approx.
cost
```
(USD,
```
Aug
```
2026)
```
Temperature
control
PID heater block
+
NTC/thermistors
$30–
$100
Evaporation
control
Mineral-oil
overlay + sealed
humidified
chamber
$10–
$30
Disposable
wells /
simple
microfluidic
PDMS or laser-
cut acrylic wells,
10–100 μL
$5–$50
```
Misc (wiring,
```
enclosure,
```
PSU)
```
—
$30–
$80
Total ≈ $350–
$700
```
(turnkey
```
eval
Component Choice
Approx.
cost
```
(USD,
```
Aug
```
2026)
```
```
boards)
```
or
$150–
$300
```
(bare-IC
```
custom
```
build)
```
```
Consumables per test (electrode + media +
```
```
antibiotic) are on the order of a few dollars
```
with DIY PCB electrodes, higher with
commercial gold IDEs.
Comparison to the SiNWFET LOSC in the
paper. The LOSC approach requires: SOI
```
wafers; electron-beam lithography and
```
```
reactive-ion etching (cleanroom, high $/hour);
```
```
ALD HfO2 gate dielectric; on-chip AgCl/Ag
```
```
pseudo-reference electrodes; PDMS
```
```
microfluidics with O2-plasma bonding; picoliter
```
```
chamber arrays; and readout on an HP4155A
```
```
semiconductor parameter analyzer (well into
```
```
five figures used/refurbished, six figures new).
```
Total capital and per-chip fabrication cost is
one to three orders of magnitude above the
impedance prototype, and it demands
cleanroom access and specialist fabrication
skills. The impedance prototype trades the
LOSC's 20-minute, single-chamber, single-cell-
sensitivity performance for a buildable, field-
deployable system at hobbyist/small-lab cost
— at the price of somewhat longer time-to-
```
result (30 min–3 h) and lower single-cell
```
resolution.
Recommendations
```
Stage 1 — Bench bring-up (weeks 1–3). Buy
```
one EVAL-AD5941 + ADICUP3029 and a pack
of DropSens G-IDEAU10 gold IDEs. Validate the
measurement chain against known
resistors/RC dummy cells and against KCl
solutions of known conductivity. Confirm you
can resolve <1% |Z| changes at 100 Hz–10
kHz. Go/no-go: stable baseline drift below the
```
intended noise floor (target SD < 0.5% over 3 h
```
```
at fixed T).
```
Stage 2 — Medium and frequency
```
optimization (weeks 3–6). With E. coli ATCC
```
```
25922 (growth control vs sterility control),
```
```
compare CAMHB, diluted MHB (5–10%), and a
```
HEPES low-conductivity growth buffer. Run
100 Hz–1 MHz sweeps and pick the frequency
and medium maximizing early |ΔZ| separation.
Threshold to advance: growth control crosses
the mean+3×SD noise floor within <2 h in the
chosen low-conductivity medium.
Stage 3 — Susceptible/resistant
```
discrimination (weeks 6–10). Run the ATCC
```
```
25922 (S) vs ATCC 35218 (AMP-R) pair with
```
ampicillin at breakpoint concentration in
```
biological triplicate. Compute DIR(t). Success:
```
```
clear DIR separation (resistant near 1,
```
```
susceptible near 0) exceeding the replicate-
```
SEM band, with categorical agreement vs
disk/E-test on all replicates.
Stage 4 — Dose-response and eMIC validation
```
(weeks 10–16). Generate normalized-
```
impedance dose-response curves for AMP, CIP,
```
NIT; extract eMIC at the chosen normalized-
```
```
conductivity threshold; regress against E-
```
test/broth-microdilution MIC and report R².
```
Target: eMIC within ±one two-fold dilution of
```
reference MIC and R² > 0.9. If not met, revisit
frequency choice, medium conductivity, or add
cell pre-concentration.
Escalation triggers. If time-to-result must drop
below ~30 min, add membrane-filter or
```
centrifugal cell pre-concentration (cheaper
```
```
than picoliter microfluidics) before considering
```
a microfabricated chamber. If baseline drift
dominates, switch fully to 4-wire measurement
and improve temperature control before
spending on better electrodes.
Standardization. Always run in biological
triplicate with paired growth and sterility
```
controls; keep a CAMHB reference arm so calls
```
```
remain traceable to CLSI/EUCAST; log
```
temperature continuously and correct for the
~2%/°C conductivity coefficient.
Caveats
Attribution correction: The "electrical-MIC
```
(eMIC)," 100-nL measurement volume,
```
normalized-conductivity threshold, and
strong 24-h broth-microdilution correlation
come from Spencer et al., ACS Sensors
```
2023 ("Electrical Broth Micro-Dilution"), not
```
```
from Scherer et al. 2021 (Lab on a Chip),
```
which is a single-bacterium digital-
impedance multiplexer proof-of-concept.
rsc Cite accordingly.
Swami et al. 2022 specifics partially
```
unverified: The exact numeric susceptibility
```
cutoff, measurement frequency, MIC R²,
and LCGB conductivity value could not be
```
verified from open sources (Elsevier
```
```
paywall/robots block); the LCGB is
```
described as a glucose/NaCl/HEPES
zwitterionic mix and the method achieves
```
20 min (death-based) to 60–80 min
```
```
(growth-based) AST at 2×10⁵ CFU. Confirm
```
specifics from the primary PDF before
finalizing threshold numbers.
Electrode pricing is quote-only: Metrohm
DropSens does not publish list prices for G-
```
IDEAU10/G-IDEAU5 (sold in packs of 20 —
```
the "5" and "10" denote 5 μm and 10 μm
```
line/gap spacing, not quantity); the per-unit
```
figures above are budgetary estimates, not
confirmed quotes. Request a quote from
Metrohm DropSens or nLab.
Impedance vs pH baseline dynamic-range
```
difference: Because impedance sensitivity
```
scales as 1/σ, media choices ideal for the
```
paper's unbuffered-pH scheme (0.9% NaCl)
```
```
are suboptimal for impedance; do not copy
```
the paper's medium directly — minimize
ionic strength instead.
Speed/resolution tradeoff: The impedance
prototype will generally not match the
```
LOSC's 20-min, single-cell performance;
```
realistic time-to-result is 30 min–3 h
depending on medium, cell density, and
antibiotic mechanism.
Bacteriostatic vs bactericidal: Death/ion-
release-based fast readouts apply mainly to
```
bactericidal, surface-acting drugs; growth-
```
based readouts are slower but general —
plan the antibiotic panel accordingly.
All component prices are as observed at
```
the time of research (mid-2026) at
```
DigiKey/Mouser and are subject to change
```
and stock lead times (AD eval boards
```
```
showed ~10-week standard lead times).
```
digikey digikey
Good comparison to make — iFAST is the most directly relevant published work, and it's a
genuinely different sensing philosophy from what I designed for you.
```
**iFAST 2020 (Spencer et al., Nature Communications)** is single-cell microfluidic
```
impedance cytometry, not bulk-well impedance. Bacteria flow one at a time through a
microfluidic channel where high-frequency impedance measurements capture the
electrical and morphological properties of many thousands of individual cells at high
```
throughput [PubMed](https://pubmed.ncbi.nlm.nih.gov/40623549/) . The parameters
```
extracted per cell are electrical radius as a proxy for cell size and opacity as a proxy for
membrane integrity, both of which shift in susceptible cells but not resistant or untreated
```
ones [360Dx](https://www.360dx.com/diagnostics/ifast-aims-deliver-three-hour-
```
```
antimicrobial-susceptibility-test-results-impedance-based) . Timing is remarkable: after an
```
overnight culture, cells are revived for 30 minutes, exposed to antibiotic for another 30
minutes, then measured in just 3 minutes
```
[PubMed](https://pubmed.ncbi.nlm.nih.gov/40623549/) — because it's detecting near-
```
instant membrane/morphology damage in individual cells rather than waiting for
population-level metabolic or growth changes.
```
**iFAST 2025 (Journal of Infection, UTI Enterobacterales study)** is the same underlying
```
platform pushed into clinical validation. Fifty-eight E. coli and K. pneumoniae strains were
exposed to breakpoint antibiotic concentrations, and after two hours the drop in single-cell
count relative to an unexposed control was used to call susceptibility
```
[ScienceDirect](https://www.sciencedirect.com/science/article/pii/S0163445325001434) .
```
For MIC-level resolution, strains near breakpoint were run against doubling-dilution
antibiotic series to derive an electrical MIC, giving 100% correlation with broth
microdilution on lab strains within a five-hour test, and clinical concordance in at least 74
```
of 80 real patient samples [nih](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9848847/)
```
.
**Where your design differs — three real gaps, not just cosmetic ones:**
- **Signal type.** iFAST reads individual-cell electrical morphology at high frequency (MHz
```
range, size/shape/membrane damage). Your prototype reads aggregate medium
```
```
conductivity at low frequency (100 Hz–10 kHz) — a population-level metabolic proxy, closer
```
```
to classical impedance microbiology (Bactometer/RABIT) than to iFAST. This is the
```
fundamental reason iFAST hits 30–60 minutes and yours realistically lands at 30 min–3 h:
single-cell membrane damage is visible almost immediately, while bulk conductivity has to
wait for enough cells to collectively shift the medium's ion content.
- **Hardware class.** iFAST needs a microfluidic flow-cytometry-grade impedance system
with precise single-cell flow control and multi-frequency lock-in detection — instrument-
grade, not a $200–700 bench build. Your AD5941 + static-well IDE design is deliberately in a
```
completely different cost/complexity tier; it can't and isn't trying to do single-cell
```
resolution.
- **Validation maturity.** iFAST 2020 was proof-of-concept across species (also
```
demonstrated on MRSA/MSSA and *N. gonorrhoeae* in follow-up conference work); iFAST
```
2025 is a clinical concordance study on real patient samples. Your design is still at the
```
bench-prototype/protocol stage — the whole point of the staged validation plan (ATCC
```
```
25922 vs 35218, then dose-response, then eMIC regression) is to earn the same kind of
```
evidence iFAST already has.
**Where the two converge nicely:** the electrical-MIC concept — dosing across a two-fold
dilution series and regressing an electrical readout against reference broth-microdilution
MIC — is exactly the same logic in both iFAST 2025 and your DIR/eMIC framework. That's
```
good validation that your threshold methodology is sound; you're just applying it to a
```
```
cheaper, slower, coarser signal (bulk conductivity) instead of iFAST's expensive, fast, fine-
```
```
grained one (single-cell electrical phenotype).
```
There's also a commercialized descendant worth knowing about: a 96-well plate version
incubates enriched patient samples with freeze-dried antibiotics at multiple
concentrations per well and uses multi-frequency impedance to detect bacterial volume
changes and cell-wall permeability changes [Journal of
```
Infection](https://www.journalofinfection.com/article/S0163-4453%2825%2900143-
```
```
4/fulltext) , aiming for full AST-plus-MIC panels in about three hours — effectively an
```
automated, clinical-grade instrument built on the same physics, which underscores that
iFAST's real product isn't just the sensor, it's the whole integrated culture-to-result pipeline
your low-cost version deliberately skips.
Contents lists available at ScienceDirect
Journal of Infection
journal homepage: www.elsevier.com/locate/jinf
Bacteria and Bacterial Diseases
```
Rapid impedance-based Antimicrobial Susceptibility Testing (iFAST) of
```
Enterobacterales in urinary tract infections
Lucy J. Bock a,⁎, Daniel C. Spencer b, Bethany K. Martin a,b, Caitlin N. Daniels a, Xena Dyball a,
Charlotte K. Hind a, Matthew E. Wand a, Collette E. Allen a, Robert C. Read c, H. Morgan b,
J. Mark Sutton a,d,⁎⁎
a Antimicrobial Discovery, Development and Diagnostics, Countermeasures Development, Evaluation and Preparedness, UK Health Security Agency, Porton Down,
Salisbury, Wiltshire SP4 0JG, UKb
School of Electronics and Computer Science, and Institute for Life Science, University of Southampton, Southampton, Hampshire SO17 1BJ, UKc
NIHR Southampton Biomedical Research Centre, School of Clinical and Experimental Science, and Institute for Life Science, University of Southampton, University
Hospital Southampton, Tremona Road, Southampton SO16 6YD, UKd
Institute of Pharmaceutical Sciences, School of Cancer & Pharmaceutical Sciences, King’s College London, SE1 9NQ, UK
a r t i c l e i n f o
Article history:
Accepted 3 July 2025
Available online 5 July 2025
```
Keywords:
```
Antimicrobial susceptibility test
Rapid
Phenotypic
Urinary tract infection
Broth micro dilution
Impedance cytometry
Label-free
Single-cell
Enterobacterales
s u m m a r y
```
Objectives: Evidence-based antibiotic prescribing for urinary tract infections (UTIs) would increase treat-
```
```
ment success and improve antibiotic stewardship. Current antimicrobial susceptibility tests (AST) are time-
```
```
consuming. A novel phenotypic impedance-based Fast AST (iFAST) measures changes in the electrical
```
phenotype of single bacteria in response to antibiotic exposure. Suitability of this technology for UTI causing
bacteria was investigated.
```
Methods: Fifty-eight strains of Escherichia coli and Klebsiella pneumoniae were exposed to EUCAST
```
breakpoint concentrations of UTI antibiotics. Following a two-hour exposure, the % cell count compared to
unexposed control populations were compared and susceptibility deduced. Results were compared to gold
```
standard broth microdilution (BMD) AST results. Susceptibility thresholds were clinically evaluated. Strain-
```
```
antibiotic combinations with a minimum inhibitory concentration (MIC) on or one doubling dilution above
```
the breakpoint were exposed to doubling dilutions of antibiotics and measured on iFAST to determine an
electrical MIC.
```
Results: 100% correlation was obtained for all eight antibiotics against laboratory strains, when allowing for the
```
inherent 2-fold variability of the BMD MIC measurement, within a five-hour test. Clinical evaluation showed
concordance in at least 74 out of 80 tests. Electrical MICs showed broad equivalence with classical MICs.
```
Conclusions: iFAST has potential as an accurate and rapid AST for UTI causing Enterobacterales.
```
© 2025 Published by Elsevier Ltd on behalf of The British Infection Association. This is an open access article
```
under the CC BY-NC-ND license (http://creativecommons.org/licenses/by-nc-nd/4.0/).
```
Introduction
```
Urinary tract infections (UTIs) are one of the most common in-
```
fections worldwide, with over 400 million cases estimated in 2019.1
Prompt treatment of UTIs is an important component of antibiotic
prescribing2 and if left untreated or treated with ineffective anti-
biotics, UTIs can develop into bacteraemia. In fact, nearly half of all
Escherichia coli bacteraemia in the UK originate from a UTI.3 Pre-
scribing effective antibiotics for each UTI as soon as a patient pre-
sents, rather than empirical prescribing, would reduce morbidity,
mortality and cost of ineffective treatment.4 Antimicrobial resistance
```
(AMR) is already a significant contributor to the global burden of
```
disease5 and likely to increase,6 further emphasising the need to
reduce incorrect prescribing.
```
Antimicrobial susceptibility tests (AST) on urinary pathogens in
```
diagnostic laboratories can take from 40–72 h from sample recep-
tion to susceptibility read-out. This delay leads to empirical anti-
biotic prescribing,7 bringing with it the risk of ineffective treatment
and poor antibiotic stewardship. A range of automated systems have
been developed for use in hospitals to help reduce the time to results
and automate various aspects of the process. Examples include the
```
Journal of Infection 91 (2025) 106549
```
```
https://doi.org/10.1016/j.jinf.2025.106549
```
```
0163-4453/© 2025 Published by Elsevier Ltd on behalf of The British Infection Association. This is an open access article under the CC BY-NC-ND license (http://creative-
```
```
commons.org/licenses/by-nc-nd/4.0/).
```
]]]]]]]]]]
⁎ Corresponding author.
⁎⁎ Corresponding author at: Antimicrobial Discovery, Development and Diagnostics,
Countermeasures Development, Evaluation and Preparedness, UK Health Security
Agency, Porton Down, Salisbury, Wiltshire SP4 0JG, UK.
```
E-mail addresses: lucy.bock@ukhsa.gov.uk (L.J. Bock),
```
```
mark.sutton@ukhsa.gov.uk (J.M. Sutton).
```
MAST Uri System,8,9 which automates plating onto pre-poured an-
tibiotic agar and uses image analysis and software to determine
susceptibility after 20 h of exposure, or the Thermo Fisher Sensi-
titre™ Gram Negative Urine Plate or the Beckman Coulter MicroScan
NMDRM1,10 for high-throughput broth microdilution. These
methods are principally phenotypic susceptibility tests, which
measure the growth of the bacteria, either on agar or in liquid media,
and use different methods to accelerate the interpretation of
changes in growth rate or bacterial survival. They rely on bacteria
growing to a measurable level, which usually requires 18 h, though a
rapid disc diffusion AST reading at 4, 6 or 8 h post inoculation is
available from EUCAST. However, this is often difficult to implement
in the laboratory workflow and is currently only available for posi-
tive blood cultures.
Recently, the PA-100 AST System from Sysmex Astrego was
awarded the UK’s Longitude Prize for its rapid UTI test, currently
being evaluated as a method for assessing bacteriuria and pheno-
typic susceptibility.11 The test tracks the growth profile of a defined
set of bacterial species E. coli, Klebsiella pneumoniae, Proteus mirabilis,
Enterococcus faecalis and Staphylococcus saprophyticus extracted di-
rectly from urine and exposed to one of amoxicillin/clavulanic acid,
ciprofloxacin, fosfomycin, nitrofurantoin and trimethoprim. The
authors state that the 45-minute test improves the optimal treat-
ment recommendation compared to routine clinical methods.11
Other novel ASTs include the use of viability markers, for ex-
ample non-fluorescent resazurin is reduced to the strongly fluor-
escent resorufin by growing bacteria. This can then be detected using
various optical,12 electrochemical13 or other methods. Companies
developing fast ASTs include Resistell™ who measure the nanomo-
```
tion of bacteria14; Innotive Dx who measure bacterial growth in a
```
```
proprietary media using fluorescent dyes and imaging15; Lifescale
```
```
(Affinity Biosensors) using microfluidic sensors to count and mea-
```
```
sure the mass of individual organisms16; and Microplate Dx who use
```
electrochemical impedance spectroscopy to detect bacterial
growth.17 Although there are many technologies in development,18
there remain issues around expensive equipment and consumables
or the need for specific reagents such as fluorescent dyes.
Genotypic tests to detect resistance markers are also available.19
However, these are limited to known resistance markers and cannot
detect phenotypic resistance, such as efflux pump upregulation. In
addition, genotypic tests are costly and therefore not routinely used
in high throughput urine analysis.
Single cell impedance cytometry is a relatively simple label-free
technique that can rapidly measure the effect of antimicrobials on
many individual bacterial cells.20 Following a short exposure to an-
timicrobials, the electrical properties of several thousand single or-
ganisms are measured in a microfluidic device in a time-frame of
two minutes. Susceptible bacteria show clear differences in electrical
impedance within as little as 30 min of exposure due to a combi-
```
nation of changes in cell volume and the electrical properties (con-
```
```
ductivity/permeability) of the cell wall/membrane. Comparison of
```
the electrical properties of exposed and unexposed populations
provides a simple way to determine the susceptible or resistant
profile of a range of bacterial species to a number of antibiotics. This
reagent free technology is termed impedance-based Fast Anti-
```
microbial Susceptibility Test (iFAST).
```
In this manuscript, iFAST was used to examine the susceptibility
of 58 bacterial strains with results compared to the current gold
```
standard broth microdilution (BMD) AST, as described by the ISO
```
standard ISO 20776-1:201921 and aligned with EUCAST metho-
dology. The study focussed on E. coli and K. pneumoniae, the two
most common causes of urinary tract infection, and the pathogens
most associated with high levels of antimicrobial resistance.22,23 The
bacteria were exposed to a panel of eight different antibiotics re-
commended for frontline treatment and management of patients
with UTI. Results demonstrate that the iFAST has good concordance
```
with susceptibility determined by broth microdilution (BMD), either
```
at a single breakpoint concentration or as part of an electrical
```
Minimum Inhibitory Concentration (eMIC) determination.
```
Materials and methods
Bacterial strains and reagents
The strains used in this study are listed in Table S1.24–28 Strains
```
were grown on cation-adjusted Mueller Hinton (MH2) or cystine-
```
```
lactose-electrolyte-deficient (CLED) agar plates (EO Laboratories) or
```
```
in MH2 broth (MHB, Sigma) at 37°C for 20 h. Strains remained on
```
plates for a maximum of 48 h. The following antibiotics from Sigma
```
were dissolved in water: potassium clavulate (with amoxicillin,
```
```
AMC), ceftazidime hydrate (CAZ), cefalexin (CEX), gentamicin sulfate
```
```
(GEN); in water with acetic acid: ciprofloxacin (CIP) and trimetho-
```
```
prim (TMP); in DMSO: amoxicillin (AMX); or in DMF: nitrofurantoin
```
```
(NIT) and then further diluted in water before adding to the cells in
```
MH2 broth. Dissolved antibiotics were stored at 4°C for a maximum
of seven days before use. 2 μm carboxylated polystyrene beads
```
(Polysciences) were added to 0.9% saline for normalisation. All
```
media, saline and diluents were autoclaved and filtered through a
0.22 μm filter before use.
Impedance cytometry system
The experimental system has been described in detail else-
where.20 A miniature cytometer is based around a microfluidic chip
that measures the electrical properties of single particles as they
flow between arrays of microelectrodes. One set of electrodes is
connected to an AC signal generator, whilst the opposite set are
connected to current amplifiers. When a cell flows along the
channel, it disturbs the AC current, and this change is measured as
```
the impedance of that particle. Two frequencies (5 MHz and 40 MHz)
```
are used, and in a typical experiment, around 20,000 single cells are
measured in two minutes with a volumetric flow rate of 30 μL/min.
iFAST and BMD laboratory workflow
E. coli and K. pneumoniae strains (36 and 22, respectively) were
streaked from −80°C glycerol stocks onto CLED plates and grown for
2 h at 37°C. A small amount of cells from this plate was used for
```
MALDI TOF Biotyper speciation (Bruker MALDI Biotyper sirius
```
```
System, MBT Compass HT software) using HCCA matrix (Bruker) to
```
confirm that this was possible after such short growth. A further
small amount was added to 3 mL 0.9% saline and vortexed. 10 μL was
added to 990 μL saline containing 5×106 carboxylated polystyrene
beads/mL, and the concentration of cells was established using the
impedance cytometer at a flow rate of 30 μL/min for 30 s. As outlined
in EUCAST guidelines, cell concentration was adjusted to 5×106 cfu/
```
mL in saline before adding 100 μL of the sample to 900 μL MH2 (final
```
```
concentration 5×105 cfu/mL) with (i) no antibiotics (control 1 and 2,
```
```
first and last samples), (ii) antibiotics at breakpoint concentrations
```
```
(see Table 1) or (iii) log2 dilutions of antibiotics in MH2 in 96-well
```
```
plates (BMD MIC). Samples i and ii were exposed for 2 hrs static at
```
37°C. Following exposure, 10 μL of each culture was diluted 1:100 in
```
saline and measured as above. For the parallel BMD MIC (iii), plates
```
```
were incubated at 37°C for 20 h and OD600 read (BMG Labtech
```
```
Clariostar). OD600 0.1 above blank was considered growth. The
```
highest antibiotic concentration was 512 mg/L for all antibiotics
```
except CIP (64 mg/L) and CAZ (128 mg/L). The concentration of po-
```
```
tassium clavulanate for co-amoxiclav (AMC) was fixed at 2 mg/L.
```
```
L.J. Bock, D.C. Spencer, B.K. Martin et al. Journal of Infection 91 (2025) 106549
```
2
Clinical evaluation workflow
Urine confirmed to contain high E. coli count by growth on
chromogenic agar were plated from 4°C onto CLED agar plates and
incubated for 2–4 h at 37°C, depending on cell density, and con-
firmed as E. coli by MALDI TOF Biotyper speciation. The iFAST
workflow was followed as above and compared to agar breakpoint
tests as carried out by the diagnostic laboratory. To confirm results,
```
the first three isolates (A, B and C) and nitrofurantoin for isolates G,
```
H, I and J were repeated the next day from 4°C, after the agar
breakpoint results were available,29 in addition to disk diffusion
assay, as carried out in parallel in the diagnostic laboratory.
```
Electronic MIC (eMIC) workflow
```
The laboratory workflow was followed as above, but bacteria
were exposed to doubling dilution of antibiotics around the MIC for
each strain in 1 mL MH2 and incubated at 37°C for two hours before
diluting and reading on iFAST. A parallel BMD MIC from the same
initial cell inoculum was conducted in 96 well plates according to
EUCAST guidelines.
Whole genome sequencing analysis
Bacterial genomic DNA was extracted using the Promega Wizard
DNA extraction kit according to the manufacturer’s instructions.
DNA was quantified by a Qubit fluorometer using the broad-range
```
sensitivity dsDNA kit (Invitrogen). DNA was prepared and sequenced
```
by the UK Health Security Agency Genomic Services and
```
Development Unit (UKHSA-GSDU). Libraries were prepared using
```
the Nextera DNA flex library prep kit according to the manufacturer’s
```
instructions, and reads (2×150 bp) were generated by the Illumina
```
HiSeq 2500 platform. A minimum of 150 Mb of Q30 quality data was
obtained for each sample. Fastq reads were quality trimmed using
Trimmomatic v0.39 and draft chromosome contigs were assembled
using SPAdes v3.15.3 filtering out contigs < 1 kb. Antibiotic resistance
genes were identified using ResFinder.30 Individual gene mutations
leading to resistance were identified by manual analysis of known
```
resistance genes, e.g. gyrA, in SeqBuilder (DNAstar Lasergene 14).
```
Data analysis and statistics
```
Impedance data was analysed using MATLAB (2023a), FlowJo
```
```
(v10.10.0), Microsoft 365 Excel (v2208) and GraphPad Prism
```
```
(v10.1.2). In FlowJo the 2 μm calibration beads added to each sample
```
were used to normalise the impedance data for absolute cell volume
```
(diameter 2, opacity 1, phase 0). Gates were manually drawn on the
```
impedance scatter plots to identify electrical noise, beads and bac-
teria. Sample exclusion criteria for the bacterial gate were quality
```
checked for the following features: a) control 1 (C1) < 1000 cells, b)
```
```
bead count > 2-fold difference to C1, c) technical anomalies of read-
```
out. The following metrics were determined: cell count, median and
```
coefficient of variance (CV) of diameter, opacity, and phase. For each
```
metric the % of control 1 was calculated.
Analysed data was exported to Microsoft Excel and linked to
MICs measured by BMD and sorted into susceptible and non-sus-
```
ceptible (resistant and susceptible at increased concentrations) per
```
antibiotic as per EUCAST v12.31 E. coli and K. pneumoniae strains
were treated equally except for nitrofurantoin, where K. pneumoniae
strains were excluded from the analysis, as per EUCAST guidelines. A
2-tailed Wilcoxon matched-pairs signed rank test of control 1 vs
control 2 was performed for all 7 metrics to confirm no significant
```
difference (GraphPad Prism). Wilson/Brown ROC curves (95% CI) for
```
each metric as % of control were drawn using susceptible/resistance
```
data from BMD, with susceptible samples (by BMD) defined as ne-
```
gative and resistant samples positive. The best specificity and sen-
sitivity to distinguish between susceptible and resistant for each
```
antibiotic and metric were calculated using ROC curves (Fig. 3 and
```
```
S3, Table S2 and S3). Thresholds for susceptibility were set at the
```
value that had 100% sensitivity and 100% susceptibility as calculated
by ROC. ROC curves were also generated excluding samples with
MICs on or one doubling dilution above the breakpoint. Specificity of
100% reduces the chance of very major errors, i.e., situations where
iFAST would call the strain susceptible, but MBD MIC would call it
resistant. Statistical data is shown in Tables S2 and S3. Figures were
created using Biorender.com.
Data statement
Raw data has been deposited in Mendeley Data DOI: 10.17632/
47c4k2rfdj.1. Gene sequences have been deposited in BioProject
Database under BioProject ID: PRJNA1246557.
Results and discussion
Developing the iFAST laboratory workflow
We have previously shown that an impedance-based fast anti-
```
microbial susceptibility test (iFAST) can be used to determine the
```
susceptibility of WHO priority pathogens to a range of antibiotics,
each with different mechanisms of action.20 This study extends this
and examines the potential of the technology for rapid AST de-
termination within a typical workflow as currently implemented for
UTI ASTs in a large regional hospital in the UK.
The initial focus was on a panel of Enterobacterales, reflecting the
most common pathogens found in UTI samples, namely E. coli and K.
pneumoniae. The antibiotic panel is shown in Table 1 and consists of
eight antibiotics widely used for frontline therapy of patients with a
suspected UTI or for patient management in relation to carriage of
```
isolates with extended spectrum beta lactamases (ESBLs) at Uni-
```
```
versity Hospital of Southampton (UHS) in 2022, in accordance with
```
UK Standards for Microbiology Investigations29 and UHS practice.
Fig. 1 compares the diagnostic laboratory workflow for anti-
```
microbial susceptibility testing (AST) with iFAST and the clinical
```
evaluation discussed later in this manuscript. The iFAST protocol
Table 1
```
Enterobacterales EUCAST breakpoints (v12.0, 2022) of antibiotics used in this study (mg/L).
```
Antibiotic class antibiotic acronym S ≤ I R > breakpoint conc. tested
β-lactam + inhibitor co-amoxiclav AMC 8/2 - 8/2 8/2
β-lactam amoxicillin AMX 8 - 8 8
```
cephalosporin (ESBL marker) ceftazidime CAZ 1 2 - 4 4 1
```
cephalosporin cefalexin CEX 16 - 16 16
fluoroquinolone ciprofloxacin CIP 0.25 0.5 0.5 0.25
aminoglycoside gentamicin GEN 2 - 2 2
nitrofurans nitrofurantoina NIT 64 - 64 64
synthetic diaminopyrimide agent trimethoprim TMP 4 - 4 4
a Only for E. coli strains.
```
L.J. Bock, D.C. Spencer, B.K. Martin et al. Journal of Infection 91 (2025) 106549
```
3
requires plating for two hours to produce logarithmically growing
```
cells (Fig. S2), followed by exposure to antibiotics for a further two
```
hours, instead of overnight incubation as for the current diagnostic
```
workflow, before reading the sample on iFAST (2 min per sample). To
```
closely align the method with EUCAST/ CLSI MIC testing, cells were
diluted to a concentration of 5×105 cfu/mL in MH2. Each antibiotic in
the panel of eight was set to the concentration of the susceptibility
breakpoint for Enterobacterales as in EUCAST published values
```
(Tables 1, v12.0, 2022). It has been previously shown that the effect
```
of a beta-lactam antibiotic can be observed by impedance cytometry
within 30 min.32 To accommodate the mode of action of the range of
different antibiotics, all samples were exposed for two hours. The
final protocol is described in Fig. S1.
```
The panel of E. coli and K. pneumoniae strains (36 and 22, re-
```
```
spectively) is shown in Table S1, including their antibiogram based
```
on BMD MIC testing and resistance mutations. Each strain was ex-
posed to breakpoint concentrations of each antibiotic, together with
two un-exposed controls for two hours followed by resuspension in
```
saline for measurement on the impedance cytometer (measurement
```
```
taking two minutes per sample). Each test was carried out once,
```
```
unless technical quality control metrics were unmet (see Materials
```
```
and methods), in which case parallel iFAST and BMD were repeated.
```
The MICs determined by BMD were used as a direct comparator for
the breakpoint measurements using the impedance cytometer.
Example impedance scatter plots are shown in Fig. 2a. The x-axis
```
is the electrical diameter of the cells (determined from the im-
```
```
pedance at 5 MHz) and the y-axis the electrical opacity, a ratio of
```
high frequency to low frequency impedance, or electrical phase
```
(high frequency only), which reflects different electrical phenotypic
```
changes in the cell membrane. The scatter plots show the cell po-
pulation along with the beads that are used for normalisation. Fig. 2b
shows an example data set for E. coli and K. pneumoniae exposed to
the panel of antibiotics at the clinical breakpoint. Each figure in the
panel shows an impedance scatter plot for 60 μL of control or ex-
posed samples. The scatter plots clearly show strains that were
susceptible to antibiotics, where the number of cells decreased
compared to control, or resistant, where there was negligible change
in the cell count and position. Strain NCTC 13476 was resistant to all
antibiotics except NIT. The other four strains were susceptible to
some or all of the antibiotics. Similar results were obtained for other
E. coli and K. pneumoniae strains (note that the EUCAST-defined
breakpoints are the same for both species, except for nitrofurantoin,
```
which is recommended for use with E. coli only).
```
Susceptible vs resistant metrics
Seven different metrics were used to compare iFAST data with
```
the BMD results, namely: (i) cell count, (ii) coefficient of variance
```
```
(CV) of diameter, (iii) CV of opacity, (iv) CV of phase, (v) median
```
```
diameter, (vi) median opacity and (vii) median phase. In each case
```
the % of exposed compared to unexposed control was determined.
Two unexposed control samples were routinely used to identify any
potential errors. No significant differences were observed between
the two controls for any of the seven metrics for any of the samples,
demonstrating that the technical variability of the test is negligible.
```
BMD assays have an inherent 2-fold variability (i.e. an MIC of
```
```
8 mg/L may in fact be 4 mg/L or 16 mg/L). This is recognised as es-
```
sential agreement in ISO 20776-1:2019.21 In this work we are
```
Fig. 1. Comparison of UTI AST diagnostic pathway as currently performed within a large regional hospital in the UK (left), the laboratory iFAST protocol (centre) and the clinical
```
```
evaluation iFAST protocol (right). The current diagnostic workflow requires two overnight incubations from the urine sample. First to isolate colonies on CLED agar, second to
```
assess susceptibility to the antibiotic. The iFAST lab workflow retains the initial plating step. To have logarithmically growing cells, isolates are restreaked on a second agar plate
for two hours before exposure to antibiotics for two hours, rather than overnight as in the diagnostic workflow. The clinical evaluation workflow only has the 2x two hour
incubations from the urine sample to iFAST readout. This means that the complete iFAST workflow can be carried out in less than five hours, direct from a positive urine sample,
```
and thus in less than one working shift (eight hours). *identification using MALDI was carried out at this point.
```
```
L.J. Bock, D.C. Spencer, B.K. Martin et al. Journal of Infection 91 (2025) 106549
```
4
```
comparing a quantitative test (MIC) to a qualitative test (S/R). In
```
addition, the number of samples within the two-fold variability of
the “gold standard” BMD test varied between antibiotics. In order to
account for these factors, we excluded for each antibiotic, those
strains that had a BMD MIC on, or one doubling dilution above, the
susceptibility breakpoint tested.
The optimal metric that could distinguish between susceptible
and resistant for each antibiotic was determined using Receiver
```
Operating Characteristic (ROC) curves (Fig. 3, Table S2).
```
All eight antibiotics showed a concordance of 100% specificity
and 100% sensitivity between BMD MIC test and iFAST breakpoint
exposure when cell count was used as a metric to discriminate
```
susceptible and resistant isolates (Fig. 3, Table S2). Due to the MICs of
```
the strains included in the analysis, only 7 and 20 strains were
susceptible and 37 and 6 resistant to AMX and NIT, respectively,
reducing the confidence in the susceptibility threshold values for
distinguishing susceptible strains for these antibiotics. The only non-
concordances for all antibiotics were for strains that had a BMD MIC
within the variability of the gold standard, i.e., an MIC on or one
doubling dilution above the breakpoint concentration. The only ex-
ceptions to this were two strains in which plasmid loss had occurred
```
(see supplementary information).
```
When all data, including those with an MIC at or one doubling
dilution above the breakpoint, were analysed, the ability of iFAST to
distinguish between susceptible and resistant strains was high with
```
sensitivity between 100% (CAZ) and 80% (CEX) and an outlier of
```
```
30.77% (NIT) at specificity of 100% (Fig. S3, Table S3).
```
Given the above limitations of strains with an MIC on or one
doubling dilution above the susceptibility breakpoint, concordance
between the iFAST breakpoint test and BMD MIC was 100% for all
eight antibiotics tested against the 58 E. coli and/or K. pneumoniae
```
isolates (Fig. 3, Table S2).
```
iFAST clinical workflow evaluation
The applicability of iFAST in a clinical setting was evaluated in a
pilot study of 10 urines with heavy E. coli growth following the
protocol outlined in Fig. 1. These were tested against the same panel
of eight antibiotics alongside agar breakpoint tests, as carried out in
the diagnostic laboratory at the time. As expected, most isolates
were susceptible to all or most of the antibiotics tested. Using the
same quality control and threshold parameters of % cell count
compared to control determined from the 58 strains, it was estab-
lished that the susceptibility results determined by iFAST matched
Fig. 2. Electrical changes in cell populations exposed to breakpoint concentrations of eight antibiotics can define the susceptibility of strains. a Example impedance scatter plot of
```
unexposed control K. pneumoniae NCTC 13368 together with 2 μm diameter polystyrene beads (used for normalisation). The x-axis is the cube root of the impedance (proportional
```
```
to diameter) measured at a frequency of 5 MHz. The y-axis is the electrical opacity, the ratio of high frequency (40 MHz) to low frequency (5 MHz) impedance (left image) or the
```
```
phase, the high frequency (40 MHz) not normalised to cell size (right image), which measure the electrical properties of the cell membrane. b Scatter plots of cell populations
```
```
exposed to breakpoint concentrations of eight antibiotics (mg/L) for two hours measured by iFAST and standard BMD MIC (mg/L, in top right of each scatterplot, green, plain = MIC
```
```
below breakpoint, orange, italic = MIC equals breakpoint concentration or one above, red, underlined = MIC above breakpoint). Readouts were normalised to the beads, and
```
electrical noise and beads gated out of the plots shown. NIT is not applied to K. pneumoniae strains as per EUCAST guidelines.
```
L.J. Bock, D.C. Spencer, B.K. Martin et al. Journal of Infection 91 (2025) 106549
```
5
the laboratory diagnostic test in 74 out of 80 tests, as summarised in
Table 2 and Table S4.
Two mismatches between iFAST and agar susceptibility testing
were initially found each for co-amoxiclav, amoxicillin and tri-
```
methoprim and seven mismatches for nitrofurantoin (Table S4).
```
Five of the mismatches were subsequently retested using disk
```
diffusion (isolates A, B and C for all antibiotics), with three of the
```
```
new results matching the original iFAST result (green shading in
```
```
Table 2), highlighting variability in the agar AST method. The
```
thresholds to distinguish between susceptible and resistant are
```
low for AMC (17% of control) and NIT (15%) compared to the other
```
```
antibiotics (between 37% and 47%). This means that these two
```
antibiotics are more prone to cell debris in the scatterplot out-
weighing live cells when overall cell counts are low, thereby dis-
torting the result. In fact, isolates D, E, F, G, H, I and J, which had
mismatches for nitrofurantoin, had control cell counts below 2000
and isolate E had cell counts below quality control threshold for
```
the control (< 1000, supp Table 4). In a repeat with higher cell
```
count, NIT iFAST matched the agar susceptibility profile in all
```
tested cases (supp Table 4).
```
```
Only one of the remaining five mismatches (Isolate B AMC and
```
```
NIT, Isolate D AMC, NIT and TMP, red shading in Table 2) would be
```
classified as a very major error, i.e., calling an isolate susceptible
```
when it is resistant. This isolate (isolate B AMC in Table 2) falls below
```
```
the susceptibility threshold for co-amoxiclav (12% < 17% cell count of
```
```
control). When isolate B was exposed to increasing concentrations of
```
AMC and analysed on iFAST, it became clear that this isolate has an
```
MIC on the breakpoint (Fig. S4b). Once again, this shows that iFAST
```
had essential agreement with the diagnostic method used, ex-
plaining the mismatch.
Fig. 3. ROC curves comparing iFAST with BMD demonstrating 100% concordance for all eight antibiotics. In these plots, samples with an MIC in the two-fold variability for the gold
```
standard broth microdilution AST method have been removed. In all cases the % cell count compared to unexposed control (blue line) metric could discriminate susceptible from
```
resistant strains when compared to the gold standard. Dotted line represents a random guess. For NIT only E. coli strains were used for the analysis.
Table 2
Final susceptibility data for clinical urine E. coli isolates comparing the iFAST method with agar AST and disk diffusion.
```
S: Susceptible, R: Resistant, agar: agar AST in diagnostic lab, DD: disk diffusion AST in diagnostic lab. Red shading: non-concordance between iFAST and diagnostic lab, green
```
```
shading: non-concordance between iFAST and diagnostic lab result where iFAST result was confirmed using a secondary confirmatory method (DD), yellow shading: iFAST initially
```
read resistant, repeat with higher cell count confirmed susceptible, greyed out: cell count of control below quality control threshold. The threshold values in Fig. 3, Table S2 were
```
used to define S/R using % cell count compared to control for all antibiotics (see Table S4).
```
```
L.J. Bock, D.C. Spencer, B.K. Martin et al. Journal of Infection 91 (2025) 106549
```
6
Isolate D exposed to co-amoxiclav and trimethoprim had
```
populations above the respective thresholds (28% and 53%,
```
```
thresholds 17% and 40% respectively), determining them re-
```
sistant. This isolate was not retested with higher cell con-
centrations nor using disk diffusion, so either result may have
```
been correct (Fig. S4a).
```
To explain the mismatch of NIT in isolates B and D, further un-
derstanding of the impact of nitrofurantoin on the electrical prop-
erties of cells after only two hours of exposure would help to
establish a more reliable predictive threshold for this antibiotic. For
all other antibiotics the established thresholds were clearly able to
identify susceptible E. coli isolates.
Fig. 4. Bacterial cells change their electrical properties at sub-MIC levels. Series of impedance scatter plots for cells exposed to doubling dilutions around the MIC of various antibiotic classes
```
(eMIC). a NCTC 12923: change in cell count, diameter and phase exposed to sub-MIC concentrations of NIT b 12923 NIT64 P10: decreased cell count, no change in diameter or phase at sub-
```
MIC concentrations. c Scatter plots showing different responses to a range of antibiotic classes at sub- and supra-MIC levels. These changes are indicative of biophysical changes of the
bacteria upon exposure to the antibiotic, e.g., stress responses, permeability changes or membrane changes. BMD MIC: MIC as determined by the parallel broth micro dilution.
```
L.J. Bock, D.C. Spencer, B.K. Martin et al. Journal of Infection 91 (2025) 106549
```
7
```
Electrical MIC (eMIC)
```
Comparison of BMD MIC to a quantitative electrical minimum
```
inhibitory concentration using the iFAST system (eMIC) could allow
```
reliable differentiation between nitrofurantoin-resistant and sus-
ceptible isolates. We therefore measured susceptibility at more than
one antibiotic concentration on iFAST for nine laboratory strains
```
with varying nitrofurantoin MICs (Table S5). Example scatter plots
```
are shown in Fig. 4. Results showed that the response to antibiotics
varied between strains, especially at exposure to sub-inhibitory
concentrations. Susceptible strain NCTC 12923 had changes in cell
count, diameter and phase when exposed to a sub-MIC antibiotic
```
concentration (Fig. 4a). In contrast, NCTC 12923 NIT 64 P10, which is
```
```
the same strain adapted to NIT (mutations in NfsA and NfsB),
```
showed no change in diameter and phase following exposure to sub-
```
MIC concentrations of NIT, but had a reduced cell count (Fig. 4b). At
```
the MIC, the cell count did not decrease further, but the diameter
decreased to below that of the unexposed cells. Comparing NIT
```
susceptibility as measured by BMD MIC and eMIC (% cell count of
```
```
control) showed essential agreement in five out of nine cases.
```
However, when the second-best metric, % change in median phase,
```
was chosen (see supp Table 2 and Fig. 3), nine out of nine NIT eMICs
```
showed essential agreement with the BMD MIC. NIT concordance
may therefore be improved by performing eMICs and more clearly
defining the best metric in more samples, rather than only break-
point testing and defining susceptibility by reduction in cell count.
Further eMICs were performed on several mismatched strain/
antibiotic combinations to investigate whether concordance would
improve for strains with an MIC on or one doubling dilution above
```
the breakpoint, as for isolate 2 in the clinical evaluation (Fig. S4,
```
```
Table S5). Though only 60% showed essential agreement with the
```
BMD MIC, the mismatches always showed a lower eMIC than BMD
MIC. This may be due to changes in the electrical properties of ex-
posed cells being detectable at sub-MIC levels, depending on anti-
```
biotic (Fig. 4c). In particular for the β-lactam (amoxicillin) and the
```
```
fluoroquinolone (ciprofloxacin) a significant decrease in event count
```
together with an increase in electrical diameter was observed at sub-
MIC levels. Cell count further decreased at the MIC, and electrical
diameter decreased to below that of the unexposed cells, as also
seen for nitrofurantoin. For the aminoglycoside gentamicin the cell
count was reduced but there was no change in any other metrics.
Results for trimethoprim were similar to gentamicin, with a small
increase in diameter at sub- and supra-MIC. These data demonstrate
that iFAST can identify subtle changes in populations following an-
tibiotic exposure, which might further our understanding of re-
sistance and susceptibility of individual strains to different antibiotic
classes, as well as modes of action of antibiotics or mechanisms of
resistance to them. This complexity makes it difficult to determine a
single metric for interpretation of eMICs against all antibiotics.
Conclusions
This work has demonstrated that a new single-cell impedance
```
cytometric AST (iFAST) can be developed to deliver reliable sus-
```
ceptibility results more than 35 h faster than the standard AST with
comparable accuracy for E. coli and K. pneumoniae against eight
commonly used antibiotics. As with the current gold standard BMD
method, the only strains that were miscalled susceptible or resistant
were those with an MIC on or one doubling dilution above the MIC,
meaning that there was in all cases essential agreement between the
BMD and iFAST read-outs. Exposure to more than one concentration,
such as in eMICs, gives a more accurate susceptibility read-out.
The current gold standard BMD assay is based on measurement
of increases in bacterial cell count, usually assessed by eye. Other
fast phenotypic ASTs under development measure rate of cell growth
or other single surrogate metrics such as nanomotion14 or viability
markers.13 iFAST measures changes in cell growth, but also other
metrics, such as changes in cell size, permittivity and conductivity,
allowing for a more accurate picture of the cells’ responses to anti-
biotic exposure at the population level. As iFAST measures the
electrical changes in single live cells, no chemical fixing, cross-
linking or expensive dyes are required. The only consumables re-
quired are saline, beads, media, antibiotics and commonly available
96-well plates. In addition, no complex optical systems are used,
allowing iFAST to be more easily automated and accelerated in both
speed and throughput. Although commercial decisions are outside of
the remit of this study, this might allow the technology to be
available at a price comparable to current disc diffusion AST.
Future work will concentrate on expanding the clinical applic-
ability of the technology with a larger concordance study on clinical
UTI samples, increasing the number of bacterial species, including
more ESBL phenotypes, antibiotics and antibiotic concentrations,
together with optimising nitrofurantoin and other antibiotic read-
outs. We will further test the impact of samples that may contain
```
more than one species (e.g. Staphylococcus aureus contamination on
```
```
collection) to develop a more reliable method, which works directly
```
from urine. Implementation of a rapid test would contribute to an-
tibiotic stewardship and speed up the diagnostic process whilst re-
ducing hands-on time for staff.
Declaration of Competing Interest
The author is an Editorial Board Member/Editor-in-Chief/
Associate Editor/Guest Editor for this journal and was not involved in
the editorial review or the decision to publish this article.
The authors declare the following financial interests/personal
relationships which may be considered as potential competing in-
```
terests: Hywel Morgan and Daniel Spencer own equity in a spin-out
```
company iFAST Diagnostics Ltd.
Rob Read is the Editor of Journal of Infection.
All other authors declare no competing interests.
Acknowledgements
The project was funded by the National Institute for Health and
```
Care Research (NIHR) under its Invention for Innovation (i4i)
```
```
Programme (Grant Reference Number NIHR200968). The views ex-
```
```
pressed are those of the author(s) and not necessarily those of the
```
NIHR or the Department of Health and Social Care. Additional
funding was provided by UKHSA GiA project 111742, a UKHSA
funded PhD studentship for BM and support from the National
Institute for Health Research through the NIHR Southampton
```
Biomedical Research Centre (NIHR203319) for the clinical evaluation
```
by BM. RCR is an NIHR Senior Investigator.
The authors wish to thank Katie Chamberlain for manufacturing
```
the impedance chips; UKHSA Colindale, in particular Katie Hopkins,
```
and Yu Wan and Shiranee Sriskandan from NIHR Health Protection
Research Unit in Healthcare Associated Infections and Antimicrobial
Resistance, Department of Infectious Diseases, Imperial College
London for supplying strains. We also wish to thank Neville
Verlander from UKHSA for support with the statistical analysis. We
acknowledge Nitin Mahobia and Philippa D′arcy-Grover, University
Hospital of Southampton, for discussions and providing details of the
diagnostic workflow.
Appendix A. Supporting information
Supplementary data associated with this article can be found in
the online version at doi:10.1016/j.jinf.2025.106549.
```
L.J. Bock, D.C. Spencer, B.K. Martin et al. Journal of Infection 91 (2025) 106549
```
8
References
1. Yang X, Chen H, Zheng Y, Qu S, Wang H, Yi F. Disease burden and long-term
```
trends of urinary tract infections: a worldwide report. Front Public Health2022;10:888205.
```
2. van Belkum A, Bachmann TT, Ludke G, Lisby JG, Kahlmeter G, Mohess A, et al.Developmental roadmap for antimicrobial susceptibility testing systems. Nat Rev
```
Microbiol 2019;17(1):51–62.3. Annual epidemiological commentary: Gram-negative, MRSA, MSSA bacteraemia
```
```
and C. difficile infections, up to and including financial year 2022 to 2023; 2024.〈https://www.gov.uk〉; 26th September 2024.
```
4. Booton RD, Agnew E, Pople D, Evans S, Bock LJ, Sutton JM, et al. Rapid antibiotic
```
susceptibility testing for urinary tract infections in secondary care in England: a cost-effectiveness analysis. BMJ Open 2024;14(11):e081865.
```
5. Antimicrobial Resistance Collaborators. Global burden of bacterial antimicrobialresistance in 2019: a systematic analysis. Lancet 2022;399:629–55.
6. Collaborators GBDAR. Global burden of bacterial antimicrobial resistance 1990-2021: a systematic analysis with forecasts to 2050. Lancet
```
2024;404(10459):1199–226.7. National Institute for Health and Care Excellence. Urinary tract infection (lower):
```
```
antimicrobial prescribing. NICE guideline [NG109]; 2018.
```
8. MAST uri system. Available from: 〈https://www.mast-group.com/uk/products/mast-uri-system〉.
9. Evans TJ, Riley PA. Principles of microscopy, culture and serology-based diagnostics.Medicine 2021;49(10):648–53.
10. Aupaix A, Lamraoui K, Rodriguez-Villalobos H, Anantharajah A, Verroken A.Comparison of two commercial broth microdilution panels for multidrug-resistant
```
Gram-negative bacteria: Thermo Scientific Sensititre DKMGN vs. Beckman CoulterMicroScan NMDRM1. Front Microbiol 2024;15:1480687.
```
11. Alonso-Tarres C, Benjumea Moreno C, Navarro F, Habison AC, Gonzalez-Bertran E,Blanco F, et al. Bacteriuria and phenotypic antimicrobial susceptibility testing in
```
45 min by point-of-care Sysmex PA-100 System: first clinical evaluation. Eur J ClinMicrobiol Infect Dis 2024;43(8):1533–43.
```
12. Reis NM, Pivetal J, Loo-Zazueta AL, Barros JM, Edwards AD. Lab on a stick: multi-analyte cellular assays in a microfluidic dipstick. Lab Chip 2016;16(15):2891–9.
13. Crane B, Hughes JP, Rowley Neale SJ, Rashid M, Linton PE, Banks CE, et al. Rapidantibiotic susceptibility testing using resazurin bulk modified screen-printed elec-
```
trochemical sensing platforms. Analyst 2021;146(18):5574–83.14. Aubry C, Kebbi-Beghdadi C, Luraschi-Eggemann A, Cathomen G, Cichocka D,
```
Sturm A, et al. Nanomotion technology: an innovative method to study cell meta-
```
bolism in Escherichia coli, as a potential indicator for tolerance. J Med Microbiol2024;73(11):001912.
```
15. innotivedx. Available from: 〈https://www.innotivedx.com/〉.16. Burg TP, Godin M, Knudsen SM, Shen W, Carlson G, Foster JS, et al. Weighing of
```
biomolecules, single cells and single nanoparticles in fluid. Nature2007;446(7139):1066–9.
```
17. Domingo-Roca R, Lasserre P, Riordan L, Macdonald AR, Dobrea A, Duncan KR, et al.Rapid assessment of antibiotic susceptibility using a fully 3D-printed impedance-
```
based biosensor. Biosens Bioelectron X 2023;13:100308.
```
18. van Belkum A, Burnham CD, Rossen JWA, Mallard F, Rochas O, Dunne Jr. WM.Innovative and rapid antimicrobial susceptibility testing systems. Nat Rev Microbiol
```
2020;18(5):299–311.19. Banerjee R, Patel R. Molecular diagnostics for genotypic detection of antibiotic re-
```
```
sistance: current landscape and future directions. JAC Antimicrob Resist2023;5(1):dlad018.
```
20. Spencer DC, Paton TF, Mulroney KT, Inglis TJJ, Sutton JM, Morgan H. A fast im-pedance-based antimicrobial susceptibility test. Nat Commun 2020;11(1):5328.
21. ISO 20776-1:2019 Susceptibility testing of infectious agents and evaluation of
performance of antimicrobial susceptibility test devices. Part 1: Broth micro-di-lution reference method for testing the in vitro activity of antimicrobial agents
```
against rapidly growing aerobic bacteria involved in infectious diseases: UKHealth Security Agency; 2019.
```
22. English surveillance programme for antimicrobial utilisation and resistance(ESPAUR) Report 2022 to 2023. 2023 Nov 2024. Report No.: GOV-16252.
23. Von Vietinghoff S, Shevchuk O, Dobrindt U, Engel DR, Jorch SK, Kurts C, et al. Theglobal burden of antimicrobial resistance – urinary tract infections. Nephrol Dial
```
Transplant 2024;39(4):581–8.
```
24. Turton JF, Perry C, Elgohari S, Hampton CV. PCR characterization and typing ofKlebsiella pneumoniae using capsular type-specific, variable number tandem repeat
```
and virulence gene targets. J Med Microbiol 2010;59(Pt 5):541–7.25. Wan Y, Mills E, Leung RCY, Vieira A, Zhi X, Croucher NJ, et al. Alterations in
```
```
chromosomal genes nfsA, nfsB, and ribE are associated with nitrofurantoin resistancein Escherichia coli from the United Kingdom. Microb Genom 2021;7(12):000702.
```
26. Wand ME, McCowen JW, Nugent PG, Sutton JM. Complex interactions of Klebsiellapneumoniae with the host immune system in a Galleria mellonella infection model. J
```
Med Microbiol 2013;62(Pt 12):1790–8.
```
27. Wand ME, Taylor HV, Auer JL, Bock LJ, Hind CK, Jamshidi S, et al. Evaluating thelevel of nitroreductase activity in clinical Klebsiella pneumoniae isolates to support
```
strategies for nitro drug and prodrug development. Int J Antimicrob Agents2019;54(5):538–46.
```
28. Wand ME, Baker KS, Benthall G, McGregor H, McCowen JW, Deheer-Graham A,et al. Characterization of pre-antibiotic era Klebsiella pneumoniae isolates with re-
```
spect to antibiotic/disinfectant susceptibility and virulence in Galleria mellonella.Antimicrob Agents Chemother 2015;59(7):3966–72.
```
29. Investigation of urine. UK Standards for Microbiology Investigations. Public
```
Health England; 2019.30. Bortolaia V, Kaas RS, Ruppe E, Roberts MC, Schwarz S, Cattoir V, et al. ResFinder 4.0
```
```
for predictions of phenotypes from genotypes. J Antimicrob Chemother2020;75(12):3491–500.
```
31. The European Committee on Antimicrobial Susceptibility Testing. Breakpointtables for interpretation of MICs and zone diameters, version 12.0; 2022.
32. Spencer D, Morgan H. High-speed single-cell dielectric spectroscopy. ACS Sens2020;5(2):423–30.
```
L.J. Bock, D.C. Spencer, B.K. Martin et al. Journal of Infection 91 (2025) 106549
```
9
Rapid antimicrobial susceptibility
testing using carbon screen printed
electrodes in a microfluidic device
Saranya Gopalakrishnan1,3, Diksha Mall2,3, Subramaniam Pushpavanam1 &
Richa Karmakar2
```
The development of rapid, sensitive, and affordable antimicrobial susceptibility testing (AST) is
```
essential for controlling antibiotic overuse, thereby creating a critical checkpoint for the emerging
antimicrobial resistance threat. Here, we introduce a novel method of electrochemical monitoring of
bacterial growth in a diluted low-conductivity nutrient medium for rapid susceptibility testing using
impedance spectroscopy. The method works on the change in charge transfer resistance exhibited by
```
bacteria in response to antibiotics. The proposed Electrochemical Microfluidic device (ε-μD) employs
```
low-cost carbon screen-printed electrodes and uses a simple microfluidic geometry. We explored the
utilisation of a diluted nutrient medium as an electrolyte since it provides a higher charge transfer
baseline signal for better sensitivity and supports the growth of the bacteria required for detection.
The method enables sensitive detection of bacteria even at a low density of 84/mm2 in three hours of
incubation time. For proof of concept, bacteria such as Escherichia coli and Bacillus subtilis were used,
and the efficacy of the ampicillin and tetracycline drugs were tested. The experiments were done with
the spiked urine samples, which correlated well with the controlled sample. The proposed system
enhances the accessibility and affordability of rapid susceptibility testing, enabling its widespread use.
Keywords Impedance spectroscopy, Antimicrobial susceptibility testing, Microfluidics, Carbon electrodes,
Charge transfer resistance
```
Antimicrobial resistance (AMR), a defensive technique of microorganisms against antimicrobials, has been
```
```
identified as one of the top ten threats to global health by the World Health Organization (WHO)1. It is estimated
```
```
that 4.95 million deaths globally (2019) have been associated with bacterial AMR, with its highest incidence in
```
```
limited-resource regions2. Antimicrobial susceptibility testing (AST) determines the resistance and susceptibility
```
profile of available drugs for specific infections and ensures their effectiveness in treatment3. AST is an important
strategy in mitigating the burden of AMR by controlling the irrational use of antibiotics4,5.
```
The conventional gold-standard culture-based AST is labour-intensive and has a longer turn-around time (48–
```
```
72 h)6. Most bacterial infections spread faster, so timely detection of infection and administration of appropriate
```
drugs is essential for better patient outcomes. Several genotypic methods based on polymerase chain reaction
principles are emerging to identify resistant genes in the bacteria. Although these methods produce rapid results
with high throughput, they have several challenges: the requirement of sophisticated instruments, continuous
updation of resistance profiles, and confirmation of results from phenotypic testing7,8. Other techniques have
been developed for rapid AST, like determining bacterial growth by microscopy or spectroscopy, biochemical
profiling by mass spectrometry, and detecting micromotions of bacteria using a cantilever in Atomic force
microscopy. However, these techniques are cost-intensive and require highly skilled technician, which makes
them challenging to implement in resource-constrained places8–10.
Electrochemical impedance spectroscopy is a fast, robust, and label-free diagnostic tool for bacterial detection
```
and AST11. Sensors using inter-digitated electrodes (IDEs) have widely been reported to enable rapid bacterial
```
detection and AST where sample volume is reduced to a few μL12–14. Using a different approach, Hannah et
al., utilised commercially available gold screen-printed electrodes with an agarose gel deposit for rapid AST
detection15. The major challenges of these techniques are the device fabrication and their cost since they use
precious metals for fabricating electrodes. The incorporation of electrochemical detection in microfluidic
systems has gained attention, expediting detection using small sample volumes, ranging from a few nanoliters
1Department of Chemical Engineering, Indian Institute of Technology Madras, Chennai 600036, India. 2Department
of Biotechnology, Indian Institute of Technology Madras, Chennai 600036, India. 3These authors contributed equally
```
to this work: Saranya Gopalakrishnan and Diksha Mall. email: spush@iitm.ac.in; rkarmakar@iitm.ac.in
```
OPEN
```
Scientific Reports | (2025) 15:5133 1| https://doi.org/10.1038/s41598-024-84286-3
```
www.nature.com/scientificreports
to picoliters5,16. These electrochemical microfluidic devices focus on capturing a single to a few tens of bacteria,
giving high sensitivity17–20.
In this work, we propose a rapid and affordable phenotypic AST using electrochemical impedance
```
spectroscopy (EIS) in screen-printed carbon electrodes and simple microfluidic geometry. We termed our
```
```
device as ε-μD (electrochemical microfluidic device). Further, we have used a dilute low-conductivity nutrient
```
medium as an electrolyte, which provides a higher impedance baseline signal while supporting the growth
required for the sensitive determination of susceptibility. We show that the charge transfer resistance decreases
```
with respect to time due to bacterial growth, even in the presence of a low number of bacteria (#84/mm2).
```
As the ε-μD depends on bacterial growth, the effect of cell growth with antibiotics was correlated with the
change in impedance of the electrical signal. We establish the proof-of-concept of the proposed device using
```
gram-negative (E. coli, ATCC 25922) and gram-positive bacteria (B. subtilis, ATCC 6051) against ampicillin
```
```
(bactericidal) and tetracycline (bacteriostatic) antibiotics. We also tested the efficacy of the device to determine
```
the AST of spiked E. coli from the urine sample matrix against tetracycline. With its high sensitivity and low-
cost fabrication, the proposed device has the potential to democratise rapid susceptibility testing. The fabricated
device is fast, affordable, feasible, sensitive, and easy to handle, and it meets all the criteria prioritised by the
WHO for rapid AST diagnosis21.
Results and discussion
Optimising electrolyte with bulk solution
The selection of appropriate electrolytes is a crucial step in developing EIS sensors. In bacterial detection, low-
conductivity materials are preferred as electrolyte since they provide a higher sensitivity of the sensor. These
materials allow higher absolute impedance values and mainly exhibit enhanced sensitivity to impedance changes
compared to high-conductivity medium/buffers22. We aim to optimise the electrolyte composition to provide a
higher impedance baseline signal while supporting bacterial proliferation necessary for AST sensing. To achieve
```
this, the impedance and growth profile for the different strengths (10, 25, 50, 75, 100% (v/v) of medium/water)
```
```
each of Luria-Bertani (LB) and tryptone nutrient medium (TNM) were investigated. Platinum was used as the
```
```
working and counter electrode in a 10 mL sample volume (Supplementary Fig. S1). The impedance value of 10%
```
```
TNM was strikingly higher (~ 3 times) than 10% LB (Supplementary Fig. S2a). This confirmed that the TNM
```
has a higher baseline signal, and further experiments were conducted with TNM. Figure 1a shows the Nyquist
plot for the different strengths of TNM. The impedance value increased as the tryptone strength decreased.
```
The conductivity measurement also supports the impedance results (Supplementary Table S1). The effect of
```
```
diluted tryptone medium on bacterial growth (E. coli) was calculated using an exponential fit to the log phase
```
```
of growth curves. It was found that the doubling time was higher in the 10% TNM (88 ± 1 min) than in the
```
```
relatively rich medium, i.e. 100% TNM (52 ± 3 min) (Fig. 1b). A relatively low turbidity was observed in the 10%
```
```
TNM (Supplementary Fig. S3a). However, 10% TNM could support growth for high bacterial concentration
```
```
(~ 107 CFU/mL), enabling AST determination (Supplementary Fig. S3b). Though 5% TNM showed the highest
```
```
impedance (Supplementary Fig. S2b), we found that it does not support bacterial growth, and there is no turbidity
```
```
for 5% TNM (Supplementary Fig. S3b and a). So, 10% TNM is an excellent choice of electrolyte because it
```
```
shows a higher impedance signal (~ 10 times than absolute tryptone medium) and is suited for bacterial growth.
```
Therefore, in all the experiments, this was used as an electrolyte.
```
The experimental data from the Nyquist plot was fitted to the equivalent circuit model (ECM) to extract
```
specific analytical parameters. The classical Randle’s circuit model was typically used to obtain parameters
```
such as solution resistance (Rs) at high frequency, capacitive double layer CDL / charge transfer resistance Rct
```
```
at low frequency, and diffusional Warburg impedance (Zw) at very low frequency23. Rs measures a relatively
```
large change in ionic components of the bulk solution, and Rct measures resistance at the electrode-electrolyte
interface. In this study, an improved Randle’s circuit model was used to fit 10% TNM, as shown in Fig. 1c.
```
The improved ECM has two key modifications: (a) Replacement of CDL with constant phase element QDL (b)
```
Replacement of Zw with constant phase element QD to capture diffusion process. These modifications were made
based on the experimental condition, mainly to capture the non-ideality of 10% TNM solution. Long et al., have
```
replaced double layer capacitance with constant phase element (CPE) to incorporate the roughness and porous
```
```
electrode24. ECM was found to fit the experimental data clearly well as represented by solid line in Fig. 1d (blue
```
```
line).
```
```
Next, the effect of bacterial presence in the impedance spectrum of electrolyte (10% TNM) was investigated.
```
```
Different concentrations of bacteria (108, 5 × 108, 109 CFU/mL) were added to the electrolyte, and the impedance
```
```
spectrum was analysed immediately (Fig. 1d). The impedance values decreased as the bacterial concentration
```
increased. Bacterial cells at high concentrations facilitate the transfer of electrons between working and counter
electrodes, acting like pearl chains24. The parameters obtained by fitting the ECM to the experimental data
```
are given in Supplementary Table S2. The improved Randle’s circuit fit the experimental data well (χ2 < 0.05).
```
Further, as detailed in the upcoming section, the normalised impedance signal calculated from the extracted Rct
was used as a response signal for bacterial detection and susceptibility testing.
```
Electrochemical microfluidic device (ε-μD) design and bacterial detection
```
```
Figure 2a shows a schematic of the ε-μD employed for bacterial detection and AST (Supplementary Fig. S4a
```
```
represents the setup). The parameters such as the nature of the electrode, its area, the distance between the
```
```
working electrode (WE) and counter electrode (CE), and sample volume greatly influence the impedance signal.
```
Here, we have used low-cost carbon electrodes suitable for high-throughput screening. Reducing the electrode
area and sample volume and increasing the gap between electrodes can result in a higher impedance baseline,
giving better sensitivity. However, it is essential to strike a balance in choosing these factors optimally to obtain
a reliable signal from the potentiostat, especially when working with low-conductivity electrolytes. The optimal
```
Scientific Reports | (2025) 15:5133 2| https://doi.org/10.1038/s41598-024-84286-3
```
www.nature.com/scientificreports/
```
dimensions of the microfluidic device were (1.5 mm (W) × 14 mm (L) × 0.5 mm (D)) with an electrode width
```
of 0.5 mm. The characterization of the PDMS microfluidic channel using profilometry and microscope showed
```
that the dimensions were 1.5 ± 0.015 mm (W) × 14 ± 0.05 mm (L) × 0.500 ± 0.001 mm (D). The height and width
```
of the electrode was 531 ± 0.64 μm and 4.7 ± 0.12 μm. The device used two sets of electrode pairs, WE1-CE1 and
```
WE2-CE2, which served as duplicates (Fig. 2a). The electrodes were functionalised with poly-L-lysine (PLL).
```
This cationic polymer imparts a positive charge to the electrodes, thereby effectively immobilising bacteria by
electrostatic interaction on the surface of the electrodes25,26. The sample containing bacteria was introduced into
the ε-μD, incubated for 30 min to immobilise them, washed with electrolyte, ultra-low conductivity medium
```
(Supplementary Table S1, 10% TNM – 560 μS/cm) to remove the sample matrix, and the impedance was
```
```
measured over time (details in the method section) (Fig. 2b). The change in the impedance was correlated with
```
the bacterial concentration.
The use of low conductive growth medium/buffer has gained more popularity in bacterial detection
and susceptibility testing, where the changes in solution resistance have been correlated with the efficacy of
antibiotics11,27. On the other hand, some studies have focused on utilising the low conductivity PBS buffer/
deionised water to directly detect bacteria with a change in charge transfer resistance as a response signal24,28.
While this method can yield more sensitive results due to lower conductivity, it cannot support bacterial growth.
In our novel approach, we use a growth-supporting medium to observe charge transfer resistance as a response
signal. This is achieved by diluting a low-conductivity nutrient medium to obtain an ultra-low conductivity
```
medium (10% TNM – 560 μS/cm) where charge transfer resistance is dominant. Moreover, 10% diluted TNM
```
could support bacterial growth as well. This provides an ideal medium for obtaining higher sensitivity than high
```
strength-low conductivity medium (100%) and non-growth supporting buffer/DI.
```
```
Fig. 1. Optimization of the electrolyte using bulk solution (10 mL) (a) Nyquist plot showing the effect of
```
```
different tryptone nutrient medium (TNM) strengths on the impedance signal. (b) Effect of varying strength
```
```
of TNM on the bacterial growth, showing the compatibility of bacterial growth on 10% TNM (c) Equivalent
```
```
circuit model developed to obtain the charge transfer resistance signal from the Nyquist plot (d) Nyquist plot
```
with the variable concentration of bacteria in 10% TNM with solid line representing the model fit.
```
Scientific Reports | (2025) 15:5133 3| https://doi.org/10.1038/s41598-024-84286-3
```
www.nature.com/scientificreports/
The number of bacteria immobilised on the device was measured for different initial concentrations of
```
bacteria using fluorescence microscopy (Fig. 2c). This number represents the actual bacteria that are responsible
```
for the impedance change caused by bacterial growth. Insets in Fig. 2c show microscopic images of immobilised
bacteria for different initial concentrations. The number of immobilised bacteria was 84 ± 6 per mm2 for an
```
initial concentration of 105CFU/mL (1,764 immobilised bacteria/device where device area is 21 mm2). This
```
increases logarithmically with the concentration.
The electrical response to bacterial growth on the ε-μD over time was monitored. For this, impedance
measurement was carried out immediately after introducing electrolyte corresponding to t = 0 h. The device was
```
then incubated for specified intervals (t = 3 and 6 h), and the spectrum was measured. We experimented with
```
```
different initial concentrations of bacteria (105−108 CFU/mL) and measured EIS over the incubation period
```
of 6 h. Figure 2d shows a representative Nyquist plot at different incubation times for a 106 CFU/mL initial
concentration. Similar plots for other initial bacterial concentrations are shown in Supplementary Fig. S5. This
plot reveals that bacterial growth causes a significant change in the impedance value. This is evident by tracking
the elbow point, connecting the semi-circle and linear tail. With increased incubation time, the elbow point shifts
from right to left, signifying the decrease in charge transfer resistance. Bacterial growth leads to the production
of ionic metabolites, which strikingly alter the impedance characteristic of the electrochemical cell11,18. The
observed change in charge transfer resistance is attributed to the release of metabolites during bacterial growth
```
and also the bacterial presence itself acting as a pearl chain24 (Fig. 1d). The solid lines in Fig. 2d represent the
```
proposed model fit to the experimental data as explained in ‘Optimizing electrolyte with bulk solution’ section.
The improved model developed in the bulk solution experiments was found to fit well with the experimental
```
data of the ε-μD and is used to extract Rct. The normalised impedance signal (NIS), based on the change in
```
charge transfer resistance, was used as a response signal, as defined in the materials and method section.
```
Figure 2e shows the NIS (-ΔRct/Rct0) for different initial concentrations of bacteria (105−108 CFU/mL) over
```
```
the incubation period of 6 h. Blank experiments (without bacteria) were performed to ensure the observed charge
```
transfer resistance was only due to bacterial growth and not to artefacts like evaporation losses. No changes in
```
charge transfer resistance for blank experiments (0.010 ± 0.006) were observed during the incubation times till
```
6 h, thereby confirming that only bacterial growth determines NIS. A distinct NIS value was obtained for the test
```
Fig. 2. Bacterial detection using the proposed electrochemical microfluidic device (ε-μD). (a) Schematic of the
```
electrochemical microfluidic device employed for bacterial detection and susceptibility testing, WE- working
```
electrodes; CE- counter electrodes. (b) Schematic illustrating the working principle of ε-μD. (c) Determination
```
```
of immobilised bacteria (after washing) as a function of initial bacterial concentration. Inset figure displays
```
representative fluorescent microscopic images for each concentration using a 50X objective. The scale bar is
```
10 μm. **** denotes p < 0.0001 and *** denotes p < 0.001 (d) Nyquist plot showing the effect of bacterial growth
```
```
over time on the ε-μD with an initial bacterial concentration of 106 CFU/mL (e) Normalized impedance signal
```
```
(-ΔRct/Rct0) over incubation times (3, 6 h) for different initial bacterial concentration (105– 108 CFU/mL). Only
```
immobilised bacteria are responsible for the observed NIS. Even it could detect #84/mm2 immobilised bacteria
after washing, initially corresponding to 105 CFU/mL.
```
Scientific Reports | (2025) 15:5133 4| https://doi.org/10.1038/s41598-024-84286-3
```
www.nature.com/scientificreports/
samples with bacteria. NIS at t = 3 h increased with initial bacterial concentration. A NIS value of 0.067 ± 0.008
```
was observed even at #84/mm2 (initial concentration: 105 CFU/mL), which was found to be significantly higher
```
```
than the blank experiment (n = 3, p < 0.001). This confirms the high sensitivity of the proposed device. The NIS
```
```
value increases with incubation time t = 6 h for 105 and 106 CFU/mL. For higher bacterial concentrations (107
```
```
and 108 CFU/mL), the NIS value saturates at t = 3 h. Figure 2e serves as a calibration chart to quantitatively
```
estimate bacteria. However, it is important to note that the quantitative estimation reported here is bacterial-
specific.
```
We calculated the limit of detection (LOD) using the calibration curve of the normalized impedance signal
```
```
at t = 3 h with immobilized bacteria (Supplementary Fig. S6). The LOD was estimated to be 525 CFU (3.3 σ/S),
```
where σ represents the standard deviation of the response and S is the slope of the linear regression equation.
```
The initial bacterial concentration corresponding to the LOD (525 CFU) was determined to be 2 × 104 CFU/mL,
```
as calculated using the linear equation obtained from Fig. 2c.
Antimicrobial susceptibility testing using the proposed ε-μD
After establishing that the proposed ε-μD can detect the bacteria successfully, its utility for AST was investigated.
Two identical microfluidic devices were employed to achieve the susceptibility testing, and the steps involved
```
in the bacterial detection described in the previous section (Fig. 2b) were followed. The detailed steps are given
```
as a flowchart in Supplementary Fig. S7. In the first device, the experiment was performed without antibiotics,
```
referred to as a positive control (PC). The impedance change obtained using a PC device is termed as ΔZ1. In
```
the second, the antibiotic was added to the 10% TNM and introduced into this device, termed AST-device
```
(Antibiotic susceptibility testing device). The change in impedance observed before and after incubation with
```
AST-device is termed ΔZ2. A PC device was used to confirm the bacterial presence and metabolite production,
and it served as a control for each test experiment. It is anticipated that if cells are susceptible, cell division and
```
metabolite production will not occur in response to drug action. Hence, the impedance change (ΔZ2) will be
```
low for susceptible bacteria and ΔZ1 > ΔZ2. On the contrary, if the cells are resistant, cell division and metabolite
production progress as usual, and we would have ΔZ2 ≈ ΔZ1 > 0.
To determine susceptibility, experiments were performed using strains of E. coli susceptible and resistant to
ampicillin. An initial bacterial concentration of 107 CFU/mL was employed in all susceptibility experiments.
```
Figure 3a and b shows the Nyquist plot of susceptible and resistant E. coli at (t = 0 h) and after incubation (t = 3 h).
```
It is evident that the elbow point, which is a measure of the Rct, remains constant after incubation with 10 μg/
```
mL of ampicillin (Fig. 3a). In contrast, for resistant bacteria exposed to 50 μg/mL ampicillin, the elbow point
```
```
Fig. 3. Antimicrobial susceptibility testing using proposed ε-μD (a) Nyquist plot before and after an
```
incubation time of 3 h for susceptible bacteria at 10 μg/mL ampicillin. Inset image: microscopic observation
```
at 100X objective showing red fluorescence, indicating the dead bacteria on the device. Scale bar: 10 μm (b)
```
Nyquist plot over incubation time for resistant bacteria at 50 μg/mL ampicillin. Microscopic observation
```
showing green fluorescence, indicating the viable bacteria on the device displayed in the inset (c) NIS for
```
susceptible and resistant bacteria with different concentrations of ampicillin. Here, PC denotes positive control,
```
bacteria without antibiotics. ** indicates p < 0.01, ns indicates not significant (p > 0.05).
```
```
Scientific Reports | (2025) 15:5133 5| https://doi.org/10.1038/s41598-024-84286-3
```
www.nature.com/scientificreports/
```
moves to the left (Fig. 3b). Decrease of Rct denotes that the bacteria are growing even at this high concentration
```
of antibiotic, which confirms that they are resistant to ampicillin. To test the viability of bacteria, the device
```
was stained with SYTO9/ propidium iodide (PI) dyes (BacLight bacterial viability kit) after the incubation for
```
```
both cases with or without antibiotics (Inset of Fig. 3b and a). Susceptible bacteria emit red fluorescence (Inset
```
```
of Fig. 3a), revealing its loss in membrane integrity due to ampicillin action and allowing its penetration to PI
```
```
dye. Whereas, resistant bacteria emit green fluorescence (Inset of Fig. 3b), indicating cell integrity and non-
```
penetration of cell impermeable PI stain.
The solid lines in Fig. 3a and b show that the model fits the experimental data, and extracted Rct was used
to determine the NIS. Susceptibility experiments were performed with different concentrations of ampicillin
for both strains till the NIS was found to be low. For susceptible strains, NIS values at 10 and 20 μg/mL were
significantly lower from the PC. For resistant bacteria, NIS at 50 μg/mL was not statistically significant from
the PC, as shown in Fig. 3c. Only at 100 μg/mL, the resistant bacteria showed a low impedance change when
compared to PC.
```
According to the Central Laboratory Standard Institute (CLSI), for E. coli, when the minimum inhibitory
```
```
concentration (MIC) of ampicillin is greater than 32 μg/mL, the bacteria is defined as a clinically resistant species.
```
Thus, the observed resistant/susceptible profile was found to align well with the standards set by CLSI29. The
susceptibility and resistance profile of the bacteria were validated using a standard disc diffusion test, following
CLSI guidelines. Supplementary Figure S8 shows the disc diffusion test for the susceptible and resistant bacteria.
```
A zone of inhibition (ZOI) of 17.4 ± 0.2 mm with ampicillin (10 μg/disc) was observed for the susceptible strain
```
```
(Supplementary Fig. S8a), which is greater than 17 mm, set by CLSI for the susceptible strain. For resistant
```
```
bacteria, no ZOI was observed (Supplementary Fig. S8b). These results demonstrate that the proposed ε-μD
```
could successfully determine the resistant/susceptible profile of bacteria and match well with the CLSI standards.
The versatility of the proposed ε-μD was tested through experiments with tetracycline, a bacteriostatic
antibiotic, and with Bacillus subtilis, a gram-positive bacteria. Figure 4 shows the NIS of E. coli and B. subtilis
exposed to each of 10 μg/mL of ampicillin and 5 μg/mL of tetracycline. For E. coli, the NIS of the device treated
```
with tetracycline and ampicillin was statistically significant from the PC (n = 3, p< 0.05), revealing that the
```
Fig. 4. Antimicrobial susceptibility testing for E. coli and B. subtilis against ampicillin and tetracycline
antibiotics. The NIS plot shows the adaptability of the proposed ε-μD for other antibiotic and bacterial types.
```
PC: positive control without antibiotic, amp: 10 μg/mL of ampicillin and tet: 5 μg/mL of tetracycline. **
```
```
indicates p < 0.01, * indicates 0.01 < p < 0.05, ns: not significant (p > 0.05).
```
```
Scientific Reports | (2025) 15:5133 6| https://doi.org/10.1038/s41598-024-84286-3
```
www.nature.com/scientificreports/
```
bacteria were susceptible to both antibiotics. The ZOI was found to be 20 ± 0.4 mm (Supplementary Fig. S8a)
```
```
with tetracycline (30 μg/disc), which is in line with CLSI’s guideline of ZOI ≥ 15 mm for susceptible strain29.
```
For B. subtilis, NIS for both antibiotics was not statistically significant from the PC, indicating that B. subtilis
was resistant to both drug types. Hence, the proposed device also worked well for gram-positive species, such
as B. subtilis. The obtained susceptibility profiles were validated with a disc diffusion test where no ZOI was
```
formed for B. subtilis for both antibiotics (Supplementary Fig. S8c). These results reveal that the proposed ε-μD
```
```
is highly versatile and applicable to both bacterial types (gram-positive and gram-negative bacteria) and drug
```
```
types (bacteriostatic and bactericidal), as it works on the growth of the bacteria.
```
Validation using human urine samples
The proposed ε-μD was tested for its ability to detect bacterial presence in human urine samples, followed by
AST. The urine samples were collected from the Institute Hospital at the Indian Institute of Technology Madras,
India, from both men and women undergoing routine urine examinations. The pathology reports were used
to confirm that the samples were bacteria-free. Hence, the samples were spiked with bacteria to perform AST.
```
Three different sets of experiments were conducted: (i) Negative (N) sample: Urine sample without bacteria (ii)
```
```
Positive (P) sample: urine sample with spiked bacteria (E. coli-ATCC25922, 107 CFU/mL) (iii) Antibiotic (A)
```
```
treated sample: AST-device with a positive sample treated with tetracycline (5 μg/mL). The urine samples, with or
```
without bacterial spiking, were directly loaded into the device without pre-treatment and subjected to bacterial
detection and susceptibility testing. Figure 5 shows the NIS obtained from the urine samples. The blank sample
```
without urine showed a negligible NIS value, whereas the negative urine samples (N1, N2, N3) showed a low NIS
```
```
value. This is due to different ions in the sample matrix. All positive urine samples spiked with bacteria (P1, P2,
```
```
P3) showed a striking higher value of NIS (p < 0.05) when compared to negative samples. A minimum value of
```
```
NIS was obtained for the antibiotic-treated device (A1, A2, A3) when compared to positive samples (p < 0.01),
```
confirming its susceptibility against tetracycline. We conclude that the proposed ε-μD displays the expected
higher NIS for a positive sample containing susceptible bacteria as compared to a negative and antibiotic-treated
sample. This result suggests that our device is highly robust and can be used to determine AST using urine
samples with a complex matrix.
```
Fig. 5. Normalized impedance signal (-ΔRct/Rct0) to test the efficacy of the proposed method in human urine
```
```
samples. Blank represents NIS in 10% TNM. A negative sample (N1, N2, N3) indicates a urine sample without
```
```
spiking of E. coli. The positive sample (P1, P2, P3) denotes 107 CFU/mL spiking of E. coli in the urine sample.
```
The positive sample is treated with antibiotic tetracycline: 5 μg/mL, denoted as A1, A2, and A3. *** indicates
p < 0.001, ** indicates p < 0.01, * indicates 0.01 < p < 0.05.
```
Scientific Reports | (2025) 15:5133 7| https://doi.org/10.1038/s41598-024-84286-3
```
www.nature.com/scientificreports/
Comparison with existing literature
The performance of our device was compared with existing literature, and this is summarized in Supplementary
```
Table S3. This is grouped into: (A) bacterial detection and (B) susceptibility testing. Studies in the first group often
```
use biorecognition elements like lectins or antibodies to correlate impedance changes with bacterial concentration
```
(Supplementary Table S3, Group A). For example, Rengaraj et al. (2018)30used lectin-immobilized carbon
```
```
electrodes on paper substrates, achieving a detection limit of 1.9 × 10³ CFU/mL. Ruan et al. (2002)31employed
```
antibody-coated indium tin oxide electrodes for detecting 6 × 10³ CFU/mL of E. coli. Recently, Akhtarian et al.
```
(2024)32 integrated cell-imprinted polymers on stainless steel microwires in a microfluidic device, achieving a
```
detection of 2 × 10² CFU/mL. These methods required ~ 30 min but were limited to bacterial detection only.
```
Previous studies on antimicrobial susceptibility testing (Supplementary Table S3, Group B) employed diverse
```
```
approaches. Swami et al. (2022)27 used low-conductivity zwitterionic buffers with inter-digitated electrodes
```
```
(IDE) to measure solution resistance changes caused by ionic release from bacteria exposed to surface-acting
```
```
antibiotics (20 min detection time, 2 × 105CFU). Growth-based measurements require around 80 min. Hannah
```
```
et al. (2019)15utilized screen-printed gold electrodes (SPE) with nutrient gels containing antibiotics and redox
```
```
mediators. They correlated impedance changes with bacterial susceptibility (60 min, 5 × 10⁴ CFU). Yang et al.,
```
```
(2020)17 integrated electrical measurement in nano-constricted microfluidic channels and correlated electrical
```
```
resistance with susceptibility testing (2 h, 60 CFU). However, these methods rely on costly electrodes (IDE/SPE)
```
or complex microfluidic designs, limiting scalability.
Our device demonstrates high sensitivity, detecting immobilized bacteria at levels as low as ~ 84 cells/
```
mm² (1764 CFU immobilized). This is equivalent to ~ 1000 CFU, based on a sample volume of just 10 μL. The
```
detection limit is estimated at 525 immobilized bacteria. This enables accurate detection at the widely accepted
```
diagnostic threshold for urinary tract infections (UTIs) of > 10⁵ CFU/mL34, with a minimal sample volume.
```
Besides it works directly with the crude urine sample. This is particularly advantageous for rapid, resource-
efficient diagnostics, especially in low-resource settings. Furthermore, the device’s compact design and reliance
on cost-effective screen-printed carbon electrodes ensure affordability and accessibility for widespread clinical
use, including high-throughput testing. Compared to conventional methods that often require larger volumes,
longer processing times, or expensive instrumentation, our device offers a simplified, faster, and more affordable
alternative.
Recent studies propose lowering the diagnostic threshold for UTIs to 10³–10⁴ CFU/mL, highlighting
the need for even greater sensitivity in detection34. To address this, integrating preconcentration techniques
such as acoustic or inertial microfluidics or centrifugation into our existing device is a promising avenue.
These advancements would enhance detection capabilities without compromising the device’s affordability or
simplicity, making it suitable for a broader range of clinical applications and improving diagnostic outcomes in
real-world scenarios. This represents a significant future direction for our work.
Conclusions
We propose a lab-on-chip device with a low-cost carbon electrode embedded in a microfluidic device for
```
rapid bacterial detection and susceptibility testing. The diluted low-conductivity medium (10% TNM) was
```
selected as an electrolyte as it has a higher impedance baseline signal and supports the growth of bacteria to
```
obtain high sensitivity of the device (# 84/mm2). Normalised impedance signal (NIS), based on the change
```
in charge transfer resistance, was used as a response signal as an alternative to current widely used solution
resistance, particularly in growth-based impedance spectroscopy. The proposed method correlates NIS with the
bacterial concentration and susceptibility/resistant profile of bacteria within an incubation time of 3 h. It was
demonstrated to be applicable to both gram-positive and gram-negative bacteria and different antibiotic modes
of action. In addition, we have demonstrated the device’s efficacy in performing AST in human urine samples.
With its low-cost, sensitive, and easy-to-use features, the proposed device could enable widespread susceptibility
testing to combat antimicrobial resistance, particularly in rural settings.
Materials and methods
Preparation of bacterial culture and antibiotics
```
Experiments were performed using gram-negative bacteria Escherichia coli (ATCC 25922) and gram-positive
```
```
bacteria Bacillus subtilis (ATCC 6051). The cells were grown overnight in a tryptone nutrient medium (TNM)
```
```
(1.5% w/v, from Himedia Labs, India) at 37 °C, 240 rpm. The culture was centrifuged at 4000 rpm for 5 min,
```
and the pellet was resuspended with 10% TNM . Optimisation steps for obtaining 10% TNM are described in
```
the next section. The optical density of bacterial culture was measured at 600 nm wavelength (A600) using a UV-
```
```
visible spectrophotometer (Shimadzu UV-1800). It was estimated that a 0.1 optical density (OD) corresponds
```
to 108 CFU/mL bacteria using the standard spread plate method. Accordingly, different bacterial concentrations
```
(105 – 108 CFU/mL) were prepared by serial dilution using 10% TNM. Similar experiments were also performed
```
with the ampicillin-resistant bacteria. The ampicillin-resistant strain was developed by gradually increasing the
```
concentration of ampicillin (10, 30, 50, 70 μg/mL). A standard disk diffusion test confirmed this as per CLSI
```
```
2019 guidelines (Supplementary Fig. S8b). To study the effect of nutrient medium, bacteria were also cultured
```
```
in Luria-Bertani (LB) broth (2.5% w/v, composition of 10 g/L tryptone, 5 g/L NaCl and 5 g/L yeast extract,
```
```
from Himedia Labs, India). The antibiotics stock solution containing 50 mg/mL of ampicillin sodium salt (SRL,
```
```
India) and 50 mg/mL of tetracycline (SRL, India) were dissolved in sterile deionised water. All experiments
```
```
were conducted using ultrapure deionised water (resistivity of ≥ 18.2 MΩ-cm) obtained from the MilliQ IQ7000
```
unit of Millipore Corporation. The working concentrations of antibiotics were freshly prepared for every set of
experiments.
```
Scientific Reports | (2025) 15:5133 8| https://doi.org/10.1038/s41598-024-84286-3
```
www.nature.com/scientificreports/
Selection of the electrolyte
```
The electrolyte was selected based on its ability to provide a higher impedance (electrical signal) to ensure
```
```
sensitivity and maintain bacterial growth. Different strengths (10, 25, 50, 75 and 100%) of TNM and LB on
```
impedance signal and bacterial growth were studied to optimise electrolyte concentrations. The different
strengths of the medium were obtained by diluting using sterile deionised water. For example, 10% TNM was
```
prepared by diluting (1:10) full-strength medium (100% TNM − 1.5%w/v tryptone). The experiments were
```
```
conducted either in the 10 mL bulk TNM or the LB solution, with a platinum (Pt) electrode of 0.5 mm diameter
```
```
as the working electrode (WE) and 2 mm as a counter electrode (CE). Conductivity was measured using a
```
```
conductometer (Hach HQ series Multimeter) for different concentrations of TNM (Supplementary Table S1).
```
```
Electrochemical impedance spectroscopy (EIS)
```
```
The impedance spectrum was measured using a portable potentiostat (Metrohm DropSens, STAT-I 400s). The
```
potentiostat is connected with the electrochemical microfluidic device using an I-CABSTAT1 cable connector
```
with crocodile clips (2 mm) as shown in Supplementary Fig. S4c. Impedance was measured between the working
```
```
and counter electrodes with a sinusoidal frequency between 1 MHz to 50 Hz and 50 mV (AC) voltage. The
```
```
obtained Nyquist plot was fitted with an improved Randle’s equivalent circuit model (ECM) using the in-
```
```
built EIS fitting analyser in DropView 8400 software (Fig. 1c). The model fit provided individual impedance
```
components, which were used to calculate the normalised impedance signal, as explained in the later section
```
(bacterial detection by ε-μD).
```
Bacterial growth
The effect of different strengths of TNM on bacterial growth was studied using batch experiments. 100 μL of
```
overnight grown culture was inoculated into 100 mL of TNM of various strengths (10, 25, 50, 75, and 100%).
```
```
The growth was measured using OD600 for every hour till 6 h. The growth curve (Number of CFU/mL Vs time)
```
```
was obtained using the standard curve (OD Vs CFU/mL). The growth rate, r (slope), was determined by fitting
```
```
an exponential curve to the log phase of the growth curve. The doubling time was computed as td = ln(2)/r for
```
each nutrient medium.
Also, experiments were conducted to study the effect of bacteria on a 10% TNM impedance signal. For this,
```
various concentrations of bacteria (109, 5 × 108, and 108 CFU/mL) were prepared in 10% TNM, and EIS was
```
measured immediately.
Fabrication of screen-printed electrode and microfluidic device
Electrode fabrication- Carbon electrodes on the glass substrate were fabricated using the screen-printing
technique. A pre-determined pattern was created on the polyester screen mesh with photo-curable ink. Carbon
```
graphene paste (C2171023D1, Gwent Sun Chemical) was spread evenly over the screen mask using a plastic
```
```
palette to deposit electrodes onto the surface of the glass substrate (Blue star slides: 75 × 25 mm) and incubated
```
```
at 60 °C for 10 min, followed by 24 h at room temperature (RT). The dimensions of the electrodes were 25 mm
```
```
(L) × 0.5 mm (W) with 1 mm spacing between two electrodes. Two sets of electrode pairs, working electrodes
```
```
(WE) and counter electrodes (CE) (WE1-CE1, WE2-CE2), were used to serve as a replicate for measurement.
```
```
All four electrodes were functionalised with 30 μL of 0.1% Poly-L-lysine (PLL) (Sigma Aldrich) and incubated
```
at RT for 2 h to achieve bacterial attachment on the electrode surface.
```
Microfluidic device fabrication- The polydimethylsiloxane (PDMS) based microfluidic device with the
```
```
dimensions of 1.5 mm (W) × 14 mm (L) × 0.5 mm (D) was employed. The channels were designed using 3D
```
Builder software. The mould was printed using Stratasys J55 prime 3D printer, utilizing PolyJet technology.
```
The required design was printed using VeroUltra WhiteS (proprietary resin of Stratasys) resin. The resin was
```
cured using vat PhotoPolymerization. The designed part was removed from the support base material using the
```
2.9% alkaline (NaOH) solution. To make the PDMS-based microfluidic device, we mixed the silicon elastomer
```
```
and curing agent (9:1 ratio w/w) (SYLGARD 184 Silicone Elastomer Kit, Dow Chemical), deposited on the
```
3D printed mould, and incubated at 60 ºC for 12 h. The electrodes and PDMS microfluidic channel were
```
characterized using a surface profiler (Bruker 3D non-contact profiler contour GT). The following parameters
```
were used: White-light interferometry method, 10X magnification, Wavelength: 68.2 nm, scan speed: 4.36 μm/s.
The dimensions were measured using Bruker Vision version 4 software. To determine the length and width of
```
the microfluidic channel, Nikon Ni-E Upright microscope (1X objective lens) was used and measured using
```
ImageJ software. The PDMS device was attached to the PLL functionalised electrode by plasma bond using
```
Harrick Plasma Cleaner (PDC-002). 100 μL of electrolyte was passed through the channel to remove excess PLL.
```
This device was then used for bacterial detection and susceptibility testing. All devices were used for a single
time to avoid contamination.
Bacterial detection by ε-μD
```
A functionalised microfluidic device is loaded with the bacteria (105−108 CFU/mL), suspended in the electrolyte,
```
and incubated for 30 min to allow bacterial immobilisation. Next, the electrolyte was pumped into the device
```
using a syringe pump (Harvard Apparatus, Pump11 Elite 70–4501) at a 100 μL/min flow rate for 1 min to support
```
the bacterial growth. This step also removes the sample matrix from the device, which can otherwise potentially
```
affect the electrochemical measurement. A blank experiment (only electrolyte) was also performed without
```
bacteria to obtain the background signal. The proposed detection method relies on the change in impedance,
```
and any evaporation might lead to a background signal; therefore, it is critical to prevent evaporation. This was
```
```
achieved by saturating the tubes and the tube outlet with the electrolyte (Supplementary Fig. S4b). The EIS
```
```
spectrum was measured over different incubation times (t = 0, 3 and 6 h). It was performed under conditions
```
similar to those in the batch experiment. The impedance spectrum was fitted to the improved equivalent circuit
```
Scientific Reports | (2025) 15:5133 9| https://doi.org/10.1038/s41598-024-84286-3
```
www.nature.com/scientificreports/
```
model, and charge transfer resistance (Rct) was obtained each time, as discussed in the result section (optimising
```
```
electrolyte with bulk solution). The impedance data was then normalised to the corresponding initial signal
```
```
(Rct0) using the equation below.
```
```
Normalised impedance signal (NIS),
```
```
N IS = Rct − Rct0Rct0= (−∆ Rct)Rct0
```
Whereas Rct0 is charge transfer resistance at time t = 0 h and Rct is charge transfer resistance at different incubation
```
time = t.
```
Microscopic observation was performed to determine the immobilised bacteria for each initial bacterial
```
concentration. BacLight staining dye (ThermoFisher) was used for staining and observed using an epifluorescence
```
```
microscope (Nikon Ni-E upright fluorescence microscopy). Staining facilitates the visualisation of the attached
```
```
bacteria on the electrode. For this, 20 μL of dye (12 μM of SYTO-9 and 60 μM of PI) was passed through the
```
channel using a micropipette and incubated for 15 min to allow complete cell staining. Images were captured at
random locations in the device using 50X long working objective lens, and the number of bacteria was counted
using ImageJ software with macro batch processing35. The number of bacteria per mm2 was then calculated
using the average number of bacteria in each image and the area of captured images.
```
Antimicrobial susceptibility test (AST)
```
```
Susceptibility testing was conducted by running two parallel devices: a positive control (PC) and an antibiotic
```
```
susceptibility testing device (AST-device). The protocol for the susceptibility testing is similar to that of bacterial
```
```
detection. The electrolyte-containing bacteria (107 CFU/mL) was loaded into the device and incubated for
```
immobilisation. In the PC, electrolyte without antibiotics was introduced. In the AST-device, electrolyte along
with the antibiotic was introduced. For each bacterial strain, various concentrations of antibiotics were tested
until a statistically significant change in the NIS of the AST-device was observed with respect to PC. Ampicillin at
10 and 20 μg/mL concentrations was used for susceptible E. coli, whereas 50 and 100 μg/mL was used for resistant
E. coli. A low concentration of antibiotic was sufficient to inhibit bacterial growth for susceptible whereas a high
antibiotic concentration was required for resistant bacteria. EIS was measured at t = 0 h and t = 3 h incubation
of bacteria in ε-μD. The NIS for the PC and AST device was compared to determine the susceptibility profile.
A bacterial viability assay was performed using a Live/Dead BacLight kit to confirm the susceptibility profile.
Bacteria were stained after incubation with antibiotics in an AST-device using the BacLight stains, as explained
```
in the previous section. SYTO 9 (cell-permeable dye) stains both live and dead cells and emits green fluorescence,
```
```
whereas propidium iodide (cell-impermeable dye) stains only dead cells and emits red fluorescence. To aid the
```
visualization of fluorescence, the observation is performed at a 100X objective lens. For this, the microfluidic
chip is removed from the glass substrate on which the electrode is printed. A cover glass is immediately placed
over the substrate and sealed using vacuum grease to prevent evaporation. Microscopic images were captured
```
at 100X objective lens using (a) blue excitation filter (450–490 nm) and barrier filter (515 nm) to capture green
```
```
fluorescence for visualising live bacteria and (b) green excitation filter (510–560 nm) and barrier filter (575 nm)
```
to capture red fluorescence for visualising dead bacteria.
To show the versatility of our developed AST-device, experiments were performed with other classes
of antibiotics and bacteria, such as bacteriostatic antibiotics, tetracycline and gram-positive species, Bacillus
subtilis. The concentrations of 10 μg/mL and 5 μg/mL for ampicillin and tetracycline, respectively, were used
for the experiment. Impedance results were confirmed through a standard disk diffusion test following Central
```
Laboratory Standard Institute (CLSI) guidelines29. Images of the experiments were captured using a DSLR
```
```
camera (Panasonic DMC-GH4) and analysed using ImageJ software to determine the zone of inhibition.
```
Urine sample experiments
The device was tested and validated using human urine samples. Urine samples were collected from the Institute
```
Hospital at the Indian Institute of Technology Madras (IITM), Chennai, India. The study was approved by the
```
```
institutional ethics committee of IITM (IEC/2021-03/PS/02). Experiments were performed complying with
```
```
Indian Council for Medical Research’s (ICMR) guidelines. We confirm that informed consent form was obtained
```
from the patients. To test the robustness of the device with the urine sample, the human urine without bacteria
```
(confirmed by pathology report) was directly loaded into the device, and the bacterial detection procedure
```
was carried out. The device was loaded with the electrolyte to remove the urine sample matrix, and the EIS
was measured over time to obtain the NIS response. To confirm the bacterial detection in the urine sample, a
positive control sample spiked with 107 CFU/mL bacteria was used and NIS response was obtained by loading
with electrolytes without antibiotics. Finally, the AST protocol was conducted with the positive control sample
```
where electrolyte with tetracycline (5 μg/mL) was employed.
```
Statistical analysis
All the experiments were repeated at least in three independent sets for each condition. All results are reported
with mean and standard error. All statistical analysis was performed using unpaired student’s t-tests with a 95%
confidence interval to compare two independent data. For analysis, we used GraphPad Prism 6.01 statistical
software.
Data availability
The data set obtained using the present study are available on reasonable request to the corresponding authors.
```
Scientific Reports | (2025) 15:5133 10| https://doi.org/10.1038/s41598-024-84286-3
```
www.nature.com/scientificreports/
```
Received: 13 July 2024; Accepted: 23 December 2024
```
References
1. Walsh, T. R., Gales, A. C., Laxminarayan, R. & Dodd, P. C. Antimicrobial Resistance: addressing a global threat to humanity. PLoS
```
Med. 20, 12–15 (2023).
```
2. Murray, C. J. et al. Global burden of bacterial antimicrobial resistance in 2019: a systematic analysis. Lancet 399, 629–655 (2022).
3. Jorgensen, J. H. & Ferraro, M. J. Antimicrobial susceptibility testing: a review of general principles and contemporary practices.
```
Clin. Infect. Dis. 49, 1749–1755 (2009).
```
4. Van Belkum, A. et al. Developmental roadmap for antimicrobial susceptibility testing systems. Nat. Rev. Microbiol. 17, 51–62
```
(2019).
```
5. Postek, W., Pacocha, N. & Garstecki, P. Microfluidics for antibiotic susceptibility testing. Lab. Chip. 22, 3637–3662 (2022).
6. Quirino, A. et al. Direct antimicrobial susceptibility testing (AST) from positive blood cultures using Microscan system for early
```
detection of bacterial resistance phenotypes. Diagn. Microbiol. Infect. Dis. 101, 115485 (2021).
```
7. Yusoof, K. A. et al. Tuberculosis phenotypic and genotypic drug susceptibility testing and immunodiagnostics: a review. Front.
```
Immunol. 13, 1–13 (2022).
```
8. Vasala, A., Hytönen, V. P. & Laitinen, O. H. Modern Tools for Rapid Diagnostics of Antimicrobial Resistance. Front. Cell. Infect.
```
Microbiol. 10, (2020).
```
9. Syal, K. et al. Current and emerging techniques for antibiotic susceptibility tests. Theranostics 7, 1795–1805 (2017).
10. Tannert, A., Grohs, R., Popp, J. & Neugebauer, U. Phenotypic antibiotic susceptibility testing of pathogenic bacteria using photonic
```
readout methods: recent achievements and impact. Appl. Microbiol. Biotechnol. 103, 549–566 (2019).
```
11. Yang, L. & Bashir, R. Electrical/electrochemical impedance for rapid detection of foodborne pathogenic bacteria. Biotechnol. Adv.
```
26, 135–150 (2008).
```
12. Lee, K. S. et al. Electrical antimicrobial susceptibility testing based on aptamer-functionalized capacitance sensor array for clinical
```
isolates. Sci. Rep. 10, 1–9 (2020).
```
13. Kim, S., Yu, G., Kim, T., Shin, K. & Yoon, J. Rapid bacterial detection with an interdigitated array electrode by electrochemical
```
impedance spectroscopy. Electrochim. Acta. 82, 126–131 (2012).
```
14. Liu, J. T., Settu, K., Tsai, J. Z. & Chen, C. J. Impedance sensor for rapid enumeration of E. Coli in milk samples. Electrochim. Acta.
```
182, 89–95 (2015).
```
15. Hannah, S. et al. Rapid antibiotic susceptibility testing using low-cost, commercially available screen-printed electrodes. Biosens.
```
Bioelectron. 145, 111696 (2019).
```
16. Qin, N., Zhao, P., Ho, E. A., Xin, G. & Ren, C. L. Microfluidic Technology for Antibacterial Resistance Study and Antibiotic
```
Susceptibility Testing: review and perspective. ACS Sens. 6, 3–21 (2021).
```
17. Yang, Y., Gupta, K. & Ekinci, K. L All-electrical monitoring of bacterial antibiotic susceptibility in a microfluidic device. Proc. Natl.
```
Acad. Sci. U S A. 117, 10639–10644 (2020).
```
18. Pitruzzello, G., Johnson, S. & Krauss, T. F. Exploring the fundamental limit of antimicrobial susceptibility by near-single-cell
```
electrical impedance spectroscopy. Biosens. Bioelectron. 224, 115056 (2023).
```
19. Scherer, B. et al. Digital electrical impedance analysis for single bacterium sensing and antimicrobial susceptibility testing. Lab.
```
Chip. 21, 1073–1083 (2021).
```
20. Spencer, D. C. et al. A fast impedance-based antimicrobial susceptibility test. Nat. Commun. 11, (2020).
21. World Health Organization. Global research agenda for antimicrobial resistance in human health. Control and Response Strategies,
```
Surveillance, Prevention and Control (2023).
```
22. Anand, S., Swami, P., Goel, G. & Gupta, S. Zwitterions for impedance spectroscopy: the new buffers in town. Anal. Chim. Acta.
```
1166, 338547 (2021).
```
23. Lazanas, A. C. & Prodromidis, M. I. Electrochemical Impedance SpectroscopyA Tutorial. ACS Meas. Sci. Au. 3, 162–193 (2023).
24. Long, Y. et al. Low-Cost, high-sensitivity paper-based Bacteria Impedance Sensor Based on Vertical Flow Assay. Chemosensors 11,
```
1–13 (2023).
```
25. Wang, Y. K. et al. Comparison of Escherichia coli surface attachment methods for single-cell microscopy. Sci. Rep. 9, 19418 (2019).
26. Colville, K., Tompkins, N., Rutenberg, A. D. & Jericho, M. H. Effects of poly(L-lysine) substrates on attached Escherichia coli
```
bacteria. Langmuir 26, 2639–2644 (2010).
```
27. Swami, P. et al. Rapid antimicrobial susceptibility profiling using impedance spectroscopy. Biosens. Bioelectron. 200, 113876 (2022).
28. Barreiros, M. et al. Detection of pathogenic Bacteria by Electrochemical Impedance Spectroscopy: influence of the immobilization
```
strategies on the sensor performance. Procedia Chem. 1, 1291–1294 (2009).
```
29. CLSI. M100. Performance Standards for Antimicrobial Susceptibility Testing. Clinical and Laboratory Standards Institute. (2018).
30. Rengaraj, S., Cruz-Izquierdo, Á., Scott, J. L. & Di Lorenzo, M. Impedimetric paper-based biosensor for the detection of bacterial
```
contamination in water. Sens. Actuators B Chem. 265, 50–58 (2018).
```
31. Ruan, C., Yang, L. & Li, Y. Immunobiosensor chips for detection of Escherichia coli O157:H7 using electrochemical impedance
```
spectroscopy. Anal. Chem. 74, (2002).
```
32. Akhtarian, S., Kaur Brar, S. & Rezai, P. Electrochemical Impedance Spectroscopy-Based Microfluidic Biosensor Using Cell-
```
Imprinted Polymers for Bacteria Detection. Biosensors 14, (2024).
```
33. Hilt, E. E., Parnell, L. K., Wang, D., Stapleton, A. E. & Lukacz, E. S. Microbial threshold guidelines for UTI diagnosis: a scoping
```
systematic review. Pathol. Lab. Med. Int. 15, 43–63 (2023).
```
34. Bilsen, M. P. et al. Definitions of urinary tract infection in current research: a systematic review. Open. Forum Infect. Dis. 10,
```
ofad332 (2023).
```
35. Gopalakrishnan, S., Arigela, R., Thyagarajan, S. & Raghunathan, R. Comparison and evaluation of enumeration methods for
```
measurement of fungal spore emission. J. Aerosol Sci. 165, 106033 (2022).
```
Acknowledgements
This work was supported by DBT/Wellcome Trust India Alliance Fellowship grant number IA/E/20/1/505645
and Science and Engineering Research Board grant number SRG/2023/002706 awarded to Dr. Richa Karmakar.
```
Diksha Mall expresses her sincere gratitude to Ministry of Education (MoE), India for the Prime Minister’s Re-
```
```
search Fellowship (PMRF ID:2503493). We are thankful for 3-D printed device fabrication support from Central
```
Workshop, IIT Madras. We thank Dr. Volga Muthukumar, Dr R Savitha, Mr. Halpati Jigar Shaileshkumar, Mr.
Vivek Karma, Ms. Neha Rani Das and Mr. Shambhu Anil for their technical suggestions.
Author contributions
R. K. and S. P. secured the funding and administered the project. R. K. and S. G. conceptualized research goals.
R. K. and S. P. supervised research activities. Experiments were designed, completed, and analyzed by D. M., S.
```
Scientific Reports | (2025) 15:5133 11| https://doi.org/10.1038/s41598-024-84286-3
```
www.nature.com/scientificreports/
G, and R. K. The paper was written by S. G., R. K., D. M, and S. P. S. G., and D. M contributed equally.
Declarations
Competing interests
The authors declare no competing interests.
Additional information
Supplementary Information The online version contains supplementary material available at http s : / / d oi. org / 1
0 . 10 3 8 / s 4 1 5 9 8- 0 2 4 - 8 4 2 8 6 - 3.
Correspondence and requests for materials should be addressed to S.P. or R.K.
Reprints and permissions information is available at www.nature.com/reprints.
Publisher’s note Springer Nature remains neutral with regard to jurisdictional claims in published maps and
institutional affiliations.
Open Access This article is licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives
4.0 International License, which permits any non-commercial use, sharing, distribution and reproduction in
```
any medium or format, as long as you give appropriate credit to the original author(s) and the source, provide
```
a link to the Creative Commons licence, and indicate if you modified the licensed material. You do not have
permission under this licence to share adapted material derived from this article or parts of it. The images or
other third party material in this article are included in the article’s Creative Commons licence, unless indicated
otherwise in a credit line to the material. If material is not included in the article’s Creative Commons licence
and your intended use is not permitted by statutory regulation or exceeds the permitted use, you will need to
obtain permission directly from the copyright holder. To view a copy of this licence, visit http:/ / c reativec om mo
ns . org / l i c e nse s/ by - nc - nd / 4 . 0 /.
```
© The Author(s) 2025
```
```
Scientific Reports | (2025) 15:5133 12| https://doi.org/10.1038/s41598-024-84286-3
```
www.nature.com/scientificreports/
1
```
Vol.:(0123456789)
```
```
Scientific Reports | (2020) 10:21216 | https://doi.org/10.1038/s41598-020-77938-7
```
www.nature.com/scientificreports
Affordable automated phenotypic
antibiotic susceptibility testing
method based on a contactless
conductometric sensor
Xuzhi Zhang1,2 , Xiaoyu Jiang1 , Qianqian Yang1 , Yong Xu1 , Xiaochun Wang1 , Jinping Wang3*,
Xiaobo Sun 3 , Guosi Xie1 , Yan Zhang1 , Jun Zhao1 & Keming Qu 1,2*
```
User-friendly phenotypic antibiotic susceptibility testing (AST) methods are urgently needed in
```
many fields including clinical medicine, epidemiological studies and drug research. Herein, we
report a convenient and cost-effective phenotypic AST method based on online monitoring bacterial
```
growth with a developed 8-channel contactless conductometric sensor (CCS). Using E. coli and V.
```
parahaemolyticus as microorganism models, as well as enoxacin, florfenicol, ampicillin, kanamycin
```
and sulfadiazine as antibiotic probes. The minimum inhibitory concentration (MIC) determination
```
```
was validated in comparison with standard broth microdilution (BMD) assay. The total essential
```
agreements between the CCS AST assays and the reference BMD AST assays are 68.8–92.3%. The CCS
```
has an approximate price of $9,000 (USD). Requiring neither chemical nor biotic auxiliary materials
```
for the assay makes the cost of each sample < $1. The MICs obtained with the automated CCS AST
assays are more precise than those obtained with the manual BMD. Moreover, in 72 percent of the
counterpart, the MICs obtained with the CCS AST assays are higher than that obtained with the BMD
AST assays. The proposed CCS AST method has advantages in affordability, accuracy, sensitivity and
user-friendliness.
```
Determining the susceptibility of microorganisms towards target agents (e.g., antibiotics and nanoparticles)
```
is of great significance in many fields including medicine, epidemiology, drug research, environmental sur-
```
veys and agriculture 1–3 . Antimicrobial susceptibility testing (AST) is the concentration of antimicrobial agents
```
that is required to inhibit proliferation of target microorganisms in vitro and is the most valuable tool for
determination1,4. To achieve rapid, reproducible and accurate measurements, automated AST methods have been
developed in recent decades, and most available methods are divided into two categories based on mechanism:
genotypic and phenotypic methods.
Genotypic AST methods attempt to determine specific resistance genes or genetic mutations using molecular
amplification 4 or sequencing5 approaches. In most of these performances, the requirements of microbial growth
```
are bypassed resulting in a fast response; the results can be obtained with high specificity and sensitivity within 2
```
h4,6. An intrinsic limitation of all genotypic methods is that they detect only the potential for resistance. Thus, the
susceptibility has to be validated with phenotypic tests1,7. Moreover, the other drawback with genotypic methods
is that only known sequences associated with resistance can be targeted. Not only are there many more sequences
that have yet to be elucidated, but new forms of resistance are out of reach2. In contrast, phenotypic AST methods
analyze the effect of target agents on characteristics of microbial growth. They can provide qualitative data for
```
the strain tested as well as quantitative values of the minimum inhibitory concentration (MIC, i.e., the lowest
```
```
antibiotic concentration that inhibits visible growth) 4,7–10 . To date, phenotypic AST methods are still considered
```
the gold standard and are the most popular because of their universal detection of resistance irrespective of the
resistance mechanisms 2,8 .
To improve the efficiency of phenotypic AST assays, various semi-automatic and automatic readout
approaches have been introduced as reviewed previously1,4,11–13. In general, optics2,9,12–16, electrochemistry12,17–20,
OPEN
1Yellow Sea Fisheries Research Institute, Chinese Academy of Fishery Sciences, Qingdao 266071,
China. 2Laboratory for Marine Fisheries Science and Food Production Processes, Pilot National Laboratory for
```
Marine Science and Technology (Qingdao), Qingdao 266071, China. 3College of Chemical and Pharmaceutical
```
```
Sciences, Qingdao Agricultural University, Qingdao 266109, China. *email: jpwang@qau.edu.cn; qukm@
```
ysfri.ac.cn
2
```
Vol:.(1234567890)
```
```
Scientific Reports | (2020) 10:21216 | https://doi.org/10.1038/s41598-020-77938-7
```
www.nature.com/scientificreports/
microcalorimetry 21 , mass sensor 22 , mass spectrometry 23 and gene analysis 8 techniques are used for the readout
of microbial growth. These developments offer fast susceptibility results making measurements simple versus
manual plate counting. Though most of these AST methods are still in the proof-of-concept status, those based on
on-line monitoring microbial growth with optical devices have been implemented widely to conduct phenotypic
assays 15,16 , because they also offer accuracy and reliability, as well as the capacity for quantitative MIC results in
a non-destructive and high-throughput manner.
Several commercial systems, including MicroScan WalkAway, Vitek, BD Phoenix and Sensititre, are already
moving into clinical spaces13,24 . These inventions can speed up AST, increase consistency of susceptibility results
across different locations, and reduce the burden of work for users. For example, the susceptibility profile of up
```
to 96 microbial samples can be determined using the automated broth microdilution (BMD) assay through on-
```
```
line optical density (OD) measurements within 20 h 25, despite there being no official standardized protocol for
```
OD measurements. Automatic readout approaches can lower the accuracy depending on the skill of operators.
However, the cost stunts their widespread applications, especially in the developing world 4,5,26 . They might also
be unreliable when target microorganisms are cultured in the presence of substrates that may interfere with the
optical signal or only proliferate when attached to base material surfaces 4 .
Electrochemical readout requires only simple electronics for direct electronic detection of microbial growth.
This can bypass the requirements of complex optical-electric conversion 18 . Thus, instruments are easier to min-
iaturize and become more cost-effective versus optical systems. Traditionally, the working electrode is galvanic
contact with liquid broth or solution. This invasive manner inevitably causes environmental perturbations on
microbial growth as well as undesirable electrode deterioration and non-specific fouling 27 that can undermine
the accuracy of on-line monitoring 12,19 . Therefore, an electrochemical readout approach that can be used to
monitor microbial growth in real time with non-invasive manner is urgently needed for developing practical
AST methods.
```
To meet this goal, we have constructed a contactless conductometric sensor (CCS) based on a multi-channel
```
```
capacitively-coupled contactless conductivity detector (C4D)28. The measurement based on this instrument offers
```
several advantages over classical electrochemical- and turbidity/absorbance-based approaches. For instance, it is
superior to optical-based methods in that turbidity and other optical interferences are significant issues29. Versus
impedance sensors, this method exhibits better reproducibility and accuracy with high temporal resolution 17,30 .
Moreover, unlike other electrochemical methods, this system requires neither chemical, biotic, or physical com-
pounds as indicators or auxiliary materials, nor any immobilizing steps. This effectively reduces the cost and
complexity for on-line monitoring of microbial growth 12 .
Here, we report a novel AST method by modifying a common BMD assay. An 8-channel CCS, which allows
simultaneous cultivation and on-line analysis of growth inhibition, is developed and characterized. Taking E.
coli and V. parahaemolyticus as microorganism model and enoxacin, florfenicol, ampicillin, kanamycin and
sulfadiazine as antibiotic probes, we validated the capability of the new method for achieving MIC determina-
tion. Our goal is to overcome the limited applicability of existing methods for studying the dynamic effects of
antibiotics on microbial growth kinetics, and to provide an affordable and simple tool for phenotypic AST assays.
Materials and methods
```
Materials and reagents. Standard bacterial strains of E. coli (ATCC35150) and V. parahaemolyticus
```
```
(ATCC17802) were purchased from BIOBW Biotechnology Co., Ltd (Beijing, China). E. coli and V. parahaemo-
```
lyticus isolates were obtained from fishery water and the shrimp Penaeus vannamei, respectively. Enoxacin, flo-
```
rfenicol, ampicillin, kanamycin and sulfadiazine were purchased from Sigma-Aldrich (St. Louis, MO, USA).
```
```
Other common chemicals were purchased from the Shanghai Chemical Reagent Co. (Shanghai, China) and
```
were of analytical grade. Unless otherwise indicated, liquid broths and solutions were prepared with ultrapure
```
water (resistivity: 18.2 MΩ cm at 25 °C) from a Master Touch-RUV water purification system (Hitech Instru-
```
```
ments Co., Ltd., Shanghai, China).
```
```
Escherichia coli was aerobically cultured in liquid Luria–Bertani (LB) broth. V. parahaemolyticus was aerobi-
```
```
cally cultured in liquid 2216E broth (a common complex culture broth for marine bacteria, consisting of 0.5%
```
```
tryptone, 0.1% yeast extract, 3.4% NaCl and 0.01% FePO 4 , pH 7.6–7.8). Both of the broths were purchased from
```
```
the Hope Bio-Technology Co., Ltd (Qingdao, China). Bacterial cultivation was conducted in accordance with
```
previously described methods 28,31 with minor modifications. Briefly, strains were stored at − 80 °C and then
pre-grown overnight in the appropriate broth with constant shaking. Unless otherwise indicated, the incuba-
tion temperature for E. coli and V. parahaemolyticus was 37 °C and 28 °C, respectively. Active strains were then
further transferred to new culture broth. After a second incubation for ~ 10 h, the cell numbers were measured
```
with an OD method according to Clinical and Laboratory Standards Institute (CLSI) guidelines 32 . The results
```
were then validated with a plate-counting method used previously 28 . The cultures were immediately diluted to
achieve a cell concentration of 10 9 CFU/mL for further use.
Fabrication and characterization of the CCS. The 8-channel CCS was developed on the basis of one
```
prototype we constructed previously28. In brief, a miniature electronic fan (MA1062, Sunon Technology Devel-
```
```
opment Co., Ltd, Beijing, China), a programmable temperature sensor (WH801, Wattion Electronic Control
```
```
System Co., Ltd, Guangzhou, China) and a thermoelectric cooler (TEC1-12706, Changshengyongxing Co., Ltd,
```
```
Shenzhen, China) were used to guarantee expected identical temperature inside the working chamber of the
```
```
sensor. A developed eight-channel C 4D (manufactured by eDAQ Pty Ltd., Sydney, Australia), including the
```
software TERA TERM, was used to monitor the conductivity changes of the liquid broth on-line in test tubes.
Note, in order to obtain stable and sensitive conductivity change values for the liquid broth over the range of
15–45 mS/cm, the geometric parameters of the working electrodes were developed according to Equations 1–5
3
```
Vol.:(0123456789)
```
```
Scientific Reports | (2020) 10:21216 | https://doi.org/10.1038/s41598-020-77938-7
```
www.nature.com/scientificreports/
```
from the literature33. Here, in each channel a couple of copper cylinders (ID = 5.01 mm; thickness= 0.5 mm;
```
```
length = 2.0 mm) were used as the actuator electrode and pick-up electrode. The distance between the actuator
```
electrode and pick-up electrode was 8.0 mm. The excitation frequency and excitation amplitude were 500 K Hz
and 16 V, respectively. The collection period of apparent conductivity value can be selected over a range of
1/100 s to 20 min28,34. The characteristics of the electronic sensor, including the uniformity of temperature in the
working chamber and the robustness and reproducibility of the C 4D system, were characterized with the same
```
methods as used previously28 (see Supplementary Information).
```
Characterizing growth behaviors of E. coli and V. parahaemolyticus with the CCS. To char-
```
acterize the growth behavior of viable E. coli, bacterial cells at desired concentrations in liquid LB broth (2 mL
```
```
in total, containing 0.5% NaCl) were loaded into test tubes (NORELL tubes, OD = 5.0 mm, ID= 4.2 mm,
```
```
length = 203.0 mm, volume ≈ 2.8 mL, Norell, Inc., Morganton, USA). The tube openings were then covered
```
with gas-permeable films. Meanwhile, a control sample without inoculation was prepared similarly and loaded
into another test tube. Each tube was then inserted into a separate channel of the CCS in which the temperature
```
was 37 °C. After an incubation of 120 s (to balance the temperature inside and outside of the tubes)28, apparent
```
conductivity values were collected every 30 s. The apparent conductivity data from each tube were blanked by
subtracting the first recordings from the remaining values to form normalized apparent conductivity values
```
(NACVs, showed in voltage). The CCS growth curves were then generated by plotting NACVs as a function of
```
incubation times. In the case of characterizing growth behavior of viable V. parahaemolyticus at 28 °C, liquid
2216E broth was used instead of LB broth.
CCS AST assay. Scheme 1 shows that the procedure of the phenotypic AST assay with the CCS consisted
of two steps: Preparation of AST samples and incubation/read out. Re-suspended bacterial cells in liquid broth
were added to each tube for a final concentration of approximately 5 × 105 CFU/mL23 . In the test tubes, serial
twofold dilutions of antibiotics were made in liquid broth. After covering the tube opening with a gas-permeable
film, we simultaneously inserted all tubes into a separate channel of the CCS and collected the NACVs as stated
in “Characterizing growth behaviors of E. coli and V. parahaemolyticus with the CCS” for 20 h. The liquid broth
with and without bacterial cells were taken as positive and negative controls, respectively. In total, 2400 data-
points were obtained for every tested sample. Bacterial growth curves were simultaneously generated by plotting
NACVs against incubation times. The MIC for each antibiotic is defined as the lowest antibiotic concentration,
which inhibits the growth of the target microorganism, as assessed from the absence of sigmoidal curve9 .
BMD AST assay. In the reference experiments, the MICs of these five kinds of antibiotics against E. coli
and V. parahaemolyticus were determined by the BMD method according to the CLSI guidelines32. Briefly, each
```
antibiotic was measured in two-fold concentrations over a desired range in Corning 96-well plates (Corning
```
```
Incorporated, USA). The final bacterial inoculum in the measurement was approximately 5 × 10 5 CFU/mL. In
```
each well, 100 μL LB or 2216E was used as nutrient broth for E. coli and V. parahaemolyticus, respectively. Plates
were incubated for 20 h. The MIC was defined as the lowest concentration of antibiotic, resulting in complete
inhibition of growth as determined visually23.
Precision and validity analysis. A precision analysis was conducted referring to Kenneth and Kirby’s
report35 with minor modifications. Briefly, CCS AST and BMD AST assays were repeated 11 times in tripli-
cate for each antibiotic-microorganism combination using kanamycin as an antibiotic probe. All performances
occurred on separate days with freshly prepared antibiotic dilutions and independent inocula were used to
determine the MICs. The distributions of determined MICs from the two assays were analyzed in compari-
```
son. Validity analysis was conducted with essential agreement (EA) levels using 65 E. coli isolates and 16 V.
```
parahaemolyticus isolates against enoxacin, florfenicol, ampicillin, kanamycin and sulfadiazine. Each MIC value
determined by the CCS AST assay was compared with the counterpart determined by the BMD AST assay. The
CCS AST assay was considered to have an evaluable EA if its MIC was within ± 200% of that obtained with the
reference assay. In addition, when the proportion of MIC obtained with the CCS AST assay to that obtained with
```
the reference assay was > ± 2 but ≤ ± 3, it was calculated as the minor error (mE).
```
Results
Characteristics of the CCS. Bacterial growth is temperature-sensitive as is the response of C4D36. Thus,
```
the temperature control features were characterized first. Figure S1 (Supporting information) shows the curves
```
of 50.0 and 120.0 mM KCl solutions simultaneously measured in separate channels. As expected, the variation
```
in apparent conductivity was very small (< 0.8%) over a period of 20 h in both cases. These results demonstrate
```
the uniformity of temperature in the working chamber as well as robust and identical conductometric measure-
ments. The difference of apparent conductivity between separate channels from the same concentration of KCl
solution resulted from minor variations in the geometry size of the tubes and their coupling to the electrodes28.
For monitoring bacterial growth, the critical factor of measurement was to record conductivity changes rather
than absolute conductivity values. Thus, these differences between separate channels have no influence on form-
ing bacterial growth curves because of our normalized algorithm. There is a linear relationship between the con-
```
centration of KCl solutions and apparent conductivity values with a slope of 562 ± 3 mV per mS/cm (R2 ≥ 0.9910)
```
from 20.0 to 200.0 mM, thus suggesting a high sensitivity.
4
```
Vol:.(1234567890)
```
```
Scientific Reports | (2020) 10:21216 | https://doi.org/10.1038/s41598-020-77938-7
```
www.nature.com/scientificreports/
```
Scheme 1. Schematic diagram of the workflow of phenotypic AST assay with the 8-channel CCS. (I)
```
```
Preparation of AST samples; (II) Incubation and automated generation of growth curves with the CCS
```
```
controlled by a computer. 1—gas-permeable film; 2—thermal insulator; 3—mini electronic fan; 4—temperature
```
```
sensor; 5—thermoelectric cooler; 6—test tube; 7—actuator electrode; 8—pick-up electrode; and 9—grounded
```
```
Faraday shield to avoid direct capacitive coupling between the actuator electrode and pick-up electrode33. (III)
```
The illustration of the couple of working electrodes outside the test tube.
5
```
Vol.:(0123456789)
```
```
Scientific Reports | (2020) 10:21216 | https://doi.org/10.1038/s41598-020-77938-7
```
www.nature.com/scientificreports/
Growth behaviors of E. coli and V. parahaemolyticus. The conductivities of culture broths in six test
tubes, in which the initial concentration of E. coli cells were 10 3 , 10 4, 10 5, 10 6, 10 7 and 10 8 CFU/mL, respectively,
were monitored simultaneously with the CCS. As shown in Fig. 1A, six sigmoidal CCS growth curves presents,
meaning that the system can characterize the growth rate of viable bacteria as well as estimate the initial con-
centration of the initial bacterial suspension 28,37. For simplicity, the time needed for the NACV of the broth to
reach 0.02 V is defined as a “detectable time.” There is a linear relationship between the logarithmic values of
```
initial inoculum of E. coli and detectable times over the tested range with a correlation coefficient (R2) of 0.9953
```
```
(Fig. 1A insert). For the negative control (in yellow), no sigmoidal growth curve was observed over the same
```
time span, suggesting that without viable bacteria there is no conductivity change during the incubation. These
outcomes are in excellent agreement with those observed with an earlier generation prototype 28.
Using the previous prototype 28 , we can obtain stable and sensitive conductivity change values for the liquid
broth over the range of 9–14 mS/cm. With the latest version, we can obtain stable and sensitive conductivity
change values for the liquid broth over the range of 15–45 mS/cm. This wider working window makes it possible
to monitor bacterial growth in common liquid broths, e.g., LB and 2216E.
The conductivities of culture broths in five test tubes, in which the initial concentration of E. coli cells were
all 10 3 CFU/mL, were monitored simultaneously with the CCS. The standard deviation of detectable times is
3.2 min, indicating a good accuracy.
For V. parahaemolyticus, the growth of serial inocula at concentrations of 10 3 , 10 4 , 10 5 , 10 6 , 10 7 and 10 8 CFU/
mL in liquid 2216E broth was simultaneously monitored with the CCS. As shown in Fig. 1B, six sigmoidal growth
curves are observed. Similar to E. coli, the duration of the lag phase is proportional to the initial inoculum of
bacteria. There is a linear relationship between the logarithmic values of initial inoculum of V. parahaemolyticus
```
and detectable times over the tested range with a correlation coefficient (R2 ) of 0.9947 (Fig. 1B insert). No sig-
```
```
moidal growth curve was observed during the incubation when the initial inoculum was zero (negative control).
```
0.00
0.02
0.04
0.06
0.08
0.10
0.12
0 100 200 300 400 500 600 700
```
NACV (V)
```
```
Incubation time (min)
```
```
Detectable time (min)
```
```
Log E. coli (CFU/mL)
```
0.00
0.05
0.10
0.15
0.20
0.25
0.30
0.35
0.40
0.45
0.50
100 200 300 400 500 600 700
```
y = -41.2x + 504.27R² = 0.9947
```
150
200
250
300
350
400
2 3 4 5 6 7 8 9
```
Detectable time (min)
```
```
Log V. parahaemolyticus (CFU/mL)
```
```
NACV (V)
```
```
Incubation time (min)
```
```
(A)
```
```
(B)
```
```
y = -39.971x + 405.31R² = 0.9953
```
0
50
100
150
200
250
300
4 5 6 7 8 9 10 11
```
Figure 1. CCS growth curves (NACV vs. incubation time) of E. coli in liquid LB broth (A) and V.
```
```
parahaemolyticus in liquid 2216E broth (B). (A): from left to right, the initial inoculum of E. coli was 1010, 109,
```
108, 107, 106 and 105 CFU, respectively. Insert: The linear relationship between the logarithm of initial E. coli and
```
detectable time. (B): from left to right, the initial inoculum of V. parahaemolyticus was 108, 107, 106, 105, 104 and
```
103 CFU, respectively. Insert: The linear relationship between the logarithm of initial V. parahaemolyticus and
detectable time. Yellow horizontal lines show the results of negative control experiments. NACV values of liquid
broths in each test tube were collected at an interval of 30 s with excitation frequency of 500 K Hz and excitation
amplitude of 16 V.
6
```
Vol:.(1234567890)
```
```
Scientific Reports | (2020) 10:21216 | https://doi.org/10.1038/s41598-020-77938-7
```
www.nature.com/scientificreports/
CCS AST assay. E.coli ATCC 35150 in liquid LB broth was cultured in the presence of enoxacin, florfenicol,
```
ampicillin, kanamycin, or sulfadiazine. Figure 2A shows CCS growth curves. For the positive control (with bac-
```
```
teria but without antibiotic) samples, sigmoidal curves were obtained as expected. We note that these curves have
```
```
considerably higher temporal resolution (at an interval of 0.5 min) than those obtained with the OD method 26
```
```
and the electrochemical method 17. There is a lag phase for approximately 210 min; this is possibly caused by
```
the stress that bacteria might experience after dilution and/or a loading step as well as the time required for
generating enough end products to produce detectable increasing conductivity 28. The lag phase is followed by an
acceleration phase during which the growth rate increases until a constant growth rate is achieved, i.e., entering
the exponential phase. Subsequently, the growth rate begins to decline to form a deceleration phase. Compared
to the positive control, the lag phase duration of bacteria regularly extends with increasing antibiotic concentra-
tion, thereby contributing to a delayed onset of growth when microorganisms are exposed to sub-lethal antibi-
otic concentrations. These data suggest that all five antibiotics show concentration-dependent effects on E. coli
growth dynamics38.
Similar maximum growth rates and maximum growths were found in the presence of 15.625, 31.250
and 62.500 ng/mL enoxacin despite the onset of growth delays with the increase of antibiotic concentration
```
(Fig. 2A(a)). In contrast, the maximum growth rate of E. coli is lower in the presence of 125.000 ng/mL enoxa-
```
cin, though the final NACV at the measurement endpoint can reach a similar value to the positive control. In
the presence of 0.250 μg/mL enoxacin, no sigmoidal growth curve was observed over the same incubation,
similar to the response of the negative control. This complete inhibition suggests an MIC of 0.250 μg/mL. The
```
presence of low concentrations of florfenicol (0.125, 0.250 and 0.500 μg/mL) delayed the onset of E. coli growth
```
and slightly lowered the maximum growth rate. The presence of 1.000 μg/mL significantly impacted the maxi-
```
mum growth rate as well as the maximum growth (Fig. 2A(b)). Interestingly, though the presence of 0.25 and
```
0.50 μg/mL ampicillin delayed the onset of growth, it did not impact the maximum growth rate. Meanwhile,
the final NACV values are higher than that of the positive control, indicating that growth stimulation might
have occurred 39 . However, the maximum growth rate and maximum growth were both depressed by 1.00 and
```
2.00 μg/mL ampicillin (Fig. 2A(c)).
```
```
Figure 2A(d) shows the response of kanamycin against E. coli. The maximum growth increases regularly with
```
increases in antibiotic concentration from 0.25–1.00 μg/mL with an identical maximum growth rate similar to
that in the positive control. Even in the presence of 2.00 μg/mL kanamycin, the maximum growth rate is similar
```
to that of the positive control; the maximum growth at the endpoint of each measurement can reach a similar
```
level for the positive control. The impact of sulfadiazine against E. coli is similar to that of florfenicol: the 8.0,
16.0 and 32.0 μg/mL antibiotics have little impact on the maximum growth rate and maximum growth. The
```
presence of 64.0 μg/mL florfenicol depresses both the maximum growth rate and maximum growth (Fig. 2A(e)).
```
These phenomena confirm that—in contrast to the duration of the lag phase—some antibiotics have neither a
```
maximum specific growth rate nor a maximum growth (final cell amount). Thus, these latter two metrics are not
```
reliable predictors for indicating a concentration-dependent inhibitory effect 38 . Microbial growth is completely
inhibited when the concentration of the antibiotic is equal to or higher than the MIC. Thus, in the presence of
```
high concentrations of antibiotics (value ≥ MIC), the responses of cultures are the same as that obtained with a
```
```
negative controls ( see the NC lines in Fig. 2A).
```
Using the CCS, we obtained similar responses of enoxacin, florfenicol, ampicillin, kanamycin and sulfadia-
```
zine against V. parahaemolyticus (ATCC17802) growth in liquid 2216E broth. Lag phase durations of bacteria
```
extend with increases in antibiotic concentration, suggesting that they all show concentration-dependent effects
```
on growth dynamics. The sigmoidal CCS curves for the positive control samples (with bacteria but without
```
```
antibiotic) have lag phases of ~ 220 min (Fig. 2B). In the presence of 15.625, 31.250 and 62.500 ng/mL enoxacin,
```
despite the onset of growth delays with an increase in enoxacin concentration, there are similar maximum growth
rates and maximum growths. The maximum growth rate and maximum growth are both obviously depressed
in the presence of 125.000 ng/mL antibiotic. In the presence of 0.250 μg/mL enoxacin, no sigmoidal growth
```
curve is observed over the same time span like the response of the negative control (Fig. 2B(a)). The onset of V.
```
parahaemolyticus growth is also delayed by florfenicol. Unlike the case of enoxacin, the increase of florfenicol
concentration from 0.03125 to 0.12500 μg/mL regularly depresses both the maximum growth rate and the maxi-
```
mum growth; 0.500 μg/mL florfenicol can completely inhibit the growth (Fig. 2B(b)). Interestingly, although the
```
presence of 2.00 μg/mL ampicillin delays the onset of growth, it does not impact the maximum growth rate or
maximum growth. However, the maximum growth rate and maximum growth both increasingly decreased with
```
increasing ampicillin concentration (4.00–16.00 μg/mL) (Fig. 2B(c)). Figure 2B(d) shows the typical response
```
of kanamycin against V. parahaemolyticus. Over the range of 2.00–16.00 μg/mL, the maximum growth rate
```
and maximum growth are only slightly impacted by the presence of kanamycin. Figure 2B(e) shows the typical
```
response of sulfadiazine against V. parahaemolyticus. The antibiotic at a concentration of 16.0 and 32.0 μg/mL
invisibly impacts the maximum growth rate and maximum growth. The maximum growth rate and maximum
growth are both increasingly depressed by the increase of ampicillin concentration from 64.00 to 128.00 μg/mL.
BMD AST assay. The responses of E. coli and V. parahaemolyticus to enoxacin, florfenicol, ampicillin, kana-
```
mycin and sulfadiazine were characterized with BMD AST assays (Typical resulting pictures are shown in Fig-
```
```
ure S2). The resulting MICs are listed in Table 1 in comparison with those obtained with the CCS AST assays.
```
The MICs of enoxacin against E. coli obtained with either BMD AST assay or CCS AST assay are much lower
```
than that documented in the CLSI (Revised-2014)39. The MICs of kanamycin against E. coli obtained with BMD
```
```
AST assay and CCS AST assay are also lower than that documented in the CLSI (Revised-2014) 39. However, the
```
MIC of ampicillin against V. parahaemolyticus obtained with CCS AST agrees well with that reported by Lopatek
et al.40 .
7
```
Vol.:(0123456789)
```
```
Scientific Reports | (2020) 10:21216 | https://doi.org/10.1038/s41598-020-77938-7
```
www.nature.com/scientificreports/
```
Precision and validity. In the precision analysis, 87.9% (29/33) E. coli ATCC 35,150 samples show MIC
```
```
of kanamycin is 4.00 μg/mL obtained with the CCS AST assay. In contrast, 78.8% (26/33) E. coli ATCC 35,150
```
```
samples show a MIC of 2.00 μg/mL with the BMD AST assay. In the case of V. parahaemolyticus (ATCC17802),
```
-0.01
0.01
0.03
0.05
0.07
0.09
0.11
0.13
0 200 400 600 800 1000 1200
```
0.250NACV (V)
```
```
Florfenicol(μg/mL)
```
0.125
PC 0.500
1.000
2.000 NC
0.00
0.02
0.04
0.06
0.08
0.10
0.12
0.14
0 200 400 600 800 1000 1200
1.00
NC
```
Ampicillin(μg/mL)
```
```
NACV (V)
```
PC
0.25
0.50 4.00
2.00
0.00
0.02
0.04
0.06
0.08
0.10
0.12
0.14
0.16
0 200 400 600 800 1000 1200
```
Kanamycin(μg/mL)
```
```
NACV (V)0.25
```
0.50
PC
2.00
1.00
NC4.00
-0.10
0.00
0.10
0.20
0.30
0.40
0.50
0.60
0 200 400 600 800 1000 1200
```
NACV (V)
```
```
(B: V. parahaemolyticus)
```
```
Enrofloxacin(ng/mL)
```
PC
15.625
62.500
125.000
250.000 NC31.250
0.00
0.10
0.20
0.30
0.40
0.50
0 200 400 600 800 1000 1200
```
NACV (V)
```
```
Florfenicol(μg/mL)
```
PC
0.03125
0.06250
0.12500
0.25000
0.50000 NC
0.00
0.10
0.20
0.30
0.40
0.50
0.60
0.70
0 200 400 600 800 1000 1200
```
NACV (V)
```
```
Ampicillin(μg/mL)
```
2.00
4.00
8.00
32.00
16.00
NC
PC
0.00
0.10
0.20
0.30
0.40
0.50
0.60
0 200 400 600 800 1000 1200
```
NACV (V)
```
```
Kanamycin(μg/mL)
```
PC
NC4.00
2.00 16.008.00
32.00
0.00
0.10
0.20
0.30
0.40
0.50
0.60
0.70
0 200 400 600 800 1000 1200
```
Sulfadiazine(μg/mL)
```
```
NACV (V)
```
```
Incubation time (min)
```
NC
PC
16.0
32.0 256.0
64.0
128.0
-0.01
0.01
0.03
0.05
0.07
0.09
0.11
0 200 400 600 800 1000 1200
```
NACV (V)
```
PC
31.250
125.000
```
Enrofloxacin(ng/mL)
```
250.000
NC
15.625
62.500
```
(A: E.coli)
```
-0.01
0.01
0.03
0.05
0.07
0.09
0.11
0 200 400 600 800 1000 1200
```
Sulfadiazine(μg/mL)
```
```
NACV (V)16.0
```
PC 32.0
128.0
64.0
8.0
NC
```
Incubation time (min)
```
```
(a)
```
```
(b)
```
```
(a)
```
```
(b)
```
```
(c) (c)
```
```
(d) (d)
```
```
(e)(e)
```
```
Figure 2. CCS growth curves (NACV vs. incubation time) of E. coli (A) and V. parahaemolyticus (B) in the
```
presence of antibiotics. E. coli in liquid LB broth and V. parahaemolyticus in liquid 2216E broth were aerobically
incubated at 37 °C and 28 °C, respectively.
8
```
Vol:.(1234567890)
```
```
Scientific Reports | (2020) 10:21216 | https://doi.org/10.1038/s41598-020-77938-7
```
www.nature.com/scientificreports/
```
84.8% (28/33) of the samples show that the MIC of kanamycin is 32.00 μg/mL obtained with the CCS AST assay.
```
```
The BMD assay offers 72.7% (24/33) samples with a MIC of 16.00 μg/mL. These findings show that the CCS AST
```
assay is superior to the BMD AST assay in terms of precision.
In total, 81 isolated bacterial strains, including 65 E. coli and 16 V. parahaemolyticus, were used to validate
the CCS AST method for the five antibiotics, also using BMD AST method as reference. The results are similar
```
to those obtained with standard strains (Table 2). With the evaluation parameters suggested by the FDA 9 , we
```
calculated the EA, as well as discrepancies defined as mE, by comparing the MICs of the same isolate determined
with CCS AST assay and that with BMD AST assay.
Discussion
MIC measurements are important in medicine, epidemiology, drug research, environmental surveys, agricultural
production 1–3 and materials research 38 . Liquid suspension growth-based methods, such as the BMD, are gold
standards for phenotypic AST assays. To monitor growth with real-time patterns, AST assays can yield results
```
sooner than solid-phase tests 2 . Traditional manual BMD assays tend to be very laborious with poor precision;
```
thus, various semi-automatic and automatic methods have been developed in the past decades1,4. These methods
include on-line monitoring of microbial growth with OD patterns, which have good practicability and have been
successful commercially because of their accuracy, reliability and non-destructive and high-throughput nature13.
```
However, there are still two salient issues: (1) the optical interference from complex substrates in the broth and
```
```
from adherent cells in proliferation 37 ; and (2) the price of the instrument and cost of each sample test 4 . These
```
challenges provided the motivation to develop the CCS AST method proposed herein.
The growth of bacteria transforms uncharged or weakly charged substrates, e.g., yeast, peptone and sugar
into highly charged end products, such as amino acids, aldehydes, ketones, acids and other metabolites, causing
a conductivity increase of the liquid broth 41 . This change can be monitored on-line with the sensitive CCS to
generate bacterial growth curves by plotting NACVs as a function of incubation time. Using this approach, we
could monitor up to eight samples for high-throughput testing.
```
Using standard bacterial strains of E. coli (ATCC35150) and V. parahaemolyticus (ATCC17802) as model
```
microorganisms, the total EAs and mEs between the CCS AST assays and the reference BMD AST assays were
found to be 80% and 20%, respectively. For E. coli isolates, the EAs of enoxacin, florfenicol, ampicillin, kanamy-
cin and sulfadiazine were no lower than 76.9%. Meanwhile, the mEs were 7.7–23.1%. For V. parahaemolyticus
isolates, the EAs of these five antibiotics were no lower than 68.8% with mEs of 6.3–31.2%. Note, these plates
```
were incubated for the same time span as the CCS AST assays (20 h) to avoid differences in MIC resulting from
```
Table 1. Results of BMD AST assay in comparison with that of CCS AST assay.
```
Antibiotics Bacterial species CCS MICs (μg/mL) BMD MICs (μg/mL) Reference MICs (μg/mL)
```
Enoxacin E. coli 0. 25 0. 25 2–8 39
Florfenicol E. coli 2.00 1.00 –
Ampicillin E. coli 4.00 1.00 –
Kanamycin E. coli 4.00 2.00 16–64 39
Sulfadiazine E. coli 128.0 64.0 –
Enoxacin V. parahaemolyticus 0.250 0.125 –
Florfenicol V. parahaemolyticus 0.500 0.250 –
Ampicillin V. parahaemolyticus 32.00 8.00 32 40
Kanamycin V. parahaemolyticus 32.00 16.00 –
Sulfadiazine V. parahaemolyticus 256.0 128.0 –
Table 2. Validity analysis of the CCS AST assay in comparison with the BMD AST assay.
```
Antibiotics Bacterial species Total isolates CCS MICs (μg/mL) BMD MICs (μg/mL) EA% mE%
```
Enoxacin E. coli 65 0.125–8.000 0.125–4.000 86.5 10.4
Florfenicol E. coli 65 1.00–64.00 0.50–64.00 76.9 23.1
Ampicillin E. coli 65 1.00–64.00 0.500–32.00 84.6 13.8
Kanamycin E. coli 65 2.00–128.00 1.00–128.00 92.3 7.7
Sulfadiazine E. coli 65 64.00–512.00 32.00–256.00 89.2 10.8
Enoxacin V. parahaemolyticus 16 0.125–16.000 0.125–16.000 68.8 31.2
Florfenicol V. parahaemolyticus 16 0.25–64.00 0.25–64.00 87.5 6.3
Ampicillin V. parahaemolyticus 16 16.00–128.00 8.00–64.00 81.3 12.5
Kanamycin V. parahaemolyticus 16 16.00–128.00 8.00–64.00 87.5 12.5
Sulfadiazine V. parahaemolyticus 16 128.0–1024.0 64.0–1024.0 75.0 25.0
9
```
Vol.:(0123456789)
```
```
Scientific Reports | (2020) 10:21216 | https://doi.org/10.1038/s41598-020-77938-7
```
www.nature.com/scientificreports/
different incubation times 38 . These outcomes thus demonstrate the accuracy of the new method, not only for
standard bacterial strains but also for isolates.
The MICs obtained by the CCS AST assay are almost identical to those obtained by standard BMD assays
for five different types of antibiotics against isolates. Notably, given that the readout is effectively an operator-
```
independent method (i.e., automated reading bypassing operator error 8 ), it is not surprising that the CCS AST
```
```
assay is more precise than the standard manual BMD 35 (Table 2). In 72 percent of the counterpart assays, the
```
MICs obtained with the CCS AST are higher than that obtained with the BMD AST, thus demonstrating that the
automated method is more sensitive and thus more reliable. Moreover, versus endpoint measurements of BMD
assays, the dynamic sensorgram obtained by the CCS offers more detailed information on the antibiotic activity
at different growth stages 37 . For example, the CCS can show that the presence of ampicillin at a concentration
below the MIC will stimulate E. coli growth. Notably, the EAs and mEs of these five antibiotics against E. coli are
visibly different from V. parahaemolyticus, suggesting that the accuracy of the CCS AST assay also depends on
the differences in the testing systems.
Versus automated optical methods, the CCS AST method has a few attractive features. For example, it is
unnecessary to remove optical interference substrates from the liquid testing broth because they do not affect the
```
CCS measurements 28 ; this leads to a simpler operation. In addition, costs are much lower than optical systems.
```
Electrochemical devices are cheaper than optical instruments because they do not require complex optical-
```
electrical conversion 18 . The CCS system itself has an approximate price of $9000 (USD), which is much cheaper
```
than that of VITEK and Phoenix. By contrast, the cost of assay consumables is rather low. Apart from broths and
disposable tubes, neither chemical nor biotic auxiliary materials are needed for the AST assay. The cost of a single
assay is no more than $1. Moreover, online monitoring to only detect the time point of transition from lag to
exponential phase can save many hours 9 . High temporal resolution is important for accurate assays. The tempo-
ral resolution of common optical methods is around 10 min 9,38 . By employing Fourier transform reflectometric
interference spectroscopy, the temporal resolution can reach 1 min 37 . In contrast, CCS collects a conductivity
signal every 30 s to generate growth curves. When required, the temporal resolution can be set higher.
The CCS AST assay requires manual preparation of testing samples and incubation/automated readout. The
first step is the same as the BMD AST assay. Operator error is possible because of the requirements for manual
processes 8 . This might be the major contribution to the small variation of MICs. However, the preparation of
inocula can be easily automated in a commercial version as described15,35 . In addition, commercial model target
```
antibiotics at a desired amount can be loaded into sample tubes beforehand with mass customization; thus, there
```
are only two fully automated steps in the mature CCS AST assay.
In principle, the proposed CCS AST method successfully addresses issues facing automated optical methods.
It does not suffer from interference from complex substrates in the test samples or from adherent cells in prolif-
eration. We believe this enables it wider application fields. In some cases where automated optical methods are
```
inadequate 38,42 (e.g., blood culture systems, presence of microplastics, nanomaterials and silts in testing system,
```
```
adherent bacteria), it can work well expectedly.
```
This study provides proof-of-concept of the phenotypic AST method based on the multichannel CCS. In the
presence of antibiotics, dynamic processes of bacterial growth are monitored on-line in a non-destructive manner
to generate growth curves. Thus, the MICs of antibiotics against target microorganisms are directly obtained. The
```
total EAs between the CCS AST assays and the reference BMD AST assays are 68.8–92.3%; this demonstrates the
```
accuracy of the new method for standard bacterial strains and isolates. This approach is superior to the BMD
AST method in terms of simplicity, sensitivity and user-friendliness. The sensor itself is affordable. Moreover,
the cost for applications is low because it does not involve expensive instruments or auxiliary chemicals. The
proposed method provides an automated way to perform AST assays beyond situations where optical methods
can be used. It is also a promising high-throughput tool. More validation experiments are planned, e.g., assays
in the presence of blood, nanomaterials, silts or micro-plastics. We expect that these experiments will help clini-
cal laboratories develop a versatile platform for rapid MIC determination of diverse types of microorganisms
including adherent species.
```
Received: 14 August 2020; Accepted: 11 November 2020
```
References
1. Belkum, A. V. et al. Developmental roadmap for antimicrobial susceptibility testing systems. Nat. Rev. Microbiol. 17, 51–62 (2019).
2. Avesar, J. et al. Rapid phenotypic antimicrobial susceptibility testing using nanoliter arrays. Proc. Natl. Acad. Sci. USA 114, E5787–
```
E5795 (2017).
```
3. Osińska, A. et al. The prevalence and characterization of antibiotic-resistant and virulent Escherichia coli strains in the municipal
```
wastewater system and their environmental fate. Sci. Total Environ. 577, 367–375 (2017).
```
4. Schumacher, A. et al. In vitro antimicrobial susceptibility testing methods: agar dilution to 3D tissue-engineered models. Eur. J.
```
Clin. Microbiol. Infect. Dis. 37, 187–208 (2018).
```
5. Boolchandani, M., D’Souza, A. W. & Dantas, G. Sequencing-based methods and resources to study antimicrobial resistance. Nat.
```
Rev. Genet. 20, 356–370 (2019).
```
6. Schoepp, N. G. et al. Digital quantification of DNA replication and chromosome segregation enables determination of antimicrobial
```
susceptibility after only 15 minutes of antibiotic exposure. Angew. Chem. Int. Ed. 55, 9557–9561 (2016).
```
7. Mezger, A. et al. A general method for rapid determination of antibiotic susceptibility and species in bacterial infections. J. Clin.
```
Microbiol. 53, 425–432 (2015).
```
8. Schoepp, N. G. et al. Rapid pathogen-specific phenotypic antibiotic susceptibility testing using digital LAMP quantification in
```
clinical samples. Sci. Transl. Med. 9, eaal3693 (2017).
```
9. Veses-Garcia, M. et al. Rapid phenotypic antibiotic susceptibility testing of uropathogens using optical signal analysis on the
```
nanowell slide. Front. Microbiol. 9, 1530 (2018).
```
10
```
Vol:.(1234567890)
```
```
Scientific Reports | (2020) 10:21216 | https://doi.org/10.1038/s41598-020-77938-7
```
www.nature.com/scientificreports/
10. Deris, J. B. et al. The innate growth bistability and fitness landscapes of antibiotic-resistant bacteria. Science 342, 1237435 (2013).
11. Syal, K. et al. Current and emerging techniques for antibiotic susceptibility tests. Theranostics 7, 1795–1805 (2017).
12. Zhang, X. et al. Advances in online methods for monitoring microbial growth. Biosens. Bioelectron. 126, 433–447 (2019).
13. Tannert, A. et al. Phenotypic antibiotic susceptibility testing of pathogenic bacteria using photonic readout methods: recent
```
achievements and impact. Appl. Microbiol. Biot. 103, 549–566 (2019).
```
14. Yang, K. et al. Rapid antibiotic susceptibility testing of pathogenic bacteria using heavy-water-labeled single-cell Raman spectros-
```
copy in clinical samples. Anal. Chem. 91, 6296–6303 (2019).
```
15. Zhou, M. et al. Comparison of five commonly used automated susceptibility testing methods for accuracy in the China Antimi-
```
crobial Resistance Surveillance System (CARSS) hospitals. Infect. Drug. Resist. 11, 1347–1358 (2018).
```
16. Vourli, S. et al. Evaluation of two automated systems for colistin susceptibility testing of carbapenem-resistant acinetobacter
```
baumannii clinical isolates. J. Antimicrob. Chemother. 72, 2528–2530 (2017).
```
17. Safavieh, M. et al. Rapid real-time antimicrobial susceptibility testing with electrical sensing on plastic microchips with printed
```
electrodes. ACS Appl. Mater. Interfaces 9, 12832–12840 (2017).
```
18. Besant, J. D., Sargent, E. H. & Kelley, S. O. Rapid electrochemical phenotypic profiling of antibiotic-resistant bacteria. Lab. Chip
```
15, 2799–2807 (2015).
```
19. Namgyeong, J. et al. Aptamer-functionalized capacitance sensors for real-time monitoring of bacterial growth and antibiotic
```
susceptibility. Biosens. Bioelectron. 102, 164–170 (2018).
```
20. Ekinci, K., et al. Method and device for antibiotic Susceptibility Testing based on fluctuations of electrical resistance in a micro-
```
channel. United States Patent (US 10,214,763 B2) Feb, 2109, 26.
```
21. Kong, W. et al. Antibacterial evaluation of flavonoid compounds against E. coli by microcalorimetry and chemometrics. Appl.
```
Microbiol. Biot. 99, 6049–6058 (2015).
```
22. Etayash, H. et al. Microfluidic cantilever detects bacteria and measures their susceptibility to antibiotics in small confined volumes.
```
Nat. Commun. 7, 12947 (2016).
```
23. Idelevich, E. A. et al. Rapid detection of antibiotic resistance by MALDI-TOF mass spectrometry using a novel direct-on-target
```
microdroplet growth assay. Clin. Microbiol. Infect. 24, 738–743 (2018).
```
24. Irith, W., Kai, H. & Robert, E. W. H. Agar and broth dilution methods to determine the minimal inhibitory concentration (MIC)
```
of antimicrobial substances. Nat. Protoc. 3, 163–175 (2008).
```
25. Jin, W. Y., Jang, S. J. & Lee, M. J. Evaluation of VITEK 2, microScan, and phoenix for identifcation of clinical isolates and reference
```
strains. Diag. Microbiol. Infect. Dis. 70, 442–447 (2011).
```
26. Fredborg, M. et al. Real-time optical antimicrobial susceptibility testing. J. Clin. Microbiol. 51, 2047–2053 (2013).
27. Jiang, C. et al. Antifouling strategies for selective in vitro and in vivo sensing. Chem. Rev. https://doi.org/10.1021/acs.chemrev.9b007
```
39 (2020).
```
28. Zhang, X. et al. Online monitoring of bacterial growth with electrical sensor. Anal. Chem. 90, 6006–6011 (2018).
29. Ahmed, A. et al. Biosensors for whole-cell bacterial detection. Clin. Microbiol. Rev. 27, 631–646 (2014).
30. Settu, K. et al. Impedimetric method for measuring ultra-low E. coli concentrations in human urine. Biosens. Bioelectron. 66,
```
244–250 (2015).
```
31. Lin, H. et al. Revisiting with a relative-density calibration approach the determination of growth rates of microorganisms by use
```
of optical density data from liquid cultures. Appl. Environ. Microb. 76, 1683–1685 (2010).
```
32. Clinical and Laboratory Standards Institute. Methods for dilution antimicrobial susceptibility tests for bacteria that grow aerobi-
```
cally; approved standard-10th ed. CLSI document M07-A10. CLSI Wayne PA, 2015.
```
33. Kuban, P. & Hauser, P. C. Fundamental aspects of contactless conductivity detection for capillary electrophoresis. Part I: frequency
```
behavior and cell geometry. Electrophoresis 25, 3387–3397 (2004).
```
34. Zhang, X. et al. Monitoring acid-base, precipitation, complexation and redox titrations by a capacitively coupled contactless
```
conductivity detector. Measurement 116, 458–463 (2018).
```
35. Smith, K. P. & Kirby, J. E. Verification of an automated, digital dispensing platform for at-will broth microdilution-based antimi-
```
crobial susceptibility testing. J. Clin. Microbiol. 54, 2288–2293 (2016).
```
36. Zhang, X. et al. Quantitative determination of target gene with electrical sensor. Sci. Rep.-UK 5, 12539 (2015).
37. Tang, Y. et al. Rapid antibiotic susceptibility testing in a microfluidic pH sensor. Anal. Chem. 85, 2787–2794 (2013).
38. Theophel, K. et al. The importance of growth kinetic analysis in determining bacterial susceptibility against antibiotics and silver
```
nanoparticles. Front. Microbiol. 5, 544 (2014).
```
39. Patel, J.B., Cockerill, F.R. & Alder, J. Performance standards for antimicrobial susceptibility testing; twenty-fourth informational
supplement. CLSI Wayne PA, 2014.
40. Lopateka, M., Wieczorek, K. & Osek, J. Prevalence and antimicrobial resistance of vibrio parahaemolyticus isolated from raw
```
shellfish in poland. J. Food Protect. 78, 1029–1033 (2015).
```
41. Varshney, M. & Li, Y. B. Double interdigitated array microelectrode-based impedance biosensor for detection of viable Escherichia
```
coli O157:H7 in growth medium. Talanta 74, 518–525 (2008).
```
42. Zhang, X. et al. Conductometric sensor for viable Escherichia coli and Staphylococcus aureus based on magnetic analyte separation
```
via aptamer. Microchim. Acta 187, 43 (2020).
```
Acknowledgments
```
This work was supported by the National Key R&D Program of China (2019YFD0900505 and 2017YFE1015200).
```
Author contributions
X.Z., J.W. and K.Q. designed the study. X.Z., X.J., Q.Y., Y.X., X.W. conducted experiments. X.S. and J.Z. analyzed
data. G.X. and Y.Z. helped to isolate bacteria cells from natural samples.
Competing interests
The authors declare no competing interests.
Additional information
Supplementary information is available for this paper at https ://doi.org/10.1038/s4159 8-020-77938 -7.
Correspondence and requests for materials should be addressed to J.W. or K.Q.
Reprints and permissions information is available at www.nature.com/reprints.
Publisher’s note Springer Nature remains neutral with regard to jurisdictional claims in published maps and
institutional affiliations.
11
```
Vol.:(0123456789)
```
```
Scientific Reports | (2020) 10:21216 | https://doi.org/10.1038/s41598-020-77938-7
```
www.nature.com/scientificreports/
Open Access This article is licensed under a Creative Commons Attribution 4.0 International
License, which permits use, sharing, adaptation, distribution and reproduction in any medium or
```
format, as long as you give appropriate credit to the original author(s) and the source, provide a link to the
```
Creative Commons licence, and indicate if changes were made. The images or other third party material in this
article are included in the article’s Creative Commons licence, unless indicated otherwise in a credit line to the
material. If material is not included in the article’s Creative Commons licence and your intended use is not
permitted by statutory regulation or exceeds the permitted use, you will need to obtain permission directly from
the copyright holder. To view a copy of this licence, visit http://creativecommons .org/licenses/by/4.0/.
```
© The Author(s) 2020ARTICLE
```
A fast impedance-based antimicrobial
susceptibility test
Daniel C. Spencer 1 , Teagan F. Paton 2, Kieran T. Mulroney3 , Timothy J. J. Inglis 2,3, J. Mark Sutton 4 &
Hywel Morgan 1 ✉
```
There is an urgent need to develop simple and fast antimicrobial susceptibility tests (ASTs)
```
that allow informed prescribing of antibiotics. Here, we describe a label-free AST that can
deliver results within an hour, using an actively dividing culture as starting material. The
bacteria are incubated in the presence of an antibiotic for 30 min, and then approximately 105
cells are analysed one-by-one with microfluidic impedance cytometry for 2–3 min. The
measured electrical characteristics reflect the phenotypic response of the bacteria to the
mode of action of a particular antibiotic, in a 30-minute incubation window. The results are
consistent with those obtained by classical broth microdilution assays for a range of anti-
biotics and bacterial species.
```
https://doi.org/10.1038/s41467-020-18902-x OPEN
```
1 Department of Electronics and Computer Science, and Institute for Life Science, University of Southampton, Hampshire SO17 1BJ, UK. 2 Department of
Microbiology, PathWest Laboratory Medicine, Nedlands, WA 6009, Australia. 3 Faculty of Health and Medical Sciences, University of Western Australia,
Nedlands, WA 6009, Australia. 4 Public Health England, National Infection Service, Porton Down, Salisbury, Wiltshire SP4 0JG, UK. ✉email: hm@ecs.soton.ac.uk
```
NATURE COMMUNICATIONS | (2020) 11:5328 | https://doi.org/10.1038/s41467-020-18902-x | www.nature.com/naturecommunications 1
```
```
1234567890():,;
```
A
```
ntimicrobial resistance (AMR) is a global problem
```
resulting in a year-on-year increase in the incidence of
drug resistant infections. AMR is expected to be respon-
sible for 10 million deaths annually by 2050 1 . Excessive and
otherwise inappropriate prescription of antibiotics promotes
```
resistance; an estimated 30–50% of all antimicrobial prescriptions
```
are unnecessary 2 . The rapid rise in multi- and pan-drug resistant
infections highlights an urgent need to improve infection diag-
nosis and management tools to improve the stewardship of a
dwindling stock of effective antibiotics. In particular, there is an
immediate need for rapid tests to support evidence-based anti-
microbial prescribing. Most antibiotic testing in UK hospitals is
currently performed using classical culture-dependent micro-
biology methods that provide a susceptibility profile within
24–48 h, or longer. Consequently, antibiotics are first prescribed
on a presumptive basis, without any definitive indication of their
in vitro antibiotic efficacy. Unfortunately, there are no simple and
```
fast alternative antimicrobial susceptibility tests (AST) available.
```
An AST can be either a genotypic or phenotypic test. Geno-
typic susceptibility testing classifies resistance based on the pre-
```
sence or absence of particular resistance genes (for example the
```
mecA gene for Methicillin-resistant Staphylococcus aureus
```
(MRSA)) and is only an approximation to susceptibility deter-
```
mination. These tests are expensive and limited to panels of
known genes. Furthermore, the absence of a gene does not
necessarily correlate with phenotypic susceptibility, for example
carbapenem-resistant bacteria may not carry a carbapenemase
gene but may have phenotypic resistance through a combination
of two or more mechanisms including reduced permeability
```
(porin switching/loss), upregulation of multidrug efflux pumps
```
```
(mutations in regulator genes) and overexpression/acquisition of
```
```
other non-carbapenemase β-lactamases (e.g. AmpC). This is a
```
considerable weakness of genotypic tests given the ever-increasing
range of resistance genes and the ability of bacteria to achieve
phenotypic resistance through a combination of multiple
mechanisms. Similarly, presence of a gene does not always equate
with resistance since the gene may be weakly expressed, point
mutations may affect substrate specificity, or resistance genes may
be associated with other deleterious effects. Whole genome
sequencing is uneconomic at present at an estimated $80 per
genome based on 1-week turnaround and thus is not rapid within
the clinical decision time frame 3 . In contrast, phenotypic testing
evaluates the specific viability or growth response of an organism
to the presence of an antibiotic and directly demonstrates whe-
ther a microbial isolate will be inhibited by the antibiotic tested.
This method therefore remains the reference standard used by
microbiology labs worldwide.
Phenotypic ASTs are most commonly performed using either a
```
broth micro-dilution (BMD) or a disk diffusion assay. The BMD
```
method provides a semi-quantitative measurement of anti-
microbial susceptibility known as the minimum inhibitory con-
```
centration (MIC) for an antibiotic. Growth is measured in a range
```
```
of different concentrations of antibiotic (typically a log-2 dilution
```
```
series). The lowest concentration to inhibit growth visible by eye is
```
determined to be the MIC. Although this method is used as a
reference standard, it generally requires a minimum incubation of
16–24 h and sometimes longer. The internationally recognised
standard for AST is MIC determination by a specific version of
BMD as described in ISO 200776-1, 20064. Classification of AST
```
results into broad categories [Susceptible (S); Susceptible, Increased
```
```
exposure (I) (formerly designated Intermediate); or Resistant (R)]
```
can be made by comparing MIC results to species-specific
breakpoints published by the European Committee on Anti-
```
microbial Susceptibility Testing (EUCAST, Europe) or the Clinical
```
```
& Laboratory Standards Institute (CLSI, USA). Methods for
```
antimicrobial susceptibility testing are therefore validated against
BMD before introduction into clinical practice. Some automated
AST platforms use susceptible optical readers or include metabolic
```
probes with specialist media to provide faster results (6–8 h after
```
```
initial isolation). An example of a new FDA approved imaging-
```
```
based AST technology is the Accelerate Pheno system (Accelerate
```
```
Diagnostics, Tuscon, AZ) that provides a sample ID using FISH
```
and uses morpho-kinetic time-lapse imaging to provide an AST
from a positive blood culture in around 6 h5 . For a recent review
on the current state of the art in AST systems see6 .
Improvements in antibiotic stewardship urgently requires the
development of rapid AST, and a test that provides a suscept-
ibility profile within a clinical shift would have a major impact on
```
many clinical applications. A much-reduced time to result (e.g.
```
```
around 1-h post-culture) would be particularly advantageous in
```
providing information promptly enabling clinicians to expedite
evidence-based prescribing. The issues and barriers that hinder
the implementation of rapid tests were recently reviewed by van
Belkum et al. 7 , and the authors propose a roadmap for the
development of new diagnostics tests.
Rapid phenotypic tests require new methods to detect changes
```
in bacterial properties (for example morphology, membrane
```
```
structure, metabolism, and cell growth) long before bacterial
```
death occurs.
One example of a phenotypic response is the influence of the β-
lactam class of antibiotics, which collectively account for 65% of
worldwide consumption of antibiotics 8 . Their mode of action is
through inhibition of the transpeptidase activity of penicillin-
binding proteins, preventing the final stage in cross-linking of the
bacterial peptidoglycan present in the cell wall. A biophysical
consequence of this action is elongation or swelling of bacteria at
concentrations above the MIC. In fact this effect can lead to
```
errors in systems that rely on colorimetry or turbidometry (such
```
```
as in the Vitek-2, Phoenix, MicroScan WalkAway) because larger
```
particles may increase the light scattering used to determine cell
growth 9 . β-lactam antibiotics account for 70% of US prescrip-
tions, thus a fast and simple AST is required to accurately eval-
uate their activity in treatment. Particularly important are the
Carbapenem class of β-lactams that resist hydrolysis by most β-
lactamases and are often used as antibiotics of last resort. The
```
World Health Organization (WHO) identified the emergence of
```
carbapenem-resistant Klebsiella pneumoniae as its leading prior-
ity 10 . K. pneumoniae and related species are the most prominent
```
carbapenem-resistant Enterobacteriaceae (CRE) and cause an
```
excess hospital mortality of 27% in patients with septicaemia and
pneumonia 11 .
```
Other classes of antibiotic such as polymyxins (Colistin) cause
```
biophysical changes in cell membrane permeability prior to cell
death. Consequently, AST methods that rely on cell growth or
metabolic activity do not report results in <6 h 12,13 . To address
this, several rapid AST assays have been developed 13–15 . Flow
cytometry has been widely proposed for rapid ASTs: antibiotic
exposure leads to changes in susceptible strains of bacteria that
```
can be measured by (label-free) light scatter and/or fluorescent
```
viability markers 16 . However, differentiation between anti-
microbial exposed and unexposed populations has proved diffi-
cult and new approaches such as adaptive multi-dimensional
statistics have been developed 17 . An assay for carbapenem resis-
tance has been developed that uses acoustic-focusing flow cyto-
metry to deliver a rapid S/R classification together with a
quantitative MIC in ~2 h from a clinical isolate 18,19 . Flentie
et al.20 introduced a novel assay that measured bacterial con-
centrations by binding a small-molecule amplifier to the bacterial
surface. The technique delivers a phenotypic AST within 5 h for
non-fastidious bacteria by measuring bacterial replication where
organisms form filaments or swell in response to antibiotic
exposure.
ARTICLE NATURE COMMUNICATIONS | https://doi.org/10.1038/s41467-020-18902-x
```
2 NATURE COMMUNICATIONS | (2020) 11:5328 | https://doi.org/10.1038/s41467-020-18902-x | www.nature.com/naturecommunications
```
Measuring the growth rates of bacteria is an attractive means of
directly determining an AST. This is usually done optically, for
example Choi et al. 21 used single-cell time-lapse imaging to
determine an AST in 4 h by automatically categorising morpho-
logical changes in single cells growing on a thin agarose slab in
the presence of antibiotics. Baltekin et al.22 trapped bacteria in
micro-channels and monitored growth in the presence or absence
of antibiotic from the change in the length of the sample in the
channel. Controlled diffusion in micro-channels can be exploited
to create a continuous gradient in antibiotic concentration and
therefore allow determination of an MIC in a single chamber 23 .
Growth rates can also be measured by detecting changes in the
mass of bacteria using resonant cantilevers24 . The system was
integrated within a microfluidic channel, bacteria were captured
with antibodies and the response determined in a short time
```
window (30 min) 25 . Rapid methods based on electrochemical
```
labels have also been reported. Metabolically active bacteria were
detected through the reduction of resazurin giving an antibiotic
susceptibility profile in 1 h 26 . Resazurin has also been used as an
optical probe to rapidly determine the phenotypic susceptibility
in nano-litre volume arrays 27 . The growth rate kinetics of exposed
and control samples were compared, and an antibiotic profile
obtained in 4–5 h.
In this paper we describe a rapid label-free phenotypic AST
that delivers a resistance profile in as little as 30 min. The tech-
nique which we call impedance-based Fast Antimicrobial Sus-
```
ceptibility Test (iFAST) measures changes in the electrical and
```
morphological properties of many thousands of single organisms
at high throughput using microfluidic impedance cytometry. In
order to align the test with standard microbiology protocols, an
inoculum is first taken from an overnight bacterial culture. This is
resuspended in growth medium for 30 min and then incubated
with an antibiotic for a further 30 min. Approximately 10 5 bac-
teria are measured in a time window of 2–3 min to determine a
```
response profile (Fig. 1). The utility of the method was first
```
demonstrated by measuring the MIC for carbapenem-resistant
K. pneumoniae. Rapid analysis at the Susceptible/Resistant
```
clinical breakpoints (EUCAST v10) was demonstrated for car-
```
bapenems against Escherichia coli, Acinetobacter baumannii, and
Pseudomonas aeruginosa. We also show that the technology is
capable of identifying resistance profiles for a wide range of
```
antibiotics with different modes of actions (Colistin, Aminogly-
```
```
cosides (Gentamicin), Fluoroquinolones (Ciprofloxacin), Cepha-
```
```
losporins (Ceftazidime), and antibiotic/inhibitor combinations
```
```
(Co-amoxiclav) against Gram-negative organisms, and Cefoxitin
```
```
against S. aureus (MRSA)). Together, these organisms contribute
```
```
the greatest number of directly attributable deaths in Europe; 28
```
they are also included in the WHO Priority drug resistant
pathogens29 .
Results
Measurement principle. iFAST measures changes in the bio-
physical properties of bacteria after exposure to antibiotics mea-
sured by microfluidic impedance cytometry, a well-established
method that has been widely used for label-free characterisation
of mammalian cells30–32 . The technique measures the electrical
properties of single particles as they flow between microelectrodes
```
within a microfluidic chip (Fig. 1a). The electrodes are driven by
```
an AC signal of several frequencies and when a cell flows along
```
the channel it perturbs the AC current; the measured change is
```
the impedance for the individual particle 30,33 . Despite widespread
use of the technique, measurement of micron-sized particles has
proved challenging requiring specialised electronics 34 , complex
```
microfluidic approaches 35,36 , or shallow channels (differentiation
```
```
of Gram-negative from Gram positive bacteria)37 .
```
In this work we show that accurate analysis of bacterial
properties by impedance is made possible using a system with
```
considerably improved sensitivity (Signal to Noise Ratio, SNR)
```
allowing rapid measurement of micron-sized particles in a
```
channel with a large cross section (~20 μm × 40 μm) with a limit
```
```
of detection of ~400-nm radius (see Supplementary Fig. 1 for
```
```
details). The principle of measurement is similar to a conven-
```
tional impedance cytometer device where cells suspended in an
electrolyte flow along the channel one-by-one through two pairs
```
of electrodes (Fig. 1a). In a conventional cytometer system two
```
pairs of electrodes measure a differential signal. The new
```
electrode arrangement (Fig. 1a and Supplementary Fig. 1) uses
```
two pairs of electrodes in each arm of a differential circuit thus
```
reducing the baseline current (no cell) in each of the
```
transimpedance amplifiers, enabling higher amplifier gain, and
higher SNR. This method enables small particles such as
```
microorganisms to be characterised at high speed (up to 1000/
```
```
s) in high conductivity media in a large channel with minimal risk
```
```
clogging by cells and debris (and low fluid back pressure). It thus
```
provides a new way of characterising subtle biophysical changes
in bacteria, enabling the effects of antibiotic exposure to be
measured after a very short time window. Micron-sized
polystyrene beads are added to every sample as reference
particles. These beads have well defined electrical properties
```
(and size), and are used to eliminate device to device variation
```
and non-linearities in the measurement electronics 38 .
The electrical properties of a cell are generally characterised
using a simple equivalent electrical model. An example is shown
in Fig. 1b30 , modified to include the double membrane of a
Gram-negative bacterial cell. At low AC frequencies, the bacteria
behave as insulators so that the impedance signal is proportional
to cell volume. At higher frequencies other effects influence the
impedance signal, particularly changes in cell wall and cell
membrane. These effects are shown in Fig. 1b where a simulated
```
spectrum of the Real part of the impedance signal (differential
```
```
current) vs. frequency shows the frequency windows where
```
changes in cell properties are apparent. At low frequencies the
```
measurement principle is similar to the Coulter counter; the
```
impedance signal directly correlates with cell volume. Thus,
changes in for example cell length or filamentation are measured
```
at low frequencies (although the high frequency signals are also
```
```
modulated). The low frequency impedance is also influenced by
```
```
cell wall conductivity; a cell with an electrically leaky membrane is
```
no longer a perfect insulator and its apparent volume will thus
decrease. Changes in cytoplasmic conductivity only affect the
high frequency part of the spectrum, whereas changes in
```
membrane or cell wall capacitance (permittivity) are observed
```
in the mid-frequency range of the spectrum. In other words,
several different phenotypic responses can influence the measured
signal, depending on the applied frequency. To factor out the
influence of cell size on the high frequency impedance
measurement, the ratio of high-to-low frequency impedance is
typically reported as the “electrical opacity”. The net contribution
of each of these separate elements to the total signal provides an
electrical fingerprint for an organism.
β-lactam antibiotics specifically target the bacterial cell wall,
interfering with cell division, and the maintenance of cell wall
synthesis causing filamentation or spheroplast formation 9 . These
phenotypic changes in size and/or cell wall lead to changes in the
electrical properties as shown in the impedance scatter plot of
Fig. 1c where data for K. pneumoniae before and after exposure to
Meropenem are plotted. A measurable shift is observed in the
```
electrical parameters of the population along both axes (refer to
```
```
red contour). Antibiotic exposed cells increase approximately
```
```
threefold in volume (mean diameter increase by 50%, from 1.8 to
```
```
2.6 μm). Antibiotic-induced changes in the cell wall also lead to a
```
NATURE COMMUNICATIONS | https://doi.org/10.1038/s41467-020-18902-x ARTICLE
```
NATURE COMMUNICATIONS | (2020) 11:5328 | https://doi.org/10.1038/s41467-020-18902-x | www.nature.com/naturecommunications 3
```
```
reduction in electrical opacity, (approximately in inverse propor-
```
```
tional to cell capacitance) reflecting structural changes in the cell
```
wall. This change in impedance of bacteria occurs as early as 10
```
min post-exposure and continues for over 30 min (typical
```
```
doubling time). This effect is shown by the time series in Fig. 2.
```
Changes in electrical phenotype are also observed when cells
are exposed to other classes of antibiotics. Certain antibiotics
```
(e.g. Colistin) directly alter membrane properties which is
```
reflected in changes in the electrical cell size, whilst
```
others (ciprofloxacin or gentamicin) inhibit DNA gyrase and
```
a
b
c
d
20 μm
5 + 40 MHz
LIA
15
10 Cell Length
```
(± 20%)
```
Wall
conductivity
Internal conductivity
Wall Permittivity
5
```
Frequency (Hz)
```
```
Real (i
```
DIFF
```
) (nA)
```
104 106 10 8
15
10
5
```
Frequency (Hz)
```
```
Real (i
```
DIFF
```
) (nA)
```
104 106 10 8
Diff
ZMR
MED
1
0.8
0.6
1 1.5 2 2.5
Unexposed
sample
contour
3 1 1.5 2 2.5 3
CMED
ZM
Rσ Cσ
I–V
I–V
Outer
membrane
K. pneumoniae
```
Electrical opacity(|Z
```
40 MHz
|/|Z
5 MHz
```
|)
```
```
Electrical diameter (|Z5 MHz|1/3)
```
Retrieve isolate from
frozen culture.
Or fresh
overnight
culture
Pre-
incubation
Antibiotic
exposure
```
0 0.25 0.5 8 (mg/L)
```
Electrical
MIC
Concentration
Cells in contour
Broth microdilution
```
iFAST: electrical AST
```
18–24 h
18–24 h
30 min
30 min
```
Electrical diameter (|Z5 MHz|1/3)
```
1
0.8
```
0.6Electrical opacity(|Z
```
40 MHz
|/|Z
5 MHz
```
|)
```
1.5 μm beads
+β-lactam
Exposure time
Cell
membrane
Periplasmic space
/peptidoglycan
90°
40 μm
Fig. 1 Principle of rapid impedance-based antimicrobial susceptibility testing. a Multi-electrode microfluidic impedance chip. Cells flow one-by-one
```
between sets of electrodes and are measured simultaneously at two frequencies using a lock-in-amplifier (LIA). b Equivalent electrical equivalent circuit
```
model for a Gram-negative bacteria, and a simulated spectrum of the Real part of the impedance vs. frequency highlighting frequency windows where
```
changes in cell properties become apparent. c Impedance scatter plot of bacteria (K. pneumoniae, 10,000 events) together with 1.5-μm diameter
```
```
polystyrene beads (with doublets and triplets) that are used as reference particles. The x-axis is the cube root of the impedance (proportional to diameter)
```
measured at a frequency of 5 MHz. The y-axis is the electrical opacity, a measure of membrane/cell wall properties normalised to cell volume. This is
```
measured at 40 MHz where the electrical properties of the cell wall and membrane are most apparent (see b). Two data sets are pre- and post-exposure to
```
Meropenem at the clinical breakpoint for 30 min at 37 °C. In the scatter plot, the red contour defines the initial cell population. The diagram illustrates the
```
change in cell properties following exposure to a β-lactam antibiotic as the cell wall breaks down (reduction in opacity) and the bacteria swell (increase in
```
```
volume). d Experimental methodology for the impedance-based Fast Antimicrobial Susceptibility Test (iFAST). An actively dividing culture is prepared and
```
```
incubated for 30 min with antibiotics. Polystyrene beads are added and the sample is measured for 3 min to determine the electrical MIC (see
```
```
Supplementary information for further details).
```
ARTICLE NATURE COMMUNICATIONS | https://doi.org/10.1038/s41467-020-18902-x
```
4 NATURE COMMUNICATIONS | (2020) 11:5328 | https://doi.org/10.1038/s41467-020-18902-x | www.nature.com/naturecommunications
```
protein translation respectively releasing toxic intermediates
following inhibition of essential cellular processes and ultimately
lead to cell death.
The principle of iFAST is shown in Fig. 1d and is designed to
mirror a typical microbiology lab workflow. After an overnight
```
culture (as for a standard AST) bacterial cultures are incubated
```
for 30 min at 37 °C to ensure they are actively dividing. The
cultures are then exposed to antibiotics of various classes and
```
concentrations for a further 30 min before measurement (3 min)
```
using impedance cytometry. The MIC of an antibiotic is
determined by measuring the electrical response of the same
isolate exposed to different concentrations of antibiotic. Micro-
```
biology laboratories generally report strains as susceptible;
```
susceptible, increased exposure or resistant by breakpoint analysis
using interpretive criteria. iFAST can also distinguish sensitivity
and resistance at fixed breakpoint concentrations for different
bacterial species and antibiotic classes.
```
Minimum inhibitory concentration (MIC): carbapenem. The
```
electrical MIC obtained using iFAST was compared with the MIC
determined using standard BMD for three different strains of K.
```
pneumoniae [susceptible (strain 18397); susceptible, increased expo-
```
```
sure (strain KS11); or resistant (strain K14)] exposed to six different
```
Meropenem concentrations, measured according to protocol 1
```
(Supplementary Fig. 2a). Figure 3a shows a set of scatter plots of
```
electrical opacity vs. electrical diameter for these isolates. For the
```
susceptible strain (18397) changes in electrical properties are
```
observed even at the lowest concentration of antibiotic, whilst K14
```
(resistant) shows no changes at up to 8 mg/L. The MIC of the
```
```
strains determined by BMD (in triplicate) was K14 = 128 mg/L,
```
```
KS11 = 8 mg/L, and 18397 < 0.25 mg/L. Figure 3b shows the elec-
```
trical MIC for ten different strains of K. pneumonia that have a
```
range of different MICs (see Supplementary Table 1 for details of
```
```
strains). The data is plotted as the % cells within a contour (or gate)
```
defined by the unexposed population vs. antibiotic concentration
```
(for three biological replicates). Qualitatively the data shows that
```
there are three different “classes” of response. The three resistant
```
strains (red) all demonstrate no change in the exposed vs. unex-
```
```
posed gate. The five susceptible strains (blue) all demonstrate a large
```
change in the scatter plot and absolute cell count for the lowest
```
concentration of antibiotic (0.25 mg/L). The susceptible, increased
```
```
exposure strains (orange) fall to >50% cell count within the gate at
```
an antibiotic concentration >2 mg/L. The accepted definition for a
BMD MIC is inhibition of growth visible by eye, but there is no
equivalent EUCAST standard for fast MIC tests. Assuming a
doubling time of 30 min, a bacteriostatic agent with no biophysical
changes would approximately halve the number of cells compared
with a control gate. If the MIC is calculated at an assumed threshold
of 50%, all strains have a MIC within a single twofold dilution of the
BMD results.
Exposure of actively dividing Meropenem-susceptible isolates to
inhibitory concentrations of the drug has been demonstrated to
```
produce a range of cellular morphotypes; cells elongate, swell,
```
balloon, and eventually proceed to complete cell lysis as they become
compromised. The impedance measurement data shown here is
consistent with this range of changes but measured in very short
time frames. As the scatterplots show, there is a population shift out
```
of the original unexposed contour; in this case almost 100% of the
```
cells migrate within the 30-min exposure. At high antibiotic
concentration of 8 mg/L, small numbers of cells remain in the
original gate for both 18397 and KS11. These could be a population
```
of non-viable cells that are electrically leaky (18397), or resistant cells
```
```
(KS11), or may simply reflect the time taken by Meropenem to kill
```
all of the cells in the population given its mode of action.
0–1 min 1–2 min 2–3 min 3–4 min 4–5 min 5–6 min 6–7 min
7–8 min 8–9 min 9–10 min 10–11 min 11–12 min 12–13 min 13–14 min
14–15 min 15–16 min 16–17 min 17–18 min 18–19 min 19–20 min 20–21 min
21–22 min 22–23 min 23–24 min 24–25 min
```
Electrical diameter (|Z5 MHz|1/3 )
```
```
Electrical opacity (
```
|Z|
40 MHz
/|Z
|5 MHz
```
)
```
25–26 min 26–27 min 27–28 min
Fig. 2 Time course of changes in electrical properties of K. pneumoniae following β-lactam exposure. A sample of a Meropenem-susceptible strain of K.
pneumoniae was exposed to Meropenem at 2 mg/L. The sample was maintained at a temperature of 37 °C and measured continuously for 30 min. The data
was segmented into 1 min intervals and plotted as a series of scatter plots. Cells measured in the first minute were used to define the reference contour
```
shown in red. Note that the x- and y-axis limits are identical for all figures (not shown for clarity) and are 1.2–3.0 (x-axis) and 0.4–0.9 (y-axis). Source data
```
are provided as a Source Data file.
NATURE COMMUNICATIONS | https://doi.org/10.1038/s41467-020-18902-x ARTICLE
```
NATURE COMMUNICATIONS | (2020) 11:5328 | https://doi.org/10.1038/s41467-020-18902-x | www.nature.com/naturecommunications 5
```
Breakpoint analysis. Clinical breakpoints are based on the epi-
demiological cut-off values taken from bacterial culture collec-
tions, and define antibiotic concentrations that enable
interpretation of the results of MIC tests to classify bacterial
```
isolates as susceptible (S); susceptible, increased exposure
```
```
(I); or resistant (R) to that antibiotic when used therapeutically.
```
Breakpoints reflect drug potency against a population of potential
pathogens, the pharmacokinetics/pharmacodynamics of the
antibiotic and the dosing regimens that may be achievable in the
clinic. For example, isolates of Enterobacteriaceae with an MIC of
2 mg/L Meropenem or lower are defined by EUCAST as suscep-
tible, and an MIC greater than 8 mg/L is defined as resistant. A
MIC > 2 mg/L, but no more than 8 mg/L is in an intermediate
category that may require an increased Meropenem dose for
some infections caused by this bacterial isolate. We tested the
utility of the iFAST technology to rapidly measure the breakpoint
```
for different antibiotics and priority pathogens (see Supplemen-
```
```
tary Table 1) to see if it could correctly classify strains as
```
```
susceptible or resistant, using protocol 2 (Supplementary Fig. 2b).
```
In these experiments we measured growth, cell volume and
membrane biophysical changes after incubation with Meropenem
```
at the clinical breakpoints (2 mg/L; susceptible and 16 mg/L;
```
```
resistant). The data was quantified by measuring the number of
```
cells in the unexposed contour after 30 min incubation with
```
Meropenem (Fig. 4). Figure 4a summarises the results for strains
```
```
measured at the S/I boundary (inhibition of growth at 2 mg/L
```
```
indicates a susceptible strain), whilst Fig. 4b summarises mea-
```
surements where strains were exposed to a higher concentration
```
(16 mg/L). This concentration was selected because growth at >8
```
mg/L indicates resistance according to EUCAST guidelines. The
bars are coloured according to standard BMD data with red
indicating resistant strains and blue for susceptible strains. In all
cases, the difference between resistant and susceptible strains is
statistically significant as indicated in the figure.
```
The orange bar labelled KP CNCR (carbapenemase negative
```
```
carbapenem resistant) is an isolate of K. pneumoniae that has
```
0 mg/L
0.8
a
b
0.7
0.6
0.8
0.7
0.6
0.8
0.7
0.6
0.8
0.7
0.6
0.8
0.7
0.6
0.8
0.7
0.6
0.8
0.7
0.6
0.8
0.7
0.6
0.8
0.7
0.6
0.8
0.7
0.6
0.8
0.7
0.6
0.8
0.7
0.6
0.8
0.7
0.6
0.8
0.7
0.6
0.8
0.7
0.6
1.5 2.5 3.5
1.5 2.5 3.5
1.5
100 MIC by BMD = 128 mg/L
MIC by BMD = 8 mg/L
MIC by BMD < 0.25 mg/L
```
Cells in control gate (%)
```
50
0
0.25 mg/L0.5 mg/L
1 mg/L2 mg/L4 mg/L8 mg/L
2.5 3.5 1.5 2.5 3.5 1.5 2.5 3.5 1.5 2.5 3.5 1.5 2.5 3.5 1.5 2.5 3.5 1.5 2.5 3.5
1.5 2.5 3.5 1.5 2.5 3.5 1.5 2.5 3.5 1.5 2.5 3.5 1.5 2.5 3.5 1.5 2.5 3.5
1.5 2.5 3.5 1.5 2.5 3.5 1.5 2.5 3.5 1.5 2.5 3.5 1.5 2.5 3.5 1.5 2.5 3.5
0.8
0.7
0.6
0.8
0.7
0.6
0.8
0.7
0.6
0.8
0.7
0.6
0.8
0.7
0.6
0.8
0.7
0.6
0.25 mg/L 0.5 mg/L 1 mg/L 2 mg/L 4 mg/L 8 mg/L
18397
KS11
K14
```
Electrical opacity(|Z
```
|40 MHz
/|Z
|5 MHz
```
)
```
```
Electrical diameter (|Z 5 MHz|1/3)
```
```
Fig. 3 Electrical minimum inhibitory concentration (MIC). a Scatter plots showing electrical size vs. electrical opacity for three different strains of
```
K. pneumoniae exposed to different concentrations of Meropenem ranging from 0 to 8 mg/L (see Supplementary Fig. 2, protocol 1) Top row: 18397
```
(susceptible), middle row: KS11 (susceptible, increased exposure), bottom row: K14 (resistant). No changes are observed across all concentrations for K14,
```
```
whilst a small shift in population is observed for 18397 even at 0.25 mg/L. Broth micro-dilution (BMD) was used (same samples) to measure the MIC and
```
```
to classify the strains (red = 128 mg/L, orange = 8 mg/L, and blue < 0.25 mg/L). b Electrical MIC for ten different strains of K. pneumoniae that have a
```
```
range of different MICs (see Supplementary Table 1). The data is plotted as the % cells in a contour (or gate) defined by the unexposed population vs.
```
```
antibiotic concentration for three biological replicates (mean ± SD). Source data are provided as a Source Data file.
```
ARTICLE NATURE COMMUNICATIONS | https://doi.org/10.1038/s41467-020-18902-x
```
6 NATURE COMMUNICATIONS | (2020) 11:5328 | https://doi.org/10.1038/s41467-020-18902-x | www.nature.com/naturecommunications
```
no carbapenemases, but is resistant to carbapenems under stan-
dard testing, probably due to a combination of porin loss and
upregulated AmpC expression. At higher concentrations of
Meropenem, a decrease in cell count and change in biophysical
properties was observed, but less than in the susceptible isolate
```
(Fig. 4c). E. coli expressing KPC-2 is clearly differentiated from E.
```
```
coli carbapenemase negative (compare bars 4 and 5 in Fig. 4a, b).
```
Carbapenem-resistant A. baumannii expressing Oxa-23 showed a
similar profile to that seen for K. pneumoniae, with both a change
in opacity and electrical radius, and could be clearly differentiated
```
from a susceptible isolate (bar 6 and 7). As P. aeruginosa has a
```
slower growth rate compared to other strains tested in this study,
the same samples were measured after 30 and 60 min antibiotic
```
exposure (see bars 8–11). Differences in profile between
```
susceptible and resistant strains are still apparent after 30 min
especially at the higher concentrations, despite the slower growth
```
rate. The longer incubation (1 h) improves discrimination
```
between the Meropenem-susceptible and Meropenem-resistant
```
isolate at the lower concentration of Meropenem (Fig. 4a, bars 10
```
```
and 11). In all cases the differences between resistant and
```
susceptible isolates were shown to be statistically significant,
across triplicate experiments.
While β-lactam agents are the most widely utilised antibiotics,
other front-line antibiotics play a considerable role in treating
infections but have different modes of action. The utility of iFAST
to determine susceptibility, independent of antibiotic mechanism,
was studied with a range of species-antibiotic combinations,
chosen as having the highest morbidity/mortality as outlined in a
recent pan-European study28. This work examined the impact of
antibiotic-resistant bacteria and identified increased incidence of
infection with antibiotic-resistant bacteria combinations taken
from the European Antimicrobial Resistance Surveillance Network
```
(EARS-Net) 201528. These organisms were also included in the
```
```
European Centre for Disease Prevention and Control (ECDC)
```
point prevalence survey of health-care-associated infections and
```
antimicrobial use (2011–2012), and in the list of EU antibiotic
```
resistance policy indicators published as a joint scientific opinion
by the ECDC, European Food Safety Authority, and European
Medicines Agency28. The outcome of the study identified a
number of antibiotic–pathogen combinations that have the largest
```
impact measured in DALYs (see Fig. 1 in ref. 28). Despite a low
```
incidence, carbapenem-resistant K pneumoniae had a high burden
of disease because of its high attributable mortality. Other high
impact combinations include carbapenem resistant P. aeruginosa,
carbapenem-resistant Acinetobacter spp, third-generation cepha-
losporin-resistant E. coli, third-generation cephalosporin-resistant
K. pneumoniae, Colistin-resistant K. pneumoniae, and MRSA. We
```
also measured aminoglycoside (gentamicin) and a β-lactam with
```
```
β-lactamase inhibitor (e.g. co-amoxiclav), a commonly used front-
```
line treatment.
To validate the broad utility of the impedance technology, we
set out to demonstrate the ability of the approach to differentiate
between resistant and susceptible isolates treated with different
antibiotic classes on the basis of breakpoint determination. In
a
c
b2 mg/L 16 mg/L
100
80
60
```
Cells in control gate (%)
```
40
20
0
100
150
```
Cells in control gate (%)
```
50
0
1
0.8
0.6
```
2 mg/L 16 mg/LElectrical opacity(|Z
```
|40 MHz
/|Z|
5 MHz
```
)
```
Electrical diameter
```
(|Z5 MHz|1/3)
```
```
Electrical opacity(|Z
```
|40 MHz
/|Z|
5 MHz
```
)
```
0.4 1 1.5 2 2.5 3 3.5
Electrical diameter
```
(|Z5 MHz|1/3)
```
1 1.5 2 2.5 3 3.5
1
0.8
0.6
0.4
```
KP(KPC)KP (CN)EC (KPC)EC (CN)ACB (CN)
```
```
PAE 30 m (VIM-10)PAE 60 m (VIM-10)
```
```
PAE 30 m (CN)PAE 60 m (CN)ACB (OXA-23)
```
```
KP (CNCR)
```
```
KP(KPC)KP (CN)EC (KPC)EC (CN)ACB (CN)
```
```
PAE 30 m (VIM-10)PAE 60 m (VIM-10)
```
```
PAE 30 m (CN)PAE 60 m (CN)ACB (OXA-23)
```
```
KP (CNCR)
```
Fig. 4 Electrical breakpoint analysis for Meropenem. Eleven different strains of bacteria analysed by impedance cytometry after exposure to Meropenem
```
at the clinical breakpoint. (KP K pneumoniae, EC E. coli, ACB A. baumannii, PAE P. aeruginosa) (see Supplementary Fig. 2, protocol 2). a, b Each bar is the
```
```
percentage of cells in the unexposed contour (or gate) after exposure to antibiotics at the clinical breakpoint. The susceptible/susceptible, increased exposure
```
```
(S/I) and susceptible/resistant (S/R) boundaries are 2 and 16 mg/L, respectively. The bars show the mean ± SD for three biological replicates (*p < 0.05;
```
```
**p < 0.01; ***p < 0.001) with p values obtained using the Student’s t test for independent samples (one tailed). Red bars indicate resistant strains and blue
```
```
bars indicate susceptible strains, as determined by broth micro-dilution. The orange bar (CNCR) is a carbapenemase negative strain that is carbapenem
```
```
resistant. P values (from left to right) are as follows 1.04 × 10−4, 2.66 × 10−4, 7.14 × 10−4, 2.46 × 10−5, 1.43 × 10−2 , 1.15 × 10−3, 1.97 × 10−3, 3.00 × 10−2,
```
2.19 × 10−4 , 2.40 × 10−3 , 6.13 × 10−4, 2.63 × 10−3 . c Scatter plots for a CNCR strain of K. pneumoniae after exposure to Meropenem for 30 min at the S/NS
```
breakpoint (2 mg/L) and the R/NR breakpoint (16 mg/L) concentrations. Source data are provided as a Source Data file.
```
NATURE COMMUNICATIONS | https://doi.org/10.1038/s41467-020-18902-x ARTICLE
```
NATURE COMMUNICATIONS | (2020) 11:5328 | https://doi.org/10.1038/s41467-020-18902-x | www.nature.com/naturecommunications 7
```
each experiment we looked at a resistant and a susceptible isolate,
focussing on the high burden pathogen–antibiotic combinations
identified above. As shown in Fig. 5, it was possible to clearly
differentiate between the susceptible and resistant strains in all
examples tested, with statistically significant differences. Intrigu-
ingly, the pattern of migration out of the control contour differed
between different antibiotic classes. For β-lactam type antibiotics,
ceftazidime, and co-amoxiclav, there was a clear increase in the
electrical diameter of the susceptible population, similar to that
```
seen with carbapenems (Fig. 3) although this was greater in
```
ceftazidime-treated K. pneumoniae than for similarly treated E.
coli. Interestingly, only co-amoxiclav treated K. pneumoniae
showed the decrease in electrical opacity that had previously been
seen with Meropenem treatment. Cefoxitin, used here as a
surrogate for methicillin in line with EUCAST testing protocols,
gave a very different response in S. aureus. No changes were seen
```
in the population for MRSA (constitutive MecA expressing
```
```
strain), but a reduction in the electrical diameter was observed for
```
MSSA after exposure to antibiotic. This metric allows rapid
discrimination of resistant from susceptible clinical isolates. The
```
electrical opacity for both MRSA and MSSA did not change (see
```
```
Supplementary Fig. 3) but plotting the electrical phase against
```
```
diameter (Fig. 5) enhances discrimination for the MSSA isolate.
```
The change in phase may reflect the different role of
peptidoglycan in Gram-positive compared to Gram-negative
bacteria which translates into a different impedance spectrum.
Ciprofloxacin, a fluoroquinolone, induced a small increase in
electrical size in a susceptible population compared to the
resistant strain. Ciprofloxacin inhibits DNA gyrase and leads to
the accumulation of DNA fragments and leakage from the cell.
Binding of the drug to the gyrase causes double-strand DNA
breaks which lead to suppressed cell division and a change in the
aspect ratio39,40 although these effects take several hours to fully
develop. This is consistent with observations in Fig. 5, where the
mean volume of the population approximately doubles after 30
min exposure.
For Colistin and gentamicin, there was a small shift in the cell
populations in the resistant isolates, possibly reflecting small
changes in the electrical properties of the bacterial membrane
upon interaction with these cationic compounds. Despite the
small shift in the mean position of the resistant population
relative to the contour, much larger differences were observed
with the susceptible isolates. A reduction in the electrical diameter
is observed for both antibiotics, together with a reduction in the
total cell count in the case of gentamicin, as shown by the
decrease in the density of the scatter plot for the exposed
population. Gentamicin is a widely use aminoglycoside and
suppresses protein synthesis by binding to the ribosome. It also
permeabilises the membrane due to its cationic characteristics at
physiological pH 41 which correlates with the observed small
changes in electrical properties of the resistant population
```
(increased opacity and reduction in apparent volume). For the
```
susceptible cells, the total count is markedly reduced after 30 min
and a large decrease in apparent cell size is seen, consistent with
an increase in the permeability of the membrane. A similar trend
following exposure to Colistin is observed. This cationic
polymyxin interacts with the outer membrane leading to
deformation, pore formation and leakage. It permeabilises the
cytoplasmic membrane, ultimately leading to cell lysis and death.
The observed reduction in the measured electrical cell volume
correlates with an increase in membrane permeability 42 . In both
cases, cell volume did not increase consistent with the absence of
any filamentation 43 .
Each antibiotic–bacteria combination test was repeated three
times and the data summarised in the bar chart. For all antibiotics
```
tested (except gentamicin and Colistin) the numbers of cells in
```
the exposed resistant population matches with the unexposed
population as shown by the red bars at ~100%. For Colistin and
gentamicin, the small shift in the resistant populations seen in the
scatter plot mean that the cell count in the unexposed contour is
reduced. Nevertheless, the susceptible strains are all statistically
```
different (p = 0.01).
```
Discussion
This work demonstrated an ultra-rapid AST that measures the
electrical properties of thousands of single bacteria to determine a
susceptibility profile in a very short time window. The assay is
```
label-free and extremely simple; involving exposure of a bacterial
```
```
suspension to antibiotics, incubation (at 37 °C), dilution and
```
measurement. This technique mirrors the reference standard
BMD assay in terms of both the phenotypic rationale for the
measurement and the demonstrable relationship between MIC
measurement methods, but is much quicker. Continuous direct
measurements of bacteria directly in media containing antibiotics
is also possible by monitoring growth and biophysical changes in
```
real-time (Fig. 2). This provides added value as a research tool to
```
understand the responses of bacterial populations to antibiotics at
the single-cell level.
Phenotypic analysis is the agreed standard for antimicrobial
susceptibility testing, largely because presence or absence of a
resistance gene does not perfectly correspond to susceptibility
to an antibiotic. An example of this is carbapenemase-negative,
```
but carbapenem resistant (CNCR) Enterobacteriaceae; the
```
summary data in Fig. 4 demonstrates that iFAST can detect
CNCR strains. Of note, the CNCR cells show a phenotypic
response to Meropenem at high antibiotic concentrations,
compared to cells with KPC which is a very efficient carbape-
nemase. iFAST technology has been demonstrated for both
rapid MIC and breakpoint analysis. For antimicrobial stew-
ardship, breakpoint analysis provides the bulk of data used by
prescribing physicians. The MIC determination is used only
where an understanding of the level of susceptibility of an
```
isolate is required (for example in surveillance, epidemiology,
```
```
or mechanistic studies).
```
Optical flow cytometry has been widely utilised to monitor
```
bacterial growth by a combination of cell size (determined
```
```
from optical scatter) and fluorescent dyes (e.g. to measure via-
```
```
bility) 16–18 . In comparison, impedance cytometry is a label-free
```
```
method that directly measures both cell volume (size) and other
```
phenotypic changes that are reflected in the electrical signature.
In iFAST, we observed changes in the electrical properties of cells
due to the action of antibiotics such as β-lactams, whereas only
small changes in optical scatter signal are observed using flow
cytometry 16,44,45 . Unlike electrical techniques, optical methods
indirectly determine cell volume from light scattering and the
signal can be influenced by cell refractive index, shape, and
orientation 46 , and by debris in the suspension. To overcome this,
a combination of optical scatter and fluorescence dyes are used as
a dual trigger 47 . However, the use of fluorescent dyes precludes
real-time measurements, because many dyes intercalate with
DNA and inhibit growth. Dyes are often expensive and demand
more sample preparation steps, including washing and cen-
trifugation. Impedance analysis can perform continuous real-time
```
measurement (Fig. 2) and easily discriminates debris from cells
```
without a “label” because the electrical properties of cells are
distinct. In this work we have demonstrated that the changes
observed in the electrical properties of bacteria following anti-
biotic exposure are easy to resolve without recourse to complex
statistical analysis 17 .
Overall, the iFAST approach shows utility for the rapid
detection of antibiotic susceptibility across a range of clinically
ARTICLE NATURE COMMUNICATIONS | https://doi.org/10.1038/s41467-020-18902-x
```
8 NATURE COMMUNICATIONS | (2020) 11:5328 | https://doi.org/10.1038/s41467-020-18902-x | www.nature.com/naturecommunications
```
1
0.8
```
Colistin (KP)
```
```
Ceftazidime (KP) Ceftazidime (EC) Co-amoxiclav (KP)
```
Resistant
Susceptible Susceptible Susceptible
Susceptible
```
Susceptible (MSSA)
```
Susceptible Susceptible
Resistant Resistant
Resistant
```
Resistant (MRSA)
```
Resistant Resistant
```
Gentamicin (KP) Ciprofloxacin (KP)
```
0.8
0.6
1
0.8
0.6
0.6
0.4
1
0.8
0.8
0.6
100
50
0
0.4
0.2
0
0.8
0.6
0.4
0.2
0
1 1.5 2
```
Cefoxitin (SA)
```
2.5 3 3.5
0.8
0.6
0.6
0.4
1
0.8
0.8
0.6
0.6
0.4
1
0.8
0.8
0.6
0.6
0.4
1 1.5 2 2.5 3 3.5 1 1.5 2 2.5 3 3.5 1 1.5 2 2.5 3 3.5
1 1.5 2 2.5 3 3.5 1 1.5 2 2.5 3 3.5 1 1.5 2 2.5 3 3.5
0.8
0.6
0.4
1
0.8
0.6
0.8
0.6
0.4
```
Electrical opacity(|Z
```
|40 MHz
/|Z|
5 MHz
```
)
```
```
Electrical opacity(|Z
```
|40 MHz
/|Z|
5 MHz
```
)
```
```
Electrical phase (40 MHz)
```
```
Cells in control gate (%)
```
```
Electrical diameter (|Z5 MHz|1/3)
```
```
Electrical diameter (|Z5 MHz|1/3)
```
Electrical diameter
```
(|Z 5 MHz|1/3)
```
```
KP(COL Res)KP (COL Sus)KP (GEN Res)KP (Gen Sus)KP (CIP Res)KP (CIP Sus)KP (CEF Res)KP (CEF Sus)EC (CEF Res)EC (CEF Sus)
```
```
MRSA (CEFOX)MSSA (CEFOX)KP (COAMX Res)KP (COAMX Sus)
```
Fig. 5 Breakpoint analysis for different antibiotic mechanisms. Scatter plots for susceptible and resistant bacteria after exposure to different antibiotics
```
(see inset labels) at the S/R clinical breakpoint. The figure shows K. pneumoniae (KP), E. coli (EC), and S. aureus (SA) exposed to antibiotics which have
```
```
different modes of action. The bar chart shows the percentage of cells inside the unexposed contour (mean ± SD for three biological repeats, red bar:
```
```
resistant strain, blue bar susceptible strain as determined by broth micro-dilution) *p < 0.05; **p < 0.01; ***p < 0.001, with p values obtained using
```
```
the Student’s t test for independent samples (one tailed), from left to right as follows: 1.04 × 10−3 , 1.83 × 10−3, 1.36 × 10−3, 1.53 × 10−3, 2.06 × 10−3,
```
1.96 × 10−6, 1.33 × 10−5 . Source data are provided as a Source Data file.
NATURE COMMUNICATIONS | https://doi.org/10.1038/s41467-020-18902-x ARTICLE
```
NATURE COMMUNICATIONS | (2020) 11:5328 | https://doi.org/10.1038/s41467-020-18902-x | www.nature.com/naturecommunications 9
```
important pathogen–antibiotic combinations. The simplicity of
the measurement technique suggests that the method is suitable
for a new generation of rapid tests for the clinical laboratory. The
ability of the technique to measure at the single-cell level, pro-
vides considerable benefit to resolve largely unseen responses in
bacterial populations being treated, such as being able to monitor
sub-populations that may be resistant or tolerant of the antibiotic
and the emergence of resistance in near real-time. This provides a
direct biophysical measure of the properties of these sub-
populations which may help us understand these complex phe-
nomena and pave the way towards the development of improved
therapies.
Methods
Assay protocols. Two different protocols were used in evaluating antimicrobial
```
susceptibility 48, summarised in Supplementary Fig. 2. In Protocol 1 (Supplemen-
```
```
tary Fig. 2a), the iFAST electrical MIC protocol was designed to mirror a classical
```
micro-dilution assay. A colony was picked from a plate and incubated overnight in
Tryptic Soy Broth to stationary phase. An aliquot of this culture was diluted into
```
Cation Adjusted Mueller Hinton Broth (MHB) to an approximate concentration of
```
5 × 105 cells/mL. The bacterial concentration was determined by measurement with
the microfluidic impedance cytometer. The sample was then incubated at 37 °C for
```
30 min to obtain an actively dividing culture. Aliquots (950 μL) were added to 7
```
pre-warmed test tubes each containing 50 μL MHB and Meropenem at a final
antibiotic concentration of 0, 0.25, 0.5, 1, 2, 4, or 8 mg/L. The tubes were incubated
```
for 30 min at 37 °C, cells washed once in Hanks Balanced Salt Solution (HBSS) then
```
```
diluted 1:10 in HBSS. 1.5-μm diameter polystyrene beads (reference particles,
```
```
Polysciences) were added to each aliquot (@10 4/mL). Finally, each sample was
```
loaded into a syringe and measured by pumping it through the impedance chip at a
flow rate of 30 μL/min for 3 min. In parallel an aliquot of the actively dividing
culture was taken and used for a standard BMD assay.
```
Protocol 2 (Supplementary Fig. 2b) measures the phenotypic response at the
```
```
antibiotic breakpoint with the concentration(s) of antibiotics fixed at a pre-defined
```
concentration. For this assay, three colonies were picked from a plate and added to
3 mL of MHB. The sample was vortexed to re-suspend the bacteria and then
diluted to a concentration of 5 × 105 /mL in MHB. The sample was incubated for
30 min at 37 °C to obtain an actively dividing culture. Aliquots of 500 μL were
```
added to test tubes containing a pre-warmed volume (500 μL) of MHB, each with a
```
final antibiotic concentration at the clinical breakpoint according to EUCAST
```
guidelines: 2 mg/L and 16 mg/L for Meropenem (S/I, and S/R boundary), 1 mg/L
```
for ciprofloxacin, 8 mg/L for gentamicin, 4 mg/L for Colistin, 8 mg/L for
```
ceftazidime, along with a control (no antibiotic). Each tube was incubated for 30
```
```
min at 37 °C (antibiotic exposure), then the sample diluted 1:10 in HBSS. 1.5-μm
```
diameter beads were added and the sample measured for 2 min at 30 μl/min in the
impedance micro-cytometer.
Impedance micro-cytometer. Microfluidic chips were fabricated using photo-
```
lithography and wafer bonding. Briefly, metal (Pt) electrodes were patterned onto
```
```
two 6-inch glass substrates (200 nm Pt and 10 nm Ti patterned by ion beam
```
```
milling). Channels (20-μm deep) were made by patterning SU8 onto one wafer.
```
The second wafer was bonded to the first wafer by vacuum bonding at 180 °C, 10
kN for 6 h. Channels had cross sectional dimensions of 20 μm × 40 μm and elec-
trodes were 30-μm wide with 10-μm gaps. Fluidic connections were made using
custom 3-D printed acrylic interconnects that utilised 1.6 mm OD 0.5 mm ID
Teflon tubing with Teflon gripper ferrules. Bacterial suspensions were loaded into a
1 mL syringe and pushed through the impedance cytometer chips with a Harvard
Instruments syringe pump at 30 μL/min. The impedance signal of each cell was
```
measured using a Zurich Instruments impedance scope (HF2IS) and custom PCB
```
front end amplifier board connected to the glass micro-cytometer using Samtech
```
SEI series connectors. Two frequencies (5 and 40 MHz) were applied simulta-
```
neously to the electrodes. A signal of 4 V was used and the differential current
sampled at 230k samples per second.
Data analysis. The impedance data signals were processed using custom soft-
ware written in MATLAB. The impedance of each particle was determined from
the peak signal amplitude for each applied frequency using convolution. The
mean signal of the 1.5-μm beads was determined automatically in each experi-
ment by searching within a pre-defined gate/contour. The opacity-cell size
scatter plot was normalised by a single linear multiplier for each axis to ensure
the mean of the beads is at opacity = 1 and diameter = 1.5 μm. Several para-
meters can be examined to determine susceptibility—e.g. size change due to β-
lactams, or change in electrical opacity due to cell wall changes, or a decrease in
growth rate. These are all captured by comparing the unexposed sample to the
exposed sample. A contour is defined automatically around the population of
cells in the aliquot not exposed to antibiotic. This is termed the unexposed
contour and is calculated automatically using a density plot of the cells to
```
include 50% of the cell population. A decrease in growth rate (indicating a
```
```
susceptible strain) results in fewer cells in the control sample. Equally, a change
```
```
in biophysical properties (susceptible strain) but continued growth moves some
```
or all of the exposed sample outside the control gate and thus leaves fewer cells
in the control gate. Statistical comparisons between susceptible and resistant or
untreated populations were carried out using a one tailed Student’s t test with p
value ranges given in the figure captions.
Reporting summary. Further information on research design is available in the Nature
Research Reporting Summary linked to this article.
Data availability
The data supporting this study are openly available from the University of Southampton
repository at https://doi.org/10.5258/SOTON/D1405 which contains the source data
underlying Figs. 2, 3, 4, 5 and Supplementary Fig. 3. Source data are provided with
this paper.
Code availability
```
The impedance data was collected using ZiControl (version 19.05, Zurich Instruments
```
```
and is freely available at https://www.zhinst.com). Data analysis scripts were developed in
```
```
MATALB (version 2019a, Mathworks) and are available from the corresponding author
```
on reasonable request. Statistical analysis was performed using standard functions
available in MATLAB.
```
Received: 10 February 2020; Accepted: 17 September 2020;
```
References
1. O’Neill, J. (ed.) The Review on Antimicrobial Resistance. Tackling drug-
```
resistant infections globally: final report and recommendations. 1–72 (amr-
```
```
review.org, HM Government, 2016).
```
2. Milani, R. V. et al. Reducing inappropriate outpatient antibiotic prescribing:
normative comparison using unblinded provider reports. BMJ Open Quality. 8,
```
e000351 (2019).
```
3. Su, M., Satola, S. W. & Read, T. D. Genome-based prediction of bacterial
```
antibiotic resistance. J. Clin. Microbiol 57, e01405–e01418 (2019).
```
4. Clinical laboratory testing and in vitro diagnostic test systems—Susceptibility
testing of infectious agents and evaluation of performance of antimicrobial
susceptibility test devices—Part 2: evaluation of performance of antimicrobial
susceptibility test devices. ISO 200776-1. https://www.iso.org/standard/41631.
```
html. (2007).
```
5. Lutgring, J. D. et al. Evaluation of the accelerate pheno system: results from
```
two academic medical centers. J. Clin. Biol. 54, e01672–17 (2018).
```
6. van Belkum, A. et al. Innovative and rapid antimicrobial susceptibility testing
```
systems. Nat. Rev. Microbiol. 18, 299–311 (2020).
```
7. van Belkum, A. et al. The JPIAMR AMR-RDT Working Group on
Antimicrobial Resistance and Rapid Diagnostic Testing. Developmental
roadmap for antimicrobial susceptibility testing systems. Nat. Rev. Microbiol
```
17, 51–62 (2019).
```
8. Elander, R. P. Industrial production of beta-lactam antibiotics. Appl.
```
Microbiol. Biotechnol. 61, 385–392 (2003).
```
9. Fredborg, M. et al. Automated image analysis for quantification of filamentous
```
bacteria. BMC Microbiol. 15, 255 (2015).
```
10. World Health Organization. Global Priority List of Antibiotic-resistant
bacteria to guide research, discovery and development of new antibiotics.
World Health Organization. https://www.who.int/medicines/publications/
```
WHO-PPL-Short_Summary_25Feb-ET_NM_WHO.pdf (2017).
```
11. Hauck, C. et al. Spectrum of excess mortality due to carbapenem-resistant
```
Klebsiella pneumoniae infections. Clin. Microbiol. Infect. 22, 513–519 (2016).
```
the Antibacterial Resistance Leadership Group.
12. Jorgensen, J. H. & Ferraro, M. J. Antimicrobial susceptibility testing: a review
of general principles and contemporary practices. Clin. Infect. Dis. 49,
```
1749–1755 (2009).
```
13. Maugeri, G., Lychko, I., Sobral, R. & Roque, A. C. A. Identification and
antibiotic-susceptibility profiling of infectious bacterial agents: a review of
```
current and future trends. Biotechnol. J. 14, 1700750 (2018).
```
14. Li, Y., Yang, X. & Zhao, W. Emerging microtechnologies and automated
systems for rapid bacterial identification and antibiotic susceptibility testing.
```
SLAS Technol. 22, 585–608 (2017).
```
15. Leonard, H., Colodner, R., Halachmi, S. & Segal, E. Recent advances in the
race to design a rapid diagnostic test for antimicrobial resistance ACS. Sensors
```
3, 2202–2217 (2018).
```
16. Walberg, M. & Steent, H. B. Flow cytometric monitoring of bacterial
```
susceptibility to antibiotics. Methods Cell Biol. 64, 553–566 (2001). Part B.
```
ARTICLE NATURE COMMUNICATIONS | https://doi.org/10.1038/s41467-020-18902-x
```
10 NATURE COMMUNICATIONS | (2020) 11:5328 | https://doi.org/10.1038/s41467-020-18902-x | www.nature.com/naturecommunications
```
17. Huang, T.-H. et al. Rapid cytometric antibiotic susceptibility testing utilizing
adaptive multidimensional statistical metrics. Anal. Chem. 87, 1941–1949
```
(2015).
```
18. Mulroney, K. T. et al. Rapid susceptibility profiling of carbapenem-resistant
```
Klebsiella pneumoniae. Sci. Rep. 7, 903 (2017).
```
19. Inglis, T. J. J., Paton, T. F., Kopczyk, M. K., Mulroney, K. T. & Carson, C. F.
Same-day antimicrobial susceptibility test using acoustic-enhanced flow
cytometry visualized with supervised machine learning. J. Med. Microbiol. 69,
```
657–669 (2020).
```
20. Flentie, K. et al. Microplate-based surface area assay for rapid phenotypic
```
antibiotic susceptibility testing. Sci. Rep. 9, 237 (2019).
```
21. Choi, J. et al. A rapid antimicrobial susceptibility test based on single-cell
```
morphological analysis. Sci. Transl. Med. 6, 267ra174 (2014).
```
22. Baltekin, Ö., Boucharin, A., Tano, E., Andersson, D. I. & Elf, J. Antibiotic
susceptibility testing in less than 30 min using direct single-cell imaging. PNAS
```
114, 9170–9175 (2017).
```
23. Kim, S., Lee, S., Kim, J. K., Chung, H. J. & Jeon, J. S. Microfluidic-based
observation of local bacterial density under rapid antimicrobial concentration
gradient for rapid antibiotic susceptiiulity testing. Biomicrofluidics 13, 014108
```
(2019).
```
24. Godin, M. et al. Using buoyant mass to measure the growth of single cells.
```
Nat. Methods 7, 387–390 (2010).
```
25. Etayash, H., Khan, M. F., Kaur, K. & Thundat, T. Microfluidic cantilever
detects bacteria and measures their susceptibility to antibiotics in small
```
confined volumes. Nat. Comm. 7, 12947 (2016).
```
26. Besant, J. D., Sargent, E. H. & Kelley, S. O. Rapid electrochemical phenotypic
```
profiling of antibiotic- resistant bacteria. Lab. Chip 15, 2799–2807 (2015).
```
27. Avesar, J. et al. Rapid phenotypic antimicrobial susceptibility testing using
```
nanoliter arrays. PNAS 114, E5787–E5795 (2017).
```
28. Cassini, A. et al. Attributable deaths and disability-adjusted life-years caused
by infections with antibiotic-resistant bacteria in the EU and the European
Economic Area in 2015: a population-level modelling analysis. Lancet Infect.
```
Dis. 19, 56–66 (2019). the Burden of AMR Collaborative Group.
```
29. World Health Organization. Antimicrobial resistance. Factsheet no. 194.
World Health Organisation Media Centre. http://www.who.int/mediacentre/
```
factsheets/fs194/en/HO. AMR challenge (2014).
```
30. Sun, T. & Morgan, H. Single-cell microfluidic impedance cytometry: a review.
```
Microfluidics Nanofluidics 8, 423–443 (2010).
```
31. Gawad, S., Cheung, K., Seger, U., Bertsch, A. & Renaud, P. Dielectric
spectroscopy in a micromachined flow cytometer: theoretical and practical
```
considerations. Lab Chip 4, 241–251 (2004).
```
32. Chen, J. et al. Microfluidic impedance flow cytometry enabling high-
throughput single-cell electrical property characterization. Int. J. Mol. Sci. 16,
```
9804–9830 (2015).
```
33. Morgan, H., Sun, T., Holmes, D., Gawad, S. & Green, N. G. Single cell
```
dielectric spectroscopy. J. Phys. D: Appl. Phys. 40, 61–70 (2007).
```
34. Haandbæk, N., Bürgel, S. C., Heer, F. & Hierlemann, A. Resonance-enhanced
microfluidic impedance cytometer for detection of single bacteria. Lab Chip
```
14, 3313–3324 (2014).
```
35. Bernabini, C., Holmes, D. & Morgan, H. Micro-impedance cytometry for
detection and analysis of micron-sized particles and bacteria. Lab Chip 11,
```
407–412 (2011).
```
36. Choi, H. et al. A flow cytometry-based submicron-sized bacterial detection
```
system using a movable virtual wall. Lab Chip 13, 2327–2333 (2014).
```
37. Clausen, C. H. et al. Bacteria detection and differentiation using impedance
```
flow cytometry. Sensors 18, 3496 (2018).
```
38. Spencer, D. & Morgan, H. High-speed single-cell dielectric spectroscopy. ACS
```
Sens. 5, 423–430 (2020).
```
39. Bos, J. et al. Emergence of antibiotic resistance from multinucleated bacterial
```
filaments. PNAS 112, 178–183 (2015).
```
40. Nonejuie, P. 1 et al. Bacterial cytological profiling rapidly identifies the
cellular pathways targeted by antibacterial molecules. PNAS 110, 16169–16174
```
(2013).
```
41. Martin, N. L. & Beveridge, T. J. Gentamicin interaction with Pseudomonas
```
aeruginosa cell envelope. Antimicrob. Agents Chemother. 29, 1079–1087 (1986).
```
42. Spencer, D. C. & Morgan, H. Microfluidic impedance cytometry of tumour
```
cells in blood. Biomicrofluidics 8, 064124 (2014).
```
43. Velkov, T., Thompson, P. E., Nation, R. L. & Li, J. Structure—activity
```
relationships of polymyxin antibiotics. J. Med Chem. 53, 1898–1916 (2010).
```
44. Walberg, M., Gaustad, P. & Steen, H. B. Rapid assessment of ceftazidime,
ciprofloxacin, and gentamicin susceptibility in exponentially-growing E. coli
```
cells by means of flow cytometry. Cytometry 27, 169–178 (1997).
```
45. Huang, T.-H., Tzeng, Y.-L. & Dickson, R. M. FAST: rapid determinations of
antibiotic susceptibility phenotypes using label-free cytometry. Cytom. Part A
```
93A, 639–648 (2018).
```
46. Foladori, P., Quaranta, A. & Ziglio, G. Use of silica microspheres having
refractive index similar to bacteria for conversion of flow cytometric forward
```
light scatter into biovolume. Water Res 42, 3757–3766 (2008).
```
47. Davey, H. M. & Kell, D. B. Flow cytometry and cell sorting of heterogeneous
microbial populations: the importance of single-cell analyses. Microbiological
```
Rev. 60, 641–696 (1996).
```
48. Spencer, D. C., Paton, T., Inglis, T. J. J., Sutton, J. M., and Morgan, H. A fast
impedance-based antimicrobial susceptibility test. Protoc. Exch. https://doi.
```
org/10.21203/rs.3.pex-1088/v1 (2020).
```
Acknowledgements
We would like to thank Ying Tran for fabricating the micro-cytometer chips. H.M. would
like to thank the Royal Society for funding. T.J.J.I. and D.C.S. acknowledge travel funding
from the University of Western Australia.
Author contributions
H.M. conceived the concept. All authors planned the experiments. T.J.J.I. and K.T.M.
selected bacterial isolates for the MIC experiments, and T.F.P. prepared the isolates and
ran the broth microdilutions. J.M.S provided data on antibiotic susceptibility and
resistance mechanisms of strains used and prepared fresh overnight plates for analysis.
D.C.S. created the experimental setup and ran the micro-cytometer experiments. D.C.S.
wrote the analysis software and analysed the data. H.M. and D.C.S. prepared the
manuscript. H.M., D.C.S., J.M.S., T.F.P. and T.J.J.I. reviewed and contributed to the
manuscript.
Competing interests
H.M., D.C.S., and T.J.J.I are authors on patent application WO 2020/058682. H.M. and
D.C.S. are authors on patent application WO 2020/058681 A1. T.F.P., K.T.M. and J.M.S.
declare no competing interests.
Additional information
Supplementary information is available for this paper at https://doi.org/10.1038/s41467-
020-18902-x.
Correspondence and requests for materials should be addressed to H.M.
Peer review information Nature Communications thanks Erik Boettger, Winnie
Svendsen and the other, anonymous, reviewer for their contribution to the peer review of
this work. Peer reviewer reports are available.
Reprints and permission information is available at http://www.nature.com/reprints
Publisher’s note Springer Nature remains neutral with regard to jurisdictional claims in
published maps and institutional affiliations.
Open Access This article is licensed under a Creative Commons
Attribution 4.0 International License, which permits use, sharing,
adaptation, distribution and reproduction in any medium or format, as long as you give
```
appropriate credit to the original author(s) and the source, provide a link to the Creative
```
Commons license, and indicate if changes were made. The images or other third party
material in this article are included in the article’s Creative Commons license, unless
indicated otherwise in a credit line to the material. If material is not included in the
article’s Creative Commons license and your intended use is not permitted by statutory
regulation or exceeds the permitted use, you will need to obtain permission directly from
the copyright holder. To view a copy of this license, visit http://creativecommons.org/
licenses/by/4.0/.
```
© The Author(s) 2020
```
NATURE COMMUNICATIONS | https://doi.org/10.1038/s41467-020-18902-x ARTICLE
```
NATURE COMMUNICATIONS | (2020) 11:5328 | https://doi.org/10.1038/s41467-020-18902-x | www.nature.com/naturecommunications 11
```
I N N O V A T I O N – 2 0 M A Y
MSF Scientific Days 2021
44
N. Malou1, M. Al Asmar2 , R. Fakhri2, N. Badaro2 ,
R. Kanapathipilai3, P. Cavailler1, A. Lover4 , S. Majeed2,
Y. Caspard5 , C. Nordon1
```
1Médecins Sans Frontières (MSF) Foundation, Paris,
```
```
France; 2 MSF, Amman, Jordan; 3MSF, Paris, France;
```
```
4University of Massachusetts, Amherst, MA, USA;
```
5Centre Hospitalier Universitaire, Grenoble, France
*nada.malou@paris.msf.org
Introduction
Timely and accurate identification of microorganisms
and assessment of antimicrobial susceptibility in
clinical specimens help clinicians in selecting the
most appropriate treatment for their patients. In low-
```
to-middle income countries (LMIC), bacteriological
```
testing is generally not performed routinely due to
technological challenges. This contributes treatment
delays and consequent clinical complications, extended
hospital stays, and the global spread of multidrug
```
resistance (MDR). The MSF Foundation has developed
```
Antibiogo, an offline smartphone-based application that
allows non-microbiologists to carry out antimicrobial
```
susceptibility testing (AST) and interpret the results. We
```
are presenting the preliminary results of the Antibiogo
performance evaluation.
Methods
Antibiogo comprises several components: the Image
```
Analysis Program (IAP) that detects and measures
```
```
inhibition zone diameters (IZDs); the Expert System (ES)
```
that adjusts AST results based on the application of
```
expert rules and identifies resistance mechanisms; and
```
the Selective Reporting Program. For the evaluation of
```
the IAP, we used collection isolates (n=8) and compared
```
the automatic measurement of IZDs using Antibiogo
with the readings made by eight laboratory technicians
who inspected the plates manually. For evaluation of the
ES, we used Antibiogo to assess 60 pathogens isolated
from bone and tissues from patients admitted to MSF’s
Reconstructive Surgical Project in Amman, Jordan,
between February and September 2020. In parallel,
pictures of AST were shared with an external clinical
microbiologist who performed an independent and blinded
interpretation. Results of the two parallel interpretations
```
were compared and the discordances categorised (minor,
```
```
major, very major).
```
Results
Evaluation of the IAP showed good concordance of
measurements between technicians and Antibiogo
```
(Krippendorff’s alpha value of 0.957, 95% confidence
```
```
interval [CI] 0.94-0.97; p<0.001). These results indicate
```
excellent inter-rater agreement between human raters
and the Antibiogo platform for these pathogen-antibiotic
pairs. For evaluation of the ES, 509 paired samples were
read in parallel, and agreement of the measured diameters
```
was excellent (R2=0.95). The ES correctly classified 474
```
```
(95.2%) of 498 interpretable samples (95% CI 92.9- 97.4),
```
corresponding to a Krippendorff’s alpha value of 90.6%
```
(95% CI 87%-94%). This indicates excellent to near-
```
perfect agreement. Further investigation of the samples
showing non-agreement is underway.
Conclusions
Preliminary results suggest that Antibiogo is a very
promising tool that can be used for the interpretation of
antibiograms. This could improve access to microbiology
diagnostic tests and the rational use of antibiotics in
LMIC. The application currently undergoing further
evaluation using a diverse set of pathogens isolated from
multiple sites.
Ethics
This study was approved by the MSF Ethics Review
Board and the Hospital Director of Al Mowasah
Hospital, Amman, Jordan.
Nada Malou
Nada Malou holds a PhD in Microbiology.
After several years spent in the field
implementing microbiology laboratories
in Mali, Jordan, and Yemen, she joined
MSF’s Operational Centre Paris medical department as a
laboratory advisor and then as bacteriology and antibiotic
resistance advisor. She has supervised the implementation
of bacteriology laboratories in the Central African Republic,
Liberia, Gaza, Yemen, Iraq, and Lebanon. She has
collaborated with the antibiotic resistance task force where
she led the microbiology intersectional group.In 2016, she
joined the MSF Foundation in order to create Antibiogo, an
open access, free, and offline smartphone-based application
that enables reading and interpretation of antibiograms by
non-expert laboratory technicians. She has continued her
involvement in the development of Antibiogo with the MSF
Foundation, while also joining the antimicrobial resistance
team of Foundation for Innovative New Diagnostics in
October 2020.
```
Antibiogo: smartphone-based application to tackle antibiotic
```
resistance challenges in low-to-middle income countries.
Session 3 Day 3 - Digital Health: The opportunities and challenges in humanitarian settings