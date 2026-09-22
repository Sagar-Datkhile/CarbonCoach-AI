"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { SectionReveal } from "./SectionReveal";

interface FAQItem {
  question: string;
  answer: string;
}

export function LandingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: "What is Carbon Coach and what problem does it solve?",
      answer:
        "Carbon Coach is a household green energy intelligence tool designed to demystify complex electric utility statements. Instead of vague badges or confusing tariff structures, it gives you authoritative metrics: your exact daily consumption velocity (kWh/day), grid carbon emissions (kg CO₂e), and mathematically grounded actions to lower your power bill.",
    },
    {
      question: "How does the AI bill parser extract data from my statements?",
      answer:
        "When you upload an electricity statement (PDF, JPEG, PNG, or WEBP), our server-side pipeline utilizes Google Gemini 1.5 Flash to locate and transcribe billing period dates, total billing days, energy consumed in kWh, utility provider name, currency, and total amount. The model output is strictly validated against a strict schema before presentation.",
    },
    {
      question: "Why is there a human review step before saving bills?",
      answer:
        "We adhere to a strict Anti-Hallucination policy. AI is treated strictly as an initial transcription draft. You always inspect the extracted kilowatt-hours and billing dates with a side-by-side review screen, allowing you to make instant corrections before the bill is confirmed into your authoritative database history.",
    },
    {
      question: "How are emissions and financial savings calculated?",
      answer:
        "Every calculation is 100% deterministic mathematical code. For example, lighting savings use exact formulas: ((Current Watts - Proposed Watts) × Fixtures × Daily Hours × Days) / 1000 = kWh Saved. We never use generative models to estimate or invent financial figures.",
    },
    {
      question: "What can I do with the What-If Energy Simulator?",
      answer:
        "The simulator lets you test scenarios before spending money. You can adjust current bulb wattages (e.g., 60W incandescent), proposed LED wattages (e.g., 9W), fixture count, and operating hours across different projection horizons (30 days to 1 year) to see your calculated potential savings in kWh, money, and avoided carbon.",
    },
    {
      question: "Can I use Carbon Coach if I rent an apartment?",
      answer:
        "Yes! During account setup, you select your dwelling type (Owned, Rented, Shared, or Other). Our simulator scenarios and recommendations focus on practical, non-invasive adjustments—such as LED swaps and runtime scheduling—that require zero structural alterations to your living space.",
    },
    {
      question: "How is my utility data kept private and secure?",
      answer:
        "Your bill documents are kept in private, encrypted Supabase Storage buckets. Every database row is protected by PostgreSQL Row Level Security (RLS), meaning your statements and household metrics are only accessible by your authenticated session. We never sell, broker, or publicize your personal utility data.",
    },
    {
      question: "Can I explore the application without setting up API keys?",
      answer:
        "Yes. If you are evaluating or reviewing the project, you can click 'Demo Sign In' on the Sign In page. This gives you instant access to the full household dashboard, simulator, and bill tracking workflows without needing any cloud credentials.",
    },
  ];

  const toggleItem = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="faq"
      className="scroll-mt-20 py-12 md:py-16 bg-white border-y border-[#E3E7E3]"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0B7252] bg-[#EAF5EE] px-3 py-1 rounded-full inline-flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-[#0B7252]" />
              <span>Questions & Answers</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] mt-3.5 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-base sm:text-lg text-[#667085] mt-2.5">
              Genuine, transparent details about our deterministic engine, privacy architecture, and practical household features.
            </p>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div className="space-y-3" role="region" aria-label="Frequently Asked Questions">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={faq.question}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? "border-[#0B7252]/40 bg-[#FAFBF8] shadow-xs"
                      : "border-[#E3E7E3] bg-white hover:border-[#0B7252]/20"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(index)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                    id={`faq-question-${index}`}
                    className="w-full py-4 px-5 sm:px-6 flex items-center justify-between text-left gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#075E45]"
                  >
                    <span className="font-bold text-sm sm:text-base text-[#111827]">
                      {faq.question}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border transition-all duration-200 ${
                        isOpen
                          ? "bg-[#EAF5EE] border-[#0B7252]/30 text-[#075E45] rotate-180"
                          : "bg-[#FAFBF8] border-[#E3E7E3] text-[#667085]"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-answer-${index}`}
                        role="region"
                        aria-labelledby={`faq-question-${index}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 sm:px-6 pb-4.5 pt-1 text-sm text-[#667085] leading-relaxed border-t border-[#F3F8F3]">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
