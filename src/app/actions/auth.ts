"use server";

import { createClient } from "@/lib/supabase/server";
import { loginSchema, signUpSchema, forgotPasswordSchema } from "@/lib/validations/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export interface AuthActionResult {
  success?: boolean;
  error?: string;
}

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return false;
  if (url.includes("placeholder") || key.includes("placeholder")) return false;
  return true;
}

/**
 * Creates an evaluation / demo session so users running the cloned project locally
 * can explore all dashboard features without needing external Supabase credentials.
 */
export async function signInWithDemo(): Promise<AuthActionResult> {
  const cookieStore = await cookies();
  cookieStore.set("cc_demo_session", "active", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  redirect("/dashboard");
}

export async function signInWithEmail(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const email = (formData.get("email") as string) || "";
  const password = (formData.get("password") as string) || "";

  const validation = loginSchema.safeParse({ email, password });
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  // Allow quick demo access with demo credentials or when Supabase is not yet configured
  if (validation.data.email.toLowerCase() === "demo@carboncoach.ai") {
    return await signInWithDemo();
  }

  if (!isSupabaseConfigured()) {
    return {
      error:
        "Supabase credentials are not configured in your environment. Click 'Explore with Demo Account' below to test the dashboard immediately, or add your Supabase project keys to .env.local.",
    };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: validation.data.email,
      password: validation.data.password,
    });

    if (error) {
      return { error: error.message };
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("fetch failed") || message.includes("ENOTFOUND")) {
      return {
        error:
          "Unable to connect to authentication server (network/DNS failure). Please check your internet connection or use 'Explore with Demo Account' below.",
      };
    }
    return { error: message || "Authentication failed. Please try again." };
  }

  redirect("/dashboard");
}

export async function signUpWithEmail(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const fullName = (formData.get("fullName") as string) || "";
  const householdName = (formData.get("householdName") as string) || "";
  const email = (formData.get("email") as string) || "";
  const password = (formData.get("password") as string) || "";
  const confirmPassword = (formData.get("confirmPassword") as string) || "";
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

  if (!isSupabaseConfigured()) {
    return {
      error:
        "Supabase is not configured yet. You can click 'Sign In' and use the Demo Account to test the application immediately.",
    };
  }

  try {
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
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("fetch failed") || message.includes("ENOTFOUND")) {
      return {
        error:
          "Unable to connect to authentication server. Please check your Supabase configuration in .env.local.",
      };
    }
    return { error: message || "Sign up failed. Please try again." };
  }

  redirect("/dashboard");
}

export async function signOut(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("cc_demo_session");

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignore network errors during sign out
    }
  }

  redirect("/");
}

export async function requestPasswordReset(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const email = (formData.get("email") as string) || "";
  const validation = forgotPasswordSchema.safeParse({ email });

  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  if (!isSupabaseConfigured()) {
    return {
      error:
        "Supabase is not configured yet. Use the Demo Account on the login page to access the application.",
    };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(validation.data.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/profile`,
    });

    if (error) {
      return { error: error.message };
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("fetch failed") || message.includes("ENOTFOUND")) {
      return {
        error:
          "Unable to connect to authentication server. Please verify your .env.local configuration.",
      };
    }
    return { error: message || "Password reset request failed." };
  }

  return {
    success: true,
    error: "Password reset link sent to your email.",
  };
}
