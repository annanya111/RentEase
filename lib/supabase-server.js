import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { isSupabaseConfigured } from './supabase';

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();
const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

// 1. Server Client for Route Handlers and Server Components (reads/writes cookies)
export function getServerSupabase() {
  if (!isSupabaseConfigured()) return null;

  try {
    const cookieStore = cookies();
    return createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            // Can be called from Server Component where cookies cannot be mutated
          }
        },
      },
    });
  } catch (err) {
    // Fallback if called outside cookie context
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
    });
  }
}

// 2. Admin / Service Role Client (Backend ONLY, bypasses RLS for administrative verification)
let serviceClient = null;
export function getAdminClient() {
  if (!isSupabaseConfigured() || !supabaseServiceKey) return null;
  if (!serviceClient) {
    serviceClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });
  }
  return serviceClient;
}

// 3. Helper for DB operations
export function getSupabaseClient() {
  return getAdminClient() || getServerSupabase();
}
