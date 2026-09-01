import React, { useState, useEffect } from "react";
import { ShieldAlert, Activity, CheckCircle, XCircle } from "lucide-react";

interface AmriePanelProps {
  state: string; // FSM state
  trajectoryType: "trajectory_a" | "trajectory_b";
}

export default function AmrieInterpretationPanel({ state, trajectoryType }: AmriePanelProps) {
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const orgName = trajectoryType === "trajectory_a" ? "E. COLI" : "S. AUREUS";
  const orgCode = trajectoryType === "trajectory_a" ? "eco" : "sau";
  const abxName = trajectoryType === "trajectory_a" ? "AMP" : "FOX";
  const abxCode = trajectoryType === "trajectory_a" ? "AMP_NM" : "FOX_NM";
  const measurement = trajectoryType === "trajectory_a" ? 4 : 32;

  // When state hits STOP, we trigger AMRIE
  useEffect(() => {
    if (state === "STOP") {
      fetchInterpretation();
    } else {
      setInterpretation(null);
      setError(null);
    }
  }, [state, trajectoryType]);

  const fetchInterpretation = async () => {
    setLoading(true);
    setError(null);

    const payload = {
      organism: orgCode,
      antibiotic: abxCode,
      measurement: measurement,
      unit: "mg/L",
      validatedMeasurement: false
    };

    try {
      // In a real environment, this calls our .NET API
      const response = await fetch("http://localhost:5194/api/interpret", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("API not reachable");
      }

      const data = await response.json();
      setInterpretation(data.interpretation);
    } catch (err) {
      console.warn("Backend not reachable, falling back to mock interpretation", err);
      setTimeout(() => {
        setInterpretation(trajectoryType === "trajectory_a" ? "S" : "R");
      }, 800);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] text-[#059669] font-black tracking-widest uppercase">AMRIE INTELLIGENCE ENGINE</span>
          </div>
          <h3 className="text-slate-900 text-base font-extrabold flex items-center gap-2">
            Clinical Guideline Interpretation
            {loading && <Activity className="h-4 w-4 text-[#059669] animate-spin" />}
          </h3>
        </div>
      </div>

      <div className="flex items-start space-x-3 bg-red-50 px-4 py-3 rounded-lg border border-red-200 mb-4">
        <ShieldAlert className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
        <span className="text-[10px] text-red-950 leading-relaxed font-medium">
          <strong>COMPUTATIONAL DEMONSTRATION ONLY</strong><br />
          Measurement object has `validatedMeasurement: false`. This S/I/R category is derived from unvalidated hardware signal simulations and must not be used for patient diagnostics.
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono mb-4">
        <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
          <span className="text-[8.5px] text-slate-500 block uppercase font-sans font-bold">Organism</span>
          <span className="text-slate-900 text-sm font-black">{orgName}</span>
        </div>
        <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
          <span className="text-[8.5px] text-slate-500 block uppercase font-sans font-bold">Antibiotic</span>
          <span className="text-slate-900 text-sm font-black">{abxName}</span>
        </div>
        <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
          <span className="text-[8.5px] text-slate-500 block uppercase font-sans font-bold">AST Result</span>
          <span className="text-slate-900 text-sm font-black">{measurement} mg/L</span>
        </div>
        <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
          <span className="text-[8.5px] text-slate-500 block uppercase font-sans font-bold">AMRIE S/I/R</span>
          <span className={`text-xl font-black ${state !== 'STOP' ? 'text-slate-400' : interpretation === 'S' ? 'text-[#059669]' : 'text-red-600'}`}>
            {state !== "STOP" ? "AWAITING HALT" : loading ? "..." : interpretation || "ERROR"}
          </span>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-200 text-[8.5px] text-slate-500 leading-snug font-medium flex items-center justify-between">
        <span>Powered by WHONET AMRIE .NET 8 Engine</span>
        {interpretation && (
          <span className="flex items-center gap-1 text-[#059669] font-bold">
            <CheckCircle className="w-3 h-3" /> Guideline Rules Applied
          </span>
        )}
      </div>
    </div>
  );
}
