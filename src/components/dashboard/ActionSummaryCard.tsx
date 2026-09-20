import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { formatKwh } from "@/lib/utils";

interface ActionSummaryProps {
  plannedCount: number;
  completedCount: number;
  totalModeledSavingKwh: number;
}

export function ActionSummaryCard({
  plannedCount,
  completedCount,
  totalModeledSavingKwh,
}: ActionSummaryProps) {
  const total = plannedCount + completedCount;
  const percentComplete = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  return (
    <Card elevated>
      <CardHeader className="pb-3 border-b border-[#F3F8F3] flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#EAF5EE] text-[#075E45] flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-base">My Plan Progress</CardTitle>
            <span className="text-xs text-[#667085]">Behavioral & Equipment Upgrades</span>
          </div>
        </div>
        <Link
          href="/plan"
          className="text-xs font-semibold text-[#0B7252] hover:text-[#075E45] inline-flex items-center gap-1"
        >
          Manage Plan
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-3 rounded-xl bg-[#FAFBF8] border border-[#E3E7E3]">
            <span className="text-xs font-semibold text-[#667085] block">
              Planned
            </span>
            <span className="text-2xl font-extrabold text-[#111827] mt-0.5 block">
              {plannedCount}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#EAF5EE] border border-[#0B7252]/20">
            <span className="text-xs font-semibold text-[#075E45] block">
              Completed
            </span>
            <span className="text-2xl font-extrabold text-[#075E45] mt-0.5 block">
              {completedCount}
            </span>
          </div>
        </div>

        {/* Completion Progress Bar */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5 font-semibold">
            <span className="text-[#667085]">Action Completion</span>
            <span className="text-[#111827]">{percentComplete}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full bg-[#0B7252] rounded-full transition-all duration-500"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
        </div>

        {/* Modeled Savings Note */}
        <div className="pt-2 border-t border-[#F3F8F3] flex items-center justify-between text-xs">
          <span className="text-[#667085]">Modeled Potential:</span>
          <span className="font-bold text-[#075E45] tabular-nums">
            {formatKwh(totalModeledSavingKwh)} kWh / yr
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
