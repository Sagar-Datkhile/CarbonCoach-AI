"use client";

import React, { useActionState, useState } from "react";
import { updateProfileInfo, updateHouseholdInfo } from "@/app/actions/profile";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import {
  User,
  Home,
  Save,
  Users,
  Globe,
  Lock,
  Camera,
  ShieldCheck,
  ChevronDown,
  Flame,
  Snowflake,
} from "lucide-react";

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

  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || "");
  const [avatarError, setAvatarError] = useState(false);
  const [name, setName] = useState(profile.fullName || "");

  const getInitials = (n: string, e: string) => {
    if (n && n.trim()) {
      const parts = n.trim().split(/\s+/);
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
      }
      return n.substring(0, 2).toUpperCase();
    }
    if (e) {
      return e.substring(0, 2).toUpperCase();
    }
    return "CC";
  };

  const initials = getInitials(name, profile.email);
  const showLiveAvatar = Boolean(avatarUrl && !avatarError);

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
                <CardDescription>Your name, avatar, and display credentials</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {profileState?.error && <Alert variant="error" className="mb-4">{profileState.error}</Alert>}
            {profileState?.message && <Alert variant="success" className="mb-4">{profileState.message}</Alert>}

            {/* Live Avatar Preview Card */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-xl bg-[#F8FAF9] border border-[#E3E7E3] mb-6">
              <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#EAF5EE] text-[#075E45] flex items-center justify-center font-bold text-xl shrink-0 border-2 border-[#0B7252]/25 overflow-hidden shadow-xs">
                {showLiveAvatar ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={avatarUrl}
                    alt={name || "User Avatar"}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <span>{initials}</span>
                )}
                <div className="absolute bottom-0 inset-x-0 bg-black/40 py-0.5 text-[9px] text-white font-medium text-center backdrop-blur-xs flex items-center justify-center gap-0.5">
                  <Camera className="w-2.5 h-2.5" />
                  <span>Avatar</span>
                </div>
              </div>
              <div className="flex-1 text-center sm:text-left space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h4 className="font-bold text-base text-[#111827]">
                    {name || "Carbon Coach User"}
                  </h4>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EAF5EE] text-[#075E45] border border-[#0B7252]/20">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {profile.role === "admin" ? "System Admin" : "Household Owner"}
                  </span>
                </div>
                <p className="text-xs text-[#667085]">
                  {profile.email}
                </p>
                <p className="text-xs text-[#667085] pt-0.5">
                  Update your full name or public image URL below to refresh your identity across reports.
                </p>
              </div>
            </div>

            <form action={profileAction} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Email Address"
                  value={profile.email}
                  disabled
                  leftIcon={<Lock className="w-4 h-4 text-[#98A2B3]" />}
                  helperText="Email is linked to your Supabase Auth account (read-only)."
                />

                <Input
                  label="Full Name"
                  name="fullName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Your full name"
                  leftIcon={<User className="w-4 h-4 text-[#98A2B3]" />}
                />
              </div>

              <Input
                label="Avatar URL (Optional)"
                name="avatarUrl"
                value={avatarUrl}
                onChange={(e) => {
                  setAvatarUrl(e.target.value);
                  setAvatarError(false);
                }}
                placeholder="https://example.com/avatar.jpg"
                leftIcon={<Globe className="w-4 h-4 text-[#98A2B3]" />}
                helperText="Paste a direct image link (.jpg, .png, .webp). Leave blank for initials."
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
                  leftIcon={<Home className="w-4 h-4 text-[#98A2B3]" />}
                />

                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="homeType" className="text-xs md:text-sm font-semibold text-[#111827]">
                    Home Ownership Type
                  </label>
                  <div className="relative">
                    <select
                      id="homeType"
                      name="homeType"
                      defaultValue={household.homeType}
                      className="w-full min-h-[44px] px-3.5 pr-10 py-2 text-sm rounded-lg bg-white border border-[#E3E7E3] text-[#111827] focus:outline-none focus:border-[#0B7252] focus:ring-2 focus:ring-[#0B7252]/20 appearance-none cursor-pointer transition-colors"
                    >
                      <option value="Owned">Owned (Eligible for Solar, HVAC upgrades)</option>
                      <option value="Rented">Rented (Tenant-friendly no-drill actions)</option>
                      <option value="Shared">Shared Housing (Appliance & behavioral focus)</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#667085]">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
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
                  leftIcon={<Users className="w-4 h-4 text-[#98A2B3]" />}
                />

                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="budgetTier" className="text-xs md:text-sm font-semibold text-[#111827]">
                    Budget Preference
                  </label>
                  <div className="relative">
                    <select
                      id="budgetTier"
                      name="budgetTier"
                      defaultValue={household.budgetTier}
                      className="w-full min-h-[44px] px-3.5 pr-10 py-2 text-sm rounded-lg bg-white border border-[#E3E7E3] text-[#111827] focus:outline-none focus:border-[#0B7252] focus:ring-2 focus:ring-[#0B7252]/20 appearance-none cursor-pointer transition-colors"
                    >
                      <option value="Zero-Cost">Zero-Cost Habits ($0)</option>
                      <option value="Low">Low Cost (&lt; $50)</option>
                      <option value="Moderate">Moderate (&lt; $300)</option>
                      <option value="High">Capital Investment ($300+)</option>
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#667085]">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="preferredCurrency" className="text-xs md:text-sm font-semibold text-[#111827]">
                    Currency
                  </label>
                  <div className="relative">
                    <select
                      id="preferredCurrency"
                      name="preferredCurrency"
                      defaultValue={household.preferredCurrency}
                      className="w-full min-h-[44px] px-3.5 pr-10 py-2 text-sm rounded-lg bg-white border border-[#E3E7E3] text-[#111827] focus:outline-none focus:border-[#0B7252] focus:ring-2 focus:ring-[#0B7252]/20 appearance-none cursor-pointer transition-colors"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="INR">INR (₹)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#667085]">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Region / Country"
                  name="region"
                  defaultValue={household.region}
                  required
                  placeholder="e.g. US National, India, EU"
                  leftIcon={<Globe className="w-4 h-4 text-[#98A2B3]" />}
                />

                <Input
                  label="Primary Heating"
                  name="heatingType"
                  defaultValue={household.heatingType}
                  placeholder="e.g. Heat Pump, Electric"
                  leftIcon={<Flame className="w-4 h-4 text-[#98A2B3]" />}
                />

                <Input
                  label="Primary Cooling"
                  name="coolingType"
                  defaultValue={household.coolingType}
                  placeholder="e.g. Central AC, Fans"
                  leftIcon={<Snowflake className="w-4 h-4 text-[#98A2B3]" />}
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
