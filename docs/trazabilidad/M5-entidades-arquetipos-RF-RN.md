# M5 - Entidades vs arquetipos vs RF vs reglas de negocio

| Entidad | Arquetipo | RF | Regla de negocio implementada |
|---|---|---|---|
| USUARIO | Party | RF-001 | Email unico (UNIQUE), contrasena hasheada con bcrypt |
| PERFIL_ORGANIZACION | Party | RF-005 | Solo VERIFICADA puede publicar actividades |
| ACTIVIDAD | Moment-Interval | RF-005, RF-006 | `cupos_disponibles` siempre <= `cupos_totales` |
| INSCRIPCION | Moment-Interval | RF-007, RF-009 | Decremento atomico de cupos al APROBAR; UNIQUE(voluntario, actividad) |
| RESENA | Thing | RF-014 | Solo el voluntario que ASISTIO puede crearla; 1 reseña por inscripcion |
| MENSAJE | Moment-Interval | RF-013 | Al enviar se crea NOTIFICACION para el destinatario |
| NOTIFICACION | Moment-Interval | RF-010 | Cada cambio de estado de inscripcion genera notificacion automatica |
