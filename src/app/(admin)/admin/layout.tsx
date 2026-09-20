import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  ShieldAlert,
  LayoutDashboard,
  Users,
  Sparkles,
  Leaf,
  FileText,
  Activity,
  ArrowLeft,
  Zap,
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If Supabase is in local/mock testing mode or user is authenticated, check role:
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile || profile.role !== "admin") {
      redirect("/dashboard?error=unauthorized_admin");
    }
  }

  const adminNav = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Registered Users", href: "/admin/users", icon: Users },
    { name: "Recommendation Templates", href: "/admin/templates", icon: Sparkles },
    { name: "Emission Factors", href: "/admin/emissions", icon: Leaf },
    { name: "Extraction Logs", href: "/admin/logs", icon: FileText },
    { name: "System Health", href: "/admin/health", icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-[#FAFBF8] flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-[#111827] text-white flex flex-col justify-between shrink-0">
        <div>
          {/* Admin Header */}
          <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#0B7252] text-white flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-sm tracking-tight text-white block">
                  Admin Portal
                </span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">
                  CarbonCoach Governance
                </span>
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1.5" aria-label="Admin Navigation">
            {adminNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-gray-300 hover:bg-gray-800 hover:text-white transition-colors min-h-[44px]"
                >
                  <Icon className="w-4 h-4 text-gray-400" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Back to User App */}
        <div className="p-4 border-t border-gray-800">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to User Dashboard</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl w-full">
        {children}
      </main>
    </div>
  );
}
