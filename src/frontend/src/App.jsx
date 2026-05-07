import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { Layout } from './components/Layout.jsx';
import { ProtectedRoute } from './routes/ProtectedRoute.jsx';

import { Home } from './pages/Home.jsx';
import { Login } from './pages/Login.jsx';
import { RegistroVoluntario } from './pages/RegistroVoluntario.jsx';
import { RegistroOrganizacion } from './pages/RegistroOrganizacion.jsx';

import { VolBuscarActividades } from './pages/VolBuscarActividades.jsx';
import { VolDetalleActividad } from './pages/VolDetalleActividad.jsx';
import { VolMisInscripciones } from './pages/VolMisInscripciones.jsx';

import { OrgDashboard } from './pages/OrgDashboard.jsx';
import { OrgMisActividades } from './pages/OrgMisActividades.jsx';
import { OrgPublicarActividad } from './pages/OrgPublicarActividad.jsx';
import { OrgEditarActividad } from './pages/OrgEditarActividad.jsx';
import { OrgInscripciones } from './pages/OrgInscripciones.jsx';

import { AdminDashboard } from './pages/AdminDashboard.jsx';
import { AdminOrganizaciones } from './pages/AdminOrganizaciones.jsx';
import { AdminInscripciones } from './pages/AdminInscripciones.jsx';
import { AdminReportes } from './pages/AdminReportes.jsx';

import { Mensajes } from './pages/Mensajes.jsx';
import { Notificaciones } from './pages/Notificaciones.jsx';
import { Perfil } from './pages/Perfil.jsx';

export default function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro/voluntario" element={<RegistroVoluntario />} />
          <Route path="/registro/organizacion" element={<RegistroOrganizacion />} />

          <Route path="/voluntario/buscar" element={<ProtectedRoute roles={['VOLUNTARIO']}><VolBuscarActividades /></ProtectedRoute>} />
          <Route path="/voluntario/actividad/:id" element={<ProtectedRoute roles={['VOLUNTARIO']}><VolDetalleActividad /></ProtectedRoute>} />
          <Route path="/voluntario/mis-inscripciones" element={<ProtectedRoute roles={['VOLUNTARIO']}><VolMisInscripciones /></ProtectedRoute>} />

          <Route path="/organizacion" element={<ProtectedRoute roles={['ORGANIZACION']}><OrgDashboard /></ProtectedRoute>} />
          <Route path="/organizacion/actividades" element={<ProtectedRoute roles={['ORGANIZACION']}><OrgMisActividades /></ProtectedRoute>} />
          <Route path="/organizacion/publicar" element={<ProtectedRoute roles={['ORGANIZACION']}><OrgPublicarActividad /></ProtectedRoute>} />
          <Route path="/organizacion/actividad/:id/editar" element={<ProtectedRoute roles={['ORGANIZACION']}><OrgEditarActividad /></ProtectedRoute>} />
          <Route path="/organizacion/inscripciones" element={<ProtectedRoute roles={['ORGANIZACION']}><OrgInscripciones /></ProtectedRoute>} />

          <Route path="/admin" element={<ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/organizaciones" element={<ProtectedRoute roles={['ADMIN']}><AdminOrganizaciones /></ProtectedRoute>} />
          <Route path="/admin/inscripciones" element={<ProtectedRoute roles={['ADMIN']}><AdminInscripciones /></ProtectedRoute>} />
          <Route path="/admin/reportes" element={<ProtectedRoute roles={['ADMIN']}><AdminReportes /></ProtectedRoute>} />

          <Route path="/mensajes" element={<ProtectedRoute><Mensajes /></ProtectedRoute>} />
          <Route path="/notificaciones" element={<ProtectedRoute><Notificaciones /></ProtectedRoute>} />
          <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
}
