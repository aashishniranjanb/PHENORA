import numpy as np

# ============================================================
# PHENORA GOLDEN REFERENCE ADAPTIVE HALTING ALGORITHM
# Fixed-Point Compatible Ground Truth Implementation
# ============================================================

class PhenoraAdaptiveGoldenModel:
    def __init__(self, moving_avg_window=3, slope_k=2, quiet_threshold=0.0001, active_slope_threshold=0.0005, stability_slope_threshold=0.0003, min_samples=3, required_stable_windows=2):
        self.moving_avg_window = moving_avg_window
        self.slope_k = slope_k
        self.quiet_threshold = quiet_threshold
        self.active_slope_threshold = active_slope_threshold
        self.stability_slope_threshold = stability_slope_threshold
        self.min_samples = min_samples
        self.required_stable_windows = required_stable_windows
        
        self.raw_history = []
        self.filtered_history = []
        self.slope_history = []
        self.stable_counter = 0
        self.state = "MEASURING"

    def process_sample(self, sample_idx, time_hours, delta_R):
        self.raw_history.append(delta_R)
        
        # 1. Moving Average Filter F[n]
        if len(self.raw_history) >= self.moving_avg_window:
            filtered_val = float(np.mean(self.raw_history[-self.moving_avg_window:]))
        else:
            filtered_val = float(np.mean(self.raw_history))
        self.filtered_history.append(filtered_val)
        
        # 2. Slope Calculation S[n] = F[n] - F[n-k]
        if len(self.filtered_history) > self.slope_k:
            slope = self.filtered_history[-1] - self.filtered_history[-1 - self.slope_k]
        else:
            slope = 0.0
        self.slope_history.append(slope)
        
        # 3. State Machine Transitions
        abs_delta_R = abs(delta_R)
        abs_slope = abs(slope)
        
        if sample_idx < self.min_samples:
            self.state = "MEASURING"
            self.stable_counter = 0
        elif abs_delta_R < self.quiet_threshold:
            # Quiet signal protection: stays in MEASURING, never falsely stops
            self.state = "MEASURING"
            self.stable_counter = 0
        elif abs_slope > self.active_slope_threshold:
            self.state = "ANALYZING"
            self.stable_counter = 0
        elif abs_slope <= self.stability_slope_threshold:
            self.stable_counter += 1
            if self.stable_counter >= self.required_stable_windows:
                self.state = "STOP"
            else:
                self.state = "STABLE"
        else:
            self.state = "ANALYZING"
            self.stable_counter = 0
            
        return {
            "sample": sample_idx,
            "time_hours": time_hours,
            "raw_delta_R": delta_R,
            "filtered_delta_R": filtered_val,
            "slope": slope,
            "stable_count": self.stable_counter,
            "state": self.state
        }

