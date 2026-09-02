
Aashish 2023 <aashishniranjanb2023@gmail.com>
10:58 PM (0 minutes ago)
to me

https://github.com/aashishniranjanb/PHENORA

Yes. Person C is the most important implementation role in PHENORA, because this person turns everything produced by Person A + Person B into the actual edge decision engine.

For Person C, I would make the responsibility much more concrete than simply saying “build the FPGA.”

The end goal is:

Person A
SignalFeatures
      ↓
Person B
quality + trajectory + confidence
      ↓
===============================
        PERSON C
===============================
      ↓
FPGA / Edge Decision Engine
      ↓
FILTER
      ↓
BASELINE / ΔF
      ↓
SLOPE
      ↓
STABILITY
      ↓
EVIDENCE ACCUMULATION
      ↓
ADAPTIVE FSM
      ↓
 ┌──────────┬───────────────┐
 │          │               │
STOP    MEASURE AGAIN    TIMEOUT
This is the part of PHENORA that the project identifies as its candidate differentiation: a confidence-driven closed-loop measurement-scheduling layer rather than merely another impedance sensor.

There is one important correction from the latest project state:

Person C must implement the current sequential single-chamber architecture, not the older idealized two-well simultaneous differential architecture.

The current design is:

ZERO
  ↓
CONTROL
  ↓
TEST / post-dose
  ↓
same chamber / same electrode pair
  ↓
before-vs-after baseline comparison
with:

ΔF(t) = F(t) - F(t_before_antibiotic_addition)
rather than assuming simultaneous TEST - CONTROL. The project context explicitly says the FPGA/FSM must follow this sequential protocol.

PERSON C — COMPLETE END-TO-END PLAN
1. PERSON C's ultimate goal
The final goal is to build a real FPGA-based adaptive measurement controller.

Not:

❌ just an LED blink
❌ just UART receiver
❌ just a filter
❌ just a slope calculator
❌ just a state machine in software
It needs to become:

                   HELTEC
                     │
                     │ UART
                     ▼
              ┌──────────────┐
              │    FPGA      │
              │              │
              │ Receive      │
              │ Validate     │
              │ Filter       │
              │ Baseline     │
              │ ΔF            │
              │ Slope        │
              │ Stability    │
              │ Evidence     │
              │ Confidence   │
              │ FSM          │
              └──────┬───────┘
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
        STOP      REPEAT     TIMEOUT
The FPGA should make the decision locally and deterministically, without requiring cloud computation. That is the intended PHENORA architecture.

2. What Person C receives
Person C receives data from Person A and Person B through the Heltec.

The logical pipeline is:

Sensor
 ↓
Heltec
 ↓
Person A
 ↓
SignalFeatures
 ↓
Person B
 ↓
MLResult
 ↓
UART
 ↓
Person C / FPGA
However, for the actual current implementation, there are two practical options.

Option A — preferred
Heltec sends the FPGA the minimum decision-relevant values:

feature
delta
slope
quality
flags
sequence
Option B — simpler V1
Heltec sends the primary working feature:

F(t)
and FPGA computes:

baseline
ΔF
slope
stability
decision
Given the project architecture, Option B is preferable for demonstrating the FPGA contribution.

3. Current hardware reality
The actual current signal chain is:

NE555
 ↓
Safety-pin electrode pair
 ↓
LM358
 ↓
ADS1115
 ↓
Heltec ESP32-S3
 ↓ UART
VSDSquadron iCE40UP5K
 ↓
Adaptive FSM
But only some portions are currently completed.

The project context explicitly says the NE555/electrode work is active, while LM358 conditioning, ADS1115 integration, Heltec firmware and FPGA FSM are still sequential next steps.

So Person C should build and validate the FPGA independently using synthetic UART/input data first.

Do not wait for the complete sensor chain.

4. Hardware Person C is targeting
The target is:

VSDSquadron FPGA Mini / Lattice iCE40UP5K.

The official board documentation lists:

5,280 logic cells
4,960 flip-flops
120 kbit SRAM
4 MB SPI flash
32 FPGA GPIO exposed
3.3 V I/O capability
12 MHz onboard oscillator
and gives Yosys, NextPNR and Project IceStorm as the development toolchain.

This is enough for the V1 adaptive logic.

5. Person C's branch
Use:

git checkout main
git pull
git checkout -b feature/fpga-adaptive-engine
If your team has already merged Person A and B:

git merge feature/signal-quality
git merge feature/signal-intelligence
Then:

git status
6. Person C's folder structure
I recommend:

fpga/
│
├── rtl/
│   ├── top.v
│   │
│   ├── uart/
│   │   ├── uart_rx.v
│   │   ├── uart_tx.v
│   │   └── uart_packet_parser.v
│   │
│   ├── signal/
│   │   ├── signal_filter.v
│   │   ├── baseline_tracker.v
│   │   ├── delta_calculator.v
│   │   ├── slope_calculator.v
│   │   └── stability_detector.v
│   │
│   ├── confidence/
│   │   └── confidence_engine.v
│   │
│   ├── decision/
│   │   ├── evidence_accumulator.v
│   │   └── adaptive_fsm.v
│   │
│   ├── output/
│   │   ├── status_registers.v
│   │   └── led_status.v
│   │
│   └── package/
│       └── protocol_constants.v
│
├── tb/
│   ├── uart_rx_tb.v
│   ├── delta_tb.v
│   ├── slope_tb.v
│   ├── stability_tb.v
│   ├── confidence_tb.v
│   ├── adaptive_fsm_tb.v
│   └── system_tb.v
│
├── constraints/
│   └── vsdsquadron.pcf
│
├── sim/
│   └── test_vectors/
│
├── Makefile
└── README.md
Adapt this to whatever FPGA repository already exists.

Do not create a second unrelated FPGA project if one already exists.

7. First milestone — make the FPGA itself work
Before implementing PHENORA:

PC
 ↓
VSDSquadron
 ↓
FPGA programmed
 ↓
RGB LED works
Use the board's existing build system.

The official VSD documentation demonstrates:

make clean
make build
sudo make flash
and confirms successful flashing through the board's status LEDs.

Person C should reproduce this first.

8. Second milestone — clock
Use the board's documented clock resources.

The board documentation identifies a 12 MHz onboard oscillator and an external clock option.

For V1:

12 MHz
 ↓
system clock
Don't unnecessarily introduce PLL complexity.

9. Third milestone — UART receiver
This is the first real PHENORA interface.

The architecture specifies:

Heltec TX
     ↓
FPGA RX

FPGA TX
     ↓
Heltec RX
at:

115200 baud
8 data bits
no parity
1 stop bit
The project document defines this as the design-stage UART interface.

Important:

The UART protocol is not yet hardware-verified, so Person C must treat the packet structure as a versioned engineering interface, not as an already-proven hardware standard.

10. UART packet
The current proposed packet is:

[AA 55]
[TYPE]
[SEQUENCE]
[FEATURE:16-bit]
[FLAGS]
[CHECKSUM:XOR]
Person C should implement:

UART RX
   ↓
detect AA
   ↓
detect 55
   ↓
read TYPE
   ↓
read SEQUENCE
   ↓
read FEATURE
   ↓
read FLAGS
   ↓
read CHECKSUM
   ↓
verify checksum
   ↓
VALID / INVALID
11. UART parser state machine
Something like:

WAIT_HEADER_1
      ↓
WAIT_HEADER_2
      ↓
READ_TYPE
      ↓
READ_SEQUENCE
      ↓
READ_FEATURE_HIGH
      ↓
READ_FEATURE_LOW
      ↓
READ_FLAGS
      ↓
READ_CHECKSUM
      ↓
VERIFY
   ↙       ↘
VALID     INVALID
 ↓           ↓
PROCESS    DISCARD
This should be a separate FSM from the main adaptive decision FSM.

Do not combine everything into one 500-line state machine.

12. Packet validation
Person C should reject:

wrong header
wrong packet length
bad checksum
unexpected type
and expose:

packet_valid
packet_error
sequence_number
This is important because later the system may be physically connected with noisy UART wiring.

13. Sequence number
The sequence byte lets you detect:

packet loss
duplicate packet
out-of-order packet
Example:

1
2
3
4
5
If FPGA receives:

1
2
4
it knows:

packet 3 missing
For V1, don't overcomplicate recovery. Log it and mark the measurement invalid if appropriate.

14. Feature representation
This is extremely important.

The FPGA is not a floating-point computer.

Do not send:

"0.823947"
as ASCII unless there is a strong reason.

Prefer:

16-bit fixed-point integer
Example:

Q8.8
meaning:

8 integer bits
8 fractional bits
So:

0.5 → 128
1.0 → 256
2.0 → 512
The exact scaling should be agreed with Person A/B.

If their feature range is different, select the appropriate Q format.

Do not invent the final scaling until you inspect Person A's actual output range.

15. Why fixed-point?
The project foundation explicitly proposes fixed-point arithmetic for slope calculation to avoid floating-point/division-heavy FPGA implementation.

So Person C should use:

integer arithmetic
+
signed values
+
controlled bit widths
where practical.

16. Fourth milestone — input register
After UART:

feature_register
should hold:

current_feature
Example:

reg signed [15:0] current_feature;
Then generate:

feature_valid
for one clock or controlled processing event.

17. Fifth milestone — filtering
Person C now implements:

current feature
      ↓
digital filter
      ↓
filtered feature
V1 should be simple.

For example:

moving average
or:

exponential-ish integer smoothing
depending on implementation constraints.

Do not build a huge DSP system.

The purpose is:

remove small measurement fluctuations
before calculating the decision variables.

18. Filter example
Suppose:

100
101
99
100
102
A moving average produces a smoother trajectory.

Conceptually:

raw:

_/\/\_

filtered:

──────
The exact filter window must be configurable.

Example:

WINDOW_SIZE = 4
but this is an engineering parameter, not a scientifically validated value.

19. Sixth milestone — baseline capture
This is where the current project architecture matters.

The old conceptual architecture used:

TEST - CONTROL
But the current physical design is:

one chamber
one electrode pair
before dose
after dose
Therefore Person C must implement:

baseline = F_before_antibiotic_addition
Then:

ΔF(t) = F(t) - baseline
The project context explicitly requires this sequential baseline definition for the current FPGA FSM.

20. Baseline FSM
Add a baseline state:

WAIT_FOR_START
      ↓
CAPTURE_BASELINE
      ↓
BASELINE_READY
      ↓
MEASUREMENT
When the system receives a baseline capture command:

baseline <= current_feature
Then:

baseline_valid = 1
21. Why explicit baseline capture matters
Do not automatically use:

first packet received
as baseline.

There needs to be an explicit event.

Otherwise you could accidentally capture:

noise
startup transient
electrode settling
wrong tube
as the baseline.

22. Add phase information
The current experiment has:

ZERO
CONTROL_PRE_DOSE
TEST_POST_DOSE
The project data schema specifically requires recording the phase of each measurement.

Person C should therefore support control commands such as:

SET_PHASE_ZERO
SET_PHASE_CONTROL
SET_PHASE_TEST
or equivalent flags.

The FPGA doesn't need to understand biology.

It just needs to know:

which phase is active
for correct baseline/decision behavior.

23. Seventh milestone — delta calculator
Implement:

delta = filtered_feature - baseline
Mathematically:

ΔF(t) = F(t) - F(t_before_dose)
Use signed arithmetic.

This matters because:

delta > 0
and:

delta < 0
must both be representable.

24. Protect against overflow
Person C must calculate bit widths.

For example:

feature = signed 16-bit
baseline = signed 16-bit
Do not automatically assume:

delta = signed 16-bit
because:

32767 - (-32768)
doesn't fit in signed 16-bit.

Use a wider intermediate:

signed 17-bit
or larger as required.

This should be checked systematically throughout the pipeline.

25. Eighth milestone — slope
The project defines:

slope[n] = delta[n] - delta[n-4]
Implement this exactly for V1.

Architecture:

delta[n]
   │
   ├───────────────┐
   │               │
   │           delay 4
   │               │
   └───────┬───────┘
           ▼
       subtract
           ↓
         slope
26. Delay line
Store:

delta[n-1]
delta[n-2]
delta[n-3]
delta[n-4]
using registers or a small shift-register structure.

Every valid new sample:

d4 <= d3
d3 <= d2
d2 <= d1
d1 <= current_delta
then calculate:

slope = current_delta - d4
27. Why not calculate mathematical slope with division?
Because V1 doesn't need:

dy / dt
if the sampling interval is fixed.

The project deliberately defines a simple finite difference that can be implemented using fixed-point/integer arithmetic.

So:

difference
is sufficient.

28. Ninth milestone — stability
This is the second critical part.

The project defines:

range =
max(recent slopes)
-
min(recent slopes)
A low range means the trend has settled.

So Person C should maintain a small slope history:

slope[n]
slope[n-1]
slope[n-2]
...
Then:

maxSlope
minSlope
and:

stabilityRange = maxSlope - minSlope
29. Stability decision
Configuration:

STABILITY_RANGE_THRESHOLD
Then:

if stabilityRange <= threshold
    stable_window = true
else
    stable_window = false
Again:

The threshold is a prototype engineering parameter. It is not a clinically validated cutoff.

30. Tenth milestone — consecutive stability
A single stable window is not enough.

The project explicitly requires:

stable for N consecutive windows
before STOP.

So create:

stable_count
Logic:

stable_window = true
      ↓
stable_count++
If:

stable_window = false
then:

stable_count = 0
or another clearly documented hysteresis strategy.

For V1, resetting is simplest.

31. Example
Suppose:

N = 4
Then:

window 1 → stable
window 2 → stable
window 3 → stable
window 4 → stable
Now:

stable_count = 4
and the FSM may consider STOP.

But:

stable
stable
unstable
stable
must not reach four consecutive stable windows.

32. Eleventh milestone — Person B confidence
This is where Person C integrates Person B.

Person B may provide:

quality
trajectory
confidence
anomaly
Person C should receive those as flags/values.

For example:

quality_good
trajectory_valid
confidence_high
anomaly_present
Do not recreate Person B's entire algorithm in FPGA.

Person B owns intelligence.

Person C consumes it as evidence.

33. Person B → Person C contract
Use something conceptually like:

Person B
────────

quality       0..255
confidence    0..255
trajectory    enum
anomaly       0..255
flags         bitfield
Then:

UART
 ↓
FPGA
 ↓
Decision Evidence
The exact packet should be agreed between A/B/C.

34. Suggested flags
Example:

bit 0 = signal usable
bit 1 = trajectory stable
bit 2 = trajectory rising
bit 3 = trajectory falling
bit 4 = noisy
bit 5 = drifting
bit 6 = anomaly
bit 7 = baseline valid
Do not lock these values until the team agrees on the protocol.

Put them in:

protocol_constants.v
and in the shared protocol document.

35. Twelfth milestone — evidence engine
Now we reach the actual PHENORA idea.

Don't immediately do:

if confidence > X:
    STOP
That is too simplistic.

Instead accumulate evidence over time.

For example:

measurement
    ↓
quality good?
    ↓
trajectory consistent?
    ↓
anomaly acceptable?
    ↓
stable?
    ↓
stable count++
    ↓
evidence score++
This creates a real adaptive loop.

36. Evidence accumulator
Create:

evidence_score
or preferably several counters:

stable_windows
valid_windows
good_quality_windows
anomaly_windows
Then Person C can make the decision from history rather than a single measurement.

37. Example evidence
Suppose:

N = 5
and:

window 1 → usable + stable
window 2 → usable + stable
window 3 → usable + stable
window 4 → usable + stable
window 5 → usable + stable
Then:

evidence sufficient
→ STOP.

38. But if the signal becomes noisy
Example:

window 1 → stable
window 2 → stable
window 3 → noisy
window 4 → stable
window 5 → stable
Then:

consecutive stability = 2
not 5.

Therefore:

MEASURE AGAIN
This is the adaptive behavior you want to demonstrate.

39. Thirteenth milestone — confidence gate
Use Person B's confidence.

Example concept:

quality >= QUALITY_MIN
AND
confidence >= CONFIDENCE_MIN
AND
anomaly <= ANOMALY_MAX
AND
stable_count >= N
then:

STOP
Otherwise:

MEASURE AGAIN
These are configurable development parameters.

40. Important: STOP does not mean "susceptible"
This is a very important distinction.

The FPGA is deciding:

"Do we have enough signal evidence to stop measuring?"
It is not necessarily deciding:

"Is this bacterium susceptible?"
At the current V1 stage, the project does not have validated biological evidence supporting S/I/R output.

Therefore Person C's output should be:

STOP
not:

SUSCEPTIBLE
41. Fourteenth milestone — timeout
The system must never run forever.

Create:

measurement_timer
or:

window_counter
with:

MAX_MEASUREMENT_WINDOWS
If the system doesn't reach sufficient evidence:

TIMEOUT
The project explicitly defines bounded measurement and an inconclusive/timeout outcome.

42. Why timeout matters
Without timeout:

bad signal
   ↓
never stable
   ↓
measure again
   ↓
measure again
   ↓
measure again
   ↓
∞
That is unacceptable.

Instead:

MEASURING
   ↓
MAX_WINDOWS reached
   ↓
TIMEOUT
43. Fifteenth milestone — main adaptive FSM
Now combine everything.

I recommend:

IDLE
 ↓
INITIALIZE
 ↓
WAIT_BASELINE
 ↓
CAPTURE_BASELINE
 ↓
WAIT_MEASUREMENT
 ↓
FILTER
 ↓
CALCULATE_DELTA
 ↓
CALCULATE_SLOPE
 ↓
CHECK_STABILITY
 ↓
EVALUATE_EVIDENCE
 ↓
 ┌───────────────┬─────────────────┐
 ▼               ▼                 ▼
STOP        MEASURE_AGAIN       TIMEOUT
44. Better FSM structure
For implementation, use:

IDLE
BASELINE_WAIT
BASELINE_CAPTURE
MEASURE
FILTER
DELTA
SLOPE
STABILITY
EVIDENCE
DECISION
STOP
REPEAT
TIMEOUT
The actual number of states can be reduced if timing permits.

The important thing is clear separation of responsibilities.

45. FSM behavior
IDLE
Wait for:

START_RUN
BASELINE_WAIT
Wait for baseline capture.

BASELINE_CAPTURE
Store:

baseline = feature
MEASURE
Wait for:

feature_valid
FILTER
Produce:

filtered_feature
DELTA
Calculate:

delta = filtered_feature - baseline
SLOPE
Calculate:

slope = delta - delta_4
STABILITY
Calculate:

maxSlope
minSlope
range
EVIDENCE
Evaluate:

quality
confidence
anomaly
stability
DECISION
Choose:

STOP
MEASURE_AGAIN
TIMEOUT
46. STOP state
When STOP happens:

decision = STOP
decision_valid = 1
Then:

freeze measurement decision
Do not continue changing the decision every cycle.

Wait for:

RESET
or:

NEW_RUN
47. MEASURE AGAIN state
This should not mean:

reset everything
Instead:

MEASURE_AGAIN
      ↓
capture another observation/window
      ↓
continue evidence accumulation
The entire point is that the system decides:

"I don't have enough evidence yet."

48. TIMEOUT state
When maximum allowed measurement windows are reached:

decision = TIMEOUT
The UI should eventually show:

INCONCLUSIVE
rather than pretending there is a biological result.

49. Sixteenth milestone — output interface
Person C should expose outputs.

At minimum:

decision
fsm_state
feature
baseline
delta
slope
stability_range
stable_count
measurement_count
packet_valid
error_flags
For hardware debugging, also expose:

confidence
quality
anomaly
if available.

50. RGB LED
The board already contains an RGB LED that can be used for status indication.

Use it as a very simple physical demo:

IDLE
→ one state

MEASURING
→ another state

STOP
→ another state

TIMEOUT
→ another state
Do not depend on color names in the logic; define symbolic status values.

51. Seventeenth milestone — UART response
FPGA should send a result back to Heltec.

For example:

[AA 55]
[RESULT_TYPE]
[SEQUENCE]
[DECISION]
[STATE]
[CONFIDENCE]
[FLAGS]
[CHECKSUM]
This packet is a proposed response format. Define and document it jointly with the Heltec developer before implementation.

52. Heltec receives
Then:

FPGA
 ↓ UART
Heltec
 ↓
OLED
OLED can display:

PHENORA

STATE: MEASURING
CONF: 87%
STABLE: 4/5
Then:

STATE: STOP
or:

STATE: MEASURE AGAIN
or:

STATE: TIMEOUT
53. Eighteenth milestone — simulation before hardware
This is mandatory.

Person C should not start by wiring the real Heltec.

First:

Verilog/SystemVerilog testbench
          ↓
synthetic packets
          ↓
UART parser
          ↓
filter
          ↓
delta
          ↓
slope
          ↓
stability
          ↓
FSM
          ↓
decision
This is the safest and strongest validation path.

The PHENORA project specifically identifies synthetic signal-pattern testing as the strongest low-risk demonstration of the FPGA STOP/REPEAT/TIMEOUT logic before trusting physical sensor data.

54. Test Case 1 — stable signal
Input:

100
100
101
100
100
100
100
Expected:

low slope
low stability range
stable_count increases
Eventually:

STOP
55. Test Case 2 — continuously rising signal
Input:

100
110
120
130
140
150
Expected:

slope positive
trajectory consistent
Depending on your configured stability definition:

stable trend
can eventually qualify.

This is important because:

"stable" does not necessarily mean "flat."

The project defines stability in terms of consistent recent slopes, not necessarily zero slope.

56. Test Case 3 — falling signal
150
140
130
120
110
100
Expected:

negative slope
consistent trend
Then potentially:

STOP
if all evidence requirements are satisfied.

57. Test Case 4 — noisy signal
100
150
80
160
90
170
70
Expected:

high variation
unstable slope
Therefore:

MEASURE AGAIN
and eventually:

TIMEOUT
if it never settles.

58. Test Case 5 — transition
100
101
100
101
110
120
130
Expected:

initially stable
then transition
then rising
The system must not stop before the transition becomes understood.

This is one of the strongest demonstrations of adaptive logic.

59. Test Case 6 — anomaly
100
101
100
100
500
101
100
Expected:

anomaly flag
and confidence/evidence should be reduced or the window rejected according to the defined policy.

60. Test Case 7 — insufficient evidence
Feed only:

3 measurements
when:

minimum history = 5
Expected:

NOT_READY
not:

STOP
61. Test Case 8 — timeout
Feed a permanently unstable sequence:

100
140
90
150
80
160
...
until:

MAX_WINDOWS
Expected:

TIMEOUT
62. Test Case 9 — recovery from noise
This is a very good demo.

NOISY
NOISY
NOISY
STABLE
STABLE
STABLE
STABLE
STABLE
Expected:

MEASURE AGAIN
      ↓
system waits
      ↓
confidence improves
      ↓
STOP
This demonstrates adaptive measurement, not merely thresholding.

63. Test Case 10 — high confidence but not stable
Example:

quality = high
confidence = high
but:

slope still changing
Expected:

MEASURE AGAIN
This prevents the system from confusing:

good measurement quality
with:

sufficient temporal evidence.
64. Test Case 11 — stable but poor quality
Example:

slope looks stable
BUT
SNR is poor
Expected:

do not STOP
This is exactly why Person B and Person C need to work together.

65. Test Case 12 — anomaly after apparent stability
This is an especially important edge case.

stable
stable
stable
stable
anomaly
The system must define what happens.

Recommended V1:

invalidate current evidence window
reset consecutive stable count
continue measuring
Document this clearly.

66. Nineteenth milestone — hardware-in-loop test
After simulation:

Laptop
 ↓ USB/UART
Heltec or UART adapter
 ↓
FPGA
Send synthetic packets.

For example:

100
101
100
100
101
100
...
The actual FPGA should produce:

STOP
Then send noisy data:

100
160
80
150
70
...
and observe:

MEASURE AGAIN
67. Twentieth milestone — Heltec integration
Only after UART works independently:

Heltec
 ↓
FPGA
Heltec sends actual Person A/B output.

Pipeline:

ADS1115
 ↓
Heltec
 ↓
SignalFeatures
 ↓
Intelligence
 ↓
packet
 ↓
FPGA
68. Important hardware constraint
The Heltec board uses 3.3 V logic, and the VSDSquadron board's default I/O is also 3.3 V according to the project hardware reference.

But:

Do not assume a GPIO pin is safe/free just because it appears in a table.

The project explicitly requires checking the FPGA .pcf constraint file before selecting UART pins.

So Person C must:

inspect .pcf
+
inspect board pin assignment
+
choose RX/TX
+
verify no conflict
69. DO NOT invent FPGA pin numbers
This is a hard rule.

The official board documentation gives the FPGA I/O assignment and physical pin mapping, but your actual project constraint file determines which pins are used.

Therefore:

❌ "Use GPIO 12 because I remember it."
Instead:

check .pcf
      ↓
verify physical pin
      ↓
verify board function
      ↓
use it
70. Twenty-first milestone — synthesis
After RTL is complete:

Verilog
 ↓
Yosys
 ↓
netlist
 ↓
NextPNR
 ↓
bitstream
The VSD documentation identifies Yosys, NextPNR and Project IceStorm as the supported development toolchain.

71. Twenty-second milestone — resource check
Person C should inspect:

LUT usage
flip-flop usage
RAM usage
timing
The board has approximately:

5.3K LUTs
4,960 FFs
120 kbit SRAM
so your V1 design should fit comfortably if kept simple.

72. Twenty-third milestone — timing
Make sure:

timing constraints
+
UART timing
+
12 MHz clock
are valid.

The adaptive decision does not need extreme FPGA performance.

The value is:

deterministic
low latency
local
repeatable
not GHz-class processing.

73. Twenty-fourth milestone — reset architecture
Create one clean reset.

On reset:

FSM → IDLE
baseline_valid → 0
stable_count → 0
measurement_count → 0
decision → NONE
packet_valid → 0
error_flags → 0
Avoid scattered resets across modules.

74. Twenty-fifth milestone — start/end run protocol
Person C needs explicit commands.

At minimum:

RESET
START_RUN
CAPTURE_BASELINE
START_MEASUREMENT
STOP_RUN
Potentially:

SET_PHASE
REQUEST_STATUS
Don't make these implicit.

75. Suggested command types
For example:

0x01 = RESET
0x02 = START_RUN
0x03 = CAPTURE_BASELINE
0x04 = FEATURE_DATA
0x05 = END_RUN
0x06 = STATUS_REQUEST
These are suggested design values, not values already specified by the project.

Put them in a shared protocol document.

76. Current sequential protocol
The data schema should ultimately allow:

timestamp
run_id
chamber_id
phase
tube_source
electrode_id
electrode_geometry_notes
excitation_frequency
excitation_amplitude
adc_raw
voltage
impedance_estimate
temperature
baseline_reference_value
delta_feature
slope
stability_index
fsm_state
decision
quality_flag
notes
The project explicitly lists these fields for the current sequential single-chamber design.

Person C doesn't have to own the entire database, but the FPGA output must make the relevant fields available.

77. Twenty-sixth milestone — telemetry packet
The FPGA should produce enough information that the PC/Heltec can log:

run ID
sequence
current feature
baseline
delta
slope
stability
FSM state
decision
quality
errors
This lets you later plot:

feature vs time
delta vs time
slope vs time
stability vs time
confidence vs time
FSM state vs time
78. Twenty-seventh milestone — debug mode
Have a debug mode.

For example:

DEBUG_ENABLE = 1
which allows output of:

feature
baseline
delta
slope
maxSlope
minSlope
range
stable_count
measurement_count
confidence
decision
Without debug information, FPGA development becomes unnecessarily difficult.

79. Twenty-eighth milestone — physical LED demo
Make the RGB LED show:

IDLE
then:

MEASURING
then:

STOP
or:

TIMEOUT
The board's RGB LED is explicitly available for user-defined status signaling.

This gives judges a visible physical demonstration even if the OLED/UI isn't ready.

80. Twenty-ninth milestone — fault handling
Person C should handle:

UART timeout
invalid packet
checksum error
sequence error
baseline missing
insufficient samples
overflow
timeout
Example:

FEATURE_DATA arrives
but baseline_valid = 0
Do:

reject measurement
error = BASELINE_NOT_READY
Do not calculate garbage.

81. Thirtieth milestone — safe defaults
When uncertain:

STOP = false
That means:

insufficient evidence
rather than:

STOP
This is the conservative architecture.

82. The complete Person C internal architecture
This is what I want Person C to actually build:

                         HELTEC
                           │
                           │ UART
                           ▼
                ┌────────────────────┐
                │    UART RECEIVER   │
                └─────────┬──────────┘
                          │
                          ▼
                ┌────────────────────┐
                │ PACKET VALIDATOR   │
                │ checksum/sequence  │
                └─────────┬──────────┘
                          │
                          ▼
                ┌────────────────────┐
                │ INPUT REGISTERS    │
                │ feature/conf/etc.  │
                └─────────┬──────────┘
                          │
                          ▼
                ┌────────────────────┐
                │ DIGITAL FILTER     │
                └─────────┬──────────┘
                          │
                          ▼
                ┌────────────────────┐
                │ BASELINE TRACKER   │
                └─────────┬──────────┘
                          │
                          ▼
                ┌────────────────────┐
                │ DELTA CALCULATOR   │
                │ F - baseline       │
                └─────────┬──────────┘
                          │
                          ▼
                ┌────────────────────┐
                │ SLOPE CALCULATOR   │
                │ Δ[n]-Δ[n-4]        │
                └─────────┬──────────┘
                          │
                          ▼
                ┌────────────────────┐
                │ STABILITY ENGINE   │
                │ max-min slope      │
                └─────────┬──────────┘
                          │
                          ▼
                ┌────────────────────┐
                │ EVIDENCE ENGINE    │
                │ quality/conf/etc.  │
                └─────────┬──────────┘
                          │
                          ▼
                ┌────────────────────┐
                │   ADAPTIVE FSM     │
                └─────┬──────┬───────┘
                      │      │
               ┌──────┘      └──────┐
               ▼                    ▼
             STOP              REPEAT
               │                    │
               └────────┬───────────┘
                        ▼
                     TIMEOUT
                        │
                        ▼
                 UART RESPONSE
                        │
                        ▼
                     HELTEC
That is Person C.

83. What Person C must NOT do
Person C should not:

❌ build the analog front-end
❌ build the 555 circuit
❌ build the LM358 stage
❌ write the ADS1115 driver
❌ redo Person A feature extraction
❌ retrain Person B's model
❌ invent biological thresholds
❌ create S/I/R prediction
❌ claim clinical validation
❌ implement the old simultaneous control/test architecture
❌ hard-code random FPGA pins
❌ assume UART is hardware verified
Person C owns:

FPGA
+
UART
+
digital signal processing
+
evidence accumulation
+
adaptive FSM
+
edge decision
The project team-responsibility table assigns UART, filtering, differential/slope/stability logic, adaptive FSM and Heltec integration to the FPGA/Embedded role.

84. Definition of DONE
Person C is DONE only when:

FPGA
[✓] FPGA project builds
[✓] FPGA flashes
[✓] clock works
[✓] reset works
UART
[✓] RX works
[✓] TX works
[✓] packet parser works
[✓] checksum works
[✓] sequence checking works
Signal processing
[✓] filtering
[✓] baseline
[✓] ΔF
[✓] slope
[✓] stability
Decision
[✓] evidence accumulation
[✓] confidence gating
[✓] stable-N logic
[✓] STOP
[✓] MEASURE AGAIN
[✓] TIMEOUT
Current experiment architecture
[✓] ZERO
[✓] CONTROL
[✓] TEST
[✓] before-dose baseline
[✓] post-dose measurement
Testing
[✓] stable
[✓] rising
[✓] falling
[✓] noisy
[✓] transition
[✓] anomaly
[✓] timeout
[✓] insufficient history
[✓] recovery from noise
Integration
[✓] Person A → Person B → Person C
[✓] Heltec → FPGA
[✓] FPGA → Heltec
[✓] OLED/status
[✓] complete synthetic demo
85. Final demonstration Person C should produce
You want the final physical demo to look like this:

                 PHENORA
                    │
                    ▼
              Signal arrives
                    │
                    ▼
             FPGA receives
                    │
                    ▼
               Filtering
                    │
                    ▼
             Baseline captured
                    │
                    ▼
                  ΔF(t)
                    │
                    ▼
                 slope
                    │
                    ▼
                stability
                    │
                    ▼
              confidence
                    │
             ┌──────┴──────┐
             │             │
          enough?        not enough
             │             │
             ▼             ▼
           STOP       MEASURE AGAIN
                           │
                           ▼
                       more data
                           │
                           ▼
                      evaluate again
                           │
                           ▼
                       TIMEOUT
This is the core PHENORA story.

86. The strongest hackathon demo
I would specifically make Person C demonstrate three cases.

Demo A — fast convergence
Stable synthetic signal
        ↓
high quality
        ↓
stable N windows
        ↓
STOP
Show:

Measurement windows: 7
Decision: STOP
Demo B — adaptive extension
Signal starts noisy
        ↓
MEASURE AGAIN
        ↓
becomes stable
        ↓
confidence rises
        ↓
STOP
Show:

Measurement windows: 13
Decision: STOP
This demonstrates why adaptive measurement exists.

Demo C — never reliable
unstable signal
        ↓
MEASURE AGAIN
        ↓
MEASURE AGAIN
        ↓
...
        ↓
TIMEOUT
Show:

Decision: INCONCLUSIVE / TIMEOUT
This demonstrates safety against indefinite measurement.

87. What makes this different from a simple threshold
This is important when explaining to judges.

A basic system says:

IF signal > threshold
    STOP
PHENORA's proposed adaptive architecture says:

Have we accumulated enough trustworthy evidence
from the signal observed so far?
So the system considers:

signal
+
trend
+
stability
+
quality
+
confidence
+
history
+
anomaly
+
measurement budget
then decides:

STOP
or
MEASURE AGAIN
or
TIMEOUT
That is the intended closed-loop measurement-scheduling concept.

88. Critical limitation
Person C must understand this:

The FPGA can prove:

adaptive decision logic works
It cannot, by itself, prove:

adaptive decision = correct AST result
The current validation ladder explicitly separates synthetic/electrical validation from future supervised biological validation.

So the correct claim is:

“We have implemented and can validate the adaptive edge measurement-decision mechanism.”

Not:

“The FPGA accurately detects antibiotic susceptibility.”

89. Exact Antigravity prompt for Person C
Give Person C/Antigravity this whole prompt:

You are implementing PERSON C for the PHENORA project.

BRANCH:
feature/fpga-adaptive-engine

ROLE:
FPGA / Embedded / Adaptive Decision Engine

PRIMARY OBJECTIVE:

Build the actual FPGA-based PHENORA edge decision engine.

The FPGA receives measurement/features from the Heltec ESP32-S3 over UART,
processes the incoming feature stream deterministically, calculates the
current signal relative to a captured baseline, calculates slope and
stability, consumes quality/confidence evidence from Person B, accumulates
evidence over time, and makes an adaptive:

STOP
MEASURE_AGAIN
TIMEOUT

decision.

This is the core edge-computing component of PHENORA.

IMPORTANT:
Do not merely create a software simulation of the FSM.
The target is synthesizable FPGA RTL that can be simulated first and then
flashed to the VSDSquadron FPGA Mini.

==================================================
1. PHENORA CURRENT ARCHITECTURE
==================================================

Current near-term architecture is:

NE555 AC excitation
    ↓
safety-pin electrode pair
    ↓
LM358 conditioning
    ↓
ADS1115
    ↓
Heltec ESP32-S3
    ↓
Person A signal processing
    ↓
SignalFeatures
    ↓
Person B signal intelligence
    ↓
quality / trajectory / anomaly / confidence
    ↓
UART
    ↓
VSDSquadron iCE40UP5K FPGA
    ↓
filter
    ↓
baseline
    ↓
delta
    ↓
slope
    ↓
stability
    ↓
evidence
    ↓
adaptive FSM
    ↓
STOP / MEASURE_AGAIN / TIMEOUT

Do not describe this whole chain as already complete.
The FPGA FSM is a target implementation milestone.

==================================================
2. CURRENT EXPERIMENT ARCHITECTURE — CRITICAL
==================================================

The current physical experiment uses ONE measurement chamber at a time.

Do NOT implement the old idealized simultaneous:

TEST - CONTROL

architecture as the primary V1 implementation.

The current sequential protocol is:

ZERO
    ↓
CONTROL
    ↓
TEST / POST-DOSE

The primary current baseline is:

F_before_antibiotic_addition

and:

delta_feature(t)
    =
F(t) - F(t_before_antibiotic_addition)

This is a before/after single-chamber comparison.

The separate CONTROL tube remains available as a separate reference measurement,
but it is NOT measured simultaneously with TEST in the current hardware design.

The FPGA FSM must therefore use a captured baseline from the same measurement
run.

Keep the architecture flexible enough that a future parallel control/test
implementation can be added later, but do not implement that as the current
V1 assumption.

==================================================
3. NON-NEGOTIABLE PROJECT RULES
==================================================

1. This is an engineering research prototype.
2. It is NOT clinically validated.
3. Do not claim valid S/I/R prediction.
4. Do not output "SUSCEPTIBLE", "INTERMEDIATE", or "RESISTANT".
5. The FPGA decision means measurement evidence is sufficient for the current
   engineering decision layer, not that biological susceptibility has been
   proven.
6. Do not invent biological thresholds.
7. All engineering thresholds must be configurable and documented.
8. Do not invent experimental results.
9. Do not invent FPGA GPIO pin numbers.
10. Inspect the actual VSDSquadron .pcf constraint file before assigning UART pins.
11. Do not assume the UART protocol is already hardware-verified.
12. The current UART packet is a design-stage specification.
13. Do not modify Person A's signal-processing implementation.
14. Do not duplicate Person B's intelligence algorithm.
15. Person C consumes Person A/B outputs and performs the edge decision.
16. Do not implement biological ML training.
17. Do not implement clinical AST classification.
18. If something is not known, use a configurable parameter or mark it
    TODO/UNCONFIRMED rather than inventing a value.

==================================================
4. HARDWARE TARGET
==================================================

Target board:

VSDSquadron FPGA Mini
Lattice iCE40UP5K

Known board capabilities from the official board documentation:

- 5,280 logic cells
- 4,960 flip-flops
- 120 kbit SRAM
- 4 MB SPI flash
- 32 FPGA GPIO exposed
- 3.3 V I/O capability
- 12 MHz onboard oscillator
- Yosys
- NextPNR
- Project IceStorm

Use the actual repository constraints and board documentation.
Never guess pin assignments.

==================================================
5. FIRST ACTION — INSPECT REPOSITORY
==================================================

Before changing anything:

1. inspect repository structure
2. find existing FPGA code
3. find existing Makefile
4. find existing .pcf constraint file
5. find existing Verilog/SystemVerilog files
6. find existing testbenches
7. inspect Person A interface
8. inspect Person B interface
9. inspect any existing UART implementation
10. inspect any existing Heltec firmware
11. inspect branch state
12. avoid creating duplicate modules

If an equivalent implementation already exists, reuse or extend it.

==================================================
6. RECOMMENDED DIRECTORY STRUCTURE
==================================================

Adapt to the existing repository, but target something conceptually like:

fpga/
  rtl/
    top.v

    uart/
      uart_rx.v
      uart_tx.v
      uart_packet_parser.v

    signal/
      signal_filter.v
      baseline_tracker.v
      delta_calculator.v
      slope_calculator.v
      stability_detector.v

    confidence/
      confidence_engine.v

    decision/
      evidence_accumulator.v
      adaptive_fsm.v

    output/
      status_registers.v
      led_status.v

    package/
      protocol_constants.v

  tb/
    uart_rx_tb.v
    delta_tb.v
    slope_tb.v
    stability_tb.v
    confidence_tb.v
    adaptive_fsm_tb.v
    system_tb.v

  constraints/
    vsdsquadron.pcf

  sim/
    test_vectors/

  Makefile
  README.md

Do not force this exact structure if the repository has a better existing
organization.

==================================================
7. CLOCK
==================================================

Use the documented 12 MHz onboard oscillator for V1 unless the repository
already has a working clock module.

Do not introduce unnecessary PLL complexity.

Ensure all sequential logic uses one clean clock domain unless a separate
clock domain is genuinely required.

==================================================
8. RESET
==================================================

Implement a clean reset architecture.

On reset:

FSM -> IDLE
baseline_valid -> 0
baseline -> 0
stable_count -> 0
measurement_count -> 0
evidence counters -> 0
decision -> NONE
packet_valid -> 0
error flags -> 0
sequence tracking -> reset
history registers -> reset

Avoid scattered/inconsistent reset behavior.

==================================================
9. UART PROTOCOL
==================================================

Current design-stage specification:

115200 baud
8N1

Physical concept:

Heltec TX -> FPGA RX
Heltec RX <- FPGA TX
Heltec GND <-> FPGA GND

Current proposed packet:

[AA 55]
[TYPE]
[SEQUENCE]
[FEATURE:16-bit]
[FLAGS]
[CHECKSUM:XOR]

This protocol has NOT yet been hardware-verified.

Implement it as a versioned protocol abstraction.

Do not assume the final protocol cannot change.

Implement UART RX as a dedicated module.

==================================================
10. UART RECEIVER
==================================================

Implement:

uart_rx

with:

- baud timing
- start-bit detection
- 8-bit reception
- stop-bit validation
- byte_valid pulse

Then implement:

uart_packet_parser

with states conceptually:

WAIT_HEADER_1
WAIT_HEADER_2
READ_TYPE
READ_SEQUENCE
READ_FEATURE_HIGH
READ_FEATURE_LOW
READ_FLAGS
READ_CHECKSUM
VERIFY
VALID
INVALID

Reject:

- bad header
- bad packet
- bad checksum
- invalid packet type

Expose:

packet_valid
packet_error
packet_type
packet_sequence
packet_feature
packet_flags

==================================================
11. SEQUENCE VALIDATION
==================================================

Use the packet sequence field to detect:

- missing packets
- duplicates
- unexpected sequence jumps

For V1:

- detect and flag sequence errors
- do not invent complex retransmission logic
- document behavior

==================================================
12. FIXED-POINT FEATURE
==================================================

The FPGA must use fixed-point/integer arithmetic.

Do not use floating-point in the V1 RTL.

The exact feature scaling must be coordinated with Person A/B.

Inspect the actual Person A output range before choosing the final Q format.

Do not invent a scale.

Use signed arithmetic because:

delta and slope can be positive or negative.

Use wider intermediate registers where subtraction can overflow.

==================================================
13. INPUT REGISTERS
==================================================

Create registers for:

current_feature
feature_valid
quality
confidence
anomaly
flags
sequence

Only update them on valid packets.

==================================================
14. DIGITAL FILTER
==================================================

Implement a simple deterministic digital filter.

Prefer a small moving average or similarly simple integer-friendly filter.

The filter should:

- reduce small measurement noise
- be synthesizable
- have configurable window size
- avoid unnecessary division where possible

If division is needed, use a power-of-two window where practical so division
can become a shift.

Do not over-engineer the filter.

Output:

filtered_feature
filtered_valid

==================================================
15. BASELINE CAPTURE
==================================================

Implement explicit baseline capture.

Do NOT automatically assume the first feature received is the baseline.

Provide a command/event equivalent to:

CAPTURE_BASELINE

When accepted:

baseline <= filtered_feature

baseline_valid <= 1

The baseline represents:

F(t_before_antibiotic_addition)

for the current sequential single-chamber protocol.

Provide a way to clear/re-capture baseline when a new run begins.

==================================================
16. PHASE SUPPORT
==================================================

Support conceptual phases:

ZERO
CONTROL_PRE_DOSE
TEST_POST_DOSE

Do not hard-code biological interpretation into the FPGA.

The phase is metadata for the run.

The FPGA primarily needs to know when baseline capture and post-baseline
measurement begin.

==================================================
17. DELTA CALCULATION
==================================================

Implement:

delta = filtered_feature - baseline

This is:

ΔF(t) = F(t) - F(t_before_antibiotic_addition)

Use signed arithmetic.

Ensure enough bits for subtraction.

Output:

delta
delta_valid

==================================================
18. SLOPE CALCULATION
==================================================

Implement the PHENORA V1 definition:

slope[n] = delta[n] - delta[n-4]

Use a four-sample delay line.

Maintain:

delta[n-1]
delta[n-2]
delta[n-3]
delta[n-4]

When enough history exists:

slope = current_delta - delta_4

Use signed arithmetic and sufficient bit width.

Do not implement floating-point slope.

==================================================
19. STABILITY
==================================================

Implement the PHENORA V1 stability definition:

range =
max(recent slopes) - min(recent slopes)

Maintain a small configurable slope history.

Calculate:

max_slope
min_slope
stability_range

Then:

stable_window =
(stability_range <= STABILITY_RANGE_THRESHOLD)

The threshold must be configurable.

Do not claim this threshold is clinically validated.

==================================================
20. CONSECUTIVE STABILITY
==================================================

Implement:

stable_count

If:

stable_window == true

then:

stable_count++

If:

stable_window == false

then reset stable_count according to the documented V1 policy.

STOP must require:

stable_count >= REQUIRED_STABLE_WINDOWS

Do not allow one stable sample to trigger STOP.

==================================================
21. PERSON B INTEGRATION
==================================================

Person B produces signal intelligence.

Do NOT duplicate Person B's intelligence algorithm.

Person C should consume relevant outputs such as:

quality
confidence
anomaly
trajectory/status flags

Conceptually:

quality: 0..255
confidence: 0..255
anomaly: 0..255
trajectory: enum
flags: bitfield

Coordinate the exact packet format with Person B.

If the current Person B interface differs, adapt to the real interface.

==================================================
22. EVIDENCE ENGINE
==================================================

Do not implement a single-threshold:

if confidence > X -> STOP

Instead accumulate evidence across windows.

Track at minimum:

stable_windows
valid_windows
good_quality_windows
anomaly_windows
measurement_windows

The decision should be based on evidence gathered over time.

A measurement should be considered strong evidence only when:

- signal is valid
- quality is acceptable
- confidence is acceptable
- anomaly is acceptable
- stability condition is satisfied
- sufficient history exists

All thresholds must be configurable.

==================================================
23. ADAPTIVE DECISION
==================================================

Implement:

STOP
MEASURE_AGAIN
TIMEOUT

Conceptual rule:

IF
    baseline_valid
    AND signal valid
    AND quality acceptable
    AND confidence acceptable
    AND anomaly acceptable
    AND stability acceptable
    AND stable for N consecutive windows
THEN
    STOP

ELSE IF
    maximum measurement budget reached
THEN
    TIMEOUT

ELSE
    MEASURE_AGAIN

This is an engineering decision mechanism.

Do not interpret STOP as S/I/R.

==================================================
24. MAIN FSM
==================================================

Implement a clean adaptive FSM.

Suggested states:

IDLE
BASELINE_WAIT
BASELINE_CAPTURE
MEASURE
FILTER
DELTA
SLOPE
STABILITY
EVIDENCE
DECISION
STOP
MEASURE_AGAIN
TIMEOUT

You may combine states if the existing architecture makes that cleaner.

Required behavior:

IDLE
  ↓
START_RUN
  ↓
BASELINE_WAIT
  ↓
CAPTURE_BASELINE
  ↓
MEASURE
  ↓
FILTER
  ↓
DELTA
  ↓
SLOPE
  ↓
STABILITY
  ↓
EVIDENCE
  ↓
DECISION

DECISION -> STOP
DECISION -> MEASURE_AGAIN
DECISION -> TIMEOUT

STOP must remain latched until reset/new run.

TIMEOUT must remain latched until reset/new run.

==================================================
25. MEASURE AGAIN
==================================================

MEASURE_AGAIN does NOT mean reset the entire run.

It means:

"Evidence is insufficient; obtain another measurement/window."

Continue collecting evidence.

Do not erase the baseline unless a new run begins.

==================================================
26. TIMEOUT
==================================================

Implement a bounded measurement counter.

Configurable parameter:

MAX_MEASUREMENT_WINDOWS

If the system does not reach sufficient evidence before this limit:

decision = TIMEOUT

Expose:

measurement_count

The user-facing interpretation should be:

INCONCLUSIVE / TIMEOUT

not a biological result.

==================================================
27. ANOMALY POLICY
==================================================

If Person B flags an anomaly:

Do not silently treat the measurement as normal.

For V1, implement a conservative policy:

- reject or down-weight the current evidence window
- prevent it from increasing stable_count
- optionally reset consecutive stable_count if documented
- continue measurement

The exact policy should be configurable/documented.

==================================================
28. BAD QUALITY POLICY
==================================================

If:

quality < QUALITY_MIN

then:

current window cannot contribute to STOP evidence.

Do not allow:

low-quality stable-looking data
→ STOP

==================================================
29. LOW CONFIDENCE POLICY
==================================================

If:

confidence < CONFIDENCE_MIN

then:

current window cannot contribute to STOP evidence.

The system should continue measuring unless the timeout is reached.

==================================================
30. INSUFFICIENT HISTORY
==================================================

Do not calculate a valid slope before the four-sample history exists.

Do not calculate stability before enough slope history exists.

Do not allow STOP before minimum history is available.

Expose:

history_ready

==================================================
31. OVERFLOW PROTECTION
==================================================

Review every arithmetic operation for:

- subtraction overflow
- addition overflow
- max/min comparison
- counter overflow

Use wider intermediate registers where required.

Document chosen widths.

Do not truncate silently.

==================================================
32. OUTPUT REGISTERS
==================================================

Expose at least:

current_feature
filtered_feature
baseline
delta
slope
max_slope
min_slope
stability_range
stable_count
measurement_count
quality
confidence
anomaly
fsm_state
decision
packet_valid
error_flags

These are needed for debugging and integration.

==================================================
33. UART RESPONSE
==================================================

Implement a response packet from FPGA to Heltec.

The exact final packet should be coordinated with the Heltec developer.

It should expose enough information for the Heltec/OLED/logger to display:

- current state
- decision
- confidence
- stable count
- measurement count
- error flags

Do not invent a final protocol silently.
Document the proposed protocol.

==================================================
34. RGB LED
==================================================

Use the VSDSquadron onboard RGB LED for visible state indication.

At minimum distinguish:

IDLE
MEASURING
STOP
TIMEOUT
ERROR

The LED is for debugging/demo only.

==================================================
35. TESTBENCHES
==================================================

Create synthesizable-module testbenches.

Minimum:

1. UART RX test
2. packet parser test
3. checksum test
4. sequence test
5. filter test
6. baseline capture test
7. delta calculation test
8. slope test
9. stability test
10. confidence/evidence test
11. adaptive FSM test
12. complete system test

==================================================
36. REQUIRED SYNTHETIC TEST CASES
==================================================

TEST 1:
STABLE

Expected:
stable trend
low stability range
stable_count increases
eventual STOP if all evidence conditions pass

TEST 2:
RISING

Expected:
positive consistent slope
no false noise classification
eventual decision if stability/evidence conditions pass

TEST 3:
FALLING

Expected:
negative consistent slope
eventual decision if evidence conditions pass

TEST 4:
NOISY

Expected:
unstable slope
poor stability
MEASURE_AGAIN
eventual TIMEOUT if never resolved

TEST 5:
TRANSITION

Expected:
system does not prematurely STOP
trend change is recognized
continues measuring

TEST 6:
ANOMALY

Expected:
anomalous window does not incorrectly increase STOP evidence

TEST 7:
INSUFFICIENT HISTORY

Expected:
no slope/stability/STOP until sufficient samples exist

TEST 8:
TIMEOUT

Expected:
maximum measurement count reached
decision = TIMEOUT

TEST 9:
NOISY -> STABLE

Expected:
initial MEASURE_AGAIN
then stable_count grows
eventual STOP

TEST 10:
STABLE -> ANOMALY

Expected:
STOP evidence is invalidated/reduced according to policy
system continues measuring

TEST 11:
HIGH QUALITY BUT UNSTABLE

Expected:
MEASURE_AGAIN

TEST 12:
STABLE BUT LOW QUALITY

Expected:
MEASURE_AGAIN

==================================================
37. END-TO-END SYNTHETIC TEST
==================================================

The strongest validation should be:

synthetic signal generator
    ↓
Person A processing model
    ↓
Person B intelligence model
    ↓
UART packet
    ↓
FPGA UART parser
    ↓
filter
    ↓
baseline
    ↓
delta
    ↓
slope
    ↓
stability
    ↓
evidence
    ↓
adaptive FSM
    ↓
STOP / MEASURE_AGAIN / TIMEOUT

Do not bypass the FPGA for the final integration test.

==================================================
38. HARDWARE-IN-LOOP
==================================================

After simulation passes:

1. program FPGA
2. connect UART
3. send synthetic packets
4. observe FPGA state/LED
5. receive response packet
6. verify decisions

Only after this works:

Heltec
    ↓
real Person A/B output
    ↓
FPGA

==================================================
39. HELTEC INTEGRATION
==================================================

Coordinate with the Heltec developer.

Expected flow:

Heltec
  ↓
measurement
  ↓
SignalFeatures
  ↓
Person B
  ↓
quality/confidence/anomaly/feature
  ↓
UART
  ↓
FPGA
  ↓
decision
  ↓
UART
  ↓
Heltec
  ↓
OLED/logger

Do not make Person C directly responsible for ADS1115.

==================================================
40. PIN ASSIGNMENT
==================================================

Before assigning UART RX/TX:

1. inspect the actual .pcf file
2. inspect VSDSquadron board documentation
3. verify selected physical pins
4. verify no conflict with configuration/SPI resources
5. document the final mapping

Never guess.

==================================================
41. BUILD SYSTEM
==================================================

Use the repository's existing build flow.

If compatible with the current VSD project:

make clean
make build
sudo make flash

The official VSD board documentation uses this style of workflow.

Do not replace a working repository build system without reason.

==================================================
42. SYNTHESIS VALIDATION
==================================================

After implementation:

- synthesis passes
- place-and-route passes
- timing checks pass
- resource usage is reasonable
- bitstream generated
- FPGA flashes successfully

Record:

LUT usage
FF usage
RAM usage
timing result

==================================================
43. DEBUG MODE
==================================================

Implement optional debug output or registers exposing:

feature
baseline
delta
slope
maxSlope
minSlope
stabilityRange
stableCount
measurementCount
quality
confidence
anomaly
FSM state
decision

This is critical for development.

==================================================
44. RUN LOGGING
==================================================

The current project data schema should eventually contain:

timestamp
run_id
chamber_id
phase
tube_source
electrode_id
electrode_geometry_notes
excitation_frequency
excitation_amplitude
adc_raw
voltage
impedance_estimate
temperature
baseline_reference_value
delta_feature
slope
stability_index
fsm_state
decision
quality_flag
notes

The FPGA does not need to own the database.

It must expose the fields required for logging.

Unknown/unavailable values must remain NULL/unavailable.
Never fabricate measurements.

==================================================
45. CLAIM DISCIPLINE
==================================================

The final implementation may claim:

- FPGA adaptive decision engine implemented
- UART communication implemented
- digital filtering implemented
- baseline-relative delta implemented
- slope estimation implemented
- stability checking implemented
- confidence/evidence gating implemented
- STOP/MEASURE_AGAIN/TIMEOUT FSM implemented
- synthetic validation completed if tests pass
- hardware-in-loop validation completed if actually performed

Do NOT claim:

- clinically validated AST
- validated S/I/R
- AMR detection
- patient diagnosis
- replacement for reference AST
- proven reduction in clinical AST time
- biological accuracy unless experimentally demonstrated

==================================================
46. FINAL DEMO REQUIREMENT
==================================================

The final demo must demonstrate THREE scenarios.

SCENARIO A:
Good stable signal

Expected:

measurement
→ stable
→ evidence accumulates
→ STOP

SCENARIO B:
Initially noisy signal

Expected:

measurement
→ insufficient evidence
→ MEASURE_AGAIN
→ signal settles
→ confidence improves
→ STOP

SCENARIO C:
Never resolves

Expected:

measurement
→ MEASURE_AGAIN
→ MEASURE_AGAIN
→ ...
→ MAX_WINDOWS
→ TIMEOUT / INCONCLUSIVE

This is the strongest demonstration of PHENORA's adaptive measurement concept.

==================================================
47. DEFINITION OF DONE
==================================================

Person C is complete only when:

[ ] repository inspected
[ ] existing FPGA code reused where appropriate
[ ] UART RX implemented
[ ] packet parser implemented
[ ] checksum implemented
[ ] sequence handling implemented
[ ] fixed-point feature path implemented
[ ] digital filter implemented
[ ] baseline capture implemented
[ ] sequential single-chamber delta implemented
[ ] slope implemented
[ ] stability implemented
[ ] consecutive stability implemented
[ ] Person B quality/confidence integrated
[ ] evidence accumulation implemented
[ ] STOP implemented
[ ] MEASURE_AGAIN implemented
[ ] TIMEOUT implemented
[ ] reset implemented
[ ] error handling implemented
[ ] RGB LED status implemented
[ ] UART response implemented
[ ] unit/module testbenches implemented
[ ] synthetic test suite passes
[ ] complete simulation passes
[ ] synthesis passes
[ ] place-and-route passes
[ ] FPGA flash succeeds
[ ] hardware UART test succeeds
[ ] Heltec integration succeeds
[ ] three demo scenarios verified

==================================================
48. FINAL REPORT
==================================================

When finished, report:

1. files created
2. files modified
3. existing files reused
4. Person A interface consumed
5. Person B interface consumed
6. UART packet format
7. final FPGA pin mapping and source of truth
8. fixed-point format
9. filter implementation
10. baseline implementation
11. delta implementation
12. slope implementation
13. stability implementation
14. evidence logic
15. FSM states
16. STOP conditions
17. MEASURE_AGAIN conditions
18. TIMEOUT conditions
19. error handling
20. tests created
21. test results
22. synthesis result
23. timing result
24. resource usage
25. flashing result
26. hardware UART result
27. Heltec integration result
28. known limitations
29. anything not completed

Do not only describe the solution.

Actually inspect the repository and implement the work.
90. Final team architecture
Once all three people finish, the ownership should be extremely clean:

                  PHENORA
                     │
                     ▼
              ┌──────────────┐
              │   SENSOR     │
              └──────┬───────┘
                     │
                     ▼
             ┌───────────────┐
             │   PERSON A    │
             │               │
             │ Signal        │
             │ Processing    │
             └──────┬────────┘
                    │
             SignalFeatures
                    │
                    ▼
             ┌───────────────┐
             │   PERSON B    │
             │               │
             │ Intelligence  │
             │ Quality       │
             │ Trajectory    │
             │ Anomaly       │
             │ Confidence    │
             └──────┬────────┘
                    │
                 MLResult
                    │
                    ▼
             ┌───────────────┐
             │   PERSON C    │
             │               │
             │ FPGA          │
             │ Filter        │
             │ Baseline      │
             │ ΔF            │
             │ Slope         │
             │ Stability     │
             │ Evidence      │
             │ Adaptive FSM  │
             └──────┬────────┘
                    │
          ┌─────────┼──────────┐
          ▼         ▼          ▼
        STOP    MEASURE     TIMEOUT
                 AGAIN
And that is the actual PHENORA MVP architecture.

The strongest part is that Person C does not simply produce a fixed endpoint. It demonstrates the central hypothesis:

Measure → evaluate evidence → decide whether another measurement is necessary → repeat only when necessary.

That is exactly the adaptive measurement-scheduling layer identified in the project foundation as PHENORA's candidate differentiation.

One more practical point: the official VSDSquadron documentation shows the board's standard make clean → make build → sudo make flash workflow, so Person C should get the FPGA toolchain/board bring-up working before attempting the complete PHENORA RTL