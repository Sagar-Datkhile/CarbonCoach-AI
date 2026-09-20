"use client";

import React, { useTransition, useEffect } from "react";
import { signOut } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";
import { LogOut, AlertTriangle, X } from "lucide-react";

interface LogoutConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LogoutConfirmDialog({ isOpen, onClose }: LogoutConfirmDialogProps) {
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isPending) {
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
  }, [isOpen, isPending, onClose]);

  if (!isOpen) return null;

  const handleLogout = () => {
    startTransition(async () => {
      await signOut();
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-dialog-title"
    >
      <div
        className="absolute inset-0"
        onClick={() => !isPending && onClose()}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E3E7E3] p-6 z-10 space-y-5 animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#667085] hover:text-[#111827] hover:bg-[#F3F8F3] transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FEF3F2] text-[#D92D20] flex items-center justify-center shrink-0 border border-[#FECDCA]">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1 pr-6">
            <h2
              id="logout-dialog-title"
              className="text-lg font-bold text-[#111827] tracking-tight"
            >
              Log Out?
            </h2>
            <p className="text-sm text-[#667085]">
              Are you sure you want to sign out of Carbon Coach? You will need to sign in again to access your household dashboard and electricity data.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={isPending}
            className="rounded-xl px-4 font-semibold"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="md"
            onClick={handleLogout}
            isLoading={isPending}
            leftIcon={<LogOut className="w-4 h-4" />}
            className="rounded-xl px-5 font-semibold bg-[#D92D20] hover:bg-[#B42318] text-white"
          >
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
}
