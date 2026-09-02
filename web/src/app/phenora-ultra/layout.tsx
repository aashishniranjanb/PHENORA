import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PHENORA ULTRA | Autonomous Multi-Frequency Bioimpedance Platform",
  description: "Scientific laboratory instrument interface for autonomous bioimpedance intelligence, phenotype extraction, and disease forecasting.",
};

export default function PhenoraUltraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-50 text-slate-900 font-sans select-none flex flex-col">
      {children}
    </div>
  );
}
