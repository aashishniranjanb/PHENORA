export interface MeshConvergencePoint {
  meshSizeMm: number;
  nodes: number;
  elements: number;
  femResistanceOhm: number;
  analyticalResistanceOhm: number;
  relativeErrorPercent: number;
}

export const meshConvergenceData: MeshConvergencePoint[] = [
  {
    meshSizeMm: 1.0,
    nodes: 273,
    elements: 484,
    femResistanceOhm: 1.9999999999999951,
    analyticalResistanceOhm: 2.0,
    relativeErrorPercent: 2.4424906541753444e-13,
  },
  {
    meshSizeMm: 0.5,
    nodes: 999,
    elements: 1876,
    femResistanceOhm: 2.000000000000017,
    analyticalResistanceOhm: 2.0,
    relativeErrorPercent: 8.43769498715119e-13,
  },
  {
    meshSizeMm: 0.25,
    nodes: 3828,
    elements: 7414,
    femResistanceOhm: 1.999999999999973,
    analyticalResistanceOhm: 2.0,
    relativeErrorPercent: 1.354472090042691e-12,
  },
  {
    meshSizeMm: 0.125,
    nodes: 15005,
    elements: 29528,
    femResistanceOhm: 1.9999999999999645,
    analyticalResistanceOhm: 2.0,
    relativeErrorPercent: 1.7763568394002505e-12,
  },
];
