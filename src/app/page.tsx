import React from "react";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingHero } from "@/components/landing/LandingHero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { CoreCapabilities } from "@/components/landing/CoreCapabilities";
import { BillToActionPreview } from "@/components/landing/BillToActionPreview";
import { TrustTransparency } from "@/components/landing/TrustTransparency";
import { ContactSupport } from "@/components/landing/ContactSupport";
import { LandingCTA } from "@/components/landing/LandingCTA";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBF8] text-[#111827]">
      <LandingHeader />
      <main className="flex-1">
        <LandingHero />
        <HowItWorks />
        <CoreCapabilities />
        <BillToActionPreview />
        <TrustTransparency />
        <ContactSupport />
        <LandingCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
