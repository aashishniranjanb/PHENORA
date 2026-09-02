Yes. What you have now is a completed architecture, but not yet a fully convincing flagship-grade product. The next step should be an enhancement pass, not a rewrite.

The walkthrough confirms that the current implementation already covers the required 16 phases and keeps the work isolated under the PHENORA namespace.

The main enhancement target should be:

Make /phenora-ultra behave like a real scientific instrument rather than a collection of technically correct panels.

Below is the master prompt I would give Antigravity for the ULTRA Enhancement Pass.

MASTER ANTIGRAVITY PROMPT
PHENORA ULTRA — FLAGSHIP ENHANCEMENT PASS
You are now entering the PHENORA ULTRA FLAGSHIP ENHANCEMENT PASS.

The initial PHENORA ULTRA implementation has already completed its 16 implementation phases.

DO NOT REBUILD THE PROJECT FROM SCRATCH.

Your job is to deeply inspect the existing PHENORA ULTRA implementation and upgrade it from:

"technically complete demonstration"

to:

"coherent, scientifically credible, visually exceptional, interactive research-instrument demonstration."

============================================================
0. AUTHORITATIVE REFERENCES
============================================================

The authoritative specification files are:

web/dataset/PHENORA ULTRA.md
web/dataset/PHENORA FLASH FLAGSHIP MODEL (2).md

READ BOTH FILES COMPLETELY BEFORE MODIFYING ANYTHING.

They are read-only.

DO NOT MODIFY:
- web/dataset/PHENORA ULTRA.md
- web/dataset/PHENORA FLASH FLAGSHIP MODEL (2).md
- any other existing dataset files

Treat those files as requirements and scientific constraints.

The existing implementation is also an important source of truth.

Do not replace functioning architecture simply because another architecture seems cleaner.

============================================================
1. ABSOLUTE FILE SAFETY RULE
============================================================

THIS RULE HAS HIGHEST PRIORITY.

You MUST NOT modify existing unrelated project files.

You MAY:
- create new PHENORA-specific files
- modify existing PHENORA ULTRA files already created for this implementation
- create additional files inside the PHENORA namespace
- create additional components inside the PHENORA ULTRA namespace

You MUST NOT modify:
- existing unrelated pages
- existing Navbar
- existing Footer
- existing global components
- existing global CSS
- existing theme files
- existing application pages
- existing unrelated APIs
- existing unrelated hooks
- existing dataset files
- existing shared components

You MAY READ existing files to:
- understand architecture
- reuse types
- inspect color tokens
- inspect typography
- inspect spacing
- understand routing
- understand chart libraries
- understand existing component patterns

But reading is NOT permission to modify.

IMPORTANT:

DO NOT run repository-wide:
- formatters
- codemods
- refactors
- automated migrations

that could modify unrelated files.

Do not run formatting over the entire repository.

Only format files belonging to PHENORA ULTRA.

============================================================
2. PRE-WRITE SAFETY CHECK
============================================================

Before EVERY significant implementation stage:

1. Inspect git status.
2. Identify files you intend to modify.
3. Verify every target belongs to PHENORA.
4. Never modify an unrelated file.

After each stage:

1. inspect git diff
2. verify no unrelated files changed
3. immediately revert accidental unrelated changes
4. continue

At the end:

git status
git diff --stat
git diff --name-only

Expected result:

Only PHENORA-specific files changed.

============================================================
3. PRIMARY OBJECTIVE
============================================================

Upgrade:

http://localhost:3000/phenora-ultra

into a flagship scientific instrument interface.

The experience must communicate:

- scientific instrumentation
- impedance spectroscopy
- signal processing
- measurement quality
- model reasoning
- uncertainty
- provenance
- digital twin state
- forecasting
- autonomous measurement
- closed-loop experimentation

It must NOT feel like:

- generic SaaS dashboard
- medical landing page
- crypto dashboard
- AI chatbot
- decorative analytics dashboard
- collection of unrelated cards

The user should feel:

"I am operating a real experimental intelligence platform."

============================================================
4. CORE EXPERIENCE
============================================================

The central workflow remains:

SAMPLE
↓
ACQUIRE
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
AUTONOMOUS ACTION
↓
RESULT

This workflow must become visually and behaviorally obvious.

The application should communicate causality.

For example:

measurement changes
→ spectrum changes
→ phenotype changes
→ model evidence changes
→ twin changes
→ forecast changes
→ autonomous decision changes

Do NOT simply animate every panel independently.

============================================================
5. FIRST TASK — DEEP AUDIT
============================================================

Before coding, inspect the existing implementation.

Audit:

web/src/app/phenora-ultra/
web/src/components/phenora-ultra/
web/src/phenora/

and all PHENORA-specific hooks/modules.

Create an internal enhancement map containing:

A. Existing functionality
B. Missing functionality
C. Fake/static functionality
D. Scientifically questionable functionality
E. Visual inconsistencies
F. State synchronization problems
G. Accessibility issues
H. Performance problems
I. Demo-breaking bugs
J. Opportunities for high-impact improvements

DO NOT stop after producing the audit.

The audit is immediately followed by implementation.

============================================================
6. SCIENTIFIC INTEGRITY
============================================================

Maintain strict provenance.

The system must distinguish:

MEASURED
DERIVED
FITTED
INFERRED
PREDICTED

Never represent these as equivalent.

Every major scientific value should expose enough context to understand:

- what it is
- where it came from
- how it was calculated
- whether it was measured or inferred
- confidence
- uncertainty
- model/version when applicable

Disease intelligence MUST NOT imply clinical validation.

The UI must clearly distinguish:

SIMULATION
RESEARCH REFERENCE
MODEL INFERENCE
PREDICTION
VALIDATED MEASUREMENT

Do not invent validation metrics.

Probability is NOT validation accuracy.

Never display a fabricated accuracy number.

============================================================
7. FIX THE MOST IMPORTANT UX PROBLEM
============================================================

The application must feel like ONE experiment.

Introduce a persistent experiment context.

At minimum:

Run ID
Sample ID
Sample type
Protocol
Device
Calibration
Scenario
Elapsed time
Current state
Measurement count
Budget remaining

This information should remain available while navigating the experiment.

============================================================
8. TOP BAR ENHANCEMENT
============================================================

Upgrade the top bar into an instrument control surface.

Include:

PHENORA ULTRA
RUN ID
SYSTEM STATE
SIMULATION / LIVE indicator
SAMPLE TYPE
PROTOCOL
DEVICE
CALIBRATION
MEASUREMENT COUNT
ELAPSED TIME

The system state should change dynamically.

Examples:

READY
ACQUIRING
PROCESSING
ANALYZING
FORECASTING
PLANNING
MEASURE AGAIN
COMPLETE
WARNING
ERROR

Avoid excessive animation.

Use subtle scientific telemetry.

============================================================
9. EXPERIMENT TIMELINE ENHANCEMENT
============================================================

The timeline is the signature interaction.

Make it feel like a real experimental workflow.

Each stage must support:

LOCKED
READY
ACTIVE
PROCESSING
COMPLETE
WARNING
UNCERTAIN
FAILED
SKIPPED

Stages should visually communicate:

completed
current
waiting
blocked
uncertain

Clicking a completed stage should reveal its actual data.

Clicking a future stage should not pretend that its data exists.

This distinction is critical.

============================================================
10. LIVE RUN EXPERIENCE
============================================================

When the user presses:

START EXPERIMENT

do not instantly populate the entire application.

Run the actual runtime state machine.

Example:

0–2 sec
INITIALIZING

2–5 sec
SAMPLE VALIDATION

5–12 sec
ACQUISITION

12–16 sec
SIGNAL PROCESSING

16–20 sec
IMPEDANCE ANALYSIS

20–24 sec
PHENOTYPE EXTRACTION

24–28 sec
DISEASE INTELLIGENCE

28–31 sec
DIGITAL TWIN UPDATE

31–34 sec
FORECAST

34–37 sec
AUTONOMOUS EVALUATION

37–40 sec
STOP / MEASURE AGAIN

Timing may be adapted to the existing runtime architecture.

Do not create fake independent timers.

The timeline must reflect actual backend/runtime events.

============================================================
11. ACQUISITION STAGE
============================================================

Make acquisition visually impressive.

Show:

RAW
FILTERED
RMS
DELTA
QUALITY

Include:

live waveform
sample count
sampling rate
noise level
signal quality
baseline
drift
window
processing state

Provide an engineering drawer containing:

ADC
resolution
sample rate
filter
RMS window
normalization
baseline
signal quality

Do not fabricate hardware telemetry if it is not available.

If simulated:

label it clearly as SIMULATION.

============================================================
12. IMPEDANCE STAGE
============================================================

This should be the strongest scientific visualization area.

Support:

Bode magnitude
Bode phase
Nyquist
Temporal ΔZ
FFT
Equivalent circuit
Quality

The visualization should react to the actual current run.

Implement:

- zoom
- hover inspection
- crosshair where appropriate
- frequency/value readout
- legend
- units
- domain indicators
- quality overlays

Do not make every plot simultaneously enormous.

Use a focused scientific workspace.

============================================================
13. BODE PLOT
============================================================

Requirements:

- logarithmic frequency axis
- magnitude
- phase
- frequency cursor
- selected point details
- units
- quality indication

Allow the user to hover a frequency.

Display:

Frequency
|Z|
Phase
Quality
Provenance

If insufficient frequencies exist:

show:

INSUFFICIENT SPECTRUM

instead of drawing misleading curves.

============================================================
14. NYQUIST PLOT
============================================================

Show:

Z'
-Z''

or another scientifically consistent convention.

Display:

- measured points
- fitted curve only if a fit actually exists
- residual/error if available
- quality state

If no valid fit exists:

do NOT draw a fake fitted arc.

Display:

FIT UNAVAILABLE

and explain why.

============================================================
15. TEMPORAL IMPEDANCE
============================================================

Show:

Z(t)
ΔZ(t)
ΔZ/Z0

Support:

baseline marker
current marker
trend
measurement events

When MEASURE_AGAIN occurs:

the second measurement must visibly alter the trajectory.

This is essential for demonstrating closed-loop intelligence.

============================================================
16. FFT
============================================================

Make FFT scientifically contextual.

Show:

time-domain signal
frequency spectrum
dominant components
harmonic indicators

Clearly communicate:

FFT is derived from time-domain excitation/response analysis.

Do not imply FFT is another form of EIS spectrum.

============================================================
17. EQUIVALENT CIRCUIT
============================================================

Display the model only when fitting is valid.

Potential model:

Randles-style representation.

Show:

Rs
Rct
Cdl

only if actually calculated.

Also show:

fit status
RMSE
AIC/BIC where available
fit quality

If unavailable:

display:

NO VALID CIRCUIT FIT

Do not invent values.

============================================================
18. PHENOTYPE STAGE
============================================================

Make phenotype feel like an intermediate scientific representation.

Organize:

SPECTRAL
RESISTIVE
REACTIVE
TEMPORAL
QUALITY

Every important feature should have provenance.

Example:

Feature
Value
Unit
Source
Method
Status

Allow an expandable:

FEATURE PROVENANCE INSPECTOR

Example:

Feature:
Δ|Z|

Origin:
MEASURED

Transformation:
baseline-relative calculation

Status:
DERIVED

============================================================
19. DISEASE INTELLIGENCE
============================================================

This is a research intelligence panel, not a fake clinical diagnosis.

Display:

Primary hypothesis
Probability
Alternatives
Confidence
Uncertainty
OOD score
Evidence
Model ID
Model version
Validation dataset
Sample type
Protocol

Separate clearly:

MODEL OUTPUT

from:

CLINICAL INTERPRETATION

If confidence/OOD/validation gates fail:

show:

UNKNOWN

or:

MORE DATA REQUIRED

Do not force a disease prediction.

============================================================
20. EVIDENCE GRAPH
============================================================

Add a visual reasoning chain.

Example:

Measurement
↓
Impedance feature
↓
Phenotype
↓
Evidence
↓
Model
↓
Prediction

Each node should be clickable.

The purpose is traceability.

Do not make it decorative.

Clicking a node should reveal the associated provenance.

============================================================
21. CONFIDENCE DECOMPOSITION
============================================================

Do not show a single unexplained confidence number.

Break confidence into:

Measurement Quality
+
Model Confidence
+
OOD Compatibility
+
Validation Domain

Then derive the final decision state.

Example:

MEASUREMENT QUALITY
92%

MODEL CONFIDENCE
81%

OOD COMPATIBILITY
74%

VALIDATION DOMAIN
SUPPORTED

Decision:

HIGH CONFIDENCE

If any hard gate fails:

UNKNOWN / MORE DATA

Do not average values blindly.

Use the existing backend logic.

============================================================
22. DIGITAL TWIN
============================================================

The twin must become one of the flagship visual features.

Display three columns:

OBSERVED
INFERRED
PREDICTED

Each value should be clearly tagged.

Example:

OBSERVED
Z(10kHz)
124 Ω

INFERRED
Cellularity phenotype
Elevated

PREDICTED
ΔZ at +10m
-7.4%

Each item must communicate:

source
timestamp
uncertainty

Add a timeline of twin snapshots.

Allow the user to select a snapshot and inspect how the twin changed.

============================================================
23. TWIN ANIMATION
============================================================

When new measurements arrive:

do NOT replace the old state invisibly.

Show:

Previous state
→
New observation
→
Updated inference
→
Updated prediction

This visually demonstrates that the twin is synchronized with the experiment.

============================================================
24. FORECAST
============================================================

Make forecasting scientifically understandable.

Display:

Current
+5m
+10m
+20m
+30m

with prediction intervals.

Clearly distinguish:

OBSERVED

from:

PREDICTED.

Show uncertainty growth with horizon.

If insufficient history:

show:

INSUFFICIENT HISTORY

not a fabricated forecast.

============================================================
25. AUTONOMOUS DECISION CENTER
============================================================

This must feel like a control system.

Display:

CURRENT STATE
UNCERTAINTY
MEASUREMENT BUDGET
CANDIDATE ACTIONS
EXPECTED INFORMATION GAIN
SELECTED ACTION
REASON

Candidate list example:

10 kHz
100 kHz
500 kHz
1 MHz
FULL SCAN

Each candidate should show:

score
expected information gain
duration
cost
reason

The selected action should be visibly justified.

============================================================
26. CLOSED-LOOP DEMONSTRATION
============================================================

This is one of the highest-priority enhancements.

The flagship demo should visibly perform:

MEASUREMENT 1
↓
ANALYSIS
↓
AUTONOMOUS DECISION
↓
MEASURE AGAIN
↓
MEASUREMENT 2
↓
UPDATED ANALYSIS
↓
UPDATED TWIN
↓
UPDATED FORECAST
↓
NEW AUTONOMOUS DECISION
↓
STOP

The second measurement MUST change something meaningful.

For example:

- uncertainty decreases
- confidence changes
- trajectory becomes clearer
- selected frequency changes
- forecast changes
- STOP becomes preferable to MEASURE_AGAIN

Do not hardcode the UI transition.

Use actual runtime state.

============================================================
27. SIMULATION ENGINE
============================================================

Preserve all existing scenarios:

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

Improve them so they produce visibly distinct scientific behavior.

For each scenario, define coherent changes across:

signal
impedance
quality
phenotype
confidence
OOD
forecast
autonomy

Do not merely change colors or labels.

============================================================
28. SCENARIO MATRIX
============================================================

Ensure:

STABLE
→ high quality
→ stable trajectory
→ likely STOP

RISING
→ positive trend
→ forecast changes
→ potentially MEASURE_AGAIN

FALLING
→ negative trend

NOISY
→ degraded quality
→ confidence reduction

DRIFTING
→ baseline instability

TRANSITION
→ trajectory change

ANOMALY
→ anomaly score rises

RECOVERY
→ trajectory improves

OOD
→ prediction becomes UNKNOWN/OOD

TIMEOUT
→ run fails safely

============================================================
29. ERROR STATES
============================================================

Implement polished failure states.

Examples:

INVALID SAMPLE
INVALID CALIBRATION
INSUFFICIENT SPECTRUM
LOW SIGNAL QUALITY
OUT OF DISTRIBUTION
MODEL UNAVAILABLE
INSUFFICIENT HISTORY
MEASUREMENT TIMEOUT
BUDGET EXHAUSTED

Errors should be informative.

Each should explain:

what happened
why it matters
what the system can do next

============================================================
30. ENGINEERING MODE
============================================================

Engineering mode should reveal deeper telemetry.

Include where available:

device
ADC
sample rate
frequency
excitation
filter
RMS
noise
drift
packet status
sequence
calibration
measurement budget
runtime state
latency

Do not fabricate hardware measurements.

Simulation values must be marked simulation.

============================================================
31. SCIENTIFIC MODE
============================================================

Scientific mode should prioritize:

plots
phenotype
evidence
model information
uncertainty
provenance
twin
forecast

Reduce operational controls.

============================================================
32. OPERATOR MODE
============================================================

Operator mode should prioritize:

sample
protocol
run control
quality
current state
decision
result

Hide unnecessary engineering complexity.

============================================================
33. VISUAL DESIGN UPGRADE
============================================================

The visual language must communicate:

precision
laboratory instrumentation
scientific computing
high-end research system

Use the existing site's visual language as reference.

You MAY inspect existing colors, typography and spacing.

You MUST NOT modify global styles.

PHENORA-specific styling must remain isolated.

Avoid:

- giant gradients
- excessive glassmorphism
- excessive rounded cards
- generic dashboard grids
- giant marketing typography
- decorative medical imagery
- unnecessary 3D effects
- meaningless animations

Prefer:

- dark instrument background
- fine separators
- precise typography
- compact data density
- subtle status indicators
- technical labels
- scientific charting
- controlled accent color
- clear hierarchy

============================================================
34. INFORMATION DENSITY
============================================================

The application should feel information-rich without becoming chaotic.

Use:

primary signal
secondary metrics
tertiary metadata

Do not display every possible value at once.

Use:

expanders
drawers
tooltips
inspection panels

for deeper information.

============================================================
35. MICRO-INTERACTIONS
============================================================

Add restrained interactions:

- stage activation
- measurement completion
- new observation
- twin update
- confidence transition
- autonomous selection
- forecast update
- warning transition

Animations should communicate state changes.

Never animate numbers purely for visual excitement.

============================================================
36. LIVE TELEMETRY
============================================================

The interface should visibly react to runtime events.

Example:

ACQUIRE event
→ waveform starts

PROCESS event
→ processing indicator

SPECTRUM event
→ Bode/Nyquist appear

PHENOTYPE event
→ phenotype cards unlock

DISEASE event
→ intelligence becomes available

TWIN event
→ twin updates

FORECAST event
→ forecast unlocks

AUTONOMY event
→ recommendation appears

Do not unlock everything at page load.

============================================================
37. DATA HONESTY
============================================================

Every simulation run must have a persistent:

SIMULATION

indicator.

If a dataset is reference-only:

show:

REFERENCE DATA

If a model is unavailable:

show:

MODEL UNAVAILABLE

If data is insufficient:

show:

INSUFFICIENT DATA

Never fill missing information with invented values.

============================================================
38. DATASET TRACEABILITY
============================================================

Preserve dataset classification:

REAL IMPEDANCE
REAL CLINICAL
AUXILIARY BIOLOGICAL
SIMULATED PAIRED

Never silently combine datasets.

The iFAST data must NOT be represented as conventional bulk EIS.

Where applicable, show dataset modality.

============================================================
39. ACCESSIBILITY
============================================================

Implement:

keyboard navigation
visible focus
ARIA labels
semantic buttons
sufficient contrast
non-color status indicators

Charts should have text summaries.

Do not communicate critical state using color alone.

============================================================
40. RESPONSIVE BEHAVIOR
============================================================

The primary workstation experience may be wide-screen.

But the application must degrade gracefully.

Desktop:
full instrument layout

Tablet:
compressed timeline + panels

Small screen:
vertical stage navigation

Do not allow horizontal overflow to break the page.

============================================================
41. PERFORMANCE
============================================================

Avoid unnecessary re-renders.

Use memoization where appropriate.

Do not recompute expensive scientific calculations every render.

Separate:

simulation state
runtime state
visualization state

Charts should update only when their relevant data changes.

============================================================
42. TESTING
============================================================

Add or expand tests for:

canonical contracts
provenance
spectrum calculations
Bode
Nyquist
FFT
phenotype
OOD
disease confidence gates
twin rejection
forecast
autonomy
budget
runtime transitions
MEASURE_AGAIN
STOP
error states

Also test:

second measurement changes state.

============================================================
43. CRITICAL INTEGRATION TEST
============================================================

The following scenario MUST pass:

START
→ SAMPLE_READY
→ ACQUIRE
→ PROCESS
→ IMPEDANCE
→ PHENOTYPE
→ DISEASE
→ TWIN
→ FORECAST
→ AUTONOMY
→ MEASURE_AGAIN
→ ACQUIRE AGAIN
→ PROCESS AGAIN
→ UPDATED IMPEDANCE
→ UPDATED PHENOTYPE
→ UPDATED DISEASE
→ UPDATED TWIN
→ UPDATED FORECAST
→ AUTONOMY
→ STOP
→ COMPLETE

Verify that each downstream state depends on the new measurement.

============================================================
44. REQUIRED DEMO SCENARIOS
============================================================

Verify at minimum:

1. STABLE
2. NOISY
3. TRANSITION
4. OOD
5. TIMEOUT

Also verify:

RISING
FALLING
DRIFTING
ANOMALY
RECOVERY

============================================================
45. VISUAL QA
============================================================

Run the application.

Open:

http://localhost:3000/phenora-ultra

Inspect:

- initial state
- run start
- active acquisition
- impedance visualization
- phenotype
- disease intelligence
- twin
- forecast
- autonomy
- measure again
- final result
- OOD
- noisy
- timeout

Look for:

- clipping
- overflow
- unreadable text
- excessive empty space
- inconsistent spacing
- broken charts
- broken transitions
- stale values
- incorrect stage state
- fake-looking data
- confusing labels

Fix issues within PHENORA-specific files only.

============================================================
46. FINAL RESULT SCREEN
============================================================

The final result should summarize the complete reasoning chain.

Display:

Sample
Protocol
Run
Measurement count
Quality
Phenotype
Disease intelligence
Confidence
Uncertainty
OOD
Twin status
Forecast status
Autonomous action
Final decision
Provenance

Then provide:

LIMITATIONS

including:

simulation status
model limitations
dataset limitations
validation limitations
clinical status

Never claim clinical diagnosis.

============================================================
47. RESULT TRACE
============================================================

Create a concise trace:

MEASURED
↓
DERIVED
↓
FITTED
↓
INFERRED
↓
PREDICTED
↓
AUTONOMOUS ACTION

The user should be able to inspect where every major conclusion originated.

============================================================
48. RUN REPLAY
============================================================

If feasible within the current architecture, implement a lightweight replay mechanism.

The user should be able to inspect:

measurement 1
measurement 2
decision
updated state

without rerunning the experiment.

Do not add unnecessary persistence infrastructure.

An in-memory run history is acceptable for the demonstration.

============================================================
49. NO DEPENDENCY EXPLOSION
============================================================

Prefer existing dependencies.

Do not add a new dependency unless absolutely necessary.

Do not modify package.json/package-lock merely for visual convenience.

If a required capability cannot be implemented without changing an existing dependency/configuration file:

DO NOT MODIFY IT.

Report the blocker.

============================================================
50. NO ARCHITECTURAL DRIFT
============================================================

Do not create:

another runtime
another disease engine
another twin system
another forecast engine
another state model

Extend existing PHENORA architecture.

There must be ONE canonical source of truth for each concept.

============================================================
51. TIME / EXECUTION PLAN
============================================================

Execute autonomously in phases.

Do not stop after planning.

Do not ask for confirmation between normal phases.

Only stop if blocked by:
- destructive operation
- missing required dependency
- impossible route architecture
- corrupted project
- explicit file-safety conflict

Target execution:

PHASE A — AUDIT
10–15 minutes

PHASE B — SCIENTIFIC CORRECTNESS
15–25 minutes

PHASE C — RUNTIME / CLOSED LOOP
20–30 minutes

PHASE D — DATA / SIMULATION
15–25 minutes

PHASE E — SCIENTIFIC VISUALIZATION
20–35 minutes

PHASE F — DIGITAL TWIN / FORECAST / AUTONOMY UX
15–25 minutes

PHASE G — UI POLISH
20–30 minutes

PHASE H — ERROR / EDGE STATES
10–20 minutes

PHASE I — TESTING
15–25 minutes

PHASE J — FINAL QA
15–20 minutes

These are TARGETS, not excuses to stop early.

Prioritize in this order:

1. Correctness
2. Runtime synchronization
3. Scientific honesty
4. Closed-loop demonstration
5. Visualization
6. UX
7. Polish

Do NOT spend 30 minutes polishing buttons while the runtime is fake.

============================================================
52. EXECUTION DISCIPLINE
============================================================

After each phase output internally:

PHASE
STATUS
FILES CREATED/MODIFIED
TESTS
KNOWN ISSUES
NEXT PHASE

Then immediately continue.

Do not wait for user confirmation.

============================================================
53. BUILD VERIFICATION
============================================================

At the end run the project's existing build command.

Use the repository's actual scripts.

Do not change scripts.

Fix PHENORA-specific errors.

Do not modify unrelated files to make the build pass.

============================================================
54. GIT SAFETY VERIFICATION
============================================================

Final check:

git status
git diff --name-only

There must be no unrelated modifications.

If unrelated changes exist:

revert ONLY those accidental changes.

Never overwrite legitimate existing user work.

============================================================
55. FINAL ACCEPTANCE CRITERIA
============================================================

PHENORA ULTRA is considered enhanced only if:

[ ] /phenora-ultra loads
[ ] Existing routes still work
[ ] Existing project files remain untouched
[ ] PHENORA runtime works
[ ] Simulation works
[ ] Acquisition visibly progresses
[ ] Impedance visualizations use actual runtime data
[ ] Phenotype is derived from the pipeline
[ ] Disease intelligence respects confidence/OOD gates
[ ] Twin contains observed/inferred/predicted states
[ ] Forecast contains uncertainty
[ ] Autonomous planner produces a reasoned decision
[ ] MEASURE_AGAIN works
[ ] Second measurement updates downstream state
[ ] STOP works
[ ] Final result is traceable
[ ] Provenance is inspectable
[ ] Simulation is clearly labelled
[ ] OOD scenario works
[ ] NOISY scenario works
[ ] TIMEOUT scenario works
[ ] No fabricated validation metrics
[ ] No fabricated clinical claims
[ ] Charts are usable
[ ] Keyboard navigation works
[ ] Responsive behavior is acceptable
[ ] Build passes
[ ] Tests pass
[ ] No unrelated files modified

============================================================
56. FINAL OUTPUT REPORT
============================================================

When everything is complete, produce a concise report:

PHENORA ULTRA ENHANCEMENT COMPLETE

1. Executive Summary

2. Major Improvements

3. Runtime Improvements

4. Scientific Improvements

5. Visualization Improvements

6. Closed-Loop Demonstration

7. Simulation Scenarios Verified

8. Tests Passed

9. Build Result

10. Files Created/Modified

11. Files Confirmed Untouched

12. Known Limitations

13. Demo Instructions

Include:

http://localhost:3000/phenora-ultra

Also provide the recommended flagship demo sequence:

URINE
→ START
→ ACQUIRE
→ IMPEDANCE
→ PHENOTYPE
→ DISEASE
→ TWIN
→ FORECAST
→ AUTONOMY
→ MEASURE AGAIN
→ UPDATED STATE
→ AUTONOMY
→ STOP
→ RESULT

============================================================
57. FINAL COMMAND
============================================================

BEGIN NOW.

FIRST:

1. Read:
   web/dataset/PHENORA ULTRA.md

2. Read:
   web/dataset/PHENORA FLASH FLAGSHIP MODEL (2).md

3. Inspect the existing PHENORA ULTRA implementation.

4. Inspect git status.

5. Build the enhancement map.

6. Begin Phase A.

DO NOT merely provide a plan.

EXECUTE THE IMPLEMENTATION AUTONOMOUSLY.

DO NOT MODIFY UNRELATED FILES.

DO NOT MODIFY THE TWO SPECIFICATION MD FILES.

DO NOT FABRICATE SCIENTIFIC RESULTS.

DO NOT STOP AFTER THE AUDIT.

CONTINUE UNTIL THE ENHANCEMENT PASS IS COMPLETE OR A REAL BLOCKER IS ENCOUNTERED.
What I would prioritize most
If Antigravity has limited execution time, do not let it spend the time evenly across everything. The highest-value upgrades are:

1. Closed-loop measurement
This is the biggest differentiator.

The demo should visibly show:

Measure → understand → decide → measure again → understand again → decide again.

Not merely a dashboard showing the final answer.

2. Real dependency between panels
The most important visual behavior is:

When the measurement changes, everything downstream changes.

That means the Bode/Nyquist → phenotype → disease evidence → twin → forecast → autonomy chain should be visibly connected.

3. Digital Twin
Make the OBSERVED | INFERRED | PREDICTED model visually excellent. This can become the visual centerpiece of the project.

4. Evidence/provenance
The disease result should be inspectable rather than just:

UTI — 86%

Instead:

Measurement → feature → phenotype → model → evidence → prediction

with uncertainty and OOD visible.

5. Scientific plots
The impedance workspace should look like an actual research instrument, especially Bode + Nyquist + temporal response.

6. Failure/uncertainty states
A strong research demo is not one where everything says SUCCESS.

OOD, NOISY, INSUFFICIENT DATA, TIMEOUT, MODEL UNAVAILABLE, and MEASURE AGAIN make the system look much more credible.

One important point: the current implementation report says “all 16 phases completed,” but that should not be interpreted as “scientifically validated.” The two specification documents explicitly require the distinction between measured, derived, fitted, inferred, and predicted information and require uncertainty/OOD/provenance around disease intelligence.

So the enhancement target is not adding more fake intelligence. It is making the existing architecture's reasoning, uncertainty, provenance, and autonomous closed loop much more visible and convincing.