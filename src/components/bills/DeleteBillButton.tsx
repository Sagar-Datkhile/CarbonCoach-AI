"use client";

import React, { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteBill } from "@/app/actions/bills";
import { useRouter } from "next/navigation";

interface DeleteBillButtonProps {
  billId: string;
  providerName: string;
}

export function DeleteBillButton({ billId, providerName }: DeleteBillButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the bill statement for "${providerName}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    startTransition(async () => {
      try {
        const result = await deleteBill(billId);
        if (!result.success) {
          alert(result.error || "Failed to delete bill.");
          return;
        }
        router.refresh();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Error deleting bill.";
        alert(message);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      aria-label={`Delete bill for ${providerName}`}
      title="Delete statement"
      className="p-1.5 rounded-lg text-[#667085] hover:text-[#B42318] hover:bg-[#FEE4E2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin text-[#B42318]" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </button>
  );
}
