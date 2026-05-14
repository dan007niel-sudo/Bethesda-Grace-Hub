import { createClient } from '@supabase/supabase-js';

const URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(URL && KEY);

// Create the client even if vars are missing so feature code can import the
// singleton without crashing; calls will fail until env is set, which the UI
// already gates behind `isSupabaseConfigured`.
export const supabase = createClient(URL ?? '', KEY ?? '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
