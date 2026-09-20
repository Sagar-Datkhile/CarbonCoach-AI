import React from "react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FileText, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Extraction Logs — Admin Portal",
};

export default async function AdminLogsPage() {
  const supabase = await createClient();

  const { data: logs } = await supabase
    .from("bill_extraction_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#111827]">
          AI Bill Extraction Audit Logs
        </h1>
        <p className="text-sm text-[#667085] mt-1">
          Inspect OCR attempts, latency performance, and failure diagnostics for Gemini 1.5 Flash.
        </p>
      </div>

      <Card elevated>
        <CardHeader className="pb-3 border-b border-[#F3F8F3]">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Recent Extraction Invocations</CardTitle>
            <Badge variant="neutral">{logs?.length || 0} Records</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#FAFBF8] border-b border-[#E3E7E3] text-[#667085] text-xs uppercase font-semibold">
              <tr>
                <th className="px-5 py-3.5">Timestamp</th>
                <th className="px-5 py-3.5">File Identifier</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Latency</th>
                <th className="px-5 py-3.5">Diagnostics / Error</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E7E3]">
              {logs && logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#FAFBF8]/70">
                    <td className="px-5 py-4 text-xs text-[#667085] whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-[#111827] max-w-[200px] truncate">
                      {log.file_path}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <Badge variant={log.status === "success" ? "success" : "error"}>
                        {log.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-right text-xs text-[#667085] tabular-nums whitespace-nowrap">
                      {log.processing_time_ms ? `${log.processing_time_ms} ms` : "—"}
                    </td>
                    <td className="px-5 py-4 text-xs text-[#B42318] max-w-[300px] truncate">
                      {log.error_message || "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-xs text-[#667085]">
                    No extraction logs recorded yet.
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
