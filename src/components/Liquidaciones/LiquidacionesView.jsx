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

export const LiquidacionesView = ({
  obrasSociales,
  pacientes,
  liquidaciones,
  config,
  onSaveLiquidacion,
  onUpdateLiquidacionEstado,
  onDeleteLiquidacion,
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <FileSpreadsheet size={24} className="text-emerald-600 dark:text-emerald-400" />
            Obras Sociales & Planillas de Liquidación
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Generación de planillas mensuales para presentar al Colegio de Psicólogos de Corrientes o mutuales.
          </p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary text-xs self-start md:self-auto"
        >
          <Plus size={15} />
          <span>Generar Planilla</span>
        </button>
      </div>

      {/* 3 Cards de Estado Financiero de Obras Sociales */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        
        <div className="card p-4.5 flex items-center justify-between card-glow-amber">
          <div>
            <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">En Trámite</p>
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white mt-1">
              ${totalPresentado.toLocaleString('es-AR')}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Pendiente de acreditación</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center border border-amber-100 dark:border-amber-900">
            <Clock size={18} />
          </div>
        </div>

        <div className="card p-4.5 flex items-center justify-between card-glow-emerald">
          <div>
            <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Cobrado</p>
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white mt-1">
              ${totalCobrado.toLocaleString('es-AR')}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Acreditado en Banco</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center border border-emerald-100 dark:border-emerald-900">
            <CheckCircle2 size={18} />
          </div>
        </div>

        <div className="card p-4.5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Convenios Activos</p>
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white mt-1">
              {obrasSociales.filter(o => o.id !== 'particular').length} O.S.
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">IOSCOR, OSDE, Swiss, Medifé...</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center border border-emerald-100 dark:border-emerald-900">
            <Award size={18} />
          </div>
        </div>

      </div>

      {/* Tabla de Presentaciones / Liquidaciones */}
      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
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
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
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
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {os?.nombre || 'Obra Social'}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">
                        {liq.periodo}
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono">
                        {liq.fechaPresentacion}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-600 dark:text-emerald-400">
                        {liq.cantidadSesiones}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                        ${liq.montoBruto.toLocaleString('es-AR')}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <select
                          value={liq.estado}
                          onChange={(e) => onUpdateLiquidacionEstado(liq.id, e.target.value)}
                          className={`input-field py-1 px-2 text-[11px] font-semibold w-auto text-center ${
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
                            className="btn btn-secondary text-[11px] py-1 px-2.5 gap-1"
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
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Convenios & Aranceles Vigentes (Colegio de Psicólogos / Directos)
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {obrasSociales.map((os) => (
            <div key={os.id} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <strong className="text-xs text-slate-900 dark:text-white font-bold">{os.nombre}</strong>
                <span className="badge bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px]">
                  {os.tipo}
                </span>
              </div>
              <p className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                Arancel Sesión: ${os.arancelSesion.toLocaleString('es-AR')}
              </p>
              {os.coseguroRecomendado > 0 && (
                <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                  Coseguro sugerido: ${os.coseguroRecomendado.toLocaleString('es-AR')}
                </p>
              )}
              <p className="text-[11px] text-slate-500 italic">
                {os.notasConvenio}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: GENERAR NUEVA PLANILLA */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="card max-w-md w-full p-5 sm:p-6 shadow-xl space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
              <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white">
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
