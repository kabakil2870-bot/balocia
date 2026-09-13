# BİLO – Kişisel AI Arkadaşın

BİLO; spor, fitness, genel bilgi ve kişisel antrenman programları için tasarlanmış, Supabase Auth/PostgreSQL ve OpenAI API kullanan Türkçe AI karakter uygulamasıdır.

## Kurulum

1. `.env.example` dosyasını `.env` olarak kopyalayın.
2. Supabase URL + publishable key değerlerini ekleyin.
3. Sunucu tarafına `OPENAI_API_KEY` ekleyin.
4. `npm install` ardından `npm run dev` çalıştırın.

AI anahtarını frontend'e (`VITE_*`) koymayın. `OPENAI_API_KEY` yalnızca Node sunucusunda bulunmalıdır.

## AI sağlayıcısı

BİLO'nun AI beyni Gemini yerine OpenAI Responses API kullanır. Varsayılan model `gpt-5.6-luna`, gerektiğinde `gpt-5.6-terra` fallback olarak denenir. OpenAI'nin güncel JavaScript SDK'sı `openai` paketidir.

## Supabase

- Auth: e-posta/şifre
- RLS: kullanıcı verileri kendi hesabıyla sınırlı
- Günlük 5 soru kotası: server-side RPC
- Soru geçmişi ve antrenman programları: PostgreSQL
