# E13 - Diagramas de secuencia (texto)

## CU-01 - Registrar usuario voluntario

```
Voluntario -> Frontend: rellena formulario
Frontend -> Backend (POST /api/auth/register/voluntario): payload validado
Backend -> AuthService.registrarVoluntario(datos)
AuthService -> Rol.findOne(VOLUNTARIO)
AuthService -> hashPassword(contrasena)
AuthService -> Usuario.create(...)
AuthService -> PerfilVoluntario.create(...)
AuthService -> signToken({sub, email, rol})
Backend -> Frontend: 201 { token, usuario }
Frontend -> localStorage: setItem(token)
Frontend -> usuario navega a /voluntario/buscar
```

## CU-02 - Inscribirse en actividad

```
Voluntario -> VolDetalleActividad: clic "Inscribirme"
VolDetalleActividad -> Modal: muestra confirmacion
Voluntario -> Modal: clic "Confirmar"
Modal -> Backend (POST /api/inscripciones): { id_actividad }
Backend -> InscripcionService.crear(id_usuario, payload)
InscripcionService -> sequelize.transaction
  loop within transaction:
    Actividad.findByPk LOCK_UPDATE
    if cupos_disponibles == 0 -> 409
    Inscripcion.findOne (existente?) -> 409 si ya existe
    Inscripcion.create({ estado_solicitud: PENDIENTE })
Backend -> Frontend: 201 { id_inscripcion }
Frontend -> usuario: muestra "Tu inscripcion fue enviada"
```

## CU-07 - Aprobar inscripcion (Organizacion)

```
Org -> OrgInscripciones: clic "Aprobar"
OrgInscripciones -> Backend (PUT /api/inscripciones/:id): { estado_solicitud: APROBADA }
Backend -> InscripcionService.cambiarEstado(...)
InscripcionService -> tx:
  Inscripcion.findByPk LOCK_UPDATE
  validar duenio (org)
  Actividad.findByPk LOCK_UPDATE
  if cupos_disponibles <= 0 -> 409
  Actividad.update({ cupos_disponibles -= 1 })
  Inscripcion.update({ estado_solicitud: APROBADA })
  NotificacionService.crearNotificacion({
    id_usuario: voluntario,
    tipo: INSCRIPCION_APROBADA,
    titulo, mensaje
  })
Backend -> Frontend: 200 inscripcion actualizada
```

## CU-03 - Generar reporte IA (Admin)

```
Admin -> AdminReportes: clic "Generar reporte"
AdminReportes -> Backend (POST /api/admin/reportes/generar)
Backend -> AdminService.obtenerEstadisticas (counts y group by)
Backend -> ReporteIAService.generarReporte
  if !GROQ_API_KEY -> 503
  ReporteIA -> Groq (POST https://api.groq.com/openai/v1/chat/completions)
  Groq -> ReporteIA: { choices[0].message.content }
Backend -> Frontend: { generado_en, modelo, estadisticas, informe }
Frontend -> AdminReportes: muestra texto en tarjeta
```
