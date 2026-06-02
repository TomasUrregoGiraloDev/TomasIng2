import { useEffect, useState } from 'react';
import { Tag, Plus, Pencil, Trash2 } from 'lucide-react';
import { admin } from '../services/api.js';
import { Input } from '../components/Input.jsx';
import { Button } from '../components/Button.jsx';
import { EmptyState } from '../components/EmptyState.jsx';

// CU-MAESTRA | RF-006 | E13 - AdminCategorias (CRUDL tabla maestra CATEGORIA)
export function AdminCategorias() {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | { modo: 'crear'|'editar', item?: {} }
  const [form, setForm] = useState({ nombre_categoria: '', descripcion: '' });
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  const cargar = async () => {
    setLoading(true);
    try { setLista(await admin.listarCategorias()); }
    finally { setLoading(false); }
  };

  useEffect(() => { cargar(); }, []);

  const abrirCrear = () => {
    setForm({ nombre_categoria: '', descripcion: '' });
    setError('');
    setModal({ modo: 'crear' });
  };

  const abrirEditar = (item) => {
    setForm({ nombre_categoria: item.nombre_categoria, descripcion: item.descripcion || '' });
    setError('');
    setModal({ modo: 'editar', item });
  };

  const guardar = async () => {
    if (!form.nombre_categoria.trim()) { setError('El nombre es obligatorio'); return; }
    setGuardando(true);
    setError('');
    try {
      if (modal.modo === 'crear') {
        await admin.crearCategoria(form);
      } else {
        await admin.actualizarCategoria(modal.item.id_categoria, form);
      }
      setModal(null);
      cargar();
    } catch (e) {
      setError(e.message || 'Error al guardar');
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (id) => {
    if (!window.confirm('¿Eliminar esta categoria? Las actividades asociadas quedaran sin categoria.')) return;
    try {
      await admin.eliminarCategoria(id);
      cargar();
    } catch (e) {
      alert(e.message || 'No se pudo eliminar');
    }
  };

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-surface-900">Categorias</h1>
          <p className="text-sm text-surface-500">Gestiona las categorias disponibles para las actividades</p>
        </div>
        <Button onClick={abrirCrear} data-testid="btn-nueva-categoria">
          <Plus size={16} /> Nueva categoria
        </Button>
      </header>

      {loading ? (
        <p className="text-sm text-surface-500">Cargando...</p>
      ) : lista.length === 0 ? (
        <EmptyState icon={Tag} titulo="Sin categorias" descripcion="Crea la primera categoria para que las organizaciones puedan clasificar sus actividades." />
      ) : (
        <table className="w-full text-sm border-collapse" data-testid="tabla-categorias">
          <thead>
            <tr className="border-b border-surface-200 text-left text-surface-500">
              <th className="py-2 pr-4 font-medium">Nombre</th>
              <th className="py-2 pr-4 font-medium">Descripcion</th>
              <th className="py-2 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {lista.map((cat) => (
              <tr key={cat.id_categoria} className="border-b border-surface-100 hover:bg-surface-50">
                <td className="py-2 pr-4 font-medium text-surface-900">{cat.nombre_categoria}</td>
                <td className="py-2 pr-4 text-surface-500">{cat.descripcion || '—'}</td>
                <td className="py-2 text-right space-x-2">
                  <Button variant="secondary" onClick={() => abrirEditar(cat)} data-testid={`btn-editar-${cat.id_categoria}`}>
                    <Pencil size={14} /> Editar
                  </Button>
                  <Button variant="secondary" onClick={() => eliminar(cat.id_categoria)} data-testid={`btn-eliminar-${cat.id_categoria}`}>
                    <Trash2 size={14} /> Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" data-testid="modal-categoria">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-semibold text-surface-900">
              {modal.modo === 'crear' ? 'Nueva categoria' : 'Editar categoria'}
            </h2>
            <Input
              label="Nombre *"
              value={form.nombre_categoria}
              onChange={(e) => setForm({ ...form, nombre_categoria: e.target.value })}
              data-testid="input-nombre-categoria"
            />
            <Input
              label="Descripcion"
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              data-testid="input-descripcion-categoria"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setModal(null)}>Cancelar</Button>
              <Button onClick={guardar} loading={guardando} data-testid="btn-guardar-categoria">
                {modal.modo === 'crear' ? 'Crear' : 'Guardar'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
