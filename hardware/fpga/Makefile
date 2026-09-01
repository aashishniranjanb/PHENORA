# ============================================================================
# PHENORA FPGA Makefile
# Target: VSDSquadron FPGA Mini (Lattice iCE40UP5K)
# Toolchain: Icarus Verilog, Yosys, NextPNR, IcePack, IceProg
# ============================================================================

PROJ = phenora_fpga
DEVICE = up5k
PACKAGE = sg48
PCF = constraints/vsdsquadron.pcf

RTL_SRCS = \
	rtl/top.v \
	rtl/package/protocol_constants.v \
	rtl/uart/uart_rx.v \
	rtl/uart/uart_tx.v \
	rtl/uart/uart_packet_parser.v \
	rtl/signal/signal_filter.v \
	rtl/signal/baseline_tracker.v \
	rtl/signal/delta_calculator.v \
	rtl/signal/slope_calculator.v \
	rtl/signal/stability_detector.v \
	rtl/confidence/confidence_engine.v \
	rtl/decision/adaptive_fsm.v \
	rtl/output/led_status.v \
	rtl/output/status_registers.v

TB_SRCS = tb/tb_adaptive_fsm.sv

.PHONY: all clean sim test build flash

all: sim build

# ----------------------------------------------------------------------------
# Simulation & Testbench Targets
# ----------------------------------------------------------------------------
sim: $(TB_SRCS)
	@echo "=== Compiling RTL Testbench ==="
	iverilog -g2012 -o sim/tb_fsm.vvp $(TB_SRCS)
	@echo "=== Running Golden Vector Verification Test ==="
	vvp sim/tb_fsm.vvp

test: sim

# ----------------------------------------------------------------------------
# Synthesis & Bitstream Target
# ----------------------------------------------------------------------------
build: $(PROJ).bin

$(PROJ).json: $(RTL_SRCS)
	yosys -p "synth_ice40 -top phenora_fpga_top -json $(PROJ).json" $(RTL_SRCS)

$(PROJ).asc: $(PROJ).json $(PCF)
	nextpnr-ice40 --$(DEVICE) --package $(PACKAGE) --pcf $(PCF) --json $(PROJ).json --asc $(PROJ).asc

$(PROJ).bin: $(PROJ).asc
	icepack $(PROJ).asc $(PROJ).bin
	@echo "=== Build Complete: Generated $(PROJ).bin ==="

# ----------------------------------------------------------------------------
# Flash Target
# ----------------------------------------------------------------------------
flash: $(PROJ).bin
	iceprog $(PROJ).bin

clean:
	rm -f *.json *.asc *.bin sim/*.vvp sim/*.vcd
