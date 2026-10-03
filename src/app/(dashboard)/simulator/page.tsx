import React from "react";
import { createClient } from "@/lib/supabase/server";
import {
  LightingSimulator,
  type SavedSimulation,
  type BaselineData,
} from "@/components/simulator/LightingSimulator";

export const metadata = {
  title: "What-If Simulator — CarbonCoach AI",
};

export default async function SimulatorPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let preferredCurrency = "INR";
  let defaultTariff = 7.5; // Default fallback for INR (approx 7.5 INR/kWh)
  let defaultEmissionFactor = 0.71; // Default fallback for India grid factor
  let baseline: BaselineData | null = null;
  let savedSimulations: SavedSimulation[] = [];

  if (user) {
    // 1. Fetch user's household
    const { data: dbHousehold } = await supabase
      .from("households")
      .select("id, region_code")
      .eq("user_id", user.id)
      .maybeSingle();

    // 2. Fetch user preferences
    const { data: userPref } = await supabase
      .from("user_preferences")
      .select("preferred_currency")
      .eq("user_id", user.id)
      .maybeSingle();

    if (userPref?.preferred_currency) {
      preferredCurrency = userPref.preferred_currency;
    }

    // Set regional tariff fallback based on currency
    if (preferredCurrency === "USD") {
      defaultTariff = 0.165;
      defaultEmissionFactor = 0.386;
    } else if (preferredCurrency === "EUR") {
      defaultTariff = 0.28;
      defaultEmissionFactor = 0.23;
    }

    // 3. Fetch emission factor from database
    const regionCode =
      dbHousehold?.region_code ||
      (preferredCurrency === "INR" ? "IN_AVG" : preferredCurrency === "EUR" ? "EU_AVG" : "US_AVG");

    const { data: efData } = await supabase
      .from("emission_factors")
      .select("factor_kg_co2e_per_kwh")
      .eq("region_code", regionCode)
      .eq("is_active", true)
      .maybeSingle();

    if (efData?.factor_kg_co2e_per_kwh) {
      defaultEmissionFactor = Number(efData.factor_kg_co2e_per_kwh);
    }

    // 4. Check latest confirmed bill for real baseline consumption and tariff rate
    const { data: latestBill } = await supabase
      .from("electricity_bills")
      .select(
        "id, tariff_rate, currency, energy_consumed_kwh, bill_amount, estimated_emissions_kg, billing_period_start, billing_period_end"
      )
      .eq("user_id", user.id)
      .eq("status", "confirmed")
      .order("billing_period_start", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latestBill) {
      if (latestBill.tariff_rate && Number(latestBill.tariff_rate) > 0) {
        defaultTariff = Number(latestBill.tariff_rate);
      } else if (
        latestBill.energy_consumed_kwh &&
        Number(latestBill.energy_consumed_kwh) > 0 &&
        latestBill.bill_amount
      ) {
        defaultTariff = Number(
          (Number(latestBill.bill_amount) / Number(latestBill.energy_consumed_kwh)).toFixed(3)
        );
      }

      if (latestBill.currency) {
        preferredCurrency = latestBill.currency;
      }

      baseline = {
        energyConsumedKwh: Number(latestBill.energy_consumed_kwh || 0),
        billAmount: Number(latestBill.bill_amount || 0),
        tariffRate: latestBill.tariff_rate ? Number(latestBill.tariff_rate) : defaultTariff,
        estimatedEmissionsKg: latestBill.estimated_emissions_kg
          ? Number(latestBill.estimated_emissions_kg)
          : Number((Number(latestBill.energy_consumed_kwh || 0) * defaultEmissionFactor).toFixed(2)),
        billingPeriodStart: latestBill.billing_period_start,
        billingPeriodEnd: latestBill.billing_period_end,
      };
    }

    // 5. Fetch saved simulation runs
    const { data: dbSimulations } = await supabase
      .from("simulation_runs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (dbSimulations) {
      savedSimulations = dbSimulations.map((s) => ({
        id: s.id,
        simulation_type: s.simulation_type,
        input_parameters: s.input_parameters as Record<string, unknown>,
        projection_days: s.projection_days ?? null,
        calculated_kwh_saving: Number(s.calculated_kwh_saving),
        calculated_money_saving:
          s.calculated_money_saving !== null && s.calculated_money_saving !== undefined
            ? Number(s.calculated_money_saving)
            : null,
        calculated_co2_saving_kg:
          s.calculated_co2_saving_kg !== null && s.calculated_co2_saving_kg !== undefined
            ? Number(s.calculated_co2_saving_kg)
            : null,
        created_at: s.created_at,
      }));
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
        baseline={baseline}
        savedSimulations={savedSimulations}
      />
    </div>
  );
}

