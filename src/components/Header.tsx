import React from 'react';
import { PWAInstallButton } from './PWAInstallButton';
import { Sparkles, Compass, CheckCircle2, UserCheck, BarChart3, Bot } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAddModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
}) => {
  const navItems = [
    { id: 'today', label: 'اليوم والتتبع', icon: CheckCircle2 },
    { id: 'compass', label: 'بوصلة اللامبالاة', icon: Compass },
    { id: 'identity', label: 'محرك الهوية', icon: UserCheck },
    { id: 'analytics', label: 'التحليلات والمسار', icon: BarChart3 },
    { id: 'coach', label: 'المستشار الذكي', icon: Bot },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black text-lg">
            أ
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-white font-heading whitespace-nowrap">
              أثر
            </span>
            <span className="hidden sm:inline text-[10px] text-slate-400 whitespace-nowrap -mt-1">
              عادات ذرية · فن اللامبالاة
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-slate-800 text-amber-400 font-semibold shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <PWAInstallButton variant="header" />
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-500/10 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span className="hidden sm:inline">عادة ذرية جديدة</span>
            <span className="sm:hidden">إضافة عادة</span>
          </button>
        </div>
      </div>
    </header>
  );
};
