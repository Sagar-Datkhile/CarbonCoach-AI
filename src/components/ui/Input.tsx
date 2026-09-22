"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
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
      showPasswordToggle = true,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordType = type === "password";
    const effectiveType = isPasswordType && showPassword ? "text" : type;

    return (
      <div className="w-full flex flex-col space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs md:text-sm font-semibold text-[#111827]"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-[#667085]">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            type={effectiveType}
            className={cn(
              "w-full min-h-[44px] px-3.5 py-2 text-sm rounded-lg bg-white border border-[#E3E7E3] text-[#111827] placeholder:text-[#9CA3AF] transition-colors",
              "focus:outline-none focus:border-[#0B7252] focus:ring-2 focus:ring-[#0B7252]/20",
              "disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed",
              leftIcon && "pl-10",
              (rightIcon || (isPasswordType && showPasswordToggle)) && "pr-11",
              error && "border-[#B42318] focus:border-[#B42318] focus:ring-[#B42318]/20",
              className
            )}
            {...props}
          />
          {isPasswordType && showPasswordToggle ? (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 p-1 rounded-md text-[#667085] hover:text-[#0B7252] hover:bg-[#EAF5EE] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B7252]/50 cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          ) : rightIcon ? (
            <div className="absolute right-3.5 flex items-center text-[#667085]">
              {rightIcon}
            </div>
          ) : null}
        </div>
        {error ? (
          <p className="text-xs text-[#B42318] font-medium mt-1">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#667085] mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
