"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ArrowUpRight, MessageSquareCheck, UserCheck } from "lucide-react";
import { TEAM_CONTACTS } from "@/constants/contact";

function LinkedInIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function GithubIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export function ContactSupport() {
  return (
    <section id="contact" className="py-20 bg-white border-y border-[#E3E7E3] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0B7252] bg-[#EAF5EE] px-3 py-1 rounded-full inline-block">
            Support & Assistance
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] mt-4 tracking-tight">
            Need Help?
          </h2>
          <p className="text-base sm:text-lg text-[#667085] mt-3">
            Facing an issue or have feedback? Get in touch with our team.
          </p>
        </div>

        {/* Team Member Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {TEAM_CONTACTS.map((member) => (
            <Card
              key={member.id}
              elevated
              className="border-[#E3E7E3] flex flex-col justify-between hover:border-[#0B7252]/40 transition-colors"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[#EAF5EE] text-[#075E45] flex items-center justify-center">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <Badge variant="success">Team Lead</Badge>
                </div>
                <CardTitle className="text-xl font-bold text-[#111827] mt-4">
                  {member.name}
                </CardTitle>
                <p className="text-xs font-semibold text-[#0B7252] uppercase tracking-wider">
                  {member.role}
                </p>
              </CardHeader>
              <CardContent className="space-y-4 pt-0 flex-1 flex flex-col justify-between">
                <p className="text-sm text-[#667085] leading-relaxed">
                  Connect with {member.name.split(" ")[0]} for inquiries regarding system architecture, bill calculations, and technical collaboration.
                </p>

                <div className="pt-2 space-y-2.5">
                  {/* LinkedIn Link */}
                  <a
                    href={member.linkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl border border-[#075E45] bg-[#FAFBF8] hover:bg-[#EAF5EE] text-[#075E45] text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-[#0B7252] focus-visible:outline-offset-2 min-h-[44px]"
                    aria-label={`Open LinkedIn profile for ${member.name} in a new tab`}
                  >
                    <span className="flex items-center gap-2">
                      <LinkedInIcon className="w-4 h-4" />
                      <span>Connect on LinkedIn</span>
                    </span>
                    <ArrowUpRight className="w-4 h-4 ml-2 shrink-0" />
                  </a>

                  {/* GitHub Profile (placed below LinkedIn) */}
                  <a
                    href={member.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl border border-[#E3E7E3] hover:border-[#111827] bg-[#FAFBF8] hover:bg-[#F3F8F3] text-[#111827] text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-[#0B7252] focus-visible:outline-offset-2 min-h-[44px]"
                    aria-label={`Open GitHub profile for ${member.name} in a new tab`}
                  >
                    <span className="flex items-center gap-2">
                      <GithubIcon className="w-4 h-4" />
                      <span>GitHub Profile</span>
                    </span>
                    <ArrowUpRight className="w-4 h-4 ml-2 shrink-0" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Support Notice */}
        <div className="mt-12 max-w-4xl mx-auto rounded-2xl bg-[#FAFBF8] border border-[#E3E7E3] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EAF5EE] text-[#075E45] flex items-center justify-center shrink-0">
              <MessageSquareCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#111827]">
                Direct Developer Support
              </h4>
              <p className="text-xs text-[#667085] mt-0.5">
                Reach out directly to Sagar Datkhile or Pranav Patil on LinkedIn or GitHub for any assistance.
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-[#075E45] bg-[#EAF5EE] px-3 py-1.5 rounded-lg shrink-0">
            Open Source & Active
          </span>
        </div>
      </div>
    </section>
  );
}
