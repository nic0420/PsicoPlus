import React, { useState, useEffect } from 'react';
import {
  Eye,
  EyeOff,
  ShieldAlert,
  Layers,
  Globe,
  Menu,
  Search,
  Sun,
  Moon,
  ChevronDown,
} from 'lucide-react';
import { PLANS } from '../services/subscription';
import { BrandMark } from './Common/BrandMark';
import { sedeTone } from '../lib/tones';

const TAB_TITLES = {
  dashboard: 'Consultorio en vivo',
  agenda: 'Agenda',
  pacientes: 'Pacientes',
  facturas: 'Facturación ARCA',
  liquidaciones: 'Obras sociales',
  finanzas: 'Finanzas',
  'portal-pacientes': 'Portal de pacientes',
  configuracion: 'Configuración',
};

const IconButton = ({ children, className = '', ...props }) => (
  <button
    {...props}
    className={`h-9 min-w-9 px-2 inline-flex items-center justify-center gap-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-900/[0.05] dark:hover:bg-white/[0.06] active:scale-95 transition-[background-color,color,transform] duration-150 ${className}`}
  >
    {children}
  </button>
);

export const Header = ({
  activeTab = 'dashboard',
  sedes = [],
  selectedSedeId = 'all',
  onSelectSede,
  privacyMode = false,
  onTogglePrivacyMode,
  isDarkMode = false,
  onToggleDarkMode,
  pacientesEnAlertaCount = 0,
  onNavigateAlerts,
  turnosWebPendientesCount = 0,
  onNavigatePortal,
  onOpenMobileMenu,
  onOpenSearch,
  subscription = { plan: PLANS.FREE },
}) => {
  const [time, setTime] = useState(new Date());
  const isPro = subscription.plan === PLANS.PRO;

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 15000);
    return () => clearInterval(timer);
  }, []);

  const shortName = (nombre = '') => nombre.split('-')[0].trim();
  const dateLabel = time.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <header className="sticky top-0 z-30 w-full pt-safe bg-[var(--bg-app)]/85 backdrop-blur-md border-b border-[var(--border-color)]">
      <div className="h-14 md:h-16 flex items-center gap-3 px-3.5 sm:px-6 md:px-8 max-w-7xl mx-auto w-full">

        {/* Mobile: menú + marca */}
        <div className="flex items-center gap-1.5 md:hidden">
          <IconButton onClick={onOpenMobileMenu} aria-label="Abrir menú" className="-ml-1.5">
            <Menu size={20} />
          </IconButton>
          <BrandMark size={28} />
        </div>

        {/* Título de sección + fecha */}
        <div className="min-w-0 hidden md:block">
          <p className="text-[15px] font-semibold text-slate-900 dark:text-slate-50 leading-tight truncate">{TAB_TITLES[activeTab] || 'PsicoPlus'}</p>
          <p className="text-[12px] text-slate-500 leading-tight mt-0.5 first-letter:uppercase">
            {dateLabel} · <span className="font-mono normal-case">{time.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</span>
          </p>
        </div>

        {/* Selector de sede */}
        <div className="flex-1 flex justify-center md:justify-start md:pl-4 min-w-0">
          {/* Segmentado (pantallas grandes) */}
          <div role="radiogroup" aria-label="Sede" className="hidden 2xl:flex items-center p-0.5 rounded-lg bg-slate-900/[0.045] dark:bg-white/[0.05]">
            <button
              role="radio"
              aria-checked={selectedSedeId === 'all'}
              onClick={() => onSelectSede('all')}
              className={`h-8 px-3 inline-flex items-center gap-1.5 rounded-md text-[13px] font-medium transition-colors whitespace-nowrap ${
                selectedSedeId === 'all'
                  ? 'bg-[var(--bg-card)] text-slate-900 dark:text-slate-50 shadow-[0_1px_2px_rgba(27,29,26,0.08)]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Layers size={14} className="opacity-70" /> Todas las sedes
            </button>
            {sedes.map((sede) => (
              <button
                key={sede.id}
                role="radio"
                aria-checked={selectedSedeId === sede.id}
                onClick={() => onSelectSede(sede.id)}
                className={`h-8 px-3 inline-flex items-center gap-1.5 rounded-md text-[13px] font-medium transition-colors whitespace-nowrap ${
                  selectedSedeId === sede.id
                    ? 'bg-[var(--bg-card)] text-slate-900 dark:text-slate-50 shadow-[0_1px_2px_rgba(27,29,26,0.08)]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${sedeTone(sede).dot}`} />
                {shortName(sede.nombre)}
              </button>
            ))}
          </div>

          {/* Select (mobile / tablet) */}
          <label className="2xl:hidden relative inline-flex items-center max-w-full">
            <span className="sr-only">Sede</span>
            <select
              value={selectedSedeId}
              onChange={(e) => onSelectSede(e.target.value)}
              className="appearance-none h-9 pl-3 pr-8 max-w-[200px] truncate rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[13px] font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:shadow-[var(--focus-ring)]"
            >
              <option value="all">Todas las sedes</option>
              {sedes.map((s) => (
                <option key={s.id} value={s.id}>{shortName(s.nombre)}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 pointer-events-none text-slate-500" />
          </label>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              title="Buscar (Ctrl + K)"
              className="h-9 inline-flex items-center gap-2 pl-2.5 pr-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-300 transition-colors"
            >
              <Search size={15} />
              <span className="hidden xl:inline text-[13px] pr-6">Buscar paciente, turno…</span>
              <kbd className="hidden sm:inline-block px-1.5 py-px text-[10.5px] font-mono text-slate-500 rounded border border-[var(--border-color)] bg-[var(--bg-app)]">⌘K</kbd>
            </button>
          )}

          {turnosWebPendientesCount > 0 && onNavigatePortal && (
            <IconButton
              onClick={onNavigatePortal}
              title={`${turnosWebPendientesCount} solicitudes de turno web`}
              className="hidden sm:inline-flex relative"
            >
              <Globe size={17} />
              <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-semibold grid place-items-center">
                {turnosWebPendientesCount}
              </span>
            </IconButton>
          )}

          {pacientesEnAlertaCount > 0 && (
            <button
              onClick={onNavigateAlerts}
              title={`${pacientesEnAlertaCount} pacientes con órdenes por agotar`}
              className="h-9 inline-flex items-center gap-1.5 px-2.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/25 text-[13px] font-medium hover:bg-amber-100 dark:hover:bg-amber-500/15 transition-colors"
            >
              <ShieldAlert size={15} />
              <span className="font-mono">{pacientesEnAlertaCount}</span>
              <span className="hidden xl:inline">órdenes por renovar</span>
            </button>
          )}

          <IconButton
            onClick={onTogglePrivacyMode}
            title={privacyMode ? 'Desactivar modo privacidad' : 'Activar modo privacidad (oculta datos sensibles)'}
            aria-pressed={privacyMode}
            className={privacyMode ? '!bg-slate-900 !text-[#f4f1e8] dark:!bg-slate-100 dark:!text-slate-900' : ''}
          >
            {privacyMode ? <EyeOff size={17} /> : <Eye size={17} />}
            <span className="hidden 2xl:inline text-[13px] font-medium">{privacyMode ? 'Privado' : 'Privacidad'}</span>
          </IconButton>

          {onToggleDarkMode && (
            <IconButton
              onClick={onToggleDarkMode}
              title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              aria-label={isDarkMode ? 'Modo claro' : 'Modo oscuro'}
            >
              {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
            </IconButton>
          )}

          {isPro && (
            <span className="hidden sm:inline-flex h-6 items-center px-2 rounded-md text-[11px] font-semibold tracking-wide bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/25">
              PRO
            </span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
