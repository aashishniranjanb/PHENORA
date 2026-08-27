"use client";

import { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Play, RotateCcw, Box, Eye, Layers } from "lucide-react";
import HeltecBoard from "../simulation/hardware/HeltecBoard";
import VsdFpgaBoard from "../simulation/hardware/VsdFpgaBoard";
import Ad5933Board from "../simulation/hardware/Ad5933Board";
import ChamberDualWell from "../simulation/hardware/ChamberDualWell";

// Individual components in the V1 device
const COMPONENTS = [
  {
    id: "chamber",
    name: "Dual Sample Chamber",
    position: [-3.2, 0.25, 0],
    color: "#2a6f97",
    size: [1.6, 0.5, 1.1],
    description: "Contains isolated Control (medium only) and Test (medium + antibiotic) wells with 4-point gold electrode arrays.",
    input: "Biological samples & AC excitation",
    output: "Differential current responses"
  },
  {
    id: "ad5933",
    name: "AD5933 Analyzer",
    position: [-1.0, 0.15, 0],
    color: "#8338ec",
    size: [1, 0.2, 1],
    description: "Integrated network impedance analyzer generating frequency sweeps (up to 100 kHz) and performing on-board Discrete Fourier Transform (DFT).",
    input: "Current response from electrodes",
    output: "Real (R) and Imaginary (I) registers via I2C"
  },
  {
    id: "heltec",
    name: "Heltec ESP32-S3",
    position: [1.2, 0.25, 0.6],
    color: "#06d6a0",
    size: [1.8, 0.2, 1],
    description: "Dual-core processor configuration. Controls the AD5933 sweep parameters via I2C and calculates impedance magnitude and phase features.",
    input: "R/I registers via I2C",
    output: "Impedance magnitude and phase feature streams via UART"
  },
  {
    id: "fpga",
    name: "VSDSquadron FPGA",
    position: [3.4, 0.2, -0.4],
    color: "#ff006e",
    size: [1.2, 0.15, 1.2],
    description: "Executes real-time digital filtering, computes differential slope statistics, and controls the adaptive SUSCEPTIBLE / RESISTANT / MEASURE AGAIN decision loops.",
    input: "UART features from Heltec",
    output: "Decisive status flags (STOP / REPEAT)"
  }
];

const ANIMATION_STEPS = [
  {
    title: "1. Dual Sample Preparation",
    desc: "Bacterial suspensions are placed in isolated Control and Test wells.",
    compId: "chamber"
  },
  {
    title: "2. Differential Electrode Excitation",
    desc: "AC voltage excitation is injected through gold pogo pin electrodes.",
    compId: "chamber"
  },
  {
    title: "3. AD5933 DFT Analyzer",
    desc: "Impedance sweeps are run and converted on-chip using DFT.",
    compId: "ad5933"
  },
  {
    title: "4. Heltec Feature Extraction",
    desc: "ESP32 retrieves Registers via I2C and computes impedance amplitude.",
    compId: "heltec"
  },
  {
    title: "5. FPGA Filtering & Slope",
    desc: "iCE40 FPGA executes moving average filters and checks FSM slope stability.",
    compId: "fpga"
  },
  {
    title: "6. Decision Halted",
    desc: "Halting state outputs a STOP command when slope stabilizes, stopping excitation.",
    compId: "fpga"
  }
];

function ModelScene({
  onSelect,
  selectedId,
  isExploded,
  animationStep,
  controlsRef
}: {
  onSelect: (comp: any) => void;
  selectedId: string | null;
  isExploded: boolean;
  animationStep: number | null;
  controlsRef: any;
}) {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 15, 10]} intensity={1.2} />
      <directionalLight position={[-10, 5, -10]} intensity={0.5} />
      <gridHelper args={[20, 20, "#17B169", "#112240"]} position={[0, -0.05, 0]} />

      {/* PCB Base */}
      <mesh position={[0.5, -0.1, 0]}>
        <boxGeometry args={[9, 0.2, 4]} />
        <meshStandardMaterial color="#05101E" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Components */}
      {COMPONENTS.map((comp) => {
        // Exploded position offsets
        let pos = [...comp.position] as [number, number, number];
        if (isExploded) {
          if (comp.id === "chamber") pos = [-3.2, 1.4, 0];
          if (comp.id === "ad5933") pos = [-1.0, 1.0, 0];
          if (comp.id === "heltec") pos = [1.2, 1.0, 1.2];
          if (comp.id === "fpga") pos = [3.4, 1.0, -1.0];
        }

        // Check if component is selected or active in current animation step
        const isSelected = selectedId === comp.id;

        let isAnimated = false;
        if (animationStep !== null) {
          const stepConfig = ANIMATION_STEPS[animationStep];
          if (stepConfig.compId === comp.id) {
            isAnimated = true;
          }
        }

        const isHighlighted = isSelected || isAnimated;

        return (
          <group
            key={comp.id}
            position={pos}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(comp);
            }}
          >
            {comp.id === "chamber" ? (
              <ChamberDualWell highlighted={isHighlighted} phaseActive={isAnimated} />
            ) : comp.id === "ad5933" ? (
              <Ad5933Board highlighted={isHighlighted} phaseActive={isAnimated} />
            ) : comp.id === "heltec" ? (
              <HeltecBoard highlighted={isHighlighted} phaseActive={isAnimated} />
            ) : comp.id === "fpga" ? (
              <VsdFpgaBoard highlighted={isHighlighted} phaseActive={isAnimated} />
            ) : (
              <mesh>
                <boxGeometry args={comp.size as [number, number, number]} />
                <meshStandardMaterial color={comp.color} />
              </mesh>
            )}
          </group>
        );
      })}

      {/* Stylized signal line connections (Hide if exploded to represent disassembled components) */}
      {!isExploded && (
        <>
          <Line start={[-2.4, 0.1, 0]} end={[-1.0, 0.1, 0]} color="#17B169" />
          <Line start={[-1.0, 0.1, 0]} end={[1.2, 0.1, 0.6]} color="#8338ec" />
          <Line start={[1.2, 0.1, 0.6]} end={[3.4, 0.1, -0.4]} color="#06d6a0" />
        </>
      )}

      <OrbitControls ref={controlsRef} enableZoom={true} minDistance={3} maxDistance={15} />
    </>
  );
}

function Line({ start, end, color }: { start: [number, number, number]; end: [number, number, number]; color: string }) {
  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const lineMaterial = new THREE.LineBasicMaterial({ color: new THREE.Color(color), linewidth: 2 });
  const line = new THREE.Line(lineGeometry, lineMaterial);

  return <primitive object={line} />;
}

export default function ProductViewer() {
  const [mounted, setMounted] = useState(false);
  const [selectedComp, setSelectedComp] = useState<any>(COMPONENTS[0]);
  const [isExploded, setIsExploded] = useState(false);
  const [animationStep, setAnimationStep] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const controlsRef = useRef<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Animation step loop logic
  useEffect(() => {
    let timer: any;
    if (isAnimating) {
      setAnimationStep(0);
      timer = setInterval(() => {
        setAnimationStep((prev) => {
          if (prev === null || prev >= ANIMATION_STEPS.length - 1) {
            return 0; // Loop back
          }
          return prev + 1;
        });
      }, 2000);
    } else {
      setAnimationStep(null);
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isAnimating]);

  // Sync selected component with active animation step
  useEffect(() => {
    if (animationStep !== null) {
      const activeStep = ANIMATION_STEPS[animationStep];
      const matchComp = COMPONENTS.find(c => c.id === activeStep.compId);
      if (matchComp) {
        setSelectedComp(matchComp);
      }
    }
  }, [animationStep]);

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  if (!mounted) {
    return (
      <div className="w-full h-[450px] bg-[#0c1e36] rounded-xl flex items-center justify-center border border-gray-800">
        <span className="text-[#17B169] text-xs font-semibold tracking-widest animate-pulse">LOADING 3D SYSTEM...</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* 3D Scene View */}
      <div className="lg:col-span-2 relative h-[450px] bg-[#081526] border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
        <Canvas camera={{ position: [5, 4, 6], fov: 45 }}>
          <ModelScene
            onSelect={(comp) => {
              setIsAnimating(false); // Stop animation if user clicks manually
              setSelectedComp(comp);
            }}
            selectedId={selectedComp?.id || null}
            isExploded={isExploded}
            animationStep={animationStep}
            controlsRef={controlsRef}
          />
        </Canvas>

        {/* Labels Overlay */}
        <div className="absolute top-4 left-4 bg-[#0A192F]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-gray-800 pointer-events-none">
          <span className="text-[10px] text-gray-400 font-bold tracking-widest block uppercase">Interactive 3D V1 Assembly</span>
          <span className="text-[9px] text-[#17B169] font-medium tracking-wide">Left click + drag to rotate • Scroll to zoom</span>
        </div>

        {/* Control Buttons bar */}
        <div className="absolute bottom-4 left-4 flex items-center bg-[#0A192F]/90 backdrop-blur-md px-3 py-2 rounded-lg border border-gray-800 gap-3">
          {/* Explode View Toggle */}
          <button
            onClick={() => {
              setIsExploded(!isExploded);
              setIsAnimating(false);
            }}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded text-[10px] font-bold tracking-wider uppercase border transition-all duration-200 cursor-pointer ${isExploded
                ? "bg-[#ff006e] border-[#ff006e] text-white"
                : "border-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-800"
              }`}
            title="Slide elements apart to inspect internal well and electrode structures"
          >
            <Layers className="h-3.5 w-3.5" />
            <span>{isExploded ? "Assembly View" : "Explode View"}</span>
          </button>

          {/* Animate Workflow Button */}
          <button
            onClick={() => {
              setIsAnimating(!isAnimating);
              setIsExploded(false);
            }}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded text-[10px] font-bold tracking-wider uppercase border transition-all duration-200 cursor-pointer ${isAnimating
                ? "bg-[#17B169] border-[#17B169] text-[#0A192F]"
                : "border-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-800"
              }`}
          >
            <Play className={`h-3.5 w-3.5 ${isAnimating ? "fill-current" : ""}`} />
            <span>{isAnimating ? "Stop Sequence" : "Animate Workflow"}</span>
          </button>

          {/* Reset Camera Button */}
          <button
            onClick={handleResetCamera}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded border border-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-800 text-[10px] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset View</span>
          </button>
        </div>

        {/* Workflow Active Step Overlay */}
        {isAnimating && animationStep !== null && (
          <div className="absolute top-4 right-4 bg-[#0A192F]/95 border border-[#17B169]/30 rounded-lg p-4 max-w-xs shadow-2xl animate-fade-in">
            <h4 className="text-[#17B169] text-xs font-bold uppercase font-mono tracking-wider mb-1">
              {ANIMATION_STEPS[animationStep].title}
            </h4>
            <p className="text-gray-300 text-[11px] leading-relaxed font-medium">
              {ANIMATION_STEPS[animationStep].desc}
            </p>
          </div>
        )}
      </div>

      {/* Component Details Card */}
      <div className="bg-[#0A192F] border border-gray-800 rounded-xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden">
        {selectedComp ? (
          <div>
            <span className="text-[10px] text-[#17B169] font-extrabold uppercase tracking-widest font-mono">
              Selected Module
            </span>
            <h3 className="text-white text-2xl font-extrabold mb-4">{selectedComp.name}</h3>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block font-sans">
                  Description
                </span>
                <p className="text-gray-300 text-xs leading-relaxed font-medium">{selectedComp.description}</p>
              </div>

              <div>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block font-sans">
                  Signal Input
                </span>
                <p className="text-[#06d6a0] text-xs font-mono font-bold">{selectedComp.input}</p>
              </div>

              <div>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block font-sans">
                  Signal Output
                </span>
                <p className="text-[#ff006e] text-xs font-mono font-bold">{selectedComp.output}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center">
            <p className="text-gray-500 text-xs">Click on any hardware component in the 3D model to inspect its details and signal properties.</p>
          </div>
        )}

        {/* Buttons List to select elements */}
        <div className="mt-6 pt-4 border-t border-gray-800/80">
          <span className="text-[9px] text-gray-500 font-bold block uppercase tracking-wider mb-2 font-mono">Quick Selection</span>
          <div className="flex flex-wrap gap-2">
            {COMPONENTS.map((comp) => (
              <button
                key={comp.id}
                onClick={() => {
                  setIsAnimating(false); // Stop auto animation
                  setSelectedComp(comp);
                }}
                className={`px-2 py-1 rounded text-[9px] font-bold tracking-widest uppercase transition-all duration-200 border cursor-pointer ${selectedComp?.id === comp.id
                    ? "bg-[#17B169] border-[#17B169] text-[#0A192F]"
                    : "bg-transparent border-gray-850 text-gray-400 hover:text-white hover:border-gray-700"
                  }`}
              >
                {comp.name.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
