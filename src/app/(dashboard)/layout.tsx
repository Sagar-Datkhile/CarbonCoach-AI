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

  const userMetadataName =
    (user?.user_metadata?.full_name as string) ||
    (user?.user_metadata?.name as string) ||
    "";

  let userRole = "user";
  let userEmail = user?.email || "";
  let userName = userMetadataName || (userEmail ? userEmail.split("@")[0] : "User");
  let userAvatarUrl =
    (user?.user_metadata?.avatar_url as string) ||
    (user?.user_metadata?.picture as string) ||
    "";

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, full_name, email, avatar_url")
      .eq("id", user.id)
      .maybeSingle();

    if (profile) {
      userRole = profile.role || userRole;
      if (profile.full_name && profile.full_name.trim()) {
        userName = profile.full_name.trim();
      }
      userEmail = profile.email || userEmail;
      if (profile.avatar_url && profile.avatar_url.trim()) {
        userAvatarUrl = profile.avatar_url.trim();
      }
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
          avatarUrl={userAvatarUrl}
        />
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
