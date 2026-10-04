"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight, Check, Sparkles, Receipt } from "lucide-react";
import { SectionReveal } from "./SectionReveal";

export function BillToActionPreview() {
  return (
    <section
      id="simulator"
      className="scroll-mt-20 py-20 bg-white dark:bg-[#0B0F17] border-y border-[#E3E7E3] dark:border-[#222F3E]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0B7252] dark:text-[#34D399] bg-[#EAF5EE] dark:bg-[#063D2E] border border-[#0B7252]/15 dark:border-[#10B981]/25 px-3 py-1 rounded-full">
              From Paper to Practice
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] dark:text-white mt-4 tracking-tight">
              The Bill-to-Action Pipeline
            </h2>
            <p className="text-base sm:text-lg text-[#667085] dark:text-[#9CA3AF] mt-3">
              See how raw statement numbers transform into prioritized household actions with verifiable mathematical savings.
            </p>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.15}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Step 1: Extracted Utility Statement Data */}
            <motion.div
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="lg:col-span-5"
            >
              <Card elevated className="border-[#E3E7E3] dark:border-[#222F3E] bg-white dark:bg-[#151D2A]">
                <CardHeader className="border-b border-[#F3F8F3] dark:border-[#222F3E] pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Receipt className="w-5 h-5 text-[#0B7252] dark:text-[#34D399]" />
                      <CardTitle className="text-base text-[#111827] dark:text-white">Input Utility Bill</CardTitle>
                    </div>
                    <Badge variant="success">Confirmed</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  <div className="flex justify-between items-center text-sm py-1.5 border-b border-[#F3F8F3] dark:border-[#222F3E]">
                    <span className="text-[#667085] dark:text-[#9CA3AF]">Provider</span>
                    <span className="font-semibold text-[#111827] dark:text-white">Pacific Electric Corp</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-1.5 border-b border-[#F3F8F3] dark:border-[#222F3E]">
                    <span className="text-[#667085] dark:text-[#9CA3AF]">Billing Period</span>
                    <span className="font-semibold text-[#111827] dark:text-white">31 Days (Jul 01 - Jul 31)</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-1.5 border-b border-[#F3F8F3] dark:border-[#222F3E]">
                    <span className="text-[#667085] dark:text-[#9CA3AF]">Energy Consumed</span>
                    <span className="font-bold text-[#111827] dark:text-white tabular-nums">540.0 kWh</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-1.5 border-b border-[#F3F8F3] dark:border-[#222F3E]">
                    <span className="text-[#667085] dark:text-[#9CA3AF]">Daily Average</span>
                    <span className="font-semibold text-[#111827] dark:text-white tabular-nums">17.4 kWh / day</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-1.5">
                    <span className="text-[#667085] dark:text-[#9CA3AF]">Total Amount</span>
                    <span className="font-extrabold text-[#075E45] dark:text-[#34D399] tabular-nums text-lg">$89.10</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Transformation Arrow (Desktop) */}
            <div className="hidden lg:flex lg:col-span-2 flex-col items-center justify-center text-center space-y-2">
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-12 h-12 rounded-full bg-[#EAF5EE] dark:bg-[#063D2E] text-[#075E45] dark:text-[#34D399] flex items-center justify-center shadow-xs"
              >
                <ArrowRight className="w-6 h-6" />
              </motion.div>
              <span className="text-xs font-bold text-[#075E45] dark:text-[#34D399] uppercase tracking-wider">
                Deterministic Engine
              </span>
            </div>

            {/* Step 2: Generated Action Plan */}
            <motion.div
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="lg:col-span-5"
            >
              <Card elevated className="border-[#0B7252]/30 dark:border-[#10B981]/30 bg-[#FAFBF8] dark:bg-[#0E1522]">
                <CardHeader className="border-b border-[#E3E7E3] dark:border-[#222F3E] pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#0B7252] dark:text-[#34D399]" />
                      <CardTitle className="text-base text-[#111827] dark:text-white">Generated Action Plan</CardTitle>
                    </div>
                    <Badge variant="primary">Target: -52 kWh/mo</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  <div className="p-3 rounded-xl bg-white dark:bg-[#151D2A] border border-[#E3E7E3] dark:border-[#222F3E] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#111827] dark:text-white flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-[#0B7252] dark:text-[#34D399]" />
                        Switch 5 Fixtures to 9W LEDs
                      </span>
                      <span className="text-xs font-bold text-[#075E45] dark:text-[#34D399]">-$5.10 / mo</span>
                    </div>
                    <p className="text-[11px] text-[#667085] dark:text-[#9CA3AF]">
                      Formula: (60W - 9W) × 5 bulbs × 4 hrs × 30 days = <strong className="text-[#111827] dark:text-white">30.6 kWh saved</strong>
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-[#151D2A] border border-[#E3E7E3] dark:border-[#222F3E] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#111827] dark:text-white flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-[#0B7252] dark:text-[#34D399]" />
                        Smart Power Strip for Entertainment
                      </span>
                      <span className="text-xs font-bold text-[#075E45] dark:text-[#34D399]">-$2.50 / mo</span>
                    </div>
                    <p className="text-[11px] text-[#667085] dark:text-[#9CA3AF]">
                      Eliminates TV & audio standby phantom load: <strong className="text-[#111827] dark:text-white">15.0 kWh saved</strong>
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-[#151D2A] border border-[#E3E7E3] dark:border-[#222F3E] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#111827] dark:text-white flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-[#0B7252] dark:text-[#34D399]" />
                        Cold Water Laundry Routine
                      </span>
                      <span className="text-xs font-bold text-[#075E45] dark:text-[#34D399]">-$2.15 / mo</span>
                    </div>
                    <p className="text-[11px] text-[#667085] dark:text-[#9CA3AF]">
                      Avoid water heater power draw: <strong className="text-[#111827] dark:text-white">13.0 kWh saved</strong>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
