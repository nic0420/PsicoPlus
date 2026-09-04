import React, { useState } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  DollarSign, 
  CreditCard, 
  Building2, 
  MapPin, 
  Video, 
  CheckCircle2, 
  Clock, 
  Calendar,
  Filter,
  BarChart3,
  PieChart
} from 'lucide-react';

export const FinanzasView = ({
  sedes,
  obrasSociales,
  pacientes,
  turnos,
  liquidaciones,
  selectedSedeId
}) => {
  const [filterMedio, setFilterMedio] = useState('all');

  // Cálculos de coseguros cobrados vs pendientes
  const cobradosTurnos = turnos.filter(t => t.coseguroEstado === 'Cobrado');
  const pendientesTurnos = turnos.filter(t => t.coseguroEstado === 'Pendiente' && t.coseguroMonto > 0);

  const totalCosegurosCobrados = cobradosTurnos.reduce((acc, curr) => acc + (curr.coseguroMonto || 0), 0);
  const totalCosegurosPendientes = pendientesTurnos.reduce((acc, curr) => acc + (curr.coseguroMonto || 0), 0);

  // Cálculos de liquidaciones de O.S.
  const totalOSCobrado = liquidaciones
    .filter(l => l.estado === 'Cobrada')
    .reduce((acc, curr) => acc + (curr.montoBruto || 0), 0);

  const totalOSLiquidando = liquidaciones
    .filter(l => l.estado === 'Presentada' || l.estado === 'Liquidada')
    .reduce((acc, curr) => acc + (curr.montoBruto || 0), 0);

  // Ingresos por Sede
  const getIngresosPorSede = (sedeId) => {
    return turnos
      .filter(t => t.sedeId === sedeId && t.coseguroEstado === 'Cobrado')
      .reduce((acc, curr) => acc + (curr.coseguroMonto || 0), 0);
  };

  // Ingresos por Medio de Pago
  const efectivoTotal = turnos
    .filter(t => t.coseguroEstado === 'Cobrado' && t.medioPago === 'Efectivo')
    .reduce((acc, t) => acc + (t.coseguroMonto || 0), 0);

  const transferenciaTotal = turnos
    .filter(t => t.coseguroEstado === 'Cobrado' && t.medioPago === 'Transferencia')
    .reduce((acc, t) => acc + (t.coseguroMonto || 0), 0);

  const mercadoPagoTotal = turnos
    .filter(t => t.coseguroEstado === 'Cobrado' && t.medioPago === 'Mercado Pago')
    .reduce((acc, t) => acc + (t.coseguroMonto || 0), 0);

  const getPacienteById = (id) => pacientes.find(p => p.id === id);
  const getSedeById = (id) => sedes.find(s => s.id === id);

  const filteredTransacciones = turnos.filter(t => {
    const matchesMedio = filterMedio === 'all' || t.medioPago === filterMedio;
    const matchesSede = selectedSedeId === 'all' || t.sedeId === selectedSedeId;
    return matchesMedio && matchesSede && t.coseguroMonto > 0;
  });

  return (
    <div className="space-y-5 animate-fade-in">
      
      {/* Header Finanzas */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <Wallet size={24} className="text-emerald-600 dark:text-emerald-400" />
            Finanzas, Caja & Honorarios
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Balance general de cobros en consultorio/transferencias y liquidaciones de obras sociales.
          </p>
        </div>
      </div>

      {/* 4 Cards de Balance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        <div className="card p-4.5 flex items-center justify-between card-glow-emerald">
          <div>
            <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Caja Cobrada</p>
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-emerald-700 dark:text-emerald-400 mt-1">
              ${totalCosegurosCobrados.toLocaleString('es-AR')}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Efectivo / Transferencias</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center border border-emerald-100 dark:border-emerald-900">
            <DollarSign size={18} />
          </div>
        </div>

        <div className="card p-4.5 flex items-center justify-between card-glow-amber">
          <div>
            <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Pendientes</p>
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-amber-700 dark:text-amber-400 mt-1">
              ${totalCosegurosPendientes.toLocaleString('es-AR')}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">A cobrar en sesión</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center border border-amber-100 dark:border-amber-900">
            <Clock size={18} />
          </div>
        </div>

        <div className="card p-4.5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">O.S. Cobradas</p>
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-emerald-700 dark:text-emerald-400 mt-1">
              ${totalOSCobrado.toLocaleString('es-AR')}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Cobrado en banco</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center border border-emerald-100 dark:border-emerald-900">
            <CheckCircle2 size={18} />
          </div>
        </div>

        <div className="card p-4.5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">O.S. en Trámite</p>
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white mt-1">
              ${totalOSLiquidando.toLocaleString('es-AR')}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Planillas presentadas</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 flex items-center justify-center border border-sky-100 dark:border-sky-900">
            <TrendingUp size={18} />
          </div>
        </div>

      </div>

      {/* Grid: Rendimiento por Sede + Distribución por Medio de Pago */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Sede Cards (2 Cols) */}
        <div className="lg:col-span-2 card p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Building2 size={16} className="text-emerald-600 dark:text-emerald-400" />
              <span>Rendimiento por Sede (Corrientes)</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {sedes.map((sede) => {
              const monto = getIngresosPorSede(sede.id);
              const totalBase = totalCosegurosCobrados > 0 ? totalCosegurosCobrados : 1;
              const porcentaje = Math.round((monto / totalBase) * 100);

              return (
                <div key={sede.id} className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`badge ${sede.badgeClass} text-[10px]`}>
                      {sede.nombre.split('-')[0].trim()}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">{porcentaje}%</span>
                  </div>
                  
                  <h4 className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                    ${monto.toLocaleString('es-AR')}
                  </h4>

                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1 overflow-hidden">
                    <div className="bg-emerald-600 h-1 rounded-full" style={{ width: `${porcentaje}%` }} />
                  </div>

                  <p className="text-[10px] text-slate-500 truncate">
                    {sede.direccion}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Medios de Pago Breakdown (1 Col) */}
        <div className="card p-4 sm:p-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <CreditCard size={16} className="text-emerald-600 dark:text-emerald-400" />
            <span>Medios de Pago</span>
          </h3>

          <div className="space-y-2.5 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-600 dark:text-slate-300">Efectivo</span>
                <span className="font-bold font-mono text-slate-900 dark:text-white">${efectivoTotal.toLocaleString('es-AR')}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-1.5 rounded-full" 
                  style={{ width: `${totalCosegurosCobrados > 0 ? (efectivoTotal / totalCosegurosCobrados) * 100 : 0}%` }} 
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-600 dark:text-slate-300">Transferencia</span>
                <span className="font-bold font-mono text-slate-900 dark:text-white">${transferenciaTotal.toLocaleString('es-AR')}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-1.5 rounded-full" 
                  style={{ width: `${totalCosegurosCobrados > 0 ? (transferenciaTotal / totalCosegurosCobrados) * 100 : 0}%` }} 
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-600 dark:text-slate-300">Mercado Pago</span>
                <span className="font-bold font-mono text-slate-900 dark:text-white">${mercadoPagoTotal.toLocaleString('es-AR')}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-sky-500 h-1.5 rounded-full" 
                  style={{ width: `${totalCosegurosCobrados > 0 ? (mercadoPagoTotal / totalCosegurosCobrados) * 100 : 0}%` }} 
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Tabla de Movimientos / Cobros de Turnos */}
      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Registro de Cobros de Sesiones
          </h3>

          <div className="flex items-center gap-2">
            <Filter size={13} className="text-slate-400" />
            <select
              value={filterMedio}
              onChange={(e) => setFilterMedio(e.target.value)}
              className="input-field py-1 px-2.5 text-xs w-auto"
            >
              <option value="all">Todos los Medios de Pago</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Transferencia">Transferencia Bancaria</option>
              <option value="Mercado Pago">Mercado Pago</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-4">Fecha / Hora</th>
                <th className="py-2.5 px-4">Paciente</th>
                <th className="py-2.5 px-4">Sede</th>
                <th className="py-2.5 px-4">Medio de Pago</th>
                <th className="py-2.5 px-4 text-right">Monto</th>
                <th className="py-2.5 px-4 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTransacciones.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400 text-xs">
                    No hay transacciones registradas para este filtro.
                  </td>
                </tr>
              ) : (
                filteredTransacciones.map((t) => {
                  const pac = getPacienteById(t.pacienteId);
                  const sede = getSedeById(t.sedeId);

                  return (
                    <tr key={t.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300">
                        {t.fecha} ({t.horaInicio} hs)
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                        {pac?.nombreCompleto || 'Paciente'}
                      </td>
                      <td className="py-3 px-4">
                        {sede && (
                          <span className={`badge ${sede.badgeClass} text-[10px]`}>
                            {sede.nombre.split('-')[0].trim()}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        {t.medioPago}
                      </td>
                      <td className="py-3 px-4 text-right font-bold font-mono text-emerald-600 dark:text-emerald-400">
                        ${t.coseguroMonto?.toLocaleString('es-AR')}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`badge text-[10px] ${
                          t.coseguroEstado === 'Cobrado' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {t.coseguroEstado}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
