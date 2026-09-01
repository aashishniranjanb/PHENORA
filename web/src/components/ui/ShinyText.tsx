"use client";

import React from 'react';

interface ShinyTextProps {
  text: string;
  speed?: number;
  delay?: number;
  color?: string;
  shineColor?: string;
  spread?: number;
  direction?: 'left' | 'right';
  yoyo?: boolean;
  pauseOnHover?: boolean;
  className?: string;
}

export default function ShinyText({
  text,
  speed = 2,
  delay = 0,
  color = "#b5b5b5",
  shineColor = "#ffffff",
  spread = 120,
  direction = "left",
  yoyo = false,
  pauseOnHover = false,
  className = ""
}: ShinyTextProps) {
  // A unique ID for the keyframes to prevent conflicts if multiple speeds are used
  const animationName = `shine-animation-${direction}-${speed}`.replace(/\./g, '-');

  return (
    <span
      className={`inline bg-clip-text text-transparent bg-no-repeat ${className} ${pauseOnHover ? 'hover:[animation-play-state:paused]' : ''}`}
      style={{
        backgroundImage: `linear-gradient(${direction === 'left' ? '120deg' : '-120deg'}, transparent 0%, transparent calc(50% - ${spread}px), ${shineColor} 50%, transparent calc(50% + ${spread}px), transparent 100%)`,
        backgroundSize: '200% 100%',
        backgroundColor: color,
        animation: `${animationName} ${speed}s linear infinite`,
        animationDelay: `${delay}s`,
        animationDirection: yoyo ? 'alternate' : 'normal',
        WebkitBackgroundClip: 'text',
      }}
    >
      {text}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes ${animationName} {
            0% { background-position: ${direction === 'left' ? '200%' : '-200%'} center; }
            100% { background-position: ${direction === 'left' ? '-200%' : '200%'} center; }
          }
        `
      }} />
    </span>
  );
}
