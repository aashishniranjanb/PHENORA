"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface BoardProps {
  highlighted: boolean;
  phaseActive: boolean;
  currentStep?: number;
}

export default function Ad5933Board({ highlighted, phaseActive, currentStep = 0 }: BoardProps) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRefs = useRef<(THREE.MeshBasicMaterial | null)[]>([]);

  const pcbColor = phaseActive ? "#00853c" : highlighted ? "#146338" : "#135a2d";
  const activeColor = phaseActive ? "#ab00ff" : highlighted ? "#7b2d8b" : "#222222";

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
          <boxGeometry args={[1.0 * layer.s[0], 0.04 * layer.s[1], 1.0 * layer.s[2]]} />
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

      {/* 1. Main PCB Substrate (Analog Devices Green) */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[1.0, 0.04, 1.0]} />
        <meshStandardMaterial 
          color={pcbColor} 
          roughness={0.5} 
          metalness={0.1} 
        />
      </mesh>

      {/* 2. AD5933 Impedance IC (Left-Center) */}
      <mesh castShadow position={[-0.15, 0.03, -0.1]}>
        <boxGeometry args={[0.18, 0.04, 0.18]} />
        <meshStandardMaterial color={activeColor} roughness={0.6} />
      </mesh>

      {/* 3. USB-B Connector (Left Edge) */}
      <mesh castShadow position={[-0.4, 0.08, -0.2]}>
        <boxGeometry args={[0.2, 0.14, 0.2]} />
        <meshStandardMaterial color="#cccccc" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* USB-B Inner Hole */}
      <mesh position={[-0.501, 0.08, -0.2]}>
        <boxGeometry args={[0.01, 0.08, 0.08]} />
        <meshStandardMaterial color="#111111" roughness={0.9} />
      </mesh>

      {/* 4. Green Screw Terminals (Right Edge) */}
      <group position={[0.38, 0.08, 0.1]}>
        <mesh castShadow>
          <boxGeometry args={[0.2, 0.14, 0.28]} />
          <meshStandardMaterial color="#1e7e34" roughness={0.5} />
        </mesh>
        {/* Metal screws on top */}
        <mesh position={[0, 0.071, -0.06]}>
          <cylinderGeometry args={[0.04, 0.04, 0.01, 8]} />
          <meshStandardMaterial color="#888888" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.071, 0.06]}>
          <cylinderGeometry args={[0.04, 0.04, 0.01, 8]} />
          <meshStandardMaterial color="#888888" metalness={0.8} />
        </mesh>
      </group>

      {/* 5. SMA Connector (Gold, Center) */}
      <group position={[0.1, 0.08, 0]}>
        {/* Gold Base */}
        <mesh castShadow>
          <boxGeometry args={[0.16, 0.04, 0.16]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Threaded cylinder */}
        <mesh castShadow position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.08, 12]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Inner core pin */}
        <mesh position={[0, 0.11, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.04, 8]} />
          <meshStandardMaterial color="#cccccc" metalness={0.8} />
        </mesh>
      </group>

      {/* 6. Jumpers and Jumper Headers (Black pins) */}
      <group position={[0.15, 0.04, 0.22]}>
        {/* Pins row */}
        {Array.from({ length: 3 }).map((_, i) => {
          const z = -0.1 + i * 0.08;
          return (
            <group key={`jumper-row-${i}`} position={[0, 0, z]}>
              <mesh position={[-0.04, 0.02, 0]}><cylinderGeometry args={[0.01, 0.01, 0.08, 4]} /><meshStandardMaterial color="#d4af37" metalness={0.8} /></mesh>
              <mesh position={[0.04, 0.02, 0]}><cylinderGeometry args={[0.01, 0.01, 0.08, 4]} /><meshStandardMaterial color="#d4af37" metalness={0.8} /></mesh>
              {/* Jumper cap (black plastic bridging) */}
              {i === 1 && (
                <mesh position={[0, 0.05, 0]}>
                  <boxGeometry args={[0.1, 0.06, 0.06]} />
                  <meshStandardMaterial color="#222222" roughness={0.8} />
                </mesh>
              )}
            </group>
          );
        })}
      </group>

      {/* 7. Active status LED */}
      <mesh position={[-0.32, 0.03, 0.28]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial 
          color={phaseActive ? "#00ff66" : highlighted ? "#00aa3c" : "#ffcc00"} 
          emissive={phaseActive ? "#00ff66" : "#000000"} 
          emissiveIntensity={phaseActive ? 1.5 : 0} 
        />
      </mesh>
    </group>
  );
}
