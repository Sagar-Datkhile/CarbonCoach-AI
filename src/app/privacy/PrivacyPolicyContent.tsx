"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Shield,
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
  const isClickScrollingRef = React.useRef(false);
  const clickTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Smooth, deterministic scroll-spy that handles fast scrolling without jitter
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (isClickScrollingRef.current) return;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          ticking = false;

          const scrollY = window.scrollY;
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.scrollHeight;

          // Top boundary: first section active
          if (scrollY < 120) {
            setActiveId(privacySections[0].id);
            return;
          }

          // Bottom boundary: last section active when reaching page bottom
          if (windowHeight + scrollY >= documentHeight - 80) {
            setActiveId(privacySections[privacySections.length - 1].id);
            return;
          }

          // Active reading line offset (below header)
          const targetOffset = 180;

          // Determine the active section by finding the last section whose top is above targetOffset
          let currentActiveId = privacySections[0].id;
          for (let i = 0; i < privacySections.length; i++) {
            const sec = privacySections[i];
            const el = document.getElementById(sec.id);
            if (el) {
              const top = el.getBoundingClientRect().top;
              if (top <= targetOffset) {
                currentActiveId = sec.id;
              } else {
                break;
              }
            }
          }

          setActiveId((prev) => (prev === currentActiveId ? prev : currentActiveId));
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
  }, []);

  const handleSelectSection = (id: string) => {
    setActiveId(id);
    isClickScrollingRef.current = true;
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    clickTimeoutRef.current = setTimeout(() => {
      isClickScrollingRef.current = false;
    }, 600);
  };

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
          </header>

          {/* Main Grid: Sticky Sidebar TOC on Left (lg:col-span-4), Content on Right (lg:col-span-8) */}
          <div className="relative lg:grid lg:grid-cols-12 lg:gap-12">
            {/* Table of Contents Column - Sticky while scrolling */}
            <aside className="lg:col-span-4 mb-8 lg:mb-0 lg:sticky lg:top-24 lg:self-start z-10">
              <TableOfContents
                sections={privacySections}
                activeId={activeId}
                onSelectSection={handleSelectSection}
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
