export type BiloMode = 'sport' | 'knowledge';

export type AppTab = 'home' | 'chat' | 'exercises' | 'workout' | 'history';

export type BiloExpression =
  | 'happy'
  | 'thinking'
  | 'motivational'
  | 'serious'
  | 'playful'
  | 'surprised'
  | 'friendly'
  | 'limit_reached'
  | string;

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  isBanned?: boolean;
  isPremium?: boolean;
  customQuota?: number;
}

export interface DailyQuota {
  date: string;
  used: number;
  total: number;
  remaining: number;
}

export interface ChatMessage {
  id: string;
  userId?: string;
  role: 'user' | 'assistant' | 'bilo';
  content: string;
  mode?: BiloMode;
  expression?: BiloExpression;
  createdAt: string;
}

export interface WorkoutExercise {
  name: string;
  sets: string;
  reps: string;
  rest: string;
  tip?: string;
}

export interface WorkoutDay {
  day: string; // e.g. 'Pazartesi'
  focus: string; // e.g. 'Göğüs & Triceps'
  isRestDay: boolean;
  exercises: WorkoutExercise[];
}

export interface WorkoutProfile {
  age: number | string;
  gender?: string;
  height: number | string;
  weight: number | string;
  goal: string;
  fitnessLevel: string;
  daysPerWeek: number | string;
  location: 'home' | 'gym';
  equipment: string;
  notes?: string;
}

export interface WorkoutProgram {
  id: string;
  userId: string;
  title: string;
  description: string;
  weeklySchedule: WorkoutDay[];
  nutritionTips: string[];
  biloCoachNote: string;
  profile: WorkoutProfile;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalQuestions: number;
  sportQuestions: number;
  knowledgeQuestions: number;
  totalPrograms: number;
  activeToday: number;
  recentQuestions: Array<{
    id: string;
    userName: string;
    mode: BiloMode;
    question: string;
    createdAt: string;
  }>;
}
