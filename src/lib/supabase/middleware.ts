import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { Database } from "@/types/database";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  const supabase = createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const isDemoSession = request.cookies.get("cc_demo_session")?.value === "active";
  let user = null;

  // Safe user lookup without unhandled rejection if Supabase is offline/placeholder
  const isConfigured = supabaseUrl && !supabaseUrl.includes("placeholder");
  if (isConfigured) {
    try {
      const { data } = await supabase.auth.getUser();
      user = data?.user || null;
    } catch {
      user = null;
    }
  }

  const path = request.nextUrl.pathname;

  // Protected User Routes
  const isProtectedUserRoute =
    path.startsWith("/dashboard") ||
    path.startsWith("/bills") ||
    path.startsWith("/plan") ||
    path.startsWith("/simulator") ||
    path.startsWith("/progress") ||
    path.startsWith("/profile");

  // Protected Admin Routes
  const isAdminRoute = path.startsWith("/admin");

  // Auth Pages (login, signup, forgot-password)
  const isAuthPage =
    path.startsWith("/login") ||
    path.startsWith("/signup") ||
    path.startsWith("/forgot-password");

  const isAuthenticated = !!user || isDemoSession;

  // 1. Unauthenticated user attempting to access protected route -> Redirect to login
  if (!isAuthenticated && (isProtectedUserRoute || isAdminRoute)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectTo", path);
    return NextResponse.redirect(url);
  }

  // 2. Authenticated user visiting login/signup -> Redirect to dashboard
  if (isAuthenticated && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // 3. User attempting to access admin route -> Verify admin role from backend profile
  if (user && isAdminRoute) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const userRole = (profile as { role?: string } | null)?.role;
    if (userRole !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      url.searchParams.set("error", "unauthorized_admin");
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
