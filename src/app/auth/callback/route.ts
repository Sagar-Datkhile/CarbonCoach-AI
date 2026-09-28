import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // Determine origin to redirect to, accounting for reverse proxies/load balancers
  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocalEnv = process.env.NODE_ENV === "development";
  const baseUrl = isLocalEnv || !forwardedHost ? origin : `https://${forwardedHost}`;

  // If OAuth provider returned an error (e.g., user cancelled)
  if (error) {
    console.error("OAuth error in callback:", error, errorDescription);
    const message = errorDescription || error;
    return NextResponse.redirect(`${baseUrl}/login?error=${encodeURIComponent(message)}`);
  }

  // Sanitize next URL to prevent open redirect vulnerabilities
  let next = searchParams.get("next") ?? "/dashboard";
  if (!next.startsWith("/") || next.startsWith("//")) {
    next = "/dashboard";
  }

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (!exchangeError) {
      return NextResponse.redirect(`${baseUrl}${next}`);
    } else {
      console.error("Supabase code exchange error:", exchangeError.message);
      return NextResponse.redirect(`${baseUrl}/login?error=${encodeURIComponent(exchangeError.message)}`);
    }
  }

  // Return to login with error if verification fails
  return NextResponse.redirect(`${baseUrl}/login?error=auth_callback_failed`);
}

