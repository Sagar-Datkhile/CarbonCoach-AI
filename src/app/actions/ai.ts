"use server";

import { generate_response, type GenerateResponseOptions } from "@/lib/openrouter";

export interface AiActionResult {
  success: boolean;
  data?: string;
  error?: string;
}

/**
 * Server Action for executing OpenRouter completions safely from React Server Components
 * or Client Components without exposing the server-side API key.
 */
export async function generateAiResponseAction(
  prompt: string,
  options?: GenerateResponseOptions
): Promise<AiActionResult> {
  try {
    const response = await generate_response(prompt, options);
    return {
      success: true,
      data: response,
    };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to generate AI response.";
    return {
      success: false,
      error: message,
    };
  }
}
