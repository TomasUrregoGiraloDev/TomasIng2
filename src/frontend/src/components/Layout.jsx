import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useEffect, useState } from 'react';
import { Bell, LogOut, User, MessageSquare, Search, LayoutDashboard, FileText, ListChecks, Building2, BarChart3, Heart } from 'lucide-react';
import { notificaciones } from '../services/api.js';

const NAV_BY_ROL = {
  VOLUNTARIO: [
    { to: '/voluntario/buscar', label: 'Buscar actividades', icon: Search },
    { to: '/voluntario/mis-inscripciones', label: 'Mis inscripciones', icon: ListChecks },
    { to: '/mensajes', label: 'Mensajes', icon: MessageSquare },
  ],
  ORGANIZACION: [
    { to: '/organizacion', label: 'Resumen', icon: LayoutDashboard },
    { to: '/organizacion/actividades', label: 'Mis actividades', icon: FileText },
    { to: '/organizacion/inscripciones', label: 'Solicitudes', icon: ListChecks },
    { to: '/mensajes', label: 'Mensajes', icon: MessageSquare },
  ],
  ADMIN: [
    { to: '/admin', label: 'Resumen', icon: LayoutDashboard },
    { to: '/admin/organizaciones', label: 'Organizaciones', icon: Building2 },
    { to: '/admin/inscripciones', label: 'Solicitudes', icon: ListChecks },
    { to: '/admin/reportes', label: 'Reportes', icon: BarChart3 },
  ],
};

export function Layout({ children }) {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [conteoNotif, setConteoNotif] = useState(0);

  useEffect(() => {
    if (!usuario) return;
    notificaciones.listar()
      .then((lista) => setConteoNotif(lista.filter((n) => !n.leido).length))
      .catch(() => {});
  }, [usuario]);

  const nav = usuario ? NAV_BY_ROL[usuario.rol] || [] : [];

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-full flex flex-col bg-surface-50">
      <header className="bg-white border-b border-surface-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary-600 text-white flex items-center justify-center">
              <Heart size={16} />
            </div>
            <span className="font-semibold text-surface-900">Voluntariado Colombia</span>
          </NavLink>

          {usuario && (
            <nav className="hidden md:flex items-center gap-1">
              {nav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end
                  className={({ isActive }) => `inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? 'bg-primary-50 text-primary-700' : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
                  }`}
                >
                  <item.icon size={16} />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          )}

          {usuario ? (
            <div className="flex items-center gap-2">
              <NavLink
                to="/notificaciones"
                className="relative p-2 rounded-md text-surface-600 hover:text-surface-900 hover:bg-surface-100"
                aria-label="Notificaciones"
                data-testid="link-notificaciones"
              >
                <Bell size={18} />
                {conteoNotif > 0 && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-red-600 text-white text-[10px] font-semibold flex items-center justify-center">
                    {conteoNotif}
                  </span>
                )}
              </NavLink>
              <NavLink
                to="/perfil"
                className="p-2 rounded-md text-surface-600 hover:text-surface-900 hover:bg-surface-100"
                aria-label="Perfil"
              >
                <User size={18} />
              </NavLink>
              <button
                onClick={onLogout}
                className="p-2 rounded-md text-surface-600 hover:text-surface-900 hover:bg-surface-100"
                aria-label="Cerrar sesion"
                data-testid="btn-logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink to="/login" className="btn btn-secondary">Iniciar sesion</NavLink>
            </div>
          )}
        </div>
      </header>

      {usuario && (
        <nav className="md:hidden bg-white border-b border-surface-200 overflow-x-auto">
          <div className="flex gap-1 px-4 py-2">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end
                className={({ isActive }) => `inline-flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap ${
                  isActive ? 'bg-primary-50 text-primary-700' : 'text-surface-600'
                }`}
              >
                <item.icon size={14} />
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">{children}</div>
      </main>

      <footer className="border-t border-surface-200 bg-white mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 text-xs text-surface-500 flex justify-between">
          <span>Plataforma de voluntariado - Proyecto universitario</span>
          <span>v1.0.0</span>
        </div>
      </footer>
    </div>
  );
}
