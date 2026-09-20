import React from "react";
import { createClient } from "@/lib/supabase/server";
import { PlanManager } from "@/components/plan/PlanManager";

export const metadata = {
  title: "My Plan — CarbonCoach AI",
};

export default async function PlanPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Fetch Household Profile
  let household = {
    homeType: "Owned",
    budgetTier: "Moderate",
    preferredCurrency: "USD",
  };

  if (user) {
    const { data: dbHousehold } = await supabase
      .from("household_profiles")
      .select("home_type, budget_tier, preferred_currency")
      .eq("user_id", user.id)
      .maybeSingle();

    if (dbHousehold) {
      household = {
        homeType: dbHousehold.home_type || household.homeType,
        budgetTier: dbHousehold.budget_tier || household.budgetTier,
        preferredCurrency: dbHousehold.preferred_currency || household.preferredCurrency,
      };
    }
  }

  // 2. Fetch Active Recommendation Templates
  let templates: any[] = [];
  const { data: dbTemplates } = await supabase
    .from("recommendation_templates")
    .select("*")
    .eq("is_active", true)
    .order("estimated_kwh_reduction_annual", { ascending: false });

  if (dbTemplates && dbTemplates.length > 0) {
    templates = dbTemplates;
  } else {
    // Fallback baseline templates in case DB has not yet been seeded
    templates = [
      {
        id: "tpl-1",
        title: "Switch High-Use Fixtures to High-Efficiency LEDs",
        description: "Replace five standard 60W incandescent bulbs used ~4 hours daily with energy-saving 9W LEDs.",
        category: "electricity",
        applicable_home_types: ["Owned", "Rented", "Shared"],
        applicable_budget_tiers: ["Low", "Moderate"],
        difficulty: "Easy",
        estimated_kwh_reduction_annual: 372.3,
        estimated_percent_reduction: 5.5,
        upfront_cost_estimate: 25.0,
      },
      {
        id: "tpl-2",
        title: "Eliminate Phantom Power with Smart Power Strips",
        description: "Plug television consoles, audio equipment, and home office workstations into smart power strips that cut standby vampire load automatically.",
        category: "appliances",
        applicable_home_types: ["Owned", "Rented", "Shared"],
        applicable_budget_tiers: ["Zero-Cost", "Low"],
        difficulty: "Easy",
        estimated_kwh_reduction_annual: 180.0,
        estimated_percent_reduction: 2.8,
        upfront_cost_estimate: 30.0,
      },
      {
        id: "tpl-3",
        title: "Adjust Thermostat Setpoint by 1°C / 2°F",
        description: "Adjust cooling setpoint up 1°C in warm months and heating down 1°C in cold months to reduce continuous compressor load.",
        category: "habits",
        applicable_home_types: ["Owned", "Rented", "Shared"],
        applicable_budget_tiers: ["Zero-Cost"],
        difficulty: "Easy",
        estimated_kwh_reduction_annual: 240.0,
        estimated_percent_reduction: 4.0,
        upfront_cost_estimate: 0.0,
      },
      {
        id: "tpl-4",
        title: "Cold Water Laundry Cycles",
        description: "Wash 80% of routine laundry loads in cold water instead of warm/hot cycles. Water heating accounts for up to 90% of washing machine energy.",
        category: "habits",
        applicable_home_types: ["Owned", "Rented", "Shared"],
        applicable_budget_tiers: ["Zero-Cost"],
        difficulty: "Easy",
        estimated_kwh_reduction_annual: 160.0,
        estimated_percent_reduction: 2.5,
        upfront_cost_estimate: 0.0,
      },
      {
        id: "tpl-5",
        title: "Clean Refrigerator Condenser Coils & Check Gasket",
        description: "Vacuum dust from behind and beneath the refrigerator twice a year to maintain compressor efficiency and heat dissipation.",
        category: "appliances",
        applicable_home_types: ["Owned", "Rented", "Shared"],
        applicable_budget_tiers: ["Zero-Cost"],
        difficulty: "Easy",
        estimated_kwh_reduction_annual: 95.0,
        estimated_percent_reduction: 1.5,
        upfront_cost_estimate: 0.0,
      },
    ];
  }

  // 3. Fetch User Actions
  let userActions: any[] = [];
  if (user) {
    const { data: dbActions } = await supabase
      .from("user_actions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (dbActions) {
      userActions = dbActions;
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
