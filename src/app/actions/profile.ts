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

  const { error } = await supabase
    .from("household_profiles")
    .upsert(
      {
        user_id: user.id,
        household_name: validation.data.householdName,
        home_type: validation.data.homeType,
        occupants_count: validation.data.occupantsCount,
        region: validation.data.region,
        budget_tier: validation.data.budgetTier,
        heating_type: validation.data.heatingType || null,
        cooling_type: validation.data.coolingType || null,
        preferred_currency: validation.data.preferredCurrency,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  revalidatePath("/plan");
  return { success: true, message: "Household preferences saved successfully!" };
}
