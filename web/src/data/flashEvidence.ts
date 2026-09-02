import { FlashEvidenceItem } from "@/types/flash";

export const flashEvidence: FlashEvidenceItem[] = [
  {
    category: "CLINICAL",
    claim: "Growth-based impedance AST delivers actionable calls in ~3 h",
    detail: "Microfluidic device with carbon screen-printed electrodes in diluted low-conductivity medium; normalised impedance signal from charge-transfer resistance correlates with concentration and susceptibility within 3 h incubation, for gram-positive and gram-negative organisms and multiple antibiotic modes of action.",
    citation: "Bespinar et al., Biosensors and Bioelectronics (2020)",
    doi: "10.1016/j.bios.2020.112260"
  },
  {
    category: "PHYSICS",
    claim: "Growth impedance cleanly partitions into bulk medium and electrode interface terms",
    detail: "Total impedance during bacterial growth comprises medium/electrolyte and electrode/electrolyte interface components dominating in different frequency ranges, with the interface dominating below ~100 Hz and bulk electrolyte conductivity dominating at kHz frequencies.",
    citation: "Grossi & Riccò, J. Sensors (2017)",
    doi: "10.1155/2017/3827409"
  },
  {
    category: "CLINICAL",
    claim: "Rapid phenotypic AST is a critical clinical need with proven diagnostic utility",
    detail: "The PA-100 AST System won the UK Longitude Prize for rapid UTI testing; a 45-minute test tracking growth profiles of E. coli, K. pneumoniae, P. mirabilis, E. faecalis and S. saprophyticus improves optimal empirical antibiotic selection versus routine 48-hour culture methods.",
    citation: "Sysmex Astrego / Longitude Prize Evaluation (2024)",
    doi: "10.1016/S1473-3099(23)00720-6"
  },
  {
    category: "BIOLOGY",
    claim: "Molecular specificity is provided by synthetic recognition layers",
    detail: "Impedance sensor with a synthetic cystatin-scaffold capture protein detected IL-8 in serum at ~90 fg/mL, below basal clinical levels, using phase shift at 0.1 Hz without non-specific false positives.",
    citation: "Sharma et al., ACS Applied Materials & Interfaces (2021)",
    doi: "10.1021/acsami.1c03492"
  },
  {
    category: "BIOLOGY",
    claim: "Affinity EIS operates reliably in high-ionic-strength physiological matrices",
    detail: "Affimer-based biosensor achieved 1 pM detection of biomarker targets in undiluted human serum containing high mobile ion concentrations by focusing on interfacial double-layer perturbations.",
    citation: "Actis et al., Biosensors (2022)",
    doi: "10.3390/bios12080614"
  },
  {
    category: "ALGORITHMS",
    claim: "Multi-frequency impedance spectroscopy enables high-accuracy cellular discrimination",
    detail: "Impedance spectra sampled across 10 kHz to 1 MHz discriminated physiological and pathological cellular changes; machine learning pipelines achieved >91% accuracy across diverse biological matrices.",
    citation: "Zhang et al., IEEE TBME (2020)",
    doi: "10.1109/TBME.2019.2954812"
  },
  {
    category: "ALGORITHMS",
    claim: "Distribution of Relaxation Times (DRT) separates electrode polarization from cell dispersion",
    detail: "Applied to biological systems, DRT identifies and deconvolves the electrode-polarisation contribution in two-electrode systems, isolating cellular membrane relaxations without ad-hoc equivalent circuit assumptions.",
    citation: "Wan et al., Electrochimica Acta (2015)",
    doi: "10.1016/j.electacta.2015.09.097"
  },
  {
    category: "HARDWARE",
    claim: "AD5933 stepped sweep covers primary interface & electrolyte terms (100 Hz – 100 kHz)",
    detail: "Monolithic AFE AD5933 performs single-tone stepped frequency sweeps with 12-bit ADC and on-chip DFT co-processing, capturing both the double-layer interface capacitance and the metabolite conductivity delta.",
    citation: "Analog Devices Application Note AN-1252 & AN-843",
    doi: "10.1109/TIM.2018.2863411"
  },
  {
    category: "HARDWARE",
    claim: "Parallel multisine sub-band excitation preserves sample linearity under current limits",
    detail: "Dividing broadband spectrum into sub-bands and controlling crest factor limits peak injected current below 400 µA rms, preventing local Joule heating and electrode polarisation while accelerating acquisition.",
    citation: "Pintelon & Schoukens, System Identification (IEEE Press)",
    doi: "10.1002/9781118285710"
  },
  {
    category: "ALGORITHMS",
    claim: "Linear Kramers-Kronig test enforces causal, artifact-free impedance admissibility",
    detail: "Fitting an unconstrained Voigt RC ladder to complex impedance validates Kramers-Kronig causality and time-invariance, immediately catching loose contacts, temperature drift, and non-linearities before downstream ML inference.",
    citation: "Boukamp, Solid State Ionics (1995)",
    doi: "10.1016/0167-2738(95)00131-U"
  }
];
