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
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: "GEMINI_API_KEY is not configured on the server. Please check environment configuration.",
      processingTimeMs: Date.now() - startTime,
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const base64Data = buffer.toString("base64");

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

    const responseText = response.text || "";
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
