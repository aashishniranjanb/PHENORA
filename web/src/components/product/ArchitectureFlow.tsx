"use client";

import { useState } from "react";
import { Info, HelpCircle, CheckCircle2, AlertTriangle, ArrowDown, ArrowRight } from "lucide-react";

interface FlowNode {
  id: string;
  name: string;
  type: string;
  status: "VERIFIED" | "VERIFIED IN SOFTWARE" | "PROTOTYPE" | "CONCEPT";
  purpose: string;
  input: string;
  output: string;
}

const FLOW_NODES: FlowNode[] = [
  {
    id: "wells",
    name: "CONTROL + TEST",
    type: "Specimen",
    status: "PROTOTYPE",
    purpose: "Dual parallel wells containing electrolyte growth media. One represents base bacterial growth (Control) while the other includes an antibiotic agent (Test).",
    input: "Biological sample & antibiotic solution",
    output: "Differential ionic environment"
  },
  {
    id: "electrodes",
    name: "ELECTRODES",
    type: "Interface",
    status: "PROTOTYPE",
    purpose: "Gold-plated/metallic electrode pairs submerged in each well to deliver the AC voltage and pick up the current response.",
    input: "Dual AC voltage excitation (1 kHz baseline)",
    output: "Electrical current response"
  },
  {
    id: "ad5933",
    name: "AD5933",
    type: "Front-End",
    status: "PROTOTYPE",
    purpose: "Monolithic network impedance analyzer. Synthesizes frequency sweeps, excites electrodes, measures response current, and computes on-board DFT.",
    input: "Response current analog signal",
    output: "Real (R) and Imaginary (I) component registers"
  },
  {
    id: "heltec",
    name: "HELTEC ESP32-S3",
    type: "Microcontroller",
    status: "PROTOTYPE",
    purpose: "Dual-core processor commanding the AD5933 via I2C. Performs impedance calculations (|Z| magnitude and phase) and formats telemetry.",
    input: "Real & Imaginary registers (I2C at 400 kHz)",
    output: "Computed impedance features (UART stream at 115200 baud)"
  },
  {
    id: "fpga",
    name: "iCE40UP5K FPGA",
    type: "Edge Computing",
    status: "PROTOTYPE",
    purpose: "Lattice FPGA running custom Verilog logic. Acts as the real-time processing co-processor for the noise-filtering and adaptive halting state loops.",
    input: "Impedance feature streams (UART)",
    output: "Halt signal status flags"
  },
  {
    id: "filter",
    name: "FILTER",
    type: "DSP",
    status: "VERIFIED IN SOFTWARE",
    purpose: "Hardware-level moving average filter window (length N=3) executing on the differential resistance trajectory to clean thermal drift and acquisition noise.",
    input: "Raw differential resistance ΔR",
    output: "Filtered differential resistance F[n]"
  },
  {
    id: "slope",
    name: "SLOPE",
    type: "DSP",
    status: "VERIFIED IN SOFTWARE",
    purpose: "Calculates the derivative of the filtered impedance trajectory over a fixed window parameter K (S[n] = F[n] - F[n-k]).",
    input: "Filtered differential resistance F[n]",
    output: "Differential trajectory slope S[n]"
  },
  {
    id: "stability",
    name: "STABILITY",
    type: "FSM Check",
    status: "VERIFIED IN SOFTWARE",
    purpose: "State machine logic tracking whether the absolute slope has remained below the threshold for multiple consecutive observation windows.",
    input: "Differential trajectory slope S[n]",
    output: "Stability verification counter"
  },
  {
    id: "decision",
    name: "STOP / MEASURE AGAIN",
    type: "Outcome",
    status: "VERIFIED IN SOFTWARE",
    purpose: "The final FSM execution decision. Outputs STOP (halting measurement when differential signal is stable) or MEASURE AGAIN (continuous measurement).",
    input: "Stability counter satisfying required windows",
    output: "Decisive system halt / Continue command"
  }
];

export default function ArchitectureFlow() {
  const [selectedNode, setSelectedNode] = useState<FlowNode>(FLOW_NODES[0]);
  const [hoveredNode, setHoveredNode] = useState<FlowNode | null>(null);

  const activeNode = hoveredNode || selectedNode;

  return (
    <div className="space-y-8">
      {/* Interactive Node Map */}
      <div className="bg-[#081324] border border-gray-800 rounded-xl p-6 shadow-xl overflow-x-auto">
        <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase block mb-6">
          V1 Signal Pipeline Architecture Map (Click or Hover Nodes)
        </span>
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 min-w-[980px] py-4">
          {FLOW_NODES.map((node, index) => {
            const isSelected = selectedNode.id === node.id;
            const isHovered = hoveredNode?.id === node.id;
            const isActive = isSelected || isHovered;

            // Highlight connection buses between elements
            let busLabel = "→";
            if (node.id === "ad5933") busLabel = "I2C →";
            if (node.id === "heltec") busLabel = "UART →";

            return (
              <div key={node.id} className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedNode(node)}
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className={`px-4 py-3 rounded-lg border text-left cursor-pointer transition-all duration-200 w-40 flex flex-col justify-between h-24 shadow-md ${
                    isActive
                      ? "bg-[#17B169]/10 border-[#17B169] ring-2 ring-[#17B169]/20"
                      : "bg-[#0A192F] border-gray-800 hover:border-gray-700"
                  }`}
                >
                  <div>
                    <span className="text-[8px] text-gray-500 font-bold block uppercase tracking-wider">
                      {node.type}
                    </span>
                    <span className={`text-xs font-bold font-mono tracking-tight block mt-1 ${
                      isActive ? "text-[#17B169]" : "text-white"
                    }`}>
                      {node.name}
                    </span>
                  </div>
                  
                  <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold uppercase tracking-widest self-start ${
                    node.status === "VERIFIED" || node.status === "VERIFIED IN SOFTWARE"
                      ? "bg-green-950/40 text-green-400 border border-green-900/30"
                      : "bg-yellow-950/40 text-yellow-500 border border-yellow-900/30"
                  }`}>
                    {node.status.split(" ")[0]}
                  </span>
                </button>

                {index < FLOW_NODES.length - 1 && (
                  <div className="flex flex-col items-center justify-center font-mono text-[9px] text-gray-500 font-bold select-none px-1">
                    <span>{busLabel}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Node Details Inspection Card */}
      <div className="bg-[#081324] border border-gray-800 rounded-xl p-8 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-8 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 left-0 w-2 h-full bg-[#17B169]"></div>

        <div className="md:col-span-2">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-xs font-bold text-[#17B169] uppercase font-mono tracking-widest">
              {activeNode.type} Details
            </span>
            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border tracking-wider ${
              activeNode.status === "VERIFIED" || activeNode.status === "VERIFIED IN SOFTWARE"
                ? "bg-green-950/40 text-green-400 border-green-900/50"
                : "bg-yellow-950/40 text-yellow-500 border-yellow-900/50"
            }`}>
              {activeNode.status}
            </span>
          </div>

          <h3 className="text-white text-2xl font-extrabold mb-4">{activeNode.name}</h3>
          
          <div>
            <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-wide mb-1.5">Functional Purpose</span>
            <p className="text-gray-300 text-xs leading-relaxed max-w-xl">
              {activeNode.purpose}
            </p>
          </div>
        </div>

        <div className="bg-[#0A192F] p-6 rounded-lg border border-gray-800 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className="text-[9px] text-gray-500 font-bold block uppercase tracking-wider mb-1">Signal Input</span>
              <p className="text-blue-400 font-mono text-[11px] font-semibold">{activeNode.input}</p>
            </div>
            <div className="border-t border-gray-800/80 pt-3">
              <span className="text-[9px] text-gray-500 font-bold block uppercase tracking-wider mb-1">Signal Output</span>
              <p className="text-[#ff006e] font-mono text-[11px] font-semibold">{activeNode.output}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-[10px] text-gray-500 mt-4 font-medium border-t border-gray-800/80 pt-3">
            <Info className="h-3 w-3 text-[#17B169]" />
            <span>Interactive inspection node active.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
