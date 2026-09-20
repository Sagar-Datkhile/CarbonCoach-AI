import { GoogleGenAI } from "@google/genai";
import { billExtractionSchema, type BillExtractionData } from "@/lib/validations/bill";

export interface ExtractionResult {
  success: boolean;
  data?: BillExtractionData;
  error?: string;
  rawResponse?: string;
  processingTimeMs: number;
}

const SYSTEM_INSTRUCTION = `You are a specialized utility bill information extraction assistant for CarbonCoach AI.
Extract structured electricity bill data from the supplied document or image.
You must return ONLY a clean, valid JSON object with the following fields:
- provider_name: (string) The utility company name (e.g., "Pacific Gas & Electric", "Consolidated Edison", "Tata Power", "EDF").
- consumer_number: (string or null) The customer ID, account number, or service account number if visible.
- bill_number: (string or null) The unique invoice or bill identifier if present.
- billing_period_start: (string YYYY-MM-DD) Start date of the usage cycle.
- billing_period_end: (string YYYY-MM-DD) End date of the usage cycle.
- billing_days: (integer) Total number of days in the billing period.
- energy_consumed_kwh: (number) Total electricity consumption billed in kilowatt-hours (kWh). Must be a positive number.
- bill_amount: (number) Total current bill amount due. Must be a positive number.
- tariff_rate: (number or null) Effective energy rate per kWh if shown.
- currency: (string) ISO currency code (e.g. "USD", "INR", "EUR", "GBP"). Default to "USD" if not stated.
- due_date: (string YYYY-MM-DD or null) Payment due date if visible.

Never include conversational prose, markdown code blocks, or explanations. Only return pure JSON.`;

export async function extractBillFromBuffer(
  buffer: Buffer,
  mimeType: string
): Promise<ExtractionResult> {
  const startTime = Date.now();
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (!openRouterKey && !geminiKey) {
    return {
      success: false,
      error: "OPENROUTER_API_KEY is not configured on the server. Please check environment configuration.",
      processingTimeMs: Date.now() - startTime,
    };
  }

  try {
    const base64Data = buffer.toString("base64");
    let responseText = "";

    if (openRouterKey) {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openRouterKey.trim()}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
          "X-Title": "CarbonCoach AI",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-lite",
          messages: [
            {
              role: "system",
              content: SYSTEM_INSTRUCTION,
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Extract all electricity bill data from this document accurately according to the instructions.",
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${mimeType};base64,${base64Data}`,
                  },
                },
              ],
            },
          ],
          temperature: 0.1,
          response_format: { type: "json_object" },
        }),
        signal: AbortSignal.timeout(45000),
      });

      if (!response.ok) {
        let errDetail = "";
        try {
          const errObj = await response.json();
          errDetail = errObj?.error?.message || JSON.stringify(errObj);
        } catch {
          errDetail = response.statusText;
        }
        throw new Error(`OpenRouter extraction failed (HTTP ${response.status}): ${errDetail}`);
      }

      const resJson = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      responseText = resJson.choices?.[0]?.message?.content || "";
    } else if (geminiKey) {
      const ai = new GoogleGenAI({ apiKey: geminiKey });
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: "Extract all electricity bill data from this document accurately according to the instructions.",
              },
              {
                inlineData: {
                  mimeType,
                  data: base64Data,
                },
              },
            ],
          },
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
        },
      });
      responseText = response.text || "";
    }
    let parsedJson: unknown;

    try {
      parsedJson = JSON.parse(responseText);
    } catch {
      // If response text has markdown code blocks, strip them
      const cleanJson = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
      parsedJson = JSON.parse(cleanJson);
    }

    // Strict Zod schema validation
    const validation = billExtractionSchema.safeParse(parsedJson);

    if (!validation.success) {
      return {
        success: false,
        error: `AI extraction schema validation failed: ${validation.error.issues.map((i) => i.message).join(", ")}`,
        rawResponse: responseText,
        processingTimeMs: Date.now() - startTime,
      };
    }

    return {
      success: true,
      data: validation.data,
      rawResponse: responseText,
      processingTimeMs: Date.now() - startTime,
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error during AI bill extraction";
    return {
      success: false,
      error: errorMessage,
      processingTimeMs: Date.now() - startTime,
    };
  }
}
