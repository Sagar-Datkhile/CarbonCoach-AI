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
  Zap,
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
        "w-64 bg-white border-r border-[#E3E7E3] flex flex-col justify-between h-full select-none",
        className
      )}
    >
      {/* Brand Header & Main Navigation */}
      <div className="flex-1 overflow-y-auto">
        {/* Brand Header */}
        <div className="p-6 pb-4 flex items-center gap-3 border-b border-[#F3F8F3]">
          <div className="w-10 h-10 rounded-xl bg-[#075E45] text-white flex items-center justify-center shadow-xs shrink-0">
            <Zap className="w-5 h-5 fill-current text-[#EAF5EE]" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base text-[#075E45] tracking-tight">
              CarbonCoach<span className="text-[#0B7252]">.AI</span>
            </span>
            <span className="text-[11px] text-[#667085] font-medium uppercase tracking-wider">
              Household Energy
            </span>
          </div>
        </div>

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
                    ? "bg-[#EAF5EE] text-[#075E45] shadow-xs font-bold"
                    : "text-[#667085] hover:bg-[#F3F8F3] hover:text-[#111827]"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 shrink-0 transition-colors",
                    isActive ? "text-[#0B7252]" : "text-[#667085]"
                  )}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sticky Bottom-Left Profile & Account Navigation */}
      <div className="p-3 border-t border-[#E3E7E3] bg-white sticky bottom-0 z-20">
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
