import React from "react";
import { BillUploader } from "@/components/bills/BillUploader";

export const metadata = {
  title: "Add Electricity Bill — CarbonCoach AI",
};

export default function AddBillPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#111827]">
          Add Electricity Bill
        </h1>
        <p className="text-sm text-[#667085] mt-1">
          Upload your statement, review AI-extracted consumption data, and confirm it into your account.
        </p>
      </div>

      <BillUploader />
    </div>
  );
}
