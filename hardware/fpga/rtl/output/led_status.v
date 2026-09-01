// ============================================================================
// PHENORA FPGA Onboard RGB LED Driver
// Target: Lattice iCE40UP5K (VSDSquadron FPGA Mini)
// Visual Indication: Blue=MEASURING, Yellow=ANALYZING, Green=STOP, Red=TIMEOUT/ERROR
// ============================================================================

`include "../package/protocol_constants.v"

module led_status (
    input  wire       clk,
    input  wire       rst_n,
    input  wire [2:0] fsm_state,
    input  wire [1:0] decision,
    output reg        led_red,
    output reg        led_green,
    output reg        led_blue
);

    // Active-low logic for standard onboard RGB LED on iCE40UP5K breakout
    always @(posedge clk or negedge rst_n) begin
        if (!rst_n) begin
            led_red   <= 1'b1; // OFF
            led_green <= 1'b1; // OFF
            led_blue  <= 1'b1; // OFF
        end else begin
            case (fsm_state)
                `FSM_IDLE: begin
                    // Off / Dim Pulse
                    led_red   <= 1'b1;
                    led_green <= 1'b1;
                    led_blue  <= 1'b1;
                end

                `FSM_MEASURING: begin
                    // Blue LED
                    led_red   <= 1'b1;
                    led_green <= 1'b1;
                    led_blue  <= 1'b0; // ON
                end

                `FSM_ANALYZING: begin
                    // Yellow LED (Red + Green)
                    led_red   <= 1'b0; // ON
                    led_green <= 1'b0; // ON
                    led_blue  <= 1'b1;
                end

                `FSM_STABLE: begin
                    // Cyan / Light Green
                    led_red   <= 1'b1;
                    led_green <= 1'b0; // ON
                    led_blue  <= 1'b0; // ON
                end

                `FSM_STOP: begin
                    // Solid Green LED (Success / Edge Halting)
                    led_red   <= 1'b1;
                    led_green <= 1'b0; // ON
                    led_blue  <= 1'b1;
                end

                `FSM_TIMEOUT, `FSM_ERROR: begin
                    // Solid Red LED (Timeout / Inconclusive)
                    led_red   <= 1'b0; // ON
                    led_green <= 1'b1;
                    led_blue  <= 1'b1;
                end

                default: begin
                    led_red   <= 1'b1;
                    led_green <= 1'b1;
                    led_blue  <= 1'b1;
                end
            endcase
        end
    end

endmodule
