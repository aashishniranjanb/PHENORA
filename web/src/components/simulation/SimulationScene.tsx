"use client";

import { useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

interface SimulationSceneProps {
  cellConcentration: number; // 0 to 1
  conductivity: number; // S/m
  temperature: number; // °C
}

// Renders the moving electric field particles
function ElectricField({ conductivity, temperature }: { conductivity: number; temperature: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 60;
  
  // Create static positions and speed factor
  const [positions] = useState(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      // Random position inside the medium chamber [-2 to 2 on X, -0.8 to 0.8 on Y, -1 to 1 on Z]
      arr[i * 3] = (Math.random() - 0.5) * 4;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 1.6;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    return arr;
  });

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const pos = geo.attributes.position.array as Float32Array;
    
    // Speed increases with temperature (ion mobility) and conductivity
    const speed = 0.8 * delta * (conductivity * (1 + 0.02 * (temperature - 25.0)));

    for (let i = 0; i < particleCount; i++) {
      // Flow particles from left electrode to right electrode (along X-axis)
      pos[i * 3] += speed;
      
      // If particle exits the chamber boundary, reset it back to left side
      if (pos[i * 3] > 2.0) {
        pos[i * 3] = -2.0;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 1.6;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 2;
      }
    }
    geo.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#17B169"
        size={0.06}
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Renders the bacterial cell spheres
function BacterialCells({ concentration }: { concentration: number }) {
  const meshRef = useRef<THREE.Group>(null);
  
  // Calculate cell count based on concentration factor (max 120 cells for performance)
  const cellCount = Math.floor(concentration * 100) + 5;
  const cells = Array.from({ length: cellCount });

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    // Slow rotational float for biological immersion
    meshRef.current.rotation.y += delta * 0.05;
    meshRef.current.rotation.x += delta * 0.02;
  });

  return (
    <group ref={meshRef}>
      {cells.map((_, i) => {
        // Random positions inside sample space
        const x = (Math.sin(i * 1.7) * 1.8);
        const y = (Math.cos(i * 2.3) * 0.6);
        const z = (Math.sin(i * 3.1) * 0.9);
        const scale = 0.06 + Math.abs(Math.sin(i * 5.5)) * 0.05;

        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[scale, 8, 8]} />
            <meshStandardMaterial
              color="#d90429"
              roughness={0.8}
              metalness={0.1}
              transparent
              opacity={0.85}
            />
          </mesh>
        );
      })}
    </group>
  );
}

export default function SimulationScene({ cellConcentration, conductivity, temperature }: SimulationSceneProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full bg-[#081526] rounded-xl flex items-center justify-center border border-gray-800">
        <span className="text-[#17B169] text-xs font-semibold tracking-widest animate-pulse">LOADING SIMULATOR...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 2.5, 4.5], fov: 40 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 10, 5]} intensity={1.0} />
        <directionalLight position={[-5, 5, -5]} intensity={0.3} />
        
        {/* Left Electrode Mesh */}
        <mesh position={[-2.1, 0, 0]}>
          <boxGeometry args={[0.15, 1.8, 2.2]} />
          <meshStandardMaterial color="#ffb703" roughness={0.3} metalness={0.8} />
        </mesh>
        
        {/* Right Electrode Mesh */}
        <mesh position={[2.1, 0, 0]}>
          <boxGeometry args={[0.15, 1.8, 2.2]} />
          <meshStandardMaterial color="#ffb703" roughness={0.3} metalness={0.8} />
        </mesh>

        {/* Medium Chamber Chamber Base/Glass */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[4.0, 1.8, 2.2]} />
          <meshStandardMaterial 
            color="#0A192F" 
            transparent 
            opacity={0.15} 
            roughness={0.1} 
            metalness={0.9} 
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Cells Group */}
        <BacterialCells concentration={cellConcentration} />

        {/* Electric Field flow */}
        <ElectricField conductivity={conductivity} temperature={temperature} />

        <OrbitControls enableZoom={true} minDistance={2} maxDistance={8} />
      </Canvas>
      
      <div className="absolute top-4 left-4 bg-[#0A192F]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-gray-800 pointer-events-none">
        <span className="text-[10px] text-[#17B169] font-bold tracking-widest block uppercase">Live 3D Chamber Specimen</span>
        <span className="text-[9px] text-gray-400 font-medium tracking-wide">Flow speed = ion mobility • Red sphere = bacteria</span>
      </div>
    </div>
  );
}

