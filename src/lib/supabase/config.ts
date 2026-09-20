/**
 * Supabase configuration utility.
 * Automatically cleans and normalizes the base project URL to ensure
 * accidentally appended paths (like '/rest/v1/' or trailing slashes)
 * do not cause PGRST125 ("Invalid path specified in request URL") errors
 * on Auth or Storage endpoints.
 */
export function getSupabaseUrl(): string {
  const rawUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  return rawUrl.trim().replace(/\/rest\/v1\/?$/i, "").replace(/\/+$/, "");
}

export function getSupabaseAnonKey(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key"
  ).trim();
}
