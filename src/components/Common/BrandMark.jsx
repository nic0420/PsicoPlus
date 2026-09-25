import React from 'react';

/**
 * Marca PsicoPlus — "Ψ" serif sobre petróleo.
 * size: px del cuadrado · tone: 'solid' | 'light'
 */
export const BrandMark = ({ size = 36, tone = 'solid', className = '' }) => {
  const solid = tone === 'solid';
  return (
    <span
      aria-hidden="true"
      className={`inline-grid place-items-center flex-shrink-0 select-none ${
        solid
          ? 'bg-emerald-700 text-[#f4f1e8] dark:bg-emerald-300 dark:text-emerald-950'
          : 'bg-[#f4f1e8] text-emerald-800'
      } ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.3),
        boxShadow: solid ? 'inset 0 1px 0 rgba(255,255,255,.14), 0 1px 2px rgba(23,56,52,.25)' : undefined,
      }}
    >
      <span
        className="font-serif leading-none"
        style={{ fontSize: Math.round(size * 0.66), transform: 'translateY(4%)' }}
      >
        Ψ
      </span>
    </span>
  );
};

export const BrandWordmark = ({ className = '', size = 'md' }) => (
  <span className={`font-serif tracking-tight ${size === 'lg' ? 'text-[1.7rem]' : 'text-[1.4rem]'} leading-none ${className}`}>
    Psico<span className="italic text-emerald-600 dark:text-emerald-300">Plus</span>
  </span>
);
