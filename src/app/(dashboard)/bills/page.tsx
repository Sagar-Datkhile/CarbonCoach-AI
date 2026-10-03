import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { MetricCard } from "@/components/ui/MetricCard";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency, formatKwh, formatEmissions } from "@/lib/utils";
import { DeleteBillButton } from "@/components/bills/DeleteBillButton";
import {
  Plus,
  Receipt,
  Zap,
  DollarSign,
  Leaf,
  Calendar,
} from "lucide-react";

export const metadata = {
  title: "Electricity Bills — Carbon Coach AI",
};

export const dynamic = "force-dynamic";

export default async function BillsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let bills: Array<{
    id: string;
    provider_name: string;
    consumer_number: string | null;
    bill_number: string | null;
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
    const { data } = await supabase
      .from("electricity_bills")
      .select("*")
      .eq("user_id", user.id)
      .order("billing_period_start", { ascending: false });

    if (data) {
      bills = data;
    }
  }

  // Calculate totals from real confirmed bills
  const totalKwh = bills.reduce((acc, b) => acc + Number(b.energy_consumed_kwh), 0);
  const totalCost = bills.reduce((acc, b) => acc + Number(b.bill_amount), 0);
  const totalEmissions = bills.reduce(
    (acc, b) => acc + (Number(b.estimated_emissions_kg) || 0),
    0
  );
  const defaultCurrency = bills[0]?.currency || "USD";

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#111827]">
            Electricity Bills
          </h1>
          <p className="text-sm text-[#667085] mt-1">
            Authoritative statement history, consumption records, and verified emissions.
          </p>
        </div>

        <Link href="/bills/add">
          <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
            Add Bill
          </Button>
        </Link>
      </div>

      {bills.length === 0 ? (
        <EmptyState
          title="No confirmed electricity bills yet"
          description="Upload your first utility statement to automatically extract metrics, calculate emissions, and unlock personalized energy-saving recommendations."
          actionLabel="Upload First Bill"
          actionHref="/bills/add"
          icon={<Receipt className="w-7 h-7" />}
        />
      ) : (
        <>
          {/* Summary KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Confirmed Statements"
              value={bills.length}
              subtitle="Authoritative records"
              icon={<Receipt className="w-5 h-5" />}
            />
            <MetricCard
              title="Total Energy Billed"
              value={formatKwh(totalKwh)}
              unit="kWh"
              subtitle="Cumulative electricity"
              icon={<Zap className="w-5 h-5" />}
            />
            <MetricCard
              title="Total Billed Cost"
              value={formatCurrency(totalCost, defaultCurrency)}
              subtitle="All billing cycles"
              icon={<DollarSign className="w-5 h-5" />}
            />
            <MetricCard
              title="Estimated Carbon"
              value={formatEmissions(totalEmissions)}
              subtitle="Grid carbon footprint"
              icon={<Leaf className="w-5 h-5" />}
            />
          </div>

          {/* Detailed Bills Table */}
          <Card elevated>
            <CardHeader className="pb-3 border-b border-[#F3F8F3] dark:border-[#222F3E]">
              <CardTitle className="text-lg text-[#111827] dark:text-[#F9FAFB]">Statement History</CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#FAFBF8] dark:bg-[#0E1522] border-b border-[#E3E7E3] dark:border-[#222F3E] text-[#667085] dark:text-[#9CA3AF] text-xs uppercase font-semibold">
                  <tr>
                    <th className="px-5 py-3.5">Provider / Account</th>
                    <th className="px-5 py-3.5">Billing Period</th>
                    <th className="px-5 py-3.5 text-right">Energy (kWh)</th>
                    <th className="px-5 py-3.5 text-right">Daily Avg</th>
                    <th className="px-5 py-3.5 text-right">Amount</th>
                    <th className="px-5 py-3.5 text-right">Emissions</th>
                    <th className="px-5 py-3.5 text-center">Status</th>
                    <th className="px-5 py-3.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3E7E3] dark:divide-[#222F3E]">
                  {bills.map((bill) => {
                    const days = bill.billing_days || 30;
                    const dailyAvg = (bill.energy_consumed_kwh / days).toFixed(1);

                    return (
                      <tr
                        key={bill.id}
                        className="hover:bg-[#FAFBF8]/70 dark:hover:bg-[#1A2436]/60 transition-colors"
                      >
                        <td className="px-5 py-4 font-semibold text-[#111827] dark:text-[#F9FAFB]">
                          <div>{bill.provider_name}</div>
                          {bill.consumer_number && (
                            <div className="text-xs text-[#667085] dark:text-[#9CA3AF] font-normal">
                              Acct: {bill.consumer_number}
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-4 text-[#667085] dark:text-[#9CA3AF]">
                          <div className="flex items-center gap-1.5 text-xs text-[#111827] dark:text-[#F9FAFB] font-medium">
                            <Calendar className="w-3.5 h-3.5 text-[#667085] dark:text-[#9CA3AF]" />
                            {bill.billing_period_start} → {bill.billing_period_end}
                          </div>
                          <div className="text-xs text-[#667085] dark:text-[#9CA3AF] mt-0.5">
                            {days} days
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right font-bold text-[#111827] dark:text-[#F9FAFB] tabular-nums">
                          {formatKwh(bill.energy_consumed_kwh)} kWh
                        </td>
                        <td className="px-5 py-4 text-right text-xs font-semibold text-[#667085] dark:text-[#9CA3AF] tabular-nums">
                          {dailyAvg} kWh/d
                        </td>
                        <td className="px-5 py-4 text-right font-extrabold text-[#075E45] dark:text-[#34D399] tabular-nums">
                          {formatCurrency(bill.bill_amount, bill.currency)}
                        </td>
                        <td className="px-5 py-4 text-right text-xs text-[#667085] dark:text-[#9CA3AF] tabular-nums">
                          {bill.estimated_emissions_kg
                            ? `${bill.estimated_emissions_kg} kg`
                            : "—"}
                        </td>
                        <td className="px-5 py-4 text-center">
                          <Badge variant="success">Confirmed</Badge>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <DeleteBillButton
                            billId={bill.id}
                            providerName={bill.provider_name}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
