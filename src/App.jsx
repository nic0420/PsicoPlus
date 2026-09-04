import React, { useState, useEffect } from 'react';
import { getStoredData, saveToStorage } from './services/storage';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/Dashboard/DashboardView';
import { AgendaView } from './components/Agenda/AgendaView';
import { PacientesView } from './components/Pacientes/PacientesView';
import { FacturasView } from './components/Facturas/FacturasView';
import { LiquidacionesView } from './components/Liquidaciones/LiquidacionesView';
import { FinanzasView } from './components/Finanzas/FinanzasView';
import { PortalTurnosView } from './components/PortalPacientes/PortalTurnosView';
import { ConfiguracionView } from './components/Configuracion/ConfiguracionView';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ToastProvider } from './components/Common/Toast';
import { CommandPalette } from './components/Common/CommandPalette';
import './App.css';

export function AppContent() {
  const initial = getStoredData();

  // Detect query param ?portal=paciente
  const urlParams = new URLSearchParams(window.location.search);
  const isDirectPortal = urlParams.get('portal') === 'paciente' || urlParams.get('portal') === 'turnos' || urlParams.get('reserva') === 'true';

  const [activeTab, setActiveTab] = useState(isDirectPortal ? 'portal-pacientes' : 'dashboard');
  const [selectedSedeId, setSelectedSedeId] = useState('all');
  const [privacyMode, setPrivacyMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(initial.theme === 'dark');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [sedes, setSedes] = useState(initial.sedes);
  const [obrasSociales, setObrasSociales] = useState(initial.obrasSociales);
  const [pacientes, setPacientes] = useState(initial.pacientes);
  const [turnos, setTurnos] = useState(initial.turnos);
  const [liquidaciones, setLiquidaciones] = useState(initial.liquidaciones);
  const [facturas, setFacturas] = useState(initial.facturas || []);
  const [config, setConfig] = useState(initial.config);

  // Modals state
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [isTurnoModalOpen, setIsTurnoModalOpen] = useState(false);
  const [isPacienteModalOpen, setIsPacienteModalOpen] = useState(false);
  const [facturaPreselectedPaciente, setFacturaPreselectedPaciente] = useState(null);

  // Sync dark mode class with HTML element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      saveToStorage('psicoplus_theme_v1', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      saveToStorage('psicoplus_theme_v1', 'light');
    }
  }, [isDarkMode]);

  // Global Keyboard Shortcuts (Ctrl+K, N for new appointment, P for privacy)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Persist state updates to localStorage
  const handleSaveSedes = (newSedes) => {
    setSedes(newSedes);
    saveToStorage('psicoplus_sedes_v1', newSedes);
  };

  const handleSaveConfig = (newConfig) => {
    setConfig(newConfig);
    saveToStorage('psicoplus_config_v1', newConfig);
  };

  const handleSavePaciente = (pacienteData) => {
    let updated;
    const exists = pacientes.some(p => p.id === pacienteData.id);
    if (exists) {
      updated = pacientes.map(p => p.id === pacienteData.id ? pacienteData : p);
    } else {
      updated = [pacienteData, ...pacientes];
    }
    setPacientes(updated);
    saveToStorage('psicoplus_pacientes_v1', updated);
    if (selectedPaciente?.id === pacienteData.id) {
      setSelectedPaciente(pacienteData);
    }
  };

  const handleDeletePaciente = (pacienteId) => {
    const updated = pacientes.filter(p => p.id !== pacienteId);
    setPacientes(updated);
    saveToStorage('psicoplus_pacientes_v1', updated);
    if (selectedPaciente?.id === pacienteId) setSelectedPaciente(null);
  };

  const handleSaveTurno = (turnoData) => {
    let updated;
    const exists = turnos.some(t => t.id === turnoData.id);
    if (exists) {
      updated = turnos.map(t => t.id === turnoData.id ? turnoData : t);
    } else {
      updated = [turnoData, ...turnos];
    }
    setTurnos(updated);
    saveToStorage('psicoplus_turnos_v1', updated);
  };

  const handleDeleteTurno = (turnoId) => {
    const updated = turnos.filter(t => t.id !== turnoId);
    setTurnos(updated);
    saveToStorage('psicoplus_turnos_v1', updated);
  };

  const handleActualizarTurnoEstado = (turnoId, nuevoEstado) => {
    const updated = turnos.map(t => {
      if (t.id === turnoId) {
        return {
          ...t,
          estado: nuevoEstado,
          coseguroEstado: nuevoEstado === 'Atendido' ? 'Cobrado' : t.coseguroEstado
        };
      }
      return t;
    });
    setTurnos(updated);
    saveToStorage('psicoplus_turnos_v1', updated);
  };

  const handleSaveEvolucion = (pacienteId, nuevaEvolucion) => {
    const updated = pacientes.map(p => {
      if (p.id === pacienteId) {
        const evos = [nuevaEvolucion, ...(p.evoluciones || [])];
        const nuevasConsumidas = (p.sesionesConsumidas || 0) + 1;
        return {
          ...p,
          evoluciones: evos,
          sesionesConsumidas: nuevasConsumidas,
        };
      }
      return p;
    });

    setPacientes(updated);
    saveToStorage('psicoplus_pacientes_v1', updated);
    
    const currentPac = updated.find(p => p.id === pacienteId);
    if (currentPac) setSelectedPaciente(currentPac);
  };

  // Facturas handlers
  const handleSaveFactura = (facturaData) => {
    let updated;
    const exists = facturas.some(f => f.id === facturaData.id);
    if (exists) {
      updated = facturas.map(f => f.id === facturaData.id ? facturaData : f);
    } else {
      updated = [facturaData, ...facturas];
    }
    setFacturas(updated);
    saveToStorage('psicoplus_facturas_v1', updated);
  };

  const handleDeleteFactura = (facturaId) => {
    const updated = facturas.filter(f => f.id !== facturaId);
    setFacturas(updated);
    saveToStorage('psicoplus_facturas_v1', updated);
  };

  const handleUpdateFacturaEstado = (facturaId, nuevoEstado) => {
    const updated = facturas.map(f => f.id === facturaId ? { ...f, estado: nuevoEstado } : f);
    setFacturas(updated);
    saveToStorage('psicoplus_facturas_v1', updated);
  };

  const handleSaveLiquidacion = (nuevaLiq) => {
    const updated = [nuevaLiq, ...liquidaciones];
    setLiquidaciones(updated);
    saveToStorage('psicoplus_liquidaciones_v1', updated);
  };

  const handleUpdateLiquidacionEstado = (liqId, nuevoEstado) => {
    const updated = liquidaciones.map(l => l.id === liqId ? { ...l, estado: nuevoEstado } : l);
    setLiquidaciones(updated);
    saveToStorage('psicoplus_liquidaciones_v1', updated);
  };

  const handleDeleteLiquidacion = (liqId) => {
    const updated = liquidaciones.filter(l => l.id !== liqId);
    setLiquidaciones(updated);
    saveToStorage('psicoplus_liquidaciones_v1', updated);
  };

  // Contar pacientes con órdenes de Obra Social por agotar
  const pacientesEnAlertaCount = pacientes.filter(p => {
    if (p.obraSocialId === 'particular') return false;
    const restantes = (p.sesionesAutorizadas || 10) - (p.sesionesConsumidas || 0);
    return restantes <= 2;
  }).length;

  // Contar solicitudes web pendientes
  const turnosWebPendientesCount = turnos.filter(t => t.estado === 'Solicitado (Web)').length;

  // If user opens directly in patient portal URL mode
  if (isDirectPortal && activeTab === 'portal-pacientes') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#080c14] p-3 sm:p-6 md:p-8 flex flex-col justify-between">
        <div className="w-full max-w-3xl mx-auto flex items-center justify-between mb-4">
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">Portal Pacientes • PsicoPlus</span>
          <button
            onClick={() => {
              window.history.pushState({}, '', window.location.pathname);
              setActiveTab('dashboard');
            }}
            className="text-xs text-slate-500 hover:text-indigo-600 font-medium"
          >
            Acceso Profesional →
          </button>
        </div>
        <PortalTurnosView
          sedes={sedes}
          obrasSociales={obrasSociales}
          turnos={turnos}
          config={config}
          onSaveTurno={handleSaveTurno}
          isStandalone={true}
        />
        <footer className="text-center text-[11px] text-slate-400 mt-8 pb-6">
          © {new Date().getFullYear()} PsicoPlus - Sistema de Gestión Profesional
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#080c14] text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Sidebar Navigation (Desktop & Mobile Slide-over Drawer) */}
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        config={config} 
        turnosWebPendientesCount={turnosWebPendientesCount}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        <Header 
          sedes={sedes}
          selectedSedeId={selectedSedeId}
          onSelectSede={setSelectedSedeId}
          privacyMode={privacyMode}
          onTogglePrivacyMode={() => setPrivacyMode(!privacyMode)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          pacientesEnAlertaCount={pacientesEnAlertaCount}
          onNavigateAlerts={() => setActiveTab('pacientes')}
          turnosWebPendientesCount={turnosWebPendientesCount}
          onNavigatePortal={() => setActiveTab('portal-pacientes')}
          onNavigateAgenda={() => setActiveTab('agenda')}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
        />

        <main className="flex-1 p-3.5 sm:p-6 md:p-8 pb-28 md:pb-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView 
              sedes={sedes}
              obrasSociales={obrasSociales}
              pacientes={pacientes}
              turnos={turnos}
              liquidaciones={liquidaciones}
              config={config}
              selectedSedeId={selectedSedeId}
              privacyMode={privacyMode}
              onNavigateTab={setActiveTab}
              onOpenNuevoTurno={() => {
                setActiveTab('agenda');
                setIsTurnoModalOpen(true);
              }}
              onOpenPacienteDetalle={(pac) => {
                setSelectedPaciente(pac);
                setActiveTab('pacientes');
              }}
              onActualizarTurnoEstado={handleActualizarTurnoEstado}
            />
          )}

          {activeTab === 'agenda' && (
            <AgendaView 
              sedes={sedes}
              obrasSociales={obrasSociales}
              pacientes={pacientes}
              turnos={turnos}
              config={config}
              selectedSedeId={selectedSedeId}
              privacyMode={privacyMode}
              onSaveTurno={handleSaveTurno}
              onDeleteTurno={handleDeleteTurno}
              onActualizarTurnoEstado={handleActualizarTurnoEstado}
              onOpenPacienteDetalle={(pac) => {
                setSelectedPaciente(pac);
                setActiveTab('pacientes');
              }}
              isModalOpen={isTurnoModalOpen}
              onCloseModal={() => setIsTurnoModalOpen(false)}
              onOpenNuevoTurno={() => setIsTurnoModalOpen(true)}
            />
          )}

          {activeTab === 'pacientes' && (
            <PacientesView 
              sedes={sedes}
              obrasSociales={obrasSociales}
              pacientes={pacientes}
              turnos={turnos}
              config={config}
              privacyMode={privacyMode}
              selectedPaciente={selectedPaciente}
              onSelectPaciente={setSelectedPaciente}
              onSavePaciente={handleSavePaciente}
              onDeletePaciente={handleDeletePaciente}
              onSaveEvolucion={handleSaveEvolucion}
              isCreateModalOpen={isPacienteModalOpen}
              onOpenCreateModal={() => setIsPacienteModalOpen(true)}
              onCloseCreateModal={() => setIsPacienteModalOpen(false)}
              onNavigateFacturar={(pac) => {
                setFacturaPreselectedPaciente(pac);
                setActiveTab('facturas');
              }}
            />
          )}

          {activeTab === 'facturas' && (
            <FacturasView 
              facturas={facturas}
              pacientes={pacientes}
              config={config}
              onSaveFactura={handleSaveFactura}
              onDeleteFactura={handleDeleteFactura}
              onUpdateFacturaEstado={handleUpdateFacturaEstado}
              preselectedPaciente={facturaPreselectedPaciente}
              onClearPreselectedPaciente={() => setFacturaPreselectedPaciente(null)}
            />
          )}

          {activeTab === 'liquidaciones' && (
            <LiquidacionesView 
              obrasSociales={obrasSociales}
              pacientes={pacientes}
              liquidaciones={liquidaciones}
              config={config}
              onSaveLiquidacion={handleSaveLiquidacion}
              onUpdateLiquidacionEstado={handleUpdateLiquidacionEstado}
              onDeleteLiquidacion={handleDeleteLiquidacion}
            />
          )}

          {activeTab === 'finanzas' && (
            <FinanzasView 
              sedes={sedes}
              obrasSociales={obrasSociales}
              pacientes={pacientes}
              turnos={turnos}
              liquidaciones={liquidaciones}
              selectedSedeId={selectedSedeId}
            />
          )}

          {activeTab === 'portal-pacientes' && (
            <PortalTurnosView
              sedes={sedes}
              obrasSociales={obrasSociales}
              turnos={turnos}
              config={config}
              onSaveTurno={handleSaveTurno}
              onActualizarTurnoEstado={handleActualizarTurnoEstado}
              onDeleteTurno={handleDeleteTurno}
              onBackToApp={() => setActiveTab('dashboard')}
              isStandalone={false}
            />
          )}

          {activeTab === 'configuracion' && (
            <ConfiguracionView 
              config={config}
              sedes={sedes}
              obrasSociales={obrasSociales}
              onSaveConfig={handleSaveConfig}
              onSaveSedes={handleSaveSedes}
            />
          )}
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <MobileBottomNav 
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenMenu={() => setIsMobileMenuOpen(true)}
          turnosWebPendientesCount={turnosWebPendientesCount}
        />

      </div>

      {/* Global Command Palette (Ctrl + K) */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        pacientes={pacientes}
        onSelectPaciente={(pac) => {
          setSelectedPaciente(pac);
          setActiveTab('pacientes');
        }}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenNuevoTurno={() => {
          setActiveTab('agenda');
          setIsTurnoModalOpen(true);
        }}
        onTogglePrivacyMode={() => setPrivacyMode(!privacyMode)}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

    </div>
  );
}

export function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;
