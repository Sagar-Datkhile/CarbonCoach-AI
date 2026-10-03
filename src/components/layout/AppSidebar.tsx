"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Receipt,
  Sparkles,
  Sliders,
  TrendingUp,
  ShieldAlert,
} from "lucide-react";
import { ProfileDropdown } from "./ProfileDropdown";

interface AppSidebarProps {
  userRole?: string;
  userName?: string;
  userEmail?: string;
  avatarUrl?: string | null;
  onNavigate?: () => void;
  className?: string;
}

export function AppSidebar({
  userRole = "user",
  userName = "User",
  userEmail = "",
  avatarUrl = null,
  onNavigate,
  className,
}: AppSidebarProps) {
  const pathname = usePathname();

  // Navigation order preserved strictly: Dashboard, Bills, My Plan, Simulator, Progress
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Bills", href: "/bills", icon: Receipt },
    { name: "My Plan", href: "/plan", icon: Sparkles },
    { name: "Simulator", href: "/simulator", icon: Sliders },
    { name: "Progress", href: "/progress", icon: TrendingUp },
  ];

  if (userRole === "admin") {
    navigation.push({ name: "Admin Portal", href: "/admin", icon: ShieldAlert });
  }

  return (
    <aside
      className={cn(
        "w-64 bg-white dark:bg-[#0D1520] border-r border-[#E3E7E3] dark:border-[#222F3E] flex flex-col justify-between h-full select-none",
        className
      )}
    >
      {/* Brand Header & Main Navigation */}
      <div className="flex-1 overflow-y-auto">
        {/* Brand Header */}
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="p-6 pb-4 flex items-center gap-3 border-b border-[#F3F8F3] dark:border-[#222F3E] hover:opacity-95 transition-opacity group"
        >
          <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#151D2A] border border-[#E3E7E3] dark:border-[#222F3E] overflow-hidden flex items-center justify-center shadow-xs shrink-0 p-1 group-hover:border-[#075E45]/40 dark:group-hover:border-[#10B981]/40 transition-colors">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Carbon Coach Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base text-[#075E45] dark:text-[#34D399] tracking-tight group-hover:text-[#0B7252] dark:group-hover:text-[#10B981] transition-colors">
              Carbon Coach
            </span>
            <span className="text-[11px] text-[#667085] dark:text-[#9CA3AF] font-medium uppercase tracking-wider">
              Green Energy Intelligence
            </span>
          </div>
        </Link>

        {/* Main Navigation Links */}
        <nav className="p-4 space-y-1.5" aria-label="Main Navigation">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px]",
                  isActive
                    ? "bg-[#EAF5EE] dark:bg-[#063D2E] text-[#075E45] dark:text-[#34D399] shadow-xs font-bold"
                    : "text-[#667085] dark:text-[#9CA3AF] hover:bg-[#F3F8F3] dark:hover:bg-[#151D2A] hover:text-[#111827] dark:hover:text-[#F9FAFB]"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 shrink-0 transition-colors",
                    isActive ? "text-[#0B7252] dark:text-[#34D399]" : "text-[#667085] dark:text-[#9CA3AF]"
                  )}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sticky Bottom-Left Profile & Account Navigation */}
      <div className="p-3 border-t border-[#E3E7E3] dark:border-[#222F3E] bg-white dark:bg-[#0D1520] sticky bottom-0 z-20">
        <ProfileDropdown
          userName={userName}
          userEmail={userEmail}
          avatarUrl={avatarUrl}
          userRole={userRole}
          onNavigate={onNavigate}
        />
      </div>
    </aside>
  );
}
