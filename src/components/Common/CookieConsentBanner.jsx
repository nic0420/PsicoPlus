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
    <div className="fixed bottom-3 sm:bottom-4 left-3 sm:left-6 right-3 sm:right-auto sm:max-w-md z-40 animate-fade-in">
      <div className="p-4 sm:p-4.5 rounded-3xl bg-slate-900/95 backdrop-blur-xl border border-emerald-500/30 text-white shadow-2xl shadow-slate-950/50 space-y-3">
        
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 flex-shrink-0 mt-0.5">
            <Cookie size={18} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold font-display text-white flex items-center gap-1.5">
                Privacidad & Almacenamiento Seguro
              </h4>
              <button 
                onClick={handleAcceptEssential}
                className="text-slate-400 hover:text-white p-0.5"
                title="Cerrar y aceptar solo esenciales"
              >
                <X size={15} />
              </button>
            </div>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              PsicoPlus almacena información clínica localmente respetando la <strong>Ley N° 25.326</strong>. No usamos cookies de rastreo publicitario invasivas.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={handleAcceptAll}
            className="flex-1 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1"
          >
            <Check size={13} />
            <span>Aceptar Todas</span>
          </button>

          <button
            onClick={handleAcceptEssential}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all"
          >
            Solo Esenciales
          </button>

          <button
            onClick={handleOpenConfig}
            className="p-1.5 text-slate-400 hover:text-emerald-400 transition-colors"
            title="Personalizar opciones de cookies"
          >
            <Settings size={15} />
          </button>
        </div>

      </div>
    </div>
  );
};
