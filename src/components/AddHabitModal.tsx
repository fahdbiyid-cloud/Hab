import React, { useState } from 'react';
import { Habit, HabitCategory } from '../types';
import { X, Sparkles, HelpCircle } from 'lucide-react';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHabit: (habit: Habit) => void;
}

export const AddHabitModal: React.FC<AddHabitModalProps> = ({
  isOpen,
  onClose,
  onAddHabit,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<HabitCategory>('health');
  const [identityAnchor, setIdentityAnchor] = useState('');
  const [habitStackCue, setHabitStackCue] = useState('');
  const [twoMinuteVersion, setTwoMinuteVersion] = useState('');
  const [timeOfDay, setTimeOfDay] = useState<Habit['timeOfDay']>('morning');
  const [showGuide, setShowGuide] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newHabit: Habit = {
      id: `habit-${Date.now()}`,
      title: title.trim(),
      category,
      identityAnchor:
        identityAnchor.trim() ||
        (category === 'health'
          ? 'أنا شخص يرعى صحته وطاقته بحب'
          : category === 'work'
          ? 'أنا محترف يركز على النتائج الحقيقية'
          : 'أنا شخص هادئ ومتحكم في مجريات يومه'),
      habitStackCue: habitStackCue.trim(),
      twoMinuteVersion:
        twoMinuteVersion.trim() || 'القيام بالخطوة الأولى التمهيدية فقط لمدة دقيقتين',
      timeOfDay,
      frequency: 'daily',
      createdAt: new Date().toISOString().split('T')[0],
    };

    onAddHabit(newHabit);
    // Reset form
    setTitle('');
    setIdentityAnchor('');
    setHabitStackCue('');
    setTwoMinuteVersion('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative text-slate-100 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold font-heading">صياغة عادة ذرية جديدة</h2>
              <p className="text-xs text-slate-400">مبنية على قوانين تغيير السلوك الأربعة</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Box Toggle */}
        <div className="my-3">
          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="text-xs text-amber-400 flex items-center gap-1.5 hover:underline"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>ما هي معادلة العادات الذرية الصحيحة؟</span>
          </button>

          {showGuide && (
            <div className="mt-2 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-1.5 leading-relaxed">
              <p>
                <strong>1. صوت الهوية:</strong> ركز على من تريد أن تصبح، وليس فقط على الفعل المؤقت.
              </p>
              <p>
                <strong>2. تركيب العادات (Habit Stacking):</strong> اربط عادتك الجديدة بعادة حالية مستقرة (بعد أن [أفرغ قهوة الصباح]، سأفعل...).
              </p>
              <p>
                <strong>3. قاعدة الدقيقتين:</strong> ابدأ بإصدار مصغر لا يتجاوز دقيقتين للتغلب على كسل البداية.
              </p>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Title */}
          <div>
            <label className="block font-semibold text-slate-200 mb-1.5">
              اسم العادة اليومية <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="مثال: قراءة 15 دقيقة، تمرين المشي السريع، كتابة اليوميات..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-slate-100 text-xs transition"
            />
          </div>

          {/* Category */}
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
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Identity Anchor */}
          <div>
            <label className="block font-semibold text-slate-200 mb-1">
              صوت الهوية (من أنت عندما تمارس هذه العادة؟)
            </label>
            <input
              type="text"
              placeholder="مثال: أنا شخص يقظ يحرص على صحته ويحترم جسده"
              value={identityAnchor}
              onChange={(e) => setIdentityAnchor(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-slate-100 text-xs transition"
            />
          </div>

          {/* Habit Stacking Cue */}
          <div>
            <label className="block font-semibold text-slate-200 mb-1">
              تركيب العادة (المحفز الزمني أو الحدثي)
            </label>
            <input
              type="text"
              placeholder="مثال: بعد أن أنتهي من غسل وجهي صباحاً..."
              value={habitStackCue}
              onChange={(e) => setHabitStackCue(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-slate-100 text-xs transition"
            />
          </div>

          {/* 2-Minute Version */}
          <div>
            <label className="block font-semibold text-slate-200 mb-1">
              النسخة المصغرة (قاعدة الدقيقتين للتغلب على الكسل)
            </label>
            <input
              type="text"
              placeholder="مثال: قراءة صفحة واحدة فقط، أو ارتداء حذاء الجري والخروج أمام الباب"
              value={twoMinuteVersion}
              onChange={(e) => setTwoMinuteVersion(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-slate-100 text-xs transition"
            />
          </div>

          {/* Time of Day */}
          <div>
            <label className="block font-semibold text-slate-200 mb-1.5">
              الوقت المفضل في اليوم
            </label>
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
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
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
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition shadow-md shadow-amber-500/10 cursor-pointer"
            >
              حفظ وتثبيت العادة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
