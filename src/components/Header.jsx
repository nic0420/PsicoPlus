import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Video, 
  Eye, 
  EyeOff, 
  Sun, 
  Moon, 
  ShieldAlert, 
  CalendarDays,
  Globe,
  Menu,
  HeartPulse,
  Search
} from 'lucide-react';

export const Header = ({ 
  sedes, 
  selectedSedeId, 
  onSelectSede, 
  privacyMode, 
  onTogglePrivacyMode, 
  isDarkMode, 
  onToggleDarkMode,
  pacientesEnAlertaCount,
  onNavigateAlerts,
  turnosWebPendientesCount = 0,
  onNavigatePortal,
  onNavigateAgenda,
  onOpenMobileMenu,
  onOpenSearch
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getSedeIcon = (id) => {
    if (id === 'sede-centro') return <Building2 size={14} className="text-emerald-600 dark:text-emerald-400" />;
    if (id === 'sede-sanmartin') return <MapPin size={14} className="text-rose-600 dark:text-rose-400" />;
    if (id === 'sede-online') return <Video size={14} className="text-sky-600 dark:text-sky-400" />;
    return <CalendarDays size={14} className="text-emerald-500" />;
  };

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800/80 transition-colors pt-safe">
      <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3">
        
        {/* Mobile Left: Hamburger + Brand */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={onOpenMobileMenu}
            className="p-1.5 -ml-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Abrir menú"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <HeartPulse size={14} />
            </div>
            <span className="font-bold text-sm text-slate-900 dark:text-white font-display">PsicoPlus</span>
          </div>
        </div>

        {/* Desktop Left: Sede Selector */}
        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-1 bg-emerald-50/90 dark:bg-emerald-950/60 p-1 rounded-xl border border-emerald-200/70 dark:border-emerald-900/60">
            <button
              onClick={() => onSelectSede('all')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedSedeId === 'all'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs border border-emerald-200/80 dark:border-emerald-800 font-bold'
                  : 'text-emerald-700/60 dark:text-emerald-400/60 hover:text-emerald-900 dark:hover:text-emerald-100'
              }`}
            >
              <CalendarDays size={13} />
              <span>Todas las Sedes</span>
            </button>

            {sedes.map((sede) => (
              <button
                key={sede.id}
                onClick={() => onSelectSede(sede.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedSedeId === sede.id
                    ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs border border-emerald-200/80 dark:border-emerald-800 font-bold'
                    : 'text-emerald-700/60 dark:text-emerald-400/60 hover:text-emerald-900 dark:hover:text-emerald-100'
                }`}
              >
                {getSedeIcon(sede.id)}
                <span className="hidden lg:inline">{sede.nombre.split('-')[0].trim()}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Center: Dropdown */}
        <div className="flex md:hidden items-center">
          <select
            value={selectedSedeId}
            onChange={(e) => onSelectSede(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">📍 Todas las Sedes</option>
            {sedes.map((s) => (
              <option key={s.id} value={s.id}>{s.nombre.split('-')[0].trim()}</option>
            ))}
          </select>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Quick Search / Command Palette Trigger */}
          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg text-xs border border-slate-200 dark:border-slate-700 transition-all"
              title="Buscar (Ctrl + K)"
            >
              <Search size={13} />
              <span className="hidden sm:inline font-medium">Buscar</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.2 text-[10px] font-mono text-slate-400 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700">
                ⌘K
              </kbd>
            </button>
          )}

          {/* Quick Portal link */}
          {onNavigatePortal && (
            <button
              onClick={onNavigatePortal}
              title="Abrir Portal de Reservas Online"
              className="hidden sm:flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-emerald-100/70 transition-all"
            >
              <Globe size={13} className="text-emerald-600 dark:text-emerald-400" />
              <span>Portal</span>
            </button>
          )}

          {/* Privacy Mode */}
          <button
            onClick={onTogglePrivacyMode}
            title={privacyMode ? "Desactivar Modo Privacidad" : "Activar Modo Privacidad"}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              privacyMode 
                ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            {privacyMode ? <EyeOff size={13} /> : <Eye size={13} />}
            <span className="hidden lg:inline">
              {privacyMode ? 'Privacidad Activa' : 'Modo Privado'}
            </span>
          </button>

          {/* O.S. Alerts */}
          {pacientesEnAlertaCount > 0 && (
            <button
              onClick={onNavigateAlerts}
              title={`${pacientesEnAlertaCount} pacientes con órdenes por agotar`}
              className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-amber-100/70 transition-all"
            >
              <ShieldAlert size={13} className="text-amber-600 dark:text-amber-400" />
              <span className="hidden sm:inline">{pacientesEnAlertaCount} O.S.</span>
              <span className="sm:hidden">{pacientesEnAlertaCount}</span>
            </button>
          )}

          {/* Clock */}
          <div className="hidden xl:flex items-center text-xs font-mono font-medium text-emerald-700/70 dark:text-emerald-400/70 bg-emerald-50/80 dark:bg-emerald-950/40 px-2.5 py-1.5 rounded-lg border border-emerald-200/60 dark:border-emerald-900/60">
            {time.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>

          {/* Dark Mode toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all border border-slate-200 dark:border-slate-700"
            title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          >
            {isDarkMode ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-slate-600" />}
          </button>

        </div>
      </div>
    </header>
  );
};
