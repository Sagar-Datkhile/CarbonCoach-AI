import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { MetricCard } from "@/components/ui/MetricCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { formatCurrency, formatKwh, formatEmissions } from "@/lib/utils";
import {
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Receipt,
  AlertTriangle,
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

  // 1. Fetch User Actions
  let userActions: Array<{
    id: string;
    custom_title: string | null;
    status: string;
    estimated_kwh_saving: number;
    estimated_cost_saving: number;
    estimated_co2_saving: number;
    completed_at: string | null;
  }> = [];

  if (user) {
    const { data: dbActions } = await supabase
      .from("user_actions")
      .select("*")
      .eq("user_id", user.id);

    if (dbActions) {
      userActions = dbActions;
    }
  }

  // 2. Fetch Confirmed Bills for Observed Delta
  let bills: Array<{
    id: string;
    billing_period_start: string;
    billing_period_end: string;
    billing_days: number;
    energy_consumed_kwh: number;
    bill_amount: number;
    currency: string;
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

  const plannedActions = userActions.filter((a) => a.status === "planned");
  const completedActions = userActions.filter((a) => a.status === "completed");

  const totalPlannedKwh = plannedActions.reduce(
    (acc, a) => acc + Number(a.estimated_kwh_saving || 0),
    0
  );
  const totalCompletedKwh = completedActions.reduce(
    (acc, a) => acc + Number(a.estimated_kwh_saving || 0),
    0
  );

  // Calculate observed change if >= 2 bills exist
  let observedDeltaKwh: number | null = null;
  let observedPercentChange: number | null = null;

  if (bills.length >= 2) {
    const latest = bills[0];
    const previous = bills[1];
    observedDeltaKwh = latest.energy_consumed_kwh - previous.energy_consumed_kwh;
    if (previous.energy_consumed_kwh > 0) {
      observedPercentChange = Math.round(
        (observedDeltaKwh / previous.energy_consumed_kwh) * 100
      );
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
          <strong>Methodological Separation:</strong> Completing an action represents user-reported behavioral effort. Real-world verified savings are only established when confirmed across consecutive utility bills.
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
              {formatKwh(totalPlannedKwh + totalCompletedKwh)} kWh / yr
            </CardTitle>
            <CardDescription>
              Potential reduction from all {userActions.length} planned & completed items.
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
              Representing ~{formatKwh(totalCompletedKwh)} kWh / yr of self-reported changes.
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
              <Badge variant={observedDeltaKwh !== null && observedDeltaKwh <= 0 ? "success" : "neutral"}>
                {bills.length >= 2 ? "Measured" : "Pending Baseline"}
              </Badge>
            </div>
            <CardTitle className="text-2xl tabular-nums text-[#111827] mt-2">
              {observedDeltaKwh !== null ? (
                <>
                  {observedDeltaKwh <= 0 ? "-" : "+"}
                  {formatKwh(Math.abs(observedDeltaKwh))} kWh
                </>
              ) : (
                "Awaiting 2nd Bill"
              )}
            </CardTitle>
            <CardDescription>
              {bills.length >= 2
                ? `Measured variance vs previous statement (${observedPercentChange}%).`
                : "Requires at least two confirmed billing statements."}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Completed Actions History Table */}
      <Card elevated>
        <CardHeader className="pb-3 border-b border-[#F3F8F3]">
          <CardTitle className="text-lg">User-Reported Action Log</CardTitle>
          <CardDescription>
            Audit log of energy-saving actions you have marked as implemented
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          {completedActions.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#667085]">
              No actions marked completed yet. Explore{" "}
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
                  <th className="px-5 py-3.5 text-right">Modeled Saving</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                  <th className="px-5 py-3.5 text-right">Completed Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E7E3]">
                {completedActions.map((action) => (
                  <tr key={action.id} className="hover:bg-[#FAFBF8]/70">
                    <td className="px-5 py-3.5 font-semibold text-[#111827]">
                      {action.custom_title || "Household Energy Action"}
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-[#075E45] tabular-nums">
                      {formatKwh(action.estimated_kwh_saving)} kWh / yr
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <Badge variant="success">Completed</Badge>
                    </td>
                    <td className="px-5 py-3.5 text-right text-xs text-[#667085]">
                      {action.completed_at
                        ? new Date(action.completed_at).toLocaleDateString()
                        : "Self-Reported"}
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
