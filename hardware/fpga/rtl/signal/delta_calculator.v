// ============================================================================
// PHENORA FPGA Delta Calculator
// Computes signed differential delta_F(t) = F(t) - F(t_before_dose)
// Target: Lattice iCE40UP5K
// ============================================================================

`include "../package/protocol_constants.v"

module delta_calculator (
    input  wire        clk,
    input  wire        rst_n,
    input  wire signed [15:0] filtered_feature,
    input  wire signed [15:0] baseline_value,
    input  wire        baseline_valid,
    input  wire        feature_valid,
    output reg  signed [16:0] delta_feature, // 17-bit to prevent subtraction overflow
    output reg         delta_valid,
    output reg         baseline_ready_error
);

    always @(posedge clk or negedge rst_n) begin
        if (!rst_n) begin
            delta_feature        <= 17'sd0;
            delta_valid          <= 1'b0;
            baseline_ready_error <= 1'b0;
        end else begin
            delta_valid          <= 1'b0;
            baseline_ready_error <= 1'b0;

            if (feature_valid) begin
                if (baseline_valid) begin
                    delta_feature <= $signed(filtered_feature) - $signed(baseline_value);
                    delta_valid   <= 1'b1;
                end else begin
                    baseline_ready_error <= 1'b1; // Error if measurement received without valid baseline
                end
            end
        end
    end

endmodule
