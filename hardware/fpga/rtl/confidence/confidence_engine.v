// ============================================================================
// PHENORA FPGA Confidence & Signal Quality Gating Engine
// Consumes Person B signal intelligence flags & quality indicators
// Target: Lattice iCE40UP5K
// ============================================================================

`include "../package/protocol_constants.v"

module confidence_engine (
    input  wire        clk,
    input  wire        rst_n,
    input  wire  [7:0] packet_flags,
    input  wire  [7:0] min_quality_threshold,
    input  wire  [7:0] min_confidence_threshold,
    output reg         quality_acceptable,
    output reg         confidence_acceptable,
    output reg         anomaly_detected
);

    // Flag Bit Definitions:
    // bit 0 = signal_usable
    // bit 1 = trajectory_valid
    // bit 2 = noisy_flag
    // bit 3 = drifting_flag
    // bit 4 = anomaly_flag
    // bit 5 = baseline_valid_flag

    always @(posedge clk or negedge rst_n) begin
        if (!rst_n) begin
            quality_acceptable    <= 1'b1; // Default true if flags not set
            confidence_acceptable <= 1'b1;
            anomaly_detected      <= 1'b0;
        end else begin
            quality_acceptable    <= packet_flags[0]; // Usable flag
            anomaly_detected      <= packet_flags[4]; // Anomaly flag
            confidence_acceptable <= !packet_flags[2] && !packet_flags[4]; // Not noisy & not anomalous
        end
    end

endmodule
