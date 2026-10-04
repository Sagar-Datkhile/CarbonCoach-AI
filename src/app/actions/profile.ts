"use server";

import { createClient } from "@/lib/supabase/server";
import { profileUpdateSchema, householdUpdateSchema } from "@/lib/validations/profile";
import { revalidatePath } from "next/cache";

export interface ProfileActionResult {
  success?: boolean;
  error?: string;
  message?: string;
}

export async function updateProfileInfo(
  prevState: ProfileActionResult | null,
  formData: FormData
): Promise<ProfileActionResult> {
  const fullName = formData.get("fullName") as string;
  const avatarUrl = (formData.get("avatarUrl") as string) || "";

  const validation = profileUpdateSchema.safeParse({ fullName, avatarUrl });
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Authentication required" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: validation.data.fullName,
      avatar_url: validation.data.avatarUrl || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/profile");
  revalidatePath("/", "layout");
  return { success: true, message: "Profile updated successfully!" };
}

export async function updateHouseholdInfo(
  prevState: ProfileActionResult | null,
  formData: FormData
): Promise<ProfileActionResult> {
  const householdName = formData.get("householdName") as string;
  const homeType = formData.get("homeType") as "Owned" | "Rented" | "Shared" | "Other";
  const occupantsCount = formData.get("occupantsCount");
  const region = formData.get("region") as string;
  const budgetTier = formData.get("budgetTier") as "Zero-Cost" | "Low" | "Moderate" | "High";
  const heatingType = (formData.get("heatingType") as string) || "Electric";
  const coolingType = (formData.get("coolingType") as string) || "Air Conditioning";
  const preferredCurrency = (formData.get("preferredCurrency") as string) || "USD";

  const validation = householdUpdateSchema.safeParse({
    householdName,
    homeType,
    occupantsCount,
    region,
    budgetTier,
    heatingType,
    coolingType,
    preferredCurrency,
  });

  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Authentication required" };
  }

  // 1. Update user metadata in Supabase Auth
  await supabase.auth.updateUser({
    data: {
      household_name: validation.data.householdName,
      home_type: validation.data.homeType,
      occupants_count: validation.data.occupantsCount,
      region: validation.data.region,
      budget_tier: validation.data.budgetTier,
      heating_type: validation.data.heatingType || null,
      cooling_type: validation.data.coolingType || null,
      preferred_currency: validation.data.preferredCurrency,
    },
  });

  // 2. Persist to households table
  const homeTypeLower = validation.data.homeType.toLowerCase() as
    | "owned"
    | "rented"
    | "shared"
    | "other";

  const { data: existingHousehold } = await supabase
    .from("households")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingHousehold) {
    const { error: hErr } = await supabase
      .from("households")
      .update({
        household_name: validation.data.householdName,
        home_type: homeTypeLower,
        occupants_count: validation.data.occupantsCount,
        region_code: validation.data.region,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    if (hErr) {
      console.error("[updateHouseholdInfo] households update error:", hErr);
      return { error: hErr.message };
    }
  } else {
    const { error: hErr } = await supabase.from("households").insert({
      user_id: user.id,
      household_name: validation.data.householdName,
      home_type: homeTypeLower,
      occupants_count: validation.data.occupantsCount,
      region_code: validation.data.region,
    });

    if (hErr) {
      console.error("[updateHouseholdInfo] households insert error:", hErr);
      return { error: hErr.message };
    }
  }

  // 3. Persist to user_preferences table
  const upfrontBudget =
    validation.data.budgetTier === "Zero-Cost"
      ? 0
      : validation.data.budgetTier === "Low"
      ? 50
      : validation.data.budgetTier === "Moderate"
      ? 250
      : 1000;

  const currency3 = validation.data.preferredCurrency.slice(0, 3).toUpperCase();

  const { data: existingPref } = await supabase
    .from("user_preferences")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingPref) {
    const { error: pErr } = await supabase
      .from("user_preferences")
      .update({
        upfront_budget: upfrontBudget,
        preferred_currency: currency3,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    if (pErr) {
      console.error("[updateHouseholdInfo] user_preferences update error:", pErr);
      return { error: pErr.message };
    }
  } else {
    const { error: pErr } = await supabase.from("user_preferences").insert({
      user_id: user.id,
      upfront_budget: upfrontBudget,
      preferred_currency: currency3,
    });

    if (pErr) {
      console.error("[updateHouseholdInfo] user_preferences insert error:", pErr);
      return { error: pErr.message };
    }
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  revalidatePath("/plan");
  revalidatePath("/simulator");
  revalidatePath("/progress");
  revalidatePath("/settings");
  return { success: true, message: "Household preferences saved successfully!" };
}
