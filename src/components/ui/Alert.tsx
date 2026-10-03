import React from "react";
import { cn } from "@/lib/utils";
import { Info, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "warning" | "success" | "error";
  title?: string;
}

export function Alert({
  className,
  variant = "info",
  title,
  children,
  ...props
}: AlertProps) {
  const config = {
    info: {
      container: "bg-[#F3F8F3] dark:bg-[#063D2E]/30 border-[#0B7252]/30 dark:border-[#10B981]/30 text-[#075E45] dark:text-[#34D399]",
      icon: <Info className="w-5 h-5 text-[#0B7252] dark:text-[#34D399] shrink-0 mt-0.5" />,
    },
    warning: {
      container: "bg-[#FFF7E8] dark:bg-[#2E2305] border-[#9A5B00]/30 dark:border-[#FBBF24]/30 text-[#9A5B00] dark:text-[#FBBF24]",
      icon: <AlertTriangle className="w-5 h-5 text-[#9A5B00] dark:text-[#FBBF24] shrink-0 mt-0.5" />,
    },
    success: {
      container: "bg-[#EAF5EE] dark:bg-[#063D2E]/40 border-[#075E45]/30 dark:border-[#10B981]/30 text-[#075E45] dark:text-[#34D399]",
      icon: <CheckCircle2 className="w-5 h-5 text-[#0B7252] dark:text-[#34D399] shrink-0 mt-0.5" />,
    },
    error: {
      container: "bg-[#FEE4E2] dark:bg-[#7F1D1D]/30 border-[#B42318]/30 dark:border-[#F87171]/30 text-[#B42318] dark:text-[#F87171]",
      icon: <XCircle className="w-5 h-5 text-[#B42318] dark:text-[#F87171] shrink-0 mt-0.5" />,
    },
  };

  const current = config[variant];

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 p-4 rounded-xl border text-sm leading-relaxed",
        current.container,
        className
      )}
      {...props}
    >
      {current.icon}
      <div className="flex-1 space-y-1">
        {title && <h5 className="font-semibold">{title}</h5>}
        <div className="text-xs md:text-sm opacity-90">{children}</div>
      </div>
    </div>
  );
}
