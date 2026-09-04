import React from 'react';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  MessageCircle, 
  CheckCircle2, 
  Clock, 
  Plus, 
  FileText, 
  ArrowUpRight,
  ShieldAlert,
  Sparkles,
  Building2
} from 'lucide-react';
import { generateWhatsappLink, createReminderMessage, createOrderAlertMessage } from '../../services/whatsapp';

export const DashboardView = ({
  sedes,
  obrasSociales,
  pacientes,
  turnos,
  liquidaciones,
  config,
  selectedSedeId,
  privacyMode,
  onNavigateTab,
  onOpenNuevoTurno,
  onOpenPacienteDetalle,
  onActualizarTurnoEstado,
}) => {
  // Filtrar según sede seleccionada
  const filteredTurnos = turnos.filter(t => selectedSedeId === 'all' || t.sedeId === selectedSedeId);
  const filteredPacientes = pacientes.filter(p => selectedSedeId === 'all' || p.sedeHabitualId === selectedSedeId);

  // Turnos de hoy
  const hoyStr = new Date().toISOString().split('T')[0];
  const turnosHoy = filteredTurnos.filter(t => t.fecha === '2026-09-01' || t.fecha === hoyStr);

  // Pacientes con alerta de obra social (quedan <= 2 sesiones)
  const pacientesEnAlerta = filteredPacientes.filter(p => {
    if (p.obraSocialId === 'particular') return false;
    const restantes = (p.sesionesAutorizadas || 10) - (p.sesionesConsumidas || 0);
    return restantes <= 2;
  });

  // Solicitudes de turnos web pendientes
  const turnosWebPendientes = turnos.filter(t => t.estado === 'Solicitado (Web)');

  // Cálculo de facturación estimada del mes
  const ingresosCosegurosMes = turnos
    .filter(t => t.coseguroEstado === 'Cobrado')
    .reduce((acc, curr) => acc + (curr.coseguroMonto || 0), 0);

  const ingresosLiquidadosMes = liquidaciones
    .reduce((acc, curr) => acc + (curr.montoBruto || 0), 0);

  const totalEstimadoMes = ingresosCosegurosMes + ingresosLiquidadosMes;

  const getSedeById = (id) => sedes.find(s => s.id === id);
  const getPacienteById = (id) => pacientes.find(p => p.id === id);
  const getObraSocialById = (id) => obrasSociales.find(os => os.id === id);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Banner de Solicitudes Web Pendientes */}
      {turnosWebPendientes.length > 0 && (
        <div className="bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Sparkles size={16} />
            </div>
            <div>
              <h4 className="font-bold text-xs text-emerald-950 dark:text-emerald-200">
                {turnosWebPendientes.length} solicitud{turnosWebPendientes.length > 1 ? 'es' : ''} de turno online pendiente{turnosWebPendientes.length > 1 ? 's' : ''}
              </h4>
              <p className="text-[11px] text-emerald-700/80 dark:text-emerald-300/70">
                Pacientes que reservaron vía web aguardan tu confirmación en la agenda.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('agenda')}
            className="btn btn-primary text-xs py-1.5 px-3 self-start sm:self-auto"
          >
            <span>Revisar Agenda</span>
            <ArrowUpRight size={13} />
          </button>
        </div>
      )}

      {/* Hero Welcome Banner (Sereno, Elegante, Calmante) */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden border border-slate-800/80">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-60 h-60 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/10 text-emerald-200 px-3 py-1 rounded-full text-xs font-semibold border border-white/15 mb-2.5">
              <Sparkles size={13} className="text-amber-300" />
              <span>Panel Clínico & Gestión Integral</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
              ¡Hola, {config.nombre}!
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-xl font-normal leading-relaxed">
              Tenés <span className="font-bold text-white bg-white/15 px-2 py-0.5 rounded">{turnosHoy.length} turnos</span> agendados para hoy. 
              {pacientesEnAlerta.length > 0 && ` Hay ${pacientesEnAlerta.length} pacientes con órdenes de Obra Social por agotar.`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button 
              onClick={onOpenNuevoTurno}
              className="btn bg-white text-slate-900 hover:bg-slate-100 shadow-sm text-xs py-2.5 px-4 font-bold"
            >
              <Plus size={15} className="text-emerald-600" />
              <span>Nuevo Turno</span>
            </button>
            <button 
              onClick={() => onNavigateTab('facturas')}
              className="btn bg-slate-800/80 hover:bg-slate-700/80 text-white border border-slate-700 text-xs py-2.5 px-3.5"
            >
              <DollarSign size={14} />
              <span>Facturar</span>
            </button>
            <button 
              onClick={() => onNavigateTab('portal-pacientes')}
              className="btn bg-slate-800/80 hover:bg-slate-700/80 text-white border border-slate-700 text-xs py-2.5 px-3.5"
            >
              <span>Portal Pacientes</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Card 1: Turnos Hoy */}
        <div className="card p-4.5 flex items-center justify-between card-glow-purple">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Turnos de Hoy</p>
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white mt-0.5">
              {turnosHoy.length}
            </h3>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
              {turnosHoy.filter(t => t.estado === 'Confirmado').length} confirmados
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/60">
            <Calendar size={20} />
          </div>
        </div>

        {/* Card 2: Pacientes Activos */}
        <div className="card p-4.5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Pacientes Activos</p>
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white mt-0.5">
              {filteredPacientes.length}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              En tratamiento regular
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-100 dark:border-teal-900/60">
            <Users size={20} />
          </div>
        </div>

        {/* Card 3: Alertas O.S. */}
        <div className={`card p-4.5 flex items-center justify-between card-glow-amber ${pacientesEnAlerta.length > 0 ? 'border-amber-300 dark:border-amber-700/80 bg-amber-50/20' : ''}`}>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">Alertas O.S.</p>
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-amber-900 dark:text-amber-200 mt-0.5">
              {pacientesEnAlerta.length}
            </h3>
            <p className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold mt-0.5">
              {pacientesEnAlerta.length > 0 ? '≤ 2 sesiones restantes' : 'Todo al día'}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-100 dark:border-amber-900/60">
            <ShieldAlert size={20} />
          </div>
        </div>

        {/* Card 4: Facturación Estimada */}
        <div className="card p-4.5 flex items-center justify-between card-glow-emerald">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Estimado Mes</p>
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-emerald-800 dark:text-emerald-200 mt-0.5">
              ${totalEstimadoMes.toLocaleString('es-AR')}
            </h3>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium mt-0.5">
              Coseguros + O.S.
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/60">
            <DollarSign size={20} />
          </div>
        </div>

      </div>

      {/* Grid Principal: Turnos de Hoy + Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Columna Izquierda: Turnos de Hoy */}
        <div className="lg:col-span-2 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">Turnos de Hoy</h3>
            </div>
            <button 
              onClick={() => onNavigateTab('agenda')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1"
            >
              Ver agenda completa <ArrowUpRight size={13} />
            </button>
          </div>

          {turnosHoy.length === 0 ? (
            <div className="card text-center py-10 text-slate-400 border-dashed">
              <Calendar size={32} className="mx-auto mb-2 opacity-40 text-slate-400" />
              <p className="font-medium text-xs text-slate-600 dark:text-slate-300">No hay turnos agendados para hoy en esta sede.</p>
              <button 
                onClick={onOpenNuevoTurno}
                className="btn btn-secondary text-xs mt-2.5"
              >
                + Agendar un turno
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {turnosHoy.map((turno) => {
                const pac = getPacienteById(turno.pacienteId);
                const sede = getSedeById(turno.sedeId);
                const os = pac ? getObraSocialById(pac.obraSocialId) : null;
                
                const waLink = pac ? generateWhatsappLink(
                  pac.telefono, 
                  createReminderMessage(config.plantillaMensajeRecordatorio, {
                    pacienteNombre: pac.nombreCompleto,
                    dia: 'hoy',
                    hora: turno.horaInicio,
                    sedeNombre: sede?.nombre,
                    modalidad: turno.modalidad,
                    linkOnline: turno.notas?.includes('meet') ? turno.notas : 'https://meet.google.com/psico-ctes'
                  })
                ) : '#';

                return (
                  <div key={turno.id} className="card p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    
                    {/* Horario y Paciente */}
                    <div className="flex items-start gap-3">
                      <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 rounded-xl p-2 text-center min-w-[64px]">
                        <span className="text-xs font-bold text-slate-900 dark:text-white font-mono block">
                          {turno.horaInicio}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                          {turno.horaFin}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 
                            onClick={() => pac && onOpenPacienteDetalle(pac)}
                            className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm hover:text-emerald-600 cursor-pointer"
                          >
                            {pac?.nombreCompleto || 'Paciente'}
                          </h4>
                          {sede && (
                            <span className={`badge ${sede.badgeClass} text-[10px]`}>
                              {sede.nombre.split('-')[0].trim()}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          <span className="font-medium text-slate-700 dark:text-slate-300">{os?.nombre || 'Particular'}</span>
                          <span>•</span>
                          <span>{turno.modalidad}</span>
                          {turno.coseguroMonto > 0 && (
                            <>
                              <span>•</span>
                              <span className={`font-semibold ${turno.coseguroEstado === 'Cobrado' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                                Coseguro: ${turno.coseguroMonto.toLocaleString('es-AR')} ({turno.coseguroEstado})
                              </span>
                            </>
                          )}
                        </div>

                        {turno.notas && (
                          <p className={`text-[11px] text-slate-500 dark:text-slate-400 mt-1 italic ${privacyMode ? 'privacy-blur' : ''}`}>
                            💬 {turno.notas}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                      {pac?.telefono && (
                        <a 
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-whatsapp text-[11px] py-1.5 px-2.5"
                          title="Enviar recordatorio por WhatsApp"
                        >
                          <MessageCircle size={13} />
                          <span>Recordar</span>
                        </a>
                      )}

                      <button
                        onClick={() => onActualizarTurnoEstado(turno.id, turno.estado === 'Atendido' ? 'Confirmado' : 'Atendido')}
                        className={`btn text-[11px] py-1.5 px-2.5 ${
                          turno.estado === 'Atendido' 
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 font-bold'
                            : 'btn-secondary'
                        }`}
                        title="Marcar estado del turno"
                      >
                        <CheckCircle2 size={13} />
                        <span>{turno.estado === 'Atendido' ? 'Atendido' : 'Marcar'}</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Columna Derecha: Alertas de O.S. y Sedes */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert size={16} className="text-amber-600" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">Alertas de Órdenes</h3>
            </div>
            <span className="badge bg-amber-50 text-amber-800 border border-amber-200 text-[10px]">
              {pacientesEnAlerta.length} por renovar
            </span>
          </div>

          {pacientesEnAlerta.length === 0 ? (
            <div className="card text-center py-6 text-slate-400">
              <CheckCircle2 size={24} className="mx-auto mb-1 text-emerald-500" />
              <p className="font-semibold text-xs text-slate-700 dark:text-slate-300">
                Todos los pacientes tienen órdenes médicas al día.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {pacientesEnAlerta.map((pac) => {
                const os = getObraSocialById(pac.obraSocialId);
                const restantes = (pac.sesionesAutorizadas || 10) - (pac.sesionesConsumidas || 0);
                
                const waOrderLink = generateWhatsappLink(
                  pac.telefono,
                  createOrderAlertMessage(config.plantillaMensajeOrden, {
                    pacienteNombre: pac.nombreCompleto,
                    obraSocialNombre: os?.nombre || 'tu Obra Social',
                    sesionesRestantes: restantes,
                  })
                );

                return (
                  <div key={pac.id} className="card p-3.5 border-l-4 border-l-amber-500 space-y-2">
                    
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 
                          onClick={() => onOpenPacienteDetalle(pac)}
                          className="font-bold text-xs text-slate-900 dark:text-white hover:text-emerald-600 cursor-pointer"
                        >
                          {pac.nombreCompleto}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {os?.nombre} • Afiliado: {pac.numeroAfiliado}
                        </p>
                      </div>

                      <span className="badge bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
                        {restantes} {restantes === 1 ? 'restante' : 'restantes'}
                      </span>
                    </div>

                    {/* Barra de progreso */}
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-amber-500 h-1.5 rounded-full transition-all"
                        style={{ width: `${(pac.sesionesConsumidas / pac.sesionesAutorizadas) * 100}%` }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                      <span>{pac.sesionesConsumidas}/{pac.sesionesAutorizadas} sesiones</span>
                      
                      <a 
                        href={waOrderLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        <MessageCircle size={11} />
                        Pedir nueva orden
                      </a>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

          {/* Sedes Breakdown Card */}
          <div className="card p-4 space-y-2.5 bg-slate-50/50 dark:bg-slate-900/50">
            <h4 className="font-bold text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Sedes en Corrientes
            </h4>
            
            <div className="space-y-1.5">
              {sedes.map(s => {
                const turnosSede = turnos.filter(t => t.sedeId === s.id);
                return (
                  <div key={s.id} className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{s.nombre.split('-')[0].trim()}</span>
                    <span className="font-mono font-semibold text-slate-900 dark:text-white">{turnosSede.length} turnos</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
