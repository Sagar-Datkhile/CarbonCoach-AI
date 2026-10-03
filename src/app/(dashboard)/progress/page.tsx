import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatKwh, formatEmissions } from "@/lib/utils";
import {
  ArrowRight,
  Info,
} from "lucide-react";

export const metadata = {
  title: "Progress & Impact — CarbonCoach AI",
};

export default async function ProgressPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let preferredCurrency = "INR";
  let emissionFactor = 0.71;

  // 1. Fetch User Actions
  let userActions: Array<{
    id: string;
    title: string | null;
    description: string | null;
    status: string;
    estimated_kwh_saving: number;
    estimated_money_saving: number | null;
    estimated_co2_saving_kg: number | null;
    completed_at: string | null;
    created_at: string;
  }> = [];

  // 2. Fetch Confirmed Bills for Observed Delta
  let bills: Array<{
    id: string;
    billing_period_start: string;
    billing_period_end: string;
    billing_days: number;
    energy_consumed_kwh: number;
    bill_amount: number;
    currency: string;
    estimated_emissions_kg: number | null;
  }> = [];

  // 3. Fetch Saved Simulations
  let simulationsCount = 0;

  if (user) {
    // Household & preferences
    const { data: dbHousehold } = await supabase
      .from("households")
      .select("id, region_code")
      .eq("user_id", user.id)
      .maybeSingle();

    const { data: userPref } = await supabase
      .from("user_preferences")
      .select("preferred_currency")
      .eq("user_id", user.id)
      .maybeSingle();

    if (userPref?.preferred_currency) {
      preferredCurrency = userPref.preferred_currency;
    }

    // Grid emission factor
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
      emissionFactor = Number(efData.factor_kg_co2e_per_kwh);
    } else {
      emissionFactor = preferredCurrency === "INR" ? 0.71 : preferredCurrency === "EUR" ? 0.23 : 0.386;
    }

    // Real User Actions
    const { data: dbActions } = await supabase
      .from("user_actions")
      .select(
        "id, title, description, status, estimated_kwh_saving, estimated_money_saving, estimated_co2_saving_kg, completed_at, created_at"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (dbActions) {
      userActions = dbActions.map((a) => ({
        id: a.id,
        title: a.title ?? null,
        description: a.description ?? null,
        status: a.status,
        estimated_kwh_saving: Number(a.estimated_kwh_saving || 0),
        estimated_money_saving: a.estimated_money_saving !== null && a.estimated_money_saving !== undefined ? Number(a.estimated_money_saving) : null,
        estimated_co2_saving_kg: a.estimated_co2_saving_kg !== null && a.estimated_co2_saving_kg !== undefined ? Number(a.estimated_co2_saving_kg) : null,
        completed_at: a.completed_at,
        created_at: a.created_at,
      }));
    }

    // Confirmed Electricity Bills
    const { data: dbBills } = await supabase
      .from("electricity_bills")
      .select(
        "id, billing_period_start, billing_period_end, billing_days, energy_consumed_kwh, bill_amount, currency, estimated_emissions_kg"
      )
      .eq("user_id", user.id)
      .eq("status", "confirmed")
      .order("billing_period_start", { ascending: false });

    if (dbBills) {
      bills = dbBills.map((b) => ({
        id: b.id,
        billing_period_start: b.billing_period_start,
        billing_period_end: b.billing_period_end,
        billing_days: Number(b.billing_days || 30),
        energy_consumed_kwh: Number(b.energy_consumed_kwh || 0),
        bill_amount: Number(b.bill_amount || 0),
        currency: b.currency || preferredCurrency,
        estimated_emissions_kg: b.estimated_emissions_kg ? Number(b.estimated_emissions_kg) : null,
      }));
      if (bills.length > 0 && bills[0].currency) {
        preferredCurrency = bills[0].currency;
      }
    }

    // Simulations count
    const { count } = await supabase
      .from("simulation_runs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);

    simulationsCount = count || 0;
  }

  // Segment user actions
  const plannedActions = userActions.filter((a) => a.status === "planned");
  const inProgressActions = userActions.filter((a) => a.status === "in_progress");
  const completedActions = userActions.filter((a) => a.status === "completed");

  const totalPlannedKwh = plannedActions.reduce((acc, a) => acc + a.estimated_kwh_saving, 0);
  const totalInProgressKwh = inProgressActions.reduce((acc, a) => acc + a.estimated_kwh_saving, 0);
  const totalCompletedKwh = completedActions.reduce((acc, a) => acc + a.estimated_kwh_saving, 0);
  const totalModeledKwh = totalPlannedKwh + totalInProgressKwh + totalCompletedKwh;

  const totalModeledMoney = userActions.reduce((acc, a) => acc + (a.estimated_money_saving || 0), 0);
  const totalCompletedMoney = completedActions.reduce((acc, a) => acc + (a.estimated_money_saving || 0), 0);

  const totalModeledCo2 = userActions.reduce((acc, a) => acc + (a.estimated_co2_saving_kg || 0), 0);
  const totalCompletedCo2 = completedActions.reduce((acc, a) => acc + (a.estimated_co2_saving_kg || 0), 0);

  // Map bills with deterministic emission factor
  const billsWithMetrics = bills.map((b) => {
    const emissionsKg =
      b.estimated_emissions_kg !== null
        ? b.estimated_emissions_kg
        : Number((b.energy_consumed_kwh * emissionFactor).toFixed(2));
    return {
      ...b,
      emissionsKg,
    };
  });

  // Calculate observed change between latest 2 confirmed bills
  let observedDeltaKwh: number | null = null;
  let observedDeltaCost: number | null = null;
  let observedDeltaEmissions: number | null = null;
  let observedPercentChange: number | null = null;

  if (billsWithMetrics.length >= 2) {
    const latest = billsWithMetrics[0];
    const previous = billsWithMetrics[1];
    observedDeltaKwh = Number((latest.energy_consumed_kwh - previous.energy_consumed_kwh).toFixed(2));
    observedDeltaCost = Number((latest.bill_amount - previous.bill_amount).toFixed(2));
    observedDeltaEmissions = Number((latest.emissionsKg - previous.emissionsKg).toFixed(2));

    if (previous.energy_consumed_kwh > 0) {
      observedPercentChange = Math.round((observedDeltaKwh / previous.energy_consumed_kwh) * 100);
    }
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#111827]">
            Progress & Impact Verification
          </h1>
          <p className="text-sm text-[#667085] mt-1">
            Tri-partite separation between modeled projections, user habits, and observed utility data.
          </p>
        </div>

        <Link href="/plan">
          <Button variant="outline" size="md" rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}>
            Explore Actions
          </Button>
        </Link>
      </div>

      {/* Governance Rule Banner */}
      <div className="p-4 rounded-xl bg-[#F3F8F3] border border-[#0B7252]/30 flex items-start gap-3">
        <Info className="w-5 h-5 text-[#0B7252] shrink-0 mt-0.5" />
        <div className="text-xs text-[#075E45] leading-relaxed">
          <strong>Methodological Separation:</strong> Completing an action represents user-reported behavioral effort. Real-world verified savings are only established when confirmed across consecutive utility bills using deterministic formula calculation.
        </div>
      </div>

      {/* Tri-Partite Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tier 1: Modeled / Estimated Potential */}
        <Card elevated className="border-t-4 border-t-[#075E45]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#075E45]">
                Tier 1: Modeled Potential
              </span>
              <Badge variant="neutral">Theoretical</Badge>
            </div>
            <CardTitle className="text-2xl tabular-nums text-[#111827] mt-2">
              {formatKwh(totalModeledKwh)} kWh / yr
            </CardTitle>
            <CardDescription>
              Potential reduction from all {userActions.length} planned & completed items ({formatCurrency(totalModeledMoney, preferredCurrency)}/yr, {formatEmissions(totalModeledCo2)}).
              {simulationsCount > 0 && ` (${simulationsCount} what-if simulations logged)`}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Tier 2: User-Reported Completed Actions */}
        <Card elevated className="border-t-4 border-t-[#0B7252]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0B7252]">
                Tier 2: User-Reported
              </span>
              <Badge variant="success">Completed</Badge>
            </div>
            <CardTitle className="text-2xl tabular-nums text-[#075E45] mt-2">
              {completedActions.length} Actions Done
            </CardTitle>
            <CardDescription>
              {inProgressActions.length > 0 && `${inProgressActions.length} in progress. `}
              Representing ~{formatKwh(totalCompletedKwh)} kWh / yr ({formatCurrency(totalCompletedMoney, preferredCurrency)}/yr, {formatEmissions(totalCompletedCo2)}) of self-reported changes.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Tier 3: Observed Change from Bills */}
        <Card elevated className="border-t-4 border-t-[#9A5B00]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#9A5B00]">
                Tier 3: Observed Change
              </span>
              <Badge
                variant={
                  observedDeltaKwh !== null
                    ? observedDeltaKwh <= 0
                      ? "success"
                      : "warning"
                    : bills.length === 1
                    ? "neutral"
                    : "neutral"
                }
              >
                {bills.length >= 2
                  ? observedDeltaKwh !== null && observedDeltaKwh <= 0
                    ? `${Math.abs(observedPercentChange || 0)}% Reduced`
                    : `+${observedPercentChange || 0}% Increased`
                  : bills.length === 1
                  ? "Baseline Established"
                  : "No Confirmed Bills"}
              </Badge>
            </div>
            <CardTitle className="text-2xl tabular-nums text-[#111827] mt-2">
              {observedDeltaKwh !== null ? (
                <>
                  {observedDeltaKwh <= 0 ? "-" : "+"}
                  {formatKwh(Math.abs(observedDeltaKwh))} kWh
                </>
              ) : bills.length === 1 ? (
                "Awaiting 2nd Bill"
              ) : (
                "No Statement"
              )}
            </CardTitle>
            <CardDescription>
              {bills.length >= 2 ? (
                <>
                  Cycle variance vs previous statement. Cost:{" "}
                  {observedDeltaCost !== null && (observedDeltaCost <= 0 ? "-" : "+")}
                  {formatCurrency(Math.abs(observedDeltaCost || 0), preferredCurrency)}
                  {observedDeltaEmissions !== null && (
                    <>
                      , Carbon: {observedDeltaEmissions <= 0 ? "-" : "+"}
                      {formatEmissions(Math.abs(observedDeltaEmissions))}
                    </>
                  )}.
                </>
              ) : bills.length === 1 ? (
                `1 confirmed statement (${bills[0].billing_period_start}). Upload next statement to compute verified trends.`
              ) : (
                "Upload and confirm utility statements in Bills to benchmark actual consumption."
              )}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Confirmed Statement History & Trends */}
      {billsWithMetrics.length > 0 && (
        <Card elevated>
          <CardHeader className="pb-3 border-b border-[#F3F8F3]">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Confirmed Billing Statement Trends</CardTitle>
                <CardDescription>
                  Empirical utility data from your confirmed statements with emission factor calculation ({emissionFactor} kg CO₂e/kWh)
                </CardDescription>
              </div>
              <Badge variant="neutral">{billsWithMetrics.length} Statements</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAFBF8] border-b border-[#E3E7E3] text-[#667085] text-xs uppercase font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Statement Cycle</th>
                  <th className="px-5 py-3.5 text-center">Days</th>
                  <th className="px-5 py-3.5 text-right">Energy Consumed</th>
                  <th className="px-5 py-3.5 text-right">Statement Cost</th>
                  <th className="px-5 py-3.5 text-right">Grid Emissions</th>
                  <th className="px-5 py-3.5 text-right">Cycle Variance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E7E3]">
                {billsWithMetrics.map((b, idx) => {
                  const prevBill = idx + 1 < billsWithMetrics.length ? billsWithMetrics[idx + 1] : null;
                  let deltaText: React.ReactNode = (
                    <span className="text-xs text-[#667085]">Baseline</span>
                  );

                  if (prevBill && prevBill.energy_consumed_kwh > 0) {
                    const dKwh = b.energy_consumed_kwh - prevBill.energy_consumed_kwh;
                    const pct = Math.round((dKwh / prevBill.energy_consumed_kwh) * 100);
                    const isLower = dKwh < 0;
                    const isSame = dKwh === 0;

                    deltaText = (
                      <span
                        className={`text-xs font-bold tabular-nums ${
                          isLower
                            ? "text-[#075E45]"
                            : isSame
                            ? "text-gray-500"
                            : "text-[#9A5B00]"
                        }`}
                      >
                        {isLower ? "-" : isSame ? "" : "+"}
                        {formatKwh(Math.abs(dKwh))} kWh ({pct}%)
                      </span>
                    );
                  }

                  return (
                    <tr key={b.id} className="hover:bg-[#FAFBF8]/70">
                      <td className="px-5 py-3.5 font-semibold text-[#111827]">
                        {b.billing_period_start} → {b.billing_period_end}
                      </td>
                      <td className="px-5 py-3.5 text-center text-xs text-[#667085]">
                        {b.billing_days}d
                      </td>
                      <td className="px-5 py-3.5 text-right font-bold text-[#111827] tabular-nums">
                        {formatKwh(b.energy_consumed_kwh)} kWh
                      </td>
                      <td className="px-5 py-3.5 text-right font-semibold text-[#111827] tabular-nums">
                        {formatCurrency(b.bill_amount, b.currency)}
                      </td>
                      <td className="px-5 py-3.5 text-right text-xs text-[#0B7252] font-semibold tabular-nums">
                        {formatEmissions(b.emissionsKg)}
                      </td>
                      <td className="px-5 py-3.5 text-right">{deltaText}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* User-Reported Action Log Table */}
      <Card elevated>
        <CardHeader className="pb-3 border-b border-[#F3F8F3]">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">User-Reported Action Log</CardTitle>
              <CardDescription>
                Audit log of energy-saving actions you have planned, active, or implemented
              </CardDescription>
            </div>
            <Badge variant="neutral">{userActions.length} Actions</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          {userActions.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#667085]">
              No energy actions logged yet. Explore{" "}
              <Link href="/plan" className="text-[#0B7252] font-semibold underline">
                My Plan
              </Link>{" "}
              to implement energy-saving recommendations.
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAFBF8] border-b border-[#E3E7E3] text-[#667085] text-xs uppercase font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Action Title</th>
                  <th className="px-5 py-3.5 text-right">Modeled Energy</th>
                  <th className="px-5 py-3.5 text-right">Modeled Financial</th>
                  <th className="px-5 py-3.5 text-right">Avoided CO₂e</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                  <th className="px-5 py-3.5 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E7E3]">
                {userActions.map((action) => (
                  <tr key={action.id} className="hover:bg-[#FAFBF8]/70">
                    <td className="px-5 py-3.5 font-semibold text-[#111827]">
                      {action.title || "Household Energy Action"}
                      {action.description && (
                        <span className="block text-xs font-normal text-[#667085] line-clamp-1 mt-0.5">
                          {action.description}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-[#075E45] tabular-nums">
                      {formatKwh(action.estimated_kwh_saving)} kWh / yr
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold text-[#111827] tabular-nums">
                      {formatCurrency(action.estimated_money_saving || 0, preferredCurrency)} / yr
                    </td>
                    <td className="px-5 py-3.5 text-right text-xs text-[#0B7252] font-semibold tabular-nums">
                      {formatEmissions(action.estimated_co2_saving_kg || 0)}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <Badge
                        variant={
                          action.status === "completed"
                            ? "success"
                            : action.status === "in_progress"
                            ? "warning"
                            : "neutral"
                        }
                      >
                        {action.status === "completed"
                          ? "Completed"
                          : action.status === "in_progress"
                          ? "In Progress"
                          : "Planned"}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-right text-xs text-[#667085]">
                      {action.completed_at
                        ? new Date(action.completed_at).toLocaleDateString()
                        : new Date(action.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

