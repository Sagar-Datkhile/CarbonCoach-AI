"use client";

import React from "react";
import Link from "next/link";

export function LandingFooter() {
  const bottomLinks = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Feedback", href: "/feedback" },
  ];

  return (
    <footer className="bg-white border-t border-[#E3E7E3] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 text-xs text-[#667085]">
          {/* Left: Rights reserved */}
          <div className="text-center md:text-left">
            <p>© 2026 Carbon Coach AI. All rights reserved.</p>
          </div>

          {/* Center: Privacy Policy, Terms, Feedback */}
          <div className="flex items-center justify-center gap-6 text-center">
            {bottomLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:underline hover:text-[#111827] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#075E45] rounded-xs"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: Made with love */}
          <div className="flex items-center justify-center md:justify-end text-center md:text-right">
            <span className="inline-flex items-center gap-1 font-medium text-[#475467]">
              Made with <span className="text-red-500">❤️</span> in India
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
