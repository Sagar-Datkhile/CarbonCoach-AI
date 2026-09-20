"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addTemplateToPlan(templateId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required" };
  }

  // Get template details
  const { data: template } = await supabase
    .from("recommendation_templates")
    .select("*")
    .eq("id", templateId)
    .single();

  if (!template) {
    return { success: false, error: "Template not found" };
  }

  // Calculate estimated savings based on template
  const kwhSaving = Number(template.estimated_kwh_reduction_annual || 0);
  const costSaving = Number((kwhSaving * 0.165).toFixed(2));
  const co2Saving = Number((kwhSaving * 0.386).toFixed(2));

  // Insert into user_actions
  const { error } = await supabase.from("user_actions").insert({
    user_id: user.id,
    template_id: template.id,
    custom_title: template.title,
    status: "planned",
    estimated_kwh_saving: kwhSaving,
    estimated_cost_saving: costSaving,
    estimated_co2_saving: co2Saving,
  });

  if (error) {
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

  const nextStatus = currentStatus === "completed" ? "planned" : "completed";
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
  calculatedCo2: number
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required" };
  }

  const { error } = await supabase.from("simulation_runs").insert({
    user_id: user.id,
    simulation_type: simulationType,
    input_parameters: inputParameters as any,
    calculated_kwh_saving: calculatedKwh,
    calculated_cost_saving: calculatedCost,
    calculated_co2_saving: calculatedCo2,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/simulator");
  return { success: true };
}
