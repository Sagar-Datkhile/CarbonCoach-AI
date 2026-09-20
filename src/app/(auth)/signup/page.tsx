"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { signUpWithEmail } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { Zap, User, Home, Mail, Lock } from "lucide-react";

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState(signUpWithEmail, null);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-[#FAFBF8]">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#075E45] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6 fill-current text-[#EAF5EE]" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-[#075E45]">
              CarbonCoach<span className="text-[#0B7252]">.AI</span>
            </span>
          </Link>
          <p className="text-sm text-[#667085]">
            Start optimizing your household energy today
          </p>
        </div>

        {/* SignUp Card */}
        <Card elevated className="border-[#E3E7E3]">
          <CardHeader>
            <CardTitle>Create your account</CardTitle>
            <CardDescription>
              Join CarbonCoach AI to track electricity and cut waste
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {state?.error && (
              <Alert variant={state.success ? "success" : "error"}>
                {state.error}
              </Alert>
            )}

            <form action={formAction} className="space-y-3.5">
              <Input
                label="Full Name"
                name="fullName"
                required
                placeholder="Alex Morgan"
                leftIcon={<User className="w-4 h-4" />}
                autoComplete="name"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Household Name"
                  name="householdName"
                  required
                  placeholder="Morgan Home"
                  leftIcon={<Home className="w-4 h-4" />}
                />

                <div className="flex flex-col space-y-1.5">
                  <label
                    htmlFor="homeType"
                    className="text-xs md:text-sm font-semibold text-[#111827]"
                  >
                    Home Type
                  </label>
                  <select
                    id="homeType"
                    name="homeType"
                    defaultValue="Owned"
                    className="w-full min-h-[44px] px-3 py-2 text-sm rounded-lg bg-white border border-[#E3E7E3] text-[#111827] focus:outline-none focus:border-[#0B7252] focus:ring-2 focus:ring-[#0B7252]/20"
                  >
                    <option value="Owned">Owned Home</option>
                    <option value="Rented">Rented Apartment / Home</option>
                    <option value="Shared">Shared Housing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <Input
                label="Email Address"
                name="email"
                type="email"
                required
                placeholder="alex@example.com"
                leftIcon={<Mail className="w-4 h-4" />}
                autoComplete="email"
              />

              <Input
                label="Password (min. 8 characters)"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
                autoComplete="new-password"
              />

              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                required
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
                autoComplete="new-password"
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isPending}
                className="w-full mt-2"
              >
                Create Free Account
              </Button>
            </form>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E3E7E3]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-[#667085] font-semibold">
                  Or sign up with
                </span>
              </div>
            </div>

            <GoogleAuthButton label="Sign up with Google" />
          </CardContent>

          <CardFooter className="justify-center text-center">
            <p className="text-sm text-[#667085]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-[#0B7252] hover:text-[#075E45] underline underline-offset-4"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
