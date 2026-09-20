import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { MetricCard } from "@/components/ui/MetricCard";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Users,
  Receipt,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
  TrendingUp,
  Activity,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "Admin Dashboard — CarbonCoach AI",
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Queries for platform-level metrics
  const [{ count: userCount }, { count: billCount }, { count: successLogCount }, { count: failLogCount }, { count: planCount }, { count: completedActionCount }] =
    await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("electricity_bills").select("*", { count: "exact", head: true }).eq("status", "confirmed"),
      supabase.from("bill_extraction_logs").select("*", { count: "exact", head: true }).eq("status", "success"),
      supabase.from("bill_extraction_logs").select("*", { count: "exact", head: true }).eq("status", "failed"),
      supabase.from("user_actions").select("*", { count: "exact", head: true }).eq("status", "planned"),
      supabase.from("user_actions").select("*", { count: "exact", head: true }).eq("status", "completed"),
    ]);

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#111827]">
            Platform Governance & Diagnostics
          </h1>
          <p className="text-sm text-[#667085] mt-1">
            Real-time platform statistics, user growth, extraction reliability, and template management.
          </p>
        </div>

        <Link href="/admin/health">
          <Button variant="outline" size="md" leftIcon={<Activity className="w-4 h-4 text-[#0B7252]" />}>
            Inspect System Health
          </Button>
        </Link>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Total Registered Users"
          value={userCount || 0}
          subtitle="Household profiles"
          icon={<Users className="w-5 h-5" />}
        />

        <MetricCard
          title="Total Confirmed Bills"
          value={billCount || 0}
          subtitle="Authoritative statements"
          icon={<Receipt className="w-5 h-5" />}
        />

        <MetricCard
          title="AI Extraction Success Rate"
          value={
            (successLogCount || 0) + (failLogCount || 0) > 0
              ? `${Math.round(
                  ((successLogCount || 0) /
                    ((successLogCount || 0) + (failLogCount || 0))) *
                    100
                )}%`
              : "100%"
          }
          subtitle={`${successLogCount || 0} passed / ${failLogCount || 0} failed`}
          icon={<CheckCircle2 className="w-5 h-5" />}
        />

        <MetricCard
          title="Extraction Failures"
          value={failLogCount || 0}
          subtitle="Logged OCR errors"
          icon={<AlertOctagon className="w-5 h-5" />}
        />

        <MetricCard
          title="Active Saved Plans"
          value={planCount || 0}
          subtitle="Planned household actions"
          icon={<Sparkles className="w-5 h-5" />}
        />

        <MetricCard
          title="Completed Actions"
          value={completedActionCount || 0}
          subtitle="User-reported completions"
          icon={<TrendingUp className="w-5 h-5" />}
        />
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card elevated className="hover:border-[#0B7252]/40 transition-colors">
          <CardHeader>
            <CardTitle className="text-base">Recommendation Templates</CardTitle>
            <CardDescription>
              Manage baseline templates, eligibility criteria, and modeled savings parameters.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/templates">
              <Button variant="primary" size="sm" className="w-full">
                Manage Templates
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card elevated className="hover:border-[#0B7252]/40 transition-colors">
          <CardHeader>
            <CardTitle className="text-base">Emission Factors</CardTitle>
            <CardDescription>
              Configure regional grid carbon intensities (kg CO₂e/kWh) and default tariffs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/emissions">
              <Button variant="primary" size="sm" className="w-full">
                Configure Emissions
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card elevated className="hover:border-[#0B7252]/40 transition-colors">
          <CardHeader>
            <CardTitle className="text-base">Extraction Audit Logs</CardTitle>
            <CardDescription>
              Inspect raw Gemini AI extraction payloads, latency metrics, and failure diagnostics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/logs">
              <Button variant="primary" size="sm" className="w-full">
                View Extraction Logs
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
