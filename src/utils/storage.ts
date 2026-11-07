import { Habit, DayLog, IdentityProfile, HabitStats } from '../types';
import { INITIAL_HABITS, INITIAL_IDENTITY } from '../data/seedData';

const HABITS_KEY = 'athar_habits_v1';
const DAY_LOGS_KEY = 'athar_day_logs_v1';
const IDENTITY_KEY = 'athar_identity_v1';

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateArabic(dateStr: string): string {
  try {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    return new Intl.DateTimeFormat('ar-SA', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateStr;
  }
}

export function getHabits(): Habit[] {
  try {
    const saved = localStorage.getItem(HABITS_KEY);
    if (!saved) {
      localStorage.setItem(HABITS_KEY, JSON.stringify(INITIAL_HABITS));
      return INITIAL_HABITS;
    }
    return JSON.parse(saved);
  } catch (e) {
    console.error('Error reading habits', e);
    return INITIAL_HABITS;
  }
}

export function saveHabits(habits: Habit[]): void {
  try {
    localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  } catch (e) {
    console.error('Error saving habits', e);
  }
}

export function getAllDayLogs(): Record<string, DayLog> {
  try {
    const saved = localStorage.getItem(DAY_LOGS_KEY);
    if (!saved) return {};
    return JSON.parse(saved);
  } catch (e) {
    console.error('Error reading day logs', e);
    return {};
  }
}

export function getDayLog(date: string): DayLog {
  const logs = getAllDayLogs();
  return (
    logs[date] || {
      date,
      completedHabitIds: [],
      twoMinuteUsedIds: [],
      caredAboutToday: [],
      letGoToday: [],
      stoicReflection: '',
      goodValueFocus: '',
    }
  );
}

export function saveDayLog(log: DayLog): void {
  try {
    const logs = getAllDayLogs();
    logs[log.date] = log;
    localStorage.setItem(DAY_LOGS_KEY, JSON.stringify(logs));
  } catch (e) {
    console.error('Error saving day log', e);
  }
}

export function getIdentityProfile(): IdentityProfile {
  try {
    const saved = localStorage.getItem(IDENTITY_KEY);
    if (!saved) {
      localStorage.setItem(IDENTITY_KEY, JSON.stringify(INITIAL_IDENTITY));
      return INITIAL_IDENTITY;
    }
    return JSON.parse(saved);
  } catch (e) {
    console.error('Error reading identity', e);
    return INITIAL_IDENTITY;
  }
}

export function saveIdentityProfile(profile: IdentityProfile): void {
  try {
    localStorage.setItem(IDENTITY_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving identity', e);
  }
}

export function calculateHabitStats(habitId: string, logs: Record<string, DayLog>): HabitStats {
  const dates = Object.keys(logs).sort().reverse();
  let totalCompletions = 0;
  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;

  const todayStr = getTodayDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // Count completions
  Object.values(logs).forEach((log) => {
    if (log.completedHabitIds?.includes(habitId)) {
      totalCompletions++;
    }
  });

  // Calculate current streak
  // Check if today or yesterday has completion
  let checkDate = new Date();
  let streakOngoing = true;

  // If today is completed, start from today. If not yet, check yesterday to see if streak is still alive
  const todayLog = logs[todayStr];
  const isDoneToday = todayLog?.completedHabitIds?.includes(habitId);

  if (!isDoneToday) {
    const yesterdayLog = logs[yesterdayStr];
    if (!yesterdayLog?.completedHabitIds?.includes(habitId)) {
      currentStreak = 0;
      streakOngoing = false;
    } else {
      checkDate = yesterday;
    }
  }

  if (streakOngoing) {
    let dayCount = 0;
    while (dayCount < 365) {
      const dStr = checkDate.toISOString().split('T')[0];
      const log = logs[dStr];
      if (log?.completedHabitIds?.includes(habitId)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
        dayCount++;
      } else {
        break;
      }
    }
  }

  // Calculate best streak historically
  const sortedDates = [...dates].sort();
  for (let i = 0; i < sortedDates.length; i++) {
    const log = logs[sortedDates[i]];
    if (log?.completedHabitIds?.includes(habitId)) {
      tempStreak++;
      if (tempStreak > bestStreak) bestStreak = tempStreak;
    } else {
      tempStreak = 0;
    }
  }

  bestStreak = Math.max(bestStreak, currentStreak);

  // Rate over last 30 days
  let last30DaysCount = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dStr = d.toISOString().split('T')[0];
    if (logs[dStr]?.completedHabitIds?.includes(habitId)) {
      last30DaysCount++;
    }
  }

  const completionRate = Math.round((last30DaysCount / 30) * 100);

  return {
    streak: currentStreak,
    totalCompletions,
    bestStreak,
    completionRate,
  };
}

export function exportBackupData(): string {
  const habits = getHabits();
  const dayLogs = getAllDayLogs();
  const identity = getIdentityProfile();
  return JSON.stringify({ habits, dayLogs, identity, version: '1.0', exportedAt: new Date().toISOString() }, null, 2);
}

export function importBackupData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.habits && Array.isArray(data.habits)) {
      saveHabits(data.habits);
    }
    if (data.dayLogs && typeof data.dayLogs === 'object') {
      localStorage.setItem(DAY_LOGS_KEY, JSON.stringify(data.dayLogs));
    }
    if (data.identity && typeof data.identity === 'object') {
      saveIdentityProfile(data.identity);
    }
    return true;
  } catch (e) {
    console.error('Import failed', e);
    return false;
  }
}
