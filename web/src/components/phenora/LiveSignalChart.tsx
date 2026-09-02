import React, { useMemo } from 'react';
import { RawSignalSample } from '../../core/signalTypes';

interface LiveSignalChartProps {
  samples: RawSignalSample[];
  baseline: number;
}

export const LiveSignalChart: React.FC<LiveSignalChartProps> = ({ samples, baseline }) => {
  const width = 800;
  const height = 300;
  const padding = 40;

  // Compute extents
  const { minVal, maxVal } = useMemo(() => {
    if (!samples.length) return { minVal: 0, maxVal: 3.3 };
    let min = Infinity;
    let max = -Infinity;
    samples.forEach(s => {
      if (s.value < min) min = s.value;
      if (s.value > max) max = s.value;
    });
    // Add some margin
    const range = max - min;
    const margin = range === 0 ? 0.5 : range * 0.2;
    return { minVal: Math.max(0, min - margin), maxVal: max + margin };
  }, [samples]);

  // Generate SVG path for signal
  const pathData = useMemo(() => {
    if (!samples.length) return "";
    return samples.map((s, i) => {
      const x = padding + (i / (Math.max(1, samples.length - 1))) * (width - 2 * padding);
      const y = height - padding - ((s.value - minVal) / (Math.max(0.001, maxVal - minVal))) * (height - 2 * padding);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(" ");
  }, [samples, minVal, maxVal, width, height]);

  // Baseline Y coordinate
  const baselineY = useMemo(() => {
    return height - padding - ((baseline - minVal) / (Math.max(0.001, maxVal - minVal))) * (height - 2 * padding);
  }, [baseline, minVal, maxVal, height]);

  return (
    <div className="w-full bg-white border border-gray-200 overflow-hidden font-mono relative">
      <div className="absolute top-4 left-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">
        Live Electrical Response
      </div>
      
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="block w-full h-[300px]">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
          const y = padding + pct * (height - 2 * padding);
          const val = maxVal - pct * (maxVal - minVal);
          return (
            <g key={`grid-y-${i}`}>
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4" />
              <text x={padding - 10} y={y + 4} textAnchor="end" fill="#9ca3af" fontSize="10">{val.toFixed(2)}</text>
            </g>
          );
        })}

        {/* Baseline Line */}
        {baseline > 0 && baselineY > padding && baselineY < height - padding && (
          <g>
            <line 
              x1={padding} 
              y1={baselineY} 
              x2={width - padding} 
              y2={baselineY} 
              stroke="#9ca3af" 
              strokeWidth="2" 
              strokeDasharray="8 4" 
            />
            <text x={width - padding + 10} y={baselineY + 4} fill="#9ca3af" fontSize="10">baseline</text>
          </g>
        )}

        {/* Signal Trace */}
        {pathData && (
          <path
            d={pathData}
            fill="none"
            stroke="#0ea5e9" // Tailwind sky-500
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}
      </svg>
    </div>
  );
};
