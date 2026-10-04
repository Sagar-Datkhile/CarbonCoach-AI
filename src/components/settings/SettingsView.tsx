"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { updateUserSettings, type UserSettingsInput } from "@/app/actions/settings";
import { getBudgetTierOptions } from "@/lib/budget";
import { FeedbackModal } from "@/components/layout/FeedbackModal";
import { DeleteAccountModal } from "./DeleteAccountModal";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import {
  SlidersHorizontal,
  Leaf,
  Shield,
  User,
  Check,
  ArrowRight,
  Save,
  Sun,
  Moon,
  Palette,
  MessageSquare,
  Trash2,
} from "lucide-react";

interface SettingsViewProps {
  initialSettings: UserSettingsInput;
  userEmail?: string;
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
        checked ? "bg-[#047857]" : "bg-gray-200 dark:bg-gray-700"
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

export function SettingsView({ initialSettings, userEmail }: SettingsViewProps) {
  const [settings, setSettings] = useState<UserSettingsInput>(initialSettings);
  const [isPending, startTransition] = useTransition();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals state
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Synchronize theme on mount and when settings change
  React.useEffect(() => {
    if (settings.theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, [settings.theme]);

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

  const handleThemeChange = (newTheme: "light" | "dark") => {
    if (settings.theme === newTheme) return;

    // Immediately toggle theme classes on DOM without needing page reload
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
    }

    // Persist in localStorage and cookie
    try {
      localStorage.setItem("carboncoach_theme", newTheme);
      document.cookie = `carboncoach_theme=${newTheme}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {}

    const updated: UserSettingsInput = {
      ...settings,
      theme: newTheme,
    };
    saveSettings(updated);
  };

  const handleToggle = (key: "emailNotifications" | "energySavingReminders") => {
    const updated = {
      ...settings,
      [key]: !settings[key],
    };
    saveSettings(updated);
  };

  const handleSelect = (key: "currency" | "energyUnit" | "budgetTier", value: string) => {
    const updated = {
      ...settings,
      [key]: value,
    };
    saveSettings(updated);
  };

  return (
    <div className="space-y-8 pb-12 w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E3E7E3] dark:border-[#222F3E] pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#111827] dark:text-[#F9FAFB]">
            Settings
          </h1>
          <p className="text-sm text-[#667085] dark:text-[#9CA3AF] mt-1">
            Manage your Carbon Coach preferences and account settings.
          </p>
        </div>

        {/* Small subtle status pill */}
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EAF5EE] dark:bg-[#063D2E] text-[#047857] dark:text-[#34D399] animate-in fade-in duration-200">
              <Check className="w-3.5 h-3.5" />
              Saved
            </span>
          )}
          {isPending && (
            <span className="text-xs text-[#667085] dark:text-[#9CA3AF] animate-pulse">
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

      {/* Top Section: Appearance */}
      <section className="bg-white dark:bg-[#151D2A] rounded-2xl border border-[#E3E7E3] dark:border-[#222F3E] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#F3F8F3] dark:border-[#1F2937]">
          <div className="w-8 h-8 rounded-lg bg-[#EAF5EE] dark:bg-[#063D2E] text-[#047857] dark:text-[#34D399] flex items-center justify-center shrink-0">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#111827] dark:text-[#F9FAFB]">Appearance</h2>
            <p className="text-xs text-[#667085] dark:text-[#9CA3AF]">
              Choose how Carbon Coach looks on your device
            </p>
          </div>
        </div>

        {/* Segmented Light/Dark selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Light Theme Option */}
          <button
            type="button"
            role="radio"
            aria-checked={settings.theme === "light"}
            onClick={() => handleThemeChange("light")}
            disabled={isPending}
            className={`flex items-start gap-3.5 p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
              settings.theme === "light"
                ? "border-[#047857] bg-[#EAF5EE]/40 dark:bg-[#063D2E]/20 ring-1 ring-[#047857]/30"
                : "border-[#E3E7E3] dark:border-[#222F3E] hover:bg-gray-50 dark:hover:bg-[#1A2333]/50"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                settings.theme === "light"
                  ? "bg-[#047857] text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
              }`}
            >
              <Sun className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#111827] dark:text-[#F9FAFB]">
                  Light
                </span>
                {settings.theme === "light" && (
                  <span className="w-2 h-2 rounded-full bg-[#047857]" />
                )}
              </div>
              <p className="text-xs text-[#667085] dark:text-[#9CA3AF] mt-0.5 leading-relaxed">
                Use the standard Carbon Coach light appearance.
              </p>
            </div>
          </button>

          {/* Dark Theme Option */}
          <button
            type="button"
            role="radio"
            aria-checked={settings.theme === "dark"}
            onClick={() => handleThemeChange("dark")}
            disabled={isPending}
            className={`flex items-start gap-3.5 p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
              settings.theme === "dark"
                ? "border-[#047857] bg-[#EAF5EE]/40 dark:bg-[#063D2E]/20 ring-1 ring-[#047857]/30"
                : "border-[#E3E7E3] dark:border-[#222F3E] hover:bg-gray-50 dark:hover:bg-[#1A2333]/50"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                settings.theme === "dark"
                  ? "bg-[#047857] text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
              }`}
            >
              <Moon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#111827] dark:text-[#F9FAFB]">
                  Dark
                </span>
                {settings.theme === "dark" && (
                  <span className="w-2 h-2 rounded-full bg-[#047857]" />
                )}
              </div>
              <p className="text-xs text-[#667085] dark:text-[#9CA3AF] mt-0.5 leading-relaxed">
                Use a minimal dark Carbon Coach appearance.
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* Section 1: Preferences */}
      <section className="bg-white dark:bg-[#151D2A] rounded-2xl border border-[#E3E7E3] dark:border-[#222F3E] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#F3F8F3] dark:border-[#1F2937]">
          <div className="w-8 h-8 rounded-lg bg-[#EAF5EE] dark:bg-[#063D2E] text-[#047857] dark:text-[#34D399] flex items-center justify-center shrink-0">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#111827] dark:text-[#F9FAFB]">Preferences</h2>
            <p className="text-xs text-[#667085] dark:text-[#9CA3AF]">
              Configure communication and notification frequencies
            </p>
          </div>
        </div>

        <div className="divide-y divide-[#F3F8F3] dark:divide-[#1F2937]">
          {/* Email Notifications */}
          <div className="flex items-center justify-between gap-4 py-4 first:pt-2 last:pb-2">
            <div className="space-y-0.5 max-w-lg">
              <label
                htmlFor="toggle-email-notifications"
                className="text-sm font-semibold text-[#111827] dark:text-[#F9FAFB] cursor-pointer"
              >
                Email Notifications
              </label>
              <p className="text-xs text-[#667085] dark:text-[#9CA3AF] leading-relaxed">
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
                className="text-sm font-semibold text-[#111827] dark:text-[#F9FAFB] cursor-pointer"
              >
                Energy Saving Reminders
              </label>
              <p className="text-xs text-[#667085] dark:text-[#9CA3AF] leading-relaxed">
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
      <section className="bg-white dark:bg-[#151D2A] rounded-2xl border border-[#E3E7E3] dark:border-[#222F3E] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#F3F8F3] dark:border-[#1F2937]">
          <div className="w-8 h-8 rounded-lg bg-[#EAF5EE] dark:bg-[#063D2E] text-[#047857] dark:text-[#34D399] flex items-center justify-center shrink-0">
            <Leaf className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#111827] dark:text-[#F9FAFB]">Energy Preferences</h2>
            <p className="text-xs text-[#667085] dark:text-[#9CA3AF]">
              Customize units and financial metrics for your household
            </p>
          </div>
        </div>

        <div className="divide-y divide-[#F3F8F3] dark:divide-[#1F2937]">
          {/* Currency */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 first:pt-2 last:pb-2">
            <div className="space-y-0.5 max-w-lg">
              <label
                htmlFor="select-currency"
                className="text-sm font-semibold text-[#111827] dark:text-[#F9FAFB]"
              >
                Currency
              </label>
              <p className="text-xs text-[#667085] dark:text-[#9CA3AF] leading-relaxed">
                Used when displaying electricity costs and savings.
              </p>
            </div>
            <div className="w-full sm:w-56 shrink-0">
              <select
                id="select-currency"
                value={settings.currency}
                disabled={isPending}
                onChange={(e) => handleSelect("currency", e.target.value)}
                className="w-full h-10 px-3 py-2 text-sm font-medium rounded-xl bg-white dark:bg-[#1A2333] border border-[#E3E7E3] dark:border-[#222F3E] text-[#111827] dark:text-[#F9FAFB] focus:outline-none focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/20 transition-colors cursor-pointer"
              >
                <option value="INR">INR (₹) — Indian Rupee</option>
                <option value="USD">USD ($) — US Dollar</option>
                <option value="EUR">EUR (€) — Euro</option>
                <option value="GBP">GBP (£) — British Pound</option>
              </select>
            </div>
          </div>

          {/* Budget Preference */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 first:pt-2 last:pb-2">
            <div className="space-y-0.5 max-w-lg">
              <label
                htmlFor="select-budget-tier"
                className="text-sm font-semibold text-[#111827] dark:text-[#F9FAFB]"
              >
                Budget Preference
              </label>
              <p className="text-xs text-[#667085] dark:text-[#9CA3AF] leading-relaxed">
                Calibrates recommendation ROI and capital upgrades threshold according to selected currency.
              </p>
            </div>
            <div className="w-full sm:w-56 shrink-0">
              <select
                id="select-budget-tier"
                value={settings.budgetTier || "Moderate"}
                disabled={isPending}
                onChange={(e) => handleSelect("budgetTier", e.target.value)}
                className="w-full h-10 px-3 py-2 text-sm font-medium rounded-xl bg-white dark:bg-[#1A2333] border border-[#E3E7E3] dark:border-[#222F3E] text-[#111827] dark:text-[#F9FAFB] focus:outline-none focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/20 transition-colors cursor-pointer"
              >
                {getBudgetTierOptions(settings.currency).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Energy Unit */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 first:pt-2 last:pb-2">
            <div className="space-y-0.5 max-w-lg">
              <label
                htmlFor="select-energy-unit"
                className="text-sm font-semibold text-[#111827] dark:text-[#F9FAFB]"
              >
                Energy Unit
              </label>
              <p className="text-xs text-[#667085] dark:text-[#9CA3AF] leading-relaxed">
                Choose how electricity consumption is displayed.
              </p>
            </div>
            <div className="w-full sm:w-56 shrink-0">
              <select
                id="select-energy-unit"
                value={settings.energyUnit}
                disabled={isPending}
                onChange={(e) => handleSelect("energyUnit", e.target.value)}
                className="w-full h-10 px-3 py-2 text-sm font-medium rounded-xl bg-white dark:bg-[#1A2333] border border-[#E3E7E3] dark:border-[#222F3E] text-[#111827] dark:text-[#F9FAFB] focus:outline-none focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/20 transition-colors cursor-pointer"
              >
                <option value="kWh">kWh — Kilowatt-hour</option>
                <option value="MWh">MWh — Megawatt-hour</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Privacy & Terms */}
      <section className="bg-white dark:bg-[#151D2A] rounded-2xl border border-[#E3E7E3] dark:border-[#222F3E] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#F3F8F3] dark:border-[#1F2937]">
          <div className="w-8 h-8 rounded-lg bg-[#EAF5EE] dark:bg-[#063D2E] text-[#047857] dark:text-[#34D399] flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#111827] dark:text-[#F9FAFB]">Privacy & Terms</h2>
            <p className="text-xs text-[#667085] dark:text-[#9CA3AF]">
              Data ownership, terms of service, and transparency guidelines
            </p>
          </div>
        </div>

        <div className="divide-y divide-[#F3F8F3] dark:divide-[#1F2937]">
          {/* Data & Privacy */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 first:pt-2 last:pb-2">
            <div className="space-y-0.5 max-w-lg">
              <span className="text-sm font-semibold text-[#111827] dark:text-[#F9FAFB] block">
                Data & Privacy
              </span>
              <p className="text-xs text-[#667085] dark:text-[#9CA3AF] leading-relaxed">
                Manage how your Carbon Coach data is stored, processed, and used.
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

          {/* Terms of Service */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 first:pt-2 last:pb-2">
            <div className="space-y-0.5 max-w-lg">
              <span className="text-sm font-semibold text-[#111827] dark:text-[#F9FAFB] block">
                Terms of Service
              </span>
              <p className="text-xs text-[#667085] dark:text-[#9CA3AF] leading-relaxed">
                Review the terms and conditions governing your use of Carbon Coach AI.
              </p>
            </div>
            <Link href="/terms">
              <Button
                variant="outline"
                size="sm"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Open Terms of Service
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 4: Account */}
      <section className="bg-white dark:bg-[#151D2A] rounded-2xl border border-[#E3E7E3] dark:border-[#222F3E] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#F3F8F3] dark:border-[#1F2937]">
          <div className="w-8 h-8 rounded-lg bg-[#EAF5EE] dark:bg-[#063D2E] text-[#047857] dark:text-[#34D399] flex items-center justify-center shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#111827] dark:text-[#F9FAFB]">Account</h2>
            <p className="text-xs text-[#667085] dark:text-[#9CA3AF]">
              Personal details and authentication session
            </p>
          </div>
        </div>

        <div className="divide-y divide-[#F3F8F3] dark:divide-[#1F2937]">
          {/* My Profile */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 first:pt-2 last:pb-2">
            <div className="space-y-0.5 max-w-lg">
              <span className="text-sm font-semibold text-[#111827] dark:text-[#F9FAFB] block">
                My Profile
              </span>
              <p className="text-xs text-[#667085] dark:text-[#9CA3AF] leading-relaxed">
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

          {/* Report an Issue */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 first:pt-2 last:pb-2">
            <div className="space-y-0.5 max-w-lg">
              <span className="text-sm font-semibold text-[#111827] dark:text-[#F9FAFB] block">
                Report an Issue
              </span>
              <p className="text-xs text-[#667085] dark:text-[#9CA3AF] leading-relaxed">
                Tell us about a problem or issue with Carbon Coach.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowIssueModal(true)}
              leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
            >
              Report an Issue
            </Button>
          </div>

          {/* Delete Account */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 first:pt-2 last:pb-2">
            <div className="space-y-0.5 max-w-lg">
              <span className="text-sm font-semibold text-red-600 dark:text-red-400 block">
                Delete Account
              </span>
              <p className="text-xs text-[#667085] dark:text-[#9CA3AF] leading-relaxed">
                Deactivate or permanently delete your Carbon Coach account and data.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteModal(true)}
              className="border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 hover:border-red-300"
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            >
              Delete Account
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

      {/* Report an Issue Feedback Modal */}
      <FeedbackModal
        isOpen={showIssueModal}
        onClose={() => setShowIssueModal(false)}
        userEmail={userEmail}
      />

      {/* Delete / Deactivate Account Modal */}
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
