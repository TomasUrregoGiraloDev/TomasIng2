import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';
import { formatearFechaCorta } from '../utils/format.js';
import { ImagePlaceholder } from './Avatar.jsx';
import { Badge } from './Badge.jsx';

export function ActivityCard({ actividad, to }) {
  const { titulo, fecha_evento, ciudad, categoria, cupos_totales, cupos_disponibles, organizacion, imagen_url, estado_actividad } = actividad;
  const inscritos = cupos_totales - cupos_disponibles;
  return (
    <Link to={to || `/voluntario/actividad/${actividad.id_actividad}`} className="card overflow-hidden hover:shadow-md transition-shadow block" data-testid={`card-actividad-${actividad.id_actividad}`}>
      {imagen_url ? (
        <img src={imagen_url} alt={titulo} className="h-40 w-full object-cover" loading="lazy" />
      ) : (
        <ImagePlaceholder texto={titulo} className="h-40 w-full" />
      )}
      <div className="p-4">
        <div className="flex items-center gap-3 text-xs text-surface-500 mb-2">
          <span className="inline-flex items-center gap-1"><Calendar size={12} /> {formatearFechaCorta(fecha_evento)}</span>
          <span className="inline-flex items-center gap-1"><MapPin size={12} /> {ciudad?.nombre_ciudad || ''}</span>
        </div>
        <h3 className="font-semibold text-surface-900 leading-snug">{titulo}</h3>
        {organizacion?.nombre_institucion && (
          <p className="text-sm text-surface-500 mt-0.5">{organizacion.nombre_institucion}</p>
        )}
        <div className="flex items-center justify-between mt-3">
          <Badge>{categoria?.nombre_categoria || 'General'}</Badge>
          <span className="inline-flex items-center gap-1 text-xs text-surface-500">
            <Users size={12} /> {inscritos}/{cupos_totales}
          </span>
        </div>
        {estado_actividad === 'CANCELADA' && (
          <div className="mt-2"><Badge value="CANCELADA" kind="actividad" /></div>
        )}
      </div>
    </Link>
  );
}
