import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, Users, CheckCircle2 } from 'lucide-react';
import { actividades, inscripciones, perfil as perfilApi } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Badge } from '../components/Badge.jsx';
import { ActivityCard } from '../components/ActivityCard.jsx';

export function OrgDashboard() {
  const { usuario } = useAuth();
  const [perfil, setPerfil] = useState(null);
  const [acts, setActs] = useState([]);
  const [ins, setIns] = useState([]);

  useEffect(() => {
    perfilApi.obtener().then((d) => setPerfil(d.perfil));
    inscripciones.listar().then(setIns);
  }, []);

  useEffect(() => {
    if (perfil?.id_organizacion) {
      actividades.listar({ id_organizacion: perfil.id_organizacion, todas: true }).then(setActs);
    }
  }, [perfil]);

  const verificada = perfil?.estado_verificacion === 'VERIFICADA';
  const pendientes = ins.filter((i) => i.estado_solicitud === 'PENDIENTE').length;
  const aprobadas = ins.filter((i) => i.estado_solicitud === 'APROBADA' || i.estado_solicitud === 'ASISTIO').length;
  const horas = ins.filter((i) => i.estado_solicitud === 'ASISTIO').reduce((s, i) => s + (i.horas_acreditadas || 0), 0);

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold text-surface-900">{perfil?.nombre_institucion || usuario?.correo_electronico}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge value={perfil?.estado_verificacion || 'PENDIENTE'} kind="verificacion" />
            <span className="text-xs text-surface-500">NIT {perfil?.nit_registro}</span>
          </div>
        </div>
        {verificada ? (
          <Link to="/organizacion/publicar" className="btn btn-primary" data-testid="btn-publicar">
            <Plus size={16} /> Publicar actividad
          </Link>
        ) : null}
      </header>

      {!verificada && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded p-3" data-testid="banner-no-verificada">
          Tu organizacion aun no ha sido verificada. Cuando un administrador la apruebe podras publicar actividades.
        </div>
      )}

      <section className="grid gap-3 sm:grid-cols-3">
        <KPI icon={FileText} label="Actividades" value={acts.length} />
        <KPI icon={Users} label="Inscritos aprobados" value={aprobadas} />
        <KPI icon={CheckCircle2} label="Horas acreditadas" value={horas} />
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-surface-900">Tus actividades recientes</h2>
          <Link to="/organizacion/actividades" className="text-sm text-primary-700 hover:underline">Ver todas</Link>
        </div>
        {acts.length === 0 ? (
          <p className="text-sm text-surface-500">No has publicado actividades todavia.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {acts.slice(0, 3).map((a) => (
              <ActivityCard key={a.id_actividad} actividad={a} to={`/voluntario/actividad/${a.id_actividad}`} />
            ))}
          </div>
        )}
      </section>

      {pendientes > 0 && (
        <section className="card p-4 flex items-center justify-between">
          <p className="text-sm text-surface-700">Tienes <strong>{pendientes}</strong> solicitudes pendientes de revision.</p>
          <Link to="/organizacion/inscripciones" className="btn btn-secondary">Ver solicitudes</Link>
        </section>
      )}
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
