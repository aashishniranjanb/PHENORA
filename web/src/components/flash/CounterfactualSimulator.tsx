import React from "react";
import { CounterfactualData } from "@/types/flash";
import { FlaskConical, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface Props {
  counterfactual?: CounterfactualData;
}

export default function CounterfactualSimulator({ counterfactual }: Props) {
  const [selectedIdx, setSelectedIdx] = React.useState(0);

  if (!counterfactual || !counterfactual.scenarios || counterfactual.scenarios.length === 0) return null;

  const scenario = counterfactual.scenarios[selectedIdx];
  const isControl = scenario.risk === 'CONTROL';
  const isFailure = scenario.risk === 'FAILURE';
  const isHighRisk = scenario.risk === 'HIGH';

  const bgClass = isControl ? 'bg-emerald-50 border-emerald-200' : isFailure ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-200';
  const textClass = isControl ? 'text-emerald-700' : isFailure ? 'text-rose-700' : 'text-slate-700';
  const Icon = isControl ? TrendingDown : TrendingUp;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
        <FlaskConical className="w-5 h-5 text-indigo-500" />
        <h2 className="text-lg font-bold text-slate-900">What happens if we treat this sample?</h2>
        <span className="ml-auto text-xs font-mono bg-indigo-50 text-indigo-700 px-2 py-1 rounded border border-indigo-100">
          COUNTERFACTUAL FUTURES
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3">
          <p className="text-sm text-slate-600 mb-6">
            Select a simulated intervention to forecast the biological trajectory over the next 4 hours.
          </p>

          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Intervention</label>
          <div className="space-y-2">
            {counterfactual.scenarios.map((scen, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedIdx(idx)}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-bold font-mono transition-all ${
                  selectedIdx === idx 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-indigo-500/30' 
                    : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                }`}
              >
                {scen.drug}
              </button>
            ))}
          </div>

          <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Predicted Response</div>
            <div className={`text-lg font-black font-mono ${textClass}`}>{scenario.risk}</div>
            
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-4 mb-1">Why?</div>
            <p className="text-xs text-slate-600 font-medium">
              Observed phenotypic response indicates {isControl ? 'suppression' : 'acceleration'} of growth under the simulated {scenario.drug.toLowerCase()} condition.
            </p>
          </div>
        </div>

        <div className="w-full md:w-2/3">
          <div className={`border rounded-xl p-6 ${bgClass} h-full flex flex-col`}>
            <div className="flex items-center justify-between mb-8">
              <h3 className={`font-mono font-bold text-sm uppercase tracking-wider ${textClass}`}>
                {scenario.drug} Trajectory
              </h3>
              <div className={`flex items-center gap-1 text-sm font-bold px-3 py-1.5 rounded-lg bg-white border ${
                isControl ? 'border-emerald-200 text-emerald-600' : isFailure ? 'border-rose-200 text-rose-600' : 'border-slate-300 text-slate-700'
              }`}>
                {isControl && <CheckCircle className="w-4 h-4" />}
                {isFailure && <XCircle className="w-4 h-4" />}
                {isHighRisk && <AlertTriangle className="w-4 h-4" />}
                {scenario.effect} <Icon className="w-4 h-4" />
              </div>
            </div>

            {/* Proper SVG Trajectory Visualization */}
            <div className="flex-1 relative min-h-[250px] w-full">
              <svg viewBox="0 0 100 50" className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
                {/* Grid lines */}
                <line x1="0" y1="50" x2="100" y2="50" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="0" y1="25" x2="100" y2="25" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="2 2" />
                <line x1="0" y1="0" x2="100" y2="0" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="2 2" />
                
                {(() => {
                  // Find absolute max across all scenarios to keep the Y axis scale consistent!
                  const globalMax = Math.max(0.1, ...counterfactual.scenarios.flatMap(s => s.trajectory.map(p => p.hi))) * 1.1;
                  
                  const getCoords = (h: number, val: number) => {
                    const x = ((h - 2) / 2) * 100;
                    const y = 50 - (val / globalMax) * 50;
                    return { x, y };
                  };

                  const pts = scenario.trajectory.map(p => ({
                    mean: getCoords(p.h, p.mean),
                    hi: getCoords(p.h, p.hi),
                    lo: getCoords(p.h, p.lo),
                    h: p.h
                  }));

                  const color = isControl ? '#10b981' : isFailure ? '#f43f5e' : '#64748b'; 
                  const fill = isControl ? 'rgba(16, 185, 129, 0.2)' : isFailure ? 'rgba(244, 63, 94, 0.2)' : 'rgba(100, 116, 139, 0.2)';
                  
                  const areaPath = `
                    M ${pts[0].mean.x},${pts[0].hi.y}
                    L ${pts[1].mean.x},${pts[1].hi.y}
                    L ${pts[2].mean.x},${pts[2].hi.y}
                    L ${pts[2].mean.x},${pts[2].lo.y}
                    L ${pts[1].mean.x},${pts[1].lo.y}
                    L ${pts[0].mean.x},${pts[0].lo.y}
                    Z
                  `;

                  const linePath = `
                    M ${pts[0].mean.x},${pts[0].mean.y}
                    L ${pts[1].mean.x},${pts[1].mean.y}
                    L ${pts[2].mean.x},${pts[2].mean.y}
                  `;

                  return (
                    <g style={{ transition: 'all 0.5s ease' }}>
                      <path d={areaPath} fill={fill} style={{ transition: 'all 0.5s ease' }} />
                      <path d={linePath} fill="none" stroke={color} strokeWidth="2.5" style={{ transition: 'all 0.5s ease' }} />
                      {pts.map((p, i) => (
                        <circle key={i} cx={p.mean.x} cy={p.mean.y} r="3" fill={color} style={{ transition: 'all 0.5s ease' }} />
                      ))}
                    </g>
                  );
                })()}
              </svg>
            </div>
            
            <div className="flex justify-between mt-4 border-t border-slate-300/50 pt-2 text-xs font-mono text-slate-500 font-bold">
              <span>NOW (+2h)</span>
              <span>+3h</span>
              <span>+4h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
