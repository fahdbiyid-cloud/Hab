import { useState, useEffect, useMemo } from 'react';
import { Habit, DayLog, IdentityProfile } from './types';
import {
  getHabits,
  saveHabits,
  getAllDayLogs,
  getDayLog,
  saveDayLog,
  getIdentityProfile,
  saveIdentityProfile,
  getTodayDateString,
  calculateHabitStats,
} from './utils/storage';
import { fireHabitConfetti, fireDayCompletedConfetti } from './utils/confetti';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { TodayHabitsView } from './components/TodayHabitsView';
import { MansonCompassView } from './components/MansonCompassView';
import { IdentityEngineView } from './components/IdentityEngineView';
import { AnalyticsView } from './components/AnalyticsView';
import { CoachView } from './components/CoachView';
import { AddHabitModal } from './components/AddHabitModal';
import { EditHabitModal } from './components/EditHabitModal';
import { OfflineIndicator } from './components/OfflineIndicator';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('today');
  const [currentDate, setCurrentDate] = useState<string>(getTodayDateString());
  const [habits, setHabits] = useState<Habit[]>([]);
  const [dayLogs, setDayLogs] = useState<Record<string, DayLog>>({});
  const [identity, setIdentity] = useState<IdentityProfile | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  // Load initial data from local storage
  const loadData = () => {
    setHabits(getHabits());
    setDayLogs(getAllDayLogs());
    setIdentity(getIdentityProfile());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Current day's log
  const currentDayLog = useMemo(() => {
    return dayLogs[currentDate] || getDayLog(currentDate);
  }, [dayLogs, currentDate]);

  // Calculate streaks for all habits
  const streaks = useMemo(() => {
    const map: Record<string, number> = {};
    habits.forEach((h) => {
      const stats = calculateHabitStats(h.id, dayLogs);
      map[h.id] = stats.streak;
    });
    return map;
  }, [habits, dayLogs]);

  // Handle habit completion toggle
  const handleToggleComplete = (habitId: string, usedTwoMinute: boolean) => {
    const isCurrentlyDone = currentDayLog.completedHabitIds?.includes(habitId) || false;
    let newCompleted: string[] = [];
    let newTwoMin: string[] = [...(currentDayLog.twoMinuteUsedIds || [])];

    if (isCurrentlyDone) {
      // Toggle off
      newCompleted = (currentDayLog.completedHabitIds || []).filter((id) => id !== habitId);
      newTwoMin = newTwoMin.filter((id) => id !== habitId);
    } else {
      // Complete
      newCompleted = [...(currentDayLog.completedHabitIds || []), habitId];
      if (usedTwoMinute && !newTwoMin.includes(habitId)) {
        newTwoMin.push(habitId);
      }
      // Celebrate
      if (newCompleted.length === habits.length && habits.length > 0) {
        fireDayCompletedConfetti();
      } else {
        fireHabitConfetti();
      }
    }

    const updatedLog: DayLog = {
      ...currentDayLog,
      completedHabitIds: newCompleted,
      twoMinuteUsedIds: newTwoMin,
    };

    saveDayLog(updatedLog);
    setDayLogs((prev) => ({ ...prev, [currentDate]: updatedLog }));
  };

  // Habit management
  const handleAddHabit = (newHabit: Habit) => {
    const updated = [newHabit, ...habits];
    setHabits(updated);
    saveHabits(updated);
  };

  const handleUpdateHabit = (updatedHabit: Habit) => {
    const updated = habits.map((h) => (h.id === updatedHabit.id ? updatedHabit : h));
    setHabits(updated);
    saveHabits(updated);
  };

  const handleDeleteHabit = (habitId: string) => {
    const updated = habits.filter((h) => h.id !== habitId);
    setHabits(updated);
    saveHabits(updated);
  };

  const handleSaveDayLog = (updatedLog: DayLog) => {
    saveDayLog(updatedLog);
    setDayLogs((prev) => ({ ...prev, [updatedLog.date]: updatedLog }));
  };

  const handleSaveIdentity = (updatedIdentity: IdentityProfile) => {
    saveIdentityProfile(updatedIdentity);
    setIdentity(updatedIdentity);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500/20 selection:text-amber-300">
      <OfflineIndicator />

      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
        {activeTab === 'today' && (
          <TodayHabitsView
            habits={habits}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            dayLog={currentDayLog}
            streaks={streaks}
            onToggleComplete={handleToggleComplete}
            onEditHabit={(h) => setEditingHabit(h)}
            onDeleteHabit={handleDeleteHabit}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        )}

        {activeTab === 'compass' && (
          <MansonCompassView
            dayLog={currentDayLog}
            onSaveDayLog={handleSaveDayLog}
          />
        )}

        {activeTab === 'identity' && identity && (
          <IdentityEngineView
            identity={identity}
            habits={habits}
            dayLogs={dayLogs}
            onSaveIdentity={handleSaveIdentity}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            habits={habits}
            dayLogs={dayLogs}
            onRefreshData={loadData}
          />
        )}

        {activeTab === 'coach' && <CoachView habits={habits} />}
      </main>

      {/* Mobile Bottom Navigation (Hidden on md screens) */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Modals */}
      <AddHabitModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddHabit={handleAddHabit}
      />

      <EditHabitModal
        habit={editingHabit}
        isOpen={!!editingHabit}
        onClose={() => setEditingHabit(null)}
        onUpdateHabit={handleUpdateHabit}
      />
    </div>
  );
}
