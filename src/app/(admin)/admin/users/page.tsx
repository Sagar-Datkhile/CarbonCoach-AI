import React from "react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Users, Shield, Calendar } from "lucide-react";

export const metadata = {
  title: "Registered Users — Admin Portal",
};

export default async function AdminUsersPage() {
  const supabase = await createClient();

  // Fetch profiles joined with household profiles
  const { data: users } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#111827]">
          Registered Users
        </h1>
        <p className="text-sm text-[#667085] mt-1">
          Inspect platform users and role assignments.
        </p>
      </div>

      <Card elevated>
        <CardHeader className="pb-3 border-b border-[#F3F8F3]">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">User Directory</CardTitle>
            <Badge variant="neutral">{users?.length || 0} Total</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#FAFBF8] border-b border-[#E3E7E3] text-[#667085] text-xs uppercase font-semibold">
              <tr>
                <th className="px-5 py-3.5">User</th>
                <th className="px-5 py-3.5">Email</th>
                <th className="px-5 py-3.5 text-center">Role</th>
                <th className="px-5 py-3.5 text-right">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E7E3]">
              {users && users.length > 0 ? (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#FAFBF8]/70">
                    <td className="px-5 py-4 font-semibold text-[#111827]">
                      {u.full_name || "Unnamed User"}
                    </td>
                    <td className="px-5 py-4 text-[#667085]">
                      {u.email}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <Badge variant={u.role === "admin" ? "primary" : "neutral"}>
                        {u.role.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-right text-xs text-[#667085]">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-xs text-[#667085]">
                    No registered users found in the database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
