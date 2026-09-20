"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Mail, Sparkles, ArrowRight } from "lucide-react";
import { CollaborationBannerData } from "./types";

interface CollaborationBannerProps {
  data: CollaborationBannerData;
  className?: string;
}

export function CollaborationBanner({
  data,
  className = "",
}: CollaborationBannerProps) {
  const shouldReduceMotion = useReducedMotion();

  if (!data.enabled) return null;

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
      whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`relative overflow-hidden rounded-[24px] border border-[#0B7252]/20 bg-gradient-to-r from-[#075E45] to-[#0B7252] p-8 sm:p-10 text-white shadow-xl ${className}`}
    >
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-[#10B981]/20 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#EAF5EE] backdrop-blur-xs mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Open for Collaboration</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {data.title}
          </h3>
          <p className="text-sm sm:text-base text-[#EAF5EE]/90 leading-relaxed">
            {data.description}
          </p>
        </div>

        <div className="shrink-0 w-full sm:w-auto">
          <a
            href={data.primaryButton.url || data.primaryButton.action}
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white text-[#075E45] font-bold text-sm shadow-md hover:bg-[#EAF5EE] hover:shadow-lg transition-all duration-200 active:scale-98 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#075E45]"
          >
            <Mail className="w-4 h-4" />
            <span>{data.primaryButton.label}</span>
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
