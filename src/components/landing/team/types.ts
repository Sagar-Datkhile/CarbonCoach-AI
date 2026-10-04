export type SocialPlatform = "LinkedIn" | "GitHub" | "Email" | "X" | "Portfolio" | string;

export interface SocialLink {
  platform: SocialPlatform;
  icon: "Linkedin" | "Github" | "Mail" | "Globe" | string;
  url: string;
  type: "external" | "mailto";
  ariaLabel?: string;
}

export interface TeamMemberAvatar {
  shape: "Circle";
  size: string; // e.g. "96px"
  fallback: string; // e.g. "SD"
  src?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  tag: string;
  bio: string;
  avatar: TeamMemberAvatar;
  socials: SocialLink[];
  availableForHire?: boolean;
}

export interface CollaborationBannerData {
  enabled: boolean;
  title: string;
  description: string;
  primaryButton: {
    label: string;
    action: string;
    url?: string;
  };
}

export interface TeamSectionData {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  members: TeamMember[];
  collaborationBanner?: CollaborationBannerData;
}
