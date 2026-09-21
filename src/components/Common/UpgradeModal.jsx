import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  X, 
  Zap, 
  ShieldCheck, 
  Building2, 
  Users, 
  FileText, 
  Globe, 
  PieChart, 
  Key, 
  MessageSquare,
  Gift,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { ProBadge } from './ProBadge';
import { activatePromoCode, switchPlanDirectly, PLANS } from '../../services/subscription';
import { useToast } from './Toast';

export const UpgradeModal = ({ 
  isOpen, 
  onClose, 
  featureReason = '', 
  onPlanUpdated 
}) => {
  const [billingCycle, setBillingCycle] = useState('annual'); // 'monthly' | 'annual'
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [showPromoInput, setShowPromoInput] = useState(false);
  const toast = useToast();

  if (!isOpen) return null;

  const proFeatures = [
    { icon: Users, title: 'Pacientes Ilimitados', desc: 'Gestioná todos los pacientes que tu consultorio necesite sin topes.' },
    { icon: Building2, title: 'Multisedes Ilimitadas', desc: 'Consultorios físicos en distintas direcciones + atención virtual.' },
    { icon: FileText, title: 'Liquidaciones de Obras Sociales Masivas', desc: 'Generación por lotes con cálculo automático de coseguros y plazos.' },
    { icon: Globe, title: 'Portal Web Personalizado', desc: 'Enlace público con tu marca para que los pacientes reserven online.' },
    { icon: PieChart, title: 'Reportes Financieros & Proyecciones', desc: 'Gráficos de rentabilidad, proyección de cobro a 30/60 días y exportación Excel.' },
    { icon: ShieldCheck, title: 'Informes Clínicos & Aptos en PDF', desc: 'Modelos profesionales listos para juzgados, escuelas o derivaciones.' },
  ];

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    setIsApplyingPromo(true);
    setPromoError('');

    setTimeout(() => {
      const res = activatePromoCode(promoCode);
      setIsApplyingPromo(false);
      if (res.success) {
        toast.showSuccess(`¡Felicidades! Se ha activado: ${res.promo.descripcion}`);
        if (onPlanUpdated) onPlanUpdated(res.subscription);
        onClose();
      } else {
        setPromoError(res.error || 'Código no válido');
      }
    }, 400);
  };

  const handleSimulateSubscription = () => {
    // Open WhatsApp to coordinate payment or direct subscription
    const message = encodeURIComponent(
      `¡Hola equipo de PsicoPlus! Quiero suscribirme al Plan PRO (${billingCycle === 'annual' ? 'Plan Anual con 20% OFF' : 'Plan Mensual'}) para mi consultorio de psicología.`
    );
    const whatsappUrl = `https://wa.me/5493794889922?text=${message}`;
    window.open(whatsappUrl, '_blank');
    
    // Also provide instant trial option
    toast.showInfo('Te redirigimos para coordinar tu suscripción. Si tenés un código de prueba o convenio, podés ingresarlo abajo.');
  };

  const handleInstantTrial = () => {
    const res = switchPlanDirectly(PLANS.PRO);
    toast.showSuccess('¡Modo PRO Activado con éxito!');
    if (onPlanUpdated) onPlanUpdated(res);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-fade-in">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity" 
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#0b1612] via-slate-900 to-[#080d14] text-white rounded-3xl border border-emerald-500/40 shadow-2xl overflow-hidden z-10 my-auto">
        
        {/* Glow ambient background elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors z-20"
        >
          <X size={18} />
        </button>

        <div className="p-6 sm:p-8">
          
          {/* Header */}
          <div className="text-center max-w-lg mx-auto mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold mb-3 shadow-sm">
              <Sparkles size={13} className="text-amber-400" />
              <span>PsicoPlus PRO • Diseñado para Psicólogos</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display mb-2">
              Llevá tu consultorio al <span className="bg-gradient-to-r from-emerald-400 to-amber-300 bg-clip-text text-transparent">siguiente nivel</span>
            </h2>

            {featureReason ? (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-200 mb-2">
                🔒 <strong>Razón de desbloqueo:</strong> {featureReason}
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-emerald-100/70">
                Ahorrá horas en tareas administrativas, cobrá en fecha tus liquidaciones y brindá una experiencia impecable a tus pacientes.
              </p>
            )}
          </div>

          {/* Pricing Switcher */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="bg-slate-950/80 p-1 rounded-2xl border border-emerald-900/60 inline-flex items-center">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Facturación Mensual
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  billingCycle === 'annual'
                    ? 'bg-gradient-to-r from-emerald-600 to-amber-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Facturación Anual</span>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full uppercase">
                  20% OFF
                </span>
              </button>
            </div>
          </div>

          {/* Price Box */}
          <div className="bg-gradient-to-br from-emerald-950/50 via-slate-900/60 to-slate-950/80 p-5 rounded-2xl border border-emerald-500/30 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider mb-1">
                Plan Profesional Completo
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-extrabold text-white">
                  {billingCycle === 'annual' ? '$11.900' : '$14.900'}
                </span>
                <span className="text-xs text-slate-400 font-medium">/ mes</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {billingCycle === 'annual' 
                  ? 'Cobrado anualmente ($143.000 ARS/año) • Ahorrás $35.800' 
                  : 'Sin contratos ni permanencia • Cancelás cuando quieras'}
              </p>
            </div>

            <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleSimulateSubscription}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-500/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Zap size={16} className="fill-slate-950" />
                <span>Suscribirme a PRO</span>
              </button>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {proFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/40 border border-emerald-900/40 flex items-start gap-2.5"
                >
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={13} className="text-emerald-400 font-bold" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">{feat.title}</h4>
                    <p className="text-[11px] text-emerald-200/60 mt-0.5 leading-snug">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Promo Code Toggle / Form */}
          <div className="border-t border-emerald-900/50 pt-4">
            {!showPromoInput ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setShowPromoInput(true)}
                  className="text-xs text-amber-300/90 hover:text-amber-200 font-semibold flex items-center gap-1.5 underline decoration-amber-400/40 underline-offset-4"
                >
                  <Gift size={13} />
                  <span>¿Tenés un código de descuento, convenio o prueba?</span>
                </button>

                <button
                  type="button"
                  onClick={handleInstantTrial}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                >
                  <span>Activar Demo PRO Gratis</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Key size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Ej: LANZAMIENTO2026, COLEGIOPSICO"
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value.toUpperCase());
                        setPromoError('');
                      }}
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-emerald-500/40 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400 font-mono tracking-wider"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isApplyingPromo || !promoCode.trim()}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-xs font-bold rounded-xl transition-all"
                  >
                    {isApplyingPromo ? 'Verificando...' : 'Aplicar Código'}
                  </button>
                </div>
                {promoError && (
                  <p className="text-[11px] text-rose-400 font-medium">⚠️ {promoError}</p>
                )}
                <p className="text-[10px] text-slate-400">
                  Tip: Podés probar con el código promocional <code className="text-amber-300 font-mono bg-slate-900 px-1 py-0.5 rounded">LANZAMIENTO2026</code> para desbloquear 1 año de PRO.
                </p>
              </form>
            )}
          </div>

          {/* Security & Guarantee Footer */}
          <div className="mt-5 pt-3 border-t border-emerald-950 text-center flex items-center justify-center gap-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck size={13} className="text-emerald-500" />
              100% Confidencial y Seguro
            </span>
            <span>•</span>
            <span>Cancela cuando quieras</span>
            <span>•</span>
            <span>Soporte prioritario</span>
          </div>

        </div>
      </div>
    </div>
  );
};
