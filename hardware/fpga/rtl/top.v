// ============================================================================
// PHENORA FPGA TOP-LEVEL EDGE DECISION ENGINE
// Target: VSDSquadron FPGA Mini (Lattice iCE40UP5K @ 12 MHz)
// ============================================================================

`include "package/protocol_constants.v"
`include "uart/uart_rx.v"
`include "uart/uart_tx.v"
`include "uart/uart_packet_parser.v"
`include "signal/signal_filter.v"
`include "signal/baseline_tracker.v"
`include "signal/delta_calculator.v"
`include "signal/slope_calculator.v"
`include "signal/stability_detector.v"
`include "confidence/confidence_engine.v"
`include "decision/adaptive_fsm.v"
`include "output/led_status.v"
`include "output/status_registers.v"

module phenora_fpga_top (
    input  wire clk_12mhz,     // Onboard 12 MHz oscillator
    input  wire rst_n,         // Active-low master reset
    input  wire uart_rx_pin,   // UART RX pin from Heltec ESP32-S3
    output wire uart_tx_pin,   // UART TX pin to Heltec ESP32-S3
    output wire led_red_pin,   // Onboard RGB LED Red pin
    output wire led_green_pin, // Onboard RGB LED Green pin
    output wire led_blue_pin   // Onboard RGB LED Blue pin
);

    // ------------------------------------------------------------------------
    // Wires & Interconnect Signals
    // ------------------------------------------------------------------------
    wire [7:0]  rx_byte;
    wire        rx_valid;
    wire        rx_err;

    wire        pkt_valid;
    wire        pkt_err;
    wire [7:0]  pkt_type;
    wire [7:0]  pkt_seq;
    wire [15:0] pkt_feature;
    wire [7:0]  pkt_flags;
    wire        seq_err;

    wire signed [15:0] filtered_feat;
    wire               filtered_valid;

    wire signed [15:0] baseline_val;
    wire               baseline_valid;

    wire signed [16:0] delta_feat;
    wire               delta_valid;
    wire               baseline_err;

    wire signed [16:0] slope_val;
    wire               slope_valid;

    wire               is_quiet;
    wire               is_active;
    wire               is_stable;
    wire               detector_valid;

    wire               quality_ok;
    wire               conf_ok;
    wire               anomaly;

    wire [2:0]         fsm_state;
    wire [1:0]         decision;
    wire [7:0]         stable_cnt;
    wire [15:0]        measurement_cnt;

    // Thresholds (Q8.8 Fixed-Point & Integer parameters)
    // active_slope_threshold = 0.0005 * 256 approx 0
    // stability_slope_threshold = 0.0003 * 256 approx 0
    // quiet_threshold = 0.0001 * 256 approx 0
    localparam signed [16:0] PARAM_ACTIVE_THRESH    = 17'sd0;
    localparam signed [16:0] PARAM_STABILITY_THRESH = 17'sd0;
    localparam signed [15:0] PARAM_QUIET_THRESH     = 16'sd0;

    wire capture_baseline_cmd = pkt_valid && (pkt_type == `PKT_TYPE_BASELINE);
    wire clear_baseline_cmd   = pkt_valid && (pkt_type == `PKT_TYPE_RESET);

    // ------------------------------------------------------------------------
    // Submodule Instantiations
    // ------------------------------------------------------------------------

    uart_rx #(
        .CLK_FREQ(`CLK_FREQ_HZ),
        .BAUD_RATE(`BAUD_RATE)
    ) u_uart_rx (
        .clk      (clk_12mhz),
        .rst_n    (rst_n),
        .rx       (uart_rx_pin),
        .rx_data  (rx_byte),
        .rx_valid (rx_valid),
        .rx_error (rx_err)
    );

    uart_packet_parser u_pkt_parser (
        .clk             (clk_12mhz),
        .rst_n           (rst_n),
        .rx_byte         (rx_byte),
        .rx_valid        (rx_valid),
        .packet_valid    (pkt_valid),
        .packet_error    (pkt_err),
        .packet_type     (pkt_type),
        .packet_sequence (pkt_seq),
        .packet_feature  (pkt_feature),
        .packet_flags    (pkt_flags),
        .seq_error       (seq_err)
    );

    signal_filter u_signal_filter (
        .clk             (clk_12mhz),
        .rst_n           (rst_n),
        .raw_feature     ($signed(pkt_feature)),
        .feature_valid   (pkt_valid && (pkt_type == `PKT_TYPE_FEATURE_DATA)),
        .filtered_feature(filtered_feat),
        .filtered_valid  (filtered_valid)
    );

    baseline_tracker u_baseline_tracker (
        .clk             (clk_12mhz),
        .rst_n           (rst_n),
        .current_feature (filtered_feat),
        .capture_cmd     (capture_baseline_cmd),
        .clear_cmd       (clear_baseline_cmd),
        .baseline_value  (baseline_val),
        .baseline_valid  (baseline_valid)
    );

    delta_calculator u_delta_calc (
        .clk                 (clk_12mhz),
        .rst_n               (rst_n),
        .filtered_feature    (filtered_feat),
        .baseline_value      (baseline_val),
        .baseline_valid      (baseline_valid),
        .feature_valid       (filtered_valid),
        .delta_feature       (delta_feat),
        .delta_valid         (delta_valid),
        .baseline_ready_error(baseline_err)
    );

    slope_calculator #(
        .K_DELAY(2)
    ) u_slope_calc (
        .clk          (clk_12mhz),
        .rst_n        (rst_n),
        .feature_in   (filtered_feat),
        .feature_valid(filtered_valid),
        .slope_out    (slope_val),
        .slope_valid  (slope_valid)
    );

    stability_detector u_stability_det (
        .clk                (clk_12mhz),
        .rst_n              (rst_n),
        .slope_in           (slope_val),
        .feature_in         (filtered_feat),
        .slope_valid        (slope_valid),
        .active_threshold   (PARAM_ACTIVE_THRESH),
        .stability_threshold(PARAM_STABILITY_THRESH),
        .quiet_threshold    (PARAM_QUIET_THRESH),
        .is_quiet           (is_quiet),
        .is_active          (is_active),
        .is_stable          (is_stable),
        .detector_valid     (detector_valid)
    );

    confidence_engine u_conf_engine (
        .clk                     (clk_12mhz),
        .rst_n                   (rst_n),
        .packet_flags            (pkt_flags),
        .min_quality_threshold   (8'd0),
        .min_confidence_threshold(8'd0),
        .quality_acceptable      (quality_ok),
        .confidence_acceptable   (conf_ok),
        .anomaly_detected        (anomaly)
    );

    adaptive_fsm u_adaptive_fsm (
        .clk                     (clk_12mhz),
        .rst_n                   (rst_n),
        .sample_valid            (detector_valid),
        .sample_idx              (measurement_cnt),
        .raw_delta_R             (filtered_feat),
        .slope                   (slope_val),
        .is_quiet                (is_quiet),
        .is_active               (is_active),
        .is_stable               (is_stable),
        .quality_ok              (quality_ok),
        .anomaly_detected        (anomaly),
        .reset_run               (clear_baseline_cmd),
        .min_samples             (`DEFAULT_MIN_SAMPLES),
        .required_stable_windows (`DEFAULT_STABLE_WINDOWS),
        .max_measurement_windows (`DEFAULT_MAX_WINDOWS),
        .fsm_state               (fsm_state),
        .decision_out            (decision),
        .stable_count_out        (stable_cnt),
        .measurement_count       (measurement_cnt)
    );

    led_status u_led_status (
        .clk       (clk_12mhz),
        .rst_n     (rst_n),
        .fsm_state (fsm_state),
        .decision  (decision),
        .led_red   (led_red_pin),
        .led_green (led_green_pin),
        .led_blue  (led_blue_pin)
    );

    // Dynamic UART TX Response Trigger (Sends status packet on decision state transition)
    reg tx_trigger;
    reg [7:0] tx_byte_out;
    wire tx_busy;
    wire tx_done;

    uart_tx #(
        .CLK_FREQ(`CLK_FREQ_HZ),
        .BAUD_RATE(`BAUD_RATE)
    ) u_uart_tx (
        .clk      (clk_12mhz),
        .rst_n    (rst_n),
        .tx_data  (tx_byte_out),
        .tx_start (tx_trigger),
        .tx       (uart_tx_pin),
        .tx_busy  (tx_busy),
        .tx_done  (tx_done)
    );

    always @(posedge clk_12mhz or negedge rst_n) begin
        if (!rst_n) begin
            tx_trigger  <= 1'b0;
            tx_byte_out <= 8'd0;
        end else begin
            tx_trigger <= 1'b0;
            if (detector_valid && !tx_busy) begin
                tx_byte_out <= {3'b0, fsm_state, decision};
                tx_trigger  <= 1'b1;
            end
        end
    end

endmodule
