import React from "react";

export type ValidationStatus =
  | "VERIFIED"
  | "COMPUTATIONAL DEMONSTRATION"
  | "PROTOTYPE"
  | "CONCEPT"
  | "NOT YET VALIDATED";

interface StatusBadgeProps {
  status: ValidationStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  let cls = "";
  switch (status) {
    case "VERIFIED":
      cls = "bg-green-950/60 text-green-400 border-green-900/60";
      break;
    case "COMPUTATIONAL DEMONSTRATION":
      cls = "bg-blue-950/60 text-blue-400 border-blue-900/60";
      break;
    case "PROTOTYPE":
      cls = "bg-yellow-950/60 text-yellow-500 border-yellow-900/60";
      break;
    case "CONCEPT":
      cls = "bg-purple-950/60 text-purple-400 border-purple-900/60";
      break;
    case "NOT YET VALIDATED":
      cls = "bg-red-950/60 text-red-400 border-red-900/60";
      break;
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase border tracking-wider ${cls}`}>
      {status}
    </span>
  );
}
