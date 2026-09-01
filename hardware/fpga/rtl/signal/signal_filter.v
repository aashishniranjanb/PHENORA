// ============================================================================
// PHENORA FPGA Moving Average Signal Filter (N=3)
// Smooths Q8.8 fixed-point feature input to remove measurement noise
// Target: Lattice iCE40UP5K
// ============================================================================

`include "../package/protocol_constants.v"

module signal_filter (
    input  wire        clk,
    input  wire        rst_n,
    input  wire signed [15:0] raw_feature,
    input  wire        feature_valid,
    output reg  signed [15:0] filtered_feature,
    output reg         filtered_valid
);

    reg signed [15:0] buf0, buf1, buf2;
    reg [1:0]  count;
    reg signed [17:0] sum; // Extended bit width for sum (3 * 16-bit)

    always @(posedge clk or negedge rst_n) begin
        if (!rst_n) begin
            buf0            <= 16'sd0;
            buf1            <= 16'sd0;
            buf2            <= 16'sd0;
            count           <= 2'd0;
            filtered_feature<= 16'sd0;
            filtered_valid  <= 1'b0;
        end else begin
            filtered_valid <= 1'b0;

            if (feature_valid) begin
                buf0 <= raw_feature;
                buf1 <= buf0;
                buf2 <= buf1;

                if (count < 2'd3) begin
                    count <= count + 1'b1;
                end

                if (count == 2'd0) begin
                    filtered_feature <= raw_feature;
                end else if (count == 2'd1) begin
                    // Mean of 2 samples
                    sum = $signed(raw_feature) + $signed(buf0);
                    filtered_feature <= sum >>> 1;
                end else begin
                    // Mean of 3 samples (N=3)
                    // Note: Divide by 3 in fixed point fixed integer division
                    sum = $signed(raw_feature) + $signed(buf0) + $signed(buf1);
                    filtered_feature <= sum / 3;
                end
                filtered_valid <= 1'b1;
            end
        end
    end

endmodule
