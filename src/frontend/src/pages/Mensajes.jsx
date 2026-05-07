import { useEffect, useState, useRef } from 'react';
import { Send, MessageSquare, Search } from 'lucide-react';
import { mensajes as mensajesApi, usuarios } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Avatar } from '../components/Avatar.jsx';
import { Button } from '../components/Button.jsx';
import { Input } from '../components/Input.jsx';
import { EmptyState } from '../components/EmptyState.jsx';
import { formatearHora, formatearFechaCorta } from '../utils/format.js';

export function Mensajes() {
  const { usuario } = useAuth();
  const [conversaciones, setConversaciones] = useState([]);
  const [seleccionada, setSeleccionada] = useState(null);
  const [hilo, setHilo] = useState([]);
  const [borrador, setBorrador] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [destinatarios, setDestinatarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const finRef = useRef(null);

  const cargarConversaciones = () => mensajesApi.listarConversaciones().then(setConversaciones);

  useEffect(() => { cargarConversaciones(); }, []);

  useEffect(() => {
    if (!seleccionada) return;
    mensajesApi.conversacion(seleccionada.id_usuario).then((d) => {
      setHilo(d);
      setTimeout(() => finRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    });
  }, [seleccionada]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (busqueda.trim().length > 1) usuarios.listar({ q: busqueda }).then(setDestinatarios);
      else setDestinatarios([]);
    }, 250);
    return () => clearTimeout(t);
  }, [busqueda]);

  const enviar = async (e) => {
    e.preventDefault();
    if (!borrador.trim() || !seleccionada) return;
    setLoading(true);
    try {
      await mensajesApi.enviar({
        id_usuario_destinatario: seleccionada.id_usuario,
        contenido: borrador.trim(),
      });
      setBorrador('');
      const d = await mensajesApi.conversacion(seleccionada.id_usuario);
      setHilo(d);
      cargarConversaciones();
      setTimeout(() => finRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-[280px_1fr] gap-4 h-[calc(100vh-180px)]">
      <aside className="card p-3 flex flex-col min-h-0">
        <Input
          placeholder="Nuevo mensaje a..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          data-testid="input-buscar-destinatario"
        />
        {destinatarios.length > 0 && (
          <ul className="mt-2 border border-surface-200 rounded divide-y divide-surface-100 max-h-40 overflow-y-auto" data-testid="lista-destinatarios">
            {destinatarios.map((u) => (
              <li key={u.id_usuario}>
                <button
                  className="w-full text-left p-2 hover:bg-surface-50 flex items-center gap-2"
                  onClick={() => {
                    setSeleccionada({ id_usuario: u.id_usuario, nombre: u.nombre });
                    setBusqueda('');
                    setDestinatarios([]);
                  }}
                >
                  <Avatar nombre={u.nombre} size={28} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-surface-900 line-clamp-1">{u.nombre}</p>
                    <p className="text-xs text-surface-500">{u.rol}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-3 flex-1 overflow-y-auto -mx-3 px-1">
          {conversaciones.length === 0 ? (
            <p className="text-xs text-surface-500 px-2 py-4">Sin conversaciones todavia.</p>
          ) : (
            <ul className="space-y-1" data-testid="lista-conversaciones">
              {conversaciones.map((c) => (
                <li key={c.contraparte.id_usuario}>
                  <button
                    onClick={() => setSeleccionada(c.contraparte)}
                    className={`w-full text-left px-2 py-2 rounded flex items-center gap-2 ${
                      seleccionada?.id_usuario === c.contraparte.id_usuario ? 'bg-primary-50' : 'hover:bg-surface-50'
                    }`}
                  >
                    <Avatar nombre={c.contraparte.correo_electronico || 'U'} size={32} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-sm font-medium text-surface-900 truncate">{c.contraparte.correo_electronico}</p>
                        <span className="text-[10px] text-surface-400">{formatearFechaCorta(c.ultimo.fecha_envio)}</span>
                      </div>
                      <p className="text-xs text-surface-500 truncate">{c.ultimo.contenido}</p>
                    </div>
                    {c.no_leidos > 0 && (
                      <span className="text-[10px] bg-primary-600 text-white rounded-full min-w-[18px] h-4 px-1 flex items-center justify-center">{c.no_leidos}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      <section className="card flex flex-col min-h-0">
        {!seleccionada ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState icon={MessageSquare} titulo="Selecciona una conversacion" descripcion="O busca un destinatario nuevo en la izquierda." />
          </div>
        ) : (
          <>
            <header className="px-4 py-3 border-b border-surface-200 flex items-center gap-3">
              <Avatar nombre={seleccionada.correo_electronico || seleccionada.nombre || 'U'} size={32} />
              <div>
                <p className="text-sm font-medium text-surface-900">{seleccionada.correo_electronico || seleccionada.nombre}</p>
              </div>
            </header>
            <div className="flex-1 overflow-y-auto p-4 space-y-2" data-testid="hilo-mensajes">
              {hilo.map((m) => {
                const propio = m.id_usuario_remitente === usuario.id_usuario;
                return (
                  <div key={m.id_mensaje} className={`flex ${propio ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs sm:max-w-sm rounded-lg px-3 py-2 text-sm ${propio ? 'bg-primary-600 text-white' : 'bg-surface-100 text-surface-800'}`}>
                      <p className="whitespace-pre-wrap break-words">{m.contenido}</p>
                      <p className={`text-[10px] mt-1 ${propio ? 'text-primary-100' : 'text-surface-500'}`}>{formatearHora(m.fecha_envio)}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={finRef} />
            </div>
            <form onSubmit={enviar} className="p-3 border-t border-surface-200 flex items-end gap-2">
              <textarea
                className="input flex-1 min-h-[42px] max-h-32"
                rows={1}
                placeholder="Escribe un mensaje"
                value={borrador}
                onChange={(e) => setBorrador(e.target.value)}
                data-testid="input-mensaje"
              />
              <Button type="submit" loading={loading} data-testid="btn-enviar"><Send size={16} /></Button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
