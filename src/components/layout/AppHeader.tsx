"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppSidebar } from "./AppSidebar";
import { Menu, X } from "lucide-react";

interface AppHeaderProps {
  userRole?: string;
  userEmail?: string;
  userName?: string;
  avatarUrl?: string | null;
}

export function AppHeader({ userRole, userEmail, userName, avatarUrl }: AppHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Header: ONLY visible on small screens (md:hidden) so mobile users can open navigation drawer. COMPLETELY REMOVED on desktop. */}
      <header className="md:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E3E7E3] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#E3E7E3] text-[#111827] hover:bg-[#F3F8F3] transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white border border-[#E3E7E3] overflow-hidden flex items-center justify-center shadow-xs shrink-0 p-0.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="CarbonCoach AI Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-bold text-sm text-[#075E45]">
              CarbonCoach<span className="text-[#0B7252]">.AI</span>
            </span>
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
