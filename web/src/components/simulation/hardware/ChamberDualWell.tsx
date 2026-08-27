"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

interface ChamberProps {
  highlighted: boolean;
  phaseActive: boolean;
  cellConcentration?: number;
  conductivity?: number;
  temperature?: number;
}

export default function ChamberDualWell({
  highlighted,
  phaseActive,
  cellConcentration = 0.5,
  conductivity = 1.0,
  temperature = 25,
}: ChamberProps) {
  const groupRef = useRef<THREE.Group>(null);
  const testCellsRef = useRef<THREE.Group>(null);
  const controlCellsRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Slow rotation for biological cellular inclusions
  useFrame((_, dt) => {
    if (testCellsRef.current) testCellsRef.current.rotation.y += dt * 0.08;
    if (controlCellsRef.current) controlCellsRef.current.rotation.y += dt * 0.04;

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
  });

  const cellCount = Math.max(4, Math.floor(cellConcentration * 40) + 4);

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

  const pcbAccent = phaseActive ? "#00ffcc" : highlighted ? "#17B169" : "#0A192F";

  return (
    <group ref={groupRef}>
      {/* 1. Dark Base Chassis Plate */}
      <mesh castShadow receiveShadow position={[0, -0.25, 0]}>
        <boxGeometry args={[1.7, 0.06, 1.2]} />
        <meshStandardMaterial color="#040d1a" roughness={0.7} metalness={0.4} />
      </mesh>

      {/* Corner Standoffs / Base Pillars */}
      {[
        [-0.75, 0.48], [0.75, 0.48],
        [-0.75, -0.48], [0.75, -0.48]
      ].map(([x, z], i) => (
        <mesh key={`pillar-${i}`} position={[x, -0.15, z]}>
          <cylinderGeometry args={[0.045, 0.045, 0.14, 12]} />
          <meshStandardMaterial color="#333333" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}

      {/* 2. Main Clear Acrylic Chamber Body */}
      <mesh castShadow receiveShadow position={[0, 0.02, 0]}>
        <boxGeometry args={[1.6, 0.42, 1.05]} />
        <meshPhysicalMaterial
          color="#a0c8f0"
          transparent
          opacity={0.35}
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
            <meshStandardMaterial color="#cccccc" metalness={0.95} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.026, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.005, 6]} />
            <meshStandardMaterial color="#222222" metalness={0.8} />
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
            opacity={0.75}
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
          {Array.from({ length: Math.floor(cellCount / 2) }).map((_, i) => {
            const x = Math.sin(i * 2.1) * 0.18;
            const y = -0.08 + Math.cos(i * 1.5) * 0.06;
            const z = Math.sin(i * 3.7) * 0.18;
            return (
              <mesh key={`ctrl-cell-${i}`} position={[x, y, z]}>
                <sphereGeometry args={[0.025, 8, 8]} />
                <meshStandardMaterial color="#60a5fa" roughness={0.6} transparent opacity={0.8} />
              </mesh>
            );
          })}
        </group>

        {/* Control Label */}
        <Html position={[0, -0.16, 0.54]} center distanceFactor={8}>
          <div className="px-1.5 py-0.5 rounded text-[7px] font-extrabold tracking-widest text-blue-400 bg-blue-950/80 border border-blue-800 uppercase pointer-events-none">
            CONTROL
          </div>
        </Html>
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
            opacity={0.78}
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
          {Array.from({ length: cellCount }).map((_, i) => {
            const x = Math.sin(i * 1.73) * 0.19;
            const y = -0.08 + Math.cos(i * 2.31) * 0.06;
            const z = Math.sin(i * 3.17) * 0.19;
            const s = 0.028 + Math.abs(Math.sin(i * 5.5)) * 0.015;
            return (
              <mesh key={`test-cell-${i}`} position={[x, y, z]}>
                <sphereGeometry args={[s, 8, 8]} />
                <meshStandardMaterial color="#f87171" roughness={0.7} transparent opacity={0.85} />
              </mesh>
            );
          })}
        </group>

        {/* Test Label */}
        <Html position={[0, -0.16, 0.54]} center distanceFactor={8}>
          <div className="px-1.5 py-0.5 rounded text-[7px] font-extrabold tracking-widest text-red-400 bg-red-950/80 border border-red-800 uppercase pointer-events-none">
            TEST
          </div>
        </Html>
      </group>

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
    </group>
  );
}
