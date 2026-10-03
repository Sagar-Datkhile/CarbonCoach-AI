"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";

export interface AccountActionResult {
  success: boolean;
  error?: string;
}

/**
 * Deactivates user access by terminating the active authenticated session
 * and redirecting the user to the landing page.
 * All historical data and database records remain safely intact.
 */
export async function deactivateAccount(): Promise<AccountActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required" };
  }

  // Sign out user session
  await supabase.auth.signOut();
  redirect("/");
}

/**
 * Permanently deletes the authenticated user's account and all associated user-owned records.
 * Privileged Auth user deletion is executed securely server-side using the admin client.
 * Global/shared datasets (e.g., recommendation_templates, emission_factors) are strictly untouched.
 */
export async function deleteUserAccountPermanently(
  userInputPhrase: string,
  expectedPhrase: string
): Promise<AccountActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authCheckErr,
  } = await supabase.auth.getUser();

  if (authCheckErr || !user) {
    return {
      success: false,
      error: "Authentication required to delete account.",
    };
  }

  // Validate the user-typed confirmation phrase
  if (!userInputPhrase || userInputPhrase.trim() !== expectedPhrase.trim()) {
    return {
      success: false,
      error: "Confirmation phrase does not match. Please enter the exact phrase.",
    };
  }

  const userId = user.id;

  try {
    const admin = createAdminClient();

    // 1. Delete user_actions (depends on households and recommendation_templates)
    const { error: errActions } = await admin
      .from("user_actions")
      .delete()
      .eq("user_id", userId);
    if (errActions) {
      console.error("[deleteAccount] Failed to delete user_actions:", errActions);
      return { success: false, error: "Failed to delete user action records." };
    }

    // 2. Delete simulation_runs (depends on households)
    const { error: errSim } = await admin
      .from("simulation_runs")
      .delete()
      .eq("user_id", userId);
    if (errSim) {
      console.error("[deleteAccount] Failed to delete simulation_runs:", errSim);
      return { success: false, error: "Failed to delete simulation records." };
    }

    // 3. Delete electricity_bills (depends on households and bill_extraction_logs)
    const { error: errBills } = await admin
      .from("electricity_bills")
      .delete()
      .eq("user_id", userId);
    if (errBills) {
      console.error("[deleteAccount] Failed to delete electricity_bills:", errBills);
      return { success: false, error: "Failed to delete electricity bills." };
    }

    // 4. Delete bill_extraction_logs
    const { error: errLogs } = await admin
      .from("bill_extraction_logs")
      .delete()
      .eq("user_id", userId);
    if (errLogs) {
      console.error("[deleteAccount] Failed to delete bill_extraction_logs:", errLogs);
      return { success: false, error: "Failed to delete bill extraction logs." };
    }

    // 5. Delete households
    const { error: errHouse } = await admin
      .from("households")
      .delete()
      .eq("user_id", userId);
    if (errHouse) {
      console.error("[deleteAccount] Failed to delete households:", errHouse);
      return { success: false, error: "Failed to delete household data." };
    }

    // 6. Delete user_preferences
    const { error: errPref } = await admin
      .from("user_preferences")
      .delete()
      .eq("user_id", userId);
    if (errPref) {
      console.error("[deleteAccount] Failed to delete user_preferences:", errPref);
      return { success: false, error: "Failed to delete user preferences." };
    }

    // 7. Delete user_roles
    const { error: errRoles } = await admin
      .from("user_roles")
      .delete()
      .eq("user_id", userId);
    if (errRoles) {
      console.error("[deleteAccount] Failed to delete user_roles:", errRoles);
      return { success: false, error: "Failed to delete user roles." };
    }

    // 8. Delete profiles
    const { error: errProf } = await admin
      .from("profiles")
      .delete()
      .eq("id", userId);
    if (errProf) {
      console.error("[deleteAccount] Failed to delete profiles:", errProf);
      return { success: false, error: "Failed to delete profile record." };
    }

    // 9. Delete Supabase Auth User via Admin Client
    const { error: errAuthAdmin } = await admin.auth.admin.deleteUser(userId);
    if (errAuthAdmin) {
      console.error("[deleteAccount] Failed to delete Supabase Auth user:", errAuthAdmin);
      return { success: false, error: "Failed to delete authentication account." };
    }

    // Clear active session
    await supabase.auth.signOut();
    return { success: true };
  } catch (err: unknown) {
    const errorMsg =
      err instanceof Error ? err.message : "An unexpected error occurred during account deletion.";
    console.error("[deleteAccount] Unhandled exception:", err);
    return { success: false, error: errorMsg };
  }
}
