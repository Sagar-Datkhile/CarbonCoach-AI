import React from "react";
import { createClient } from "@/lib/supabase/server";
import { PlanManager } from "@/components/plan/PlanManager";

export const metadata = {
  title: "My Plan — Carbon Coach AI",
};

export default async function PlanPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Fetch Household Profile & Preferences
  const household = {
    homeType: "Owned",
    budgetTier: "Moderate",
    preferredCurrency: "INR",
  };

  let effectiveTariff = 7.5;

  if (user) {
    const { data: dbHousehold } = await supabase
      .from("households")
      .select("home_type, occupants_count, region_code")
      .eq("user_id", user.id)
      .maybeSingle();

    const { data: dbPrefs } = await supabase
      .from("user_preferences")
      .select("preferred_currency, upfront_budget")
      .eq("user_id", user.id)
      .maybeSingle();

    if (dbHousehold && dbHousehold.home_type) {
      const rawType = dbHousehold.home_type;
      household.homeType = rawType.charAt(0).toUpperCase() + rawType.slice(1).toLowerCase();
    }

    if (dbPrefs) {
      if (dbPrefs.preferred_currency) {
        household.preferredCurrency = dbPrefs.preferred_currency.trim();
      }
      if (dbPrefs.upfront_budget !== null && dbPrefs.upfront_budget !== undefined) {
        const b = Number(dbPrefs.upfront_budget);
        household.budgetTier = b === 0 ? "Zero-Cost" : b <= 100 ? "Low" : b <= 1000 ? "Moderate" : "High";
      }
    }

    // Resolve tariff rate and currency from confirmed electricity bills
    const { data: latestBill } = await supabase
      .from("electricity_bills")
      .select("tariff_rate, bill_amount, energy_consumed_kwh, currency")
      .eq("user_id", user.id)
      .eq("status", "confirmed")
      .order("billing_period_start", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latestBill) {
      if (latestBill.currency) household.preferredCurrency = latestBill.currency.trim();
      if (latestBill.tariff_rate && Number(latestBill.tariff_rate) > 0) {
        effectiveTariff = Number(latestBill.tariff_rate);
      } else if (Number(latestBill.energy_consumed_kwh) > 0 && Number(latestBill.bill_amount) > 0) {
        effectiveTariff = Number(
          (Number(latestBill.bill_amount) / Number(latestBill.energy_consumed_kwh)).toFixed(4)
        );
      }
    } else {
      effectiveTariff = household.preferredCurrency === "INR" ? 7.5 : 0.165;
    }
  }

  // 2. Fetch Active Recommendation Templates from Supabase
  const { data: dbTemplates } = await supabase
    .from("recommendation_templates")
    .select("*")
    .eq("is_active", true);

  const templates = (dbTemplates || []).map((t) => {
    const calcConfig = (t.calculation_config || {}) as Record<string, unknown>;
    const eligConfig = (t.eligibility_config || {}) as Record<string, unknown>;

    const homeTypes = (t.applicable_home_types || ["owned", "rented", "shared"]).map((ht: string) =>
      ht ? ht.charAt(0).toUpperCase() + ht.slice(1).toLowerCase() : "Owned"
    );

    const kwh = Number(calcConfig.estimated_kwh_reduction_annual || t.estimated_kwh_reduction_annual || 100);
    const estimatedCostSaving = Number((kwh * effectiveTariff).toFixed(0));

    return {
      id: t.id,
      title: t.title,
      description: t.description,
      category: t.category || "electricity",
      applicable_home_types: homeTypes,
      applicable_budget_tiers:
        (calcConfig.applicable_budget_tiers as string[]) ||
        (eligConfig.applicable_budget_tiers as string[]) ||
        ["Zero-Cost", "Low", "Moderate", "High"],
      difficulty: String(calcConfig.difficulty || t.difficulty || "Easy"),
      estimated_kwh_reduction_annual: kwh,
      estimated_percent_reduction: Number(calcConfig.estimated_percent_reduction || t.estimated_percent_reduction || 2),
      upfront_cost_estimate: Number(calcConfig.upfront_cost_estimate ?? t.minimum_budget ?? 0),
      estimated_cost_saving: estimatedCostSaving,
    };
  });

  // 3. Fetch User Actions from Supabase
  let userActions: Array<{
    id: string;
    template_id: string | null;
    custom_title: string | null;
    status: "planned" | "completed" | "in_progress" | "dismissed";
    estimated_kwh_saving: number;
    estimated_cost_saving: number;
    estimated_co2_saving: number;
    completed_at: string | null;
  }> = [];

  if (user) {
    const { data: dbActions } = await supabase
      .from("user_actions")
      .select("*")
      .eq("user_id", user.id)
      .neq("status", "dismissed")
      .order("created_at", { ascending: false });

    if (dbActions) {
      userActions = dbActions.map((a) => ({
        id: a.id,
        template_id: a.recommendation_id || a.template_id || null,
        custom_title: a.title || a.custom_title || "Household Energy Action",
        status: (a.status as "planned" | "completed" | "in_progress" | "dismissed") || "planned",
        estimated_kwh_saving: Number(a.estimated_kwh_saving || 0),
        estimated_cost_saving: Number(a.estimated_money_saving ?? a.estimated_cost_saving ?? 0),
        estimated_co2_saving: Number(a.estimated_co2_saving_kg ?? a.estimated_co2_saving ?? 0),
        completed_at: a.completed_at,
      }));
    }
  }

  return (
    <PlanManager
      templates={templates}
      userActions={userActions}
      household={household}
    />
  );
}
