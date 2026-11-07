import React from 'react';
import { Habit } from '../types';
import { Check, Flame, Zap, Clock, MoreVertical, Edit2, Trash2 } from 'lucide-react';

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  isTwoMinuteUsed: boolean;
  streak: number;
  onToggleComplete: (habitId: string, usedTwoMinute: boolean) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  isCompleted,
  isTwoMinuteUsed,
  streak,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const [showMenu, setShowMenu] = React.useState(false);

  const getCategoryLabel = (category: Habit['category']) => {
    switch (category) {
      case 'health':
        return 'صحة وبدن';
      case 'work':
        return 'عمل وإنتاجية';
      case 'daily':
        return 'شخصي ونمط حياة';
    }
  };

  const getTimeOfDayLabel = (time: Habit['timeOfDay']) => {
    switch (time) {
      case 'morning':
        return 'صباحاً';
      case 'afternoon':
        return 'ظهراً';
      case 'evening':
        return 'مساءً';
      case 'anytime':
        return 'أي وقت';
    }
  };

  return (
    <div
      className={`relative group rounded-2xl p-4 sm:p-5 transition-all border ${
        isCompleted
          ? 'bg-slate-900/40 border-amber-500/30'
          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Right side in RTL: Checkbox & Info */}
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          {/* Main Completion Trigger Button */}
          <button
            onClick={() => onToggleComplete(habit.id, false)}
            className={`min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0 ${
              isCompleted
                ? isTwoMinuteUsed
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800 border border-slate-700 text-transparent hover:border-amber-400/50 hover:bg-slate-750'
            }`}
            aria-label={isCompleted ? 'إلغاء الإكمال' : 'إكمال العادة'}
          >
            {isCompleted ? (
              isTwoMinuteUsed ? (
                <Zap className="w-5 h-5 fill-amber-400 text-amber-400" />
              ) : (
                <Check className="w-5 h-5 stroke-[3]" />
              )
            ) : (
              <Check className="w-5 h-5 group-hover:text-slate-500 transition-colors" />
            )}
          </button>

          {/* Details */}
          <div className="flex-1 min-w-0">
            {/* Category and time metadata - unboxed with middle dot */}
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>{getCategoryLabel(habit.category)}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                {getTimeOfDayLabel(habit.timeOfDay)}
              </span>
              {streak > 0 && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1 text-amber-400 font-semibold tabular-nums">
                    <Flame className="w-3 h-3 fill-amber-400" />
                    {streak} {streak === 1 ? 'يوم' : 'أيام'}
                  </span>
                </>
              )}
            </div>

            {/* Habit Title */}
            <h3
              className={`text-base font-bold transition-colors ${
                isCompleted ? 'line-through text-slate-400' : 'text-slate-100'
              }`}
            >
              {habit.title}
            </h3>

            {/* Identity Anchor (Atomic Habits: Who do you want to become?) */}
            {habit.identityAnchor && (
              <p className="text-xs text-amber-400/90 mt-1 font-medium">
                🎯 {habit.identityAnchor}
              </p>
            )}

            {/* Habit Stacking Cue */}
            {habit.habitStackCue && (
              <p className="text-xs text-slate-400 mt-1">
                <span className="text-slate-400 font-medium">المحفز:</span> {habit.habitStackCue}
              </p>
            )}

            {/* 2-Minute Rule micro button: when the user feels lazy or tired */}
            {!isCompleted && habit.twoMinuteVersion && (
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div className="text-xs text-slate-400 truncate">
                  <span className="text-amber-400 font-medium">قاعدة الدقيقتين: </span>
                  {habit.twoMinuteVersion}
                </div>
                <button
                  onClick={() => onToggleComplete(habit.id, true)}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 active:scale-95 text-amber-300 text-xs font-semibold border border-amber-500/20 transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                  title="إنجاز النسخة المصغرة عند التكاسل (تحافظ على السلسلة)"
                >
                  <Zap className="w-3 h-3" />
                  <span>دقيقتان فقط</span>
                </button>
              </div>
            )}

            {isCompleted && isTwoMinuteUsed && (
              <div className="mt-2 text-xs text-amber-400/80 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                <span>أُنجزت بنجاح عبر قاعدة الدقيقتين (صوت للهوية تم تسجيله!)</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Menu button */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="خيارات العادة"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute left-0 mt-1 w-36 rounded-xl bg-slate-900 border border-slate-800 shadow-xl py-1 z-40 text-xs">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onEdit(habit);
                  }}
                  className="w-full text-right px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>تعديل العادة</span>
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onDelete(habit.id);
                  }}
                  className="w-full text-right px-3 py-2 text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>حذف العادة</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
