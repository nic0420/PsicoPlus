import React, { useState, useEffect } from 'react';
import {
  Check,
  X,
  Copy,
  Users,
  Building2,
  FileText,
  Globe,
  PieChart,
  ShieldCheck,
  Key,
  Gift,
  ArrowRight,
  ArrowLeft,
  MessageCircle,
  Wallet,
} from 'lucide-react';
import {
  activatePromoCode,
  switchPlanDirectly,
  PLANS,
  PRO_PRICING,
  ANNUAL_SAVINGS,
  ANNUAL_DISCOUNT_PCT,
  PAYMENT_INFO,
  formatARS,
} from '../../services/subscription';
import { useToast } from './Toast';

/* Copia al portapapeles con respaldo para navegadores móviles antiguos */
const copyText = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* sigue al respaldo */
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
};

const CopyRow = ({ label, value, mono = false, onCopied }) => {
  const [copied, setCopied] = useState(false);
  const handle = async () => {
    const ok = await copyText(value);
    if (ok) {
      setCopied(true);
      if (onCopied) onCopied(label);
      setTimeout(() => setCopied(false), 1800);
    }
  };
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <div className="min-w-0">
        <p className="text-[12px] text-slate-500">{label}</p>
        <p className={`text-[15px] font-medium text-slate-900 dark:text-slate-50 break-all select-all ${mono ? 'font-mono tracking-tight' : ''}`}>{value}</p>
      </div>
      <button
        type="button"
        onClick={handle}
        aria-label={`Copiar ${label}`}
        className={`flex-shrink-0 h-10 px-3 inline-flex items-center gap-1.5 rounded-lg border text-[13px] font-medium transition-colors active:scale-[0.97] ${
          copied
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-500/15 dark:border-emerald-500/30 dark:text-emerald-200'
            : 'border-[var(--border-color)] text-slate-700 dark:text-slate-300 hover:bg-[var(--bg-card-subtle)]'
        }`}
      >
        {copied ? <Check size={15} /> : <Copy size={15} />}
        {copied ? 'Copiado' : 'Copiar'}
      </button>
    </div>
  );
};

export const UpgradeModal = ({
  isOpen,
  onClose,
  featureReason = '',
  onPlanUpdated
}) => {
  const [billingCycle, setBillingCycle] = useState('annual'); // 'monthly' | 'annual'
  const [step, setStep] = useState('plan'); // 'plan' | 'pago'
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [showPromoInput, setShowPromoInput] = useState(false);
  const toast = useToast();

  const handleClose = () => {
    setStep('plan');
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const pricing = PRO_PRICING[billingCycle];
  const planLabel = billingCycle === 'annual' ? 'PsicoPlus PRO · Anual' : 'PsicoPlus PRO · Mensual';

  const proFeatures = [
    { icon: Users, title: 'Pacientes ilimitados', desc: 'Sin topes de pacientes activos.' },
    { icon: Building2, title: 'Sedes ilimitadas', desc: 'Consultorios físicos + atención virtual.' },
    { icon: FileText, title: 'Liquidaciones por lote', desc: 'Obras sociales con coseguros y plazos.' },
    { icon: Globe, title: 'Portal personalizado', desc: 'Tu link propio de reservas online.' },
    { icon: PieChart, title: 'Reportes y proyecciones', desc: 'Cobros a 30/60 días y exportación Excel.' },
    { icon: ShieldCheck, title: 'Informes clínicos en PDF', desc: 'Constancias y aptos listos para enviar.' },
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
        toast.showSuccess(`¡Listo! Se activó: ${res.promo.descripcion}`);
        if (onPlanUpdated) onPlanUpdated(res.subscription);
        onClose();
      } else {
        setPromoError(res.error || 'Código no válido');
      }
    }, 400);
  };

  const handleSendReceipt = () => {
    const message = encodeURIComponent(
      `Hola PsicoPlus. Transferí ${formatARS(pricing.total)} para el plan ${planLabel} ` +
      `a ${PAYMENT_INFO.provider} (alias ${PAYMENT_INFO.alias}). Adjunto el comprobante para activar mi cuenta PRO.`
    );
    window.open(`https://wa.me/${PAYMENT_INFO.whatsapp}?text=${message}`, '_blank', 'noopener,noreferrer');
    toast.showInfo('Adjuntá el comprobante en WhatsApp. Activamos tu PRO apenas lo recibamos.');
  };

  const handleInstantTrial = () => {
    const res = switchPlanDirectly(PLANS.PRO);
    toast.showSuccess('¡Modo PRO activado!');
    if (onPlanUpdated) onPlanUpdated(res);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 md:p-6" role="dialog" aria-modal="true" aria-label="Suscripción PsicoPlus PRO">
      <div onClick={handleClose} className="fixed inset-0 bg-slate-950/45 backdrop-blur-[6px] animate-[backdropIn_.2s_ease-out]" />

      <div className="relative z-10 w-full sm:max-w-xl max-h-[92dvh] overflow-y-auto overscroll-contain bg-[var(--bg-card)] text-[var(--text-main)] rounded-t-2xl sm:rounded-2xl border border-[var(--border-color)] shadow-[var(--shadow-pop)] animate-[fadeIn_.28s_cubic-bezier(.23,1,.32,1)] pb-safe">
        {/* Asa (móvil) */}
        <div className="sm:hidden flex justify-center pt-2.5"><span className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-700" /></div>

        <button
          onClick={handleClose}
          aria-label="Cerrar"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 grid place-items-center rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-900/5 dark:hover:bg-white/5 dark:hover:text-white transition-colors z-20"
        >
          <X size={18} />
        </button>

        {step === 'plan' ? (
          <div className="p-5 sm:p-8">
            {/* Encabezado */}
            <div className="pr-10">
              <p className="text-[13px] font-medium text-rose-700 dark:text-rose-300">PsicoPlus PRO</p>
              <h2 className="font-serif text-[2rem] sm:text-[2.4rem] leading-[1.05] mt-1">
                Llevá tu consultorio al <em className="text-emerald-700 dark:text-emerald-300">siguiente nivel</em>.
              </h2>
              {featureReason ? (
                <p className="mt-3 text-[13.5px] p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 dark:bg-amber-500/10 dark:border-amber-500/25 dark:text-amber-200">
                  {featureReason}
                </p>
              ) : (
                <p className="mt-3 text-[14.5px] text-slate-500">
                  Menos tiempo administrativo, liquidaciones en fecha y una mejor experiencia para tus pacientes.
                </p>
              )}
            </div>

            {/* Ciclo */}
            <div role="radiogroup" aria-label="Ciclo de pago" className="grid grid-cols-2 gap-2 mt-6">
              {['monthly', 'annual'].map((cycle) => {
                const p = PRO_PRICING[cycle];
                const active = billingCycle === cycle;
                return (
                  <button
                    key={cycle}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setBillingCycle(cycle)}
                    className={`relative text-left rounded-xl border p-3.5 sm:p-4 transition-colors ${
                      active
                        ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600 dark:bg-emerald-500/10 dark:border-emerald-400 dark:ring-emerald-400'
                        : 'border-[var(--border-color)] hover:border-slate-300'
                    }`}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-[13.5px] font-medium">{p.label}</span>
                      {cycle === 'annual' && (
                        <span className="text-[11px] font-semibold px-1.5 py-px rounded bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200">−{ANNUAL_DISCOUNT_PCT}%</span>
                      )}
                    </span>
                    <span className="block mt-2 text-[1.5rem] sm:text-[1.65rem] font-semibold tabular-nums leading-none">
                      {formatARS(p.perMonth)}
                      <span className="text-[13px] font-normal text-slate-500"> /mes</span>
                    </span>
                    <span className="block text-[12px] text-slate-500 mt-1.5">
                      {cycle === 'annual' ? `${formatARS(p.total)} por año` : 'Sin permanencia'}
                    </span>
                  </button>
                );
              })}
            </div>
            {billingCycle === 'annual' && (
              <p className="text-[12.5px] text-emerald-800 dark:text-emerald-300 mt-2">
                Con el plan anual ahorrás {formatARS(ANNUAL_SAVINGS)} por año.
              </p>
            )}

            <button
              onClick={() => setStep('pago')}
              className="btn btn-primary w-full !min-h-12 !text-[15px] mt-5"
            >
              Suscribirme por {formatARS(pricing.total)}{billingCycle === 'annual' ? ' al año' : ' al mes'}
              <ArrowRight size={17} />
            </button>

            {/* Beneficios */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-3 mt-7">
              {proFeatures.map((feat) => (
                <li key={feat.title} className="flex gap-2.5">
                  <Check size={16} className="text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>
                    <span className="block text-[13.5px] font-medium">{feat.title}</span>
                    <span className="block text-[12.5px] text-slate-500">{feat.desc}</span>
                  </span>
                </li>
              ))}
            </ul>

            {/* Código / prueba */}
            <div className="border-t border-[var(--border-color)] mt-7 pt-4">
              {!showPromoInput ? (
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPromoInput(true)}
                    className="h-10 inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 underline decoration-slate-300 underline-offset-4"
                  >
                    <Gift size={14} /> ¿Tenés un código de convenio?
                  </button>
                  <button
                    type="button"
                    onClick={handleInstantTrial}
                    className="h-10 inline-flex items-center gap-1 text-[13px] font-medium text-emerald-700 dark:text-emerald-300"
                  >
                    Probar PRO en la demo <ArrowRight size={14} />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Key size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        inputMode="text"
                        autoCapitalize="characters"
                        autoComplete="off"
                        placeholder="Código de convenio"
                        value={promoCode}
                        onChange={(e) => {
                          setPromoCode(e.target.value.toUpperCase());
                          setPromoError('');
                        }}
                        className="input-field !pl-9 font-mono tracking-wider !text-[16px] sm:!text-[14px]"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isApplyingPromo || !promoCode.trim()}
                      className="btn btn-secondary !min-h-10"
                    >
                      {isApplyingPromo ? 'Verificando…' : 'Aplicar'}
                    </button>
                  </div>
                  {promoError && <p className="text-[12.5px] text-rose-600 dark:text-rose-400">{promoError}</p>}
                </form>
              )}
            </div>
          </div>
        ) : (
          /* PASO 2: pago por transferencia */
          <div className="p-5 sm:p-8">
            <button
              onClick={() => setStep('plan')}
              className="h-9 -ml-2 px-2 inline-flex items-center gap-1.5 rounded-lg text-[13px] text-slate-500 hover:text-slate-900 hover:bg-slate-900/5 dark:hover:bg-white/5 dark:hover:text-slate-100"
            >
              <ArrowLeft size={15} /> Volver
            </button>

            <div className="mt-2 pr-10">
              <p className="text-[13px] font-medium text-sky-700 dark:text-sky-300 flex items-center gap-1.5">
                <Wallet size={14} /> Pago por transferencia
              </p>
              <h2 className="font-serif text-[2rem] leading-[1.05] mt-1">Transferí y activamos tu PRO.</h2>
            </div>

            <div className="mt-5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] p-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-[12px] text-slate-500">{planLabel}</p>
                <p className="text-[2rem] font-semibold tabular-nums leading-tight">{formatARS(pricing.total)}</p>
              </div>
              <CopyRowInline value={String(pricing.total)} label="monto" toast={toast} />
            </div>

            <div className="mt-4 rounded-xl border border-[var(--border-color)] px-4 divide-y divide-[var(--border-subtle)]">
              <CopyRow label={`Alias · ${PAYMENT_INFO.provider}`} value={PAYMENT_INFO.alias} onCopied={() => toast.showSuccess('Alias copiado')} />
              <CopyRow label="CVU" value={PAYMENT_INFO.cvu} mono onCopied={() => toast.showSuccess('CVU copiado')} />
            </div>

            <ol className="mt-5 space-y-2.5 text-[13.5px] text-slate-600 dark:text-slate-300">
              <li className="flex gap-2.5"><span className="w-5 h-5 flex-shrink-0 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200 grid place-items-center text-[11px] font-semibold">1</span>Abrí Mercado Pago o tu banco y transferí el monto al alias o CVU.</li>
              <li className="flex gap-2.5"><span className="w-5 h-5 flex-shrink-0 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200 grid place-items-center text-[11px] font-semibold">2</span>Envianos el comprobante por WhatsApp con el botón de abajo.</li>
              <li className="flex gap-2.5"><span className="w-5 h-5 flex-shrink-0 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200 grid place-items-center text-[11px] font-semibold">3</span>Te activamos PsicoPlus PRO y te avisamos.</li>
            </ol>

            <button onClick={handleSendReceipt} className="btn btn-primary w-full !min-h-12 !text-[15px] mt-6">
              <MessageCircle size={17} /> Ya transferí · Enviar comprobante
            </button>
            <p className="text-center text-[12px] text-slate-500 mt-3">
              Pagos seguros a través de {PAYMENT_INFO.provider}. Sin permanencia: cancelás cuando quieras.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

/* Botón compacto para copiar el monto */
const CopyRowInline = ({ value, label, toast }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        if (await copyText(value)) {
          setCopied(true);
          toast.showSuccess('Monto copiado');
          setTimeout(() => setCopied(false), 1800);
        }
      }}
      aria-label={`Copiar ${label}`}
      className="h-10 px-3 inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] text-[13px] font-medium text-slate-700 dark:text-slate-300 active:scale-[0.97]"
    >
      {copied ? <Check size={15} /> : <Copy size={15} />}
      {copied ? 'Copiado' : 'Copiar'}
    </button>
  );
};

export default UpgradeModal;
