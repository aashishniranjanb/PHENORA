// ============================================================================
// PHENORA FPGA Baseline Tracker
// Latches pre-dose baseline feature F(t_before_dose) for single-chamber protocol
// Target: Lattice iCE40UP5K
// ============================================================================

`include "../package/protocol_constants.v"

module baseline_tracker (
    input  wire        clk,
    input  wire        rst_n,
    input  wire signed [15:0] current_feature,
    input  wire        capture_cmd,
    input  wire        clear_cmd,
    output reg  signed [15:0] baseline_value,
    output reg         baseline_valid
);

    always @(posedge clk or negedge rst_n) begin
        if (!rst_n) begin
            baseline_value <= 16'sd0;
            baseline_valid <= 1'b0;
        end else begin
            if (clear_cmd) begin
                baseline_value <= 16'sd0;
                baseline_valid <= 1'b0;
            end else if (capture_cmd) begin
                baseline_value <= current_feature;
                baseline_valid <= 1'b1;
            end
        end
    end

endmodule
