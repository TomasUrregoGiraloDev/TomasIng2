import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { actividades, catalogos } from '../services/api.js';
import { Button } from '../components/Button.jsx';
import { Input, Select, Textarea } from '../components/Input.jsx';
import { Badge } from '../components/Badge.jsx';
import { ImageUploader } from '../components/ImageUploader.jsx';

// Convierte un ISO/DATETIME del backend al formato de input "datetime-local" (YYYY-MM-DDTHH:mm)
function toInputValue(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function OrgEditarActividad() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [cats, setCats] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [estado, setEstado] = useState('PUBLICADA');
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      actividades.obtener(id),
      catalogos.categorias(),
      catalogos.ciudades(),
    ]).then(([act, c1, c2]) => {
      setForm({
        titulo: act.titulo || '',
        descripcion: act.descripcion || '',
        id_categoria: act.id_categoria,
        id_ciudad: act.id_ciudad,
        fecha_evento: toInputValue(act.fecha_evento),
        direccion: act.direccion || '',
        cupos_totales: act.cupos_totales,
        cupos_disponibles: act.cupos_disponibles,
        imagen_url: act.imagen_url || '',
      });
      setEstado(act.estado_actividad);
      setCats(c1);
      setCiudades(c2);
    }).catch((e) => setError(e.message));
  }, [id]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const guardar = async (e) => {
    e.preventDefault();
    setError(null);
    setExito(null);
    setLoading(true);
    try {
      const payload = {
        titulo: form.titulo,
        descripcion: form.descripcion,
        id_categoria: Number(form.id_categoria),
        id_ciudad: Number(form.id_ciudad),
        fecha_evento: form.fecha_evento,
        direccion: form.direccion,
        cupos_totales: Number(form.cupos_totales),
        imagen_url: form.imagen_url || '',
      };
      await actividades.actualizar(Number(id), payload);
      setExito('Cambios guardados correctamente');
      setTimeout(() => navigate('/organizacion/actividades'), 800);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelarActividad = async () => {
    if (!confirm('¿Cancelar esta actividad? Los voluntarios inscritos lo veran reflejado.')) return;
    setLoading(true);
    try {
      await actividades.cancelar(Number(id));
      navigate('/organizacion/actividades');
    } finally {
      setLoading(false);
    }
  };

  if (!form) {
    return (
      <p className="text-sm text-surface-500">{error ? error : 'Cargando actividad...'}</p>
    );
  }

  return (
    <div className="max-w-2xl">
      <Link to="/organizacion/actividades" className="inline-flex items-center gap-1 text-sm text-surface-600 hover:text-surface-900 mb-3">
        <ArrowLeft size={14} /> Volver a mis actividades
      </Link>
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-xl font-semibold text-surface-900">Editar actividad</h1>
        <Badge value={estado} kind="actividad" />
      </div>

      <form onSubmit={guardar} className="card p-6 space-y-4" noValidate>
        <Input label="Titulo" name="titulo" value={form.titulo} onChange={onChange} required minLength={3} data-testid="input-titulo" />
        <Textarea label="Descripcion" name="descripcion" value={form.descripcion} onChange={onChange} required minLength={10} data-testid="input-descripcion" />
        <div className="grid sm:grid-cols-2 gap-3">
          <Select label="Categoria" name="id_categoria" value={form.id_categoria} onChange={onChange} required
            options={cats.map((c) => ({ value: c.id_categoria, label: c.nombre_categoria }))} />
          <Select label="Ciudad" name="id_ciudad" value={form.id_ciudad} onChange={onChange} required
            options={ciudades.map((c) => ({ value: c.id_ciudad, label: c.nombre_ciudad }))} />
        </div>
        <Input label="Direccion" name="direccion" value={form.direccion} onChange={onChange} required data-testid="input-direccion" />
        <div className="grid sm:grid-cols-2 gap-3">
          <Input label="Fecha y hora" type="datetime-local" name="fecha_evento" value={form.fecha_evento} onChange={onChange} required data-testid="input-fecha" />
          <Input label="Cupos totales" type="number" min={1} name="cupos_totales" value={form.cupos_totales} onChange={onChange} required data-testid="input-cupos" />
        </div>
        <ImageUploader value={form.imagen_url} onChange={(v) => setForm((f) => ({ ...f, imagen_url: v }))} />

        <p className="text-xs text-surface-500">
          Cupos disponibles actuales: <strong>{form.cupos_disponibles}</strong>. Si reduces los totales por debajo de los cupos
          ya tomados, el sistema los ajusta automaticamente.
        </p>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded p-3" data-testid="form-error">{error}</div>}
        {exito && <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded p-3" data-testid="editar-exito">{exito}</div>}

        <div className="flex justify-between gap-2">
          <Button type="button" variant="ghost" onClick={cancelarActividad} disabled={estado === 'CANCELADA'}>
            Cancelar actividad
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Volver</Button>
            <Button type="submit" loading={loading} data-testid="btn-guardar-actividad">Guardar cambios</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
