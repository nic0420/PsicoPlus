import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Users, 
  CalendarDays, 
  Receipt, 
  FileText, 
  Wallet, 
  Settings, 
  Globe, 
  LayoutDashboard, 
  Eye, 
  Sun, 
  Plus, 
  X, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export const CommandPalette = ({
  isOpen,
  onClose,
  pacientes = [],
  onSelectPaciente,
  onNavigateTab,
  onOpenNuevoTurno,
  onTogglePrivacyMode,
  onToggleDarkMode,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
    }
  }, [isOpen]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent or state
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredPacientes = query.trim()
    ? pacientes
        .filter(
          (p) =>
            p.nombreCompleto.toLowerCase().includes(query.toLowerCase()) ||
            p.dni?.includes(query) ||
            p.numeroAfiliado?.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const actions = [
    { id: 'nuevo-turno', label: 'Agendar Nuevo Turno', icon: Plus, category: 'Acciones', run: () => { onOpenNuevoTurno(); onClose(); } },
    { id: 'tab-dashboard', label: 'Ir a Dashboard', icon: LayoutDashboard, category: 'Navegación', run: () => { onNavigateTab('dashboard'); onClose(); } },
    { id: 'tab-agenda', label: 'Ir a Agenda Multisede', icon: CalendarDays, category: 'Navegación', run: () => { onNavigateTab('agenda'); onClose(); } },
    { id: 'tab-pacientes', label: 'Ir a Directorio de Pacientes', icon: Users, category: 'Navegación', run: () => { onNavigateTab('pacientes'); onClose(); } },
    { id: 'tab-facturas', label: 'Ir a Facturación & Recibos', icon: Receipt, category: 'Navegación', run: () => { onNavigateTab('facturas'); onClose(); } },
    { id: 'tab-liquidaciones', label: 'Ir a Obras Sociales & Liq.', icon: FileText, category: 'Navegación', run: () => { onNavigateTab('liquidaciones'); onClose(); } },
    { id: 'tab-finanzas', label: 'Ir a Finanzas & Caja', icon: Wallet, category: 'Navegación', run: () => { onNavigateTab('finanzas'); onClose(); } },
    { id: 'tab-portal', label: 'Ir a Portal Pacientes Web', icon: Globe, category: 'Navegación', run: () => { onNavigateTab('portal-pacientes'); onClose(); } },
    { id: 'tab-configuracion', label: 'Ir a Configuración', icon: Settings, category: 'Navegación', run: () => { onNavigateTab('configuracion'); onClose(); } },
    { id: 'toggle-privacy', label: 'Alternar Modo Privado', icon: Eye, category: 'Preferencias', run: () => { onTogglePrivacyMode(); onClose(); } },
    { id: 'toggle-theme', label: 'Cambiar Modo Claro / Oscuro', icon: Sun, category: 'Preferencias', run: () => { onToggleDarkMode(); onClose(); } },
  ];

  const filteredActions = query.trim()
    ? actions.filter((a) => a.label.toLowerCase().includes(query.toLowerCase()))
    : actions;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="card max-w-xl w-full p-0 overflow-hidden shadow-2xl animate-fade-in border border-emerald-200 dark:border-emerald-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <Search size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Escribe un comando o busca un paciente..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white outline-none font-medium placeholder:text-slate-400"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-3 text-xs">
          
          {/* Pacientes Matches */}
          {filteredPacientes.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2.5 py-1 block">
                Pacientes
              </span>
              <div className="space-y-0.5">
                {filteredPacientes.map((pac) => (
                  <button
                    key={pac.id}
                    onClick={() => {
                      onSelectPaciente(pac);
                      onNavigateTab('pacientes');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-emerald-50 dark:hover:bg-slate-800/80 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center">
                        {pac.nombreCompleto.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">
                          {pac.nombreCompleto}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          DNI: {pac.dni || 'S/D'} • {pac.obraSocialId.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-slate-400 group-hover:text-emerald-600 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions Matches */}
          {filteredActions.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2.5 py-1 block">
                Comandos & Navegación
              </span>
              <div className="space-y-0.5">
                {filteredActions.map((act) => {
                  const Icon = act.icon;
                  return (
                    <button
                      key={act.id}
                      onClick={act.run}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          <Icon size={14} />
                        </div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {act.label}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">{act.category}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {filteredPacientes.length === 0 && filteredActions.length === 0 && (
            <div className="text-center py-6 text-slate-400">
              <p className="text-xs">No se encontraron resultados para "{query}".</p>
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="p-2.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 px-4">
          <span>Presiona <kbd className="font-mono bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">↵</kbd> para seleccionar</span>
          <span>PsicoPlus Command Palette</span>
        </div>
      </div>
    </div>
  );
};
