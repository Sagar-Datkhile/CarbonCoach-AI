import { Metadata } from "next";
import { PrivacyPolicyContent } from "./PrivacyPolicyContent";

export const metadata: Metadata = {
  title: "Privacy Policy | CarbonCoach AI",
  description:
    "Learn how CarbonCoach AI collects, uses, stores and protects your personal information and utility data under strict PostgreSQL Row Level Security.",
  openGraph: {
    title: "Privacy Policy | CarbonCoach AI",
    description:
      "Learn how CarbonCoach AI collects, uses, stores and protects your personal information and utility data under strict PostgreSQL Row Level Security.",
    type: "website",
  },
};

export default function PrivacyPage() {
  return <PrivacyPolicyContent />;
}
