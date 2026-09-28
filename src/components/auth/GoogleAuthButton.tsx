"use client";

import React, { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

interface GoogleAuthButtonProps {
  label?: string;
  redirectTo?: string;
}

export function GoogleAuthButton({
  label = "Continue with Google",
  redirectTo,
}: GoogleAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const supabase = createClient();
      const origin = window.location.origin;

      let targetNext = redirectTo;
      if (!targetNext && typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        targetNext = urlParams.get("redirectTo") || urlParams.get("next") || "/dashboard";
      }
      if (!targetNext || !targetNext.startsWith("/") || targetNext.startsWith("//")) {
        targetNext = "/dashboard";
      }

      const callbackUrl = new URL("/auth/callback", origin);
      callbackUrl.searchParams.set("next", targetNext);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl.toString(),
          queryParams: {
            access_type: "offline",
            prompt: "select_account",
          },
        },
      });

      if (error) {
        console.error("Google login failed", error);
        setErrorMessage(error.message);
        setIsLoading(false);
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      console.error("Google login error:", msg);
      setErrorMessage(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-2">
      <Button
        type="button"
        variant="outline"
        size="md"
        isLoading={isLoading}
        onClick={handleGoogleLogin}
        className="w-full border-[#E3E7E3] hover:bg-[#F3F8F3] text-[#111827] font-semibold"
        leftIcon={
          <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        }
      >
        {label}
      </Button>
      {errorMessage && (
        <p className="text-xs text-red-600 text-center">{errorMessage}</p>
      )}
    </div>
  );
}
