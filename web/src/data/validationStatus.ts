export interface ValidationLevel {
  level: number;
  name: string;
  subtitle: string;
  description: string;
  status: "VERIFIED" | "COMPUTATIONAL DEMONSTRATION" | "VERIFIED IN SOFTWARE TESTS" | "PROTOTYPE" | "NOT YET VALIDATED" | "CONCEPT";
  badgeColor: string;
}

export const validationLadderData: ValidationLevel[] = [
  {
    level: 0,
    name: "Analytical Conduction Model",
    subtitle: "Conduction physics verification",
    description: "Analytical baseline resistance matches physical dimensions and electrolyte conductivity: R = L / (σA) is verified.",
    status: "VERIFIED",
    badgeColor: "bg-green-950/40 text-green-400 border border-green-900/60",
  },
  {
    level: 1,
    name: "FEM Solver Convergence",
    subtitle: "Numerical Elmer solver accuracy",
    description: "Elmer StatCurrent finite element solver converges. Refined mesh calculations show 0.0000% error relative to the analytical reference.",
    status: "VERIFIED",
    badgeColor: "bg-green-950/40 text-green-400 border border-green-900/60",
  },
  {
    level: 2,
    name: "Numerical Sensitivity",
    subtitle: "Cell loading and medium sweep",
    description: "Evaluates control vs test well differential resistance changes under simulated biological perturbations and temperature drift common-modes.",
    status: "COMPUTATIONAL DEMONSTRATION",
    badgeColor: "bg-blue-950/40 text-blue-400 border border-blue-900/60",
  },
  {
    level: 3,
    name: "Adaptive Algorithm",
    subtitle: "Decision logic state machine",
    description: "Verilog FSM logic simulator and Golden Python model verified against generated test vector sequences in software tests.",
    status: "VERIFIED IN SOFTWARE TESTS",
    badgeColor: "bg-blue-950/40 text-blue-400 border border-blue-900/60",
  },
  {
    level: 4,
    name: "Electronic Hardware Integration",
    subtitle: "AD5933, ESP32, FPGA circuit loop",
    description: "Prototype microchip circuit configuration. Evaluates UART telemetry stream and calibration curves using static test resistors.",
    status: "PROTOTYPE",
    badgeColor: "bg-yellow-950/40 text-yellow-500 border border-yellow-900/60",
  },
  {
    level: 5,
    name: "Biological Broth Suspension",
    subtitle: "Active cell culture assay",
    description: "Future stage. Demands testing real bacterial suspensions inside micro-wells to verify cellular metabolic effects on electrolyte matrix.",
    status: "NOT YET VALIDATED",
    badgeColor: "bg-red-950/40 text-red-400 border border-red-900/60",
  },
  {
    level: 6,
    name: "Clinical AST Susceptibility",
    subtitle: "Diagnostic S/I/R categorization",
    description: "Future stage. Clinical trials evaluating patient specimens to categorize antibiotic resistance (S/I/R profiles) within 60 minutes.",
    status: "NOT YET VALIDATED",
    badgeColor: "bg-red-950/40 text-red-400 border border-red-900/60",
  },
];
