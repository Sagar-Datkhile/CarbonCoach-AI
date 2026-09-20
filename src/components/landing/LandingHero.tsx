import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Zap,
  ArrowRight,
  ShieldCheck,
  Calculator,
  Receipt,
  Leaf,
  CheckCircle2,
} from "lucide-react";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Background ambient gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#EAF5EE]/60 to-transparent pointer-events-none -z-10 rounded-full blur-3xl opacity-70" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EAF5EE] border border-[#0B7252]/20 text-[#075E45] text-xs font-semibold">
              <Leaf className="w-3.5 h-3.5 text-[#0B7252]" />
              <span>Production-Grade Household Carbon & Energy Intelligence</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#111827] leading-[1.1]">
              Understand your energy.{" "}
              <span className="text-[#0B7252] block sm:inline">Make practical changes.</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#667085] max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Turn electricity bills into understandable insights and achievable actions. Securely upload bills, review AI-extracted metrics with human oversight, and simulate real savings.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto text-base font-bold px-8 shadow-md"
                  rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
                >
                  Get Started
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto text-base font-semibold px-7"
                >
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Key Trust Signals */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-[#E3E7E3] max-w-xl mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#111827]">
                <ShieldCheck className="w-4 h-4 text-[#0B7252] shrink-0" />
                <span>Zero Data Selling</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#111827]">
                <Calculator className="w-4 h-4 text-[#0B7252] shrink-0" />
                <span>Deterministic Math</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#111827]">
                <CheckCircle2 className="w-4 h-4 text-[#0B7252] shrink-0" />
                <span>Human Verified Bills</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Demonstration Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-3xl border border-[#E3E7E3] bg-white p-6 shadow-[0_20px_40px_rgba(7,94,69,0.08)]">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-[#F3F8F3] pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EAF5EE] text-[#075E45] flex items-center justify-center">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-[#111827]">Latest Electricity Bill</h2>
                    <p className="text-xs text-[#667085]">Aug 01 — Aug 31 • Confirmed</p>
                  </div>
                </div>
                <Badge variant="success">Verified</Badge>
              </div>

              {/* Bill Extraction Highlights */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="p-3.5 rounded-xl bg-[#FAFBF8] border border-[#E3E7E3]">
                  <span className="text-[11px] font-semibold text-[#667085] uppercase tracking-wider block">
                    Total Energy
                  </span>
                  <div className="text-2xl font-extrabold text-[#111827] tabular-nums mt-1">
                    480 <span className="text-xs font-medium text-[#667085]">kWh</span>
                  </div>
                  <span className="text-[11px] text-[#075E45] font-semibold block mt-1">
                    15.5 kWh / day
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAFBF8] border border-[#E3E7E3]">
                  <span className="text-[11px] font-semibold text-[#667085] uppercase tracking-wider block">
                    Estimated CO₂e
                  </span>
                  <div className="text-2xl font-extrabold text-[#111827] tabular-nums mt-1">
                    185.3 <span className="text-xs font-medium text-[#667085]">kg</span>
                  </div>
                  <span className="text-[11px] text-[#667085] font-semibold block mt-1">
                    Grid: 0.386 kg/kWh
                  </span>
                </div>
              </div>

              {/* Recommended Action Insight */}
              <div className="rounded-xl border border-[#0B7252]/20 bg-[#EAF5EE]/70 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#075E45] uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 fill-current text-[#0B7252]" />
                    Recommended Next Action
                  </span>
                  <span className="text-[11px] font-bold text-[#075E45]">Save ~$61/yr</span>
                </div>
                <p className="text-xs text-[#111827] leading-relaxed">
                  Switch 5 high-use 60W bulbs to 9W LEDs. Modeled annual saving: <strong>372 kWh</strong>.
                </p>
              </div>

              {/* Bottom Micro-Badge */}
              <div className="mt-4 pt-3 border-t border-[#F3F8F3] flex items-center justify-between text-[11px] text-[#667085]">
                <span>Gemini 1.5 Flash Server Extractor</span>
                <span className="font-semibold text-[#0B7252]">100% Deterministic</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
