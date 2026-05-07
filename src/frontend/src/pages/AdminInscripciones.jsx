import { useEffect, useMemo, useState } from 'react';
import { Inbox } from 'lucide-react';
import { inscripciones } from '../services/api.js';
import { Tabs } from '../components/Tabs.jsx';
import { Badge } from '../components/Badge.jsx';
import { EmptyState } from '../components/EmptyState.jsx';
import { Avatar } from '../components/Avatar.jsx';
import { formatearFechaCompleta } from '../utils/format.js';

const TABS = [
  { value: 'PENDIENTE', label: 'Pendientes' },
  { value: 'APROBADA', label: 'Aprobadas' },
  { value: 'RECHAZADA', label: 'Rechazadas' },
];

export function AdminInscripciones() {
  const [lista, setLista] = useState([]);
  const [tab, setTab] = useState('PENDIENTE');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    inscripciones.listar().then(setLista).finally(() => setLoading(false));
  }, []);

  const conteos = useMemo(() => ({
    PENDIENTE: lista.filter((i) => i.estado_solicitud === 'PENDIENTE').length,
    APROBADA: lista.filter((i) => i.estado_solicitud === 'APROBADA').length,
    RECHAZADA: lista.filter((i) => i.estado_solicitud === 'RECHAZADA').length,
  }), [lista]);

  const filtradas = lista.filter((i) => i.estado_solicitud === tab);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-surface-900">Solicitudes globales</h1>
      <Tabs value={tab} onChange={setTab} items={TABS.map((t) => ({ ...t, count: conteos[t.value] }))} />

      {loading ? (
        <p className="text-sm text-surface-500">Cargando...</p>
      ) : filtradas.length === 0 ? (
        <EmptyState icon={Inbox} titulo="Sin solicitudes" descripcion="No hay registros para esta pestaña." />
      ) : (
        <ul className="space-y-2">
          {filtradas.map((i) => {
            const nombre = `${i.voluntario?.nombre || ''} ${i.voluntario?.apellido || ''}`.trim();
            return (
              <li key={i.id_inscripcion} className="card p-4 flex items-center gap-3">
                <Avatar nombre={nombre} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-surface-900">{nombre}</p>
                  <p className="text-xs text-surface-500 line-clamp-1">{i.actividad?.titulo} · {i.actividad?.organizacion?.nombre_institucion}</p>
                  <p className="text-xs text-surface-400">{formatearFechaCompleta(i.fecha_inscripcion)}</p>
                </div>
                <Badge value={i.estado_solicitud} kind="inscripcion" />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
