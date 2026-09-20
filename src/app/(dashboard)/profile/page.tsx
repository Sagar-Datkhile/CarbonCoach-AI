import React from "react";
import { createClient } from "@/lib/supabase/server";
import { ProfileForms } from "@/components/profile/ProfileForms";

export const metadata = {
  title: "Profile & Household Preferences — CarbonCoach AI",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = {
    email: user?.email || "",
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
      .from("household_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (dbHousehold) {
      household = {
        householdName: dbHousehold.household_name || household.householdName,
        homeType: dbHousehold.home_type as "Owned" | "Rented" | "Shared" | "Other",
        occupantsCount: dbHousehold.occupants_count || 2,
        region: dbHousehold.region || "Global",
        budgetTier: dbHousehold.budget_tier as "Zero-Cost" | "Low" | "Moderate" | "High",
        heatingType: dbHousehold.heating_type || "Electric",
        coolingType: dbHousehold.cooling_type || "Air Conditioning",
        preferredCurrency: dbHousehold.preferred_currency || "USD",
      };
    } else {
      // Fallback: check legacy households table if household_profiles is empty or not yet migrated
      try {
        const { data: legacyHousehold } = await (supabase as any)
          .from("households")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (legacyHousehold) {
          const lH = legacyHousehold as {
            household_name?: string;
            home_type?: string;
            occupants_count?: number;
            region_code?: string;
          };
          household = {
            householdName: lH.household_name || household.householdName,
            homeType:
              lH.home_type === "rented"
                ? "Rented"
                : lH.home_type === "shared"
                ? "Shared"
                : "Owned",
            occupantsCount: lH.occupants_count || 2,
            region: lH.region_code || "Global",
            budgetTier: "Moderate",
            heatingType: "Electric",
            coolingType: "Air Conditioning",
            preferredCurrency: "USD",
          };
        }
      } catch {
        // Fallback gracefully to default values
      }
    }
  }

  return <ProfileForms profile={profile} household={household} />;
}
