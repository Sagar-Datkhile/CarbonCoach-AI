"use client";

import React, { useState, useRef, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  User,
  Settings,
  MessageSquare,
  LogOut,
  ChevronsUpDown,
} from "lucide-react";
import { LogoutConfirmDialog } from "./LogoutConfirmDialog";
import { FeedbackModal } from "./FeedbackModal";

export interface ProfileDropdownProps {
  userName: string;
  userEmail: string;
  avatarUrl?: string | null;
  userRole?: string;
  plan?: string;
  onNavigate?: () => void;
  className?: string;
}

const emptySubscribe = () => () => {};

export function ProfileDropdown({
  userName,
  userEmail,
  avatarUrl,
  onNavigate,
  className = "",
}: ProfileDropdownProps) {
  const hasMounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [failedAvatarUrl, setFailedAvatarUrl] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close dropdown on click outside or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Compute initials fallback
  const getInitials = (name: string, email: string) => {
    if (name && name.trim()) {
      const parts = name.trim().split(/\s+/);
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return "CC";
  };

  const initials = getInitials(userName, userEmail);
  const showLiveAvatar = Boolean(hasMounted && avatarUrl && failedAvatarUrl !== avatarUrl);

  const handleMenuItemClick = () => {
    setIsOpen(false);
    onNavigate?.();
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Popover Dropdown Card (Positioned Above Profile Card) */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-profile-menu-button"
          className="absolute bottom-[calc(100%+8px)] left-0 w-full min-w-[270px] bg-white dark:bg-[#151D2A] rounded-2xl shadow-2xl border border-[#E3E7E3] dark:border-[#222F3E] p-2 z-50 animate-in fade-in zoom-in-95 duration-200 origin-bottom-left"
        >
          {/* Header Section with User info */}
          <div className="p-3 bg-[#F8FAF9] dark:bg-[#0E1522] rounded-xl border border-[#EAF0EB] dark:border-[#222F3E] mb-1.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#EAF5EE] dark:bg-[#063D2E] text-[#075E45] dark:text-[#34D399] flex items-center justify-center font-bold text-xs shrink-0 border border-[#0B7252]/20 dark:border-[#10B981]/30 overflow-hidden">
                {showLiveAvatar && avatarUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={avatarUrl}
                    alt={userName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={() => setFailedAvatarUrl(avatarUrl)}
                  />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#111827] dark:text-[#F9FAFB] truncate">
                  {userName || "Carbon Coach User"}
                </p>
                <p className="text-[11px] text-[#667085] dark:text-[#9CA3AF] truncate">
                  {userEmail || "user@carboncoach.ai"}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="space-y-0.5" role="none">
            <Link
              href="/profile"
              role="menuitem"
              onClick={handleMenuItemClick}
              className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-[#344054] dark:text-[#D1D5DB] rounded-xl hover:bg-[#F3F8F3] dark:hover:bg-[#1E293B] hover:text-[#075E45] dark:hover:text-[#34D399] transition-colors group"
            >
              <User className="w-4 h-4 text-[#667085] dark:text-[#9CA3AF] group-hover:text-[#075E45] dark:group-hover:text-[#34D399] transition-colors shrink-0" />
              <span>My Profile</span>
            </Link>

            <Link
              href="/settings"
              role="menuitem"
              onClick={handleMenuItemClick}
              className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-[#344054] dark:text-[#D1D5DB] rounded-xl hover:bg-[#F3F8F3] dark:hover:bg-[#1E293B] hover:text-[#075E45] dark:hover:text-[#34D399] transition-colors group"
            >
              <Settings className="w-4 h-4 text-[#667085] dark:text-[#9CA3AF] group-hover:text-[#075E45] dark:group-hover:text-[#34D399] transition-colors shrink-0" />
              <span>Settings</span>
            </Link>

            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setIsOpen(false);
                setShowFeedbackModal(true);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-[#344054] dark:text-[#D1D5DB] rounded-xl hover:bg-[#F3F8F3] dark:hover:bg-[#1E293B] hover:text-[#075E45] dark:hover:text-[#34D399] transition-colors group text-left cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-[#667085] dark:text-[#9CA3AF] group-hover:text-[#075E45] dark:group-hover:text-[#34D399] transition-colors shrink-0" />
              <span>Feedback</span>
            </button>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#F3F8F3] dark:bg-[#222F3E] my-1" role="separator" />

          {/* Log Out Button */}
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setIsOpen(false);
              setShowLogoutConfirm(true);
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-[#D92D20] dark:text-[#F87171] rounded-xl hover:bg-[#FEF3F2] dark:hover:bg-[#7F1D1D]/30 transition-colors group text-left cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-[#D92D20] dark:text-[#F87171] transition-transform group-hover:-translate-x-0.5 shrink-0" />
            <span>Log Out</span>
          </button>
        </div>
      )}

      {/* Footer Profile Trigger Card (Bottom-Left) */}
      <button
        ref={triggerRef}
        id="user-profile-menu-button"
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-3 p-2.5 rounded-2xl transition-all duration-200 text-left border cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#075E45]/20 ${isOpen
            ? "bg-[#EAF5EE] dark:bg-[#063D2E] border-[#0B7252]/30 dark:border-[#10B981]/30 shadow-xs"
            : "border-transparent hover:bg-[#EAF5EE]/70 dark:hover:bg-[#151D2A] hover:border-[#E3E7E3] dark:hover:border-[#222F3E]"
          }`}
      >
        {/* Avatar (48px) */}
        <div className="relative w-12 h-12 rounded-full bg-[#EAF5EE] dark:bg-[#063D2E] text-[#075E45] dark:text-[#34D399] flex items-center justify-center font-bold text-sm shrink-0 border border-[#E3E7E3] dark:border-[#222F3E] group-hover:border-[#075E45]/40 dark:group-hover:border-[#10B981]/40 overflow-hidden shadow-xs transition-colors">
          {showLiveAvatar && avatarUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={avatarUrl}
              alt={userName}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={() => setFailedAvatarUrl(avatarUrl)}
            />
          ) : (
            <span>{initials}</span>
          )}
          {/* Active status indicator dot */}
          <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-[#12B76A] border-2 border-white dark:border-[#0D1520]" />
        </div>

        {/* User Info (Name + Email + Plan pill) */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-xs text-[#111827] dark:text-[#F9FAFB] truncate group-hover:text-[#075E45] dark:group-hover:text-[#34D399] transition-colors">
              {userName || "User"}
            </span>
          </div>
          <p className="text-[11px] text-[#667085] dark:text-[#9CA3AF] truncate leading-tight mt-0.5">
            {userEmail || "user@carboncoach.ai"}
          </p>
        </div>

        {/* Chevron Indicator */}
        <ChevronsUpDown
          className={`w-4 h-4 text-[#98A2B3] group-hover:text-[#111827] dark:group-hover:text-[#F9FAFB] shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-[#075E45] dark:text-[#34D399]" : ""
            }`}
        />
      </button>

      {/* Logout Confirmation Dialog */}
      <LogoutConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
      />

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        userEmail={userEmail}
      />
    </div>
  );
}
