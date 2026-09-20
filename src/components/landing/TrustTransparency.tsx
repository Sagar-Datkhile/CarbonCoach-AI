"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cpu, UserCheck } from "lucide-react";
import { SectionReveal, staggerContainerVariants, staggerItemVariants } from "./SectionReveal";

export function TrustTransparency() {
  const pillars = [
    {
      title: "AI for Extraction. Mathematics for Accuracy.",
      description:
        "CarbonCoach AI uses AI only to read your electricity bill. Every recommendation, savings estimate, and carbon calculation is generated using deterministic formulas for consistent and reliable results.",
      icon: <Cpu className="w-6 h-6 text-[#0B7252]" />,
    },
    {
      title: "Human-in-the-Loop Confirmation",
      description:
        "AI output is treated as a draft suggestion. You review every extracted field—billing days, rates, amounts—and make corrections before the record becomes authoritative in your dashboard.",
      icon: <UserCheck className="w-6 h-6 text-[#0B7252]" />,
    },
  ];

  return (
    <section
      id="benefits"
      className="scroll-mt-20 py-20 bg-[#FAFBF8]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0B7252] bg-[#EAF5EE] px-3 py-1 rounded-full">
              Data Ethics & Governance
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] mt-4 tracking-tight">
              Trust & Transparency First
            </h2>
            <p className="text-base sm:text-lg text-[#667085] mt-3">
              Sustainability software requires scientific integrity. Here is how Carbon Coach protects your data and guarantees mathematical truth.
            </p>
          </div>
        </SectionReveal>

        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {pillars.map((pillar) => (
            <motion.div
              key={pillar.title}
              variants={staggerItemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="p-8 rounded-2xl bg-white border border-[#E3E7E3] hover:border-[#0B7252]/30 transition-all hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#EAF5EE] flex items-center justify-center mb-5">
                  {pillar.icon}
                </div>
                <h3 className="text-lg font-bold text-[#111827] mb-2.5">
                  {pillar.title}
                </h3>
                <p className="text-sm text-[#667085] leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
