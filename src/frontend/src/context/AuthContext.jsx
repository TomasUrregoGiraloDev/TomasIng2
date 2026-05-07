import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { auth } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  const cargarUsuario = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUsuario(null);
      setCargando(false);
      return;
    }
    try {
      const data = await auth.me();
      setUsuario(data);
    } catch {
      localStorage.removeItem('token');
      setUsuario(null);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { cargarUsuario(); }, [cargarUsuario]);

  const login = async (correo_electronico, contrasena) => {
    const data = await auth.login({ correo_electronico, contrasena });
    localStorage.setItem('token', data.token);
    await cargarUsuario();
    return data.usuario;
  };

  const registrarVoluntario = async (datos) => {
    const data = await auth.registrarVoluntario(datos);
    localStorage.setItem('token', data.token);
    await cargarUsuario();
    return data.usuario;
  };

  const registrarOrganizacion = async (datos) => {
    const data = await auth.registrarOrganizacion(datos);
    localStorage.setItem('token', data.token);
    await cargarUsuario();
    return data.usuario;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, cargando, login, logout, registrarVoluntario, registrarOrganizacion, recargar: cargarUsuario }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
