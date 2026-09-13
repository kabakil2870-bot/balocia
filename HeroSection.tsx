import React, { useState } from 'react';
import {
  Crown,
  Send,
  Dumbbell,
  Brain,
  Sparkles,
  ChevronRight,
  Flame,
  CalendarCheck,
  History,
  User,
  Zap,
} from 'lucide-react';
import { BiloMode, DailyQuota, AppTab } from '../types';
import { BILO_IMAGES } from '../assets/biloImages';
import { Activity } from 'lucide-react';

interface HeroSectionProps {
  currentMode: BiloMode | 'auto';
  detectedMode?: BiloMode;
  quota: DailyQuota | null;
  onAskQuestion: (question: string) => void;
  onOpenWorkoutModal: () => void;
  onOpenHistory: () => void;
  onOpenProfile: () => void;
  onOpenExercises: () => void;
  onSelectTab: (tab: AppTab) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentMode,
  detectedMode,
  quota,
  onAskQuestion,
  onOpenWorkoutModal,
  onOpenHistory,
  onOpenProfile,
  onOpenExercises,
  onSelectTab,
}) => {
  const [inputQuestion, setInputQuestion] = useState('');

  const effectiveMode = currentMode === 'auto' ? detectedMode || 'sport' : currentMode;
  const isSport = effectiveMode === 'sport';

  const remaining = quota ? quota.remaining : 5;
  const total = quota ? quota.total : 5;
  const isLimitReached = remaining <= 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuestion.trim()) return;
    onAskQuestion(inputQuestion.trim());
    setInputQuestion('');
  };

  const sampleSuggestions = isSport
    ? [
        'Karın kası nasıl çıkar kanka? 💪',
        'Kilo vermek için en iyi kardiyo ne?',
        'Bench press yaparken omuz ağrısı nasıl önlenir?',
        'Günde kaç gram protein almalıyım?',
      ]
    : [
        'Dünyanın en büyük okyanusu hangisi?',
        'Yapay zeka modelleri nasıl öğrenir?',
        'Ders çalışırken odaklanma taktikleri neler?',
        'Evren nasıl genişliyor kanka?',
      ];

  // Dynamic Bilo image based on state
  const biloHeroImage = isLimitReached
    ? BILO_IMAGES.limitReached
    : isSport
    ? BILO_IMAGES.sportCoach
    : BILO_IMAGES.knowledgeGuide;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 sm:py-8 flex flex-col items-center">
      {/* Dynamic Mode Badge & AI Badge */}
      <div className="mb-3 sm:mb-4 flex flex-wrap items-center justify-center gap-2">
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
            isSport
              ? 'bg-amber-500/10 text-amber-400 border border-amber-400/30 shadow-sm shadow-amber-500/10'
              : 'bg-sky-500/10 text-sky-400 border border-sky-400/30 shadow-sm shadow-sky-500/10'
          }`}
        >
          {isSport ? (
            <>
              <Dumbbell className="w-3.5 h-3.5 animate-pulse" />
              <span>SPOR MODU • MOTİVASYON KOÇU BİLO</span>
            </>
          ) : (
            <>
              <Brain className="w-3.5 h-3.5 animate-pulse" />
              <span>BİLGİ MODU • BİLGE REHBER BİLO</span>
            </>
          )}
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>OpenAI AI Bağlı</span>
        </div>
      </div>

      {/* Main 3D Bilo Hero Character Container */}
      <div className="relative w-full max-w-sm sm:max-w-md flex flex-col items-center">
        {/* Glowing aura effect */}
        <div
          className={`absolute -inset-4 rounded-full blur-3xl opacity-30 transition-all duration-700 pointer-events-none ${
            isSport ? 'bg-amber-400' : 'bg-sky-500'
          }`}
        />

        {/* 3D Mascot Image */}
        <div className="relative z-10 w-48 h-48 sm:w-60 sm:h-60 rounded-3xl overflow-hidden p-1 transition-transform duration-300 hover:scale-[1.02] shadow-2xl">
          <div
            className={`w-full h-full rounded-[22px] overflow-hidden border-2 transition-colors duration-500 ${
              isSport
                ? 'border-amber-400/80 ring-4 ring-amber-400/20'
                : 'border-sky-400/80 ring-4 ring-sky-400/20'
            }`}
          >
            <img
              src={biloHeroImage}
              alt="BİLO 3D AI Karakter"
              className="w-full h-full object-cover object-center transform transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Floating Crown Badge */}
          <div className="absolute top-2 right-2 bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 p-1.5 rounded-full shadow-lg ring-2 ring-slate-950">
            <Crown className="w-4 h-4 fill-slate-950" />
          </div>

          {/* Speech Bubble on hover or greeting */}
          <div
            className={`absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] font-extrabold whitespace-nowrap shadow-lg border backdrop-blur-md ${
              isSport
                ? 'bg-slate-950/90 text-amber-300 border-amber-400/40'
                : 'bg-slate-950/90 text-sky-300 border-sky-400/40'
            }`}
          >
            {isLimitReached
              ? 'Yarın yine bekliyorum kanka! 😴'
              : isSport
              ? 'Daha güçlü bir sen mümkün! 💪'
              : 'Doğru bilgi, daha iyi kararlar! 🧠'}
          </div>
        </div>
      </div>

      {/* Headlines */}
      <div className="text-center mt-4 sm:mt-6 mb-4">
        <h1 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
          Selam kanka, ben Bilo!
          <span className="inline-block animate-wave origin-bottom-right">👋</span>
        </h1>
        <p className="font-heading text-lg sm:text-2xl font-semibold mt-1 transition-colors text-slate-300">
          <span
            className={
              isSport
                ? 'text-amber-400 font-bold'
                : 'text-sky-400 font-bold'
            }
          >
            Sor,
          </span>{' '}
          öğren,{' '}
          <span
            className={
              isSport
                ? 'text-amber-400 font-bold'
                : 'text-sky-400 font-bold'
            }
          >
            geliş!
          </span>
        </p>
        <p className="text-sm text-slate-400 max-w-md mx-auto mt-2">
          {isSport
            ? '“Bugün kendinin daha güçlü versiyonuna başla.”'
            : '“Her soru yeni bir şey öğrenmek için fırsattır.”'}
        </p>
      </div>

      {/* Prominent Daily Question Limit Card */}
      <div
        id="hero-quota-card"
        className="w-full max-w-lg mb-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-xl backdrop-blur-sm relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div
              className={`p-1.5 rounded-lg ${
                isSport ? 'bg-amber-400/10 text-amber-400' : 'bg-sky-400/10 text-sky-400'
              }`}
            >
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                GÜNLÜK SORU HAKKI
              </h4>
              <p className="text-[11px] text-slate-500">
                Her gün 5 soru hakkın var. Gece yarısı otomatik yenilenir.
              </p>
            </div>
          </div>

          <div className="text-right">
            <span
              className={`text-xl sm:text-2xl font-extrabold ${
                remaining > 0
                  ? isSport
                    ? 'text-amber-400'
                    : 'text-sky-400'
                  : 'text-rose-400'
              }`}
            >
              {remaining}
            </span>
            <span className="text-slate-500 font-bold text-lg"> / {total}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800/80 p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              remaining === 0
                ? 'bg-rose-500 w-full'
                : isSport
                ? 'bg-gradient-to-r from-amber-500 to-amber-300'
                : 'bg-gradient-to-r from-sky-500 to-sky-300'
            }`}
            style={{ width: `${Math.max(5, (remaining / total) * 100)}%` }}
          />
        </div>

        {isLimitReached && (
          <div className="mt-2.5 p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
            <Zap className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Bugün soru hakkın doldu kanka! 😄 Yarın tekrar bekliyorum.</span>
          </div>
        )}
      </div>

      {/* Main Interactive Input Bar */}
      <div className="w-full max-w-lg mb-6">
        <form onSubmit={handleSubmit} className="relative">
          <div
            className={`flex items-center bg-slate-900 border rounded-2xl p-1.5 shadow-2xl transition-all duration-300 ${
              isSport
                ? 'focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20 border-slate-800'
                : 'focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-400/20 border-slate-800'
            }`}
          >
            <input
              id="hero-bilo-input"
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder="Bilo’ya bir şey sor..."
              disabled={isLimitReached}
              className="w-full bg-transparent px-3 py-2 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none disabled:opacity-50"
            />
            <button
              id="hero-send-btn"
              type="submit"
              disabled={isLimitReached || !inputQuestion.trim()}
              className={`px-4 sm:px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-1.5 transition-all shadow-md shrink-0 disabled:opacity-40 disabled:cursor-not-allowed ${
                isSport
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold shadow-amber-400/20'
                  : 'bg-sky-500 hover:bg-sky-400 text-white font-extrabold shadow-sky-500/20'
              }`}
            >
              <span>Sor</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-3">
          {sampleSuggestions.map((suggestion, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLimitReached}
              onClick={() => onAskQuestion(suggestion)}
              className="text-xs bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-full border border-slate-800/80 transition-all text-left truncate max-w-full disabled:opacity-40"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Feature Action Cards Grid */}
      <div className="w-full max-w-3xl grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3 mt-2">
        {/* 1. Bilo'ya Sor */}
        <div
          id="hero-card-ask"
          onClick={() => onSelectTab('chat')}
          className="bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-400/50 p-3 sm:p-3.5 rounded-2xl cursor-pointer transition-all hover:-translate-y-0.5 group shadow-lg flex flex-col items-center text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="font-heading text-xs sm:text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
            Bilo’ya Sor
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5 hidden xs:block">
            Canlı sohbet
          </p>
        </div>

        {/* 2. Spor Hareketleri & Form (NEW!) */}
        <div
          id="hero-card-exercises"
          onClick={onOpenExercises}
          className="bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-400/50 p-3 sm:p-3.5 rounded-2xl cursor-pointer transition-all hover:-translate-y-0.5 group shadow-lg flex flex-col items-center text-center ring-1 ring-amber-400/20"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-400/15 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Activity className="w-4 h-4" />
          </div>
          <h3 className="font-heading text-xs sm:text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
            Spor Hareketleri
          </h3>
          <p className="text-[10px] text-amber-300/80 mt-0.5 font-medium hidden xs:block">
            Görsel form rehberi
          </p>
        </div>

        {/* 3. Kişisel Spor Programı */}
        <div
          id="hero-card-workout"
          onClick={onOpenWorkoutModal}
          className="bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-400/50 p-3 sm:p-3.5 rounded-2xl cursor-pointer transition-all hover:-translate-y-0.5 group shadow-lg flex flex-col items-center text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Dumbbell className="w-4 h-4" />
          </div>
          <h3 className="font-heading text-xs sm:text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
            Spor Programı
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5 hidden xs:block">
            Haftalık plan hazırla
          </p>
        </div>

        {/* 4. Soru Geçmişim */}
        <div
          id="hero-card-history"
          onClick={onOpenHistory}
          className="bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-sky-400/50 p-3 sm:p-3.5 rounded-2xl cursor-pointer transition-all hover:-translate-y-0.5 group shadow-lg flex flex-col items-center text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-400/10 text-sky-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <History className="w-4 h-4" />
          </div>
          <h3 className="font-heading text-xs sm:text-sm font-bold text-white group-hover:text-sky-400 transition-colors">
            Soru Geçmişi
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5 hidden xs:block">
            Cevapları incele
          </p>
        </div>

        {/* 5. Profilim */}
        <div
          id="hero-card-profile"
          onClick={onOpenProfile}
          className="col-span-2 sm:col-span-1 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-sky-400/50 p-3 sm:p-3.5 rounded-2xl cursor-pointer transition-all hover:-translate-y-0.5 group shadow-lg flex flex-col items-center text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-400/10 text-sky-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <User className="w-4 h-4" />
          </div>
          <h3 className="font-heading text-xs sm:text-sm font-bold text-white group-hover:text-sky-400 transition-colors">
            Profilim
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5 hidden xs:block">
            Hesap detayları
          </p>
        </div>
      </div>
    </div>
  );
};
