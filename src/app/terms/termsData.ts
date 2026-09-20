import { PolicySectionItem } from "@/components/legal/types";

export const termsSections: PolicySectionItem[] = [
  {
    id: "acceptance",
    icon: "BadgeCheck",
    title: "Acceptance of Terms",
    description:
      "By accessing, creating an account, or using CarbonCoach AI, you agree to comply with and be bound by these Terms of Service and all applicable laws and regulations.",
    points: [
      "If you do not agree with any part of these Terms, please discontinue using the platform.",
      "Continued use of CarbonCoach AI following any updates indicates your acceptance of the revised Terms.",
    ],
  },
  {
    id: "service",
    icon: "Leaf",
    title: "Our Service",
    description:
      "CarbonCoach AI is an AI-powered household energy platform providing electricity bill analysis, personalized efficiency recommendations, and carbon emission estimates.",
    points: [
      "AI-assisted bill extraction helps households organize and interpret historical consumption.",
      "All energy recommendations, savings projections, and carbon figures are informational insights.",
      "Features and tools may be updated periodically as the platform evolves.",
    ],
  },
  {
    id: "responsibilities",
    icon: "User",
    title: "User Responsibilities",
    description:
      "Users are expected to use CarbonCoach AI responsibly and help maintain account security and platform integrity.",
    points: [
      "Maintain the confidentiality of your account credentials and Google Sign-In session.",
      "Provide accurate, authentic electricity bill uploads and household profile details.",
      "Do not attempt unauthorized access, upload malicious code, or misuse AI recommendations.",
      "Users retain full ownership of their uploaded electricity bills and personal utility data.",
    ],
  },
  {
    id: "liability",
    icon: "AlertTriangle",
    title: "Limitation of Liability",
    description:
      "CarbonCoach AI delivers data-driven insights and AI suggestions solely for informational and educational purposes.",
    points: [
      "Users should review and verify extracted bill figures before making operational or financial decisions.",
      "Recommendations do not constitute certified engineering, professional financial, or legal advice.",
      "Actual bill savings and emissions reductions may vary based on weather, tariffs, and appliance usage.",
    ],
  },
  {
    id: "contact",
    icon: "Mail",
    title: "Contact Information",
    description:
      "Have questions, feedback, or need clarification regarding these Terms of Service? Reach out to the CarbonCoach AI team.",
    contactCards: [
      {
        label: "Email",
        value: "sagardatkhile.official@gmail.com",
        url: "mailto:sagardatkhile.official@gmail.com",
        icon: "Mail",
      },
      {
        label: "GitHub",
        value: "Sagar-Datkhile/CarbonCoach-AI",
        url: "https://github.com/Sagar-Datkhile/CarbonCoach-AI",
        icon: "Github",
      },
      {
        label: "LinkedIn",
        value: "in/sagardatkhile",
        url: "https://www.linkedin.com/in/sagardatkhile/",
        icon: "Linkedin",
      },
    ],
  },
];
