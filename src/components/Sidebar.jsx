import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  FileText,
  Wallet,
  Settings,
  HeartPulse,
  Award,
  Receipt,
  Globe,
  X,
  Sparkles,
  Zap,
  LogOut,
  ExternalLink
} from 'lucide-react';
import { ProBadge } from './Common/ProBadge';
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
  onLogout
}) => {
  const isPro = subscription.plan === PLANS.PRO;
  const maxFreePatients = PLAN_LIMITS[PLANS.FREE].maxPacientes;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'agenda', label: 'Agenda Multisede', icon: CalendarDays },
    { id: 'pacientes', label: 'Pacientes & Clínicas', icon: Users },
    { id: 'facturas', label: 'Facturación & Recibos', icon: Receipt },
    { id: 'liquidaciones', label: 'Obras Sociales & Liq.', icon: FileText },
    { id: 'finanzas', label: 'Finanzas & Caja', icon: Wallet },
    { id: 'portal-pacientes', label: 'Portal Pacientes Web', icon: Globe, badge: turnosWebPendientesCount },
    { id: 'configuracion', label: 'Configuración & Plan', icon: Settings },
  ];

  const handleItemClick = (id) => {
    onTabChange(id);
    if (onCloseMobile) onCloseMobile();
  };

  const sidebarContent = (
    <div className="w-64 bg-[#0b1612] text-emerald-100/90 min-h-screen flex flex-col justify-between border-r border-emerald-900/80 select-none pb-safe shadow-xl relative">
      
      {/* Brand & Header */}
      <div>
        <div className="p-4 sm:p-5 border-b border-emerald-900/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
              <HeartPulse size={20} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-bold tracking-tight text-white font-display">PsicoPlus</h1>
                {isPro ? (
                  <ProBadge text="PRO" size="xs" />
                ) : (
                  <span className="text-[9px] uppercase font-bold bg-slate-800 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded">FREE</span>
                )}
              </div>
              <p className="text-[11px] text-emerald-400/70 font-medium">Gestión Clínica & Sedes</p>
            </div>
          </div>

          {/* Mobile close button */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg text-emerald-400/70 hover:text-white hover:bg-emerald-900/60 transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left relative ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-700/30'
                    : 'text-emerald-400/70 hover:text-emerald-200 hover:bg-emerald-900/40'
                }`}
              >
                <Icon size={17} className={isActive ? 'text-white' : 'text-emerald-400/60'} />
                <span className="tracking-normal text-[13px]">{item.label}</span>

                {/* Badge for portal requests */}
                {item.badge > 0 && (
                  <span className="ml-auto bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Plan Status & Professional Card */}
      <div className="p-3 space-y-2.5">
        
        {/* Freemium Upgrade Card */}
        {!isPro ? (
          <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/15 via-emerald-950/80 to-[#08100d] border border-amber-500/30 text-white">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">Plan Inicial Gratuito</span>
              <span className="text-[10px] text-emerald-300 font-mono">{pacientesCount}/{maxFreePatients} pac.</span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mb-2.5">
              <div 
                className="h-full bg-gradient-to-r from-emerald-400 to-amber-400 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min((pacientesCount / maxFreePatients) * 100, 100)}%` }}
              />
            </div>
            <button
              onClick={onOpenUpgradeModal}
              className="w-full py-2 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-extrabold text-[11px] rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles size={12} className="text-slate-950" />
              <span>Desbloquear PRO</span>
            </button>
          </div>
        ) : (
          <div className="p-2.5 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-amber-400 fill-amber-400" />
              <div>
                <span className="text-xs font-bold text-white block leading-none">PsicoPlus PRO</span>
                <span className="text-[10px] text-emerald-400 font-medium">Ilimitado Activo</span>
              </div>
            </div>
            <ProBadge text="ACTIVO" size="xs" />
          </div>
        )}

        {/* Quick Landing View link */}
        {onOpenLanding && (
          <button
            onClick={onOpenLanding}
            className="w-full px-3 py-1.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-900/40 text-[11px] font-semibold text-emerald-300 flex items-center justify-between transition-colors"
          >
            <span>Ver Landing Page Pública</span>
            <ExternalLink size={12} />
          </button>
        )}

        {/* Professional Profile Footer Card */}
        <div className="p-3 rounded-2xl bg-emerald-950/50 border border-emerald-900/50 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold text-xs">
                {config?.nombre ? config.nombre.replace(/Lic\.\s*/i, '').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'VT'}
              </div>
              <div className="w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0b1612] rounded-full absolute -bottom-0.5 -right-0.5" />
            </div>
            <div className="overflow-hidden min-w-0">
              <h4 className="text-xs font-semibold text-emerald-100 truncate">{config.nombre || 'Lic. Virna Toledo'}</h4>
              <div className="flex items-center gap-1 text-[10px] text-emerald-400/70 font-medium">
                <Award size={11} className="text-amber-400 flex-shrink-0" />
                <span className="truncate">{config.matriculaProvincial || 'M.P. 1842'}</span>
              </div>
            </div>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              title="Cambiar cuenta / Salir"
              className="p-1.5 text-emerald-400/60 hover:text-white hover:bg-emerald-900/60 rounded-lg transition-colors flex-shrink-0"
            >
              <LogOut size={14} />
            </button>
          )}
        </div>

      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-fade-in">
          <div 
            onClick={onCloseMobile}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
          />
          <div className="relative z-10 shadow-2xl h-full overflow-y-auto">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
