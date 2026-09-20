"use client";

import React from "react";
import { Mail, Globe, ExternalLink } from "lucide-react";
import { SocialLink } from "./types";
import { cn } from "@/lib/utils";

interface SocialButtonProps {
  social: SocialLink;
  className?: string;
  showLabel?: boolean;
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export function SocialButton({
  social,
  className,
  showLabel = false,
}: SocialButtonProps) {
  const getIcon = () => {
    const iconProps = {
      className:
        "w-4 h-4 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-6",
    };

    switch (social.icon.toLowerCase()) {
      case "linkedin":
        return <LinkedInIcon {...iconProps} />;
      case "github":
        return <GitHubIcon {...iconProps} />;
      case "mail":
        return <Mail {...iconProps} />;
      case "globe":
        return <Globe {...iconProps} />;
      default:
        return <ExternalLink {...iconProps} />;
    }
  };

  const isMailto = social.type === "mailto" || social.url.startsWith("mailto:");

  return (
    <a
      href={social.url}
      target={isMailto ? undefined : "_blank"}
      rel={isMailto ? undefined : "noopener noreferrer"}
      aria-label={social.ariaLabel || `${social.platform} link`}
      className={cn(
        "group inline-flex items-center justify-center gap-2 px-3.5 py-2 min-h-[40px]",
        "rounded-xl border border-[#E3E7E3] bg-white text-[#475467]",
        "text-xs font-semibold shadow-xs",
        "transition-all duration-200 ease-out",
        "hover:-translate-y-1 hover:shadow-md hover:bg-[#EAF5EE] hover:text-[#075E45] hover:border-[#075E45]/30",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#075E45] focus-visible:ring-offset-2",
        "active:translate-y-0 active:scale-98",
        className
      )}
    >
      <span className="flex items-center justify-center text-inherit">
        {getIcon()}
      </span>
      {showLabel && <span>{social.platform}</span>}
    </a>
  );
}
