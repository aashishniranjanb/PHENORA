import React from "react";
import { ValidationData } from "@/types/flash";
import { CheckCircle, Info, Activity } from "lucide-react";

interface Props {
  validation?: ValidationData;
}

export default function ValidationMetrics({ validation }: Props) {
  if (!validation) return null;

  return (
    <div className="space-y-6 mb-8">
      {/* Original Regression Validation */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight mb-1">How Accurate is the AI Prediction?</h2>
            <p className="text-sm text-slate-500 font-medium">We tested our Twin against real laboratory results to see if its predictions match reality.</p>
          </div>
          <span className="text-xs font-mono font-bold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-100 uppercase tracking-widest">
            Validation Test
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Simple Educational Graphic */}
          <div className="relative w-full overflow-hidden border border-slate-200 rounded-xl bg-slate-50 p-6 flex flex-col items-center">
            <svg viewBox="0 0 400 220" className="w-full h-auto drop-shadow-sm">
              <line x1="40" x2="380" y1="180" y2="180" stroke="#cbd5e1" strokeWidth="2" />
              <line x1="40" x2="40" y1="20" y2="180" stroke="#cbd5e1" strokeWidth="2" />
              
              <path d="M 40,170 L 100,155 L 160,115 L 220,65 L 280,30 L 340,10 L 340,90 L 280,100 L 220,135 L 160,165 L 100,180 Z" fill="rgba(59, 130, 246, 0.15)" stroke="rgba(59,130,246,0.3)" strokeWidth="1" strokeDasharray="4 4" />
              <path d="M 40,170 L 100,160 L 160,130 L 220,90 L 280,50 L 340,30" fill="none" stroke="#0f172a" strokeWidth="4" />
              <path d="M 40,170 L 100,165 L 160,135 L 220,95 L 280,60 L 340,45" fill="none" stroke="#3b82f6" strokeWidth="3" />
              <circle cx="220" cy="95" r="5" fill="#3b82f6" />
              
              <line x1="280" x2="280" y1="50" y2="15" stroke="#0f172a" strokeWidth="1.5" strokeDasharray="2 2" />
              <text x="280" y="10" textAnchor="middle" fontSize="12" fill="#0f172a" fontWeight="bold">What Actually Happened</text>
              <line x1="220" x2="160" y1="95" y2="60" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="2 2" />
              <text x="155" y="55" textAnchor="middle" fontSize="12" fill="#3b82f6" fontWeight="bold">What the AI Predicted</text>
              <line x1="320" x2="320" y1="20" y2="80" stroke="#64748b" strokeWidth="1" />
              <text x="315" y="55" textAnchor="end" fontSize="10" fill="#64748b" fontWeight="bold">Margin of Error</text>
              
              <text x="40" y="200" fontSize="12" fill="#64748b" fontWeight="bold">Time (Start)</text>
              <text x="340" y="200" textAnchor="end" fontSize="12" fill="#64748b" fontWeight="bold">Time (4 Hours Later)</text>
            </svg>
            <p className="mt-4 text-xs text-slate-500 font-medium text-center bg-white px-3 py-1.5 rounded-lg border border-slate-200">
              Notice how the real result (black line) stays safely inside the AI's expected margin of error (blue shaded area).
            </p>
          </div>

          <div className="space-y-6">
            <p className="text-slate-700 text-sm leading-relaxed">
              Instead of just giving a "yes or no" answer, PHENORA calculates exactly how the bacteria will grow over the next few hours. We check its accuracy by looking at two main things:
            </p>

            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <h3 className="font-bold text-emerald-900 mb-1 flex items-center gap-2">
                    Reliability Score (Coverage)
                    <span className="text-emerald-700 text-lg">{(validation.coverage * 100).toFixed(0)}%</span>
                  </h3>
                  <p className="text-xs text-emerald-800/80 leading-relaxed">
                    <strong>What this means:</strong> Out of 100 tests, the AI's prediction was correct { (validation.coverage * 100).toFixed(0) } times. Our goal for a medical device is to hit at least 90%, meaning the system is highly dependable.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <Info className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                    Average Error (MAE)
                    <span className="text-slate-700 text-lg">{validation.mae.toFixed(2)} units</span>
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong>What this means:</strong> When the AI guesses the amount of bacteria, it is usually only off by {validation.mae.toFixed(2)} units. This is a very tiny difference that doesn't change the doctor's final decision.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ML Evaluation Metrics Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight mb-1">Infection Stage Classification Performance</h2>
            <p className="text-sm text-slate-500 font-medium">Results from a Random Forest model trained on 126,000 completely unseen trajectories to predict biological state based purely on electrical impedance features.</p>
          </div>
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2">
            <Activity className="w-5 h-5 text-emerald-500" />
            <div>
              <span className="block text-[10px] font-mono text-emerald-700 font-bold uppercase tracking-wider">Overall Accuracy</span>
              <span className="block text-xl font-black text-emerald-900 leading-none mt-0.5">72.7%</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-mono text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">Biological State</th>
                <th className="px-4 py-3 text-right">Precision</th>
                <th className="px-4 py-3 text-right">Recall</th>
                <th className="px-4 py-3 text-right">F1-Score</th>
                <th className="px-4 py-3 text-right rounded-tr-lg">Support (Trajectories)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Distilled Water (Blank)
                </td>
                <td className="px-4 py-3 text-right text-emerald-600 font-bold">1.00</td>
                <td className="px-4 py-3 text-right text-emerald-600 font-bold">1.00</td>
                <td className="px-4 py-3 text-right text-emerald-600 font-bold">1.00</td>
                <td className="px-4 py-3 text-right font-mono text-slate-500">21,000</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Sterile Urine (Negative Control)
                </td>
                <td className="px-4 py-3 text-right text-emerald-600 font-bold">1.00</td>
                <td className="px-4 py-3 text-right text-emerald-600 font-bold">1.00</td>
                <td className="px-4 py-3 text-right text-emerald-600 font-bold">1.00</td>
                <td className="px-4 py-3 text-right font-mono text-slate-500">21,000</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Infection Onset (Early)
                </td>
                <td className="px-4 py-3 text-right">0.89</td>
                <td className="px-4 py-3 text-right">0.92</td>
                <td className="px-4 py-3 text-right text-blue-600 font-bold">0.90</td>
                <td className="px-4 py-3 text-right font-mono text-slate-500">21,000</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Infected Post-Antibiotic
                </td>
                <td className="px-4 py-3 text-right">0.66</td>
                <td className="px-4 py-3 text-right">0.59</td>
                <td className="px-4 py-3 text-right text-amber-600 font-bold">0.63</td>
                <td className="px-4 py-3 text-right font-mono text-slate-500">21,000</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  Infected Pre-Antibiotic
                </td>
                <td className="px-4 py-3 text-right">0.41</td>
                <td className="px-4 py-3 text-right">0.45</td>
                <td className="px-4 py-3 text-right text-rose-600 font-bold">0.43</td>
                <td className="px-4 py-3 text-right font-mono text-slate-500">21,000</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  Infection Active
                </td>
                <td className="px-4 py-3 text-right">0.41</td>
                <td className="px-4 py-3 text-right">0.40</td>
                <td className="px-4 py-3 text-right text-rose-600 font-bold">0.41</td>
                <td className="px-4 py-3 text-right font-mono text-slate-500">21,000</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
          <strong>Interpretation:</strong> The model achieves near-perfect separation between biological presence and controls. It heavily struggles to differentiate "Infection Active" and "Infected Pre-Antibiotic" because their physical electrical signatures are virtually identical before the antibiotic initiates lysis or stasis.
        </p>
      </div>
    </div>
  );
}
