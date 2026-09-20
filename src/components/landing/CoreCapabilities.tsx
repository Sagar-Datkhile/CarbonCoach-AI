"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Calculator,
  Sliders,
  TrendingUp,
  Home,
  ShieldCheck,
} from "lucide-react";
import { SectionReveal, staggerContainerVariants, staggerItemVariants } from "./SectionReveal";

export function CoreCapabilities() {
  const capabilities = [
    {
      title: "Automated Bill Extraction",
      description:
        "Extracts billing dates, kWh usage, provider names, and tariff rates from PDF statements or mobile snapshots using server-side Gemini 1.5 Flash.",
      icon: <FileText className="w-6 h-6 text-[#0B7252]" />,
    },
    {
      title: "Deterministic Energy Math",
      description:
        "Zero AI hallucinations for financial and energy metrics. All savings calculations are computed mathematically from database-backed templates.",
      icon: <Calculator className="w-6 h-6 text-[#0B7252]" />,
    },
    {
      title: "Interactive What-If Simulator",
      description:
        "Model the real-world impact of LED lighting retrofits and appliance runtime adjustments before spending any money.",
      icon: <Sliders className="w-6 h-6 text-[#0B7252]" />,
    },
    {
      title: "Tri-Partite Progress Tracking",
      description:
        "Keep estimated model projections, user-reported behavioral milestones, and verified bill-to-bill deltas strictly separated.",
      icon: <TrendingUp className="w-6 h-6 text-[#0B7252]" />,
    },
    {
      title: "Household-Specific Filtering",
      description:
        "Recommendations automatically adapt to your tenancy: renters get non-invasive habit tweaks; homeowners see high-impact equipment options.",
      icon: <Home className="w-6 h-6 text-[#0B7252]" />,
    },
    {
      title: "Row Level Security Isolation",
      description:
        "Your utility statements and account numbers are strictly isolated via PostgreSQL RLS. Your energy data is never sold or brokered.",
      icon: <ShieldCheck className="w-6 h-6 text-[#0B7252]" />,
    },
  ];

  return (
    <section
      id="features"
      className="scroll-mt-20 py-20 bg-[#FAFBF8]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0B7252] bg-[#EAF5EE] px-3 py-1 rounded-full">
              Engineering Precision
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] mt-4 tracking-tight">
              Built for Real Household Impact
            </h2>
            <p className="text-base sm:text-lg text-[#667085] mt-3">
              Every feature is engineered to provide actionable clarity rather than superficial carbon offset badges.
            </p>
          </div>
        </SectionReveal>

        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {capabilities.map((cap) => (
            <motion.div
              key={cap.title}
              variants={staggerItemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="p-7 rounded-2xl bg-white border border-[#E3E7E3] hover:border-[#0B7252]/40 transition-all hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-xl bg-[#EAF5EE] flex items-center justify-center mb-5">
                {cap.icon}
              </div>
              <h3 className="text-lg font-bold text-[#111827] mb-2">
                {cap.title}
              </h3>
              <p className="text-sm text-[#667085] leading-relaxed">
                {cap.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
