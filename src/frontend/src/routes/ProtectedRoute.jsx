import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function ProtectedRoute({ roles, children }) {
  const { usuario, cargando } = useAuth();
  const location = useLocation();

  if (cargando) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-sm text-surface-500">
        Cargando sesion...
      </div>
    );
  }
  if (!usuario) return <Navigate to="/login" state={{ from: location }} replace />;
  if (roles && !roles.includes(usuario.rol)) {
    return <Navigate to="/" replace />;
  }
  return children;
}
