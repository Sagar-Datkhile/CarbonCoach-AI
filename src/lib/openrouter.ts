/**
 * OpenRouter AI Integration for CarbonCoach AI
 * Uses model: google/gemini-2.5-flash-lite
 *
 * Requirements fulfilled:
 * 1. OpenRouter endpoint: https://openrouter.ai/api/v1/chat/completions
 * 2. Reads API key from OPENROUTER_API_KEY environment variable.
 * 3. Never prints, logs, or exposes the API key.
 * 4. Strictly executed server-side to prevent client/browser exposure.
 * 5. Uses native fetch (Node.js runtime).
 * 6. Handles missing keys, network timeouts, rate limits (429), API errors, and empty responses.
 */

export const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
export const OPENROUTER_MODEL = "google/gemini-2.5-flash-lite";
export const DEFAULT_TEMPERATURE = 0.3;
export const DEFAULT_TIMEOUT_MS = 30000;
export const DEFAULT_SYSTEM_PROMPT =
  "You are a helpful, accurate, and concise AI assistant for CarbonCoach AI.";

export interface GenerateResponseOptions {
  /** Optional custom system prompt. Defaults to CarbonCoach AI system prompt. */
  systemPrompt?: string;
  /** Sampling temperature between 0.0 and 2.0. Defaults to 0.3. */
  temperature?: number;
  /** Request timeout in milliseconds. Defaults to 30000ms (30s). */
  timeoutMs?: number;
}

interface OpenRouterChoice {
  message?: {
    role?: string;
    content?: string | null;
  };
  finish_reason?: string;
}

interface OpenRouterChatResponse {
  id?: string;
  choices?: OpenRouterChoice[];
  error?: {
    message?: string;
    code?: number | string;
  } | string;
}

/**
 * Sanitizes strings to guarantee that the API key or bearer tokens
 * are never included in error messages or logs.
 */
function sanitizeErrorMessage(message: string, apiKey?: string): string {
  let sanitized = message;
  if (apiKey && apiKey.length > 5) {
    sanitized = sanitized.split(apiKey).join("[REDACTED_API_KEY]");
  }
  return sanitized.replace(/Bearer\s+[A-Za-z0-9_\-.]+/gi, "Bearer [REDACTED_API_KEY]");
}

/**
 * Reusable backend function to generate AI responses via OpenRouter.
 *
 * @param user_prompt - The prompt text from the user.
 * @param options - Optional configuration (system prompt, temperature, timeout).
 * @returns The trimmed generated response text from the model.
 */
export async function generate_response(
  user_prompt: string,
  options: GenerateResponseOptions = {}
): Promise<string> {
  // Enforce server-side execution to protect the API key from browser leaks
  if (typeof window !== "undefined") {
    throw new Error("generate_response can only be executed in server-side environments.");
  }

  // Validate user prompt
  if (!user_prompt || typeof user_prompt !== "string" || !user_prompt.trim()) {
    throw new Error("User prompt cannot be empty.");
  }

  // Read API key securely from server environment
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    throw new Error(
      "OPENROUTER_API_KEY is not configured. Please set the OPENROUTER_API_KEY environment variable."
    );
  }

  const trimmedKey = apiKey.trim();
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const systemPrompt = options.systemPrompt ?? DEFAULT_SYSTEM_PROMPT;
  const temperature = options.temperature ?? DEFAULT_TEMPERATURE;

  // Request headers
  const headers: Record<string, string> = {
    "Authorization": `Bearer ${trimmedKey}`,
    "Content-Type": "application/json",
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    "X-Title": "CarbonCoach AI",
  };

  // Request payload
  const payload = {
    model: OPENROUTER_MODEL,
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: user_prompt.trim(),
      },
    ],
    temperature,
  };

  let response: Response;
  try {
    response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.name === "TimeoutError" || err.name === "AbortError") {
        throw new Error(`OpenRouter request timed out after ${timeoutMs}ms.`);
      }
      throw new Error(
        sanitizeErrorMessage(
          `Failed to connect to OpenRouter: ${err.message}`,
          trimmedKey
        )
      );
    }
    throw new Error("An unexpected network error occurred while connecting to OpenRouter.");
  }

  // Handle Rate Limiting (HTTP 429)
  if (response.status === 429) {
    throw new Error(
      "OpenRouter rate limit reached (HTTP 429). Please try again later."
    );
  }

  // Handle other non-2xx API errors
  if (!response.ok) {
    let errorDetail = "";
    try {
      const errorJson = (await response.json()) as OpenRouterChatResponse;
      if (typeof errorJson?.error === "object" && errorJson.error?.message) {
        errorDetail = errorJson.error.message;
      } else if (typeof errorJson?.error === "string") {
        errorDetail = errorJson.error;
      } else {
        errorDetail = JSON.stringify(errorJson);
      }
    } catch {
      errorDetail = response.statusText || `Status code ${response.status}`;
    }

    const safeDetail = sanitizeErrorMessage(errorDetail, trimmedKey);
    throw new Error(
      `OpenRouter API error (HTTP ${response.status}): ${safeDetail}`
    );
  }

  // Parse JSON response
  let data: OpenRouterChatResponse;
  try {
    data = (await response.json()) as OpenRouterChatResponse;
  } catch {
    throw new Error("Failed to parse OpenRouter response as valid JSON.");
  }

  // Validate and extract response content
  const choice = data?.choices?.[0];
  const content = choice?.message?.content;

  if (!content || typeof content !== "string" || !content.trim()) {
    throw new Error("OpenRouter returned an empty response.");
  }

  return content.trim();
}

/**
 * Idiomatic camelCase alias for TypeScript / JavaScript callers.
 */
export const generateResponse = generate_response;
