import { DailyQuota, User, WorkoutProgram, AdminStats } from './types';
import { supabase, getAuthToken, fetchUserAndQuota } from './lib/supabase';

/**
 * Get authenticated fetch headers with Supabase Bearer token
 */
async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Fetch current authenticated user and their daily question quota
 * Source of truth is Supabase Auth + Server Quota RPC
 */
export async function fetchCurrentUser(): Promise<{
  user: User | null;
  quota: DailyQuota;
}> {
  const { user, quota } = await fetchUserAndQuota();
  return { user, quota };
}

/**
 * Fetch authoritative daily quota from server
 */
export async function fetchQuota(): Promise<DailyQuota> {
  const headers = await getAuthHeaders();
  const res = await fetch('/api/quota', { headers });
  if (!res.ok) {
    return {
      date: new Date().toISOString().split('T')[0],
      used: 0,
      total: 5,
      remaining: 5,
    };
  }
  return res.json();
}

/**
 * Ask Bilo a question
 * Enforces server-side claim_daily_question() before calling OpenAI
 */
export async function askBiloApi(
  question: string,
  mode?: 'sport' | 'knowledge'
): Promise<{
  id: string;
  answer: string;
  mode: 'sport' | 'knowledge';
  expression: string;
  quota: DailyQuota;
  createdAt: string;
}> {
  const headers = await getAuthHeaders();
  const res = await fetch('/api/ask', {
    method: 'POST',
    headers,
    body: JSON.stringify({ question, mode }),
  });

  const data = await res.json();
  if (!res.ok) {
    if (res.status === 429) {
      const error: any = new Error(
        data.message || 'Bugün soru hakkın doldu kanka! 😄 Yarın tekrar bekliyorum.'
      );
      error.isQuotaExceeded = true;
      error.quota = data.quota;
      throw error;
    }
    if (res.status === 401) {
      const error: any = new Error(
        data.message || 'Soru sormak için lütfen önce giriş yap kanka!'
      );
      error.isUnauthorized = true;
      throw error;
    }
    throw new Error(data.error || 'Soru sorulurken hata oluştu.');
  }

  return data;
}

/**
 * Fetch user's question history from Supabase questions table
 */
export async function fetchQuestions(): Promise<any[]> {
  const headers = await getAuthHeaders();
  const res = await fetch('/api/questions', { headers });
  if (!res.ok) return [];
  return res.json();
}

/**
 * Delete a question from Supabase questions table
 */
export async function deleteQuestionApi(id: string): Promise<{ success: boolean }> {
  const headers = await getAuthHeaders();
  const res = await fetch(`/api/questions/${id}`, {
    method: 'DELETE',
    headers,
  });
  return res.json();
}

/**
 * Generate a workout program with OpenAI and save to Supabase workout_programs table
 */
export async function generateWorkoutApi(profile: any): Promise<any> {
  const headers = await getAuthHeaders();
  const res = await fetch('/api/workout/generate', {
    method: 'POST',
    headers,
    body: JSON.stringify({ profile }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Program oluşturulamadı.');
  return data;
}

/**
 * Fetch saved workout programs from Supabase workout_programs table
 */
export async function fetchWorkoutPrograms(): Promise<WorkoutProgram[]> {
  const headers = await getAuthHeaders();
  const res = await fetch('/api/workout/list', { headers });
  if (!res.ok) return [];
  return res.json();
}

/**
 * Delete a workout program from Supabase
 */
export async function deleteWorkoutProgramApi(id: string): Promise<{ success: boolean }> {
  const headers = await getAuthHeaders();
  const res = await fetch(`/api/workout/${id}`, {
    method: 'DELETE',
    headers,
  });
  return res.json();
}

/**
 * Supabase Auth: Register new user
 */
export async function registerApi(name: string, email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  if (error) {
    throw new Error(error.message || 'Kayıt başarısız oldu kanka.');
  }

  // Ensure profile row exists in public.profiles table
  if (data.user) {
    try {
      await supabase.from('profiles').upsert(
        {
          id: data.user.id,
          name,
          email,
          role: 'user',
          is_premium: false,
          is_banned: false,
        },
        { onConflict: 'id' }
      );
    } catch (e) {
      console.warn('Profile creation fallback:', e);
    }
  }

  const { user, quota } = await fetchUserAndQuota();
  return { user, quota, session: data.session };
}

/**
 * Supabase Auth: Login user
 */
export async function loginApi(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message || 'Giriş yapılamadı kanka, bilgileri kontrol et!');
  }

  const { user, quota } = await fetchUserAndQuota();
  return { user, quota, session: data.session };
}

/**
 * Supabase Auth: Logout user
 */
export async function logoutApi(): Promise<void> {
  await supabase.auth.signOut();
}

/**
 * Admin Stats from Supabase
 */
export async function fetchAdminStats(): Promise<AdminStats> {
  const headers = await getAuthHeaders();
  const res = await fetch('/api/admin/stats', { headers });
  if (!res.ok) throw new Error('Admin istatistikleri alınamadı.');
  return res.json();
}

export async function resetQuotaApi(targetUserId: string) {
  const headers = await getAuthHeaders();
  const res = await fetch('/api/admin/reset-quota', {
    method: 'POST',
    headers,
    body: JSON.stringify({ targetUserId }),
  });
  return res.json();
}

export async function fetchAIStatus(): Promise<{
  connected: boolean;
  model: string;
  provider: string;
  status: string;
}> {
  try {
    const res = await fetch('/api/ai/status');
    if (!res.ok) return { connected: false, model: '', provider: '', status: 'error' };
    return res.json();
  } catch {
    return { connected: false, model: '', provider: '', status: 'offline' };
  }
}
