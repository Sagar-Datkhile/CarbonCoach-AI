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
      className="scroll-mt-20 py-12 md:py-16 bg-white border-y border-[#E3E7E3]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0B7252] bg-[#EAF5EE] px-3 py-1 rounded-full">
              From Paper to Practice
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] mt-3.5 tracking-tight">
              The Bill-to-Action Pipeline
            </h2>
            <p className="text-base sm:text-lg text-[#667085] mt-2.5">
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
              <Card elevated className="border-[#E3E7E3]">
                <CardHeader className="border-b border-[#F3F8F3] pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Receipt className="w-5 h-5 text-[#0B7252]" />
                      <CardTitle className="text-base">Input Utility Bill</CardTitle>
                    </div>
                    <Badge variant="success">Confirmed</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  <div className="flex justify-between items-center text-sm py-1.5 border-b border-[#F3F8F3]">
                    <span className="text-[#667085]">Provider</span>
                    <span className="font-semibold text-[#111827]">Pacific Electric Corp</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-1.5 border-b border-[#F3F8F3]">
                    <span className="text-[#667085]">Billing Period</span>
                    <span className="font-semibold text-[#111827]">31 Days (Jul 01 - Jul 31)</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-1.5 border-b border-[#F3F8F3]">
                    <span className="text-[#667085]">Energy Consumed</span>
                    <span className="font-bold text-[#111827] tabular-nums">540.0 kWh</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-1.5 border-b border-[#F3F8F3]">
                    <span className="text-[#667085]">Daily Average</span>
                    <span className="font-semibold text-[#111827] tabular-nums">17.4 kWh / day</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-1.5">
                    <span className="text-[#667085]">Total Amount</span>
                    <span className="font-extrabold text-[#075E45] tabular-nums text-lg">$89.10</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Transformation Arrow (Desktop) */}
            <div className="hidden lg:flex lg:col-span-2 flex-col items-center justify-center text-center space-y-2">
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-12 h-12 rounded-full bg-[#EAF5EE] text-[#075E45] flex items-center justify-center shadow-xs"
              >
                <ArrowRight className="w-6 h-6" />
              </motion.div>
              <span className="text-xs font-bold text-[#075E45] uppercase tracking-wider">
                Deterministic Engine
              </span>
            </div>

            {/* Step 2: Generated Action Plan */}
            <motion.div
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="lg:col-span-5"
            >
              <Card elevated className="border-[#0B7252]/30 bg-[#FAFBF8]">
                <CardHeader className="border-b border-[#E3E7E3] pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#0B7252]" />
                      <CardTitle className="text-base">Generated Action Plan</CardTitle>
                    </div>
                    <Badge variant="primary">Target: -52 kWh/mo</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  <div className="p-3 rounded-xl bg-white border border-[#E3E7E3] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-[#0B7252]" />
                        Switch 5 Fixtures to 9W LEDs
                      </span>
                      <span className="text-xs font-bold text-[#075E45]">-$5.10 / mo</span>
                    </div>
                    <p className="text-[11px] text-[#667085]">
                      Formula: (60W - 9W) × 5 bulbs × 4 hrs × 30 days = <strong>30.6 kWh saved</strong>
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-[#E3E7E3] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-[#0B7252]" />
                        Smart Power Strip for Entertainment
                      </span>
                      <span className="text-xs font-bold text-[#075E45]">-$2.50 / mo</span>
                    </div>
                    <p className="text-[11px] text-[#667085]">
                      Eliminates TV & audio standby phantom load: <strong>15.0 kWh saved</strong>
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-[#E3E7E3] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-[#0B7252]" />
                        Cold Water Laundry Routine
                      </span>
                      <span className="text-xs font-bold text-[#075E45]">-$2.15 / mo</span>
                    </div>
                    <p className="text-[11px] text-[#667085]">
                      Avoid water heater power draw: <strong>13.0 kWh saved</strong>
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
