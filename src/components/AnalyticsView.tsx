import React, { useState } from 'react';
import { Habit, DayLog, HabitStats } from '../types';
import { calculateHabitStats, exportBackupData, importBackupData } from '../utils/storage';
import {
  BarChart3,
  Flame,
  Download,
  Upload,
  CheckCircle2,
  Calendar,
  AlertCircle,
} from 'lucide-react';

interface AnalyticsViewProps {
  habits: Habit[];
  dayLogs: Record<string, DayLog>;
  onRefreshData: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  habits,
  dayLogs,
  onRefreshData,
}) => {
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Generate 28-day / 4-week activity calendar
  const last28Days = [];
  for (let i = 27; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dStr = d.toISOString().split('T')[0];
    const log = dayLogs[dStr];
    const count = log?.completedHabitIds?.length || 0;
    last28Days.push({ date: dStr, count, day: d.getDate() });
  }

  // Calculate habit stats for each habit
  const habitStatsList: { habit: Habit; stats: HabitStats }[] = habits.map((h) => ({
    habit: h,
    stats: calculateHabitStats(h.id, dayLogs),
  }));

  // Sort by highest streak
  habitStatsList.sort((a, b) => b.stats.streak - a.stats.streak);

  const handleExport = () => {
    const jsonStr = exportBackupData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `athar-habits-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importBackupData(content);
      if (success) {
        setImportStatus('success');
        onRefreshData();
      } else {
        setImportStatus('error');
      }
      setTimeout(() => setImportStatus(null), 3000);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Heatmap Section */}
      <div className="rounded-2xl p-6 bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
          <Calendar className="w-4 h-4" />
          <span>سجل الانضباط التراكمي (آخر 28 يوماً)</span>
        </div>
        <h3 className="text-base font-bold text-white font-heading">
          خريطة الاستمرارية وتجنب الانقطاع
        </h3>
        <p className="text-xs text-slate-400 mt-0.5 mb-4">
          كل مربع يمثل يوماً كاملاً؛ الألوان الأكثر توهجاً تعني إنجاز عدد أكبر من عاداتك اليومية.
        </p>

        {/* Heatmap Grid */}
        <div className="grid grid-cols-7 sm:grid-cols-14 gap-2 pt-2">
          {last28Days.map((item) => {
            let bgClass = 'bg-slate-950 border-slate-800/80 text-slate-400';
            if (item.count >= 5) {
              bgClass = 'bg-amber-500 text-slate-950 font-bold border-amber-400';
            } else if (item.count >= 3) {
              bgClass = 'bg-amber-500/70 text-slate-950 font-bold border-amber-500/80';
            } else if (item.count >= 1) {
              bgClass = 'bg-amber-500/25 text-amber-300 border-amber-500/40';
            }

            return (
              <div
                key={item.date}
                className={`flex flex-col items-center justify-center h-11 rounded-xl border text-xs transition ${bgClass}`}
                title={`${item.date}: تم إنجاز ${item.count} عادة`}
              >
                <span className="text-[10px] opacity-75">{item.day}</span>
                <span className="text-[11px] font-black">{item.count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Habit Streaks Leaderboard */}
      <div className="rounded-2xl p-6 bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
          <Flame className="w-4 h-4" />
          <span>أطول السلاسل الحالية والسابقة</span>
        </div>
        <h3 className="text-base font-bold text-white font-heading mb-4">
          أداء عاداتك وتصويتك المستمر
        </h3>

        <div className="space-y-3">
          {habitStatsList.map(({ habit, stats }) => (
            <div
              key={habit.id}
              className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-100 truncate">
                    {habit.title}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    ({habit.category === 'health' ? 'صحة' : habit.category === 'work' ? 'عمل' : 'شخصي'})
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                  <span>إجمالي الإنجاز: {stats.totalCompletions} مرة</span>
                  <span aria-hidden="true">·</span>
                  <span>نسبة الشهر: {stats.completionRate}%</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-left shrink-0">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold tabular-nums">
                  <Flame className="w-4 h-4 fill-amber-400" />
                  <span>{stats.streak} يوم</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Backup, Export & Restore Section */}
      <div className="rounded-2xl p-6 bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
          <BarChart3 className="w-4 h-4" />
          <span>أمان البيانات والنسخ الاحتياطي (Local-First)</span>
        </div>
        <h3 className="text-base font-bold text-white font-heading">
          تصدير واستيراد بياناتك بالكامل
        </h3>
        <p className="text-xs text-slate-400 mt-1 mb-4 leading-relaxed">
          بيانات عاداتك وتأملاتك محفوظة بأمان على جهازك أو هاتفك. يمكنك في أي وقت تنزيل ملف نسخة احتياطية ونقله إلى أي هاتف آخر.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>تصدير نسخة احتياطية (JSON)</span>
          </button>

          <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>استيراد واستعادة من ملف</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>
        </div>

        {importStatus === 'success' && (
          <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>تم استيراد واستعادة كافة العادات والسجلات بنجاح!</span>
          </div>
        )}

        {importStatus === 'error' && (
          <div className="mt-3 flex items-center gap-2 text-xs text-rose-400">
            <AlertCircle className="w-4 h-4" />
            <span>تعذر استيراد الملف، تأكد من صحة تنسيق JSON.</span>
          </div>
        )}
      </div>
    </div>
  );
};
