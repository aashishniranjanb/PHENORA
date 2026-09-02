import { useState, useEffect, useCallback, useRef } from "react";
import { PhenoraRuntimeState, INITIAL_RUNTIME_STATE } from "./runtimeState";
import { SignalMode, generateSignal } from "../simulation/signalGenerator";
import { extractFeatures, DEFAULT_PROCESSING_CONFIG } from "../signal";
import { SignalFeatures } from "./signalTypes";

// Let's create a local mock Person B and Person C logic here to bind them.
// Or we can just import the actual ones if they exist.

// For now, I will build the real reactive pipeline here.

export function usePhenoraRuntime() {
  const [state, setState] = useState<PhenoraRuntimeState>(INITIAL_RUNTIME_STATE);
  const [isRunning, setIsRunning] = useState(false);
  const [scenario, setScenario] = useState<SignalMode>("STABLE");
  
  const tickRef = useRef<number | null>(null);
  
  // Pipeline State
  const sampleBuffer = useRef<any[]>([]);
  const measurementCount = useRef(0);
  const stableCount = useRef(0);
  const evidenceRef = useRef(0);
  
  // The Person B mock logic
  const processIntelligence = (features: SignalFeatures) => {
    let confidence = features.quality;
    if (features.trajectory === "UNSTABLE") confidence -= 30;
    if (features.anomaly) confidence -= 40;
    
    // Scale confidence to 0-100
    confidence = Math.max(0, Math.min(100, Math.round(confidence)));
    
    let anomalyLevel: "LOW" | "MEDIUM" | "HIGH" = "LOW";
    if (features.anomaly) anomalyLevel = "HIGH";
    else if (features.noise > 0.05) anomalyLevel = "MEDIUM";

    // Smooth Continuous Accumulation
    let evidenceGain = (confidence / 100) * 0.5; // Gain up to 0.5% per tick
    if (features.trajectory === "STABLE" || features.trajectory === "FLAT") {
        evidenceGain += 0.2;
    }
    if (features.anomaly) {
        evidenceGain -= 5.0; // Big drop on anomaly
    }
    
    evidenceRef.current = Math.max(0, Math.min(100, evidenceRef.current + evidenceGain));
    let evidence = evidenceRef.current;

    let readiness: "INSUFFICIENT" | "BUILDING" | "READY" = "INSUFFICIENT";
    if (evidence > 85) readiness = "READY";
    else if (evidence > 40) readiness = "BUILDING";

    const explanation = [];
    if (features.quality > 80) explanation.push("✓ Signal quality is high");
    else explanation.push("△ Signal quality is poor");
    
    if (features.anomaly) explanation.push("❌ Anomaly detected in window");
    else explanation.push("✓ No significant anomaly detected");

    if (confidence > 80) explanation.push("✓ Trend is consistent");
    else explanation.push("△ Trend is fluctuating");

    return {
      trajectory: features.trajectory,
      confidence,
      anomalyScore: features.anomaly ? 90 : 10,
      anomalyLevel,
      evidence,
      readiness,
      explanation
    };
  };

  const processDecision = (intel: ReturnType<typeof processIntelligence>) => {
    if (intel.trajectory === "STABLE" || intel.trajectory === "FLAT") {
        stableCount.current += 1;
    } else {
        stableCount.current = 0;
    }

    if (intel.evidence >= 85 && stableCount.current >= 20) {
        return { state: "STOP" as const, decision: "STOP" as const, reason: "Evidence and Stability sufficient" };
    }
    if (measurementCount.current >= 400) { // Increased budget for fast ticking
        return { state: "TIMEOUT" as const, decision: "TIMEOUT" as const, reason: "Maximum measurement budget reached" };
    }
    
    if (intel.evidence >= 85 && stableCount.current < 20) {
        return { state: "ACQUIRING" as const, decision: "MEASURE_AGAIN" as const, reason: "Awaiting 20 Stable Windows" };
    }

    return { state: "ACQUIRING" as const, decision: "MEASURE_AGAIN" as const, reason: "Confidence threshold not yet met" };
  };

  const resetPipeline = useCallback((newScenario: SignalMode) => {
    setScenario(newScenario);
    measurementCount.current = 0;
    stableCount.current = 0;
    evidenceRef.current = 0;
    sampleBuffer.current = [];
    setState(prev => ({
        ...prev,
        scenario: newScenario,
        decision: {
            ...prev.decision,
            state: "ACQUIRING",
            decision: "MEASURE_AGAIN",
            reason: "Initializing new scenario...",
            measurementsTaken: 0,
            stableWindows: 0
        },
        intelligence: {
            ...prev.intelligence,
            evidence: 0,
            readiness: "INSUFFICIENT"
        }
    }));
  }, []);

  const stepPipeline = useCallback(() => {
    if (state.decision.decision === "STOP" || state.decision.decision === "TIMEOUT") {
        return; // Halt if done
    }

    measurementCount.current += 1;
    
    // Generate a fresh chunk of samples for the next measurement
    const chunk = generateSignal({ 
        mode: scenario, 
        duration: 5, 
        sampleRate: 10, 
        seed: 42 + measurementCount.current 
    });
    
    sampleBuffer.current = [...chunk]; // for charting
    
    // Process Person A
    const features = extractFeatures(chunk, DEFAULT_PROCESSING_CONFIG);
    
    // Process Person B
    const intel = processIntelligence(features);
    
    // Process Person C
    const dec = processDecision(intel);

    setState(prev => ({
      ...prev,
      signal: {
        rawValue: features.rawValue,
        baseline: features.baseline,
        delta: features.delta,
        slope: features.slope,
        noise: features.noise,
        drift: features.drift,
        stability: features.stability,
        quality: features.quality,
        sampleCount: features.sampleCount,
      },
      intelligence: {
        trajectory: intel.trajectory,
        trajectoryConfidence: intel.confidence, 
        confidence: intel.confidence,
        anomalyScore: intel.anomalyScore,
        anomalyLevel: intel.anomalyLevel,
        evidence: intel.evidence,
        readiness: intel.readiness,
        explanation: intel.explanation,
      },
      decision: {
        state: dec.state,
        decision: dec.decision,
        reason: dec.reason,
        measurementsTaken: measurementCount.current,
        stableWindows: stableCount.current,
      }
    }));
  }, [scenario, state.decision.decision]);

  useEffect(() => {
    if (isRunning) {
      tickRef.current = window.setInterval(() => {
        stepPipeline();
      }, 50); // High-speed dynamic ticking (50ms)
    } else if (tickRef.current) {
      clearInterval(tickRef.current);
    }
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [isRunning, stepPipeline]);

  return {
    state,
    isRunning,
    setIsRunning,
    resetPipeline,
    stepPipeline,
    latestSamples: sampleBuffer.current
  };
}
