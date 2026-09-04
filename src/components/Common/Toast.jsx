import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3200) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg, dur) => addToast(msg, 'success', dur),
    error: (msg, dur) => addToast(msg, 'error', dur),
    info: (msg, dur) => addToast(msg, 'info', dur),
    warning: (msg, dur) => addToast(msg, 'warning', dur),
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />;
      case 'error':
        return <AlertCircle size={16} className="text-rose-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-amber-500 shrink-0" />;
      case 'info':
      default:
        return <Info size={16} className="text-indigo-500 shrink-0" />;
    }
  };

  const getTypeStyle = (type) => {
    switch (type) {
      case 'success':
        return 'border-emerald-200 dark:border-emerald-800/80 bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-100 shadow-lg';
      case 'error':
        return 'border-rose-200 dark:border-rose-800/80 bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-100 shadow-lg';
      case 'warning':
        return 'border-amber-200 dark:border-amber-800/80 bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-100 shadow-lg';
      case 'info':
      default:
        return 'border-indigo-200 dark:border-indigo-800/80 bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-100 shadow-lg';
    }
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      
      {/* Toast Viewport (Bottom-Right on Desktop, Top-Center on Mobile) */}
      <div className="fixed bottom-16 md:bottom-6 right-4 left-4 md:left-auto md:w-80 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-2.5 p-3.5 rounded-2xl border backdrop-blur-md transition-all animate-fade-in ${getTypeStyle(
              t.type
            )}`}
          >
            {getIcon(t.type)}
            <span className="text-xs font-semibold flex-1 leading-snug">{t.message}</span>
            <button
              onClick={() => removeToast(t.id)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
