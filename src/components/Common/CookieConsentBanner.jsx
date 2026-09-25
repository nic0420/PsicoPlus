import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, Check, Settings, X } from 'lucide-react';

export const CookieConsentBanner = ({ onOpenLegal }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('psicoplus_cookie_consent');
    if (!consent) {
      // Small timeout for smooth slide-in appearance
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('psicoplus_cookie_consent', 'all');
    localStorage.setItem('psicoplus_cookie_prefs', JSON.stringify({
      esenciales: true,
      preferencias: true,
      analitica: true
    }));
    setIsVisible(false);
  };

  const handleAcceptEssential = () => {
    localStorage.setItem('psicoplus_cookie_consent', 'essential');
    localStorage.setItem('psicoplus_cookie_prefs', JSON.stringify({
      esenciales: true,
      preferencias: false,
      analitica: false
    }));
    setIsVisible(false);
  };

  const handleOpenConfig = () => {
    if (onOpenLegal) onOpenLegal('cookies');
  };

  if (!isVisible) return null;

  return (
    <div role="dialog" aria-label="Preferencias de privacidad" className="fixed bottom-3 sm:bottom-5 left-3 sm:left-5 right-3 sm:right-auto sm:max-w-[380px] z-40 animate-fade-in">
      <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] shadow-[var(--shadow-pop)]">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 grid place-items-center flex-shrink-0">
            <Cookie size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-[14px] font-semibold leading-snug">Tu privacidad, primero</h4>
              <button
                onClick={handleAcceptEssential}
                className="-mt-1 -mr-1 w-7 h-7 grid place-items-center rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-900/5 dark:hover:text-slate-200"
                title="Cerrar y aceptar solo esenciales"
                aria-label="Cerrar"
              >
                <X size={15} />
              </button>
            </div>
            <p className="text-[12.5px] text-[var(--text-muted)] mt-1 leading-relaxed">
              Guardamos la información clínica respetando la <strong className="font-medium text-[var(--text-main)]">Ley 25.326</strong>. Sin cookies publicitarias.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3.5">
          <button onClick={handleAcceptAll} className="btn btn-primary flex-1 !min-h-9 !text-[13px]">
            <Check size={14} /> Aceptar
          </button>
          <button onClick={handleAcceptEssential} className="btn btn-secondary !min-h-9 !text-[13px]">
            Solo esenciales
          </button>
          <button
            onClick={handleOpenConfig}
            className="w-9 h-9 grid place-items-center rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-900/5 dark:hover:text-slate-200"
            title="Personalizar opciones de cookies"
            aria-label="Personalizar cookies"
          >
            <Settings size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
