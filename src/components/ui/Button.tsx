import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

    const variantStyles = {
      primary:
        "bg-[#0B7252] text-white hover:bg-[#085B43] shadow-sm focus-visible:ring-[#0B7252]",
      secondary:
        "bg-[#EAF5EE] text-[#075E45] hover:bg-[#d8edd0] focus-visible:ring-[#075E45]",
      outline:
        "border-1.5 border-[#0B7252] text-[#0B7252] hover:bg-[#EAF5EE] bg-transparent focus-visible:ring-[#0B7252]",
      ghost:
        "text-[#075E45] hover:bg-[#F3F8F3] bg-transparent focus-visible:ring-[#075E45]",
      destructive:
        "bg-[#B42318] text-white hover:bg-[#911c13] shadow-sm focus-visible:ring-[#B42318]",
    };

    const sizeStyles = {
      sm: "min-h-[38px] px-3 py-1.5 text-xs gap-1.5",
      md: "min-h-[44px] px-4 py-2 text-sm gap-2", // 44px min touch target
      lg: "min-h-[48px] px-6 py-2.5 text-base gap-2.5",
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
