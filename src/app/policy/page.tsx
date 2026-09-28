import { Metadata } from "next";
import { PrivacyPolicyContent } from "@/app/privacy/PrivacyPolicyContent";

export const metadata: Metadata = {
  title: "Privacy Policy | CarbonCoach AI",
  description:
    "Learn how CarbonCoach AI collects, uses, stores and protects your personal information and utility data under strict PostgreSQL Row Level Security.",
};

export default function PolicyPage() {
  return <PrivacyPolicyContent />;
}
