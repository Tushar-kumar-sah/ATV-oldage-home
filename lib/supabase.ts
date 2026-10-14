import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  '';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  '';

const supabaseSecretKey =
  process.env.SUPABASE_SECRET_KEY ||
  '';

/**
 * Browser / Client-side Supabase client for React client components
 */
export function getSupabaseBrowserClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Admin / Service-Role Supabase client with elevated privileges
 * Use ONLY in secure server contexts (API routes, background tasks, migrations)
 */
export function getSupabaseAdminClient() {
  return createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Default export: standard universal client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
