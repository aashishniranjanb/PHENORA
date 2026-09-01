// ============================================================================
// PHENORA FPGA End-to-End System Testbench
// Verifies UART Frame Injection, Packet Parser, FSM, and Response Telemetry
// Target: Lattice iCE40UP5K
// ============================================================================

`timescale 1ns/1ps
`include "../rtl/package/protocol_constants.v"
`include "../rtl/top.v"

module system_tb;

    reg  clk_12mhz;
    reg  rst_n;
    reg  uart_rx_pin;
    wire uart_tx_pin;
    wire led_red_pin;
    wire led_green_pin;
    wire led_blue_pin;

    // Instantiate Top Module
    phenora_fpga_top u_top (
        .clk_12mhz    (clk_12mhz),
        .rst_n        (rst_n),
        .uart_rx_pin  (uart_rx_pin),
        .uart_tx_pin  (uart_tx_pin),
        .led_red_pin  (led_red_pin),
        .led_green_pin(led_green_pin),
        .led_blue_pin (led_blue_pin)
    );

    // 12 MHz Clock
    always #41.666 clk_12mhz = ~clk_12mhz;

    // Task to send a single UART byte at 115200 baud
    task send_uart_byte(input [7:0] data_byte);
        integer i;
        begin
            // Start Bit (LOW)
            uart_rx_pin = 1'b0;
            #8680.55; // 1 bit period @ 115200 (8.68 us)

            // 8 Data Bits LSB first
            for (i = 0; i < 8; i = i + 1) begin
                uart_rx_pin = data_byte[i];
                #8680.55;
            end

            // Stop Bit (HIGH)
            uart_rx_pin = 1'b1;
            #8680.55;
        end
    endtask

    // Task to send a complete 8-byte PHENORA packet frame
    task send_phenora_packet(
        input [7:0]  pkt_type,
        input [7:0]  pkt_seq,
        input [15:0] pkt_feature,
        input [7:0]  pkt_flags
    );
        reg [7:0] chksum;
        begin
            chksum = pkt_type ^ pkt_seq ^ pkt_feature[15:8] ^ pkt_feature[7:0] ^ pkt_flags;

            send_uart_byte(`HEADER_BYTE_1);
            send_uart_byte(`HEADER_BYTE_2);
            send_uart_byte(pkt_type);
            send_uart_byte(pkt_seq);
            send_uart_byte(pkt_feature[15:8]);
            send_uart_byte(pkt_feature[7:0]);
            send_uart_byte(pkt_flags);
            send_uart_byte(chksum);

            #20000; // Small intra-frame delay
        end
    endtask

    initial begin
        $display("==========================================================================");
        $display("STARTING PHENORA END-TO-END UART SYSTEM TESTBENCH");
        $display("==========================================================================");

        clk_12mhz   = 0;
        rst_n       = 0;
        uart_rx_pin = 1;

        #500;
        rst_n = 1;
        #1000;

        $display("\n1. Sending RESET packet...");
        send_phenora_packet(`PKT_TYPE_RESET, 8'd1, 16'd0, 8'h01);

        $display("\n2. Sending CAPTURE BASELINE packet (F_before_dose = 100.0 / Q8.8 = 25600)...");
        send_phenora_packet(`PKT_TYPE_BASELINE, 8'd2, 16'd25600, 8'h01);

        $display("\n3. Sending FEATURE_DATA sample stream...");
        send_phenora_packet(`PKT_TYPE_FEATURE_DATA, 8'd3, 16'd25600, 8'h01);
        send_phenora_packet(`PKT_TYPE_FEATURE_DATA, 8'd4, 16'd25600, 8'h01);
        send_phenora_packet(`PKT_TYPE_FEATURE_DATA, 8'd5, 16'd25600, 8'h01);
        send_phenora_packet(`PKT_TYPE_FEATURE_DATA, 8'd6, 16'd25600, 8'h01);
        send_phenora_packet(`PKT_TYPE_FEATURE_DATA, 8'd7, 16'd25600, 8'h01);

        #100000;
        $display("\n==========================================================================");
        $display("SYSTEM TEST COMPLETED: LED RGB Pin State: R=%b G=%b B=%b", led_red_pin, led_green_pin, led_blue_pin);
        $display("==========================================================================");
        $finish;
    end

endmodule
