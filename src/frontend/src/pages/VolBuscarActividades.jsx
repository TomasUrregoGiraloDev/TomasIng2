import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { actividades, catalogos } from '../services/api.js';
import { Input, Select } from '../components/Input.jsx';
import { Button } from '../components/Button.jsx';
import { ActivityCard } from '../components/ActivityCard.jsx';
import { ActivityCardSkeleton } from '../components/Skeleton.jsx';
import { EmptyState } from '../components/EmptyState.jsx';

export function VolBuscarActividades() {
  const [filtros, setFiltros] = useState({ q: '', id_categoria: '', id_ciudad: '', fecha: '' });
  const [categorias, setCategorias] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([catalogos.categorias(), catalogos.ciudades()]).then(([cats, cs]) => {
      setCategorias(cats);
      setCiudades(cs);
    });
  }, []);

  useEffect(() => { buscar(); /* primera carga */ }, []); // eslint-disable-line

  const buscar = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const params = {};
      if (filtros.q) params.q = filtros.q;
      if (filtros.id_categoria) params.id_categoria = filtros.id_categoria;
      if (filtros.id_ciudad) params.id_ciudad = filtros.id_ciudad;
      if (filtros.fecha) params.fecha = filtros.fecha;
      const data = await actividades.listar(params);
      setLista(data);
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => setFiltros({ ...filtros, [e.target.name]: e.target.value });

  return (
    <div className="space-y-6">
      <div className="card p-4">
        <form onSubmit={buscar} className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
          <Input
            label="¿Que te gustaria hacer?"
            name="q"
            value={filtros.q}
            onChange={onChange}
            placeholder="Ej: reforestacion, educacion ambiental"
            data-testid="input-busqueda"
          />
          <Button type="submit" loading={loading} data-testid="btn-buscar">
            <Search size={16} /> Buscar
          </Button>
        </form>
        <div className="grid gap-3 md:grid-cols-3 mt-3">
          <Select
            label="Categoria"
            name="id_categoria"
            value={filtros.id_categoria}
            onChange={onChange}
            placeholder="Todas las categorias"
            options={categorias.map((c) => ({ value: c.id_categoria, label: c.nombre_categoria }))}
            data-testid="select-categoria"
          />
          <Select
            label="Ciudad"
            name="id_ciudad"
            value={filtros.id_ciudad}
            onChange={onChange}
            placeholder="Todas las ciudades"
            options={ciudades.map((c) => ({ value: c.id_ciudad, label: c.nombre_ciudad }))}
            data-testid="select-ciudad"
          />
          <Input label="Fecha" name="fecha" type="date" value={filtros.fecha} onChange={onChange} data-testid="input-fecha" />
        </div>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-surface-900 mb-3">Actividades cerca de ti</h2>
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ActivityCardSkeleton /><ActivityCardSkeleton /><ActivityCardSkeleton />
          </div>
        ) : lista.length === 0 ? (
          <EmptyState
            icon={Search}
            titulo="No encontramos actividades"
            descripcion="Intenta cambiar los filtros o limpia la busqueda para ver todo el catalogo."
            accion={<Button variant="secondary" onClick={() => { setFiltros({ q: '', id_categoria: '', id_ciudad: '', fecha: '' }); setTimeout(buscar, 0); }}>Limpiar filtros</Button>}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="lista-actividades">
            {lista.map((a) => <ActivityCard key={a.id_actividad} actividad={a} />)}
          </div>
        )}
      </section>
    </div>
  );
}
