"use client";

import React, { useState, useTransition } from "react";
import { calculateLightingSavings, type LightingSimulationInput } from "@/lib/calculations/simulator";
import { recordSimulationRun } from "@/app/actions/plan";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { MetricCard } from "@/components/ui/MetricCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { formatCurrency, formatKwh, formatEmissions } from "@/lib/utils";
import {
  Lightbulb,
  Zap,
  DollarSign,
  Leaf,
  Sliders,
  Save,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";

interface LightingSimulatorProps {
  defaultTariff?: number;
  defaultEmissionFactor?: number;
  currency?: string;
}

export function LightingSimulator({
  defaultTariff = 0.165,
  defaultEmissionFactor = 0.386,
  currency = "USD",
}: LightingSimulatorProps) {
  const [isPending, startTransition] = useTransition();
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Input states
  const [currentWatts, setCurrentWatts] = useState(60);
  const [proposedWatts, setProposedWatts] = useState(9);
  const [quantity, setQuantity] = useState(5);
  const [hoursPerDay, setHoursPerDay] = useState(4);
  const [numberOfDays, setNumberOfDays] = useState(365);
  const [tariffRate, setTariffRate] = useState(defaultTariff);
  const [emissionFactor, setEmissionFactor] = useState(defaultEmissionFactor);

  // Instant deterministic calculation
  const results = calculateLightingSavings({
    currentWatts,
    proposedWatts,
    quantity,
    hoursPerDay,
    numberOfDays,
    tariffRate,
    emissionFactor,
  });

  const handleSaveSimulation = () => {
    startTransition(async () => {
      setSaveSuccess(false);
      const res = await recordSimulationRun(
        "lighting_replacement",
        {
          currentWatts,
          proposedWatts,
          quantity,
          hoursPerDay,
          numberOfDays,
          tariffRate,
          emissionFactor,
        },
        results.kwhSaved,
        results.moneySaved,
        results.co2SavedKg
      );

      if (res.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    });
  };

  const handleReset = () => {
    setCurrentWatts(60);
    setProposedWatts(9);
    setQuantity(5);
    setHoursPerDay(4);
    setNumberOfDays(365);
    setTariffRate(defaultTariff);
    setEmissionFactor(defaultEmissionFactor);
    setSaveSuccess(false);
  };

  return (
    <div className="space-y-8">
      {/* Simulation Disclaimer Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF7E8] border border-[#9A5B00]/30 flex items-start gap-3.5">
        <AlertTriangle className="w-5 h-5 text-[#9A5B00] shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-[#9A5B00] leading-relaxed">
          <strong>Simulation Disclaimer:</strong> Calculations represent modeled potential savings based on technical fixture ratings and operating parameters, not verified real-world savings. Realized savings are only verified when observed on subsequent utility bills.
        </div>
      </div>

      {saveSuccess && (
        <Alert variant="success" className="animate-in fade-in">
          Simulation run recorded to your historical audit log!
        </Alert>
      )}

      {/* Main Simulator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card elevated>
            <CardHeader className="pb-4 border-b border-[#F3F8F3]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#EAF5EE] text-[#075E45] flex items-center justify-center">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Lighting Upgrade Scenario</CardTitle>
                    <CardDescription>Adjust variables to simulate energy and cost changes</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
                  Reset
                </Button>
              </div>
            </CardHeader>

            <CardContent className="pt-5 space-y-5">
              {/* Bulbs Wattage Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold mb-1">
                    <label htmlFor="currWatts">Current Bulb Wattage</label>
                    <span className="text-[#075E45] font-bold">{currentWatts} W</span>
                  </div>
                  <input
                    id="currWatts"
                    type="range"
                    min="15"
                    max="150"
                    step="5"
                    value={currentWatts}
                    onChange={(e) => setCurrentWatts(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0B7252]"
                  />
                  <span className="text-[11px] text-[#667085] mt-1 block">
                    e.g. Standard Incandescent (60W)
                  </span>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-semibold mb-1">
                    <label htmlFor="propWatts">Proposed Bulb Wattage</label>
                    <span className="text-[#0B7252] font-bold">{proposedWatts} W</span>
                  </div>
                  <input
                    id="propWatts"
                    type="range"
                    min="3"
                    max="30"
                    step="1"
                    value={proposedWatts}
                    onChange={(e) => setProposedWatts(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0B7252]"
                  />
                  <span className="text-[11px] text-[#667085] mt-1 block">
                    e.g. Energy-Saving LED (9W)
                  </span>
                </div>
              </div>

              {/* Quantity and Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold mb-1">
                    <label htmlFor="quantity">Number of Fixtures</label>
                    <span className="text-[#111827] font-bold">{quantity} Bulbs</span>
                  </div>
                  <input
                    id="quantity"
                    type="range"
                    min="1"
                    max="40"
                    step="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0B7252]"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-semibold mb-1">
                    <label htmlFor="hours">Daily Operating Hours</label>
                    <span className="text-[#111827] font-bold">{hoursPerDay} hrs / day</span>
                  </div>
                  <input
                    id="hours"
                    type="range"
                    min="1"
                    max="24"
                    step="0.5"
                    value={hoursPerDay}
                    onChange={(e) => setHoursPerDay(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0B7252]"
                  />
                </div>
              </div>

              {/* Projection Period */}
              <div>
                <label className="text-xs font-semibold text-[#111827] block mb-2">
                  Simulation Time Horizon
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: "1 Month (30d)", days: 30 },
                    { label: "Quarter (90d)", days: 90 },
                    { label: "Half-Year (180d)", days: 180 },
                    { label: "1 Year (365d)", days: 365 },
                  ].map((p) => (
                    <button
                      key={p.days}
                      type="button"
                      onClick={() => setNumberOfDays(p.days)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                        numberOfDays === p.days
                          ? "bg-[#075E45] text-white shadow-xs"
                          : "bg-white border border-[#E3E7E3] text-[#667085] hover:bg-[#F3F8F3]"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced Parameters */}
              <div className="pt-2 border-t border-[#F3F8F3] grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Electricity Tariff Rate"
                  type="number"
                  step="0.001"
                  value={tariffRate}
                  onChange={(e) => setTariffRate(Number(e.target.value))}
                  helperText={`${currency} per kWh`}
                />
                <Input
                  label="Grid Emission Factor"
                  type="number"
                  step="0.001"
                  value={emissionFactor}
                  onChange={(e) => setEmissionFactor(Number(e.target.value))}
                  helperText="kg CO₂e per kWh"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card elevated className="border-[#0B7252]/30 bg-gradient-to-br from-white to-[#F3F8F3]">
            <CardHeader className="pb-3 border-b border-[#E3E7E3]">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Calculated Potential Impact</CardTitle>
                <Badge variant="success">Deterministic</Badge>
              </div>
              <CardDescription>
                Over {numberOfDays} days projection period
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              <div className="p-4 rounded-xl bg-white border border-[#E3E7E3] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#667085] block uppercase font-semibold">
                    Potential Energy Saved
                  </span>
                  <span className="text-3xl font-extrabold text-[#075E45] tabular-nums mt-0.5 block">
                    {formatKwh(results.kwhSaved)} <span className="text-sm text-[#667085]">kWh</span>
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#EAF5EE] text-[#075E45] flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#E3E7E3] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#667085] block uppercase font-semibold">
                    Potential Money Saved
                  </span>
                  <span className="text-3xl font-extrabold text-[#111827] tabular-nums mt-0.5 block">
                    {formatCurrency(results.moneySaved, currency)}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#EAF5EE] text-[#0B7252] flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#E3E7E3] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#667085] block uppercase font-semibold">
                    Emissions Avoided
                  </span>
                  <span className="text-2xl font-extrabold text-[#0B7252] tabular-nums mt-0.5 block">
                    {formatEmissions(results.co2SavedKg)}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#EAF5EE] text-[#0B7252] flex items-center justify-center">
                  <Leaf className="w-5 h-5" />
                </div>
              </div>

              {/* Formula Transparency Box */}
              <div className="p-3 rounded-xl bg-[#FAFBF8] border border-[#E3E7E3] text-[11px] text-[#667085] leading-relaxed">
                <span className="font-bold text-[#111827] block mb-0.5">Applied Formula:</span>
                (({currentWatts}W - {proposedWatts}W) × {quantity} bulbs × {hoursPerDay}h × {numberOfDays}d) / 1000 ={" "}
                <strong>{results.kwhSaved} kWh</strong>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full mt-2"
                isLoading={isPending}
                onClick={handleSaveSimulation}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save Simulation Run
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
