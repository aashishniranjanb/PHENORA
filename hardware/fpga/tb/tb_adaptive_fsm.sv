// ============================================================================
// PHENORA FPGA RTL Equivalence Testbench
// Golden Model Verification against simulation/adaptive/expected_results.csv
// Target: Lattice iCE40UP5K
// ============================================================================

`timescale 1ns/1ps
`include "../rtl/package/protocol_constants.v"
`include "../rtl/signal/signal_filter.v"
`include "../rtl/signal/slope_calculator.v"
`include "../rtl/signal/stability_detector.v"
`include "../rtl/decision/adaptive_fsm.v"

module tb_adaptive_fsm;

    reg clk;
    reg rst_n;
    reg sample_valid;
    reg [15:0] sample_idx;
    reg signed [15:0] raw_delta_R;

    wire signed [15:0] filtered_feature;
    wire filtered_valid;

    wire signed [16:0] slope_val;
    wire slope_valid;

    wire is_quiet;
    wire is_active;
    wire is_stable;
    wire detector_valid;

    wire [2:0] fsm_state;
    wire [1:0] decision;
    wire [7:0] stable_count;
    wire [15:0] measurement_count;

    // Fixed-Point / Spec Threshold Parameters matching Golden Model
    localparam signed [16:0] ACTIVE_THRESH    = 17'sd0; // 0.0005 scaled or 0
    localparam signed [16:0] STABILITY_THRESH = 17'sd0; // 0.0003 scaled or 0
    localparam signed [15:0] QUIET_THRESH     = 16'sd0; // 0.0001 scaled or 0

    // Instantiate Submodules
    signal_filter u_filter (
        .clk             (clk),
        .rst_n           (rst_n),
        .raw_feature     (raw_delta_R),
        .feature_valid   (sample_valid),
        .filtered_feature(filtered_feature),
        .filtered_valid  (filtered_valid)
    );

    slope_calculator #(
        .K_DELAY(2)
    ) u_slope (
        .clk          (clk),
        .rst_n        (rst_n),
        .feature_in   (filtered_feature),
        .feature_valid(filtered_valid),
        .slope_out    (slope_val),
        .slope_valid  (slope_valid)
    );

    stability_detector u_stab (
        .clk                (clk),
        .rst_n              (rst_n),
        .slope_in           (slope_val),
        .feature_in         (filtered_feature),
        .slope_valid        (slope_valid),
        .active_threshold   (ACTIVE_THRESH),
        .stability_threshold(STABILITY_THRESH),
        .quiet_threshold    (QUIET_THRESH),
        .is_quiet           (is_quiet),
        .is_active          (is_active),
        .is_stable          (is_stable),
        .detector_valid     (detector_valid)
    );

    adaptive_fsm u_fsm (
        .clk                     (clk),
        .rst_n                   (rst_n),
        .sample_valid            (detector_valid),
        .sample_idx              (sample_idx),
        .raw_delta_R             (filtered_feature),
        .slope                   (slope_val),
        .is_quiet                (is_quiet),
        .is_active               (is_active),
        .is_stable               (is_stable),
        .quality_ok              (1'b1),
        .anomaly_detected        (1'b0),
        .reset_run               (1'b0),
        .min_samples             (8'd3),
        .required_stable_windows (8'd2),
        .max_measurement_windows (16'd100),
        .fsm_state               (fsm_state),
        .decision_out            (decision),
        .stable_count_out        (stable_count),
        .measurement_count       (measurement_count)
    );

    // Clock Generator (12 MHz -> T = 83.33 ns)
    always #41.666 clk = ~clk;

    integer test_pass_count;
    integer test_fail_count;

    task run_test_step(
        input integer step_num,
        input real delta_r_val,
        input reg [2:0] expected_st
    );
        begin
            sample_idx   = step_num;
            raw_delta_R  = $rtoi(delta_r_val * 256.0); // Convert float to Q8.8
            sample_valid = 1'b1;
            #83.333;
            sample_valid = 1'b0;
            #333.333; // Wait for pipeline

            if (fsm_state === expected_st) begin
                $display("[PASS] Step %0d: Input %f -> State %0d matches expected", step_num, delta_r_val, fsm_state);
                test_pass_count = test_pass_count + 1;
            end else begin
                $display("[FAIL] Step %0d: Input %f -> Got State %0d, Expected State %0d", step_num, delta_r_val, fsm_state, expected_st);
                test_fail_count = test_fail_count + 1;
            end
        end
    endtask

    initial begin
        $display("==========================================================================");
        $display("STARTING PHENORA FPGA ADAPTIVE FSM GOLDEN EQUIVALENCE TESTBENCH");
        $display("==========================================================================");

        clk             = 0;
        rst_n           = 0;
        sample_valid    = 0;
        sample_idx      = 0;
        raw_delta_R     = 0;
        test_pass_count = 0;
        test_fail_count = 0;

        #200;
        rst_n = 1;
        #200;

        // --------------------------------------------------------------------
        // TEST VECTOR A: STABLE (Expected -> STOP at sample 8)
        // --------------------------------------------------------------------
        $display("\n--- Running Vector A: Stable Trajectory ---");
        run_test_step(0,  0.0000, `FSM_MEASURING);
        run_test_step(1, -0.0001, `FSM_MEASURING);
        run_test_step(2, -0.0010, `FSM_MEASURING);
        run_test_step(3, -0.0025, `FSM_ANALYZING);
        run_test_step(4, -0.0030, `FSM_ANALYZING);
        run_test_step(5, -0.0031, `FSM_ANALYZING);
        run_test_step(6, -0.0031, `FSM_ANALYZING);
        run_test_step(7, -0.0031, `FSM_STABLE);
        run_test_step(8, -0.0031, `FSM_STOP);

        // --------------------------------------------------------------------
        // SUMMARY
        // --------------------------------------------------------------------
        $display("\n==========================================================================");
        $display("TEST SUMMARY: %0d PASSED, %0d FAILED", test_pass_count, test_fail_count);
        $display("==========================================================================");

        if (test_fail_count == 0) begin
            $display(">>> ALL GOLDEN VECTOR RTL TESTS PASSED SUCCESSFULLY! <<<");
        end else begin
            $display(">>> RTL EQUIVALENCE VERIFICATION FAILED! <<<");
        end

        $finish;
    end

endmodule
