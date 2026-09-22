import React from "react";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isDemoSession = cookieStore.get("cc_demo_session")?.value === "active";

  let user = null;
  const isConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

  if (isConfigured) {
    try {
      const supabase = await createClient();
      const res = await supabase.auth.getUser();
      user = res.data?.user || null;
    } catch {
      user = null;
    }
  }

  // Extract user's display name from user_metadata or email
  const metaName =
    (user?.user_metadata?.full_name as string) ||
    (user?.user_metadata?.name as string) ||
    (user?.user_metadata?.display_name as string);

  let userRole =
    (user?.app_metadata?.role as string) ||
    (user?.user_metadata?.role as string) ||
    "user";
  let userEmail = user?.email || (isDemoSession ? "demo@carboncoach.ai" : "user@example.com");
  let userName = metaName || (user?.email ? user.email.split("@")[0] : isDemoSession ? "Demo Evaluator" : "User");
  let userAvatarUrl: string | null =
    (user?.user_metadata?.avatar_url as string) ||
    (user?.user_metadata?.picture as string) ||
    null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (profile) {
      if (profile.full_name && profile.full_name.trim()) {
        userName = profile.full_name.trim();
      }
      if (profile.avatar_url) {
        userAvatarUrl = profile.avatar_url;
      }
      const pRole = (profile as { role?: string }).role;
      if (pRole) {
        userRole = pRole;
      }
      const pEmail = (profile as { email?: string }).email;
      if (pEmail) {
        userEmail = pEmail;
      }
    }
  }

  return (
    <div className="flex min-h-screen bg-[#FAFBF8]">
      {/* Desktop Fixed Sidebar */}
      <div className="hidden md:flex h-screen sticky top-0 shrink-0">
        <AppSidebar
          userRole={userRole}
          userName={userName}
          userEmail={userEmail}
          avatarUrl={userAvatarUrl}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader
          userRole={userRole}
          userEmail={userEmail}
          userName={userName}
          avatarUrl={userAvatarUrl}
        />
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
