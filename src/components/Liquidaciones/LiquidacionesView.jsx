import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Download, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Building, 
  AlertCircle, 
  Calendar, 
  XCircle,
  FileSpreadsheet,
  Award,
  Trash2
} from 'lucide-react';
import { generatePlanillaLiquidacionPDF } from '../../services/pdfGenerator';

import { ProBadge } from '../Common/ProBadge';

export const LiquidacionesView = ({
  obrasSociales,
  pacientes,
  liquidaciones,
  config,
  onSaveLiquidacion,
  onUpdateLiquidacionEstado,
  onDeleteLiquidacion,
  subscription = { plan: 'free' },
  onOpenUpgradeModal
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOSId, setSelectedOSId] = useState('ioscor');
  const [periodo, setPeriodo] = useState('Septiembre 2026');
  const [observaciones, setObservaciones] = useState('');

  // Estadísticas rápidas de liquidaciones
  const totalPresentado = liquidaciones
    .filter(l => l.estado === 'Presentada' || l.estado === 'Liquidada')
    .reduce((acc, curr) => acc + (curr.montoBruto || 0), 0);

  const totalCobrado = liquidaciones
    .filter(l => l.estado === 'Cobrada')
    .reduce((acc, curr) => acc + (curr.montoBruto || 0), 0);

  const getObraSocialById = (id) => obrasSociales.find(os => os.id === id);

  const handleCrearPlanilla = (e) => {
    e.preventDefault();
    const os = getObraSocialById(selectedOSId);
    if (!os) return;

    // Obtener pacientes con esta obra social
    const pacsOS = pacientes.filter(p => p.obraSocialId === selectedOSId);
    const cantSesiones = pacsOS.reduce((acc, curr) => acc + (curr.sesionesConsumidas || 1), 0);
    const montoTotal = cantSesiones * os.arancelSesion;

    const nuevaLiq = {
      id: `liq-${Date.now()}`,
      obraSocialId: selectedOSId,
      periodo: periodo,
      fechaPresentacion: new Date().toISOString().split('T')[0],
      cantidadSesiones: cantSesiones,
      montoBruto: montoTotal,
      estado: 'Presentada',
      observaciones: observaciones || `Presentación de ${periodo} para ${os.nombre}.`,
    };

    onSaveLiquidacion(nuevaLiq);
    setIsModalOpen(false);
  };

  const handleDescargarPDF = (liq) => {
    const os = getObraSocialById(liq.obraSocialId);
    if (!os) return;
    const pacsOS = pacientes.filter(p => p.obraSocialId === liq.obraSocialId);
    generatePlanillaLiquidacionPDF({
      obraSocial: os,
      periodo: liq.periodo,
      pacientes: pacsOS,
      config,
      liquidacion: liq
    });
  };

  return (
    <div className="space-y-5 animate-fade-in">
      
      {/* Header Liquidaciones */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
                        <span className="text-[13px] font-medium text-emerald-700 dark:text-emerald-300">Convenios & Liquidación</span>
          </div>
          <h2 className="font-serif text-[2.1rem] sm:text-[2.6rem] leading-[1.04] text-slate-900 dark:text-slate-50 flex items-center gap-2.5">
            <div className="hidden" aria-hidden="true">
              <FileSpreadsheet size={18} />
            </div>
            <span>Obras Sociales & Liquidaciones</span>
          </h2>
          <p className="text-[14px] text-slate-500 dark:text-slate-400 mt-2 max-w-2xl">
            Generación de planillas mensuales para presentar al Colegio de Psicólogos de Corrientes o mutuales.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button 
            onClick={() => {
              const isPro = subscription?.plan === 'pro';
              if (!isPro) {
                if (onOpenUpgradeModal) {
                  onOpenUpgradeModal('La liquidación y exportación masiva por lotes de todas las obras sociales es una función exclusiva de PsicoPlus PRO.');
                }
                return;
              }
              // Generate bulk
              obrasSociales.filter(os => os.id !== 'particular').forEach(os => {
                const pacs = pacientes.filter(p => p.obraSocialId === os.id);
                if (pacs.length > 0) {
                  const cantSes = pacs.reduce((a, c) => a + (c.sesionesConsumidas || 1), 0);
                  onSaveLiquidacion({
                    id: `liq-${Date.now()}-${os.id}`,
                    obraSocialId: os.id,
                    periodo: periodo,
                    fechaPresentacion: new Date().toISOString().split('T')[0],
                    cantidadSesiones: cantSes,
                    montoBruto: cantSes * os.arancelSesion,
                    estado: 'Presentada',
                    observaciones: `Lote automático generado para ${os.nombre}.`,
                  });
                }
              });
            }}
            className="btn btn-secondary text-xs flex items-center gap-1.5 shadow-xs"
            title="Generar liquidación de todas las obras sociales en 1 clic"
          >
            <span>Liquidación Masiva</span>
            {subscription?.plan !== 'pro' && <ProBadge size="xs" text="PRO" />}
          </button>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary text-xs shadow-sm"
          >
            <Plus size={15} />
            <span>Generar Planilla</span>
          </button>
        </div>
      </div>

      {/* 3 Cards de Estado Financiero de Obras Sociales */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between group">
          <div>
            <p className="text-[12px] font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">En Trámite</p>
            <h3 className="text-2xl sm:text-3xl font-semibold font-display text-slate-900 dark:text-white mt-1.5 tabular-nums tracking-tight">
              ${totalPresentado.toLocaleString('es-AR')}
            </h3>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1 font-medium">Pendiente de acreditación</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20 group-hover:scale-105 transition-transform">
            <Clock size={18} />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center justify-between group">
          <div>
            <p className="text-[12px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Cobrado</p>
            <h3 className="text-2xl sm:text-3xl font-semibold font-display text-slate-900 dark:text-white mt-1.5 tabular-nums tracking-tight">
              ${totalCobrado.toLocaleString('es-AR')}
            </h3>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1 font-medium">Acreditado en Banco</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20 group-hover:scale-105 transition-transform">
            <CheckCircle2 size={18} />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center justify-between group">
          <div>
            <p className="text-[12px] font-semibold text-teal-700 dark:text-teal-400 uppercase tracking-wider">Convenios Activos</p>
            <h3 className="text-2xl sm:text-3xl font-semibold font-display text-slate-900 dark:text-white mt-1.5 tabular-nums tracking-tight">
              {obrasSociales.filter(o => o.id !== 'particular').length} O.S.
            </h3>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1 font-medium">IOSCOR, OSDE, Swiss, Medifé...</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-500/20 group-hover:scale-105 transition-transform">
            <Award size={18} />
          </div>
        </div>

      </div>

      {/* Tabla de Presentaciones / Liquidaciones */}
      <div className="glass-card p-0 rounded-2xl overflow-hidden shadow-sm border border-emerald-500/15">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Historial de Planillas Presentadas
          </h3>
        </div>

        {liquidaciones.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <FileText size={32} className="mx-auto mb-1.5 opacity-40 text-slate-400" />
            <p className="text-xs font-medium">No hay planillas de liquidación registradas aún.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Obra Social</th>
                  <th className="py-3 px-4">Período</th>
                  <th className="py-3 px-4">Presentación</th>
                  <th className="py-3 px-4 text-center">Sesiones</th>
                  <th className="py-3 px-4 text-right">Monto Bruto</th>
                  <th className="py-3 px-4 text-center">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {liquidaciones.map((liq) => {
                  const os = getObraSocialById(liq.obraSocialId);
                  return (
                    <tr key={liq.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                        {os?.nombre || 'Obra Social'}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">
                        {liq.periodo}
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono">
                        {liq.fechaPresentacion}
                      </td>
                      <td className="py-3 px-4 text-center font-semibold text-emerald-600 dark:text-emerald-400">
                        {liq.cantidadSesiones}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900 dark:text-white">
                        ${liq.montoBruto.toLocaleString('es-AR')}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <select
                          value={liq.estado}
                          onChange={(e) => onUpdateLiquidacionEstado(liq.id, e.target.value)}
                          className={`input-field py-1 px-2 text-[12px] font-semibold w-auto text-center ${
                            liq.estado === 'Cobrada' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            liq.estado === 'Liquidada' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          <option value="Borrador">Borrador</option>
                          <option value="Presentada">Presentada</option>
                          <option value="Liquidada">Liquidada</option>
                          <option value="Cobrada">Cobrada</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleDescargarPDF(liq)}
                            className="btn btn-secondary text-[12px] py-1 px-2.5 gap-1"
                            title="Descargar Planilla en PDF oficial"
                          >
                            <Download size={12} />
                            <span>PDF</span>
                          </button>
                          {onDeleteLiquidacion && (
                            <button
                              onClick={() => {
                                if (confirm(`¿Estás seguro/a de eliminar la liquidación de ${liq.periodo}?`)) {
                                  onDeleteLiquidacion(liq.id);
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                              title="Eliminar liquidación"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Catálogo de Convenios y Aranceles */}
      <div className="card p-4 sm:p-5 space-y-3">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          Convenios & Aranceles Vigentes (Colegio de Psicólogos / Directos)
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {obrasSociales.map((os) => (
            <div key={os.id} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <strong className="text-xs text-slate-900 dark:text-white font-semibold">{os.nombre}</strong>
                <span className="badge bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px]">
                  {os.tipo}
                </span>
              </div>
              <p className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                Arancel Sesión: ${os.arancelSesion.toLocaleString('es-AR')}
              </p>
              {os.coseguroRecomendado > 0 && (
                <p className="text-slate-600 dark:text-slate-400 text-[12px]">
                  Coseguro sugerido: ${os.coseguroRecomendado.toLocaleString('es-AR')}
                </p>
              )}
              <p className="text-[12px] text-slate-500 italic">
                {os.notasConvenio}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: GENERAR NUEVA PLANILLA */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="card max-w-md w-full p-5 sm:p-6 shadow-[var(--shadow-hover)] space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
              <h3 className="text-sm font-semibold font-display text-slate-900 dark:text-white">
                Generar Planilla de Liquidación
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle size={17} />
              </button>
            </div>

            <form onSubmit={handleCrearPlanilla} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Obra Social a Liquidar *</label>
                <select
                  value={selectedOSId}
                  onChange={(e) => setSelectedOSId(e.target.value)}
                  className="input-field text-xs"
                >
                  {obrasSociales.filter(o => o.id !== 'particular').map(os => (
                    <option key={os.id} value={os.id}>{os.nombre} (${os.arancelSesion.toLocaleString('es-AR')} / ses)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Período de Facturación *</label>
                <input
                  type="text"
                  value={periodo}
                  onChange={(e) => setPeriodo(e.target.value)}
                  placeholder="Ej: Septiembre 2026"
                  className="input-field text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Observaciones / N° de Planilla</label>
                <textarea
                  rows={2}
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Ej: Presentación ante el Colegio de Psicólogos de Corrientes..."
                  className="input-field text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2.5 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-xs"
                >
                  Generar y Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
