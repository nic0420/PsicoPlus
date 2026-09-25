// Color de identidad por sede (independiente del color guardado en datos antiguos).
const SEDE_TONES = {
  'badge-sede-centro': { dot: 'bg-emerald-600', bar: 'bg-emerald-600', text: 'text-emerald-700 dark:text-emerald-300' },
  'badge-sede-sanmartin': { dot: 'bg-rose-500', bar: 'bg-rose-500', text: 'text-rose-700 dark:text-rose-300' },
  'badge-sede-online': { dot: 'bg-sky-500', bar: 'bg-sky-500', text: 'text-sky-700 dark:text-sky-300' },
};

const FALLBACK = [
  { dot: 'bg-amber-500', bar: 'bg-amber-500', text: 'text-amber-700 dark:text-amber-300' },
  { dot: 'bg-teal-500', bar: 'bg-teal-500', text: 'text-teal-700 dark:text-teal-300' },
];

export const sedeTone = (sede) => {
  if (!sede) return SEDE_TONES['badge-sede-centro'];
  if (SEDE_TONES[sede.badgeClass]) return SEDE_TONES[sede.badgeClass];
  const hash = String(sede.id || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return FALLBACK[hash % FALLBACK.length];
};
