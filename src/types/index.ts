export type HabitCategory = 'health' | 'work' | 'daily';

export interface Habit {
  id: string;
  title: string;
  category: HabitCategory;
  identityAnchor: string; // The identity this habit votes for (e.g., "أنا شخص يعتني بصحته وطاقته")
  habitStackCue?: string; // "بعد [العادة السابقة] سأقوم بـ..."
  twoMinuteVersion: string; // "النسخة المصغرة عند التكاسل"
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'anytime';
  frequency: 'daily' | 'weekdays' | 'weekends';
  createdAt: string;
  notes?: string;
}

export interface DayLog {
  date: string; // YYYY-MM-DD
  completedHabitIds: string[];
  twoMinuteUsedIds?: string[]; // habits completed using the 2-minute rule
  caredAboutToday?: string[]; // Things truly worth caring about today (Manson)
  letGoToday?: string[]; // Noise let go today without giving a f*ck
  stoicReflection?: string; // Daily reflection / accepting reality
  goodValueFocus?: string; // Focus value of the day
}

export interface IdentityProfile {
  primaryIdentity: string; // e.g. "إنسان منضبط، هادئ الأعصاب، يركز على ما يملك التحكم فيه"
  coreValues: string[]; // Good values: responsibility, honesty, deep craft
  thingsToIgnore: string[]; // Toxic noise ignored: social comparison, seeking approval, perfectionism
}

export interface HabitStats {
  streak: number;
  totalCompletions: number;
  bestStreak: number;
  completionRate: number; // percentage
}
