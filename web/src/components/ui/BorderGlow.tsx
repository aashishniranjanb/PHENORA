"use client";

import React, { useRef, useState } from 'react';

interface BorderGlowProps {
  children: React.ReactNode;
  edgeSensitivity?: number;
  glowColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
  glowRadius?: number;
  glowIntensity?: number;
  coneSpread?: number;
  animated?: boolean;
  colors?: string[];
  className?: string;
}

export default function BorderGlow({
  children,
  edgeSensitivity = 30,
  glowColor = "5, 150, 105", // Default green
  backgroundColor = "transparent",
  borderRadius = 12,
  glowRadius = 100,
  glowIntensity = 1.0,
  coneSpread = 25,
  animated = false,
  colors = [],
  className = ""
}: BorderGlowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative group ${className}`}
      style={{ borderRadius: `${borderRadius}px` }}
    >
      <div
        className="absolute -inset-[3px] z-0 pointer-events-none transition-opacity duration-300 blur-[8px]"
        style={{
          opacity: isHovered ? glowIntensity : 0,
          background: `radial-gradient(${glowRadius * 1.5}px circle at ${mousePosition.x}px ${mousePosition.y}px, rgb(${glowColor}), transparent 100%)`,
          borderRadius: `${borderRadius + 3}px`
        }}
      />
      <div 
        className="relative z-10 w-full h-full"
        style={{ borderRadius: `${borderRadius}px`, backgroundColor: backgroundColor === "transparent" ? undefined : backgroundColor }}
      >
        {children}
      </div>
    </div>
  );
}
