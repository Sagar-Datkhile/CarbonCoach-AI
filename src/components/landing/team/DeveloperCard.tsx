"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { TeamMember } from "./types";
import { SocialButton } from "./SocialButton";
import { Sparkles } from "lucide-react";

interface DeveloperCardProps {
  member: TeamMember;
  index?: number;
  showRoleBadge?: boolean;
  showShortBio?: boolean;
  showSocialLinks?: boolean;
  showAvailabilityIndicator?: boolean;
}

const emptySubscribe = () => () => {};

export function DeveloperCard({
  member,
  index = 0,
  showRoleBadge = true,
  showShortBio = true,
  showSocialLinks = true,
  showAvailabilityIndicator = false,
}: DeveloperCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const hasMounted = React.useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [failedSrc, setFailedSrc] = React.useState<string | null>(null);

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 40 }}
      whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: shouldReduceMotion ? 0.2 : 0.6,
        delay: index * 0.15,
        ease: "easeOut",
      }}
      whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
      className="group relative h-full flex flex-col justify-between rounded-[24px] border border-[#E3E7E3] dark:border-[#222F3E] bg-white/80 dark:bg-[#151D2A]/90 backdrop-blur-md p-8 sm:p-9 shadow-sm hover:shadow-xl hover:border-[#0B7252]/30 dark:hover:border-[#10B981]/40 transition-all duration-300"
    >
      {/* Decorative gradient highlight in card top right */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#EAF5EE]/60 dark:from-[#063D2E]/30 to-transparent rounded-tr-[24px] pointer-events-none -z-10" />

      {/* Card Header & Content */}
      <div className="space-y-6">
        {/* Top row: Avatar & Badges */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          {/* Avatar (96px circle) */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-[#075E45] to-[#10B981] shadow-md">
              <div className="w-full h-full rounded-full bg-[#FAFBF8] dark:bg-[#0E1522] flex items-center justify-center overflow-hidden border-2 border-white dark:border-[#1F2C3F]">
                {hasMounted && member.avatar.src && failedSrc !== member.avatar.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={member.avatar.src}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={() => setFailedSrc(member.avatar.src || null)}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#075E45] to-[#0B7252] flex items-center justify-center text-white font-bold text-2xl tracking-wide select-none">
                    {member.avatar.fallback}
                  </div>
                )}
              </div>
            </div>

            {/* Optional Availability Pulse */}
            {showAvailabilityIndicator && member.availableForHire && (
              <span
                className="absolute bottom-1 right-1 flex h-4 w-4"
                title="Available for collaboration"
              >
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white dark:border-[#151D2A]" />
              </span>
            )}
          </div>

          {/* Name, Role & Spec tags */}
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h3 className="text-xl sm:text-2xl font-bold text-[#111827] dark:text-white tracking-tight">
                {member.name}
              </h3>
            </div>

            {showRoleBadge && (
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EAF5EE] dark:bg-[#063D2E] text-[#075E45] dark:text-[#34D399] border border-[#075E45]/15 dark:border-[#10B981]/25">
                  <Sparkles className="w-3 h-3 text-[#0B7252] dark:text-[#34D399]" />
                  {member.role}
                </span>
              </div>
            )}

            {member.tag && (
              <p className="text-xs font-semibold tracking-wider text-[#0B7252] dark:text-[#34D399] uppercase pt-0.5">
                {member.tag}
              </p>
            )}
          </div>
        </div>

        {/* Short Bio */}
        {showShortBio && (
          <p className="text-sm sm:text-base text-[#475467] dark:text-[#9CA3AF] leading-relaxed font-normal text-center sm:text-left">
            {member.bio}
          </p>
        )}
      </div>

      {/* Card Footer: Socials */}
      {showSocialLinks && member.socials.length > 0 && (
        <div className="pt-6 mt-6 border-t border-[#E3E7E3]/80 dark:border-[#222F3E] flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
          {member.socials.map((social) => (
            <SocialButton
              key={`${member.id}-${social.platform}`}
              social={social}
              showLabel={true}
              className="flex-1 sm:flex-initial"
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
