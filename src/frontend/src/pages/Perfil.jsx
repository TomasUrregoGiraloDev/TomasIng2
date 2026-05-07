import { useEffect, useState } from 'react';
import { perfil as perfilApi, catalogos } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Button } from '../components/Button.jsx';
import { Input, Select, Textarea } from '../components/Input.jsx';

export function Perfil() {
  const { usuario, recargar } = useAuth();
  const [cargando, setCargando] = useState(true);
  const [datos, setDatos] = useState({});
  const [ciudades, setCiudades] = useState([]);
  const [ciudadId, setCiudadId] = useState('');
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    Promise.all([perfilApi.obtener(), catalogos.ciudades()]).then(([{ perfil, usuario: u }, cs]) => {
      setDatos(perfil || {});
      setCiudades(cs);
      setCiudadId(u?.id_ciudad || '');
      setCargando(false);
    });
  }, []);

  const onChange = (e) => setDatos({ ...datos, [e.target.name]: e.target.value });

  const guardar = async (e) => {
    e.preventDefault();
    setError(null);
    setExito(null);
    setGuardando(true);
    try {
      const payload = {};
      ['nombre', 'apellido', 'nombre_institucion', 'nit_registro', 'telefono', 'descripcion_org', 'intereses', 'nivel_acceso']
        .forEach((k) => { if (datos[k] !== undefined) payload[k] = datos[k]; });
      if (ciudadId) payload.id_ciudad = Number(ciudadId);
      await perfilApi.actualizar(payload);
      setExito('Cambios guardados correctamente');
      recargar();
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return <p className="text-sm text-surface-500">Cargando perfil...</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold text-surface-900 mb-4">Mi perfil</h1>
      <form onSubmit={guardar} className="card p-6 space-y-4" noValidate>
        <Input label="Correo" value={usuario.correo_electronico} disabled />

        {usuario.rol === 'VOLUNTARIO' && (
          <>
            <div className="grid sm:grid-cols-2 gap-3">
              <Input label="Nombre" name="nombre" value={datos.nombre || ''} onChange={onChange} required />
              <Input label="Apellido" name="apellido" value={datos.apellido || ''} onChange={onChange} required />
            </div>
            <Input label="Telefono" name="telefono" value={datos.telefono || ''} onChange={onChange} />
            <Textarea label="Intereses" name="intereses" value={datos.intereses || ''} onChange={onChange} placeholder="Ej: Medio Ambiente, Educacion" />
          </>
        )}

        {usuario.rol === 'ORGANIZACION' && (
          <>
            <Input label="Nombre institucion" name="nombre_institucion" value={datos.nombre_institucion || ''} onChange={onChange} required />
            <Input label="NIT" name="nit_registro" value={datos.nit_registro || ''} onChange={onChange} required />
            <Input label="Telefono" name="telefono" value={datos.telefono || ''} onChange={onChange} />
            <Textarea label="Descripcion" name="descripcion_org" value={datos.descripcion_org || ''} onChange={onChange} />
          </>
        )}

        {usuario.rol === 'ADMIN' && (
          <>
            <div className="grid sm:grid-cols-2 gap-3">
              <Input label="Nombre" name="nombre" value={datos.nombre || ''} onChange={onChange} required />
              <Input label="Apellido" name="apellido" value={datos.apellido || ''} onChange={onChange} required />
            </div>
            <Input label="Nivel de acceso" name="nivel_acceso" value={datos.nivel_acceso || ''} onChange={onChange} />
          </>
        )}

        <Select
          label="Ciudad"
          value={ciudadId}
          onChange={(e) => setCiudadId(e.target.value)}
          placeholder="Selecciona una ciudad"
          options={ciudades.map((c) => ({ value: c.id_ciudad, label: `${c.nombre_ciudad}, ${c.departamento}` }))}
        />

        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded p-3">{error}</div>}
        {exito && <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded p-3" data-testid="perfil-exito">{exito}</div>}

        <div className="flex justify-end">
          <Button type="submit" loading={guardando} data-testid="btn-guardar-perfil">Guardar cambios</Button>
        </div>
      </form>
    </div>
  );
}
