import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Users,
  MessageSquare,
  Dumbbell,
  Brain,
  RotateCcw,
  Ban,
  CheckCircle2,
  Sliders,
  Crown,
  Activity,
  Search,
} from 'lucide-react';
import { AdminStats } from '../types';

interface AdminDashboardProps {
  adminId: string;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  adminId,
  onClose,
}) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');
  const [targetUserId, setTargetUserId] = useState('');
  const [customQuotaVal, setCustomQuotaVal] = useState('50');

  const loadStats = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/stats?userId=${adminId}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [adminId]);

  const handleResetQuota = async (userIdToReset: string) => {
    try {
      const res = await fetch('/api/admin/reset-quota', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId, targetUserId: userIdToReset }),
      });
      if (res.ok) {
        setActionMsg(`Kullanıcının (${userIdToReset}) günlük kotası 5'e sıfırlandı!`);
        setTimeout(() => setActionMsg(''), 3000);
        loadStats();
      }
    } catch (err) {
      console.error('Reset quota error:', err);
    }
  };

  const handleSetCustomQuota = async () => {
    if (!targetUserId) return;
    try {
      const res = await fetch('/api/admin/user-quota', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId,
          targetUserId,
          customQuota: Number(customQuotaVal),
        }),
      });
      if (res.ok) {
        setActionMsg(`Kullanıcı (${targetUserId}) kotası ${customQuotaVal} yapıldı.`);
        setTimeout(() => setActionMsg(''), 3000);
        loadStats();
      }
    } catch (err) {
      console.error('Custom quota error:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative p-5 sm:p-7 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading text-xl font-bold text-white">
                BİLO Admin & Sistem Yönetimi
              </h3>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-400">
                Admin Panel
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Kullanıcı kotaları, soru istatistikleri ve yapay zeka sistem ayarları
            </p>
          </div>
        </div>

        {actionMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionMsg}</span>
          </div>
        )}

        {/* Overview Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-1 text-xs text-slate-400 mb-1">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>Toplam Kullanıcı</span>
              </div>
              <div className="font-heading text-2xl font-extrabold text-white">
                {stats.totalUsers}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-1 text-xs text-slate-400 mb-1">
                <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                <span>Toplam Soru</span>
              </div>
              <div className="font-heading text-2xl font-extrabold text-white">
                {stats.totalQuestions}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-1 text-xs text-slate-400 mb-1">
                <Dumbbell className="w-3.5 h-3.5 text-amber-400" />
                <span>Spor Modu</span>
              </div>
              <div className="font-heading text-2xl font-extrabold text-amber-400">
                {stats.sportQuestions}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-1 text-xs text-slate-400 mb-1">
                <Brain className="w-3.5 h-3.5 text-sky-400" />
                <span>Bilgi Modu</span>
              </div>
              <div className="font-heading text-2xl font-extrabold text-sky-400">
                {stats.knowledgeQuestions}
              </div>
            </div>
          </div>
        )}

        {/* User Quota & Management Controls */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>Kullanıcı Kota & Yetki Yönetimi</span>
          </h4>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <input
              type="text"
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
              placeholder="Kullanıcı ID (örn: bilo_guest_demo veya usr_...)"
              className="w-full sm:flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
            <button
              onClick={() => handleResetQuota(targetUserId || 'bilo_guest_demo')}
              className="w-full sm:w-auto px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Kotayı Sıfırla (5 Hak)</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 pt-1 border-t border-slate-900">
            <span className="text-xs text-slate-400 shrink-0">
              Özel Günlük Soru Sınırı Ver:
            </span>
            <input
              type="number"
              value={customQuotaVal}
              onChange={(e) => setCustomQuotaVal(e.target.value)}
              min="1"
              max="500"
              className="w-20 bg-slate-900 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-white text-center focus:outline-none focus:border-amber-400"
            />
            <button
              onClick={handleSetCustomQuota}
              disabled={!targetUserId}
              className="w-full sm:w-auto px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs disabled:opacity-40"
            >
              Uygula
            </button>
          </div>
        </div>

        {/* Recent AI Questions Log */}
        {stats?.recentQuestions && (
          <div className="space-y-2">
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-slate-400">
              Son Yapay Zeka İstekleri (Log)
            </h4>
            <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
              {stats.recentQuestions.map((q) => (
                <div
                  key={q.id}
                  className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span
                      className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                        q.mode === 'sport'
                          ? 'bg-amber-400/20 text-amber-400'
                          : 'bg-sky-400/20 text-sky-400'
                      }`}
                    >
                      {q.mode}
                    </span>
                    <span className="font-medium text-white truncate">
                      {q.question}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 shrink-0">
                    {new Date(q.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Character Settings Info */}
        <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800 text-[11px] text-slate-400 space-y-1">
          <div className="font-bold text-slate-300 flex items-center gap-1.5">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            BİLO TikTok Persona & Model Yapılandırması
          </div>
          <p>
            • Model: <span className="text-amber-300">gemini-3.8-flash</span>
          </p>
          <p>
            • Spor Modu: Motivasyon Koçu Bilo (Hitap: "Kanka", "Şampiyon", dinamik emojiler 💪)
          </p>
          <p>
            • Bilge Modu: Bilge Rehber Bilo (Hitap: "Kanka", sevecen, anlaşılır bilim & kültür 🧠)
          </p>
          <p>• Günlük Standart Kota: 5 soru / gün (Gece yarısı otomatik sıfırlama)</p>
        </div>
      </div>
    </div>
  );
};
