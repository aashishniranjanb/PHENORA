"use client";

import { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";

// Individual components in the V1 device
const COMPONENTS = [
  {
    id: "control-well",
    name: "Control Well",
    position: [-2.5, 0.5, 1],
    color: "#2a6f97",
    size: [0.8, 1, 0.8],
    shape: "cylinder",
    description: "Contains the control suspension of bacteria in medium to establish baseline metabolic and growth behavior.",
    input: "Biological sample in growth broth",
    output: "Baseline differential electrical signal"
  },
  {
    id: "test-well",
    name: "Test Well",
    position: [-2.5, 0.5, -1],
    color: "#d90429",
    size: [0.8, 1, 0.8],
    shape: "cylinder",
    description: "Contains the test suspension of bacteria in medium exposed to a specific antibiotic concentration.",
    input: "Biological sample + antibiotic agent",
    output: "Treated differential electrical signal"
  },
  {
    id: "electrodes",
    name: "Electrodes",
    position: [-2.5, 0.1, 0],
    color: "#ffb703",
    size: [0.2, 0.1, 2.5],
    shape: "box",
    description: "Dual-channel electrical micro-electrode interface applying AC excitation into the wells.",
    input: "AC voltage excitation signal",
    output: "Current response proportional to impedance"
  },
  {
    id: "ad5933",
    name: "AD5933 Analyzer",
    position: [-0.5, 0.15, 0],
    color: "#8338ec",
    size: [1, 0.2, 1],
    shape: "box",
    description: "Integrated network impedance analyzer generating frequency sweeps (up to 100 kHz) and performing on-board Discrete Fourier Transform (DFT).",
    input: "Current response from electrodes",
    output: "Real (R) and Imaginary (I) registers via I2C"
  },
  {
    id: "heltec",
    name: "Heltec ESP32-S3",
    position: [1.5, 0.25, 0.8],
    color: "#06d6a0",
    size: [1.8, 0.2, 1],
    shape: "box",
    description: "Dual-core processor configuration. Controls the AD5933 sweep parameters via I2C and calculates impedance magnitude and phase features.",
    input: "R/I registers via I2C",
    output: "Impedance magnitude and phase feature streams via UART"
  },
  {
    id: "fpga",
    name: "VSDSquadron FPGA",
    position: [3.5, 0.2, -0.6],
    color: "#ff006e",
    size: [1.2, 0.15, 1.2],
    shape: "box",
    description: "Executes real-time digital filtering, computes differential slope statistics, and controls the adaptive SUSCEPTIBLE / RESISTANT / MEASURE AGAIN decision loops.",
    input: "UART features from Heltec",
    output: "Decisive status flags (STOP / REPEAT)"
  }
];

function ModelScene({ onSelect, selectedId }: { onSelect: (comp: any) => void, selectedId: string | null }) {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 15, 10]} intensity={1.2} />
      <directionalLight position={[-10, 5, -10]} intensity={0.5} />
      <gridHelper args={[20, 20, "#17B169", "#112240"]} position={[0, -0.05, 0]} />

      {/* PCB Base */}
      <mesh position={[0.5, -0.1, 0]}>
        <boxGeometry args={[9, 0.2, 4]} />
        <meshStandardMaterial color="#0A192F" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Components */}
      {COMPONENTS.map((comp) => {
        const isSelected = selectedId === comp.id;
        return (
          <mesh
            key={comp.id}
            position={comp.position as [number, number, number]}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(comp);
            }}
          >
            {comp.shape === "cylinder" ? (
              <cylinderGeometry args={[comp.size[0], comp.size[0], comp.size[1], 32]} />
            ) : (
              <boxGeometry args={comp.size as [number, number, number]} />
            )}
            <meshStandardMaterial
              color={isSelected ? "#17B169" : comp.color}
              emissive={isSelected ? "#17B169" : "#000000"}
              emissiveIntensity={isSelected ? 0.4 : 0}
              roughness={0.2}
              metalness={0.5}
            />
          </mesh>
        );
      })}

      {/* Stylized signal line connections */}
      <Line start={[-2.5, 0.1, 1]} end={[-2.5, 0.1, 0]} color="#ffb703" />
      <Line start={[-2.5, 0.1, -1]} end={[-2.5, 0.1, 0]} color="#ffb703" />
      <Line start={[-2.5, 0.1, 0]} end={[-0.5, 0.1, 0]} color="#8338ec" />
      <Line start={[-0.5, 0.1, 0]} end={[1.5, 0.1, 0.8]} color="#06d6a0" />
      <Line start={[1.5, 0.1, 0.8]} end={[3.5, 0.1, -0.6]} color="#ff006e" />

      <OrbitControls enableZoom={true} minDistance={3} maxDistance={15} />
    </>
  );
}

function Line({ start, end, color }: { start: [number, number, number]; end: [number, number, number]; color: string }) {
  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const lineMaterial = new THREE.LineBasicMaterial({ color: new THREE.Color(color) });
  const line = new THREE.Line(lineGeometry, lineMaterial);

  return <primitive object={line} />;
}

export default function ProductViewer() {
  const [mounted, setMounted] = useState(false);
  const [selectedComp, setSelectedComp] = useState<any>(COMPONENTS[0]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[450px] bg-[#0c1e36] rounded-xl flex items-center justify-center border border-gray-800">
        <span className="text-[#17B169] text-xs font-semibold tracking-widest animate-pulse">LOADING 3D SYSTEM...</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 relative h-[450px] bg-[#081526] border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
        <Canvas camera={{ position: [5, 4, 6], fov: 45 }}>
          <ModelScene onSelect={setSelectedComp} selectedId={selectedComp?.id || null} />
        </Canvas>
        <div className="absolute top-4 left-4 bg-[#0A192F]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-gray-800 pointer-events-none">
          <span className="text-[10px] text-gray-400 font-bold tracking-widest block uppercase">Interactive 3D V1</span>
          <span className="text-[9px] text-[#17B169] font-medium tracking-wide">Left click + drag to rotate • Scroll to zoom</span>
        </div>
      </div>

      <div className="bg-[#0A192F] border border-gray-800 rounded-xl p-6 flex flex-col justify-between shadow-2xl">
        {selectedComp ? (
          <div>
            <span className="text-[10px] text-[#17B169] font-extrabold uppercase tracking-widest">Selected Component</span>
            <h3 className="text-white text-2xl font-extrabold mb-4">{selectedComp.name}</h3>
            
            <div className="space-y-4">
              <div>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Description</span>
                <p className="text-gray-300 text-xs leading-relaxed">{selectedComp.description}</p>
              </div>
              
              <div>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Signal Input</span>
                <p className="text-[#06d6a0] text-xs font-mono font-medium">{selectedComp.input}</p>
              </div>
              
              <div>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Signal Output</span>
                <p className="text-[#ff006e] text-xs font-mono font-medium">{selectedComp.output}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center">
            <p className="text-gray-500 text-xs">Click on any hardware component in the 3D model to inspect its details and signal properties.</p>
          </div>
        )}
        
        <div className="mt-6 pt-4 border-t border-gray-800/80">
          <div className="flex flex-wrap gap-2">
            {COMPONENTS.map((comp) => (
              <button
                key={comp.id}
                onClick={() => setSelectedComp(comp)}
                className={`px-2 py-1 rounded text-[9px] font-bold tracking-widest uppercase transition-all duration-200 border ${
                  selectedComp?.id === comp.id
                    ? "bg-[#17B169] border-[#17B169] text-[#0A192F]"
                    : "bg-transparent border-gray-800 text-gray-400 hover:text-white hover:border-gray-700"
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

