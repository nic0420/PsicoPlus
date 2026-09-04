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
  Sparkles
} from 'lucide-react';

export const Sidebar = ({ 
  activeTab, 
  onTabChange, 
  config,
  turnosWebPendientesCount = 0,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'agenda', label: 'Agenda Multisede', icon: CalendarDays },
    { id: 'pacientes', label: 'Pacientes & Clínicas', icon: Users },
    { id: 'facturas', label: 'Facturación & Recibos', icon: Receipt },
    { id: 'liquidaciones', label: 'Obras Sociales & Liq.', icon: FileText },
    { id: 'finanzas', label: 'Finanzas & Caja', icon: Wallet },
    { id: 'portal-pacientes', label: 'Portal Pacientes Web', icon: Globe, badge: turnosWebPendientesCount },
    { id: 'configuracion', label: 'Configuración', icon: Settings },
  ];

  const handleItemClick = (id) => {
    onTabChange(id);
    if (onCloseMobile) onCloseMobile();
  };

  const sidebarContent = (
    <div className="w-64 bg-[#0b1612] text-emerald-100/90 min-h-screen flex flex-col justify-between border-r border-emerald-900/80 select-none pb-safe shadow-xl relative">
      
      {/* Brand & Header */}
      <div>
        <div className="p-5 border-b border-emerald-900/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
              <HeartPulse size={20} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-bold tracking-tight text-white font-display">PsicoPlus</h1>
                <span className="text-[10px] uppercase font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded">PRO</span>
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

      {/* Professional Footer Card */}
      <div className="p-3.5 m-3 rounded-2xl bg-emerald-950/50 border border-emerald-900/50 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold text-xs">
              {config?.nombre ? config.nombre.replace(/Lic\.\s*/i, '').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'VT'}
            </div>
            <div className="w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0b1612] rounded-full absolute -bottom-0.5 -right-0.5" />
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-semibold text-emerald-100 truncate">{config.nombre || 'Lic. Virna Toledo'}</h4>
            <div className="flex items-center gap-1 text-[10px] text-emerald-400/70 font-medium">
              <Award size={11} className="text-amber-400" />
              <span className="truncate">{config.matriculaProvincial || 'M.P. 1842'}</span>
            </div>
          </div>
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
