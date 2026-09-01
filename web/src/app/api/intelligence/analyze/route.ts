// ============================================================================
// PHENORA Intelligence API Route (POST /api/intelligence/analyze)
// Accepts SignalFeatures payload and returns SignalIntelligence + DecisionEvidence
// ============================================================================

import { NextResponse } from "next/server";
import { IntelligenceEngine } from "@/core/intelligence/intelligenceEngine";
import { SignalFeatures } from "@/core/intelligence/intelligenceTypes";

const engineInstance = new IntelligenceEngine();

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body || typeof body.rawValue !== "number") {
      return NextResponse.json(
        { error: "Invalid SignalFeatures payload format" },
        { status: 400 }
      );
    }

    const featureSample: SignalFeatures = {
      timestamp: body.timestamp || Date.now(),
      rawValue: body.rawValue,
      rms: body.rms ?? 0.707,
      variance: body.variance ?? 0.001,
      peakToPeak: body.peakToPeak ?? 0.002,
      baseline: body.baseline ?? body.rawValue,
      delta: body.delta ?? 0.0,
      slope: body.slope ?? 0.0,
      stability: body.stability ?? 0.95,
      snr: body.snr ?? 30,
      drift: body.drift ?? 0.0,
    };

    const result = engineInstance.processSample(featureSample);

    return NextResponse.json({
      success: true,
      timestamp: result.intelligence.timestamp,
      intelligence: result.intelligence,
      fpgaEvidence: result.fpgaEvidence,
      metadata: engineInstance.getModelMetadata(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal Intelligence Engine Error", details: err?.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ONLINE",
    metadata: engineInstance.getModelMetadata(),
    endpoint: "POST /api/intelligence/analyze",
  });
}
