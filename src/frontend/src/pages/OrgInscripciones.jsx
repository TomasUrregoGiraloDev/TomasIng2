import { useEffect, useMemo, useState } from 'react';
import { Inbox, Check, X, CheckCircle2, XCircle } from 'lucide-react';
import { inscripciones } from '../services/api.js';
import { Tabs } from '../components/Tabs.jsx';
import { Badge } from '../components/Badge.jsx';
import { Button } from '../components/Button.jsx';
import { EmptyState } from '../components/EmptyState.jsx';
import { Avatar } from '../components/Avatar.jsx';
import { formatearFechaCompleta } from '../utils/format.js';

const TABS = [
  { value: 'PENDIENTE', label: 'Pendientes' },
  { value: 'APROBADA', label: 'Aprobadas' },
  { value: 'RECHAZADA', label: 'Rechazadas' },
  { value: 'ASISTIO', label: 'Asistencia' },
];

export function OrgInscripciones() {
  const [lista, setLista] = useState([]);
  const [tab, setTab] = useState('PENDIENTE');
  const [loading, setLoading] = useState(true);

  const cargar = () => {
    setLoading(true);
    inscripciones.listar().then(setLista).finally(() => setLoading(false));
  };

  useEffect(cargar, []);

  const conteos = useMemo(() => ({
    PENDIENTE: lista.filter((i) => i.estado_solicitud === 'PENDIENTE').length,
    APROBADA: lista.filter((i) => i.estado_solicitud === 'APROBADA').length,
    RECHAZADA: lista.filter((i) => i.estado_solicitud === 'RECHAZADA').length,
    ASISTIO: lista.filter((i) => i.estado_solicitud === 'ASISTIO' || i.estado_solicitud === 'NO_ASISTIO').length,
  }), [lista]);

  const filtradas = useMemo(() => {
    if (tab === 'ASISTIO') return lista.filter((i) => ['ASISTIO', 'NO_ASISTIO'].includes(i.estado_solicitud));
    return lista.filter((i) => i.estado_solicitud === tab);
  }, [tab, lista]);

  const cambiar = async (id, estado_solicitud) => {
    await inscripciones.cambiarEstado(id, estado_solicitud);
    cargar();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-surface-900">Solicitudes de inscripcion</h1>
      <Tabs value={tab} onChange={setTab} items={TABS.map((t) => ({ ...t, count: conteos[t.value] }))} />

      {loading ? (
        <p className="text-sm text-surface-500">Cargando...</p>
      ) : filtradas.length === 0 ? (
        <EmptyState icon={Inbox} titulo="No hay solicitudes en esta pestaña" descripcion="Cuando alguien se inscriba aparecera aqui." />
      ) : (
        <ul className="space-y-2" data-testid="lista-inscripciones">
          {filtradas.map((i) => {
            const nombre = `${i.voluntario?.nombre || ''} ${i.voluntario?.apellido || ''}`.trim();
            return (
              <li key={i.id_inscripcion} className="card p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <Avatar nombre={nombre} />
                  <div className="min-w-0">
                    <p className="font-medium text-surface-900">{nombre || 'Voluntario'}</p>
                    <p className="text-xs text-surface-500 line-clamp-1">{i.actividad?.titulo}</p>
                    <p className="text-xs text-surface-400 mt-0.5">{formatearFechaCompleta(i.fecha_inscripcion)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge value={i.estado_solicitud} kind="inscripcion" />
                  {i.estado_solicitud === 'PENDIENTE' && (
                    <>
                      <Button variant="secondary" onClick={() => cambiar(i.id_inscripcion, 'RECHAZADA')} data-testid={`btn-rechazar-${i.id_inscripcion}`}>
                        <X size={14} /> Rechazar
                      </Button>
                      <Button onClick={() => cambiar(i.id_inscripcion, 'APROBADA')} data-testid={`btn-aprobar-${i.id_inscripcion}`}>
                        <Check size={14} /> Aprobar
                      </Button>
                    </>
                  )}
                  {i.estado_solicitud === 'APROBADA' && (
                    <>
                      <Button variant="secondary" onClick={() => cambiar(i.id_inscripcion, 'NO_ASISTIO')}>
                        <XCircle size={14} /> No asistio
                      </Button>
                      <Button onClick={() => cambiar(i.id_inscripcion, 'ASISTIO')}>
                        <CheckCircle2 size={14} /> Asistio
                      </Button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
