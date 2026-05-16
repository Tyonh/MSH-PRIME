import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Client administrativo com Service Role Key.
 * Bypassa RLS — usar APENAS em Server Actions e API Routes.
 * NUNCA expor no frontend (client components).
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!url || !key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY não configurada no .env.local");
  }

  return createSupabaseClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
