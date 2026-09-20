"use server";

import { createClient } from "@/lib/supabase/server";
import { loginSchema, signUpSchema, forgotPasswordSchema } from "@/lib/validations/auth";
import { redirect } from "next/navigation";

export interface AuthActionResult {
  success?: boolean;
  error?: string;
}

export async function signInWithEmail(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validation = loginSchema.safeParse({ email, password });
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: validation.data.email,
    password: validation.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function signUpWithEmail(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const fullName = formData.get("fullName") as string;
  const householdName = formData.get("householdName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const homeType = (formData.get("homeType") as "Owned" | "Rented" | "Shared" | "Other") || "Owned";

  const validation = signUpSchema.safeParse({
    fullName,
    householdName,
    email,
    password,
    confirmPassword,
    homeType,
  });

  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: validation.data.email,
    password: validation.data.password,
    options: {
      data: {
        full_name: validation.data.fullName,
        household_name: validation.data.householdName,
        home_type: validation.data.homeType,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  // If email confirmation is required and session is null
  if (data.user && !data.session) {
    return {
      success: true,
      error: "Check your email for confirmation link to complete sign up.",
    };
  }

  redirect("/dashboard");
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function requestPasswordReset(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const email = formData.get("email") as string;
  const validation = forgotPasswordSchema.safeParse({ email });

  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(validation.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/profile`,
  });

  if (error) {
    return { error: error.message };
  }

  return {
    success: true,
    error: "Password reset link sent to your email.",
  };
}
