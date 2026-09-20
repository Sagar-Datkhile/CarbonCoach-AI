import React from "react";
import Link from "next/link";
import { Zap } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="bg-[#FAFBF8] border-t border-[#E3E7E3] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#075E45] text-white flex items-center justify-center">
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

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-2 text-sm text-[#667085]">
              <li>
                <a href="#how-it-works" className="hover:text-[#0B7252] transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#capabilities" className="hover:text-[#0B7252] transition-colors">
                  Core Capabilities
                </a>
              </li>
              <li>
                <a href="#workflow" className="hover:text-[#0B7252] transition-colors">
                  Bill-to-Action Pipeline
                </a>
              </li>
              <li>
                <a href="#transparency" className="hover:text-[#0B7252] transition-colors">
                  Data Transparency
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
