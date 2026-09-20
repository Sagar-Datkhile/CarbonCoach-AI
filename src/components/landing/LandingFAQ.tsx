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
      question: "How does CarbonCoach AI extract data from my electricity bills?",
      answer:
        "We utilize Google Gemini 1.5 Flash in a secure, server-side optical recognition pipeline. The model extracts key statement fields—including billing periods, kilowatt-hour consumption, rate tariffs, and utility provider names. The AI is strictly confined to transcription; it is never permitted to perform ungrounded financial calculations.",
    },
    {
      question: "How are energy reductions and monetary savings calculated?",
      answer:
        "Every kWh savings figure and estimated dollar amount is computed using 100% deterministic mathematical formulas backed by published energy standards. Because we do not use generative AI for math, there are zero hallucinations or fabricated projections in your household dashboard.",
    },
    {
      question: "Is my utility statement and private information secure?",
      answer:
        "Yes. Uploaded bill files are stored in private, encrypted Supabase Storage buckets. Every database row is safeguarded by PostgreSQL Row Level Security (RLS), ensuring only your authenticated session can access your data. We never sell, broker, or train public models on your utility statements.",
    },
    {
      question: "Does CarbonCoach AI work for apartment renters as well as homeowners?",
      answer:
        "Absolutely. During onboarding, you can designate your housing type. Renters receive high-impact habit recommendations, plug-in smart hardware advice, and appliance scheduling that require zero structural renovations. Homeowners additionally see retrofitting and heat pump analysis.",
    },
    {
      question: "What file formats can I upload for bill processing?",
      answer:
        "We support standard PDF utility statements directly downloaded from your power company portal, as well as high-resolution mobile camera captures (JPEG, PNG, WebP). The system preprocesses images to optimize clarity before extraction.",
    },
  ];

  const toggleItem = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="faq"
      className="scroll-mt-20 py-20 bg-white border-y border-[#E3E7E3]"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0B7252] bg-[#EAF5EE] px-3 py-1 rounded-full inline-flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-[#0B7252]" />
              <span>Questions & Answers</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] mt-4 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-base sm:text-lg text-[#667085] mt-3">
              Clear, transparent details about our deterministic engine, privacy architecture, and supported utility providers.
            </p>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div className="space-y-3.5" role="region" aria-label="Frequently Asked Questions">
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
                    className="w-full py-4.5 px-5 sm:px-6 flex items-center justify-between text-left gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#075E45]"
                  >
                    <span className="font-bold text-sm sm:text-base text-[#111827]">
                      {faq.question}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-200 ${
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
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 sm:px-6 pb-5 pt-1 text-sm text-[#667085] leading-relaxed border-t border-[#F3F8F3]">
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
