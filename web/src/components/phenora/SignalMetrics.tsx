import React from 'react';
import { PhenoraRuntimeState } from '../../core/runtimeState';

interface SignalMetricsProps {
  signal: PhenoraRuntimeState['signal'];
}

export const SignalMetrics: React.FC<SignalMetricsProps> = ({ signal }) => {
  return (
    <div className="flex flex-wrap gap-4 p-4 bg-gray-50 border-b border-l border-r border-gray-200 font-mono text-sm">
      <div className="flex flex-col">
        <span className="text-gray-500 uppercase text-xs">Baseline</span>
        <span className="font-semibold text-gray-900">{signal.baseline.toFixed(3)} V</span>
      </div>
      <div className="w-px bg-gray-300"></div>
      
      <div className="flex flex-col">
        <span className="text-gray-500 uppercase text-xs">ΔF (Delta)</span>
        <span className={`font-semibold ${signal.delta > 0 ? 'text-green-600' : signal.delta < 0 ? 'text-blue-600' : 'text-gray-900'}`}>
          {signal.delta > 0 ? '+' : ''}{signal.delta.toFixed(3)}
        </span>
      </div>
      <div className="w-px bg-gray-300"></div>
      
      <div className="flex flex-col">
        <span className="text-gray-500 uppercase text-xs">Slope</span>
        <span className={`font-semibold ${signal.slope > 0 ? 'text-green-600' : signal.slope < 0 ? 'text-blue-600' : 'text-gray-900'}`}>
          {signal.slope > 0 ? '+' : ''}{signal.slope.toFixed(4)}
        </span>
      </div>
      <div className="w-px bg-gray-300"></div>

      <div className="flex flex-col">
        <span className="text-gray-500 uppercase text-xs">Noise</span>
        <span className="font-semibold text-gray-900">{signal.noise.toFixed(4)}</span>
      </div>
      <div className="w-px bg-gray-300"></div>

      <div className="flex flex-col">
        <span className="text-gray-500 uppercase text-xs">Drift</span>
        <span className="font-semibold text-gray-900">{signal.drift.toFixed(4)}</span>
      </div>
      <div className="w-px bg-gray-300"></div>

      <div className="flex flex-col">
        <span className="text-gray-500 uppercase text-xs">Stability</span>
        <span className="font-semibold text-gray-900">{(signal.stability * 100).toFixed(1)}%</span>
      </div>
    </div>
  );
};
