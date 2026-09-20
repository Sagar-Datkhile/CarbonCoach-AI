"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppSidebar } from "./AppSidebar";
import { Menu, X, Zap, User } from "lucide-react";

interface AppHeaderProps {
  userRole?: string;
  userEmail?: string;
  userName?: string;
  avatarUrl?: string | null;
}

export function AppHeader({ userRole, userEmail, userName, avatarUrl }: AppHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
            className="w-11 h-11 flex items-center justify-center rounded-lg border border-[#E3E7E3] text-[#111827] hover:bg-[#F3F8F3]"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#075E45] text-white flex items-center justify-center">
              <Zap className="w-4 h-4 fill-current text-[#EAF5EE]" />
            </div>
            <span className="font-bold text-sm text-[#075E45]">
              CarbonCoach
            </span>
          </Link>
        </div>

        {/* Desktop Left: Breadcrumbs / Title Placeholder */}
        <div className="hidden md:flex items-center gap-2 text-sm text-[#667085]">
          <span className="font-medium text-[#111827]">CarbonCoach AI</span>
          <span>/</span>
          <span className="text-[#0B7252] font-medium">Household Dashboard</span>
        </div>

        {/* Right: User Profile Chip */}
        <div className="flex items-center gap-3">
          <Link
            href="/profile"
            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full hover:bg-[#F3F8F3] transition-colors border border-transparent hover:border-[#E3E7E3]"
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
          </Link>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="w-72 max-w-[85vw] h-full bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <AppSidebar
              userRole={userRole}
              onNavigate={() => setIsMobileMenuOpen(false)}
              className="w-full h-full border-r-0"
            />
          </div>
        </div>
      )}
    </>
  );
}
