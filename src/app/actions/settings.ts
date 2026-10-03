"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface UserSettingsInput {
  emailNotifications: boolean;
  energySavingReminders: boolean;
  currency: string;
  energyUnit: string;
}

export interface SettingsActionResult {
  success: boolean;
  error?: string;
}

export async function updateUserSettings(
  settings: UserSettingsInput
): Promise<SettingsActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required" };
  }

  // 1. Update user metadata in Supabase Auth
  const { error: authErr } = await supabase.auth.updateUser({
    data: {
      email_notifications: settings.emailNotifications,
      energy_saving_reminders: settings.energySavingReminders,
      energy_unit: settings.energyUnit,
      preferred_currency: settings.currency,
    },
  });

  if (authErr) {
    console.error("[updateUserSettings] Auth update error:", authErr);
    return { success: false, error: authErr.message };
  }

  // 2. Persist currency in user_preferences table
  const { data: existingPref } = await supabase
    .from("user_preferences")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingPref) {
    const { error: prefErr } = await supabase
      .from("user_preferences")
      .update({
        preferred_currency: settings.currency,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    if (prefErr) {
      console.error("[updateUserSettings] Preferences update error:", prefErr);
      return { success: false, error: prefErr.message };
    }
  } else {
    const { error: insErr } = await supabase.from("user_preferences").insert({
      user_id: user.id,
      preferred_currency: settings.currency,
    });

    if (insErr) {
      console.error("[updateUserSettings] Preferences insert error:", insErr);
      return { success: false, error: insErr.message };
    }
  }

  revalidatePath("/settings");
  revalidatePath("/profile");
  revalidatePath("/plan");
  revalidatePath("/simulator");
  revalidatePath("/progress");
  revalidatePath("/dashboard");
  return { success: true };
}
