"use client";

import { useRef } from "react";
import * as THREE from "three";

interface BoardProps {
  highlighted: boolean;
  phaseActive: boolean;
}

export default function VsdFpgaBoard({ highlighted, phaseActive }: BoardProps) {
  const groupRef = useRef<THREE.Group>(null);

  const pcbColor = phaseActive ? "#ffe6f2" : highlighted ? "#eed4da" : "#fdfdfd";
  const activeColor = phaseActive ? "#ff0077" : highlighted ? "#8b0036" : "#2c2c2c";

  return (
    <group ref={groupRef}>
      {/* 1. Main PCB Substrate */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[1.2, 0.04, 0.75]} />
        <meshStandardMaterial 
          color={pcbColor} 
          roughness={0.4} 
          metalness={0.15} 
        />
      </mesh>

      {/* 2. main iCE40 FPGA IC (Left-center) */}
      <group position={[-0.26, 0.03, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.26, 0.04, 0.26]} />
          <meshStandardMaterial color={activeColor} roughness={0.6} />
        </mesh>
        {/* Visual label/die indicator */}
        <mesh position={[0, 0.021, 0]}>
          <planeGeometry args={[0.18, 0.18]} />
          <meshStandardMaterial color="#3a3a3a" roughness={1.0} />
        </mesh>
      </group>

      {/* 3. FTDI USB-to-UART IC (Right-center) */}
      <mesh castShadow position={[0.24, 0.03, 0.04]}>
        <boxGeometry args={[0.22, 0.04, 0.22]} />
        <meshStandardMaterial color="#222222" roughness={0.6} />
      </mesh>

      {/* 4. USB-C Connector (Right Edge) */}
      <mesh castShadow position={[0.54, 0.03, 0.04]}>
        <boxGeometry args={[0.15, 0.06, 0.22]} />
        <meshStandardMaterial color="#a3a3a3" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* 5. Headers (Black female connectors) */}
      {/* Left Edge Vertical Header */}
      <mesh castShadow position={[-0.52, 0.05, 0]}>
        <boxGeometry args={[0.08, 0.08, 0.6]} />
        <meshStandardMaterial color="#1f1f1f" roughness={0.8} />
      </mesh>
      {/* Left edge pins inside header */}
      {Array.from({ length: 7 }).map((_, i) => {
        const z = -0.24 + i * 0.08;
        return (
          <mesh key={`lh-pin-${i}`} position={[-0.52, 0.091, z]}>
            <boxGeometry args={[0.03, 0.01, 0.03]} />
            <meshStandardMaterial color="#a0a0a0" metalness={0.7} />
          </mesh>
        );
      })}

      {/* Top Horizontal Header */}
      <mesh castShadow position={[-0.26, 0.05, 0.31]}>
        <boxGeometry args={[0.5, 0.08, 0.08]} />
        <meshStandardMaterial color="#1f1f1f" roughness={0.8} />
      </mesh>

      {/* Bottom Horizontal Header */}
      <mesh castShadow position={[-0.26, 0.05, -0.31]}>
        <boxGeometry args={[0.5, 0.08, 0.08]} />
        <meshStandardMaterial color="#1f1f1f" roughness={0.8} />
      </mesh>

      {/* Center-Right Vertical Header */}
      <mesh castShadow position={[-0.01, 0.05, 0.1]}>
        <boxGeometry args={[0.08, 0.08, 0.38]} />
        <meshStandardMaterial color="#1f1f1f" roughness={0.8} />
      </mesh>

      {/* 6. Passive Components (Oscillators, Resistors, Capacitors) */}
      {/* Oscillator Crystal (Silver) */}
      <mesh castShadow position={[0.06, 0.03, -0.06]}>
        <boxGeometry args={[0.1, 0.05, 0.06]} />
        <meshStandardMaterial color="#d1d1d1" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Tiny SMD capacitors/resistors */}
      <group position={[0, 0.025, 0]}>
        <mesh position={[-0.15, 0, 0.18]}><boxGeometry args={[0.04, 0.02, 0.02]} /><meshStandardMaterial color="#7a624d" /></mesh>
        <mesh position={[-0.15, 0, 0.22]}><boxGeometry args={[0.04, 0.02, 0.02]} /><meshStandardMaterial color="#7a624d" /></mesh>
        <mesh position={[-0.15, 0, 0.26]}><boxGeometry args={[0.04, 0.02, 0.02]} /><meshStandardMaterial color="#333333" /></mesh>
        <mesh position={[0.2, 0, -0.16]}><boxGeometry args={[0.04, 0.02, 0.02]} /><meshStandardMaterial color="#7a624d" /></mesh>
        <mesh position={[0.25, 0, -0.16]}><boxGeometry args={[0.04, 0.02, 0.02]} /><meshStandardMaterial color="#7a624d" /></mesh>
      </group>

      {/* 7. Button (top right) */}
      <mesh castShadow position={[0.26, 0.03, 0.28]}>
        <boxGeometry args={[0.08, 0.03, 0.08]} />
        <meshStandardMaterial color="#555555" />
      </mesh>
      <mesh position={[0.26, 0.05, 0.28]}>
        <cylinderGeometry args={[0.02, 0.02, 0.02, 8]} />
        <meshStandardMaterial color="#ff3333" />
      </mesh>
    </group>
  );
}
