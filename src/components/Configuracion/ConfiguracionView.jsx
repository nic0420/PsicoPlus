import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Building2, 
  MessageSquare, 
  Database, 
  Save, 
  Download, 
  RotateCcw, 
  CheckCircle2, 
  Upload,
  Sparkles
} from 'lucide-react';
import { exportFullBackup, resetToDemoData } from '../../services/storage';

export const ConfiguracionView = ({
  config,
  sedes,
  obrasSociales,
  onSaveConfig,
  onSaveSedes,
}) => {
  const [formData, setFormData] = useState({ ...config });
  const [sedesData, setSedesData] = useState([...sedes]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveConfig(formData);
    onSaveSedes(sedesData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSedeChange = (index, field, value) => {
    const updated = [...sedesData];
    updated[index] = { ...updated[index], [field]: value };
    setSedesData(updated);
  };

  return (
    <div className="space-y-5 animate-fade-in max-w-4xl">
      
      {/* Header Configuración */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <Settings size={24} className="text-emerald-600 dark:text-emerald-400" />
            Configuración & Preferencias
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Datos profesionales, sedes de trabajo en Corrientes, plantillas de WhatsApp y respaldos de seguridad.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 px-3 py-1.5 rounded-xl text-xs font-semibold border border-emerald-200 animate-fade-in">
            <CheckCircle2 size={15} />
            <span>¡Cambios guardados con éxito!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 text-xs">
        
        {/* Sección 1: Datos Profesionales & Matrícula */}
        <div className="card p-4 sm:p-5 space-y-3.5">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <User size={16} className="text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Datos Profesionales & Facturación
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Nombre Completo y Título</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Matrícula Provincial</label>
              <input
                type="text"
                value={formData.matriculaProvincial}
                onChange={(e) => setFormData({ ...formData, matriculaProvincial: e.target.value })}
                className="input-field font-mono"
                placeholder="M.P. 1842"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Colegio Profesional</label>
              <input
                type="text"
                value={formData.colegio}
                onChange={(e) => setFormData({ ...formData, colegio: e.target.value })}
                className="input-field"
                placeholder="Colegio de Psicólogos de Corrientes"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">CUIT / CUIL</label>
              <input
                type="text"
                value={formData.cuit}
                onChange={(e) => setFormData({ ...formData, cuit: e.target.value })}
                className="input-field font-mono"
                placeholder="27-38452190-4"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Teléfono Profesional (WhatsApp)</label>
              <input
                type="text"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                className="input-field font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Email de Contacto</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          {/* Datos Bancarios */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2.5 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Alias Bancario (Para transferencias)</label>
              <input
                type="text"
                value={formData.aliasBancario}
                onChange={(e) => setFormData({ ...formData, aliasBancario: e.target.value })}
                className="input-field font-mono font-bold uppercase"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">CBU / CVU</label>
              <input
                type="text"
                value={formData.cbu}
                onChange={(e) => setFormData({ ...formData, cbu: e.target.value })}
                className="input-field font-mono"
              />
            </div>
          </div>
        </div>

        {/* Sección 2: Sedes de Trabajo */}
        <div className="card p-4 sm:p-5 space-y-3.5">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <Building2 size={16} className="text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Sedes de Consultorios en Corrientes
            </h3>
          </div>

          <div className="space-y-3">
            {sedesData.map((sede, idx) => (
              <div key={sede.id} className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`badge ${sede.badgeClass} text-[10px]`}>
                    {sede.nombre.split('-')[0].trim()}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-0.5">Nombre de la Sede</label>
                    <input
                      type="text"
                      value={sede.nombre}
                      onChange={(e) => handleSedeChange(idx, 'nombre', e.target.value)}
                      className="input-field text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-0.5">Dirección / Link</label>
                    <input
                      type="text"
                      value={sede.direccion}
                      onChange={(e) => handleSedeChange(idx, 'direccion', e.target.value)}
                      className="input-field text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 mb-0.5">Días y Horarios Habituales</label>
                  <input
                    type="text"
                    value={sede.diasAtencion}
                    onChange={(e) => handleSedeChange(idx, 'diasAtencion', e.target.value)}
                    className="input-field text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sección 3: Plantillas de WhatsApp */}
        <div className="card p-4 sm:p-5 space-y-3.5">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <MessageSquare size={16} className="text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Plantillas de Mensajes de WhatsApp
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Plantilla: Recordatorio de Turno</label>
              <textarea
                rows={3}
                value={formData.plantillaMensajeRecordatorio}
                onChange={(e) => setFormData({ ...formData, plantillaMensajeRecordatorio: e.target.value })}
                className="input-field text-xs"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Variables dinámicas disponibles: <code>{'{nombre}'}</code>, <code>{'{dia}'}</code>, <code>{'{hora}'}</code>, <code>{'{sede}'}</code>.
              </p>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Plantilla: Solicitud de Nueva Orden de Obra Social</label>
              <textarea
                rows={3}
                value={formData.plantillaMensajeOrden}
                onChange={(e) => setFormData({ ...formData, plantillaMensajeOrden: e.target.value })}
                className="input-field text-xs"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Variables dinámicas: <code>{'{nombre}'}</code>, <code>{'{obra_social}'}</code>, <code>{'{restantes}'}</code>.
              </p>
            </div>
          </div>
        </div>

        {/* Botón Guardar Cambios */}
        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary text-xs py-2 px-5 font-bold shadow-sm">
            <Save size={14} />
            <span>Guardar Configuración</span>
          </button>
        </div>

      </form>

      {/* Sección 4: Respaldo y Base de Datos */}
      <div className="card p-4 sm:p-5 space-y-3 border-l-4 border-l-emerald-600">
        <div className="flex items-center gap-2">
          <Database size={16} className="text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Seguridad de Datos & Respaldos
          </h3>
        </div>

        <p className="text-xs text-slate-500">
          PsicoPlus almacena los datos de forma local y segura en el navegador. Puedes descargar copias de seguridad en formato JSON en cualquier momento o restaurar los datos iniciales de demostración.
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={exportFullBackup}
            className="btn btn-secondary text-xs flex items-center gap-1.5"
          >
            <Download size={13} />
            <span>Descargar Backup (JSON)</span>
          </button>

          <label className="btn btn-secondary text-xs flex items-center gap-1.5 cursor-pointer">
            <Upload size={13} />
            <span>Restaurar Backup (JSON)</span>
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (event) => {
                  try {
                    const parsed = JSON.parse(event.target.result);
                    if (parsed.pacientes && parsed.turnos) {
                      if (parsed.sedes) localStorage.setItem('psicoplus_sedes_v1', JSON.stringify(parsed.sedes));
                      if (parsed.obrasSociales) localStorage.setItem('psicoplus_obras_sociales_v1', JSON.stringify(parsed.obrasSociales));
                      if (parsed.pacientes) localStorage.setItem('psicoplus_pacientes_v1', JSON.stringify(parsed.pacientes));
                      if (parsed.turnos) localStorage.setItem('psicoplus_turnos_v1', JSON.stringify(parsed.turnos));
                      if (parsed.liquidaciones) localStorage.setItem('psicoplus_liquidaciones_v1', JSON.stringify(parsed.liquidaciones));
                      if (parsed.facturas) localStorage.setItem('psicoplus_facturas_v1', JSON.stringify(parsed.facturas));
                      if (parsed.config) localStorage.setItem('psicoplus_config_v1', JSON.stringify(parsed.config));
                      alert('¡Copia de seguridad restaurada con éxito! La página se recargará.');
                      window.location.reload();
                    } else {
                      alert('El archivo seleccionado no tiene el formato de respaldo válido de PsicoPlus.');
                    }
                  } catch (err) {
                    alert('Error al leer el archivo JSON: formato inválido.');
                  }
                };
                reader.readAsText(file);
              }}
            />
          </label>

          <button
            type="button"
            onClick={() => {
              if (confirm('¿Estás segura de reiniciar los datos a la versión de demostración? Se reestablecerán pacientes y turnos iniciales.')) {
                resetToDemoData();
              }
            }}
            className="btn btn-danger text-xs flex items-center gap-1.5"
          >
            <RotateCcw size={13} />
            <span>Restaurar Datos de Demostración</span>
          </button>
        </div>
      </div>

    </div>
  );
};
