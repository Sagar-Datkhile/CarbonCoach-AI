"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Zap } from "lucide-react";
import { SectionReveal } from "./SectionReveal";

export function LandingCTA() {
  return (
    <section
      id="cta"
      className="scroll-mt-20 py-20 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
      </div>
    </section>
  );
}
