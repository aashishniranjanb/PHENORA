import React from 'react';
import { SignalMode } from '../../simulation/signalGenerator';

interface RuntimeHeaderProps {
  mode: "SIMULATION" | "HARDWARE";
  isRunning: boolean;
  scenario: SignalMode;
  onToggleRun: () => void;
  onScenarioChange: (s: SignalMode) => void;
  onDataSourceChange: (m: "SIMULATION" | "HARDWARE") => void;
}

export const RuntimeHeader: React.FC<RuntimeHeaderProps> = ({
  mode,
  isRunning,
  scenario,
  onToggleRun,
  onScenarioChange,
  onDataSourceChange
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center bg-gray-50 border border-gray-200 p-4 font-mono text-sm mb-4">
      <div className="flex items-center space-x-4 mb-4 md:mb-0">
        <h1 className="text-xl font-bold tracking-tight text-gray-900">PHENORA</h1>
        <div className="flex items-center space-x-2 bg-white px-3 py-1 border border-gray-200">
          <div className="text-gray-500">SYSTEM:</div>
          <div className={`flex items-center space-x-1 ${isRunning ? 'text-green-600' : 'text-gray-400'}`}>
            <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
            <span className="font-semibold">{isRunning ? 'ONLINE' : 'STANDBY'}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {/* Mode Toggle Removed - Handled by top-level wrapper */}

        {mode === 'SIMULATION' && (
          <div className="flex items-center space-x-2">
            <label className="text-gray-500">SCENARIO:</label>
            <select 
              value={scenario}
              onChange={(e) => onScenarioChange(e.target.value as SignalMode)}
              className="bg-white border border-gray-200 px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="STABLE">STABLE</option>
              <option value="RISING">RISING</option>
              <option value="FALLING">FALLING</option>
              <option value="NOISY">NOISY</option>
              <option value="DRIFTING">DRIFTING</option>
              <option value="ANOMALY">ANOMALY</option>
            </select>
          </div>
        )}

        <button 
          onClick={onToggleRun}
          className={`px-6 py-1 font-bold border transition-colors ${
            isRunning 
              ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' 
              : 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'
          }`}
        >
          {isRunning ? 'HALT' : 'START LOOP'}
        </button>
      </div>
    </div>
  );
};
