import React from "react";
import { createClient } from "@/lib/supabase/server";
import { ProfileForms } from "@/components/profile/ProfileForms";

export const metadata = {
  title: "Profile & Household Preferences — Carbon Coach AI",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = {
    email: user?.email || "user@example.com",
    fullName:
      (user?.user_metadata?.full_name as string) ||
      (user?.user_metadata?.name as string) ||
      (user?.email ? user.email.split("@")[0] : "User"),
    avatarUrl: (user?.user_metadata?.avatar_url as string) || "",
    role: "user",
  };

  let household = {
    householdName: (user?.user_metadata?.household_name as string) || "My Household",
    homeType: ((user?.user_metadata?.home_type as string) || "Owned") as "Owned" | "Rented" | "Shared" | "Other",
    occupantsCount: 2,
    region: "Global",
    budgetTier: "Moderate" as "Zero-Cost" | "Low" | "Moderate" | "High",
    heatingType: "Electric",
    coolingType: "Air Conditioning",
    preferredCurrency: "USD",
  };

  if (user) {
    const { data: dbProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (dbProfile) {
      profile = {
        email: dbProfile.email || profile.email,
        fullName: dbProfile.full_name || profile.fullName,
        avatarUrl: dbProfile.avatar_url || "",
        role: dbProfile.role || "user",
      };
    }

    const { data: dbHousehold } = await supabase
      .from("households")
      .select("household_name, home_type, occupants_count, region_code")
      .eq("user_id", user.id)
      .maybeSingle();

    const { data: dbPrefs } = await supabase
      .from("user_preferences")
      .select("preferred_currency, upfront_budget")
      .eq("user_id", user.id)
      .maybeSingle();

    if (dbHousehold) {
      if (dbHousehold.household_name) {
        household.householdName = dbHousehold.household_name;
      }
      if (dbHousehold.home_type) {
        const rawType = dbHousehold.home_type;
        household.homeType = (rawType.charAt(0).toUpperCase() +
          rawType.slice(1).toLowerCase()) as "Owned" | "Rented" | "Shared" | "Other";
      }
      if (dbHousehold.occupants_count) {
        household.occupantsCount = dbHousehold.occupants_count;
      }
      if (dbHousehold.region_code) {
        household.region = dbHousehold.region_code;
      }
    }

    if (dbPrefs) {
      if (dbPrefs.preferred_currency) {
        household.preferredCurrency = dbPrefs.preferred_currency.trim();
      }
      if (dbPrefs.upfront_budget !== null && dbPrefs.upfront_budget !== undefined) {
        const b = Number(dbPrefs.upfront_budget);
        household.budgetTier =
          b === 0 ? "Zero-Cost" : b <= 50 ? "Low" : b <= 300 ? "Moderate" : "High";
      }
    }

    if (user.user_metadata?.heating_type) {
      household.heatingType = user.user_metadata.heating_type;
    }
    if (user.user_metadata?.cooling_type) {
      household.coolingType = user.user_metadata.cooling_type;
    }
    if (user.user_metadata?.budget_tier) {
      household.budgetTier = user.user_metadata.budget_tier;
    }
  }

  return <ProfileForms profile={profile} household={household} />;
}
