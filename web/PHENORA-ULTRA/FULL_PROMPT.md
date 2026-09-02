Yes. What you need now is one master Antigravity execution prompt that tells it:

what PHENORA Flash is

exactly what it must build

how to use the two .md files under web/dataset/

how to inspect the existing project without damaging it

exactly which files it is allowed to create/modify

the complete backend/UI execution phases

autonomous execution rules

verification after every phase

localhost:3000/phenora-ultra

real dataset/backend integration where possible

simulation where real paired data does not exist

no fabricated scientific claims

no modification of unrelated existing files

stop/report on ambiguity instead of guessing

final acceptance tests

The two documents reinforce that PHENORA's identity is parallel spectroscopy + predictive impedance twin + autonomous measurement, with measured → derived → fitted → inferred → predicted kept separate. The dataset document also explicitly requires dataset profiling without merging or fabricating data.

Below is the copy-paste master prompt.

MASTER ANTIGRAVITY PROMPT — PHENORA FLASH ULTRA
PROJECT: PHENORA FLASH
CODENAME: PHENORA ULTRA
TARGET URL: http://localhost:3000/phenora-ultra

ROLE:
You are the autonomous senior software architect, full-stack engineer, scientific-computing engineer, data engineer, ML engineer, UX engineer, and verification engineer responsible for implementing PHENORA Flash inside the existing repository.

IMPORTANT:
You must execute this project in controlled phases.
Do not rush directly into UI.
Do not fabricate scientific results.
Do not modify unrelated existing files.
Do not destroy, rewrite, refactor, or "clean up" existing project code unless explicitly permitted below.

============================================================
0. PRIMARY OBJECTIVE
============================================================

Build a complete PHENORA Flash research/engineering demonstration system with:

SAMPLE
  ↓
MULTI-FREQUENCY ACQUISITION
  ↓
RAW SIGNAL
  ↓
SIGNAL PROCESSING
  ↓
IMPEDANCE SPECTRUM
  ↓
SPECTRAL / TEMPORAL FEATURES
  ↓
IMPEDANCE PHENOTYPE
  ↓
DISEASE INTELLIGENCE
  ↓
UNCERTAINTY + OOD
  ↓
DIGITAL PREDICTIVE TWIN
  ↓
TIME-SERIES FORECAST
  ↓
INFORMATION GAIN
  ↓
AUTONOMOUS MEASUREMENT PLANNER
  ↓
STOP / MEASURE AGAIN
  ↓
FINAL TRACEABLE RESULT

The central product identity is:

1. Parallel / multi-frequency spectroscopy
2. Predictive impedance digital twin
3. Autonomous measurement selection

Everything else supports those three.

The final experience must demonstrate:

"PHENORA Flash does not simply measure impedance.
It converts impedance into a structured phenotype, connects that
phenotype to validated model evidence, estimates uncertainty,
maintains a predictive digital twin, forecasts future state,
and decides what measurement should happen next."

============================================================
1. READ THE PROJECT CONTEXT FIRST
============================================================

Before modifying anything:

A. Inspect the entire repository structure.

B. Inspect package.json / package manager.

C. Inspect existing frontend framework.

D. Inspect existing backend architecture.

E. Inspect existing API routes.

F. Inspect existing TypeScript types.

G. Inspect existing signal/intelligence/backend implementation.

H. Inspect existing FPGA/hardware directories.

I. Inspect existing CSS/theme/design system.

J. Inspect existing components.

K. Inspect current scripts.

L. Inspect current test/build commands.

M. Inspect git status.

N. Inspect git diff.

O. Inspect the following two project specification files:

web/dataset/PHENORA ULTRA.md
web/dataset/PHENORA FLASH FLAGSHIP MODEL (2).md

IMPORTANT:
These two files are authoritative project-design references.

Read them completely before implementation.

Also inspect any other files in:

web/dataset/

Do not modify these specification files.

============================================================
2. ABSOLUTE FILE SAFETY RULE
============================================================

THIS IS CRITICAL.

The existing application must be treated as READ-ONLY unless a file is explicitly listed as allowed to modify.

You may:

- inspect existing files
- import existing components
- reuse existing utilities
- reuse existing styles
- reuse existing API clients
- reuse existing backend services
- reuse existing types when compatible
- analyze existing color tokens
- analyze existing typography
- analyze existing spacing
- analyze existing component conventions

You may NOT:

- rewrite existing pages
- redesign existing pages
- refactor unrelated components
- change existing routes
- change existing APIs unless explicitly required by an integration phase
- change existing backend behavior
- delete existing files
- rename existing files
- modify unrelated CSS
- modify global theme
- modify existing dashboards
- modify existing authentication
- modify existing navigation
- modify existing hardware code
- modify existing FPGA code
- modify existing dataset files
- modify the two specification MD files

The PHENORA ULTRA implementation must be isolated.

============================================================
3. ALLOWED MODIFICATION SCOPE
============================================================

PRIMARY UI SCOPE:

Create a new route:

/phenora-ultra

Create new PHENORA-specific components under a new isolated directory.

Preferred structure:

web/
  app/
    phenora-ultra/
      page.tsx
      ...

OR, if the existing framework uses another structure, determine the equivalent route structure without modifying unrelated routes.

Preferred new component namespace:

web/components/phenora-ultra/

Only create/modify files required for the new PHENORA ULTRA experience.

If backend work is necessary and the backend architecture already exists:

create PHENORA-specific modules in an isolated namespace such as:

src/phenora/
src/phenora/runtime/
src/phenora/forecast/
src/phenora/autonomy/
src/phenora/twin/

Do not rewrite unrelated backend modules.

If an existing backend module already implements the required functionality:
USE IT.
Do not duplicate it.

============================================================
4. NEVER GUESS
============================================================

If something is unknown:

DO NOT INVENT IT.

Examples:

- unknown frequency
- unknown dataset field
- unknown hardware pin
- unknown model metric
- unknown clinical relationship
- unknown calibration value
- unknown validation accuracy
- unknown patient ID
- unknown impedance value
- unknown disease mapping

Represent unknown explicitly.

Examples:

UNKNOWN
NOT_AVAILABLE
ACCESS_REQUIRED
INSUFFICIENT_DATA
OUT_OF_DISTRIBUTION
NOT_VALIDATED

============================================================
5. SCIENTIFIC INTEGRITY RULE
============================================================

Maintain this provenance hierarchy:

MEASURED
   ↓
DERIVED
   ↓
FITTED
   ↓
INFERRED
   ↓
PREDICTED

Never collapse these.

Directly measured:

frequency
Zreal
Zimag
magnitude
phase
time

Derived:

Bode magnitude
Bode phase
Nyquist coordinates
spectral slopes
phase slopes
spectral distance
temporal ΔZ
temporal rate
FFT features

Model fitted:

Rs
Rct
Cdl
Warburg
CPE
relaxation time

ML phenotype:

bacterial-associated pattern
concentration-associated pattern
interface-associated pattern
biofilm-associated pattern
host-response-associated pattern
embedding
reference distance
OOD

Clinical/model inference:

bacteriuria probability
UTI-associated probability
organism probability
AMR probability

IMPORTANT:

A prediction probability is NOT model accuracy.

Example:

Sample prediction:
UTI-associated probability = 86%

Model validation:
AUROC = [actual value]
accuracy = [actual value]
F1 = [actual value]

Only show metrics that actually exist.

============================================================
6. DATASET RULES
============================================================

The directory:

web/dataset/

contains project documentation.

Do not modify those files.

The project specifications reference datasets including:

iFAST
FlowUTI
AMR-UTI

Dataset handling must follow these rules:

DO NOT merge datasets automatically.

DO NOT fabricate paired impedance + clinical records.

DO NOT invent missing frequency values.

DO NOT invent patient IDs.

DO NOT invent labels.

DO NOT treat impedance cytometry as bulk EIS.

DO NOT claim a dataset supports a task unless its fields legitimately support it.

If a dataset requires credentialed access:

mark:

ACCESS_REQUIRED

Do not bypass access control.

If raw impedance data exists:
use it as real impedance data.

If clinical data exists without impedance:
use it only for appropriate clinical/auxiliary modelling or documentation.

If there is no legitimate paired dataset:
use a clearly marked simulated bridge.

Simulation must be labeled:

SIMULATION
RESEARCH DEMONSTRATION
NOT CLINICALLY VALIDATED

============================================================
7. DATASET PROFILING
============================================================

Before building ML:

inspect all accessible dataset files.

For every file determine:

filename
extension
size
checksum if applicable
source
license
access restriction
rows
columns
schema
datatype
missing values
unique values
min
max
mean
median
standard deviation
sample identifiers
patient identifiers
clinical labels
organism labels
antibiotic labels
impedance variables
frequency
time
train/test indicators

Classify fields:

REAL_MEASUREMENT
DERIVED_FEATURE
CLINICAL_LABEL
METADATA
IDENTIFIER
SYNTHETIC
UNKNOWN

Determine:

bulk EIS?
impedance cytometry?
other electrical measurement?

Determine whether each dataset can support:

1. impedance phenotype learning
2. UTI classification
3. bacteriuria classification
4. organism classification
5. AST/AMR prediction
6. forecasting
7. autonomous frequency selection

Do not merge them.

Produce or preserve dataset registry information where appropriate.

============================================================
8. IMPLEMENTATION STRATEGY
============================================================

Use this order exactly:

PHASE 0
Repository audit

PHASE 1
Specification and architecture verification

PHASE 2
Dataset inventory/profiling

PHASE 3
Canonical PHENORA data contracts

PHASE 4
Signal + impedance pipeline verification

PHASE 5
Impedance phenotype layer

PHASE 6
Disease intelligence layer

PHASE 7
Digital twin

PHASE 8
Forecasting

PHASE 9
Autonomous measurement planner

PHASE 10
Experiment/run orchestrator

PHASE 11
Canonical final result

PHASE 12
Simulation engine

PHASE 13
PHENORA ULTRA UI

PHASE 14
Backend/UI synchronization

PHASE 15
End-to-end verification

PHASE 16
Final hardening

Do not skip phases.

============================================================
9. PHASE 0 — REPOSITORY AUDIT
============================================================

Perform:

- tree inspection
- package inspection
- build inspection
- test inspection
- route inspection
- existing PHENORA code inspection
- existing UI inspection
- git status
- dependency inspection

Create an internal implementation map.

Do not modify code yet.

Output:

REPOSITORY AUDIT
----------------

Frontend:
Backend:
Framework:
Package manager:
Existing PHENORA modules:
Existing APIs:
Existing reusable components:
Existing styles:
Existing datasets:
Existing tests:
Build command:
Dev command:

Modification risk:
LOW / MEDIUM / HIGH

Files proposed for modification:
[list]

Files proposed for creation:
[list]

STOP if implementation requires modifying unrelated files.

============================================================
10. PHASE 1 — SPECIFICATION VERIFICATION
============================================================

Read:

web/dataset/PHENORA ULTRA.md

and:

web/dataset/PHENORA FLASH FLAGSHIP MODEL (2).md

Extract:

- product definition
- pipeline
- scientific constraints
- dataset constraints
- UI requirements
- digital twin
- forecasting
- autonomous measurement
- disease intelligence
- uncertainty
- OOD
- provenance
- acceptance criteria

Resolve contradictions between the existing code and specification.

Do not silently change the specification.

If implementation differs:

document:

SPECIFICATION GAP

============================================================
11. PHASE 2 — DATASET INVENTORY
============================================================

Profile available datasets.

Produce:

DATASET STATUS TABLE

Dataset
Modality
Sample type
Frequency
Impedance
Clinical labels
Organism labels
AMR
Forecasting
Autonomy
Access
Status

Use:

REAL_IMPEDANCE
REAL_CLINICAL
AUXILIARY_BIOLOGICAL
SIMULATED_PAIRED

Never falsely present simulated paired data as real.

============================================================
12. PHASE 3 — CANONICAL DATA CONTRACTS
============================================================

Create or verify canonical TypeScript contracts.

Required conceptual objects:

SampleMetadata

AcquisitionResult

ImpedanceSpectrum

SignalFeatures

ImpedancePhenotype

DiseasePrediction

DiseaseEnsembleResult

DigitalTwinState

PredictiveForecast

AutonomousDecision

RunProvenance

ResultValidity

PhenoraRun

PhenoraFlashResult

Every result must retain provenance.

Example:

PhenoraFlashResult

{
  run,
  sample,
  acquisition,
  spectrum,
  phenotype,
  diseaseIntelligence,
  digitalTwin,
  forecast,
  autonomousDecision,
  validity,
  provenance
}

Do not create duplicate incompatible versions of these types.

If equivalent types already exist:
reuse/alignment only.

============================================================
13. PHASE 4 — SIGNAL + IMPEDANCE
============================================================

Verify existing signal pipeline:

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

Then impedance representation:

Z(f,t) = Z'(f,t) + jZ''(f,t)

Calculate only where valid:

magnitude
phase
Bode
Nyquist
temporal ΔZ
relative change
spectral slopes
FFT

FFT must be described as:

TIME-DOMAIN / EXCITATION ANALYSIS

not as an alternative EIS representation.

For insufficient frequency data:

do not draw misleading Bode/Nyquist/circuit results.

Display:

NOT AVAILABLE
INSUFFICIENT SPECTRUM

============================================================
14. PHASE 5 — IMPEDANCE PHENOTYPE
============================================================

Build/verify:

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

Feature categories:

Spectral
Resistive
Reactive
Temporal
Quality
Reference distance
Embedding
OOD

Every feature needs provenance:

feature
value
unit
source
calculation
status

Statuses:

RAW_DIRECT
DERIVED
MODEL_INFERRED
REQUIRES_SPECTRUM
REQUIRES_TIME_SERIES
NOT_AVAILABLE

Do not create biologically named raw features such as:

bacteriaCountFromImpedance
UTISeverity
infectionPercentage
EcoliPercentage

unless they are explicitly model outputs.

============================================================
15. PHASE 6 — DISEASE INTELLIGENCE
============================================================

Architecture:

IMPEDANCE
 ↓
PHENOTYPE
 ↓
MODEL
 ↓
PREDICTION
 ↓
CONFIDENCE
 ↓
UNCERTAINTY
 ↓
OOD

Disease prediction must contain:

sample type
measurement modality
phenotype
model ID
model version
training dataset
validation dataset
confidence
uncertainty
OOD
evidence

Recommended model progression:

V1:
Random Forest / XGBoost

V2:
1D CNN

V3:
temporal neural network

V4:
Transformer only if justified by data volume.

Do not use deep learning merely for appearance.

If insufficient data:
use a transparent baseline model or simulation.

Unknown must be first-class:

SUPPORTED
LOW_CONFIDENCE
UNKNOWN
OUT_OF_DISTRIBUTION

Never force an unknown sample into a known disease.

============================================================
16. PHASE 7 — DIGITAL PREDICTIVE TWIN
============================================================

Implement/verify:

OBSERVED
INFERRED
PREDICTED

Twin must maintain:

latest observation
latest spectrum
phenotype
disease state
predicted state
uncertainty
history
provenance
update sequence

Twin updates must reject:

stale measurements
duplicates
wrong sample
invalid calibration
invalid sequence

Twin should aggregate state.

Do not turn the digital twin into another arbitrary disease model.

============================================================
17. PHASE 8 — FORECASTING
============================================================

Implement/verify:

impedance forecast
phenotype forecast
disease-state forecast

V1:

transparent trend/linear baseline

Then optionally:

feature ML
temporal neural model

Only use advanced models when justified.

Forecast must contain:

horizon
prediction
lower bound
upper bound
confidence
uncertainty
model ID
version
status

Statuses:

READY
INSUFFICIENT_HISTORY
LOW_CONFIDENCE
UNSTABLE
OUT_OF_DOMAIN

Uncertainty must increase appropriately with horizon.

Do not present forecast as observed data.

============================================================
18. PHASE 9 — AUTONOMOUS MEASUREMENT
============================================================

Implement:

candidate generation
feasibility checking
information gain
uncertainty reduction
cost
budget
ranking
stopping policy

Concept:

IG(m) =
H(current)
-
E[H(state | measurement m)]

V1 may use a deterministic approximation.

Candidate score:

information gain
× uncertainty
× feasibility
÷ cost

Make parameters configurable.

Hard constraints:

supported frequency
amplitude safety
duration
calibration
electrode validity
device state
measurement budget

Autonomy decisions:

STOP
MEASURE_AGAIN
CHANGE_FREQUENCY
EXTEND_MEASUREMENT
INSUFFICIENT_DATA
ERROR

Safety rule:

AUTONOMOUS PLANNER
 ↓
VALIDATED COMMAND
 ↓
MEASUREMENT CONTROLLER
 ↓
HARDWARE SAFETY CONSTRAINTS
 ↓
INSTRUMENT

The planner must never directly control arbitrary hardware.

============================================================
19. PHASE 10 — RUN ORCHESTRATOR
============================================================

Implement/verify:

IDLE
 ↓
SAMPLE_READY
 ↓
INITIALIZING
 ↓
ACQUIRING
 ↓
PROCESSING
 ↓
PHENOTYPING
 ↓
DISEASE_ANALYSIS
 ↓
TWIN_UPDATE
 ↓
FORECASTING
 ↓
AUTONOMOUS_EVALUATION
 ↓
STOP / MEASURE_AGAIN
 ↓
COMPLETE

Error path:

ANY
 ↓
ERROR
 ↓
RECOVER / ABORT

Events:

RUN_STARTED
MEASUREMENT_STARTED
MEASUREMENT_COMPLETED
SPECTRUM_UPDATED
PHENOTYPE_UPDATED
DISEASE_ANALYSIS_COMPLETED
TWIN_UPDATED
FORECAST_UPDATED
AUTONOMOUS_DECISION_READY
MEASURE_AGAIN_REQUESTED
RUN_COMPLETED
RUN_ERROR

============================================================
20. PHASE 11 — CANONICAL RESULT
============================================================

The final backend object must be:

PhenoraFlashResult

The UI must consume this canonical result.

Frontend must NOT independently calculate:

disease probability
confidence
OOD
phenotype
forecast
information gain
autonomous decision

Backend is the source of truth.

============================================================
21. PHASE 12 — SIMULATION ENGINE
============================================================

Build a deterministic PHENORA simulation engine.

Required scenarios:

STABLE
RISING
FALLING
NOISY
DRIFTING
TRANSITION
ANOMALY
RECOVERY
OOD
TIMEOUT

The simulator should produce realistic structured measurement streams.

It must generate:

frequency
Zreal
Zimag
magnitude
phase
time
quality
noise
drift

then:

phenotype
disease model result
twin state
forecast
autonomous decision

Do not hardcode a fake final result only.

The result must flow through the actual pipeline.

============================================================
22. PHENORA ULTRA UI
============================================================

Create ONLY a new page:

http://localhost:3000/phenora-ultra

Do not replace the existing homepage.

Do not modify existing pages.

Do not modify unrelated components.

You may inspect existing UI styles and colors and reuse their design language.

If existing design tokens are available:
reuse them.

If existing components are reusable without modification:
import them.

If a component needs changes:
create a PHENORA-specific version instead of modifying the shared component.

============================================================
23. UI CONCEPT
============================================================

PHENORA ULTRA is a horizontal interactive laboratory workflow.

It must NOT look like a generic SaaS dashboard.

Main timeline:

[SAMPLE]
   →
[ACQUISITION]
   →
[IMPEDANCE]
   →
[PHENOTYPE]
   →
[DISEASE INTELLIGENCE]
   →
[DIGITAL TWIN]
   →
[FORECAST]
   →
[AUTONOMOUS DECISION]
   →
[FINAL RESULT]

Timeline is horizontal.

It is scrollable.

Active stage is visually dominant.

Completed stages can be inspected.

Future stages remain locked until data exists.

============================================================
24. UI STAGE STATES
============================================================

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

Never represent all stages as completed during an active experiment.

============================================================
25. SAMPLE UI
============================================================

Show:

Sample ID
Sample type
Protocol
Volume if available
Environment if available
Device
Calibration

Sample types:

URINE
BLOOD
SERUM
PLASMA
CONTROL
CUSTOM

Available disease models must depend on sample type.

Do not show unsupported models as valid.

============================================================
26. ACQUISITION UI
============================================================

Show:

live signal
raw ADC
filtered signal
RMS
delta
quality
noise
drift
measurement count
elapsed time

Pipeline:

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

Show live state of each node.

Engineering details are collapsible.

============================================================
27. IMPEDANCE UI
============================================================

Tabs:

SPECTRUM
BODE
NYQUIST
TEMPORAL
FFT
QUALITY
CIRCUIT FIT

Only render views supported by available data.

Bode:

magnitude
phase
log frequency

Nyquist:

Z'
-Z''

Temporal:

Z(t)
ΔZ(t)
relative change

FFT:

time-domain frequency content

Circuit fit:

only if enough data and actual fit exists.

============================================================
28. PHENOTYPE UI
============================================================

Display:

spectral phenotype
resistive phenotype
reactive phenotype
temporal phenotype
quality phenotype
reference distance
embedding/OOD

Every feature can be expanded to show:

value
unit
source
calculation
status
version

============================================================
29. DISEASE INTELLIGENCE UI
============================================================

Never display only:

"Disease: X"

Instead display:

PRIMARY MODEL OUTPUT

Condition / phenotype:
[model output]

Probability:
[model probability]

Confidence:
[confidence]

Uncertainty:
[uncertainty]

OOD:
[OOD]

Status:
SUPPORTED / LOW_CONFIDENCE / UNKNOWN / OUT_OF_DISTRIBUTION

Then show:

ALTERNATIVE HYPOTHESES

MODEL AGREEMENT

EVIDENCE

MODEL DETAILS

VALIDATION DATASET

LIMITATIONS

============================================================
30. CRITICAL UI RULE
============================================================

Never label:

probability = accuracy

Example:

Probability:
86%

Validation AUROC:
0.94

Validation accuracy:
92%

These are different quantities.

============================================================
31. DIGITAL TWIN UI
============================================================

Show three columns:

OBSERVED
INFERRED
PREDICTED

Example:

OBSERVED:
impedance
temperature
quality

INFERRED:
phenotype
disease-associated state

PREDICTED:
future impedance
future phenotype
future disease probability

Show:

twin status
last update
update sequence
uncertainty
history

============================================================
32. FORECAST UI
============================================================

Show historical data and predicted data together.

Clearly distinguish:

OBSERVED

from:

PREDICTED

Display prediction interval.

Tabs:

IMPEDANCE
PHENOTYPE
DISEASE STATE

Show horizon.

Show uncertainty increasing with horizon where appropriate.

============================================================
33. AUTONOMY UI
============================================================

Main recommendation:

STOP

or:

MEASURE AGAIN

or:

CHANGE FREQUENCY

or:

EXTEND MEASUREMENT

Display:

reason
expected information gain
expected uncertainty reduction
selected frequency
duration
measurement budget
alternatives

Example:

NEXT ACTION

MEASURE AGAIN

Recommended frequency:
10 kHz

Expected information gain:
0.42

Expected uncertainty reduction:
18%

Reason:
Current uncertainty is concentrated in the mid-frequency region.

============================================================
34. FINAL RESULT UI
============================================================

Show:

RUN ID
SAMPLE
MODE
VALIDITY
PRIMARY PREDICTION
PROBABILITY
CONFIDENCE
UNCERTAINTY
OOD
AUTONOMOUS DECISION

Then:

RESULT TRACE

SAMPLE
 ↓
MEASUREMENT
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

Each node is inspectable.

Show provenance:

device
calibration
protocol
preprocessing version
phenotype version
model
model version
training dataset
validation dataset
software version

Show limitations.

============================================================
35. MODE SWITCHING
============================================================

Support:

OPERATOR
SCIENTIFIC
ENGINEERING

Operator:
simple.

Scientific:
plots/features/model evidence.

Engineering:
device/FPGA/UART/runtime details.

Do not duplicate the entire UI three times.

Use progressive disclosure.

============================================================
36. SIMULATION CONTROL
============================================================

PHENORA ULTRA must support simulation.

Visible indicator:

SIMULATION MODE

Scenario selector:

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

Start:

RUN PHENORA FLASH

The simulation must execute the backend pipeline.

Do not animate fake values independently of backend state.

============================================================
37. BACKEND SYNCHRONIZATION
============================================================

The UI must remain synchronized with backend state.

Use the existing API architecture if available.

If runtime events already exist:
use them.

If not:
implement the minimum PHENORA-specific event mechanism.

Preferred future architecture:

REST
+
SSE/WebSocket for real-time state updates

Do not introduce unnecessary infrastructure if the repository does not need it.

============================================================
38. LIVE PIPELINE
============================================================

When a run starts:

RUN_STARTED

then:

SAMPLE_READY
ACQUIRING
PROCESSING
PHENOTYPING
DISEASE_ANALYSIS
TWIN_UPDATE
FORECASTING
AUTONOMOUS_EVALUATION

The timeline must visibly transition through those states.

If autonomous decision says:

MEASURE_AGAIN

the timeline loops:

AUTONOMY
 ↓
ACQUISITION
 ↓
IMPEDANCE
 ↓
PHENOTYPE
 ↓
DISEASE
 ↓
TWIN
 ↓
FORECAST
 ↓
AUTONOMY

If STOP:

AUTONOMY
 ↓
FINAL RESULT

============================================================
39. UI DESIGN QUALITY
============================================================

The interface should feel like:

advanced scientific instrument
laboratory workstation
real-time computational measurement system

Avoid:

generic admin dashboard
generic SaaS cards
excessive gradients
fake medical imagery
fake 3D organs
unexplained giant percentages
marketing-style claims

Prioritize:

precision
hierarchy
data density
clarity
traceability
scientific credibility

============================================================
40. EXISTING COLOR SYSTEM
============================================================

Analyze the existing project.

Identify:

primary color
secondary color
background
surface
border
text
muted text
success
warning
error
active state

Reuse the existing color language where appropriate.

DO NOT modify global theme files.

If PHENORA needs a specialized palette:
scope it to PHENORA ULTRA only.

============================================================
41. RESPONSIVE BEHAVIOR
============================================================

Desktop is the primary target.

The main experience should work at:

1280px+
1440px+
1920px+

At narrower widths:

timeline becomes horizontally scrollable.

Do not destroy the horizontal workflow by forcing all stages vertically.

============================================================
42. ACCESSIBILITY
============================================================

Every state must have textual meaning.

Do not use color alone.

Charts need:

labels
legends
tooltips
accessible descriptions where practical

Buttons need clear actions.

Warnings need text.

Errors need text.

============================================================
43. PERFORMANCE
============================================================

Avoid unnecessary re-renders.

Do not animate huge datasets.

Use downsampling for live visualization if necessary.

Keep calculations in backend where they belong.

Frontend should primarily render canonical state.

============================================================
44. TESTING
============================================================

After every implementation phase run:

typecheck
lint if available
unit tests
build

Use the project's existing commands.

Do not invent commands if package.json already defines them.

At minimum verify:

npm run build

and relevant test command.

Also test:

/phenora-ultra loads.

============================================================
45. END-TO-END TEST
============================================================

The final automated test should simulate:

URINE SAMPLE

↓

START RUN

↓

ACQUISITION

↓

IMPEDANCE SPECTRUM

↓

PHENOTYPE

↓

DISEASE MODEL

↓

OOD

↓

DIGITAL TWIN

↓

FORECAST

↓

AUTONOMY

↓

MEASURE AGAIN

↓

SECOND MEASUREMENT

↓

UPDATED PHENOTYPE

↓

UPDATED DISEASE STATE

↓

UPDATED TWIN

↓

UPDATED FORECAST

↓

AUTONOMY

↓

STOP

↓

FINAL RESULT

The UI must reflect these real backend state changes.

============================================================
46. SCIENTIFIC FAILURE TESTS
============================================================

Test:

low quality
high noise
drift
missing frequency
insufficient spectrum
insufficient history
OOD
model unavailable
forecast unavailable
invalid calibration
stale measurement
duplicate measurement
measurement budget exhausted
UART failure if applicable
backend error

Expected behavior:

DO NOT FORCE A DIAGNOSIS.

Use:

UNKNOWN
INSUFFICIENT_DATA
OUT_OF_DISTRIBUTION
MEASURE_AGAIN
ERROR

as appropriate.

============================================================
47. AUTONOMY TESTS
============================================================

Required:

Stable:
→ STOP

Low confidence:
→ MEASURE AGAIN

High uncertainty:
→ MEASURE AGAIN

High OOD:
→ UNKNOWN / ADDITIONAL DATA

High noise:
→ MEASURE AGAIN

Budget exhausted:
→ STOP / INSUFFICIENT_DATA

Unsupported frequency:
→ REJECT

Invalid hardware configuration:
→ REJECT

============================================================
48. ACCEPTANCE CRITERIA
============================================================

PHENORA ULTRA is considered implemented only when:

[ ] /phenora-ultra exists

[ ] Existing homepage remains unchanged

[ ] Existing unrelated routes remain unchanged

[ ] Existing global theme remains unchanged

[ ] Two specification MD files remain unchanged

[ ] Dataset files remain unchanged

[ ] Existing PHENORA backend is reused where possible

[ ] Canonical result exists

[ ] Simulation exists

[ ] Sample selection exists

[ ] Acquisition stage exists

[ ] Impedance stage exists

[ ] Bode exists when supported

[ ] Nyquist exists when supported

[ ] FFT exists

[ ] Temporal impedance exists

[ ] Quality exists

[ ] Phenotype exists

[ ] Disease intelligence exists

[ ] Confidence exists

[ ] Uncertainty exists

[ ] OOD exists

[ ] Evidence exists

[ ] Model provenance exists

[ ] Digital twin exists

[ ] Forecast exists

[ ] Autonomous planner exists

[ ] Information gain exists

[ ] Measurement budget exists

[ ] STOP exists

[ ] MEASURE AGAIN exists

[ ] UNKNOWN exists

[ ] Final result exists

[ ] Provenance exists

[ ] Simulation scenarios work

[ ] Backend and frontend are synchronized

[ ] Build passes

[ ] Tests pass

[ ] No fabricated scientific metrics

[ ] No fabricated frequency values

[ ] No unsupported disease claims

============================================================
49. REQUIRED DEMO SCENARIOS
============================================================

Create at least these demonstrable flows:

DEMO 1:
URINE → bacterial/UTI-associated impedance phenotype

DEMO 2:
URINE → uncertain → autonomous measurement → improved evidence

DEMO 3:
URINE → OOD → UNKNOWN

DEMO 4:
NOISY SAMPLE → MEASURE AGAIN

DEMO 5:
BLOOD → supported research phenotype/model if legitimate data/model exists

If a blood model is not legitimately supported by available data:
do NOT fake it.

Show:

MODEL NOT AVAILABLE / RESEARCH SIMULATION

instead.

============================================================
50. NO FAKE "ACCURACY"
============================================================

Never hardcode:

95% accuracy
99% accuracy
98% confidence

unless that number comes from an actual validation result.

For simulation:

simulation probability

is allowed.

But label it:

SIMULATION OUTPUT

For model metrics:

MODEL VALIDATION METRIC

and provide provenance.

============================================================
51. OUTPUT / REPORT AFTER EACH PHASE
============================================================

After completing each phase, produce:

PHASE:
[phase name]

STATUS:
PASS / PARTIAL / BLOCKED

IMPLEMENTED:
[list]

FILES CREATED:
[list]

FILES MODIFIED:
[list]

FILES NOT TOUCHED:
[list]

TESTS:
[list]

BUILD:
PASS / FAIL

SCIENTIFIC VALIDATION:
PASS / WARNING / BLOCKED

KNOWN LIMITATIONS:
[list]

NEXT PHASE:
[phase]

Do not claim PASS if anything essential failed.

============================================================
52. TIME / EXECUTION CONTROL
============================================================

The project must be executed incrementally.

Do not spend the entire execution time creating visual polish before verifying backend functionality.

Priority order:

1. correctness
2. integration
3. scientific traceability
4. backend synchronization
5. simulation
6. UI functionality
7. visualization
8. visual polish

If execution time is limited:

STOP at the current safe phase.

Do not leave the repository half-refactored.

Do not modify unrelated files to finish faster.

============================================================
53. IF YOU ENCOUNTER A BLOCKER
============================================================

Use:

BLOCKED

and explain:

WHAT
WHY
EVIDENCE
SAFE ALTERNATIVE

Do not bypass:

authentication
dataset access controls
licenses
security
validation
scientific constraints

============================================================
54. GIT SAFETY
============================================================

Before work:

capture git status.

After every major phase:

capture git diff --stat.

At the end:

capture:

git status
git diff --stat

Confirm:

existing unrelated files unchanged.

If unexpected modifications appear:
STOP and investigate.

Do not commit unless explicitly requested.

============================================================
55. FINAL PROJECT CHECK
============================================================

At the end verify:

http://localhost:3000/phenora-ultra

loads successfully.

Run a complete simulation.

Confirm that the UI receives backend state.

Confirm that the timeline moves.

Confirm that the plots correspond to actual generated/backend data.

Confirm that disease prediction is connected to impedance-derived phenotype.

Confirm that probability is not displayed as accuracy.

Confirm that uncertainty and OOD are visible.

Confirm that the digital twin updates.

Confirm that the forecast updates.

Confirm that autonomy evaluates the next measurement.

Confirm that MEASURE AGAIN loops back into acquisition.

Confirm that STOP reaches final result.

Confirm that UNKNOWN is possible.

Confirm that provenance is visible.

Confirm that simulation is visibly marked as simulation.

Confirm no unrelated project files were modified.

============================================================
56. FINAL REPORT
============================================================

Produce a final report:

PHENORA FLASH ULTRA
IMPLEMENTATION REPORT

1. Repository audit
2. Dataset status
3. Backend status
4. Signal pipeline status
5. Impedance spectrum status
6. Phenotype status
7. Disease intelligence status
8. OOD status
9. Digital twin status
10. Forecast status
11. Autonomous planner status
12. Run orchestrator status
13. Simulation status
14. UI status
15. API status
16. Tests
17. Build
18. Scientific limitations
19. Files created
20. Files modified
21. Existing files confirmed untouched
22. localhost URL
23. Remaining work
24. Recommended next phase

============================================================
57. FINAL PRINCIPLE
============================================================

Do not build a fake futuristic dashboard.

Build a real research/engineering system whose UI reveals the actual computational chain:

MEASURE
 ↓
PROCESS
 ↓
UNDERSTAND
 ↓
PREDICT
 ↓
QUANTIFY UNCERTAINTY
 ↓
UPDATE DIGITAL TWIN
 ↓
FORECAST
 ↓
DECIDE
 ↓
MEASURE AGAIN

The final PHENORA ULTRA experience should make this obvious:

"From impedance to phenotype.
From phenotype to disease-associated inference.
From inference to predictive state.
From uncertainty to autonomous measurement."

Scientific honesty is more important than visual completeness.

If a capability is not scientifically or technically supported yet,
show:

NOT AVAILABLE
INSUFFICIENT DATA
UNKNOWN
OUT OF DISTRIBUTION
RESEARCH SIMULATION

rather than inventing an answer.

BEGIN WITH PHASE 0.
DO NOT JUMP DIRECTLY TO UI.
Execution order I want Antigravity to follow
The important part is that this prompt deliberately doesn't tell Antigravity to immediately make /phenora-ultra.

It should execute:

Phase	Objective	Main output
0	Repository audit	Safe modification map
1	Read the two MDs + reconcile architecture	Locked implementation specification
2	Inspect dataset folder/data	Dataset capability matrix
3	Canonical contracts	One PHENORA data model
4	Verify signal/EIS	Real spectrum pipeline
5	Phenotype	Impedance feature layer
6	Disease intelligence	Impedance → disease-associated inference
7	Digital twin	Observed/inferred/predicted state
8	Forecast	Future state + uncertainty
9	Autonomy	Next-best measurement
10	Orchestration	One complete run
11	Result	Canonical PhenoraFlashResult
12	Simulation	Repeatable demo
13	UI	/phenora-ultra
14	Sync	Backend ↔ UI live state
15	E2E testing	Full autonomous loop
16	Hardening	Final safe build
The critical architecture is:

                         PHENORA ULTRA
                              │
                              ▼
                         SAMPLE INPUT
                       URINE / BLOOD / ...
                              │
                              ▼
                  MULTI-FREQUENCY ACQUISITION
                              │
                              ▼
                         RAW SIGNAL
                              │
                              ▼
                    SIGNAL PROCESSING
                              │
                              ▼
                       Z(f,t) SPECTRUM
                              │
             ┌────────────────┼────────────────┐
             ▼                ▼                ▼
           BODE            NYQUIST            FFT
             │                │                │
             └────────────────┼────────────────┘
                              ▼
                    IMPEDANCE PHENOTYPE
                              │
                              ▼
                     DISEASE INTELLIGENCE
                              │
                ┌─────────────┼─────────────┐
                ▼             ▼             ▼
          PREDICTION     CONFIDENCE       OOD
                │             │             │
                └─────────────┼─────────────┘
                              ▼
                      DIGITAL TWIN
                              │
                              ▼
                         FORECAST
                              │
                              ▼
                    INFORMATION GAIN
                              │
                              ▼
                  AUTONOMOUS PLANNER
                         /         \
                        /           \
                       ▼             ▼
                MEASURE AGAIN       STOP
                       │             │
                       └──────┐      │
                              ▼      ▼
                           RESULT / COMPLETE
And yes, the disease prediction is explicitly connected to impedance. It is not a separate generic medical classifier. The intended relationship is:

IMPEDANCE
   ↓
SPECTRUM
   ↓
SPECTRAL + TEMPORAL FEATURES
   ↓
IMPEDANCE PHENOTYPE
   ↓
MODEL
   ↓
DISEASE-ASSOCIATED PREDICTION
The two supplied specifications also explicitly require the provenance chain to remain measured → derived → fitted → inferred → predicted, rather than collapsing everything into one number.

One change I strongly recommend
Don't tell Antigravity to make the page look complete at all costs. Tell it to make the page truthfully expose whatever the backend has actually completed.

That way, if it reaches Disease Intelligence and discovers that a legitimate blood model isn't available, /phenora-ultra will show:

MODEL NOT AVAILABLE — INSUFFICIENT VALIDATED DATA

rather than silently inventing a blood-disease prediction.

That is especially important because the project specification itself says that the system must have explicit UNKNOWN/OOD paths and must not force a diagnosis when confidence/domain gates fail.