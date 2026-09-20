"use client";

import React, { useActionState } from "react";
import { updateProfileInfo, updateHouseholdInfo } from "@/app/actions/profile";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { User, Home, Save, Users, Globe, DollarSign } from "lucide-react";

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

      <div className="space-y-8 w-full">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>

                <Input
                  label="Avatar URL (Optional)"
                  name="avatarUrl"
                  defaultValue={profile.avatarUrl}
                  placeholder="https://example.com/avatar.jpg"
                />

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
              {householdState?.error && <Alert variant="error" className="mb-4">{householdState.error}</Alert>}
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
    </div>
  );
}
