import { TrajectoryClass } from "../core/signalTypes";

/**
 * Signal Trajectory Classification Module
 * 
 * Classifies the high-level trend of the signal based on recent slope history
 * and stability metrics. Feeds directly into Person B's ML Trajectory model.
 */

/**
 * Evaluates the recent trend to classify the signal trajectory.
 * 
 * @param recentSlopes Array of recent slope calculations
 * @param stability The current stability index [0.0 - 1.0]
 * @param slopeThreshold Threshold above which a slope is considered a significant trend (e.g. 0.01)
 */
export function classifyTrajectory(
  recentSlopes: number[],
  stability: number,
  slopeThreshold: number = 0.005
): TrajectoryClass {
  if (!recentSlopes || recentSlopes.length === 0) return "UNKNOWN";

  // If the signal is highly unstable, we can't trust a trajectory
  if (stability < 0.3) {
    return "UNSTABLE";
  }

  // Calculate the mean of recent slopes to determine direction
  let sum = 0;
  for (let i = 0; i < recentSlopes.length; i++) {
    sum += recentSlopes[i];
  }
  const meanSlope = sum / recentSlopes.length;

  if (meanSlope > slopeThreshold) {
    return "RISING";
  }

  if (meanSlope < -slopeThreshold) {
    return "FALLING";
  }

  // If stability is acceptable and it's not rising or falling, it's flat
  return "FLAT";
}
