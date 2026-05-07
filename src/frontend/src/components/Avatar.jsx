import { iniciales, colorPorTexto } from '../utils/format.js';

export function Avatar({ nombre = '', size = 40 }) {
  const bg = colorPorTexto(nombre);
  return (
    <div
      className="rounded-full text-white flex items-center justify-center font-medium select-none"
      style={{ width: size, height: size, background: bg, fontSize: size * 0.4 }}
      aria-hidden="true"
    >
      {iniciales(nombre) || '?'}
    </div>
  );
}

export function ImagePlaceholder({ texto, className = '' }) {
  const bg = colorPorTexto(texto || 'A');
  return (
    <div
      className={`flex items-center justify-center text-white font-semibold ${className}`}
      style={{ background: `linear-gradient(135deg, ${bg}, ${bg}cc)` }}
    >
      <span className="text-base opacity-90">{iniciales(texto)}</span>
    </div>
  );
}
