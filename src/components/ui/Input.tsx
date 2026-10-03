import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs md:text-sm font-semibold text-[#111827] dark:text-[#F9FAFB]"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-[#667085] dark:text-[#9CA3AF]">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            type={type}
            className={cn(
              "w-full min-h-[44px] px-3.5 py-2 text-sm rounded-lg bg-white dark:bg-[#0E1522] border border-[#E3E7E3] dark:border-[#222F3E] text-[#111827] dark:text-[#F9FAFB] placeholder:text-[#9CA3AF] transition-colors",
              "focus:outline-none focus:border-[#0B7252] dark:focus:border-[#10B981] focus:ring-2 focus:ring-[#0B7252]/20 dark:focus:ring-[#10B981]/20",
              "disabled:bg-[#F8FAF9] dark:disabled:bg-[#1A2436] disabled:text-[#667085] dark:disabled:text-[#9CA3AF] disabled:border-[#E3E7E3] dark:disabled:border-[#222F3E] disabled:cursor-not-allowed disabled:select-none",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-[#B42318] focus:border-[#B42318] focus:ring-[#B42318]/20",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 flex items-center text-[#667085] dark:text-[#9CA3AF]">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-xs text-[#B42318] font-medium mt-1">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#667085] dark:text-[#9CA3AF] mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
