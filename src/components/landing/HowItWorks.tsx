import React from "react";
import { UploadCloud, CheckCheck, Sparkles, ArrowRight } from "lucide-react";

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
    <section id="how-it-works" className="py-20 bg-white border-y border-[#E3E7E3] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0B7252] bg-[#EAF5EE] px-3 py-1 rounded-full">
            Transparent Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] mt-4 tracking-tight">
            How CarbonCoach AI Works
          </h2>
          <p className="text-base sm:text-lg text-[#667085] mt-3">
            A secure, three-step human-in-the-loop pipeline designed to demystify household power consumption.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => (
            <div
              key={step.number}
              className="relative p-8 rounded-2xl bg-[#FAFBF8] border border-[#E3E7E3] hover:border-[#0B7252]/40 transition-all hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#EAF5EE] flex items-center justify-center">
                    {step.icon}
                  </div>
                  <span className="text-3xl font-black text-[#E3E7E3] tracking-wider">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#111827] mb-3">
                  {step.title}
                </h3>

                <p className="text-sm text-[#667085] leading-relaxed">
                  {step.description}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                  <div className="w-8 h-8 rounded-full bg-white border border-[#E3E7E3] flex items-center justify-center text-[#667085] shadow-xs">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
