# M9 - Clases / metodos vs CU / RF

| Clase / Service | Metodo | CU | RF | Archivo |
|---|---|---|---|---|
| AuthService | registrarVoluntario | CU-01 | RF-001 | `services/AuthService.js` |
| AuthService | registrarOrganizacion | CU-01 | RF-001 | `services/AuthService.js` |
| AuthService | login | CU-01 | RF-001 | `services/AuthService.js` |
| AuthService | obtenerUsuarioActual | CU-01 | RF-002 | `services/AuthService.js` |
| PerfilService | obtenerPerfil | CU-01 | RF-002 | `services/PerfilService.js` |
| PerfilService | actualizarPerfil | CU-01 | RF-002 | `services/PerfilService.js` |
| ActividadService | listar | CU-01 | RF-006 | `services/ActividadService.js` |
| ActividadService | obtener | CU-01 | RF-006 | `services/ActividadService.js` |
| ActividadService | crear | CU-04 | RF-005 | `services/ActividadService.js` |
| ActividadService | actualizar | CU-08 | RF-005 | `services/ActividadService.js` |
| ActividadService | cancelar | CU-09 | RF-005 | `services/ActividadService.js` |
| InscripcionService | crear | CU-02 | RF-007 | `services/InscripcionService.js` |
| InscripcionService | listar | CU-05 | RF-008 | `services/InscripcionService.js` |
| InscripcionService | cambiarEstado | CU-07 | RF-009 | `services/InscripcionService.js` |
| ResenaService | crear | CU-06 | RF-014 | `services/ResenaService.js` |
| ResenaService | listarPorActividad | CU-06 | RF-014 | `services/ResenaService.js` |
| NotificacionService | crearNotificacion | CU-10 | RF-010 | `services/NotificacionService.js` |
| NotificacionService | listarPorUsuario | CU-10 | RF-010 | `services/NotificacionService.js` |
| NotificacionService | marcarLeida | CU-10 | RF-010 | `services/NotificacionService.js` |
| MensajeService | listarConversaciones | CU-10 | RF-013 | `services/MensajeService.js` |
| MensajeService | obtenerConversacion | CU-10 | RF-015 | `services/MensajeService.js` |
| MensajeService | enviar | CU-10 | RF-013 | `services/MensajeService.js` |
| AdminService | listarOrganizaciones | CU-11 | RF-016 | `services/AdminService.js` |
| AdminService | cambiarEstadoOrganizacion | CU-11 | RF-016 | `services/AdminService.js` |
| AdminService | eliminarActividad | CU-12 | RF-017 | `services/AdminService.js` |
| AdminService | obtenerEstadisticas | RF-015 | RF-015 | `services/AdminService.js` |
| ReporteIAService | generarReporte | CU-03 | RF-015 | `services/ReporteIAService.js` |

Cada uno de estos metodos lleva un comentario `// CU-XX | RF-XXX | E13 - nombreMetodo()` justo encima de su firma para asegurar la trazabilidad inversa desde el codigo.
