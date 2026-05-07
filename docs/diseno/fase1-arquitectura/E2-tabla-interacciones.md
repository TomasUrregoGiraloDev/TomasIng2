# E2 - Tabla de interacciones

## Voluntario

| Actor | Accion | Entidad | Resultado |
|---|---|---|---|
| Voluntario | Registrarse | USUARIO + PERFIL_VOLUNTARIO | Cuenta creada con token JWT |
| Voluntario | Iniciar sesion | USUARIO | Token JWT |
| Voluntario | Ver actividades | ACTIVIDAD | Lista filtrada |
| Voluntario | Inscribirse | INSCRIPCION | Registro PENDIENTE creado |
| Voluntario | Crear reseña | RESENA | Reseña guardada (1:1 con INSCRIPCION) |
| Voluntario | Enviar mensaje | MENSAJE | Mensaje enviado y notificacion al destinatario |

## Organizacion

| Actor | Accion | Entidad | Resultado |
|---|---|---|---|
| Organizacion | Crear actividad | ACTIVIDAD | Actividad publicada (PUBLICADA) |
| Organizacion | Editar actividad | ACTIVIDAD | Cambios guardados |
| Organizacion | Cancelar actividad | ACTIVIDAD | estado_actividad = CANCELADA |
| Organizacion | Aprobar inscripcion | INSCRIPCION + NOTIFICACION + ACTIVIDAD | Estado APROBADA, cupos -1, notificacion al voluntario |
| Organizacion | Rechazar inscripcion | INSCRIPCION + NOTIFICACION | Estado RECHAZADA, notificacion al voluntario |

## Administrador

| Actor | Accion | Entidad | Resultado |
|---|---|---|---|
| Admin | Listar organizaciones | PERFIL_ORGANIZACION | Lista con conteo de actividades |
| Admin | Verificar organizacion | PERFIL_ORGANIZACION + NOTIFICACION | estado_verificacion = VERIFICADA + notificacion |
| Admin | Suspender organizacion | PERFIL_ORGANIZACION | estado_verificacion = SUSPENDIDA |
| Admin | Eliminar actividad inapropiada | ACTIVIDAD | Registro eliminado |
| Admin | Generar reporte IA | (read) ACTIVIDAD + INSCRIPCION + Groq | Texto ejecutivo + estadisticas |
