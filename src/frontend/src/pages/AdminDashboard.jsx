import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Users, FileText, ListChecks, BarChart3 } from 'lucide-react';
import { admin } from '../services/api.js';

export function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => { admin.estadisticas().then(setStats); }, []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold text-surface-900">Panel de administracion</h1>
        <p className="text-sm text-surface-500">Resumen general del estado de la plataforma</p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KPI icon={Building2} label="Organizaciones" value={stats?.total_organizaciones ?? '-'} />
        <KPI icon={Users} label="Voluntarios" value={stats?.total_voluntarios ?? '-'} />
        <KPI icon={FileText} label="Actividades" value={stats?.total_actividades ?? '-'} />
        <KPI icon={ListChecks} label="Inscripciones" value={stats?.total_inscripciones ?? '-'} />
      </section>

      <section className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-surface-900">Actividades por categoria</h2>
        </div>
        {stats?.actividades_por_categoria?.length ? (
          <ul className="divide-y divide-surface-200">
            {stats.actividades_por_categoria.map((c) => (
              <li key={c.categoria} className="py-2 flex items-center justify-between text-sm">
                <span className="text-surface-700">{c.categoria}</span>
                <span className="font-medium text-surface-900">{c.total}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-surface-500">Sin datos todavia.</p>
        )}
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <Link to="/admin/organizaciones" className="card p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
          <Building2 className="text-primary-600" />
          <div>
            <p className="font-medium text-surface-900">Verificar organizaciones</p>
            <p className="text-xs text-surface-500">Aprueba nuevas entidades</p>
          </div>
        </Link>
        <Link to="/admin/reportes" className="card p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
          <BarChart3 className="text-primary-600" />
          <div>
            <p className="font-medium text-surface-900">Generar reporte con IA</p>
            <p className="text-xs text-surface-500">Resumen ejecutivo automatizado</p>
          </div>
        </Link>
      </section>
    </div>
  );
}

function KPI({ icon: Icon, label, value }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-md bg-primary-50 text-primary-700 flex items-center justify-center">
          <Icon size={18} />
        </div>
        <div>
          <p className="text-xs text-surface-500">{label}</p>
          <p className="text-xl font-semibold text-surface-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
