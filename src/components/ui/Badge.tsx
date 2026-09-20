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
    success: "bg-[#EAF5EE] text-[#075E45] border border-[#0B7252]/20",
    warning: "bg-[#FFF7E8] text-[#9A5B00] border border-[#9A5B00]/20",
    error: "bg-[#FEE4E2] text-[#B42318] border border-[#B42318]/20",
    neutral: "bg-[#F3F8F3] text-[#344054] border border-[#E3E7E3]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
