"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface BoardProps {
  highlighted: boolean;
  phaseActive: boolean;
  currentStep?: number;
}

export default function HeltecBoard({ highlighted, phaseActive, currentStep = 0 }: BoardProps) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRefs = useRef<(THREE.MeshBasicMaterial | null)[]>([]);

  // Status-based coloring
  const ledColor = phaseActive ? "#00ffcc" : highlighted ? "#17B169" : "#ff3300";
  const pcbColor = phaseActive ? "#e6fff2" : highlighted ? "#d4edda" : "#ffffff";

  useFrame((_, dt) => {
    glowRefs.current.forEach((mat, i) => {
      if (mat) {
        const targetOp = highlighted ? [0.75, 0.4, 0.15][i] : 0;
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOp, dt * 2.5);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* Soft Blurry Glow Effect (3 Layers) */}
      {[
        { s: [1.05, 2.0, 1.05], id: 0 },
        { s: [1.15, 3.5, 1.15], id: 1 },
        { s: [1.28, 5.5, 1.28], id: 2 }
      ].map((layer, i) => (
        <mesh key={`glow-${layer.id}`} position={[0, 0, 0]}>
          <boxGeometry args={[1.4 * layer.s[0], 0.04 * layer.s[1], 0.7 * layer.s[2]]} />
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

      {/* 1. Main PCB Substrate */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[1.4, 0.04, 0.7]} />
        <meshStandardMaterial 
          color={pcbColor} 
          roughness={0.4} 
          metalness={0.1} 
        />
      </mesh>

      {/* 2. OLED Display Panel */}
      <group position={[0.2, 0.03, 0]}>
        {/* Screen Bezel */}
        <mesh castShadow position={[0, 0, 0]}>
          <boxGeometry args={[0.7, 0.03, 0.45]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
        </mesh>
        {/* Active Screen Area */}
        <mesh position={[0, 0.02, 0]}>
          <planeGeometry args={[0.62, 0.38]} />
          <meshStandardMaterial 
            color={phaseActive ? "#00a2ff" : "#020813"} 
            emissive={phaseActive ? "#0055ff" : "#000000"}
            emissiveIntensity={1.5}
            roughness={0.1} 
          />
        </mesh>
      </group>

      {/* 3. ESP32-S3 SoC / RF Shield */}
      <mesh castShadow position={[-0.25, 0.03, 0]}>
        <boxGeometry args={[0.3, 0.05, 0.3]} />
        <meshStandardMaterial color="#cccccc" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* 9. Active Tx/Rx Status LEDs */}
      <group position={[0.2, 0.04, 0.35]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.02, 0.01, 0.02]} />
          <meshStandardMaterial 
            color={currentStep === 3 ? "#3b82f6" : "#1e3a8a"} 
            emissive={currentStep === 3 ? "#60a5fa" : "#000"} 
            emissiveIntensity={currentStep === 3 ? 2 : 0} 
          />
        </mesh>
      </group>

      {/* 4. USB-C Port */}
      <mesh castShadow position={[-0.65, 0.03, 0]}>
        <boxGeometry args={[0.15, 0.06, 0.22]} />
        <meshStandardMaterial color="#999999" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* 5. PRG & RST Buttons */}
      <group position={[-0.55, 0.025, 0]}>
        {/* RST Button */}
        <mesh position={[0, 0, 0.22]}>
          <boxGeometry args={[0.08, 0.04, 0.08]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
        <mesh position={[0, 0.02, 0.22]}>
          <cylinderGeometry args={[0.02, 0.02, 0.02, 8]} />
          <meshStandardMaterial color="#b0b0b0" metalness={0.5} />
        </mesh>

        {/* PRG Button */}
        <mesh position={[0, 0, -0.22]}>
          <boxGeometry args={[0.08, 0.04, 0.08]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
        <mesh position={[0, 0.02, -0.22]}>
          <cylinderGeometry args={[0.02, 0.02, 0.02, 8]} />
          <meshStandardMaterial color="#b0b0b0" metalness={0.5} />
        </mesh>
      </group>

      {/* 6. Header Pins (Top and Bottom Rows) */}
      <group position={[0, -0.04, 0]}>
        {/* Top Header Row */}
        {Array.from({ length: 12 }).map((_, i) => {
          const x = -0.55 + i * 0.1;
          return (
            <mesh key={`top-pin-${i}`} position={[x, 0, 0.32]}>
              <cylinderGeometry args={[0.012, 0.012, 0.12, 4]} />
              <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
            </mesh>
          );
        })}
        {/* Bottom Header Row */}
        {Array.from({ length: 12 }).map((_, i) => {
          const x = -0.55 + i * 0.1;
          return (
            <mesh key={`bot-pin-${i}`} position={[x, 0, -0.32]}>
              <cylinderGeometry args={[0.012, 0.012, 0.12, 4]} />
              <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
            </mesh>
          );
        })}
      </group>

      {/* 7. Status Indicator LED */}
      <mesh position={[-0.45, 0.03, 0.12]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial 
          color={ledColor} 
          emissive={ledColor} 
          emissiveIntensity={phaseActive ? 2 : 0} 
        />
      </mesh>
    </group>
  );
}
