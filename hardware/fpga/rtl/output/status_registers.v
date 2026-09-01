// ============================================================================
// PHENORA FPGA Telemetry & Status Register Bank
// Holds execution stats, feature snapshot, and error flags for telemetry
// Target: Lattice iCE40UP5K
// ============================================================================

`include "../package/protocol_constants.v"

module status_registers (
    input  wire        clk,
    input  wire        rst_n,
    input  wire  [2:0] fsm_state,
    input  wire  [1:0] decision,
    input  wire signed [15:0] current_feature,
    input  wire signed [15:0] baseline_value,
    input  wire signed [16:0] delta_feature,
    input  wire signed [16:0] slope_value,
    input  wire  [7:0] stable_count,
    input  wire [15:0] measurement_count,
    input  wire        packet_err,
    input  wire        seq_err,
    input  wire        baseline_err,
    output reg  [31:0] status_reg_0,
    output reg  [31:0] status_reg_1,
    output reg  [15:0] error_flags
);

    always @(posedge clk or negedge rst_n) begin
        if (!rst_n) begin
            status_reg_0 <= 32'd0;
            status_reg_1 <= 32'd0;
            error_flags  <= 16'd0;
        end else begin
            status_reg_0 <= {fsm_state, decision, stable_count, measurement_count[11:0], 9'd0};
            status_reg_1 <= {current_feature, baseline_value};
            error_flags  <= {13'd0, baseline_err, seq_err, packet_err};
        end
    end

endmodule
