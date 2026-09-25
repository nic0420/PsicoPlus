// Utilidades de fecha en hora local (evita corrimientos por UTC).
const pad = (n) => String(n).padStart(2, '0');

export const toISODate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const todayISO = () => toISODate(new Date());

export const addDaysISO = (days, base = new Date()) => {
  const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + days, 12);
  return toISODate(d);
};

export const parseISODate = (iso) => new Date(`${iso}T12:00:00`);

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

/** "Septiembre 2026" */
export const periodoLabel = (d = new Date()) => `${MESES[d.getMonth()]} ${d.getFullYear()}`;
