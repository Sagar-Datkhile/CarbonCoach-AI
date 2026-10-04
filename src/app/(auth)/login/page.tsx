"use client";

import React, { useActionState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signInWithEmail } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { Mail, Lock } from "lucide-react";

function getHashError() {
  if (typeof window === "undefined" || !window.location.hash) return null;
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const desc = hashParams.get("error_description") || hashParams.get("error");
  return desc ? desc.replace(/\+/g, " ") : null;
}

function subscribeHash(callback: () => void) {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
}

function OAuthErrorMessage() {
  const searchParams = useSearchParams();
  const hashError = React.useSyncExternalStore(subscribeHash, getHashError, () => null);

  const error = searchParams.get("error");
  if (!error && !hashError) return null;

  const raw = hashError || (error === "auth_callback_failed" ? null : decodeURIComponent(error || ""));

  let friendlyMessage = raw || "Google authentication could not be completed. Please try again.";
  if (friendlyMessage.includes("Unable to exchange external code") || friendlyMessage === "server_error") {
    friendlyMessage = "Google OAuth Server Error: Google rejected the token exchange. Please verify the Client Secret and Authorized Redirect URI in Google Cloud Console and Supabase.";
  }

  return <Alert variant="error">{friendlyMessage}</Alert>;
}

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(signInWithEmail, null);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-[#FAFBF8]">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-3 group">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#151D2A] border border-[#E3E7E3] dark:border-[#222F3E] overflow-hidden flex items-center justify-center shadow-md p-1 group-hover:scale-105 transition-transform">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Carbon Coach Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-2xl font-bold tracking-tight text-[#075E45] dark:text-[#34D399]">
              Carbon Coach
            </span>
          </Link>
          <p className="text-sm text-[#667085] dark:text-[#9CA3AF]">
            Understand your energy. Make practical changes.
          </p>
        </div>

        {/* Login Card */}
        <Card elevated className="border-[#E3E7E3]">
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>
              Sign in to your household energy management dashboard
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Suspense fallback={null}>
              <OAuthErrorMessage />
            </Suspense>

            {state?.error && (
              <Alert variant="error">{state.error}</Alert>
            )}

            <form action={formAction} className="space-y-4">
              <Input
                label="Email Address"
                name="email"
                type="email"
                required
                placeholder="name@example.com"
                leftIcon={<Mail className="w-4 h-4" />}
                autoComplete="email"
              />

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-xs md:text-sm font-semibold text-[#111827]"
                  >
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-[#0B7252] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  leftIcon={<Lock className="w-4 h-4" />}
                  autoComplete="current-password"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isPending}
                className="w-full mt-2"
              >
                Sign In
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E3E7E3]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-[#667085] font-semibold">
                  Or continue with
                </span>
              </div>
            </div>

            <GoogleAuthButton label="Continue with Google" />
          </CardContent>

          <CardFooter className="justify-center text-center">
            <p className="text-sm text-[#667085]">
              Don&apos;t have an account yet?{" "}
              <Link
                href="/signup"
                className="font-bold text-[#0B7252] hover:text-[#075E45] underline underline-offset-4"
              >
                Get started
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
