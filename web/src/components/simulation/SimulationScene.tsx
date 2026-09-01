"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import HeltecBoard from "./hardware/HeltecBoard";
import VsdFpgaBoard from "./hardware/VsdFpgaBoard";
import Ad5933Board from "./hardware/Ad5933Board";
import ChamberDualWell from "./hardware/ChamberDualWell";

export interface HardwareComp {
  id: string;
  shortName: string;
  fullName: string;
  chipColor: string;
  basePosition: [number, number, number];
  size: [number, number, number];
}

export const HARDWARE_COMPS: HardwareComp[] = [
  { id: "chamber", shortName: "DUAL CHAMBER", fullName: "PHENORA Dual Sample & Control Chamber", chipColor: "#2a6f97", basePosition: [-4.0, 0, 0], size: [1.6, 0.5, 1.1] },
  { id: "ad5933",  shortName: "AD5933",  fullName: "AD5933 Impedance IC", chipColor: "#7b2d8b", basePosition: [-1.6, 0, 0], size: [1.0, 0.14, 1.0] },
  { id: "heltec",  shortName: "ESP32-S3",fullName: "Heltec ESP32-S3", chipColor: "#0a6b55", basePosition: [0.9, 0, 0], size: [1.4, 0.18, 1.0] },
  { id: "fpga",    shortName: "iCE40",   fullName: "iCE40UP5K FPGA", chipColor: "#8b0036", basePosition: [3.1, 0, 0], size: [1.1, 0.14, 1.1] },
];

export const PHASE_COMP: Record<number, string> = { 0: "chamber", 1: "chamber", 2: "ad5933", 3: "heltec", 4: "fpga", 5: "fpga", 6: "fpga" };

export interface SimulationSceneProps {
  cellConcentration: number;
  conductivity: number;
  temperature: number;
  activePhase: number | null;
  currentStep: number;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  isExploded: boolean;
}

function CellularInclusions({ concentration }: { concentration: number }) {
  const ref = useRef<THREE.Group>(null);
  const count = Math.max(4, Math.floor(concentration * 65) + 4);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.04;
  });
  return (
    <group ref={ref}>
      {Array.from({ length: count }).map((_, i) => {
        const x = Math.sin(i * 1.73) * 0.42;
        const y = Math.cos(i * 2.31) * 0.23;
        const z = Math.sin(i * 3.17) * 0.42;
        const s = 0.033 + Math.abs(Math.sin(i * 5.5)) * 0.033;
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[s, 8, 8]} />
            <meshStandardMaterial color="#d90429" roughness={0.8} transparent opacity={0.72} />
          </mesh>
        );
      })}
    </group>
  );
}

function MeasurementFlow({ conductivity, temperature, active }: { conductivity: number; temperature: number; active: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const count = 44;
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      a[i * 3] = (Math.random() - 0.5) * 0.72;
      a[i * 3 + 1] = (Math.random() - 0.5) * 0.46;
      a[i * 3 + 2] = (Math.random() - 0.5) * 0.72;
    }
    return a;
  }, []);
  useFrame((_, dt) => {
    if (!ref.current || !active) return;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    const spd = 0.48 * dt * conductivity * (1 + 0.02 * (temperature - 25));
    for (let i = 0; i < count; i++) {
      pos[i * 3] += spd;
      if (pos[i * 3] > 0.36) {
        pos[i * 3] = -0.36;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 0.46;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 0.72;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#17B169" size={0.042} transparent opacity={active ? 0.82 : 0.15} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function DataPulse({ points, color, active, animType = "analog" }: { points: [number, number, number][]; color: string; active: boolean; animType?: "analog" | "i2c" | "uart" }) {
  const curve = useMemo(() => new (THREE as any).CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)), false, "catmullrom", 0.3), [points]);
  
  const count = animType === "analog" ? 15 : animType === "i2c" ? 8 : 4;
  const meshesRef = useRef<(THREE.Mesh | null)[]>([]);
  const progress = useRef(0);

  useFrame((_, dt) => {
    if (!active) return;
    
    let speed = 0.65;
    if (animType === "analog") speed = 0.25; 
    if (animType === "i2c") speed = 1.2; 
    if (animType === "uart") speed = 0.8;

    progress.current = (progress.current + dt * speed) % 1;

    meshesRef.current.forEach((mesh, i) => {
      if (!mesh) return;
      let t = 0;
      if (animType === "analog") {
        t = (progress.current + i / count) % 1;
      } else if (animType === "i2c") {
        t = progress.current - (i * 0.02);
      } else if (animType === "uart") {
        t = progress.current - (i * 0.1);
      }
      
      if (t < 0) t += 1;
      if (t > 1) t -= 1;

      const pos = curve.getPointAt(t);
      mesh.position.copy(pos);
      
      const distFromEnds = Math.min(t, 1 - t);
      const scale = Math.min(1, distFromEnds * 5);
      mesh.scale.setScalar(scale);
    });
  });

  return (
    <group visible={active}>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i} ref={el => { meshesRef.current[i] = el; }}>
          <sphereGeometry args={[animType === "analog" ? 0.04 : 0.06, 10, 10]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={animType === "analog" ? 1.0 : 2.0} transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function RealisticWire({ points, color, active, radius = 0.025, label }: {
  points: [number, number, number][];
  color: string;
  active: boolean;
  radius?: number;
  label?: string;
}) {
  const [hovered, setHovered] = useState(false);
  const { tube, midPoint } = useMemo(() => {
    const curve = new (THREE as any).CatmullRomCurve3(
      points.map(p => new THREE.Vector3(...p)),
      false,
      "catmullrom",
      0.3
    );
    const geo = new THREE.TubeGeometry(curve, 32, radius, 8, false);
    const mid = curve.getPointAt(0.5);
    return { tube: geo, midPoint: [mid.x, mid.y + 0.32, mid.z] as [number, number, number] };
  }, [points, radius]);

  return (
    <group
      onPointerOver={e => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={e => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      <mesh geometry={tube}>
        <meshStandardMaterial
          color={active ? color : "#94a3b8"}
          emissive={active ? color : "#000000"}
          emissiveIntensity={active ? 0.35 : 0}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      {/* Wire jacket stripe */}
      <mesh geometry={tube}>
        <meshStandardMaterial
          color={active ? color : "#64748b"}
          transparent
          opacity={0.12}
          roughness={0.1}
          metalness={0.9}
          wireframe
        />
      </mesh>
      {active && label && (
        <Html position={midPoint} center distanceFactor={10}>
          <div className={`transition-opacity duration-300 text-[7px] text-slate-900 font-mono font-bold bg-white/95 px-1.5 py-0.5 rounded shadow-sm pointer-events-none whitespace-nowrap border border-slate-300 ${hovered ? "opacity-100" : "opacity-0"}`}>{label}</div>
        </Html>
      )}
    </group>
  );
}

// Connector pin at board edge — small cylinder representing a wire plug
function ConnectorPin({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <mesh position={position}>
      <cylinderGeometry args={[0.04, 0.04, 0.08, 8]} />
      <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
    </mesh>
  );
}

// Ground plane reflector
function GroundPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.48, 0]} receiveShadow>
      <planeGeometry args={[20, 8]} />
      <meshStandardMaterial color="#e2e8f0" roughness={0.9} metalness={0.05} transparent opacity={0.7} />
    </mesh>
  );
}

function AnimatedHardwareGroup({ comp, isExploded, isSelected, ctrlRef, onSelect, onHover, children }: any) {
  const groupRef = useRef<THREE.Group>(null);
  const EXPLODED_OFFSETS: Record<string, [number, number, number]> = {
    chamber: [0, 3.0, 0],
    ad5933: [0, 2.0, 0],
    heltec: [0, 1.0, 0],
    fpga: [0, 0.0, 0]
  };

  const targetPos = new THREE.Vector3(...comp.basePosition);
  if (isExploded) {
    const o = EXPLODED_OFFSETS[comp.id];
    targetPos.add(new THREE.Vector3(o[0], o[1], o[2]));
  }

  useFrame((_, dt) => {
    if (groupRef.current) {
      groupRef.current.position.lerp(targetPos, dt * 5);
    }
  });

  return (
    <group 
      ref={groupRef} 
      onClick={e => { e.stopPropagation(); onSelect(comp.id); }}
      onPointerOver={e => { e.stopPropagation(); onHover(comp.id); document.body.style.cursor = 'pointer'; }}
      onPointerOut={e => { e.stopPropagation(); onHover(null); document.body.style.cursor = 'auto'; }}
    >
      {children}
    </group>
  );
}

function SceneContent({ cellConcentration, conductivity, temperature, activePhase, currentStep, selectedId, onSelect, isExploded, ctrlRef, autoRotate }:
  SimulationSceneProps & { ctrlRef: React.RefObject<any>; autoRotate: boolean }) {

  const EXPLODED_OFFSETS: Record<string, [number, number, number]> = {
    chamber: [0, 3.0, 0],
    ad5933: [0, 2.0, 0],
    heltec: [0, 1.0, 0],
    fpga: [0, 0.0, 0]
  };

  const targetTarget = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const isAnimatingCam = useRef(false);
  const keys = useRef({ w: false, a: false, s: false, d: false });
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent, isDown: boolean) => {
      // Only capture WASD if user is not typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const k = e.key.toLowerCase();
      if (keys.current.hasOwnProperty(k)) {
        keys.current[k as keyof typeof keys.current] = isDown;
      }
    };
    const onKeyDown = (e: KeyboardEvent) => handleKey(e, true);
    const onKeyUp = (e: KeyboardEvent) => handleKey(e, false);
    
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  useEffect(() => {
    if (selectedId) {
      const comp = HARDWARE_COMPS.find(c => c.id === selectedId);
      if (comp) {
        const pos = new THREE.Vector3(...comp.basePosition);
        if (isExploded) {
          const o = EXPLODED_OFFSETS[comp.id];
          pos.add(new THREE.Vector3(o[0], o[1], o[2]));
        }
        targetTarget.current.copy(pos);
      }
    } else {
      targetTarget.current.set(0, 0, 0);
    }
    isAnimatingCam.current = true;
  }, [selectedId, isExploded]);

  useFrame((state, dt) => {
    if (isAnimatingCam.current && ctrlRef.current) {
      ctrlRef.current.target.lerp(targetTarget.current, dt * 4);
      if (ctrlRef.current.target.distanceTo(targetTarget.current) < 0.02) {
        ctrlRef.current.target.copy(targetTarget.current);
        isAnimatingCam.current = false;
      }
    } else if (ctrlRef.current && !isAnimatingCam.current) {
      // WASD Manual Panning (True 2D Screen Plane)
      let moved = false;
      const moveSpeed = 8.0 * dt;
      const panOffset = new THREE.Vector3();
      
      const up = new THREE.Vector3(0, 1, 0).applyQuaternion(state.camera.quaternion);
      const right = new THREE.Vector3(1, 0, 0).applyQuaternion(state.camera.quaternion);

      if (keys.current.w) { panOffset.add(up.clone().multiplyScalar(moveSpeed)); moved = true; }
      if (keys.current.s) { panOffset.sub(up.clone().multiplyScalar(moveSpeed)); moved = true; }
      if (keys.current.a) { panOffset.sub(right.clone().multiplyScalar(moveSpeed)); moved = true; }
      if (keys.current.d) { panOffset.add(right.clone().multiplyScalar(moveSpeed)); moved = true; }

      if (moved) {
        state.camera.position.add(panOffset);
        ctrlRef.current.target.add(panOffset);
      }
    }
  });

  const phaseGte = (n: number) => activePhase !== null && activePhase >= n;

  // Wire routing points (from → [bend points] → to) to simulate practical cable runs
  // Chamber right edge → AD5933 left edge (analog coax pair)
  const chamberToAd5933: [number, number, number][] = [
    [-3.2, 0.0, 0.35],   // chamber right pin (front)
    [-2.8, 0.18, 0.45],  // rise up and route forward
    [-2.4, 0.22, 0.42],  // cable droop midpoint
    [-2.1, 0.12, 0.35],  // approach ad5933
    [-1.6, 0.0, 0.3],    // ad5933 left SMA
  ];
  const chamberToAd5933Rear: [number, number, number][] = [
    [-3.2, 0.0, -0.35],
    [-2.8, 0.2, -0.48],
    [-2.4, 0.24, -0.44],
    [-2.1, 0.14, -0.35],
    [-1.6, 0.0, -0.3],
  ];

  // AD5933 right → Heltec left (I2C ribbon cable)
  const ad5933ToHeltec: [number, number, number][] = [
    [-1.1, 0.0, 0.25],
    [-0.6, 0.15, 0.35],
    [-0.1, 0.2, 0.32],
    [0.3, 0.14, 0.28],
    [0.9, 0.0, 0.2],
  ];
  const ad5933ToHeltecGnd: [number, number, number][] = [
    [-1.1, 0.0, -0.25],
    [-0.6, 0.12, -0.32],
    [-0.1, 0.16, -0.3],
    [0.3, 0.1, -0.26],
    [0.9, 0.0, -0.2],
  ];

  // Heltec right → FPGA left (UART serial cable)
  const heltecToFpga: [number, number, number][] = [
    [1.6, 0.0, 0.28],
    [1.9, 0.18, 0.38],
    [2.3, 0.24, 0.35],
    [2.6, 0.16, 0.3],
    [3.1, 0.0, 0.22],
  ];
  const heltecToFpgaGnd: [number, number, number][] = [
    [1.6, 0.0, -0.28],
    [1.9, 0.15, -0.36],
    [2.3, 0.2, -0.33],
    [2.6, 0.12, -0.28],
    [3.1, 0.0, -0.22],
  ];

  // Power bus wire running along the back
  const powerBus: [number, number, number][] = [
    [-4.0, -0.2, -0.7],
    [-2.5, -0.22, -0.75],
    [-0.5, -0.24, -0.78],
    [1.5, -0.22, -0.75],
    [3.5, -0.2, -0.7],
  ];
  const groundBus: [number, number, number][] = [
    [-4.0, -0.22, -0.82],
    [-2.5, -0.24, -0.86],
    [-0.5, -0.26, -0.88],
    [1.5, -0.24, -0.86],
    [3.5, -0.22, -0.82],
  ];

  return (
    <>
      <ambientLight intensity={0.75} />
      <directionalLight position={[8, 14, 8]} intensity={1.4} castShadow />
      <directionalLight position={[-6, 6, -6]} intensity={0.45} />
      <directionalLight position={[0, 8, -10]} intensity={0.3} color="#e0e7ff" />

      {/* Ground platform */}
      {!isExploded && (
        <mesh position={[0, -0.42, 0]}>
          <boxGeometry args={[10.5, 0.08, 3.2]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.6} metalness={0.12} />
        </mesh>
      )}
      <GroundPlane />
      <gridHelper args={[18, 18, "#059669", "#94a3b8"]} position={[0, -0.55, 0]} />

      {HARDWARE_COMPS.map(comp => {
        const phaseActive = activePhase !== null && PHASE_COMP[activePhase] === comp.id;
        const highlighted = selectedId === comp.id;
        const isHovered = hoveredId === comp.id;
        const showLabel = isHovered;

        return (
          <AnimatedHardwareGroup 
            key={comp.id} 
            comp={comp} 
            isExploded={isExploded} 
            isSelected={highlighted} 
            ctrlRef={ctrlRef}
            onSelect={onSelect}
            onHover={setHoveredId}
          >
            {comp.id === "chamber" ? (
              <ChamberDualWell highlighted={highlighted} phaseActive={phaseActive} currentStep={currentStep} cellConcentration={cellConcentration} conductivity={conductivity} temperature={temperature} />
            ) : comp.id === "heltec" ? (
              <HeltecBoard highlighted={highlighted} phaseActive={phaseActive} currentStep={currentStep} />
            ) : comp.id === "fpga" ? (
              <VsdFpgaBoard highlighted={highlighted} phaseActive={phaseActive} currentStep={currentStep} />
            ) : comp.id === "ad5933" ? (
              <Ad5933Board highlighted={highlighted} phaseActive={phaseActive} currentStep={currentStep} />
            ) : null}
            <Html position={[0, comp.size[1] / 2 + 0.38, 0]} center distanceFactor={9}>
              <div className={`transition-opacity duration-300 px-2 py-0.5 rounded text-[8px] font-black tracking-wider uppercase whitespace-nowrap pointer-events-none border shadow-sm ${
                phaseActive ? "bg-[#059669] text-white border-[#059669]"
                : highlighted ? "bg-emerald-100 text-[#059669] border-emerald-400"
                : "bg-white/95 text-slate-700 border-slate-300"
              } ${showLabel ? "opacity-100" : "opacity-0"}`}>{comp.shortName}</div>
            </Html>
          </AnimatedHardwareGroup>
        );
      })}

      {/* ── REALISTIC WIRE HARNESS ── */}
      {!isExploded && (
        <>
          {/* Analog coax pair: Chamber ↔ AD5933 (purple = signal) */}
          <RealisticWire points={chamberToAd5933} color="#7c3aed" active={phaseGte(2)} radius={0.028} label="ANALOG SIG+" />
          <RealisticWire points={chamberToAd5933Rear} color="#6d28d9" active={phaseGte(2)} radius={0.022} label="ANALOG SIG−" />

          {/* I2C ribbon: AD5933 ↔ Heltec (blue = I2C data, gray = ground) */}
          <RealisticWire points={ad5933ToHeltec} color="#2563eb" active={phaseGte(3)} radius={0.024} label="I2C SDA 400kHz" />
          <RealisticWire points={ad5933ToHeltecGnd} color="#3b82f6" active={phaseGte(3)} radius={0.02} label="I2C SCL" />

          {/* UART serial: Heltec ↔ FPGA (green = TX, teal = RX) */}
          <RealisticWire points={heltecToFpga} color="#059669" active={phaseGte(4)} radius={0.024} label="UART TX 115200" />
          <RealisticWire points={heltecToFpgaGnd} color="#0d9488" active={phaseGte(4)} radius={0.02} label="UART RX" />

          {/* Power & Ground bus (red = 3.3V, black = GND) */}
          <RealisticWire points={powerBus} color="#dc2626" active={true} radius={0.03} label="3.3V RAIL" />
          <RealisticWire points={groundBus} color="#1e293b" active={true} radius={0.026} label="GND BUS" />

          {/* Connector pins at wire endpoints */}
          <ConnectorPin position={[-3.2, 0.0, 0.35]} color="#7c3aed" />
          <ConnectorPin position={[-1.6, 0.0, 0.3]} color="#7c3aed" />
          <ConnectorPin position={[-3.2, 0.0, -0.35]} color="#6d28d9" />
          <ConnectorPin position={[-1.6, 0.0, -0.3]} color="#6d28d9" />
          <ConnectorPin position={[-1.1, 0.0, 0.25]} color="#2563eb" />
          <ConnectorPin position={[0.9, 0.0, 0.2]} color="#2563eb" />
          <ConnectorPin position={[1.6, 0.0, 0.28]} color="#059669" />
          <ConnectorPin position={[3.1, 0.0, 0.22]} color="#059669" />

          {/* Data pulse particles flowing along wire paths */}
          <DataPulse points={chamberToAd5933} color="#7c3aed" active={phaseGte(2)} animType="analog" />
          <DataPulse points={chamberToAd5933Rear} color="#6d28d9" active={phaseGte(2)} animType="analog" />
          <DataPulse points={ad5933ToHeltec} color="#2563eb" active={phaseGte(3)} animType="i2c" />
          <DataPulse points={heltecToFpga} color="#059669" active={phaseGte(4)} animType="uart" />
        </>
      )}
      <OrbitControls ref={ctrlRef} enableZoom minDistance={4} maxDistance={20} autoRotate={autoRotate} autoRotateSpeed={1.5} zoomToCursor={true} />
    </>
  );
}

export default function SimulationScene(props: SimulationSceneProps) {
  const [mounted, setMounted] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const ctrlRef = useRef<any>(null);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return (
    <div className="w-full h-full bg-slate-100 flex items-center justify-center border border-slate-200 rounded-xl">
      <span className="text-[#059669] text-xs font-black tracking-widest animate-pulse">LOADING SIMULATOR...</span>
    </div>
  );

  return (
    <div className="w-full h-full relative bg-slate-50 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/50">
      <Canvas camera={{ position: [0, 5.5, 10], fov: 40 }} shadows tabIndex={0}>
        <SceneContent {...props} ctrlRef={ctrlRef} autoRotate={autoRotate} />
      </Canvas>
      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-200 shadow-md pointer-events-none">
        <span className="text-[10px] text-[#059669] font-black tracking-widest block uppercase">PHENORA V1 Hardware Chain</span>
        <span className="text-[9px] text-slate-500 font-medium tracking-wide">Click to inspect / Drag to rotate / Scroll to zoom</span>
      </div>
      {/* Wire legend */}
      <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-2 rounded-md border border-slate-200 shadow-md pointer-events-none">
        <span className="text-[7px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Wire Legend</span>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[7px] font-mono font-bold">
          <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-purple-600 rounded-full inline-block" /> Analog</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-blue-600 rounded-full inline-block" /> I2C</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-emerald-600 rounded-full inline-block" /> UART</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-red-600 rounded-full inline-block" /> 3.3V</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-slate-800 rounded-full inline-block" /> GND</span>
        </div>
      </div>
      <div className="absolute top-3 right-3 flex gap-2">
        <button onClick={() => setAutoRotate(!autoRotate)} className={`px-3 py-1.5 rounded-md border text-[9px] font-bold tracking-wider uppercase shadow-sm transition-colors cursor-pointer ${autoRotate ? "bg-[#059669] text-white border-[#059669]" : "bg-white border-slate-300 text-slate-700 hover:text-slate-900 hover:border-slate-400"}`}>
          Auto Rotate
        </button>
        <button onClick={() => { ctrlRef.current?.reset(); props.onSelect(null); }} className="px-3 py-1.5 rounded-md bg-white border border-slate-300 text-[9px] text-slate-700 hover:text-slate-900 hover:border-slate-400 font-bold tracking-wider uppercase shadow-sm transition-colors cursor-pointer">
          Reset View
        </button>
      </div>
    </div>
  );
}
