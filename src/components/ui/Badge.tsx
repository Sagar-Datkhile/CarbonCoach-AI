import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "warning" | "error" | "neutral" | "primary";
}

export function Badge({
  className,
  variant = "neutral",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    primary: "bg-[#075E45] text-white",
    success: "bg-[#EAF5EE] dark:bg-[#063D2E] text-[#075E45] dark:text-[#34D399] border border-[#0B7252]/20 dark:border-[#10B981]/30",
    warning: "bg-[#FFF7E8] dark:bg-[#2E2305] text-[#9A5B00] dark:text-[#FBBF24] border border-[#9A5B00]/20 dark:border-[#FBBF24]/30",
    error: "bg-[#FEE4E2] dark:bg-[#7F1D1D]/30 text-[#B42318] dark:text-[#F87171] border border-[#B42318]/20 dark:border-[#F87171]/30",
    neutral: "bg-[#F3F8F3] dark:bg-[#1E293B] text-[#344054] dark:text-[#CBD5E1] border border-[#E3E7E3] dark:border-[#334155]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide transition-colors whitespace-nowrap shrink-0",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
