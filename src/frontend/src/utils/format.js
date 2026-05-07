const dtf = new Intl.DateTimeFormat('es-CO', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});
const dtfHora = new Intl.DateTimeFormat('es-CO', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
});

export function formatearFecha(fecha) {
  if (!fecha) return '';
  return dtf.format(new Date(fecha));
}
export function formatearFechaCorta(fecha) {
  if (!fecha) return '';
  const d = new Date(fecha);
  return new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'short' }).format(d);
}
export function formatearHora(fecha) {
  if (!fecha) return '';
  return dtfHora.format(new Date(fecha));
}
export function formatearFechaCompleta(fecha) {
  if (!fecha) return '';
  return `${formatearFecha(fecha)}, ${formatearHora(fecha)}`;
}

const COLORES = ['#2563eb', '#0891b2', '#7c3aed', '#0d9488', '#dc2626', '#ea580c', '#9333ea', '#0e7490'];

export function colorPorTexto(texto = '') {
  let suma = 0;
  for (let i = 0; i < texto.length; i += 1) suma += texto.charCodeAt(i);
  return COLORES[suma % COLORES.length];
}

export function iniciales(texto = '') {
  return texto
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || '')
    .join('');
}
