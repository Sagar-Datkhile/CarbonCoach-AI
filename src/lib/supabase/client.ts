import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/database";
import { getSupabaseUrl, getSupabaseAnonKey } from "./config";

export function createClient() {
  return createBrowserClient<Database>(getSupabaseUrl(), getSupabaseAnonKey());
}
