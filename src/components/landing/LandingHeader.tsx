"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Zap, Menu, X } from "lucide-react";

export function LandingHeader() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navLinks = [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Core Capabilities", href: "#capabilities" },
    { label: "Bill-to-Action", href: "#workflow" },
    { label: "Transparency", href: "#transparency" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FAFBF8]/90 backdrop-blur-md border-b border-[#E3E7E3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-[#075E45] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 fill-current text-[#EAF5EE]" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg text-[#075E45] tracking-tight">
              CarbonCoach<span className="text-[#0B7252]">.AI</span>
            </span>
            <span className="text-[10px] text-[#667085] font-semibold uppercase tracking-widest hidden sm:inline">
              Household Energy Intelligence
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Landing Navigation">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-semibold text-[#667085] hover:text-[#075E45] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="md" className="font-semibold">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="primary" size="md" className="font-semibold shadow-sm">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle mobile menu"
          className="w-11 h-11 flex items-center justify-center rounded-xl border border-[#E3E7E3] text-[#111827] hover:bg-[#F3F8F3] md:hidden"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="md:hidden bg-white border-b border-[#E3E7E3] px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-semibold text-[#111827] hover:bg-[#F3F8F3]"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-3 border-t border-[#E3E7E3] flex flex-col gap-2">
            <Link href="/login" onClick={() => setIsMobileOpen(false)} className="w-full">
              <Button variant="outline" size="md" className="w-full">
                Sign In
              </Button>
            </Link>
            <Link href="/signup" onClick={() => setIsMobileOpen(false)} className="w-full">
              <Button variant="primary" size="md" className="w-full">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
