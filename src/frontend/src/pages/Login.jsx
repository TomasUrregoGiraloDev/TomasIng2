import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Button } from '../components/Button.jsx';
import { Input } from '../components/Input.jsx';

const ROL_HOME = {
  VOLUNTARIO: '/voluntario/buscar',
  ORGANIZACION: '/organizacion',
  ADMIN: '/admin',
};

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ correo_electronico: '', contrasena: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const usuario = await login(form.correo_electronico, form.contrasena);
      const destino = location.state?.from?.pathname || ROL_HOME[usuario.rol] || '/';
      navigate(destino, { replace: true });
    } catch (err) {
      setError(err.message || 'Credenciales invalidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <div className="card p-6">
        <h1 className="text-xl font-semibold text-surface-900">Iniciar sesion</h1>
        <p className="text-sm text-surface-500 mt-1">Ingresa con tu correo y contraseña</p>

        <form onSubmit={onSubmit} className="space-y-4 mt-6" noValidate>
          <Input
            label="Correo electronico"
            type="email"
            name="correo_electronico"
            value={form.correo_electronico}
            onChange={onChange}
            required
            autoComplete="email"
            data-testid="input-email"
          />
          <Input
            label="Contraseña"
            type="password"
            name="contrasena"
            value={form.contrasena}
            onChange={onChange}
            required
            autoComplete="current-password"
            data-testid="input-password"
          />
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded p-3" data-testid="login-error">
              {error}
            </div>
          )}
          <Button type="submit" loading={loading} className="w-full" data-testid="btn-submit-login">
            Entrar
          </Button>
        </form>

        <p className="text-sm text-surface-600 mt-6 text-center">
          ¿No tienes cuenta?{' '}
          <Link to="/registro/voluntario" className="text-primary-700 font-medium hover:underline">Registrate como voluntario</Link>
          {' '}o{' '}
          <Link to="/registro/organizacion" className="text-primary-700 font-medium hover:underline">como organizacion</Link>
        </p>
      </div>
    </div>
  );
}
