# PHENORA — WEB DEVELOPMENT TASK LIST
## Post-Basic-Page Implementation Specification

**Role:** Web / 3D / Simulation Developer  
**Stage:** Basic Next.js pages already created  
**Audience:** Hackathon judges + investors/startup foundation  
**Primary goal:** Turn the basic PHENORA site into a professional interactive product, architecture and computational-simulation experience.

---

## 1. Mission

Build the interactive web layer that makes this understandable without a verbal explanation:

```text
What is PHENORA?
      ↓
What does it measure?
      ↓
How does V1 work?
      ↓
Why is the FPGA there?
      ↓
What does adaptive measurement mean?
      ↓
What has actually been validated?
      ↓
What is future work?
```

### Required deliverables

- Professional PHENORA website
- Interactive V1 Three.js product/system visualization
- Complete signal-flow visualization
- Computational impedance simulation
- Control/test trajectory visualization
- FPGA adaptive STOP / MEASURE AGAIN visualization
- V1 / V2 / V3 roadmap
- Vercel-ready production build

---

# 2. FINALIZED V1 — SOURCE OF TRUTH

Do not change the V1 architecture:

```text
CONTROL SAMPLE       TEST SAMPLE
      │                    │
      └────── ELECTRODES ──┘
                 ↓
              AD5933
                 ↓ I²C
             HELTEC V3
             ESP32-S3
                 ↓
       impedance-derived feature
                 ↓ UART
       VSDSquadron FPGA Mini
          Lattice iCE40UP5K
                 ↓
              FILTER
                 ↓
          DIFFERENTIAL ΔF
                 ↓
               SLOPE
                 ↓
             STABILITY
                 ↓
       ┌─────────┴─────────┐
       ↓                   ↓
   MEASURE AGAIN          STOP
```

### V1 components

- AD5933 impedance converter/network analyzer
- Heltec WiFi Kit 32 V3 / ESP32-S3
- VSDSquadron FPGA Mini / Lattice iCE40UP5K
- Control/test sample concept
- Electrode interface
- UART between Heltec and FPGA
- Optional Wi-Fi/dashboard

### Scientific status

V1 is an **engineering prototype / research platform**.

Do NOT describe it as clinically validated AST, clinically approved, a validated diagnostic device, or capable of validated S/I/R results.

Use: **prototype, research platform, computational model, engineering validation, proposed architecture, biological validation planned.**

---

# 3. DO NOT REOPEN V1

Do not introduce these as active V1 architecture:

- optical sensing as primary sensing
- pH as primary sensing
- DEP
- microfluidic concentration
- ML/neural networks
- cloud-dependent measurement
- complex floating-point FPGA mathematics
- clinical S/I/R classification
- uncontrolled bacterial experiments

They may only appear as future/rejected directions when clearly labelled.

---

# 4. TECH STACK

### Frontend

- Next.js
- TypeScript
- React
- React Three Fiber
- Three.js
- @react-three/drei
- Tailwind CSS
- Framer Motion where useful
- Lucide React where useful

### Scientific layer

- Python
- NumPy
- SciPy
- Matplotlib only for offline analysis if required

**Python is for numerical modelling, not the website UI. Do not build Tkinter.**

---

# 5. PAGE STRUCTURE

Basic pages already exist. Now implement them properly:

```text
/
/technology
/platform
/simulation
/research
/team
```

---

# 6. HOME PAGE — `/`

## Goal

A judge should understand PHENORA in under 60 seconds.

### Required sections

1. Hero
2. Problem
3. PHENORA concept
4. Interactive V1 preview
5. How it works
6. Adaptive intelligence
7. Validation status
8. V1/V2/V3 roadmap
9. Research/evidence preview
10. Team
11. Footer

### Hero

Use the finalized identity:

- Green: `#17B169`
- Navy: `#0A192F`
- Slate: `#F3F4F6`
- White: `#FFFFFF`

Hero direction:

> **ADAPTIVE IMPEDANCE. BIOLOGICAL PRECISION. EDGE INTELLIGENCE.**

Preferred supporting statement:

> PHENORA explores rapid antimicrobial susceptibility testing through bulk differential impedance sensing and adaptive edge intelligence.

Status: **V1 — Engineering Prototype**

### Problem

Explain:

- conventional AST can require lengthy workflows
- rapid AST requires earlier detection of meaningful changes
- electrical sensing offers a possible route
- the challenge is distinguishing meaningful changes from noise/drift

Do not make unsupported performance claims.

### Concept

```text
CONTROL + TEST
       ↓
IMPEDANCE
       ↓
DIFFERENTIAL SIGNAL
       ↓
EDGE ANALYSIS
       ↓
ADAPTIVE DECISION
```

### Validation status

Use explicit labels:

```text
ENGINEERING VALIDATION     CURRENT
BIOLOGICAL AST VALIDATION  FUTURE / LABORATORY
CLINICAL VALIDATION        FUTURE
```

---

# 7. TECHNOLOGY PAGE — `/technology`

Explain the full technical chain.

### Impedance

```text
AC excitation
     ↓
sample + electrode interface
     ↓
electrical response
     ↓
Z(f)
```

Show:

`Z(f) = R(f) + jX(f)`

Do not imply impedance directly equals bacterial concentration.

### AD5933

Visualize:

```text
AC EXCITATION
      ↓
SAMPLE
      ↓
ADC
      ↓
DFT
      ↓
REAL + IMAGINARY
```

### Heltec

```text
AD5933
  ↓ I²C
HELTEC ESP32-S3
  ↓
feature processing
  ↓ UART
FPGA
```

### FPGA

```text
FEATURE STREAM
      ↓
FILTER
      ↓
ΔFEATURE
      ↓
SLOPE
      ↓
STABILITY
      ↓
STOP / MEASURE AGAIN
```

### Complete interactive signal flow

Hover/click a stage to:

- highlight it
- highlight the corresponding 3D object
- show a short explanation

---

# 8. PLATFORM PAGE — `/platform`

Create three product cards.

## V1 — CURRENT

**Bulk Differential Impedance + Adaptive Edge Computation**

Show the real V1 architecture.

## V2 — UPCOMING

**Next-generation sensing architecture**

Status: `CONCEPT / R&D`

Do not invent specifications.

## V3 — UPCOMING

**Future integrated platform**

Status: `CONCEPT / R&D`

Do not invent clinical capabilities.

---

# 9. V1 THREE.JS PRODUCT

This is a major deliverable.

Use React Three Fiber.

### Required stylized objects

- sample container
- control region
- test region
- electrode interface
- AD5933 module
- Heltec V3 board
- VSDSquadron FPGA Mini
- signal connections

Exact commercial CAD replicas are not required. Use recognizable engineering representations.

### Required interactions

- orbit/rotate
- zoom
- pan where appropriate
- hover
- click
- component labels
- information panel
- signal-path highlight
- reset camera

Add `RESET VIEW`.

---

# 10. EXPLODED VIEW

Add an optional `EXPLODE VIEW`.

Separate components while preserving the logical path:

```text
sample
 ↓
electrodes
 ↓
AD5933
 ↓
Heltec
 ↓
FPGA
```

Animate the transition smoothly.

---

# 11. SIGNAL-FLOW ANIMATION

Use particles/pulses to represent system data flow:

```text
electrode → AD5933 → Heltec → FPGA → decision
```

Label it **System data-flow visualization**. It is not a real-time electric-field solution.

---

# 12. SIMULATION PAGE — `/simulation`

Title:

> **PHENORA Computational Impedance Model**

Subtitle:

> Explore how modeled electrical, biological, and environmental parameters influence impedance trajectories.

Mandatory disclaimer:

> Computational model for engineering and hypothesis development. Not a clinical diagnostic model and not experimental evidence of antibiotic susceptibility.

---

# 13. COMPUTATIONAL MODEL

The model should follow:

```text
CELL STATE
    ↓
MEDIUM PROPERTIES
    ↓
CONDUCTIVITY
    ↓
ELECTRODE INTERFACE
    ↓
EQUIVALENT CIRCUIT
    ↓
IMPEDANCE Z(f,t)
    ↓
FEATURE F(t)
    ↓
CONTROL vs TEST
    ↓
ΔF(t)
    ↓
ADAPTIVE DECISION
```

---

# 14. SIMULATION LEVELS

## Level 1 — Equivalent circuit

Use a simplified model containing:

- Rs
- Rct
- Cdl
- frequency

Calculate `Z(f)` and show:

- magnitude
- phase
- frequency response

## Level 2 — Conductivity

Allow conductivity to vary and show its effect on simulated impedance.

## Level 3 — Cell concentration

Represent cells as inclusions in a conductive medium. Vary cell concentration and update the model and 3D scene.

Do not claim this is a complete biological electrical model.

## Level 4 — Time trajectory

A possible population model is:

`N(t) = K / (1 + A e^(-rt))`

Then map:

`N(t) → F(t)`

The mapping must be labelled as a model assumption.

## Level 5 — Control vs test

Generate:

```text
F_control(t)
F_test(t)
ΔF(t) = F_test(t) - F_control(t)
```

## Level 6 — Perturbation

Add a phenomenological perturbation representing altered biological trajectory.

Do NOT call it a validated antibiotic pharmacology model.

## Level 7 — Temperature

Add temperature as a confounding parameter and demonstrate modeled electrical drift.

## Level 8 — Electrode interface

Include simplified:

- charge-transfer resistance
- double-layer capacitance
- solution resistance

Show their effect on magnitude/phase/frequency.

---

# 15. 3D SIMULATION SCENE

Represent:

```text
medium volume
+
cells
+
electrodes
+
simplified field/current visualization
```

The 3D field must correspond to the numerical model. Do not fake FEM.

If no FEM solver is used, label it:

> Simplified computational visualization

---

# 16. SIMULATION UI

Use approximately:

```text
┌───────────────────────────────────────────┐
│ PHENORA COMPUTATIONAL MODEL               │
├───────────────────┬───────────────────────┤
│                   │ PARAMETERS            │
│   3D SAMPLE       │ Conductivity          │
│                   │ Cell concentration    │
│    ○ ○ ○          │ Temperature           │
│  ○      ○         │ Rs                    │
│       ○           │ Rct                   │
│                   │ Cdl                   │
│                   │ Growth rate           │
│                   │ Perturbation          │
│                   │ [RUN / RESET]         │
├───────────────────┴───────────────────────┤
│ |Z| vs Frequency                          │
├───────────────────────────────────────────┤
│ Control vs Test                           │
├───────────────────────────────────────────┤
│ ΔF(t)                                      │
├───────────────────────────────────────────┤
│ FPGA DECISION: MEASURE / STOP             │
└───────────────────────────────────────────┘
```

Do not display every chart simultaneously if it harms usability; use tabs/progressive disclosure.

---

# 17. ADAPTIVE ALGORITHM VISUALIZATION

Use the V1 logic:

```text
FEATURE
   ↓
4-SAMPLE MOVING AVERAGE
   ↓
ΔFEATURE
   ↓
SLOPE
   ↓
STABILITY CHECK
   ↓
STABLE ENOUGH?
  ↙          ↘
NO            YES
↓              ↓
MEASURE AGAIN STOP
```

The visualization must show the state changing over simulated time.

---

# 18. PYTHON SCIENTIFIC ENGINE

Create:

```text
simulation/python/
├── impedance_model.py
├── conductivity_model.py
├── cell_model.py
├── electrode_model.py
├── temperature_model.py
├── trajectory_model.py
├── adaptive_model.py
├── generate_dataset.py
└── README.md
```

Each model should be independently testable.

### Generated data

At minimum:

```text
time
frequency
control_real
control_imag
test_real
test_imag
control_magnitude
test_magnitude
delta_feature
temperature
cell_state
decision
```

Do not put random numbers into the frontend.

---

# 19. MODEL METADATA

Every important parameter must be classified:

```text
LITERATURE_DERIVED
EXPERIMENTAL
ASSUMED
SYNTHETIC
```

Example:

```json
{
  "parameter": "growth_rate",
  "value": 0.2,
  "source_type": "SYNTHETIC",
  "description": "Model parameter for trajectory demonstration"
}
```

Never present a synthetic parameter as measured biological data.

---

# 20. FRONTEND / PYTHON BOUNDARY

For V1, prefer:

```text
Python
 ↓
generate JSON/CSV
 ↓
Next.js
 ↓
Three.js + charts
```

Do not build a complicated live Python API unless it becomes necessary.

---

# 21. REQUIRED CHARTS

1. Impedance magnitude vs frequency
2. Phase vs frequency
3. Control vs test feature vs time
4. ΔFeature vs time
5. Slope vs time
6. Decision state vs time

Use progressive disclosure/tabs so the page remains readable.

---

# 22. RESEARCH PAGE

Each research item should contain:

- title
- year
- measurement principle
- why relevant
- what PHENORA learns
- what PHENORA does differently
- evidence status
- source

Do not make unsupported `first`, `only`, or `novel` claims.

---

# 23. VALIDATION PAGE CONTENT

Show the actual V1 validation ladder:

```text
1. Known resistor
        ↓
2. Controlled electrolyte
        ↓
3. Complex biological matrix / curd
        ↓
4. Temperature/confounder characterization
        ↓
5. Synthetic adaptive algorithm
        ↓
6. Future supervised biological AST
```

Important:

> Curd is a complex biological-matrix demonstration, NOT antibiotic susceptibility validation.

Do not show S/I/R results.

---

# 24. STATUS BADGES

Create reusable badges:

```text
CURRENT
PROTOTYPE
LITERATURE-SUPPORTED
MODEL
HYPOTHESIS
UPCOMING
FUTURE
NOT CLINICALLY VALIDATED
```

Use consistently across the website.

---

# 25. V2 / V3 RULE

V2 and V3 are visualized as roadmap concepts only.

Use:

```text
UPCOMING
CONCEPT
```

Do not invent:

- performance numbers
- detection limits
- sensitivity/specificity
- clinical time
- clinical capabilities
- unapproved hardware specifications

---

# 26. PERFORMANCE

Requirements:

- responsive desktop layout
- mobile fallback
- lazy-load heavy 3D scenes
- compress textures
- limit polygon count
- avoid excessive post-processing
- static architecture fallback if WebGL fails

Target smooth interaction on a normal student laptop.

---

# 27. ACCESSIBILITY

Implement:

- readable contrast
- text labels for 3D components
- non-3D explanation of every important concept
- keyboard-accessible controls where practical
- reduced-motion consideration
- mobile fallback

A judge must understand PHENORA even if WebGL fails.

---

# 28. ERROR STATES

Simulation failure:

```text
SIMULATION ERROR
Unable to calculate model.
Reset parameters.
```

WebGL failure:

```text
3D visualization unavailable.
Use the architecture diagram below.
```

Never silently fail.

---

# 29. GIT WORKFLOW

Do not commit directly to `main`.

Use feature branches such as:

```text
feature/web-foundation
feature/v1-threejs
feature/simulation-ui
feature/python-model
feature/adaptive-visualization
feature/polish
```

Commit examples:

```text
feat: add PHENORA V1 3D viewer
feat: add impedance simulation model
feat: add adaptive decision visualization
feat: add V1 V2 V3 platform page
fix: improve simulation parameter handling
```

---

# 30. IMPLEMENTATION ORDER

## Phase 1 — Basic pages already complete

Verify:

- [ ] Next.js works
- [ ] routes work
- [ ] branding works
- [ ] navbar works
- [ ] footer works

## Phase 2 — V1 architecture

- [ ] architecture diagram
- [ ] component cards
- [ ] signal flow
- [ ] status badges

## Phase 3 — Three.js

- [ ] sample container
- [ ] control/test regions
- [ ] electrodes
- [ ] AD5933
- [ ] Heltec
- [ ] FPGA
- [ ] connections
- [ ] labels
- [ ] camera controls

## Phase 4 — Interactive product

- [ ] hover
- [ ] click
- [ ] information panel
- [ ] signal highlight
- [ ] reset camera
- [ ] exploded view

## Phase 5 — Simulation engine

- [ ] equivalent circuit
- [ ] frequency response
- [ ] conductivity
- [ ] cell concentration
- [ ] time trajectory
- [ ] control/test
- [ ] differential signal
- [ ] temperature perturbation
- [ ] electrode-interface model

## Phase 6 — Simulation UI

- [ ] parameter controls
- [ ] run/reset
- [ ] 3D sample
- [ ] impedance chart
- [ ] control/test chart
- [ ] differential chart
- [ ] adaptive decision panel

## Phase 7 — Adaptive algorithm

- [ ] moving average
- [ ] differential
- [ ] slope
- [ ] stability
- [ ] consecutive stable windows
- [ ] STOP
- [ ] MEASURE AGAIN
- [ ] timeout

## Phase 8 — Integration

```text
Python model
      ↓
simulation dataset
      ↓
Next.js
      ↓
Three.js
      ↓
charts
      ↓
adaptive decision
```

## Phase 9 — V2/V3

- [ ] V2 card
- [ ] V3 card
- [ ] UPCOMING labels
- [ ] roadmap visualization

## Phase 10 — Polish

- [ ] loading states
- [ ] WebGL fallback
- [ ] mobile
- [ ] accessibility
- [ ] performance
- [ ] typography
- [ ] spacing
- [ ] animations
- [ ] SEO metadata
- [ ] favicon
- [ ] social preview

---

# 31. FINAL USER FLOW

The finished experience should be:

```text
HOME
 │
 ├── Why PHENORA
 │
 ├── V1 Product
 │      ↓
 │   Interactive 3D
 │      ↓
 │   Signal Flow
 │
 ├── TECHNOLOGY
 │      ↓
 │   AD5933
 │      ↓
 │   HELTEC
 │      ↓
 │   FPGA
 │      ↓
 │   Adaptive Logic
 │
 ├── SIMULATION
 │      ↓
 │   Parameters
 │      ↓
 │   Computational Model
 │      ↓
 │   Impedance
 │      ↓
 │   Control/Test
 │      ↓
 │   ΔF
 │      ↓
 │   STOP / AGAIN
 │
 ├── RESEARCH
 │
 ├── PLATFORM
 │      ↓
 │   V1 / V2 / V3
 │
 └── TEAM
```

---

# 32. DEFINITION OF DONE

## Website

- [ ] professional PHENORA branding
- [ ] responsive
- [ ] Vercel-ready
- [ ] no broken routes
- [ ] no production console errors

## Product visualization

- [ ] complete V1 system shown
- [ ] control/test visible
- [ ] electrodes visible
- [ ] AD5933 visible
- [ ] Heltec visible
- [ ] FPGA visible
- [ ] data path understandable
- [ ] interactive 3D works

## Simulation

- [ ] computational impedance model works
- [ ] frequency response works
- [ ] time trajectory works
- [ ] control/test works
- [ ] ΔF works
- [ ] slope works
- [ ] stability works
- [ ] STOP/MEASURE AGAIN works
- [ ] assumptions visible

## Scientific integrity

- [ ] no fabricated experimental results
- [ ] no fake clinical validation
- [ ] no fake S/I/R
- [ ] no claim that curd proves AST
- [ ] simulation clearly labelled computational
- [ ] assumptions identified
- [ ] future biological validation separated

## Startup presentation

A judge should understand:

> **PHENORA measures → compares → processes → decides.**

within one minute.

---

# 33. FINAL PRIORITY RULE

### MUST HAVE

1. V1 3D system
2. signal-flow visualization
3. simulation UI
4. impedance model
5. control/test trajectory
6. adaptive STOP / MEASURE AGAIN

### SHOULD HAVE

7. exploded view
8. component inspection
9. V2/V3 roadmap
10. research-page polish

### NICE TO HAVE

11. advanced field visualization
12. sophisticated animations
13. advanced backend
14. cloud integration

**Do not sacrifice scientific correctness for visual effects.**

The strongest interactive demonstration is:

```text
PARAMETER CHANGE
       ↓
MODEL RESPONSE
       ↓
IMPEDANCE CHANGE
       ↓
CONTROL/TEST DIVERGENCE
       ↓
FPGA ANALYSIS
       ↓
STOP / MEASURE AGAIN
```

That is the core interactive story of PHENORA V1.
