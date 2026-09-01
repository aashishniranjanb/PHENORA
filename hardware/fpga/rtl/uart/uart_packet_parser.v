// ============================================================================
// PHENORA FPGA UART Packet Parser
// Parses incoming frames: [AA 55] [TYPE] [SEQ] [FEATURE_H] [FEATURE_L] [FLAGS] [CHECKSUM]
// Target: Lattice iCE40UP5K
// ============================================================================

`include "../package/protocol_constants.v"

module uart_packet_parser (
    input  wire        clk,
    input  wire        rst_n,
    input  wire  [7:0] rx_byte,
    input  wire        rx_valid,
    output reg         packet_valid,
    output reg         packet_error,
    output reg   [7:0] packet_type,
    output reg   [7:0] packet_sequence,
    output reg  [15:0] packet_feature, // 16-bit Q8.8 signed fixed point
    output reg   [7:0] packet_flags,
    output reg         seq_error
);

    localparam ST_WAIT_H1   = 4'd0;
    localparam ST_WAIT_H2   = 4'd1;
    localparam ST_TYPE      = 4'd2;
    localparam ST_SEQ       = 4'd3;
    localparam ST_FEAT_HIGH = 4'd4;
    localparam ST_FEAT_LOW  = 4'd5;
    localparam ST_FLAGS     = 4'd6;
    localparam ST_CHECKSUM  = 4'd7;
    localparam ST_VERIFY    = 4'd8;

    reg [3:0] state;
    reg [7:0] calculated_xor;
    reg [7:0] expected_seq;
    reg       has_first_pkt;

    always @(posedge clk or negedge rst_n) begin
        if (!rst_n) begin
            state          <= ST_WAIT_H1;
            packet_valid   <= 1'b0;
            packet_error   <= 1'b0;
            packet_type    <= 8'd0;
            packet_sequence<= 8'd0;
            packet_feature <= 16'd0;
            packet_flags   <= 8'd0;
            calculated_xor <= 8'd0;
            expected_seq   <= 8'd0;
            seq_error      <= 1'b0;
            has_first_pkt  <= 1'b0;
        end else begin
            packet_valid <= 1'b0;
            packet_error <= 1'b0;

            if (rx_valid) begin
                case (state)
                    ST_WAIT_H1: begin
                        if (rx_byte == `HEADER_BYTE_1) begin
                            state <= ST_WAIT_H2;
                        end
                    end

                    ST_WAIT_H2: begin
                        if (rx_byte == `HEADER_BYTE_2) begin
                            calculated_xor <= 8'h00;
                            state          <= ST_TYPE;
                        end else begin
                            state <= ST_WAIT_H1; // Invalid header alignment
                        end
                    end

                    ST_TYPE: begin
                        packet_type    <= rx_byte;
                        calculated_xor <= calculated_xor ^ rx_byte;
                        state          <= ST_SEQ;
                    end

                    ST_SEQ: begin
                        packet_sequence <= rx_byte;
                        calculated_xor  <= calculated_xor ^ rx_byte;
                        if (has_first_pkt && (rx_byte != expected_seq)) begin
                            seq_error <= 1'b1;
                        end else begin
                            seq_error <= 1'b0;
                        end
                        expected_seq  <= rx_byte + 1'b1;
                        has_first_pkt <= 1'b1;
                        state         <= ST_FEAT_HIGH;
                    end

                    ST_FEAT_HIGH: begin
                        packet_feature[15:8] <= rx_byte;
                        calculated_xor       <= calculated_xor ^ rx_byte;
                        state                <= ST_FEAT_LOW;
                    end

                    ST_FEAT_LOW: begin
                        packet_feature[7:0] <= rx_byte;
                        calculated_xor      <= calculated_xor ^ rx_byte;
                        state               <= ST_FLAGS;
                    end

                    ST_FLAGS: begin
                        packet_flags   <= rx_byte;
                        calculated_xor <= calculated_xor ^ rx_byte;
                        state          <= ST_CHECKSUM;
                    end

                    ST_CHECKSUM: begin
                        if (rx_byte == calculated_xor) begin
                            packet_valid <= 1'b1;
                        end else begin
                            packet_error <= 1'b1;
                        end
                        state <= ST_WAIT_H1;
                    end

                    default: state <= ST_WAIT_H1;
                endcase
            end
        end
    end

endmodule
