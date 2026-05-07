import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { actividades, catalogos } from '../services/api.js';
import { Button } from '../components/Button.jsx';
import { Input, Select, Textarea } from '../components/Input.jsx';
import { ImageUploader } from '../components/ImageUploader.jsx';

function ahoraInputValue() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function OrgPublicarActividad() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    titulo: '', descripcion: '', id_categoria: '', id_ciudad: '',
    fecha_evento: '', direccion: '', cupos_totales: '', imagen_url: '',
  });
  const minFecha = useMemo(ahoraInputValue, []);
  const [cats, setCats] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([catalogos.categorias(), catalogos.ciudades()]).then(([c1, c2]) => {
      setCats(c1); setCiudades(c2);
    });
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (form.fecha_evento && new Date(form.fecha_evento).getTime() < Date.now() - 60_000) {
      setError('La fecha y hora debe ser presente o futura');
      return;
    }
    setLoading(true);
    try {
      await actividades.crear({
        titulo: form.titulo,
        descripcion: form.descripcion,
        id_categoria: Number(form.id_categoria),
        id_ciudad: Number(form.id_ciudad),
        fecha_evento: form.fecha_evento,
        direccion: form.direccion,
        cupos_totales: Number(form.cupos_totales),
        imagen_url: form.imagen_url || undefined,
      });
      navigate('/organizacion/actividades', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold text-surface-900 mb-4">Publicar actividad</h1>
      <form onSubmit={onSubmit} className="card p-6 space-y-4" noValidate>
        <Input label="Titulo" name="titulo" value={form.titulo} onChange={onChange} required minLength={3} data-testid="input-titulo" />
        <Textarea label="Descripcion" name="descripcion" value={form.descripcion} onChange={onChange} required minLength={10} data-testid="input-descripcion" />
        <div className="grid sm:grid-cols-2 gap-3">
          <Select label="Categoria" name="id_categoria" value={form.id_categoria} onChange={onChange} placeholder="Selecciona" required
            options={cats.map((c) => ({ value: c.id_categoria, label: c.nombre_categoria }))} data-testid="select-categoria" />
          <Select label="Ciudad" name="id_ciudad" value={form.id_ciudad} onChange={onChange} placeholder="Selecciona" required
            options={ciudades.map((c) => ({ value: c.id_ciudad, label: c.nombre_ciudad }))} data-testid="select-ciudad" />
        </div>
        <Input label="Direccion" name="direccion" value={form.direccion} onChange={onChange} required data-testid="input-direccion" />
        <div className="grid sm:grid-cols-2 gap-3">
          <Input
            label="Fecha y hora"
            type="datetime-local"
            name="fecha_evento"
            value={form.fecha_evento}
            onChange={onChange}
            min={minFecha}
            required
            hint="Solo fechas presentes o futuras"
            data-testid="input-fecha"
          />
          <Input label="Cupos totales" type="number" min={1} name="cupos_totales" value={form.cupos_totales} onChange={onChange} required data-testid="input-cupos" />
        </div>
        <ImageUploader value={form.imagen_url} onChange={(v) => setForm((f) => ({ ...f, imagen_url: v }))} />

        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded p-3" data-testid="form-error">{error}</div>}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Cancelar</Button>
          <Button type="submit" loading={loading} data-testid="btn-publicar">Publicar</Button>
        </div>
      </form>
    </div>
  );
}
