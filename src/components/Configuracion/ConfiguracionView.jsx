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
  Sparkles,
  Zap,
  Gift,
  Key,
  Check,
  Lock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { exportFullBackup, resetToDemoData } from '../../services/storage';
import { ProBadge } from '../Common/ProBadge';
import { PLANS, PLAN_LIMITS, activatePromoCode, switchPlanDirectly } from '../../services/subscription';
import { useToast } from '../Common/Toast';

export const ConfiguracionView = ({
  config,
  sedes,
  obrasSociales,
  subscription = { plan: PLANS.FREE },
  onSaveConfig,
  onSaveSedes,
  onOpenUpgradeModal,
  onSubscriptionUpdated
}) => {
  const [formData, setFormData] = useState({ ...config });
  const [sedesData, setSedesData] = useState([...sedes]);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  const [promoMsg, setPromoMsg] = useState({ text: '', type: '' });
  const toast = useToast();

  const isPro = subscription.plan === PLANS.PRO;

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

  const handleAddSede = () => {
    if (!isPro && sedesData.length >= 1) {
      if (onOpenUpgradeModal) {
        onOpenUpgradeModal('El Plan Inicial Gratuito permite 1 sede. Desbloqueá PsicoPlus PRO para gestionar consultorios ilimitados y sede virtual.');
      }
      return;
    }

    const nuevaSede = {
      id: `sede-${Date.now()}`,
      nombre: 'Nuevo Consultorio',
      direccion: 'Dirección del consultorio',
      diasAtencion: 'Lunes a Viernes',
      color: '#0d9488',
      badgeClass: 'badge-sede-centro',
      icono: 'Building2'
    };
    setSedesData([...sedesData, nuevaSede]);
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    const res = activatePromoCode(promoInput);
    if (res.success) {
      setPromoMsg({ text: `¡Código activado con éxito! ${res.promo.descripcion}`, type: 'success' });
      toast.showSuccess(`Plan PRO Activado: ${res.promo.descripcion}`);
      if (onSubscriptionUpdated) onSubscriptionUpdated(res.subscription);
      setPromoInput('');
    } else {
      setPromoMsg({ text: res.error, type: 'error' });
    }
  };

  const handleToggleTrial = () => {
    const nextPlan = isPro ? PLANS.FREE : PLANS.PRO;
    const res = switchPlanDirectly(nextPlan);
    toast.showSuccess(`Plan cambiado a: ${nextPlan === PLANS.PRO ? 'PRO Ilimitado' : 'Gratuito'}`);
    if (onSubscriptionUpdated) onSubscriptionUpdated(res);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      
      {/* Header Configuración */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <Settings size={24} className="text-emerald-600 dark:text-emerald-400" />
            Configuración & Suscripción
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Datos profesionales, sedes de trabajo, estado de tu plan y respaldos de seguridad.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 px-3 py-1.5 rounded-xl text-xs font-semibold border border-emerald-200 animate-fade-in">
            <CheckCircle2 size={15} />
            <span>¡Cambios guardados con éxito!</span>
          </div>
        )}
      </div>

      {/* SECCIÓN ESPECIAL: Plan & Suscripción Freemium */}
      <div className="card p-5 sm:p-6 bg-gradient-to-br from-[#0b1612] via-slate-900 to-[#080f0c] text-white border border-emerald-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-900/60 pb-5 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
              <Zap size={22} className="fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-display">Estado de tu Suscripción</h3>
                {isPro ? (
                  <ProBadge text="PRO ILIMITADO" size="sm" />
                ) : (
                  <span className="text-[10px] font-bold bg-slate-800 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    PLAN INICIAL (GRATIS)
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-200/70 mt-0.5">
                {isPro 
                  ? `Tenés todas las funcionalidades PRO desbloqueadas.${subscription.expiraEn ? ` Vence: ${new Date(subscription.expiraEn).toLocaleDateString('es-AR')}` : ''}`
                  : 'Estás en el plan gratuito con hasta 15 pacientes y 1 sede.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isPro ? (
              <button
                type="button"
                onClick={() => onOpenUpgradeModal && onOpenUpgradeModal()}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5"
              >
                <Sparkles size={13} className="text-slate-950" />
                <span>Mejorar a PRO</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleToggleTrial}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl transition-all"
              >
                Cambiar a Plan Gratuito (Demo)
              </button>
            )}
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-5 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/50 border border-emerald-900/40">
            <span className="text-slate-400 block text-[11px]">Pacientes:</span>
            <span className="font-bold text-white text-sm">{isPro ? 'Ilimitados' : 'Hasta 15 pacientes'}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/50 border border-emerald-900/40">
            <span className="text-slate-400 block text-[11px]">Sedes & Consultorios:</span>
            <span className="font-bold text-white text-sm">{isPro ? 'Multisede Ilimitada' : '1 Sede (Física o Virtual)'}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/50 border border-emerald-900/40">
            <span className="text-slate-400 block text-[11px]">Liquidaciones O.S.:</span>
            <span className="font-bold text-white text-sm">{isPro ? 'Masivas por Lotes' : 'Individual'}</span>
          </div>
        </div>

        {/* Promo code redeemer */}
        <form onSubmit={handleApplyPromo} className="pt-3 border-t border-emerald-950 flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <div className="relative flex-1 w-full">
            <Key size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Ingresar código de convenio o activación (Ej: LANZAMIENTO2026)"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-emerald-900/80 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400 font-mono tracking-wider"
            />
          </div>
          <button
            type="submit"
            disabled={!promoInput.trim()}
            className="w-full sm:w-auto px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold text-xs rounded-xl transition-all"
          >
            Activar Cupón
          </button>
        </form>

        {promoMsg.text && (
          <p className={`text-xs mt-2 font-medium ${promoMsg.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
            {promoMsg.type === 'success' ? '✓ ' : '⚠️ '} {promoMsg.text}
          </p>
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
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">CUIT / CUIL</label>
              <input
                type="text"
                value={formData.cuit}
                onChange={(e) => setFormData({ ...formData, cuit: e.target.value })}
                className="input-field font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Condición Frente al IVA</label>
              <select
                value={formData.condicionIva}
                onChange={(e) => setFormData({ ...formData, condicionIva: e.target.value })}
                className="input-field"
              >
                <option value="Responsable Monotributo">Responsable Monotributo</option>
                <option value="Responsable Inscripto">Responsable Inscripto</option>
                <option value="Exento">Exento</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Teléfono / WhatsApp</label>
              <input
                type="text"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                className="input-field font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Alias Bancario</label>
              <input
                type="text"
                value={formData.aliasBancario}
                onChange={(e) => setFormData({ ...formData, aliasBancario: e.target.value })}
                className="input-field font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">CBU (22 dígitos)</label>
              <input
                type="text"
                value={formData.cbu}
                onChange={(e) => setFormData({ ...formData, cbu: e.target.value })}
                className="input-field font-mono"
              />
            </div>
          </div>
        </div>

        {/* Sección 2: Sedes y Consultorios */}
        <div className="card p-4 sm:p-5 space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <Building2 size={16} className="text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Sedes de Atención
              </h3>
            </div>
            
            <button
              type="button"
              onClick={handleAddSede}
              className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
            >
              <span>+ Agregar Sede</span>
              {!isPro && sedesData.length >= 1 && <ProBadge size="xs" text="PRO" />}
            </button>
          </div>

          <div className="space-y-3">
            {sedesData.map((sede, idx) => (
              <div key={sede.id || idx} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Nombre de la Sede</label>
                  <input
                    type="text"
                    value={sede.nombre}
                    onChange={(e) => handleSedeChange(idx, 'nombre', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Dirección / Enlace</label>
                  <input
                    type="text"
                    value={sede.direccion}
                    onChange={(e) => handleSedeChange(idx, 'direccion', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Días y Horarios</label>
                  <input
                    type="text"
                    value={sede.diasAtencion}
                    onChange={(e) => handleSedeChange(idx, 'diasAtencion', e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sección 3: Plantillas WhatsApp */}
        <div className="card p-4 sm:p-5 space-y-3.5">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <MessageSquare size={16} className="text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Plantillas de WhatsApp
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Plantilla Recordatorio de Turno
              </label>
              <textarea
                rows={2}
                value={formData.plantillaMensajeRecordatorio}
                onChange={(e) => setFormData({ ...formData, plantillaMensajeRecordatorio: e.target.value })}
                className="input-field"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Variables: <code>{'{nombre}'}</code>, <code>{'{dia}'}</code>, <code>{'{hora}'}</code>, <code>{'{sede}'}</code>.
              </p>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Plantilla Alerta Orden de Obra Social por Agotar
              </label>
              <textarea
                rows={2}
                value={formData.plantillaMensajeOrden}
                onChange={(e) => setFormData({ ...formData, plantillaMensajeOrden: e.target.value })}
                className="input-field"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Variables: <code>{'{nombre}'}</code>, <code>{'{obra_social}'}</code>, <code>{'{restantes}'}</code>.
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
