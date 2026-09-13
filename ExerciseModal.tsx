import React, { useState } from 'react';
import {
  X,
  Crown,
  Dumbbell,
  CheckCircle2,
  AlertTriangle,
  Wind,
  Layers,
  Sparkles,
  MessageSquare,
  Flame,
  ArrowRight,
  Maximize2,
  Minimize2,
  RotateCcw,
  Video,
  Activity,
  ShieldCheck,
  Compass,
  Play,
  Pause,
  Eye,
  Check
} from 'lucide-react';
import { ExerciseItem, getExerciseBiomechanics } from '../data/exercises';
import { ExerciseMotionVisualizer } from './ExerciseMotionVisualizer';
import { BILO_IMAGES } from '../assets/biloImages';

interface ExerciseModalProps {
  exercise: ExerciseItem | null;
  onClose: () => void;
  onAskBiloAboutExercise?: (question: string) => void;
}

export const ExerciseModal: React.FC<ExerciseModalProps> = ({
  exercise,
  onClose,
  onAskBiloAboutExercise,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'visual' | 'form' | 'mistakes'>('visual');
  const [isFullscreen3D, setIsFullscreen3D] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);
  const [slowMoActive, setSlowMoActive] = useState(false);
  const [loopRefreshKey, setLoopRefreshKey] = useState(0);

  if (!exercise) return null;

  const biomechanics = getExerciseBiomechanics(exercise.id);
  const gifUrl = exercise.gifUrl || biomechanics.gifUrl;

  const handleAskQuestion = () => {
    if (onAskBiloAboutExercise) {
      onAskBiloAboutExercise(
        `${exercise.name} (${exercise.turkishName}) hareketinde doğru form ve maksimum gelişim için bana özel tüyolar verir misin kanka?`
      );
      onClose();
    }
  };

  const handleRestartLoop = () => {
    setLoopRefreshKey((prev) => prev + 1);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
        <div
          id="exercise-detail-modal"
          className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Modal Top Header */}
          <div className="px-5 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/30">
                    {exercise.categoryLabel}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700">
                    {exercise.difficulty} Seviye
                  </span>
                  <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    3D Form Rehberi
                  </span>
                </div>
                <h2 className="font-heading text-lg sm:text-xl font-extrabold text-white flex items-center gap-1.5 mt-0.5">
                  {exercise.name}
                </h2>
                <p className="text-xs text-slate-400 font-medium">{exercise.turkishName}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Quick Action: Fullscreen 3D View */}
              <button
                onClick={() => setIsFullscreen3D(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-amber-400/50 text-slate-300 hover:text-white text-xs font-bold transition-all shadow-sm"
                title="Büyük 3D Görünüm"
              >
                <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                <span>3D Büyüt</span>
              </button>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                title="Kapat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-1 px-4 sm:px-5 pt-3 bg-slate-900/95 border-b border-slate-800/80 text-xs overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveSubTab('visual')}
              className={`pb-2.5 px-3 font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeSubTab === 'visual'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>3D Döngüsel Form & Kaslar</span>
            </button>
            <button
              onClick={() => setActiveSubTab('form')}
              className={`pb-2.5 px-3 font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeSubTab === 'form'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Adım Adım Form & 3D İzleyici ({exercise.stepByStep.length})</span>
            </button>
            <button
              onClick={() => setActiveSubTab('mistakes')}
              className={`pb-2.5 px-3 font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeSubTab === 'mistakes'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Sık Yapılan Hatalar & Doğru Form</span>
            </button>
          </div>

          {/* Modal Scrollable Body */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
            {/* SUB-TAB 1: 3D DÖNGÜSEL ANİMASYON & BİYOMEKANİK KASLAR */}
            {activeSubTab === 'visual' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                {/* Main 3D Motion Demonstrator */}
                <ExerciseMotionVisualizer 
                  exercise={exercise} 
                  onExpandFullscreen={() => setIsFullscreen3D(true)}
                />

                {/* Bilo's Pro Coaching Tip */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-start gap-3 shadow-md">
                  <div className="w-11 h-11 rounded-xl overflow-hidden border border-amber-400 shrink-0 shadow-md bg-slate-950">
                    <img
                      src={BILO_IMAGES.sportCoach}
                      alt="Bilo"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-400">
                      <Crown className="w-4 h-4 fill-amber-400" />
                      <span>BİLO'NUN ALTIN TÜYOSU</span>
                    </div>
                    <p className="text-xs sm:text-sm text-amber-100/90 font-medium leading-relaxed mt-1">
                      {exercise.biloProTip}
                    </p>
                  </div>
                </div>

                {/* Equipment & Alternatives Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                    <span className="text-slate-400 font-semibold block mb-1">
                      🏋️ Gerekli Ekipman:
                    </span>
                    <span className="text-slate-200 font-bold">{exercise.equipment}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                    <span className="text-slate-400 font-semibold block mb-1">
                      🔄 Alternatif Hareketler:
                    </span>
                    <span className="text-amber-300 font-medium">
                      {exercise.alternatives.join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 2: ADIM ADIM FORM & CANLI 3D SENKRONİZE İZLEYİCİ */}
            {activeSubTab === 'form' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                {/* Synchronized 3D Mini Stage Header */}
                <div className="p-3 sm:p-4 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-col sm:flex-row items-center gap-4 shadow-lg">
                  <div className="relative w-full sm:w-48 h-44 sm:h-36 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center shrink-0 group">
                    <img
                      key={`form-gif-${loopRefreshKey}`}
                      src={gifUrl}
                      alt={`${exercise.name} 3D Form Animasyonu`}
                      className={`max-h-full max-w-full object-contain p-1 transition-all ${
                        slowMoActive ? 'filter brightness-110' : ''
                      }`}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-slate-950/80 border border-amber-400/30 text-[9px] font-bold text-amber-300 flex items-center gap-1 backdrop-blur-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      3D Form Döngüsü
                    </div>
                    <button
                      onClick={() => setIsFullscreen3D(true)}
                      className="absolute bottom-1.5 right-1.5 p-1 rounded-md bg-slate-950/80 border border-slate-700 text-slate-300 hover:text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Büyüt"
                    >
                      <Maximize2 className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-amber-400" />
                        Biyomekanik Faz Kılavuzu
                      </span>
                      <button
                        onClick={handleRestartLoop}
                        className="text-[10px] text-amber-300 hover:text-amber-200 flex items-center gap-1 font-semibold"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Döngüyü Sıfırla
                      </button>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Soldaki 3D döngüsel animasyonu takip ederek adımları sırayla uygula. Hareketin her bir aşaması tam kas uyarımı sağlamak için optimize edilmiştir.
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px]">
                      <span className="px-2 py-0.5 rounded-md bg-sky-500/15 text-sky-300 border border-sky-500/30 font-bold">
                        İniş: {biomechanics.startPhase.jointAngle}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
                        Zirve: {biomechanics.peakPhase.jointAngle}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Step by step list with interactive focus */}
                <div className="space-y-2.5">
                  {exercise.stepByStep.map((step, idx) => {
                    const isSelected = activeStepIndex === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => setActiveStepIndex(isSelected ? null : idx)}
                        className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-900/90 border-amber-400/60 shadow-md ring-1 ring-amber-400/30'
                            : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full font-extrabold flex items-center justify-center shrink-0 text-xs shadow-sm transition-colors ${
                            isSelected
                              ? 'bg-amber-400 text-slate-950'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                            {step}
                          </p>
                          {isSelected && (
                            <div className="pt-1.5 flex items-center gap-2 text-[10px] text-amber-300 font-semibold animate-in fade-in">
                              <Sparkles className="w-3 h-3" />
                              <span>3D modelde bu adımı uygularken eklem pozisyonunu koru.</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Breathing Guide */}
                <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-400/30 flex items-start gap-2.5">
                  <Wind className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-sky-400 block">
                      Nefes Kontrolü & Ritim:
                    </span>
                    <p className="text-xs text-sky-200 font-medium leading-relaxed mt-0.5">
                      {exercise.breathingTip}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 3: SIK YAPILAN HATALAR & 3D DOĞRU FORM REFERANSI */}
            {activeSubTab === 'mistakes' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                {/* 3D Visual Comparison Header */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-col sm:flex-row items-center gap-4 shadow-lg">
                  <div className="relative w-full sm:w-44 h-40 sm:h-32 rounded-xl bg-slate-900 border border-emerald-500/40 overflow-hidden flex items-center justify-center shrink-0">
                    <img
                      src={gifUrl}
                      alt={`${exercise.name} Doğru Form`}
                      className="max-h-full max-w-full object-contain p-1"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-slate-950/90 border border-emerald-500/40 text-[9px] font-extrabold text-emerald-300 flex items-center gap-1 backdrop-blur-sm">
                      <Check className="w-3 h-3 text-emerald-400" />
                      Doğru 3D Form
                    </div>
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Sakatlıklardan Korunma & Maksimum Gelişim</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Aşağıdaki kritik hataları yapmaktan kaçın. Doğru hareket yörüngesi, soldaki 3D simülasyonda gösterildiği gibi eklemlere binen yıkıcı yükü sıfırlar ve sadece hedef kası çalıştırır.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span className="font-semibold">Bu hatalar sakatlıklara yol açabilir veya kas gelişimini durdurur:</span>
                </div>

                {/* Mistakes list */}
                <div className="space-y-2">
                  {exercise.commonMistakes.map((mistake, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-rose-500/30 flex items-start gap-3 text-xs transition-colors"
                    >
                      <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 font-black flex items-center justify-center shrink-0 text-xs border border-rose-500/40 mt-0.5">
                        ✕
                      </span>
                      <div className="flex-1">
                        <p className="text-slate-200 font-medium leading-relaxed">{mistake}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold">Altın Kural: Doğru form her zaman kaldırılan kilodan önemlidir!</span>
                </div>
              </div>
            )}
          </div>

          {/* Modal Bottom Footer Bar */}
          <div className="px-5 py-3.5 bg-slate-950/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 shrink-0">
            <button
              onClick={handleAskQuestion}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
              <span>Bilo’ya Bu Hareketi Sor</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFullscreen3D(true)}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">3D Tam Ekran</span>
              </button>

              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-amber-400/20"
              >
                <span>Anladım, Kapat</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* IMMERSIVE FULL-SCREEN 3D LIGHTBOX MODAL */}
      {isFullscreen3D && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-slate-900/95 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
            {/* Lightbox Header */}
            <div className="px-5 py-3.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white">
                    {exercise.name} - 3D Form İnceleme
                  </h3>
                  <p className="text-[11px] text-slate-400">{exercise.turkishName}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRestartLoop}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 border border-slate-700"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Yeniden Başlat</span>
                </button>
                <button
                  onClick={() => setIsFullscreen3D(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Lightbox Stage Body */}
            <div className="relative flex-1 min-h-[320px] sm:min-h-[460px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-4 flex items-center justify-center overflow-hidden">
              {/* Radial biomechanics grid */}
              <div 
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, rgba(250, 204, 21, 0.4) 1px, transparent 0)`,
                  backgroundSize: '24px 24px'
                }}
              />

              <img
                key={`fullscreen-gif-${loopRefreshKey}`}
                src={gifUrl}
                alt={`${exercise.name} 3D Fullscreen`}
                className="max-h-[55vh] max-w-full object-contain rounded-2xl drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-10"
                referrerPolicy="no-referrer"
              />

              {/* Floating Form Angle Annotations */}
              <div className="absolute top-4 left-4 z-20 space-y-2 pointer-events-none">
                <div className="px-3 py-1.5 rounded-xl bg-slate-950/85 border border-sky-400/40 backdrop-blur-md text-[11px] shadow-lg">
                  <span className="text-sky-400 font-extrabold block">1. Başlangıç (Eksantrik İniş)</span>
                  <span className="text-slate-300 font-mono font-bold">{biomechanics.startPhase.jointAngle}</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-slate-950/85 border border-amber-400/40 backdrop-blur-md text-[11px] shadow-lg">
                  <span className="text-amber-400 font-extrabold block">2. Zirve (Konsantrik İtiş)</span>
                  <span className="text-slate-300 font-mono font-bold">{biomechanics.peakPhase.jointAngle}</span>
                </div>
              </div>

              {/* Floating Muscle Activation Chips */}
              <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-center gap-2 pointer-events-none">
                {biomechanics.muscleFocus.map((m, idx) => (
                  <div
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-slate-950/90 border border-slate-800 text-[11px] font-bold text-slate-200 backdrop-blur-md flex items-center gap-2 shadow-lg"
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                    <span>{m.name}</span>
                    <span style={{ color: m.color }}>%{m.percentage}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lightbox Footer Bar */}
            <div className="px-5 py-3 bg-slate-950/95 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">
                ⏱️ Önerilen Ritim: <strong className="text-amber-300">{exercise.recommendedTempo || biomechanics.tempoGuidance}</strong>
              </span>
              <button
                onClick={() => setIsFullscreen3D(false)}
                className="px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold transition-colors"
              >
                Görünümden Çık
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

