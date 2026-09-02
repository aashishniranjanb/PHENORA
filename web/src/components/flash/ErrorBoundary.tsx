"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-[#020813] text-red-400 p-8 border border-red-900/50 rounded-lg">
          <AlertTriangle className="w-12 h-12 mb-4 opacity-80" />
          <h2 className="text-sm font-bold font-mono tracking-widest uppercase mb-2">Hardware Simulation Failed</h2>
          <p className="text-xs text-red-500/80 text-center max-w-md">
            The 3D WebGL context crashed or encountered an error. 
            <br />
            {this.state.error?.message}
          </p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="mt-6 px-4 py-2 bg-red-950 hover:bg-red-900 border border-red-800 rounded text-xs font-bold text-white transition-all"
          >
            Attempt Recovery
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
