import React, { useState } from 'react';
import {
  Dumbbell,
  Search,
  Sparkles,
  Flame,
  Crown,
  Filter,
  ArrowRight,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { EXERCISES_DATABASE, ExerciseItem } from '../data/exercises';
import { BILO_IMAGES } from '../assets/biloImages';

interface ExerciseGuideProps {
  onSelectExercise: (exercise: ExerciseItem) => void;
  onAskBilo: (question: string) => void;
}

export const ExerciseGuide: React.FC<ExerciseGuideProps> = ({
  onSelectExercise,
  onAskBilo,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [equipmentFilter, setEquipmentFilter] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Tüm Hareketler', icon: '⚡' },
    { id: 'chest', label: 'Göğüs', icon: '💪' },
    { id: 'back', label: 'Sırt & Kanat', icon: '🦅' },
    { id: 'legs', label: 'Bacak & Kalça', icon: '🦵' },
    { id: 'shoulders', label: 'Omuz', icon: '🥥' },
    { id: 'arms', label: 'Kol (Pazu/Arka Kol)', icon: '🥊' },
    { id: 'core', label: 'Karın & Core', icon: '🧱' },
  ];

  const filteredExercises = EXERCISES_DATABASE.filter((ex) => {
    // Category match
    if (selectedCategory !== 'all' && ex.category !== selectedCategory) return false;

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = ex.name.toLowerCase().includes(q);
      const matchTr = ex.turkishName.toLowerCase().includes(q);
      const matchMuscles = ex.primaryMuscles.some((m) => m.toLowerCase().includes(q));
      if (!matchName && !matchTr && !matchMuscles) return false;
    }

    // Equipment / Location filter
    if (equipmentFilter === 'home') {
      if (ex.locationType === 'gym') return false;
    } else if (equipmentFilter === 'gym') {
      if (ex.locationType === 'home') return false;
    } else if (equipmentFilter === 'bodyweight') {
      if (!ex.equipment.toLowerCase().includes('vücut') && !ex.equipment.toLowerCase().includes('sandalye') && !ex.equipment.toLowerCase().includes('mat') && !ex.equipment.toLowerCase().includes('zemin')) return false;
    } else if (equipmentFilter === 'free_weights') {
      if (
        !ex.equipment.toLowerCase().includes('barbell') &&
        !ex.equipment.toLowerCase().includes('dambıl')
      )
        return false;
    } else if (equipmentFilter === 'machines') {
      if (
        !ex.equipment.toLowerCase().includes('makine') &&
        !ex.equipment.toLowerCase().includes('kablo')
      )
        return false;
    }

    return true;
  });

  const renderCardGraphic = (id: string, name: string) => {
    // 1. Bench Press
    if (id.includes('bench_press')) {
      return (
        <svg viewBox="0 0 160 80" className="w-full h-full">
          <rect x="25" y="58" width="110" height="6" rx="2" fill="#334155" />
          <rect x="35" y="64" width="8" height="12" fill="#1E293B" />
          <rect x="117" y="64" width="8" height="12" fill="#1E293B" />
          <rect x="42" y="48" width="60" height="11" rx="5" fill="#475569" />
          <circle cx="36" cy="53" r="7" fill="#64748B" />
          <rect x="62" y="45" width="22" height="9" rx="3" fill="#FACC15" opacity="0.9" />
          <line x1="40" y1="28" x2="100" y2="28" stroke="#F8FAFC" strokeWidth="3.5" strokeLinecap="round" />
          <rect x="44" y="21" width="5" height="14" rx="1" fill="#E2E8F0" />
          <rect x="91" y="21" width="5" height="14" rx="1" fill="#E2E8F0" />
          <line x1="68" y1="48" x2="70" y2="30" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    }
    // 2. Incline Dumbbell Press
    if (id.includes('incline')) {
      return (
        <svg viewBox="0 0 160 80" className="w-full h-full">
          <line x1="45" y1="68" x2="95" y2="28" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
          <rect x="75" y="48" width="6" height="26" fill="#1E293B" />
          <line x1="50" y1="65" x2="90" y2="33" stroke="#475569" strokeWidth="9" strokeLinecap="round" />
          <circle cx="95" cy="27" r="7" fill="#64748B" />
          <circle cx="83" cy="38" r="6" fill="#FACC15" opacity="0.9" />
          <rect x="95" y="10" width="6" height="10" rx="1" fill="#E2E8F0" />
          <line x1="82" y1="38" x2="98" y2="16" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    }
    // 3. Push Up
    if (id.includes('push_up') || id.includes('sinav')) {
      return (
        <svg viewBox="0 0 160 80" className="w-full h-full">
          <line x1="15" y1="70" x2="145" y2="70" stroke="#334155" strokeWidth="2.5" />
          <circle cx="45" cy="36" r="7" fill="#64748B" />
          <line x1="48" y1="42" x2="125" y2="65" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
          <line x1="58" y1="45" x2="58" y2="70" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
          <rect x="52" y="42" width="18" height="7" rx="2" fill="#FACC15" opacity="0.9" />
          <circle cx="125" cy="67" r="3.5" fill="#CBD5E1" />
        </svg>
      );
    }
    // 4. Pull Up
    if (id.includes('pull_up') || id.includes('barfiks')) {
      return (
        <svg viewBox="0 0 160 80" className="w-full h-full">
          <line x1="30" y1="16" x2="130" y2="16" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
          <circle cx="80" cy="24" r="7" fill="#64748B" />
          <polygon points="72,32 88,32 84,55 76,55" fill="#38BDF8" opacity="0.9" />
          <line x1="58" y1="16" x2="74" y2="33" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
          <line x1="102" y1="16" x2="86" y2="33" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
          <path d="M 77 55 L 75 72 M 83 55 L 81 72" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      );
    }
    // 5. Lat Pulldown
    if (id.includes('lat_pulldown')) {
      return (
        <svg viewBox="0 0 160 80" className="w-full h-full">
          <line x1="80" y1="8" x2="80" y2="20" stroke="#64748B" strokeWidth="2.5" />
          <circle cx="80" cy="20" r="4" fill="#475569" />
          <path d="M 45 40 Q 80 46 115 40" stroke="#F8FAFC" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <rect x="70" y="62" width="22" height="5" rx="2" fill="#334155" />
          <circle cx="80" cy="45" r="6" fill="#64748B" />
          <line x1="80" y1="50" x2="80" y2="64" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
          <polygon points="74,52 86,52 83,63 77,63" fill="#38BDF8" opacity="0.9" />
        </svg>
      );
    }
    // 6. Barbell Row
    if (id.includes('row')) {
      return (
        <svg viewBox="0 0 160 80" className="w-full h-full">
          <line x1="20" y1="72" x2="140" y2="72" stroke="#334155" strokeWidth="2" />
          <circle cx="55" cy="35" r="7" fill="#64748B" />
          <line x1="58" y1="40" x2="90" y2="55" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
          <polygon points="62,42 78,50 74,58 60,48" fill="#38BDF8" opacity="0.9" />
          <line x1="70" y1="46" x2="70" y2="60" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
          <line x1="45" y1="60" x2="95" y2="60" stroke="#F8FAFC" strokeWidth="3" strokeLinecap="round" />
          <circle cx="48" cy="60" r="5" fill="#E2E8F0" />
          <circle cx="92" cy="60" r="5" fill="#E2E8F0" />
        </svg>
      );
    }
    // 7. Squat
    if (id.includes('squat')) {
      return (
        <svg viewBox="0 0 160 80" className="w-full h-full">
          <line x1="20" y1="74" x2="140" y2="74" stroke="#334155" strokeWidth="2.5" />
          <circle cx="70" cy="42" r="6" fill="#64748B" />
          <line x1="70" y1="48" x2="62" y2="62" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
          <path d="M 62 62 L 85 62 L 82 74" fill="none" stroke="#CBD5E1" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="62" y="58" width="20" height="8" rx="2" fill="#FACC15" opacity="0.9" />
          <line x1="42" y1="46" x2="98" y2="46" stroke="#F8FAFC" strokeWidth="3.5" strokeLinecap="round" />
          <rect x="44" y="40" width="5" height="12" rx="1" fill="#E2E8F0" />
          <rect x="91" y="40" width="5" height="12" rx="1" fill="#E2E8F0" />
        </svg>
      );
    }
    // 8. Leg Press
    if (id.includes('leg_press')) {
      return (
        <svg viewBox="0 0 160 80" className="w-full h-full">
          <line x1="40" y1="72" x2="125" y2="18" stroke="#334155" strokeWidth="5" strokeLinecap="round" />
          <line x1="38" y1="58" x2="30" y2="40" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
          <circle cx="32" cy="34" r="5.5" fill="#64748B" />
          <line x1="46" y1="58" x2="95" y2="32" stroke="#CBD5E1" strokeWidth="5.5" strokeLinecap="round" />
          <rect x="62" y="40" width="18" height="8" rx="2" fill="#FACC15" opacity="0.9" />
          <line x1="90" y1="36" x2="105" y2="23" stroke="#E2E8F0" strokeWidth="6" strokeLinecap="round" />
          <circle cx="108" cy="25" r="7" fill="#94A3B8" />
        </svg>
      );
    }
    // 9. Deadlift
    if (id.includes('deadlift')) {
      return (
        <svg viewBox="0 0 160 80" className="w-full h-full">
          <line x1="20" y1="74" x2="140" y2="74" stroke="#334155" strokeWidth="2.5" />
          <circle cx="80" cy="22" r="7" fill="#64748B" />
          <line x1="80" y1="28" x2="80" y2="54" stroke="#475569" strokeWidth="9" strokeLinecap="round" />
          <line x1="77" y1="54" x2="74" y2="74" stroke="#CBD5E1" strokeWidth="5.5" strokeLinecap="round" />
          <line x1="83" y1="54" x2="86" y2="74" stroke="#CBD5E1" strokeWidth="5.5" strokeLinecap="round" />
          <line x1="45" y1="56" x2="115" y2="56" stroke="#F8FAFC" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="50" cy="56" r="11" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
          <circle cx="110" cy="56" r="11" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
          <rect x="72" y="46" width="16" height="10" rx="3" fill="#FACC15" opacity="0.9" />
        </svg>
      );
    }
    // 10. Lunge
    if (id.includes('lunge')) {
      return (
        <svg viewBox="0 0 160 80" className="w-full h-full">
          <line x1="20" y1="74" x2="140" y2="74" stroke="#334155" strokeWidth="2.5" />
          <circle cx="75" cy="28" r="6" fill="#64748B" />
          <line x1="75" y1="34" x2="75" y2="58" stroke="#475569" strokeWidth="7" strokeLinecap="round" />
          <path d="M 75 58 L 95 58 L 95 74" fill="none" stroke="#CBD5E1" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 75 58 L 58 66 L 58 72" fill="none" stroke="#94A3B8" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="70" y="44" width="5" height="8" rx="1" fill="#E2E8F0" />
        </svg>
      );
    }
    // 11. Overhead Press
    if (id.includes('overhead') || id.includes('military')) {
      return (
        <svg viewBox="0 0 160 80" className="w-full h-full">
          <line x1="20" y1="74" x2="140" y2="74" stroke="#334155" strokeWidth="2" />
          <circle cx="80" cy="30" r="6" fill="#64748B" />
          <line x1="80" y1="36" x2="80" y2="58" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
          <line x1="76" y1="58" x2="74" y2="74" stroke="#CBD5E1" strokeWidth="5" strokeLinecap="round" />
          <line x1="84" y1="58" x2="86" y2="74" stroke="#CBD5E1" strokeWidth="5" strokeLinecap="round" />
          <line x1="45" y1="14" x2="115" y2="14" stroke="#F8FAFC" strokeWidth="3" strokeLinecap="round" />
          <rect x="48" y="8" width="5" height="12" rx="1" fill="#E2E8F0" />
          <rect x="107" y="8" width="5" height="12" rx="1" fill="#E2E8F0" />
          <line x1="72" y1="38" x2="68" y2="15" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
          <line x1="88" y1="38" x2="92" y2="15" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    }
    // 12. Lateral Raise
    if (id.includes('lateral_raise')) {
      return (
        <svg viewBox="0 0 160 80" className="w-full h-full">
          <line x1="20" y1="74" x2="140" y2="74" stroke="#334155" strokeWidth="2" />
          <circle cx="80" cy="28" r="6" fill="#64748B" />
          <line x1="80" y1="34" x2="80" y2="58" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
          <line x1="72" y1="37" x2="40" y2="39" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
          <line x1="88" y1="37" x2="120" y2="39" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
          <circle cx="38" cy="39" r="4" fill="#E2E8F0" />
          <circle cx="122" cy="39" r="4" fill="#E2E8F0" />
          <circle cx="72" cy="37" r="4" fill="#FACC15" />
          <circle cx="88" cy="37" r="4" fill="#FACC15" />
        </svg>
      );
    }
    // 13. Biceps Curl
    if (id.includes('biceps') || id.includes('curl')) {
      return (
        <svg viewBox="0 0 160 80" className="w-full h-full">
          <line x1="20" y1="74" x2="140" y2="74" stroke="#334155" strokeWidth="2" />
          <circle cx="80" cy="26" r="6" fill="#64748B" />
          <line x1="80" y1="32" x2="80" y2="58" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
          <line x1="74" y1="36" x2="74" y2="50" stroke="#CBD5E1" strokeWidth="5" strokeLinecap="round" />
          <line x1="74" y1="50" x2="68" y2="38" stroke="#CBD5E1" strokeWidth="4.5" strokeLinecap="round" />
          <circle cx="71" cy="43" r="5" fill="#FACC15" opacity="0.9" />
          <line x1="55" y1="37" x2="85" y2="37" stroke="#F8FAFC" strokeWidth="3" strokeLinecap="round" />
          <circle cx="55" cy="37" r="4" fill="#E2E8F0" />
          <circle cx="85" cy="37" r="4" fill="#E2E8F0" />
        </svg>
      );
    }
    // 14. Triceps Pushdown
    if (id.includes('triceps') || id.includes('pushdown')) {
      return (
        <svg viewBox="0 0 160 80" className="w-full h-full">
          <circle cx="95" cy="16" r="3.5" fill="#475569" />
          <line x1="95" y1="16" x2="80" y2="50" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="2 2" />
          <circle cx="68" cy="32" r="6" fill="#64748B" />
          <line x1="68" y1="38" x2="70" y2="62" stroke="#475569" strokeWidth="7" strokeLinecap="round" />
          <line x1="70" y1="42" x2="78" y2="60" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
          <rect x="66" y="41" width="5" height="10" rx="1.5" fill="#FACC15" opacity="0.9" />
          <line x1="78" y1="58" x2="75" y2="68" stroke="#FACC15" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    }
    // 15. Dips
    if (id.includes('dips')) {
      return (
        <svg viewBox="0 0 160 80" className="w-full h-full">
          <line x1="45" y1="48" x2="115" y2="48" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
          <line x1="55" y1="48" x2="55" y2="74" stroke="#475569" strokeWidth="4" />
          <line x1="105" y1="48" x2="105" y2="74" stroke="#475569" strokeWidth="4" />
          <circle cx="80" cy="22" r="6" fill="#64748B" />
          <line x1="80" y1="28" x2="78" y2="52" stroke="#475569" strokeWidth="7" strokeLinecap="round" />
          <line x1="75" y1="34" x2="68" y2="48" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
          <line x1="85" y1="34" x2="92" y2="48" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    }
    // 16. Plank
    if (id.includes('plank')) {
      return (
        <svg viewBox="0 0 160 80" className="w-full h-full">
          <line x1="15" y1="70" x2="145" y2="70" stroke="#334155" strokeWidth="2.5" />
          <circle cx="42" cy="46" r="6" fill="#64748B" />
          <path d="M 46 51 L 49 70 L 60 70" fill="none" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="46" y1="51" x2="115" y2="60" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
          <rect x="62" y="52" width="28" height="8" rx="2" fill="#FACC15" opacity="0.9" />
          <circle cx="125" cy="68" r="3" fill="#CBD5E1" />
        </svg>
      );
    }
    // 17. Crunch
    if (id.includes('crunch') || id.includes('mekik')) {
      return (
        <svg viewBox="0 0 160 80" className="w-full h-full">
          <line x1="15" y1="70" x2="145" y2="70" stroke="#334155" strokeWidth="2.5" />
          <path d="M 75 66 L 95 45 L 115 70" fill="none" stroke="#64748B" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="48" cy="48" r="6" fill="#64748B" />
          <path d="M 48 53 Q 60 58 75 66" fill="none" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
          <rect x="54" y="51" width="16" height="9" rx="2" fill="#FACC15" opacity="0.9" />
        </svg>
      );
    }
    // 18. Hanging Leg Raise
    if (id.includes('leg_raise')) {
      return (
        <svg viewBox="0 0 160 80" className="w-full h-full">
          <line x1="30" y1="14" x2="130" y2="14" stroke="#CBD5E1" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="80" cy="28" r="6" fill="#64748B" />
          <line x1="65" y1="14" x2="76" y2="32" stroke="#CBD5E1" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="95" y1="14" x2="84" y2="32" stroke="#CBD5E1" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="80" y1="34" x2="80" y2="54" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
          <line x1="80" y1="54" x2="110" y2="54" stroke="#CBD5E1" strokeWidth="5.5" strokeLinecap="round" />
          <rect x="74" y="44" width="12" height="9" rx="2" fill="#FACC15" opacity="0.9" />
        </svg>
      );
    }
    // Default
    return (
      <svg viewBox="0 0 160 80" className="w-full h-full">
        <circle cx="80" cy="35" r="8" fill="#64748B" />
        <line x1="80" y1="43" x2="80" y2="65" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
      </svg>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 py-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl mb-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-amber-400 blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-amber-400 shrink-0 shadow-lg">
              <img
                src={BILO_IMAGES.sportCoach}
                alt="Bilo Coach"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/30">
                  BİLO GÖRSEL HAREKET REHBERİ
                </span>
                <span className="text-xs text-slate-400">
                  {EXERCISES_DATABASE.length} Temel Egzersiz
                </span>
              </div>
              <h1 className="font-heading text-xl sm:text-2xl font-black text-white mt-1 flex items-center gap-2">
                Spor Hareketleri & 3D Döngüsel Form Rehberi
                <Crown className="w-4 h-4 text-amber-400 fill-amber-400 inline" />
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Kasları tam hedeften vurmak ve sakatlanmamak için her hareketin 3D döngüsel form animasyonunu ve fazlarını incele!
              </p>
            </div>
          </div>

          <button
            onClick={() => onAskBilo('Hangi hareket hangi kası daha iyi çalıştırır kanka?')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-colors shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Bilo’ya Hareket Sor</span>
          </button>
        </div>
      </div>

      {/* Search Bar & Equipment Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 mb-4">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Hareket ara (örn: bench press, squat, şınav, karın)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 focus:border-amber-400/80 focus:outline-none text-xs sm:text-sm text-white placeholder:text-slate-500 transition-colors shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Temizle
            </button>
          )}
        </div>

        {/* Equipment Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs text-slate-300">
          <button
            onClick={() => setEquipmentFilter('all')}
            className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-colors border ${
              equipmentFilter === 'all'
                ? 'bg-amber-400 text-slate-950 border-amber-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Tümü
          </button>
          <button
            onClick={() => setEquipmentFilter('home')}
            className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-colors border ${
              equipmentFilter === 'home'
                ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            🏠 Sadece Evde Yapılanlar
          </button>
          <button
            onClick={() => setEquipmentFilter('gym')}
            className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-colors border ${
              equipmentFilter === 'gym'
                ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            🏋️ Spor Salonu
          </button>
          <button
            onClick={() => setEquipmentFilter('bodyweight')}
            className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-colors border ${
              equipmentFilter === 'bodyweight'
                ? 'bg-amber-400 text-slate-950 border-amber-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            🤸 Vücut Ağırlığı
          </button>
          <button
            onClick={() => setEquipmentFilter('free_weights')}
            className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-colors border ${
              equipmentFilter === 'free_weights'
                ? 'bg-amber-400 text-slate-950 border-amber-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            🔩 Dambıl & Halter
          </button>
          <button
            onClick={() => setEquipmentFilter('machines')}
            className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-colors border ${
              equipmentFilter === 'machines'
                ? 'bg-amber-400 text-slate-950 border-amber-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            ⚙️ Makineler
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-5 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap flex items-center gap-1.5 transition-all ${
              selectedCategory === cat.id
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 ring-2 ring-amber-400/30'
                : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Exercise Cards Grid */}
      {filteredExercises.length === 0 ? (
        <div className="py-16 text-center bg-slate-900/40 rounded-3xl border border-slate-800">
          <Dumbbell className="w-10 h-10 text-slate-600 mx-auto mb-3 animate-bounce" />
          <h3 className="font-heading text-lg font-bold text-white">Egzersiz Bulunamadı</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Farklı bir arama kelimesi deneyebilir veya kategorileri sıfırlayabilirsiniz.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setEquipmentFilter('all');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-amber-400"
          >
            Filtreleri Sıfırla
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {filteredExercises.map((exercise) => (
            <div
              key={exercise.id}
              onClick={() => onSelectExercise(exercise)}
              className="bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-amber-400/60 p-4 rounded-2xl cursor-pointer transition-all duration-200 hover:-translate-y-1 group flex flex-col justify-between shadow-lg"
            >
              <div>
                {/* Visual 3D Looping Animation Thumbnail Header */}
                <div className="w-full h-36 sm:h-40 rounded-xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/90 mb-3 relative overflow-hidden flex items-center justify-center group-hover:border-amber-400/50 transition-colors shadow-inner">
                  {/* Subtle Grid Pattern */}
                  <div 
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                      backgroundImage: `radial-gradient(circle at 1px 1px, rgba(250, 204, 21, 0.4) 1px, transparent 0)`,
                      backgroundSize: '16px 16px'
                    }}
                  />

                  {/* 3D GIF Image */}
                  <img
                    src={exercise.gifUrl || `/exercises/${exercise.id}.gif`}
                    alt={`${exercise.name} 3D Animasyon`}
                    loading="lazy"
                    className="w-full h-full object-contain p-1.5 group-hover:scale-105 transition-transform duration-300 relative z-1"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />

                  {/* Graceful Fallback SVG */}
                  <div className="w-full h-full items-center justify-center p-2 hidden">
                    {renderCardGraphic(exercise.id, exercise.name)}
                  </div>

                  {/* Category & Location Pill */}
                  <div className="absolute top-2 left-2 z-10 flex items-center gap-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-950/90 text-amber-400 border border-slate-800 shadow backdrop-blur-sm">
                      {exercise.categoryLabel}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border shadow backdrop-blur-sm ${
                        exercise.locationType === 'home' || exercise.locationType === 'both'
                          ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40'
                          : 'bg-indigo-950/90 text-indigo-300 border-indigo-500/40'
                      }`}
                    >
                      {exercise.locationType === 'home'
                        ? '🏠 Ev'
                        : exercise.locationType === 'both'
                        ? '🏠 Ev/Salon'
                        : '🏋️ Salon'}
                    </span>
                  </div>

                  {/* 3D Loop Badge */}
                  <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
                    <span className="text-[9px] font-extrabold text-emerald-300 bg-slate-950/90 px-2 py-0.5 rounded-full border border-emerald-500/40 shadow backdrop-blur-sm flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      3D Döngü
                    </span>
                  </div>

                  {/* Bottom Info Bar */}
                  <div className="absolute bottom-1.5 left-2 right-2 z-10 flex items-center justify-between pointer-events-none">
                    <span className="text-[9px] font-semibold text-slate-300 bg-slate-950/80 px-2 py-0.5 rounded-md border border-slate-800/80 truncate max-w-[130px] backdrop-blur-sm">
                      {exercise.primaryMuscles[0]}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 bg-slate-950/80 px-1.5 py-0.5 rounded-md border border-slate-800/80 backdrop-blur-sm">
                      {exercise.difficulty}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-heading text-base font-extrabold text-white group-hover:text-amber-400 transition-colors">
                  {exercise.name}
                </h3>
                <p className="text-xs text-slate-400 mb-2">{exercise.turkishName}</p>

                {/* Short description */}
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
                  {exercise.shortDesc}
                </p>

                {/* Target muscles pills */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {exercise.primaryMuscles.map((muscle, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20"
                    >
                      {muscle}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Action bar */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 truncate max-w-[150px]">
                  {exercise.equipment}
                </span>
                <span className="font-bold text-amber-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Hareketi Gör</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
