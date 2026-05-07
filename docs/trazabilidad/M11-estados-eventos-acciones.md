# M11 - Estados / eventos / acciones

## INSCRIPCION

| Estado origen | Evento | Estado destino | Accion del sistema |
|---|---|---|---|
| (creacion) | voluntario se inscribe | PENDIENTE | crear registro |
| PENDIENTE | org aprueba | APROBADA | -1 cupos_disponibles, crear NOTIFICACION INSCRIPCION_APROBADA |
| PENDIENTE | org rechaza | RECHAZADA | crear NOTIFICACION INSCRIPCION_RECHAZADA |
| APROBADA | org marca asistencia | ASISTIO | habilita resena |
| APROBADA | org marca no asistio | NO_ASISTIO | — |
| APROBADA | org rechaza (correccion) | RECHAZADA | +1 cupos_disponibles, NOTIFICACION RECHAZADA |

## ACTIVIDAD

| Estado origen | Evento | Estado destino | Accion |
|---|---|---|---|
| (creacion) | org publica | PUBLICADA | guardar registro, fijar cupos_totales = cupos_disponibles |
| PUBLICADA | org cancela | CANCELADA | bloquea inscripciones |
| PUBLICADA | (manual) | EN_CURSO | informativo |
| EN_CURSO | (manual) | FINALIZADA | informativo |

## PERFIL_ORGANIZACION

| Estado origen | Evento | Estado destino | Accion |
|---|---|---|---|
| (creacion) | registro | PENDIENTE | NO puede publicar |
| PENDIENTE | admin verifica | VERIFICADA | NOTIFICACION ORG_VERIFICADA |
| VERIFICADA | admin suspende | SUSPENDIDA | bloquea publicacion |
| SUSPENDIDA | admin re-verifica | VERIFICADA | habilita publicacion |
