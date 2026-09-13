import React, { useState } from 'react';
import {
  History,
  Dumbbell,
  Brain,
  Search,
  Trash2,
  Copy,
  Check,
  Crown,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import { BiloMode, ChatMessage } from '../types';
import { BILO_IMAGES } from '../assets/biloImages';

interface QuestionHistoryProps {
  questions: Array<{
    id: string;
    mode: 'sport' | 'knowledge';
    question: string;
    answer: string;
    createdAt?: string;
    created_at?: string;
  }>;
  onDeleteQuestion: (id: string) => void;
  onReaskQuestion: (question: string, mode: BiloMode) => void;
}

export const QuestionHistory: React.FC<QuestionHistoryProps> = ({
  questions,
  onDeleteQuestion,
  onReaskQuestion,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'sport' | 'knowledge'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = questions.filter((q) => {
    const matchesMode = filterMode === 'all' || q.mode === filterMode;
    const matchesSearch =
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMode && matchesSearch;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-4 space-y-4">
      {/* Top Header & Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-3xl">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-sky-400/10 border border-sky-400/30 flex items-center justify-center text-sky-400">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading text-lg sm:text-xl font-bold text-white flex items-center gap-1.5">
              Soru Geçmişim
              <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            </h2>
            <p className="text-xs text-slate-400">
              BİLO’ya sorduğun tüm sorular ve yanıtları
            </p>
          </div>
        </div>

        {/* Mode Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1 rounded-xl font-semibold transition-all ${
              filterMode === 'all'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tümü ({questions.length})
          </button>
          <button
            onClick={() => setFilterMode('sport')}
            className={`px-3 py-1 rounded-xl font-semibold flex items-center gap-1 transition-all ${
              filterMode === 'sport'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-amber-400'
            }`}
          >
            <Dumbbell className="w-3 h-3" />
            <span>Spor</span>
          </button>
          <button
            onClick={() => setFilterMode('knowledge')}
            className={`px-3 py-1 rounded-xl font-semibold flex items-center gap-1 transition-all ${
              filterMode === 'knowledge'
                ? 'bg-sky-500 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-sky-400'
            }`}
          >
            <Brain className="w-3 h-3" />
            <span>Bilgi</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Soru veya cevap içinde ara..."
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
        />
      </div>

      {/* Questions List */}
      {filtered.length === 0 ? (
        <div className="p-8 text-center bg-slate-900/50 rounded-3xl border border-slate-800/80">
          <MessageSquare className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-300">
            Henüz soru kaydı bulunamadı.
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            BİLO’ya aklına takılan herhangi bir şeyi sorabilirsin!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const isSport = item.mode === 'sport';
            const dateStr = item.createdAt || item.created_at;

            return (
              <div
                key={item.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 transition-all hover:border-slate-700 shadow-md space-y-2.5"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
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
                    </span>
                    {dateStr && (
                      <span className="text-[10px] text-slate-500">
                        {new Date(dateStr).toLocaleString('tr-TR', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopy(item.answer, item.id)}
                      className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                      title="Cevabı Kopyala"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => onReaskQuestion(item.question, item.mode)}
                      className="px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-amber-400/20 text-slate-300 hover:text-amber-400 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                      title="Tekrar Sor"
                    >
                      <span>Tekrar</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onDeleteQuestion(item.id)}
                      className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Question */}
                <div className="font-heading font-bold text-sm text-white flex items-start gap-2">
                  <span className="text-amber-400 font-bold shrink-0">Soru:</span>
                  <span>{item.question}</span>
                </div>

                {/* Answer */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/60 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {item.answer}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
