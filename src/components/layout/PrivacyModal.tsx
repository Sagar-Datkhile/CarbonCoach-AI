"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { X, Shield, Lock, EyeOff, Database } from "lucide-react";

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
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
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-dialog-title"
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E3E7E3] p-6 z-10 space-y-5 animate-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#667085] hover:text-[#111827] hover:bg-[#F3F8F3] transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EAF5EE] text-[#075E45] flex items-center justify-center shrink-0 border border-[#0B7252]/20">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 id="privacy-dialog-title" className="text-lg font-bold text-[#111827]">
              Privacy & Data Protection
            </h2>
            <p className="text-xs text-[#667085]">
              How CarbonCoach AI safeguards your household energy statements
            </p>
          </div>
        </div>

        <div className="space-y-3.5 text-sm text-[#344054]">
          <div className="p-3 rounded-xl bg-[#F8FAF9] border border-[#E3E7E3] flex items-start gap-3">
            <Lock className="w-5 h-5 text-[#075E45] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-xs text-[#111827]">Row-Level Security (RLS)</p>
              <p className="text-xs text-[#667085] mt-0.5">
                All electricity bills, household profiles, and simulation runs are isolated at the database level using PostgreSQL Row-Level Security. Only your authenticated user account can access your records.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#F8FAF9] border border-[#E3E7E3] flex items-start gap-3">
            <EyeOff className="w-5 h-5 text-[#075E45] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-xs text-[#111827]">Encrypted AI Extraction</p>
              <p className="text-xs text-[#667085] mt-0.5">
                Uploaded statements are processed strictly server-side for OCR extraction. Sensitive account details (like consumer IDs) are protected and never sold or shared with third parties.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#F8FAF9] border border-[#E3E7E3] flex items-start gap-3">
            <Database className="w-5 h-5 text-[#075E45] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-xs text-[#111827]">Full Data Ownership</p>
              <p className="text-xs text-[#667085] mt-0.5">
                You maintain complete ownership of your data. You can delete individual bills or reset household preferences at any time from your account settings.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end pt-2">
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={onClose}
            className="rounded-xl px-5 bg-[#075E45] hover:bg-[#064e3b]"
          >
            I Understand
          </Button>
        </div>
      </div>
    </div>
  );
}
