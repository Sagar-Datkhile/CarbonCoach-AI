import React from "react";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingHero } from "@/components/landing/LandingHero";
import { CoreCapabilities } from "@/components/landing/CoreCapabilities";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { BillToActionPreview } from "@/components/landing/BillToActionPreview";
import { TrustTransparency } from "@/components/landing/TrustTransparency";
import { LandingFAQ } from "@/components/landing/LandingFAQ";
import { LandingCTA } from "@/components/landing/LandingCTA";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBF8] text-[#111827]">
      <LandingHeader />
      <main className="flex-1">
        <LandingHero />
        <CoreCapabilities />
        <HowItWorks />
        <BillToActionPreview />
        <TrustTransparency />
        <LandingFAQ />
        <LandingCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
