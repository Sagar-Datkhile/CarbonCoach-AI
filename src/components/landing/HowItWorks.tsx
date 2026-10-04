"use client";

import React from "react";
import { motion } from "framer-motion";
import { UploadCloud, CheckCheck, Sparkles, ArrowRight } from "lucide-react";
import { SectionReveal, staggerContainerVariants, staggerItemVariants } from "./SectionReveal";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Upload Electricity Bill",
      description:
        "Upload a PDF or photo of your electricity statement. Your document is encrypted and stored in private storage.",
      icon: <UploadCloud className="w-6 h-6 text-[#0B7252]" />,
    },
    {
      number: "02",
      title: "Review & Confirm",
      description:
        "Server-side Gemini 1.5 Flash extracts consumption, rates, and billing periods. Review and edit fields before confirming.",
      icon: <CheckCheck className="w-6 h-6 text-[#0B7252]" />,
    },
    {
      number: "03",
      title: "Take Practical Action",
      description:
        "Receive personalized, budget-aware recommendations and simulate what-if energy adjustments with 100% deterministic math.",
      icon: <Sparkles className="w-6 h-6 text-[#0B7252]" />,
    },
  ];

  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 py-20 bg-white dark:bg-[#0B0F17] border-y border-[#E3E7E3] dark:border-[#222F3E]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0B7252] dark:text-[#34D399] bg-[#EAF5EE] dark:bg-[#063D2E] border border-[#0B7252]/15 dark:border-[#10B981]/25 px-3 py-1 rounded-full">
              Transparent Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] dark:text-white mt-4 tracking-tight">
              How Carbon Coach Works
            </h2>
            <p className="text-base sm:text-lg text-[#667085] dark:text-[#9CA3AF] mt-3">
              A secure, three-step human-in-the-loop pipeline designed to demystify household power consumption.
            </p>
          </div>
        </SectionReveal>

        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
        >
          {steps.map((step, idx) => (
            <motion.div
              key={step.number}
              variants={staggerItemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="relative p-8 rounded-2xl bg-[#FAFBF8] dark:bg-[#151D2A] border border-[#E3E7E3] dark:border-[#222F3E] hover:border-[#0B7252]/40 dark:hover:border-[#10B981]/40 transition-all hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#EAF5EE] dark:bg-[#063D2E] flex items-center justify-center">
                    {step.icon}
                  </div>
                  <span className="text-3xl font-black text-[#E3E7E3] dark:text-[#222F3E] tracking-wider">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#111827] dark:text-white mb-3">
                  {step.title}
                </h3>

                <p className="text-sm text-[#667085] dark:text-[#9CA3AF] leading-relaxed">
                  {step.description}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-[#1A2333] border border-[#E3E7E3] dark:border-[#222F3E] flex items-center justify-center text-[#667085] dark:text-[#9CA3AF] shadow-xs">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
