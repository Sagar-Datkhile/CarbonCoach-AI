import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { MetricCard } from "@/components/ui/MetricCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { RecommendedNextStep } from "@/components/dashboard/RecommendedNextStep";
import { ActionSummaryCard } from "@/components/dashboard/ActionSummaryCard";
import { BillComparisonCard } from "@/components/dashboard/BillComparisonCard";
import { HouseholdSnapshotCard } from "@/components/dashboard/HouseholdSnapshotCard";
import { formatCurrency, formatKwh, formatEmissions } from "@/lib/utils";
import {
  Zap,
  DollarSign,
  Leaf,
  Calendar,
  Plus,
  Receipt,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "Dashboard — CarbonCoach AI",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Fetch Household Profile
  let household = {
    householdName: "My Household",
    homeType: "Owned",
    occupantsCount: 2,
    region: "Global",
    budgetTier: "Moderate",
    preferredCurrency: "USD",
  };

  if (user) {
    const { data: dbHousehold } = await supabase
      .from("household_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (dbHousehold) {
      household = {
        householdName: dbHousehold.household_name || household.householdName,
        homeType: dbHousehold.home_type || household.homeType,
        occupantsCount: dbHousehold.occupants_count || 2,
        region: dbHousehold.region || "Global",
        budgetTier: dbHousehold.budget_tier || "Moderate",
        preferredCurrency: dbHousehold.preferred_currency || "USD",
      };
    }
  }

  // 2. Fetch Confirmed Electricity Bills
  let bills: Array<{
    id: string;
    provider_name: string;
    billing_period_start: string;
    billing_period_end: string;
    billing_days: number;
    energy_consumed_kwh: number;
    bill_amount: number;
    currency: string;
    estimated_emissions_kg: number | null;
    status: string;
    created_at: string;
  }> = [];

  if (user) {
    const { data: dbBills } = await supabase
      .from("electricity_bills")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "confirmed")
      .order("billing_period_start", { ascending: false });

    if (dbBills) {
      bills = dbBills;
    }
  }

  // 3. Fetch User Actions (My Plan)
  let userActions: Array<{
    id: string;
    status: string;
    estimated_kwh_saving: number;
    estimated_cost_saving: number;
  }> = [];

  if (user) {
    const { data: dbActions } = await supabase
      .from("user_actions")
      .select("id, status, estimated_kwh_saving, estimated_cost_saving")
      .eq("user_id", user.id);

    if (dbActions) {
      userActions = dbActions;
    }
  }

  const plannedActions = userActions.filter((a) => a.status === "planned");
  const completedActions = userActions.filter((a) => a.status === "completed");
  const totalModeledSaving = userActions.reduce(
    (acc, a) => acc + Number(a.estimated_kwh_saving || 0),
    0
  );

  // 4. Determine Dynamic Recommended Next Step
  const defaultRecommendedAction = {
    id: "rec-1",
    title: "Switch High-Use Fixtures to 9W LEDs",
    description:
      "Replace five standard incandescent bulbs used ~4 hours daily with high-efficiency LEDs.",
    estimatedKwhAnnual: 372,
    estimatedCostSaving: 61,
    currency: household.preferredCurrency === "INR" ? "₹" : "$",
  };

  // If user has zero confirmed bills: display genuine Empty State (NO fake 320 kWh numbers)
  if (bills.length === 0) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#111827]">
              Household Dashboard
            </h1>
            <p className="text-sm text-[#667085] mt-1">
              Welcome, {household.householdName}. Your electricity insights hub.
            </p>
          </div>

          <Link href="/bills/add">
            <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
              Add First Bill
            </Button>
          </Link>
        </div>

        <EmptyState
          title="No confirmed electricity statements yet"
          description="Upload your first utility bill statement to automatically calculate your energy consumption, daily averages, and carbon intensity. Never based on fake or illustrative placeholders."
          actionLabel="Upload Your First Bill"
          actionHref="/bills/add"
          icon={<Receipt className="w-8 h-8 text-[#0B7252]" />}
        />

        <div className="max-w-xl mx-auto">
          <HouseholdSnapshotCard household={household} />
        </div>
      </div>
    );
  }

  // Authoritative metrics from confirmed bills
  const latestBill = bills[0];
  const days = latestBill.billing_days || 30;
  const dailyAverageKwh = (latestBill.energy_consumed_kwh / days).toFixed(1);

  // Calculate trend if >= 2 bills exist
  let usageTrend: { value: number; label: string } | undefined = undefined;
  if (bills.length >= 2) {
    const prevBill = bills[1];
    if (prevBill.energy_consumed_kwh > 0) {
      const deltaPercent = Math.round(
        ((latestBill.energy_consumed_kwh - prevBill.energy_consumed_kwh) /
          prevBill.energy_consumed_kwh) *
          100
      );
      usageTrend = {
        value: deltaPercent,
        label: "vs last cycle",
      };
    }
  }

  return (
    <div className="space-y-8">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#111827]">
            Household Dashboard
          </h1>
          <p className="text-sm text-[#667085] mt-1">
            Authoritative energy metrics for <strong>{household.householdName}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/bills/add">
            <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
              Upload Bill
            </Button>
          </Link>
        </div>
      </div>

      {/* Recommended Next Step Banner */}
      <RecommendedNextStep topAction={defaultRecommendedAction} />

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Latest Electricity Usage"
          value={formatKwh(latestBill.energy_consumed_kwh)}
          unit="kWh"
          subtitle={`${days} days billing cycle`}
          trend={usageTrend}
          icon={<Zap className="w-5 h-5" />}
        />

        <MetricCard
          title="Daily Average Usage"
          value={dailyAverageKwh}
          unit="kWh / day"
          subtitle="Consumption velocity"
          icon={<Calendar className="w-5 h-5" />}
        />

        <MetricCard
          title="Estimated Emissions"
          value={
            latestBill.estimated_emissions_kg
              ? `${latestBill.estimated_emissions_kg}`
              : "—"
          }
          unit="kg CO₂e"
          subtitle="Regional grid intensity"
          icon={<Leaf className="w-5 h-5" />}
        />

        <MetricCard
          title="Latest Bill Amount"
          value={formatCurrency(latestBill.bill_amount, latestBill.currency)}
          subtitle={latestBill.provider_name}
          icon={<DollarSign className="w-5 h-5" />}
        />
      </div>

      {/* Secondary Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Col 1: Action Progress */}
        <ActionSummaryCard
          plannedCount={plannedActions.length}
          completedCount={completedActions.length}
          totalModeledSavingKwh={totalModeledSaving}
        />

        {/* Col 2: Observed Bill Comparison */}
        <BillComparisonCard bills={bills} />

        {/* Col 3: Household Snapshot */}
        <HouseholdSnapshotCard household={household} />
      </div>
    </div>
  );
}
