import { Metadata } from "next";
import { TermsOfServiceContent } from "./TermsOfServiceContent";

export const metadata: Metadata = {
  title: "Terms of Service | Carbon Coach AI",
  description:
    "These Terms govern your use of Carbon Coach AI. Read our terms of service regarding accounts, acceptable use, AI recommendations, and service availability.",
  openGraph: {
    title: "Terms of Service | Carbon Coach AI",
    description:
      "These Terms govern your use of Carbon Coach AI. Read our terms of service regarding accounts, acceptable use, AI recommendations, and service availability.",
    type: "website",
  },
};

export default function TermsPage() {
  return <TermsOfServiceContent />;
}
