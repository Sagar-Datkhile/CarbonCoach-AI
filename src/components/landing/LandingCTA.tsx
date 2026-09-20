"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Zap, Mail, ShieldCheck, Clock } from "lucide-react";
import { SectionReveal } from "./SectionReveal";

export function LandingCTA() {
  return (
    <section
      id="contact"
      className="scroll-mt-20 py-20 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main CTA Banner */}
        <SectionReveal>
          <div className="relative overflow-hidden rounded-3xl bg-[#075E45] px-6 py-16 sm:px-12 sm:py-20 text-center shadow-xl">
            {/* Subtle decorative circles */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/5 pointer-events-none blur-xl" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#0B7252]/40 pointer-events-none blur-xl" />

            <div className="relative max-w-2xl mx-auto space-y-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 text-white mb-2 shadow-xs">
                <Zap className="w-8 h-8 fill-current text-[#EAF5EE]" />
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Ready to take control of your household energy?
              </h2>

              <p className="text-base sm:text-lg text-[#EAF5EE]/90 leading-relaxed font-normal">
                Upload your electricity statement in under 60 seconds. Receive practical, verified recommendations and simulate savings today.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto"
                >
                  <Link href="/signup" className="w-full sm:w-auto block">
                    <Button
                      variant="secondary"
                      size="lg"
                      className="w-full sm:w-auto bg-white text-[#075E45] hover:bg-[#EAF5EE] font-bold text-base px-8 shadow-md"
                      rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
                    >
                      Get Started Free
                    </Button>
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto"
                >
                  <Link href="/login" className="w-full sm:w-auto block">
                    <Button
                      variant="ghost"
                      size="lg"
                      className="w-full sm:w-auto text-white hover:bg-white/10 font-semibold text-base px-7 border border-white/20"
                    >
                      Sign In
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </SectionReveal>

        {/* Contact & Support Help Grid */}
        <SectionReveal delay={0.15}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            <div className="p-5 rounded-2xl border border-[#E3E7E3] bg-[#FAFBF8] flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#EAF5EE] text-[#075E45] flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                  Direct Inquiries
                </h3>
                <a
                  href="mailto:support@carboncoach.ai"
                  className="text-sm font-bold text-[#075E45] hover:underline mt-0.5 block"
                >
                  support@carboncoach.ai
                </a>
                <p className="text-xs text-[#667085] mt-1">
                  General questions, tariff requests, and partnerships.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-[#E3E7E3] bg-[#FAFBF8] flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#EAF5EE] text-[#075E45] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                  Response Window
                </h3>
                <span className="text-sm font-bold text-[#111827] mt-0.5 block">
                  Within 24 Hours
                </span>
                <p className="text-xs text-[#667085] mt-1">
                  Dedicated engineering and tariff verification support.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-[#E3E7E3] bg-[#FAFBF8] flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#EAF5EE] text-[#075E45] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                  Data Ethics
                </h3>
                <span className="text-sm font-bold text-[#111827] mt-0.5 block">
                  100% Confidential
                </span>
                <p className="text-xs text-[#667085] mt-1">
                  Statements are encrypted under private tenant isolation.
                </p>
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
