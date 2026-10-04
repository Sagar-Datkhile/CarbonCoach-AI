import React from "react";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { SettingsView } from "@/components/settings/SettingsView";
import type { UserSettingsInput } from "@/app/actions/settings";
import { deriveBudgetTier, type BudgetTier } from "@/lib/budget";

export const metadata = {
  title: "Settings — Carbon Coach AI",
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const meta = user?.user_metadata || {};
  let preferredCurrency = (meta.preferred_currency as string) || "INR";
  let budgetTier: BudgetTier = (meta.budget_tier as BudgetTier) || "Moderate";

  if (user) {
    const { data: dbPref } = await supabase
      .from("user_preferences")
      .select("preferred_currency, upfront_budget")
      .eq("user_id", user.id)
      .maybeSingle();

    if (dbPref?.preferred_currency) {
      preferredCurrency = dbPref.preferred_currency.trim();
    }
    if (meta.budget_tier) {
      budgetTier = meta.budget_tier as BudgetTier;
    } else if (dbPref?.upfront_budget !== null && dbPref?.upfront_budget !== undefined) {
      budgetTier = deriveBudgetTier(dbPref.upfront_budget, preferredCurrency);
    }
  }

  const emailNotifications =
    meta.email_notifications !== undefined
      ? Boolean(meta.email_notifications)
      : true;

  const energySavingReminders =
    meta.energy_saving_reminders !== undefined
      ? Boolean(meta.energy_saving_reminders)
      : true;

  const energyUnit =
    typeof meta.energy_unit === "string" ? meta.energy_unit : "kWh";

  const cookieStore = await cookies();
  const cookieTheme = cookieStore.get("carboncoach_theme")?.value;
  const theme: "light" | "dark" =
    meta.theme === "dark" || cookieTheme === "dark" ? "dark" : "light";

  const initialSettings: UserSettingsInput = {
    emailNotifications,
    energySavingReminders,
    currency: preferredCurrency,
    energyUnit,
    theme,
    budgetTier,
  };

  return (
    <SettingsView
      initialSettings={initialSettings}
      userEmail={user?.email || ""}
    />
  );
}
