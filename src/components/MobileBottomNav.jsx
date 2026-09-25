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
    { id: 'dashboard', label: 'Hoy', icon: LayoutDashboard },
    { id: 'agenda', label: 'Agenda', icon: CalendarDays },
    { id: 'pacientes', label: 'Pacientes', icon: Users },
    { id: 'facturas', label: 'Facturas', icon: Receipt },
  ];

  const itemBase = 'relative flex-1 min-h-[52px] flex flex-col items-center justify-center gap-0.5 rounded-xl active:scale-95 transition-[color,transform] duration-150';

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed bottom-0 inset-x-0 z-40 md:hidden pb-safe select-none bg-[var(--bg-card)]/92 backdrop-blur-md border-t border-[var(--border-color)]"
    >
      <div className="flex items-stretch px-2 pt-1 max-w-md mx-auto">
        {primaryTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`${itemBase} ${isActive ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-500 dark:text-slate-400'}`}
            >
              <span className={`absolute top-0 h-[3px] w-6 rounded-b-full transition-opacity duration-200 ${isActive ? 'opacity-100 bg-emerald-600 dark:bg-emerald-300' : 'opacity-0'}`} />
              <Icon size={21} strokeWidth={isActive ? 2.1 : 1.8} />
              <span className={`text-[11px] ${isActive ? 'font-semibold' : 'font-medium'}`}>{tab.label}</span>
            </button>
          );
        })}

        <button onClick={onOpenMenu} className={`${itemBase} text-slate-500 dark:text-slate-400`}>
          <Menu size={21} strokeWidth={1.8} />
          <span className="text-[11px] font-medium">Más</span>
          {turnosWebPendientesCount > 0 && (
            <span className="absolute top-2 right-[calc(50%-16px)] w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[var(--bg-card)]" />
          )}
        </button>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
