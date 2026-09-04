import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  MessageCircle, 
  Filter, 
  Building2, 
  MapPin, 
  Video, 
  ChevronLeft, 
  ChevronRight,
  User,
  DollarSign,
  FileCheck,
  Share2,
  Check
} from 'lucide-react';
import { generateWhatsappLink, createReminderMessage } from '../../services/whatsapp';

export const AgendaView = ({
  sedes,
  obrasSociales,
  pacientes,
  turnos,
  config,
  selectedSedeId,
  privacyMode,
  onSaveTurno,
  onDeleteTurno,
  onActualizarTurnoEstado,
  onOpenPacienteDetalle,
  isModalOpen,
  onCloseModal,
  onOpenNuevoTurno
}) => {
  const [filterSede, setFilterSede] = useState(selectedSedeId || 'all');
  const [filterEstado, setFilterEstado] = useState('all');
  const [selectedFecha, setSelectedFecha] = useState('2026-09-01'); // Fecha demo activa
  const [editingTurno, setEditingTurno] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Form State para Nuevo / Editar Turno
  const [formPacienteId, setFormPacienteId] = useState('');
  const [formFecha, setFormFecha] = useState('2026-09-01');
  const [formHoraInicio, setFormHoraInicio] = useState('15:00');
  const [formHoraFin, setFormHoraFin] = useState('15:45');
  const [formSedeId, setFormSedeId] = useState('sede-centro');
  const [formModalidad, setFormModalidad] = useState('Presencial');
  const [formEstado, setFormEstado] = useState('Confirmado');
  const [formCoseguroMonto, setFormCoseguroMonto] = useState(0);
  const [formCoseguroEstado, setFormCoseguroEstado] = useState('Pendiente');
  const [formMedioPago, setFormMedioPago] = useState('Efectivo');
  const [formNotas, setFormNotas] = useState('');

  // Sincronizar filtro si cambia desde el header
  React.useEffect(() => {
    if (selectedSedeId) setFilterSede(selectedSedeId);
  }, [selectedSedeId]);

  // Al seleccionar paciente en el modal, auto-completar coseguro y sede habitual
  const handlePacienteChange = (pacId) => {
    setFormPacienteId(pacId);
    const pac = pacientes.find(p => p.id === pacId);
    if (pac) {
      setFormSedeId(pac.sedeHabitualId || 'sede-centro');
      setFormCoseguroMonto(pac.coseguroPactado !== undefined ? pac.coseguroPactado : 0);
    }
  };

  const handleOpenEdit = (turno) => {
    setEditingTurno(turno);
    setFormPacienteId(turno.pacienteId);
    setFormFecha(turno.fecha);
    setFormHoraInicio(turno.horaInicio);
    setFormHoraFin(turno.horaFin);
    setFormSedeId(turno.sedeId);
    setFormModalidad(turno.modalidad);
    setFormEstado(turno.estado);
    setFormCoseguroMonto(turno.coseguroMonto || 0);
    setFormCoseguroEstado(turno.coseguroEstado || 'Pendiente');
    setFormMedioPago(turno.medioPago || 'Efectivo');
    setFormNotas(turno.notas || '');
    onOpenNuevoTurno();
  };

  const handleResetForm = () => {
    setEditingTurno(null);
    setFormPacienteId(pacientes[0]?.id || '');
    setFormFecha('2026-09-01');
    setFormHoraInicio('15:00');
    setFormHoraFin('15:45');
    setFormSedeId('sede-centro');
    setFormModalidad('Presencial');
    setFormEstado('Confirmado');
    setFormCoseguroMonto(3000);
    setFormCoseguroEstado('Pendiente');
    setFormMedioPago('Efectivo');
    setFormNotas('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formPacienteId) {
      alert('Por favor, selecciona un paciente.');
      return;
    }

    const nuevoTurnoData = {
      id: editingTurno ? editingTurno.id : `turno-${Date.now()}`,
      pacienteId: formPacienteId,
      fecha: formFecha,
      horaInicio: formHoraInicio,
      horaFin: formHoraFin,
      sedeId: formSedeId,
      modalidad: formModalidad,
      estado: formEstado,
      coseguroMonto: Number(formCoseguroMonto),
      coseguroEstado: formCoseguroEstado,
      medioPago: formMedioPago,
      notas: formNotas,
    };

    onSaveTurno(nuevoTurnoData);
    onCloseModal();
    handleResetForm();
  };

  const handleCopyPortalLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?portal=paciente`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Filtrado de turnos
  const filteredTurnos = turnos.filter(t => {
    const matchesSede = filterSede === 'all' || t.sedeId === filterSede;
    const matchesEstado = filterEstado === 'all' || t.estado === filterEstado;
    const matchesFecha = !selectedFecha || t.fecha === selectedFecha;
    return matchesSede && matchesEstado && matchesFecha;
  }).sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

  const getSedeById = (id) => sedes.find(s => s.id === id);
  const getPacienteById = (id) => pacientes.find(p => p.id === id);
  const getObraSocialById = (id) => obrasSociales.find(os => os.id === id);

  return (
    <div className="space-y-5 animate-fade-in">
      
      {/* Header de la Agenda */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarIcon size={24} className="text-emerald-600 dark:text-emerald-400" />
            Agenda Multisede
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gestión de turnos organizados por sede, modalidad y control de coseguros.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button 
            onClick={handleCopyPortalLink}
            className="btn btn-secondary text-xs flex items-center gap-1.5"
            title="Copiar link para que los pacientes reserven online"
          >
            {copiedLink ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
            <span>{copiedLink ? '¡Enlace copiado!' : 'Link Reservas'}</span>
          </button>

          <button 
            onClick={() => {
              handleResetForm();
              onOpenNuevoTurno();
            }}
            className="btn btn-primary text-xs"
          >
            <Plus size={15} />
            <span>Agendar Turno</span>
          </button>
        </div>
      </div>

      {/* Barra de Filtros y Fechas */}
      <div className="card p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3">
        
        {/* Selector de Fecha */}
        <div className="flex flex-wrap items-center gap-2">
          <input 
            type="date"
            value={selectedFecha}
            onChange={(e) => setSelectedFecha(e.target.value)}
            className="input-field py-1.5 px-3 text-xs w-auto font-mono font-medium"
          />
          <button
            onClick={() => setSelectedFecha('2026-09-01')}
            className={`btn text-xs py-1.5 px-3 ${selectedFecha === '2026-09-01' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Hoy (Demo)
          </button>
          <button
            onClick={() => setSelectedFecha('')}
            className={`btn text-xs py-1.5 px-3 ${!selectedFecha ? 'btn-primary' : 'btn-secondary'}`}
          >
            Todos los Días
          </button>
        </div>

        {/* Filtros por Sede y Estado */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Filter size={13} className="text-slate-400" />
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

          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="input-field py-1.5 px-2.5 text-xs w-auto"
          >
            <option value="all">Todos los Estados</option>
            <option value="Solicitado (Web)">🌐 Solicitado (Web)</option>
            <option value="Confirmado">Confirmado</option>
            <option value="Por Confirmar">Por Confirmar</option>
            <option value="Atendido">Atendido</option>
            <option value="Ausente con aviso">Ausente c/ aviso</option>
            <option value="Ausente sin aviso">Ausente s/ aviso</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>

      </div>

      {/* Lista de Turnos */}
      {filteredTurnos.length === 0 ? (
        <div className="card text-center py-12 text-slate-400">
          <Clock size={36} className="mx-auto mb-2 opacity-40 text-slate-400" />
          <h3 className="font-bold text-xs text-slate-700 dark:text-slate-200">No hay turnos para los filtros seleccionados</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Prueba cambiando la fecha o agregando un nuevo turno.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2.5">
          {filteredTurnos.map((turno) => {
            const pac = getPacienteById(turno.pacienteId);
            const os = pac ? getObraSocialById(pac.obraSocialId) : null;
            const sede = getSedeById(turno.sedeId);
            const pacNombre = pac?.nombreCompleto || turno.pacienteNombre || 'Paciente';
            const pacTel = pac?.telefono || turno.pacienteTelefono || '';
            const pacDni = pac?.dni || turno.pacienteDni || '-';
            const pacOs = os?.nombre || turno.pacienteObraSocial || 'Particular';

            const isWebRequested = turno.estado === 'Solicitado (Web)';

            const waLink = pacTel ? generateWhatsappLink(
              pacTel,
              isWebRequested 
                ? `¡Hola ${pacNombre}! Te confirmo tu turno de atención psicológica con ${config.nombre || 'la Lic. Virna Toledo'} para el día ${turno.fecha} a las ${turno.horaInicio} hs en ${sede?.nombre || 'el consultorio'}. ¡Nos vemos!`
                : createReminderMessage(config.plantillaMensajeRecordatorio, {
                    pacienteNombre: pacNombre,
                    dia: turno.fecha,
                    hora: turno.horaInicio,
                    sedeNombre: sede?.nombre,
                    modalidad: turno.modalidad,
                    linkOnline: turno.notas?.includes('meet') ? turno.notas : 'https://meet.google.com/psico-ctes'
                  })
            ) : '#';

            return (
              <div 
                key={turno.id}
                className={`card p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all ${
                  isWebRequested 
                    ? 'border-emerald-300 dark:border-emerald-700/80 bg-emerald-50/20 dark:bg-emerald-950/20' 
                    : ''
                }`}
              >
                
                {/* Bloque Izquierdo: Horario, Paciente, Sede */}
                <div className="flex items-start gap-3.5">
                  
                  {/* Badge de Horario */}
                  <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 rounded-xl p-2.5 text-center min-w-[76px]">
                    <span className="text-sm font-bold text-slate-900 dark:text-white font-mono block">
                      {turno.horaInicio}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                      {turno.horaFin}
                    </span>
                    <span className="text-[9px] font-medium text-slate-400 dark:text-slate-500 mt-0.5 block">
                      {turno.fecha}
                    </span>
                  </div>

                  {/* Datos del Paciente */}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 
                        onClick={() => pac && onOpenPacienteDetalle(pac)}
                        className="font-bold text-sm text-slate-900 dark:text-white hover:text-emerald-600 cursor-pointer"
                      >
                        {pacNombre}
                      </h3>
                      
                      {sede && (
                        <span className={`badge ${sede.badgeClass} text-[10px]`}>
                          {sede.nombre.split('-')[0].trim()}
                        </span>
                      )}

                      <span className={`badge text-[10px] font-bold ${
                        turno.estado === 'Solicitado (Web)' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200' :
                        turno.estado === 'Atendido' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200' :
                        turno.estado === 'Confirmado' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200' :
                        turno.estado === 'Por Confirmar' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200' :
                        'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200'
                      }`}>
                        {turno.estado}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span><strong>DNI:</strong> {pacDni}</span>
                      <span>•</span>
                      <span><strong>Cobertura:</strong> {pacOs}</span>
                      <span>•</span>
                      <span><strong>Modalidad:</strong> {turno.modalidad}</span>
                    </div>

                    {/* Coseguro */}
                    <div className="flex flex-wrap items-center gap-2 text-xs pt-0.5">
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                        <DollarSign size={13} className="text-emerald-600" />
                        Coseguro: ${turno.coseguroMonto?.toLocaleString('es-AR') || 0}
                      </span>
                      <span className={`badge text-[10px] ${
                        turno.coseguroEstado === 'Cobrado' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {turno.coseguroEstado} ({turno.medioPago})
                      </span>
                    </div>

                    {turno.notas && (
                      <p className={`text-[11px] text-slate-500 dark:text-slate-400 italic ${privacyMode ? 'privacy-blur' : ''}`}>
                        💬 {turno.notas}
                      </p>
                    )}
                  </div>
                </div>

                {/* Acciones del Turno */}
                <div className="flex flex-wrap items-center gap-1.5 self-end md:self-center">
                  
                  {isWebRequested && (
                    <button
                      onClick={() => onActualizarTurnoEstado(turno.id, 'Confirmado')}
                      className="btn btn-primary text-xs py-1.5 px-3"
                      title="Aprobar solicitud web y confirmar turno"
                    >
                      <CheckCircle2 size={14} />
                      <span>Aprobar</span>
                    </button>
                  )}

                  <select
                    value={turno.estado}
                    onChange={(e) => onActualizarTurnoEstado(turno.id, e.target.value)}
                    className="input-field py-1.5 px-2 text-xs w-auto"
                  >
                    <option value="Confirmado">Confirmado</option>
                    <option value="Atendido">Atendido</option>
                    <option value="Por Confirmar">Por Confirmar</option>
                    <option value="Cancelado">Cancelado</option>
                    <option value="Ausente con aviso">Ausente c/ Aviso</option>
                    <option value="Ausente sin aviso">Ausente s/ Aviso</option>
                  </select>

                  {pacTel && (
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-whatsapp text-xs py-1.5 px-3"
                      title="Enviar recordatorio por WhatsApp"
                    >
                      <MessageCircle size={13} />
                      <span>WhatsApp</span>
                    </a>
                  )}

                  <button
                    onClick={() => handleOpenEdit(turno)}
                    className="btn btn-secondary text-xs py-1.5 px-2.5"
                    title="Editar detalles del turno"
                  >
                    <span>Editar</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('¿Deseas eliminar este turno de la agenda?')) {
                        onDeleteTurno(turno.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Eliminar turno"
                  >
                    <XCircle size={16} />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: Nuevo / Editar Turno */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="card max-w-lg w-full p-5 sm:p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
                {editingTurno ? 'Editar Turno' : 'Agendar Nuevo Turno'}
              </h3>
              <button onClick={onCloseModal} className="text-slate-400 hover:text-slate-600">
                <XCircle size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* Paciente */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Paciente *
                </label>
                <select
                  value={formPacienteId}
                  onChange={(e) => handlePacienteChange(e.target.value)}
                  className="input-field text-xs"
                  required
                >
                  <option value="">Selecciona un paciente...</option>
                  {pacientes.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.nombreCompleto} (DNI: {p.dni || 'Sin DNI'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Sede y Modalidad */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Sede de Atención *
                  </label>
                  <select
                    value={formSedeId}
                    onChange={(e) => setFormSedeId(e.target.value)}
                    className="input-field text-xs"
                  >
                    {sedes.map(s => (
                      <option key={s.id} value={s.id}>{s.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Modalidad
                  </label>
                  <select
                    value={formModalidad}
                    onChange={(e) => setFormModalidad(e.target.value)}
                    className="input-field text-xs"
                  >
                    <option value="Presencial">Presencial</option>
                    <option value="Online">Online (Videollamada)</option>
                    <option value="Domicilio">Domicilio</option>
                  </select>
                </div>
              </div>

              {/* Fecha y Horarios */}
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Fecha *
                  </label>
                  <input
                    type="date"
                    value={formFecha}
                    onChange={(e) => setFormFecha(e.target.value)}
                    className="input-field font-mono text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Hora Inicio
                  </label>
                  <input
                    type="time"
                    value={formHoraInicio}
                    onChange={(e) => setFormHoraInicio(e.target.value)}
                    className="input-field font-mono text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Hora Fin
                  </label>
                  <input
                    type="time"
                    value={formHoraFin}
                    onChange={(e) => setFormHoraFin(e.target.value)}
                    className="input-field font-mono text-xs"
                  />
                </div>
              </div>

              {/* Estado y Coseguro */}
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Estado
                  </label>
                  <select
                    value={formEstado}
                    onChange={(e) => setFormEstado(e.target.value)}
                    className="input-field text-xs"
                  >
                    <option value="Confirmado">Confirmado</option>
                    <option value="Por Confirmar">Por Confirmar</option>
                    <option value="Atendido">Atendido</option>
                    <option value="Ausente con aviso">Ausente c/ aviso</option>
                    <option value="Ausente sin aviso">Ausente s/ aviso</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Coseguro ($)
                  </label>
                  <input
                    type="number"
                    value={formCoseguroMonto}
                    onChange={(e) => setFormCoseguroMonto(e.target.value)}
                    className="input-field font-mono text-xs"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Estado Cobro
                  </label>
                  <select
                    value={formCoseguroEstado}
                    onChange={(e) => setFormCoseguroEstado(e.target.value)}
                    className="input-field text-xs"
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Cobrado">Cobrado</option>
                  </select>
                </div>
              </div>

              {/* Medio de pago */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Medio de Pago
                </label>
                <select
                  value={formMedioPago}
                  onChange={(e) => setFormMedioPago(e.target.value)}
                  className="input-field text-xs"
                >
                  <option value="Efectivo">Efectivo (en consultorio)</option>
                  <option value="Transferencia">Transferencia Bancaria (Alias/CBU)</option>
                  <option value="Mercado Pago">Mercado Pago</option>
                  <option value="OSDE 100%">100% Cubierto por Obra Social</option>
                </select>
              </div>

              {/* Notas del turno */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Observaciones / Notas (o Link de Meet)
                </label>
                <textarea
                  value={formNotas}
                  onChange={(e) => setFormNotas(e.target.value)}
                  rows={2}
                  className="input-field text-xs"
                  placeholder="Ej: Traer pedido médico de IOSCOR, o https://meet.google.com/..."
                />
              </div>

              {/* Botones de acción */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onCloseModal}
                  className="btn btn-secondary text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-xs"
                >
                  {editingTurno ? 'Guardar Cambios' : 'Agendar Turno'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
