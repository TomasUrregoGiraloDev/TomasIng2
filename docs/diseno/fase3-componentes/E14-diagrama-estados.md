# E14 - Diagrama de estados

## INSCRIPCION.estado_solicitud

```
                +------------+
                |  PENDIENTE |  (estado inicial al crearse la inscripcion)
                +------+-----+
                       |
        +--------------+--------------+
        | Org aprueba                 | Org rechaza
        v                             v
   +----+-----+                  +-----+-----+
   | APROBADA |                  | RECHAZADA |
   +----+-----+                  +-----------+
        |
   +----+--------------------------+
   | Org marca asistencia          |
   |                               |
   v                               v
+--+------+                  +-----+-------+
| ASISTIO |                  | NO_ASISTIO  |
+---------+                  +-------------+
   |
   v
 [Habilita escribir RESENA]
```

Reglas:
- Solo desde PENDIENTE se puede ir a APROBADA o RECHAZADA.
- Al pasar a APROBADA se decrementa `cupos_disponibles`. Si por error se rechaza una APROBADA, el cupo se devuelve.
- Solo desde APROBADA se puede registrar ASISTIO o NO_ASISTIO.
- Solo si el estado es ASISTIO el voluntario puede dejar reseña.

## ACTIVIDAD.estado_actividad

```
   BORRADOR --> PUBLICADA --> EN_CURSO --> FINALIZADA
                    |             |
                    +--> CANCELADA <--+
```

- En la app la actividad se crea directamente en estado PUBLICADA.
- BORRADOR queda definido para una version futura con guardado parcial.
- CANCELADA bloquea nuevas inscripciones; las APROBADAS quedan congeladas.

## PERFIL_ORGANIZACION.estado_verificacion

```
   PENDIENTE --(admin verifica)--> VERIFICADA
       \                              /
        +-(admin suspende)-> SUSPENDIDA
```

- Solo VERIFICADA puede publicar actividades.
- SUSPENDIDA implica `estado_activo = false` en proximas iteraciones.
