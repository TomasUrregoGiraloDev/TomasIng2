# 07 - Casos de uso (resumen)

| ID | Caso de uso | Actor primario | RF asociado | Implementado en |
|---|---|---|---|---|
| CU-01 | Buscar y filtrar actividades | Voluntario | RF-006 | `pages/VolBuscarActividades.jsx` + `services/ActividadService.js#listar` |
| CU-02 | Inscribirse en una actividad | Voluntario | RF-007 | `pages/VolDetalleActividad.jsx` + `InscripcionService#crear` |
| CU-03 | Generar reporte de impacto | Admin | RF-015 | `pages/AdminReportes.jsx` + `ReporteIAService#generarReporte` |
| CU-04 | Publicar actividad | Organizacion | RF-005 | `pages/OrgPublicarActividad.jsx` + `ActividadService#crear` |
| CU-05 | Ver mis inscripciones | Voluntario | RF-008 | `pages/VolMisInscripciones.jsx` |
| CU-06 | Calificar actividad | Voluntario | RF-014 | `pages/VolMisInscripciones.jsx` + `ResenaService#crear` |
| CU-07 | Aprobar/rechazar inscripcion | Organizacion | RF-009 | `pages/OrgInscripciones.jsx` + `InscripcionService#cambiarEstado` |
| CU-08 | Editar actividad | Organizacion | RF-005 | `pages/OrgMisActividades.jsx` |
| CU-09 | Cancelar actividad | Organizacion | RF-005 | `pages/OrgMisActividades.jsx` |
| CU-10 | Recibir notificaciones | Voluntario / Organizacion | RF-010, RF-011 | `pages/Notificaciones.jsx` + `NotificacionService` |
| CU-11 | Verificar organizacion | Admin | RF-016 (HU-16) | `pages/AdminOrganizaciones.jsx` |
| CU-12 | Eliminar contenido inapropiado | Admin | RF-017 (HU-17) | endpoint `DELETE /api/admin/actividades/:id` |

Cada metodo del backend que realiza la accion lleva un comentario `// CU-XX | RF-XXX | E13 - nombreMetodo()` para asegurar trazabilidad inversa desde el codigo.
