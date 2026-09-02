"use client";

import React, { useState, useEffect } from "react";
import { X, Activity, BrainCircuit, CheckCircle2, TrendingUp, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

interface MLDashboardOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock ML trend data (probability of critical infection over 24h)
const trendData = Array.from({ length: 24 }).map((_, i) => {
  const base = Math.sin(i / 4) * 20 + 20;
  const drift = i > 12 ? (i - 12) * 5 : 0;
  const val = Math.min(100, Math.max(0, base + drift + Math.random() * 10));
  return { time: `${i}h`, probability: val };
});

export default function MLDashboardOverlay({ isOpen, onClose }: MLDashboardOverlayProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 1500); // Simulate ML analysis delay
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-6xl h-full max-h-[90vh] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500 delay-100 relative">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
              <BrainCircuit className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">Predictive Model Analysis</h2>
              <p className="text-sm text-slate-400 font-medium">Dataset processed. Simulating disease trajectories.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white transition-all border border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {loading ? (
            <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <div className="w-24 h-24 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                <Activity className="w-8 h-8 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-white mb-2 tracking-wide">Processing Dataset</h3>
                <p className="text-slate-400 text-sm font-mono max-w-xs mx-auto">Extracting temporal features, running inference through synthetic disease onset models...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
              
              {/* Left Column: Metrics & Confusion Matrix */}
              <div className="space-y-6 lg:col-span-1 flex flex-col">
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                  <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-4">Model Performance</h3>
                  <div className="flex items-end gap-3 mb-2">
                    <span className="text-5xl font-black text-emerald-400">94.2%</span>
                    <span className="text-sm text-slate-400 mb-1 font-bold">Accuracy</span>
                  </div>
                  <p className="text-sm text-slate-400">The predictive twin accurately flags critical infection states before physical manifestation.</p>
                </div>

                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 flex-1">
                  <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-6">Confusion Matrix</h3>
                  
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono mb-4">
                    <div className="text-slate-500"></div>
                    <div className="text-slate-400 font-bold">Pred. Pos</div>
                    <div className="text-slate-400 font-bold">Pred. Neg</div>
                    
                    <div className="text-slate-400 font-bold text-right pr-2 flex items-center justify-end">True Pos</div>
                    <div className="bg-emerald-500/20 text-emerald-400 font-bold p-3 rounded-lg border border-emerald-500/30">1,204</div>
                    <div className="bg-red-500/10 text-red-400 p-3 rounded-lg border border-red-500/20">42</div>
                    
                    <div className="text-slate-400 font-bold text-right pr-2 flex items-center justify-end">True Neg</div>
                    <div className="bg-red-500/10 text-red-400 p-3 rounded-lg border border-red-500/20">89</div>
                    <div className="bg-slate-700/50 text-slate-300 font-bold p-3 rounded-lg border border-slate-600">3,450</div>
                  </div>
                  
                  <div className="text-[10px] text-slate-500 mt-4 leading-relaxed">
                    Evaluated across synthetic biological state measurements (negative_control vs infection_active).
                  </div>
                </div>
              </div>

              {/* Right Column: Trend Graph */}
              <div className="lg:col-span-2 bg-slate-800/50 rounded-2xl p-6 border border-slate-700 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                
                <div className="flex items-center justify-between mb-8 relative z-10">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Disease Onset Probability</h3>
                    <p className="text-sm text-slate-400">Forecasting the likelihood of reaching a critical infection state within 24 hours.</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-xs font-bold">
                    <TrendingUp className="w-3 h-3" /> HIGH RISK TREND
                  </div>
                </div>

                <div className="flex-1 w-full min-h-[300px] relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorProb" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                        itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="probability" 
                        stroke="#818cf8" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorProb)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Footer */}
        {!loading && (
          <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end">
            <button 
              onClick={onClose}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              PROCEED TO SAMPLES
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
