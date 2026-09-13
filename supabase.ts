import 'dotenv/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Request } from 'express';

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  'https://nztlkvparlnamcsjmcqx.supabase.co';

const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  '';

export const isServerSupabaseReady = Boolean(supabaseUrl && supabaseKey && supabaseKey.trim().length > 0);

if (!isServerSupabaseReady) {
  console.warn(
    '⚠️ Supabase key is not configured in server environment. Set SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY / VITE_SUPABASE_PUBLISHABLE_KEY.'
  );
} else {
  console.log('✅ Server Supabase client connected to:', supabaseUrl);
}

// Global server client (admin or anon)
export const supabaseAdmin: SupabaseClient = createClient(
  supabaseUrl,
  supabaseKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/**
 * Creates a user-scoped Supabase client that propagates the user's JWT
 * so PostgreSQL RLS and auth.uid() evaluate properly.
 */
export function getUserSupabaseClient(token: string): SupabaseClient {
  return createClient(supabaseUrl, supabaseKey || 'placeholder-key', {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
}

/**
 * Verifies JWT token from Authorization header and returns user id
 * Strictly relies on Supabase Auth, NEVER trusts frontend-sent user_id
 */
export async function authenticateRequest(req: Request): Promise<{
  userId: string;
  email?: string;
  token: string;
} | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring('Bearer '.length).trim();
  if (!token) return null;

  try {
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data.user) {
      return null;
    }
    return {
      userId: data.user.id,
      email: data.user.email,
      token,
    };
  } catch (err) {
    console.error('authenticateRequest error:', err);
    return null;
  }
}

/**
 * Calculate current date in Europe/Istanbul
 */
export function getIstanbulDate(): string {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Istanbul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(now);
}

export interface DailyQuotaResult {
  claimed: boolean;
  used: number;
  total: number;
  remaining: number;
  quota_date: string;
  message?: string;
  error?: string;
}

/**
 * Claim daily question via RPC claim_daily_question()
 * Falls back to direct atomic table updates if RPC is not yet created in the DB
 */
export async function claimDailyQuestion(
  token: string,
  userId: string
): Promise<DailyQuotaResult> {
  const today = getIstanbulDate();
  const client = getUserSupabaseClient(token);

  // 1. First attempt: call Supabase RPC claim_daily_question()
  try {
    const { data, error } = await client.rpc('claim_daily_question');
    if (!error && data) {
      return {
        claimed: Boolean(data.claimed),
        used: Number(data.used ?? 0),
        total: Number(data.total ?? 5),
        remaining: Number(data.remaining ?? 0),
        quota_date: String(data.quota_date || today),
        message: data.message,
        error: data.error,
      };
    }
  } catch (rpcErr) {
    console.warn('claim_daily_question RPC error, trying fallback query:', rpcErr);
  }

  // 2. Resilient Fallback: Query profiles and daily_usage directly
  try {
    // Check profile
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('is_banned, custom_quota')
      .eq('id', userId)
      .maybeSingle();

    if (profile?.is_banned) {
      return {
        claimed: false,
        used: 0,
        total: 5,
        remaining: 0,
        quota_date: today,
        error: 'USER_BANNED',
        message: 'Hesabınız askıya alınmıştır.',
      };
    }

    const totalAllowed = profile?.custom_quota || 5;

    // Check usage today
    const { data: usage } = await supabaseAdmin
      .from('daily_usage')
      .select('question_count')
      .eq('user_id', userId)
      .eq('usage_date', today)
      .maybeSingle();

    const currentCount = usage?.question_count || 0;

    if (currentCount >= totalAllowed) {
      return {
        claimed: false,
        used: currentCount,
        total: totalAllowed,
        remaining: 0,
        quota_date: today,
        error: 'QUOTA_EXCEEDED',
        message: 'Bugün soru hakkın doldu kanka! 😄 Yarın tekrar bekliyorum.',
      };
    }

    const newCount = currentCount + 1;
    // Upsert daily usage
    await supabaseAdmin.from('daily_usage').upsert(
      {
        user_id: userId,
        usage_date: today,
        question_count: newCount,
      },
      { onConflict: 'user_id,usage_date' }
    );

    return {
      claimed: true,
      used: newCount,
      total: totalAllowed,
      remaining: Math.max(0, totalAllowed - newCount),
      quota_date: today,
    };
  } catch (fallbackErr: any) {
    console.error('Fallback quota claim failed:', fallbackErr);
    // Allow request in edge case failure so user is not completely blocked
    return {
      claimed: true,
      used: 1,
      total: 5,
      remaining: 4,
      quota_date: today,
    };
  }
}

/**
 * Refund daily question if the AI API throws an error
 */
export async function refundDailyQuestion(
  token: string,
  userId: string
): Promise<void> {
  const client = getUserSupabaseClient(token);
  const today = getIstanbulDate();

  // 1. Try RPC refund_daily_question()
  try {
    const { error } = await client.rpc('refund_daily_question');
    if (!error) return;
  } catch (err) {
    console.warn('refund_daily_question RPC error, trying fallback:', err);
  }

  // 2. Fallback direct update
  try {
    const { data: usage } = await supabaseAdmin
      .from('daily_usage')
      .select('question_count')
      .eq('user_id', userId)
      .eq('usage_date', today)
      .maybeSingle();

    if (usage && usage.question_count > 0) {
      await supabaseAdmin
        .from('daily_usage')
        .update({ question_count: usage.question_count - 1 })
        .eq('user_id', userId)
        .eq('usage_date', today);
    }
  } catch (err) {
    console.error('Fallback refund error:', err);
  }
}

/**
 * Read current daily quota for user
 */
export async function getDailyQuotaForUser(
  userId: string
): Promise<{ date: string; used: number; total: number; remaining: number }> {
  const today = getIstanbulDate();
  try {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('custom_quota')
      .eq('id', userId)
      .maybeSingle();

    const totalAllowed = profile?.custom_quota || 5;

    const { data: usage } = await supabaseAdmin
      .from('daily_usage')
      .select('question_count')
      .eq('user_id', userId)
      .eq('usage_date', today)
      .maybeSingle();

    const used = usage?.question_count || 0;
    return {
      date: today,
      used,
      total: totalAllowed,
      remaining: Math.max(0, totalAllowed - used),
    };
  } catch (err) {
    console.error('getDailyQuotaForUser error:', err);
    return {
      date: today,
      used: 0,
      total: 5,
      remaining: 5,
    };
  }
}
