import React from "react";
import { createClient } from "@/lib/supabase/server";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userRole = "user";
  let userName = "Household User";
  let userEmail = user?.email || "user@example.com";

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, full_name, email")
      .eq("id", user.id)
      .maybeSingle();

    if (profile) {
      userRole = profile.role || "user";
      userName = profile.full_name || userName;
      userEmail = profile.email || userEmail;
    }
  }

  return (
    <div className="flex min-h-screen bg-[#FAFBF8]">
      {/* Desktop Fixed Sidebar */}
      <div className="hidden md:flex h-screen sticky top-0 shrink-0">
        <AppSidebar userRole={userRole} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader
          userRole={userRole}
          userEmail={userEmail}
          userName={userName}
        />
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
