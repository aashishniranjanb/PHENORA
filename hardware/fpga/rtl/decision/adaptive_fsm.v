// ============================================================================
// PHENORA FPGA Adaptive State Machine (FSM)
// Implements deterministic edge halting: MEASURING -> ANALYZING -> STABLE -> STOP
// Target: Lattice iCE40UP5K
// ============================================================================

`include "../package/protocol_constants.v"

module adaptive_fsm (
    input  wire        clk,
    input  wire        rst_n,
    input  wire        sample_valid,
    input  wire [15:0] sample_idx,
    input  wire signed [15:0] raw_delta_R,
    input  wire signed [16:0] slope,
    input  wire        is_quiet,
    input  wire        is_active,
    input  wire        is_stable,
    input  wire        quality_ok,
    input  wire        anomaly_detected,
    input  wire        reset_run,
    input  wire  [7:0] min_samples,
    input  wire  [7:0] required_stable_windows,
    input  wire [15:0] max_measurement_windows,
    output reg   [2:0] fsm_state,        // 3-bit state encoding
    output reg   [1:0] decision_out,     // NONE, MEASURE_AGAIN, STOP, TIMEOUT
    output reg   [7:0] stable_count_out,
    output reg  [15:0] measurement_count
);

    reg [7:0]  stable_counter;
    reg [15:0] window_counter;

    always @(posedge clk or negedge rst_n) begin
        if (!rst_n) begin
            fsm_state         <= `FSM_MEASURING;
            decision_out      <= `DECISION_NONE;
            stable_counter    <= 8'd0;
            window_counter    <= 16'd0;
            stable_count_out  <= 8'd0;
            measurement_count <= 16'd0;
        end else begin
            if (reset_run) begin
                fsm_state         <= `FSM_MEASURING;
                decision_out      <= `DECISION_NONE;
                stable_counter    <= 8'd0;
                window_counter    <= 16'd0;
                stable_count_out  <= 8'd0;
                measurement_count <= 16'd0;
            end else if (fsm_state == `FSM_STOP || fsm_state == `FSM_TIMEOUT) begin
                // Latch state and decision once STOP or TIMEOUT is reached until reset
                fsm_state    <= fsm_state;
                decision_out <= (fsm_state == `FSM_STOP) ? `DECISION_STOP : `DECISION_TIMEOUT;
            end else if (sample_valid) begin
                window_counter    <= window_counter + 1'b1;
                measurement_count <= window_counter + 1'b1;

                if (window_counter + 1'b1 >= max_measurement_windows) begin
                    fsm_state    <= `FSM_TIMEOUT;
                    decision_out <= `DECISION_TIMEOUT;
                end else if (sample_idx < min_samples) begin
                    // Minimum initial warm-up samples protection
                    fsm_state      <= `FSM_MEASURING;
                    stable_counter <= 8'd0;
                    decision_out   <= `DECISION_MEASURE_AGAIN;
                end else if (is_quiet) begin
                    // Quiet baseline signal protection: stay in MEASURING, never false stop
                    fsm_state      <= `FSM_MEASURING;
                    stable_counter <= 8'd0;
                    decision_out   <= `DECISION_MEASURE_AGAIN;
                end else if (!quality_ok || anomaly_detected) begin
                    // Signal intelligence quality / anomaly rejection
                    fsm_state      <= `FSM_ANALYZING;
                    stable_counter <= 8'd0;
                    decision_out   <= `DECISION_MEASURE_AGAIN;
                end else if (is_active) begin
                    // Slope actively diverging
                    fsm_state      <= `FSM_ANALYZING;
                    stable_counter <= 8'd0;
                    decision_out   <= `DECISION_MEASURE_AGAIN;
                end else if (is_stable) begin
                    // Slope settled within stability threshold
                    if ((stable_counter + 1'b1) >= required_stable_windows) begin
                        stable_counter <= stable_counter + 1'b1;
                        fsm_state      <= `FSM_STOP;
                        decision_out   <= `DECISION_STOP;
                    end else begin
                        stable_counter <= stable_counter + 1'b1;
                        fsm_state      <= `FSM_STABLE;
                        decision_out   <= `DECISION_MEASURE_AGAIN;
                    end
                end else begin
                    fsm_state      <= `FSM_ANALYZING;
                    stable_counter <= 8'd0;
                    decision_out   <= `DECISION_MEASURE_AGAIN;
                end

                stable_count_out <= (is_stable) ? (stable_counter + 1'b1) : 8'd0;
            end
        end
    end

endmodule
