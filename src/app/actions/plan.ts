"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Json, ActionStatus } from "@/types/database";

export async function addTemplateToPlan(templateId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required" };
  }

  // 1. Resolve user's household
  let { data: household } = await supabase
    .from("households")
    .select("id, home_type, region_code")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!household) {
    const { data: newH, error: hErr } = await supabase
      .from("households")
      .insert({ user_id: user.id, household_name: "My Household", home_type: "owned" })
      .select("id, home_type, region_code")
      .single();
    if (hErr || !newH) {
      return { success: false, error: hErr?.message || "Failed to initialize household profile" };
    }
    household = newH;
  }

  // 2. Prevent duplicate active actions for the same recommendation
  const { data: existingAction } = await supabase
    .from("user_actions")
    .select("id, status")
    .eq("user_id", user.id)
    .eq("recommendation_id", templateId)
    .neq("status", "dismissed")
    .maybeSingle();

  if (existingAction) {
    return { success: false, error: "This recommendation is already in your active plan." };
  }

  // 3. Get recommendation template details
  const { data: template, error: tplErr } = await supabase
    .from("recommendation_templates")
    .select("*")
    .eq("id", templateId)
    .single();

  if (tplErr || !template) {
    return { success: false, error: "Recommendation template not found" };
  }

  // 4. Resolve real tariff and currency from confirmed electricity bills or user preferences
  const { data: prefs } = await supabase
    .from("user_preferences")
    .select("preferred_currency")
    .eq("user_id", user.id)
    .maybeSingle();

  const userCurrency = prefs?.preferred_currency || "INR";

  // Check latest confirmed bill for actual measured tariff rate
  const { data: latestBill } = await supabase
    .from("electricity_bills")
    .select("tariff_rate, bill_amount, energy_consumed_kwh, currency")
    .eq("user_id", user.id)
    .eq("status", "confirmed")
    .order("billing_period_start", { ascending: false })
    .limit(1)
    .maybeSingle();

  let effectiveTariff = userCurrency === "INR" ? 7.5 : 0.165;
  if (latestBill) {
    if (latestBill.tariff_rate && Number(latestBill.tariff_rate) > 0) {
      effectiveTariff = Number(latestBill.tariff_rate);
    } else if (Number(latestBill.energy_consumed_kwh) > 0 && Number(latestBill.bill_amount) > 0) {
      effectiveTariff = Number(
        (Number(latestBill.bill_amount) / Number(latestBill.energy_consumed_kwh)).toFixed(4)
      );
    }
  }

  // 5. Resolve emission factor from emission_factors table
  const region = household.region_code || (userCurrency === "INR" ? "IN_AVG" : "US_AVG");
  const { data: factorRow } = await supabase
    .from("emission_factors")
    .select("factor_kg_co2e_per_kwh")
    .eq("region_code", region)
    .eq("is_active", true)
    .maybeSingle();

  const effectiveEmissionFactor = factorRow
    ? Number(factorRow.factor_kg_co2e_per_kwh)
    : userCurrency === "INR"
    ? 0.7100
    : 0.3860;

  // 6. Calculate deterministic savings
  const calcConfig = (template.calculation_config || {}) as Record<string, unknown>;
  const kwhSaving = Number(
    calcConfig.estimated_kwh_reduction_annual || template.estimated_kwh_reduction_annual || 0
  );
  const moneySaving = Number((kwhSaving * effectiveTariff).toFixed(2));
  const co2Saving = Number((kwhSaving * effectiveEmissionFactor).toFixed(2));
  const upfrontCost = Number(calcConfig.upfront_cost_estimate ?? template.minimum_budget ?? 0);

  // 7. Insert into user_actions
  const { error } = await supabase.from("user_actions").insert({
    user_id: user.id,
    household_id: household.id,
    recommendation_id: template.id,
    title: template.title,
    description: template.description,
    status: "planned",
    estimated_cost: upfrontCost,
    estimated_kwh_saving: kwhSaving,
    estimated_money_saving: moneySaving,
    estimated_co2_saving_kg: co2Saving,
  });

  if (error) {
    console.error("[addTemplateToPlan] Database insert error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/plan");
  revalidatePath("/dashboard");
  revalidatePath("/progress");
  return { success: true };
}

export async function toggleActionCompletion(
  actionId: string,
  currentStatus: "planned" | "completed" | "in_progress" | "dismissed"
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required" };
  }

  const nextStatus: ActionStatus = currentStatus === "completed" ? "planned" : "completed";
  const completedAt = nextStatus === "completed" ? new Date().toISOString() : null;

  const { error } = await supabase
    .from("user_actions")
    .update({
      status: nextStatus,
      completed_at: completedAt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", actionId)
    .eq("user_id", user.id);

  if (error) {
    console.error("[toggleActionCompletion] Database update error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/plan");
  revalidatePath("/dashboard");
  revalidatePath("/progress");
  return { success: true, nextStatus };
}

export async function removeActionFromPlan(actionId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required" };
  }

  const { error } = await supabase
    .from("user_actions")
    .delete()
    .eq("id", actionId)
    .eq("user_id", user.id);

  if (error) {
    console.error("[removeActionFromPlan] Database delete error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/plan");
  revalidatePath("/dashboard");
  revalidatePath("/progress");
  return { success: true };
}

export async function recordSimulationRun(
  simulationType: string,
  inputParameters: Record<string, unknown>,
  calculatedKwh: number,
  calculatedCost: number,
  calculatedCo2: number,
  projectionDays: number = 365
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required" };
  }

  // Resolve user's household
  let { data: household } = await supabase
    .from("households")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!household) {
    const { data: newH } = await supabase
      .from("households")
      .insert({ user_id: user.id, household_name: "My Household", home_type: "owned" })
      .select("id")
      .single();
    household = newH;
  }

  if (!household) {
    return { success: false, error: "Could not resolve household" };
  }

  const { data: inserted, error } = await supabase
    .from("simulation_runs")
    .insert({
      user_id: user.id,
      household_id: household.id,
      simulation_type: simulationType,
      input_parameters: inputParameters as Json,
      projection_days: projectionDays,
      calculated_kwh_saving: calculatedKwh,
      calculated_money_saving: calculatedCost,
      calculated_co2_saving_kg: calculatedCo2,
    })
    .select()
    .single();

  if (error) {
    console.error("[recordSimulationRun] Database insert error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/simulator");
  revalidatePath("/progress");
  return { success: true, simulation: inserted };
}

export async function deleteSimulationRun(simulationId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required" };
  }

  const { error } = await supabase
    .from("simulation_runs")
    .delete()
    .eq("id", simulationId)
    .eq("user_id", user.id);

  if (error) {
    console.error("[deleteSimulationRun] Database delete error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/simulator");
  revalidatePath("/progress");
  return { success: true };
}
