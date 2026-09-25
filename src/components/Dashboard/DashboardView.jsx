import React, { useState } from 'react';
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  DollarSign,
  MessageCircle,
  Plus,
  ShieldAlert,
  Users,
  WalletCards,
  Check,
  Video,
  Building2,
  FileText,
  ChevronRight,
  Receipt
} from 'lucide-react';
import { sedeTone } from '../../lib/tones';
import { todayISO, addDaysISO, parseISODate, periodoLabel } from '../../lib/dates';
import { generateWhatsappLink, createReminderMessage, createOrderAlertMessage } from '../../services/whatsapp';

const money = (value) => `$${(value || 0).toLocaleString('es-AR')}`;

export const DashboardView = ({
  sedes = [],
  obrasSociales = [],
  pacientes = [],
  turnos = [],
  liquidaciones = [],
  config = {},
  selectedSedeId = 'all',
  privacyMode = false,
  onNavigateTab,
  onOpenNuevoTurno,
  onOpenPacienteDetalle,
  onActualizarTurnoEstado,
}) => {
  // Día activo del turnero (por defecto, hoy)
  const hoy = todayISO();
  const [selectedFecha, setSelectedFecha] = useState(hoy);
  const [filterModality, setFilterModality] = useState('all'); // 'all' | 'Presencial' | 'Online'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'Confirmado' | 'Atendido' | 'Pendiente'

  // Time & greeting
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Buen día' : currentHour < 19 ? 'Buenas tardes' : 'Buenas noches';

  // Week strip dates (Centered on demo week)
  const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const weekDays = [0, 1, 2, 3, 4, 5].map((n) => addDaysISO(n)).map((fecha, idx) => ({
    fecha,
    dayName: DAY_NAMES[new Date(`${fecha}T12:00:00`).getDay()],
    dayNum: fecha.slice(8),
    isToday: idx === 0,
  }));
  // Mini calendario: mes del día seleccionado
  const calBase = parseISODate(selectedFecha);
  const calYear = calBase.getFullYear();
  const calMonth = calBase.getMonth();
  const calFirstOffset = new Date(calYear, calMonth, 1, 12).getDay();
  const calDaysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const calMonthPrefix = `${calYear}-${String(calMonth + 1).padStart(2, '0')}`;
  const formatFechaLarga = (fecha) =>
    fecha
      ? new Date(`${fecha}T12:00:00`).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })
      : '';

  // Lookups
  const getSede = (id) => sedes.find((item) => item.id === id);
  const getPaciente = (id) => pacientes.find((item) => item.id === id);
  const getObraSocial = (id) => obrasSociales.find((item) => item.id === id);

  // Turnos filtering
  const turnosPorSede = turnos.filter(
    (t) => selectedSedeId === 'all' || t.sedeId === selectedSedeId
  );

  const turnosDelDia = turnosPorSede
    .filter((t) => !selectedFecha || t.fecha === selectedFecha)
    .filter((t) => filterModality === 'all' || t.modalidad === filterModality)
    .filter((t) => {
      if (filterStatus === 'all') return true;
      if (filterStatus === 'Atendido') return t.estado === 'Atendido';
      if (filterStatus === 'Confirmado') return t.estado === 'Confirmado';
      if (filterStatus === 'Pendiente') return t.coseguroEstado === 'Pendiente';
      return true;
    })
    .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

  // Practice stats
  const pacientesFiltrados = pacientes.filter(
    (p) => selectedSedeId === 'all' || p.sedeHabitualId === selectedSedeId
  );
  const alertas = pacientesFiltrados.filter(
    (p) => p.obraSocialId !== 'particular' && ((p.sesionesAutorizadas || 10) - (p.sesionesConsumidas || 0)) <= 2
  );
  const solicitudes = turnos.filter((t) => t.estado === 'Solicitado (Web)');
  const ingresosCoseguros = turnosDelDia
    .filter((t) => t.coseguroEstado === 'Cobrado')
    .reduce((sum, t) => sum + (t.coseguroMonto || 0), 0);
  const totalCosegurosPendientes = turnosDelDia
    .filter((t) => t.coseguroEstado === 'Pendiente')
    .reduce((sum, t) => sum + (t.coseguroMonto || 0), 0);

  // Spotlight Next Patient
  const nextPatientTurno = turnosDelDia.find((t) => t.estado === 'Confirmado' || t.estado === 'En Espera') || turnosDelDia[0];
  const nextPatient = nextPatientTurno ? getPaciente(nextPatientTurno.pacienteId) : null;
  const nextPatientOS = nextPatient ? getObraSocial(nextPatient.obraSocialId) : null;

  // Timeline hours
  const timelineHours = [
    '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  // Helper for appointments count per day in strip
  const countTurnosDay = (fecha) => turnosPorSede.filter((t) => t.fecha === fecha).length;

  const nombreCorto = config?.nombre?.replace(/Lic\.\s*/i, '').split(' ')[0] || config?.nombre || 'Licenciado/a';
  const totalDelDia = turnosPorSede.filter((t) => !selectedFecha || t.fecha === selectedFecha).length;
  const atendidos = turnosDelDia.filter((t) => t.estado === 'Atendido').length;

  const chip = (active) =>
    `h-8 px-3 inline-flex items-center gap-1.5 rounded-lg text-[13px] font-medium transition-colors ${
      active
        ? 'bg-slate-900 text-[#f4f1e8] dark:bg-slate-100 dark:text-slate-900'
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-900/[0.05] dark:hover:bg-white/[0.06] hover:text-slate-900 dark:hover:text-slate-100'
    }`;

  const stats = [
    { label: 'Sesiones del día', value: totalDelDia, hint: `${atendidos} atendida${atendidos === 1 ? '' : 's'}`, icon: Users, chip: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' },
    { label: 'Cobrado', value: money(ingresosCoseguros), hint: 'coseguros del día', icon: WalletCards, sensitive: true, chip: 'bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300' },
    { label: 'Por cobrar', value: money(totalCosegurosPendientes), hint: 'coseguros pendientes', icon: DollarSign, sensitive: true, tone: totalCosegurosPendientes > 0 ? 'amber' : null, chip: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300' },
    { label: 'Órdenes por renovar', value: alertas.length, hint: 'obras sociales', icon: ShieldAlert, tone: alertas.length > 0 ? 'rose' : null, onClick: () => onNavigateTab('pacientes'), chip: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300' },
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">

      {/* 1. Saludo + acciones */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pt-1">
        <div className="min-w-0">
          <p className="text-[13px] text-slate-500 flex items-center gap-2">
            <span className="relative flex w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-emerald-500 opacity-60 animate-ping" />
              <span className="relative w-2 h-2 rounded-full bg-emerald-500" />
            </span>
            Consultorio activo · {selectedSedeId === 'all' ? 'Todas las sedes' : getSede(selectedSedeId)?.nombre}
          </p>
          <h1 className="font-serif text-[2.4rem] sm:text-[2.9rem] leading-[1.02] text-slate-900 dark:text-slate-50 mt-2">
            {greeting}, <em className="text-emerald-700 dark:text-emerald-300">{nombreCorto}</em>.
          </h1>
          <p className="text-[14px] text-slate-500 mt-2">
            {config?.matriculaProvincial || 'M.P. 1842'} · Tenés <strong className="font-medium text-slate-800 dark:text-slate-200">{turnosDelDia.length} {turnosDelDia.length === 1 ? 'sesión' : 'sesiones'}</strong> en el turnero de este día.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {solicitudes.length > 0 && (
            <button
              onClick={() => onNavigateTab('portal-pacientes')}
              className="btn btn-secondary"
              title="Solicitudes de turnos web recibidas"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              {solicitudes.length} solicitud{solicitudes.length > 1 ? 'es' : ''} web
            </button>
          )}
          <button onClick={() => onNavigateTab('agenda')} className="btn btn-secondary">
            <CalendarDays size={15} className="text-slate-500" />
            Ver agenda completa
          </button>
          <button onClick={onOpenNuevoTurno} className="btn btn-primary">
            <Plus size={16} />
            Nuevo turno
          </button>
        </div>
      </section>

      {/* 2. Indicadores */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-[var(--border-color)] bg-[var(--border-color)]">
        {stats.map((s) => {
          const Icon = s.icon;
          const Tag = s.onClick ? 'button' : 'div';
          return (
            <Tag
              key={s.label}
              onClick={s.onClick}
              className={`bg-[var(--bg-card)] p-4 sm:p-5 text-left ${s.onClick ? 'hover:bg-[var(--bg-card-subtle)] transition-colors' : ''}`}
            >
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[12.5px] font-medium">{s.label}</span>
                <span className={`w-8 h-8 rounded-lg grid place-items-center ${s.chip}`}><Icon size={16} /></span>
              </div>
              <p className={`mt-1 text-[1.6rem] sm:text-[1.75rem] leading-none font-semibold tracking-[-0.02em] tabular-nums ${s.tone === 'amber' ? 'text-amber-700 dark:text-amber-300' : s.tone === 'rose' ? 'text-rose-700 dark:text-rose-300' : 'text-slate-900 dark:text-slate-50'} ${s.sensitive && privacyMode ? 'privacy-blur' : ''}`}>
                {s.value}
              </p>
              <p className="text-[12px] text-slate-500 mt-1.5">{s.hint}</p>
            </Tag>
          );
        })}
      </section>

      {/* 3. Espacio de trabajo */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-5 items-start">

        {/* Turnero */}
        <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-[var(--shadow-card)] min-w-0">
          <header className="px-4 sm:px-6 pt-5 pb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[12.5px] font-medium text-slate-500">Turnero del día</p>
              <h2 className="text-[1.15rem] font-semibold text-slate-900 dark:text-slate-50 mt-0.5 first-letter:uppercase">
                {formatFechaLarga(selectedFecha)}
              </h2>
            </div>
            <span className="text-[12.5px] text-slate-500">
              <span className="font-mono text-slate-800 dark:text-slate-200">{turnosDelDia.length}</span> pacientes agendados
            </span>
          </header>

          {/* Semana */}
          <div className="px-4 sm:px-6">
            <div className="grid grid-cols-6 gap-1.5" role="tablist" aria-label="Días de la semana">
              {weekDays.map((day) => {
                const count = countTurnosDay(day.fecha);
                const isActive = selectedFecha === day.fecha;
                return (
                  <button
                    key={day.fecha}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setSelectedFecha(day.fecha)}
                    className={`relative py-2.5 rounded-xl flex flex-col items-center gap-0.5 transition-colors duration-150 ${
                      isActive
                        ? 'bg-emerald-700 text-[#f4f1e8] dark:bg-emerald-300 dark:text-emerald-950'
                        : 'hover:bg-slate-900/[0.04] dark:hover:bg-white/[0.05] text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className={`text-[11px] font-medium ${isActive ? 'opacity-80' : 'text-slate-500'}`}>{day.dayName}</span>
                    <span className="text-[1.15rem] font-semibold tabular-nums leading-tight">{day.dayNum}</span>
                    <span className="flex gap-0.5 h-1.5 items-center">
                      {count > 0
                        ? Array.from({ length: Math.min(count, 4) }).map((_, k) => (
                            <span key={k} className={`w-1 h-1 rounded-full ${isActive ? 'bg-current opacity-80' : 'bg-emerald-500'}`} />
                          ))
                        : <span className={`text-[9.5px] ${isActive ? 'opacity-70' : 'text-slate-400'}`}>libre</span>}
                    </span>
                    {day.isToday && !isActive && (
                      <span className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-rose-500" title="Hoy" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filtros */}
          <div className="px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-subtle)]">
            <div className="flex flex-wrap items-center gap-1">
              <button onClick={() => setFilterModality('all')} className={chip(filterModality === 'all')}>
                Todos <span className="font-mono opacity-70">{totalDelDia}</span>
              </button>
              <button onClick={() => setFilterModality('Presencial')} className={chip(filterModality === 'Presencial')}>
                <Building2 size={14} /> Presenciales
              </button>
              <button onClick={() => setFilterModality('Online')} className={chip(filterModality === 'Online')}>
                <Video size={14} /> Online
              </button>
            </div>
            <button
              onClick={() => setFilterStatus(filterStatus === 'Pendiente' ? 'all' : 'Pendiente')}
              aria-pressed={filterStatus === 'Pendiente'}
              className={`h-8 px-3 inline-flex items-center gap-1.5 rounded-lg text-[13px] font-medium border transition-colors ${
                filterStatus === 'Pendiente'
                  ? 'bg-amber-100 border-amber-300 text-amber-900 dark:bg-amber-500/20 dark:border-amber-500/40 dark:text-amber-200'
                  : 'border-[var(--border-color)] text-slate-600 dark:text-slate-400 hover:border-amber-300 hover:text-amber-800'
              }`}
            >
              <DollarSign size={14} /> Coseguros pendientes
            </button>
          </div>

          {/* Línea de tiempo */}
          <ol className="px-4 sm:px-6 py-3">
            {timelineHours.map((hora, idx) => {
              const hourPrefix = hora.split(':')[0];
              const slotAppointments = turnosDelDia.filter((t) => t.horaInicio.startsWith(hourPrefix));
              const nowHour = new Date().getHours();
              const isNowSlot = selectedFecha === weekDays[0].fecha && parseInt(hora) > nowHour && (idx === 0 || parseInt(timelineHours[idx - 1]) <= nowHour);

              return (
                <li key={hora}>
                  {isNowSlot && (
                    <div className="flex items-center gap-3 py-2 pl-[60px]" aria-label="Ahora">
                      <span className="h-px flex-1 bg-rose-300 dark:bg-rose-500/50" />
                      <span className="text-[11px] font-medium text-rose-600 dark:text-rose-300">Ahora · consultorio en marcha</span>
                      <span className="h-px flex-1 bg-rose-300 dark:bg-rose-500/50" />
                    </div>
                  )}
                  <div className="grid grid-cols-[48px_minmax(0,1fr)] gap-3 py-1.5">
                    <time className="font-mono text-[12.5px] text-slate-500 pt-2.5 text-right">{hora}</time>

                    <div className="space-y-2 min-w-0">
                      {slotAppointments.length > 0 ? (
                        slotAppointments.map((turno) => {
                          const pac = getPaciente(turno.pacienteId);
                          const os = pac ? getObraSocial(pac.obraSocialId) : null;
                          const sedeTurno = getSede(turno.sedeId);
                          const pacNombre = pac?.nombreCompleto || turno.pacienteNombre || 'Paciente';
                          const pacTel = pac?.telefono || turno.pacienteTelefono || '';
                          const pacOs = os?.nombre || 'Particular';
                          const isPresencial = turno.modalidad === 'Presencial';
                          const isAtendido = turno.estado === 'Atendido';
                          const tone = sedeTone(sedeTurno);

                          const waLink = pacTel
                            ? generateWhatsappLink(
                                pacTel,
                                createReminderMessage(config.plantillaMensajeRecordatorio, {
                                  pacienteNombre: pacNombre,
                                  dia: turno.fecha,
                                  hora: turno.horaInicio,
                                  sedeNombre: sedeTurno?.nombre,
                                  modalidad: turno.modalidad,
                                  linkOnline: turno.notas?.includes('meet')
                                    ? turno.notas
                                    : 'https://meet.google.com/psico-ctes',
                                })
                              )
                            : '#';

                          return (
                            <article
                              key={turno.id}
                              className={`relative rounded-xl border bg-[var(--bg-card)] pl-4 pr-3 py-3 flex flex-col md:flex-row md:items-center gap-3 transition-[border-color,box-shadow] duration-150 hover:shadow-[var(--shadow-hover)] ${
                                isAtendido ? 'border-[var(--border-subtle)] opacity-75' : 'border-[var(--border-color)]'
                              }`}
                            >
                              <span className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full ${tone.bar}`} />

                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="hidden sm:grid w-9 h-9 rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200 place-items-center text-[12px] font-semibold flex-shrink-0">
                                  {pacNombre.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-baseline gap-2 min-w-0">
                                    <button
                                      onClick={() => pac && onOpenPacienteDetalle(pac)}
                                      className={`py-1.5 -my-1.5 text-[14.5px] font-semibold text-slate-900 dark:text-slate-50 hover:text-emerald-700 dark:hover:text-emerald-300 truncate transition-colors ${privacyMode ? 'privacy-blur' : ''}`}
                                    >
                                      {pacNombre}
                                    </button>
                                    <span className="text-[12px] text-slate-500 font-mono flex-shrink-0">
                                      {turno.horaInicio}–{turno.horaFin}
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12.5px] text-slate-500 mt-0.5">
                                    <span className={`inline-flex items-center gap-1 ${isPresencial ? 'text-emerald-700 dark:text-emerald-300' : 'text-sky-700 dark:text-sky-300'}`}>
                                      {isPresencial ? <Building2 size={12} /> : <Video size={12} />}
                                      {turno.modalidad}
                                    </span>
                                    <span className="text-slate-300 dark:text-slate-600">·</span>
                                    <span className="inline-flex items-center gap-1.5">
                                      <span className={`w-1.5 h-1.5 rounded-full ${tone.dot}`} />
                                      {sedeTurno?.nombre?.split('-')[0].trim() || 'Sede'}
                                    </span>
                                    <span className="text-slate-300 dark:text-slate-600">·</span>
                                    <span>{pacOs}</span>
                                    <span className="text-slate-300 dark:text-slate-600">·</span>
                                    <span className={`${turno.coseguroEstado === 'Cobrado' ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'} ${privacyMode ? 'privacy-blur' : ''}`}>
                                      {money(turno.coseguroMonto)} {turno.coseguroEstado?.toLowerCase()}
                                    </span>
                                  </div>
                                  {turno.notas && (
                                    <p className="text-[12.5px] text-slate-500 truncate mt-1 flex items-center gap-1.5">
                                      <FileText size={12} className="flex-shrink-0 text-slate-400" />
                                      {turno.notas}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 md:flex-shrink-0 sm:pl-12 md:pl-0">
                                {pacTel && (
                                  <a
                                    href={waLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-8 px-2.5 inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] text-[12.5px] font-medium text-slate-700 dark:text-slate-300 hover:bg-[var(--bg-card-subtle)] transition-colors"
                                    title="Enviar recordatorio por WhatsApp"
                                  >
                                    <MessageCircle size={14} className="text-emerald-600 dark:text-emerald-400" />
                                    <span className="hidden sm:inline">Recordar</span>
                                  </a>
                                )}
                                <button
                                  onClick={() => {
                                    const nextState =
                                      turno.estado === 'Confirmado'
                                        ? 'Atendido'
                                        : turno.estado === 'Atendido'
                                        ? 'Confirmado'
                                        : 'Atendido';
                                    if (onActualizarTurnoEstado) {
                                      onActualizarTurnoEstado(turno.id, nextState);
                                    }
                                  }}
                                  className={`h-8 px-2.5 inline-flex items-center gap-1.5 rounded-lg text-[12.5px] font-medium border transition-colors active:scale-[0.97] ${
                                    isAtendido
                                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-500/15 dark:border-emerald-500/30 dark:text-emerald-200'
                                      : 'border-[var(--border-color)] text-slate-700 dark:text-slate-300 hover:bg-[var(--bg-card-subtle)]'
                                  }`}
                                  title="Cambiar estado del turno"
                                >
                                  {isAtendido ? <Check size={14} /> : <CheckCircle2 size={14} className="text-slate-400" />}
                                  {turno.estado}
                                </button>
                                {pac && (
                                  <button
                                    onClick={() => onOpenPacienteDetalle(pac)}
                                    className="flex-shrink-0 h-8 w-8 inline-grid place-items-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-900/[0.05] dark:hover:bg-white/[0.06] dark:hover:text-slate-100 transition-colors"
                                    title="Ver historia clínica"
                                    aria-label="Ver ficha"
                                  >
                                    <ChevronRight size={16} />
                                  </button>
                                )}
                              </div>
                            </article>
                          );
                        })
                      ) : (
                        <button
                          onClick={onOpenNuevoTurno}
                          className="group w-full h-10 px-3 rounded-lg border border-dashed border-transparent hover:border-[var(--border-color)] hover:bg-[var(--bg-card-subtle)] flex items-center justify-between text-[13px] text-slate-400 transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <span className="h-px w-6 bg-[var(--border-color)] group-hover:w-0 transition-[width]" />
                            Disponible
                          </span>
                          <span className="inline-flex items-center gap-1 font-medium text-emerald-700 dark:text-emerald-300 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
                            <Plus size={14} /> Agendar
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Panel lateral */}
        <aside className="space-y-4">

          {/* Próximo paciente */}
          <div className="rounded-2xl bg-emerald-800 text-[#f4f1e8] dark:bg-emerald-900/60 dark:border dark:border-emerald-800 p-5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[12.5px] font-medium text-emerald-200">Próximo paciente</span>
              <span className="font-mono text-[12px] px-2 py-0.5 rounded-md bg-white/10 text-emerald-50">
                {nextPatientTurno ? `${nextPatientTurno.horaInicio} hs` : 'Sin turnos'}
              </span>
            </div>

            {nextPatientTurno && nextPatient ? (
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#f4f1e8] text-emerald-900 grid place-items-center font-semibold text-[14px]">
                    {nextPatient.nombreCompleto.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className={`font-serif text-[1.55rem] leading-tight truncate ${privacyMode ? 'privacy-blur' : ''}`}>
                      {nextPatient.nombreCompleto}
                    </h3>
                    <p className="text-[12.5px] text-emerald-200/90 truncate">
                      {nextPatientOS?.nombre || 'Particular'} · {nextPatient.telefono || 'Sin teléfono'}
                    </p>
                  </div>
                </div>

                <p className="text-[13px] leading-relaxed text-emerald-50/90 border-l-2 border-emerald-400/50 pl-3">
                  {nextPatientTurno.notas || 'Sesión regular de seguimiento clínico. Revisar avances desde el último encuentro.'}
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {nextPatient.telefono && (
                    <a
                      href={generateWhatsappLink(nextPatient.telefono, `Hola ${nextPatient.nombreCompleto}, te espero en consulta.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-9 inline-flex items-center justify-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-[13px] font-medium transition-colors"
                    >
                      <MessageCircle size={14} /> WhatsApp
                    </a>
                  )}
                  <button
                    onClick={() => onOpenPacienteDetalle(nextPatient)}
                    className="h-9 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#f4f1e8] text-emerald-900 hover:bg-white text-[13px] font-medium transition-colors active:scale-[0.97]"
                  >
                    <FileText size={14} /> Ver ficha
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center">
                <CheckCircle2 size={28} className="mx-auto mb-2 text-emerald-300" />
                <p className="text-[14px] font-medium">Agenda del día al día</p>
                <p className="text-[12.5px] text-emerald-200/80">No hay turnos inmediatos pendientes.</p>
              </div>
            )}
          </div>

          {/* Mini calendario */}
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[14px] font-semibold text-slate-900 dark:text-slate-50">{periodoLabel(calBase)}</span>
              <button
                onClick={() => setSelectedFecha(hoy)}
                className="h-9 -my-2 px-2 -mr-2 text-[12.5px] font-medium text-emerald-700 dark:text-emerald-300 hover:underline underline-offset-2"
              >
                Hoy
              </button>
            </div>
            <div className="grid grid-cols-7 gap-0.5 text-center">
              {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((d, i) => (
                <div key={i} className="text-[11px] font-medium text-slate-400 pb-1">{d}</div>
              ))}
              {Array.from({ length: calFirstOffset }, (_, i) => <div key={`e${i}`} />)}
              {Array.from({ length: calDaysInMonth }, (_, i) => {
                const dayNum = i + 1;
                const formattedDate = `${calMonthPrefix}-${dayNum < 10 ? '0' + dayNum : dayNum}`;
                const hasTurnos = countTurnosDay(formattedDate) > 0;
                const isSelected = selectedFecha === formattedDate;
                return (
                  <button
                    key={dayNum}
                    onClick={() => setSelectedFecha(formattedDate)}
                    aria-pressed={isSelected}
                    className={`relative h-9 rounded-lg text-[13px] tabular-nums transition-colors ${
                      isSelected
                        ? 'bg-emerald-700 text-[#f4f1e8] font-semibold dark:bg-emerald-300 dark:text-emerald-950'
                        : formattedDate === hoy
                        ? 'text-emerald-800 dark:text-emerald-200 font-semibold ring-1 ring-inset ring-emerald-300 dark:ring-emerald-700'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-900/[0.05] dark:hover:bg-white/[0.06]'
                    }`}
                  >
                    {dayNum}
                    {hasTurnos && !isSelected && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Caja del día */}
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4">
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-semibold text-slate-900 dark:text-slate-50">Caja del día</span>
              <button
                onClick={() => onNavigateTab('finanzas')}
                className="h-9 -my-2 px-2 -mr-2 text-[12.5px] font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 inline-flex items-center gap-0.5"
              >
                Finanzas <ArrowUpRight size={13} />
              </button>
            </div>
            <dl className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <dt className="text-[12px] text-slate-500">Cobrado</dt>
                <dd className={`text-[1.3rem] font-semibold tabular-nums text-slate-900 dark:text-slate-50 ${privacyMode ? 'privacy-blur' : ''}`}>{money(ingresosCoseguros)}</dd>
              </div>
              <div>
                <dt className="text-[12px] text-slate-500">Por cobrar</dt>
                <dd className={`text-[1.3rem] font-semibold tabular-nums text-amber-700 dark:text-amber-300 ${privacyMode ? 'privacy-blur' : ''}`}>{money(totalCosegurosPendientes)}</dd>
              </div>
            </dl>
            <button onClick={() => onNavigateTab('facturas')} className="btn btn-secondary w-full mt-4">
              <Receipt size={15} className="text-slate-500" />
              Emitir comprobante ARCA
            </button>
          </div>

          {/* Órdenes por renovar */}
          {alertas.length > 0 && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/60 dark:border-amber-500/25 dark:bg-amber-500/[0.06] p-4">
              <div className="flex items-center gap-2">
                <ShieldAlert size={16} className="text-amber-600 dark:text-amber-400" />
                <span className="text-[14px] font-semibold text-amber-900 dark:text-amber-200">
                  {alertas.length} {alertas.length === 1 ? 'orden por renovar' : 'órdenes por renovar'}
                </span>
              </div>

              <ul className="mt-3 divide-y divide-amber-200/70 dark:divide-amber-500/15 max-h-56 overflow-y-auto">
                {alertas.map((pac) => {
                  const os = getObraSocial(pac.obraSocialId);
                  const disponibles = (pac.sesionesAutorizadas || 10) - (pac.sesionesConsumidas || 0);
                  const waAlertLink = pac.telefono
                    ? generateWhatsappLink(
                        pac.telefono,
                        createOrderAlertMessage(config.plantillaMensajeAlertaOrden, {
                          pacienteNombre: pac.nombreCompleto,
                          obraSocialNombre: os?.nombre || 'tu obra social',
                          sesionesRestantes: disponibles,
                        })
                      )
                    : '#';

                  return (
                    <li key={pac.id} className="py-2.5 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className={`text-[13.5px] font-medium text-slate-900 dark:text-slate-100 truncate ${privacyMode ? 'privacy-blur' : ''}`}>
                          {pac.nombreCompleto}
                        </p>
                        <p className="text-[12px] text-amber-800 dark:text-amber-300">
                          {disponibles} {disponibles === 1 ? 'sesión restante' : 'sesiones restantes'} · {os?.nombre}
                        </p>
                      </div>
                      {pac.telefono && (
                        <a
                          href={waAlertLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 grid place-items-center rounded-lg text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-500/15 transition-colors flex-shrink-0"
                          title="Enviar recordatorio de orden médica por WhatsApp"
                          aria-label="Avisar por WhatsApp"
                        >
                          <MessageCircle size={15} />
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
