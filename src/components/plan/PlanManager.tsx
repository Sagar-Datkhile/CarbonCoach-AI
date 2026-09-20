"use client";

import React, { useState, useTransition } from "react";
import { addTemplateToPlan, toggleActionCompletion, removeActionFromPlan } from "@/app/actions/plan";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { formatCurrency, formatKwh } from "@/lib/utils";
import {
  Sparkles,
  Plus,
  CheckCircle2,
  Trash2,
  Home,
  DollarSign,
  Filter,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface TemplateItem {
  id: string;
  title: string;
  description: string;
  category: string;
  applicable_home_types: string[];
  applicable_budget_tiers: string[];
  difficulty: string;
  estimated_kwh_reduction_annual: number;
  estimated_percent_reduction: number;
  upfront_cost_estimate: number;
}

interface UserActionItem {
  id: string;
  template_id: string | null;
  custom_title: string | null;
  status: "planned" | "completed" | "in_progress" | "dismissed";
  estimated_kwh_saving: number;
  estimated_cost_saving: number;
  estimated_co2_saving: number;
  completed_at: string | null;
}

interface PlanManagerProps {
  templates: TemplateItem[];
  userActions: UserActionItem[];
  household: {
    homeType: string;
    budgetTier: string;
    preferredCurrency: string;
  };
}

export function PlanManager({ templates, userActions, household }: PlanManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<"catalog" | "my-plan">("catalog");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Planned template IDs
  const plannedTemplateIds = new Set(
    userActions.map((a) => a.template_id).filter(Boolean)
  );

  // Filter templates by household eligibility and selected category
  const filteredTemplates = templates.filter((t) => {
    const matchesCategory =
      selectedCategory === "all" || t.category === selectedCategory;

    // Household homeType eligibility check
    const matchesHomeType =
      t.applicable_home_types.includes(household.homeType) ||
      t.applicable_home_types.includes("Shared");

    return matchesCategory && matchesHomeType;
  });

  const handleAdd = (templateId: string) => {
    startTransition(async () => {
      const res = await addTemplateToPlan(templateId);
      if (res.success) {
        setStatusMessage("Action added to your plan!");
      }
    });
  };

  const handleToggle = (actionId: string, currentStatus: "planned" | "completed" | "in_progress" | "dismissed") => {
    startTransition(async () => {
      await toggleActionCompletion(actionId, currentStatus);
    });
  };

  const handleRemove = (actionId: string) => {
    startTransition(async () => {
      await removeActionFromPlan(actionId);
    });
  };

  const categories = [
    { id: "all", label: "All Categories" },
    { id: "electricity", label: "Electricity & Lighting" },
    { id: "appliances", label: "Appliances" },
    { id: "habits", label: "Zero-Cost Habits" },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner with Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#111827]">
            Energy Reduction Plan
          </h1>
          <p className="text-sm text-[#667085] mt-1">
            Personalized, budget-aligned recommendations filtered for your <strong>{household.homeType}</strong> home.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success">
            Budget Tier: {household.budgetTier}
          </Badge>
          <Badge variant="neutral">
            {userActions.filter((a) => a.status === "completed").length} Done / {userActions.length} Planned
          </Badge>
        </div>
      </div>

      {statusMessage && (
        <Alert variant="success" className="animate-in fade-in">
          {statusMessage}
        </Alert>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-[#E3E7E3] pb-1">
        <button
          type="button"
          onClick={() => setActiveTab("catalog")}
          className={`pb-3 px-1 text-sm font-bold transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === "catalog"
              ? "border-[#0B7252] text-[#075E45]"
              : "border-transparent text-[#667085] hover:text-[#111827]"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Recommended Actions ({filteredTemplates.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("my-plan")}
          className={`pb-3 px-1 text-sm font-bold transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === "my-plan"
              ? "border-[#0B7252] text-[#075E45]"
              : "border-transparent text-[#667085] hover:text-[#111827]"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          My Active Plan ({userActions.length})
        </button>
      </div>

      {/* Category Filter Chips */}
      {activeTab === "catalog" && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-[#667085] mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                selectedCategory === cat.id
                  ? "bg-[#075E45] text-white shadow-xs"
                  : "bg-white border border-[#E3E7E3] text-[#667085] hover:bg-[#F3F8F3]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Content: Recommended Actions Catalog */}
      {activeTab === "catalog" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTemplates.map((template) => {
            const isAlreadyPlanned = plannedTemplateIds.has(template.id);
            const estimatedCostSaving = (template.estimated_kwh_reduction_annual * 0.165).toFixed(0);

            return (
              <Card
                key={template.id}
                elevated
                className="flex flex-col justify-between hover:border-[#0B7252]/40 transition-all"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge variant="primary" className="capitalize">
                      {template.category}
                    </Badge>
                    <Badge variant="neutral">
                      {template.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg text-[#111827]">
                    {template.title}
                  </CardTitle>
                  <CardDescription className="leading-relaxed">
                    {template.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0 space-y-4">
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#FAFBF8] border border-[#E3E7E3] text-xs">
                    <div>
                      <span className="text-[#667085] block">Annual Saving</span>
                      <span className="font-extrabold text-[#075E45] text-sm tabular-nums">
                        {formatKwh(template.estimated_kwh_reduction_annual)} kWh / yr
                      </span>
                    </div>
                    <div>
                      <span className="text-[#667085] block">Est. Financial</span>
                      <span className="font-extrabold text-[#111827] text-sm tabular-nums">
                        ~${estimatedCostSaving} / yr
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#F3F8F3]">
                    <span className="text-xs text-[#667085]">
                      Cost: {template.upfront_cost_estimate > 0 ? `$${template.upfront_cost_estimate}` : "Free ($0)"}
                    </span>

                    {isAlreadyPlanned ? (
                      <Button variant="secondary" size="sm" disabled leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}>
                        In Your Plan
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        isLoading={isPending}
                        onClick={() => handleAdd(template.id)}
                        leftIcon={<Plus className="w-3.5 h-3.5" />}
                      >
                        Add to Plan
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Content: My Active Plan */}
      {activeTab === "my-plan" && (
        <div className="space-y-4">
          {userActions.length === 0 ? (
            <Card elevated className="p-8 text-center">
              <Sparkles className="w-10 h-10 text-[#0B7252] mx-auto mb-3" />
              <CardTitle className="text-lg mb-1">Your plan is currently empty</CardTitle>
              <CardDescription className="max-w-md mx-auto mb-4">
                Explore recommended actions tailored to your household characteristics and add them to your plan.
              </CardDescription>
              <Button variant="primary" size="md" onClick={() => setActiveTab("catalog")}>
                Browse Recommendations
              </Button>
            </Card>
          ) : (
            userActions.map((action) => {
              const isDone = action.status === "completed";

              return (
                <Card
                  key={action.id}
                  elevated
                  className={`p-5 transition-all ${
                    isDone ? "bg-[#EAF5EE]/40 border-[#0B7252]/30" : "bg-white border-[#E3E7E3]"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => handleToggle(action.id, action.status)}
                        className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          isDone
                            ? "bg-[#0B7252] border-[#0B7252] text-white"
                            : "border-[#E3E7E3] bg-white hover:border-[#0B7252]"
                        }`}
                      >
                        {isDone && <CheckCircle2 className="w-4 h-4" />}
                      </button>

                      <div>
                        <h4 className={`text-base font-bold text-[#111827] ${isDone ? "line-through opacity-75" : ""}`}>
                          {action.custom_title || "Household Energy Action"}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-[#667085] mt-1">
                          <span className="font-semibold text-[#075E45] tabular-nums">
                            {formatKwh(action.estimated_kwh_saving)} kWh / yr
                          </span>
                          <span>•</span>
                          <span>Est. ~${action.estimated_cost_saving} / yr</span>
                          {action.completed_at && (
                            <>
                              <span>•</span>
                              <span className="text-[#0B7252] font-semibold">
                                Completed on {new Date(action.completed_at).toLocaleDateString()}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <Button
                        variant={isDone ? "outline" : "primary"}
                        size="sm"
                        disabled={isPending}
                        onClick={() => handleToggle(action.id, action.status)}
                      >
                        {isDone ? "Mark Planned" : "Mark Complete"}
                      </Button>

                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => handleRemove(action.id)}
                        className="p-2 rounded-lg text-[#667085] hover:text-[#B42318] hover:bg-[#FEE4E2] transition-colors"
                        aria-label="Remove action"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
