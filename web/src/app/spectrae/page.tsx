"use client";

import { useState, useEffect, useRef } from "react";
import SimulationScene from "@/components/simulation/SimulationScene";
import StatusBadge from "@/components/simulation/StatusBadge";
import FemViewer from "@/components/simulation/FemViewer";
import WorkflowTimeline from "@/components/simulation/WorkflowTimeline";
import AdaptiveDecisionPanel from "@/components/simulation/AdaptiveDecisionPanel";
import MeasurementQuality from "@/components/simulation/MeasurementQuality";
import TechnicalDetails from "@/components/simulation/TechnicalDetails";
import GeneralPublicMode from "@/components/simulation/GeneralPublicMode";
import { Play, Pause, RotateCcw, Cpu, ShieldAlert, Layers, ChevronRight, HelpCircle } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface FreqSweep {
  frequencies: number[];
  control_magnitude: number[];
  control_phase: number[];
  test_magnitude: number[];
  test_phase: number[];
}
interface TrajectoryPoint {
  time: number;
  temperature: number;
  phi_control: number;
  phi_test: number;
  F_control: number;
  F_test: number;
  delta_F: number;
  fpga_decision: string;
  frequency_sweep: FreqSweep;
}
interface Dataset {
  metadata: any;
  trajectory: TrajectoryPoint[];
}

type SimState =
  | "READY"
  | "INITIALIZING"
  | "BASELINE"
  | "MEASURING"
  | "ANALYZING"
  | "QUALITY_CHECK"
  | "MEASURE_AGAIN"
  | "STOP"
  | "INVALID";

const DATASET_INTERNAL: Record<"trajectory_a" | "trajectory_b", "susceptible" | "resistant"> = {
  trajectory_a: "susceptible",
  trajectory_b: "resistant",
};

// Map state to 3D phase highlighting
const STATE_PHASE_MAP: Record<SimState, number | null> = {
  READY: 0,
  INITIALIZING: 0,
  BASELINE: 1,
  MEASURING: 2,
  ANALYZING: 3,
  QUALITY_CHECK: 3,
  MEASURE_AGAIN: 3,
  STOP: 4,
  INVALID: 4,
};

const SWEEP_FREQS = [100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000];
const SX = 40;
const SW = 448;
const SH = 185;
const freqToX = (i: number, len: number) => SX + (i / (len - 1)) * SW;
const valToY = (v: number, vmax: number, vmin: number = 0) => SH - ((v - vmin) / ((vmax - vmin) || 1)) * 165;

export default function SimulationLab() {
  const [data, setData] = useState<{ susceptible: Dataset; resistant: Dataset } | null>(null);
  const [dsKey, setDsKey] = useState<"trajectory_a" | "trajectory_b">("trajectory_a");
  const [tIdx, setTIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [mode, setMode] = useState<"explore" | "demo">("explore");
  const [selectedId, setSelectedId] = useState<string | null>("chamber");
  const [exploded, setExploded] = useState(false);
  
  // Model Parameters
  const [conductivity, setConductivity] = useState(1.0);
  const [cellConc, setCellConc] = useState(0.02);
  const [temperature, setTemperature] = useState(37.0);
  const [Rs, setRs] = useState(120.0);
  const [Rct, setRct] = useState(4000.0);
  const [Cdl, setCdl] = useState(5.0);
  
  const [sweepTab, setSweepTab] = useState<"mag" | "phase">("mag");
  const [simState, setSimState] = useState<SimState>("READY");

  // Timer reference for demo mode
  const demoIntervalRef = useRef<any>(null);
  const demoTimeElapsedRef = useRef(0);

  // Load datasets
  useEffect(() => {
    fetch("/datasets/simulation_data.json")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Failed loading dataset JSON", err));
  }, []);

  // Scrubbing timer loop
  useEffect(() => {
    let interval: any;
    if (playing) {
      interval = setInterval(() => {
        setTIdx((prev) => {
          const activeDsKey = DATASET_INTERNAL[dsKey];
          const len = data?.[activeDsKey]?.trajectory?.length || 80;
          if (prev >= len - 1) {
            setPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 350);
    }
    return () => clearInterval(interval);
  }, [playing, dsKey, data]);

  // Unified State Machine Handler for Demo Mode
  const [phaseRunning, setPhaseRunning] = useState(false);

  const handleRunDemo = () => {
    if (phaseRunning) {
      if (demoIntervalRef.current) clearInterval(demoIntervalRef.current);
      setPhaseRunning(false);
      setSimState("READY");
      setTIdx(0);
      return;
    }

    setPhaseRunning(true);
    setTIdx(0);
    demoTimeElapsedRef.current = 0;
    setSimState("READY");

    const totalDemoMs = dsKey === "trajectory_a" ? 60000 : 75000;
    const intervalMs = 250;
    const totalSteps = totalDemoMs / intervalMs;
    const trajLen = 80;

    demoIntervalRef.current = setInterval(() => {
      demoTimeElapsedRef.current += intervalMs;
      const progressRatio = Math.min(1, demoTimeElapsedRef.current / totalDemoMs);
      const computedTIdx = Math.min(trajLen - 1, Math.floor(progressRatio * trajLen));
      setTIdx(computedTIdx);

      if (progressRatio < 0.08) {
        setSimState("READY");
      } else if (progressRatio < 0.18) {
        setSimState("INITIALIZING");
      } else if (progressRatio < 0.30) {
        setSimState("BASELINE");
      } else if (progressRatio < 0.50) {
        setSimState("MEASURING");
      } else if (progressRatio < 0.68) {
        setSimState("ANALYZING");
      } else if (progressRatio < 0.78) {
        setSimState("QUALITY_CHECK");
      } else {
        if (dsKey === "trajectory_a") {
          setSimState("STOP");
        } else {
          if (progressRatio < 0.90) {
            setSimState("MEASURE_AGAIN");
          } else {
            setSimState("STOP");
          }
        }
      }

      if (progressRatio >= 1.0) {
        clearInterval(demoIntervalRef.current);
        demoIntervalRef.current = null;
        setPhaseRunning(false);
      }
    }, intervalMs);
  };

  useEffect(() => {
    return () => {
      if (demoIntervalRef.current) clearInterval(demoIntervalRef.current);
    };
  }, []);

  const activeDsKey = DATASET_INTERNAL[dsKey];
  const trajectory = data?.[activeDsKey]?.trajectory || [];
  const cp: TrajectoryPoint = trajectory[tIdx] || {
    time: 0,
    temperature: 37,
    phi_control: 0,
    phi_test: 0,
    F_control: 120,
    F_test: 120,
    delta_F: 0,
    fpga_decision: "MEASURE_AGAIN",
    frequency_sweep: {
      frequencies: SWEEP_FREQS,
      control_magnitude: Array(10).fill(120),
      control_phase: Array(10).fill(0),
      test_magnitude: Array(10).fill(120),
      test_phase: Array(10).fill(0),
    },
  };

  // Randles calculation for Explore Mode
  const sweepData = SWEEP_FREQS.map((f) => {
    const omega = 2 * Math.PI * f;
    const Z_real = Rs + Rct / (1 + Math.pow(omega * Rct * Cdl * 1e-6, 2));
    const Z_imag = -(omega * Math.pow(Rct, 2) * Cdl * 1e-6) / (1 + Math.pow(omega * Rct * Cdl * 1e-6, 2));
    const magnitude = Math.sqrt(Z_real * Z_real + Z_imag * Z_imag);
    const phase = (Math.atan2(Z_imag, Z_real) * 180) / Math.PI;

    // Apply baseline medium conductivity adjustments
    const magAdj = magnitude / (conductivity * (1 + 0.02 * (temperature - 25)));

    return { frequency: f, magnitude: magAdj, phase, zReal: Z_real, zImag: Z_imag };
  });

  const at1k = sweepData[3] || { magnitude: 120, phase: -5, zReal: 119, zImag: -10 };

  // Calculate N=4 Moving Average and K=4 Slope for current point
  const windowN = trajectory.slice(Math.max(0, tIdx - 3), tIdx + 1);
  const filtered = windowN.length > 0 ? windowN.reduce((acc, curr) => acc + curr.delta_F, 0) / windowN.length : cp.delta_F;
  const lagPoint = trajectory[Math.max(0, tIdx - 4)] || cp;
  const slope = (cp.delta_F - lagPoint.delta_F) / Math.max(0.1, cp.time - lagPoint.time || 1);

  const handleReset = () => {
    setConductivity(1.0);
    setCellConc(0.02);
    setTemperature(37.0);
    setRs(120.0);
    setRct(4000.0);
    setCdl(5.0);
  };

  const maxF = Math.max(...trajectory.map((p) => Math.max(p.F_control, p.F_test)), 140);
  const maxDF = Math.max(...trajectory.map((p) => Math.abs(p.delta_F)), 10);
  const maxMag = Math.max(...sweepData.map((s) => s.magnitude));
  const phases = sweepData.map((s) => s.phase);
  const minPh = Math.min(...phases);
  const maxPh = Math.max(...phases);

  const activePhase = STATE_PHASE_MAP[simState];
  const stabilityText = Math.abs(slope) < 0.06 ? "HIGH" : "LOW";

  // Map state to timeline currentStep (0-6)
  const STATE_STEP_MAP: Record<SimState, number> = {
    READY: 0,
    INITIALIZING: 1,
    BASELINE: 2,
    MEASURING: 3,
    ANALYZING: 4,
    QUALITY_CHECK: 5,
    MEASURE_AGAIN: 3, // Loops back
    STOP: 6,
    INVALID: 6,
  };

  const currentStep = STATE_STEP_MAP[simState];

  return (
    <div className="bg-slate-50 min-h-screen py-10 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-1.5">
              <span className="text-[10px] text-[#059669] font-black tracking-widest uppercase">Simulation Lab</span>
              <span className="bg-emerald-50 text-[#059669] border border-emerald-200 text-[9px] px-2.5 py-0.5 rounded font-mono font-bold tracking-widest">SPECTRAE ENGINE</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900">Adaptive Susceptibility V1 Simulation</h1>
            <p className="text-slate-600 text-xs mt-1.5 max-w-xl leading-relaxed font-medium">
              PHENORA continuously evaluates differential electrical response and determines whether additional measurement is required. One measurement, one story, one decision.
            </p>
          </div>
          <div className="flex items-start space-x-3 bg-red-50 px-4 py-3 rounded-lg border border-red-200 max-w-sm">
            <ShieldAlert className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <span className="text-[10px] text-red-950 leading-relaxed font-medium">
              <strong>COMPUTATIONAL SIMULATION ONLY</strong><br />
              This is a mathematical model for system performance demonstration. It is not clinically or biologically validated. No S/I/R diagnostic profiles are determined.
            </span>
          </div>
        </div>

        {/* MODE CONTROLLERS */}
        <div className="flex flex-wrap items-center gap-3 mb-6 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Select Mode</span>
          <div className="flex bg-slate-100 border border-slate-200 p-0.5 rounded-lg">
            <button
              onClick={() => {
                setMode("explore");
                if (demoIntervalRef.current) {
                  clearInterval(demoIntervalRef.current);
                  demoIntervalRef.current = null;
                }
                setPhaseRunning(false);
                setTIdx(0);
              }}
              className={`px-4 py-1.5 rounded text-[10px] font-bold tracking-widest uppercase transition-all cursor-pointer ${
                mode === "explore" ? "bg-[#059669] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Explore Mode
            </button>
            <button
              onClick={() => {
                setMode("demo");
                setTIdx(0);
              }}
              className={`px-4 py-1.5 rounded text-[10px] font-bold tracking-widest uppercase transition-all cursor-pointer ${
                mode === "demo" ? "bg-[#059669] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Demo Mode
            </button>
          </div>
          <span className="text-[10px] text-slate-600 font-medium">
            {mode === "explore"
              ? "Adjust equivalent Randles parameters and observe model outputs."
              : "Execute a 60–90 second workflow timeline to observe the halting decision."}
          </span>
        </div>

        {/* MAIN HARDWARE + DATA INTERFACE */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
          {/* LEFT: 3D hardware assembly scene */}
          <div className="lg:col-span-2 relative h-[420px] bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <SimulationScene
              cellConcentration={cellConc}
              conductivity={conductivity}
              temperature={temperature}
              activePhase={activePhase}
              selectedId={selectedId}
              onSelect={(id) => {
                setSelectedId(id);
                setMode("explore");
                if (demoIntervalRef.current) {
                  clearInterval(demoIntervalRef.current);
                  demoIntervalRef.current = null;
                }
                setPhaseRunning(false);
              }}
              isExploded={exploded}
            />

            {/* Assemble/Explode button */}
            <button
              onClick={() => setExploded((e) => !e)}
              className={`absolute bottom-3 right-3 px-3 py-1.5 rounded-md border text-[9px] font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1.5 shadow-sm ${
                exploded
                  ? "bg-pink-600 border-pink-700 text-white"
                  : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              {exploded ? "Assemble View" : "Exploded View"}
            </button>

            {/* Active stage overlay (only in demo run) */}
            {mode === "demo" && phaseRunning && (
              <div className="absolute top-16 left-3 bg-white/95 backdrop-blur-md border border-emerald-200 rounded-lg p-3 max-w-[220px] shadow-lg">
                <span className="text-[8px] text-[#059669] font-black tracking-widest uppercase block mb-0.5">
                  PHENORA V1 DEMO STATUS
                </span>
                <span className="text-slate-900 text-[11px] font-black block mb-1">
                  {simState === "READY" && "READYING SENSORS"}
                  {simState === "INITIALIZING" && "INITIALIZING SYSTEM"}
                  {simState === "BASELINE" && "ESTABLISHING BASELINE"}
                  {simState === "MEASURING" && "INJECTING EXCITATION"}
                  {simState === "ANALYZING" && "DIFFERENTIAL SLOPE EVALUATION"}
                  {simState === "QUALITY_CHECK" && "SIGNAL CONDITION CHECKS"}
                  {simState === "MEASURE_AGAIN" && "ACQUIRING ADDITIONAL POINTS"}
                  {simState === "STOP" && "HALTING MEASUREMENT"}
                </span>
                <p className="text-slate-600 text-[9px] leading-relaxed font-medium">
                  {simState === "READY" && "Verifying electrode connections and baseline chamber parameters."}
                  {simState === "INITIALIZING" && "Powering up analog front-end AD5933 registers."}
                  {simState === "BASELINE" && "Offset compensation active. Setting sample-rate timers."}
                  {simState === "MEASURING" && "Electrodes active. Data flow particles streaming to acquisition logic."}
                  {simState === "ANALYZING" && "iCE40 FPGA checking stability condition parameters."}
                  {simState === "QUALITY_CHECK" && "Drift envelopes and noise bounds verify signal validation status."}
                  {simState === "MEASURE_AGAIN" && "Slope index above halting threshold. Continual sweep active."}
                  {simState === "STOP" && "Halting command triggered. Sufficient evidence reached."}
                </p>
              </div>
            )}
          </div>

          {/* RIGHT: Parameters & Instrumentation */}
          <div className="flex flex-col gap-4">
            
            {/* Demo Workflow Run control */}
            {mode === "demo" && (
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase block mb-2">
                  RUN DEMO CONTROL
                </span>
                <button
                  onClick={handleRunDemo}
                  className={`w-full py-2.5 rounded text-xs font-bold tracking-wider uppercase cursor-pointer transition-all shadow-sm ${
                    phaseRunning
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-[#059669] hover:bg-[#047857] text-white"
                  }`}
                >
                  {phaseRunning ? "Stop Demo Sequence" : "Run PHENORA V1"}
                </button>
                <div className="mt-2.5 text-[9.5px] text-slate-500 leading-relaxed font-medium">
                  Clicking executes a 60–90 second synchronized baseline calibration, acquisition, and adaptive halting slope analysis.
                </div>
              </div>
            )}

            {/* Parameter sliders */}
            {mode === "explore" && (
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">
                    Simulation Parameters
                  </span>
                  <button
                    onClick={handleReset}
                    className="text-[9px] text-[#059669] font-bold hover:underline cursor-pointer"
                  >
                    Reset Defaults
                  </button>
                </div>
                <div className="space-y-3.5 text-xs">
                  {/* Medium Conductivity */}
                  <div>
                    <div className="flex justify-between mb-0.5 font-medium">
                      <span className="text-slate-600">Medium Conductivity</span>
                      <span className="text-[#059669] font-mono font-bold">{conductivity.toFixed(2)} S/m</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.05"
                      value={conductivity}
                      onChange={(e) => setConductivity(parseFloat(e.target.value))}
                      className="w-full accent-[#059669]"
                    />
                    <span className="text-[8px] text-slate-500 block font-semibold">BASE BROTH SOLUTION</span>
                  </div>

                  {/* Cell Inclusion Density */}
                  <div>
                    <div className="flex justify-between mb-0.5 font-medium">
                      <span className="text-slate-600">Cell Inclusion Density</span>
                      <span className="text-[#059669] font-mono font-bold">{(cellConc * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={cellConc}
                      onChange={(e) => setCellConc(parseFloat(e.target.value))}
                      className="w-full accent-[#059669]"
                    />
                    <span className="text-[8px] text-slate-500 block font-semibold">VOLUME FRACTION LOAD</span>
                  </div>

                  {/* Temperature */}
                  <div>
                    <div className="flex justify-between mb-0.5 font-medium">
                      <span className="text-slate-600">Incubator Temperature</span>
                      <span className="text-[#059669] font-mono font-bold">{temperature.toFixed(1)} °C</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="45"
                      step="0.5"
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value))}
                      className="w-full accent-[#059669]"
                    />
                    <span className="text-[8px] text-slate-500 block font-semibold">COMMON-MODE TEMP INDICATION</span>
                  </div>

                  {/* Equivalent Randles cell values */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200">
                    <div>
                      <label className="text-slate-600 text-[9px] block mb-0.5 font-bold">Rs (Ω)</label>
                      <input
                        type="number"
                        value={Rs}
                        onChange={(e) => setRs(Math.max(1, parseFloat(e.target.value) || 0))}
                        className="bg-slate-50 border border-slate-200 rounded p-1 w-full text-slate-900 font-mono text-[10px] font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-slate-600 text-[9px] block mb-0.5 font-bold">Rct (Ω)</label>
                      <input
                        type="number"
                        value={Rct}
                        onChange={(e) => setRct(Math.max(1, parseFloat(e.target.value) || 0))}
                        className="bg-slate-50 border border-slate-200 rounded p-1 w-full text-slate-900 font-mono text-[10px] font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-slate-600 text-[9px] block mb-0.5 font-bold">Cdl (µF)</label>
                      <input
                        type="number"
                        value={Cdl}
                        onChange={(e) => setCdl(Math.max(0.1, parseFloat(e.target.value) || 0))}
                        className="bg-slate-50 border border-slate-200 rounded p-1 w-full text-slate-900 font-mono text-[10px] font-bold"
                      />
                    </div>
                  </div>
                  <span className="text-[8px] text-slate-500 block font-semibold">FITTED ELECTROMODEL VALUES</span>
                </div>
              </div>
            )}

            {/* LIVE INSTRUMENT PANEL (Z(f) values at 1kHz) */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] text-[#059669] font-black tracking-widest uppercase">
                  Chamber Impedance Values
                </span>
                <span className="text-[9px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-bold">
                  t = {cp.time.toFixed(2)} h
                </span>
              </div>
              <div className="font-mono text-[11.5px] space-y-1.5">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-sans font-medium">Magnitude |Z| (at 1kHz)</span>
                  <span className="text-slate-900 font-bold">{at1k.magnitude.toFixed(2)} Ω</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-sans font-medium">Phase Angle φ</span>
                  <span className="text-purple-700 font-bold">{at1k.phase.toFixed(2)}°</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-sans font-medium">Real Resistance Re(Z)</span>
                  <span className="text-blue-700 font-bold">{at1k.zReal.toFixed(2)} Ω</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-sans font-medium">Imaginary Reactance Im(Z)</span>
                  <span className="text-red-600 font-bold">{at1k.zImag.toFixed(2)} Ω</span>
                </div>
              </div>
            </div>

            {/* Hover/click component selector details */}
            {selectedId && (
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase block mb-1">
                  INSPECT COMPONENT
                </span>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" />
                  <span className="text-slate-900 text-xs font-black font-mono">
                    {selectedId === "chamber" && "Dual Sample & Control Chamber"}
                    {selectedId === "ad5933" && "AD5933 Monolithic AFE"}
                    {selectedId === "heltec" && "Heltec ESP32-S3 Microcontroller"}
                    {selectedId === "fpga" && "iCE40UP5K Lattice FPGA"}
                  </span>
                </div>
                <p className="text-slate-600 text-[10px] leading-relaxed mb-3 font-medium">
                  {selectedId === "chamber" &&
                    "Contains dual parallel test/control wells with biological inclusions. Electrodes provide AC excitation to sample current responses."}
                  {selectedId === "ad5933" &&
                    "Combines direct digital synthesis (DDS) generator with ADC and DFT co-processor to compile Real & Imaginary component parameters."}
                  {selectedId === "heltec" &&
                    "Retrieves registers from AD5933 via I2C bus at 400 kHz. Formulates and serializes feature vectors for transmission."}
                  {selectedId === "fpga" &&
                    "Performs moving average filters, differential calculations, derivative operations, and halts measurement automatically."}
                </p>
                <div className="text-[9.5px] border-t border-slate-200 pt-2 font-mono space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Interface:</span>
                    <span className="text-slate-800 font-bold">
                      {selectedId === "chamber" && "Direct analog excitation"}
                      {selectedId === "ad5933" && "I2C bus (400 kHz)"}
                      {selectedId === "heltec" && "I2C and UART (115200)"}
                      {selectedId === "fpga" && "UART interface (115200)"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Integration:</span>
                    <span className="text-amber-700 font-bold">V1 Prototype / Hardware Testbed</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* WORKFLOW PROGRESS CARDS */}
        <div className="mb-5">
          <WorkflowTimeline activePhase={activePhase} currentStep={currentStep} />
        </div>

        {/* TIMELINE scrubber controls */}
        <section className="bg-white border border-slate-200 rounded-xl p-5 mb-5 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => {
                  if (playing) setPlaying(false);
                  else {
                    if (tIdx >= trajectory.length - 1) setTIdx(0);
                    setPlaying(true);
                  }
                }}
                className="bg-[#059669] hover:bg-[#047857] text-white p-2.5 rounded-full transition-all cursor-pointer shadow-sm"
              >
                {playing ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
              </button>
              <button
                onClick={() => {
                  setPlaying(false);
                  setTIdx(0);
                }}
                className="border border-slate-200 hover:border-slate-300 p-2.5 rounded-full text-slate-600 hover:text-slate-900 transition-all cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <div>
                <span className="text-slate-900 text-xs font-extrabold block uppercase tracking-wider">
                  Timeline Scrubber
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  Elapsed Time: <strong className="text-[#059669] font-mono font-bold">{cp.time.toFixed(2)} h</strong> (Points: {tIdx + 1}/{trajectory.length})
                </span>
              </div>
            </div>
            
            <input
              type="range"
              min="0"
              max={trajectory.length - 1}
              value={tIdx}
              onChange={(e) => {
                setPlaying(false);
                setTIdx(parseInt(e.target.value));
              }}
              className="flex-grow accent-[#059669]"
            />

            <div className="flex flex-col items-end flex-shrink-0">
              <span className="text-[8px] text-slate-500 uppercase tracking-wider mb-1 font-bold">
                Simulation Scenarios
              </span>
              <div className="flex bg-slate-100 border border-slate-200 p-0.5 rounded-lg">
                <button
                  onClick={() => {
                    setPlaying(false);
                    setDsKey("trajectory_a");
                    setTIdx(0);
                  }}
                  className={`px-3 py-1 rounded text-[9px] font-bold tracking-widest uppercase cursor-pointer transition-all ${
                    dsKey === "trajectory_a" ? "bg-[#059669] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Trajectory A
                </button>
                <button
                  onClick={() => {
                    setPlaying(false);
                    setDsKey("trajectory_b");
                    setTIdx(0);
                  }}
                  className={`px-3 py-1 rounded text-[9px] font-bold tracking-widest uppercase cursor-pointer transition-all ${
                    dsKey === "trajectory_b" ? "bg-[#059669] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Trajectory B
                </button>
              </div>
              <span className="text-[7.5px] text-slate-500 mt-1 uppercase font-bold">
                COMPUTATIONAL SCENARIOS - NO S/I/R OUTPUTS
              </span>
            </div>
          </div>
        </section>

        {/* EQUIVALENT CIRCUITS & SPECTRUM + DUAL WELL PLOT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          
          {/* Spectral chart view */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <div>
                <span className="text-[10px] text-[#059669] font-black tracking-widest uppercase block">
                  Frequency Sweep
                </span>
                <h3 className="text-slate-900 text-sm font-extrabold">Z(f) Equivalent Circuit Response</h3>
              </div>
              
              <div className="flex bg-slate-100 border border-slate-200 p-0.5 rounded">
                <button
                  onClick={() => setSweepTab("mag")}
                  className={`px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer transition-all ${
                    sweepTab === "mag" ? "bg-[#059669] text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  |Z| Mag
                </button>
                <button
                  onClick={() => setSweepTab("phase")}
                  className={`px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer transition-all ${
                    sweepTab === "phase" ? "bg-[#059669] text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Phase φ
                </button>
              </div>
            </div>

            <div className="w-full h-56 bg-slate-50 rounded border border-slate-200 relative">
              <svg viewBox="0 0 500 210" className="w-full h-full">
                <line x1={SX} y1="10" x2={SX} y2={SH} stroke="#cbd5e1" strokeWidth="1" />
                <line x1={SX} y1={SH} x2="488" y2={SH} stroke="#cbd5e1" strokeWidth="1" />
                {[65, 115, 165].map((y) => (
                  <line key={y} x1={SX} y1={y} x2="488" y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3,3" />
                ))}

                {sweepTab === "mag" ? (
                  <path
                    d={sweepData.reduce((acc, pt, idx) => acc + `${idx === 0 ? "M" : "L"} ${freqToX(idx, sweepData.length)} ${valToY(pt.magnitude, maxMag)}`, "")}
                    fill="none"
                    stroke="#059669"
                    strokeWidth="2.5"
                  />
                ) : (
                  <path
                    d={sweepData.reduce((acc, pt, idx) => acc + `${idx === 0 ? "M" : "L"} ${freqToX(idx, sweepData.length)} ${valToY(pt.phase, maxPh, minPh)}`, "")}
                    fill="none"
                    stroke="#7c3aed"
                    strokeWidth="2.5"
                  />
                )}

                {/* 1kHz measurement index indicator */}
                <line x1={freqToX(3, sweepData.length)} y1="10" x2={freqToX(3, sweepData.length)} y2={SH} stroke="#d97706" strokeWidth="1.5" strokeDasharray="3,3" />

                <text x={SX} y="198" fill="#64748b" fontSize="7" fontWeight="bold" textAnchor="middle">100Hz</text>
                <text x="264" y="198" fill="#64748b" fontSize="7" fontWeight="bold" textAnchor="middle">10kHz</text>
                <text x="488" y="198" fill="#64748b" fontSize="7" fontWeight="bold" textAnchor="middle">100kHz</text>
                <text x={SX - 3} y={SH} fill="#64748b" fontSize="6.5" fontWeight="bold" textAnchor="end">{sweepTab === "mag" ? "0 Ω" : `${minPh.toFixed(0)}°`}</text>
                <text x={SX - 3} y="14" fill="#64748b" fontSize="6.5" fontWeight="bold" textAnchor="end">{sweepTab === "mag" ? `${(maxMag / 1000).toFixed(1)}kΩ` : `${maxPh.toFixed(0)}°`}</text>
              </svg>

              {/* Randles diagram formula popup overlay */}
              <div className="absolute top-2 left-2 bg-white/95 border border-slate-200 rounded px-2 py-1 text-[8.5px] font-mono text-slate-700 shadow-2xs font-bold">
                Rs={Rs}Ω · Rct={Rct}Ω · Cdl={Cdl}µF
              </div>
            </div>
            <span className="text-[8px] text-slate-500 font-medium block mt-1.5 text-center">
              Z(f) calculated via Randles cell boundary model. Dash index at 1kHz highlights current feature frequency.
            </span>
          </div>

          {/* Differential Signal ΔF plot */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <span className="text-[10px] text-[#059669] font-black tracking-widest uppercase block">
              Differential Output
            </span>
            <h3 className="text-slate-900 text-sm font-extrabold mb-3">F_control, F_test, and Delta |ΔF|</h3>

            <div className="w-full h-56 bg-slate-50 rounded border border-slate-200 relative">
              <svg viewBox="0 0 500 210" className="w-full h-full">
                <line x1={SX} y1="10" x2={SX} y2={SH} stroke="#cbd5e1" strokeWidth="1" />
                <line x1={SX} y1={SH} x2="488" y2={SH} stroke="#cbd5e1" strokeWidth="1" />
                {[65, 115, 165].map((y) => (
                  <line key={y} x1={SX} y1={y} x2="488" y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3,3" />
                ))}

                {/* Plot curves up to tIdx */}
                <path
                  d={trajectory.slice(0, tIdx + 1).reduce((acc, pt, idx) => acc + `${idx === 0 ? "M" : "L"} ${freqToX(idx, trajectory.length)} ${valToY(pt.F_control, maxF * 1.05)}`, "")}
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2"
                />
                
                <path
                  d={trajectory.slice(0, tIdx + 1).reduce((acc, pt, idx) => acc + `${idx === 0 ? "M" : "L"} ${freqToX(idx, trajectory.length)} ${valToY(pt.F_test, maxF * 1.05)}`, "")}
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="2"
                />

                <path
                  d={trajectory.slice(0, tIdx + 1).reduce((acc, pt, idx) => acc + `${idx === 0 ? "M" : "L"} ${freqToX(idx, trajectory.length)} ${valToY(Math.abs(pt.delta_F), maxDF * 1.05)}`, "")}
                  fill="none"
                  stroke="#059669"
                  strokeWidth="2"
                  strokeDasharray="3,3"
                />

                {tIdx > 0 && (
                  <line x1={freqToX(tIdx, trajectory.length)} y1="10" x2={freqToX(tIdx, trajectory.length)} y2={SH} stroke="#059669" strokeWidth="1" opacity="0.6" />
                )}

                <text x={SX} y="198" fill="#64748b" fontSize="7" fontWeight="bold" textAnchor="middle">0h</text>
                <text x="264" y="198" fill="#64748b" fontSize="7" fontWeight="bold" textAnchor="middle">5h</text>
                <text x="488" y="198" fill="#64748b" fontSize="7" fontWeight="bold" textAnchor="middle">10h</text>
              </svg>

              <div className="absolute top-2 right-2 bg-white/95 border border-slate-200 rounded p-1.5 text-[8.5px] font-bold space-y-0.5 shadow-2xs">
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-blue-600 inline-block" /><span className="text-blue-700">Control</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-red-600 inline-block" /><span className="text-red-700">Test</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 border-t border-dashed border-[#059669] inline-block" /><span className="text-[#059669]">|ΔF|</span></div>
              </div>
            </div>
            <span className="text-[8px] text-slate-500 font-medium block mt-1.5 text-center">
              F = impedance feature at 1kHz. ΔF = F_test − F_control. Notice signal divergence at elapsed hours.
            </span>
          </div>
        </div>

        {/* SIGNAL PIPELINE BLOCK */}
        <div className="mb-5">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3 font-mono text-[9px]">
            {[
              { label: "01 RAW ΔF", sub: "F_test - F_control", value: `${cp.delta_F.toFixed(3)} Ω`, color: "border-blue-200 bg-blue-50/70 text-blue-900" },
              { label: "02 MOVING AVG", sub: "Filter window N=4", value: `${filtered.toFixed(3)} Ω`, color: "border-purple-200 bg-purple-50/70 text-purple-900" },
              { label: "03 DERIVATIVE", sub: "Slope lag K=4", value: `${slope.toFixed(5)} Ω/h`, color: "border-amber-200 bg-amber-50/70 text-amber-900" },
              { label: "04 STABILITY", sub: "slope < threshold?", value: stabilityText, color: "border-orange-200 bg-orange-50/70 text-orange-900" },
              { label: "05 STATE CHECK", sub: "Stability FSM count", value: simState === "STOP" ? "STABLE" : "ACQUIRING", color: "border-teal-200 bg-teal-50/70 text-teal-900" },
              { label: "06 COMMAND", sub: "halting stop output", value: simState === "STOP" ? "HALT COMMAND" : "CONTINUE", color: "border-emerald-200 bg-emerald-50/70 text-emerald-900" }
            ].map(card => (
              <div key={card.label} className={`border rounded p-2.5 text-center ${card.color} shadow-2xs`}>
                <span className="text-[8px] text-slate-500 font-bold block">{card.label}</span>
                <span className="text-[7.5px] text-slate-500 font-semibold block mb-1">{card.sub}</span>
                <span className="font-black text-[10.5px] block">{card.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ADAPTIVE DECISION CARD + QUALITY ENGINE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <AdaptiveDecisionPanel
            state={simState}
            signal={cp.delta_F}
            slope={slope}
            noise={0.002}
            measurementCount={tIdx + 1}
            stabilityText={stabilityText}
          />
          <MeasurementQuality
            signalQuality={simState === "READY" ? "LOW" : Math.abs(slope) < 0.08 ? "HIGH" : "MEDIUM"}
            noise="LOW"
            drift="LOW"
            tempStable={temperature >= 36.8 && temperature <= 37.2}
            electrodeGood={true}
            overall={simState === "STOP" ? "VALID" : simState === "INVALID" ? "INVALID" : "MEASURE AGAIN"}
          />
        </div>

        {/* ELMER FEM SOLVER */}
        <div className="mb-5">
          <FemViewer
            conductivity={conductivity}
            cellConcentration={cellConc}
            temperature={temperature}
          />
        </div>

        {/* GENERAL PUBLIC AND TECHNICAL DETAILS */}
        <div className="space-y-5">
          <GeneralPublicMode />
          <TechnicalDetails />
        </div>

      </div>
    </div>
  );
}
