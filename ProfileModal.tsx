import React, { useState } from 'react';
import {
  X,
  User as UserIcon,
  Crown,
  Dumbbell,
  History,
  LogOut,
  Mail,
  Calendar,
  Zap,
  LogIn,
  UserPlus,
  ShieldCheck,
} from 'lucide-react';
import { User, DailyQuota, WorkoutProgram } from '../types';
import { BILO_IMAGES } from '../assets/biloImages';

interface ProfileModalProps {
  user: User | null;
  quota: DailyQuota | null;
  savedPrograms: WorkoutProgram[];
  questionCount: number;
  onClose: () => void;
  onLogin: (email: string, pass: string) => Promise<void>;
  onRegister: (name: string, email: string, pass: string) => Promise<void>;
  onLogout: () => void;
  onSelectSavedProgram: (prog: WorkoutProgram) => void;
  onOpenAdmin?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  user,
  quota,
  savedPrograms,
  questionCount,
  onClose,
  onLogin,
  onRegister,
  onLogout,
  onSelectSavedProgram,
  onOpenAdmin,
}) => {
  const [authMode, setAuthMode] = useState<'profile' | 'login' | 'register'>(
    user?.email ? 'profile' : 'login'
  );
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    try {
      await onLogin(email, password);
      setAuthMode('profile');
    } catch (err: any) {
      setErrorMsg(err.message || 'Giriş yapılamadı.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    try {
      await onRegister(name, email, password);
      setAuthMode('profile');
    } catch (err: any) {
      setErrorMsg(err.message || 'Kayıt yapılamadı.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Content */}
        <div className="p-6 sm:p-7">
          {/* PROFILE VIEW */}
          {authMode === 'profile' && user && (
            <div className="space-y-6">
              {/* User Header Card */}
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-md">
                  <img
                    src={BILO_IMAGES.avatar}
                    alt="Bilo Mascot"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 p-1 rounded-full">
                    <Crown className="w-3 h-3 fill-slate-950" />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-lg font-bold text-white">
                      {user.name}
                    </h3>
                    {user.role === 'admin' && (
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <Mail className="w-3 h-3 text-slate-500" />
                    {user.email}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    Üyelik: {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Günlük Kalan Hak</span>
                  </div>
                  <div className="font-heading text-2xl font-extrabold text-amber-400">
                    {quota?.remaining ?? 5}{' '}
                    <span className="text-xs text-slate-500 font-normal">
                      / {quota?.total ?? 5}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Gece 00:00'da yenilenir
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <History className="w-3.5 h-3.5 text-sky-400" />
                    <span>Toplam Soru</span>
                  </div>
                  <div className="font-heading text-2xl font-extrabold text-sky-400">
                    {questionCount}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Bilo ile yapılan sohbetler
                  </p>
                </div>
              </div>

              {/* Saved Programs List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-bold uppercase tracking-wider">
                    Kayıtlı Spor Programlarım ({savedPrograms.length})
                  </span>
                </div>

                {savedPrograms.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 text-center text-xs text-slate-500">
                    Henüz kayıtlı bir antrenman programın yok.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {savedPrograms.map((prog) => (
                      <div
                        key={prog.id}
                        onClick={() => {
                          onSelectSavedProgram(prog);
                          onClose();
                        }}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-400/40 cursor-pointer flex items-center justify-between text-xs transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Dumbbell className="w-3.5 h-3.5 text-amber-400" />
                          <span className="font-bold text-white truncate max-w-[200px]">
                            {prog.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500">
                          {new Date(prog.createdAt).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                {user.role === 'admin' && onOpenAdmin && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAdmin();
                    }}
                    className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin Paneline Git</span>
                  </button>
                )}

                <button
                  onClick={onLogout}
                  className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 ml-auto"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Çıkış Yap</span>
                </button>
              </div>
            </div>
          )}

          {/* LOGIN VIEW */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="text-center mb-4">
                <div className="w-12 h-12 rounded-2xl overflow-hidden border border-amber-400 mx-auto mb-2">
                  <img
                    src={BILO_IMAGES.avatar}
                    alt="Bilo"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h3 className="font-heading text-xl font-bold text-white">
                  BİLO’ya Giriş Yap
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Soru kotalarını ve antrenman programlarını kaydet!
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  E-Posta Adresi
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@bilo.ai"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Şifre
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm flex items-center justify-center gap-1.5 transition-all shadow-md"
              >
                <LogIn className="w-4 h-4" />
                <span>{isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}</span>
              </button>

              <div className="text-center pt-2 text-xs text-slate-400">
                Hesabın yok mu?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg('');
                    setAuthMode('register');
                  }}
                  className="text-amber-400 font-bold hover:underline"
                >
                  Hemen Kaydol
                </button>
              </div>

              {/* Demo Account shortcut */}
              <div className="pt-2 border-t border-slate-800 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@bilo.ai');
                    setPassword('admin123');
                  }}
                  className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
                >
                  🔑 Demo Admin Bilgilerini Doldur (admin@bilo.ai)
                </button>
              </div>
            </form>
          )}

          {/* REGISTER VIEW */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="text-center mb-4">
                <div className="w-12 h-12 rounded-2xl overflow-hidden border border-amber-400 mx-auto mb-2">
                  <img
                    src={BILO_IMAGES.avatar}
                    alt="Bilo"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h3 className="font-heading text-xl font-bold text-white">
                  Yeni Hesap Oluştur
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  BİLO ile her gün 5 ücretsiz AI soru hakkı kazan!
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Adın veya Takma Adın
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Kanka"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  E-Posta Adresi
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kanka@bilo.ai"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Şifre Belirle
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="En az 6 karakter"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm flex items-center justify-center gap-1.5 transition-all shadow-md"
              >
                <UserPlus className="w-4 h-4" />
                <span>{isLoading ? 'Kaydediliyor...' : 'Hesap Oluştur'}</span>
              </button>

              <div className="text-center pt-2 text-xs text-slate-400">
                Zaten hesabın var mı?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg('');
                    setAuthMode('login');
                  }}
                  className="text-amber-400 font-bold hover:underline"
                >
                  Giriş Yap
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
