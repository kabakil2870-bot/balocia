import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ChatInterface } from './components/ChatInterface';
import { WorkoutGenerator } from './components/WorkoutGenerator';
import { QuestionHistory } from './components/QuestionHistory';
import { ProfileModal } from './components/ProfileModal';
import { AdminDashboard } from './components/AdminDashboard';
import { BottomNav } from './components/BottomNav';
import { ExerciseGuide } from './components/ExerciseGuide';
import { ExerciseModal } from './components/ExerciseModal';
import { ExerciseItem } from './data/exercises';
import {
  BiloMode,
  ChatMessage,
  DailyQuota,
  User,
  WorkoutProgram,
  AppTab,
} from './types';
import {
  fetchCurrentUser,
  askBiloApi,
  fetchQuestions,
  deleteQuestionApi,
  fetchWorkoutPrograms,
  loginApi,
  registerApi,
  logoutApi,
} from './api';
import { supabase } from './lib/supabase';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [quota, setQuota] = useState<DailyQuota | null>({
    used: 0,
    total: 5,
    remaining: 5,
    date: new Date().toISOString().split('T')[0],
  });
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [selectedExerciseModal, setSelectedExerciseModal] = useState<ExerciseItem | null>(null);
  const [currentMode, setCurrentMode] = useState<BiloMode | 'auto'>('auto');
  const [detectedMode, setDetectedMode] = useState<BiloMode>('sport');

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [savedPrograms, setSavedPrograms] = useState<WorkoutProgram[]>([]);

  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Load user profile, quota, and history from Supabase
  const loadUserData = async () => {
    try {
      const authData = await fetchCurrentUser();
      setUser(authData.user);
      setQuota(authData.quota);

      if (authData.user?.id) {
        const [loadedQuestions, loadedPrograms] = await Promise.all([
          fetchQuestions(),
          fetchWorkoutPrograms(),
        ]);
        setQuestions(loadedQuestions);
        setSavedPrograms(loadedPrograms);

        // Populate initial chat history from loaded questions (chronological order)
        if (loadedQuestions && loadedQuestions.length > 0) {
          const chatMsgs: ChatMessage[] = [];
          [...loadedQuestions].reverse().forEach((q: any) => {
            chatMsgs.push({
              id: `u_${q.id}`,
              role: 'user',
              content: q.question,
              createdAt: q.createdAt || q.created_at,
            });
            chatMsgs.push({
              id: `b_${q.id}`,
              role: 'bilo',
              content: q.answer,
              mode: q.mode,
              expression: 'friendly',
              createdAt: q.createdAt || q.created_at,
            });
          });
          setMessages(chatMsgs);
        }
      } else {
        setQuestions([]);
        setSavedPrograms([]);
        setMessages([]);
      }
    } catch (err) {
      console.error('App init error:', err);
    }
  };

  // Initialize Supabase Auth listener
  useEffect(() => {
    loadUserData();

    // Listen for Supabase auth state changes (sign in, sign out, token refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await loadUserData();
      } else {
        setUser(null);
        setQuota({
          used: 0,
          total: 5,
          remaining: 5,
          date: new Date().toISOString().split('T')[0],
        });
        setQuestions([]);
        setSavedPrograms([]);
        setMessages([]);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Handle asking a question (both from Hero and from Chat)
  const handleAskQuestion = async (questionText: string, specificMode?: BiloMode) => {
    // If not logged in, prompt user to login via Supabase Auth
    if (!user) {
      setIsProfileOpen(true);
      return;
    }

    // Switch to chat view if on home or another tab
    if (activeTab !== 'chat') {
      setActiveTab('chat');
    }

    const modeToSend = specificMode || (currentMode === 'auto' ? undefined : currentMode);

    // Optimistically push user message
    const tempUserMsgId = `temp_${Date.now()}`;
    const newMsg: ChatMessage = {
      id: tempUserMsgId,
      role: 'user',
      content: questionText,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setIsChatLoading(true);

    try {
      const result = await askBiloApi(questionText, modeToSend);

      // Update detected/active mode for visuals
      setDetectedMode(result.mode);

      // Append Bilo's response
      const biloMsg: ChatMessage = {
        id: result.id,
        role: 'bilo',
        content: result.answer,
        mode: result.mode,
        expression: result.expression,
        createdAt: result.createdAt,
      };

      setMessages((prev) => [...prev, biloMsg]);
      setQuota(result.quota);

      // Add to questions list
      setQuestions((prev) => [
        {
          id: result.id,
          question: questionText,
          answer: result.answer,
          mode: result.mode,
          createdAt: result.createdAt,
        },
        ...prev,
      ]);
    } catch (err: any) {
      if (err.isQuotaExceeded) {
        if (err.quota) setQuota(err.quota);
        const limitMsg: ChatMessage = {
          id: `limit_${Date.now()}`,
          role: 'bilo',
          content: 'Bugün soru hakkın doldu kanka! 😄 Yarın tekrar bekliyorum.',
          mode: 'sport',
          expression: 'limit_reached',
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, limitMsg]);
      } else if (err.isUnauthorized) {
        setIsProfileOpen(true);
      } else {
        const errorMsg: ChatMessage = {
          id: `err_${Date.now()}`,
          role: 'bilo',
          content: `Kanka bir anlık sorun oldu: ${err.message}. Soru hakkın iade edildi, tekrar sorabilirsin!`,
          mode: 'sport',
          expression: 'thinking',
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!user) return;
    try {
      await deleteQuestionApi(id);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
      setMessages((prev) => prev.filter((m) => m.id !== `u_${id}` && m.id !== `b_${id}` && m.id !== id));
    } catch (err) {
      console.error('Delete question error:', err);
    }
  };

  const handleReaskQuestion = (question: string, mode: BiloMode) => {
    handleAskQuestion(question, mode);
  };

  const handleProgramGenerated = (program: WorkoutProgram) => {
    setSavedPrograms((prev) => [program, ...prev]);
  };

  const handleLogin = async (email: string, pass: string) => {
    const data = await loginApi(email, pass);
    setUser(data.user);
    setQuota(data.quota);
    await loadUserData();
  };

  const handleRegister = async (name: string, email: string, pass: string) => {
    const data = await registerApi(name, email, pass);
    setUser(data.user);
    setQuota(data.quota);
    await loadUserData();
  };

  const handleLogout = async () => {
    await logoutApi();
    setUser(null);
    setMessages([]);
    setQuestions([]);
    setSavedPrograms([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-400 selection:text-slate-950 font-sans pb-16 sm:pb-8">
      {/* Top Navbar Header */}
      <Header
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        detectedMode={detectedMode}
        quota={quota}
        user={user}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Main Content Area based on Active Tab */}
      <main className="flex-1 flex flex-col justify-start">
        {activeTab === 'home' && (
          <HeroSection
            currentMode={currentMode}
            detectedMode={detectedMode}
            quota={quota}
            onAskQuestion={(q) => handleAskQuestion(q)}
            onOpenWorkoutModal={() => setActiveTab('workout')}
            onOpenHistory={() => setActiveTab('history')}
            onOpenProfile={() => setIsProfileOpen(true)}
            onOpenExercises={() => setActiveTab('exercises')}
            onSelectTab={setActiveTab}
          />
        )}

        {activeTab === 'chat' && (
          <div className="py-2 flex-1 flex flex-col">
            <ChatInterface
              messages={messages}
              isLoading={isChatLoading}
              onSendMessage={(txt) => handleAskQuestion(txt)}
              quota={quota}
              activeMode={currentMode}
              onSelectMode={setCurrentMode}
              onOpenWorkout={() => setActiveTab('workout')}
              onOpenExercise={(ex) => setSelectedExerciseModal(ex)}
              onOpenExercisesGuide={() => setActiveTab('exercises')}
            />
          </div>
        )}

        {activeTab === 'exercises' && (
          <ExerciseGuide
            onSelectExercise={(ex) => setSelectedExerciseModal(ex)}
            onAskBilo={(question) => {
              setActiveTab('chat');
              setCurrentMode('sport');
              handleAskQuestion(question, 'sport');
            }}
          />
        )}

        {activeTab === 'workout' && (
          <WorkoutGenerator
            userId={user?.id || ''}
            savedPrograms={savedPrograms}
            onProgramGenerated={handleProgramGenerated}
            onSelectSavedProgram={() => {}}
            onAskBiloAboutExercise={(question) => {
              setActiveTab('chat');
              setCurrentMode('sport');
              handleAskQuestion(question, 'sport');
            }}
          />
        )}

        {activeTab === 'history' && (
          <QuestionHistory
            questions={questions}
            onDeleteQuestion={handleDeleteQuestion}
            onReaskQuestion={handleReaskQuestion}
          />
        )}
      </main>

      {/* Global Exercise Motion Visualizer & Form Guide Modal */}
      {selectedExerciseModal && (
        <ExerciseModal
          exercise={selectedExerciseModal}
          onClose={() => setSelectedExerciseModal(null)}
          onAskBiloAboutExercise={(question) => {
            setActiveTab('chat');
            setCurrentMode('sport');
            handleAskQuestion(question, 'sport');
          }}
        />
      )}

      {/* User Profile / Supabase Auth Modal */}
      {isProfileOpen && (
        <ProfileModal
          user={user}
          quota={quota}
          savedPrograms={savedPrograms}
          questionCount={questions.length}
          onClose={() => setIsProfileOpen(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
          onLogout={handleLogout}
          onSelectSavedProgram={() => {
            setActiveTab('workout');
            setIsProfileOpen(false);
          }}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />
      )}

      {/* Admin Dashboard Modal */}
      {isAdminOpen && user && (
        <AdminDashboard
          adminId={user.id}
          onClose={() => setIsAdminOpen(false)}
        />
      )}

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenProfile={() => setIsProfileOpen(true)}
        remainingQuota={quota ? quota.remaining : 5}
      />
    </div>
  );
}
