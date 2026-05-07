import { Link, Navigate } from 'react-router-dom';
import { Users, Building2, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const ROL_HOME = {
  VOLUNTARIO: '/voluntario/buscar',
  ORGANIZACION: '/organizacion',
  ADMIN: '/admin',
};

export function Home() {
  const { usuario, cargando } = useAuth();
  if (cargando) return null;
  if (usuario) return <Navigate to={ROL_HOME[usuario.rol] || '/'} replace />;

  return (
    <div className="space-y-10">
      <section className="text-center max-w-2xl mx-auto pt-6">
        <h1 className="text-3xl sm:text-4xl font-semibold text-surface-900 tracking-tight">
          Conecta voluntarios con causas reales
        </h1>
        <p className="mt-3 text-surface-600">
          Plataforma centralizada de voluntariado en Colombia. Encuentra actividades cercanas,
          publica iniciativas y mide el impacto generado en tu comunidad.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <RolCard
          icon={Users}
          titulo="Soy voluntario"
          descripcion="Busca actividades por ciudad o categoria, inscribete en un clic y deja tu calificacion."
          href="/registro/voluntario"
          cta="Crear cuenta de voluntario"
          testId="card-voluntario"
        />
        <RolCard
          icon={Building2}
          titulo="Soy una organizacion"
          descripcion="Publica actividades, gestiona inscripciones y consulta cuantas horas aporta tu equipo."
          href="/registro/organizacion"
          cta="Registrar organizacion"
          testId="card-organizacion"
        />
        <RolCard
          icon={Shield}
          titulo="Soy administrador"
          descripcion="Verifica organizaciones, supervisa actividades y genera informes de impacto con apoyo de IA."
          href="/login"
          cta="Iniciar sesion"
          testId="card-admin"
        />
      </section>

      <section className="card p-6 max-w-3xl mx-auto">
        <p className="text-sm font-medium text-surface-700 mb-3">Cuentas de demostracion</p>
        <div className="grid sm:grid-cols-3 gap-3 text-xs text-surface-600">
          <DemoChip rol="Voluntario" email="voluntario@demo.com" pwd="Demo1234" />
          <DemoChip rol="Organizacion" email="org@demo.com" pwd="Demo1234" />
          <DemoChip rol="Administrador" email="admin@demo.com" pwd="Demo1234" />
        </div>
      </section>
    </div>
  );
}

function RolCard({ icon: Icon, titulo, descripcion, href, cta, testId }) {
  return (
    <div className="card p-6 flex flex-col" data-testid={testId}>
      <div className="w-10 h-10 rounded-md bg-primary-50 text-primary-700 flex items-center justify-center mb-4">
        <Icon size={20} />
      </div>
      <h3 className="text-lg font-semibold text-surface-900">{titulo}</h3>
      <p className="text-sm text-surface-600 mt-1 flex-1">{descripcion}</p>
      <Link to={href} className="btn btn-primary mt-4 self-start">
        {cta}
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}

function DemoChip({ rol, email, pwd }) {
  return (
    <div className="bg-surface-50 rounded p-3 border border-surface-200">
      <p className="font-medium text-surface-700">{rol}</p>
      <p className="font-mono">{email}</p>
      <p className="font-mono">{pwd}</p>
    </div>
  );
}
