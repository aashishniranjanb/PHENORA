// ============================================================================
// PHENORA FPGA Evidence Accumulator
// Accumulates consecutive stable windows and tracks measurement window budget
// Target: Lattice iCE40UP5K
// ============================================================================

`include "../package/protocol_constants.v"

module evidence_accumulator (
    input  wire        clk,
    input  wire        rst_n,
    input  wire        sample_valid,
    input  wire        is_stable,
    input  wire        reset_run,
    input  wire  [7:0] required_stable_windows,
    input  wire [15:0] max_measurement_windows,
    output reg   [7:0] stable_counter,
    output reg  [15:0] measurement_counter,
    output reg         stop_criteria_met,
    output reg         timeout_criteria_met
);

    always @(posedge clk or negedge rst_n) begin
        if (!rst_n) begin
            stable_counter       <= 8'd0;
            measurement_counter  <= 16'd0;
            stop_criteria_met    <= 1'b0;
            timeout_criteria_met <= 1'b0;
        end else begin
            if (reset_run) begin
                stable_counter       <= 8'd0;
                measurement_counter  <= 16'd0;
                stop_criteria_met    <= 1'b0;
                timeout_criteria_met <= 1'b0;
            end else if (sample_valid) begin
                measurement_counter <= measurement_counter + 1'b1;

                if (is_stable) begin
                    stable_counter <= stable_counter + 1'b1;
                    if ((stable_counter + 1'b1) >= required_stable_windows) begin
                        stop_criteria_met <= 1'b1;
                    end
                end else begin
                    stable_counter    <= 8'd0;
                    stop_criteria_met <= 1'b0;
                end

                if ((measurement_counter + 1'b1) >= max_measurement_windows) begin
                    timeout_criteria_met <= 1'b1;
                end
            end
        end
    end

endmodule
