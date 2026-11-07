import React, { useState, useEffect } from 'react';
import { Habit, HabitCategory } from '../types';
import { X, Save } from 'lucide-react';

interface EditHabitModalProps {
  habit: Habit | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateHabit: (updated: Habit) => void;
}

export const EditHabitModal: React.FC<EditHabitModalProps> = ({
  habit,
  isOpen,
  onClose,
  onUpdateHabit,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<HabitCategory>('health');
  const [identityAnchor, setIdentityAnchor] = useState('');
  const [habitStackCue, setHabitStackCue] = useState('');
  const [twoMinuteVersion, setTwoMinuteVersion] = useState('');
  const [timeOfDay, setTimeOfDay] = useState<Habit['timeOfDay']>('morning');

  useEffect(() => {
    if (habit) {
      setTitle(habit.title);
      setCategory(habit.category);
      setIdentityAnchor(habit.identityAnchor || '');
      setHabitStackCue(habit.habitStackCue || '');
      setTwoMinuteVersion(habit.twoMinuteVersion || '');
      setTimeOfDay(habit.timeOfDay || 'morning');
    }
  }, [habit]);

  if (!isOpen || !habit) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onUpdateHabit({
      ...habit,
      title: title.trim(),
      category,
      identityAnchor: identityAnchor.trim(),
      habitStackCue: habitStackCue.trim(),
      twoMinuteVersion: twoMinuteVersion.trim(),
      timeOfDay,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative text-slate-100 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h2 className="text-base font-bold font-heading">تعديل العادة الذرية</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs mt-4">
          <div>
            <label className="block font-semibold text-slate-200 mb-1.5">اسم العادة</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 outline-none text-slate-100 text-xs transition"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'health', label: 'صحية وبدنية' },
              { id: 'work', label: 'عملية ومهنية' },
              { id: 'daily', label: 'يومية وشخصية' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id as HabitCategory)}
                className={`py-2 px-2.5 rounded-xl border text-center font-medium transition cursor-pointer ${
                  category === cat.id
                    ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div>
            <label className="block font-semibold text-slate-200 mb-1">صوت الهوية</label>
            <input
              type="text"
              value={identityAnchor}
              onChange={(e) => setIdentityAnchor(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 outline-none text-slate-100 text-xs transition"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-200 mb-1">تركيب العادة (المحفز)</label>
            <input
              type="text"
              value={habitStackCue}
              onChange={(e) => setHabitStackCue(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 outline-none text-slate-100 text-xs transition"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-200 mb-1">قاعدة الدقيقتين</label>
            <input
              type="text"
              value={twoMinuteVersion}
              onChange={(e) => setTwoMinuteVersion(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 outline-none text-slate-100 text-xs transition"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-200 mb-1.5">الوقت في اليوم</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'morning', label: 'صباحاً' },
                { id: 'afternoon', label: 'ظهراً' },
                { id: 'evening', label: 'مساءً' },
                { id: 'anytime', label: 'أي وقت' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTimeOfDay(t.id as Habit['timeOfDay'])}
                  className={`py-1.5 px-2 rounded-lg border text-center text-[11px] transition cursor-pointer ${
                    timeOfDay === t.id
                      ? 'bg-slate-800 border-amber-500/40 text-amber-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white transition cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition shadow-md cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>تحديث العادة</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
