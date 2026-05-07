import { useEffect, useMemo, useState } from 'react';
import { Search, Building2, Check, Ban } from 'lucide-react';
import { admin } from '../services/api.js';
import { Input, Select } from '../components/Input.jsx';
import { Button } from '../components/Button.jsx';
import { Badge } from '../components/Badge.jsx';
import { Avatar } from '../components/Avatar.jsx';
import { EmptyState } from '../components/EmptyState.jsx';

export function AdminOrganizaciones() {
  const [filtros, setFiltros] = useState({ q: '', estado: '' });
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargar = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filtros.q) params.q = filtros.q;
      if (filtros.estado) params.estado = filtros.estado;
      setLista(await admin.organizaciones(params));
    } finally { setLoading(false); }
  };

  useEffect(() => { cargar(); }, [filtros.estado]); // eslint-disable-line

  const totales = useMemo(() => ({
    total: lista.length,
    verificadas: lista.filter((o) => o.estado_verificacion === 'VERIFICADA').length,
    pendientes: lista.filter((o) => o.estado_verificacion === 'PENDIENTE').length,
    suspendidas: lista.filter((o) => o.estado_verificacion === 'SUSPENDIDA').length,
  }), [lista]);

  const cambiar = async (id, estado_verificacion) => {
    await admin.cambiarEstadoOrg(id, estado_verificacion);
    cargar();
  };

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-xl font-semibold text-surface-900">Organizaciones</h1>
        <p className="text-sm text-surface-500">Verifica y supervisa las entidades registradas en la plataforma</p>
      </header>

      <section className="grid gap-3 sm:grid-cols-4">
        <KPI label="Total" value={totales.total} />
        <KPI label="Verificadas" value={totales.verificadas} cls="badge-success" />
        <KPI label="Pendientes" value={totales.pendientes} cls="badge-warning" />
        <KPI label="Suspendidas" value={totales.suspendidas} cls="badge-danger" />
      </section>

      <div className="card p-4 grid gap-3 md:grid-cols-[1fr_220px_auto] items-end">
        <Input
          label="Buscar"
          placeholder="Nombre de la organizacion"
          value={filtros.q}
          onChange={(e) => setFiltros({ ...filtros, q: e.target.value })}
          data-testid="input-buscar-org"
        />
        <Select
          label="Estado"
          value={filtros.estado}
          onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
          placeholder="Todos los estados"
          options={[
            { value: 'PENDIENTE', label: 'Pendientes' },
            { value: 'VERIFICADA', label: 'Verificadas' },
            { value: 'SUSPENDIDA', label: 'Suspendidas' },
          ]}
        />
        <Button onClick={cargar} loading={loading} data-testid="btn-buscar-org"><Search size={16} /> Buscar</Button>
      </div>

      {loading ? (
        <p className="text-sm text-surface-500">Cargando...</p>
      ) : lista.length === 0 ? (
        <EmptyState icon={Building2} titulo="Sin resultados" descripcion="Ajusta el filtro o limpia la busqueda." />
      ) : (
        <ul className="space-y-2" data-testid="lista-organizaciones">
          {lista.map((o) => (
            <li key={o.id_organizacion} className="card p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <Avatar nombre={o.nombre_institucion} />
                <div className="min-w-0">
                  <p className="font-medium text-surface-900">{o.nombre_institucion}</p>
                  <p className="text-xs text-surface-500">NIT {o.nit_registro}</p>
                  <p className="text-xs text-surface-400">{o.usuario?.correo_electronico}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge value={o.estado_verificacion} kind="verificacion" />
                <span className="text-xs text-surface-500">{o.total_actividades} actividades</span>
                {o.estado_verificacion !== 'VERIFICADA' && (
                  <Button onClick={() => cambiar(o.id_organizacion, 'VERIFICADA')} data-testid={`btn-verificar-${o.id_organizacion}`}>
                    <Check size={14} /> Verificar
                  </Button>
                )}
                {o.estado_verificacion !== 'SUSPENDIDA' && (
                  <Button variant="secondary" onClick={() => cambiar(o.id_organizacion, 'SUSPENDIDA')}>
                    <Ban size={14} /> Suspender
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function KPI({ label, value }) {
  return (
    <div className="card p-3">
      <p className="text-xs text-surface-500">{label}</p>
      <p className="text-lg font-semibold text-surface-900">{value}</p>
    </div>
  );
}
