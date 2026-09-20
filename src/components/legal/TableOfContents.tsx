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
      const elementPosition = targetEl.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = Math.max(0, elementPosition - topOffset);

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      try {
        window.history.pushState(null, "", `#${id}`);
      } catch {
        // Safely ignore history errors
      }
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
                    "flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors border-l-[3px]",
                    isActive
                      ? "bg-[#EAF5EE] text-[#075E45] font-semibold border-[#075E45]"
                      : "border-transparent text-[#475467] hover:bg-[#FAFBF8] hover:text-[#111827]"
                  )}
                >
                  <span className="truncate flex items-center">
                    <span className="opacity-60 mr-1.5 font-mono">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="truncate">{section.title}</span>
                  </span>
                  <span
                    className={cn(
                      "w-1.5 h-1.5 rounded-full shrink-0 ml-2 transition-all duration-200",
                      isActive
                        ? "bg-[#075E45] scale-100 opacity-100"
                        : "scale-0 opacity-0"
                    )}
                  />
                </a>
              );
            })}
          </div>
        )}
      </div>

      {/* Desktop Sticky Table of Contents Card */}
      <div className="hidden lg:block rounded-2xl border border-[#E3E7E3] bg-white p-5 shadow-xs max-h-[calc(100vh-7.5rem)] overflow-y-auto">
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
                    "group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors duration-150 border-l-[3px]",
                    isActive
                      ? "bg-[#EAF5EE] text-[#075E45] font-semibold shadow-xs border-[#075E45]"
                      : "border-transparent text-[#667085] hover:bg-[#FAFBF8] hover:text-[#111827] hover:border-[#E3E7E3]"
                  )}
                >
                  <span className="truncate flex items-center">
                    <span
                      className={cn(
                        "mr-1.5 font-mono text-[11px] transition-colors",
                        isActive
                          ? "text-[#075E45]/80 font-bold"
                          : "text-[#9CA3AF] group-hover:text-[#667085]"
                      )}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="truncate">{section.title}</span>
                  </span>
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full shrink-0 ml-2 transition-all duration-200",
                      isActive
                        ? "bg-[#075E45] scale-100 opacity-100 shadow-[0_0_8px_rgba(7,94,69,0.5)]"
                        : "scale-0 opacity-0"
                    )}
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
