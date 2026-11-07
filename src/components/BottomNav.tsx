import React from 'react';
import { CheckCircle2, Compass, UserCheck, BarChart3, Bot } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'today', label: 'اليوم', icon: CheckCircle2 },
    { id: 'compass', label: 'اللامبالاة', icon: Compass },
    { id: 'identity', label: 'الهوية', icon: UserCheck },
    { id: 'analytics', label: 'المسار', icon: BarChart3 },
    { id: 'coach', label: 'المستشار', icon: Bot },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/80 pb-safe md:hidden shadow-2xl">
      <div className="grid grid-cols-5 items-center h-16 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] relative cursor-pointer text-slate-400 active:scale-95 transition-transform"
            >
              <div
                className={`p-1.5 rounded-xl transition-colors ${
                  isActive ? 'bg-amber-500/15 text-amber-400' : 'text-slate-400'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>
              <span
                className={`text-[10px] tracking-tight mt-0.5 whitespace-nowrap font-medium ${
                  isActive ? 'text-amber-400 font-bold' : 'text-slate-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
