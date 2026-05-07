# E8 - Modelo entidad relacion (MER)

```
ROL ----< USUARIO >---- CIUDAD
              |
              +---- 1:1 ---- PERFIL_VOLUNTARIO ----< INSCRIPCION
              |                                          |
              +---- 1:1 ---- PERFIL_ORGANIZACION ----< ACTIVIDAD
              |                                          |
              +---- 1:1 ---- PERFIL_ADMIN                |
              |                                          |
              +---- 1:N ---- MENSAJE                     |
              |                                          |
              +---- 1:N ---- NOTIFICACION                |
                                                          |
                                              CATEGORIA --+--- CIUDAD
                                                          |
                                                INSCRIPCION ----- 1:1 ----- RESENA
```

Cardinalidades clave:

| Relacion | Cardinalidad |
|---|---|
| ROL — USUARIO | 1 : N |
| USUARIO — PERFIL_VOLUNTARIO/ORG/ADMIN | 1 : 1 (excluyente segun rol) |
| PERFIL_ORGANIZACION — ACTIVIDAD | 1 : N |
| ACTIVIDAD — INSCRIPCION | 1 : N (con UNIQUE por voluntario) |
| INSCRIPCION — RESENA | 1 : 1 |
| USUARIO — MENSAJE (remitente / destinatario) | 1 : N en cada rol |
| USUARIO — NOTIFICACION | 1 : N |
| ACTIVIDAD — MENSAJE | 0..1 : N (opcional, cuando se ata a una actividad) |
