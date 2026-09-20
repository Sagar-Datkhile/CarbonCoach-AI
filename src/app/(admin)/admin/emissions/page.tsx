import React from "react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toggleEmissionFactorStatus, createEmissionFactor } from "@/app/actions/admin";
import { Leaf, Plus } from "lucide-react";

export const metadata = {
  title: "Emission Factors — Admin Portal",
};

export default async function AdminEmissionsPage() {
  const supabase = await createClient();

  const { data: factors } = await supabase
    .from("emission_factors")
    .select("*")
    .order("region_name", { ascending: true });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#111827]">
          Regional Emission Factors
        </h1>
        <p className="text-sm text-[#667085] mt-1">
          Configure regional grid carbon intensities (kg CO₂e per kWh) and default tariff rates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Factors Table */}
        <div className="lg:col-span-2">
          <Card elevated>
            <CardHeader className="pb-3 border-b border-[#F3F8F3]">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Configured Regional Factors</CardTitle>
                <Badge variant="neutral">{factors?.length || 0} Total</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#FAFBF8] border-b border-[#E3E7E3] text-[#667085] text-xs uppercase font-semibold">
                  <tr>
                    <th className="px-5 py-3.5">Region</th>
                    <th className="px-5 py-3.5 text-right">Factor (kg/kWh)</th>
                    <th className="px-5 py-3.5 text-right">Default Tariff</th>
                    <th className="px-5 py-3.5 text-center">Status</th>
                    <th className="px-5 py-3.5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3E7E3]">
                  {factors && factors.length > 0 ? (
                    factors.map((factor) => (
                      <tr key={factor.id} className="hover:bg-[#FAFBF8]/70">
                        <td className="px-5 py-4">
                          <div className="font-semibold text-[#111827]">{factor.region_name}</div>
                          <div className="text-xs text-[#667085] font-mono">{factor.region_code}</div>
                        </td>
                        <td className="px-5 py-4 text-right font-bold text-[#0B7252] tabular-nums">
                          {factor.factor_kg_co2e_per_kwh}
                        </td>
                        <td className="px-5 py-4 text-right tabular-nums text-[#111827]">
                          {factor.currency_code} {factor.default_tariff_per_kwh}
                        </td>
                        <td className="px-5 py-4 text-center">
                          <Badge variant={factor.is_active ? "success" : "neutral"}>
                            {factor.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <form
                            action={async () => {
                              "use server";
                              await toggleEmissionFactorStatus(factor.id, factor.is_active);
                            }}
                          >
                            <Button
                              type="submit"
                              variant="outline"
                              size="sm"
                              className="text-xs"
                            >
                              {factor.is_active ? "Deactivate" : "Activate"}
                            </Button>
                          </form>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-xs text-[#667085]">
                        No emission factors found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Create Form */}
        <div>
          <Card elevated>
            <CardHeader className="pb-3 border-b border-[#F3F8F3]">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#0B7252]" />
                <CardTitle className="text-base">Add Emission Factor</CardTitle>
              </div>
              <CardDescription>Register a new grid intensity baseline</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <form action={createEmissionFactor} className="space-y-4">
                <Input label="Region Code" name="regionCode" required placeholder="e.g. UK_AVG" />
                <Input label="Region Name" name="regionName" required placeholder="e.g. United Kingdom Grid" />
                <Input
                  label="Factor (kg CO₂e per kWh)"
                  name="factor"
                  type="number"
                  step="0.0001"
                  required
                  placeholder="e.g. 0.2100"
                />
                <Input
                  label="Default Tariff Rate"
                  name="defaultTariff"
                  type="number"
                  step="0.0001"
                  required
                  placeholder="e.g. 0.28"
                />
                <Input label="Currency Code" name="currencyCode" required placeholder="GBP" />

                <Button type="submit" variant="primary" size="md" className="w-full">
                  Save Emission Factor
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
