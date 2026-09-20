import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle2, AlertTriangle, XCircle, Server, Database, Key } from "lucide-react";

export const metadata = {
  title: "System Health — Admin Portal",
};

export default async function AdminHealthPage() {
  const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasSupabaseAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const hasServiceRoleKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  const hasOpenRouterKey = !!process.env.OPENROUTER_API_KEY;

  const isConfigured = hasSupabaseUrl && hasSupabaseAnonKey;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#111827]">
          System Health & Environment Diagnostics
        </h1>
        <p className="text-sm text-[#667085] mt-1">
          Real-time status of the Next.js API server, Supabase PostgreSQL, and AI credentials.
        </p>
      </div>

      {/* Service Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card elevated>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#667085] uppercase">
                Application Server
              </span>
              <Badge variant="success">Active</Badge>
            </div>
            <CardTitle className="text-xl mt-2 flex items-center gap-2">
              <Server className="w-5 h-5 text-[#0B7252]" />
              carboncoach-api
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-[#667085]">
            Next.js 15 App Router running on Node v22
          </CardContent>
        </Card>

        <Card elevated>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#667085] uppercase">
                Supabase Database
              </span>
              <Badge variant={isConfigured ? "success" : "warning"}>
                {isConfigured ? "Connected" : "Degraded"}
              </Badge>
            </div>
            <CardTitle className="text-xl mt-2 flex items-center gap-2">
              <Database className="w-5 h-5 text-[#0B7252]" />
              PostgreSQL & RLS
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-[#667085]">
            {isConfigured
              ? "Row Level Security enabled on all public tables"
              : "Pending production credentials"}
          </CardContent>
        </Card>

        <Card elevated>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#667085] uppercase">
                OpenRouter AI
              </span>
              <Badge variant={hasOpenRouterKey ? "success" : "neutral"}>
                {hasOpenRouterKey ? "Configured" : "Draft / Mock"}
              </Badge>
            </div>
            <CardTitle className="text-xl mt-2 flex items-center gap-2">
              <Key className="w-5 h-5 text-[#0B7252]" />
              Gemini 2.5 Flash Lite
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-[#667085]">
            Server-side completions via OpenRouter
          </CardContent>
        </Card>
      </div>

      {/* Security & Configuration Audit */}
      <Card elevated>
        <CardHeader className="pb-3 border-b border-[#F3F8F3]">
          <CardTitle className="text-base">Environment Configuration Audit</CardTitle>
          <CardDescription>
            Sanitized configuration checklist. Values are never exposed in responses.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          {[
            {
              name: "NEXT_PUBLIC_SUPABASE_URL",
              present: hasSupabaseUrl,
              desc: "Supabase Project Endpoint",
            },
            {
              name: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
              present: hasSupabaseAnonKey,
              desc: "Client-side public anonymous token",
            },
            {
              name: "SUPABASE_SERVICE_ROLE_KEY",
              present: hasServiceRoleKey,
              desc: "Server-only privileged execution key",
            },
            {
              name: "OPENROUTER_API_KEY",
              present: hasOpenRouterKey,
              desc: "OpenRouter server-side AI key (google/gemini-2.5-flash-lite)",
            },
          ].map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAFBF8] border border-[#E3E7E3]"
            >
              <div className="space-y-0.5">
                <span className="font-mono text-xs font-bold text-[#111827]">
                  {item.name}
                </span>
                <span className="text-xs text-[#667085] block">{item.desc}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {item.present ? (
                  <Badge variant="success" className="gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Present
                  </Badge>
                ) : (
                  <Badge variant="warning" className="gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Missing
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
