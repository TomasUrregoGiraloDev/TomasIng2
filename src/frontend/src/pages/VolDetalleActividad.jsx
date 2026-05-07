import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users, Star } from 'lucide-react';
import { actividades, inscripciones, resenas } from '../services/api.js';
import { Button } from '../components/Button.jsx';
import { Modal } from '../components/Modal.jsx';
import { Badge } from '../components/Badge.jsx';
import { ImagePlaceholder } from '../components/Avatar.jsx';
import { formatearFechaCompleta } from '../utils/format.js';

export function VolDetalleActividad() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [actividad, setActividad] = useState(null);
  const [resenasList, setResenasList] = useState([]);
  const [yaInscrito, setYaInscrito] = useState(false);
  const [modal, setModal] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(null);

  useEffect(() => {
    actividades.obtener(id).then(setActividad).catch((e) => setError(e.message));
    resenas.listarPorActividad(id).then(setResenasList).catch(() => {});
    inscripciones.listar().then((lista) => {
      setYaInscrito(lista.some((i) => i.id_actividad === Number(id)));
    }).catch(() => {});
  }, [id]);

  const inscribirse = async () => {
    setConfirmando(true);
    setError(null);
    try {
      await inscripciones.crear({ id_actividad: Number(id) });
      setModal(false);
      setExito('Tu inscripcion fue enviada. Recibiras una notificacion cuando la organizacion responda.');
      setYaInscrito(true);
      const actu = await actividades.obtener(id);
      setActividad(actu);
    } catch (e) {
      setError(e.message);
    } finally {
      setConfirmando(false);
    }
  };

  if (!actividad) {
    return (
      <div className="text-sm text-surface-500">Cargando actividad...</div>
    );
  }

  const inscritos = actividad.cupos_totales - actividad.cupos_disponibles;
  const cancelada = actividad.estado_actividad === 'CANCELADA';

  return (
    <div className="space-y-6">
      <Link to="/voluntario/buscar" className="inline-flex items-center gap-1 text-sm text-surface-600 hover:text-surface-900">
        <ArrowLeft size={14} /> Volver a actividades
      </Link>

      {exito && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded p-3" data-testid="exito-inscripcion">{exito}</div>
      )}

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div>
          {actividad.imagen_url ? (
            <img src={actividad.imagen_url} alt={actividad.titulo} className="w-full h-72 object-cover rounded-lg border border-surface-200" />
          ) : (
            <ImagePlaceholder texto={actividad.titulo} className="w-full h-72 rounded-lg" />
          )}

          <div className="card p-6 mt-6">
            <h1 className="text-2xl font-semibold text-surface-900">{actividad.titulo}</h1>
            <p className="text-sm text-surface-500 mt-1">{actividad.organizacion?.nombre_institucion}</p>
            <div className="flex items-center gap-3 mt-3">
              <Badge>{actividad.categoria?.nombre_categoria}</Badge>
              {cancelada && <Badge value="CANCELADA" kind="actividad" />}
            </div>
            <h2 className="text-base font-semibold text-surface-900 mt-6">Descripcion</h2>
            <p className="text-sm text-surface-700 mt-2 whitespace-pre-line leading-6">{actividad.descripcion}</p>

            <h2 className="text-base font-semibold text-surface-900 mt-6">Reseñas</h2>
            {resenasList.length === 0 ? (
              <p className="text-sm text-surface-500 mt-2">Aun no hay reseñas para esta actividad.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {resenasList.map((r) => (
                  <li key={r.id_resena} className="border border-surface-200 rounded p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-surface-700">{r.voluntario}</p>
                      <span className="inline-flex items-center gap-1 text-amber-600 text-sm">
                        <Star size={14} fill="currentColor" /> {r.calificacion}
                      </span>
                    </div>
                    {r.comentario && <p className="text-sm text-surface-600 mt-1">{r.comentario}</p>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <aside>
          <div className="card p-5 sticky top-4 space-y-4">
            <h2 className="text-base font-semibold text-surface-900">Detalles</h2>
            <Detalle icon={Calendar} label="Fecha y hora" value={formatearFechaCompleta(actividad.fecha_evento)} />
            <Detalle icon={MapPin} label="Ubicacion" value={`${actividad.direccion || ''}${actividad.direccion ? ', ' : ''}${actividad.ciudad?.nombre_ciudad || ''}`} />
            <Detalle icon={Users} label="Cupos" value={`${actividad.cupos_disponibles} de ${actividad.cupos_totales} disponibles`} />

            {cancelada ? (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded p-3">
                Esta actividad fue cancelada.
              </div>
            ) : yaInscrito ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded p-3">
                Ya estas inscrito en esta actividad.
              </div>
            ) : actividad.cupos_disponibles === 0 ? (
              <Button disabled className="w-full">Sin cupos disponibles</Button>
            ) : (
              <Button className="w-full" onClick={() => setModal(true)} data-testid="btn-inscribirme">Inscribirme</Button>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded p-3">{error}</div>
            )}
          </div>
        </aside>
      </div>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="Confirmar inscripcion"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModal(false)}>Cancelar</Button>
            <Button onClick={inscribirse} loading={confirmando} data-testid="btn-confirmar-inscripcion">Confirmar</Button>
          </>
        }
      >
        <p className="text-sm text-surface-700">
          Vas a inscribirte en <span className="font-medium">{actividad.titulo}</span>.
          La organizacion revisara tu solicitud y te enviara una notificacion.
        </p>
      </Modal>
    </div>
  );
}

function Detalle({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-primary-600 mt-0.5"><Icon size={18} /></span>
      <div>
        <p className="text-xs text-surface-500">{label}</p>
        <p className="text-sm font-medium text-surface-900">{value}</p>
      </div>
    </div>
  );
}
