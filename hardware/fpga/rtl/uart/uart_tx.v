// ============================================================================
// PHENORA FPGA UART Transmitter (115200 8N1 @ 12 MHz clk)
// Target: Lattice iCE40UP5K
// ============================================================================

`include "../package/protocol_constants.v"

module uart_tx #(
    parameter CLK_FREQ = 12000000,
    parameter BAUD_RATE = 115200
)(
    input  wire       clk,
    input  wire       rst_n,
    input  wire [7:0] tx_data,
    input  wire       tx_start,
    output reg        tx,
    output reg        tx_busy,
    output reg        tx_done
);

    localparam CLKS_PER_BIT = CLK_FREQ / BAUD_RATE;

    localparam STATE_IDLE  = 3'b000;
    localparam STATE_START = 3'b001;
    localparam STATE_DATA  = 3'b010;
    localparam STATE_STOP  = 3'b011;
    localparam STATE_CLEAN = 3'b100;

    reg [2:0]  state;
    reg [15:0] clk_count;
    reg [2:0]  bit_idx;
    reg [7:0]  tx_shift;

    always @(posedge clk or negedge rst_n) begin
        if (!rst_n) begin
            state     <= STATE_IDLE;
            tx        <= 1'b1;
            tx_busy   <= 1'b0;
            tx_done   <= 1'b0;
            clk_count <= 16'd0;
            bit_idx   <= 3'd0;
            tx_shift  <= 8'd0;
        end else begin
            tx_done <= 1'b0;

            case (state)
                STATE_IDLE: begin
                    tx      <= 1'b1;
                    tx_busy <= 1'b0;
                    if (tx_start) begin
                        tx_shift  <= tx_data;
                        tx_busy   <= 1'b1;
                        clk_count <= 16'd0;
                        bit_idx   <= 3'd0;
                        state     <= STATE_START;
                    end
                end

                STATE_START: begin
                    tx <= 1'b0; // Drive Start Bit
                    if (clk_count == (CLKS_PER_BIT - 1)) begin
                        clk_count <= 16'd0;
                        state     <= STATE_DATA;
                    end else begin
                        clk_count <= clk_count + 1'b1;
                    end
                end

                STATE_DATA: begin
                    tx <= tx_shift[bit_idx];
                    if (clk_count == (CLKS_PER_BIT - 1)) begin
                        clk_count <= 16'd0;
                        if (bit_idx == 3'd7) begin
                            state <= STATE_STOP;
                        end else begin
                            bit_idx <= bit_idx + 1'b1;
                        end
                    end else begin
                        clk_count <= clk_count + 1'b1;
                    end
                end

                STATE_STOP: begin
                    tx <= 1'b1; // Drive Stop Bit
                    if (clk_count == (CLKS_PER_BIT - 1)) begin
                        tx_done   <= 1'b1;
                        clk_count <= 16'd0;
                        state     <= STATE_CLEAN;
                    end else begin
                        clk_count <= clk_count + 1'b1;
                    end
                end

                STATE_CLEAN: begin
                    tx_busy <= 1'b0;
                    state   <= STATE_IDLE;
                end

                default: state <= STATE_IDLE;
            endcase
        end
    end

endmodule
