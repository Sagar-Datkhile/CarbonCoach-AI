"use client";

import React, { useActionState } from "react";
import { updateProfileInfo, updateHouseholdInfo } from "@/app/actions/profile";
import { signOut } from "@/app/actions/auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { User, Home, Shield, LogOut, Save, Users, Globe } from "lucide-react";

interface ProfileFormsProps {
  profile: {
    email: string;
    fullName: string;
    avatarUrl: string;
    role: string;
  };
  household: {
    householdName: string;
    homeType: "Owned" | "Rented" | "Shared" | "Other";
    occupantsCount: number;
    region: string;
    budgetTier: "Zero-Cost" | "Low" | "Moderate" | "High";
    heatingType: string;
    coolingType: string;
    preferredCurrency: string;
  };
}

export function ProfileForms({ profile, household }: ProfileFormsProps) {
  const [profileState, profileAction, isProfilePending] = useActionState(updateProfileInfo, null);
  const [householdState, householdAction, isHouseholdPending] = useActionState(updateHouseholdInfo, null);
  const [customAvatar, setCustomAvatar] = React.useState<string | null>(null);
  const [failedAvatarUrl, setFailedAvatarUrl] = React.useState<string | null>(null);

  const currentAvatarUrl = customAvatar !== null ? customAvatar : profile.avatarUrl;
  const showAvatar = Boolean(currentAvatarUrl && currentAvatarUrl !== failedAvatarUrl);

  return (
    <div className="space-y-8">
      {/* Top Banner / Heading */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#111827]">
          Profile & Household Settings
        </h1>
        <p className="text-sm text-[#667085] mt-1">
          Manage your personal credentials, home profile, and energy modeling preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Personal & Household Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Personal Information */}
          <Card elevated>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#EAF5EE] text-[#075E45] flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Your name and display credentials</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {profileState?.error && <Alert variant="error" className="mb-4">{profileState.error}</Alert>}
              {profileState?.message && <Alert variant="success" className="mb-4">{profileState.message}</Alert>}

              <form action={profileAction} className="space-y-4">
                <Input
                  label="Email Address"
                  value={profile.email}
                  disabled
                  helperText="Email is linked to your Supabase Auth account."
                />

                <Input
                  label="Full Name"
                  name="fullName"
                  defaultValue={profile.fullName}
                  required
                  placeholder="Your full name"
                />

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#EAF5EE] text-[#075E45] flex items-center justify-center font-bold text-base overflow-hidden border border-[#E3E7E3] shrink-0">
                    {showAvatar && currentAvatarUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={currentAvatarUrl}
                        alt="Avatar Preview"
                        className="w-full h-full object-cover rounded-full"
                        referrerPolicy="no-referrer"
                        onError={() => setFailedAvatarUrl(currentAvatarUrl)}
                      />
                    ) : (
                      <span>
                        {profile.fullName
                          ? profile.fullName.charAt(0).toUpperCase()
                          : <User className="w-5 h-5" />}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <Input
                      label="Avatar URL (Optional)"
                      name="avatarUrl"
                      defaultValue={profile.avatarUrl}
                      placeholder="https://example.com/avatar.jpg"
                      onChange={(e) => {
                        setCustomAvatar(e.target.value.trim());
                      }}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={isProfilePending}
                    leftIcon={<Save className="w-4 h-4" />}
                  >
                    Save Personal Details
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Household Information */}
          <Card elevated>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#EAF5EE] text-[#075E45] flex items-center justify-center">
                  <Home className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle>Household & Energy Preferences</CardTitle>
                  <CardDescription>
                    These settings directly calibrate your recommendations and what-if simulation calculations.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {householdState?.error && (
                <div className="mb-4 space-y-2">
                  <Alert variant="error">{householdState.error}</Alert>
                  {(householdState.error.includes("household_profiles") ||
                    householdState.error.includes("migration")) && (
                    <div className="p-3 bg-[#FEF3F2] border border-[#FECDCA] rounded-lg text-xs text-[#B42318] space-y-2">
                      <p className="font-semibold">Quick Database Fix:</p>
                      <p>
                        The table <code className="bg-white/80 px-1 py-0.5 rounded font-mono">household_profiles</code> is not created yet in your Supabase database. Run the migration script in your Supabase SQL Editor:
                      </p>
                      <div>
                        <a
                          href="https://supabase.com/dashboard/project/emthwbyihnoklrrzdenv/sql/new"
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-semibold underline hover:text-[#912018]"
                        >
                          Open Supabase SQL Editor &rarr;
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {householdState?.message && <Alert variant="success" className="mb-4">{householdState.message}</Alert>}

              <form action={householdAction} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Household Name"
                    name="householdName"
                    defaultValue={household.householdName}
                    required
                    placeholder="e.g. Oak Residence"
                  />

                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="homeType" className="text-xs md:text-sm font-semibold text-[#111827]">
                      Home Ownership Type
                    </label>
                    <select
                      id="homeType"
                      name="homeType"
                      defaultValue={household.homeType}
                      className="w-full min-h-[44px] px-3.5 py-2 text-sm rounded-lg bg-white border border-[#E3E7E3] text-[#111827] focus:outline-none focus:border-[#0B7252] focus:ring-2 focus:ring-[#0B7252]/20"
                    >
                      <option value="Owned">Owned (Eligible for Solar, HVAC upgrades)</option>
                      <option value="Rented">Rented (Tenant-friendly no-drill actions)</option>
                      <option value="Shared">Shared Housing (Appliance & behavioral focus)</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Occupants Count"
                    name="occupantsCount"
                    type="number"
                    min={1}
                    max={20}
                    defaultValue={household.occupantsCount}
                    required
                    leftIcon={<Users className="w-4 h-4" />}
                  />

                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="budgetTier" className="text-xs md:text-sm font-semibold text-[#111827]">
                      Budget Preference
                    </label>
                    <select
                      id="budgetTier"
                      name="budgetTier"
                      defaultValue={household.budgetTier}
                      className="w-full min-h-[44px] px-3.5 py-2 text-sm rounded-lg bg-white border border-[#E3E7E3] text-[#111827] focus:outline-none focus:border-[#0B7252] focus:ring-2 focus:ring-[#0B7252]/20"
                    >
                      <option value="Zero-Cost">Zero-Cost Habits ($0)</option>
                      <option value="Low">Low Cost (&lt; $50)</option>
                      <option value="Moderate">Moderate (&lt; $300)</option>
                      <option value="High">Capital Investment ($300+)</option>
                    </select>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="preferredCurrency" className="text-xs md:text-sm font-semibold text-[#111827]">
                      Currency
                    </label>
                    <select
                      id="preferredCurrency"
                      name="preferredCurrency"
                      defaultValue={household.preferredCurrency}
                      className="w-full min-h-[44px] px-3.5 py-2 text-sm rounded-lg bg-white border border-[#E3E7E3] text-[#111827] focus:outline-none focus:border-[#0B7252] focus:ring-2 focus:ring-[#0B7252]/20"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="INR">INR (₹)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Region / Country"
                    name="region"
                    defaultValue={household.region}
                    required
                    placeholder="e.g. US National, India, EU"
                    leftIcon={<Globe className="w-4 h-4" />}
                  />

                  <Input
                    label="Primary Heating"
                    name="heatingType"
                    defaultValue={household.heatingType}
                    placeholder="e.g. Heat Pump, Electric"
                  />

                  <Input
                    label="Primary Cooling"
                    name="coolingType"
                    defaultValue={household.coolingType}
                    placeholder="e.g. Central AC, Fans"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={isHouseholdPending}
                    leftIcon={<Save className="w-4 h-4" />}
                  >
                    Save Household Preferences
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Column: Account Security & Session Overview */}
        <div className="space-y-6">
          <Card elevated>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#FFF7E8] text-[#9A5B00] flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle>Account Security</CardTitle>
                  <CardDescription>Authentication & Sessions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-xs text-[#667085] leading-relaxed">
                Your account is protected by Supabase Row Level Security. All electricity bills and consumption records are isolated to your user ID.
              </div>

              <div className="pt-2 border-t border-[#E3E7E3]">
                <form action={signOut}>
                  <Button
                    type="submit"
                    variant="destructive"
                    size="md"
                    className="w-full"
                    leftIcon={<LogOut className="w-4 h-4" />}
                  >
                    Sign Out
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>

          {/* Quick Summary Pill */}
          <div className="rounded-2xl bg-[#EAF5EE] border border-[#0B7252]/20 p-5 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#075E45]">
              Modeling Status
            </span>
            <p className="text-xs text-[#075E45] leading-relaxed">
              Recommendations are dynamically filtered for a <strong>{household.homeType}</strong> home with <strong>{household.budgetTier}</strong> budget tier.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
