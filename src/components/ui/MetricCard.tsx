import React from "react";
import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

export interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number; // percentage, negative is usually good for energy/emissions
    label: string;
    isPositiveGood?: boolean; // false by default for carbon/energy
  };
  className?: string;
}

export function MetricCard({
  title,
  value,
  unit,
  subtitle,
  icon,
  trend,
  className,
}: MetricCardProps) {
  const renderTrend = () => {
    if (!trend) return null;

    const isDecreasing = trend.value < 0;
    const isNeutral = trend.value === 0;
    const isGood = trend.isPositiveGood ? trend.value > 0 : isDecreasing;

    const colorClass = isNeutral
      ? "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
      : isGood
      ? "bg-[#EAF5EE] dark:bg-[#063D2E] text-[#075E45] dark:text-[#34D399]"
      : "bg-[#FFF7E8] dark:bg-[#2E2305] text-[#9A5B00] dark:text-[#FBBF24]";

    return (
      <div
        className={cn(
          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold tabular-nums",
          colorClass
        )}
      >
        {isNeutral ? (
          <Minus className="w-3 h-3" />
        ) : isDecreasing ? (
          <ArrowDownRight className="w-3.5 h-3.5" />
        ) : (
          <ArrowUpRight className="w-3.5 h-3.5" />
        )}
        <span>
          {Math.abs(trend.value)}% {trend.label}
        </span>
      </div>
    );
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-[#E3E7E3] dark:border-[#222F3E] bg-white dark:bg-[#151D2A] p-5 md:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between transition-all hover:border-[#0B7252]/30 dark:hover:border-[#10B981]/30",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="text-xs md:text-sm font-semibold text-[#667085] dark:text-[#9CA3AF] tracking-wide uppercase">
          {title}
        </span>
        {icon && (
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#EAF5EE] dark:bg-[#063D2E] text-[#0B7252] dark:text-[#34D399] shrink-0">
            {icon}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#111827] dark:text-[#F9FAFB] tabular-nums">
            {value}
          </span>
          {unit && (
            <span className="text-sm font-semibold text-[#667085] dark:text-[#9CA3AF]">{unit}</span>
          )}
        </div>

        {(subtitle || trend) && (
          <div className="mt-3 flex items-center justify-between gap-2 flex-wrap pt-2 border-t border-[#F3F8F3] dark:border-[#222F3E]">
            {subtitle && (
              <span className="text-xs text-[#667085] dark:text-[#9CA3AF] truncate">{subtitle}</span>
            )}
            {renderTrend()}
          </div>
        )}
      </div>
    </div>
  );
}
