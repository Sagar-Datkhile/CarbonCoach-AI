import React from "react";
import { ShieldCheck, Cpu, UserCheck, EyeOff } from "lucide-react";

export function TrustTransparency() {
  const pillars = [
    {
      title: "Zero AI Math Hallucination",
      description:
        "Large language models never invent or estimate your savings. Google Gemini 1.5 Flash is strictly confined to OCR bill extraction. All kWh and monetary savings are calculated deterministically via transparent mathematical formulas.",
      icon: <Cpu className="w-6 h-6 text-[#0B7252]" />,
    },
    {
      title: "Human-in-the-Loop Confirmation",
      description:
        "AI output is treated as a draft suggestion. You review every extracted field—billing days, rates, amounts—and make corrections before the record becomes authoritative in your dashboard.",
      icon: <UserCheck className="w-6 h-6 text-[#0B7252]" />,
    },
    {
      title: "Private Encrypted Storage",
      description:
        "Utility bills contain personal addresses and account numbers. Your uploads are stored in an encrypted, private Supabase Storage bucket accessible solely through authenticated sessions.",
      icon: <EyeOff className="w-6 h-6 text-[#0B7252]" />,
    },
    {
      title: "PostgreSQL Row Level Security",
      description:
        "Every single database record is enforced at the database engine level via PostgreSQL RLS. No other user or client can read, query, or mutate your energy history.",
      icon: <ShieldCheck className="w-6 h-6 text-[#0B7252]" />,
    },
  ];

  return (
    <section id="transparency" className="py-20 bg-[#FAFBF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0B7252] bg-[#EAF5EE] px-3 py-1 rounded-full">
            Data Ethics & Governance
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] mt-4 tracking-tight">
            Trust & Transparency First
          </h2>
          <p className="text-base sm:text-lg text-[#667085] mt-3">
            Sustainability software requires scientific integrity. Here is how CarbonCoach AI protects your data and guarantees mathematical truth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="p-8 rounded-2xl bg-white border border-[#E3E7E3] hover:border-[#0B7252]/30 transition-all flex flex-col justify-between"
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
