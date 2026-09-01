"use client";

import React, { useState } from 'react';
import SimulationLab from './SimulationLab';
import PhenoraDashboard from '../../components/phenora/PhenoraDashboard';

export default function SpectraeRoot() {
  // Use state to toggle between the old simulation lab (3D view) and the new hardware dashboard
  const [activeView, setActiveView] = useState<"SIMULATION" | "HARDWARE">("SIMULATION");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Global Tab Switcher */}
      <div className="w-full bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center z-50 sticky top-0 shadow-sm">
        <div className="flex items-center space-x-3">
          <span className="text-[12px] text-[#059669] font-black tracking-widest uppercase">PHENORA V2</span>
        </div>
        
        <div className="flex items-center bg-slate-100 border border-slate-200 p-1 rounded-lg">
          <button 
            className={`px-6 py-2 rounded text-[11px] font-bold tracking-widest uppercase transition-all ${activeView === 'SIMULATION' ? 'bg-[#059669] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            onClick={() => setActiveView('SIMULATION')}
          >
            SIMULATION LAB (3D)
          </button>
          <button 
            className={`px-6 py-2 rounded text-[11px] font-bold tracking-widest uppercase transition-all ${activeView === 'HARDWARE' ? 'bg-[#059669] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            onClick={() => setActiveView('HARDWARE')}
          >
            HARDWARE PIPELINE
          </button>
        </div>
      </div>

      {/* Render the appropriate view */}
      <div className="flex-grow w-full relative">
        {activeView === "SIMULATION" ? (
          <SimulationLab />
        ) : (
          <PhenoraDashboard />
        )}
      </div>
    </div>
  );
}
