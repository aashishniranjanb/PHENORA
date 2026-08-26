# PHENORA WEB DEVELOPMENT — V2.0
## SPECTRAE PRODUCT EXPERIENCE + ADAPTIVE IMPEDANCE SIMULATION

Project:
PHENORA

Primary audience:
- Hackathon judges

Secondary audiences:
- Investors / startup evaluators
- General public

Primary UX objective:

Make PHENORA understandable and impressive within 60–90 seconds
without exaggerating biological or clinical validation.

The experience must communicate:

SAMPLE
→ ELECTRICAL SENSING
→ DIFFERENTIAL IMPEDANCE
→ SIGNAL PROCESSING
→ QUALITY CHECK
→ ADAPTIVE DECISION
→ FPGA EDGE INTELLIGENCE

==================================================
## 1. CORE PRODUCT EXPERIENCE
==================================================

The website must feel like a real deep-tech instrument/platform.

Do NOT make SPECTRAE look like a collection of unrelated charts.

The entire page must communicate one continuous measurement workflow.

Primary interaction:

[ RUN PHENORA V1 ]

When clicked:

READY
↓
INITIALIZING
↓
BASELINE
↓
MEASURING
↓
ANALYZING
↓
QUALITY CHECK
↓
EVIDENCE SUFFICIENT?
     ↙        ↘
   NO          YES
   ↓            ↓
MEASURE       STOP
AGAIN

The entire interface should update synchronously.

==================================================
## 2. PRIMARY MESSAGE
==================================================

Primary positioning:

"Adaptive Impedance + Edge Intelligence"

Secondary explanation:

"PHENORA continuously evaluates differential electrical response and
determines whether additional measurement is required."

Do NOT claim:

- clinically validated AST
- validated S/I/R classification
- bacterial identification
- clinical diagnosis
- MIC prediction

unless real experimental validation is later added.

==================================================
## 3. HOME PAGE
==================================================

Hero:

PHENORA

Adaptive Impedance.
Biological Precision.
Edge Intelligence.

Supporting text:

"An adaptive differential impedance platform combining electrical
sensing, computational modeling and deterministic edge decision-making."

Primary CTA:

[ EXPLORE PHENORA V1 ]

Secondary CTA:

[ RUN SIMULATION ]

Add a compact miniature workflow:

CONTROL + TEST
↓
IMPEDANCE
↓
ΔZ
↓
EDGE DECISION

Add a "RUN DEMO" interaction.

The homepage should give the judge an immediate understanding of
the complete PHENORA concept.

==================================================
## 4. V1 PRODUCT EXPERIENCE
==================================================

When user clicks:

EXPLORE PHENORA V1

open the V1 experience.

Structure:

-----------------------------------------
PHENORA V1
ADAPTIVE IMPEDANCE MEASUREMENT
-----------------------------------------

LEFT:
3D chamber

RIGHT:
Live measurement state

BOTTOM:
Signal + decision timeline

The 3D chamber remains the primary visual.

==================================================
## 5. 3D CHAMBER — KEEP AND ENHANCE
==================================================

DO NOT replace the existing chamber.

Enhance it substantially.

The chamber must contain:

- Control region
- Test region
- Electrodes
- biological particles/cells
- medium
- electrode/sample interface
- electrical field visualization
- signal/data flow

The existing red biological particles may remain,
but make their meaning clearer.

Add visual legend:

GREEN:
electrical/measurement flow

RED:
biological inclusions / conceptual cell representation

ELECTRODES:
measurement interface

==================================================
## 6. 3D CHAMBER INTERACTIONS
==================================================

Implement:

- orbit/rotate
- zoom
- reset camera
- hover component identification
- click component inspection
- exploded view
- measurement animation
- electrical field animation
- control/test comparison

Add:

[ NORMAL VIEW ]

[ EXPLODED VIEW ]

[ RUN MEASUREMENT ]

When measurement starts:

1. electrodes activate
2. excitation appears
3. electrical field propagates
4. sample response changes
5. data particles travel toward acquisition electronics
6. AD5933 lights up
7. Heltec lights up
8. FPGA lights up
9. decision state changes

The animation must be synchronized with the charts.

==================================================
## 7. 3D PHYSICS REPRESENTATION
==================================================

Do not claim the visual animation itself is a FEM solution.

Use clear labels:

"VISUAL REPRESENTATION"

When actual Elmer FEM data is being displayed:

"ELMER FEM RESULT"

The 3D scene may visually represent:

- potential
- current flow
- conductivity
- biological inclusion
- measurement activity

But distinguish visual animation from computed FEM data.

==================================================
## 8. COMPLETE WORKFLOW PANEL
==================================================

Immediately below the chamber create:

PHENORA MEASUREMENT WORKFLOW

Step cards:

01 SAMPLE
02 ELECTRODES
03 IMPEDANCE ACQUISITION
04 DIFFERENTIAL SIGNAL
05 QUALITY CHECK
06 EDGE ANALYSIS
07 DECISION

Each step should illuminate as the simulation progresses.

Example:

[01 SAMPLE] ✓
[02 ELECTRODES] ✓
[03 ACQUISITION] ACTIVE
[04 DIFFERENTIAL] WAITING
[05 QUALITY] WAITING
[06 EDGE] WAITING
[07 DECISION] WAITING

==================================================
## 9. SYNCHRONIZED EXPERIENCE
==================================================

The following three components MUST be synchronized:

A. 3D chamber
B. ΔZ / differential signal chart
C. FPGA decision state

Example:

3D:
electrical measurement active

↓

GRAPH:
new ΔZ datapoint appears

↓

QUALITY:
signal quality evaluated

↓

FPGA:
ANALYZING

↓

3D:
measurement continues

↓

GRAPH:
trajectory stabilizes

↓

FPGA:
STOP

The user should feel that these are three views
of ONE experiment.

==================================================
## 10. LIVE SIGNAL PANEL
==================================================

Create:

LIVE DIFFERENTIAL RESPONSE

Display:

Control
Test
ΔZ

Primary graph:

ΔZ(t)

Secondary optional graph:

Control vs Test

Use actual available computational trajectory data.

Do not generate fake scientific data.

==================================================
## 11. ADAPTIVE DECISION PANEL
==================================================

Create a prominent decision card.

Title:

ADAPTIVE EDGE DECISION

Show:

CURRENT STATE

MEASURING
ANALYZING
MEASURE AGAIN
STOP

Also show:

Signal
Slope
Stability
Noise
Measurement count

Example:

SIGNAL
0.82 Ω

SLOPE
0.014 Ω/h

STABILITY
HIGH

NOISE
LOW

MEASUREMENTS
07

DECISION

STOP

The values must come from the simulation/reference model where
available.

==================================================
## 12. IMPORTANT DECISION CHANGE
==================================================

DO NOT use:

SUSCEPTIBLE / RESISTANT

as the primary current V1 result.

Replace it with:

MEASUREMENT SUFFICIENT

or

MEASURE AGAIN

or

INVALID MEASUREMENT

Reason:

PHENORA has not yet completed biological/clinical AST validation.

Future clinical classification can be shown as:

FUTURE AST OUTPUT
S / I / R

but clearly labelled:

NOT YET VALIDATED

==================================================
## 13. MEASUREMENT QUALITY ENGINE
==================================================

Create a secondary panel:

MEASUREMENT QUALITY

Display:

Signal quality
Noise
Baseline drift
Temperature
Electrode condition

Example:

SIGNAL QUALITY     HIGH
NOISE              LOW
BASELINE DRIFT     LOW
TEMPERATURE        STABLE
ELECTRODE CONTACT  GOOD

Overall:

MEASUREMENT VALID

or:

MEASURE AGAIN

or:

INVALID / RECALIBRATE

For features not experimentally implemented yet,
label them:

V1.5 RELIABILITY CONCEPT

Do not present conceptual values as measured hardware data.

==================================================
## 14. ADAPTIVE MEASUREMENT STORY
==================================================

The user must be able to watch PHENORA decide.

Example sequence:

Measurement 01
Evidence insufficient
→ MEASURE AGAIN

Measurement 02
Evidence insufficient
→ MEASURE AGAIN

Measurement 03
Signal improving
→ ANALYZING

Measurement 04
Slope stable
→ QUALITY CHECK

Measurement 05
Evidence sufficient
→ STOP

This is the central product experience.

==================================================
## 15. CURRENT DATA MODEL
==================================================

Create a unified simulation data model.

Example conceptual structure:

MeasurementPoint:

- timestamp
- control
- test
- delta
- filteredDelta
- slope
- noise
- stability
- temperature
- state

Do not scatter scientific data throughout React components.

Create:

src/data/

Possible files:

- femResults.ts
- differentialTrajectory.ts
- adaptiveTrajectory.ts
- validationStatus.ts
- simulationParameters.ts

==================================================
## 16. DATA SOURCE ABSTRACTION
==================================================

Design SPECTRAE so the current simulation can eventually be replaced
by physical hardware data.

Architecture:

SimulationDataSource
        ↓
SPECTRAE

Future:

AD5933DataSource
        ↓
SPECTRAE

The UI must not need to be rewritten when real hardware becomes
available.

==================================================
## 17. FEM SIMULATION
==================================================

Keep the existing Elmer FEM work.

Display:

- geometry
- mesh
- voltage boundaries
- potential
- current density
- conductivity
- effective resistance

Use actual outputs.

Current verified computational result:

R = 2.000000 Ω

Show:

"0.0000% difference from analytical reference
in tested configuration."

Do NOT say:

"perfect accuracy."

==================================================
## 18. FEM MODES
==================================================

Provide:

BASIC MODE

For general public/judges:

- geometry
- conductivity
- cell inclusion
- temperature
- resulting electrical response

ADVANCED MODE

For technical judges/researchers:

- mesh
- potential
- current density
- conductivity field
- boundary conditions
- effective resistance
- ΔR

==================================================
## 19. FEM INTERACTION
==================================================

User should be able to modify selected parameters.

Possible:

Medium conductivity
Cell inclusion conductivity
Cell concentration
Temperature

Then show:

PARAMETER CHANGE
↓
FEM/behavioral model
↓
ELECTRICAL RESPONSE
↓
ΔR

If the browser cannot run real-time Elmer FEM,
use precomputed simulation datasets/interpolation.

Never fake a real-time FEM solve.

Label:

"Precomputed FEM dataset"

==================================================
## 20. VALIDATION STATUS SYSTEM
==================================================

Every scientific feature must have a status.

Use:

VERIFIED
COMPUTATIONAL DEMONSTRATION
PROTOTYPE
CONCEPT
NOT YET VALIDATED

Example:

Analytical conduction
→ VERIFIED

Elmer FEM
→ VERIFIED

Mesh convergence
→ VERIFIED

Differential biological-region model
→ COMPUTATIONAL DEMONSTRATION

Adaptive algorithm
→ VERIFIED IN SOFTWARE TESTS

AD5933 + Heltec
→ PROTOTYPE / IN PROGRESS

Biological AST
→ NOT YET VALIDATED

Clinical AST
→ NOT YET VALIDATED

==================================================
## 21. STATUS BADGES
==================================================

Create reusable:

<StatusBadge />

Examples:

VERIFIED
COMPUTATIONAL
PROTOTYPE
CONCEPT
NOT VALIDATED

The badge should appear wherever necessary.

==================================================
## 22. SPECTRAL VIEW
==================================================

Keep:

|Z| vs frequency

But improve it.

Add optional tabs:

Magnitude |Z|
Real R
Imaginary X
Phase

Current V1 can show the available modeled values.

Do not imply that the physical AD5933 is already supplying live
spectral data unless connected.

==================================================
## 23. DIFFERENTIAL IMPEDANCE VIEW
==================================================

Create:

CONTROL
TEST
ΔZ

Allow user to switch between:

- time domain
- frequency domain

Future:

ΔZ(f,t)

Label advanced spectral fingerprint as:

V2 RESEARCH DIRECTION

==================================================
## 24. ADAPTIVE FREQUENCY CONCEPT
==================================================

Add a V2 research panel.

Concept:

INITIAL FREQUENCIES
↓
evaluate evidence
↓
select next informative frequency
↓
measure
↓
update confidence/quality
↓
stop

Clearly label:

V2 CONCEPT

Do not represent as implemented V1 functionality.

==================================================
## 25. DEMO MODE
==================================================

Create:

RUN PHENORA V1

This should automatically execute a 60–90 second demonstration.

Sequence:

00–05s
SYSTEM READY

05–10s
INITIALIZING

10–20s
BASELINE

20–35s
MEASURING

35–45s
CONTROL/TEST DIVERGENCE

45–55s
QUALITY CHECK

55–65s
ANALYZING

65–75s
EVIDENCE SUFFICIENT

75–80s
STOP

End:

MEASUREMENT SUFFICIENT

Do not show clinical S/R.

==================================================
## 26. GENERAL PUBLIC MODE
==================================================

Provide simple explanations through tooltips.

Example:

"What is impedance?"

"Impedance describes how a material or biological sample responds
to an applied electrical signal."

"What is differential measurement?"

"PHENORA compares a test condition against a control to reduce
common environmental and measurement effects."

"What does adaptive mean?"

"PHENORA decides whether another measurement is necessary instead
of always using a fixed measurement duration."

==================================================
## 27. TECHNICAL MODE
==================================================

Provide an expandable:

TECHNICAL DETAILS

For judges/researchers:

- equations
- parameters
- frequency
- conductivity
- ΔR
- slope
- stability
- FEM configuration
- validation status

Do not force general users to see this information.

==================================================
## 28. NAVIGATION
==================================================

Maintain:

HOME
TECHNOLOGY
SIMULATION LAB
RESEARCH
PLATFORM
TEAM

Highlight:

SIMULATION LAB

when inside SPECTRAE.

Primary CTA:

EXPLORE V1

==================================================
## 29. PAGE STRUCTURE
==================================================

SPECTRAE page:

1. Header
2. Product identity
3. Scientific disclaimer
4. Run PHENORA V1
5. 3D chamber
6. Measurement state
7. Workflow timeline
8. Live ΔZ chart
9. Adaptive decision panel
10. Measurement quality
11. Equivalent circuit / spectrum
12. FEM model
13. Validation ladder
14. V1/V2/V3 roadmap
15. Technical notes

==================================================
## 30. COMPONENT ARCHITECTURE
==================================================

Use reusable components.

Suggested:

src/components/spectrae/

- SpectraeHero
- SimulationControls
- Chamber3D
- ChamberLegend
- MeasurementWorkflow
- LiveSignalChart
- DifferentialChart
- AdaptiveDecisionPanel
- MeasurementQuality
- FrequencySpectrum
- FemViewer
- FemControls
- ValidationLadder
- ProductRoadmap
- TechnicalDetails
- DemoController
- StatusBadge

3D:

- ProductChamber
- ElectrodePair
- BiologicalParticles
- ElectricField
- DataFlow
- HardwareNode
- MeasurementPulse

==================================================
## 31. STATE MACHINE
==================================================

Central state machine:

READY
INITIALIZING
BASELINE
MEASURING
ANALYZING
QUALITY_CHECK
MEASURE_AGAIN
STOP
INVALID

State transitions must drive:

- 3D animation
- graph updates
- workflow highlight
- decision card
- status badge

Do not implement each animation independently.

One central simulation state should drive the entire interface.

==================================================
## 32. PERFORMANCE
==================================================

Requirements:

- lazy-load Three.js
- lazy-load heavy FEM visualizations
- avoid unnecessary renders
- optimize 3D geometry
- keep charts lightweight
- mobile fallback for 3D
- preserve 60 FPS where practical

Do not sacrifice usability for visual effects.

==================================================
## 33. RESPONSIVE DESIGN
==================================================

Desktop:
full 3D + graphs + decision panel

Tablet:
3D + decision + stacked charts

Mobile:
simplified 3D
workflow
signal
decision

The mobile experience must remain functional.

==================================================
## 34. SCIENTIFIC HONESTY
==================================================

Never fabricate:

- bacterial measurements
- clinical results
- antibiotic susceptibility
- MIC
- S/I/R classification
- live hardware data
- real-time FEM calculations

Every simulated result must be clearly identifiable.

Scientific credibility is more important than visual impressiveness.

==================================================
## 35. DEFINITION OF DONE
==================================================

A hackathon judge should be able to:

1. Open PHENORA.
2. Understand adaptive impedance within 10 seconds.
3. Click RUN PHENORA V1.
4. Watch the 3D chamber operate.
5. See the differential signal develop.
6. See measurement quality.
7. Watch the FPGA decision state change.
8. See MEASURE AGAIN when evidence is insufficient.
9. See STOP when the model reaches the defined stopping condition.
10. Inspect the FEM evidence.
11. Understand what is verified.
12. Understand what is computational.
13. Understand what is still awaiting biological validation.

The website should feel like a real deep-tech product,
not a science-fiction mockup.

PRIMARY UX PRINCIPLE:

ONE MEASUREMENT.
ONE STORY.
ONE DECISION.
