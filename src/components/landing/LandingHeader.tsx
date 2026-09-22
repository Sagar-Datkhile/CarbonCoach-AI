"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Menu, X, ArrowRight } from "lucide-react";
import { scrollToSection } from "./scrollUtils";

export function LandingHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  const navLinks = [
    { label: "Home", scrollTo: "hero" },
    { label: "Features", scrollTo: "features" },
    { label: "How It Works", scrollTo: "how-it-works" },
    { label: "Simulator", scrollTo: "simulator" },
    { label: "FAQ", scrollTo: "faq" },
    { label: "Contact", scrollTo: "contact" },
  ];

  // If redirected to home page with a hash or stored target from another route (e.g. /privacy), smooth scroll to it
  useEffect(() => {
    if (pathname !== "/" || typeof window === "undefined") return;

    let targetId = "";
    try {
      const stored = sessionStorage.getItem("cc_scroll_target");
      if (stored) {
        targetId = stored;
        sessionStorage.removeItem("cc_scroll_target");
      }
    } catch {
      // Safely ignore storage errors
    }

    if (!targetId && window.location.hash) {
      targetId = window.location.hash.replace("#", "");
    }

    if (!targetId) return;

    if (targetId === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActiveSection("hero");
      return;
    }

    let attempts = 0;
    const maxAttempts = 30; // Check up to 1.5s (30 * 50ms)
    const interval = setInterval(() => {
      attempts++;
      const element = document.getElementById(targetId);
      if (element) {
        clearInterval(interval);
        requestAnimationFrame(() => {
          scrollToSection(targetId, 80);
          setActiveSection(targetId);
        });
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [pathname]);

  // Listen to browser hash changes (e.g. back/forward button navigation)
  useEffect(() => {
    if (pathname !== "/" || typeof window === "undefined") return;

    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        scrollToSection(hash, 80);
        setActiveSection(hash);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [pathname]);

  // Monitor scroll distance for navbar blur and track active section with zero-lag IntersectionObserver
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    if (pathname !== "/") {
      return () => window.removeEventListener("scroll", handleScroll);
    }

    const sectionIds = [
      "hero",
      "features",
      "how-it-works",
      "simulator",
      "benefits",
      "faq",
      "contact",
    ];

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) {
      return () => window.removeEventListener("scroll", handleScroll);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // If at the very top of the page, ensure hero is active
        if (window.scrollY < 80) {
          setActiveSection("hero");
          return;
        }

        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
          visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          const targetId = visibleEntries[0].target.id;
          const mapped = targetId === "benefits" ? "simulator" : targetId;
          setActiveSection((prev) => (prev !== mapped ? mapped : prev));
        }
      },
      {
        root: null,
        rootMargin: "-15% 0px -55% 0px",
        threshold: [0, 0.2, 0.5, 0.8],
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [pathname]);

  const handleNavClick = (e: React.MouseEvent, scrollTo: string) => {
    setIsMobileOpen(false);

    // If on /privacy or any non-root page, redirect to home with the corresponding hash
    if (pathname !== "/") {
      e.preventDefault();
      try {
        sessionStorage.setItem("cc_scroll_target", scrollTo);
      } catch {
        // Safely ignore storage errors
      }
      const targetUrl = scrollTo === "hero" ? "/" : `/#${scrollTo}`;
      router.push(targetUrl, { scroll: false });
      return;
    }

    e.preventDefault();
    setActiveSection(scrollTo);
    scrollToSection(scrollTo, 80);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#FAFBF8]/95 backdrop-blur-md border-b border-[#E3E7E3] shadow-[0_4px_20px_rgba(7,94,69,0.06)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          onClick={(e) => handleNavClick(e, "hero")}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-white border border-[#E3E7E3] overflow-hidden flex items-center justify-center shadow-xs shrink-0 p-1 group-hover:border-[#075E45]/40 transition-colors">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Carbon Coach Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg text-[#075E45] tracking-tight">
              Carbon Coach
            </span>
            <span className="text-[10px] text-[#667085] font-semibold uppercase tracking-widest hidden sm:inline">
              Green Energy Intelligence
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links with Active Green Underline */}
        <nav
          className="hidden md:flex items-center gap-7 lg:gap-8"
          aria-label="Landing Navigation"
        >
          {navLinks.map((link) => {
            const isActive = pathname === "/" && activeSection === link.scrollTo;

            return (
              <a
                key={link.label}
                href={
                  pathname === "/"
                    ? `#${link.scrollTo}`
                    : link.scrollTo === "hero"
                    ? "/"
                    : `/#${link.scrollTo}`
                }
                onClick={(e) => handleNavClick(e, link.scrollTo)}
                className={`relative py-1 text-sm font-semibold transition-colors ${
                  isActive
                    ? "text-[#075E45] font-bold"
                    : "text-[#667085] hover:text-[#075E45]"
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="activeNavUnderline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#0B7252] rounded-full"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <Link href="/login">
            <Button
              variant="ghost"
              size="md"
              className="font-semibold text-[#111827] hover:text-[#075E45] hover:bg-[#EAF5EE]/60"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button
              variant="primary"
              size="md"
              className="font-bold shadow-xs bg-[#075E45] hover:bg-[#064E3B] text-white"
            >
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label={isMobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMobileOpen}
          className="w-11 h-11 flex items-center justify-center rounded-xl border border-[#E3E7E3] bg-white/80 text-[#111827] hover:bg-[#F3F8F3] md:hidden transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#075E45]"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-white/98 backdrop-blur-md border-b border-[#E3E7E3] shadow-lg"
          >
            <div className="px-4 pt-3 pb-6 space-y-4">
              <nav className="flex flex-col space-y-1" aria-label="Mobile Navigation">
                {navLinks.map((link) => {
                  const isActive = pathname === "/" && activeSection === link.scrollTo;
                  return (
                    <a
                      key={link.label}
                      href={
                        pathname === "/"
                          ? `#${link.scrollTo}`
                          : link.scrollTo === "hero"
                          ? "/"
                          : `/#${link.scrollTo}`
                      }
                      onClick={(e) => handleNavClick(e, link.scrollTo)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                        isActive
                          ? "bg-[#EAF5EE] text-[#075E45] font-bold border-l-3 border-[#0B7252]"
                          : "text-[#111827] hover:bg-[#F3F8F3]"
                      }`}
                    >
                      <span>{link.label}</span>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-[#0B7252]" />
                      )}
                    </a>
                  );
                })}
              </nav>

              <div className="pt-3 border-t border-[#E3E7E3] flex flex-col gap-2.5">
                <Link
                  href="/login"
                  onClick={() => setIsMobileOpen(false)}
                  className="w-full"
                >
                  <Button variant="outline" size="md" className="w-full font-semibold">
                    Sign In
                  </Button>
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsMobileOpen(false)}
                  className="w-full"
                >
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full font-bold bg-[#075E45] hover:bg-[#064E3B] text-white flex items-center justify-center gap-2"
                  >
                    <span>Get Started Free</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
