// ============================================================================
// PHENORA FPGA UART Receiver (115200 8N1 @ 12 MHz clk)
// Target: Lattice iCE40UP5K
// ============================================================================

`include "../package/protocol_constants.v"

module uart_rx #(
    parameter CLK_FREQ = 12000000,
    parameter BAUD_RATE = 115200
)(
    input  wire       clk,
    input  wire       rst_n,
    input  wire       rx,
    output reg  [7:0] rx_data,
    output reg        rx_valid,
    output reg        rx_error
);

    localparam CLKS_PER_BIT = CLK_FREQ / BAUD_RATE; // ~104 for 12MHz @ 115200
    localparam HALF_BIT     = CLKS_PER_BIT / 2;

    localparam STATE_IDLE  = 3'b000;
    localparam STATE_START = 3'b001;
    localparam STATE_DATA  = 3'b010;
    localparam STATE_STOP  = 3'b011;
    localparam STATE_CLEAN = 3'b100;

    reg [2:0] state;
    reg [15:0] clk_count;
    reg [2:0]  bit_idx;
    reg [7:0]  rx_shift;
    reg        rx_sync_0, rx_sync_1; // Double-flop synchronizer against metastability

    always @(posedge clk or negedge rst_n) begin
        if (!rst_n) begin
            rx_sync_0 <= 1'b1;
            rx_sync_1 <= 1'b1;
        end else begin
            rx_sync_0 <= rx;
            rx_sync_1 <= rx_sync_0;
        end
    end

    always @(posedge clk or negedge rst_n) begin
        if (!rst_n) begin
            state     <= STATE_IDLE;
            clk_count <= 16'd0;
            bit_idx   <= 3'd0;
            rx_shift  <= 8'd0;
            rx_data   <= 8'd0;
            rx_valid  <= 1'b0;
            rx_error  <= 1'b0;
        end else begin
            rx_valid <= 1'b0;
            rx_error <= 1'b0;

            case (state)
                STATE_IDLE: begin
                    clk_count <= 16'd0;
                    bit_idx   <= 3'd0;
                    if (rx_sync_1 == 1'b0) begin // Start bit falling edge
                        state <= STATE_START;
                    end
                end

                STATE_START: begin
                    if (clk_count == (HALF_BIT - 1)) begin
                        if (rx_sync_1 == 1'b0) begin // Verify start bit mid-sample
                            clk_count <= 16'd0;
                            state     <= STATE_DATA;
                        end else begin
                            state <= STATE_IDLE; // False start bit
                        end
                    end else begin
                        clk_count <= clk_count + 1'b1;
                    end
                end

                STATE_DATA: begin
                    if (clk_count == (CLKS_PER_BIT - 1)) begin
                        clk_count <= 16'd0;
                        rx_shift[bit_idx] <= rx_sync_1;
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
                    if (clk_count == (CLKS_PER_BIT - 1)) begin
                        clk_count <= 16'd0;
                        if (rx_sync_1 == 1'b1) begin // Valid stop bit
                            rx_data  <= rx_shift;
                            rx_valid <= 1'b1;
                            state    <= STATE_CLEAN;
                        end else begin
                            rx_error <= 1'b1; // Framing error
                            state    <= STATE_CLEAN;
                        end
                    end else begin
                        clk_count <= clk_count + 1'b1;
                    end
                end

                STATE_CLEAN: begin
                    state <= STATE_IDLE;
                end

                default: state <= STATE_IDLE;
            endcase
        end
    end

endmodule
