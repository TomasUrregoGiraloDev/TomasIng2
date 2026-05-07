import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { notificaciones } from '../services/api.js';
import { EmptyState } from '../components/EmptyState.jsx';
import { Button } from '../components/Button.jsx';
import { formatearFechaCompleta } from '../utils/format.js';

const TIPO_TEXTO = {
  INSCRIPCION_APROBADA: 'Inscripcion aprobada',
  INSCRIPCION_RECHAZADA: 'Inscripcion rechazada',
  NUEVA_ACTIVIDAD: 'Nueva actividad',
  ORG_VERIFICADA: 'Organizacion verificada',
  MENSAJE_NUEVO: 'Mensaje nuevo',
  GENERAL: 'Notificacion',
};

export function Notificaciones() {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargar = () => {
    setLoading(true);
    notificaciones.listar().then(setLista).finally(() => setLoading(false));
  };

  useEffect(cargar, []);

  const marcar = async (id) => {
    await notificaciones.marcarLeida(id);
    cargar();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-surface-900">Notificaciones</h1>
      {loading ? (
        <p className="text-sm text-surface-500">Cargando...</p>
      ) : lista.length === 0 ? (
        <EmptyState icon={Bell} titulo="Sin notificaciones" descripcion="Cuando ocurra algo importante te lo haremos saber aqui." />
      ) : (
        <ul className="space-y-2" data-testid="lista-notificaciones">
          {lista.map((n) => (
            <li key={n.id_notificacion} className={`card p-4 flex items-start gap-3 ${n.leido ? 'opacity-70' : ''}`} data-testid={`notif-${n.id_notificacion}`}>
              <div className="w-9 h-9 rounded-full bg-primary-50 text-primary-700 flex items-center justify-center"><Bell size={16} /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wide font-medium text-surface-500">{TIPO_TEXTO[n.tipo] || n.tipo}</span>
                  {!n.leido && <span className="w-1.5 h-1.5 rounded-full bg-primary-600" />}
                </div>
                <p className="font-medium text-surface-900 mt-0.5">{n.titulo}</p>
                <p className="text-sm text-surface-700 mt-0.5">{n.mensaje}</p>
                <p className="text-xs text-surface-400 mt-1">{formatearFechaCompleta(n.fecha_creacion)}</p>
              </div>
              {!n.leido && (
                <Button variant="ghost" onClick={() => marcar(n.id_notificacion)} data-testid={`btn-marcar-leida-${n.id_notificacion}`}>
                  Marcar leida
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
