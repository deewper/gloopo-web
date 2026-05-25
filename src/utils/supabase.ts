import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

// Flag to check if Supabase is properly configured in environment variables (ignores default placeholders)
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project-id') &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseAnonKey.includes('your-anon-api-key')
);

if (!isSupabaseConfigured && (supabaseUrl || supabaseAnonKey)) {
  console.warn(
    '⚠️ GLOOPO: Invalid Supabase environment variables detected! ' +
    'Please verify that NEXT_PUBLIC_SUPABASE_URL starts with https:// and doesn\'t contain placeholders. ' +
    'Operating in Mock Admin Mode.'
  );
} else if (!isSupabaseConfigured) {
  console.warn(
    '⚠️ GLOOPO: Supabase environment variables are missing! ' +
    'Please define NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file. ' +
    'Operating in Mock Admin Mode.'
  );
}

// Export Supabase client if configured, otherwise null
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
