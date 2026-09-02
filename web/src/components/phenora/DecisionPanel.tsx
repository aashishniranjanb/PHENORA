import React from 'react';
import { PhenoraRuntimeState } from '../../core/runtimeState';

interface DecisionPanelProps {
  decision: PhenoraRuntimeState['decision'];
  evidence: number;
  hasData?: boolean;
}

export const DecisionPanel: React.FC<DecisionPanelProps> = ({ decision, evidence, hasData = true }) => {
  const isStop = decision.decision === "STOP";
  const isTimeout = decision.decision === "TIMEOUT";
  
  let bgColor = "bg-gray-50";
  let borderColor = "border-gray-300";
  let textColor = "text-gray-900";
  
  if (!hasData) {
    bgColor = "bg-gray-50";
    borderColor = "border-gray-200";
    textColor = "text-gray-400";
  } else if (isStop) {
    bgColor = "bg-green-50";
    borderColor = "border-green-400";
    textColor = "text-green-700";
  } else if (isTimeout) {
    bgColor = "bg-red-50";
    borderColor = "border-red-400";
    textColor = "text-red-700";
  } else {
    bgColor = "bg-blue-50";
    borderColor = "border-blue-400";
    textColor = "text-blue-700";
  }

  return (
    <div className="flex flex-col bg-white border border-gray-200 p-4 font-mono w-full">
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">
        Edge Decision (FPGA)
      </div>

      <div className={`flex flex-col items-center justify-center p-6 border-2 ${borderColor} ${bgColor} mb-6`}>
        {/* Prominent Dummy FPGA Board Visual */}
        <div className={`flex flex-col items-center justify-center mb-4 ${!hasData ? 'opacity-50' : ''}`}>
          <svg width="80" height="80" viewBox="0 0 100 100" className="text-gray-800 drop-shadow-md">
            <rect x="10" y="10" width="80" height="80" rx="8" fill="#1e293b" />
            {/* Board traces/pins */}
            <path d="M10 30h10M10 50h10M10 70h10M80 30h10M80 50h10M80 70h10M30 10v10M50 10v10M70 10v10M30 80v10M50 80v10M70 80v10" stroke="#94a3b8" strokeWidth="3" />
            {/* Main FPGA Chip */}
            <rect x="30" y="30" width="40" height="40" rx="2" fill="#0f172a" stroke="#334155" strokeWidth="2" />
            <circle cx="20" cy="20" r="3" fill="#cbd5e1" />
            <circle cx="80" cy="20" r="3" fill="#cbd5e1" />
            <circle cx="20" cy="80" r="3" fill="#cbd5e1" />
            <circle cx="80" cy="80" r="3" fill="#cbd5e1" />
            <text x="50" y="52" fill="#94a3b8" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">iCE40</text>
          </svg>
          <div className="text-[10px] text-gray-500 font-bold tracking-widest mt-2 uppercase">Physical FPGA Dummy</div>
        </div>

        <div className={`text-2xl font-bold tracking-widest ${textColor} mb-4 relative z-10`}>
          {!hasData ? "AWAITING DATA" : decision.decision.replace('_', ' ')}
        </div>
        
        <div className="text-xs text-gray-600 w-full text-center">
          {!hasData ? (
             <span>Pipeline Idle</span>
          ) : isStop ? (
            <span>Evidence Sufficient</span>
          ) : isTimeout ? (
            <span>Maximum budget reached</span>
          ) : (
            <div className="flex flex-col items-center">
               <span>Evidence: {evidence.toFixed(1)}%</span>
               <span className="text-gray-400">Required: 85%</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col text-xs space-y-2 relative z-10">
        <div className="text-gray-500 uppercase border-b border-gray-100 pb-1 mb-1">Reason</div>
        <div className="text-gray-800">{!hasData ? "NIL" : decision.reason}</div>
        
        <div className="mt-4 flex justify-between">
            <span className="text-gray-500">Stable Windows</span>
            <span className="font-semibold">{!hasData ? "NIL" : `${decision.stableWindows} / 20`}</span>
        </div>
        <div className="flex justify-between">
            <span className="text-gray-500">Measurements</span>
            <span className="font-semibold">{!hasData ? "NIL" : `${decision.measurementsTaken} / 400`}</span>
        </div>
      </div>
    </div>
  );
};
