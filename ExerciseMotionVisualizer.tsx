import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Sparkles, 
  Video, 
  Activity, 
  Wind, 
  ShieldCheck, 
  Layers, 
  Compass,
  RotateCcw,
  Maximize2
} from 'lucide-react';
import { ExerciseItem, getExerciseBiomechanics } from '../data/exercises';

interface ExerciseMotionVisualizerProps {
  exercise: ExerciseItem;
  onExpandFullscreen?: () => void;
}

export const ExerciseMotionVisualizer: React.FC<ExerciseMotionVisualizerProps> = ({ 
  exercise,
  onExpandFullscreen
}) => {
  const [phase, setPhase] = useState<'start' | 'peak'>('start');
  const [activeViewMode, setActiveViewMode] = useState<'3d_gif' | 'phases' | 'biomechanics'>('3d_gif');
  const [isMetronomeActive, setIsMetronomeActive] = useState(false);
  const [metroSecond, setMetroSecond] = useState(0);
  const [metroPhaseText, setMetroPhaseText] = useState('Hazırlan');
  const [isGifPlaying, setIsGifPlaying] = useState(true);
  const [gifLoadFailed, setGifLoadFailed] = useState(false);

  const biomechanics = getExerciseBiomechanics(exercise.id || exercise.name);
  const gifUrl = exercise.gifUrl || biomechanics.gifUrl || '/exercises/push_ups.gif';

  useEffect(() => {
    setGifLoadFailed(false);
  }, [exercise.id, gifUrl]);

  // Automatic gentle phase oscillation for visual demonstration
  useEffect(() => {
    if (isMetronomeActive) return;
    const interval = setInterval(() => {
      setPhase((prev) => (prev === 'start' ? 'peak' : 'start'));
    }, 2400);
    return () => clearInterval(interval);
  }, [isMetronomeActive]);

  // Metronome tempo practice loop (2s down, 1s hold, 1s up)
  useEffect(() => {
    if (!isMetronomeActive) return;

    let sec = 0;
    const interval = setInterval(() => {
      sec = (sec + 1) % 4;
      setMetroSecond(sec);

      if (sec === 0 || sec === 1) {
        setPhase('start');
        setMetroPhaseText('İndir / Esnet (Kontrollü Negatif)');
      } else if (sec === 2) {
        setPhase('start');
        setMetroPhaseText('Dipte 1 sn Durakla');
      } else {
        setPhase('peak');
        setMetroPhaseText('Patlayıcı İt / Çek! 🔥');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isMetronomeActive]);

  const toggleMetronome = () => {
    setIsMetronomeActive((prev) => !prev);
    if (!isMetronomeActive) {
      setMetroSecond(0);
      setMetroPhaseText('Hazırlan...');
    }
  };

  // Dedicated Renderers for each distinct exercise
  const renderVisualFigure = () => {
    const isPeak = phase === 'peak';
    const id = exercise.id.toLowerCase();

    // 1. BENCH PRESS (Flat Bench + Barbell)
    if (id.includes('bench_press') || id === 'bench') {
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full">
          <defs>
            <linearGradient id="chestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#EA580C" />
            </linearGradient>
          </defs>
          {/* Flat Bench */}
          <rect x="50" y="145" width="220" height="12" rx="4" fill="#334155" />
          <rect x="70" y="157" width="14" height="30" fill="#1E293B" />
          <rect x="236" y="157" width="14" height="30" fill="#1E293B" />
          {/* Torso lying flat */}
          <rect x="85" y="127" width="115" height="20" rx="10" fill="#475569" />
          <circle cx="72" cy="135" r="13" fill="#64748B" />
          {/* Bent legs on floor */}
          <path d="M 195 137 L 230 137 L 245 170" fill="none" stroke="#64748B" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
          {/* Active Chest Muscle Glow */}
          <rect x="118" y="123" width="46" height="18" rx="6" fill="url(#chestGrad)" className="animate-pulse" />
          <text x="141" y="136" fill="#0F172A" fontSize="9" fontWeight="900" textAnchor="middle">GÖĞÜS</text>

          {isPeak ? (
            /* Barbell pressed high up */
            <g className="transition-all duration-700 ease-out">
              <path d="M 132 127 L 136 76 M 150 127 L 146 76" stroke="#CBD5E1" strokeWidth="8" strokeLinecap="round" />
              <line x1="85" y1="72" x2="195" y2="72" stroke="#F8FAFC" strokeWidth="6" strokeLinecap="round" />
              <rect x="90" y="58" width="10" height="28" rx="2" fill="#E2E8F0" />
              <rect x="180" y="58" width="10" height="28" rx="2" fill="#E2E8F0" />
              <path d="M 141 104 L 141 84 M 136 89 L 141 84 L 146 89" stroke="#FACC15" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>
          ) : (
            /* Barbell lowered on lower chest */
            <g className="transition-all duration-700 ease-out">
              <path d="M 132 127 L 150 142 L 138 114" stroke="#CBD5E1" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="85" y1="112" x2="195" y2="112" stroke="#F8FAFC" strokeWidth="6" strokeLinecap="round" />
              <rect x="90" y="98" width="10" height="28" rx="2" fill="#E2E8F0" />
              <rect x="180" y="98" width="10" height="28" rx="2" fill="#E2E8F0" />
              <path d="M 141 88 L 141 106 M 136 101 L 141 106 L 146 101" stroke="#38BDF8" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>
          )}
          {/* Angle indicator */}
          <g transform="translate(195, 30)">
            <rect width="112" height="24" rx="12" fill="#0F172A" stroke="#334155" strokeWidth="1" />
            <text x="56" y="16" fill="#FACC15" fontSize="10" fontWeight="bold" textAnchor="middle">
              {isPeak ? 'İTİŞ: Tepe Kilit' : 'İNİŞ: 45° Dirsek Açısı'}
            </text>
          </g>
        </svg>
      );
    }

    // 2. INCLINE DUMBBELL PRESS (Angled 35-45° bench + 2 Dumbbells)
    if (id.includes('incline') || id.includes('ust_gogus')) {
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full">
          <defs>
            <linearGradient id="upperChest" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
          {/* 35° Incline Bench Backrest & Seat */}
          <line x1="75" y1="165" x2="175" y2="85" stroke="#334155" strokeWidth="12" strokeLinecap="round" />
          <line x1="60" y1="170" x2="90" y2="170" stroke="#334155" strokeWidth="10" strokeLinecap="round" />
          <rect x="65" y="170" width="12" height="20" fill="#1E293B" />
          <rect x="145" y="130" width="12" height="60" fill="#1E293B" />

          {/* Lifter sitting inclined */}
          <line x1="85" y1="160" x2="165" y2="95" stroke="#475569" strokeWidth="18" strokeLinecap="round" />
          <circle cx="175" cy="85" r="13" fill="#64748B" />
          {/* Legs planted on ground */}
          <path d="M 85 160 L 95 178 L 135 185" fill="none" stroke="#64748B" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />

          {/* Upper Chest Clavicular Target */}
          <circle cx="150" cy="105" r="10" fill="url(#upperChest)" className="animate-pulse" />
          <text x="150" y="108" fill="#0F172A" fontSize="8" fontWeight="bold" textAnchor="middle">ÜST GÖĞÜS</text>

          {isPeak ? (
            /* Dumbbells pressed up at angle */
            <g className="transition-all duration-700 ease-out">
              <path d="M 145 105 L 180 50" stroke="#CBD5E1" strokeWidth="8" strokeLinecap="round" />
              <circle cx="180" cy="48" r="8" fill="#F8FAFC" />
              <rect x="174" y="38" width="12" height="20" rx="3" fill="#94A3B8" />

              <path d="M 135 115 L 155 45" stroke="#CBD5E1" strokeWidth="7" strokeLinecap="round" strokeDasharray="3 3" opacity="0.6" />
              <circle cx="155" cy="43" r="7" fill="#CBD5E1" opacity="0.6" />
              <path d="M 160 85 L 175 60" stroke="#FACC15" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>
          ) : (
            /* Dumbbells lowered beside shoulders */
            <g className="transition-all duration-700 ease-out">
              <path d="M 145 105 L 140 120 L 158 95" stroke="#CBD5E1" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="158" cy="95" r="8" fill="#F8FAFC" />
              <rect x="152" y="85" width="12" height="20" rx="3" fill="#94A3B8" />
              <path d="M 170 65 L 160 85" stroke="#38BDF8" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>
          )}

          {/* Angle Indicator */}
          <g transform="translate(195, 20)">
            <rect width="115" height="24" rx="12" fill="#0F172A" stroke="#334155" strokeWidth="1" />
            <text x="57" y="16" fill="#FACC15" fontSize="10" fontWeight="bold" textAnchor="middle">
              {isPeak ? 'Tepe: Üst Göğsü Sık' : '35° Eğimli Açı'}
            </text>
          </g>
        </svg>
      );
    }

    // 3. PUSH-UP (Floor Pushup)
    if (id.includes('push_up') || id.includes('sinav')) {
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full">
          <defs>
            <linearGradient id="pushupChest" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>
          {/* Ground */}
          <line x1="20" y1="175" x2="300" y2="175" stroke="#334155" strokeWidth="4" />

          {isPeak ? (
            /* Push-up Peak: Arms extended straight */
            <g className="transition-all duration-700 ease-out">
              <circle cx="85" cy="95" r="13" fill="#64748B" />
              {/* Torso & straight legs in 20° plank */}
              <line x1="90" y1="105" x2="250" y2="165" stroke="#475569" strokeWidth="16" strokeLinecap="round" />
              {/* Arms pushing straight to floor */}
              <line x1="110" y1="115" x2="110" y2="175" stroke="#CBD5E1" strokeWidth="8" strokeLinecap="round" />
              <circle cx="110" cy="175" r="5" fill="#E2E8F0" />
              {/* Feet on toes */}
              <circle cx="250" cy="170" r="6" fill="#CBD5E1" />
              {/* Chest highlight */}
              <rect x="100" y="106" width="35" height="14" rx="4" fill="url(#pushupChest)" className="animate-pulse" />
              <text x="117" y="117" fill="#0F172A" fontSize="8" fontWeight="bold" textAnchor="middle">GÖĞÜS</text>
              {/* Alignment line */}
              <line x1="85" y1="90" x2="255" y2="160" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="3 3" />
            </g>
          ) : (
            /* Push-up Down: Chest 2cm off floor, elbows bent 90° */
            <g className="transition-all duration-700 ease-out">
              <circle cx="85" cy="145" r="13" fill="#64748B" />
              <line x1="90" y1="150" x2="250" y2="168" stroke="#475569" strokeWidth="16" strokeLinecap="round" />
              {/* Bent elbow 90° */}
              <path d="M 110" stroke="#CBD5E1" strokeWidth="8" />
              <path d="M 110 155 L 125 130 L 115 175" fill="none" stroke="#CBD5E1" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="115" cy="175" r="5" fill="#E2E8F0" />
              <circle cx="250" cy="170" r="6" fill="#CBD5E1" />
              <rect x="100" y="148" width="35" height="12" rx="4" fill="url(#pushupChest)" className="animate-pulse" />
              <text x="117" y="157" fill="#0F172A" fontSize="7" fontWeight="bold" textAnchor="middle">GÖĞÜS</text>
            </g>
          )}

          <g transform="translate(195, 25)">
            <rect width="112" height="24" rx="12" fill="#0F172A" stroke="#334155" strokeWidth="1" />
            <text x="56" y="16" fill="#FACC15" fontSize="10" fontWeight="bold" textAnchor="middle">
              {isPeak ? 'Tepe: Kilit & Core Sık' : 'Dip: Göğüs Yere 2cm'}
            </text>
          </g>
        </svg>
      );
    }

    // 4. PULL-UP / CHIN-UP (Bar hanging vs Chin over bar)
    if (id.includes('pull_up') || id.includes('barfiks')) {
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full">
          <defs>
            <linearGradient id="backLat" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
          </defs>
          {/* High Bar */}
          <line x1="50" y1="35" x2="270" y2="35" stroke="#CBD5E1" strokeWidth="7" strokeLinecap="round" />
          <circle cx="95" cy="35" r="5" fill="#94A3B8" />
          <circle cx="225" cy="35" r="5" fill="#94A3B8" />

          {isPeak ? (
            /* Pullup Up: Chin above the bar, lats flared */
            <g className="transition-all duration-700 ease-out">
              <circle cx="160" cy="28" r="13" fill="#64748B" />
              {/* Bent arms gripping bar */}
              <path d="M 115 35 L 140 50 L 152 48 M 205 35 L 180 50 L 168 48" stroke="#CBD5E1" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              {/* V-Taper back glowing */}
              <polygon points="144,48 176,48 167,105 153,105" fill="url(#backLat)" className="animate-pulse" />
              <text x="160" y="75" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">KANAT</text>
              {/* Legs bent slightly back */}
              <path d="M 155 105 L 152 145 L 142 165 M 165 105 L 168 145 L 158 165" stroke="#475569" strokeWidth="7" fill="none" strokeLinecap="round" />
              <path d="M 160 115 L 160 95" stroke="#FACC15" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>
          ) : (
            /* Pullup Hanging: Dead hang with arms straight */
            <g className="transition-all duration-700 ease-out">
              <circle cx="160" cy="72" r="13" fill="#64748B" />
              <line x1="115" y1="35" x2="152" y2="82" stroke="#CBD5E1" strokeWidth="8" strokeLinecap="round" />
              <line x1="205" y1="35" x2="168" y2="82" stroke="#CBD5E1" strokeWidth="8" strokeLinecap="round" />
              <polygon points="144,82 176,82 166,140 154,140" fill="#475569" />
              <text x="160" y="112" fill="#94A3B8" fontSize="8" textAnchor="middle">Tam Esneme</text>
              <path d="M 155 140 L 155 185 M 165 140 L 165 185" stroke="#334155" strokeWidth="7" strokeLinecap="round" />
              <path d="M 160 95 L 160 115" stroke="#38BDF8" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>
          )}

          <g transform="translate(195, 55)">
            <rect width="112" height="24" rx="12" fill="#0F172A" stroke="#334155" strokeWidth="1" />
            <text x="56" y="16" fill="#38BDF8" fontSize="10" fontWeight="bold" textAnchor="middle">
              {isPeak ? 'Çene Barın Üzerinde' : 'Dip: Tam Serbest Bırak'}
            </text>
          </g>
        </svg>
      );
    }

    // 5. LAT PULLDOWN (Machine with Pulley, Thigh Pad, Wide Lat Bar)
    if (id.includes('lat_pulldown') || id.includes('pulldown')) {
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full">
          <defs>
            <linearGradient id="pulldownLat" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
          </defs>
          {/* Machine frame & high pulley */}
          <line x1="160" y1="15" x2="160" y2="40" stroke="#64748B" strokeWidth="4" />
          <circle cx="160" cy="40" r="7" fill="#475569" />
          {/* Machine seat & thigh pads */}
          <rect x="135" y="145" width="50" height="10" rx="3" fill="#334155" />
          <rect x="155" y="155" width="10" height="35" fill="#1E293B" />
          <rect x="168" y="130" width="22" height="8" rx="3" fill="#E2E8F0" /> {/* Thigh pad */}

          {/* Seated lifter leaning back 10 degrees */}
          <circle cx="150" cy="95" r="12" fill="#64748B" />
          <line x1="150" y1="107" x2="155" y2="148" stroke="#475569" strokeWidth="16" strokeLinecap="round" />
          {/* Legs locked under thigh pad */}
          <path d="M 155 145 L 180 135 L 185 185" fill="none" stroke="#64748B" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />

          {/* Lats glow */}
          <polygon points="142,110 168,110 162,145 148,145" fill="url(#pulldownLat)" className="animate-pulse" />
          <text x="155" y="130" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle">KANAT</text>

          {isPeak ? (
            /* Bar pulled down to upper chest */
            <g className="transition-all duration-700 ease-out">
              <line x1="160" y1="40" x2="155" y2="100" stroke="#94A3B8" strokeWidth="2" strokeDasharray="3 2" />
              {/* Wide bent bar */}
              <path d="M 90 92 Q 155 102 220 92" stroke="#F8FAFC" strokeWidth="6" fill="none" strokeLinecap="round" />
              {/* Arms pulling bar down */}
              <path d="M 105 94 L 135 110 M 205 94 L 170 110" stroke="#CBD5E1" strokeWidth="8" strokeLinecap="round" />
              <path d="M 155 75 L 155 95" stroke="#FACC15" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>
          ) : (
            /* Bar up near pulley with arms stretched */
            <g className="transition-all duration-700 ease-out">
              <line x1="160" y1="40" x2="158" y2="60" stroke="#94A3B8" strokeWidth="2" strokeDasharray="3 2" />
              <path d="M 90 52 Q 158 60 220 52" stroke="#F8FAFC" strokeWidth="6" fill="none" strokeLinecap="round" />
              <line x1="105" y1="54" x2="145" y2="98" stroke="#CBD5E1" strokeWidth="8" strokeLinecap="round" />
              <line x1="205" y1="54" x2="165" y2="98" stroke="#CBD5E1" strokeWidth="8" strokeLinecap="round" />
              <path d="M 158 85 L 158 65" stroke="#38BDF8" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>
          )}

          <g transform="translate(195, 20)">
            <rect width="112" height="24" rx="12" fill="#0F172A" stroke="#334155" strokeWidth="1" />
            <text x="56" y="16" fill="#38BDF8" fontSize="10" fontWeight="bold" textAnchor="middle">
              {isPeak ? 'Çekiş: Göğse Temas' : 'Esneme: Bırak'}
            </text>
          </g>
        </svg>
      );
    }

    // 6. BARBELL ROW (Bent-over 45° Torso + Barbell pulled to Navel)
    if (id.includes('barbell_row') || id.includes('row')) {
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full">
          <defs>
            <linearGradient id="rowBack" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0369A1" />
            </linearGradient>
          </defs>
          {/* Ground */}
          <line x1="30" y1="185" x2="290" y2="185" stroke="#334155" strokeWidth="4" />

          {/* Lifter bent over 45 degrees */}
          <circle cx="110" cy="80" r="13" fill="#64748B" />
          {/* Torso line 45° angle */}
          <line x1="115" y1="90" x2="175" y2="125" stroke="#475569" strokeWidth="18" strokeLinecap="round" />
          {/* Legs with bent knees */}
          <path d="M 175 125 L 190 150 L 175 185 M 185 125 L 200 150 L 190 185" fill="none" stroke="#64748B" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />

          {/* Upper back / Rhomboids Glow */}
          <polygon points="120,95 155,115 145,130 115,110" fill="url(#rowBack)" className="animate-pulse" />
          <text x="135" y="112" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle">SIRT</text>

          {isPeak ? (
            /* Barbell pulled up into belly button */
            <g className="transition-all duration-700 ease-out">
              {/* Elbows driven back behind torso */}
              <path d="M 130 98 L 155 85 L 140 120" fill="none" stroke="#CBD5E1" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              {/* Barbell right under belly */}
              <line x1="80" y1="120" x2="195" y2="120" stroke="#F8FAFC" strokeWidth="6" strokeLinecap="round" />
              <rect x="85" y="105" width="10" height="30" rx="2" fill="#E2E8F0" />
              <rect x="180" y="105" width="10" height="30" rx="2" fill="#E2E8F0" />
              <path d="M 135 145 L 135 125" stroke="#FACC15" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>
          ) : (
            /* Barbell hanging straight down under knees */
            <g className="transition-all duration-700 ease-out">
              <line x1="130" y1="98" x2="135" y2="160" stroke="#CBD5E1" strokeWidth="8" strokeLinecap="round" />
              <line x1="80" y1="160" x2="195" y2="160" stroke="#F8FAFC" strokeWidth="6" strokeLinecap="round" />
              <rect x="85" y="145" width="10" height="30" rx="2" fill="#E2E8F0" />
              <rect x="180" y="145" width="10" height="30" rx="2" fill="#E2E8F0" />
              <path d="M 135 130 L 135 150" stroke="#38BDF8" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>
          )}

          <g transform="translate(195, 25)">
            <rect width="115" height="24" rx="12" fill="#0F172A" stroke="#334155" strokeWidth="1" />
            <text x="57" y="16" fill="#38BDF8" fontSize="10" fontWeight="bold" textAnchor="middle">
              {isPeak ? 'Göbeğe Çek & Sık' : '45° Düz Omurga'}
            </text>
          </g>
        </svg>
      );
    }

    // 7. SQUAT (Barbell on Back, Standing vs Parallel 90° Squat)
    if (id.includes('squat') || id.includes('comelme')) {
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full">
          <defs>
            <linearGradient id="squatQuad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#EAB308" />
            </linearGradient>
          </defs>
          <line x1="30" y1="185" x2="290" y2="185" stroke="#334155" strokeWidth="4" />

          {isPeak ? (
            /* Standing tall with barbell on traps */
            <g className="transition-all duration-700 ease-out">
              <circle cx="160" cy="40" r="13" fill="#64748B" />
              <line x1="160" y1="53" x2="160" y2="115" stroke="#475569" strokeWidth="18" strokeLinecap="round" />
              {/* Barbell on upper traps */}
              <line x1="95" y1="56" x2="225" y2="56" stroke="#F8FAFC" strokeWidth="7" strokeLinecap="round" />
              <rect x="100" y="42" width="14" height="28" rx="2" fill="#E2E8F0" />
              <rect x="206" y="42" width="14" height="28" rx="2" fill="#E2E8F0" />
              {/* Arms holding bar */}
              <path d="M 125 56 L 145 70 M 195 56 L 175 70" stroke="#CBD5E1" strokeWidth="6" strokeLinecap="round" />
              {/* Legs straight */}
              <line x1="153" y1="115" x2="148" y2="185" stroke="#CBD5E1" strokeWidth="11" strokeLinecap="round" />
              <line x1="167" y1="115" x2="172" y2="185" stroke="#CBD5E1" strokeWidth="11" strokeLinecap="round" />
              {/* Quad glow */}
              <rect x="144" y="125" width="32" height="30" rx="6" fill="url(#squatQuad)" className="animate-pulse" />
              <text x="160" y="142" fill="#0F172A" fontSize="8" fontWeight="bold" textAnchor="middle">ÖN BACAK</text>
            </g>
          ) : (
            /* Deep Squat 90 degrees parallel */
            <g className="transition-all duration-700 ease-out">
              <circle cx="140" cy="95" r="13" fill="#64748B" />
              <line x1="140" y1="108" x2="125" y2="145" stroke="#475569" strokeWidth="18" strokeLinecap="round" />
              {/* Barbell lowered */}
              <line x1="75" y1="110" x2="205" y2="110" stroke="#F8FAFC" strokeWidth="7" strokeLinecap="round" />
              <rect x="80" y="96" width="14" height="28" rx="2" fill="#E2E8F0" />
              <rect x="186" y="96" width="14" height="28" rx="2" fill="#E2E8F0" />
              {/* 90 degree thigh parallel */}
              <path d="M 125 145 L 175 145 L 170 185" fill="none" stroke="#CBD5E1" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="120" y="137" width="46" height="18" rx="6" fill="url(#squatQuad)" className="animate-pulse" />
              <text x="143" y="150" fill="#0F172A" fontSize="8" fontWeight="bold" textAnchor="middle">90° DERİNLİK</text>
            </g>
          )}

          <g transform="translate(195, 20)">
            <rect width="112" height="24" rx="12" fill="#0F172A" stroke="#334155" strokeWidth="1" />
            <text x="56" y="16" fill="#FACC15" fontSize="10" fontWeight="bold" textAnchor="middle">
              {isPeak ? 'Kalkış & Kalça Sık' : 'Tam Paralel Çizgi'}
            </text>
          </g>
        </svg>
      );
    }

    // 8. LEG PRESS (45° Sled Machine, Reclined Seat, Pushing Sled with Feet)
    if (id.includes('leg_press') || id.includes('bacak_pres')) {
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full">
          <defs>
            <linearGradient id="legpressGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#F97316" />
            </linearGradient>
          </defs>
          {/* 45-degree Machine Rails */}
          <line x1="80" y1="180" x2="260" y2="35" stroke="#334155" strokeWidth="10" strokeLinecap="round" />
          <line x1="100" y1="185" x2="280" y2="40" stroke="#334155" strokeWidth="10" strokeLinecap="round" />

          {/* Reclined seat at the bottom */}
          <line x1="70" y1="150" x2="50" y2="100" stroke="#475569" strokeWidth="14" strokeLinecap="round" /> {/* Backrest */}
          <line x1="70" y1="150" x2="110" y2="155" stroke="#475569" strokeWidth="12" strokeLinecap="round" /> {/* Seat bottom */}
          <circle cx="55" cy="85" r="12" fill="#64748B" />

          {isPeak ? (
            /* Legs Extended Pressing Sled Up (no knee hyperextension) */
            <g className="transition-all duration-700 ease-out">
              {/* Legs extended along rails */}
              <line x1="105" y1="150" x2="215" y2="65" stroke="#CBD5E1" strokeWidth="11" strokeLinecap="round" />
              {/* Sled Platform on Rails with weight plates */}
              <line x1="205" y1="75" x2="230" y2="50" stroke="#E2E8F0" strokeWidth="12" strokeLinecap="round" />
              <circle cx="235" cy="55" r="14" fill="#64748B" />
              <circle cx="240" cy="50" r="10" fill="#94A3B8" />

              <rect x="145" y="90" width="38" height="20" rx="5" fill="url(#legpressGlow)" className="animate-pulse" />
              <text x="164" y="103" fill="#0F172A" fontSize="8" fontWeight="bold" textAnchor="middle">QUADRICEPS</text>
              <path d="M 170 120 L 195 95" stroke="#FACC15" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>
          ) : (
            /* Knees Bent 90° Close to Chest */
            <g className="transition-all duration-700 ease-out">
              {/* Knee bent back */}
              <path d="M 105 150 L 115 105 L 165 110" fill="none" stroke="#CBD5E1" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
              {/* Sled Platform down */}
              <line x1="155" y1="120" x2="180" y2="95" stroke="#E2E8F0" strokeWidth="12" strokeLinecap="round" />
              <circle cx="185" cy="100" r="14" fill="#64748B" />
              <circle cx="190" cy="95" r="10" fill="#94A3B8" />

              <rect x="110" y="95" width="35" height="18" rx="5" fill="url(#legpressGlow)" className="animate-pulse" />
              <text x="127" y="107" fill="#0F172A" fontSize="7" fontWeight="bold" textAnchor="middle">90° ESNET</text>
              <path d="M 180 80 L 160 100" stroke="#38BDF8" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>
          )}

          <g transform="translate(195, 10)">
            <rect width="112" height="24" rx="12" fill="#0F172A" stroke="#334155" strokeWidth="1" />
            <text x="56" y="16" fill="#FACC15" fontSize="10" fontWeight="bold" textAnchor="middle">
              {isPeak ? 'Dizleri Kitleme!' : '45° Sled Açısı'}
            </text>
          </g>
        </svg>
      );
    }

    // 9. DEADLIFT (Floor setup with big bumper plates vs Standing Lockout)
    if (id.includes('deadlift')) {
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full">
          <defs>
            <linearGradient id="deadliftGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#EA580C" />
            </linearGradient>
          </defs>
          <line x1="30" y1="185" x2="290" y2="185" stroke="#334155" strokeWidth="4" />

          {isPeak ? (
            /* Lockout: Standing tall, hips pushed through, bar at mid-thigh */
            <g className="transition-all duration-700 ease-out">
              <circle cx="160" cy="45" r="13" fill="#64748B" />
              <line x1="160" y1="58" x2="160" y2="120" stroke="#475569" strokeWidth="18" strokeLinecap="round" />
              {/* Legs locked straight */}
              <line x1="153" y1="120" x2="150" y2="185" stroke="#CBD5E1" strokeWidth="11" strokeLinecap="round" />
              <line x1="167" y1="120" x2="170" y2="185" stroke="#CBD5E1" strokeWidth="11" strokeLinecap="round" />
              {/* Arms hanging holding barbell at hips */}
              <line x1="150" y1="65" x2="145" y2="125" stroke="#CBD5E1" strokeWidth="8" strokeLinecap="round" />
              <line x1="170" y1="65" x2="175" y2="125" stroke="#CBD5E1" strokeWidth="8" strokeLinecap="round" />
              {/* Barbell with large 45cm bumper plates */}
              <line x1="90" y1="125" x2="230" y2="125" stroke="#F8FAFC" strokeWidth="7" strokeLinecap="round" />
              <circle cx="95" cy="125" r="22" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="3" />
              <circle cx="225" cy="125" r="22" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="3" />
              {/* Glute & Hamstring & Lower Back Glow */}
              <rect x="142" y="105" width="36" height="25" rx="6" fill="url(#deadliftGlow)" className="animate-pulse" />
              <text x="160" y="120" fill="#0F172A" fontSize="8" fontWeight="bold" textAnchor="middle">POSTERIOR</text>
            </g>
          ) : (
            /* Setup on Floor: Hips hinge back, straight neutral spine */
            <g className="transition-all duration-700 ease-out">
              <circle cx="120" cy="95" r="13" fill="#64748B" />
              {/* Spine angled 40 degrees, flat like table */}
              <line x1="125" y1="105" x2="180" y2="135" stroke="#475569" strokeWidth="18" strokeLinecap="round" />
              {/* Legs bent in deadlift hinge */}
              <path d="M 180 135 L 185 160 L 175 185" fill="none" stroke="#CBD5E1" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
              {/* Arms straight down gripping barbell */}
              <line x1="135" y1="110" x2="145" y2="162" stroke="#CBD5E1" strokeWidth="8" strokeLinecap="round" />
              {/* Barbell resting near floor */}
              <line x1="90" y1="162" x2="230" y2="162" stroke="#F8FAFC" strokeWidth="7" strokeLinecap="round" />
              <circle cx="95" cy="162" r="22" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="3" />
              <circle cx="225" cy="162" r="22" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="3" />
              {/* Neutral spine guide */}
              <line x1="105" y1="85" x2="195" y2="135" stroke="#38BDF8" strokeWidth="2" strokeDasharray="4 3" />
            </g>
          )}

          <g transform="translate(195, 20)">
            <rect width="112" height="24" rx="12" fill="#0F172A" stroke="#334155" strokeWidth="1" />
            <text x="56" y="16" fill="#FACC15" fontSize="10" fontWeight="bold" textAnchor="middle">
              {isPeak ? 'Kalçayı Sık & Kitle' : 'Düz Bel • Omurga Düz'}
            </text>
          </g>
        </svg>
      );
    }

    // 10. WALKING LUNGE (Split Stance, 90° Front Knee & 90° Back Knee + Dumbbells)
    if (id.includes('lunge')) {
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full">
          <defs>
            <linearGradient id="lungeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#F97316" />
            </linearGradient>
          </defs>
          <line x1="30" y1="185" x2="290" y2="185" stroke="#334155" strokeWidth="4" />

          {isPeak ? (
            /* Deep Lunge 90° Front & Back */
            <g className="transition-all duration-700 ease-out">
              <circle cx="150" cy="70" r="13" fill="#64748B" />
              {/* Torso upright 90° to floor */}
              <line x1="150" y1="83" x2="150" y2="140" stroke="#475569" strokeWidth="16" strokeLinecap="round" />
              {/* Front leg bent 90 degrees */}
              <path d="M 150 140 L 195 140 L 195 185" fill="none" stroke="#CBD5E1" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
              {/* Back leg knee 2cm off floor */}
              <path d="M 150 140 L 115 160 L 115 180" fill="none" stroke="#94A3B8" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
              {/* Dumbbell in hand at side */}
              <line x1="150" y1="95" x2="150" y2="135" stroke="#CBD5E1" strokeWidth="7" strokeLinecap="round" />
              <rect x="144" y="130" width="12" height="18" rx="3" fill="#E2E8F0" />

              <rect x="160" y="132" width="30" height="16" rx="4" fill="url(#lungeGlow)" className="animate-pulse" />
              <text x="175" y="143" fill="#0F172A" fontSize="7" fontWeight="bold" textAnchor="middle">90° DİZ</text>
            </g>
          ) : (
            /* Standing Step Up */
            <g className="transition-all duration-700 ease-out">
              <circle cx="150" cy="45" r="13" fill="#64748B" />
              <line x1="150" y1="58" x2="150" y2="120" stroke="#475569" strokeWidth="16" strokeLinecap="round" />
              <line x1="145" y1="120" x2="140" y2="185" stroke="#CBD5E1" strokeWidth="10" strokeLinecap="round" />
              <line x1="155" y1="120" x2="165" y2="185" stroke="#CBD5E1" strokeWidth="10" strokeLinecap="round" />
              <line x1="150" y1="70" x2="150" y2="115" stroke="#CBD5E1" strokeWidth="7" strokeLinecap="round" />
              <rect x="144" y="110" width="12" height="18" rx="3" fill="#E2E8F0" />
            </g>
          )}

          <g transform="translate(195, 20)">
            <rect width="112" height="24" rx="12" fill="#0F172A" stroke="#334155" strokeWidth="1" />
            <text x="56" y="16" fill="#FACC15" fontSize="10" fontWeight="bold" textAnchor="middle">
              {isPeak ? '90° Açıda Durakla' : 'Dik Gövde • Adım'}
            </text>
          </g>
        </svg>
      );
    }

    // 11. OVERHEAD PRESS (Standing Military Barbell Press directly above head)
    if (id.includes('overhead') || id.includes('military')) {
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full">
          <defs>
            <linearGradient id="ohpGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
          <line x1="30" y1="185" x2="290" y2="185" stroke="#334155" strokeWidth="4" />
          <circle cx="160" cy="55" r="13" fill="#64748B" />
          <line x1="160" y1="68" x2="160" y2="125" stroke="#475569" strokeWidth="18" strokeLinecap="round" />
          <line x1="153" y1="125" x2="150" y2="185" stroke="#CBD5E1" strokeWidth="10" strokeLinecap="round" />
          <line x1="167" y1="125" x2="170" y2="185" stroke="#CBD5E1" strokeWidth="10" strokeLinecap="round" />

          {/* Deltoids Glow */}
          <circle cx="140" cy="72" r="9" fill="url(#ohpGlow)" className="animate-pulse" />
          <circle cx="180" cy="72" r="9" fill="url(#ohpGlow)" className="animate-pulse" />

          {isPeak ? (
            /* Barbell locked out overhead above head */
            <g className="transition-all duration-700 ease-out">
              <line x1="140" y1="72" x2="135" y2="28" stroke="#CBD5E1" strokeWidth="8" strokeLinecap="round" />
              <line x1="180" y1="72" x2="185" y2="28" stroke="#CBD5E1" strokeWidth="8" strokeLinecap="round" />
              <line x1="90" y1="25" x2="230" y2="25" stroke="#F8FAFC" strokeWidth="6" strokeLinecap="round" />
              <rect x="95" y="13" width="10" height="24" rx="2" fill="#E2E8F0" />
              <rect x="215" y="13" width="10" height="24" rx="2" fill="#E2E8F0" />
              <path d="M 160 55 L 160 35" stroke="#FACC15" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>
          ) : (
            /* Barbell resting on collarbones */
            <g className="transition-all duration-700 ease-out">
              <path d="M 140 72 L 130 90 L 140 70 M 180 72 L 190 90 L 180 70" stroke="#CBD5E1" strokeWidth="8" fill="none" strokeLinecap="round" />
              <line x1="90" y1="72" x2="230" y2="72" stroke="#F8FAFC" strokeWidth="6" strokeLinecap="round" />
              <rect x="95" y="60" width="10" height="24" rx="2" fill="#E2E8F0" />
              <rect x="215" y="60" width="10" height="24" rx="2" fill="#E2E8F0" />
              <path d="M 160 40 L 160 60" stroke="#38BDF8" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>
          )}

          <g transform="translate(195, 30)">
            <rect width="112" height="24" rx="12" fill="#0F172A" stroke="#334155" strokeWidth="1" />
            <text x="56" y="16" fill="#FACC15" fontSize="10" fontWeight="bold" textAnchor="middle">
              {isPeak ? 'Tepe: Başın Üzerinde' : 'Köprücük Kemik Hizası'}
            </text>
          </g>
        </svg>
      );
    }

    // 12. LATERAL RAISE (Standing Dumbbell Side Wingspan Arc to Shoulder Height)
    if (id.includes('lateral_raise') || id.includes('yana_acis')) {
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full">
          <defs>
            <linearGradient id="sideDelt" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
          <line x1="30" y1="185" x2="290" y2="185" stroke="#334155" strokeWidth="4" />
          <circle cx="160" cy="50" r="13" fill="#64748B" />
          <line x1="160" y1="63" x2="160" y2="125" stroke="#475569" strokeWidth="18" strokeLinecap="round" />
          <line x1="153" y1="125" x2="148" y2="185" stroke="#CBD5E1" strokeWidth="10" strokeLinecap="round" />
          <line x1="167" y1="125" x2="172" y2="185" stroke="#CBD5E1" strokeWidth="10" strokeLinecap="round" />

          {/* Side Delts Glow */}
          <circle cx="142" cy="68" r="9" fill="url(#sideDelt)" className="animate-pulse" />
          <circle cx="178" cy="68" r="9" fill="url(#sideDelt)" className="animate-pulse" />

          {isPeak ? (
            /* Dumbbells raised horizontally at 90° "T" wingspan */
            <g className="transition-all duration-700 ease-out">
              {/* Left arm extended sideways */}
              <line x1="142" y1="68" x2="80" y2="72" stroke="#CBD5E1" strokeWidth="8" strokeLinecap="round" />
              <circle cx="75" cy="72" r="7" fill="#F8FAFC" />
              <rect x="71" y="62" width="8" height="20" rx="2" fill="#94A3B8" />
              {/* Right arm extended sideways */}
              <line x1="178" y1="68" x2="240" y2="72" stroke="#CBD5E1" strokeWidth="8" strokeLinecap="round" />
              <circle cx="245" cy="72" r="7" fill="#F8FAFC" />
              <rect x="241" y="62" width="8" height="20" rx="2" fill="#94A3B8" />
              {/* Motion Arc Lines */}
              <path d="M 120 115 Q 95 100 80 80" stroke="#FACC15" strokeWidth="2.5" fill="none" strokeDasharray="3 3" />
              <path d="M 200 115 Q 225 100 240 80" stroke="#FACC15" strokeWidth="2.5" fill="none" strokeDasharray="3 3" />
            </g>
          ) : (
            /* Dumbbells resting at thighs */
            <g className="transition-all duration-700 ease-out">
              <line x1="142" y1="68" x2="135" y2="120" stroke="#CBD5E1" strokeWidth="8" strokeLinecap="round" />
              <circle cx="135" cy="122" r="7" fill="#CBD5E1" />
              <line x1="178" y1="68" x2="185" y2="120" stroke="#CBD5E1" strokeWidth="8" strokeLinecap="round" />
              <circle cx="185" cy="122" r="7" fill="#CBD5E1" />
            </g>
          )}

          <g transform="translate(195, 20)">
            <rect width="112" height="24" rx="12" fill="#0F172A" stroke="#334155" strokeWidth="1" />
            <text x="56" y="16" fill="#FACC15" fontSize="10" fontWeight="bold" textAnchor="middle">
              {isPeak ? 'Omuz Hizası 90° Yay' : 'Dirsekleri Kırma'}
            </text>
          </g>
        </svg>
      );
    }

    // 13. BARBELL BICEPS CURL (Arm Curl Arc, Pinned Elbows, Biceps Peak)
    if (id.includes('biceps') || id.includes('curl') || id.includes('on_kol')) {
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full">
          <defs>
            <linearGradient id="bicepsGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>
          <line x1="30" y1="185" x2="290" y2="185" stroke="#334155" strokeWidth="4" />
          <circle cx="160" cy="45" r="13" fill="#64748B" />
          <line x1="160" y1="58" x2="160" y2="125" stroke="#475569" strokeWidth="18" strokeLinecap="round" />
          <line x1="153" y1="125" x2="148" y2="185" stroke="#CBD5E1" strokeWidth="10" strokeLinecap="round" />
          <line x1="167" y1="125" x2="172" y2="185" stroke="#CBD5E1" strokeWidth="10" strokeLinecap="round" />

          {/* Upper arm pinned to ribs */}
          <line x1="145" y1="65" x2="145" y2="100" stroke="#CBD5E1" strokeWidth="10" strokeLinecap="round" />

          {isPeak ? (
            /* Forearms curled up, barbell at chest level, peak biceps bulge */
            <g className="transition-all duration-700 ease-out">
              {/* Forearm curled up */}
              <line x1="145" y1="100" x2="135" y2="70" stroke="#CBD5E1" strokeWidth="9" strokeLinecap="round" />
              {/* Biceps muscle bulge glow */}
              <circle cx="140" cy="80" r="11" fill="url(#bicepsGlow)" className="animate-pulse" />
              <text x="140" y="83" fill="#0F172A" fontSize="7" fontWeight="bold" textAnchor="middle">PAZU</text>
              {/* Barbell curled up */}
              <line x1="105" y1="68" x2="170" y2="68" stroke="#F8FAFC" strokeWidth="6" strokeLinecap="round" />
              <circle cx="105" cy="68" r="8" fill="#E2E8F0" />
              <circle cx="170" cy="68" r="8" fill="#E2E8F0" />
              {/* Curl Arc */}
              <path d="M 135 130 Q 115 105 130 75" stroke="#FACC15" strokeWidth="2.5" fill="none" strokeDasharray="3 3" />
            </g>
          ) : (
            /* Barbell lowered fully down with tension */
            <g className="transition-all duration-700 ease-out">
              <line x1="145" y1="100" x2="145" y2="145" stroke="#CBD5E1" strokeWidth="9" strokeLinecap="round" />
              <line x1="105" y1="148" x2="170" y2="148" stroke="#F8FAFC" strokeWidth="6" strokeLinecap="round" />
              <circle cx="105" cy="148" r="8" fill="#E2E8F0" />
              <circle cx="170" cy="148" r="8" fill="#E2E8F0" />
            </g>
          )}

          <g transform="translate(195, 20)">
            <rect width="112" height="24" rx="12" fill="#0F172A" stroke="#334155" strokeWidth="1" />
            <text x="56" y="16" fill="#FACC15" fontSize="10" fontWeight="bold" textAnchor="middle">
              {isPeak ? 'Zirve: Biceps’i Sık' : 'Dirsekleri Sabitle'}
            </text>
          </g>
        </svg>
      );
    }

    // 14. TRICEPS ROPE PUSHDOWN (High Cable Pulley + Rope Extension Downward & Spread)
    if (id.includes('triceps') || id.includes('pushdown') || id.includes('arka_kol')) {
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full">
          <defs>
            <linearGradient id="tricepsGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#FB923C" />
            </linearGradient>
          </defs>
          {/* Cable pulley top */}
          <line x1="190" y1="15" x2="190" y2="35" stroke="#64748B" strokeWidth="4" />
          <circle cx="190" cy="35" r="7" fill="#475569" />

          {/* Standing Lifter */}
          <line x1="30" y1="185" x2="290" y2="185" stroke="#334155" strokeWidth="4" />
          <circle cx="130" cy="60" r="13" fill="#64748B" />
          <line x1="130" y1="73" x2="135" y2="130" stroke="#475569" strokeWidth="18" strokeLinecap="round" />
          <line x1="135" y1="130" x2="130" y2="185" stroke="#CBD5E1" strokeWidth="10" strokeLinecap="round" />

          {/* Upper arm pinned strictly vertically */}
          <line x1="135" y1="80" x2="145" y2="115" stroke="#CBD5E1" strokeWidth="10" strokeLinecap="round" />
          {/* Triceps muscle glow */}
          <polygon points="128,82 138,82 143,108 133,108" fill="url(#tricepsGlow)" className="animate-pulse" />
          <text x="135" y="97" fill="#0F172A" fontSize="7" fontWeight="bold" textAnchor="middle">TRICEPS</text>

          {isPeak ? (
            /* Forearms locked down and rope ends spread apart */
            <g className="transition-all duration-700 ease-out">
              {/* Cable line down */}
              <line x1="190" y1="35" x2="160" y2="115" stroke="#94A3B8" strokeWidth="2" strokeDasharray="3 2" />
              {/* Forearm straight down */}
              <line x1="145" y1="115" x2="155" y2="165" stroke="#CBD5E1" strokeWidth="9" strokeLinecap="round" />
              {/* Rope attachment split */}
              <path d="M 155 160 L 145 175 M 155 160 L 168 175" stroke="#FACC15" strokeWidth="5" strokeLinecap="round" />
              <circle cx="145" cy="175" r="4" fill="#E2E8F0" />
              <circle cx="168" cy="175" r="4" fill="#E2E8F0" />
              <path d="M 160 135 L 160 155" stroke="#FACC15" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>
          ) : (
            /* Forearm bent 90° at elbow level */
            <g className="transition-all duration-700 ease-out">
              <line x1="190" y1="35" x2="175" y2="115" stroke="#94A3B8" strokeWidth="2" strokeDasharray="3 2" />
              <line x1="145" y1="115" x2="175" y2="115" stroke="#CBD5E1" strokeWidth="9" strokeLinecap="round" />
              <path d="M 175 115 L 175 125" stroke="#FACC15" strokeWidth="5" strokeLinecap="round" />
            </g>
          )}

          <g transform="translate(195, 20)">
            <rect width="112" height="24" rx="12" fill="#0F172A" stroke="#334155" strokeWidth="1" />
            <text x="56" y="16" fill="#FACC15" fontSize="10" fontWeight="bold" textAnchor="middle">
              {isPeak ? 'Dipte Halatı İki Yana Aç' : 'Dirsekleri Yanlara Sabitle'}
            </text>
          </g>
        </svg>
      );
    }

    // 15. DIPS (Parallel Dip Bars, Suspended Bodyweight)
    if (id.includes('dips')) {
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full">
          <defs>
            <linearGradient id="dipsGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#EA580C" />
            </linearGradient>
          </defs>
          {/* Parallel Dip Bars */}
          <line x1="80" y1="105" x2="240" y2="105" stroke="#CBD5E1" strokeWidth="8" strokeLinecap="round" />
          <line x1="100" y1="105" x2="100" y2="185" stroke="#475569" strokeWidth="8" />
          <line x1="220" y1="105" x2="220" y2="185" stroke="#475569" strokeWidth="8" />

          {isPeak ? (
            /* Dips Up: Arms locked straight, body suspended high */
            <g className="transition-all duration-700 ease-out">
              <circle cx="160" cy="40" r="13" fill="#64748B" />
              <line x1="160" y1="53" x2="155" y2="110" stroke="#475569" strokeWidth="16" strokeLinecap="round" />
              {/* Arms pushing straight on bars */}
              <line x1="150" y1="65" x2="135" y2="105" stroke="#CBD5E1" strokeWidth="9" strokeLinecap="round" />
              <line x1="170" y1="65" x2="185" y2="105" stroke="#CBD5E1" strokeWidth="9" strokeLinecap="round" />
              {/* Triceps & Chest Glow */}
              <rect x="145" y="60" width="30" height="15" rx="4" fill="url(#dipsGlow)" className="animate-pulse" />
              <text x="160" y="71" fill="#0F172A" fontSize="7" fontWeight="bold" textAnchor="middle">GÖĞÜS & KOL</text>
              {/* Legs bent at knees crossed */}
              <path d="M 155 110 L 150 145 L 140 160 M 158 110 L 153 145 L 143 160" stroke="#64748B" strokeWidth="8" fill="none" strokeLinecap="round" />
            </g>
          ) : (
            /* Dips Down: Elbows bent 90°, chest lowered */
            <g className="transition-all duration-700 ease-out">
              <circle cx="160" cy="75" r="13" fill="#64748B" />
              <line x1="160" y1="88" x2="155" y2="140" stroke="#475569" strokeWidth="16" strokeLinecap="round" />
              {/* Bent elbows 90 degrees */}
              <path d="M 150 95 L 130 75 L 135 105 M 170 95 L 190 75 L 185 105" stroke="#CBD5E1" strokeWidth="9" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              {/* Legs hanging lower */}
              <path d="M 155 140 L 150 170 M 158 140 L 153 170" stroke="#64748B" strokeWidth="8" strokeLinecap="round" />
            </g>
          )}

          <g transform="translate(195, 20)">
            <rect width="112" height="24" rx="12" fill="#0F172A" stroke="#334155" strokeWidth="1" />
            <text x="56" y="16" fill="#FACC15" fontSize="10" fontWeight="bold" textAnchor="middle">
              {isPeak ? 'Tepe: Kilit & Göğsü Sık' : 'Dip: 90° Dirsek Açısı'}
            </text>
          </g>
        </svg>
      );
    }

    // 16. PLANK (Horizontal Forearm Floor Plank, Straight Spine Alignment)
    if (id.includes('plank')) {
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full">
          <defs>
            <linearGradient id="plankGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>
          <line x1="30" y1="170" x2="290" y2="170" stroke="#334155" strokeWidth="4" />

          {/* Forearms on ground */}
          <circle cx="75" cy="115" r="13" fill="#64748B" />
          <path d="M 85 125 L 90 170 L 115 170" fill="none" stroke="#CBD5E1" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
          {/* Rigid plank body */}
          <line x1="85" y1="125" x2="225" y2="148" stroke="#475569" strokeWidth="18" strokeLinecap="round" />
          <line x1="225" y1="148" x2="260" y2="170" stroke="#64748B" strokeWidth="10" strokeLinecap="round" />
          <circle cx="260" cy="170" r="5" fill="#E2E8F0" />

          {/* Glowing Abdominals */}
          <rect x="120" y="130" width="70" height="18" rx="6" fill="url(#plankGlow)" className="animate-pulse" />
          <text x="155" y="143" fill="#0F172A" fontSize="9" fontWeight="900" textAnchor="middle">ÇELİK CORE</text>

          {/* Straight Alignment laser cue */}
          <line x1="75" y1="108" x2="260" y2="162" stroke="#38BDF8" strokeWidth="2" strokeDasharray="5 4" />

          <g transform="translate(195, 25)">
            <rect width="112" height="24" rx="12" fill="#0F172A" stroke="#334155" strokeWidth="1" />
            <text x="56" y="16" fill="#FACC15" fontSize="10" fontWeight="bold" textAnchor="middle">
              {isPeak ? 'Karın & Kalça Taş Gibi' : 'Beli Aşağı Sarkıtma'}
            </text>
          </g>
        </svg>
      );
    }

    // 17. CRUNCH (Floor Mat, Knees Bent 90°, Curling Upper Ribcage up)
    if (id.includes('crunch') || id.includes('mekik')) {
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full">
          <defs>
            <linearGradient id="crunchGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>
          <line x1="30" y1="175" x2="290" y2="175" stroke="#334155" strokeWidth="4" />

          {/* Lower body with knees bent 90° */}
          <path d="M 140 165 L 180 120 L 220 175" fill="none" stroke="#64748B" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />

          {isPeak ? (
            /* Curled Up: Shoulder blades off ground, intense abs crunch */
            <g className="transition-all duration-700 ease-out">
              <circle cx="85" cy="115" r="13" fill="#64748B" />
              {/* Torso curled up in arc */}
              <path d="M 85 125 Q 110 135 140 165" fill="none" stroke="#475569" strokeWidth="18" strokeLinecap="round" />
              {/* Hands behind ears */}
              <path d="M 85 115 L 70 125 L 80 135" fill="none" stroke="#CBD5E1" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              {/* Burning 6-pack glow */}
              <rect x="98" y="125" width="38" height="22" rx="5" fill="url(#crunchGlow)" className="animate-pulse" />
              <text x="117" y="139" fill="#0F172A" fontSize="8" fontWeight="bold" textAnchor="middle">SIKIŞTIR</text>
              <path d="M 90 145 L 105 130" stroke="#FACC15" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>
          ) : (
            /* Flat on back */
            <g className="transition-all duration-700 ease-out">
              <circle cx="65" cy="155" r="13" fill="#64748B" />
              <line x1="75" y1="165" x2="140" y2="165" stroke="#475569" strokeWidth="18" strokeLinecap="round" />
              <path d="M 65 155 L 55 160 L 65 165" fill="none" stroke="#CBD5E1" strokeWidth="6" strokeLinecap="round" />
            </g>
          )}

          <g transform="translate(195, 20)">
            <rect width="112" height="24" rx="12" fill="#0F172A" stroke="#334155" strokeWidth="1" />
            <text x="56" y="16" fill="#FACC15" fontSize="10" fontWeight="bold" textAnchor="middle">
              {isPeak ? 'Tepe: 1 sn Karını Sık' : 'Boynunu Çekme!'}
            </text>
          </g>
        </svg>
      );
    }

    // 18. HANGING LEG RAISE (Hanging from Bar, Lifting Legs 90° Forward)
    if (id.includes('leg_raise') || id.includes('bacak_kaldir')) {
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full">
          <defs>
            <linearGradient id="lowerAbs" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>
          {/* Top Bar */}
          <line x1="60" y1="30" x2="260" y2="30" stroke="#CBD5E1" strokeWidth="7" strokeLinecap="round" />
          <circle cx="100" cy="30" r="5" fill="#94A3B8" />
          <circle cx="220" cy="30" r="5" fill="#94A3B8" />

          {/* Hanging Head and Torso */}
          <circle cx="160" cy="65" r="13" fill="#64748B" />
          <line x1="125" y1="30" x2="152" y2="72" stroke="#CBD5E1" strokeWidth="8" strokeLinecap="round" />
          <line x1="195" y1="30" x2="168" y2="72" stroke="#CBD5E1" strokeWidth="8" strokeLinecap="round" />
          <line x1="160" y1="78" x2="160" y2="125" stroke="#475569" strokeWidth="18" strokeLinecap="round" />

          {/* Lower Abs Glow */}
          <rect x="145" y="105" width="30" height="20" rx="4" fill="url(#lowerAbs)" className="animate-pulse" />
          <text x="160" y="118" fill="#0F172A" fontSize="7" fontWeight="bold" textAnchor="middle">ALT KARIN</text>

          {isPeak ? (
            /* Legs raised forward 90 degrees horizontal */
            <g className="transition-all duration-700 ease-out">
              <line x1="160" y1="125" x2="225" y2="125" stroke="#CBD5E1" strokeWidth="11" strokeLinecap="round" />
              <circle cx="225" cy="125" r="6" fill="#E2E8F0" />
              <path d="M 160 170 Q 210 165 220 130" stroke="#FACC15" strokeWidth="2.5" fill="none" strokeDasharray="3 3" />
            </g>
          ) : (
            /* Legs hanging down */
            <g className="transition-all duration-700 ease-out">
              <line x1="160" y1="125" x2="160" y2="185" stroke="#CBD5E1" strokeWidth="11" strokeLinecap="round" />
            </g>
          )}

          <g transform="translate(195, 45)">
            <rect width="112" height="24" rx="12" fill="#0F172A" stroke="#334155" strokeWidth="1" />
            <text x="56" y="16" fill="#FACC15" fontSize="10" fontWeight="bold" textAnchor="middle">
              {isPeak ? '90° Bacak Kaldırış' : 'Gövdeyi Sallama!'}
            </text>
          </g>
        </svg>
      );
    }

    // Default Fallback
    return (
      <svg viewBox="0 0 320 200" className="w-full h-full">
        <line x1="30" y1="170" x2="290" y2="170" stroke="#334155" strokeWidth="4" />
        <circle cx="160" cy="65" r="14" fill="#64748B" />
        <line x1="160" y1="80" x2="160" y2="135" stroke="#475569" strokeWidth="18" strokeLinecap="round" />
        <line x1="153" y1="135" x2="148" y2="170" stroke="#CBD5E1" strokeWidth="10" strokeLinecap="round" />
        <line x1="167" y1="135" x2="172" y2="170" stroke="#CBD5E1" strokeWidth="10" strokeLinecap="round" />
        <line x1="160" y1="90" x2="135" y2="120" stroke="#CBD5E1" strokeWidth="8" strokeLinecap="round" />
        <line x1="160" y1="90" x2="185" y2="120" stroke="#CBD5E1" strokeWidth="8" strokeLinecap="round" />
      </svg>
    );
  };

  return (
    <div className="w-full bg-slate-950/90 rounded-2xl border border-slate-800 p-3 sm:p-5 flex flex-col gap-4 shadow-xl">
      {/* Visualizer Mode Selector */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveViewMode('3d_gif')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              activeViewMode === '3d_gif'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>3D Döngüsel GIF</span>
          </button>
          <button
            onClick={() => setActiveViewMode('phases')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              activeViewMode === 'phases'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Başlangıç & Bitiş Formu</span>
          </button>
          <button
            onClick={() => setActiveViewMode('biomechanics')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              activeViewMode === 'biomechanics'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Açı Simülatörü</span>
          </button>
        </div>

        <span className="text-[11px] font-semibold text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800 hidden sm:inline-block">
          {biomechanics.kineticChain}
        </span>
      </div>

      {/* Main Motion Stage */}
      <div className="relative w-full h-64 sm:h-80 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 rounded-2xl overflow-hidden border border-slate-800/90 flex items-center justify-center shadow-inner group">
        {/* Subtle Biomechanical Grid Backdrop */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(250, 204, 21, 0.4) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* View Mode 1: 3D Looping GIF */}
        {activeViewMode === '3d_gif' && (
          <div className="relative w-full h-full flex items-center justify-center p-3">
            {!gifLoadFailed ? (
              <img
                src={gifUrl}
                alt={`${exercise.name} 3D Form Animasyonu`}
                className="max-h-full max-w-full object-contain rounded-xl drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)] transition-transform duration-300 group-hover:scale-105"
                referrerPolicy="no-referrer"
                onError={() => setGifLoadFailed(true)}
              />
            ) : (
              /* Fallback to interactive SVG if GIF network fails */
              renderVisualFigure()
            )}

            {/* Top Overlay Badge */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/85 border border-amber-400/30 text-[11px] font-extrabold text-amber-300 backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>3D DÖNGÜSEL FORM ANİMASYONU</span>
            </div>

            {/* Bottom Form Phase Mini Cue */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <div className="px-3 py-1.5 rounded-xl bg-slate-950/85 border border-slate-800 text-[11px] text-slate-300 backdrop-blur-md shadow-md pointer-events-auto flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="font-semibold">{exercise.turkishName}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400 text-[10px]">{exercise.difficulty} Seviye</span>
              </div>

              <button
                onClick={() => {
                  setGifLoadFailed(false);
                  const img = document.querySelector(`img[alt*="${exercise.name}"]`) as HTMLImageElement;
                  if (img) {
                    const src = img.src;
                    img.src = '';
                    img.src = src;
                  }
                }}
                className="px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white text-[11px] font-bold backdrop-blur-md shadow-md pointer-events-auto flex items-center gap-1.5 transition-colors"
                title="Döngüyü Yenile"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Döngü Başlat</span>
              </button>

              {onExpandFullscreen && (
                <button
                  onClick={onExpandFullscreen}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-amber-400 text-[11px] font-bold backdrop-blur-md shadow-md pointer-events-auto flex items-center gap-1.5 transition-colors"
                  title="Tam Ekran 3D Görünüm"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Tam Ekran</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* View Mode 2: Start vs Finish Side-by-Side Comparison */}
        {activeViewMode === 'phases' && (
          <div className="w-full h-full p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto">
            {/* Phase 1: Start / Eccentric */}
            <div className="bg-slate-900/90 rounded-xl border border-sky-500/30 p-3 sm:p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30 text-[10px] font-extrabold uppercase tracking-wider">
                    Faz 1: Başlangıç (İniş)
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono font-bold">
                    {biomechanics.startPhase.jointAngle}
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-extrabold text-white mb-1.5">
                  {biomechanics.startPhase.title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {biomechanics.startPhase.posture}
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-800 text-[11px]">
                <div className="flex items-start gap-1.5 text-sky-200">
                  <Wind className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                  <span><strong>Nefes:</strong> {biomechanics.startPhase.breathing}</span>
                </div>
                <div className="flex items-start gap-1.5 text-amber-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Püf Nokta:</strong> {biomechanics.startPhase.keyCue}</span>
                </div>
              </div>
            </div>

            {/* Phase 2: Peak / Concentric */}
            <div className="bg-slate-900/90 rounded-xl border border-amber-500/30 p-3 sm:p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-extrabold uppercase tracking-wider">
                    Faz 2: Bitiş & Zirve Kasılma
                  </span>
                  <span className="text-[10px] text-amber-300 font-mono font-bold">
                    {biomechanics.peakPhase.jointAngle}
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-extrabold text-white mb-1.5">
                  {biomechanics.peakPhase.title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {biomechanics.peakPhase.posture}
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-800 text-[11px]">
                <div className="flex items-start gap-1.5 text-sky-200">
                  <Wind className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                  <span><strong>Nefes:</strong> {biomechanics.peakPhase.breathing}</span>
                </div>
                <div className="flex items-start gap-1.5 text-emerald-200">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Zirve Kasılma:</strong> {biomechanics.peakPhase.keyCue}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Mode 3: Biomechanical Angle Simulator (Interactive SVG) */}
        {activeViewMode === 'biomechanics' && (
          <div className="w-full h-full relative flex items-center justify-center">
            {renderVisualFigure()}

            {/* Phase Overlay Badge */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700/80 text-[11px] font-bold text-slate-200 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>{phase === 'peak' ? '⚡ Tepe Nokta / Kasılma' : '🔄 Başlangıç / Negatif İniş'}</span>
            </div>

            {/* Manual Phase Switcher Buttons */}
            <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-slate-950/90 p-0.5 rounded-lg border border-slate-800 text-[10px]">
              <button
                onClick={() => setPhase('start')}
                className={`px-2 py-1 rounded font-medium transition-colors ${
                  phase === 'start' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                1. Başlangıç / İniş
              </button>
              <button
                onClick={() => setPhase('peak')}
                className={`px-2 py-1 rounded font-medium transition-colors ${
                  phase === 'peak' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                2. Tepe Kasılma
              </button>
            </div>
          </div>
        )}

        {/* Metronome status on stage if running */}
        {isMetronomeActive && (
          <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-xl animate-pulse">
            <span>⏱️ {metroPhaseText}</span>
          </div>
        )}
      </div>

      {/* Hareketin Başlangıç ve Bitiş / Zirve Form Özeti (Her Modda Görünür) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Başlangıç Formu Kutusu */}
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-sky-500/40 transition-colors">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-sky-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              1. BAŞLANGIÇ FORMU (Eksantrik)
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {biomechanics.startPhase.jointAngle}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {biomechanics.startPhase.posture}
          </p>
          <div className="mt-2 text-[10px] text-sky-200/80 flex items-center gap-1">
            <Wind className="w-3 h-3 text-sky-400 shrink-0" />
            <span><strong>Nefes:</strong> {biomechanics.startPhase.breathing}</span>
          </div>
        </div>

        {/* Bitiş / Zirve Formu Kutusu */}
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-amber-400/40 transition-colors">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              2. BİTİŞ / ZİRVE FORMU (Konsantrik)
            </span>
            <span className="text-[10px] text-amber-300 font-mono">
              {biomechanics.peakPhase.jointAngle}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {biomechanics.peakPhase.posture}
          </p>
          <div className="mt-2 text-[10px] text-amber-200/80 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
            <span><strong>Zirve:</strong> {biomechanics.peakPhase.keyCue}</span>
          </div>
        </div>
      </div>

      {/* Kas Gruplarını Vurgulayan Profesyonel Görsel Stil */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            Vurgulanan Kas Grupları & Aktivasyon Oranları
          </span>
          <span className="text-[10px] text-slate-400">
            EMG Biyomekanik Odak
          </span>
        </div>

        {/* Activation Progress Bars */}
        <div className="space-y-2">
          {biomechanics.muscleFocus.map((m, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: m.color }}
                  />
                  <span className="font-bold text-slate-200">{m.name}</span>
                  <span className="text-[10px] text-slate-400">
                    ({m.role === 'primary' ? 'Birincil Hedef' : m.role === 'secondary' ? 'İkincil Destek' : 'Sabitleyici'})
                  </span>
                </div>
                <span className="font-mono font-extrabold text-xs" style={{ color: m.color }}>
                  %{m.percentage}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${m.percentage}%`,
                    backgroundColor: m.color,
                    boxShadow: m.role === 'primary' ? `0 0 10px ${m.color}80` : undefined
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Tempo & Rep Practice Assistant */}
      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-white flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Önerilen Form Temposu (Metronom):
          </span>
          <span className="text-[11px] text-amber-200/90 font-medium">
            {exercise.recommendedTempo || biomechanics.tempoGuidance}
          </span>
        </div>

        <button
          onClick={toggleMetronome}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
            isMetronomeActive
              ? 'bg-rose-500 hover:bg-rose-400 text-white animate-pulse'
              : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md shadow-amber-400/20'
          }`}
        >
          {isMetronomeActive ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>Durdur</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Tempolu Dene</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
