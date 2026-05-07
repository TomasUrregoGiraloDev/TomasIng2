# M10 - Diagramas de secuencia vs clases

| CU | Metodos en secuencia | Clases involucradas |
|---|---|---|
| CU-01 (login) | login -> Usuario.findOne -> verifyPassword -> signToken | AuthService, Usuario, hash.js, jwt.js |
| CU-01 (registro voluntario) | registrarVoluntario -> Rol.findOne -> hashPassword -> Usuario.create -> PerfilVoluntario.create -> signToken | AuthService, Rol, Usuario, PerfilVoluntario |
| CU-02 (inscribirse) | crear -> tx -> Actividad.findByPk LOCK -> Inscripcion.findOne -> Inscripcion.create | InscripcionService, Actividad, Inscripcion |
| CU-04 (publicar) | crear -> getOrgVerificadaDelUsuario -> Actividad.create -> obtener | ActividadService, PerfilOrganizacion, Actividad |
| CU-07 (aprobar) | cambiarEstado -> tx -> Inscripcion.findByPk LOCK -> Actividad.findByPk LOCK -> update cupos -> Inscripcion.update -> NotificacionService.crearNotificacion | InscripcionService, Inscripcion, Actividad, NotificacionService |
| CU-03 (reporte IA) | generarReporte -> AdminService.obtenerEstadisticas -> fetch Groq -> retorno | ReporteIAService, AdminService, Actividad, Inscripcion, fetch |
| CU-10 (notificacion) | listarPorUsuario / marcarLeida | NotificacionService, Notificacion |
