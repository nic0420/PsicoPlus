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
  ChevronRight,
  CircleHelp,
} from 'lucide-react';

export const Sidebar = ({
  activeTab,
  onTabChange,
  config,
  turnosWebPendientesCount = 0,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const groups = [
    {
      label: 'Tu jornada',
      items: [
        { id: 'dashboard', label: 'Resumen', description: 'Vista general', icon: LayoutDashboard },
        { id: 'agenda', label: 'Agenda', description: 'Turnos y horarios', icon: CalendarDays },
        { id: 'pacientes', label: 'Pacientes', description: 'Historias y seguimiento', icon: Users },
      ],
    },
    {
      label: 'Gestión',
      items: [
        { id: 'facturas', label: 'Facturación', description: 'Recibos y cobros', icon: Receipt },
        { id: 'liquidaciones', label: 'Obras sociales', description: 'Liquidaciones', icon: FileText },
        { id: 'finanzas', label: 'Finanzas', description: 'Caja y reportes', icon: Wallet },
      ],
    },
    {
      label: 'Conectar',
      items: [
        { id: 'portal-pacientes', label: 'Portal pacientes', description: 'Reservas online', icon: Globe, badge: turnosWebPendientesCount },
        { id: 'configuracion', label: 'Configuración', description: 'Preferencias', icon: Settings },
      ],
    },
  ];

  const initials = config?.nombre
    ? config.nombre.replace(/Lic\\.\\s*/i, '').split(' ').map((name) => name[0]).join('').substring(0, 2).toUpperCase()
    : 'VT';

  const handleItemClick = (id) => {
    onTabChange(id);
    onCloseMobile?.();
  };

  const sidebarContent = (
    <div className="workspace-sidebar">
      <div className="sidebar-top">
        <div className="sidebar-brand-row">
          <div className="sidebar-brand-mark"><img src="/psicoplus-logo.png" alt="PsicoPlus" /></div>
          <div className="sidebar-brand-copy">
            <div className="sidebar-brand-name">PsicoPlus <span>PRO</span></div>
            <p>Tu práctica, más simple</p>
          </div>
          {onCloseMobile && <button onClick={onCloseMobile} className="sidebar-close" aria-label="Cerrar menú"><X size={18} /></button>}
        </div>

        <div className="sidebar-context">
          <div className="context-pulse" />
          <div><strong>Consultorio activo</strong><span>Todo en orden hoy</span></div>
          <Sparkles size={15} className="context-sparkle" />
        </div>

        <nav className="sidebar-navigation" aria-label="Navegación principal">
          {groups.map((group) => (
            <div className="sidebar-group" key={group.label}>
              <p className="sidebar-group-label">{group.label}</p>
              <div className="sidebar-group-items">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleItemClick(item.id)}
                      className={`sidebar-nav-item ${isActive ? 'is-active' : ''}`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <span className="sidebar-nav-icon"><Icon size={17} /></span>
                      <span className="sidebar-nav-copy"><strong>{item.label}</strong><small>{item.description}</small></span>
                      {item.badge > 0 && <span className="sidebar-badge">{item.badge}</span>}
                      {isActive && <ChevronRight size={14} className="sidebar-chevron" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      <div className="sidebar-bottom">
        <button type="button" className="sidebar-help" onClick={() => window.alert('Centro de ayuda próximamente disponible.')}>
          <span className="sidebar-help-icon"><CircleHelp size={16} /></span>
          <span><strong>¿Necesitás ayuda?</strong><small>Estamos para acompañarte</small></span>
        </button>
        <div className="sidebar-profile">
          <div className="sidebar-avatar">{initials}<span /></div>
          <div className="sidebar-profile-copy"><strong>{config?.nombre || 'Lic. Virna Toledo'}</strong><span><Award size={11} /> {config?.matriculaProvincial || 'M.P. 1842'}</span></div>
          <ChevronRight size={15} className="sidebar-profile-arrow" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="desktop-sidebar">{sidebarContent}</aside>
      {isMobileOpen && (
        <div className="mobile-sidebar-overlay">
          <div onClick={onCloseMobile} className="mobile-sidebar-backdrop" />
          <div className="mobile-sidebar-panel">{sidebarContent}</div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
