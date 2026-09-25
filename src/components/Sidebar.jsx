import React, { useState } from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  FileText,
  Wallet,
  Settings,
  Receipt,
  Globe,
  X,
  Sparkles,
  LogOut,
  ExternalLink,
  ShieldCheck,
  PanelLeftClose,
  PanelLeftOpen,
  BadgeCheck,
} from 'lucide-react';
import { ProBadge } from './Common/ProBadge';
import { BrandMark, BrandWordmark } from './Common/BrandMark';
import { PLANS, PLAN_LIMITS } from '../services/subscription';

export const Sidebar = ({
  activeTab,
  onTabChange,
  config,
  subscription = { plan: PLANS.FREE },
  pacientesCount = 0,
  turnosWebPendientesCount = 0,
  isMobileOpen = false,
  onCloseMobile,
  onOpenUpgradeModal,
  onOpenLanding,
  onLogout,
  onOpenLegal
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isPro = subscription.plan === PLANS.PRO;
  const maxFreePatients = PLAN_LIMITS[PLANS.FREE]?.maxPacientes || 15;
  const usagePct = Math.min((pacientesCount / maxFreePatients) * 100, 100);

  const groups = [
    {
      title: 'Clínica',
      items: [
        { id: 'dashboard', label: 'Consultorio en Vivo', icon: LayoutDashboard },
        { id: 'agenda', label: 'Agenda', icon: CalendarDays },
        { id: 'pacientes', label: 'Pacientes', icon: Users },
        { id: 'portal-pacientes', label: 'Portal Pacientes', icon: Globe, badge: turnosWebPendientesCount },
      ],
    },
    {
      title: 'Administración',
      items: [
        { id: 'facturas', label: 'Facturación ARCA', icon: Receipt },
        { id: 'liquidaciones', label: 'Obras Sociales', icon: FileText },
        { id: 'finanzas', label: 'Finanzas', icon: Wallet },
      ],
    },
  ];

  const settingsItem = { id: 'configuracion', label: 'Configuración', icon: Settings };

  // En móvil, cualquier acción del menú cierra el cajón antes de ejecutarse
  const closeThen = (fn) => (...args) => {
    if (onCloseMobile) onCloseMobile();
    if (fn) fn(...args);
  };

  const handleItemClick = (id) => {
    onTabChange(id);
    if (onCloseMobile) onCloseMobile();
  };

  const initials = config?.nombre
    ? config.nombre.replace(/Lic\.\s*/i, '').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'VT';

  const renderNavItem = (item) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;
    return (
      <button
        key={item.id}
        onClick={() => handleItemClick(item.id)}
        title={isCollapsed ? item.label : undefined}
        aria-current={isActive ? 'page' : undefined}
        className={`group relative flex items-center rounded-lg text-left transition-colors duration-150 ${
          isCollapsed ? 'w-10 h-10 justify-center mx-auto' : 'w-full gap-3 px-2.5 h-9'
        } ${
          isActive
            ? 'bg-[var(--bg-card)] text-slate-900 dark:text-slate-50 shadow-[0_1px_2px_rgba(27,29,26,0.06),0_0_0_1px_var(--border-color)]'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-900/[0.04] dark:hover:bg-white/[0.04]'
        }`}
      >
        {isActive && !isCollapsed && (
          <span className="absolute -left-3 top-2 bottom-2 w-[3px] rounded-r-full bg-emerald-600 dark:bg-emerald-300" />
        )}
        <Icon
          size={17}
          strokeWidth={isActive ? 2.1 : 1.8}
          className={isActive ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'}
        />
        {!isCollapsed && <span className="text-[13.5px] font-medium tracking-[-0.005em]">{item.label}</span>}
        {item.badge > 0 && (
          <span
            className={`${isCollapsed ? 'absolute top-1 right-1 w-2 h-2 p-0' : 'ml-auto min-w-5 h-5 px-1.5'} grid place-items-center rounded-full bg-rose-500 text-white text-[10.5px] font-semibold`}
          >
            {!isCollapsed && item.badge}
          </span>
        )}
      </button>
    );
  };

  const sidebarContent = (
    <div
      className={`${isCollapsed ? 'w-[72px]' : 'w-[248px]'} h-full min-h-screen bg-[var(--bg-sidebar)] border-r border-[var(--border-color)] flex flex-col select-none pb-safe transition-[width] duration-200 ease-out`}
    >
      {/* Marca */}
      <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-4'}`}>
        <div className="flex items-center gap-2.5">
          <BrandMark size={32} />
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <BrandWordmark className="text-slate-900 dark:text-slate-50" />
              {isPro ? (
                <ProBadge text="PRO" size="xs" />
              ) : (
                <span className="text-[10px] font-medium text-slate-500 border border-[var(--border-color)] px-1.5 py-px rounded-md">Free</span>
              )}
            </div>
          )}
        </div>

        {!isCollapsed && onCloseMobile && isMobileOpen && (
          <button
            onClick={onCloseMobile}
            aria-label="Cerrar menú"
            className="md:hidden w-9 h-9 grid place-items-center rounded-lg text-slate-500 hover:bg-slate-900/5"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navegación */}
      <nav className={`flex-1 overflow-y-auto ${isCollapsed ? 'px-2' : 'px-3'} pt-2 space-y-6`} aria-label="Principal">
        {groups.map((group) => (
          <div key={group.title} className="space-y-0.5">
            {!isCollapsed ? (
              <p className="px-2.5 pb-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-500">{group.title}</p>
            ) : (
              <div className="mx-auto mb-2 w-5 h-px bg-[var(--border-color)]" />
            )}
            {group.items.map((item) => renderNavItem(item))}
          </div>
        ))}
        <div className="space-y-0.5">
          {isCollapsed && <div className="mx-auto mb-2 w-5 h-px bg-[var(--border-color)]" />}
          {renderNavItem(settingsItem)}
        </div>
      </nav>

      {/* Pie: plan, enlaces y perfil */}
      <div className={`${isCollapsed ? 'px-2' : 'px-3'} pb-3 pt-3 space-y-2`}>
        {!isPro ? (
          !isCollapsed ? (
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-3">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-[12.5px] font-medium text-slate-800 dark:text-slate-200">Plan inicial</span>
                <span className="text-[11.5px] text-slate-500 font-mono">{pacientesCount}/{maxFreePatients} pacientes</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden mb-3" role="progressbar" aria-valuenow={Math.round(usagePct)} aria-valuemin={0} aria-valuemax={100}>
                <div
                  className={`h-full rounded-full transition-[width] duration-500 ${usagePct >= 80 ? 'bg-amber-500' : 'bg-emerald-600 dark:bg-emerald-400'}`}
                  style={{ width: `${usagePct}%` }}
                />
              </div>
              <button
                onClick={closeThen(onOpenUpgradeModal)}
                className="w-full h-8 rounded-lg bg-slate-900 text-[#f4f1e8] dark:bg-slate-100 dark:text-slate-900 text-[12.5px] font-medium flex items-center justify-center gap-1.5 hover:bg-slate-800 active:scale-[0.97] transition-[background-color,transform] duration-150"
              >
                <Sparkles size={13} />
                Pasar a PRO
              </button>
            </div>
          ) : (
            <button
              onClick={closeThen(onOpenUpgradeModal)}
              title="Pasar a PRO"
              className="w-10 h-10 mx-auto rounded-lg bg-slate-900 text-[#f4f1e8] dark:bg-slate-100 dark:text-slate-900 grid place-items-center active:scale-95 transition-transform"
            >
              <Sparkles size={16} />
            </button>
          )
        ) : (
          !isCollapsed && (
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-2.5 flex items-center gap-2">
              <BadgeCheck size={16} className="text-emerald-600 dark:text-emerald-300" />
              <span className="text-[12.5px] font-medium">PsicoPlus PRO activo</span>
            </div>
          )
        )}

        {!isCollapsed && (onOpenLanding || onOpenLegal) && (
          <div className="flex flex-col">
            {onOpenLanding && (
              <button
                onClick={closeThen(onOpenLanding)}
                className="h-8 px-2.5 rounded-lg text-[12.5px] text-slate-600 dark:text-slate-400 hover:bg-slate-900/[0.04] dark:hover:bg-white/[0.04] hover:text-slate-900 flex items-center justify-between transition-colors"
              >
                <span>Ver sitio público</span>
                <ExternalLink size={13} className="text-slate-400" />
              </button>
            )}
            {onOpenLegal && (
              <button
                onClick={closeThen(() => onOpenLegal('auditoria'))}
                className="h-8 px-2.5 rounded-lg text-[12.5px] text-slate-600 dark:text-slate-400 hover:bg-slate-900/[0.04] dark:hover:bg-white/[0.04] hover:text-slate-900 flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
                  Seguridad · Ley 25.326
                </span>
              </button>
            )}
          </div>
        )}

        <div className={`flex items-center ${isCollapsed ? 'flex-col gap-2' : 'gap-2.5 pt-2 border-t border-[var(--border-color)]'}`}>
          <div
            className="relative w-9 h-9 flex-shrink-0 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 grid place-items-center text-[12px] font-semibold"
            title={config?.nombre || 'Lic. Profesional'}
          >
            {initials}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[var(--bg-sidebar)]" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-slate-900 dark:text-slate-100 truncate">{config?.nombre || 'Lic. Profesional'}</p>
              <p className="text-[11.5px] text-slate-500 truncate">{config?.matriculaProvincial || 'M.P. 1842'}</p>
            </div>
          )}
          {!isCollapsed && onLogout && (
            <button
              onClick={closeThen(onLogout)}
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
              className="w-8 h-8 grid place-items-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-900/[0.05] dark:hover:bg-white/[0.05] dark:hover:text-slate-100 transition-colors"
            >
              <LogOut size={15} />
            </button>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`hidden md:flex items-center gap-2 h-8 rounded-lg text-[12px] text-slate-500 hover:text-slate-800 hover:bg-slate-900/[0.04] dark:hover:bg-white/[0.04] dark:hover:text-slate-200 transition-colors ${isCollapsed ? 'w-10 mx-auto justify-center' : 'w-full px-2.5'}`}
          title={isCollapsed ? 'Expandir barra lateral' : 'Colapsar barra lateral'}
        >
          {isCollapsed ? <PanelLeftOpen size={15} /> : <><PanelLeftClose size={15} /> Colapsar</>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:block flex-shrink-0 sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div onClick={onCloseMobile} className="fixed inset-0 bg-slate-950/40 backdrop-blur-[2px] animate-[backdropIn_.2s_ease-out]" />
          <div className="relative z-10 h-full overflow-y-auto shadow-[var(--shadow-pop)] animate-[drawerIn_.28s_cubic-bezier(.23,1,.32,1)]">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
