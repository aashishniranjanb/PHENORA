# PHENORA — Web Developer Task Specification
## V1 Technical Platform + Reliability + SPECTRAE

Role:
Web / 3D / Simulation Interface Developer

Primary goal:
Build a professional PHENORA product website that demonstrates what has
actually been developed, visualizes the V1 architecture, exposes the FEM
verification results, and clearly separates VERIFIED, PROTOTYPE and FUTURE
VALIDATION work.

Do NOT fabricate biological or clinical results.

---

# 1. TECH STACK

Use:

- Next.js
- TypeScript
- React
- React Three Fiber / Three.js
- Tailwind CSS or existing project styling
- Recharts / lightweight chart library where useful
- Lucide icons
- Existing Python/Elmer outputs as static data

Deployment:

- Local development
- Vercel

Do NOT introduce a Python backend unless technically required.

---

# 2. CURRENT WEBSITE ROUTES

Maintain:

/
 /technology
 /platform
 /spectrae
 /research
 /team

Future routes can be added only if useful.

---

# 3. HOME PAGE

Create a high-quality deep-tech startup landing page.

Hero:

PHENORA

Adaptive Impedance.
Biological Precision.
Edge Intelligence.

Supporting statement:

"An adaptive differential impedance platform for rapid biological
susceptibility measurement."

Do NOT claim:

- clinically validated AST
- proven bacterial detection
- clinical diagnosis
- MIC prediction
- S/I/R classification

Hero should show the V1 architecture visually.

Main flow:

SAMPLE
↓
ELECTRODES
↓
AD5933
↓
HELTEC ESP32-S3
↓
FPGA
↓
ADAPTIVE DECISION

Primary CTA:

"Explore PHENORA V1"

Secondary CTA:

"Explore SPECTRAE"

---

# 4. PRODUCT VERSIONS

Create a product roadmap section.

## V1 — CURRENT

BULK DIFFERENTIAL IMPEDANCE

Components:

- Control/Test wells
- Electrodes
- AD5933
- Heltec ESP32-S3
- FPGA
- Adaptive decision logic

Status:

PROTOTYPE / COMPUTATIONALLY VERIFIED

---

## V2 — UPCOMING

ADAPTIVE MULTI-FREQUENCY IMPEDANCE

Potential features:

- multi-frequency impedance fingerprint
- temperature compensation
- electrode quality monitoring
- reference channel
- adaptive frequency selection
- improved measurement quality control

Status:

UPCOMING

Do not visually imply these features are already built.

---

## V3 — FUTURE

PRODUCT / ASSAY PLATFORM

Potential direction:

- disposable cartridge
- automated sample handling
- biological validation
- multi-antibiotic workflow
- clinical validation

Status:

FUTURE

---

# 5. TECHNOLOGY PAGE

Create a detailed interactive system architecture.

Show:

CONTROL + TEST
        ↓
ELECTRODES
        ↓
AD5933
        ↓ I²C
HELTEC ESP32-S3
        ↓ UART
iCE40UP5K FPGA
        ↓
FILTER
        ↓
SLOPE
        ↓
STABILITY
        ↓
STOP / MEASURE AGAIN

Each block should be clickable or hoverable.

For each component show:

- purpose
- input
- output
- current development status

---

# 6. V1 3D PRODUCT VISUALIZATION

Use Three.js / React Three Fiber.

Build a stylized engineering representation, NOT an inaccurate
commercial hardware replica.

3D scene must contain:

- sample/control chamber
- test chamber
- electrode pairs
- electrical connection
- AD5933 module representation
- Heltec board representation
- FPGA board representation
- data-flow connections

Interactions:

- rotate
- zoom
- reset camera
- explode view
- component highlighting

Add an "Animate Workflow" control.

Animation:

SAMPLE
→ ELECTRODES
→ AD5933
→ HELTEC
→ FPGA
→ DECISION

The visualization must be understandable without technical knowledge.

---

# 7. SPECTRAE PAGE

This is the main technical demonstration page.

Create the following sections:

## SECTION A — ELECTRICAL MODEL

Display:

- geometry
- electrodes
- voltage boundary conditions
- potential field
- current flow

Use existing Elmer outputs.

Do not generate fake FEM results.

---

## SECTION B — MESH CONVERGENCE

Display the actual data:

Mesh:

1.0 mm
0.5 mm
0.25 mm
0.125 mm

Show:

- element count
- FEM resistance
- analytical reference
- relative error

Create interactive chart:

Mesh density → R_FEM

Show the result:

R_FEM = 2.000000 Ω

with:

"0.0000% difference from analytical reference in tested configurations"

Do NOT write "FEM is perfectly accurate."

---

# 8. CONDUCTIVITY PERTURBATION

Load:

simulation/fem/results/delta_sigma_sweep.csv

Display:

Δσ
↓
R_test
↓
ΔR

Interactive plot:

Δσ (%) vs ΔR (Ω)

Current data includes:

- -50%
- -25%
- -10%
- 0%
- +10%
- +25%
- +50%

Use actual CSV values.

Label this:

"Computational sensitivity study"

NOT:

"Experimental bacterial response"

---

# 9. DIFFERENTIAL TRAJECTORY

Load:

differential_fem_trajectory.csv

Display:

CONTROL
vs
TEST

Then:

ΔR(t)

Interactive time-series plot.

Show the adaptive state below the graph:

MEASURING
ANALYZING
MEASURE AGAIN
STOP

The UI should animate the state according to the trajectory.

---

# 10. ADAPTIVE DECISION VISUALIZATION

Build an interactive simulation of the current Python reference model.

Pipeline:

ΔR(t)
↓
Moving Average
↓
Slope
↓
Stability
↓
FSM
↓
Decision

Show numerical values:

- raw ΔR
- filtered ΔR
- slope
- stability state
- current FSM state

Do NOT use a fake "confidence %" unless the algorithm actually defines it.

---

# 11. RELIABILITY LAYER

Add a new section:

## MEASUREMENT QUALITY ENGINE

This is an important part of PHENORA's future architecture.

Visualize:

Temperature
↓
Noise
↓
Baseline Drift
↓
Electrode Condition
↓
Signal Quality
↓
Decision Validity

Show conceptually:

VALID MEASUREMENT

or

MEASURE AGAIN

or

INVALID / RECALIBRATE

These are architectural concepts unless backed by measured hardware data.

Clearly label them:

"V1.5 Reliability Architecture"

---

# 12. TEMPERATURE COMPENSATION UI

Add a conceptual visualization.

Display:

Temperature
Impedance
Time

Graph:

Temperature vs measured impedance

For now:

STATUS = CONCEPT / NOT EXPERIMENTALLY VALIDATED

When hardware data becomes available, the static data source can later
be replaced with real measurements.

---

# 13. ELECTRODE QUALITY UI

Create a future self-check panel.

Example:

ELECTRODE STATUS

Contact:
CHECK

Baseline:
CHECK

Noise:
CHECK

Drift:
CHECK

Measurement:
VALID / REPEAT / INVALID

This is a PRODUCT DESIGN CONCEPT.

Do not represent it as a validated diagnostic capability.

---

# 14. ADAPTIVE FREQUENCY CONCEPT

Create a visual section for V2.

Show:

INITIAL FREQUENCIES
↓
measure ΔZ(f)
↓
evaluate information
↓
choose next frequency
↓
measure
↓
STOP when sufficient evidence exists

Label:

"V2 — Adaptive Frequency Selection"

Do not claim it is implemented.

---

# 15. DIFFERENTIAL IMPEDANCE FINGERPRINT

Create a future visualization.

Show:

CONTROL Z(f)
TEST Z(f)
↓
ΔZ(f)

Visualize:

- R
- X
- |Z|
- phase

Label:

"V2 research direction"

The current V1 implementation must not be presented as already performing
full spectral classification.

---

# 16. VALIDATION LADDER

Keep the existing SPECTRAE validation ladder.

Use:

LEVEL 0 — Analytical
STATUS: VERIFIED

LEVEL 1 — FEM
STATUS: VERIFIED

LEVEL 2 — Numerical sensitivity
STATUS: COMPUTATIONAL DEMONSTRATION

LEVEL 3 — Adaptive algorithm
STATUS: VERIFIED IN SOFTWARE TESTS

LEVEL 4 — Electronic hardware
STATUS: PROTOTYPE / INTEGRATION

LEVEL 5 — Biological AST
STATUS: NOT YET VALIDATED

LEVEL 6 — Clinical AST
STATUS: NOT YET VALIDATED

The status must be visually obvious.

---

# 17. IMPORTANT CLAIM POLICY

Every scientific result must have one of:

VERIFIED
COMPUTATIONAL DEMONSTRATION
PROTOTYPE
CONCEPT
NOT YET VALIDATED

Never display:

"validated AST"

unless actual biological validation has occurred.

Never display:

"SUSCEPTIBLE"
"RESISTANT"
"INTERMEDIATE"

as real biological results.

For the current simulator use:

STOP
MEASURE AGAIN
ANALYZING
MEASURING

---

# 18. RESEARCH PAGE

Create:

## PHENORA RESEARCH

Sections:

- Impedance-based AST
- Differential sensing
- Adaptive measurement
- Edge computing
- FEM verification
- Reliability engineering

Include links/references supplied by the research team.

Each technical claim should have a source.

---

# 19. TEAM PAGE

Show the four-person team.

Suggested technical roles:

- Bio / assay research
- Embedded / AD5933 / Heltec
- FPGA / edge computation
- Web / simulation / visualization

Do not exaggerate roles or qualifications.

---

# 20. DESIGN LANGUAGE

Brand:

Primary green:
#17B169

Navy:
#0A192F

Background:
#F3F4F6

Typography:

- Inter for body
- strong geometric/technical heading font

Visual style:

- medical technology
- semiconductor engineering
- clean laboratory
- deep-tech startup
- minimal
- high information density
- professional

Avoid:

- generic AI gradients
- excessive glassmorphism
- cartoon bacteria
- fake hospital imagery
- generic stock photos

---

# 21. RESPONSIVE DESIGN

Must work on:

- desktop
- laptop
- tablet
- mobile

Primary judge experience:

Laptop / desktop.

Do not allow 3D visualization to break mobile layout.

---

# 22. PERFORMANCE

Important:

- lazy-load Three.js
- lazy-load heavy FEM visualizations
- compress assets
- avoid unnecessary animations
- no giant video backgrounds
- keep initial page load fast

---

# 23. DATA ARCHITECTURE

Do NOT hard-code scientific results throughout React components.

Create a data layer such as:

src/data/

containing:

- femResults.ts
- meshConvergence.ts
- conductivitySweep.ts
- differentialTrajectory.ts
- validationStatus.ts

When possible, load CSV-derived JSON/static data.

This allows the actual hardware results to replace simulated data later.

---

# 24. SPECTRAE COMPONENT ARCHITECTURE

Create reusable components:

<FemViewer />

<MeshConvergenceChart />

<ConductivitySweepChart />

<DifferentialTrajectory />

<AdaptiveDecisionPanel />

<MeasurementQualityPanel />

<ValidationLadder />

<ArchitectureFlow />

<ThreeDProduct />

Do not make one giant page.tsx file.

---

# 25. 3D ENGINEERING MODEL

Create reusable components:

<ProductAssembly />

<SampleChamber />

<Electrode />

<AD5933Module />

<HeltecBoard />

<FPGA Board />

<DataFlow />

The components should support:

- position
- rotation
- visibility
- exploded state
- highlight state

---

# 26. DEMO MODE

Create a "Demo Mode" for judges.

One button:

"RUN PHENORA V1"

Then automatically show:

1. Sample chamber
2. Measurement begins
3. Impedance data appears
4. Differential signal develops
5. Filter activates
6. Slope calculated
7. FPGA decision layer activates
8. STOP / MEASURE AGAIN appears
9. FEM verification summary appears

This must use the actual computational trajectory currently available.

It must NOT pretend to be a live biological experiment.

---

# 27. FINAL JUDGE VIEW

Create a concise section:

## WHAT PHENORA HAS PROVEN

✓ Analytical electrical model

✓ FEM numerical agreement

✓ Mesh convergence

✓ Conductivity perturbation response

✓ Differential model

✓ Adaptive reference algorithm

## WHAT WE ARE BUILDING

◐ AD5933 hardware acquisition

◐ Heltec integration

◐ FPGA edge implementation

## WHAT REMAINS

○ Biological validation

○ AST validation

○ Clinical validation

This section is extremely important.

---

# 28. FINAL CTA

End homepage with:

PHENORA

"Measure only as much as the evidence requires."

Buttons:

[Explore V1]

[Open SPECTRAE]

[Research]

---

# 29. DO NOT BUILD NOW

Do NOT spend time on:

- cloud backend
- login/authentication
- database
- real-time cloud telemetry
- AI chatbot
- mobile app
- V2 hardware
- V3 hardware
- clinical result prediction
- bacterial classification
- MIC prediction

These are not current priorities.

---

# 30. PRIORITY ORDER

## P0 — MUST COMPLETE

1. Homepage
2. Technology architecture
3. SPECTRAE
4. FEM result visualization
5. ΔR trajectory
6. Adaptive decision visualization
7. Validation ladder
8. V1/V2/V3 roadmap

## P1 — HIGH VALUE

9. Interactive V1 3D assembly
10. Demo Mode
11. Measurement Quality UI
12. Professional responsive design
13. Scientific claim/status system

## P2 — AFTER P0/P1

14. Adaptive frequency visualization
15. Differential impedance fingerprint
16. Temperature compensation visualization
17. Electrode health visualization
18. Advanced 3D/FEM visualization

---

# DEFINITION OF DONE

The website is complete when a technical judge can enter PHENORA and
understand within 60 seconds:

1. What problem we solve.
2. What PHENORA V1 physically contains.
3. How AD5933 → Heltec → FPGA works.
4. What our Elmer FEM model proves.
5. What ΔR means in our computational model.
6. How adaptive stopping works.
7. What is experimentally verified.
8. What is only computational.
9. What is not yet biologically validated.
10. Why V2/V3 are needed.

The website must make PHENORA look like a serious engineering startup
without pretending that unvalidated biology is already solved.

FINAL PRIORITY:

Scientific honesty > visual complexity.

Working demonstration > decorative 3D.

Actual data > fabricated data.

Clear validation boundaries > exaggerated claims.
