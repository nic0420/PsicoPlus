import React from 'react';
import { Sparkles, Lock, ArrowRight } from 'lucide-react';

export const ProBadge = ({ text = 'PRO', size = 'sm', className = '' }) => {
  const sizeClasses = {
    xs: 'text-[9px] px-1.5 py-0.2',
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span className={`inline-flex items-center gap-1 font-bold rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xs tracking-wide uppercase ${sizeClasses[size] || sizeClasses.sm} ${className}`}>
      <Sparkles size={size === 'xs' ? 9 : 11} className="text-amber-100" />
      <span>{text}</span>
    </span>
  );
};

export const ProFeatureCard = ({ 
  title, 
  description, 
  onUpgrade, 
  icon: Icon = Sparkles,
  compact = false 
}) => {
  if (compact) {
    return (
      <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/10 via-emerald-500/5 to-transparent border border-amber-500/30 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
            <Lock size={14} />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <span>{title}</span>
              <ProBadge size="xs" />
            </h4>
            <p className="text-[11px] text-slate-500 truncate">{description}</p>
          </div>
        </div>
        <button
          onClick={onUpgrade}
          className="flex-shrink-0 px-2.5 py-1 bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-white text-[11px] font-bold rounded-lg shadow-xs transition-all flex items-center gap-1"
        >
          <span>Desbloquear</span>
          <ArrowRight size={11} />
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 via-[#0b1612] to-slate-950 text-white border border-emerald-500/30 shadow-xl text-center relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/10">
        <Lock size={22} />
      </div>
      <div className="inline-flex items-center gap-1.5 mb-2">
        <ProBadge text="Función PRO" size="sm" />
      </div>
      <h3 className="text-base font-bold text-white mb-1.5 font-display">{title}</h3>
      <p className="text-xs text-emerald-200/80 max-w-md mx-auto mb-5 leading-relaxed">
        {description || 'Esta funcionalidad avanzada está disponible exclusivamente para usuarios de PsicoPlus PRO.'}
      </p>
      <button
        onClick={onUpgrade}
        className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-600 hover:to-emerald-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all inline-flex items-center gap-2"
      >
        <Sparkles size={14} className="text-slate-950" />
        <span>Desbloquear PsicoPlus PRO</span>
      </button>
    </div>
  );
};
