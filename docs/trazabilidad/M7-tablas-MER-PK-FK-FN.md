# M7 - Tablas vs PK / FK / FN

| Tabla | PK | FKs | FN cumple |
|---|---|---|---|
| ROL | id_rol | — | 3FN |
| CIUDAD | id_ciudad | — | 3FN |
| CATEGORIA | id_categoria | — | 3FN |
| USUARIO | id_usuario | id_rol -> ROL, id_ciudad -> CIUDAD | 3FN |
| PERFIL_VOLUNTARIO | id_voluntario | id_usuario -> USUARIO (UNIQUE) | 3FN (intereses TEXT por decision E10) |
| PERFIL_ORGANIZACION | id_organizacion | id_usuario -> USUARIO (UNIQUE) | 3FN |
| PERFIL_ADMIN | id_admin | id_usuario -> USUARIO (UNIQUE) | 3FN |
| ACTIVIDAD | id_actividad | id_organizacion, id_categoria, id_ciudad | 3FN |
| INSCRIPCION | id_inscripcion | id_voluntario, id_actividad (UNIQUE compuesto) | 3FN |
| RESENA | id_resena | id_inscripcion (UNIQUE) | 3FN |
| MENSAJE | id_mensaje | id_usuario_remitente, id_usuario_destinatario, id_actividad (NULL) | 3FN |
| NOTIFICACION | id_notificacion | id_usuario | 3FN |
