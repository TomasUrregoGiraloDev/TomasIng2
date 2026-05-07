import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (error) => {
    const message = error.response?.data?.error || error.message || 'Error de red';
    const details = error.response?.data?.details;
    return Promise.reject({ message, details, status: error.response?.status });
  },
);

// Auth
export const auth = {
  registrarVoluntario: (data) => api.post('/auth/register/voluntario', data).then((r) => r.data),
  registrarOrganizacion: (data) => api.post('/auth/register/organizacion', data).then((r) => r.data),
  login: (data) => api.post('/auth/login', data).then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data),
};

export const perfil = {
  obtener: () => api.get('/perfil').then((r) => r.data),
  actualizar: (data) => api.put('/perfil', data).then((r) => r.data),
};

export const catalogos = {
  ciudades: () => api.get('/catalogos/ciudades').then((r) => r.data),
  categorias: () => api.get('/catalogos/categorias').then((r) => r.data),
  estadosActividad: () => api.get('/catalogos/estados-actividad').then((r) => r.data),
};

export const actividades = {
  listar: (params) => api.get('/actividades', { params }).then((r) => r.data),
  obtener: (id) => api.get(`/actividades/${id}`).then((r) => r.data),
  crear: (data) => api.post('/actividades', data).then((r) => r.data),
  actualizar: (id, data) => api.put(`/actividades/${id}`, data).then((r) => r.data),
  cancelar: (id) => api.post(`/actividades/${id}/cancelar`).then((r) => r.data),
  eliminar: (id) => api.delete(`/actividades/${id}`).then((r) => r.data),
};

export const inscripciones = {
  listar: (params) => api.get('/inscripciones', { params }).then((r) => r.data),
  crear: (data) => api.post('/inscripciones', data).then((r) => r.data),
  cambiarEstado: (id, estado_solicitud) => api.put(`/inscripciones/${id}`, { estado_solicitud }).then((r) => r.data),
};

export const resenas = {
  crear: (data) => api.post('/resenas', data).then((r) => r.data),
  listarPorActividad: (id) => api.get(`/resenas/actividad/${id}`).then((r) => r.data),
};

export const notificaciones = {
  listar: () => api.get('/notificaciones').then((r) => r.data),
  marcarLeida: (id) => api.put(`/notificaciones/${id}/leer`).then((r) => r.data),
};

export const mensajes = {
  listarConversaciones: () => api.get('/mensajes').then((r) => r.data),
  conversacion: (userId) => api.get(`/mensajes/conversacion/${userId}`).then((r) => r.data),
  enviar: (data) => api.post('/mensajes', data).then((r) => r.data),
};

export const usuarios = {
  listar: (params) => api.get('/usuarios', { params }).then((r) => r.data),
};

export const admin = {
  organizaciones: (params) => api.get('/admin/organizaciones', { params }).then((r) => r.data),
  cambiarEstadoOrg: (id, estado_verificacion) =>
    api.put(`/admin/organizaciones/${id}/estado`, { estado_verificacion }).then((r) => r.data),
  estadisticas: () => api.get('/admin/estadisticas').then((r) => r.data),
  generarReporte: () => api.post('/admin/reportes/generar').then((r) => r.data),
  eliminarActividad: (id) => api.delete(`/admin/actividades/${id}`).then((r) => r.data),
};
