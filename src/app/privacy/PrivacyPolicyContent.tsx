"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Shield,
  Calendar,
  Clock,
  Sparkles,
  Home,
} from "lucide-react";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { PolicySection } from "@/components/legal/PolicySection";
import { TableOfContents } from "@/components/legal/TableOfContents";
import { BackToTop } from "@/components/legal/BackToTop";
import { privacySections } from "./privacyData";

export function PrivacyPolicyContent() {
  const [activeId, setActiveId] = useState(privacySections[0].id);

  // IntersectionObserver to update active section in Table of Contents as user scrolls
  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: "-120px 0px -60% 0px",
      threshold: [0, 0.2, 0.5],
    };

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);
      if (visibleEntries.length > 0) {
        const topMost = visibleEntries.reduce((prev, curr) =>
          curr.boundingClientRect.top < prev.boundingClientRect.top ? curr : prev
        );
        setActiveId(topMost.target.id);
      }
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    privacySections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBF8] text-[#111827]">
      <LandingHeader />

      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-xs text-[#667085]">
              <li>
                <Link
                  href="/"
                  className="flex items-center gap-1 hover:text-[#075E45] transition-colors"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Home</span>
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="w-3.5 h-3.5 text-[#D1D5DB]" />
              </li>
              <li className="font-semibold text-[#111827]">Privacy Policy</li>
            </ol>
          </nav>

          {/* Hero Section */}
          <header className="max-w-3xl mb-12 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#0B7252] bg-[#EAF5EE] border border-[#0B7252]/15 shadow-xs"
            >
              <Shield className="w-3.5 h-3.5 text-[#0B7252]" />
              <span>Legal</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111827] tracking-tight"
            >
              Privacy Policy
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-[#667085] leading-relaxed"
            >
              Your privacy matters to us. Learn how CarbonCoach AI collects,
              uses, stores and protects your information.
            </motion.p>

            {/* Meta badges: Last Updated, Reading Time */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[#667085]"
            >
              <div className="flex items-center gap-1.5 bg-white border border-[#E3E7E3] px-3 py-1.5 rounded-lg shadow-2xs">
                <Calendar className="w-3.5 h-3.5 text-[#0B7252]" />
                <span>Last Updated: September 2026</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white border border-[#E3E7E3] px-3 py-1.5 rounded-lg shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-[#0B7252]" />
                <span>~4 min read</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white border border-[#E3E7E3] px-3 py-1.5 rounded-lg shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#0B7252]" />
                <span>PostgreSQL RLS & AES Encryption</span>
              </div>
            </motion.div>
          </header>

          {/* Main Grid: Sticky Sidebar TOC on Left (lg:col-span-4), Content on Right (lg:col-span-8) */}
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-start">
            {/* Table of Contents Column */}
            <aside className="lg:col-span-4 mb-8 lg:mb-0">
              <TableOfContents
                sections={privacySections}
                activeId={activeId}
                onSelectSection={(id) => setActiveId(id)}
              />
            </aside>

            {/* Policy Sections Column */}
            <div className="lg:col-span-8 space-y-8">
              {privacySections.map((section) => (
                <PolicySection key={section.id} section={section} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <BackToTop />
      <LandingFooter />
    </div>
  );
}
