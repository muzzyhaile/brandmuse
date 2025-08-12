import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  // Keep this as a console.warn to avoid breaking the app when envs are missing in local dev.
  // The UI will still render with local fallback data until keys are provided.
  console.warn('[Supabase] Missing VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY');
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
        },
      })
    : (null as any);
