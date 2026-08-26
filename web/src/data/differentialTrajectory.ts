export interface TrajectoryPoint {
  timeHours: number;
  rControlOhm: number;
  rTestOhm: number;
  deltaROhm: number;
  fpgaDecision: "MEASURING" | "STABLE" | "STOP" | "ANALYZING";
}

export const differentialTrajectoryData: TrajectoryPoint[] = [
  {
    timeHours: 0.0,
    rControlOhm: 2.000224077743123,
    rTestOhm: 2.000224077743123,
    deltaROhm: 0.0,
    fpgaDecision: "MEASURING",
  },
  {
    timeHours: 2.5,
    rControlOhm: 2.000673183423095,
    rTestOhm: 2.0001749824807633,
    deltaROhm: -0.0004982009423315503,
    fpgaDecision: "STABLE",
  },
  {
    timeHours: 5.0,
    rControlOhm: 2.001927134829,
    rTestOhm: 2.000136563273357,
    deltaROhm: -0.0017905715556429946,
    fpgaDecision: "STOP",
  },
  {
    timeHours: 7.5,
    rControlOhm: 2.0048755755918677,
    rTestOhm: 2.0001065301775065,
    deltaROhm: -0.004769045414361184,
    fpgaDecision: "STOP",
  },
  {
    timeHours: 10.0,
    rControlOhm: 2.0096873750653055,
    rTestOhm: 2.0000830719914706,
    deltaROhm: -0.009604303073834863,
    fpgaDecision: "STOP",
  },
];
