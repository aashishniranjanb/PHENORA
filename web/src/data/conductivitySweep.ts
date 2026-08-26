export interface DeltaSigmaSweepPoint {
  deltaSigmaPercent: number;
  sigmaBioSPerM: number;
  rTestOhm: number;
  rControlOhm: number;
  deltaROhm: number;
}

export interface ConductivitySweepPoint {
  conductivitySPerM: number;
  femResistanceOhm: number;
  analyticalResistanceOhm: number;
  relativeErrorPercent: number;
}

export const deltaSigmaSweepData: DeltaSigmaSweepPoint[] = [
  {
    deltaSigmaPercent: -50.0,
    sigmaBioSPerM: 0.5,
    rTestOhm: 2.214180203719948,
    rControlOhm: 2.000000000000008,
    deltaROhm: 0.21418020371993984,
  },
  {
    deltaSigmaPercent: -25.0,
    sigmaBioSPerM: 0.75,
    rTestOhm: 2.0914270061278253,
    rControlOhm: 2.000000000000008,
    deltaROhm: 0.09142700612781729,
  },
  {
    deltaSigmaPercent: -10.0,
    sigmaBioSPerM: 0.9,
    rTestOhm: 2.0336742894171023,
    rControlOhm: 2.000000000000008,
    deltaROhm: 0.03367428941709427,
  },
  {
    deltaSigmaPercent: 0.0,
    sigmaBioSPerM: 1.0,
    rTestOhm: 2.000000000000008,
    rControlOhm: 2.000000000000008,
    deltaROhm: 0.0,
  },
  {
    deltaSigmaPercent: 10.0,
    sigmaBioSPerM: 1.1,
    rTestOhm: 1.9695070220502182,
    rControlOhm: 2.000000000000008,
    deltaROhm: -0.03049297794978978,
  },
  {
    deltaSigmaPercent: 25.0,
    sigmaBioSPerM: 1.25,
    rTestOhm: 1.9287679491517893,
    rControlOhm: 2.000000000000008,
    deltaROhm: -0.07123205084821871,
  },
  {
    deltaSigmaPercent: 50.0,
    sigmaBioSPerM: 1.5,
    rTestOhm: 1.871474989507478,
    rControlOhm: 2.000000000000008,
    deltaROhm: -0.12852501049252996,
  },
];

export const conductivitySweepData: ConductivitySweepPoint[] = [
  {
    conductivitySPerM: 0.25,
    femResistanceOhm: 8.000000000000068,
    analyticalResistanceOhm: 8.0,
    relativeErrorPercent: 8.43769498715119e-13,
  },
  {
    conductivitySPerM: 0.5,
    femResistanceOhm: 4.000000000000032,
    analyticalResistanceOhm: 4.0,
    relativeErrorPercent: 7.993605777301127e-13,
  },
  {
    conductivitySPerM: 1.0,
    femResistanceOhm: 2.000000000000017,
    analyticalResistanceOhm: 2.0,
    relativeErrorPercent: 8.43769498715119e-13,
  },
  {
    conductivitySPerM: 2.0,
    femResistanceOhm: 1.000000000000008,
    analyticalResistanceOhm: 1.0,
    relativeErrorPercent: 7.993605777301127e-13,
  },
  {
    conductivitySPerM: 4.0,
    femResistanceOhm: 0.5000000000000042,
    analyticalResistanceOhm: 0.5,
    relativeErrorPercent: 8.43769498715119e-13,
  },
  {
    conductivitySPerM: 8.0,
    femResistanceOhm: 0.250000000000002,
    analyticalResistanceOhm: 0.25,
    relativeErrorPercent: 7.993605777301127e-13,
  },
];
