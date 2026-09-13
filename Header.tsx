import React from 'react';
import { Crown, Sparkles, Dumbbell, Brain, User as UserIcon, ShieldAlert } from 'lucide-react';
import { BiloMode, DailyQuota, User, AppTab } from '../types';
import { BILO_IMAGES } from '../assets/biloImages';

interface HeaderProps {
  currentMode: BiloMode | 'auto';
  onSelectMode: (mode: BiloMode | 'auto') => void;
  detectedMode?: BiloMode;
  quota: DailyQuota | null;
  user: User | null;
  onOpenProfile: () => void;
  onOpenAdmin: () => void;
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  detectedMode,
  quota,
  user,
  onOpenProfile,
  onOpenAdmin,
  activeTab,
  onSelectTab,
}) => {
  const effectiveMode = currentMode === 'auto' ? detectedMode || 'sport' : currentMode;
  const isSport = effectiveMode === 'sport';

  const remaining = quota ? quota.remaining : 5;
  const total = quota ? quota.total : 5;
  const percentage = (remaining / total) * 100;

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80 transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <div
          id="bilo-logo-btn"
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden ring-2 ring-amber-400/80 shadow-md shadow-amber-400/20 group-hover:scale-105 transition-transform">
            <img
              src={BILO_IMAGES.avatar}
              alt="Bilo Mascot"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 p-0.5 rounded-full shadow">
              <Crown className="w-3 h-3 fill-slate-950" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-1">
                BİLO
                <Crown className="w-4 h-4 text-amber-400 fill-amber-400 inline" />
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-400 -mt-0.5 hidden xs:block">
              Sor, Öğren, Geliş!
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1 rounded-2xl border border-slate-800 text-xs">
          <button
            onClick={() => onSelectTab('home')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'home'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Ana Sayfa
          </button>
          <button
            onClick={() => onSelectTab('chat')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'chat'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Bilo Chat
          </button>
          <button
            id="nav-header-exercises"
            onClick={() => onSelectTab('exercises')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'exercises'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-amber-300/90 hover:text-amber-200 bg-amber-400/10'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>Hareketler</span>
          </button>
          <button
            onClick={() => onSelectTab('workout')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'workout'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Program
          </button>
          <button
            onClick={() => onSelectTab('history')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'history'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Geçmiş
          </button>
        </div>

        {/* Center Mode Switcher (Pill) */}
        <div className="hidden md:flex items-center bg-slate-900/90 p-1 rounded-full border border-slate-800 shadow-inner">
          <button
            id="mode-tab-auto"
            onClick={() => onSelectMode('auto')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              currentMode === 'auto'
                ? 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Otomatik Mod</span>
          </button>
          <button
            id="mode-tab-sport"
            onClick={() => onSelectMode('sport')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              currentMode === 'sport'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 font-bold'
                : 'text-slate-400 hover:text-amber-400'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>Spor Koçu</span>
          </button>
          <button
            id="mode-tab-knowledge"
            onClick={() => onSelectMode('knowledge')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              currentMode === 'knowledge'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20 font-bold'
                : 'text-slate-400 hover:text-sky-400'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Bilge Rehber</span>
          </button>
        </div>

        {/* Right Controls: Quota Indicator & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Daily Quota Counter Badge */}
          <div
            id="header-daily-quota"
            title="Günlük kalan AI soru hakkınız"
            className="flex items-center gap-2 bg-slate-900/90 border border-slate-800/90 px-2.5 py-1.5 rounded-full shadow-sm"
          >
            <div className="flex flex-col text-right">
              <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 hidden sm:inline">
                Günlük Hak
              </span>
              <span className="text-xs font-extrabold text-white flex items-center justify-end gap-1">
                <span
                  className={
                    remaining > 0
                      ? isSport
                        ? 'text-amber-400'
                        : 'text-sky-400'
                      : 'text-rose-400'
                  }
                >
                  {remaining}
                </span>
                <span className="text-slate-500">/</span>
                <span className="text-slate-400">{total}</span>
              </span>
            </div>

            {/* Radial / Bar Progress indicator */}
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-800 p-1 flex items-center justify-center relative">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-700"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={remaining > 0 ? (isSport ? 'text-amber-400' : 'text-sky-400') : 'text-rose-500'}
                  strokeDasharray={`${percentage}, 100`}
                  strokeWidth="4"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <Crown className="w-2.5 h-2.5 absolute text-amber-400 fill-amber-400" />
            </div>
          </div>

          {/* Admin shortcut if user is admin */}
          {user?.role === 'admin' && (
            <button
              id="header-admin-btn"
              onClick={onOpenAdmin}
              className="p-2 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
              title="Admin Paneli"
            >
              <ShieldAlert className="w-4 h-4" />
            </button>
          )}

          {/* User Profile Button */}
          <button
            id="header-profile-btn"
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors text-slate-200"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center shadow-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'B'}
            </div>
            <span className="text-xs font-medium max-w-[80px] truncate hidden sm:inline">
              {user?.name || 'Giriş Yap'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Mode Switcher Strip */}
      <div className="md:hidden flex items-center justify-around px-4 py-1.5 bg-slate-900/60 border-t border-slate-900 text-xs">
        <button
          onClick={() => onSelectMode('auto')}
          className={`px-2.5 py-1 rounded-full font-medium flex items-center gap-1 ${
            currentMode === 'auto'
              ? 'bg-slate-800 text-white ring-1 ring-slate-700'
              : 'text-slate-400'
          }`}
        >
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Otomatik</span>
        </button>
        <button
          onClick={() => onSelectMode('sport')}
          className={`px-2.5 py-1 rounded-full font-semibold flex items-center gap-1 ${
            currentMode === 'sport'
              ? 'bg-amber-400 text-slate-950 font-bold'
              : 'text-slate-400'
          }`}
        >
          <Dumbbell className="w-3 h-3" />
          <span>Spor Koçu</span>
        </button>
        <button
          onClick={() => onSelectMode('knowledge')}
          className={`px-2.5 py-1 rounded-full font-semibold flex items-center gap-1 ${
            currentMode === 'knowledge'
              ? 'bg-sky-500 text-white font-bold'
              : 'text-slate-400'
          }`}
        >
          <Brain className="w-3 h-3" />
          <span>Bilge Rehber</span>
        </button>
      </div>
    </header>
  );
};
