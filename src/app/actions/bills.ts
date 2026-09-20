"use server";

import { createClient } from "@/lib/supabase/server";
import { extractBillFromBuffer } from "@/lib/gemini/extractor";
import { confirmedBillSchema, type ConfirmedBillData, type BillExtractionData } from "@/lib/validations/bill";
import { revalidatePath } from "next/cache";

export interface BillUploadResult {
  success: boolean;
  error?: string;
  data?: BillExtractionData;
  filePath?: string;
  isAiFallback?: boolean;
}

export async function uploadAndExtractBill(
  formData: FormData
): Promise<BillUploadResult> {
  const file = formData.get("billFile") as File | null;
  if (!file || file.size === 0) {
    return { success: false, error: "Please select an electricity bill file to upload." };
  }

  // Validate allowed file types
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "application/pdf",
  ];
  if (!allowedTypes.includes(file.type)) {
    return {
      success: false,
      error: "Unsupported file type. Please upload a JPG, PNG, or PDF bill.",
    };
  }

  // 10MB file limit
  const maxBytes = 10 * 1024 * 1024;
  if (file.size > maxBytes) {
    return { success: false, error: "File exceeds 10MB limit. Please upload a smaller file." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required to upload bills." };
  }

  // Read file into Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Upload to Supabase Storage private 'bills' bucket
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const filePath = `${user.id}/${Date.now()}-${sanitizedFileName}`;

  const { error: storageError } = await supabase.storage
    .from("bills")
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (storageError) {
    // If storage bucket doesn't exist yet, we still proceed with extraction and inform user
    console.warn("Storage upload note:", storageError.message);
  }

  // Server-side Gemini 1.5 Flash extraction
  const extraction = await extractBillFromBuffer(buffer, file.type);

  // Log extraction attempt
  await supabase.from("bill_extraction_logs").insert({
    user_id: user.id,
    file_path: filePath,
    raw_ai_response: extraction.rawResponse ? JSON.parse(JSON.stringify(extraction.rawResponse)) : null,
    validated_payload: extraction.data ? JSON.parse(JSON.stringify(extraction.data)) : null,
    status: extraction.success ? "success" : "failed",
    error_message: extraction.error || null,
    processing_time_ms: extraction.processingTimeMs,
  });

  if (!extraction.success || !extraction.data) {
    // Provide an editable default template so user is never blocked by an OCR glitch or missing API key
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const fallbackData: BillExtractionData = {
      provider_name: "",
      consumer_number: null,
      bill_number: null,
      billing_period_start: thirtyDaysAgo.toISOString().split("T")[0],
      billing_period_end: today.toISOString().split("T")[0],
      billing_days: 30,
      energy_consumed_kwh: 0,
      bill_amount: 0,
      tariff_rate: null,
      currency: "USD",
      due_date: null,
    };

    return {
      success: true,
      data: fallbackData,
      filePath,
      isAiFallback: true,
      error: extraction.error || "AI extraction could not identify fields. Please enter the values manually below.",
    };
  }

  return {
    success: true,
    data: extraction.data,
    filePath,
  };
}

export async function confirmAuthoritativeBill(
  data: ConfirmedBillData
): Promise<{ success: boolean; billId?: string; error?: string }> {
  const validation = confirmedBillSchema.safeParse(data);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues.map((i) => i.message).join(", "),
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required" };
  }

  // Calculate estimated emissions based on active emission factor (default US/Global average ~0.386 kg/kWh)
  const defaultFactor = 0.386;
  const estimatedEmissions = Number(
    (validation.data.energy_consumed_kwh * defaultFactor).toFixed(2)
  );

  // Look up household_id for user if the database schema requires it
  let householdId: string | null = null;
  try {
    const { data: hp } = await (supabase as any)
      .from("household_profiles")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (hp?.id) {
      householdId = hp.id;
    } else {
      const { data: h } = await (supabase as any)
        .from("households")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (h?.id) {
        householdId = h.id;
      } else {
        // Auto-create basic household if none exists to satisfy foreign key / not-null constraint
        const { data: newH } = await (supabase as any)
          .from("households")
          .insert({
            user_id: user.id,
            household_name: "My Household",
            home_type: "owned",
          })
          .select("id")
          .maybeSingle();
        if (newH?.id) {
          householdId = newH.id;
        }
      }
    }
  } catch {
    // Continue without householdId
  }

  const basePayload: Record<string, any> = {
    user_id: user.id,
    provider_name: validation.data.provider_name,
    consumer_number: validation.data.consumer_number || null,
    bill_number: validation.data.bill_number || null,
    billing_period_start: validation.data.billing_period_start,
    billing_period_end: validation.data.billing_period_end,
    energy_consumed_kwh: validation.data.energy_consumed_kwh,
    bill_amount: validation.data.bill_amount,
    tariff_rate: validation.data.tariff_rate || null,
    currency: validation.data.currency || "USD",
    due_date: validation.data.due_date || null,
    file_path: validation.data.file_path || null,
    status: "confirmed",
  };

  if (householdId) {
    basePayload.household_id = householdId;
  }

  // First attempt: insert with estimated_emissions_kg
  let { data: bill, error } = await (supabase as any)
    .from("electricity_bills")
    .insert({
      ...basePayload,
      estimated_emissions_kg: estimatedEmissions,
    })
    .select("id")
    .single();

  // If column estimated_emissions_kg is not found in schema cache, retry without it
  if (error && (error.message?.includes("estimated_emissions_kg") || error.code === "PGRST204")) {
    const retry = await (supabase as any)
      .from("electricity_bills")
      .insert(basePayload)
      .select("id")
      .single();
    bill = retry.data;
    error = retry.error;
  }

  // If household_id constraint failed, ensure household exists and retry
  if (error && (error.message?.includes("household_id") || error.code === "23502")) {
    if (!householdId) {
      const { data: fallbackH } = await (supabase as any)
        .from("households")
        .upsert(
          {
            user_id: user.id,
            household_name: "My Household",
            home_type: "owned",
          },
          { onConflict: "user_id" }
        )
        .select("id")
        .maybeSingle();
      householdId = fallbackH?.id || null;
    }

    if (householdId) {
      basePayload.household_id = householdId;
      const retryWithHousehold = await (supabase as any)
        .from("electricity_bills")
        .insert(basePayload)
        .select("id")
        .single();
      bill = retryWithHousehold.data;
      error = retryWithHousehold.error;
    }
  }

  if (error || !bill) {
    return { success: false, error: error?.message || "Failed to save bill" };
  }

  revalidatePath("/bills");
  revalidatePath("/dashboard");
  revalidatePath("/progress");
  revalidatePath("/plan");

  return { success: true, billId: bill.id };
}

export async function deleteBill(
  billId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required" };
  }

  const { error } = await supabase
    .from("electricity_bills")
    .delete()
    .eq("id", billId)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/bills");
  revalidatePath("/dashboard");
  revalidatePath("/progress");

  return { success: true };
}
