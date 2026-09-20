import React from "react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toggleTemplateStatus, createTemplate } from "@/app/actions/admin";
import { formatKwh } from "@/lib/utils";
import { Sparkles, Plus } from "lucide-react";

export const metadata = {
  title: "Recommendation Templates — Admin Portal",
};

export default async function AdminTemplatesPage() {
  const supabase = await createClient();

  const { data: templates } = await supabase
    .from("recommendation_templates")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#111827]">
          Recommendation Templates
        </h1>
        <p className="text-sm text-[#667085] mt-1">
          Govern baseline energy-saving actions, eligibility filters, and mathematical reduction estimates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Templates Table */}
        <div className="lg:col-span-2">
          <Card elevated>
            <CardHeader className="pb-3 border-b border-[#F3F8F3]">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Active & Draft Templates</CardTitle>
                <Badge variant="neutral">{templates?.length || 0} Total</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#FAFBF8] border-b border-[#E3E7E3] text-[#667085] text-xs uppercase font-semibold">
                  <tr>
                    <th className="px-5 py-3.5">Template</th>
                    <th className="px-5 py-3.5">Category</th>
                    <th className="px-5 py-3.5 text-right">Saving (kWh)</th>
                    <th className="px-5 py-3.5 text-center">Status</th>
                    <th className="px-5 py-3.5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3E7E3]">
                  {templates && templates.length > 0 ? (
                    templates.map((tpl) => (
                      <tr key={tpl.id} className="hover:bg-[#FAFBF8]/70">
                        <td className="px-5 py-4">
                          <div className="font-semibold text-[#111827]">{tpl.title}</div>
                          <div className="text-xs text-[#667085] line-clamp-1">{tpl.description}</div>
                        </td>
                        <td className="px-5 py-4">
                          <Badge variant="neutral" className="capitalize">{tpl.category}</Badge>
                        </td>
                        <td className="px-5 py-4 text-right font-bold text-[#075E45] tabular-nums">
                          {formatKwh(tpl.estimated_kwh_reduction_annual)}/yr
                        </td>
                        <td className="px-5 py-4 text-center">
                          <Badge variant={tpl.is_active ? "success" : "neutral"}>
                            {tpl.is_active ? "Active" : "Disabled"}
                          </Badge>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <form
                            action={async () => {
                              "use server";
                              await toggleTemplateStatus(tpl.id, tpl.is_active);
                            }}
                          >
                            <Button
                              type="submit"
                              variant="outline"
                              size="sm"
                              className="text-xs"
                            >
                              {tpl.is_active ? "Disable" : "Enable"}
                            </Button>
                          </form>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-xs text-[#667085]">
                        No templates found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Create New Template Form */}
        <div>
          <Card elevated>
            <CardHeader className="pb-3 border-b border-[#F3F8F3]">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#0B7252]" />
                <CardTitle className="text-base">Create Template</CardTitle>
              </div>
              <CardDescription>Add a new verified energy reduction action</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <form action={createTemplate} className="space-y-4">
                <Input label="Title" name="title" required placeholder="e.g. Smart Plug Deployment" />
                <Input label="Description" name="description" required placeholder="Detailed action steps" />

                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-semibold text-[#111827]">Category</label>
                  <select
                    name="category"
                    defaultValue="electricity"
                    className="w-full min-h-[44px] px-3 py-2 text-sm rounded-lg bg-white border border-[#E3E7E3] text-[#111827] focus:outline-none focus:border-[#0B7252]"
                  >
                    <option value="electricity">Electricity</option>
                    <option value="appliances">Appliances</option>
                    <option value="habits">Habits</option>
                    <option value="heating">Heating</option>
                  </select>
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-semibold text-[#111827]">Difficulty</label>
                  <select
                    name="difficulty"
                    defaultValue="Easy"
                    className="w-full min-h-[44px] px-3 py-2 text-sm rounded-lg bg-white border border-[#E3E7E3] text-[#111827] focus:outline-none focus:border-[#0B7252]"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <Input
                  label="Estimated Annual Saving (kWh)"
                  name="estimatedKwh"
                  type="number"
                  step="0.1"
                  required
                  placeholder="e.g. 150"
                />

                <Input
                  label="Estimated Upfront Cost ($)"
                  name="upfrontCost"
                  type="number"
                  step="0.01"
                  required
                  placeholder="e.g. 25"
                />

                <Button type="submit" variant="primary" size="md" className="w-full">
                  Create Template
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
