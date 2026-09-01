// ============================================================================
// PHENORA FPGA Slope Derivative Calculator
// Computes discrete slope derivative S[n] = F[n] - F[n-k] (k=2 or k=4)
// Target: Lattice iCE40UP5K
// ============================================================================

`include "../package/protocol_constants.v"

module slope_calculator #(
    parameter K_DELAY = 2 // Delay steps for derivative (k=2 for spec matching)
)(
    input  wire        clk,
    input  wire        rst_n,
    input  wire signed [15:0] feature_in,
    input  wire        feature_valid,
    output reg  signed [16:0] slope_out,
    output reg         slope_valid
);

    reg signed [15:0] delay_pipe [0:4];
    reg [2:0]  sample_count;

    integer i;

    always @(posedge clk or negedge rst_n) begin
        if (!rst_n) begin
            slope_out    <= 17'sd0;
            slope_valid  <= 1'b0;
            sample_count <= 3'd0;
            for (i = 0; i <= 4; i = i + 1) begin
                delay_pipe[i] <= 16'sd0;
            end
        end else begin
            slope_valid <= 1'b0;

            if (feature_valid) begin
                // Shift delay line
                delay_pipe[4] <= delay_pipe[3];
                delay_pipe[3] <= delay_pipe[2];
                delay_pipe[2] <= delay_pipe[1];
                delay_pipe[1] <= delay_pipe[0];
                delay_pipe[0] <= feature_in;

                if (sample_count < (K_DELAY + 1)) begin
                    sample_count <= sample_count + 1'b1;
                end

                if (sample_count >= K_DELAY) begin
                    slope_out   <= $signed(feature_in) - $signed(delay_pipe[K_DELAY - 1]);
                    slope_valid <= 1'b1;
                end else begin
                    slope_out   <= 17'sd0;
                    slope_valid <= 1'b1; // Valid 0.0 before minimum history reached
                end
            end
        end
    end

endmodule
