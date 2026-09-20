import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Home, Users, DollarSign, Globe, Edit } from "lucide-react";

interface HouseholdSnapshotProps {
  household: {
    householdName: string;
    homeType: string;
    occupantsCount: number;
    region: string;
    budgetTier: string;
    preferredCurrency: string;
  };
}

export function HouseholdSnapshotCard({ household }: HouseholdSnapshotProps) {
  return (
    <Card elevated>
      <CardHeader className="pb-3 border-b border-[#F3F8F3] flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#EAF5EE] text-[#075E45] flex items-center justify-center">
            <Home className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-base">{household.householdName}</CardTitle>
            <span className="text-xs text-[#667085]">Household Profile</span>
          </div>
        </div>
        <Link
          href="/profile"
          className="text-xs font-semibold text-[#0B7252] hover:text-[#075E45] inline-flex items-center gap-1"
        >
          <Edit className="w-3.5 h-3.5" />
          Edit
        </Link>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        <div className="flex items-center justify-between text-xs py-1 border-b border-[#F3F8F3]">
          <span className="text-[#667085] flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5 text-[#667085]" />
            Ownership Type
          </span>
          <Badge variant="neutral">{household.homeType}</Badge>
        </div>

        <div className="flex items-center justify-between text-xs py-1 border-b border-[#F3F8F3]">
          <span className="text-[#667085] flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#667085]" />
            Occupants
          </span>
          <span className="font-semibold text-[#111827]">{household.occupantsCount} People</span>
        </div>

        <div className="flex items-center justify-between text-xs py-1 border-b border-[#F3F8F3]">
          <span className="text-[#667085] flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-[#667085]" />
            Budget Tier
          </span>
          <span className="font-semibold text-[#111827]">{household.budgetTier}</span>
        </div>

        <div className="flex items-center justify-between text-xs py-1">
          <span className="text-[#667085] flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#667085]" />
            Region / Grid
          </span>
          <span className="font-semibold text-[#111827]">{household.region}</span>
        </div>
      </CardContent>
    </Card>
  );
}
