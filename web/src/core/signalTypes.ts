export interface SignalFeatures {
  timestamp: number;
  rawValue: number;

  rms: number;
  variance: number;
  peakToPeak: number;

  baseline: number;
  delta: number;
  slope: number;
  stability: number;

  snr: number;
  drift: number;
}

export type TrajectoryClass =
  | "STABLE"
  | "RISING"
  | "FALLING"
  | "TRANSITION"
  | "NOISY"
  | "DRIFTING"
  | "UNRESOLVED"
  | "UNKNOWN";

export type SignalTrajectory = TrajectoryClass;
export type Trajectory = TrajectoryClass;
