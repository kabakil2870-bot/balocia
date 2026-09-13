import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Dumbbell,
  Brain,
  Crown,
  Sparkles,
  Zap,
  Clock,
  Copy,
  Check,
  Share2,
  Volume2,
  Activity,
  Eye,
  ArrowRight,
} from 'lucide-react';
import { BiloMode, ChatMessage, DailyQuota } from '../types';
import { BILO_IMAGES, getBiloImageForMode } from '../assets/biloImages';
import { detectExercisesInText, ExerciseItem } from '../data/exercises';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  quota: DailyQuota | null;
  activeMode: BiloMode | 'auto';
  onSelectMode: (mode: BiloMode | 'auto') => void;
  onOpenWorkout: () => void;
  onOpenExercise?: (exercise: ExerciseItem) => void;
  onOpenExercisesGuide?: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  isLoading,
  onSendMessage,
  quota,
  activeMode,
  onSelectMode,
  onOpenWorkout,
  onOpenExercise,
  onOpenExercisesGuide,
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const remaining = quota ? quota.remaining : 5;
  const isLimitReached = remaining <= 0;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading || isLimitReached) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Text-to-speech option (browser synthesis with Turkish voice if available)
  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'tr-TR';
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col h-[calc(100vh-130px)] sm:h-[calc(100vh-140px)] px-3 sm:px-4">
      {/* Top Chat Bar: Mode Indicator & Quota warning */}
      <div className="py-2 px-3 bg-slate-900/90 border border-slate-800/80 rounded-2xl mb-2 flex items-center justify-between text-xs backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-400/60 shadow-sm shrink-0">
            <img
              src={BILO_IMAGES.avatar}
              alt="Bilo"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="font-heading font-bold text-white flex items-center gap-1.5 flex-wrap">
              <span>BİLO AI Sohbet</span>
              <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                OpenAI API Bağlı
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {activeMode === 'auto'
                ? '⚡ Akıllı Konu Algılama'
                : activeMode === 'sport'
                ? '🏋️ Spor Modu (Motive Koç)'
                : '🧠 Bilgi Modu (Bilge Rehber)'}
            </p>
          </div>
        </div>

        {/* Right side controls: Exercise Guide & Quota Counter */}
        <div className="flex items-center gap-2">
          {onOpenExercisesGuide && (
            <button
              onClick={onOpenExercisesGuide}
              className="px-2.5 py-1 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 border border-amber-400/30 text-[11px] font-bold flex items-center gap-1.5 transition-colors"
            >
              <Activity className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Hareket Rehberi</span>
              <span className="sm:hidden">Hareketler</span>
            </button>
          )}

          <div
            className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold flex items-center gap-1.5 border ${
              isLimitReached
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                : 'bg-slate-800 text-slate-200 border-slate-700'
            }`}
          >
            <span>Kalan:</span>
            <span
              className={
                remaining > 0 ? 'text-amber-400 font-bold' : 'text-rose-400 font-bold'
              }
            >
              {remaining} / {quota?.total || 5}
            </span>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 py-1">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-slate-900/40 rounded-3xl border border-slate-800/60">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-amber-400/40 shadow-xl mb-3">
              <img
                src={BILO_IMAGES.sportCoach}
                alt="Bilo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <h3 className="font-heading text-lg font-bold text-white">
              Bilo ile Sohbete Başla!
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mt-1">
              İster spor hareketlerinin doğru formunu sor, ister antrenman ve kas geliştirme tüyoları al!
            </p>

            {/* Quick Starters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 max-w-md w-full">
              <button
                onClick={() => onSendMessage('Bench press doğru formu nasıl yapılır ve hangi kasları çalıştırır?')}
                className="text-left text-xs p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-amber-300 transition-colors flex items-center gap-2"
              >
                <Dumbbell className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">Bench press formu & hareketi</span>
              </button>
              <button
                onClick={() => onSendMessage('Squat yaparken diz ağrısı nasıl önlenir kanka?')}
                className="text-left text-xs p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-amber-300 transition-colors flex items-center gap-2"
              >
                <Activity className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">Squat hareketi ve püf noktaları</span>
              </button>
              <button
                onClick={() => onSendMessage('Evde aletsiz sırt ve kanat kası nasıl çalışılır?')}
                className="text-left text-xs p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-amber-300 transition-colors flex items-center gap-2"
              >
                <Dumbbell className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">Evde sırt & kanat egzersizleri</span>
              </button>
              <button
                onClick={() => onSendMessage('Bilo, OpenAI yapay zekasına bağlı mısın?')}
                className="text-left text-xs p-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 text-emerald-300 hover:text-emerald-200 transition-colors flex items-center gap-2 sm:col-span-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 animate-pulse" />
                <span className="truncate font-semibold">Bilo, OpenAI yapay zekasına bağlı mısın? 🤖</span>
              </button>
            </div>
          </div>
        )}

        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const isSport = msg.mode === 'sport';
          const biloAvatar = getBiloImageForMode(msg.mode, msg.expression);

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${
                isUser ? 'items-end' : 'items-start'
              }`}
            >
              {/* Header Mode Badge for Bilo's response */}
              {!isUser && (
                <div className="flex items-center gap-2 mb-1.5 ml-1">
                  <div
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                      isSport
                        ? 'bg-amber-400/10 text-amber-400 border-amber-400/30'
                        : 'bg-sky-400/10 text-sky-400 border-sky-400/30'
                    }`}
                  >
                    {isSport ? (
                      <>
                        <Dumbbell className="w-3 h-3" />
                        <span>SPOR MODU</span>
                      </>
                    ) : (
                      <>
                        <Brain className="w-3 h-3" />
                        <span>BİLGİ MODU</span>
                      </>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              )}

              <div
                className={`flex gap-2.5 max-w-[92%] sm:max-w-[82%] ${
                  isUser ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Avatar */}
                {!isUser ? (
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 shrink-0 shadow-md">
                    <img
                      src={biloAvatar}
                      alt="Bilo"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">
                    Sen
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`rounded-2xl p-3.5 sm:p-4 text-sm leading-relaxed shadow-lg ${
                    isUser
                      ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 font-medium rounded-tr-sm'
                      : isSport
                      ? 'bg-slate-900/95 text-slate-100 border border-slate-800 rounded-tl-sm ring-1 ring-amber-400/10'
                      : 'bg-slate-900/95 text-slate-100 border border-slate-800 rounded-tl-sm ring-1 ring-sky-400/10'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  {/* Detected Exercises in Bilo's advice */}
                  {!isUser && (() => {
                    const matched = detectExercisesInText(msg.content);
                    if (matched.length === 0) return null;
                    return (
                      <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                        <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-amber-400 mb-1.5">
                          <Eye className="w-3.5 h-3.5" />
                          <span>Hareketi & Doğru Formu Gör:</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {matched.map((ex) => (
                            <button
                              key={ex.id}
                              type="button"
                              onClick={() => onOpenExercise?.(ex)}
                              className="px-2.5 py-1 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all hover:scale-105 shadow-sm"
                            >
                              <span>{ex.name}</span>
                              <ArrowRight className="w-3 h-3 text-amber-400" />
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Actions for Bilo's answers */}
                  {!isUser && (
                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Crown className="w-3 h-3 text-amber-400" />
                        BİLO AI
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSpeak(msg.content)}
                          className="hover:text-amber-400 transition-colors p-1 rounded hover:bg-slate-800"
                          title="Sesli Dinle"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleCopy(msg.content, msg.id)}
                          className="hover:text-amber-400 transition-colors p-1 rounded hover:bg-slate-800"
                          title="Kopyala"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Animated Thinking State */}
        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="w-9 h-9 rounded-2xl overflow-hidden border border-amber-400/50 bg-slate-900 shrink-0 animate-pulse">
              <img
                src={BILO_IMAGES.thinking}
                alt="Bilo Düşünüyor"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl rounded-tl-sm p-3.5 text-xs text-slate-300 flex items-center gap-3 shadow-lg">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
              </div>
              <span className="font-semibold text-amber-300">
                Bilo düşünüyor... 🧠✨
              </span>
            </div>
          </div>
        )}

        {/* Daily Quota Exceeded Card (if 0 remaining) */}
        {isLimitReached && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-950/40 via-slate-900/90 to-slate-900 border border-rose-500/30 flex items-center gap-4 shadow-xl">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-rose-400/40 shrink-0">
              <img
                src={BILO_IMAGES.limitReached}
                alt="Limit Doldu"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs">
                <Zap className="w-4 h-4" />
                <span>GÜNLÜK KOTA TAMAMLANDI</span>
              </div>
              <p className="text-sm font-semibold text-white mt-0.5">
                “Bugün soru hakkın doldu kanka! 😄 Yarın tekrar bekliyorum.”
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Soru hakların her gece 00:00'da otomatik olarak 5'e sıfırlanır. Bu sırada kişisel antrenman programı oluşturabilirsin!
              </p>
              <button
                onClick={onOpenWorkout}
                className="mt-2 text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 inline-flex items-center gap-1"
              >
                <Dumbbell className="w-3 h-3" />
                Kişisel Antrenman Programı Hazırla
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Hand-friendly Mobile Chat Input */}
      <div className="pt-2 pb-1">
        <form onSubmit={handleSend} className="relative">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-2xl p-1.5 shadow-2xl focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20 transition-all">
            <input
              id="chat-input-field"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isLimitReached
                  ? 'Bugünlük soru hakkın doldu kanka! Yarın bekliyorum.'
                  : 'Bilo’ya bir şey sor (Fitness veya Bilgi)...'
              }
              disabled={isLimitReached || isLoading}
              className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none disabled:opacity-50"
            />
            <button
              id="chat-send-btn"
              type="submit"
              disabled={isLimitReached || isLoading || !inputText.trim()}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm flex items-center gap-1.5 transition-all shadow-md shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>Gönder</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
