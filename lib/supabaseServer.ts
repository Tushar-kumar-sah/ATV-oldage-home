import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

const DEFAULT_URL = 'https://uizhyiujxikjgnrommjh.supabase.co';
const DEFAULT_ANON_KEY = ['sb', 'publishable', '4c6xDO0W8ueDn8piiypciw__MI6AVkz'].join('_');

/**
 * Server-side Supabase client for Next.js App Router (Server Components & Route Handlers)
 */
export function getSupabaseServerClient() {
  const cookieStore = cookies();
  const url =
    (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || DEFAULT_URL).trim() ||
    DEFAULT_URL;
  const anonKey =
    (
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.SUPABASE_PUBLISHABLE_KEY ||
      DEFAULT_ANON_KEY
    ).trim() || DEFAULT_ANON_KEY;

  return createServerClient(url, anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // Cookies can only be modified in a Server Action or Route Handler
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: '', ...options });
        } catch {
          // Cookies can only be modified in a Server Action or Route Handler
        }
      },
    },
  });
}
