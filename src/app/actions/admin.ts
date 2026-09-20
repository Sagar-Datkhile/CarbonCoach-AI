"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Ensures caller is an authenticated admin via server database query
 */
async function verifyAdminCaller() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Authentication required");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    throw new Error("Unauthorized: Administrative privileges required");
  }

  return { supabase, user };
}

export async function toggleTemplateStatus(templateId: string, currentStatus: boolean) {
  const { supabase } = await verifyAdminCaller();

  const { error } = await supabase
    .from("recommendation_templates")
    .update({ is_active: !currentStatus })
    .eq("id", templateId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/templates");
  revalidatePath("/plan");
  return { success: true };
}

export async function createTemplate(formData: FormData) {
  const { supabase } = await verifyAdminCaller();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = (formData.get("category") as any) || "electricity";
  const difficulty = (formData.get("difficulty") as any) || "Easy";
  const estimatedKwh = Number(formData.get("estimatedKwh") || 0);
  const upfrontCost = Number(formData.get("upfrontCost") || 0);

  const { error } = await supabase.from("recommendation_templates").insert({
    title,
    description,
    category,
    difficulty,
    estimated_kwh_reduction_annual: estimatedKwh,
    upfront_cost_estimate: upfrontCost,
    applicable_home_types: ["Owned", "Rented", "Shared"],
    applicable_budget_tiers: ["Zero-Cost", "Low", "Moderate", "High"],
    is_active: true,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/templates");
  revalidatePath("/plan");
}

export async function toggleEmissionFactorStatus(factorId: string, currentStatus: boolean) {
  const { supabase } = await verifyAdminCaller();

  const { error } = await supabase
    .from("emission_factors")
    .update({ is_active: !currentStatus })
    .eq("id", factorId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/emissions");
  return { success: true };
}

export async function createEmissionFactor(formData: FormData): Promise<void> {
  const { supabase } = await verifyAdminCaller();

  const regionCode = (formData.get("regionCode") as string).toUpperCase();
  const regionName = formData.get("regionName") as string;
  const factor = Number(formData.get("factor") || 0.4);
  const defaultTariff = Number(formData.get("defaultTariff") || 0.16);
  const currencyCode = (formData.get("currencyCode") as string) || "USD";

  const { error } = await supabase.from("emission_factors").insert({
    region_code: regionCode,
    region_name: regionName,
    factor_kg_co2e_per_kwh: factor,
    default_tariff_per_kwh: defaultTariff,
    currency_code: currencyCode,
    is_active: true,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/emissions");
}
