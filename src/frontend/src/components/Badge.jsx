const ESTADO_INSCRIPCION = {
  PENDIENTE: { label: 'Pendiente', cls: 'badge-warning' },
  APROBADA: { label: 'Aprobada', cls: 'badge-success' },
  RECHAZADA: { label: 'Rechazada', cls: 'badge-danger' },
  ASISTIO: { label: 'Asistio', cls: 'badge-success' },
  NO_ASISTIO: { label: 'No asistio', cls: 'badge-neutral' },
};
const ESTADO_VERIFICACION = {
  PENDIENTE: { label: 'Pendiente', cls: 'badge-warning' },
  VERIFICADA: { label: 'Verificada', cls: 'badge-success' },
  SUSPENDIDA: { label: 'Suspendida', cls: 'badge-danger' },
};
const ESTADO_ACTIVIDAD = {
  BORRADOR: { label: 'Borrador', cls: 'badge-neutral' },
  PUBLICADA: { label: 'Publicada', cls: 'badge-info' },
  EN_CURSO: { label: 'En curso', cls: 'badge-info' },
  FINALIZADA: { label: 'Finalizada', cls: 'badge-neutral' },
  CANCELADA: { label: 'Cancelada', cls: 'badge-danger' },
};

const MAPS = {
  inscripcion: ESTADO_INSCRIPCION,
  verificacion: ESTADO_VERIFICACION,
  actividad: ESTADO_ACTIVIDAD,
};

export function Badge({ value, kind = 'inscripcion', children }) {
  if (children) return <span className="badge badge-neutral">{children}</span>;
  const map = MAPS[kind];
  const def = map?.[value] || { label: value, cls: 'badge-neutral' };
  return <span className={`badge ${def.cls}`}>{def.label}</span>;
}
