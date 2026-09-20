import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  const timestamp = new Date().toISOString();
  const service = "carboncoach-api";

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let dbStatus: "connected" | "unavailable" = "unavailable";
  let overallStatus: "ok" | "degraded" | "error" = "degraded";

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      {
        status: overallStatus,
        service,
        database: dbStatus,
        timestamp,
      },
      { status: 200 }
    );
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });

    // Lightweight connection check
    const { error } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .limit(1);

    // If table doesn't exist yet or connection works, distinguish network error from unmigrated table
    if (!error) {
      dbStatus = "connected";
      overallStatus = "ok";
    } else if (error.code === "42P01") {
      // Table undefined (pending migrations), but DB is reachable
      dbStatus = "connected";
      overallStatus = "degraded";
    } else {
      dbStatus = "unavailable";
      overallStatus = "degraded";
    }
  } catch {
    // Sanitized catch block - never expose internal stack or SQL credentials
    dbStatus = "unavailable";
    overallStatus = "error";
  }

  return NextResponse.json(
    {
      status: overallStatus,
      service,
      database: dbStatus,
      timestamp,
    },
    {
      status: overallStatus === "error" ? 503 : 200,
    }
  );
}
