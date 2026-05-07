# M3 - Componentes vs arquetipos vs RF

| Componente backend | Arquetipo dominante | RF cubiertos |
|---|---|---|
| `services/AuthService.js` | Party | RF-001, RF-002 |
| `services/PerfilService.js` | Party | RF-002, RF-003 |
| `services/ActividadService.js` | Moment-Interval | RF-005, RF-006 |
| `services/InscripcionService.js` | Moment-Interval | RF-007, RF-008, RF-009 |
| `services/NotificacionService.js` | Moment-Interval | RF-010, RF-011 |
| `services/MensajeService.js` | Moment-Interval | RF-012, RF-013, RF-015 |
| `services/ResenaService.js` | Thing | RF-014 |
| `services/AdminService.js` | Party + Description | RF-016, RF-017 |
| `services/ReporteIAService.js` | Reporte | RF-015 |

| Componente frontend | RF cubiertos |
|---|---|
| `pages/RegistroVoluntario.jsx` | RF-001 |
| `pages/RegistroOrganizacion.jsx` | RF-001 |
| `pages/Login.jsx` | RF-001 |
| `pages/VolBuscarActividades.jsx` | RF-006 |
| `pages/VolDetalleActividad.jsx` | RF-007 |
| `pages/VolMisInscripciones.jsx` | RF-008, RF-014 |
| `pages/OrgPublicarActividad.jsx` | RF-005 |
| `pages/OrgInscripciones.jsx` | RF-009 |
| `pages/OrgMisActividades.jsx` | RF-005 |
| `pages/AdminOrganizaciones.jsx` | RF-016 |
| `pages/AdminInscripciones.jsx` | RF-009 |
| `pages/AdminReportes.jsx` | RF-015 |
| `pages/Mensajes.jsx` | RF-012, RF-013 |
| `pages/Notificaciones.jsx` | RF-010, RF-011 |
| `pages/Perfil.jsx` | RF-002 |
