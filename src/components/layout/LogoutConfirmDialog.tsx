"use client";

import React, { useTransition, useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { signOut } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";
import { LogOut } from "lucide-react";

interface LogoutConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const emptySubscribe = () => () => {};

export function LogoutConfirmDialog({ isOpen, onClose }: LogoutConfirmDialogProps) {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
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

  if (!isOpen || !mounted) return null;

  const handleLogout = () => {
    startTransition(async () => {
      await signOut();
    });
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-dialog-title"
    >
      <div
        className="absolute inset-0"
        onClick={() => !isPending && onClose()}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-[#E3E7E3] p-5 z-10 space-y-4 animate-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F3F8F3] text-[#075E45] flex items-center justify-center shrink-0 border border-[#0B7252]/15">
            <LogOut className="w-5 h-5" />
          </div>
          <div>
            <h2
              id="logout-dialog-title"
              className="text-base font-bold text-[#111827] tracking-tight"
            >
              Log Out
            </h2>
            <p className="text-xs text-[#667085]">
              Are you sure you want to log out?
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isPending}
            className="rounded-lg px-3 text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleLogout}
            isLoading={isPending}
            className="rounded-lg px-3.5 text-xs font-semibold"
          >
            Log Out
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
