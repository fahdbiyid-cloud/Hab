import React, { useState } from 'react';
import { Habit, IdentityProfile, DayLog } from '../types';
import {
  UserCheck,
  Award,
  Layers,
  Save,
  Clock,
  ArrowDown,
  CheckCircle2,
} from 'lucide-react';

interface IdentityEngineViewProps {
  identity: IdentityProfile;
  habits: Habit[];
  dayLogs: Record<string, DayLog>;
  onSaveIdentity: (updated: IdentityProfile) => void;
}

export const IdentityEngineView: React.FC<IdentityEngineViewProps> = ({
  identity,
  habits,
  dayLogs,
  onSaveIdentity,
}) => {
  const [primaryIdentity, setPrimaryIdentity] = useState(identity.primaryIdentity);
  const [coreValuesText, setCoreValuesText] = useState(identity.coreValues.join('\n'));
  const [thingsToIgnoreText, setThingsToIgnoreText] = useState(identity.thingsToIgnore.join('\n'));
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Calculate cumulative identity votes cast historically
  const categoryVotes = {
    health: 0,
    work: 0,
    daily: 0,
  };

  const habitCategoryMap = new Map<string, Habit['category']>();
  habits.forEach((h) => habitCategoryMap.set(h.id, h.category));

  Object.values(dayLogs).forEach((log) => {
    log.completedHabitIds?.forEach((hid) => {
      const cat = habitCategoryMap.get(hid);
      if (cat) {
        categoryVotes[cat] = (categoryVotes[cat] || 0) + 1;
      }
    });
  });

  const totalVotes = categoryVotes.health + categoryVotes.work + categoryVotes.daily;

  const handleSave = () => {
    const updated: IdentityProfile = {
      primaryIdentity: primaryIdentity.trim(),
      coreValues: coreValuesText.split('\n').map((s) => s.trim()).filter(Boolean),
      thingsToIgnore: thingsToIgnoreText.split('\n').map((s) => s.trim()).filter(Boolean),
    };
    onSaveIdentity(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Group habits by time of day for Habit Stacking Blueprint
  const morningHabits = habits.filter((h) => h.timeOfDay === 'morning');
  const afternoonHabits = habits.filter((h) => h.timeOfDay === 'afternoon');
  const eveningHabits = habits.filter((h) => h.timeOfDay === 'evening');

  return (
    <div className="space-y-6">
      {/* Identity Core Header */}
      <div className="rounded-2xl p-6 bg-slate-900/70 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
          <UserCheck className="w-4 h-4" />
          <span>المستوى الأعمق لتغيير السلوك (Atomic Habits)</span>
        </div>
        <h2 className="text-xl font-black text-white font-heading">
          العادات القائمة على الهوية (Identity-Based Habits)
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
          الهدف ليس قراءة كتاب، بل أن تصبح قارئاً. الهدف ليس الركض في سباق، بل أن تصبح شخصاً رياضياً. هويتك هي ما تبنيه بأصواتك اليومية الصغيرة.
        </p>

        {/* Primary Identity Definition */}
        <div className="mt-4 pt-4 border-t border-slate-800">
          <label className="block text-xs font-bold text-slate-200 mb-1.5">
            بيان الهوية الذي ترغب في ترسيخه:
          </label>
          <textarea
            rows={2}
            value={primaryIdentity}
            onChange={(e) => setPrimaryIdentity(e.target.value)}
            className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-amber-300 font-semibold outline-none focus:border-amber-500 transition leading-relaxed resize-none"
            placeholder="من هو الشخص الذي تسعى لأن تكونه؟"
          />
        </div>
      </div>

      {/* Cumulative Identity Votes Cards */}
      <div>
        <h3 className="text-sm font-bold text-slate-200 font-heading mb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          <span>رصيد أصوات الهوية التراكمي (أفعالك الحقيقية)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs text-slate-400">إجمالي الأصوات</span>
            <div className="text-2xl font-black text-white font-heading tabular-nums mt-1">
              {totalVotes}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">تصويت للهوية</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-emerald-500/20">
            <span className="text-xs text-emerald-400 font-medium">الهوية الصحية والبدنية</span>
            <div className="text-2xl font-black text-white font-heading tabular-nums mt-1">
              {categoryVotes.health}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">تصويت رياضي وصحي</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-blue-500/20">
            <span className="text-xs text-blue-400 font-medium">الهوية المهنية والإنتاجية</span>
            <div className="text-2xl font-black text-white font-heading tabular-nums mt-1">
              {categoryVotes.work}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">تصويت تركيز وإنجاز</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-amber-500/20">
            <span className="text-xs text-amber-400 font-medium">الهوية الشخصية والهدوء</span>
            <div className="text-2xl font-black text-white font-heading tabular-nums mt-1">
              {categoryVotes.daily}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">تصويت حكمة وسلام</span>
          </div>
        </div>
      </div>

      {/* Habit Stacking Blueprints (سلاسل تراكيب العادات) */}
      <div className="rounded-2xl p-6 bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
          <Layers className="w-4 h-4" />
          <span>هندسة الروتين اليومي</span>
        </div>
        <h3 className="text-base font-bold text-white font-heading">
          سلاسل تراكيب العادات (Habit Stacking Chains)
        </h3>
        <p className="text-xs text-slate-400 mt-1 mb-5">
          معادلة جيمس كلير: بعد [العادة الحالية]، سأقوم بـ [العادة الجديدة]. هذا التسلسل يزيل الحيرة العقلية ويجعل التنفيذ تلقائياً.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Morning Routine Chain */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-3">
              <Clock className="w-3.5 h-3.5" />
              <span>سلسلة الصباح المتتابعة</span>
            </div>
            {morningHabits.length === 0 ? (
              <p className="text-xs text-slate-400">لا توجد عادات صباحية مخصصة.</p>
            ) : (
              <div className="space-y-2">
                {morningHabits.map((h, i) => (
                  <div key={h.id}>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                      <div className="font-semibold text-slate-200">{h.title}</div>
                      {h.habitStackCue && (
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          🔗 المحفز: {h.habitStackCue}
                        </div>
                      )}
                    </div>
                    {i < morningHabits.length - 1 && (
                      <div className="flex justify-center py-1">
                        <ArrowDown className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Afternoon Routine Chain */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 mb-3">
              <Clock className="w-3.5 h-3.5" />
              <span>سلسلة منتصف اليوم والعمل</span>
            </div>
            {afternoonHabits.length === 0 ? (
              <p className="text-xs text-slate-400">لا توجد عادات ظهيرة مخصصة.</p>
            ) : (
              <div className="space-y-2">
                {afternoonHabits.map((h, i) => (
                  <div key={h.id}>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                      <div className="font-semibold text-slate-200">{h.title}</div>
                      {h.habitStackCue && (
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          🔗 المحفز: {h.habitStackCue}
                        </div>
                      )}
                    </div>
                    {i < afternoonHabits.length - 1 && (
                      <div className="flex justify-center py-1">
                        <ArrowDown className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Evening Routine Chain */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-400 mb-3">
              <Clock className="w-3.5 h-3.5" />
              <span>سلسلة المساء والهدوء</span>
            </div>
            {eveningHabits.length === 0 ? (
              <p className="text-xs text-slate-400">لا توجد عادات مسائية مخصصة.</p>
            ) : (
              <div className="space-y-2">
                {eveningHabits.map((h, i) => (
                  <div key={h.id}>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                      <div className="font-semibold text-slate-200">{h.title}</div>
                      {h.habitStackCue && (
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          🔗 المحفز: {h.habitStackCue}
                        </div>
                      )}
                    </div>
                    {i < eveningHabits.length - 1 && (
                      <div className="flex justify-center py-1">
                        <ArrowDown className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Manson Values Matrix (Customization) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl p-5 bg-slate-900/60 border border-slate-800">
          <h4 className="text-xs font-bold text-emerald-400 mb-1">
            قيمي الجيدة (المعايير الداخلية التي أتحكم بها)
          </h4>
          <p className="text-[11px] text-slate-400 mb-2">
            اكتب قيمة واحدة في كل سطر (مثل: الصدق، المسؤولية، التعلم):
          </p>
          <textarea
            rows={4}
            value={coreValuesText}
            onChange={(e) => setCoreValuesText(e.target.value)}
            className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-emerald-500 transition leading-relaxed resize-none"
          />
        </div>

        <div className="rounded-2xl p-5 bg-slate-900/60 border border-slate-800">
          <h4 className="text-xs font-bold text-rose-400 mb-1">
            قائمة ما أرفض الاكتراث له (الضجيج الخارجي)
          </h4>
          <p className="text-[11px] text-slate-400 mb-2">
            اكتب أمراً واحداً في كل سطر تختار بوعي عدم استهلاك طاقتك فيه:
          </p>
          <textarea
            rows={4}
            value={thingsToIgnoreText}
            onChange={(e) => setThingsToIgnoreText(e.target.value)}
            className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-rose-500 transition leading-relaxed resize-none"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-md shadow-amber-500/10 cursor-pointer"
        >
          {saveSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-slate-950" />
              <span>تم حفظ بروفايل الهوية بنجاح</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>حفظ تعديلات الهوية والقيم</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
