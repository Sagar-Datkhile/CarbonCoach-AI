"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { DeveloperCard } from "./team/DeveloperCard";
import { teamSectionData } from "./team/teamData";
import { TeamMember, CollaborationBannerData } from "./team/types";
import { SectionReveal } from "./SectionReveal";

interface TeamSectionProps {
  id?: string;
  badge?: string;
  title?: string;
  subtitle?: string;
  members?: TeamMember[];
  collaborationBanner?: CollaborationBannerData;
  className?: string;
}

// Leaf SVG component for subtle floating eco accents
function FloatingLeaf({
  className,
  initialY = 0,
  animateY = -12,
  duration = 6,
  delay = 0,
  rotate = 0,
}: {
  className?: string;
  initialY?: number;
  animateY?: number;
  duration?: number;
  delay?: number;
  rotate?: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0.4 } : { y: initialY, rotate }}
      animate={
        shouldReduceMotion
          ? { opacity: 0.4 }
          : {
              y: [initialY, animateY, initialY],
              rotate: [rotate, rotate + 6, rotate],
            }
      }
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
      className={`absolute pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <svg
        width="38"
        height="38"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-[#0B7252]/15"
      >
        <path
          d="M12 2C7.5 2 3.5 6 3.5 11C3.5 14.5 5.5 17.5 8.5 19.5L12 22L15.5 19.5C18.5 17.5 20.5 14.5 20.5 11C20.5 6 16.5 2 12 2Z"
          fill="currentColor"
        />
        <path
          d="M12 22V7M12 11L8.5 8M12 15L15.5 12"
          stroke="white"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );
}

export function TeamSection({
  id = teamSectionData.id,
  badge = teamSectionData.badge,
  title = teamSectionData.title,
  subtitle = teamSectionData.subtitle,
  members = teamSectionData.members,
  collaborationBanner = teamSectionData.collaborationBanner,
  className = "",
}: TeamSectionProps) {
  return (
    <section
      id={id}
      className={`relative scroll-mt-20 py-24 bg-gradient-to-b from-[#FAFBF8] via-white to-[#FAFBF8] overflow-hidden ${className}`}
    >
      {/* Background Soft Glows (Low opacity emerald glows) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#075E45]/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-[#10B981]/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-12 right-10 w-[320px] h-[320px] bg-[#0B7252]/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Subtle Floating Leaves (Eco accents) */}
      <FloatingLeaf
        className="top-16 left-[8%] hidden sm:block"
        initialY={0}
        animateY={-14}
        duration={5.5}
        rotate={-15}
      />
      <FloatingLeaf
        className="top-1/3 right-[6%] hidden sm:block"
        initialY={0}
        animateY={-18}
        duration={6.5}
        delay={1.2}
        rotate={25}
      />
      <FloatingLeaf
        className="bottom-24 left-[12%] hidden lg:block"
        initialY={0}
        animateY={-10}
        duration={5}
        delay={0.6}
        rotate={10}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <SectionReveal>
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#0B7252] bg-[#EAF5EE] border border-[#0B7252]/15 shadow-xs">
              {badge}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111827] tracking-tight">
              {title}
            </h2>
            <p className="text-base sm:text-lg text-[#667085] leading-relaxed max-w-2xl mx-auto font-normal">
              {subtitle}
            </p>
          </div>
        </SectionReveal>

        {/* Responsive Grid of Developer Cards: 2 Columns on Desktop/Tablet, 1 on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          {members.map((member, index) => (
            <DeveloperCard
              key={member.id}
              member={member}
              index={index}
              showRoleBadge={true}
              showShortBio={true}
              showSocialLinks={true}
              showAvailabilityIndicator={false}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
