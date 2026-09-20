"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppSidebar } from "./AppSidebar";
import { Menu, X, Zap, Sparkles } from "lucide-react";

interface AppHeaderProps {
  userRole?: string;
  userEmail?: string;
  userName?: string;
  avatarUrl?: string | null;
}

export function AppHeader({ userRole, userEmail, userName, avatarUrl }: AppHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Dynamic breadcrumb label based on route
  const getPageTitle = (path: string) => {
    if (path.startsWith("/bills")) return "Electricity Bills";
    if (path.startsWith("/plan")) return "My Decarbonization Plan";
    if (path.startsWith("/simulator")) return "Energy Efficiency Simulator";
    if (path.startsWith("/progress")) return "Impact & Progress";
    if (path.startsWith("/profile")) return "Account & Household Profile";
    if (path.startsWith("/admin")) return "Admin Control Center";
    return "Household Dashboard";
  };

  const [failedAvatarUrl, setFailedAvatarUrl] = useState<string | null>(null);

  const showAvatar = Boolean(avatarUrl && avatarUrl !== failedAvatarUrl);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#E3E7E3] px-4 md:px-8 py-3.5 flex items-center justify-between">
        {/* Mobile Left: Menu Toggle + Brand */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#E3E7E3] text-[#111827] hover:bg-[#F3F8F3] transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#075E45] text-white flex items-center justify-center shadow-xs">
              <Zap className="w-4 h-4 fill-current text-[#EAF5EE]" />
            </div>
            <span className="font-bold text-sm text-[#075E45]">
              CarbonCoach<span className="text-[#0B7252]">.AI</span>
            </span>
          </Link>
        </div>

        {/* Desktop Left: Breadcrumbs & Page Context */}
        <div className="hidden md:flex items-center gap-2 text-sm text-[#667085]">
          <Link href="/dashboard" className="font-medium text-[#111827] hover:text-[#075E45] transition-colors">
            CarbonCoach AI
          </Link>
          <span className="text-[#D0D5DD]">/</span>
          <span className="text-[#0B7252] font-semibold">{getPageTitle(pathname)}</span>
        </div>

        {/* Header Right: Status Badge & Quick Action (Duplicate top-right user profile removed as requested) */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EAF5EE] text-[#075E45] text-[11px] font-semibold border border-[#0B7252]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#12B76A] animate-pulse" />
            <span>Active Grid Modeling</span>
          </div>

          <Link
            href="/plan"
            className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl text-[#075E45] bg-[#EAF5EE]/60 hover:bg-[#EAF5EE] transition-colors border border-[#0B7252]/10"
          >
            <div className="w-8 h-8 rounded-full bg-[#EAF5EE] text-[#075E45] flex items-center justify-center font-bold text-xs overflow-hidden shrink-0 border border-[#E3E7E3]">
              {showAvatar && avatarUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={avatarUrl}
                  alt={userName || "User Avatar"}
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                  onError={() => setFailedAvatarUrl(avatarUrl)}
                />
              ) : (
                <span>{userName ? userName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}</span>
              )}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-[#111827] leading-tight">
                {userName || "User"}
              </span>
              {userEmail && (
                <span className="text-[11px] text-[#667085] leading-tight truncate max-w-[140px]">
                  {userEmail}
                </span>
              )}
            </div>
            <Sparkles className="w-3.5 h-3.5" />
            <span>View Energy Plan</span>
          </Link>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden animate-in fade-in duration-200"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="w-72 max-w-[85vw] h-full bg-white shadow-2xl animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <AppSidebar
              userRole={userRole}
              userName={userName}
              userEmail={userEmail}
              avatarUrl={avatarUrl}
              onNavigate={() => setIsMobileMenuOpen(false)}
              className="w-full h-full border-r-0"
            />
          </div>
        </div>
      )}
    </>
  );
}
