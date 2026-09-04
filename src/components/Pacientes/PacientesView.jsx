import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  ShieldAlert, 
  CheckCircle2, 
  FileText, 
  Clock, 
  Calendar, 
  MessageCircle, 
  Building2, 
  Lock, 
  XCircle, 
  Edit3, 
  Trash2, 
  Download, 
  AlertTriangle, 
  Receipt
} from 'lucide-react';
import { generateConstanciaPDF } from '../../services/pdfGenerator';
import { generateWhatsappLink, createOrderAlertMessage } from '../../services/whatsapp';

export const PacientesView = ({
  sedes,
  obrasSociales,
  pacientes,
  turnos,
  config,
  privacyMode,
  selectedPaciente,
  onSelectPaciente,
  onSavePaciente,
  onDeletePaciente,
  onSaveEvolucion,
  isCreateModalOpen,
  onOpenCreateModal,
  onCloseCreateModal,
  onNavigateFacturar
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOS, setFilterOS] = useState('all');
  const [filterSede, setFilterSede] = useState('all');
  const [activeDrawerTab, setActiveDrawerTab] = useState('datos'); // datos, evoluciones, constancias

  // Estado para constancia personalizada
  const [constanciaFecha, setConstanciaFecha] = useState(new Date().toISOString().split('T')[0]);
  const [constanciaHora, setConstanciaHora] = useState('16:00');
  const [constanciaSedeId, setConstanciaSedeId] = useState('sede-centro');

  // Estado para Nueva Evolución Modal / Form
  const [isEvoModalOpen, setIsEvoModalOpen] = useState(false);
  const [evoFecha, setEvoFecha] = useState('2026-09-01');
  const [evoHora, setEvoHora] = useState('16:00');
  const [evoSedeId, setEvoSedeId] = useState('sede-centro');
  const [evoNumeroSesion, setEvoNumeroSesion] = useState(1);
  const [evoMotivo, setEvoMotivo] = useState('');
  const [evoObservaciones, setEvoObservaciones] = useState('');
  const [evoIntervenciones, setEvoIntervenciones] = useState('');
  const [evoTareas, setEvoTareas] = useState('');
  const [evoPagoEstado, setEvoPagoEstado] = useState('Cobrado');
  const [evoMontoCoseguro, setEvoMontoCoseguro] = useState(3000);

  // Form State para Nuevo / Editar Paciente
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    dni: '',
    fechaNacimiento: '',
    telefono: '',
    email: '',
    sedeHabitualId: 'sede-centro',
    obraSocialId: 'ioscor',
    numeroAfiliado: '',
    numeroOrden: '',
    vencimientoOrden: '',
    sesionesAutorizadas: 10,
    sesionesConsumidas: 0,
    coseguroPactado: 3000,
    contactoEmergencia: '',
    motivoConsulta: '',
    diagnosticoPresuntivo: '',
    frecuenciaSugerida: 'Semanal',
    estadoTratamiento: 'Activo',
    notasPrivadas: '',
  });

  const getSedeById = (id) => sedes.find(s => s.id === id);
  const getObraSocialById = (id) => obrasSociales.find(os => os.id === id);

  // Filtrado de pacientes
  const filteredPacientes = pacientes.filter(p => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      p.nombreCompleto.toLowerCase().includes(term) ||
      p.dni?.toLowerCase().includes(term) ||
      p.numeroAfiliado?.toLowerCase().includes(term);
    const matchesOS = filterOS === 'all' || p.obraSocialId === filterOS;
    const matchesSede = filterSede === 'all' || p.sedeHabitualId === filterSede;
    return matchesSearch && matchesOS && matchesSede;
  });

  const handleOpenCreate = () => {
    setFormData({
      nombreCompleto: '',
      dni: '',
      fechaNacimiento: '',
      telefono: '+54 9 379 ',
      email: '',
      sedeHabitualId: 'sede-centro',
      obraSocialId: 'ioscor',
      numeroAfiliado: '',
      numeroOrden: '',
      vencimientoOrden: '2026-12-31',
      sesionesAutorizadas: 10,
      sesionesConsumidas: 0,
      coseguroPactado: 3000,
      contactoEmergencia: '',
      motivoConsulta: '',
      diagnosticoPresuntivo: '',
      frecuenciaSugerida: 'Semanal',
      estadoTratamiento: 'Activo',
      notasPrivadas: '',
    });
    onOpenCreateModal();
  };

  const handleOpenEdit = (pac) => {
    setFormData({ ...pac });
    onOpenCreateModal();
  };

  const handleSavePacienteSubmit = (e) => {
    e.preventDefault();
    const pacienteToSave = {
      ...formData,
      id: formData.id || `pac-${Date.now()}`,
      sesionesAutorizadas: Number(formData.sesionesAutorizadas),
      sesionesConsumidas: Number(formData.sesionesConsumidas),
      coseguroPactado: Number(formData.coseguroPactado),
      evoluciones: formData.evoluciones || [],
    };
    onSavePaciente(pacienteToSave);
    onCloseCreateModal();
  };

  const handleOpenNuevaEvolucion = () => {
    if (!selectedPaciente) return;
    const proxSesionNum = (selectedPaciente.evoluciones?.length || 0) + 1;
    setEvoNumeroSesion(proxSesionNum);
    setEvoSedeId(selectedPaciente.sedeHabitualId || 'sede-centro');
    setEvoMontoCoseguro(selectedPaciente.coseguroPactado || 0);
    setEvoMotivo('');
    setEvoObservaciones('');
    setEvoIntervenciones('');
    setEvoTareas('');
    setIsEvoModalOpen(true);
  };

  const handleSaveEvolucionSubmit = (e) => {
    e.preventDefault();
    if (!selectedPaciente) return;

    const nuevaEvolucion = {
      id: `evo-${Date.now()}`,
      fecha: evoFecha,
      hora: evoHora,
      sedeId: evoSedeId,
      numeroSesion: evoNumeroSesion,
      motivo: evoMotivo,
      observaciones: evoObservaciones,
      intervenciones: evoIntervenciones,
      tareas: evoTareas,
      pagoEstado: evoPagoEstado,
      montoCoseguro: Number(evoMontoCoseguro),
    };

    onSaveEvolucion(selectedPaciente.id, nuevaEvolucion);
    setIsEvoModalOpen(false);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      
      {/* Header Pacientes */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <Users size={24} className="text-emerald-600 dark:text-emerald-400" />
            Directorio de Pacientes & Historias Clínicas
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Fichas clínicas completas, cobertura de obras sociales y evoluciones de sesión.
          </p>
        </div>

        <button 
          onClick={handleOpenCreate}
          className="btn btn-primary text-xs self-start md:self-auto"
        >
          <Plus size={15} />
          <span>Nuevo Paciente</span>
        </button>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="card p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3">
        
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder="Buscar por Nombre, DNI o N° de Afiliado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-9 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterOS}
            onChange={(e) => setFilterOS(e.target.value)}
            className="input-field py-1.5 px-2.5 text-xs w-auto"
          >
            <option value="all">Todas las Obras Sociales</option>
            {obrasSociales.map(os => (
              <option key={os.id} value={os.id}>{os.nombre}</option>
            ))}
          </select>

          <select
            value={filterSede}
            onChange={(e) => setFilterSede(e.target.value)}
            className="input-field py-1.5 px-2.5 text-xs w-auto"
          >
            <option value="all">Todas las Sedes</option>
            {sedes.map(s => (
              <option key={s.id} value={s.id}>{s.nombre.split('-')[0].trim()}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Lista / Grid de Pacientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredPacientes.map((pac) => {
          const os = getObraSocialById(pac.obraSocialId);
          const sede = getSedeById(pac.sedeHabitualId);
          const restantes = (pac.sesionesAutorizadas || 10) - (pac.sesionesConsumidas || 0);
          const isAlerta = pac.obraSocialId !== 'particular' && restantes <= 2;
          const evoCount = pac.evoluciones?.length || 0;
          const initials = pac.nombreCompleto.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

          return (
            <div 
              key={pac.id}
              onClick={() => onSelectPaciente(pac)}
              className={`card p-4 sm:p-4.5 cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-700 transition-all relative flex flex-col justify-between ${
                selectedPaciente?.id === pac.id ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20' : ''
              }`}
            >
              
              <div>
                {/* Header del Card con Avatar e Iniciales */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {initials}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white tracking-tight">
                        {pac.nombreCompleto}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        DNI: {pac.dni || 'Sin DNI'}
                      </p>
                    </div>
                  </div>

                  <span className={`badge text-[10px] ${
                    pac.estadoTratamiento === 'Activo' 
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200' 
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {pac.estadoTratamiento}
                  </span>
                </div>

                {/* Sede y Obra Social */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                  {sede && (
                    <span className={`badge ${sede.badgeClass} text-[10px]`}>
                      {sede.nombre.split('-')[0].trim()}
                    </span>
                  )}

                  <span className="badge bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px]">
                    {os?.nombre || 'Particular'}
                  </span>
                </div>

                {/* Motivo de consulta */}
                {pac.motivoConsulta && (
                  <p className={`text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 italic ${privacyMode ? 'privacy-blur' : ''}`}>
                    "{pac.motivoConsulta}"
                  </p>
                )}

                {/* Semáforo de Sesiones */}
                {pac.obraSocialId !== 'particular' && (
                  <div className="mt-3 p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-700/60 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-medium text-slate-600 dark:text-slate-400">
                        Sesiones autorizadas:
                      </span>
                      <span className={`font-semibold ${isAlerta ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>
                        {pac.sesionesConsumidas}/{pac.sesionesAutorizadas} ({restantes} rest.)
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-1.5 rounded-full transition-all ${
                          isAlerta ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, (pac.sesionesConsumidas / pac.sesionesAutorizadas) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Footer del Card */}
              <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1 font-medium text-slate-600 dark:text-slate-400">
                  <FileText size={13} className="text-emerald-600 dark:text-emerald-400" />
                  {evoCount} {evoCount === 1 ? 'evolución' : 'evoluciones'}
                </span>

                <span className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
                  Abrir Ficha →
                </span>
              </div>

            </div>
          );
        })}
      </div>

      {/* DRAWER / MODAL DE FICHA CLÍNICA */}
      {selectedPaciente && (
        <div className="modal-backdrop">
          <div className="card max-w-3xl w-full p-5 sm:p-6 shadow-xl space-y-4 max-h-[92vh] overflow-y-auto">
            
            {/* Header del Perfil */}
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                    {selectedPaciente.nombreCompleto}
                  </h3>
                  <span className="badge bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 text-xs">
                    {selectedPaciente.estadoTratamiento}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  DNI: {selectedPaciente.dni} • Tel: {selectedPaciente.telefono}
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                {onNavigateFacturar && (
                  <button
                    onClick={() => onNavigateFacturar(selectedPaciente)}
                    className="btn btn-primary text-xs py-1 px-2.5"
                    title="Emitir Factura para este paciente"
                  >
                    <Receipt size={13} />
                    <span>Facturar</span>
                  </button>
                )}
                <button
                  onClick={() => handleOpenEdit(selectedPaciente)}
                  className="btn btn-secondary text-xs py-1 px-2.5"
                  title="Editar datos del paciente"
                >
                  <Edit3 size={13} />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => onSelectPaciente(null)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <XCircle size={20} />
                </button>
              </div>
            </div>

            {/* Pestañas del Drawer */}
            <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2">
              <button
                onClick={() => setActiveDrawerTab('datos')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeDrawerTab === 'datos' 
                    ? 'bg-emerald-600 text-white shadow-xs' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Datos & Cobertura
              </button>
              <button
                onClick={() => setActiveDrawerTab('evoluciones')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeDrawerTab === 'evoluciones' 
                    ? 'bg-emerald-600 text-white shadow-xs' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <FileText size={13} />
                <span>Evoluciones ({selectedPaciente.evoluciones?.length || 0})</span>
              </button>
              <button
                onClick={() => setActiveDrawerTab('constancias')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeDrawerTab === 'constancias' 
                    ? 'bg-emerald-600 text-white shadow-xs' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Download size={13} />
                <span>Emitir Constancia PDF</span>
              </button>
            </div>

            {/* PESTAÑA 1: DATOS & COBERTURA */}
            {activeDrawerTab === 'datos' && (
              <div className="space-y-3.5 text-xs">
                
                {/* Datos de Cobertura */}
                <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase text-[10px] tracking-wider">
                    Cobertura de Salud & Obras Sociales
                  </h4>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    <div>
                      <span className="text-slate-500 block">Obra Social / Prepaga:</span>
                      <strong className="text-slate-900 dark:text-white">
                        {getObraSocialById(selectedPaciente.obraSocialId)?.nombre || 'Particular'}
                      </strong>
                    </div>

                    <div>
                      <span className="text-slate-500 block">N° de Afiliado:</span>
                      <strong className="text-slate-900 dark:text-white font-mono">
                        {selectedPaciente.numeroAfiliado || '-'}
                      </strong>
                    </div>

                    <div>
                      <span className="text-slate-500 block">N° de Orden / Autorización:</span>
                      <strong className="text-slate-900 dark:text-white font-mono">
                        {selectedPaciente.numeroOrden || '-'}
                      </strong>
                    </div>

                    <div>
                      <span className="text-slate-500 block">Vencimiento de Orden:</span>
                      <strong className="text-slate-900 dark:text-white">
                        {selectedPaciente.vencimientoOrden || '-'}
                      </strong>
                    </div>

                    <div>
                      <span className="text-slate-500 block">Coseguro pactado:</span>
                      <strong className="text-emerald-600 font-semibold">
                        ${selectedPaciente.coseguroPactado?.toLocaleString('es-AR') || 0}
                      </strong>
                    </div>

                    <div>
                      <span className="text-slate-500 block">Sede Habitual:</span>
                      <strong className="text-slate-900 dark:text-white">
                        {getSedeById(selectedPaciente.sedeHabitualId)?.nombre.split('-')[0].trim() || 'Centro'}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Aspectos Clínicos */}
                <div className="space-y-2.5">
                  <div>
                    <h5 className="font-semibold text-slate-700 dark:text-slate-300">Motivo de Consulta:</h5>
                    <p className={`p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl mt-1 text-slate-700 dark:text-slate-300 ${privacyMode ? 'privacy-blur' : ''}`}>
                      {selectedPaciente.motivoConsulta || 'Sin registrar.'}
                    </p>
                  </div>

                  <div>
                    <h5 className="font-semibold text-slate-700 dark:text-slate-300">Diagnóstico Presuntivo:</h5>
                    <p className={`p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl mt-1 text-slate-700 dark:text-slate-300 font-mono ${privacyMode ? 'privacy-blur' : ''}`}>
                      {selectedPaciente.diagnosticoPresuntivo || 'En evaluación.'}
                    </p>
                  </div>

                  <div>
                    <h5 className="font-semibold text-slate-700 dark:text-slate-300">Contacto de Emergencia:</h5>
                    <p className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl mt-1 text-slate-700 dark:text-slate-300">
                      {selectedPaciente.contactoEmergencia || 'No registrado.'}
                    </p>
                  </div>

                  <div>
                    <h5 className="font-semibold text-slate-700 dark:text-slate-300">Notas Confidenciales del Profesional:</h5>
                    <p className={`p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl mt-1 text-slate-700 dark:text-slate-300 italic ${privacyMode ? 'privacy-blur' : ''}`}>
                      {selectedPaciente.notasPrivadas || 'Sin notas.'}
                    </p>
                  </div>
                </div>

              </div>
            )}

            {/* PESTAÑA 2: EVOLUCIONES CLÍNICAS */}
            {activeDrawerTab === 'evoluciones' && (
              <div className="space-y-3.5">
                
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                    Registro Cronológico de Sesiones
                  </h4>
                  <button
                    onClick={handleOpenNuevaEvolucion}
                    className="btn btn-primary text-xs py-1.5 px-3"
                  >
                    <Plus size={13} />
                    <span>Nueva Evolución</span>
                  </button>
                </div>

                {(!selectedPaciente.evoluciones || selectedPaciente.evoluciones.length === 0) ? (
                  <div className="text-center py-8 text-slate-400 card border-dashed">
                    <FileText size={28} className="mx-auto mb-1.5 opacity-40 text-slate-400" />
                    <p className="font-medium text-xs">No hay notas de evolución registradas aún.</p>
                    <button 
                      onClick={handleOpenNuevaEvolucion}
                      className="btn btn-secondary text-xs mt-2"
                    >
                      + Cargar primera evolución
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {selectedPaciente.evoluciones.map((evo, idx) => (
                      <div 
                        key={evo.id || idx}
                        className="card p-3.5 space-y-1.5 border-l-4 border-l-emerald-600 bg-white dark:bg-slate-900"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                            Sesión #{evo.numeroSesion} • {evo.fecha} ({evo.hora} hs)
                          </span>
                          <span className="badge bg-slate-100 text-slate-700 text-[10px]">
                            {getSedeById(evo.sedeId)?.nombre.split('-')[0].trim() || 'Sede Centro'}
                          </span>
                        </div>

                        {evo.motivo && (
                          <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                            {evo.motivo}
                          </h5>
                        )}

                        <div className={`space-y-1 text-xs text-slate-700 dark:text-slate-300 ${privacyMode ? 'privacy-blur' : ''}`}>
                          {evo.observaciones && (
                            <p><strong>Observaciones:</strong> {evo.observaciones}</p>
                          )}
                          {evo.intervenciones && (
                            <p><strong>Intervenciones:</strong> {evo.intervenciones}</p>
                          )}
                          {evo.tareas && (
                            <p className="text-emerald-700 dark:text-emerald-300"><strong>Tareas acordadas:</strong> {evo.tareas}</p>
                          )}
                        </div>

                        <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                          <span>Coseguro: ${evo.montoCoseguro?.toLocaleString('es-AR') || 0} ({evo.pagoEstado})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

            {/* PESTAÑA 3: EMITIR CONSTANCIA PDF */}
            {activeDrawerTab === 'constancias' && (
              <div className="space-y-3.5 card p-4 sm:p-5">
                <div className="flex items-center gap-2.5 border-b border-slate-200 dark:border-slate-800 pb-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Download size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                      Constancia Oficial de Asistencia a Sesión
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Membretado con Matrícula Provincial (M.P. {config.matriculaProvincial || '1842'}).
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs pt-1">
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Fecha de Atención</label>
                    <input
                      type="date"
                      value={constanciaFecha}
                      onChange={(e) => setConstanciaFecha(e.target.value)}
                      className="input-field font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Horario de Sesión</label>
                    <input
                      type="time"
                      value={constanciaHora}
                      onChange={(e) => setConstanciaHora(e.target.value)}
                      className="input-field font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Sede o Modalidad</label>
                    <select
                      value={constanciaSedeId}
                      onChange={(e) => setConstanciaSedeId(e.target.value)}
                      className="input-field text-xs"
                    >
                      {sedes.map(s => (
                        <option key={s.id} value={s.id}>{s.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => generateConstanciaPDF({
                      paciente: selectedPaciente,
                      turno: { fecha: constanciaFecha, horaInicio: constanciaHora },
                      config,
                      sede: getSedeById(constanciaSedeId)
                    })}
                    className="btn btn-primary text-xs py-2 px-4 shadow-sm flex items-center gap-2"
                  >
                    <Download size={14} />
                    <span>Descargar Constancia Oficial en PDF</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* MODAL: NUEVA EVOLUCIÓN */}
      {isEvoModalOpen && (
        <div className="modal-backdrop">
          <div className="card max-w-lg w-full p-5 sm:p-6 shadow-xl space-y-3.5 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
              <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                <FileText size={16} className="text-emerald-600" />
                Registrar Evolución Clínica
              </h3>
              <button onClick={() => setIsEvoModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle size={17} />
              </button>
            </div>

            <form onSubmit={handleSaveEvolucionSubmit} className="space-y-3 text-xs">
              
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Fecha</label>
                  <input
                    type="date"
                    value={evoFecha}
                    onChange={(e) => setEvoFecha(e.target.value)}
                    className="input-field text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Hora</label>
                  <input
                    type="time"
                    value={evoHora}
                    onChange={(e) => setEvoHora(e.target.value)}
                    className="input-field text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">N° Sesión</label>
                  <input
                    type="number"
                    value={evoNumeroSesion}
                    onChange={(e) => setEvoNumeroSesion(Number(e.target.value))}
                    className="input-field text-xs font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Motivo / Tema de la Sesión</label>
                <input
                  type="text"
                  placeholder="Ej: Registro de pensamientos y exposición gradual"
                  value={evoMotivo}
                  onChange={(e) => setEvoMotivo(e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Observaciones Clínicas (Notas)</label>
                <textarea
                  rows={3}
                  placeholder="Relato del paciente, estado anímico, progresos observados..."
                  value={evoObservaciones}
                  onChange={(e) => setEvoObservaciones(e.target.value)}
                  className="input-field text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Intervenciones y Técnicas</label>
                <textarea
                  rows={2}
                  placeholder="Reestructuración cognitiva, psicoeducación, respiración guiada, etc."
                  value={evoIntervenciones}
                  onChange={(e) => setEvoIntervenciones(e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Tareas Inter-sesión</label>
                <input
                  type="text"
                  placeholder="Ej: Completar autorregistro ante situaciones de tensión"
                  value={evoTareas}
                  onChange={(e) => setEvoTareas(e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Coseguro Abonado ($)</label>
                  <input
                    type="number"
                    value={evoMontoCoseguro}
                    onChange={(e) => setEvoMontoCoseguro(e.target.value)}
                    className="input-field text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Estado del Pago</label>
                  <select
                    value={evoPagoEstado}
                    onChange={(e) => setEvoPagoEstado(e.target.value)}
                    className="input-field text-xs"
                  >
                    <option value="Cobrado">Cobrado Efectivo</option>
                    <option value="Cobrado Transferencia">Cobrado Transferencia</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Cubierto 100%">Cubierto 100% por Obra Social</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2.5 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEvoModalOpen(false)}
                  className="btn btn-secondary text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-xs"
                >
                  Guardar Evolución
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL: CREAR / EDITAR PACIENTE */}
      {isCreateModalOpen && (
        <div className="modal-backdrop">
          <div className="card max-w-2xl w-full p-5 sm:p-6 shadow-xl space-y-4 max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
                {formData.id ? 'Editar Paciente' : 'Nuevo Paciente'}
              </h3>
              <button onClick={onCloseCreateModal} className="text-slate-400 hover:text-slate-600">
                <XCircle size={18} />
              </button>
            </div>

            <form onSubmit={handleSavePacienteSubmit} className="space-y-3.5 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    value={formData.nombreCompleto}
                    onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })}
                    className="input-field"
                    placeholder="Ej: Luciana Gómez"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">DNI *</label>
                  <input
                    type="text"
                    required
                    value={formData.dni}
                    onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                    className="input-field font-mono"
                    placeholder="Ej: 38.123.456"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Teléfono (WhatsApp)</label>
                  <input
                    type="text"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="input-field font-mono"
                    placeholder="+54 9 379 4xxxxxx"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field"
                    placeholder="paciente@gmail.com"
                  />
                </div>
              </div>

              {/* Cobertura y Sedes */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <div>
                  <label className="block font-semibold mb-1">Obra Social *</label>
                  <select
                    value={formData.obraSocialId}
                    onChange={(e) => {
                      const os = obrasSociales.find(o => o.id === e.target.value);
                      setFormData({ 
                        ...formData, 
                        obraSocialId: e.target.value,
                        coseguroPactado: os ? os.coseguroRecomendado : 0,
                        sesionesAutorizadas: os ? os.sesionesPorOrdenDefault : 10
                      });
                    }}
                    className="input-field"
                  >
                    {obrasSociales.map(os => (
                      <option key={os.id} value={os.id}>{os.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">N° de Afiliado</label>
                  <input
                    type="text"
                    value={formData.numeroAfiliado}
                    onChange={(e) => setFormData({ ...formData, numeroAfiliado: e.target.value })}
                    className="input-field font-mono"
                    placeholder="Ej: 01-499120"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">N° de Orden</label>
                  <input
                    type="text"
                    value={formData.numeroOrden}
                    onChange={(e) => setFormData({ ...formData, numeroOrden: e.target.value })}
                    className="input-field font-mono"
                    placeholder="ORD-9912"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Sesiones Autorizadas</label>
                  <input
                    type="number"
                    value={formData.sesionesAutorizadas}
                    onChange={(e) => setFormData({ ...formData, sesionesAutorizadas: e.target.value })}
                    className="input-field font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Sesiones Consumidas</label>
                  <input
                    type="number"
                    value={formData.sesionesConsumidas}
                    onChange={(e) => setFormData({ ...formData, sesionesConsumidas: e.target.value })}
                    className="input-field font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Coseguro ($)</label>
                  <input
                    type="number"
                    value={formData.coseguroPactado}
                    onChange={(e) => setFormData({ ...formData, coseguroPactado: e.target.value })}
                    className="input-field font-mono"
                  />
                </div>
              </div>

              {/* Sede habitual y contacto de emergencia */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Sede Habitual</label>
                  <select
                    value={formData.sedeHabitualId}
                    onChange={(e) => setFormData({ ...formData, sedeHabitualId: e.target.value })}
                    className="input-field"
                  >
                    {sedes.map(s => (
                      <option key={s.id} value={s.id}>{s.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Contacto de Emergencia</label>
                  <input
                    type="text"
                    value={formData.contactoEmergencia}
                    onChange={(e) => setFormData({ ...formData, contactoEmergencia: e.target.value })}
                    className="input-field"
                    placeholder="Nombre y celular"
                  />
                </div>
              </div>

              {/* Motivo de consulta */}
              <div>
                <label className="block font-semibold mb-1">Motivo de Consulta Inicial</label>
                <textarea
                  rows={2}
                  value={formData.motivoConsulta}
                  onChange={(e) => setFormData({ ...formData, motivoConsulta: e.target.value })}
                  className="input-field"
                  placeholder="Motivo principal manifestado por el paciente..."
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onCloseCreateModal}
                  className="btn btn-secondary text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-xs"
                >
                  Guardar Paciente
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
