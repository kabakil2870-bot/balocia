import React from 'react';
import { Home, MessageSquare, Dumbbell, History, User, Activity } from 'lucide-react';
import { AppTab } from '../types';

interface BottomNavProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  onOpenProfile: () => void;
  remainingQuota: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenProfile,
  remainingQuota,
}) => {
  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-lg border-t border-slate-800/80 px-1.5 py-1.5 no-print">
      <div className="flex items-center justify-around">
        {/* 1. Ana Sayfa */}
        <button
          id="nav-home"
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-colors ${
            activeTab === 'home'
              ? 'text-amber-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-[9px] mt-0.5">Ana Sayfa</span>
        </button>

        {/* 2. Bilo'ya Sor */}
        <button
          id="nav-chat"
          onClick={() => onSelectTab('chat')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-colors relative ${
            activeTab === 'chat'
              ? 'text-amber-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <MessageSquare className="w-4 h-4" />
            <span
              className={`absolute -top-1 -right-2 text-[8px] font-extrabold px-1 rounded-full ${
                remainingQuota > 0
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-rose-500 text-white'
              }`}
            >
              {remainingQuota}
            </span>
          </div>
          <span className="text-[9px] mt-0.5">Bilo Chat</span>
        </button>

        {/* 3. Spor Hareketleri (New!) */}
        <button
          id="nav-exercises"
          onClick={() => onSelectTab('exercises')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-colors ${
            activeTab === 'exercises'
              ? 'text-amber-400 font-bold'
              : 'text-amber-400/70 hover:text-amber-300'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span className="text-[9px] mt-0.5">Hareketler</span>
        </button>

        {/* 4. Spor Programı */}
        <button
          id="nav-workout"
          onClick={() => onSelectTab('workout')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-colors ${
            activeTab === 'workout'
              ? 'text-amber-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Dumbbell className="w-4 h-4" />
          <span className="text-[9px] mt-0.5">Program</span>
        </button>

        {/* 5. Profil */}
        <button
          id="nav-profile"
          onClick={onOpenProfile}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-slate-400 hover:text-slate-200 transition-colors"
        >
          <User className="w-4 h-4" />
          <span className="text-[9px] mt-0.5">Profil</span>
        </button>
      </div>
    </nav>
  );
};
