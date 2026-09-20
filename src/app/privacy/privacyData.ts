import { PolicySectionItem } from "@/components/legal/types";

export const privacySections: PolicySectionItem[] = [
  {
    id: "introduction",
    icon: "ShieldCheck",
    title: "Introduction",
    description:
      "CarbonCoach AI is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store and protect your personal information when you use our platform.",
  },
  {
    id: "information-we-collect",
    icon: "Database",
    title: "Information We Collect",
    content: {
      "Account Information": [
        "Full name",
        "Email address",
        "Google profile information (if signed in with Google)",
        "Profile picture",
      ],
      "Household Information": [
        "Home type",
        "Budget preferences",
        "Energy preferences",
        "Region and household settings",
      ],
      "Electricity Bill Information": [
        "Uploaded bill images",
        "Electricity consumption",
        "Billing period",
        "Tariff information",
        "Extracted energy data",
      ],
      "Usage Information": [
        "Pages visited",
        "Device information",
        "Browser type",
        "Platform analytics",
      ],
    },
  },
  {
    id: "how-we-use-information",
    icon: "BrainCircuit",
    title: "How We Use Your Information",
    points: [
      "Provide personalized energy recommendations.",
      "Generate electricity usage insights.",
      "Estimate carbon emissions.",
      "Power AI-based bill extraction.",
      "Improve product performance and user experience.",
      "Maintain account security.",
      "Respond to support requests.",
    ],
  },
  {
    id: "ai-processing",
    icon: "Sparkles",
    title: "AI Processing",
    points: [
      "Uploaded electricity bills may be processed using AI models.",
      "AI is used only to extract relevant electricity information.",
      "Users can review and edit extracted information before saving.",
      "AI-generated recommendations are intended to assist decision making and should always be reviewed by the user.",
    ],
  },
  {
    id: "data-storage-security",
    icon: "Lock",
    title: "Data Storage & Security",
    points: [
      "Authentication is managed using Supabase Auth.",
      "User data is stored securely in Supabase PostgreSQL.",
      "Row Level Security (RLS) protects user records.",
      "Only authorized users can access their own information.",
      "Communication is encrypted using HTTPS.",
    ],
  },
  {
    id: "data-sharing",
    icon: "Users",
    title: "Data Sharing",
    points: [
      "We never sell your personal information.",
      "We do not share your uploaded electricity bills with advertisers.",
      "Information is shared only when required to provide CarbonCoach AI services or comply with legal obligations.",
    ],
  },
  {
    id: "cookies",
    icon: "Cookie",
    title: "Cookies & Authentication",
    points: [
      "Cookies are used for secure authentication.",
      "Cookies help maintain your login session.",
      "We do not use advertising cookies.",
    ],
  },
  {
    id: "your-rights",
    icon: "BadgeCheck",
    title: "Your Rights",
    points: [
      "Access your personal information.",
      "Update your profile.",
      "Delete uploaded bills.",
      "Delete your account.",
      "Request correction of inaccurate information.",
    ],
  },
  {
    id: "third-party-services",
    icon: "Globe",
    title: "Third-Party Services",
    description:
      "These services may process limited information necessary to provide platform functionality.",
    points: [
      "Google Authentication",
      "Supabase",
      "Gemini AI",
      "Vercel Hosting",
    ],
  },
  {
    id: "policy-updates",
    icon: "RefreshCw",
    title: "Changes to this Privacy Policy",
    description:
      "This Privacy Policy may be updated periodically as CarbonCoach AI evolves. Significant changes will be reflected by updating the 'Last Updated' date.",
  },
  {
    id: "contact-information",
    icon: "Mail",
    title: "Contact Information",
    description:
      "If you have any questions regarding this Privacy Policy or your personal information, please contact the CarbonCoach AI team.",
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
