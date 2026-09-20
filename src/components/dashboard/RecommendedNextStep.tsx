import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Zap, ArrowRight, Sparkles } from "lucide-react";

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
    <div className="rounded-2xl border-2 border-[#0B7252]/20 bg-gradient-to-br from-[#EAF5EE] to-[#F3F8F3] p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="primary" className="gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Recommended Next Step
            </Badge>
            <span className="text-xs font-bold text-[#075E45]">
              Save ~{topAction.currency || "$"}
              {topAction.estimatedCostSaving.toFixed(0)} / year
            </span>
          </div>

          <h3 className="text-lg font-extrabold text-[#111827]">
            {topAction.title}
          </h3>

          <p className="text-xs sm:text-sm text-[#344054] max-w-2xl leading-relaxed">
            {topAction.description} Modeled annual energy reduction:{" "}
            <strong>{topAction.estimatedKwhAnnual.toFixed(0)} kWh</strong>.
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
