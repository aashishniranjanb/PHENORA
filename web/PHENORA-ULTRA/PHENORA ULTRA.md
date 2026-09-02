# **PHENORA Flash — Full UI Specification**

The UI should be built as a **scientific laboratory instrument interface**, not as a conventional analytics dashboard.

The central interaction is a **horizontal experiment timeline**:

SAMPLE  
   ↓  
ACQUISITION  
   ↓  
IMPEDANCE  
   ↓  
PHENOTYPE  
   ↓  
DISEASE INTELLIGENCE  
   ↓  
DIGITAL TWIN  
   ↓  
FORECAST  
   ↓  
AUTONOMOUS DECISION  
   ↓  
FINAL RESULT

The operator moves through this pipeline while PHENORA progressively converts raw measurements into higher-level intelligence.

---

# **1\. Overall UI Architecture**

┌──────────────────────────────────────────────────────────────────────────────┐  
│ PHENORA FLASH                                      RUN PF-2026-00042         │  
│ Autonomous Multi-Frequency Bioimpedance Intelligence                       │  
├──────────────────────────────────────────────────────────────────────────────┤  
│                                                                              │  
│  ● SAMPLE ─── ● ACQUIRE ─── ◉ IMPEDANCE ─── ○ PHENOTYPE ─── ○ DISEASE ... │  
│                                                                              │  
├──────────────────────────────────────────────────────────────────────────────┤  
│                                                                              │  
│                         ACTIVE STAGE                                         │  
│                                                                              │  
│                     scientific visualization                                 │  
│                                                                              │  
├──────────────────────────────────────────────────────────────────────────────┤  
│                                                                              │  
│  SYSTEM STATUS        QUALITY       CONFIDENCE       UNCERTAINTY             │  
│  ● CONNECTED          94/100        87%               13%                    │  
│                                                                              │  
├──────────────────────────────────────────────────────────────────────────────┤  
│ RUNNING IN: SIMULATION / RESEARCH / ENGINEERING VALIDATION                  │  
└──────────────────────────────────────────────────────────────────────────────┘

There are **three information layers**:

### **Operator layer**

Shows only what is necessary to operate the experiment.

### **Scientific layer**

Shows impedance plots, features, models, uncertainty, evidence and predictions.

### **Engineering layer**

Shows device state, ADC values, FPGA state, UART packets, calibration, processing versions and diagnostics.

Do not expose everything simultaneously.

---

# **2\. Global Application Shell**

## **Top bar**

PHENORA FLASH  
Autonomous Bioimpedance Intelligence

RUN PF-2026-00042     ● SYSTEM READY     SIMULATION

Right side:

Device       HELTEC-01  
FPGA         CONNECTED  
ADC          CONNECTED  
Calibration  CAL-0042  
Mode         RESEARCH

### **Status colors**

Use semantic states rather than decorative colors:

* neutral → inactive  
* blue/primary → active  
* green → valid/complete  
* amber → warning/uncertain  
* red → failure/error  
* grey → locked/skipped

Do not use color as the only indicator.

Every status should also contain text/iconography.

---

# **3\. Horizontal Timeline**

This is the defining UI element.

\[SAMPLE\]  
   │  
   ├──── \[ACQUISITION\]  
   │  
   ├──── \[IMPEDANCE\]  
   │  
   ├──── \[PHENOTYPE\]  
   │  
   ├──── \[DISEASE\]  
   │  
   ├──── \[TWIN\]  
   │  
   ├──── \[FORECAST\]  
   │  
   ├──── \[AUTONOMY\]  
   │  
   └──── \[RESULT\]

Actually render it horizontally:

┌────────┐    ┌────────────┐    ┌───────────┐    ┌───────────┐  
│ SAMPLE │───▶│ ACQUISITION│───▶│ IMPEDANCE │───▶│ PHENOTYPE │  
└────────┘    └────────────┘    └───────────┘    └───────────┘  
                                                     │  
                                                     ▼  
┌────────┐    ┌──────────┐    ┌──────────┐    ┌────────────┐  
│ RESULT │◀───│ AUTONOMY │◀───│ FORECAST │◀───│   DISEASE  │  
└────────┘    └──────────┘    └──────────┘    └────────────┘  
                                      │  
                                      ▼  
                               ┌────────────┐  
                               │ DIGITAL    │  
                               │ TWIN       │  
                               └────────────┘

The timeline should be **scrollable horizontally**.

The currently active stage remains visually centered.

---

# **4\. Timeline Stage States**

Every stage supports:

LOCKED  
READY  
ACTIVE  
PROCESSING  
COMPLETE  
WARNING  
UNCERTAIN  
FAILED  
SKIPPED

Example:

✓ SAMPLE  
✓ ACQUISITION  
◉ IMPEDANCE  
◌ PHENOTYPE  
🔒 DISEASE  
🔒 DIGITAL TWIN  
🔒 FORECAST  
🔒 AUTONOMY  
🔒 RESULT

Clicking a completed stage should allow inspection without changing the current pipeline state.

For example, while Disease Intelligence is active:

SAMPLE       ✓  
ACQUISITION  ✓  
IMPEDANCE    ✓  
PHENOTYPE    ✓  
DISEASE      ◉  
TWIN         ○  
FORECAST     🔒  
AUTONOMY     🔒  
RESULT       🔒  
---

# **5\. Persistent Experiment Context**

Below the timeline, keep a compact context bar.

RUN  
PF-2026-00042

SAMPLE  
URINE-017

SAMPLE TYPE  
URINE

PROTOCOL  
UTI-EIS-V1

DEVICE  
PHENORA-01

CALIBRATION  
CAL-0042

MODE  
SIMULATION

This prevents the operator from losing context while moving through stages.

---

# **6\. Stage 1 — SAMPLE**

## **Purpose**

Define exactly what is being measured.

This is the entry point.

---

## **Layout**

┌─────────────────────────────────────────────────────────────┐  
│ SAMPLE                                                       │  
│ Define experiment material                                  │  
├─────────────────────────────────────────────────────────────┤  
│                                                             │  
│ Sample ID       \[ URINE-017                         \]       │  
│                                                             │  
│ Sample Type     \[ URINE ▼ \]                                 │  
│                                                             │  
│ Protocol        \[ UTI-EIS-V1 ▼ \]                            │  
│                                                             │  
│ Volume          \[ 100 µL \]                                  │  
│                                                             │  
│ Environment     \[ 25 °C \]                                   │  
│                                                             │  
│                                                             │  
│ Sample status   ● READY                                     │  
│                                                             │  
├─────────────────────────────────────────────────────────────┤  
│ \[ VERIFY SAMPLE \]                                           │  
└─────────────────────────────────────────────────────────────┘  
---

## **Sample types**

Initial:

URINE  
BLOOD  
CONTROL  
CUSTOM

But do not allow the user to select a disease model unsupported for that sample type.

For example:

Sample:  
URINE

Available intelligence:  
✓ UTI-associated models  
✓ Bacteriuria models

Unavailable:  
— Blood malaria model  
— Tissue model  
---

# **7\. Sample Validation**

After entry:

SAMPLE VALIDATION

✓ Sample ID valid  
✓ Sample type supported  
✓ Protocol compatible  
✓ Volume within protocol  
✓ Device compatible  
✓ Calibration available

STATUS  
READY FOR ACQUISITION

If something fails:

⚠ SAMPLE NOT READY

Protocol requires:  
100–500 µL

Detected:  
50 µL

\[ MODIFY SAMPLE \]  
---

# **8\. Stage 2 — ACQUISITION**

Once the user starts:

START EXPERIMENT

transition to acquisition.

---

## **Acquisition screen**

┌─────────────────────────────────────────────────────────────┐  
│ ACQUISITION                                                 │  
│ Collecting impedance measurements                            │  
├─────────────────────────────────────────────────────────────┤  
│                                                             │  
│                     ACQUISITION ACTIVE                      │  
│                                                             │  
│                     43%                                     │  
│                  █████████░░░                               │  
│                                                             │  
│ Frequency              10 kHz                               │  
│ Measurement            37 / 80                              │  
│ Elapsed                00:18                                │  
│                                                             │  
│ Signal Quality         96 / 100                             │  
│ Noise                  LOW                                  │  
│ Drift                  LOW                                  │  
│                                                             │  
├─────────────────────────────────────────────────────────────┤  
│ Current measurement                                       │  
│                                                             │  
│   Raw ADC ──▶ Filter ──▶ RMS ──▶ Feature extraction        │  
│                                                             │  
│        ✓          ✓          ✓              ◉               │  
│                                                             │  
└─────────────────────────────────────────────────────────────┘  
---

# **9\. Acquisition Visualization**

Show the live time-domain signal.

ADC  
│  
│       /\\      /\\       /\\  
│      /  \\    /  \\     /  \\  
│\_\_\_\_\_/\_\_\_\_\\\_\_/\_\_\_\_\\\_\_\_/\_\_\_\_\\\_\_\_\_ time

Controls:

\[ RAW \]  
\[ FILTERED \]  
\[ RMS \]  
\[ DELTA \]

The user can switch views.

---

# **10\. Acquisition Pipeline Indicator**

Use a miniature processing pipeline:

RAW ADC  
   ↓  
NORMALIZATION  
   ↓  
FILTER  
   ↓  
RMS  
   ↓  
FEATURE EXTRACTION  
   ↓  
QUALITY

Each node has:

✓ COMPLETE  
◉ PROCESSING  
○ WAITING  
⚠ WARNING

This connects the frontend directly to Person A's signal-processing layer.

---

# **11\. Engineering Acquisition Drawer**

Optional expandable drawer:

ENGINEERING DETAILS ▼

Opening:

ADC  
ADS1115  
Sample rate: 860 SPS  
Resolution: 16-bit

MCU  
HELTEC-01

FPGA  
VSDSQUADRON  
State: FILTER

UART  
115200 8N1

Sequence  
184

Checksum  
VALID

This should be hidden by default.

---

# **12\. Stage 3 — IMPEDANCE**

This is the main scientific visualization stage.

The UI should allow switching between:

SPECTRUM  
BODE  
NYQUIST  
TEMPORAL  
FFT  
QUALITY  
---

# **13\. Impedance Overview**

Header:

IMPEDANCE SPECTRUM  
Multi-frequency electrical response

Summary:

Frequency range  
1 Hz – 1 MHz

Points  
32

Spectrum quality  
94 / 100

Calibration  
CAL-0042  
---

# **14\. Bode Plot**

Primary view:

Magnitude  
│  
│╲  
│ ╲  
│  ╲\_\_\_\_  
│       ╲\_\_\_\_  
└────────────────────  
   log frequency

Second graph:

Phase  
│  
│──────╲  
│       ╲\_\_\_\_  
│            ╲  
└────────────────────  
   log frequency

Hovering a point:

Frequency  
10.0 kHz

Z'  
124.7 Ω

Z''  
\-31.4 Ω

|Z|  
128.6 Ω

Phase  
\-14.2°  
---

# **15\. Nyquist View**

\-Im(Z)  
│  
│         ●  
│      ●     ●  
│    ●         ●  
│   ●           ●  
│  ●             ●  
└──────────────────── Z'

Show:

Arc diameter  
142 Ω

Peak frequency  
8.7 kHz

Curve quality  
91 / 100

Do not show circuit parameters unless the spectrum is sufficient and a circuit fit actually exists.

---

# **16\. Equivalent Circuit View**

Separate tab:

EQUIVALENT CIRCUIT

Example:

      Rs          Rct  
───/\\/\\/\\/────┬──/\\/\\/\\/───  
              │  
              ├──── Cdl ───  
              │  
              └──── W ─────

Results:

Rs       42.1 Ω  
Rct      103.4 Ω  
Cdl      8.4 nF  
Warburg  0.31 Ω·s⁻¹/²

Fit RMSE  
4.2%

Fit status  
VALID

If unavailable:

CIRCUIT FIT UNAVAILABLE

Reason:  
Insufficient frequency resolution.

Required:  
≥ N frequency points

Never fabricate parameters.

---

# **17\. FFT View**

The FFT should be explicitly labelled:

TIME-DOMAIN / EXCITATION ANALYSIS

Not as another EIS representation.

Show:

Amplitude  
│  
│       █  
│       █  
│       █  
│   █   █  
│\_\_\_█\_\_\_█\_\_\_\_\_\_\_\_\_\_\_\_  
       frequency

Use it for:

* excitation quality  
* harmonic content  
* interference  
* transient behavior  
* signal contamination

Example:

Fundamental  
10.0 kHz

2nd harmonic  
\-34 dB

3rd harmonic  
\-49 dB

Signal integrity  
GOOD  
---

# **18\. Temporal Impedance**

Switch to:

IMPEDANCE vs TIME

Example:

Z  
│  
│───────╲  
│        ╲  
│         ╲\_\_\_\_  
│              ╲  
└──────────────────── time

Controls:

Z'  
Z''  
|Z|  
PHASE  
ΔZ  
RELATIVE ΔZ

Show baseline:

BASELINE  
t \= 0

CURRENT  
t \= 240 s

ΔZ  
\-18.4 Ω

Relative change  
\-11.2%  
---

# **19\. Quality Panel**

Persistent scientific quality indicator:

MEASUREMENT QUALITY

Overall                 94 / 100

SNR                     91  
Repeatability           96  
Valid frequency points  100%  
Phase consistency       93  
Outliers                1  
Missing points          0

If Kramers–Kronig validation is applicable:

K-K CONSISTENCY  
92 / 100

If not:

K-K CONSISTENCY  
NOT AVAILABLE

Reason:  
Insufficient spectral sampling  
---

# **20\. Stage 4 — PHENOTYPE**

This is where raw impedance becomes an interpretable **impedance phenotype**.

---

## **Header**

IMPEDANCE PHENOTYPE  
Structured electrical representation of the sample

Show the hierarchy:

RAW  
 ↓  
SPECTRAL  
 ↓  
EQUIVALENT CIRCUIT  
 ↓  
TEMPORAL  
 ↓  
QUALITY  
 ↓  
IMPEDANCE PHENOTYPE  
---

# **21\. Phenotype Cards**

### **Spectral phenotype**

SPECTRAL

High-frequency magnitude  
124.7 Ω

Low-frequency magnitude  
172.3 Ω

Phase minimum  
\-31.2°

Spectral slope  
\-0.42

### **Resistive phenotype**

RESISTIVE

High-frequency resistance  
42.1 Ω

Low-frequency resistance  
91.7 Ω

ΔR  
49.6 Ω

### **Temporal phenotype**

TEMPORAL

Trend  
FALLING

Slope  
\-0.083 Ω/min

Stability  
HIGH

Time-to-threshold  
ESTIMATED

### **Quality phenotype**

QUALITY

Signal quality  
94

Spectrum completeness  
100%

Repeatability  
96%

OOD distance  
LOW  
---

# **22\. Feature Provenance**

Every important feature should be inspectable.

Click:

Spectral slope

opens:

FEATURE PROVENANCE

Feature  
spectralSlope

Value  
\-0.42

Source  
ImpedanceSpectrum

Computation  
log(|Z|) vs log(f)

Status  
DERIVED

Software version  
phenotype-v1.2.0

This is important for scientific traceability.

---

# **23\. Phenotype Confidence**

PHENOTYPE CONFIDENCE

████████████████░░░░ 82%

Why?

✓ High signal quality  
✓ Complete spectrum  
✓ Stable temporal trajectory  
⚠ Moderate reference distance  
⚠ Limited historical observations  
---

# **24\. Stage 5 — DISEASE INTELLIGENCE**

This should be the most carefully designed stage.

Never make it look like:

Disease \= UTI

Instead:

DISEASE INTELLIGENCE

Model interpretation of impedance phenotype  
---

# **25\. Primary Prediction**

PRIMARY MODEL OUTPUT

UTI-ASSOCIATED PHENOTYPE

Probability  
78%

Confidence  
71%

Uncertainty  
18%

OOD score  
9%

Status  
SUPPORTED

The exact disease/condition terminology depends on the registered model.

---

# **26\. Alternative Predictions**

ALTERNATIVE HYPOTHESES

Bacteriuria-associated phenotype       74%  
Non-infectious urinary phenotype       17%  
Unknown / other                         9%

For organism models:

ORGANISM HYPOTHESES

E. coli                 63%  
K. pneumoniae           21%  
Other / unknown         16%

These are model outputs, not claims of definitive clinical diagnosis.

---

# **27\. Confidence Decomposition**

CONFIDENCE

Overall                 71%

Signal quality          \+18  
Phenotype consistency   \+16  
Model agreement         \+15  
Temporal evidence       \+12  
Reference similarity    \+10  
OOD penalty             \-5  
──────────────────────────  
Final                   71

This is much more informative than one unexplained percentage.

---

# **28\. Disease Evidence**

WHY THE MODEL REACHED THIS RESULT

Example:

01  Low-frequency impedance change  
    observed: \-14.2%  
    contribution: HIGH

02  Temporal impedance trajectory  
    observed: FALLING  
    contribution: MEDIUM

03  Spectral distance from reference  
    observed: 0.21  
    contribution: MEDIUM

04  Signal quality  
    observed: 94/100  
    contribution: SUPPORTING

Each can expand.

---

# **29\. Model Information**

Expandable:

MODEL DETAILS ▼  
Model  
UTI-IMPEDANCE-RF

Version  
1.0.0

Input modality  
BULK\_EIS

Training datasets  
PHENORA-UTI-IMP-001

Validation dataset  
PHENORA-UTI-CLIN-001

AUROC  
...

Sensitivity  
...

Specificity  
...

Limitations  
...

Only display metrics that actually exist.

---

# **30\. OOD / Unknown State**

This deserves a prominent UI.

If OOD is high:

┌───────────────────────────────────────────┐  
│ ⚠ OUT-OF-DISTRIBUTION                     │  
│                                           │  
│ The observed phenotype is outside the     │  
│ validated model domain.                   │  
│                                           │  
│ Disease interpretation should not be      │  
│ treated as supported.                     │  
│                                           │  
│ Recommended action:                       │  
│ MEASURE AGAIN / UNKNOWN                   │  
└───────────────────────────────────────────┘

Do not force an answer.

---

# **31\. Model Disagreement**

If several models disagree:

MODEL CONSENSUS

Model A     UTI phenotype      81%  
Model B     Bacteriuria       69%  
Model C     Unknown            48%

Agreement  
MODERATE

⚠ Additional measurement may reduce uncertainty.

This feeds directly into autonomy.

---

# **32\. Stage 6 — DIGITAL TWIN**

The twin should look like a **living state model**, not a 3D human avatar.

Avoid unnecessary biological 3D graphics.

Use a structured state representation.

---

# **33\. Digital Twin Layout**

DIGITAL TWIN

Twin ID  
TWIN-URINE-017

Status  
● ACTIVE

Last update  
00:02 ago

Then:

OBSERVED  
────────────────────  
Impedance  
Phenotype  
Quality  
Temperature

INFERRED  
────────────────────  
Impedance phenotype  
Disease state

PREDICTED  
────────────────────  
Future impedance  
Future phenotype  
Future disease probability  
---

# **34\. Twin State Visualization**

Use three columns:

OBSERVED          INFERRED          PREDICTED

Z(f,t)            Phenotype         Z(t+5m)  
Quality           Bacteriuria       Phenotype(t+5m)  
Temperature       Organism map      Disease probability

Each variable:

LOW-FREQ |Z|

172.3 Ω

OBSERVED  
Confidence 96%

or:

UTI-ASSOCIATED PHENOTYPE

78%

INFERRED

Confidence 71%  
Uncertainty 18%

or:

Predicted impedance

184 Ω ± 21 Ω

PREDICTED

Horizon  
\+10 min  
---

# **35\. Twin Timeline**

Inside the stage:

TIME

T0 ───── T1 ───── T2 ───── T3 ───── NOW ───── FUTURE  
│         │         │         │         │  
●         ●         ●         ●         ●────────○  
observed observations                   predicted

Clicking a point displays the twin snapshot.

---

# **36\. Twin Uncertainty Map**

UNCERTAINTY

Signal          LOW  
Phenotype       MEDIUM  
Disease         MEDIUM  
Forecast        HIGH  
Overall         MEDIUM

This feeds the autonomous planner.

---

# **37\. Stage 7 — FORECAST**

Header:

FORECAST  
Predictive evolution of the measured state  
---

# **38\. Forecast Chart**

Show historical data and forecast in one continuous chart:

Impedance  
│  
│ ●  
│  ●  
│   ●  
│    ●  
│     ●──────────────  
│                 ╲  
│                  ╲  
│                   ╲  
└──────────────────────── time  
             NOW       \+30m

Historical region:

OBSERVED

Future region:

PREDICTED

Prediction interval:

         ╱──────── upper  
─────────●  
          ╲──────── lower  
---

# **39\. Forecast Tabs**

IMPEDANCE  
PHENOTYPE  
DISEASE STATE

Example:

DISEASE STATE FORECAST

Current probability      78%  
\+5 min                   81%  
\+10 min                  84%  
\+20 min                  86%

Forecast uncertainty  
\+5 min   12%  
\+10 min  18%  
\+20 min  31%  
---

# **40\. Forecast Validity**

Show:

FORECAST STATUS

● READY

History  
12 observations

Model  
TREND-V1

Backtest availability  
AVAILABLE

Overall uncertainty  
18%

Or:

⚠ INSUFFICIENT HISTORY

Required:  
≥ 3 observations

Available:  
2

Additional measurement required.  
---

# **41\. Stage 8 — AUTONOMOUS DECISION**

This is where PHENORA becomes an autonomous measurement system.

Header:

AUTONOMOUS MEASUREMENT PLANNER  
Choose the next measurement based on information value  
---

# **42\. Decision Card**

If enough evidence exists:

┌────────────────────────────────────────────┐  
│ RECOMMENDATION                             │  
│                                            │  
│ ● STOP                                    │  
│                                            │  
│ Evidence is sufficient for the current    │  
│ measurement objective.                    │  
│                                            │  
│ Confidence          89%                    │  
│ Uncertainty         11%                    │  
│ Expected benefit    LOW                    │  
└────────────────────────────────────────────┘

Important:

**STOP means stop measuring. It does not mean clinical confirmation.**

---

# **43\. Measure Again**

If uncertainty remains:

RECOMMENDATION

◉ MEASURE AGAIN

Reason:

High model disagreement

Expected uncertainty reduction  
18%

Expected information gain  
0.42

Recommended measurement

Frequency  
10 kHz

Duration  
2 s

Cost  
LOW

Buttons:

\[ ACCEPT \]  
\[ REVIEW OPTIONS \]  
\[ STOP MANUALLY \]  
---

# **44\. Candidate Measurements**

Show alternatives:

NEXT MEASUREMENT OPTIONS

┌──────────────────────────────────────────────┐  
│ 10 kHz                                      │  
│ Information gain     0.42                   │  
│ Uncertainty reduction 18%                   │  
│ Cost                  LOW                   │  
│ Recommended           ✓                     │  
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐  
│ 40 kHz                                      │  
│ Information gain     0.31                   │  
│ Uncertainty reduction 12%                   │  
│ Cost                  LOW                   │  
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐  
│ FULL SCAN                                   │  
│ Information gain     0.51                   │  
│ Uncertainty reduction 23%                   │  
│ Cost                  HIGH                  │  
└──────────────────────────────────────────────┘  
---

# **45\. Measurement Budget**

Persistent:

MEASUREMENT BUDGET

Measurements  
8 / 12

Time  
01:42 / 03:00

Retries  
1 / 3

Visualize remaining budget.

This makes autonomy understandable.

---

# **46\. Why This Measurement?**

Expandable explanation:

WHY THIS MEASUREMENT?

Current uncertainty is concentrated around:

10–20 kHz

The selected measurement is expected to  
provide the highest information gain among  
currently feasible measurements.

This is one of the most important explainability components.

---

# **47\. Stage 9 — FINAL RESULT**

The final screen should summarize the complete experiment without hiding the underlying evidence.

---

# **48\. Final Result Header**

PHENORA FLASH RESULT

RUN PF-2026-00042

STATUS  
COMPLETE

RESULT VALIDITY  
VALID FOR RESEARCH USE  
---

# **49\. Result Summary**

SAMPLE  
URINE-017

IMPEDANCE PHENOTYPE  
Detected / characterized

PRIMARY MODEL OUTPUT  
UTI-associated phenotype

Probability  
78%

Confidence  
71%

Uncertainty  
18%

OOD  
9%

AUTONOMOUS MEASUREMENT  
STOP  
---

# **50\. Result Trace**

Show the entire reasoning chain:

SAMPLE  
  │  
  ▼  
MEASUREMENT  
  │  
  ▼  
IMPEDANCE SPECTRUM  
  │  
  ▼  
SIGNAL FEATURES  
  │  
  ▼  
IMPEDANCE PHENOTYPE  
  │  
  ▼  
DISEASE INTELLIGENCE  
  │  
  ▼  
DIGITAL TWIN  
  │  
  ▼  
FORECAST  
  │  
  ▼  
AUTONOMOUS DECISION

Every node should be clickable.

---

# **51\. Result Evidence**

KEY EVIDENCE

✓ High signal quality  
✓ Complete spectral acquisition  
✓ Consistent temporal trajectory  
✓ Phenotype within model domain  
✓ Model agreement acceptable

⚠ Prediction uncertainty remains moderate  
---

# **52\. Result Limitations**

Always show this.

LIMITATIONS

• Research/engineering validation only  
• Prediction depends on registered model domain  
• Impedance phenotype does not independently establish  
  clinical diagnosis  
• OOD detection may fail outside validated distributions  
• Results depend on acquisition protocol and calibration

This should not be hidden behind a tiny link.

---

# **53\. Provenance**

Expandable:

PROVENANCE

Run ID  
PF-2026-00042

Sample  
URINE-017

Device  
PHENORA-01

Calibration  
CAL-0042

Acquisition protocol  
UTI-EIS-V1

Preprocessing  
signal-v1.3

Phenotype  
phenotype-v1.2

Models  
UTI-IMPEDANCE-RF v1.0

Datasets  
PHENORA-UTI-IMP-001  
PHENORA-UTI-CLIN-001

Software  
PHENORA Flash v0.1  
---

# **54\. Final Actions**

\[ REVIEW EXPERIMENT \]

\[ VIEW FULL SPECTRUM \]

\[ VIEW MODEL EVIDENCE \]

\[ EXPORT RESULT \]

\[ NEW SAMPLE \]

\[ RUN AGAIN \]  
---

# **55\. Global Right-Side Intelligence Panel**

A narrow persistent panel can appear on the right of the main workspace.

┌───────────────────────────┐  
│ PHENORA INTELLIGENCE      │  
├───────────────────────────┤  
│ QUALITY                   │  
│ ████████████████░ 94      │  
│                           │  
│ CONFIDENCE                │  
│ ██████████████░░░ 71      │  
│                           │  
│ UNCERTAINTY               │  
│ 18%                       │  
│                           │  
│ OOD                       │  
│ LOW                       │  
│                           │  
│ CURRENT STATE             │  
│ FALLING                   │  
│                           │  
│ NEXT ACTION               │  
│ MEASURE AGAIN             │  
└───────────────────────────┘

This panel changes according to the active stage.

---

# **56\. Global Bottom Status Bar**

Always show:

● DEVICE CONNECTED  
● ADC STREAMING  
● FPGA READY  
● CALIBRATION VALID

MODE  
SIMULATION

VALIDATION LEVEL  
RESEARCH / ENGINEERING

RUN  
PF-2026-00042

For hardware:

● HARDWARE CONNECTED

For simulation:

◌ SIMULATION

Never make simulation look identical to real hardware.

---

# **57\. Simulation Mode**

Simulation should have a visible banner:

SIMULATION MODE  
No physical sample is being measured.

Provide a scenario selector:

SIMULATION SCENARIO

\[ Stable           ▼ \]

Stable  
Rising  
Falling  
Noisy  
Drifting  
Transition  
Anomaly  
Recovery  
OOD  
Timeout

This maps directly to the existing scenario infrastructure.

---

# **58\. Engineering Debug Mode**

A separate mode:

OPERATOR | SCIENTIFIC | ENGINEERING

Engineering view:

FPGA STATE  
CALCULATE\_SLOPE

BASELINE  
1423

CURRENT  
1378

DELTA  
\-45

SLOPE  
\-13

STABILITY  
4

QUALITY  
92

CONFIDENCE  
81

ANOMALY  
7

EVIDENCE  
76

MEASUREMENT  
7 / 12

Then:

UART TELEMETRY

SEQ  TYPE      FEATURE FLAGS  
184  DATA      0x0124  0x03  
185  DATA      0x0119  0x03  
186  STATUS    0x0000  0x01  
---

# **59\. FPGA State Visualization**

Show:

IDLE  
 ↓  
INITIALIZE  
 ↓  
WAIT\_BASELINE  
 ↓  
CAPTURE\_BASELINE  
 ↓  
WAIT\_SAMPLE  
 ↓  
FILTER  
 ↓  
CALCULATE\_DELTA  
 ↓  
CALCULATE\_SLOPE  
 ↓  
CALCULATE\_STABILITY  
 ↓  
EVALUATE\_EVIDENCE  
 ↓  
DECIDE  
 ↓  
STOP / MEASURE AGAIN / TIMEOUT

The active state is highlighted.

This makes the FPGA visibly part of the system rather than an invisible implementation detail.

---

# **60\. Error Handling**

Errors should stop the pipeline clearly.

Example:

┌──────────────────────────────────────────────┐  
│ ACQUISITION ERROR                            │  
│                                              │  
│ UART CHECKSUM FAILURE                        │  
│                                              │  
│ Packet                                       │  
│ Sequence 184                                │  
│                                              │  
│ Measurement paused.                          │  
│                                              │  
│ \[ RETRY \]   \[ ABORT RUN \]                    │  
└──────────────────────────────────────────────┘

Other states:

BAD BASELINE  
MISSING PACKET  
SEQUENCE ERROR  
UART TIMEOUT  
CALIBRATION INVALID  
SIGNAL QUALITY LOW  
MODEL UNAVAILABLE  
OUT OF DISTRIBUTION  
FORECAST UNAVAILABLE  
MEASUREMENT BUDGET EXHAUSTED  
---

# **61\. Navigation Rules**

Do not allow arbitrary navigation to future stages.

For example:

SAMPLE ✓  
ACQUISITION ✓  
IMPEDANCE ✓  
PHENOTYPE ◉  
DISEASE 🔒

The user can inspect previous stages but cannot open Disease Intelligence until the backend has produced the required phenotype.

However, an operator should be able to manually review previous stages.

---

# **62\. Backend ↔ UI Contract**

The UI should consume the canonical:

PhenoraFlashResult

not independently reconstruct the experiment.

The frontend receives:

run  
sample  
acquisition  
spectrum  
phenotype  
diseaseIntelligence  
digitalTwin  
forecast  
autonomousDecision  
validity  
provenance

The UI renders these.

It should **not calculate**:

disease probability  
confidence  
OOD  
phenotype  
forecast  
information gain  
autonomous decision

Those belong to backend services.

---

# **63\. Real-Time Updates**

The timeline should update as backend events arrive:

RUN\_STARTED  
       ↓  
MEASUREMENT\_STARTED  
       ↓  
MEASUREMENT\_COMPLETED  
       ↓  
SPECTRUM\_UPDATED  
       ↓  
PHENOTYPE\_UPDATED  
       ↓  
DISEASE\_ANALYSIS\_COMPLETED  
       ↓  
TWIN\_UPDATED  
       ↓  
FORECAST\_UPDATED  
       ↓  
AUTONOMOUS\_DECISION\_READY  
       ↓  
MEASURE\_AGAIN\_REQUESTED

For V1:

REST \+ polling

or an in-memory event system.

Then upgrade to:

SSE / WebSocket

for live acquisition.

---

# **64\. Recommended Frontend Component Architecture**

src/  
├── app/  
│   ├── page.tsx  
│   └── layout.tsx  
│  
├── components/  
│   ├── shell/  
│   │   ├── AppShell.tsx  
│   │   ├── TopBar.tsx  
│   │   └── StatusBar.tsx  
│   │  
│   ├── timeline/  
│   │   ├── ExperimentTimeline.tsx  
│   │   ├── TimelineStage.tsx  
│   │   ├── TimelineConnector.tsx  
│   │   └── TimelineControls.tsx  
│   │  
│   ├── sample/  
│   │   ├── SampleStage.tsx  
│   │   ├── SampleForm.tsx  
│   │   └── SampleValidation.tsx  
│   │  
│   ├── acquisition/  
│   │   ├── AcquisitionStage.tsx  
│   │   ├── LiveSignal.tsx  
│   │   ├── AcquisitionPipeline.tsx  
│   │   └── DeviceStatus.tsx  
│   │  
│   ├── impedance/  
│   │   ├── ImpedanceStage.tsx  
│   │   ├── BodePlot.tsx  
│   │   ├── NyquistPlot.tsx  
│   │   ├── TemporalPlot.tsx  
│   │   ├── FFTPlot.tsx  
│   │   ├── CircuitFit.tsx  
│   │   └── QualityPanel.tsx  
│   │  
│   ├── phenotype/  
│   │   ├── PhenotypeStage.tsx  
│   │   ├── PhenotypeCards.tsx  
│   │   ├── FeatureProvenance.tsx  
│   │   └── PhenotypeConfidence.tsx  
│   │  
│   ├── disease/  
│   │   ├── DiseaseStage.tsx  
│   │   ├── PredictionSummary.tsx  
│   │   ├── AlternativePredictions.tsx  
│   │   ├── EvidencePanel.tsx  
│   │   ├── ModelDetails.tsx  
│   │   ├── OODWarning.tsx  
│   │   └── ModelAgreement.tsx  
│   │  
│   ├── twin/  
│   │   ├── TwinStage.tsx  
│   │   ├── TwinState.tsx  
│   │   ├── TwinTimeline.tsx  
│   │   └── TwinUncertainty.tsx  
│   │  
│   ├── forecast/  
│   │   ├── ForecastStage.tsx  
│   │   ├── ForecastChart.tsx  
│   │   ├── PredictionInterval.tsx  
│   │   └── ForecastStatus.tsx  
│   │  
│   ├── autonomy/  
│   │   ├── AutonomyStage.tsx  
│   │   ├── DecisionCard.tsx  
│   │   ├── CandidateMeasurements.tsx  
│   │   ├── MeasurementBudget.tsx  
│   │   └── DecisionExplanation.tsx  
│   │  
│   ├── result/  
│   │   ├── ResultStage.tsx  
│   │   ├── ResultSummary.tsx  
│   │   ├── ResultTrace.tsx  
│   │   ├── ResultEvidence.tsx  
│   │   ├── ResultLimitations.tsx  
│   │   └── ProvenancePanel.tsx  
│   │  
│   └── engineering/  
│       ├── EngineeringPanel.tsx  
│       ├── FPGAState.tsx  
│       ├── UARTTelemetry.tsx  
│       └── RuntimeDiagnostics.tsx  
│  
├── hooks/  
│   ├── usePhenoraRun.ts  
│   ├── useRuntimeEvents.ts  
│   └── useDeviceStatus.ts  
│  
├── lib/  
│   ├── phenoraApi.ts  
│   ├── runtimeMapper.ts  
│   └── formatters.ts  
│  
└── types/  
    └── phenora.ts  
---

# **65\. Frontend State**

The frontend needs one central state:

interface UIExperimentState {  
  run: PhenoraRun | null;

  activeStage:  
    | "SAMPLE"  
    | "ACQUISITION"  
    | "IMPEDANCE"  
    | "PHENOTYPE"  
    | "DISEASE"  
    | "TWIN"  
    | "FORECAST"  
    | "AUTONOMY"  
    | "RESULT";

  viewMode:  
    | "OPERATOR"  
    | "SCIENTIFIC"  
    | "ENGINEERING";

  simulation: {  
    enabled: boolean;  
    scenario?: string;  
  };

  connection: {  
    backend: boolean;  
    device: boolean;  
    fpga: boolean;  
    adc: boolean;  
  };  
}  
---

# **66\. Visual Language**

The interface should communicate:

PRECISION  
INSTRUMENTATION  
SCIENTIFIC COMPUTING  
REAL-TIME PROCESSING  
TRACEABILITY  
CONTROL

Avoid:

generic SaaS dashboard  
marketing website  
card-heavy admin UI  
giant gradients  
excessive rounded containers  
fake medical imagery  
3D human organs  
unexplained percentages  
---

# **67\. Main Interaction Pattern**

The central interaction should feel like:

1\. Prepare sample  
       ↓  
2\. Start measurement  
       ↓  
3\. Watch acquisition  
       ↓  
4\. Inspect impedance  
       ↓  
5\. Understand phenotype  
       ↓  
6\. Inspect disease intelligence  
       ↓  
7\. Watch twin update  
       ↓  
8\. Examine forecast  
       ↓  
9\. Review autonomous recommendation  
       ↓  
10\. Accept / measure again  
       ↓  
11\. Final traceable result

Not:

Open dashboard  
→ click random cards  
→ read charts  
→ see final number  
---

# **68\. The Most Important UI Principle**

Every stage should answer four questions:

### **1\. What is PHENORA doing?**

ACQUIRING  
PROCESSING  
ANALYZING  
FORECASTING

### **2\. What did it observe?**

Impedance  
Spectrum  
Temporal trajectory  
Signal quality

### **3\. What does it infer?**

Phenotype  
Disease-associated state  
Forecast  
Twin state

### **4\. How certain is it?**

Confidence  
Uncertainty  
OOD  
Model agreement  
Evidence

Then:

### **5\. What happens next?**

PROCESSING  
STOP  
MEASURE AGAIN  
UNKNOWN  
ERROR

That should remain visible throughout the entire experiment.

---

# **69\. Final UI Mental Model**

The finished PHENORA interface should visually communicate:

                        PHENORA FLASH

 SAMPLE  
   │  
   ▼  
┌───────────┐  
│ ACQUIRE   │  ← raw electrical reality  
└─────┬─────┘  
      ▼  
┌───────────┐  
│ IMPEDANCE │  ← Z(f,t), Bode, Nyquist, FFT  
└─────┬─────┘  
      ▼  
┌───────────┐  
│ PHENOTYPE  │  ← structured impedance state  
└─────┬─────┘  
      ▼  
┌───────────┐  
│ DISEASE   │  ← model \+ evidence \+ uncertainty  
└─────┬─────┘  
      ▼  
┌───────────┐  
│ TWIN      │  ← observed → inferred → predicted  
└─────┬─────┘  
      ▼  
┌───────────┐  
│ FORECAST  │  ← future state \+ uncertainty  
└─────┬─────┘  
      ▼  
┌───────────┐  
│ AUTONOMY  │  ← choose next measurement  
└─────┬─────┘  
      │  
      ├───────────────┐  
      │               │  
      ▼               ▼  
   MEASURE AGAIN     STOP  
      │               │  
      └───────┬───────┘  
              ▼  
       ┌────────────┐  
       │ FINAL      │  
       │ RESULT     │  
       └────────────┘

That is the UI architecture I would use for PHENORA Flash: **one experiment, one horizontal timeline, one canonical backend state, progressively deeper scientific interpretation, and a closed measurement → inference → uncertainty → autonomous measurement loop.**

