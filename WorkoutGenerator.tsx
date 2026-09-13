import React, { useState } from 'react';
import {
  Dumbbell,
  Crown,
  Sparkles,
  Printer,
  Share2,
  Bookmark,
  RotateCcw,
  CheckCircle2,
  Flame,
  Clock,
  ArrowRight,
  ShieldCheck,
  Check,
  Copy,
  Eye,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WorkoutProgram, WorkoutProfile } from '../types';
import { BILO_IMAGES } from '../assets/biloImages';
import { findExercise, ExerciseItem } from '../data/exercises';
import { ExerciseModal } from './ExerciseModal';
import { generateWorkoutApi } from '../api';

interface WorkoutGeneratorProps {
  userId: string;
  onClose?: () => void;
  onProgramGenerated?: (program: WorkoutProgram) => void;
  savedPrograms: WorkoutProgram[];
  onSelectSavedProgram?: (program: WorkoutProgram) => void;
  onAskBiloAboutExercise?: (question: string) => void;
}

export const WorkoutGenerator: React.FC<WorkoutGeneratorProps> = ({
  userId,
  onClose,
  onProgramGenerated,
  savedPrograms,
  onSelectSavedProgram,
  onAskBiloAboutExercise,
}) => {
  const [step, setStep] = useState<'form' | 'loading' | 'result' | 'saved_list'>('form');
  const [selectedExerciseModal, setSelectedExerciseModal] = useState<ExerciseItem | null>(null);
  const [profile, setProfile] = useState<WorkoutProfile>({
    age: 22,
    gender: 'Erkek',
    height: 178,
    weight: 74,
    goal: 'Kas kazanmak',
    fitnessLevel: 'Orta',
    daysPerWeek: 4,
    location: 'gym',
    equipment: 'Serbest ağırlıklar ve makineler',
    notes: '',
  });

  const [generatedProgram, setGeneratedProgram] = useState<WorkoutProgram | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const goals = [
    { label: 'Kas Kazanmak', value: 'Kas kazanmak', desc: 'Hipertrofi ve hacim artışı', icon: '💪' },
    { label: 'Kilo Vermek', value: 'Kilo vermek', desc: 'Kalori açığı ve sıkılaşma', icon: '🔥' },
    { label: 'Yağ Yakmak', value: 'Yağ yakmak', desc: 'Kas koruyarak definasyon', icon: '⚡' },
    { label: 'Kondisyon Artırmak', value: 'Kondisyon artırmak', desc: 'Dayanıklılık ve kardiyo', icon: '🏃' },
    { label: 'Genel Fitness', value: 'Genel fitness', desc: 'Daha zinde ve enerjik yaşam', icon: '🥗' },
  ];

  const levels = ['Başlangıç', 'Orta', 'İleri'];
  const dayOptions = [2, 3, 4, 5, 6];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('loading');
    setErrorMsg('');

    try {
      const data = await generateWorkoutApi(profile);

      const fullProgram: WorkoutProgram = {
        id: data.id,
        userId: userId || data.id,
        title: data.program.title,
        description: data.program.description,
        weeklySchedule: data.program.weeklySchedule,
        nutritionTips: data.program.nutritionTips,
        biloCoachNote: data.program.biloCoachNote,
        profile,
        createdAt: data.createdAt,
      };

      setGeneratedProgram(fullProgram);
      setIsSaved(true);
      setStep('result');

      // Celebration confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FACC15', '#38BDF8', '#FFFFFF'],
        });
      } catch {}

      if (onProgramGenerated) {
        onProgramGenerated(fullProgram);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Bir hata oluştu.');
      setStep('form');
    }
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const handleShare = () => {
    if (!generatedProgram) return;
    const shareText = `🔥 BİLO ile Kişisel Spor Programım: ${generatedProgram.title}\n\n${generatedProgram.weeklySchedule
      .map(
        (day) =>
          `📌 ${day.day}: ${day.focus}\n${day.exercises
            .map((ex) => `  - ${ex.name} (${ex.sets} × ${ex.reps})`)
            .join('\n')}`
      )
      .join('\n\n')}\n\n👑 Sen de Bilo ile programını oluştur!`;

    if (navigator.share) {
      navigator.share({
        title: generatedProgram.title,
        text: shareText,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-4 no-print">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-white flex items-center gap-1.5">
              Bana Program Oluştur
              <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
            </h2>
            <p className="text-xs text-slate-400">
              BİLO senin vücut ölçülerine ve hedefine özel haftalık antrenman hazırlar
            </p>
          </div>
        </div>

        {/* View Saved Programs Button */}
        {savedPrograms.length > 0 && (
          <button
            onClick={() =>
              setStep(step === 'saved_list' ? 'form' : 'saved_list')
            }
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            {step === 'saved_list'
              ? '← Forma Dön'
              : `Kayıtlı Programlarım (${savedPrograms.length})`}
          </button>
        )}
      </div>

      {/* STEP 1: FORM */}
      {step === 'form' && (
        <form
          onSubmit={handleGenerate}
          className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-sm space-y-6"
        >
          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl">
              {errorMsg}
            </div>
          )}

          {/* Goals Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              1. Ana Hedefin Nedir?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {goals.map((g) => {
                const isSelected = profile.goal === g.value;
                return (
                  <div
                    key={g.value}
                    onClick={() => setProfile({ ...profile, goal: g.value })}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-amber-400/10 border-amber-400 ring-2 ring-amber-400/20 text-white'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <span className="text-2xl">{g.icon}</span>
                    <div>
                      <div className="font-heading font-bold text-sm text-white">
                        {g.label}
                      </div>
                      <div className="text-[11px] text-slate-400">{g.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Physical Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Yaş
              </label>
              <input
                type="number"
                min="13"
                max="80"
                value={profile.age}
                onChange={(e) =>
                  setProfile({ ...profile, age: Number(e.target.value) })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Cinsiyet (Opsiyonel)
              </label>
              <select
                value={profile.gender}
                onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Erkek">Erkek</option>
                <option value="Kadın">Kadın</option>
                <option value="Belirtmek istemiyorum">Fark etmez</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Boy (cm)
              </label>
              <input
                type="number"
                min="120"
                max="230"
                value={profile.height}
                onChange={(e) =>
                  setProfile({ ...profile, height: Number(e.target.value) })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Kilo (kg)
              </label>
              <input
                type="number"
                min="35"
                max="200"
                value={profile.weight}
                onChange={(e) =>
                  setProfile({ ...profile, weight: Number(e.target.value) })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>
          </div>

          {/* Fitness Level & Frequency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                2. Fitness Seviyen
              </label>
              <div className="grid grid-cols-3 gap-2">
                {levels.map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setProfile({ ...profile, fitnessLevel: lvl })}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      profile.fitnessLevel === lvl
                        ? 'bg-amber-400 text-slate-950 border-amber-400 font-extrabold shadow-md shadow-amber-400/20'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                3. Haftada Kaç Gün Antrenman?
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {dayOptions.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setProfile({ ...profile, daysPerWeek: d })}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      Number(profile.daysPerWeek) === d
                        ? 'bg-amber-400 text-slate-950 border-amber-400 font-extrabold shadow-md shadow-amber-400/20'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {d} Gün
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Location & Equipment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                4. Nerede Çalışacaksın?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setProfile({
                      ...profile,
                      location: 'gym',
                      equipment: 'Tam Donanımlı Spor Salonu (Makineler, Barlar, Dumbbell)',
                    })
                  }
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                    profile.location === 'gym'
                      ? 'bg-amber-400 text-slate-950 border-amber-400 font-extrabold shadow-md shadow-amber-400/20'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <Dumbbell className="w-4 h-4" />
                  <span>Spor Salonunda</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setProfile({
                      ...profile,
                      location: 'home',
                      equipment: 'Sadece Vücut Ağırlığı (Calisthenics)',
                    })
                  }
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                    profile.location === 'home'
                      ? 'bg-amber-400 text-slate-950 border-amber-400 font-extrabold shadow-md shadow-amber-400/20'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>🏠 Evde (Sıfır Salon)</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                5. Mevcut Ekipman
              </label>
              <select
                value={profile.equipment}
                onChange={(e) => setProfile({ ...profile, equipment: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                {profile.location === 'home' ? (
                  <>
                    <option value="Sadece Vücut Ağırlığı (Calisthenics)">
                      Sadece Vücut Ağırlığı (Sıfır Ekipman - Koltuk/Sandalye)
                    </option>
                    <option value="Dumbbell / Su Şişesi & Mat">
                      Dumbbell / Su Şişesi & Mat
                    </option>
                    <option value="Direnç Bandı & Sandalye">
                      Direnç Bandı & Sandalye
                    </option>
                    <option value="Barfiks Demiri & Dumbbell">
                      Barfiks Demiri & Dumbbell
                    </option>
                  </>
                ) : (
                  <>
                    <option value="Tam Donanımlı Spor Salonu (Makineler, Barlar, Dumbbell)">
                      Tam Donanımlı Spor Salonu (Makineler & Barlar)
                    </option>
                    <option value="Serbest Ağırlık Odaklı (Barbell & Dumbbell)">
                      Serbest Ağırlık Odaklı (Barbell & Dumbbell)
                    </option>
                    <option value="Temel Fitness Salonu">
                      Temel Fitness Salonu
                    </option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              id="generate-workout-btn"
              type="submit"
              className="w-full py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-heading font-extrabold text-base flex items-center justify-center gap-2 shadow-xl shadow-amber-400/20 transition-all hover:scale-[1.01]"
            >
              <Sparkles className="w-5 h-5 text-slate-950" />
              <span>Bilo ile Programımı Oluştur</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-center text-[11px] text-slate-400 mt-2">
              ⚡ BİLO yapay zekası hedefine göre set, tekrar ve dinlenme sürelerini optimize eder.
            </p>
          </div>
        </form>
      )}

      {/* STEP 2: LOADING STATE */}
      {step === 'loading' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-28 h-28 rounded-3xl overflow-hidden border-2 border-amber-400/60 shadow-2xl p-1 animate-pulse">
            <img
              src={BILO_IMAGES.sportCoach}
              alt="Bilo Program Hazırlıyor"
              className="w-full h-full object-cover rounded-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h3 className="font-heading text-xl font-extrabold text-white flex items-center justify-center gap-2">
              Bilo Senin İçin Özel Program Hazırlıyor!
              <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              “Kanka hedefine baktım, vücut ölçülerini analiz ediyorum. Bahaneleri çöpe atacak bomba bir plan geliyor! 💪”
            </p>
          </div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
            <div className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <span>Egzersizler, setler ve beslenme tüyoları hesaplanıyor...</span>
          </div>
        </div>
      )}

      {/* STEP 3: RESULT VIEW */}
      {step === 'result' && generatedProgram && (
        <div className="space-y-6">
          {/* Action Bar (Top of result) */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-900/90 border border-slate-800 rounded-2xl no-print">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setStep('form')}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Yeniden Oluştur</span>
              </button>
              <div className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Program Kaydedildi</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrintPdf}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
                title="Yazdır veya PDF olarak kaydet"
              >
                <Printer className="w-3.5 h-3.5 text-amber-400" />
                <span>PDF Olarak Görüntüle / Yazdır</span>
              </button>
              <button
                onClick={handleShare}
                className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Kopyalandı!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Paylaş</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Printable & Visual Program Card */}
          <div
            id="printable-workout-program"
            className="print-page bg-slate-900/95 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6"
          >
            {/* Header with Bilo */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-amber-400 shrink-0">
                  <img
                    src={BILO_IMAGES.sportCoach}
                    alt="Bilo Coach"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/30">
                      BİLO SPOR PROGRAMI
                    </span>
                    <span className="text-xs text-slate-400">
                      {generatedProgram.profile.daysPerWeek} Gün / Hafta
                    </span>
                  </div>
                  <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-white mt-1">
                    {generatedProgram.title}
                  </h3>
                </div>
              </div>

              {/* Profile Summary Badges */}
              <div className="flex flex-wrap gap-1.5 text-xs text-slate-400">
                <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700">
                  Hedef: <strong className="text-white">{generatedProgram.profile.goal}</strong>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700">
                  Kilo: <strong className="text-white">{generatedProgram.profile.weight} kg</strong>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700">
                  Seviye: <strong className="text-white">{generatedProgram.profile.fitnessLevel}</strong>
                </span>
              </div>
            </div>

            {/* Bilo Welcome Note */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-start gap-3">
              <Crown className="w-5 h-5 text-amber-400 fill-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-amber-200 leading-relaxed font-medium">
                {generatedProgram.description}
              </p>
            </div>

            {/* Weekly Days Breakdown */}
            <div className="space-y-4">
              <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-slate-400">
                Haftalık Antrenman Akışı
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {generatedProgram.weeklySchedule.map((day, idx) => (
                  <div
                    key={idx}
                    className={`rounded-2xl p-4 border transition-all ${
                      day.isRestDay
                        ? 'bg-slate-950/40 border-slate-800/60 text-slate-400'
                        : 'bg-slate-950/90 border-slate-800 text-slate-200 shadow-md ring-1 ring-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/80 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-extrabold text-sm sm:text-base text-white">
                          {day.day}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                            day.isRestDay
                              ? 'bg-slate-800 text-slate-400'
                              : 'bg-amber-400/10 text-amber-400 border border-amber-400/20'
                          }`}
                        >
                          {day.focus}
                        </span>
                      </div>
                      {day.isRestDay && (
                        <span className="text-xs text-slate-500">Toparlanma</span>
                      )}
                    </div>

                    {day.isRestDay ? (
                      <p className="text-xs text-slate-500 italic py-2">
                        Kaslar dinlenirken büyür kanka! Bugün bol su iç, esneme yap ve iyi uyu. 😴
                      </p>
                    ) : (
                      <div className="space-y-2.5">
                        {day.exercises.map((ex, exIdx) => {
                          const matchedExercise = findExercise(ex.name);

                          const handleOpenDetail = () => {
                            setSelectedExerciseModal(matchedExercise);
                          };

                          return (
                            <div
                              key={exIdx}
                              onClick={handleOpenDetail}
                              className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 text-xs flex flex-col gap-1.5 transition-all hover:border-amber-400/50 hover:bg-slate-850 cursor-pointer group"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  {/* 3D GIF Thumbnail */}
                                  <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center p-0.5 group-hover:border-amber-400/40">
                                    <img
                                      src={matchedExercise.gifUrl || `/exercises/${matchedExercise.id}.gif`}
                                      alt={matchedExercise.name}
                                      className="w-full h-full object-contain"
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                  <div className="min-w-0">
                                    <span className="font-bold text-slate-100 flex items-center gap-1.5 truncate group-hover:text-amber-400 transition-colors">
                                      {ex.name}
                                    </span>
                                    <span className="text-[10px] text-slate-400 block truncate">
                                      {matchedExercise.turkishName}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenDetail();
                                    }}
                                    className="px-2 py-0.5 rounded-md bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 text-[10px] font-bold border border-amber-400/30 flex items-center gap-1 transition-all hover:scale-105"
                                    title="3D Hareketi ve Doğru Formu Gör"
                                  >
                                    <Eye className="w-3 h-3" />
                                    <span>3D Form Gör</span>
                                  </button>
                                  <span className="font-extrabold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                                    {ex.sets} × {ex.reps}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-[11px] text-slate-400 pl-12">
                                <span>Dinlenme: {ex.rest}</span>
                                <span className="text-amber-300/80 text-[10px] font-medium">
                                  {matchedExercise.primaryMuscles.join(', ')}
                                </span>
                              </div>
                              {ex.tip && (
                                <p className="text-[11px] text-slate-400 italic pt-0.5 border-t border-slate-800/60 text-amber-200/80 pl-12">
                                  💡 {ex.tip}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Nutrition & Recovery Section */}
            {generatedProgram.nutritionTips?.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Flame className="w-4 h-4" />
                  BİLO’nun Altın Beslenme Tavsiyeleri
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {generatedProgram.nutritionTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Final Motivational Coach Sign-off */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 to-amber-400/5 border border-amber-400/30 text-center">
              <p className="text-xs font-bold text-amber-300">
                “{generatedProgram.biloCoachNote}”
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                — Motivasyon Koçu BİLO 💪
              </p>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: SAVED PROGRAMS LIST */}
      {step === 'saved_list' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
            Kayıtlı Antrenman Programların
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {savedPrograms.map((prog) => (
              <div
                key={prog.id}
                onClick={() => {
                  setGeneratedProgram(prog);
                  setStep('result');
                }}
                className="bg-slate-900 border border-slate-800 hover:border-amber-400/50 p-4 rounded-2xl cursor-pointer transition-all hover:bg-slate-850 group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-400/10 text-amber-400">
                    {prog.profile?.daysPerWeek || 4} GÜN
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(prog.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                <h4 className="font-heading font-bold text-base text-white group-hover:text-amber-400 transition-colors">
                  {prog.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {prog.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exercise Visualizer & Guide Modal */}
      {selectedExerciseModal && (
        <ExerciseModal
          exercise={selectedExerciseModal}
          onClose={() => setSelectedExerciseModal(null)}
          onAskBiloAboutExercise={onAskBiloAboutExercise}
        />
      )}
    </div>
  );
};
