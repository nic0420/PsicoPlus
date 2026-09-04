import React from 'react';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Users, 
  Receipt, 
  Menu
} from 'lucide-react';

export const MobileBottomNav = ({ 
  activeTab, 
  onTabChange, 
  onOpenMenu,
  turnosWebPendientesCount = 0
}) => {
  const primaryTabs = [
    { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard },
    { id: 'agenda', label: 'Agenda', icon: CalendarDays },
    { id: 'pacientes', label: 'Pacientes', icon: Users },
    { id: 'facturas', label: 'Facturas', icon: Receipt },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden glass-panel border-t border-slate-200/80 dark:border-slate-800/80 pb-safe shadow-lg bg-white/95 dark:bg-[#060e09]/95 backdrop-blur-md select-none">
      <div className="flex items-center justify-around px-2 py-1.5">
        {primaryTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all relative ${
                isActive 
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-emerald-600'
              }`}
            >
              <div className={`p-1 rounded-lg transition-all ${
                isActive ? 'bg-emerald-50 dark:bg-emerald-950/60' : ''
              }`}>
                <Icon size={19} />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{tab.label}</span>
            </button>
          );
        })}

        {/* More / Full Menu */}
        <button
          onClick={onOpenMenu}
          className="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl text-slate-500 dark:text-slate-400 hover:text-emerald-600 transition-all relative"
        >
          <div className="p-1 rounded-lg">
            <Menu size={19} />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Menú</span>
          {turnosWebPendientesCount > 0 && (
            <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-rose-500" />
          )}
        </button>
      </div>
    </nav>
  );
};
