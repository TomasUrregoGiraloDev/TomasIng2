import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { admin } from '../services/api.js';
import { Button } from '../components/Button.jsx';

export function AdminReportes() {
  const [stats, setStats] = useState(null);
  const [reporte, setReporte] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { admin.estadisticas().then(setStats); }, []);

  const generar = async () => {
    setError(null);
    setLoading(true);
    try {
      setReporte(await admin.generarReporte());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const sinDatos = !stats || stats.total_actividades === 0;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold text-surface-900">Reportes con IA</h1>
        <p className="text-sm text-surface-500">Generamos un resumen ejecutivo a partir de las estadisticas reales de la plataforma usando Groq.</p>
      </header>

      {stats && (
        <section className="grid gap-3 sm:grid-cols-3">
          <KPI label="Actividades" value={stats.total_actividades} />
          <KPI label="Inscripciones" value={stats.total_inscripciones} />
          <KPI label="Asistencias" value={stats.total_asistencias} />
        </section>
      )}

      <div className="card p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-surface-900">Generar informe</h2>
            <p className="text-sm text-surface-500">Pulsa el boton para generar un resumen automatizado en menos de 10 segundos.</p>
          </div>
          <Button onClick={generar} loading={loading} disabled={sinDatos} data-testid="btn-generar-reporte">
            <Sparkles size={16} /> Generar reporte
          </Button>
        </div>
        {sinDatos && (
          <p className="text-xs text-surface-500 mt-3">No hay actividades registradas todavia, no se puede generar un informe.</p>
        )}

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded p-3" data-testid="reporte-error">
            {error}
          </div>
        )}

        {reporte && (
          <article className="mt-5 border border-surface-200 rounded p-4 bg-surface-50" data-testid="reporte-resultado">
            <p className="text-xs text-surface-500">Generado el {new Date(reporte.generado_en).toLocaleString('es-CO')} con {reporte.modelo}</p>
            <pre className="whitespace-pre-wrap text-sm text-surface-800 mt-3 font-sans leading-6">{reporte.informe}</pre>
          </article>
        )}
      </div>
    </div>
  );
}

function KPI({ label, value }) {
  return (
    <div className="card p-4">
      <p className="text-xs text-surface-500">{label}</p>
      <p className="text-2xl font-semibold text-surface-900 mt-1">{value}</p>
    </div>
  );
}
