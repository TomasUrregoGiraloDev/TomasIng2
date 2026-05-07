import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Button } from '../components/Button.jsx';
import { Input, Select } from '../components/Input.jsx';
import { catalogos } from '../services/api.js';

export function RegistroVoluntario() {
  const { registrarVoluntario } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '', apellido: '', correo_electronico: '', contrasena: '', telefono: '', id_ciudad: '', intereses: '',
  });
  const [ciudades, setCiudades] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { catalogos.ciudades().then(setCiudades); }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await registrarVoluntario({
        ...form,
        id_ciudad: form.id_ciudad ? Number(form.id_ciudad) : undefined,
      });
      navigate('/voluntario/buscar', { replace: true });
    } catch (err) {
      setError(err.message || 'No se pudo registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-8">
      <div className="card p-6">
        <h1 className="text-xl font-semibold text-surface-900">Crear cuenta de voluntario</h1>
        <p className="text-sm text-surface-500 mt-1">Toma menos de un minuto</p>

        <form onSubmit={onSubmit} className="space-y-4 mt-6" noValidate>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Nombre" name="nombre" value={form.nombre} onChange={onChange} required minLength={2} data-testid="input-nombre" />
            <Input label="Apellido" name="apellido" value={form.apellido} onChange={onChange} required minLength={2} data-testid="input-apellido" />
          </div>
          <Input label="Correo electronico" type="email" name="correo_electronico" value={form.correo_electronico} onChange={onChange} required data-testid="input-email" />
          <Input label="Contraseña" type="password" name="contrasena" value={form.contrasena} onChange={onChange} required minLength={8} hint="Minimo 8 caracteres" data-testid="input-password" />
          <Input label="Telefono" name="telefono" value={form.telefono} onChange={onChange} />
          <Select
            label="Ciudad"
            name="id_ciudad"
            value={form.id_ciudad}
            onChange={onChange}
            placeholder="Selecciona una ciudad"
            options={ciudades.map((c) => ({ value: c.id_ciudad, label: `${c.nombre_ciudad}, ${c.departamento}` }))}
          />
          <Input label="Intereses" name="intereses" value={form.intereses} onChange={onChange} placeholder="Ej: Medio Ambiente, Educacion" hint="Separa por comas" />
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded p-3" data-testid="form-error">{error}</div>
          )}
          <Button type="submit" loading={loading} className="w-full" data-testid="btn-submit-registro">
            Crear cuenta
          </Button>
        </form>

        <p className="text-sm text-surface-600 mt-6 text-center">
          ¿Ya tienes cuenta? <Link to="/login" className="text-primary-700 font-medium hover:underline">Iniciar sesion</Link>
        </p>
      </div>
    </div>
  );
}
