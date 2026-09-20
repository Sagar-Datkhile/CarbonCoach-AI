"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Zap, Mail, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(requestPasswordReset, null);

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
              Carbon Coach
            </span>
          </Link>
          <p className="text-sm text-[#667085]">
            Reset your account password
          </p>
        </div>

        {/* Forgot Password Card */}
        <Card elevated className="border-[#E3E7E3]">
          <CardHeader>
            <CardTitle>Forgot password</CardTitle>
            <CardDescription>
              Enter the email associated with your account and we&apos;ll send you a password reset link.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {state?.error && (
              <Alert variant={state.success ? "success" : "error"}>
                {state.error}
              </Alert>
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

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isPending}
                className="w-full mt-2"
              >
                Send Reset Link
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B7252] hover:text-[#075E45]"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to sign in
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
