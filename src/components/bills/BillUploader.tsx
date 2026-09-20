"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { uploadAndExtractBill, confirmAuthoritativeBill } from "@/app/actions/bills";
import { type BillExtractionData, type ConfirmedBillData } from "@/lib/validations/bill";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import {
  UploadCloud,
  FileCheck,
  CheckCircle2,
  FileText,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export function BillUploader() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Wizard state: 1 = Upload, 2 = Review, 3 = Confirmed
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<BillExtractionData | null>(null);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAiFallback, setIsAiFallback] = useState(false);

  // Form field state for Step 2 (Review & Edit)
  const [providerName, setProviderName] = useState("");
  const [consumerNumber, setConsumerNumber] = useState("");
  const [billNumber, setBillNumber] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [energyKwh, setEnergyKwh] = useState<number | string>("");
  const [billAmount, setBillAmount] = useState<number | string>("");
  const [tariffRate, setTariffRate] = useState<number | string>("");
  const [currency, setCurrency] = useState("USD");
  const [dueDate, setDueDate] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setErrorMessage(null);
    }
  };

  const handleStartExtraction = () => {
    if (!selectedFile) {
      setErrorMessage("Please select a file to upload.");
      return;
    }

    startTransition(async () => {
      setErrorMessage(null);
      const formData = new FormData();
      formData.append("billFile", selectedFile);

      const result = await uploadAndExtractBill(formData);

      if (!result.success || !result.data) {
        setErrorMessage(result.error || "Extraction failed. Please try again.");
        return;
      }

      setExtractedData(result.data);
      setFilePath(result.filePath || null);
      setIsAiFallback(!!result.isAiFallback);

      // Populate review fields
      setProviderName(result.data.provider_name || "");
      setConsumerNumber(result.data.consumer_number || "");
      setBillNumber(result.data.bill_number || "");
      setStartDate(result.data.billing_period_start || "");
      setEndDate(result.data.billing_period_end || "");
      setEnergyKwh(result.data.energy_consumed_kwh || 0);
      setBillAmount(result.data.bill_amount || 0);
      setTariffRate(result.data.tariff_rate || "");
      setCurrency(result.data.currency || "USD");
      setDueDate(result.data.due_date || "");

      if (result.error && result.isAiFallback) {
        setErrorMessage(result.error);
      }

      setStep(2);
    });
  };

  const handleConfirmBill = () => {
    startTransition(async () => {
      setErrorMessage(null);

      const payload: ConfirmedBillData = {
        provider_name: providerName,
        consumer_number: consumerNumber || null,
        bill_number: billNumber || null,
        billing_period_start: startDate,
        billing_period_end: endDate,
        energy_consumed_kwh: Number(energyKwh),
        bill_amount: Number(billAmount),
        tariff_rate: tariffRate ? Number(tariffRate) : null,
        currency: currency || "USD",
        due_date: dueDate || null,
        file_path: filePath,
      };

      const result = await confirmAuthoritativeBill(payload);

      if (!result.success) {
        setErrorMessage(result.error || "Failed to confirm bill record.");
        return;
      }

      setStep(3);
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* 3-Step Indicator */}
      <div className="flex items-center justify-between px-2 sm:px-6">
        <div className="flex items-center gap-2">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
              step >= 1 ? "bg-[#075E45] text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            1
          </div>
          <span className="text-xs sm:text-sm font-semibold text-[#111827]">Upload Bill</span>
        </div>
        <div className="flex-1 h-0.5 mx-3 bg-[#E3E7E3]" />
        <div className="flex items-center gap-2">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
              step >= 2 ? "bg-[#075E45] text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            2
          </div>
          <span className="text-xs sm:text-sm font-semibold text-[#111827]">Review & Edit</span>
        </div>
        <div className="flex-1 h-0.5 mx-3 bg-[#E3E7E3]" />
        <div className="flex items-center gap-2">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
              step === 3 ? "bg-[#0B7252] text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            3
          </div>
          <span className="text-xs sm:text-sm font-semibold text-[#111827]">Confirmed</span>
        </div>
      </div>

      {errorMessage && (
        <Alert variant={isAiFallback ? "warning" : "error"}>{errorMessage}</Alert>
      )}

      {/* Step 1: Upload */}
      {step === 1 && (
        <Card elevated>
          <CardHeader>
            <CardTitle>Upload Electricity Bill</CardTitle>
            <CardDescription>
              Upload a digital PDF bill or a clear photo of your paper statement (JPG, PNG).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed border-[#E3E7E3] hover:border-[#0B7252] rounded-2xl p-8 sm:p-12 text-center transition-colors bg-[#FAFBF8] flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-[#EAF5EE] text-[#075E45] flex items-center justify-center mb-4">
                <UploadCloud className="w-8 h-8" />
              </div>

              <h4 className="text-base font-bold text-[#111827] mb-1">
                Choose a bill statement file
              </h4>
              <p className="text-xs text-[#667085] max-w-sm mb-4">
                Supported formats: PDF, JPG, PNG, WEBP. Maximum file size: 10MB.
              </p>

              <label
                htmlFor="billFile"
                className="cursor-pointer inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#0B7252] text-white text-sm font-semibold hover:bg-[#085B43] transition-colors shadow-sm"
              >
                Browse Files
                <input
                  id="billFile"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>

              {selectedFile && (
                <div className="mt-4 p-3 rounded-xl bg-white border border-[#E3E7E3] flex items-center gap-3 text-xs text-left max-w-md w-full">
                  <FileText className="w-5 h-5 text-[#0B7252] shrink-0" />
                  <div className="flex-1 truncate">
                    <span className="font-semibold text-[#111827] block truncate">
                      {selectedFile.name}
                    </span>
                    <span className="text-[#667085]">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type}
                    </span>
                  </div>
                  <Badge variant="success">Ready</Badge>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="ghost"
                onClick={() => router.push("/bills")}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="lg"
                disabled={!selectedFile || isPending}
                isLoading={isPending}
                onClick={handleStartExtraction}
                rightIcon={<Sparkles className="w-4 h-4 ml-1" />}
              >
                Extract with Gemini AI
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Review & Verify */}
      {step === 2 && (
        <Card elevated>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle>Review Extracted Bill Information</CardTitle>
                <CardDescription>
                  Verify or correct each extracted field before confirming into your authoritative history.
                </CardDescription>
              </div>
              <Badge variant="warning">Human Verification Required</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-xl bg-[#FFF7E8] border border-[#9A5B00]/20 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#9A5B00] shrink-0 mt-0.5" />
              <p className="text-xs text-[#9A5B00] leading-relaxed">
                <strong>Anti-Hallucination Policy:</strong> Never silently trust raw AI extraction. Ensure the energy consumption (kWh) and billing dates precisely match your physical statement.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Utility Provider Name"
                value={providerName}
                onChange={(e) => setProviderName(e.target.value)}
                required
                placeholder="e.g. Pacific Electric"
              />

              <Input
                label="Consumer / Account Number"
                value={consumerNumber}
                onChange={(e) => setConsumerNumber(e.target.value)}
                placeholder="Optional"
              />

              <Input
                label="Billing Cycle Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />

              <Input
                label="Billing Cycle End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />

              <Input
                label="Total Electricity Consumed (kWh)"
                type="number"
                step="0.01"
                value={energyKwh}
                onChange={(e) => setEnergyKwh(e.target.value)}
                required
                helperText="Total kilowatt-hours billed"
              />

              <Input
                label="Total Bill Amount"
                type="number"
                step="0.01"
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
                required
              />

              <div className="flex flex-col space-y-1.5">
                <label className="text-xs md:text-sm font-semibold text-[#111827]">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm rounded-lg bg-white border border-[#E3E7E3] text-[#111827] focus:outline-none focus:border-[#0B7252] focus:ring-2 focus:ring-[#0B7252]/20"
                >
                  <option value="USD">USD ($)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>

              <Input
                label="Due Date (Optional)"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E3E7E3]">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                leftIcon={<RotateCcw className="w-4 h-4" />}
              >
                Re-upload File
              </Button>
              <Button
                variant="primary"
                size="lg"
                isLoading={isPending}
                onClick={handleConfirmBill}
                rightIcon={<FileCheck className="w-4 h-4" />}
              >
                Confirm & Save Authoritative Bill
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Success */}
      {step === 3 && (
        <Card elevated className="text-center p-8 sm:p-12">
          <div className="w-16 h-16 rounded-2xl bg-[#EAF5EE] text-[#0B7252] flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <CardTitle className="text-2xl mb-2">
            Electricity Bill Confirmed!
          </CardTitle>

          <CardDescription className="max-w-md mx-auto mb-6">
            Your electricity statement of <strong>{energyKwh} kWh</strong> for <strong>{providerName}</strong> has been confirmed and saved to your authoritative history.
          </CardDescription>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={() => router.push("/dashboard")}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Go to Dashboard
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push("/bills")}
            >
              View All Bills
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
