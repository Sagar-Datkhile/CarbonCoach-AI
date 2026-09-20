"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ShieldCheck,
  Database,
  BrainCircuit,
  Sparkles,
  Lock,
  Users,
  Cookie,
  BadgeCheck,
  Globe,
  RefreshCw,
  Mail,
  ExternalLink,
} from "lucide-react";
import { PolicySectionItem } from "./types";
import { cn } from "@/lib/utils";

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

const iconMap: Record<string, React.ReactNode> = {
  ShieldCheck: <ShieldCheck className="w-5 h-5 text-[#075E45]" />,
  Database: <Database className="w-5 h-5 text-[#075E45]" />,
  BrainCircuit: <BrainCircuit className="w-5 h-5 text-[#075E45]" />,
  Sparkles: <Sparkles className="w-5 h-5 text-[#075E45]" />,
  Lock: <Lock className="w-5 h-5 text-[#075E45]" />,
  Users: <Users className="w-5 h-5 text-[#075E45]" />,
  Cookie: <Cookie className="w-5 h-5 text-[#075E45]" />,
  BadgeCheck: <BadgeCheck className="w-5 h-5 text-[#075E45]" />,
  Globe: <Globe className="w-5 h-5 text-[#075E45]" />,
  RefreshCw: <RefreshCw className="w-5 h-5 text-[#075E45]" />,
  Mail: <Mail className="w-5 h-5 text-[#075E45]" />,
};

interface PolicySectionProps {
  section: PolicySectionItem;
  className?: string;
}

export function PolicySection({ section, className }: PolicySectionProps) {
  const shouldReduceMotion = useReducedMotion();

  const getContactIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case "mail":
        return <Mail className="w-4 h-4 text-[#075E45]" />;
      case "github":
        return <GitHubIcon className="w-4 h-4 text-[#075E45]" />;
      case "linkedin":
        return <LinkedInIcon className="w-4 h-4 text-[#075E45]" />;
      default:
        return <ExternalLink className="w-4 h-4 text-[#075E45]" />;
    }
  };

  return (
    <motion.section
      id={section.id}
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
      whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "scroll-mt-28 rounded-2xl border border-[#E3E7E3] bg-white p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow duration-300",
        className
      )}
    >
      {/* Header with soft green icon and title */}
      <div className="flex items-center gap-3.5 mb-5">
        <div className="w-10 h-10 rounded-xl bg-[#EAF5EE] border border-[#0B7252]/15 flex items-center justify-center shrink-0">
          {iconMap[section.icon] || (
            <ShieldCheck className="w-5 h-5 text-[#075E45]" />
          )}
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111827]">
          {section.title}
        </h2>
      </div>

      {/* Description text if provided */}
      {section.description && (
        <p className="text-sm sm:text-base text-[#475467] leading-relaxed mb-4">
          {section.description}
        </p>
      )}

      {/* Category content dictionary (e.g. Information We Collect) */}
      {section.content && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {Object.entries(section.content).map(([category, items]) => (
            <div
              key={category}
              className="rounded-xl border border-[#E3E7E3] bg-[#FAFBF8] p-4.5 space-y-2.5"
            >
              <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0B7252]" />
                {category}
              </h3>
              <ul className="space-y-1.5 text-xs sm:text-sm text-[#475467]">
                {items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#0B7252] font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Bullet points list */}
      {section.points && section.points.length > 0 && (
        <ul className="space-y-2.5 mt-3">
          {section.points.map((point, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 text-sm sm:text-base text-[#475467] leading-relaxed"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#0B7252] mt-2 shrink-0" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Contact Cards */}
      {section.contactCards && section.contactCards.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-5">
          {section.contactCards.map((card, idx) => {
            const isMailto = card.url.startsWith("mailto:");
            return (
              <a
                key={idx}
                href={card.url}
                target={isMailto ? undefined : "_blank"}
                rel={isMailto ? undefined : "noopener noreferrer"}
                className="group flex flex-col p-4 rounded-xl border border-[#E3E7E3] bg-[#FAFBF8] hover:bg-[#EAF5EE] hover:border-[#075E45]/30 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#667085] group-hover:text-[#075E45] transition-colors">
                    {card.label}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-white border border-[#E3E7E3] flex items-center justify-center group-hover:bg-[#075E45] group-hover:text-white transition-colors">
                    {getContactIcon(card.icon)}
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-[#111827] group-hover:text-[#075E45] break-all truncate">
                  {card.value}
                </span>
              </a>
            );
          })}
        </div>
      )}
    </motion.section>
  );
}
