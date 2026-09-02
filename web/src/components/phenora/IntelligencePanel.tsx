import React from 'react';
import { PhenoraRuntimeState } from '../../core/runtimeState';
import { ExplanationPanel } from './ExplanationPanel';

interface IntelligencePanelProps {
  intelligence: PhenoraRuntimeState['intelligence'];
  signalQuality: number;
  hasData?: boolean;
}

export const IntelligencePanel: React.FC<IntelligencePanelProps> = ({ intelligence, signalQuality, hasData = true }) => {
  // ASCII Progress bar generator for the CLI/Instrument feel
  const renderProgressBar = (val: number, max: number = 100) => {
    if (!hasData) return "░░░░░░░░░░░░░░░░░░░░";
    const totalBlocks = 20;
    const filled = Math.round((val / max) * totalBlocks);
    let str = "";
    for (let i = 0; i < totalBlocks; i++) {
      str += i < filled ? "█" : "░";
    }
    return str;
  };

  return (
    <div className="flex flex-col bg-white border border-gray-200 p-4 font-mono w-full">
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">
        Signal Intelligence
      </div>

      <div className="flex flex-col space-y-4 text-sm">
        {/* Quality */}
        <div>
          <div className="flex justify-between text-gray-500 mb-1 text-xs">
            <span>QUALITY</span>
            <span>{!hasData ? "NIL" : `${signalQuality.toFixed(0)} / 100`}</span>
          </div>
          <div className={`tracking-widest ${!hasData ? 'text-gray-300' : signalQuality > 80 ? 'text-green-600' : signalQuality > 50 ? 'text-yellow-600' : 'text-red-600'}`}>
            {renderProgressBar(signalQuality)}
          </div>
        </div>

        {/* Trajectory */}
        <div className="flex flex-col">
          <span className="text-gray-500 text-xs mb-1">TRAJECTORY</span>
          <div className="flex justify-between items-baseline">
            <span className="font-bold text-gray-900 text-lg">
              {!hasData ? "NIL" : (
                  <>
                    {intelligence.trajectory === 'RISING' ? '↗ ' : intelligence.trajectory === 'FALLING' ? '↘ ' : intelligence.trajectory === 'FLAT' || intelligence.trajectory === 'STABLE' ? '→ ' : '〰 '}
                    {intelligence.trajectory}
                  </>
              )}
            </span>
            <span className="text-gray-400 text-xs">Confidence {!hasData ? "NIL" : `${intelligence.confidence}%`}</span>
          </div>
        </div>

        {/* Anomaly */}
        <div className="flex flex-col">
          <span className="text-gray-500 text-xs mb-1">ANOMALY</span>
          <div className="flex justify-between items-baseline">
            <span className={`font-bold text-lg ${!hasData ? 'text-gray-400' : intelligence.anomalyLevel === 'HIGH' ? 'text-red-600' : intelligence.anomalyLevel === 'MEDIUM' ? 'text-yellow-600' : 'text-green-600'}`}>
              {!hasData ? "NIL" : intelligence.anomalyLevel}
            </span>
            <span className="text-gray-400 text-xs">Score {!hasData ? "NIL" : `${intelligence.anomalyScore.toFixed(0)} / 100`}</span>
          </div>
        </div>

        {/* Explanation */}
        <div className="pt-2 mt-2 border-t border-gray-100">
            {hasData ? <ExplanationPanel explanations={intelligence.explanation} /> : <div className="text-gray-400 text-xs text-center p-2">Awaiting Data...</div>}
        </div>
      </div>
    </div>
  );
};
