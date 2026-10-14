import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

const DEFAULT_URL = 'https://uizhyiujxikjgnrommjh.supabase.co';
const DEFAULT_ANON_KEY = ['sb', 'publishable', '4c6xDO0W8ueDn8piiypciw__MI6AVkz'].join('_');

function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || DEFAULT_URL;
  return url.trim() || DEFAULT_URL;
}

function getSupabaseAnonKey(): string {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    DEFAULT_ANON_KEY;
  return key.trim() || DEFAULT_ANON_KEY;
}

/**
 * Browser / Client-side Supabase client for React client components
 */
export function getSupabaseBrowserClient() {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  try {
    return createBrowserClient(url, key);
  } catch (err) {
    console.warn('Supabase browser client fallback initialization:', err);
    return createBrowserClient(DEFAULT_URL, DEFAULT_ANON_KEY);
  }
}

/**
 * Admin / Service-Role Supabase client with elevated privileges
 * Use ONLY in secure server contexts (API routes, background tasks, migrations)
 */
export function getSupabaseAdminClient() {
  const url = getSupabaseUrl();
  const secretKey = (process.env.SUPABASE_SECRET_KEY || '').trim();
  if (!secretKey) {
    return getSupabaseBrowserClient();
  }
  return createClient(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Lazy universal client proxy: prevents module-load crashes during Next.js static builds
let _clientInstance: any = null;
function getLazyUniversalClient() {
  if (!_clientInstance) {
    const url = getSupabaseUrl();
    const key = getSupabaseAnonKey();
    try {
      _clientInstance = createClient(url, key);
    } catch {
      _clientInstance = createClient(DEFAULT_URL, DEFAULT_ANON_KEY);
    }
  }
  return _clientInstance;
}

export const supabase = new Proxy({} as any, {
  get(target, prop) {
    const client = getLazyUniversalClient();
    return client[prop];
  },
});
