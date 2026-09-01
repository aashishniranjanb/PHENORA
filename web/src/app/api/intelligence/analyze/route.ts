import { NextResponse } from "next/server";
import { SignalFeatures } from "@/core/types";
import { IntelligenceEngine } from "@/intelligence/intelligenceProcessor";

const engine = new IntelligenceEngine();

export async function POST(request: Request) {
  try {
    const body: SignalFeatures = await request.json();
    if (!body || typeof body.rawValue !== "number") {
      return NextResponse.json(
        { error: "Invalid SignalFeatures payload provided" },
        { status: 400 }
      );
    }

    const intelligence = engine.process(body);
    return NextResponse.json(intelligence);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to process signal intelligence" },
      { status: 500 }
    );
  }
}
