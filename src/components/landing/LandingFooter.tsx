"use client";

import React from "react";
import Link from "next/link";
import { Zap } from "lucide-react";
import { scrollToSection } from "./scrollUtils";

export function LandingFooter() {
  const handleScrollClick = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    scrollToSection(sectionId, 80);
  };

  return (
    <footer className="bg-[#FAFBF8] border-t border-[#E3E7E3] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link
              href="/"
              onClick={(e) => handleScrollClick(e, "hero")}
              className="inline-flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#075E45] text-white flex items-center justify-center group-hover:bg-[#0B7252] transition-colors">
                <Zap className="w-4 h-4 fill-current text-[#EAF5EE]" />
              </div>
              <span className="font-extrabold text-lg text-[#075E45]">
                CarbonCoach<span className="text-[#0B7252]">.AI</span>
              </span>
            </Link>
            <p className="text-sm text-[#667085] max-w-sm leading-relaxed">
              Empowering households to decode electricity consumption, reduce unnecessary waste, and simulate practical energy efficiency with scientific accuracy.
            </p>
          </div>

          {/* Product Section Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">
              Product Navigation
            </h4>
            <ul className="space-y-2 text-sm text-[#667085]">
              <li>
                <a
                  href="#features"
                  onClick={(e) => handleScrollClick(e, "features")}
                  className="hover:text-[#0B7252] transition-colors cursor-pointer"
                >
                  Core Features
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  onClick={(e) => handleScrollClick(e, "how-it-works")}
                  className="hover:text-[#0B7252] transition-colors cursor-pointer"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#simulator"
                  onClick={(e) => handleScrollClick(e, "simulator")}
                  className="hover:text-[#0B7252] transition-colors cursor-pointer"
                >
                  What-If Simulator
                </a>
              </li>
              <li>
                <a
                  href="#benefits"
                  onClick={(e) => handleScrollClick(e, "benefits")}
                  className="hover:text-[#0B7252] transition-colors cursor-pointer"
                >
                  Trust & Governance
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  onClick={(e) => handleScrollClick(e, "faq")}
                  className="hover:text-[#0B7252] transition-colors cursor-pointer"
                >
                  Frequently Asked Questions
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => handleScrollClick(e, "contact")}
                  className="hover:text-[#0B7252] transition-colors cursor-pointer"
                >
                  Contact & Support
                </a>
              </li>
            </ul>
          </div>

          {/* Platform & Governance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">
              Platform & Access
            </h4>
            <ul className="space-y-2 text-sm text-[#667085]">
              <li>
                <Link href="/login" className="hover:text-[#0B7252] transition-colors">
                  User Sign In
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-[#0B7252] transition-colors">
                  Create Household Account
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#0B7252] transition-colors">
                  Administrator Portal
                </Link>
              </li>
              <li>
                <Link href="/api/health" className="hover:text-[#0B7252] transition-colors">
                  System Health API
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Tech Stack */}
        <div className="pt-8 border-t border-[#E3E7E3] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#667085]">
          <p>© {new Date().getFullYear()} CarbonCoach AI. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Powered by Next.js 15, Supabase RLS & Gemini 1.5 Flash</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
