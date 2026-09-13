-- ==============================================================================
-- BİLO AI - SUPABASE DATABASE SCHEMA & RLS POLICIES
-- Proje URL: https://nztlkvparlnamcsjmcqx.supabase.co
-- ==============================================================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text,
  email text,
  role text DEFAULT 'user',
  is_premium boolean DEFAULT false,
  is_banned boolean DEFAULT false,
  custom_quota integer,
  created_at timestamptz DEFAULT now()
);

-- 2. Daily Usage Table
CREATE TABLE IF NOT EXISTS public.daily_usage (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  usage_date date NOT NULL,
  question_count integer DEFAULT 0,
  PRIMARY KEY (user_id, usage_date)
);

-- 3. Questions Table
CREATE TABLE IF NOT EXISTS public.questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mode text NOT NULL CHECK (mode IN ('sport', 'knowledge')),
  question text NOT NULL,
  answer text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 4. Workout Programs Table
CREATE TABLE IF NOT EXISTS public.workout_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  profile_data jsonb NOT NULL,
  program_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_programs ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Daily Usage Policies
DROP POLICY IF EXISTS "Users can view own daily usage" ON public.daily_usage;
CREATE POLICY "Users can view own daily usage"
  ON public.daily_usage FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own daily usage" ON public.daily_usage;
CREATE POLICY "Users can update own daily usage"
  ON public.daily_usage FOR ALL
  USING (auth.uid() = user_id);

-- Questions Policies
DROP POLICY IF EXISTS "Users can view own questions" ON public.questions;
CREATE POLICY "Users can view own questions"
  ON public.questions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own questions" ON public.questions;
CREATE POLICY "Users can insert own questions"
  ON public.questions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own questions" ON public.questions;
CREATE POLICY "Users can delete own questions"
  ON public.questions FOR DELETE
  USING (auth.uid() = user_id);

-- Workout Programs Policies
DROP POLICY IF EXISTS "Users can view own workout programs" ON public.workout_programs;
CREATE POLICY "Users can view own workout programs"
  ON public.workout_programs FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own workout programs" ON public.workout_programs;
CREATE POLICY "Users can insert own workout programs"
  ON public.workout_programs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own workout programs" ON public.workout_programs;
CREATE POLICY "Users can delete own workout programs"
  ON public.workout_programs FOR DELETE
  USING (auth.uid() = user_id);

-- ==============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, is_premium, is_banned, created_at)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    'user',
    false,
    false,
    now()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- RPC FUNCTION: claim_daily_question()
-- Enforces atomic daily quota in Europe/Istanbul timezone
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.claim_daily_question()
RETURNS jsonb AS $$
DECLARE
  v_uid uuid;
  v_today date;
  v_is_banned boolean;
  v_custom_quota integer;
  v_total_quota integer;
  v_current_count integer;
  v_new_count integer;
BEGIN
  v_uid := auth.uid();
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object(
      'claimed', false,
      'error', 'UNAUTHORIZED',
      'message', 'Giriş yapmanız gerekiyor kanka!'
    );
  END IF;

  -- Get user profile and quota constraints
  SELECT is_banned, custom_quota
  INTO v_is_banned, v_custom_quota
  FROM public.profiles
  WHERE id = v_uid;

  IF v_is_banned = true THEN
    RETURN jsonb_build_object(
      'claimed', false,
      'error', 'USER_BANNED',
      'message', 'Hesabınız askıya alınmıştır.'
    );
  END IF;

  v_total_quota := COALESCE(v_custom_quota, 5);
  v_today := (timezone('Europe/Istanbul', now()))::date;

  -- Lock and read current daily usage
  SELECT question_count
  INTO v_current_count
  FROM public.daily_usage
  WHERE user_id = v_uid AND usage_date = v_today
  FOR UPDATE;

  IF v_current_count IS NULL THEN
    v_current_count := 0;
  END IF;

  -- Check limit
  IF v_current_count >= v_total_quota THEN
    RETURN jsonb_build_object(
      'claimed', false,
      'error', 'QUOTA_EXCEEDED',
      'message', 'Bugün soru hakkın doldu kanka! 😄 Yarın tekrar bekliyorum.',
      'used', v_current_count,
      'total', v_total_quota,
      'remaining', 0,
      'quota_date', v_today
    );
  END IF;

  -- Atomically increment usage
  v_new_count := v_current_count + 1;
  INSERT INTO public.daily_usage (user_id, usage_date, question_count)
  VALUES (v_uid, v_today, v_new_count)
  ON CONFLICT (user_id, usage_date)
  DO UPDATE SET question_count = v_new_count;

  RETURN jsonb_build_object(
    'claimed', true,
    'used', v_new_count,
    'total', v_total_quota,
    'remaining', (v_total_quota - v_new_count),
    'quota_date', v_today
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- RPC FUNCTION: refund_daily_question()
-- Refunds a question if Gemini API fails
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.refund_daily_question()
RETURNS jsonb AS $$
DECLARE
  v_uid uuid;
  v_today date;
  v_current_count integer;
  v_total_quota integer;
  v_new_count integer;
BEGIN
  v_uid := auth.uid();
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('refunded', false, 'error', 'UNAUTHORIZED');
  END IF;

  v_today := (timezone('Europe/Istanbul', now()))::date;

  SELECT COALESCE(custom_quota, 5) INTO v_total_quota
  FROM public.profiles WHERE id = v_uid;
  v_total_quota := COALESCE(v_total_quota, 5);

  SELECT question_count INTO v_current_count
  FROM public.daily_usage
  WHERE user_id = v_uid AND usage_date = v_today
  FOR UPDATE;

  IF v_current_count IS NOT NULL AND v_current_count > 0 THEN
    v_new_count := v_current_count - 1;
    UPDATE public.daily_usage
    SET question_count = v_new_count
    WHERE user_id = v_uid AND usage_date = v_today;
  ELSE
    v_new_count := 0;
  END IF;

  RETURN jsonb_build_object(
    'refunded', true,
    'used', v_new_count,
    'total', v_total_quota,
    'remaining', (v_total_quota - v_new_count),
    'quota_date', v_today
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
