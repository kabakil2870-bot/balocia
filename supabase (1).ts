import { createClient, SupabaseClient, User as SupabaseUser, Session } from '@supabase/supabase-js';
import { User, DailyQuota } from '../types';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://nztlkvparlnamcsjmcqx.supabase.co';

const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  '';

// Indicates whether the publishable key is provided by environment
export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabasePublishableKey && supabasePublishableKey.trim().length > 0
);

export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabasePublishableKey || 'placeholder-anon-key-awaiting-env',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

/**
 * Get current active JWT token to include in backend Authorization: Bearer <token>
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) return null;
    return data.session.access_token;
  } catch {
    return null;
  }
}

/**
 * Fetch profile and quota for authenticated user
 */
export async function fetchUserAndQuota(): Promise<{
  user: User | null;
  quota: DailyQuota;
  rawUser: SupabaseUser | null;
}> {
  const defaultQuota: DailyQuota = {
    date: new Date().toISOString().split('T')[0],
    used: 0,
    total: 5,
    remaining: 5,
  };

  try {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) {
      return { user: null, quota: defaultQuota, rawUser: null };
    }

    const authUser = authData.user;

    // Fetch profile
    let appUser: User = {
      id: authUser.id,
      name:
        authUser.user_metadata?.name ||
        authUser.user_metadata?.full_name ||
        authUser.email?.split('@')[0] ||
        'Kanka',
      email: authUser.email || '',
      role: 'user',
      createdAt: authUser.created_at,
      isPremium: false,
    };

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle();

    if (profile) {
      appUser = {
        id: profile.id,
        name: profile.name || appUser.name,
        email: profile.email || appUser.email,
        role: (profile.role as any) || 'user',
        createdAt: profile.created_at || appUser.createdAt,
        isPremium: Boolean(profile.is_premium),
        isBanned: Boolean(profile.is_banned),
        customQuota: profile.custom_quota || undefined,
      };
    }

    // Call server quota endpoint with Bearer token for authoritative daily count
    const token = await getAuthToken();
    if (token) {
      try {
        const res = await fetch('/api/quota', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const quotaData = await res.json();
          return { user: appUser, quota: quotaData, rawUser: authUser };
        }
      } catch (err) {
        console.warn('Could not fetch server quota:', err);
      }
    }

    return { user: appUser, quota: defaultQuota, rawUser: authUser };
  } catch (err) {
    console.error('Error fetching Supabase user & quota:', err);
    return { user: null, quota: defaultQuota, rawUser: null };
  }
}
