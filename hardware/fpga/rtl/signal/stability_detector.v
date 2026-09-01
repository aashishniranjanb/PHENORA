// ============================================================================
// PHENORA FPGA Stability Detector
// Evaluates slope derivative against active and stability thresholds
// Target: Lattice iCE40UP5K
// ============================================================================

`include "../package/protocol_constants.v"

module stability_detector (
    input  wire        clk,
    input  wire        rst_n,
    input  wire signed [16:0] slope_in,
    input  wire signed [15:0] feature_in,
    input  wire        slope_valid,
    input  wire signed [16:0] active_threshold,    // Active divergence threshold
    input  wire signed [16:0] stability_threshold, // Settled stability threshold
    input  wire signed [15:0] quiet_threshold,     // Quiet signal protection
    output reg         is_quiet,
    output reg         is_active,
    output reg         is_stable,
    output reg         detector_valid
);

    wire signed [16:0] abs_slope;
    wire signed [15:0] abs_feature;

    assign abs_slope   = (slope_in < 17'sd0) ? -slope_in : slope_in;
    assign abs_feature = (feature_in < 16'sd0) ? -feature_in : feature_in;

    always @(posedge clk or negedge rst_n) begin
        if (!rst_n) begin
            is_quiet       <= 1'b0;
            is_active      <= 1'b0;
            is_stable      <= 1'b0;
            detector_valid <= 1'b0;
        end else begin
            detector_valid <= 1'b0;

            if (slope_valid) begin
                is_quiet  <= (abs_feature < quiet_threshold);
                is_active <= (abs_slope > active_threshold);
                is_stable <= (abs_slope <= stability_threshold);
                detector_valid <= 1'b1;
            end
        end
    end

endmodule
