import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight, Sparkles } from "lucide-react";

interface RecommendedNextStepProps {
  topAction?: {
    id: string;
    title: string;
    description: string;
    estimatedKwhAnnual: number;
    estimatedCostSaving: number;
    currency?: string;
  };
}

export function RecommendedNextStep({ topAction }: RecommendedNextStepProps) {
  if (!topAction) {
    return null;
  }

  return (
    <div className="rounded-2xl border-2 border-[#0B7252]/20 dark:border-[#10B981]/30 bg-gradient-to-br from-[#EAF5EE] to-[#F3F8F3] dark:from-[#063D2E]/60 dark:to-[#0B251E]/90 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="primary" className="gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Recommended Next Step
            </Badge>
            <span className="text-xs font-bold text-[#075E45] dark:text-[#34D399]">
              Save ~{topAction.currency || "$"}
              {topAction.estimatedCostSaving.toFixed(0)} / year
            </span>
          </div>

          <h3 className="text-lg font-extrabold text-[#111827] dark:text-[#F9FAFB]">
            {topAction.title}
          </h3>

          <p className="text-xs sm:text-sm text-[#344054] dark:text-[#D1D5DB] max-w-2xl leading-relaxed">
            {topAction.description} Modeled annual energy reduction:{" "}
            <strong className="text-[#111827] dark:text-[#F9FAFB]">{topAction.estimatedKwhAnnual.toFixed(0)} kWh</strong>.
          </p>
        </div>

        <div className="shrink-0">
          <Link href="/plan">
            <Button
              variant="primary"
              size="md"
              className="w-full sm:w-auto shadow-sm"
              rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
            >
              View in My Plan
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
