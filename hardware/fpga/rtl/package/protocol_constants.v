// ============================================================================
// PHENORA FPGA Protocol & Hardware Constants
// Target: Lattice iCE40UP5K (VSDSquadron FPGA Mini @ 12 MHz)
// ============================================================================

`ifndef PHENORA_PROTOCOL_CONSTANTS_V
`define PHENORA_PROTOCOL_CONSTANTS_V

// ----------------------------------------------------------------------------
// Packet Header Sync Bytes
// ----------------------------------------------------------------------------
`define HEADER_BYTE_1       8'hAA
`define HEADER_BYTE_2       8'h55

// ----------------------------------------------------------------------------
// Command / Packet Types (Heltec -> FPGA)
// ----------------------------------------------------------------------------
`define PKT_TYPE_RESET          8'h01  // System reset command
`define PKT_TYPE_START_RUN      8'h02  // Begin measurement run
`define PKT_TYPE_BASELINE       8'h03  // Capture baseline pre-dose feature
`define PKT_TYPE_FEATURE_DATA   8'h04  // 16-bit Q8.8 feature payload
`define PKT_TYPE_END_RUN        8'h05  // Halt current run
`define PKT_TYPE_STATUS_REQ     8'h06  // Query FPGA telemetry

// ----------------------------------------------------------------------------
// Response Packet Types (FPGA -> Heltec)
// ----------------------------------------------------------------------------
`define PKT_TYPE_TELEMETRY     8'h84  // Standard telemetry & status response
`define PKT_TYPE_DECISION_ACK  8'h85  // Latching decision result packet

// ----------------------------------------------------------------------------
// State Machine Encodings (reg [2:0] state)
// ----------------------------------------------------------------------------
`define FSM_IDLE         3'b000  // Waiting for run start
`define FSM_MEASURING    3'b001  // Acquiring feature stream / quiet baseline
`define FSM_ANALYZING    3'b002  // Slope actively changing / signal evolving
`define FSM_STABLE       3'b011  // Slope settled within stability threshold
`define FSM_STOP         3'b100  // Halting criteria satisfied (STOP)
`define FSM_TIMEOUT      3'b101  // Max measurement windows reached without STOP
`define FSM_ERROR        3'b110  // Checksum / baseline / sequence fault

// ----------------------------------------------------------------------------
// Decision Encodings (reg [1:0] decision)
// ----------------------------------------------------------------------------
`define DECISION_NONE           2'b00
`define DECISION_MEASURE_AGAIN  2'b01
`define DECISION_STOP           2'b10
`define DECISION_TIMEOUT        2'b11

// ----------------------------------------------------------------------------
// Fixed-Point Formatting Constants (Q8.8)
// ----------------------------------------------------------------------------
// 1 Sign bit, 7 Integer bits, 8 Fractional bits
// Example: 1.000 -> 16'sh0100 (256 decimal)
// Resolution: 1/256 = 0.00390625 per LSB
`define Q8_8_ONE                16'sh0100
`define Q8_8_HALF               16'sh0080

// ----------------------------------------------------------------------------
// Hardware Defaults & Thresholds
// ----------------------------------------------------------------------------
`define CLK_FREQ_HZ             12000000
`define BAUD_RATE               115200

// Default Baud Divider = 12,000,000 / 115,200 approx 104
`define BAUD_DIVISOR            16'd104

// Filter Window Size (N=3 moving average)
`define FILTER_WINDOW_SIZE      3

// Minimum samples before active analysis can transition to STABLE/STOP
`define DEFAULT_MIN_SAMPLES     8'd3

// Default Required Consecutive Stable Windows for STOP
`define DEFAULT_STABLE_WINDOWS  8'd2

// Maximum allowed measurement windows before TIMEOUT
`define DEFAULT_MAX_WINDOWS     16'd100

`endif // PHENORA_PROTOCOL_CONSTANTS_V
