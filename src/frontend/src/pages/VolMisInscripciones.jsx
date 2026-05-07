import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Inbox, Star } from 'lucide-react';
import { inscripciones, resenas } from '../services/api.js';
import { Badge } from '../components/Badge.jsx';
import { EmptyState } from '../components/EmptyState.jsx';
import { Button } from '../components/Button.jsx';
import { Modal } from '../components/Modal.jsx';
import { Input, Textarea } from '../components/Input.jsx';
import { formatearFechaCompleta } from '../utils/format.js';

export function VolMisInscripciones() {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resenando, setResenando] = useState(null);

  const cargar = () => {
    setLoading(true);
    inscripciones.listar()
      .then(setLista)
      .finally(() => setLoading(false));
  };

  useEffect(cargar, []);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-surface-900">Mis inscripciones</h1>
      {loading ? (
        <p className="text-sm text-surface-500">Cargando...</p>
      ) : lista.length === 0 ? (
        <EmptyState
          icon={Inbox}
          titulo="Aun no te has inscrito en actividades"
          descripcion="Explora el catalogo y unete a la primera que te interese."
          accion={<Link to="/voluntario/buscar" className="btn btn-primary">Buscar actividades</Link>}
        />
      ) : (
        <ul className="space-y-3" data-testid="lista-mis-inscripciones">
          {lista.map((i) => (
            <li key={i.id_inscripcion} className="card p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex-1 min-w-0">
                <Link to={`/voluntario/actividad/${i.id_actividad}`} className="font-medium text-surface-900 hover:text-primary-700 line-clamp-1">
                  {i.actividad?.titulo}
                </Link>
                <div className="flex flex-wrap items-center gap-3 text-xs text-surface-500 mt-1">
                  <span className="inline-flex items-center gap-1"><Calendar size={12} /> {formatearFechaCompleta(i.actividad?.fecha_evento)}</span>
                  <span className="inline-flex items-center gap-1"><MapPin size={12} /> {i.actividad?.ciudad?.nombre_ciudad}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge value={i.estado_solicitud} kind="inscripcion" />
                {i.estado_solicitud === 'ASISTIO' && (
                  <Button variant="secondary" onClick={() => setResenando(i)}>
                    <Star size={14} /> Calificar
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {resenando && (
        <ModalResena
          inscripcion={resenando}
          onClose={() => setResenando(null)}
          onGuardado={() => { setResenando(null); cargar(); }}
        />
      )}
    </div>
  );
}

function ModalResena({ inscripcion, onClose, onGuardado }) {
  const [calificacion, setCalificacion] = useState(5);
  const [comentario, setComentario] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const guardar = async () => {
    setError(null);
    setLoading(true);
    try {
      await resenas.crear({ id_inscripcion: inscripcion.id_inscripcion, calificacion, comentario });
      onGuardado();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Calificar experiencia"
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button onClick={guardar} loading={loading}>Enviar</Button>
        </>
      }
    >
      <div className="space-y-3">
        <p className="text-sm text-surface-600">{inscripcion.actividad?.titulo}</p>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setCalificacion(n)}
              className="p-1"
              aria-label={`${n} estrellas`}
            >
              <Star size={22} className={n <= calificacion ? 'text-amber-500 fill-amber-500' : 'text-surface-300'} />
            </button>
          ))}
        </div>
        <Textarea label="Comentario (opcional)" value={comentario} onChange={(e) => setComentario(e.target.value)} maxLength={1000} />
        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded p-3">{error}</div>}
      </div>
    </Modal>
  );
}
