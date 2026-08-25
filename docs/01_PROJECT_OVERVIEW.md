# PHENORA Project Overview

PHENORA is an R&D and engineering prototype platform investigating **adaptive impedance-based measurement for rapid antimicrobial susceptibility testing (AST)**.

## Core Hypothesis

By performing continuous bulk differential impedance measurements of control and antibiotic-treated bacterial suspensions, PHENORA aims to detect metabolic, growth, and physiological changes much earlier than traditional optical methods. An edge-based adaptive decision algorithm monitors signal stability and slope to stop measurement dynamically as soon as susceptibility or resistance is statistically distinguishable.

> [!IMPORTANT]
> **Scientific Status Statement:**
> PHENORA is an experimental research prototype and engineering proof-of-concept. The current platform (V1) is for computational, hardware, and electrical verification. It is NOT clinically validated, nor is it a medical diagnostic device.

## Key Features

- **Differential Acquisition:** Continuous dual-channel comparison (Control vs. Test) to filter out ambient temperature drift and common-mode noise.
- **Micro-Electrode System:** Stylized micro-wells designed to read impedance changes near the electrode interface and bulk medium.
- **Edge Intelligence:** Real-time data filtration and adaptive stopping rules running on local FPGA hardware to optimize detection speed.

