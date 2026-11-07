import React, { useState } from 'react';
import { Habit, HabitCategory, DayLog } from '../types';
import { HabitCard } from './HabitCard';
import { PWAInstallButton } from './PWAInstallButton';
import { formatDateArabic } from '../utils/storage';
import {
  Calendar,
  Flame,
  Award,
  Zap,
  CheckCircle,
  Plus,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

interface TodayHabitsViewProps {
  habits: Habit[];
  currentDate: string;
  setCurrentDate: (d: string) => void;
  dayLog: DayLog;
  streaks: Record<string, number>;
  onToggleComplete: (habitId: string, usedTwoMinute: boolean) => void;
  onEditHabit: (habit: Habit) => void;
  onDeleteHabit: (habitId: string) => void;
  onOpenAddModal: () => void;
}

export const TodayHabitsView: React.FC<TodayHabitsViewProps> = ({
  habits,
  currentDate,
  setCurrentDate,
  dayLog,
  streaks,
  onToggleComplete,
  onEditHabit,
  onDeleteHabit,
  onOpenAddModal,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Filter habits
  const filteredHabits = habits.filter((h) => {
    if (activeCategory === 'all') return true;
    return h.category === activeCategory;
  });

  const totalCount = habits.length;
  const completedCount = dayLog.completedHabitIds?.length || 0;
  const percentComplete = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const twoMinuteCount = dayLog.twoMinuteUsedIds?.length || 0;

  // 7-day ribbon generator around current date
  const getDatesRibbon = () => {
    const list = [];
    const base = new Date();
    for (let i = -3; i <= 3; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const str = d.toISOString().split('T')[0];
      const isToday = i === 0;
      const dayName = new Intl.DateTimeFormat('ar-SA', { weekday: 'narrow' }).format(d);
      const dayNum = d.getDate();
      list.push({ dateStr: str, isToday, dayName, dayNum });
    }
    return list;
  };

  const datesRibbon = getDatesRibbon();

  // Shift day by offset
  const shiftDay = (days: number) => {
    const parts = currentDate.split('-');
    const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    d.setDate(d.getDate() + days);
    setCurrentDate(d.toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-6">
      {/* PWA Banner if available */}
      <PWAInstallButton variant="banner" />

      {/* Date Ribbon & Day Navigator */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={() => shiftDay(-1)}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white transition cursor-pointer"
            title="اليوم السابق"
          >
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-bold text-slate-100 font-heading">
              {formatDateArabic(currentDate)}
            </span>
          </div>

          <button
            onClick={() => shiftDay(1)}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white transition cursor-pointer"
            title="اليوم التالي"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        {/* 7-Day quick strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
          {datesRibbon.map((item) => {
            const isSelected = item.dateStr === currentDate;
            return (
              <button
                key={item.dateStr}
                onClick={() => setCurrentDate(item.dateStr)}
                className={`flex flex-col items-center justify-center min-w-[40px] h-12 rounded-xl text-xs transition cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                    : item.isToday
                    ? 'bg-slate-800 text-amber-400 border border-amber-500/30'
                    : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <span className="text-[10px] opacity-75">{item.dayName}</span>
                <span className="text-xs font-bold tabular-nums">{item.dayNum}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Atomic Progress & Identity Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: Identity Votes cast */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white tabular-nums font-heading">
                {completedCount}
              </span>
              <span className="text-xs text-slate-400">/ {totalCount}</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">أصوات هوية أُدليت اليوم</p>
          </div>
        </div>

        {/* Metric 2: Completion Rate */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-2xl font-black text-white tabular-nums font-heading">
                {percentComplete}%
              </span>
              <span className="text-xs text-slate-400">تحسن تراكمي</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
          </div>
        </div>

        {/* Metric 3: Micro-rule (2-minute rule) count */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white tabular-nums font-heading">
                {twoMinuteCount}
              </span>
              <span className="text-xs text-slate-400">مرات</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">كسر التسويف (قاعدة الدقيقتين)</p>
          </div>
        </div>
      </div>

      {/* Category Tabs: Interactive Segmented Control (Section 1.A DO rule) */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          {[
            { id: 'all', label: 'كافة العادات' },
            { id: 'health', label: 'صحية' },
            { id: 'work', label: 'عملية' },
            { id: 'daily', label: 'يومية' },
          ].map((tab) => {
            const isTabActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isTabActive
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <button
          onClick={onOpenAddModal}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-slate-200 transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>إضافة عادة جديدة</span>
        </button>
      </div>

      {/* Habits List */}
      <div className="space-y-3">
        {filteredHabits.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800">
            <p className="text-sm text-slate-400">لا توجد عادات مسجلة في هذا التصنيف حالياً.</p>
            <button
              onClick={onOpenAddModal}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
            >
              <Plus className="w-4 h-4" />
              أضف أول عادة الآن
            </button>
          </div>
        ) : (
          filteredHabits.map((habit) => {
            const isCompleted = dayLog.completedHabitIds?.includes(habit.id) || false;
            const isTwoMin = dayLog.twoMinuteUsedIds?.includes(habit.id) || false;
            const streak = streaks[habit.id] || 0;

            return (
              <HabitCard
                key={habit.id}
                habit={habit}
                isCompleted={isCompleted}
                isTwoMinuteUsed={isTwoMin}
                streak={streak}
                onToggleComplete={onToggleComplete}
                onEdit={onEditHabit}
                onDelete={onDeleteHabit}
              />
            );
          })
        )}
      </div>

      {/* Law of Never Breaking Twice (جيمس كلير) reminder footer */}
      <div className="rounded-2xl p-4 bg-slate-900/50 border border-slate-800/80 text-xs text-slate-400 flex items-start gap-3">
        <Flame className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-slate-200">قانون عدم الكسر مرتين (James Clear):</strong> تفويت العادة ليوم واحد أمر طبيعي ولا يستحق لوم الذات. لكن إياك وتفويتها يومين متتاليين؛ إذا فوتت الأمس، أنجز ولو دقيقتين فقط اليوم للحفاظ على تصويتك لهويتك!
        </div>
      </div>
    </div>
  );
};
