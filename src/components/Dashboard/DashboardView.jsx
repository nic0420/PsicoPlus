import React from 'react';
import {
  ArrowUpRight, CalendarDays, CheckCircle2, Clock3, DollarSign, Globe2,
  MessageCircle, Plus, ShieldAlert, Sparkles, Users, WalletCards
} from 'lucide-react';
import { generateWhatsappLink, createReminderMessage, createOrderAlertMessage } from '../../services/whatsapp';

const money = (value) => `$${(value || 0).toLocaleString('es-AR')}`;

export const DashboardView = ({
  sedes, obrasSociales, pacientes, turnos, liquidaciones, config,
  selectedSedeId, privacyMode, onNavigateTab, onOpenNuevoTurno,
  onOpenPacienteDetalle, onActualizarTurnoEstado,
}) => {
  const hoy = new Date().toISOString().split('T')[0];
  const turnosFiltrados = turnos.filter((turno) => selectedSedeId === 'all' || turno.sedeId === selectedSedeId);
  const pacientesFiltrados = pacientes.filter((paciente) => selectedSedeId === 'all' || paciente.sedeHabitualId === selectedSedeId);
  const turnosHoy = turnosFiltrados.filter((turno) => turno.fecha === hoy || turno.fecha === '2026-09-01');
  const alertas = pacientesFiltrados.filter((paciente) => paciente.obraSocialId !== 'particular' && ((paciente.sesionesAutorizadas || 10) - (paciente.sesionesConsumidas || 0)) <= 2);
  const solicitudes = turnos.filter((turno) => turno.estado === 'Solicitado (Web)');
  const ingresos = turnos.filter((turno) => turno.coseguroEstado === 'Cobrado').reduce((sum, turno) => sum + (turno.coseguroMonto || 0), 0) + liquidaciones.reduce((sum, item) => sum + (item.montoBruto || 0), 0);
  const sede = (id) => sedes.find((item) => item.id === id);
  const paciente = (id) => pacientes.find((item) => item.id === id);
  const obraSocial = (id) => obrasSociales.find((item) => item.id === id);
  const initials = (config?.nombre || 'PsicoPlus').replace(/Lic\.\s*/i, '').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();

  const metricas = [
    { label: 'Turnos de hoy', value: turnosHoy.length, detail: `${turnosHoy.filter((t) => t.estado === 'Confirmado').length} confirmados`, icon: CalendarDays, tone: 'emerald' },
    { label: 'Pacientes activos', value: pacientesFiltrados.length, detail: 'En seguimiento clínico', icon: Users, tone: 'blue' },
    { label: 'Alertas pendientes', value: alertas.length, detail: alertas.length ? 'Requieren atención' : 'Todo al día', icon: ShieldAlert, tone: 'amber' },
    { label: 'Ingresos estimados', value: money(ingresos), detail: 'Coseguros + obras sociales', icon: WalletCards, tone: 'violet' },
  ];

  return (
    <div className="dashboard-page animate-fade-in">
      <div className="section-heading">
        <div><p className="eyebrow">Centro de control</p><h2>Buen día, {config?.nombre || 'profesional'}</h2><p>Una vista clara de lo importante para organizar tu consultorio.</p></div>
        <div className="heading-actions"><button className="btn btn-secondary" onClick={() => onNavigateTab('agenda')}><CalendarDays size={15} /> Ver agenda</button><button className="btn btn-primary" onClick={onOpenNuevoTurno}><Plus size={15} /> Nuevo turno</button></div>
      </div>

      {solicitudes.length > 0 && <button className="dashboard-alert" onClick={() => onNavigateTab('agenda')}><span className="alert-icon"><Globe2 size={17} /></span><span><strong>{solicitudes.length} solicitud{solicitudes.length === 1 ? '' : 'es'} web pendiente{solicitudes.length === 1 ? '' : 's'}</strong><small>Revisá y confirmá las reservas recibidas desde el portal.</small></span><ArrowUpRight size={17} /></button>}

      <section className="dashboard-welcome">
        <div><span className="welcome-kicker"><Sparkles size={13} /> Resumen de tu práctica</span><h1>Tu consultorio,<br /><em>en un solo lugar.</em></h1><p>Hoy tenés <strong>{turnosHoy.length} turnos</strong> agendados{alertas.length ? ` y ${alertas.length} alertas para revisar` : '.'}</p></div>
        <div className="welcome-profile"><div className="profile-avatar">{initials}</div><div><strong>{config?.nombre || 'Profesional'}</strong><span>{config?.matriculaProvincial || 'Gestión clínica'}</span></div></div>
      </section>

      <section className="metric-grid" aria-label="Resumen de métricas">{metricas.map(({ label, value, detail, icon: Icon, tone }) => <article className={`metric-card metric-${tone}`} key={label}><div><span>{label}</span><strong className={privacyMode ? 'privacy-blur' : ''}>{value}</strong><small>{detail}</small></div><div className="metric-icon"><Icon size={19} /></div></article>)}</section>

      <section className="quick-actions"><div><h3>Acciones frecuentes</h3><p>Accedé rápido a las tareas de hoy.</p></div><div className="quick-action-grid"><button onClick={onOpenNuevoTurno}><span className="quick-icon emerald"><Plus size={17} /></span><span><strong>Agendar turno</strong><small>Nuevo paciente o seguimiento</small></span><ArrowUpRight size={15} /></button><button onClick={() => onNavigateTab('pacientes')}><span className="quick-icon blue"><Users size={17} /></span><span><strong>Ver pacientes</strong><small>Buscar fichas y evolución</small></span><ArrowUpRight size={15} /></button><button onClick={() => onNavigateTab('facturas')}><span className="quick-icon violet"><DollarSign size={17} /></span><span><strong>Emitir factura</strong><small>Registrar una prestación</small></span><ArrowUpRight size={15} /></button><button onClick={() => onNavigateTab('portal-pacientes')}><span className="quick-icon amber"><Globe2 size={17} /></span><span><strong>Portal web</strong><small>Gestionar solicitudes online</small></span><ArrowUpRight size={15} /></button></div></section>

      <div className="dashboard-columns"><section className="panel-card"><div className="panel-header"><div><span className="panel-label"><Clock3 size={14} /> Operación</span><h3>Agenda de hoy</h3></div><button className="link-button" onClick={() => onNavigateTab('agenda')}>Ver agenda completa <ArrowUpRight size={14} /></button></div>{turnosHoy.length === 0 ? <div className="empty-state"><CalendarDays size={25} /><strong>No hay turnos para hoy</strong><span>Podés comenzar a organizar tu agenda.</span><button className="btn btn-secondary" onClick={onOpenNuevoTurno}>Agendar un turno</button></div> : <div className="appointment-list">{turnosHoy.slice(0, 5).map((turno) => { const pac = paciente(turno.pacienteId); const wa = pac ? generateWhatsappLink(pac.telefono, createReminderMessage(config?.plantillaMensajeRecordatorio, { pacienteNombre: pac.nombreCompleto, dia: 'hoy', hora: turno.horaInicio, sedeNombre: sede(turno.sedeId)?.nombre, modalidad: turno.modalidad })) : '#'; return <div className="appointment-row" key={turno.id}><div className="appointment-time"><strong>{turno.horaInicio}</strong><span>{turno.horaFin}</span></div><div className="appointment-info"><strong onClick={() => pac && onOpenPacienteDetalle(pac)}>{pac?.nombreCompleto || 'Paciente'}</strong><span>{turno.modalidad} · {sede(turno.sedeId)?.nombre || 'Sede'}</span></div><span className={`status-pill ${turno.estado === 'Atendido' ? 'success' : turno.estado === 'Confirmado' ? 'info' : 'warning'}`}>{turno.estado}</span><div className="appointment-actions">{pac?.telefono && <a href={wa} target="_blank" rel="noreferrer" aria-label="Enviar recordatorio"><MessageCircle size={15} /></a>}<button onClick={() => onActualizarTurnoEstado(turno.id, turno.estado === 'Atendido' ? 'Confirmado' : 'Atendido')} aria-label="Actualizar estado"><CheckCircle2 size={16} /></button></div></div> })}</div>}</section>

        <section className="panel-card"><div className="panel-header"><div><span className="panel-label warning-label"><ShieldAlert size={14} /> Atención</span><h3>Alertas clínicas</h3></div><span className="count-badge">{alertas.length}</span></div>{alertas.length === 0 ? <div className="empty-state compact"><CheckCircle2 size={25} /><strong>Sin alertas pendientes</strong><span>Las órdenes de tus pacientes están al día.</span></div> : <div className="alert-list">{alertas.slice(0, 4).map((pac) => { const remaining = (pac.sesionesAutorizadas || 10) - (pac.sesionesConsumidas || 0); const os = obraSocial(pac.obraSocialId); const wa = generateWhatsappLink(pac.telefono, createOrderAlertMessage(config?.plantillaMensajeOrden, { pacienteNombre: pac.nombreCompleto, obraSocialNombre: os?.nombre || 'tu obra social', sesionesRestantes: remaining })); return <button className="clinical-alert" key={pac.id} onClick={() => onOpenPacienteDetalle(pac)}><span className="alert-avatar">{pac.nombreCompleto?.split(' ').map((n) => n[0]).join('').slice(0, 2)}</span><span className="clinical-copy"><strong>{pac.nombreCompleto}</strong><small>{os?.nombre || 'Obra social'} · {remaining} sesiones restantes</small><span className="progress-track"><i style={{ width: `${Math.min(100, ((pac.sesionesConsumidas || 0) / (pac.sesionesAutorizadas || 10)) * 100)}%` }} /></span></span><a href={wa} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()} aria-label="Contactar paciente"><MessageCircle size={15} /></a></button> })}</div>}</section>
      </div>
    </div>
  );
};

export default DashboardView;
