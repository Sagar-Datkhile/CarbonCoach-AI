"use client";

import React, { useState, useEffect, useSyncExternalStore, useTransition } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import {
  X,
  AlertTriangle,
  UserX,
  Trash2,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
} from "lucide-react";
import {
  deactivateAccount,
  deleteUserAccountPermanently,
} from "@/app/actions/account";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ENERGY_PHRASES = [
  "SAVE ENERGY",
  "REDUCE CARBON",
  "SMART ENERGY",
  "SAVE POWER",
  "LOWER YOUR FOOTPRINT",
  "CLEAN POWER",
  "CONSERVE ENERGY",
  "CUT EMISSIONS",
  "EFFICIENCY FIRST",
  "ZERO EMISSIONS",
  "GREEN FUTURE",
];

function getRandomPhrase(): string {
  const index = Math.floor(Math.random() * ENERGY_PHRASES.length);
  return ENERGY_PHRASES[index];
}

const emptySubscribe = () => () => {};

export function DeleteAccountModal({
  isOpen,
  onClose,
}: DeleteAccountModalProps) {
  const isMounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const router = useRouter();
  const [step, setStep] = useState<"choose" | "permanent">("choose");
  const [confirmationPhrase, setConfirmationPhrase] = useState(() => getRandomPhrase());
  const [typedPhrase, setTypedPhrase] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleClose = React.useCallback(() => {
    if (isPending) return;
    setErrorMessage(null);
    setTypedPhrase("");
    setStep("choose");
    onClose();
  }, [isPending, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isPending) {
        handleClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isPending, handleClose]);

  if (!isOpen || !isMounted) return null;

  const handleDeactivate = () => {
    setErrorMessage(null);
    startTransition(async () => {
      try {
        await deactivateAccount();
        router.push("/");
        router.refresh();
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Failed to deactivate account";
        if (msg.includes("NEXT_REDIRECT")) {
          router.push("/");
          return;
        }
        setErrorMessage(msg);
      }
    });
  };

  const handlePermanentDelete = () => {
    if (typedPhrase.trim() !== confirmationPhrase.trim()) {
      setErrorMessage("The confirmation phrase does not match.");
      return;
    }

    setErrorMessage(null);
    startTransition(async () => {
      try {
        const res = await deleteUserAccountPermanently(
          typedPhrase,
          confirmationPhrase
        );
        if (res.success) {
          router.push("/");
          router.refresh();
        } else {
          setErrorMessage(
            res.error || "Failed to permanently delete account. Please try again."
          );
        }
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "An unexpected error occurred.";
        if (msg.includes("NEXT_REDIRECT")) {
          router.push("/");
          return;
        }
        setErrorMessage(msg);
      }
    });
  };

  const isDeleteDisabled =
    typedPhrase.trim() !== confirmationPhrase.trim() || isPending;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-account-title"
    >
      <div
        className="absolute inset-0"
        onClick={() => !isPending && handleClose()}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-lg bg-white dark:bg-[#151D2A] rounded-2xl shadow-2xl border border-[#E3E7E3] dark:border-[#222F3E] p-6 z-10 space-y-5 animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="delete-account-title"
                className="text-base sm:text-lg font-bold text-[#111827] dark:text-[#F9FAFB]"
              >
                {step === "choose"
                  ? "Delete your CarbonCoach account?"
                  : "Permanently delete account"}
              </h2>
              <p className="text-xs text-[#667085] dark:text-[#9CA3AF] mt-0.5">
                {step === "choose"
                  ? "Choose whether to deactivate or permanently delete your data."
                  : "This action cannot be undone. All data will be purged."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isPending}
            aria-label="Close dialog"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#667085] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-[#F9FAFB] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMessage && (
          <Alert variant="error" className="animate-in fade-in">
            {errorMessage}
          </Alert>
        )}

        {/* Step 1: Choose Deactivate vs Permanent Deletion */}
        {step === "choose" && (
          <div className="space-y-4 pt-1">
            <p className="text-xs sm:text-sm text-[#475467] dark:text-[#9CA3AF] leading-relaxed">
              You can deactivate your account temporarily or permanently delete
              your account and associated data.
            </p>

            <div className="space-y-3">
              {/* Option A: Deactivate */}
              <div className="p-4 rounded-xl border border-[#E3E7E3] dark:border-[#222F3E] bg-[#FAFBF8] dark:bg-[#0E1522] hover:border-gray-300 dark:hover:border-gray-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <UserX className="w-4 h-4 text-[#344054] dark:text-[#D1D5DB]" />
                    <span className="text-sm font-bold text-[#111827] dark:text-[#F9FAFB]">
                      Deactivate Account
                    </span>
                  </div>
                  <p className="text-xs text-[#667085] dark:text-[#9CA3AF] leading-relaxed max-w-sm">
                    Sign out and deactivate access. Your account data remains
                    stored and can be handled according to existing account
                    recovery policies.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  isLoading={isPending}
                  onClick={handleDeactivate}
                  className="shrink-0"
                >
                  Deactivate
                </Button>
              </div>

              {/* Option B: Permanent Delete */}
              <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 hover:border-red-300 dark:hover:border-red-800 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                    <span className="text-sm font-bold text-red-700 dark:text-red-400">
                      Delete Account Permanently
                    </span>
                  </div>
                  <p className="text-xs text-red-600/80 dark:text-red-300/80 leading-relaxed max-w-sm">
                    Permanently delete your CarbonCoach account and associated
                    user data. This action cannot be undone.
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={isPending}
                  onClick={() => {
                    setStep("permanent");
                    setConfirmationPhrase(getRandomPhrase());
                    setTypedPhrase("");
                  }}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  className="shrink-0"
                >
                  Continue
                </Button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                disabled={isPending}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Permanent Deletion Confirmation */}
        {step === "permanent" && (
          <div className="space-y-4 pt-1">
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <div className="text-xs text-red-700 dark:text-red-300 space-y-1">
                <p className="font-bold">Permanent Deletion Warning</p>
                <p className="leading-relaxed">
                  All your electricity bills, extracted energy insights,
                  planned actions, simulation history, and profile data will be
                  permanently deleted immediately.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#344054] dark:text-[#D1D5DB]">
                To confirm permanent deletion, type the phrase below:
              </label>

              {/* Dynamic random confirmation phrase */}
              <div className="py-2.5 px-3 rounded-xl bg-gray-100 dark:bg-[#0E1522] border border-[#E3E7E3] dark:border-[#222F3E] text-center font-mono font-bold text-sm tracking-wider text-[#111827] dark:text-[#F9FAFB] select-all">
                {confirmationPhrase}
              </div>

              <input
                type="text"
                autoFocus
                disabled={isPending}
                value={typedPhrase}
                onChange={(e) => setTypedPhrase(e.target.value)}
                placeholder="Type the exact phrase above"
                className="w-full h-10 px-3 py-2 text-sm font-medium rounded-xl bg-white dark:bg-[#1A2333] border border-[#E3E7E3] dark:border-[#222F3E] text-[#111827] dark:text-[#F9FAFB] placeholder:text-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-colors"
              />
              <p className="text-[11px] text-[#667085] dark:text-[#9CA3AF]">
                The delete button will become active once the typed phrase
                matches exactly.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={isPending}
                onClick={() => {
                  setStep("choose");
                  setErrorMessage(null);
                }}
                leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
              >
                Back
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isPending}
                  onClick={handleClose}
                >
                  Cancel
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  disabled={isDeleteDisabled}
                  isLoading={isPending}
                  onClick={handlePermanentDelete}
                  leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                >
                  Permanently Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
