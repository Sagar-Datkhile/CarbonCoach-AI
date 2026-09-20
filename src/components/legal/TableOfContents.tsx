"use client";

import React, { useState, useEffect } from "react";
import { PolicySectionItem } from "./types";
import { cn } from "@/lib/utils";
import { ListFilter, ChevronRight } from "lucide-react";

interface TableOfContentsProps {
  sections: PolicySectionItem[];
  activeId: string;
  onSelectSection?: (id: string) => void;
  className?: string;
}

export function TableOfContents({
  sections,
  activeId,
  onSelectSection,
  className,
}: TableOfContentsProps) {
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsOpenMobile(false);
    onSelectSection?.(id);

    const targetEl = document.getElementById(id);
    if (targetEl) {
      const topOffset = 100;
      const elementPosition = targetEl.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const activeSectionObj = sections.find((s) => s.id === activeId);

  return (
    <nav
      aria-label="Table of contents"
      className={cn("w-full", className)}
    >
      {/* Mobile Accordion Toggle */}
      <div className="lg:hidden mb-6">
        <button
          type="button"
          onClick={() => setIsOpenMobile((prev) => !prev)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border border-[#E3E7E3] rounded-xl text-sm font-semibold text-[#111827] shadow-xs"
          aria-expanded={isOpenMobile}
        >
          <span className="flex items-center gap-2">
            <ListFilter className="w-4 h-4 text-[#0B7252]" />
            <span>Contents: {activeSectionObj?.title || "Jump to section"}</span>
          </span>
          <ChevronRight
            className={cn(
              "w-4 h-4 text-[#667085] transition-transform duration-200",
              isOpenMobile && "rotate-90"
            )}
          />
        </button>

        {isOpenMobile && (
          <div className="mt-2 p-3 bg-white border border-[#E3E7E3] rounded-xl shadow-md space-y-1">
            {sections.map((section, index) => {
              const isActive = activeId === section.id;
              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={(e) => handleClick(e, section.id)}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                    isActive
                      ? "bg-[#EAF5EE] text-[#075E45] font-bold"
                      : "text-[#475467] hover:bg-[#FAFBF8] hover:text-[#111827]"
                  )}
                >
                  <span className="truncate">
                    {index + 1}. {section.title}
                  </span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0B7252]" />
                  )}
                </a>
              );
            })}
          </div>
        )}
      </div>

      {/* Desktop Sticky Table of Contents Card */}
      <div className="hidden lg:block sticky top-28 rounded-2xl border border-[#E3E7E3] bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E3E7E3]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827] flex items-center gap-2">
            <ListFilter className="w-4 h-4 text-[#0B7252]" />
            <span>Table of Contents</span>
          </h3>
          <span className="text-[11px] font-semibold text-[#667085] bg-[#FAFBF8] px-2 py-0.5 rounded-md border border-[#E3E7E3]">
            {sections.length} sections
          </span>
        </div>

        <ul className="space-y-1">
          {sections.map((section, index) => {
            const isActive = activeId === section.id;
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  onClick={(e) => handleClick(e, section.id)}
                  className={cn(
                    "group flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-200",
                    isActive
                      ? "bg-[#EAF5EE] text-[#075E45] font-bold shadow-xs border-l-3 border-[#075E45]"
                      : "text-[#667085] hover:bg-[#FAFBF8] hover:text-[#111827]"
                  )}
                >
                  <span className="truncate">
                    <span className="opacity-60 mr-1.5 font-normal">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {section.title}
                  </span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#075E45] shrink-0" />
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
