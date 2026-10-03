"use client";

import React, { useState, useTransition } from "react";
import { calculateLightingSavings } from "@/lib/calculations/simulator";
import { recordSimulationRun, deleteSimulationRun } from "@/app/actions/plan";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { formatCurrency, formatKwh, formatEmissions } from "@/lib/utils";
import {
  Zap,
  DollarSign,
  Leaf,
  Sliders,
  Save,
  AlertTriangle,
  RotateCcw,
  Trash2,
  Info,
} from "lucide-react";

export interface BaselineData {
  energyConsumedKwh: number;
  billAmount: number;
  tariffRate: number | null;
  estimatedEmissionsKg: number | null;
  billingPeriodStart: string;
  billingPeriodEnd: string;
}

export interface SavedSimulation {
  id: string;
  simulation_type: string;
  input_parameters: Record<string, unknown>;
  projection_days: number | null;
  calculated_kwh_saving: number;
  calculated_money_saving: number | null;
  calculated_co2_saving_kg: number | null;
  created_at: string;
}

interface LightingSimulatorProps {
  defaultTariff?: number;
  defaultEmissionFactor?: number;
  currency?: string;
  baseline?: BaselineData | null;
  savedSimulations?: SavedSimulation[];
}

export function LightingSimulator({
  defaultTariff = 0.165,
  defaultEmissionFactor = 0.386,
  currency = "USD",
  baseline = null,
  savedSimulations = [],
}: LightingSimulatorProps) {
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savedList, setSavedList] = useState<SavedSimulation[]>(savedSimulations);

  // Input states
  const [currentWatts, setCurrentWatts] = useState(60);
  const [proposedWatts, setProposedWatts] = useState(9);
  const [quantity, setQuantity] = useState(5);
  const [hoursPerDay, setHoursPerDay] = useState(4);
  const [numberOfDays, setNumberOfDays] = useState(365);
  const [tariffRate, setTariffRate] = useState(defaultTariff);
  const [emissionFactor, setEmissionFactor] = useState(defaultEmissionFactor);

  // Validations & sanitizations
  const validCurrentWatts = Math.max(1, currentWatts || 0);
  const validProposedWatts = Math.max(1, proposedWatts || 0);
  const validQuantity = Math.max(1, Math.min(500, quantity || 0));
  const validHours = Math.max(0.1, Math.min(24, hoursPerDay || 0));
  const validDays = Math.max(1, numberOfDays || 0);
  const validTariff = Math.max(0, tariffRate || 0);
  const validFactor = Math.max(0, emissionFactor || 0);

  // Instant deterministic calculation
  const results = calculateLightingSavings({
    currentWatts: validCurrentWatts,
    proposedWatts: validProposedWatts,
    quantity: validQuantity,
    hoursPerDay: validHours,
    numberOfDays: validDays,
    tariffRate: validTariff,
    emissionFactor: validFactor,
  });

  // Calculate simulated monthly equivalent vs baseline monthly if baseline exists
  const simulatedMonthlyKwh = validDays > 0 ? (results.kwhSaved / validDays) * 30 : 0;
  const baselineMonthlyReductionPct =
    baseline && baseline.energyConsumedKwh > 0
      ? Math.min(100, Math.round((simulatedMonthlyKwh / baseline.energyConsumedKwh) * 100))
      : null;

  const handleSaveSimulation = () => {
    startTransition(async () => {
      setSaveSuccess(false);
      setErrorMessage(null);

      const params = {
        currentWatts: validCurrentWatts,
        proposedWatts: validProposedWatts,
        quantity: validQuantity,
        hoursPerDay: validHours,
        numberOfDays: validDays,
        tariffRate: validTariff,
        emissionFactor: validFactor,
      };

      const res = await recordSimulationRun(
        "lighting_replacement",
        params,
        results.kwhSaved,
        results.moneySaved,
        results.co2SavedKg,
        validDays
      );

      if (res.success) {
        setSaveSuccess(true);
        if (res.simulation) {
          const newSimItem: SavedSimulation = {
            id: res.simulation.id,
            simulation_type: res.simulation.simulation_type,
            input_parameters: (res.simulation.input_parameters as Record<string, unknown>) || {},
            projection_days: res.simulation.projection_days ?? null,
            calculated_kwh_saving: Number(res.simulation.calculated_kwh_saving),
            calculated_money_saving:
              res.simulation.calculated_money_saving !== undefined &&
              res.simulation.calculated_money_saving !== null
                ? Number(res.simulation.calculated_money_saving)
                : null,
            calculated_co2_saving_kg:
              res.simulation.calculated_co2_saving_kg !== undefined &&
              res.simulation.calculated_co2_saving_kg !== null
                ? Number(res.simulation.calculated_co2_saving_kg)
                : null,
            created_at: res.simulation.created_at,
          };
          setSavedList((prev) => [newSimItem, ...prev.filter((s) => s.id !== newSimItem.id)]);
        }
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        setErrorMessage(res.error || "Failed to save simulation record");
      }
    });
  };

  const handleDeleteSimulation = async (id: string) => {
    setDeletingId(id);
    setErrorMessage(null);
    const res = await deleteSimulationRun(id);
    setDeletingId(null);
    if (res.success) {
      setSavedList((prev) => prev.filter((s) => s.id !== id));
    } else {
      setErrorMessage(res.error || "Failed to delete simulation run");
    }
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
    setErrorMessage(null);
  };

  return (
    <div className="space-y-8">
      {/* Baseline Status Banner */}
      {baseline ? (
        <div className="p-4 rounded-xl bg-[#EAF5EE] dark:bg-[#063D2E]/40 border border-[#0B7252]/20 dark:border-[#10B981]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#075E45] text-white flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#075E45] dark:text-[#34D399] uppercase tracking-wider block">
                  Confirmed Utility Baseline
                </span>
                <Badge variant="success">Verified Statement</Badge>
              </div>
              <span className="text-sm font-bold text-[#111827] dark:text-[#F9FAFB]">
                {formatKwh(baseline.energyConsumedKwh)} kWh ({formatCurrency(baseline.billAmount, currency)})
              </span>
              <span className="text-xs text-[#667085] dark:text-[#9CA3AF] ml-2">
                Period: {baseline.billingPeriodStart} to {baseline.billingPeriodEnd}
              </span>
            </div>
          </div>
          {baselineMonthlyReductionPct !== null && (
            <div className="text-left sm:text-right">
              <span className="text-xs text-[#667085] dark:text-[#9CA3AF] block">Modeled Monthly Reduction</span>
              <span className="text-sm font-extrabold text-[#075E45] dark:text-[#34D399]">
                ~{baselineMonthlyReductionPct}% of baseline bill
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-[#FAFBF8] dark:bg-[#0E1522] border border-[#E3E7E3] dark:border-[#222F3E] flex items-start gap-3">
          <Info className="w-5 h-5 text-[#667085] dark:text-[#9CA3AF] shrink-0 mt-0.5" />
          <div className="text-xs text-[#667085] dark:text-[#9CA3AF] leading-relaxed">
            <strong className="text-[#111827] dark:text-[#F9FAFB]">No Confirmed Baseline Statement:</strong> You do not currently have a confirmed electricity bill in your profile. Simulation is running with regional standard defaults ({formatCurrency(defaultTariff, currency)}/kWh, {defaultEmissionFactor} kg CO₂e/kWh). Confirm an uploaded bill in Bills to benchmark simulations against your actual household consumption.
          </div>
        </div>
      )}

      {/* Simulation Disclaimer Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF7E8] dark:bg-[#2E2305] border border-[#9A5B00]/30 dark:border-[#FBBF24]/30 flex items-start gap-3.5">
        <AlertTriangle className="w-5 h-5 text-[#9A5B00] dark:text-[#FBBF24] shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-[#9A5B00] dark:text-[#FDE68A] leading-relaxed">
          <strong className="text-[#9A5B00] dark:text-[#FBBF24]">Simulation Disclaimer:</strong> Calculations represent modeled potential savings based on technical fixture ratings and operating parameters, not verified real-world savings. Realized savings are only verified when observed on subsequent utility bills.
        </div>
      </div>

      {saveSuccess && (
        <Alert variant="success" className="animate-in fade-in">
          Simulation run recorded to your historical audit log!
        </Alert>
      )}

      {errorMessage && (
        <Alert variant="error" className="animate-in fade-in">
          {errorMessage}
        </Alert>
      )}

      {/* Main Simulator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card elevated>
            <CardHeader className="pb-4 border-b border-[#F3F8F3] dark:border-[#222F3E]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#EAF5EE] dark:bg-[#063D2E] text-[#075E45] dark:text-[#34D399] flex items-center justify-center">
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
                    <label htmlFor="currWatts" className="text-[#111827] dark:text-[#F9FAFB]">Current Bulb Wattage</label>
                    <span className="text-[#075E45] dark:text-[#34D399] font-bold">{currentWatts} W</span>
                  </div>
                  <input
                    id="currWatts"
                    type="range"
                    min="15"
                    max="150"
                    step="5"
                    value={currentWatts}
                    onChange={(e) => setCurrentWatts(Math.max(1, Number(e.target.value)))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#0B7252]"
                  />
                  <span className="text-[11px] text-[#667085] dark:text-[#9CA3AF] mt-1 block">
                    e.g. Standard Incandescent (60W)
                  </span>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-semibold mb-1">
                    <label htmlFor="propWatts" className="text-[#111827] dark:text-[#F9FAFB]">Proposed Bulb Wattage</label>
                    <span className="text-[#0B7252] dark:text-[#34D399] font-bold">{proposedWatts} W</span>
                  </div>
                  <input
                    id="propWatts"
                    type="range"
                    min="3"
                    max="30"
                    step="1"
                    value={proposedWatts}
                    onChange={(e) => setProposedWatts(Math.max(1, Number(e.target.value)))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#0B7252]"
                  />
                  <span className="text-[11px] text-[#667085] dark:text-[#9CA3AF] mt-1 block">
                    e.g. Energy-Saving LED (9W)
                  </span>
                </div>
              </div>

              {proposedWatts >= currentWatts && (
                <div className="text-xs text-[#9A5B00] dark:text-[#FDE68A] bg-[#FFF7E8] dark:bg-[#2E2305] p-2.5 rounded-lg border border-[#9A5B00]/20 dark:border-[#FBBF24]/30">
                  Notice: Proposed bulb wattage ({proposedWatts}W) should be lower than current wattage ({currentWatts}W) to generate energy savings.
                </div>
              )}

              {/* Quantity and Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold mb-1">
                    <label htmlFor="quantity" className="text-[#111827] dark:text-[#F9FAFB]">Number of Fixtures</label>
                    <span className="text-[#111827] dark:text-[#F9FAFB] font-bold">{quantity} Bulbs</span>
                  </div>
                  <input
                    id="quantity"
                    type="range"
                    min="1"
                    max="40"
                    step="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(500, Number(e.target.value))))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#0B7252]"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-semibold mb-1">
                    <label htmlFor="hours" className="text-[#111827] dark:text-[#F9FAFB]">Daily Operating Hours</label>
                    <span className="text-[#111827] dark:text-[#F9FAFB] font-bold">{hoursPerDay} hrs / day</span>
                  </div>
                  <input
                    id="hours"
                    type="range"
                    min="1"
                    max="24"
                    step="0.5"
                    value={hoursPerDay}
                    onChange={(e) => setHoursPerDay(Math.max(0.1, Math.min(24, Number(e.target.value))))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#0B7252]"
                  />
                </div>
              </div>

              {/* Projection Period */}
              <div>
                <label className="text-xs font-semibold text-[#111827] dark:text-[#F9FAFB] block mb-2">
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
                          : "bg-white dark:bg-[#0E1522] border border-[#E3E7E3] dark:border-[#222F3E] text-[#667085] dark:text-[#9CA3AF] hover:bg-[#F3F8F3] dark:hover:bg-[#1A2333]"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced Parameters */}
              <div className="pt-2 border-t border-[#F3F8F3] dark:border-[#222F3E] grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Electricity Tariff Rate"
                  type="number"
                  step="0.001"
                  min="0"
                  value={tariffRate}
                  onChange={(e) => setTariffRate(Math.max(0, Number(e.target.value)))}
                  helperText={`${currency} per kWh`}
                />
                <Input
                  label="Grid Emission Factor"
                  type="number"
                  step="0.001"
                  min="0"
                  value={emissionFactor}
                  onChange={(e) => setEmissionFactor(Math.max(0, Number(e.target.value)))}
                  helperText="kg CO₂e per kWh"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card elevated className="border-[#0B7252]/30 dark:border-[#10B981]/30 bg-gradient-to-br from-white to-[#F3F8F3] dark:from-[#151D2A] dark:to-[#0E1522]">
            <CardHeader className="pb-3 border-b border-[#E3E7E3] dark:border-[#222F3E]">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Calculated Potential Impact</CardTitle>
                <Badge variant="success">Deterministic</Badge>
              </div>
              <CardDescription>
                Over {validDays} days projection period
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              <div className="p-4 rounded-xl bg-white dark:bg-[#0E1522] border border-[#E3E7E3] dark:border-[#222F3E] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#667085] dark:text-[#9CA3AF] block uppercase font-semibold">
                    Potential Energy Saved
                  </span>
                  <span className="text-3xl font-extrabold text-[#075E45] dark:text-[#34D399] tabular-nums mt-0.5 block">
                    {formatKwh(results.kwhSaved)} <span className="text-sm text-[#667085] dark:text-[#9CA3AF]">kWh</span>
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#EAF5EE] dark:bg-[#063D2E] text-[#075E45] dark:text-[#34D399] flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-[#0E1522] border border-[#E3E7E3] dark:border-[#222F3E] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#667085] dark:text-[#9CA3AF] block uppercase font-semibold">
                    Potential Money Saved
                  </span>
                  <span className="text-3xl font-extrabold text-[#111827] dark:text-[#F9FAFB] tabular-nums mt-0.5 block">
                    {formatCurrency(results.moneySaved, currency)}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#EAF5EE] dark:bg-[#063D2E] text-[#0B7252] dark:text-[#34D399] flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-[#0E1522] border border-[#E3E7E3] dark:border-[#222F3E] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#667085] dark:text-[#9CA3AF] block uppercase font-semibold">
                    Emissions Avoided
                  </span>
                  <span className="text-2xl font-extrabold text-[#0B7252] dark:text-[#34D399] tabular-nums mt-0.5 block">
                    {formatEmissions(results.co2SavedKg)}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#EAF5EE] dark:bg-[#063D2E] text-[#0B7252] dark:text-[#34D399] flex items-center justify-center">
                  <Leaf className="w-5 h-5" />
                </div>
              </div>

              {/* Formula Transparency Box */}
              <div className="p-3 rounded-xl bg-[#FAFBF8] dark:bg-[#0E1522] border border-[#E3E7E3] dark:border-[#222F3E] text-[11px] text-[#667085] dark:text-[#9CA3AF] leading-relaxed">
                <span className="font-bold text-[#111827] dark:text-[#F9FAFB] block mb-0.5">Applied Formula:</span>
                (({validCurrentWatts}W - {validProposedWatts}W) × {validQuantity} bulbs × {validHours}h × {validDays}d) / 1000 ={" "}
                <strong className="text-[#111827] dark:text-[#F9FAFB]">{results.kwhSaved} kWh</strong>
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

      {/* Saved Simulations Audit Log Table */}
      {/* Saved Simulations Audit Log Table */}
      <Card elevated>
        <CardHeader className="pb-3 border-b border-[#F3F8F3] dark:border-[#222F3E]">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg text-[#111827] dark:text-[#F9FAFB]">Saved Simulation Scenarios</CardTitle>
              <CardDescription className="text-[#667085] dark:text-[#9CA3AF]">
                Audit history of your calculated what-if simulations
              </CardDescription>
            </div>
            <Badge variant="neutral">{savedList.length} Saved</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          {savedList.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#667085] dark:text-[#9CA3AF]">
              No saved simulations yet. Adjust variables above and click <strong>&quot;Save Simulation Run&quot;</strong> to record a scenario for comparison.
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAFBF8] dark:bg-[#0E1522] border-b border-[#E3E7E3] dark:border-[#222F3E] text-[#667085] dark:text-[#9CA3AF] text-xs uppercase font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Scenario Type</th>
                  <th className="px-5 py-3.5">Parameters</th>
                  <th className="px-5 py-3.5 text-center">Horizon</th>
                  <th className="px-5 py-3.5 text-right">Potential kWh</th>
                  <th className="px-5 py-3.5 text-right">Potential Savings</th>
                  <th className="px-5 py-3.5 text-right">Emissions Avoided</th>
                  <th className="px-5 py-3.5 text-right">Saved Date</th>
                  <th className="px-5 py-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E7E3] dark:divide-[#222F3E]">
                {savedList.map((sim) => {
                  const p = (sim.input_parameters as Record<string, unknown>) || {};
                  return (
                    <tr key={sim.id} className="hover:bg-[#FAFBF8]/70 dark:hover:bg-[#1A2436]/60 transition-colors">
                      <td className="px-5 py-3.5 font-semibold text-[#111827] dark:text-[#F9FAFB]">
                        {sim.simulation_type === "lighting_replacement"
                          ? "Lighting Upgrade"
                          : sim.simulation_type}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-[#667085] dark:text-[#9CA3AF]">
                        {p.quantity ? `${p.quantity} fixtures` : ""}{" "}
                        {p.currentWatts && p.proposedWatts ? `(${p.currentWatts}W → ${p.proposedWatts}W)` : ""}{" "}
                        {p.hoursPerDay ? `@ ${p.hoursPerDay}h/d` : ""}
                      </td>
                      <td className="px-5 py-3.5 text-center text-xs text-[#667085] dark:text-[#9CA3AF]">
                        {sim.projection_days || 365} days
                      </td>
                      <td className="px-5 py-3.5 text-right font-bold text-[#075E45] dark:text-[#34D399] tabular-nums">
                        {formatKwh(sim.calculated_kwh_saving)} kWh
                      </td>
                      <td className="px-5 py-3.5 text-right font-semibold text-[#111827] dark:text-[#F9FAFB] tabular-nums">
                        {formatCurrency(sim.calculated_money_saving || 0, currency)}
                      </td>
                      <td className="px-5 py-3.5 text-right text-xs text-[#0B7252] dark:text-[#34D399] font-semibold tabular-nums">
                        {formatEmissions(sim.calculated_co2_saving_kg || 0)}
                      </td>
                      <td className="px-5 py-3.5 text-right text-xs text-[#667085] dark:text-[#9CA3AF]">
                        {new Date(sim.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={deletingId === sim.id}
                          isLoading={deletingId === sim.id}
                          onClick={() => handleDeleteSimulation(sim.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 p-1.5"
                          title="Delete simulation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

