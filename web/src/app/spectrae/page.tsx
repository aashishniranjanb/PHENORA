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
      .catch((err) => console.error("Error loading simulation dataset:", err));
  }, []);

  const inKey = DATASET_INTERNAL[dsKey];
  const trajectory = data ? data[inKey].trajectory : [];
  const maxF = trajectory.length > 0 ? Math.max(...trajectory.map((p) => Math.max(p.F_control, p.F_test)), 1) : 1;
  const maxDF = trajectory.length > 0 ? Math.max(...trajectory.map((p) => Math.abs(p.delta_F)), 1) : 1;
  const cp = trajectory[tIdx] || {
    time: 0,
    temperature: 37,
    F_control: 120,
    F_test: 120,
    delta_F: 0,
    fpga_decision: "MEASURING",
    frequency_sweep: { frequencies: [], control_magnitude: [], control_phase: [], test_magnitude: [], test_phase: [] }
  };

  // Synchronous State Machine driver based on tIdx and active mode
  useEffect(() => {
    if (!data) return;
    if (mode === "explore") {
      // In explore mode, we determine state directly from the point data
      if (tIdx === 0) {
        setSimState("READY");
      } else if (tIdx < 5) {
        setSimState("INITIALIZING");
      } else if (tIdx < 15) {
        setSimState("BASELINE");
      } else {
        const fpgaVal = cp.fpga_decision;
        if (fpgaVal === "STOP") {
          setSimState("STOP");
        } else if (fpgaVal === "STABLE") {
          setSimState("ANALYZING");
        } else {
          setSimState("MEASURING");
        }
      }
    }
  }, [tIdx, mode, cp.fpga_decision, data]);

  // Unified simulation playback timer (Explore mode)
  useEffect(() => {
    let interval: any;
    if (playing && data && mode === "explore") {
      interval = setInterval(() => {
        setTIdx((prev) => {
          if (prev >= trajectory.length - 1) {
            setPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [playing, data, mode, trajectory.length]);

  // Demo Mode State Machine (Section 25: 60-90s Demo)
  // READY (0-5s) -> INITIALIZING (5-10s) -> BASELINE (10-15s) -> MEASURING (15-25s) ->
  // CONTROL/TEST DIVERGENCE (25-35s) -> QUALITY CHECK (35-45s) -> ANALYZING (45-55s) ->
  // EVIDENCE SUFFICIENT (55-65s) -> STOP (65-75s)
  const handleRunDemo = () => {
    if (demoIntervalRef.current) {
      // Pause/Stop demo
      clearInterval(demoIntervalRef.current);
      demoIntervalRef.current = null;
      setPhaseRunning(false);
      return;
    }

    setMode("demo");
    setTIdx(0);
    setSimState("READY");
    demoTimeElapsedRef.current = 0;
    setPhaseRunning(true);

    const stepInterval = 1000; // Tick every second
    demoIntervalRef.current = setInterval(() => {
      demoTimeElapsedRef.current += 1;
      const elapsed = demoTimeElapsedRef.current;

      if (elapsed <= 5) {
        setSimState("READY");
        setTIdx(0);
      } else if (elapsed <= 10) {
        setSimState("INITIALIZING");
        setTIdx(Math.min(trajectory.length - 1, Math.floor(elapsed * 0.4)));
      } else if (elapsed <= 15) {
        setSimState("BASELINE");
        setTIdx(Math.min(trajectory.length - 1, Math.floor(elapsed * 0.8)));
      } else if (elapsed <= 25) {
        setSimState("MEASURING");
        // Fast forward timeline index during active measurement
        setTIdx(Math.min(trajectory.length - 1, Math.floor(elapsed * 1.5)));
      } else if (elapsed <= 35) {
        // Divergence stage: continue measuring and showcase divergence
        setSimState("MEASURING");
        setTIdx(Math.min(trajectory.length - 1, Math.floor(elapsed * 1.8)));
      } else if (elapsed <= 45) {
        setSimState("QUALITY_CHECK");
        setTIdx(Math.min(trajectory.length - 1, Math.floor(elapsed * 2.0)));
      } else if (elapsed <= 55) {
        setSimState("ANALYZING");
        setTIdx(Math.min(trajectory.length - 1, Math.floor(elapsed * 2.2)));
      } else if (elapsed <= 65) {
        // Check if Stop criteria reached. Trajectory A (susceptible) stabilizes, Trajectory B (resistant) may request Measure Again
        if (dsKey === "trajectory_a") {
          setSimState("STOP");
          setTIdx(trajectory.length - 20); // Near halting index
        } else {
          setSimState("MEASURE_AGAIN");
          setTIdx(trajectory.length - 15);
        }
      } else if (elapsed <= 75) {
        setSimState("STOP");
        setTIdx(trajectory.length - 1);
      } else {
        // Demo complete
        clearInterval(demoIntervalRef.current);
        demoIntervalRef.current = null;
        setPhaseRunning(false);
      }
    }, stepInterval);
  };

  const [phaseRunning, setPhaseRunning] = useState(false);

  // Clear intervals on unmount
  useEffect(() => {
    return () => {
      if (demoIntervalRef.current) clearInterval(demoIntervalRef.current);
    };
  }, []);

  const handleReset = () => {
    setPlaying(false);
    if (demoIntervalRef.current) {
      clearInterval(demoIntervalRef.current);
      demoIntervalRef.current = null;
    }
    setPhaseRunning(false);
    setTIdx(0);
    setSimState("READY");
    setConductivity(1.0);
    setCellConc(0.02);
    setTemperature(37.0);
    setRs(120.0);
    setRct(4000.0);
    setCdl(5.0);
  };

  // Derive mathematical outputs for graphs/readouts
  const N = 4;
  const K = 4;
  
  const getDerivedStats = () => {
    if (trajectory.length === 0) return { filtered: 0, slope: 0 };
    const s1 = Math.max(0, tIdx - N + 1);
    const windowPoints = trajectory.slice(s1, tIdx + 1);
    const filtered = windowPoints.reduce((acc, pt) => acc + pt.delta_F, 0) / (windowPoints.length || 1);

    const prevIndex = Math.max(0, tIdx - K);
    const s2 = Math.max(0, prevIndex - N + 1);
    const prevWindowPoints = trajectory.slice(s2, prevIndex + 1);
    const prevFiltered = prevWindowPoints.reduce((acc, pt) => acc + pt.delta_F, 0) / (prevWindowPoints.length || 1);

    const slope = tIdx >= K ? filtered - prevFiltered : 0;
    return { filtered, slope };
  };

  const { filtered, slope } = getDerivedStats();

  const getRandlesParameters = (f: number) => {
    const omega = 2 * Math.PI * f;
    const Cdl_farad = Cdl * 1e-6;
    const denomReal = 1.0;
    const denomImag = omega * Rct * Cdl_farad;
    const denomMagSq = denomReal * denomReal + denomImag * denomImag;
    const zIntReal = (Rct * denomReal) / denomMagSq;
    const zIntImag = (-Rct * denomImag) / denomMagSq;
    const zReal = Rs + zIntReal;
    const zImag = zIntImag;
    const magnitude = Math.sqrt(zReal * zReal + zImag * zImag);
    const phase = (Math.atan2(zImag, zReal) * 180) / Math.PI;
    return { magnitude, phase, zReal, zImag };
  };

  const sweepData = SWEEP_FREQS.map((f) => {
    const { magnitude, phase, zReal, zImag } = getRandlesParameters(f);
    return { frequency: f, magnitude, phase, zReal, zImag };
  });

  const at1k = getRandlesParameters(1000);

  const maxMag = Math.max(...sweepData.map((d) => d.magnitude), 1);
  const phases = sweepData.map((d) => d.phase);
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
    <div className="bg-[#0A192F] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 pb-6 border-b border-gray-900 gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <span className="text-[10px] text-[#17B169] font-extrabold tracking-widest uppercase">Simulation Lab</span>
              <span className="bg-[#17B169]/15 text-[#17B169] border border-[#17B169]/30 text-[9px] px-2 py-0.5 rounded font-mono font-bold tracking-widest">SPECTRAE ENGINE</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Adaptive Susceptibility V1 Simulation</h1>
            <p className="text-gray-400 text-xs mt-1.5 max-w-xl leading-relaxed">
              PHENORA continuously evaluates differential electrical response and determines whether additional measurement is required. One measurement, one story, one decision.
            </p>
          </div>
          <div className="flex items-start space-x-3 bg-red-950/20 px-4 py-3 rounded-lg border border-red-900/50 max-w-sm">
            <ShieldAlert className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <span className="text-[10px] text-red-200/80 leading-relaxed font-medium">
              <strong>COMPUTATIONAL SIMULATION ONLY</strong><br />
              This is a mathematical model for system performance demonstration. It is not clinically or biologically validated. No S/I/R diagnostic profiles are determined.
            </span>
          </div>
        </div>

        {/* MODE CONTROLLERS */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Select Mode</span>
          <div className="flex bg-[#081324] border border-gray-800 p-0.5 rounded-lg">
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
                mode === "explore" ? "bg-[#17B169] text-[#0A192F]" : "text-gray-400 hover:text-white"
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
                mode === "demo" ? "bg-[#17B169] text-[#0A192F]" : "text-gray-400 hover:text-white"
              }`}
            >
              Demo Mode
            </button>
          </div>
          <span className="text-[9px] text-gray-600">
            {mode === "explore"
              ? "Adjust equivalent Randles parameters and observe model outputs."
              : "Execute a 60–90 second workflow timeline to observe the halting decision."}
          </span>
        </div>

        {/* MAIN HARDWARE + DATA INTERFACE */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
          {/* LEFT: 3D hardware assembly scene */}
          <div className="lg:col-span-2 relative h-[420px] bg-[#081526] border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
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
              className={`absolute bottom-3 right-3 px-3 py-1.5 rounded border text-[9px] font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                exploded
                  ? "bg-[#ff006e] border-[#ff006e] text-white"
                  : "bg-[#0A192F]/88 border-gray-700 text-gray-300 hover:border-gray-500"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              {exploded ? "Assemble View" : "Exploded View"}
            </button>

            {/* Active stage overlay (only in demo run) */}
            {mode === "demo" && phaseRunning && (
              <div className="absolute top-16 left-3 bg-[#0A192F]/92 border border-[#17B169]/30 rounded-lg p-3 max-w-[220px] shadow-2xl">
                <span className="text-[8px] text-[#17B169] font-extrabold tracking-widest uppercase block mb-0.5">
                  PHENORA V1 DEMO STATUS
                </span>
                <span className="text-white text-[11px] font-bold block mb-1">
                  {simState === "READY" && "READYING SENSORS"}
                  {simState === "INITIALIZING" && "INITIALIZING SYSTEM"}
                  {simState === "BASELINE" && "ESTABLISHING BASELINE"}
                  {simState === "MEASURING" && "INJECTING EXCITATION"}
                  {simState === "ANALYZING" && "DIFFERENTIAL SLOPE EVALUATION"}
                  {simState === "QUALITY_CHECK" && "SIGNAL CONDITION CHECKS"}
                  {simState === "MEASURE_AGAIN" && "ACQUIRING ADDITIONAL POINTS"}
                  {simState === "STOP" && "HALTING MEASUREMENT"}
                </span>
                <p className="text-gray-400 text-[9px] leading-relaxed">
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
              <div className="bg-[#081324] border border-gray-800 rounded-xl p-4 shadow-xl">
                <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase block mb-2">
                  RUN DEMO CONTROL
                </span>
                <button
                  onClick={handleRunDemo}
                  className={`w-full py-2.5 rounded text-xs font-bold tracking-wider uppercase cursor-pointer transition-all ${
                    phaseRunning
                      ? "bg-[#ff006e] hover:bg-[#d90429] text-white"
                      : "bg-[#17B169] hover:bg-[#139457] text-[#0A192F]"
                  }`}
                >
                  {phaseRunning ? "Stop Demo Sequence" : "Run PHENORA V1"}
                </button>
                <div className="mt-2.5 text-[9px] text-gray-500 leading-relaxed">
                  Clicking executes a 60–90 second synchronized baseline calibration, acquisition, and adaptive halting slope analysis.
                </div>
              </div>
            )}

            {/* Parameter sliders */}
            {mode === "explore" && (
              <div className="bg-[#081324] border border-gray-800 rounded-xl p-4 shadow-xl">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">
                    Simulation Parameters
                  </span>
                  <button
                    onClick={handleReset}
                    className="text-[9px] text-[#17B169] font-bold hover:underline cursor-pointer"
                  >
                    Reset Defaults
                  </button>
                </div>
                <div className="space-y-3.5 text-xs">
                  {/* Medium Conductivity */}
                  <div>
                    <div className="flex justify-between mb-0.5">
                      <span className="text-gray-400">Medium Conductivity</span>
                      <span className="text-[#17B169] font-mono">{conductivity.toFixed(2)} S/m</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.05"
                      value={conductivity}
                      onChange={(e) => setConductivity(parseFloat(e.target.value))}
                      className="w-full accent-[#17B169]"
                    />
                    <span className="text-[8px] text-gray-700 block">BASE BROTH SOLUTION</span>
                  </div>

                  {/* Cell Inclusion Density */}
                  <div>
                    <div className="flex justify-between mb-0.5">
                      <span className="text-gray-400">Cell Inclusion Density</span>
                      <span className="text-[#17B169] font-mono">{(cellConc * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={cellConc}
                      onChange={(e) => setCellConc(parseFloat(e.target.value))}
                      className="w-full accent-[#17B169]"
                    />
                    <span className="text-[8px] text-gray-700 block">VOLUME FRACTION LOAD</span>
                  </div>

                  {/* Temperature */}
                  <div>
                    <div className="flex justify-between mb-0.5">
                      <span className="text-gray-400">Incubator Temperature</span>
                      <span className="text-[#17B169] font-mono">{temperature.toFixed(1)} °C</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="45"
                      step="0.5"
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value))}
                      className="w-full accent-[#17B169]"
                    />
                    <span className="text-[8px] text-gray-700 block">COMMON-MODE TEMP INDICATION</span>
                  </div>

                  {/* Equivalent Randles cell values */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-800/80">
                    <div>
                      <label className="text-gray-600 text-[9px] block mb-0.5">Rs (Ω)</label>
                      <input
                        type="number"
                        value={Rs}
                        onChange={(e) => setRs(Math.max(1, parseFloat(e.target.value) || 0))}
                        className="bg-[#0A192F] border border-gray-800 rounded p-1 w-full text-white font-mono text-[10px]"
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 text-[9px] block mb-0.5">Rct (Ω)</label>
                      <input
                        type="number"
                        value={Rct}
                        onChange={(e) => setRct(Math.max(1, parseFloat(e.target.value) || 0))}
                        className="bg-[#0A192F] border border-gray-800 rounded p-1 w-full text-white font-mono text-[10px]"
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 text-[9px] block mb-0.5">Cdl (µF)</label>
                      <input
                        type="number"
                        value={Cdl}
                        onChange={(e) => setCdl(Math.max(0.1, parseFloat(e.target.value) || 0))}
                        className="bg-[#0A192F] border border-gray-800 rounded p-1 w-full text-white font-mono text-[10px]"
                      />
                    </div>
                  </div>
                  <span className="text-[8px] text-gray-700 block">FITTED ELECTROMODEL VALUES</span>
                </div>
              </div>
            )}

            {/* LIVE INSTRUMENT PANEL (Z(f) values at 1kHz) */}
            <div className="bg-[#081324] border border-gray-800 rounded-xl p-4 shadow-xl">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] text-[#17B169] font-extrabold tracking-widest uppercase">
                  Chamber Impedance Values
                </span>
                <span className="text-[9px] font-mono text-gray-500 bg-[#0A192F] px-2 py-0.5 rounded border border-gray-800">
                  t = {cp.time.toFixed(2)} h
                </span>
              </div>
              <div className="font-mono text-[11.5px] space-y-1.5">
                <div className="flex justify-between py-1 border-b border-gray-800/60">
                  <span className="text-gray-500">Magnitude |Z| (at 1kHz)</span>
                  <span className="text-white">{at1k.magnitude.toFixed(2)} Ω</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-800/60">
                  <span className="text-gray-500">Phase Angle φ</span>
                  <span className="text-purple-400">{at1k.phase.toFixed(2)}°</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-800/60">
                  <span className="text-gray-500">Real Resistance Re(Z)</span>
                  <span className="text-blue-400">{at1k.zReal.toFixed(2)} Ω</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Imaginary Reactance Im(Z)</span>
                  <span className="text-red-400">{at1k.zImag.toFixed(2)} Ω</span>
                </div>
              </div>
            </div>

            {/* Hover/click component selector details */}
            {selectedId && (
              <div className="bg-[#081324] border border-gray-800 rounded-xl p-4 shadow-xl">
                <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase block mb-1">
                  INSPECT COMPONENT
                </span>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#17B169]" />
                  <span className="text-white text-xs font-bold font-mono">
                    {selectedId === "chamber" && "Sample Chamber & Electrodes"}
                    {selectedId === "ad5933" && "AD5933 Monolithic AFE"}
                    {selectedId === "heltec" && "Heltec ESP32-S3 Microcontroller"}
                    {selectedId === "fpga" && "iCE40UP5K Lattice FPGA"}
                  </span>
                </div>
                <p className="text-gray-400 text-[10px] leading-relaxed mb-3">
                  {selectedId === "chamber" &&
                    "Contains dual parallel test/control wells with biological inclusions. Electrodes provide AC excitation to sample current responses."}
                  {selectedId === "ad5933" &&
                    "Combines direct digital synthesis (DDS) generator with ADC and DFT co-processor to compile Real & Imaginary component parameters."}
                  {selectedId === "heltec" &&
                    "Retrieves registers from AD5933 via I2C bus at 400 kHz. Formulates and serializes feature vectors for transmission."}
                  {selectedId === "fpga" &&
                    "Performs moving average filters, differential calculations, derivative operations, and halts measurement automatically."}
                </p>
                <div className="text-[9.5px] border-t border-gray-800/80 pt-2 font-mono space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Interface:</span>
                    <span className="text-gray-300">
                      {selectedId === "chamber" && "Direct analog excitation"}
                      {selectedId === "ad5933" && "I2C bus (400 kHz)"}
                      {selectedId === "heltec" && "I2C and UART (115200)"}
                      {selectedId === "fpga" && "UART interface (115200)"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Integration:</span>
                    <span className="text-yellow-500">V1 Prototype / Hardware Testbed</span>
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
        <section className="bg-[#081324] border border-gray-800 rounded-xl p-5 mb-5 shadow-xl">
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
                className="bg-[#17B169] hover:bg-[#139457] text-[#0A192F] p-2.5 rounded-full transition-all cursor-pointer"
              >
                {playing ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
              </button>
              <button
                onClick={() => {
                  setPlaying(false);
                  setTIdx(0);
                }}
                className="border border-gray-800 hover:border-gray-700 p-2.5 rounded-full text-gray-400 hover:text-white transition-all cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <div>
                <span className="text-white text-xs font-bold block uppercase tracking-wider">
                  Timeline Scrubber
                </span>
                <span className="text-[10px] text-gray-500">
                  Elapsed Time: <strong className="text-[#17B169] font-mono">{cp.time.toFixed(2)} h</strong> (Points: {tIdx + 1}/{trajectory.length})
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
              className="flex-grow accent-[#17B169]"
            />

            <div className="flex flex-col items-end flex-shrink-0">
              <span className="text-[8px] text-gray-600 uppercase tracking-wider mb-1">
                Simulation Scenarios
              </span>
              <div className="flex bg-[#0A192F] border border-gray-800 p-0.5 rounded-lg">
                <button
                  onClick={() => {
                    setPlaying(false);
                    setDsKey("trajectory_a");
                    setTIdx(0);
                  }}
                  className={`px-3 py-1 rounded text-[9px] font-bold tracking-widest uppercase cursor-pointer transition-all ${
                    dsKey === "trajectory_a" ? "bg-[#17B169] text-[#0A192F]" : "text-gray-400 hover:text-white"
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
                    dsKey === "trajectory_b" ? "bg-[#17B169] text-[#0A192F]" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Trajectory B
                </button>
              </div>
              <span className="text-[7.5px] text-gray-700 mt-1 uppercase font-semibold">
                COMPUTATIONAL SCENARIOS - NO S/I/R OUTPUTS
              </span>
            </div>
          </div>
        </section>

        {/* EQUIVALENT CIRCUITS & SPECTRUM + DUAL WELL PLOT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          
          {/* Spectral chart view */}
          <div className="bg-[#081324] border border-gray-800 rounded-xl p-5 shadow-xl">
            <div className="flex justify-between items-center mb-3">
              <div>
                <span className="text-[10px] text-[#17B169] font-bold tracking-widest uppercase block">
                  Frequency Sweep
                </span>
                <h3 className="text-white text-sm font-bold">Z(f) Equivalent Circuit Response</h3>
              </div>
              
              <div className="flex bg-[#0A192F] border border-gray-800 p-0.5 rounded">
                <button
                  onClick={() => setSweepTab("mag")}
                  className={`px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer transition-all ${
                    sweepTab === "mag" ? "bg-[#17B169] text-[#0A192F]" : "text-gray-400 hover:text-white"
                  }`}
                >
                  |Z| Mag
                </button>
                <button
                  onClick={() => setSweepTab("phase")}
                  className={`px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer transition-all ${
                    sweepTab === "phase" ? "bg-[#17B169] text-[#0A192F]" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Phase φ
                </button>
              </div>
            </div>

            <div className="w-full h-56 bg-[#0A192F]/50 rounded border border-gray-800 relative">
              <svg viewBox="0 0 500 210" className="w-full h-full">
                <line x1={SX} y1="10" x2={SX} y2={SH} stroke="#1f2937" strokeWidth="1" />
                <line x1={SX} y1={SH} x2="488" y2={SH} stroke="#1f2937" strokeWidth="1" />
                {[65, 115, 165].map((y) => (
                  <line key={y} x1={SX} y1={y} x2="488" y2={y} stroke="#111827" strokeWidth="0.5" strokeDasharray="3,3" />
                ))}

                {sweepTab === "mag" ? (
                  <path
                    d={sweepData.reduce((acc, pt, idx) => acc + `${idx === 0 ? "M" : "L"} ${freqToX(idx, sweepData.length)} ${valToY(pt.magnitude, maxMag)}`, "")}
                    fill="none"
                    stroke="#17B169"
                    strokeWidth="2"
                  />
                ) : (
                  <path
                    d={sweepData.reduce((acc, pt, idx) => acc + `${idx === 0 ? "M" : "L"} ${freqToX(idx, sweepData.length)} ${valToY(pt.phase, maxPh, minPh)}`, "")}
                    fill="none"
                    stroke="#8338ec"
                    strokeWidth="2"
                  />
                )}

                {/* 1kHz measurement index indicator */}
                <line x1={freqToX(3, sweepData.length)} y1="10" x2={freqToX(3, sweepData.length)} y2={SH} stroke="#ffb703" strokeWidth="1" strokeDasharray="3,3" />

                <text x={SX} y="198" fill="#4b5563" fontSize="7" textAnchor="middle">100Hz</text>
                <text x="264" y="198" fill="#4b5563" fontSize="7" textAnchor="middle">10kHz</text>
                <text x="488" y="198" fill="#4b5563" fontSize="7" textAnchor="middle">100kHz</text>
                <text x={SX - 3} y={SH} fill="#4b5563" fontSize="6.5" textAnchor="end">{sweepTab === "mag" ? "0 Ω" : `${minPh.toFixed(0)}°`}</text>
                <text x={SX - 3} y="14" fill="#4b5563" fontSize="6.5" textAnchor="end">{sweepTab === "mag" ? `${(maxMag / 1000).toFixed(1)}kΩ` : `${maxPh.toFixed(0)}°`}</text>
              </svg>

              {/* Randles diagram formula popup overlay */}
              <div className="absolute top-2 left-2 bg-[#0A192F]/92 border border-gray-800 rounded p-1 text-[8.5px] font-mono text-gray-500">
                Rs={Rs}Ω · Rct={Rct}Ω · Cdl={Cdl}µF
              </div>
            </div>
            <span className="text-[8px] text-gray-600 block mt-1.5 text-center">
              Z(f) calculated via Randles cell boundary model. Dash index at 1kHz highlights current feature frequency.
            </span>
          </div>

          {/* Differential Signal ΔF plot */}
          <div className="bg-[#081324] border border-gray-800 rounded-xl p-5 shadow-xl">
            <span className="text-[10px] text-[#17B169] font-bold tracking-widest uppercase block">
              Differential Output
            </span>
            <h3 className="text-white text-sm font-bold mb-3">F_control, F_test, and Delta |ΔF|</h3>

            <div className="w-full h-56 bg-[#0A192F]/50 rounded border border-gray-800 relative">
              <svg viewBox="0 0 500 210" className="w-full h-full">
                <line x1={SX} y1="10" x2={SX} y2={SH} stroke="#1f2937" strokeWidth="1" />
                <line x1={SX} y1={SH} x2="488" y2={SH} stroke="#1f2937" strokeWidth="1" />
                {[65, 115, 165].map((y) => (
                  <line key={y} x1={SX} y1={y} x2="488" y2={y} stroke="#111827" strokeWidth="0.5" strokeDasharray="3,3" />
                ))}

                {/* Plot curves up to tIdx */}
                <path
                  d={trajectory.slice(0, tIdx + 1).reduce((acc, pt, idx) => acc + `${idx === 0 ? "M" : "L"} ${freqToX(idx, trajectory.length)} ${valToY(pt.F_control, maxF * 1.05)}`, "")}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />
                
                <path
                  d={trajectory.slice(0, tIdx + 1).reduce((acc, pt, idx) => acc + `${idx === 0 ? "M" : "L"} ${freqToX(idx, trajectory.length)} ${valToY(pt.F_test, maxF * 1.05)}`, "")}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                />

                <path
                  d={trajectory.slice(0, tIdx + 1).reduce((acc, pt, idx) => acc + `${idx === 0 ? "M" : "L"} ${freqToX(idx, trajectory.length)} ${valToY(Math.abs(pt.delta_F), maxDF * 1.05)}`, "")}
                  fill="none"
                  stroke="#17B169"
                  strokeWidth="1.8"
                  strokeDasharray="3,3"
                />

                {tIdx > 0 && (
                  <line x1={freqToX(tIdx, trajectory.length)} y1="10" x2={freqToX(tIdx, trajectory.length)} y2={SH} stroke="#17B169" strokeWidth="1" opacity="0.5" />
                )}

                <text x={SX} y="198" fill="#4b5563" fontSize="7" textAnchor="middle">0h</text>
                <text x="264" y="198" fill="#4b5563" fontSize="7" textAnchor="middle">5h</text>
                <text x="488" y="198" fill="#4b5563" fontSize="7" textAnchor="middle">10h</text>
              </svg>

              <div className="absolute top-2 right-2 bg-[#0A192F]/92 border border-gray-800 rounded p-1 text-[8.5px] font-bold space-y-0.5">
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-blue-500 inline-block" /><span className="text-blue-400">Control</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-red-500 inline-block" /><span className="text-red-400">Test</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 border-t border-dashed border-[#17B169] inline-block" /><span className="text-[#17B169]">|ΔF|</span></div>
              </div>
            </div>
            <span className="text-[8px] text-gray-600 block mt-1.5 text-center">
              F = impedance feature at 1kHz. ΔF = F_test − F_control. Notice signal divergence at elapsed hours.
            </span>
          </div>
        </div>

        {/* SIGNAL PIPELINE BLOCK */}
        <div className="mb-5">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3 font-mono text-[9px] text-[#17B169]">
            {[
              { label: "01 RAW ΔF", sub: "F_test - F_control", value: `${cp.delta_F.toFixed(3)} Ω`, color: "border-blue-900 text-blue-400" },
              { label: "02 MOVING AVG", sub: "Filter window N=4", value: `${filtered.toFixed(3)} Ω`, color: "border-purple-900 text-purple-400" },
              { label: "03 DERIVATIVE", sub: "Slope lag K=4", value: `${slope.toFixed(5)} Ω/h`, color: "border-yellow-900 text-yellow-500" },
              { label: "04 STABILITY", sub: "slope < threshold?", value: stabilityText, color: "border-orange-950 text-orange-400" },
              { label: "05 STATE CHECK", sub: "Stability FSM count", value: simState === "STOP" ? "STABLE" : "ACQUIRING", color: "border-teal-950 text-teal-400" },
              { label: "06 COMMAND", sub: "halting stop output", value: simState === "STOP" ? "HALT COMMAND" : "CONTINUE", color: "border-green-900 text-green-400" }
            ].map(card => (
              <div key={card.label} className={`bg-[#0A192F] border rounded p-2.5 text-center ${card.color}`}>
                <span className="text-[8px] text-gray-500 block">{card.label}</span>
                <span className="text-[7.5px] text-gray-700 block mb-1">{card.sub}</span>
                <span className="font-bold text-[10.5px] block">{card.value}</span>
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
