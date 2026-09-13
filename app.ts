import 'dotenv/config';
import express, { Express } from 'express';
import { askBilo, generateWorkoutProgram } from './openai.ts';
import {
  authenticateRequest,
  claimDailyQuestion,
  refundDailyQuestion,
  getDailyQuotaForUser,
  getIstanbulDate,
  getUserSupabaseClient,
  supabaseAdmin,
  isServerSupabaseReady,
} from './supabase.ts';

export function createApp(): Express {
  const app = express();

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      supabaseReady: isServerSupabaseReady,
      time: new Date().toISOString(),
    });
  });

  // OpenAI status check
  app.get('/api/ai/status', (req, res) => {
    const hasKey = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim());
    res.json({
      connected: hasKey,
      model: 'gpt-5.6-luna',
      provider: 'OpenAI',
      status: hasKey ? 'active' : 'missing_key',
    });
  });

  // Backwards-compatible status route for existing frontend builds
  app.get('/api/gemini/status', (req, res) => {
    const hasKey = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim());
    res.json({ connected: hasKey, model: 'gpt-5.6-luna', provider: 'OpenAI', status: hasKey ? 'active' : 'missing_key' });
  });

  // Daily Quota Check (Authoritative from Supabase)
  app.get('/api/quota', async (req, res) => {
    const auth = await authenticateRequest(req);
    if (!auth) {
      return res.json({
        date: getIstanbulDate(),
        used: 0,
        total: 5,
        remaining: 5,
      });
    }

    const quota = await getDailyQuotaForUser(auth.userId);
    res.json(quota);
  });

  // AI Question - Server & DB Quota Enforced
  app.post('/api/ask', async (req, res) => {
    try {
      const { question, mode } = req.body;

      if (!question || typeof question !== 'string' || !question.trim()) {
        return res
          .status(400)
          .json({ error: 'Lütfen Bilo’ya bir soru yazın kanka!' });
      }

      // 1. Authenticate Request via Supabase Auth
      const auth = await authenticateRequest(req);
      if (!auth) {
        return res.status(401).json({
          error: 'UNAUTHORIZED',
          message: 'Soru sormak için lütfen önce giriş yap kanka!',
        });
      }

      // 2. Claim Daily Question via Supabase RPC claim_daily_question()
      const claimResult = await claimDailyQuestion(auth.token, auth.userId);

      if (!claimResult.claimed) {
        return res.status(429).json({
          error: claimResult.error || 'QUOTA_EXCEEDED',
          message:
            claimResult.message ||
            'Bugün soru hakkın doldu kanka! 😄 Yarın tekrar bekliyorum.',
          quota: {
            date: claimResult.quota_date,
            used: claimResult.used,
            total: claimResult.total,
            remaining: 0,
          },
          expression: 'limit_reached',
        });
      }

      // 3. Ask OpenAI with Bilo's Persona
      let biloResponse;
      try {
        biloResponse = await askBilo(
          question.trim(),
          mode === 'sport' || mode === 'knowledge' ? mode : undefined
        );
      } catch (geminiError) {
        console.error('OpenAI API call failed, refunding question count:', geminiError);
        await refundDailyQuestion(auth.token, auth.userId);
        return res.status(500).json({
          error: 'Bilo yanıt verirken bir hata oluştu kanka, soru hakkın geri verildi. Tekrar dene!',
        });
      }

      // 4. Save question into Supabase questions table
      let savedId = crypto.randomUUID();
      let createdAt = new Date().toISOString();

      try {
        const userClient = getUserSupabaseClient(auth.token);
        const { data: savedQ, error: saveErr } = await userClient
          .from('questions')
          .insert({
            user_id: auth.userId,
            mode: biloResponse.mode,
            question: question.trim(),
            answer: biloResponse.answer,
          })
          .select()
          .maybeSingle();

        if (!saveErr && savedQ) {
          savedId = savedQ.id;
          createdAt = savedQ.created_at;
        }
      } catch (dbSaveErr) {
        console.warn('Could not insert question into questions table:', dbSaveErr);
      }

      res.json({
        id: savedId,
        answer: biloResponse.answer,
        mode: biloResponse.mode,
        expression: biloResponse.expression,
        quota: {
          date: claimResult.quota_date,
          used: claimResult.used,
          total: claimResult.total,
          remaining: claimResult.remaining,
        },
        createdAt,
      });
    } catch (err: any) {
      console.error('API /api/ask unexpected error:', err);
      res.status(500).json({
        error: 'Bilo yanıt verirken bir hata oluştu kanka, lütfen tekrar dene!',
      });
    }
  });

  // Question History (Supabase questions table)
  app.get('/api/questions', async (req, res) => {
    const auth = await authenticateRequest(req);
    if (!auth) {
      return res.json([]);
    }

    try {
      const userClient = getUserSupabaseClient(auth.token);
      const { data, error } = await userClient
        .from('questions')
        .select('*')
        .eq('user_id', auth.userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Error fetching questions:', error);
        return res.json([]);
      }

      const formatted = (data || []).map((row) => ({
        id: row.id,
        userId: row.user_id,
        mode: row.mode,
        question: row.question,
        answer: row.answer,
        createdAt: row.created_at,
      }));

      res.json(formatted);
    } catch (err) {
      console.error('Failed to fetch questions:', err);
      res.json([]);
    }
  });

  // Delete Question (Supabase questions table)
  app.delete('/api/questions/:id', async (req, res) => {
    const auth = await authenticateRequest(req);
    if (!auth) {
      return res.status(401).json({ error: 'Giriş gerekli.' });
    }

    try {
      const userClient = getUserSupabaseClient(auth.token);
      const { error } = await userClient
        .from('questions')
        .delete()
        .eq('id', req.params.id)
        .eq('user_id', auth.userId);

      res.json({ success: !error });
    } catch (err) {
      res.status(500).json({ error: 'Soru silinemedi.' });
    }
  });

  // Workout Program Generator
  app.post('/api/workout/generate', async (req, res) => {
    try {
      const { profile } = req.body;
      const auth = await authenticateRequest(req);
      if (!auth) {
        return res.status(401).json({
          error: 'Antrenman planı oluşturmak için lütfen giriş yapın kanka!',
        });
      }

      if (!profile || !profile.goal || !profile.fitnessLevel) {
        return res
          .status(400)
          .json({ error: 'Lütfen profil ve hedef bilgilerinizi eksiksiz doldurun.' });
      }

      const programData = await generateWorkoutProgram(profile);

      // Save into Supabase workout_programs table
      let savedId = crypto.randomUUID();
      let createdAt = new Date().toISOString();

      try {
        const userClient = getUserSupabaseClient(auth.token);
        const { data: savedW, error: wErr } = await userClient
          .from('workout_programs')
          .insert({
            user_id: auth.userId,
            title: programData.title || 'Bilo Özel Antrenman Planı',
            profile_data: profile,
            program_data: programData,
          })
          .select()
          .maybeSingle();

        if (!wErr && savedW) {
          savedId = savedW.id;
          createdAt = savedW.created_at;
        }
      } catch (saveErr) {
        console.warn('Could not save workout program to DB:', saveErr);
      }

      res.json({
        id: savedId,
        program: programData,
        profile,
        createdAt,
      });
    } catch (err: any) {
      console.error('API /api/workout/generate error:', err);
      res.status(500).json({
        error:
          'Antrenman programı oluşturulurken bir hata oluştu kanka, lütfen tekrar dene!',
      });
    }
  });

  // Workout Program List (Supabase workout_programs table)
  app.get('/api/workout/list', async (req, res) => {
    const auth = await authenticateRequest(req);
    if (!auth) {
      return res.json([]);
    }

    try {
      const userClient = getUserSupabaseClient(auth.token);
      const { data, error } = await userClient
        .from('workout_programs')
        .select('*')
        .eq('user_id', auth.userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Error reading workout programs:', error);
        return res.json([]);
      }

      const formatted = (data || []).map((row) => ({
        id: row.id,
        userId: row.user_id,
        title: row.title,
        profile: row.profile_data,
        createdAt: row.created_at,
        ...(row.program_data || {}),
      }));

      res.json(formatted);
    } catch (err) {
      console.error('Failed to list workout programs:', err);
      res.json([]);
    }
  });

  // Delete Workout Program
  app.delete('/api/workout/:id', async (req, res) => {
    const auth = await authenticateRequest(req);
    if (!auth) {
      return res.status(401).json({ error: 'Giriş gerekli.' });
    }

    try {
      const userClient = getUserSupabaseClient(auth.token);
      const { error } = await userClient
        .from('workout_programs')
        .delete()
        .eq('id', req.params.id)
        .eq('user_id', auth.userId);

      res.json({ success: !error });
    } catch (err) {
      res.status(500).json({ error: 'Program silinemedi.' });
    }
  });

  // Admin APIs
  app.get('/api/admin/stats', async (req, res) => {
    const auth = await authenticateRequest(req);
    if (!auth) {
      return res.status(403).json({ error: 'Admin yetkisi gerekli.' });
    }

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', auth.userId)
      .maybeSingle();

    if (profile?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin yetkisi gerekli.' });
    }

    try {
      const [{ count: totalUsers }, { count: totalQuestions }, { count: totalPrograms }] =
        await Promise.all([
          supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }),
          supabaseAdmin.from('questions').select('*', { count: 'exact', head: true }),
          supabaseAdmin.from('workout_programs').select('*', { count: 'exact', head: true }),
        ]);

      res.json({
        totalUsers: totalUsers || 0,
        totalQuestions: totalQuestions || 0,
        sportQuestions: 0,
        knowledgeQuestions: 0,
        totalPrograms: totalPrograms || 0,
        activeToday: 1,
        recentQuestions: [],
      });
    } catch (err) {
      res.status(500).json({ error: 'İstatistikler alınamadı.' });
    }
  });

  return app;
}

export const app = createApp();
