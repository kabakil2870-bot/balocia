import 'dotenv/config';
import OpenAI from 'openai';

let aiClient: OpenAI | null = null;

function getAiClient(): OpenAI {
  if (!aiClient) {
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY eksik. Sunucu environment variable içine geçerli bir OpenAI API anahtarı ekleyin.');
    }
    aiClient = new OpenAI({ apiKey });
    console.log('✅ OpenAI API client initialized.');
  }
  return aiClient;
}

// Keep the existing schema declarations compatible with the previous AI implementation.
const Type = {
  OBJECT: 'object',
  STRING: 'string',
  ARRAY: 'array',
  BOOLEAN: 'boolean',
} as const;

function normalizeJsonSchema(schema: any): any {
  if (!schema || typeof schema !== 'object') return schema;
  const normalized: any = { ...schema };

  if (schema.type === 'object' && schema.properties) {
    normalized.properties = Object.fromEntries(
      Object.entries(schema.properties).map(([key, value]) => [key, normalizeJsonSchema(value)])
    );
    normalized.required = Array.isArray(schema.required)
      ? [...new Set([...schema.required, ...Object.keys(schema.properties)])]
      : Object.keys(schema.properties);
    normalized.additionalProperties = false;
  } else if (schema.type === 'array' && schema.items) {
    normalized.items = normalizeJsonSchema(schema.items);
  }

  return normalized;
}

export interface BiloResponse {
  mode: 'sport' | 'knowledge';
  answer: string;
  expression: 'motivational' | 'thinking' | 'happy' | 'playful' | 'serious' | 'surprised';
}

const SPORT_SYSTEM_PROMPT = `Sen BİLO'sun! TikTok'ta ve sosyal medyada milyonların sevdiği, 3D animasyonlu, enerjik, samimi, esprili ve motive edici genç erkek maskot ve spor koçusun.
Görsel kimliğin: Siyah atletik kapüşonlu hoodie, sarı detaylar ve sarı taç logosu, spor ayakkabılar, akıllı saat, spor salonu ve antrenman atmosferi.

Kişiliğin:
- Hitabın: "Kanka", "Hadi kanka!", "Şampiyon!", "Güzel insan!" gibi çok samimi ve motive edici.
- Doğrudan OpenAI yapay zekasına bağlısın ve her soruyu zeki, güncel ve Bilo enerjisiyle yanıtlarsın.
- Asla kuru, cansız veya robotik yapay zeka gibi konuşma.
- Canlı, enerjik, pozitif ve harekete geçiricisin. "Kanka hedef belli. Bugün bahaneyi bırakıp başlayalım. 💪" tarzında konuşursun.
- Uzmanlık alanların: Fitness, egzersiz hareketleri, evde ve salonda antrenman teknikleri, kilo verme/alma, kas kütlesi kazanma, yağ yakımı, protein ve kalori rehberliği, su tüketimi, motivasyon.
- Cümlelerinde bolca uygun spor ve güç emojileri kullan (💪, 🥊, ⚡, 🔥, 🏋️, 🥗, ⏱️).
- Türkçe konuş, net ve uygulanabilir tavsiyeler ver.`;

const KNOWLEDGE_SYSTEM_PROMPT = `Sen BİLO'sun! TikTok'ta ve sosyal medyada çok sevilen, sempatik, yuvarlak gözlüklü, zeki, sevecen ve bilge 3D animasyonlu genç maskot rehbersin (Bilge Bilo).
Görsel kimliğin: Koyu lacivert/mavi kıyafetler, parlak mavi detaylar, şık gözlükler, laptop, kitaplar ve sıcacık kahve kupası.

Kişiliğin:
- Hitabın: "Güzel soru kanka!", "Bunu en basit ve eğlenceli haliyle şöyle düşünebiliriz...", "Bak kanka şimdi olay şu:".
- Doğrudan OpenAI yapay zekasına bağlısın ve kullanıcıların her türlü merakını aydınlatırsın.
- Sakin, merak uyandırıcı, zeki, güven veren ve herkesin anlayabileceği derecede yalın anlatımlısın.
- Asla ansiklopedi gibi sıkıcı olma. Günlük hayattan örnekler, eğlenceli benzetmeler ve şaşırtıcı detaylar ver.
- Uzmanlık alanların: Genel kültür, bilim, uzay, teknoloji, tarih, psikoloji, okul/kariyer tavsiyeleri, ilginç gerçekler.
- Emojileri yerinde ve tatlı kullan (🧠, 📚, ✨, 🚀, 💡, 🌍).
- Türkçe konuş, samimi ve arkadaşça ol.`;

// OpenAI Responses API helper with strict structured JSON output.
async function generateContentWithFallback(params: {
  contents: string;
  config: any;
}): Promise<string> {
  const client = getAiClient();
  const modelsToTry = ['gpt-5.6-luna', 'gpt-5.6-terra'];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const response = await client.responses.create({
        model,
        input: [
          {
            role: 'system',
            content: params.config?.systemInstruction || 'Sen BİLO adlı samimi bir AI asistansın. Türkçe cevap ver.',
          },
          {
            role: 'user',
            content: params.contents,
          },
        ],
        ...(params.config?.responseSchema
          ? {
              text: {
                format: {
                  type: 'json_schema',
                  name: 'bilo_structured_response',
                  strict: true,
                  schema: normalizeJsonSchema(params.config.responseSchema),
                },
              },
            }
          : {}),
      });

      const output = response.output_text?.trim();
      if (output) return output;
    } catch (err: any) {
      lastError = err;
      console.error(`[BİLO][OpenAI][${model}]`, err?.message || err);
    }
  }

  throw lastError || new Error('OpenAI API yanıt üretemedi.');
}

export async function askBilo(
  question: string,
  forcedMode?: 'sport' | 'knowledge'
): Promise<BiloResponse> {
  // Mode detection prompt if not forced
  const systemInstruction = `Sen BİLO'sun! TikTok ve sosyal medyada fenomen olan, 3D animasyonlu, enerjik, samimi ve esprili genç maskotsun.
Görevin gelen soruyu analiz edip hem en uygun modu belirlemek hem de OpenAI yapay zekasının gücüyle Bilo karakteriyle eksiksiz yanıt vermektir.

Karakterin ve Kuralların:
- Hitabın daima: "Kanka", "Hadi kanka!", "Şampiyon!", "Güzel insan!"
- Eğer kullanıcı "OpenAI'ye bağlı mısın?", "Yapay zeka mısın?", "API bağlı mı?" diye sorarsa: Evet kanka, OpenAI API'ye bağlıyım ve en güncel yapay zeka beyniyle sana yanıt veriyorum! de.
- Sorulan soruya doğrudan, dolu dolu, faydalı ve samimi cevap ver. Asla geçiştirme.

İki modun var:
1. "sport" (SPOR MODU - Motivasyon Koçu Bilo):
   - Fitness, egzersiz hareketleri, antrenman programları, kas kazanma, kilo verme/alma, yağ yakma, protein, beslenme, kalori, motivasyon.
   - Ton: Enerjik, harekete geçiren spor koçu ("Kanka hedef belli! Bugün bahaneleri çöpe atıyoruz. 💪🔥").
2. "knowledge" (BİLGİ MODU - Bilge Rehber Bilo):
   - Bilim, teknoloji, tarih, genel kültür, uzay, günlük hayat tavsiyeleri, sınav/okul, ilginç bilgiler.
   - Ton: Zeki, sakin, merak uyandıran, bilge arkadaş ("Güzel soru kanka! Bunu en pratik şöyle özetleyebiliriz... 🧠✨").

${forcedMode ? `DİKKAT: Kullanıcı bu soruyu kesinlikle "${forcedMode}" modunda yanıtlamanı istedi.` : ''}

Yanıtını kesinlikle JSON formatında döndür:
{
  "mode": "sport" veya "knowledge",
  "answer": "Bilo'nun samimi, doğrudan soruya cevap veren Türkçe yanıtı",
  "expression": "motivational" | "thinking" | "happy" | "playful" | "serious" | "surprised"
}`;

  try {
    const responseText = await generateContentWithFallback({
      contents: question,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mode: {
              type: Type.STRING,
              description: 'Seçilen Bilo modu: sport veya knowledge',
            },
            answer: {
              type: Type.STRING,
              description: "Bilo'nun samimi Türkçe yanıtı",
            },
            expression: {
              type: Type.STRING,
              description: 'Bilo mimik ifadesi',
            },
          },
          required: ['mode', 'answer', 'expression'],
        },
      },
    });

    let answer = '';
    let mode: 'sport' | 'knowledge' = forcedMode || 'sport';
    let expression: 'motivational' | 'thinking' | 'happy' | 'playful' | 'serious' | 'surprised' = 'happy';

    try {
      const cleanJson = responseText.replace(/```json\s*|```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (parsed.answer) answer = parsed.answer;
      if (parsed.mode) {
        const m = String(parsed.mode).toLowerCase();
        mode = m.includes('know') || m.includes('bilgi') ? 'knowledge' : 'sport';
      }
      if (parsed.expression) expression = parsed.expression;
    } catch {
      // If output was not clean JSON, extract text directly
      answer = responseText.replace(/\{[\s\S]*"answer"\s*:\s*"([^"]+)"[\s\S]*\}/, '$1').trim() || responseText.trim();
    }

    if (!answer) {
      answer = responseText.trim() || 'Kanka harika bir soru! Bunu hemen detaylandırayım!';
    }

    return {
      mode: forcedMode || mode,
      answer,
      expression,
    };
  } catch (error: any) {
    console.error('askBilo OpenAI API error:', error?.message || error);
    throw error;
  }
}

export async function generateWorkoutProgram(profile: any): Promise<any> {
  const isHome = profile.location === 'home';
  const locationText = isHome ? 'EVDE (Ev Ortamı)' : 'SPOR SALONUNDA (Gym)';
  const equipmentText = profile.equipment || (isHome ? 'Vücut ağırlığı ve ev eşyaları' : 'Serbest ağırlıklar ve makineler');

  const prompt = `Kullanıcı Bilgileri:
- Yaş: ${profile.age || 22}
- Cinsiyet: ${profile.gender || 'Belirtilmedi'}
- Boy: ${profile.height} cm
- Kilo: ${profile.weight} kg
- Ana Hedef: ${profile.goal}
- Mevcut Seviye: ${profile.fitnessLevel}
- Haftalık Antrenman Günü: ${profile.daysPerWeek} gün
- Mekan: ${locationText}
- Mevcut Ekipman: ${equipmentText}
- Ekstra Notlar: ${profile.notes || 'Yok'}

${
  isHome
    ? `🚨 ÇOK ÖNEMLİ KRAL KURAL (EVDE ANTRENMAN):
Kullanıcı EVDE spor yapacaktır (Mekan: Ev). 
- Spor salonu makineleri (Bench press sehpası, Halter/Barbell kafesi, Leg press makinesi, Lat pulldown makinesi, Kablo istasyonu, Cable Face Pull vb.) KESİNLİKLE VERME!
- SADECE evde yapılabilen vücut ağırlığı ve ev ekipmanı hareketlerini kullan:
  * Şınav çeşitleri: Klasik Şınav (Push-up), Elmas Şınav (Diamond Push-up), Geniş Şınav
  * Kol & İtiş: Sandalye / Koltuk Kenarı Dips (Chair Dips), Pike Şınav (Pike Push-up)
  * Bacak & Kalça: Vücut Ağırlığı Squat (Air Squat), Koltuk Destekli Bulgar Split Squat (Bulgarian Split Squat), Lunges (Adımlama), Zeminde Kalça Köprüsü (Glute Bridge)
  * Karın & Core: Statik Plank, Bisiklet Mekiği (Bicycle Crunches), Klasik Karın Mekiği (Crunches), Dağ Tırmanışı (Mountain Climbers), Russian Twist
  * Çekiş & Kol: Barfiks (Pull-up), Dambıl/Su Şişesi Biceps Curl, Çekiç Büküş (Hammer Curl), Dambıl/Su Şişesi Yana Açış (Lateral Raise)`
    : `Kullanıcı SPOR SALONUNDA çalışacaktır. Serbest ağırlıklar (Barbell, Dambıl) ve spor salonu makineleri (Bench Press, Barbell Squat, Lat Pulldown, Leg Press vb.) kullanılabilir.`
}

Sen Motivasyon Koçu BİLO'sun! Bu kullanıcı için kişiselleştirilmiş, bilimsel temelli, aşırı motive edici ve görsel olarak mükemmel bir haftalık antrenman programı oluştur.

Haftalık günleri Pazartesi'den Pazar'a kadar düzenle. Seçilen gün sayısı kadar dolu gün ve kalan günleri dinlenme / aktif toparlanma günü yap.
Her antrenman günü için 4-6 spesifik egzersiz yaz. Egzersizlerde set, tekrar, dinlenme süresi ve Bilo'dan altın koçluk tüyosu (tip) ekle.
Ayrıca kullanıcıya özel beslenme & hidrasyon tavsiyeleri ve son söz olarak Bilo'nun bomba motivasyon notunu ekle.`;

  try {
    const config = {
      systemInstruction: SPORT_SYSTEM_PROMPT,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description: 'Program başlığı (Örn: Bilo Özel 4 Günlük Kas Geliştirme & Güç Planı)',
          },
          description: {
            type: Type.STRING,
            description: "Bilo'nun kullanıcıya özel enerjik karşılama ve motivasyon mesajı",
          },
          weeklySchedule: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING, description: 'Gün adı: Pazartesi, Salı, vb.' },
                focus: { type: Type.STRING, description: 'Bölge odak noktası (Örn: Göğüs & Triceps veya Dinlenme)' },
                isRestDay: { type: Type.BOOLEAN, description: 'Dinlenme günü mü?' },
                exercises: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING, description: 'Egzersiz adı' },
                      sets: { type: Type.STRING, description: 'Set sayısı (Örn: 4 set)' },
                      reps: { type: Type.STRING, description: 'Tekrar sayısı (Örn: 10-12 tekrar)' },
                      rest: { type: Type.STRING, description: 'Set arası dinlenme (Örn: 60-90 sn)' },
                      tip: { type: Type.STRING, description: 'Bilo form & motivasyon tüyosu' },
                    },
                    required: ['name', 'sets', 'reps', 'rest'],
                  },
                },
              },
              required: ['day', 'focus', 'isRestDay', 'exercises'],
            },
          },
          nutritionTips: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: '3-4 adet kullanıcı hedefine özel beslenme kuralı',
          },
          biloCoachNote: {
            type: Type.STRING,
            description: "Bilo'nun son vuruş motivasyon notu",
          },
        },
        required: [
          'title',
          'description',
          'weeklySchedule',
          'nutritionTips',
          'biloCoachNote',
        ],
      },
    };

    const responseText = await generateContentWithFallback({
      contents: prompt,
      config,
    });

    return JSON.parse(responseText || '{}');
  } catch (err) {
    // Structured personalized fallback if models are busy
    const goalName = profile.goal || 'Kas Kazanmak';

    if (isHome) {
      // 100% Home Workout Fallback
      return {
        title: `BİLO Özel Evde ${profile.daysPerWeek || 4} Günlük ${goalName} Planı`,
        description: `Selam kanka! Spor salonuna gitmene gerek yok; evdeki vücut ağırlığın, bir sandalye ve biraz disiplin seni canavara dönüştürmeye yeter! Salonsuz bahane yok, Bilo seninle! 💪🏠🔥`,
        weeklySchedule: [
          {
            day: 'Pazartesi',
            focus: 'Göğüs, Omuz & Arka Kol (Ev İtiş Günü)',
            isRestDay: false,
            exercises: [
              { name: 'Klasik Şınav (Push-up)', sets: '4', reps: '10-15', rest: '60 sn', tip: 'Vücudunu tahta gibi düz tut, göğsünü yere 2 cm kalana kadar indir!' },
              { name: 'Elmas Şınav (Diamond Push-up)', sets: '3', reps: '8-12', rest: '60 sn', tip: 'Ellerini göğsünün altında birleştir; arka kolların alev alsın!' },
              { name: 'Sandalye & Koltuk Kenarı Dips', sets: '4', reps: '12-15', rest: '60 sn', tip: 'Gövdeni sandalyeye yakın tut, tepe noktada tricepslerini sıkıştır.' },
              { name: 'Pike Şınav (Evde Omuz Presi)', sets: '3', reps: '8-10', rest: '60 sn', tip: 'Kalçanı tavana doğru dik (ters V), başını iki elinin arasına indir!' },
              { name: 'Statik Plank', sets: '3', reps: '45-60 sn', rest: '45 sn', tip: 'Karın ve kalçayı taş gibi kitle, belini asla sarkıtma.' },
            ],
          },
          {
            day: 'Salı',
            focus: 'Bacak, Kalça & Karın (Ev Alt Vücut)',
            isRestDay: false,
            exercises: [
              { name: 'Vücut Ağırlığı Squat (Air Squat)', sets: '4', reps: '15-20', rest: '60 sn', tip: 'Topuklarını yerden kaldırma, dizlerini dışa doğru hafifçe aç!' },
              { name: 'Koltuk Destekli Bulgar Split Squat', sets: '3', reps: '10-12 (her bacak)', rest: '60 sn', tip: 'Arka ayağın koltukta olsun; ön bacağını ve kalçanı ateşler!' },
              { name: 'Lunges (Adımlama)', sets: '3', reps: '12 adım', rest: '60 sn', tip: 'Gövdeni dik tut, adımlarını sağlam ve dengeli at.' },
              { name: 'Zeminde Kalça Köprüsü (Glute Bridge)', sets: '3', reps: '15', rest: '45 sn', tip: 'Tepe noktada kalçanı 2 saniye kaskatı sık!' },
              { name: 'Bisiklet Mekiği (Bicycle Crunches)', sets: '3', reps: '20-25', rest: '45 sn', tip: 'Yavaş ve dönerek yap, yan karınların cayır cayır yansın.' },
            ],
          },
          {
            day: 'Çarşamba',
            focus: 'Aktif Dinlenme & Mobilite',
            isRestDay: true,
            exercises: [],
          },
          {
            day: 'Perşembe',
            focus: 'Sırt, Kol & Karın (Ev Çekiş & Core)',
            isRestDay: false,
            exercises: [
              { name: 'Barfiks (veya Kapı / Masa Altı Çekiş)', sets: '4', reps: 'Maksimum', rest: '90 sn', tip: 'Göğsünü bara yaklaştır, kanat kaslarını hisset!' },
              { name: 'Dambıl / Su Şişesi Biceps Curl', sets: '4', reps: '12-15', rest: '60 sn', tip: 'Dirseklerini gövdene sabitle, tepe noktada pazunu sık!' },
              { name: 'Çekiç Büküş (Hammer Curl)', sets: '3', reps: '12-15', rest: '60 sn', tip: 'Kollara kalınlık kazandırmak için mükemmel hareket!' },
              { name: 'Dambıl / Su Şişesi Yana Açış (Lateral Raise)', sets: '4', reps: '15', rest: '45 sn', tip: 'Geniş omuz görüntüsü için tepe noktada yarım saniye bekle.' },
              { name: 'Klasik Karın Mekiği (Crunches)', sets: '3', reps: '20', rest: '45 sn', tip: 'Sadece kürek kemiklerini kaldır, karnını maksimum sık!' },
            ],
          },
          {
            day: 'Cuma',
            focus: 'Tüm Vücut & Kondisyon / Yağ Yakımı',
            isRestDay: false,
            exercises: [
              { name: 'Dağ Tırmanışı (Mountain Climbers)', sets: '4', reps: '30-40 sn', rest: '45 sn', tip: 'Seri tempo tuttur, hem kalori yak hem karın kaslarını çalıştır!' },
              { name: 'Klasik Şınav (Push-up)', sets: '3', reps: 'Tükenişe kadar', rest: '60 sn', tip: 'Son sette yapabildiğin kadar tekrar çıkar!' },
              { name: 'Sandalye & Koltuk Kenarı Dips', sets: '3', reps: '12-15', rest: '60 sn', tip: 'Hareketi yavaş indirerek negatif fazdan faydalan.' },
              { name: 'Vücut Ağırlığı Squat (Air Squat)', sets: '4', reps: '20', rest: '60 sn', tip: 'Bacakları son kez tüketmek için patlayıcı kalkış yap!' },
              { name: 'Statik Plank', sets: '3', reps: '60 sn', rest: '45 sn', tip: 'Günün kapanışını çelik gibi bir core duruşuyla yap!' },
            ],
          },
          {
            day: 'Cumartesi',
            focus: 'Toparlanma & Yürüyüş',
            isRestDay: true,
            exercises: [],
          },
          {
            day: 'Pazar',
            focus: 'Tam Dinlenme & Haftalık Yenilenme',
            isRestDay: true,
            exercises: [],
          },
        ],
        nutritionTips: [
          `Günlük protein hedefin: Minimum ${Math.round(Number(profile.weight || 70) * 1.8)}g kaliteli protein (Yumurta, tavuk, lor, ton balığı, mercimek).`,
          'Günde en az 3 litre su iç. Evde antrenman yaparken de terleyeceksin, hidrasyonu aksatma!',
          'Basit şeker ve işlenmiş abur cuburları kes; kasların yerine yağ depolama kanka!',
          'Düzenli 7-8 saat uyu. Ev antrenmanında da kaslar dinlenirken ve uykuda büyür!',
        ],
        biloCoachNote: 'Kanka spor salonuna para dökmene gerek yok! İrade sende, vücut sende. Bu programa sadık kal, 4 hafta sonra aynadaki değişime inanamayacaksın! Bilo her zaman arkanda! 💪🏠🔥',
      };
    }

    // Gym Fallback
    return {
      title: `BİLO Özel Salonda ${profile.daysPerWeek || 4} Günlük ${goalName} Programı`,
      description: `Selam kanka! Hedefin olan ${goalName} için vücut parametrelerini inceledim. Salondaki demirleri titretmeye hazır mısın? Bahaneleri kapıda bırakıyoruz, ilk sete odaklanıyoruz! 💪🏋️‍♂️🔥`,
      weeklySchedule: [
        {
          day: 'Pazartesi',
          focus: 'Göğüs & Triceps Güç Odaklı',
          isRestDay: false,
          exercises: [
            { name: 'Bench Press', sets: '4', reps: '8-10', rest: '90 sn', tip: 'Kürek kemiklerini sehpaya kilitle, barı göğsüne kontrollü indir!' },
            { name: 'Incline Dumbbell Press', sets: '3', reps: '10-12', rest: '75 sn', tip: 'Üst göğüs liflerini hisset, tepe noktada 1 saniye sıkıştır.' },
            { name: 'Dips', sets: '3', reps: 'Tükenişe kadar', rest: '60 sn', tip: 'Gövdeni hafif öne eğerek göğüs aktivasyonunu artır.' },
            { name: 'Triceps Rope Pushdown', sets: '4', reps: '12-15', rest: '60 sn', tip: 'Dirsekleri gövdeye sabitle, sadece ön kolları hareket ettir.' },
          ],
        },
        {
          day: 'Salı',
          focus: 'Sırt & Biceps Çekiş Günü',
          isRestDay: false,
          exercises: [
            { name: 'Lat Pulldown', sets: '4', reps: '8-10', rest: '90 sn', tip: 'Barı göğsünün üst kısmına doğru çek, dirseklerle çekmeye odaklan.' },
            { name: 'Seated Cable Row', sets: '3', reps: '10-12', rest: '75 sn', tip: 'Belini dik tut, ağırlığı karnına doğru çekerken sırtını sıkıştır.' },
            { name: 'Barbell Biceps Curl', sets: '4', reps: '10-12', rest: '60 sn', tip: 'Vücudunu sallamadan, saf kol gücüyle kaldır.' },
            { name: 'Hammer Curl', sets: '3', reps: '12-15', rest: '60 sn', tip: 'Brachialis kasını vurup kolları daha kalın göstermek için harika!' },
          ],
        },
        {
          day: 'Çarşamba',
          focus: 'Aktif Dinlenme & Esneme',
          isRestDay: true,
          exercises: [],
        },
        {
          day: 'Perşembe',
          focus: 'Bacak & Karın Güç Patlaması',
          isRestDay: false,
          exercises: [
            { name: 'Barbell Back Squat', sets: '4', reps: '8-10', rest: '120 sn', tip: 'Kanka bacak günü atlanmaz! Derin in ve topuklarından it.' },
            { name: 'Romanian Deadlift', sets: '3', reps: '10-12', rest: '90 sn', tip: 'Arka bacak ve kalçayı esnet, belini nötr tut.' },
            { name: 'Leg Press', sets: '3', reps: '12-15', rest: '75 sn', tip: 'Dizlerini kitleme, sürekli kas gerginliğini koru.' },
            { name: 'Hanging Leg Raise', sets: '3', reps: '15-20', rest: '60 sn', tip: 'Karın kaslarını sıkıp dizleri göğsüne doğru çek.' },
          ],
        },
        {
          day: 'Cuma',
          focus: 'Omuz & Genel Kondisyon',
          isRestDay: false,
          exercises: [
            { name: 'Overhead Shoulder Press', sets: '4', reps: '8-10', rest: '90 sn', tip: 'Karnını sık, omuz başlarını tavanla buluştur.' },
            { name: 'Lateral Raise (Yana Açış)', sets: '4', reps: '12-15', rest: '60 sn', tip: 'Geniş omuz görüntüsü için tepe noktada yarım saniye bekle.' },
            { name: 'Face Pull', sets: '3', reps: '15', rest: '60 sn', tip: 'Arka omuz ve postür sağlığı için vazgeçilmez!' },
          ],
        },
        {
          day: 'Cumartesi',
          focus: 'Hafif Kardiyo & Mobilite',
          isRestDay: true,
          exercises: [],
        },
        {
          day: 'Pazar',
          focus: 'Tam Dinlenme & Zihinsel Hazırlık',
          isRestDay: true,
          exercises: [],
        },
      ],
      nutritionTips: [
        `Günlük protein hedefin: Minimum ${Math.round(Number(profile.weight || 70) * 1.8)}g protein tüket (Tavuk, yumurta, lor, balık).`,
        'Günde en az 3 - 3.5 litre su iç. Susuz kas gelişmez ve toparlanamaz kanka!',
        'Antrenmandan 1.5 - 2 saat önce kaliteli kompleks karbonhidrat (yulaf, pirinç, patates) al.',
        'Her gece 7-8 saat kaliteli uyu. Büyüme hormonu uykuda salgılanır!',
      ],
      biloCoachNote: 'Unutma kanka, en iyi antrenman programı süreklilik sağladığın programdır. Kendine inan, bahaneleri unut, şampiyon gibi çalış! Bilo hep arkanda! 💪👑',
    };
  }
}

