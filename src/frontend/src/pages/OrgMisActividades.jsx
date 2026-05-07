import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar, MapPin, Users, Trash2, Ban } from 'lucide-react';
import { actividades, perfil as perfilApi } from '../services/api.js';
import { Button } from '../components/Button.jsx';
import { Badge } from '../components/Badge.jsx';
import { EmptyState } from '../components/EmptyState.jsx';
import { Modal } from '../components/Modal.jsx';
import { formatearFechaCompleta } from '../utils/format.js';

export function OrgMisActividades() {
  const [perfil, setPerfil] = useState(null);
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmacion, setConfirmacion] = useState(null);

  const cargar = async () => {
    setLoading(true);
    try {
      const { perfil: p } = await perfilApi.obtener();
      setPerfil(p);
      if (p?.id_organizacion) {
        const data = await actividades.listar({ id_organizacion: p.id_organizacion, todas: true });
        setLista(data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const cancelar = async () => {
    await actividades.cancelar(confirmacion.id_actividad);
    setConfirmacion(null);
    cargar();
  };

  const eliminar = async () => {
    await actividades.eliminar(confirmacion.id_actividad);
    setConfirmacion(null);
    cargar();
  };

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-surface-900">Mis actividades</h1>
        {perfil?.estado_verificacion === 'VERIFICADA' && (
          <Link to="/organizacion/publicar" className="btn btn-primary">
            <Plus size={16} /> Publicar
          </Link>
        )}
      </header>

      {loading ? (
        <p className="text-sm text-surface-500">Cargando...</p>
      ) : lista.length === 0 ? (
        <EmptyState
          icon={Plus}
          titulo="No has publicado actividades"
          descripcion="Cuando crees tu primera actividad, aparecera aqui con sus inscripciones."
          accion={perfil?.estado_verificacion === 'VERIFICADA'
            ? <Link to="/organizacion/publicar" className="btn btn-primary"><Plus size={16} /> Publicar actividad</Link>
            : <p className="text-xs text-surface-500">Tu organizacion debe estar verificada para publicar.</p>}
        />
      ) : (
        <ul className="space-y-3" data-testid="lista-mis-actividades">
          {lista.map((a) => (
            <li key={a.id_actividad} className="card p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-surface-900 line-clamp-1">{a.titulo}</h3>
                  <Badge value={a.estado_actividad} kind="actividad" />
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-surface-500 mt-1">
                  <span className="inline-flex items-center gap-1"><Calendar size={12} /> {formatearFechaCompleta(a.fecha_evento)}</span>
                  <span className="inline-flex items-center gap-1"><MapPin size={12} /> {a.ciudad?.nombre_ciudad}</span>
                  <span className="inline-flex items-center gap-1"><Users size={12} /> {a.cupos_totales - a.cupos_disponibles}/{a.cupos_totales} inscritos</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {a.estado_actividad !== 'CANCELADA' && (
                  <Button variant="secondary" onClick={() => setConfirmacion({ ...a, accion: 'cancelar' })}>
                    <Ban size={14} /> Cancelar
                  </Button>
                )}
                <Button variant="ghost" onClick={() => setConfirmacion({ ...a, accion: 'eliminar' })}>
                  <Trash2 size={14} /> Eliminar
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {confirmacion && (
        <Modal
          open
          onClose={() => setConfirmacion(null)}
          title={confirmacion.accion === 'cancelar' ? 'Cancelar actividad' : 'Eliminar actividad'}
          size="sm"
          footer={
            <>
              <Button variant="secondary" onClick={() => setConfirmacion(null)}>Volver</Button>
              <Button variant="danger" onClick={confirmacion.accion === 'cancelar' ? cancelar : eliminar}>
                {confirmacion.accion === 'cancelar' ? 'Cancelar actividad' : 'Eliminar definitivamente'}
              </Button>
            </>
          }
        >
          <p className="text-sm text-surface-700">
            ¿Estas seguro de {confirmacion.accion === 'cancelar' ? 'cancelar' : 'eliminar'} <strong>{confirmacion.titulo}</strong>?
            {confirmacion.accion === 'eliminar' && ' No podras recuperarla.'}
          </p>
        </Modal>
      )}
    </div>
  );
}
