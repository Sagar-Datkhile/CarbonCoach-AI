import { NextResponse } from "next/server";
import { generate_response } from "@/lib/openrouter";

export const dynamic = "force-dynamic";

/**
 * Backend API Route for OpenRouter chat completions.
 * Protects OPENROUTER_API_KEY on the server side so client-side browsers never see it.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const prompt = body?.prompt;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json(
        { error: "Prompt is required and must be a non-empty string." },
        { status: 400 }
      );
    }

    const systemPrompt = typeof body?.systemPrompt === "string" ? body.systemPrompt : undefined;
    const temperature = typeof body?.temperature === "number" ? body.temperature : undefined;

    const response = await generate_response(prompt, {
      systemPrompt,
      temperature,
    });

    return NextResponse.json({ response });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Internal server error during AI generation.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
