"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

interface ChamberDualWellProps {
  highlighted?: boolean;
  phaseActive?: boolean;
  currentStep?: number;
  cellConcentration?: number;
  conductivity?: number;
  temperature?: number;
  cutawayMode?: boolean;
  isResistant?: boolean;
}

const ACExcitationField = ({ active, isTest, currentStep }: { active: boolean; isTest: boolean; currentStep: number }) => {
  const count = 40;
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 0.22;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 0.16 - 0.02;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!active || !ref.current) return;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const startX = ((i / count) - 0.5) * 0.22;
      pos[i * 3] = startX + Math.sin(time * (isTest && currentStep >= 3 ? 25 : 15) + i) * 0.03;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} visible={active}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={isTest ? "#fca5a5" : "#93c5fd"} size={0.015} transparent opacity={0.6} blending={THREE.AdditiveBlending} />
    </points>
  );
};

export default function ChamberDualWell({
  highlighted,
  phaseActive,
  currentStep = 0,
  cellConcentration = 0.5,
  conductivity = 1.0,
  temperature = 25,
  cutawayMode = false,
  isResistant = false,
}: ChamberProps) {
  const groupRef = useRef<THREE.Group>(null);
  const testCellsRef = useRef<THREE.Group>(null);
  const controlCellsRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const glowRefs = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const dataStreamRef = useRef<THREE.Points>(null);

  // Slow rotation for biological cellular inclusions
  useFrame((state, dt) => {
    const time = state.clock.elapsedTime;

    if (testCellsRef.current) {
      let rotSpeed = 0.08;
      if (currentStep >= 3) {
        if (isResistant) {
          rotSpeed = 0.25 + Math.sin(time * 5) * 0.1;
          const scale = 1.0 + Math.sin(time * 8) * 0.15;
          testCellsRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
        } else {
          // Susceptible cells die/shrink in antibiotic
          rotSpeed = 0.02;
          testCellsRef.current.scale.lerp(new THREE.Vector3(0.2, 0.2, 0.2), 0.05);
        }
      } else {
        testCellsRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
      testCellsRef.current.rotation.y += dt * rotSpeed;
    }

    if (controlCellsRef.current) {
      let rotSpeed = 0.04;
      if (currentStep >= 3) {
        rotSpeed = 0.15;
      }
      controlCellsRef.current.rotation.y += dt * rotSpeed;
    }
    
    glowRefs.current.forEach((mat, i) => {
      if (mat) {
        const targetOp = highlighted ? [0.75, 0.4, 0.15][i] : 0;
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOp, dt * 2.5);
      }
    });

    if (particlesRef.current && phaseActive) {
      const pos = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const speed = 0.35 * dt * conductivity * (1 + 0.02 * (temperature - 25));
      for (let i = 0; i < pos.length / 3; i++) {
        pos[i * 3 + 1] += speed * (i % 2 === 0 ? 1 : -1);
        if (pos[i * 3 + 1] > 0.25) pos[i * 3 + 1] = -0.15;
        if (pos[i * 3 + 1] < -0.15) pos[i * 3 + 1] = 0.25;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    if (dataStreamRef.current && currentStep >= 4) { // COMPARE / PREDICT
      const pos = dataStreamRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < pos.length / 3; i++) {
        pos[i * 3 + 1] += dt * 0.8;
        if (pos[i * 3 + 1] > 1.0) pos[i * 3 + 1] = 0;
      }
      dataStreamRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const baseCellCount = Math.max(4, Math.floor(cellConcentration * 40) + 4);
  const controlCellCount = baseCellCount * 3;
  const testCellCount = baseCellCount * 3;

  // Excitation particles
  const particlePositions = useMemo(() => {
    const p = new Float32Array(60 * 3);
    for (let i = 0; i < 60; i++) {
      const isControl = i < 30;
      const cx = isControl ? -0.42 : 0.42;
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 0.22;
      p[i * 3] = cx + Math.cos(angle) * r;
      p[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
      p[i * 3 + 2] = Math.sin(angle) * r;
    }
    return p;
  }, []);

  const dataStreamPositions = useMemo(() => {
    const p = new Float32Array(100 * 3);
    for (let i = 0; i < 100; i++) {
      p[i * 3] = (Math.random() - 0.5) * 1.5;
      p[i * 3 + 1] = Math.random() * 1.0;
      p[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }
    return p;
  }, []);

  // Precompute Control Cells
  const controlCellData = useMemo(() => {
    return Array.from({ length: controlCellCount }).map((_, i) => {
      const x = Math.sin(i * 2.1) * (0.18 * Math.random());
      const y = -0.08 + Math.cos(i * 1.5) * (0.12 * Math.random());
      const z = Math.sin(i * 3.7) * (0.18 * Math.random());
      const activeStep = i < baseCellCount ? 1 : 3; // First batch visible at step 1, rest at step 3
      return { x, y, z, activeStep };
    });
  }, [controlCellCount, baseCellCount]);

  // Precompute Test Cells
  const testCellData = useMemo(() => {
    return Array.from({ length: testCellCount }).map((_, i) => {
      const x = Math.sin(i * 1.73) * (0.19 * Math.random());
      const y = -0.08 + Math.cos(i * 2.31) * (0.12 * Math.random());
      const z = Math.sin(i * 3.17) * (0.19 * Math.random());
      const s = 0.028 + Math.abs(Math.sin(i * 5.5)) * 0.015;
      const activeStep = i < baseCellCount ? 1 : 3;
      return { x, y, z, s, activeStep };
    });
  }, [testCellCount, baseCellCount]);

  const pcbAccent = phaseActive ? "#00ffcc" : highlighted ? "#17B169" : "#0A192F";

  const liquidOpacityTarget = currentStep >= 1 ? 0.75 : 0.0;
  const measurementActive = currentStep === 2; // MEASURE
  const isGrowing = currentStep >= 3;


  return (
    <group ref={groupRef}>
      {/* Soft Blurry Glow Effect (3 Layers) */}
      {[
        { s: [1.03, 1.5, 1.03], id: 0 },
        { s: [1.08, 2.5, 1.08], id: 1 },
        { s: [1.15, 3.8, 1.15], id: 2 }
      ].map((layer, i) => (
        <mesh key={`glow-${layer.id}`} position={[0, -0.25, 0]}>
          <boxGeometry args={[1.7 * layer.s[0], 0.06 * layer.s[1], 1.2 * layer.s[2]]} />
          <meshBasicMaterial 
            ref={el => { glowRefs.current[i] = el; }}
            color="#6ee7b7" 
            transparent
            opacity={0}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* 1. Dark Base Chassis Plate */}
      <mesh castShadow receiveShadow position={[0, -0.25, 0]}>
        <boxGeometry args={[1.7, 0.06, 1.2]} />
        <meshStandardMaterial 
          color="#040d1a" 
          roughness={0.7} 
          metalness={0.4} 
          transparent={cutawayMode}
          opacity={cutawayMode ? 0.2 : 1}
        />
      </mesh>

      {/* Corner Standoffs / Base Pillars */}
      {[
        [-0.75, 0.48], [0.75, 0.48],
        [-0.75, -0.48], [0.75, -0.48]
      ].map(([x, z], i) => (
        <mesh key={`pillar-${i}`} position={[x, -0.15, z]}>
          <cylinderGeometry args={[0.045, 0.045, 0.14, 12]} />
          <meshStandardMaterial color="#333333" metalness={0.9} roughness={0.2} transparent={cutawayMode} opacity={cutawayMode ? 0.3 : 1} />
        </mesh>
      ))}

      {/* 2. Main Clear Acrylic Chamber Body */}
      <mesh castShadow receiveShadow position={[0, 0.02, 0]}>
        <boxGeometry args={[1.6, 0.42, 1.05]} />
        <meshPhysicalMaterial
          color="#a0c8f0"
          transparent
          opacity={cutawayMode ? 0.1 : 0.35}
          roughness={0.08}
          metalness={0.1}
          transmission={0.8}
          ior={1.49}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Corner Stainless Steel Screws/Bolts */}
      {[
        [-0.72, 0.45], [0.72, 0.45],
        [-0.72, -0.45], [0.72, -0.45]
      ].map(([x, z], i) => (
        <group key={`bolt-${i}`} position={[x, 0.24, z]}>
          <mesh>
            <cylinderGeometry args={[0.035, 0.035, 0.05, 12]} />
            <meshStandardMaterial color="#cccccc" metalness={0.95} roughness={0.1} transparent={cutawayMode} opacity={cutawayMode ? 0.2 : 1} />
          </mesh>
          <mesh position={[0, 0.026, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.005, 6]} />
            <meshStandardMaterial color="#222222" metalness={0.8} transparent={cutawayMode} opacity={cutawayMode ? 0.2 : 1} />
          </mesh>
        </group>
      ))}

      {/* 3. CONTROL WELL (Left Well - Blue Fluid) */}
      <group position={[-0.42, 0, 0]}>
        {/* Glass Cylindrical Well Outer Wall */}
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.34, 0.34, 0.38, 32]} />
          <meshPhysicalMaterial
            color="#80bfff"
            transparent
            opacity={0.3}
            roughness={0.05}
            transmission={0.85}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Blue Liquid Sample */}
        <mesh position={[0, -0.04, 0]}>
          <cylinderGeometry args={[0.31, 0.31, 0.24, 32]} />
          <meshStandardMaterial
            color="#1d4ed8"
            emissive="#1e40af"
            emissiveIntensity={phaseActive ? 0.6 : 0.2}
            transparent
            opacity={currentStep >= 1 ? 0.75 : 0}
            roughness={0.2}
          />
        </mesh>

        {/* 4 Golden Pogo Pin Electrodes (Control) */}
        {[-0.1, -0.03, 0.03, 0.1].map((xOffset, i) => (
          <mesh key={`ctrl-pin-${i}`} position={[xOffset, 0.08, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.32, 8]} />
            <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
          </mesh>
        ))}

        {/* Top Blue Cable Connector Plug */}
        <group position={[0, 0.3, -0.15]} rotation={[0.4, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.07, 0.07, 0.18, 16]} />
            <meshStandardMaterial color="#2563eb" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.12, 12]} />
            <meshStandardMaterial color="#1e1e1e" roughness={0.8} />
          </mesh>
        </group>

        {/* Control Biological Cell Inclusions */}
        <group ref={controlCellsRef}>
          {controlCellData.map((data, i) => (
            <mesh key={`ctrl-cell-${i}`} position={[data.x, data.y, data.z]}>
              <sphereGeometry args={[0.025, 8, 8]} />
              <meshStandardMaterial color="#60a5fa" roughness={0.6} transparent opacity={currentStep >= data.activeStep ? 0.8 : 0} />
            </mesh>
          ))}
        </group>

        {/* Control Label */}
        <Html position={[0, -0.16, 0.54]} center distanceFactor={8}>
          <div className="px-1.5 py-0.5 rounded text-[7px] font-extrabold tracking-widest text-blue-400 bg-blue-950/80 border border-blue-800 uppercase pointer-events-none whitespace-nowrap">
            - ANTIBIOTIC (CONTROL) {currentStep >= 3 && " (GROWING)"}
          </div>
        </Html>

        {/* Control AC Excitation Field */}
        <ACExcitationField active={measurementActive} isTest={false} currentStep={currentStep} />
      </group>

      {/* 4. TEST WELL (Right Well - Red Fluid + Antibiotic) */}
      <group position={[0.42, 0, 0]}>
        {/* Glass Cylindrical Well Outer Wall */}
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.34, 0.34, 0.38, 32]} />
          <meshPhysicalMaterial
            color="#ff9999"
            transparent
            opacity={0.3}
            roughness={0.05}
            transmission={0.85}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Red Liquid Sample */}
        <mesh position={[0, -0.04, 0]}>
          <cylinderGeometry args={[0.31, 0.31, 0.24, 32]} />
          <meshStandardMaterial
            color="#dc2626"
            emissive="#991b1b"
            emissiveIntensity={phaseActive ? 0.7 : 0.2}
            transparent
            opacity={currentStep >= 1 ? 0.78 : 0}
            roughness={0.2}
          />
        </mesh>

        {/* 4 Golden Pogo Pin Electrodes (Test) */}
        {[-0.1, -0.03, 0.03, 0.1].map((xOffset, i) => (
          <mesh key={`test-pin-${i}`} position={[xOffset, 0.08, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.32, 8]} />
            <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
          </mesh>
        ))}

        {/* Top Red Cable Connector Plug */}
        <group position={[0, 0.3, -0.15]} rotation={[0.4, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.07, 0.07, 0.18, 16]} />
            <meshStandardMaterial color="#ef4444" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.12, 12]} />
            <meshStandardMaterial color="#1e1e1e" roughness={0.8} />
          </mesh>
        </group>

        {/* Test Biological Cell Inclusions */}
        <group ref={testCellsRef}>
          {testCellData.map((data, i) => (
            <mesh key={`test-cell-${i}`} position={[data.x, data.y, data.z]}>
              <sphereGeometry args={[data.s, 8, 8]} />
              <meshStandardMaterial 
                color="#f87171" 
                roughness={0.7} 
                transparent 
                opacity={currentStep >= data.activeStep ? (isResistant || data.activeStep === 1 ? 0.85 : 0) : 0} 
              />
            </mesh>
          ))}
        </group>

        {/* Test Label */}
        <Html position={[0, -0.16, 0.54]} center distanceFactor={8}>
          <div className="px-1.5 py-0.5 rounded text-[7px] font-extrabold tracking-widest text-red-400 bg-red-950/80 border border-red-800 uppercase pointer-events-none">
            + ANTIBIOTIC {currentStep >= 3 && (isResistant ? " (RESISTANT)" : " (SUPPRESSED)")}
          </div>
        </Html>

        {/* Test AC Excitation Field */}
        <ACExcitationField active={measurementActive} isTest={true} currentStep={currentStep} />
      </group>

      {/* 5. Data Stream Extracting upwards to Twin */}
      {currentStep >= 4 && (
        <points ref={dataStreamRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[dataStreamPositions, 3]} />
          </bufferGeometry>
          <pointsMaterial color="#a78bfa" size={0.04} transparent opacity={0.6} blending={THREE.AdditiveBlending} />
        </points>
      )}

      {/* 6. Dynamic Measurement Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particlePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={pcbAccent}
          size={0.035}
          transparent
          opacity={phaseActive ? 0.85 : 0.2}
          blending={THREE.AdditiveBlending}
        />
      </points>
      {/* 7. Smart Analysis HUD overlay */}
      {currentStep === 2 && (
        <Html position={[0, 0.4, 0]} center zIndexRange={[100, 0]}>
          <div className="bg-slate-900/90 backdrop-blur border border-emerald-500/50 px-3 py-2 rounded-lg text-emerald-400 font-mono text-[10px] whitespace-nowrap shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <div>
              <div className="font-bold tracking-widest uppercase">Internal Smart Analysis</div>
              <div className="text-slate-300">Signal Stability 98.4% — Sufficient Data Collected</div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
