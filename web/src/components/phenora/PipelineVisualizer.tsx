import React from 'react';

interface PipelineVisualizerProps {
  isRunning: boolean;
  decision: string;
}

export const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({ isRunning, decision }) => {
  const nodes = [
    "ADC", "FILTER", "ΔF", "SLOPE", "STABILITY", "EVIDENCE", "FPGA"
  ];

  return (
    <div className="flex flex-col bg-white border border-gray-200 p-6 font-mono w-full items-center justify-center relative overflow-hidden">
      <div className="absolute top-4 left-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">
        Adaptive Measurement Pipeline
      </div>

      <div className="flex items-center space-x-2 mt-8 z-10 flex-wrap justify-center">
        {nodes.map((node, i) => (
          <React.Fragment key={node}>
            <div className={`flex flex-col items-center justify-center border ${isRunning ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'} px-4 py-2 min-w-[80px]`}>
              <span className={`text-xs ${isRunning ? 'text-blue-700 font-bold' : 'text-gray-500'}`}>{node}</span>
              <span className={`w-2 h-2 rounded-full mt-2 ${isRunning ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`}></span>
            </div>
            {i < nodes.length - 1 && (
              <div className={`text-xl ${isRunning ? 'text-blue-400' : 'text-gray-300'}`}>→</div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-center z-10">
        <div className="h-6 border-l-2 border-dashed border-gray-300 mb-2"></div>
        <div className={`border-2 ${decision === 'MEASURE_AGAIN' ? 'border-blue-500 bg-blue-50' : decision === 'STOP' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'} px-6 py-2`}>
          <span className="text-sm font-bold tracking-widest">{decision.replace('_', ' ')}</span>
        </div>
      </div>
    </div>
  );
};
