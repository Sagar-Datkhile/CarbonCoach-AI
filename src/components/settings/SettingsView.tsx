"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { updateUserSettings, type UserSettingsInput } from "@/app/actions/settings";
import { LogoutConfirmDialog } from "@/components/layout/LogoutConfirmDialog";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import {
  SlidersHorizontal,
  Leaf,
  Shield,
  User,
  Check,
  ArrowRight,
  LogOut,
  Save,
} from "lucide-react";

interface SettingsViewProps {
  initialSettings: UserSettingsInput;
}

function ToggleSwitch({
  id,
  checked,
  onChange,
  disabled,
  label,
}: {
  id: string;
  checked: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#047857] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? "bg-[#047857]" : "bg-gray-200"
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export function SettingsView({ initialSettings }: SettingsViewProps) {
  const [settings, setSettings] = useState<UserSettingsInput>(initialSettings);
  const [isPending, startTransition] = useTransition();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const saveSettings = (newSettings: UserSettingsInput) => {
    setSettings(newSettings);
    setErrorMessage(null);
    startTransition(async () => {
      const res = await updateUserSettings(newSettings);
      if (res.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setErrorMessage(res.error || "Failed to update settings");
      }
    });
  };

  const handleToggle = (key: "emailNotifications" | "energySavingReminders") => {
    const updated = {
      ...settings,
      [key]: !settings[key],
    };
    saveSettings(updated);
  };

  const handleSelect = (key: "currency" | "energyUnit", value: string) => {
    const updated = {
      ...settings,
      [key]: value,
    };
    saveSettings(updated);
  };

  return (
    <div className="max-w-[860px] mx-auto space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E3E7E3] pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#111827]">
            Settings
          </h1>
          <p className="text-sm text-[#667085] mt-1">
            Manage your CarbonCoach preferences and account settings.
          </p>
        </div>

        {/* Small subtle status pill */}
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EAF5EE] text-[#047857] animate-in fade-in duration-200">
              <Check className="w-3.5 h-3.5" />
              Saved
            </span>
          )}
          {isPending && (
            <span className="text-xs text-[#667085] animate-pulse">
              Saving changes...
            </span>
          )}
        </div>
      </div>

      {errorMessage && (
        <Alert variant="error" className="animate-in fade-in">
          {errorMessage}
        </Alert>
      )}

      {/* Section 1: Preferences */}
      <section className="bg-white rounded-2xl border border-[#E3E7E3] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#F3F8F3]">
          <div className="w-8 h-8 rounded-lg bg-[#EAF5EE] text-[#047857] flex items-center justify-center shrink-0">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#111827]">Preferences</h2>
            <p className="text-xs text-[#667085]">
              Configure communication and notification frequencies
            </p>
          </div>
        </div>

        <div className="divide-y divide-[#F3F8F3]">
          {/* Email Notifications */}
          <div className="flex items-center justify-between gap-4 py-4 first:pt-2 last:pb-2">
            <div className="space-y-0.5 max-w-lg">
              <label
                htmlFor="toggle-email-notifications"
                className="text-sm font-semibold text-[#111827] cursor-pointer"
              >
                Email Notifications
              </label>
              <p className="text-xs text-[#667085] leading-relaxed">
                Receive important updates and energy insights by email.
              </p>
            </div>
            <ToggleSwitch
              id="toggle-email-notifications"
              checked={settings.emailNotifications}
              onChange={() => handleToggle("emailNotifications")}
              disabled={isPending}
              label="Email Notifications"
            />
          </div>

          {/* Energy Saving Reminders */}
          <div className="flex items-center justify-between gap-4 py-4 first:pt-2 last:pb-2">
            <div className="space-y-0.5 max-w-lg">
              <label
                htmlFor="toggle-energy-reminders"
                className="text-sm font-semibold text-[#111827] cursor-pointer"
              >
                Energy Saving Reminders
              </label>
              <p className="text-xs text-[#667085] leading-relaxed">
                Receive reminders about your active energy-saving actions.
              </p>
            </div>
            <ToggleSwitch
              id="toggle-energy-reminders"
              checked={settings.energySavingReminders}
              onChange={() => handleToggle("energySavingReminders")}
              disabled={isPending}
              label="Energy Saving Reminders"
            />
          </div>
        </div>
      </section>

      {/* Section 2: Energy Preferences */}
      <section className="bg-white rounded-2xl border border-[#E3E7E3] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#F3F8F3]">
          <div className="w-8 h-8 rounded-lg bg-[#EAF5EE] text-[#047857] flex items-center justify-center shrink-0">
            <Leaf className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#111827]">Energy Preferences</h2>
            <p className="text-xs text-[#667085]">
              Customize units and financial metrics for your household
            </p>
          </div>
        </div>

        <div className="divide-y divide-[#F3F8F3]">
          {/* Currency */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 first:pt-2 last:pb-2">
            <div className="space-y-0.5 max-w-lg">
              <label
                htmlFor="select-currency"
                className="text-sm font-semibold text-[#111827]"
              >
                Currency
              </label>
              <p className="text-xs text-[#667085] leading-relaxed">
                Used when displaying electricity costs and savings.
              </p>
            </div>
            <div className="w-full sm:w-56 shrink-0">
              <select
                id="select-currency"
                value={settings.currency}
                disabled={isPending}
                onChange={(e) => handleSelect("currency", e.target.value)}
                className="w-full h-10 px-3 py-2 text-sm font-medium rounded-xl bg-white border border-[#E3E7E3] text-[#111827] focus:outline-none focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/20 transition-colors cursor-pointer"
              >
                <option value="INR">INR (₹) — Indian Rupee</option>
                <option value="USD">USD ($) — US Dollar</option>
                <option value="EUR">EUR (€) — Euro</option>
                <option value="GBP">GBP (£) — British Pound</option>
              </select>
            </div>
          </div>

          {/* Energy Unit */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 first:pt-2 last:pb-2">
            <div className="space-y-0.5 max-w-lg">
              <label
                htmlFor="select-energy-unit"
                className="text-sm font-semibold text-[#111827]"
              >
                Energy Unit
              </label>
              <p className="text-xs text-[#667085] leading-relaxed">
                Choose how electricity consumption is displayed.
              </p>
            </div>
            <div className="w-full sm:w-56 shrink-0">
              <select
                id="select-energy-unit"
                value={settings.energyUnit}
                disabled={isPending}
                onChange={(e) => handleSelect("energyUnit", e.target.value)}
                className="w-full h-10 px-3 py-2 text-sm font-medium rounded-xl bg-white border border-[#E3E7E3] text-[#111827] focus:outline-none focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/20 transition-colors cursor-pointer"
              >
                <option value="kWh">kWh — Kilowatt-hour</option>
                <option value="MWh">MWh — Megawatt-hour</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Privacy */}
      <section className="bg-white rounded-2xl border border-[#E3E7E3] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#F3F8F3]">
          <div className="w-8 h-8 rounded-lg bg-[#EAF5EE] text-[#047857] flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#111827]">Privacy</h2>
            <p className="text-xs text-[#667085]">
              Data ownership and transparency guidelines
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3">
          <div className="space-y-0.5 max-w-lg">
            <span className="text-sm font-semibold text-[#111827] block">
              Data & Privacy
            </span>
            <p className="text-xs text-[#667085] leading-relaxed">
              Manage how your CarbonCoach data is stored and used.
            </p>
          </div>
          <Link href="/privacy">
            <Button
              variant="outline"
              size="sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Open Privacy Policy
            </Button>
          </Link>
        </div>
      </section>

      {/* Section 4: Account */}
      <section className="bg-white rounded-2xl border border-[#E3E7E3] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#F3F8F3]">
          <div className="w-8 h-8 rounded-lg bg-[#EAF5EE] text-[#047857] flex items-center justify-center shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#111827]">Account</h2>
            <p className="text-xs text-[#667085]">
              Personal details and authentication session
            </p>
          </div>
        </div>

        <div className="divide-y divide-[#F3F8F3]">
          {/* My Profile */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 first:pt-2 last:pb-2">
            <div className="space-y-0.5 max-w-lg">
              <span className="text-sm font-semibold text-[#111827] block">
                My Profile
              </span>
              <p className="text-xs text-[#667085] leading-relaxed">
                Update your personal profile information.
              </p>
            </div>
            <Link href="/profile">
              <Button
                variant="outline"
                size="sm"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Open Profile
              </Button>
            </Link>
          </div>

          {/* Log Out (Destructive) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 first:pt-2 last:pb-2">
            <div className="space-y-0.5 max-w-lg">
              <span className="text-sm font-semibold text-[#D92D20] block">
                Log Out
              </span>
              <p className="text-xs text-[#667085] leading-relaxed">
                Sign out of your CarbonCoach account.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLogoutDialog(true)}
              className="border-[#FDA29B] text-[#D92D20] hover:bg-[#FEF3F2] hover:border-[#F04438]"
              leftIcon={<LogOut className="w-3.5 h-3.5" />}
            >
              Logout
            </Button>
          </div>
        </div>
      </section>

      {/* Subtle manual Save Changes bar */}
      <div className="flex justify-end pt-2">
        <Button
          variant="primary"
          size="md"
          isLoading={isPending}
          onClick={() => saveSettings(settings)}
          leftIcon={<Save className="w-4 h-4" />}
        >
          Save Changes
        </Button>
      </div>

      {/* Logout Confirmation Dialog */}
      <LogoutConfirmDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
      />
    </div>
  );
}
