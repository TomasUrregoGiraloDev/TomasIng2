import { useEffect, useState } from 'react';
import { Bell, Plus, Trash2 } from 'lucide-react';
import { admin, usuarios } from '../services/api.js';
import { Input } from '../components/Input.jsx';
import { Button } from '../components/Button.jsx';
import { EmptyState } from '../components/EmptyState.jsx';

// HU16 | RF-010 | E13 - AdminNotificaciones (CRUDL tabla transaccional NOTIFICACION)
export function AdminNotificaciones() {
  const [lista, setLista] = useState([]);
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ id_usuario: '', tipo: 'GENERAL', titulo: '', mensaje: '' });
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  const cargar = async () => {
    setLoading(true);
    try {
      const [notifs, users] = await Promise.all([
        admin.listarNotificaciones(),
        usuarios.listar(),
      ]);
      setLista(notifs);
      setListaUsuarios(users);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const abrirCrear = () => {
    setForm({ id_usuario: '', tipo: 'GENERAL', titulo: '', mensaje: '' });
    setError('');
    setModal(true);
  };

  const guardar = async () => {
    if (!form.id_usuario) { setError('Selecciona un destinatario'); return; }
    if (!form.titulo.trim()) { setError('El titulo es obligatorio'); return; }
    if (!form.mensaje.trim()) { setError('El mensaje es obligatorio'); return; }
    setGuardando(true);
    setError('');
    try {
      await admin.crearNotificacion({ ...form, id_usuario: Number(form.id_usuario) });
      setModal(false);
      cargar();
    } catch (e) {
      setError(e.message || 'Error al guardar');
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (id) => {
    if (!window.confirm('¿Eliminar esta notificacion?')) return;
    try {
      await admin.eliminarNotificacion(id);
      cargar();
    } catch (e) {
      alert(e.message || 'No se pudo eliminar');
    }
  };

  const TIPOS = ['GENERAL', 'INSCRIPCION_APROBADA', 'INSCRIPCION_RECHAZADA', 'MENSAJE_NUEVO', 'ORG_VERIFICADA'];

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-surface-900">Notificaciones</h1>
          <p className="text-sm text-surface-500">Gestiona las notificaciones del sistema (tabla NOTIFICACION — FK: id_usuario)</p>
        </div>
        <Button onClick={abrirCrear} data-testid="btn-nueva-notificacion">
          <Plus size={16} /> Nueva notificacion
        </Button>
      </header>

      {loading ? (
        <p className="text-sm text-surface-500">Cargando...</p>
      ) : lista.length === 0 ? (
        <EmptyState icon={Bell} titulo="Sin notificaciones" descripcion="Crea la primera notificacion para un usuario." />
      ) : (
        <table className="w-full text-sm border-collapse" data-testid="tabla-notificaciones">
          <thead>
            <tr className="border-b border-surface-200 text-left text-surface-500">
              <th className="py-2 pr-3 font-medium">Titulo</th>
              <th className="py-2 pr-3 font-medium">Tipo</th>
              <th className="py-2 pr-3 font-medium">Destinatario (id_usuario FK)</th>
              <th className="py-2 pr-3 font-medium">Leida</th>
              <th className="py-2 pr-3 font-medium">Fecha</th>
              <th className="py-2 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {lista.map((n) => (
              <tr key={n.id_notificacion} className="border-b border-surface-100 hover:bg-surface-50">
                <td className="py-2 pr-3 font-medium text-surface-900">{n.titulo}</td>
                <td className="py-2 pr-3 text-surface-500">{n.tipo}</td>
                <td className="py-2 pr-3 text-surface-500">
                  <span className="font-mono text-xs bg-surface-100 px-1 rounded">#{n.id_usuario}</span>
                  {' '}{n.usuario?.correo_electronico || ''}
                </td>
                <td className="py-2 pr-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${n.leido ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {n.leido ? 'Si' : 'No'}
                  </span>
                </td>
                <td className="py-2 pr-3 text-surface-400 text-xs">
                  {new Date(n.fecha_creacion).toLocaleDateString('es-CO')}
                </td>
                <td className="py-2 text-right">
                  <Button variant="secondary" onClick={() => eliminar(n.id_notificacion)} data-testid={`btn-eliminar-notif-${n.id_notificacion}`}>
                    <Trash2 size={14} /> Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" data-testid="modal-notificacion">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-semibold text-surface-900">Nueva notificacion</h2>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-surface-700">Destinatario (id_usuario) *</label>
              <select
                className="w-full border border-surface-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={form.id_usuario}
                onChange={(e) => setForm({ ...form, id_usuario: e.target.value })}
                data-testid="select-usuario-notif"
              >
                <option value="">Seleccionar usuario...</option>
                {listaUsuarios.map((u) => (
                  <option key={u.id_usuario} value={u.id_usuario}>
                    #{u.id_usuario} — {u.nombre} ({u.rol})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-surface-700">Tipo</label>
              <select
                className="w-full border border-surface-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value })}
              >
                {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <Input
              label="Titulo *"
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              data-testid="input-titulo-notif"
            />
            <Input
              label="Mensaje *"
              value={form.mensaje}
              onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
              data-testid="input-mensaje-notif"
            />

            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setModal(false)}>Cancelar</Button>
              <Button onClick={guardar} loading={guardando} data-testid="btn-guardar-notif">
                Crear
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
