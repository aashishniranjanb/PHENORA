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
      cls = "bg-emerald-50 text-emerald-800 border-emerald-300";
      break;
    case "COMPUTATIONAL DEMONSTRATION":
      cls = "bg-blue-50 text-blue-800 border-blue-300";
      break;
    case "PROTOTYPE":
      cls = "bg-amber-50 text-amber-800 border-amber-300";
      break;
    case "CONCEPT":
      cls = "bg-purple-50 text-purple-800 border-purple-300";
      break;
    case "NOT YET VALIDATED":
      cls = "bg-red-50 text-red-800 border-red-300";
      break;
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[8px] font-mono font-black uppercase border tracking-wider ${cls}`}>
      {status}
    </span>
  );
}
