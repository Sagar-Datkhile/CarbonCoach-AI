import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { formatKwh } from "@/lib/utils";

interface BillComparisonProps {
  bills: Array<{
    id: string;
    billing_period_start: string;
    billing_period_end: string;
    billing_days: number;
    energy_consumed_kwh: number;
    bill_amount: number;
    currency: string;
  }>;
}

export function BillComparisonCard({ bills }: BillComparisonProps) {
  if (bills.length < 2) {
    return (
      <Card elevated>
        <CardHeader className="pb-3 border-b border-[#F3F8F3] dark:border-[#222F3E]">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base text-[#111827] dark:text-[#F9FAFB]">Observed Trend Status</CardTitle>
            <Badge variant="neutral">Baseline Established</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4 text-xs text-[#667085] dark:text-[#9CA3AF] leading-relaxed space-y-2">
          <p>
            You have <strong className="text-[#111827] dark:text-[#F9FAFB]">1 confirmed statement</strong> in your profile.
          </p>
          <p>
            Upload your next utility statement to unlock direct bill-to-bill variance analysis and verify real-world energy reductions.
          </p>
        </CardContent>
      </Card>
    );
  }

  const latest = bills[0];
  const previous = bills[1];

  const deltaKwh = latest.energy_consumed_kwh - previous.energy_consumed_kwh;
  const percentChange = previous.energy_consumed_kwh > 0
    ? Math.round((deltaKwh / previous.energy_consumed_kwh) * 100)
    : 0;

  const isDecreased = deltaKwh < 0;
  const isZero = deltaKwh === 0;

  return (
    <Card elevated>
      <CardHeader className="pb-3 border-b border-[#F3F8F3] dark:border-[#222F3E] flex flex-row items-center justify-between">
        <CardTitle className="text-base text-[#111827] dark:text-[#F9FAFB]">Observed Bill Comparison</CardTitle>
        <Badge variant={isZero ? "neutral" : isDecreased ? "success" : "warning"}>
          {isZero
            ? "Unchanged"
            : isDecreased
            ? `${Math.abs(percentChange)}% Reduced`
            : `+${percentChange}% Increased`}
        </Badge>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isDecreased
                  ? "bg-[#EAF5EE] dark:bg-[#063D2E] text-[#075E45] dark:text-[#34D399]"
                  : isZero
                  ? "bg-gray-100 dark:bg-[#1E293B] text-gray-600 dark:text-gray-300"
                  : "bg-[#FFF7E8] dark:bg-[#2E2305] text-[#9A5B00] dark:text-[#FBBF24]"
              }`}
            >
              {isDecreased ? (
                <TrendingDown className="w-5 h-5" />
              ) : isZero ? (
                <Minus className="w-5 h-5" />
              ) : (
                <TrendingUp className="w-5 h-5" />
              )}
            </div>

            <div>
              <span className="text-xs text-[#667085] dark:text-[#9CA3AF] block">
                Observed Cycle Change
              </span>
              <span className="text-lg font-bold text-[#111827] dark:text-[#F9FAFB] tabular-nums">
                {isDecreased ? "-" : isZero ? "" : "+"}
                {formatKwh(Math.abs(deltaKwh))} kWh
              </span>
            </div>
          </div>

          <div className="text-right text-xs text-[#667085] dark:text-[#9CA3AF]">
            <div>vs Previous Cycle</div>
            <div className="font-semibold text-[#111827] dark:text-[#F9FAFB] tabular-nums">
              ({formatKwh(previous.energy_consumed_kwh)} kWh)
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#FAFBF8] dark:bg-[#0E1522] border border-[#E3E7E3] dark:border-[#222F3E] text-[11px] text-[#667085] dark:text-[#9CA3AF] leading-relaxed">
          <span className="font-bold text-[#111827] dark:text-[#F9FAFB] block mb-0.5">
            Verified Bill Measurement:
          </span>
          Comparing cycle {latest.billing_period_start} to previous cycle {previous.billing_period_start}.
        </div>
      </CardContent>
    </Card>
  );
}
