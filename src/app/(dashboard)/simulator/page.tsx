import React from "react";
import { createClient } from "@/lib/supabase/server";
import { LightingSimulator } from "@/components/simulator/LightingSimulator";

export const metadata = {
  title: "What-If Simulator — CarbonCoach AI",
};

export default async function SimulatorPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let preferredCurrency = "USD";
  let defaultTariff = 0.165;
  let defaultEmissionFactor = 0.386;

  if (user) {
    const { data: dbHousehold } = await supabase
      .from("household_profiles")
      .select("preferred_currency, region")
      .eq("user_id", user.id)
      .maybeSingle();

    if (dbHousehold) {
      preferredCurrency = dbHousehold.preferred_currency || preferredCurrency;
    }

    // Check latest confirmed bill for actual tariff rate
    const { data: latestBill } = await supabase
      .from("electricity_bills")
      .select("tariff_rate, currency")
      .eq("user_id", user.id)
      .order("billing_period_start", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latestBill) {
      if (latestBill.tariff_rate) {
        defaultTariff = Number(latestBill.tariff_rate);
      }
      if (latestBill.currency) {
        preferredCurrency = latestBill.currency;
      }
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#111827]">
          What-If Energy Simulator
        </h1>
        <p className="text-sm text-[#667085] mt-1">
          Explore potential electricity, financial, and emissions impacts before making changes.
        </p>
      </div>

      <LightingSimulator
        defaultTariff={defaultTariff}
        defaultEmissionFactor={defaultEmissionFactor}
        currency={preferredCurrency}
      />
    </div>
  );
}
