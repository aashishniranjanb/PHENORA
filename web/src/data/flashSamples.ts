import { FlashRun } from "@/types/flash";
import { flashRun as defaultRun } from "./flashRun";

export const SAMPLE_RUNS: Record<string, FlashRun> = {
  // 1. P0025 - Fully Susceptible, No Resistance Genes, Wound Swab
  P0025: {
    ...defaultRun,
    meta: { ...defaultRun.meta, seed: 1025, groundTruth: "P0025" },
    headline: {
      ...defaultRun.headline,
      plain: "Infection detected. High confidence in susceptibility to first-line agents.",
      organism: "K_PNEUMONIAE",
      confidence: 0.99,
      decision: "REPORT_SINGLE",
      decisionPlain: "Fully susceptible profile. Routine care recommended.",
      patient: {
        id: "P0025",
        age: 65,
        gender: "Female",
        specimenType: "Wound swab",
        resistanceGenes: "None",
        outcome: "Recovered"
      }
    },
    susceptibility: [
      { drug: "Amoxicillin", ratio: 0.1, call: "SUSCEPTIBLE", plain: "Fully Susceptible" },
      { drug: "Ciprofloxacin", ratio: 0.2, call: "SUSCEPTIBLE", plain: "Fully Susceptible" },
      { drug: "Meropenem", ratio: 0.4, call: "INTERMEDIATE", plain: "Intermediate Response" },
      { drug: "Vancomycin", ratio: 0.5, call: "INTERMEDIATE", plain: "Intermediate Response" },
      { drug: "Colistin", ratio: 0.1, call: "SUSCEPTIBLE", plain: "Fully Susceptible" }
    ],
    progression: { ipi: 22, velocity: 1.2, state: "Stable" },
    counterfactual: {
      scenarios: [
        {
          drug: "NO DRUG",
          effect: "Growth ↑",
          risk: "HIGH",
          trajectory: [{ h: 2, mean: 0.2, lo: 0.1, hi: 0.3 }, { h: 3, mean: 0.4, lo: 0.3, hi: 0.5 }, { h: 4, mean: 0.8, lo: 0.7, hi: 0.9 }]
        },
        {
          drug: "AMOXICILLIN",
          effect: "Growth ↓",
          risk: "CONTROL",
          trajectory: [{ h: 2, mean: 0.2, lo: 0.1, hi: 0.3 }, { h: 3, mean: 0.1, lo: 0.05, hi: 0.15 }, { h: 4, mean: 0.05, lo: 0.01, hi: 0.1 }]
        },
        {
          drug: "CIPROFLOXACIN",
          effect: "Growth ↓",
          risk: "CONTROL",
          trajectory: [{ h: 2, mean: 0.2, lo: 0.1, hi: 0.3 }, { h: 3, mean: 0.08, lo: 0.04, hi: 0.12 }, { h: 4, mean: 0.02, lo: 0.01, hi: 0.05 }]
        }
      ]
    }
  },

  // 2. P0003 - Pediatric, High Risk OXA-48, Urine
  P0003: {
    ...defaultRun,
    meta: { ...defaultRun.meta, seed: 1003, groundTruth: "P0003" },
    headline: {
      ...defaultRun.headline,
      plain: "Critical resistance detected. OXA-48 carbapenemase indicated.",
      organism: "E_COLI",
      confidence: 0.96,
      decision: "REPORT_SINGLE",
      decisionPlain: "Carbapenem-resistant profile. Escalate to ICU protocols.",
      patient: {
        id: "P0003",
        age: 13,
        gender: "Female",
        specimenType: "Urine",
        resistanceGenes: "OXA-48",
        outcome: "ICU"
      }
    },
    susceptibility: [
      { drug: "Amoxicillin", ratio: 0.6, call: "INTERMEDIATE", plain: "Borderline Effectiveness" },
      { drug: "Ciprofloxacin", ratio: 0.1, call: "SUSCEPTIBLE", plain: "Effective" },
      { drug: "Meropenem", ratio: 1.8, call: "RESISTANT", plain: "High Resistance" },
      { drug: "Vancomycin", ratio: 0.5, call: "INTERMEDIATE", plain: "Borderline Effectiveness" },
      { drug: "Colistin", ratio: 2.1, call: "RESISTANT", plain: "High Resistance" }
    ],
    progression: { ipi: 88, velocity: 14.5, state: "Critical" },
    counterfactual: {
      scenarios: [
        {
          drug: "NO DRUG",
          effect: "Growth ↑",
          risk: "HIGH",
          trajectory: [{ h: 2, mean: 0.5, lo: 0.4, hi: 0.6 }, { h: 3, mean: 1.2, lo: 1.0, hi: 1.4 }, { h: 4, mean: 2.5, lo: 2.1, hi: 2.9 }]
        },
        {
          drug: "MEROPENEM",
          effect: "Growth ↑",
          risk: "FAILURE",
          trajectory: [{ h: 2, mean: 0.5, lo: 0.4, hi: 0.6 }, { h: 3, mean: 1.1, lo: 0.9, hi: 1.3 }, { h: 4, mean: 2.2, lo: 1.9, hi: 2.5 }]
        },
        {
          drug: "CIPROFLOXACIN",
          effect: "Growth ↓",
          risk: "CONTROL",
          trajectory: [{ h: 2, mean: 0.5, lo: 0.4, hi: 0.6 }, { h: 3, mean: 0.3, lo: 0.2, hi: 0.4 }, { h: 4, mean: 0.1, lo: 0.05, hi: 0.15 }]
        }
      ]
    }
  },

  // 3. P0008 - Elderly, KPC Resistant, Sputum (Survived)
  P0008: {
    ...defaultRun,
    meta: { ...defaultRun.meta, seed: 1008, groundTruth: "P0008" },
    headline: {
      ...defaultRun.headline,
      plain: "Multi-drug resistant respiratory infection. KPC mechanisms active.",
      organism: "P_AERUGINOSA",
      confidence: 0.94,
      decision: "REPORT_SINGLE",
      decisionPlain: "High resistance. Vancomycin/Colistin combination required.",
      patient: {
        id: "P0008",
        age: 75,
        gender: "Male",
        specimenType: "Sputum",
        resistanceGenes: "KPC",
        outcome: "Recovered"
      }
    },
    susceptibility: [
      { drug: "Amoxicillin", ratio: 2.0, call: "RESISTANT", plain: "Resistant" },
      { drug: "Ciprofloxacin", ratio: 1.9, call: "RESISTANT", plain: "Resistant" },
      { drug: "Meropenem", ratio: 1.7, call: "RESISTANT", plain: "Resistant" },
      { drug: "Vancomycin", ratio: 0.2, call: "SUSCEPTIBLE", plain: "Highly Effective" },
      { drug: "Colistin", ratio: 0.1, call: "SUSCEPTIBLE", plain: "Highly Effective" }
    ],
    progression: { ipi: 65, velocity: 6.8, state: "Active" },
    counterfactual: {
      scenarios: [
        {
          drug: "NO DRUG",
          effect: "Growth ↑",
          risk: "HIGH",
          trajectory: [{ h: 2, mean: 0.3, lo: 0.2, hi: 0.4 }, { h: 3, mean: 0.7, lo: 0.6, hi: 0.8 }, { h: 4, mean: 1.4, lo: 1.2, hi: 1.6 }]
        },
        {
          drug: "MEROPENEM",
          effect: "Growth ↑",
          risk: "FAILURE",
          trajectory: [{ h: 2, mean: 0.3, lo: 0.2, hi: 0.4 }, { h: 3, mean: 0.65, lo: 0.55, hi: 0.75 }, { h: 4, mean: 1.3, lo: 1.1, hi: 1.5 }]
        },
        {
          drug: "VANCOMYCIN",
          effect: "Growth ↓",
          risk: "CONTROL",
          trajectory: [{ h: 2, mean: 0.3, lo: 0.2, hi: 0.4 }, { h: 3, mean: 0.15, lo: 0.1, hi: 0.2 }, { h: 4, mean: 0.05, lo: 0.02, hi: 0.08 }]
        }
      ]
    }
  },

  // 4. P0009 - Bloodstream Infection, NDM-1, ICU
  P0009: {
    ...defaultRun,
    meta: { ...defaultRun.meta, seed: 1009, groundTruth: "P0009" },
    headline: {
      ...defaultRun.headline,
      plain: "Critical Bloodstream Infection. Severe NDM-1 resistance.",
      organism: "K_PNEUMONIAE",
      confidence: 0.99,
      decision: "REPORT_SINGLE",
      decisionPlain: "Multi-drug resistant. Very few therapeutic options remaining.",
      patient: {
        id: "P0009",
        age: 46,
        gender: "Male",
        specimenType: "Blood",
        resistanceGenes: "NDM-1",
        outcome: "ICU"
      }
    },
    susceptibility: [
      { drug: "Amoxicillin", ratio: 2.2, call: "RESISTANT", plain: "Resistant" },
      { drug: "Ciprofloxacin", ratio: 0.5, call: "INTERMEDIATE", plain: "Intermediate" },
      { drug: "Meropenem", ratio: 0.6, call: "INTERMEDIATE", plain: "Intermediate" },
      { drug: "Vancomycin", ratio: 1.8, call: "RESISTANT", plain: "Resistant" },
      { drug: "Colistin", ratio: 2.1, call: "RESISTANT", plain: "Resistant" }
    ],
    progression: { ipi: 95, velocity: 18.2, state: "Critical" },
    counterfactual: {
      scenarios: [
        {
          drug: "NO DRUG",
          effect: "Growth ↑",
          risk: "HIGH",
          trajectory: [{ h: 2, mean: 0.8, lo: 0.6, hi: 1.0 }, { h: 3, mean: 1.9, lo: 1.5, hi: 2.3 }, { h: 4, mean: 3.5, lo: 2.8, hi: 4.2 }]
        },
        {
          drug: "COLISTIN",
          effect: "Growth ↑",
          risk: "FAILURE",
          trajectory: [{ h: 2, mean: 0.8, lo: 0.6, hi: 1.0 }, { h: 3, mean: 1.7, lo: 1.4, hi: 2.0 }, { h: 4, mean: 3.1, lo: 2.5, hi: 3.8 }]
        },
        {
          drug: "MEROPENEM (HIGH DOSE)",
          effect: "Growth ↓",
          risk: "CONTROL",
          trajectory: [{ h: 2, mean: 0.8, lo: 0.6, hi: 1.0 }, { h: 3, mean: 0.6, lo: 0.4, hi: 0.8 }, { h: 4, mean: 0.4, lo: 0.2, hi: 0.6 }]
        }
      ]
    }
  },

  // 5. P0021 - VIM Genotype, Blood, Survived
  P0021: {
    ...defaultRun,
    meta: { ...defaultRun.meta, seed: 1021, groundTruth: "P0021" },
    headline: {
      ...defaultRun.headline,
      plain: "VIM Metallo-beta-lactamase detected. Resistant to multiple classes.",
      organism: "P_AERUGINOSA",
      confidence: 0.91,
      decision: "REPORT_SINGLE",
      decisionPlain: "Requires non-beta-lactam strategy.",
      patient: {
        id: "P0021",
        age: 34,
        gender: "Female",
        specimenType: "Blood",
        resistanceGenes: "VIM",
        outcome: "Recovered"
      }
    },
    susceptibility: [
      { drug: "Amoxicillin", ratio: 1.9, call: "RESISTANT", plain: "Resistant" },
      { drug: "Ciprofloxacin", ratio: 2.0, call: "RESISTANT", plain: "Resistant" },
      { drug: "Meropenem", ratio: 0.4, call: "INTERMEDIATE", plain: "Intermediate" },
      { drug: "Vancomycin", ratio: 0.6, call: "INTERMEDIATE", plain: "Intermediate" },
      { drug: "Colistin", ratio: 1.8, call: "RESISTANT", plain: "Resistant" }
    ],
    progression: { ipi: 72, velocity: 9.1, state: "Active" },
    counterfactual: {
      scenarios: [
        {
          drug: "NO DRUG",
          effect: "Growth ↑",
          risk: "HIGH",
          trajectory: [{ h: 2, mean: 0.4, lo: 0.3, hi: 0.5 }, { h: 3, mean: 0.9, lo: 0.7, hi: 1.1 }, { h: 4, mean: 1.8, lo: 1.5, hi: 2.1 }]
        },
        {
          drug: "CIPROFLOXACIN",
          effect: "Growth ↑",
          risk: "FAILURE",
          trajectory: [{ h: 2, mean: 0.4, lo: 0.3, hi: 0.5 }, { h: 3, mean: 0.85, lo: 0.65, hi: 1.05 }, { h: 4, mean: 1.7, lo: 1.4, hi: 2.0 }]
        },
        {
          drug: "MEROPENEM",
          effect: "Growth ↓",
          risk: "CONTROL",
          trajectory: [{ h: 2, mean: 0.4, lo: 0.3, hi: 0.5 }, { h: 3, mean: 0.35, lo: 0.25, hi: 0.45 }, { h: 4, mean: 0.2, lo: 0.1, hi: 0.3 }]
        }
      ]
    }
  }
};
