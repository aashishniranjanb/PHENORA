import numpy as np

# ============================================================
# PHENORA ADAPTIVE EDGE DECISION GOLDEN REFERENCE MODEL
# Derivative Slope Algorithm: S(t) = d(Delta R)/dt
# ============================================================

class PhenoraAdaptiveFSM:
    def __init__(self, slope_threshold=0.0005, window_size=3, min_time_hours=2.0, required_stable_windows=2):
        self.slope_threshold = slope_threshold
        self.window_size = window_size
        self.min_time_hours = min_time_hours
        self.required_stable_windows = required_stable_windows
        
        self.time_history = []
        self.delta_R_history = []
        self.slope_history = []
        self.stable_window_count = 0
        self.state = "MEASURING"

    def process_step(self, time_hours, delta_R):
        self.time_history.append(time_hours)
        self.delta_R_history.append(delta_R)
        
        # Calculate raw derivative slope d(Delta R)/dt
        if len(self.time_history) < 2:
            raw_slope = 0.0
        else:
            dt = self.time_history[-1] - self.time_history[-2]
            d_delta_R = self.delta_R_history[-1] - self.delta_R_history[-2]
            raw_slope = d_delta_R / dt if dt > 0 else 0.0
            
        self.slope_history.append(raw_slope)
        
        # Apply moving average filter to slope
        if len(self.slope_history) >= self.window_size:
            filtered_slope = np.mean(self.slope_history[-self.window_size:])
        else:
            filtered_slope = np.mean(self.slope_history)
            
        # Evaluate state machine transitions
        if time_hours < self.min_time_hours:
            self.state = "MEASURING"
            self.stable_window_count = 0
        else:
            # Check if there is a significant signal divergence magnitude
            signal_magnitude = abs(delta_R)
            
            if signal_magnitude < 0.0001:
                # No biological or electrical difference detected yet (Quiet Signal)
                self.state = "MEASURING"
                self.stable_window_count = 0
            elif abs(filtered_slope) > self.slope_threshold:
                # Signal is dynamically diverging / active
                self.state = "ANALYZING"
                self.stable_window_count = 0
            else:
                # Slope is stationary / stable
                self.stable_window_count += 1
                if self.stable_window_count >= self.required_stable_windows:
                    self.state = "STOP"
                else:
                    self.state = "STABLE"
                    
        return {
            "time_hours": time_hours,
            "delta_R": delta_R,
            "filtered_slope": filtered_slope,
            "stable_windows": self.stable_window_count,
            "state": self.state
        }

def run_test_vector(name, times, delta_R_vals):
    print(f"--- Test Vector: {name} ---")
    fsm = PhenoraAdaptiveFSM()
    for t, val in zip(times, delta_R_vals):
        res = fsm.process_step(t, val)
        print(f"t = {res['time_hours']:>4.1f}h | Delta R = {res['delta_R']:>+8.4f} | Slope = {res['filtered_slope']:>+8.6f} | State = {res['state']}")
    print(f"Final Outcome for {name}: {fsm.state}\n")
    return fsm.state

def main():
    print("==================================================")
    print("PHENORA ADAPTIVE FSM GOLDEN MODEL UNIT TESTS")
    print("==================================================\n")
    
    t = [0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0]
    
    # Test A — Stable Susceptibility Signal
    test_a_vals = [0.0, -0.0001, -0.0010, -0.0025, -0.0030, -0.0031, -0.0031, -0.0031]
    outcome_a = run_test_vector("Test A (Stable Susceptibility Signal)", t, test_a_vals)
    assert outcome_a == "STOP", "Test A failed"
    
    # Test B — Continuously Diverging Signal
    test_b_vals = [0.0, -0.0005, -0.0020, -0.0050, -0.0090, -0.0140, -0.0200, -0.0270]
    outcome_b = run_test_vector("Test B (Continuously Diverging)", t, test_b_vals)
    assert outcome_b in ["ANALYZING", "MEASURING"], "Test B failed"
    
    # Test C — Noisy Fluctuating Signal
    test_c_vals = [0.0, +0.0020, -0.0015, +0.0030, -0.0020, +0.0025, -0.0010, +0.0030]
    outcome_c = run_test_vector("Test C (Noisy Signal)", t, test_c_vals)
    assert outcome_c in ["MEASURING", "ANALYZING"], "Test C failed"

    # Test D — No Biological Difference / Quiet Signal
    test_d_vals = [0.0, 0.00001, 0.00000, -0.00001, 0.00001, 0.00000, 0.00001, 0.00000]
    outcome_d = run_test_vector("Test D (No Difference / Quiet)", t, test_d_vals)
    assert outcome_d == "MEASURING", "Test D failed (should not declare STOP on quiet signal!)"

    print("==================================================")
    print("ALL GOLDEN MODEL UNIT TEST VECTORS PASSED (100%)")
    print("==================================================")

if __name__ == "__main__":
    main()
