import React, { useState } from 'react';
import { DayLog } from '../types';
import { DO_SOMETHING_ACTIONS } from '../data/seedData';
import {
  Compass,
  Check,
  Plus,
  Trash2,
  Dices,
  ShieldAlert,
  Sparkles,
  Heart,
  Wind,
} from 'lucide-react';

interface MansonCompassViewProps {
  dayLog: DayLog;
  onSaveDayLog: (updated: DayLog) => void;
}

export const MansonCompassView: React.FC<MansonCompassViewProps> = ({
  dayLog,
  onSaveDayLog,
}) => {
  const [caredInput, setCaredInput] = useState('');
  const [letGoInput, setLetGoInput] = useState('');
  const [reflectionText, setReflectionText] = useState(dayLog.stoicReflection || '');
  const [activeRandomAction, setActiveRandomAction] = useState<typeof DO_SOMETHING_ACTIONS[0] | null>(
    DO_SOMETHING_ACTIONS[0]
  );
  const [actionDone, setActionDone] = useState(false);

  const caredList = dayLog.caredAboutToday || [
    'التركيز على صحتي وطاقتي الجسدية',
    'إنجاز عمل عميق متقن في مشروعي',
    'الصدق والوضوح في محادثاتي اليوم',
  ];

  const letGoList = dayLog.letGoToday || [
    'المقارنة مع إنجازات الآخرين على منصات التواصل',
    'الرغبة في إرضاء كل شخص على حساب طاقتي',
    'القلق بشأن نتيجة أمور لا أملك السيطرة عليها',
  ];

  const handleAddCared = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caredInput.trim()) return;
    const updated = [...caredList, caredInput.trim()];
    onSaveDayLog({ ...dayLog, caredAboutToday: updated });
    setCaredInput('');
  };

  const handleRemoveCared = (index: number) => {
    const updated = caredList.filter((_, i) => i !== index);
    onSaveDayLog({ ...dayLog, caredAboutToday: updated });
  };

  const handleAddLetGo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!letGoInput.trim()) return;
    const updated = [...letGoList, letGoInput.trim()];
    onSaveDayLog({ ...dayLog, letGoToday: updated });
    setLetGoInput('');
  };

  const handleRemoveLetGo = (index: number) => {
    const updated = letGoList.filter((_, i) => i !== index);
    onSaveDayLog({ ...dayLog, letGoToday: updated });
  };

  const handleSaveReflection = () => {
    onSaveDayLog({ ...dayLog, stoicReflection: reflectionText });
  };

  const handleRollRandomAction = () => {
    const random = DO_SOMETHING_ACTIONS[Math.floor(Math.random() * DO_SOMETHING_ACTIONS.length)];
    setActiveRandomAction(random);
    setActionDone(false);
  };

  return (
    <div className="space-y-6">
      {/* Intro Hero Quote from Mark Manson */}
      <div className="rounded-2xl p-6 bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/20 relative overflow-hidden">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-2">
          <Compass className="w-4 h-4" />
          <span>فلسفة فن اللامبالاة (Mark Manson)</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white font-heading leading-snug">
          &quot;طاقتك محدودة جداً. إذا أكترثت لكل شيء، ستستنزف في كل شيء.&quot;
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed max-w-2xl">
          اللامبالاة الذكية لا تعني البرود أو التبلد؛ بل تعني اختيار معاركك بعناية، والتصالح مع المعاناة المفيدة، ورفض استهلاك عقلك في تفاهات لا تضيف لقيمك.
        </p>
      </div>

      {/* The F*cks Matrix: What Matters vs What to Ignore */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Box 1: Things Worth Caring About */}
        <div className="rounded-2xl p-5 bg-slate-900/70 border border-emerald-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white font-heading">
                  ما يستحق اكتراثي وطاقتي اليوم
                </h3>
              </div>
              <span className="text-xs text-emerald-400 font-semibold">قيم جوهرية</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              الأمور الحقيقية التي تقع في دائرة تأثيرك وتستحق بذل الجهد والمعاناة من أجلها:
            </p>

            <ul className="space-y-2 mb-4">
              {caredList.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-200"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveCared(idx)}
                    className="text-slate-400 hover:text-rose-400 p-1 cursor-pointer transition"
                    title="حذف"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={handleAddCared} className="flex gap-2 mt-2">
            <input
              type="text"
              placeholder="أضف أمراً يستحق اكتراثك اليوم..."
              value={caredInput}
              onChange={(e) => setCaredInput(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة</span>
            </button>
          </form>
        </div>

        {/* Box 2: Things to Drop / Don't Give a F*ck */}
        <div className="rounded-2xl p-5 bg-slate-900/70 border border-rose-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Wind className="w-5 h-5 text-rose-400" />
                <h3 className="text-base font-bold text-white font-heading">
                  ما أتركه للريح ولا أبالي به اليوم
                </h3>
              </div>
              <span className="text-xs text-rose-400 font-semibold">تصفية الضجيج</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              التوافه، القلق على ما لا تملك، والآراء العابرة التي تقرر إسقاطها من حساباتك:
            </p>

            <ul className="space-y-2 mb-4">
              {letGoList.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-200"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveLetGo(idx)}
                    className="text-slate-400 hover:text-rose-400 p-1 cursor-pointer transition"
                    title="حذف"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={handleAddLetGo} className="flex gap-2 mt-2">
            <input
              type="text"
              placeholder="أضف ضجيجاً قررت تجاهله واللامبالاة به..."
              value={letGoInput}
              onChange={(e) => setLetGoInput(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 outline-none focus:border-rose-500"
            />
            <button
              type="submit"
              className="px-3 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إسقاط</span>
            </button>
          </form>
        </div>
      </div>

      {/* The "Do Something" Principle Micro Action Generator */}
      <div className="rounded-2xl p-6 bg-slate-900/60 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
              <Dices className="w-4 h-4" />
              <span>مبدأ &quot;افعل أي شيء&quot; (The Do Something Principle)</span>
            </div>
            <h3 className="text-lg font-bold text-white font-heading">
              هل تشعر بالكسل أو العجز عن البدء؟
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              لا تنتظر هبوط الحافز؛ الحركة تسبق الإلهام. نفذ هذه المهمة المصغرة الآن في أقل من دقيقتين.
            </p>
          </div>

          <button
            onClick={handleRollRandomAction}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs transition cursor-pointer self-start sm:self-center shrink-0"
          >
            <Dices className="w-4 h-4" />
            <span>تدوير خطوة جديدة</span>
          </button>
        </div>

        {activeRandomAction && (
          <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{activeRandomAction.title}</span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {activeRandomAction.desc}
              </p>
            </div>

            <button
              onClick={() => setActionDone(!actionDone)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                actionDone
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{actionDone ? 'تم التنفيذ بنجاح!' : 'أنجزتها الآن'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Escaping the Feedback Loop from Hell (Stoic Reflection) */}
      <div className="rounded-2xl p-6 bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
          <ShieldAlert className="w-4 h-4" />
          <span>تفكيك حلقة التغذية الراجعة من الجحيم</span>
        </div>
        <h3 className="text-base font-bold text-white font-heading">
          تأمل وتقبل اليوم: لا تلم نفسك لأنك تشعر بالإحباط
        </h3>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          حين تفوتك عادة، الخطأ الأكبر هو الدخول في جلد الذات (&quot;أنا شخص فاشل لأنني تكاسلت&quot;). اكتب هنا اعترافاً هادئاً وتقبلاً للواقع مع عهد باستعادة العادة غداً:
        </p>

        <textarea
          rows={3}
          value={reflectionText}
          onChange={(e) => setReflectionText(e.target.value)}
          placeholder="مثال: اليوم كان شاقاً ولم أتمكن من القراءة 15 دقيقة، لكني أتقبل ذلك دون غضب. وغداً سأقوم بدقيقتين على الأقل..."
          className="w-full mt-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-amber-500 transition leading-relaxed resize-none"
        />

        <div className="mt-3 flex justify-end">
          <button
            onClick={handleSaveReflection}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition cursor-pointer"
          >
            حفظ التأمل في سجل اليوم
          </button>
        </div>
      </div>
    </div>
  );
};
