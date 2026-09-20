"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "@/app/actions/auth";
import {
  LayoutDashboard,
  Receipt,
  Sparkles,
  Sliders,
  TrendingUp,
  User,
  ShieldAlert,
  LogOut,
  Zap,
} from "lucide-react";

interface AppSidebarProps {
  userRole?: string;
  onNavigate?: () => void;
  className?: string;
}

export function AppSidebar({ userRole = "user", onNavigate, className }: AppSidebarProps) {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Bills", href: "/bills", icon: Receipt },
    { name: "My Plan", href: "/plan", icon: Sparkles },
    { name: "Simulator", href: "/simulator", icon: Sliders },
    { name: "Progress", href: "/progress", icon: TrendingUp },
    { name: "Profile & Settings", href: "/profile", icon: User },
  ];

  if (userRole === "admin") {
    navigation.push({ name: "Admin Portal", href: "/admin", icon: ShieldAlert });
  }

  return (
    <aside
      className={cn(
        "w-64 bg-white border-r border-[#E3E7E3] flex flex-col justify-between h-full",
        className
      )}
    >
      {/* Brand Header */}
      <div>
        <div className="p-6 pb-4 flex items-center gap-3 border-b border-[#F3F8F3]">
          <div className="w-10 h-10 rounded-xl bg-[#075E45] text-white flex items-center justify-center shadow-sm shrink-0">
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

        {/* Navigation Links */}
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

      {/* Footer / Sign Out */}
      <div className="p-4 border-t border-[#E3E7E3]">
        <form action={signOut}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#667085] hover:bg-[#FFF7E8] hover:text-[#B42318] transition-colors min-h-[44px]"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
