import React from "react";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingHero } from "@/components/landing/LandingHero";
import { CoreCapabilities } from "@/components/landing/CoreCapabilities";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { BillToActionPreview } from "@/components/landing/BillToActionPreview";
import { TrustTransparency } from "@/components/landing/TrustTransparency";
import { LandingFAQ } from "@/components/landing/LandingFAQ";
import { TeamSection } from "@/components/landing/TeamSection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBF8] dark:bg-[#0B0F17] text-[#111827] dark:text-[#F9FAFB] transition-colors duration-200">
      <LandingHeader />
      <main className="flex-1">
        <LandingHero />
        <CoreCapabilities />
        <HowItWorks />
        <BillToActionPreview />
        <TrustTransparency />
        <LandingFAQ />
        <TeamSection />
      </main>
      <LandingFooter />
    </div>
  );
}
