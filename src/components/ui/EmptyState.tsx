import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";
import { Zap } from "lucide-react";

export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed border-[#E3E7E3] bg-[#FAFBF8] p-8 md:p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-6",
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-[#EAF5EE] text-[#0B7252] flex items-center justify-center mb-4 shadow-sm">
        {icon || <Zap className="w-7 h-7" />}
      </div>

      <h3 className="text-lg md:text-xl font-bold text-[#111827] mb-2">
        {title}
      </h3>

      <p className="text-sm text-[#667085] leading-relaxed max-w-sm mb-6">
        {description}
      </p>

      {actionLabel && (
        <>
          {actionHref ? (
            <a href={actionHref}>
              <Button variant="primary">{actionLabel}</Button>
            </a>
          ) : (
            <Button variant="primary" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
