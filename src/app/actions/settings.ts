"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export interface UserSettingsInput {
  emailNotifications: boolean;
  energySavingReminders: boolean;
  currency: string;
  energyUnit: string;
  theme: "light" | "dark";
}

export interface SettingsActionResult {
  success: boolean;
  error?: string;
}

export async function setThemePreference(theme: "light" | "dark"): Promise<SettingsActionResult> {
  try {
    const cookieStore = await cookies();
    cookieStore.set("carboncoach_theme", theme, {
      path: "/",
      maxAge: 31536000,
      sameSite: "lax",
    });

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase.auth.updateUser({
        data: {
          theme,
        },
      });
    }

    revalidatePath("/settings");
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update theme";
    return { success: false, error: msg };
  }
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

  // 1. Update theme cookie
  const cookieStore = await cookies();
  cookieStore.set("carboncoach_theme", settings.theme || "light", {
    path: "/",
    maxAge: 31536000,
    sameSite: "lax",
  });

  // 2. Update user metadata in Supabase Auth
  const { error: authErr } = await supabase.auth.updateUser({
    data: {
      email_notifications: settings.emailNotifications,
      energy_saving_reminders: settings.energySavingReminders,
      energy_unit: settings.energyUnit,
      preferred_currency: settings.currency,
      theme: settings.theme || "light",
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
