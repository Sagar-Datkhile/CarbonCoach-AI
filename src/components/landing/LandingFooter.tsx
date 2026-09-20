"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Zap, Mail } from "lucide-react";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

export function LandingFooter() {
  const shouldReduceMotion = useReducedMotion();

  const socialLinks = [
    {
      platform: "GitHub",
      icon: <GitHubIcon className="w-5 h-5" />,
      url: "https://github.com/Sagar-Datkhile/CarbonCoach-AI",
      ariaLabel: "Visit Carbon Coach AI on GitHub",
      isMailto: false,
    },
    {
      platform: "LinkedIn",
      icon: <LinkedInIcon className="w-5 h-5" />,
      url: "https://www.linkedin.com/in/sagardatkhile/",
      ariaLabel: "Connect with Sagar Datkhile on LinkedIn",
      isMailto: false,
    },
    {
      platform: "Email",
      icon: <Mail className="w-5 h-5" />,
      url: "mailto:sagardatkhile.official@gmail.com",
      ariaLabel: "Send an email inquiry",
      isMailto: true,
    },
  ];

  const bottomLinks = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Feedback", href: "/feedback" },
  ];

  return (
    <footer className="bg-white border-t border-[#E3E7E3] py-20 px-6">
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
        whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-7xl mx-auto flex flex-col items-center text-center"
      >
        {/* Top Center Branding */}
        <div className="space-y-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center p-2.5 rounded-2xl bg-[#075E45] text-white shadow-xs hover:bg-[#0B7252] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#075E45] focus-visible:ring-offset-2"
            aria-label="Carbon Coach AI Home"
          >
            <Zap className="w-6 h-6 fill-current text-[#EAF5EE]" />
          </Link>

          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-[#111827]">
              Carbon Coach AI
            </h2>
            <p className="text-[11px] font-bold tracking-widest text-[#0B7252] uppercase mt-1">
              Green Energy Intelligence
            </p>
          </div>

          <p className="text-sm sm:text-base text-[#667085] max-w-[700px] mx-auto leading-relaxed pt-1">
            Helping households understand electricity and make smarter energy decisions.
          </p>
        </div>

        {/* Social Section: Below Description, Horizontal, 48px circle, 20px gap */}
        <div className="flex items-center justify-center gap-5 mt-8">
          {socialLinks.map((item) => (
            <motion.a
              key={item.platform}
              href={item.url}
              target={item.isMailto ? undefined : "_blank"}
              rel={item.isMailto ? undefined : "noopener noreferrer"}
              aria-label={item.ariaLabel}
              whileHover={shouldReduceMotion ? {} : { scale: 1.08 }}
              transition={{ duration: 0.2 }}
              className="w-12 h-12 rounded-full bg-[#EAF5EE] text-[#075E45] border border-[#075E45]/15 flex items-center justify-center shadow-xs transition-colors duration-200 hover:bg-[#075E45] hover:text-white hover:border-[#075E45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#075E45] focus-visible:ring-offset-2"
            >
              {item.icon}
            </motion.a>
          ))}
        </div>

        {/* Bottom Bar: Divider, Responsive 3-column / Stack layout */}
        <div className="mt-16 pt-8 border-t border-[#E3E7E3] w-full flex flex-col md:flex-row items-center justify-between gap-5 text-xs text-[#667085]">
          {/* Column 1: Copyright */}
          <p className="order-1 text-center md:text-left">
            © 2026 Carbon Coach AI. All rights reserved.
          </p>

          {/* Column 2: Legal & Feedback Links */}
          <div className="order-2 flex items-center justify-center gap-6">
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

          {/* Column 3: Made in India */}
          <div className="order-3 flex items-center justify-center md:justify-end text-center md:text-right">
            <span className="inline-flex items-center gap-1 font-medium">
              Made with <span className="text-red-500">❤️</span> in India
            </span>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
