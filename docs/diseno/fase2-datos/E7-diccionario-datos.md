# E7 - Diccionario de datos

## ROL

| Atributo | Tipo | Restricciones | Descripcion |
|---|---|---|---|
| id_rol | INT PK AI | NOT NULL | Identificador del rol |
| nombre_rol | VARCHAR(50) | NOT NULL UNIQUE | Voluntario, Organizacion, Administrador |

## CIUDAD

| Atributo | Tipo | Restricciones |
|---|---|---|
| id_ciudad | INT PK AI | NOT NULL |
| nombre_ciudad | VARCHAR(100) | NOT NULL |
| departamento | VARCHAR(100) | NULL |

## CATEGORIA

| Atributo | Tipo | Restricciones |
|---|---|---|
| id_categoria | INT PK AI | NOT NULL |
| nombre_categoria | VARCHAR(50) | NOT NULL UNIQUE |
| descripcion | VARCHAR(255) | NULL |

## USUARIO

| Atributo | Tipo | Restricciones |
|---|---|---|
| id_usuario | INT PK AI | NOT NULL |
| correo_electronico | VARCHAR(100) | NOT NULL UNIQUE, formato email |
| contrasena | VARCHAR(255) | NOT NULL, hash bcrypt |
| fecha_registro | DATETIME | DEFAULT NOW |
| id_rol | INT FK -> ROL | NOT NULL |
| id_ciudad | INT FK -> CIUDAD | NULL |

## PERFIL_VOLUNTARIO

| Atributo | Tipo | Restricciones |
|---|---|---|
| id_voluntario | INT PK AI | NOT NULL |
| nombre | VARCHAR(100) | NOT NULL, min 2 |
| apellido | VARCHAR(100) | NOT NULL, min 2 |
| telefono | VARCHAR(20) | NULL |
| intereses | TEXT | NULL |
| id_usuario | INT FK -> USUARIO | NOT NULL UNIQUE |

## PERFIL_ORGANIZACION

| Atributo | Tipo | Restricciones |
|---|---|---|
| id_organizacion | INT PK AI | NOT NULL |
| nombre_institucion | VARCHAR(150) | NOT NULL |
| nit_registro | VARCHAR(50) | NOT NULL UNIQUE |
| telefono | VARCHAR(20) | NULL |
| descripcion_org | TEXT | NULL |
| estado_activo | BOOLEAN | DEFAULT TRUE |
| estado_verificacion | VARCHAR(20) | NOT NULL, DEFAULT 'PENDIENTE'. Valores: PENDIENTE, VERIFICADA, SUSPENDIDA |
| id_usuario | INT FK -> USUARIO | NOT NULL UNIQUE |

## PERFIL_ADMIN

| Atributo | Tipo | Restricciones |
|---|---|---|
| id_admin | INT PK AI | NOT NULL |
| nombre | VARCHAR(100) | NOT NULL |
| apellido | VARCHAR(100) | NOT NULL |
| nivel_acceso | VARCHAR(50) | NOT NULL, DEFAULT 'GENERAL' |
| id_usuario | INT FK -> USUARIO | NOT NULL UNIQUE |

## ACTIVIDAD

| Atributo | Tipo | Restricciones |
|---|---|---|
| id_actividad | INT PK AI | NOT NULL |
| titulo | VARCHAR(150) | NOT NULL, min 3 |
| descripcion | TEXT | NULL pero la app exige min 10 |
| fecha_evento | DATETIME | NOT NULL |
| direccion | VARCHAR(200) | NULL pero la app exige min 3 |
| cupos_totales | INT | NOT NULL DEFAULT 0 |
| cupos_disponibles | INT | NOT NULL DEFAULT 0 |
| estado_actividad | VARCHAR(20) | NOT NULL DEFAULT 'PUBLICADA'. Valores: BORRADOR, PUBLICADA, EN_CURSO, FINALIZADA, CANCELADA |
| imagen_url | VARCHAR(500) | NULL |
| id_organizacion | INT FK -> PERFIL_ORGANIZACION | NOT NULL |
| id_categoria | INT FK -> CATEGORIA | NOT NULL |
| id_ciudad | INT FK -> CIUDAD | NOT NULL |

## INSCRIPCION

| Atributo | Tipo | Restricciones |
|---|---|---|
| id_inscripcion | INT PK AI | NOT NULL |
| fecha_inscripcion | DATETIME | DEFAULT NOW |
| estado_solicitud | VARCHAR(20) | NOT NULL DEFAULT 'PENDIENTE'. Valores: PENDIENTE, APROBADA, RECHAZADA, ASISTIO, NO_ASISTIO |
| horas_acreditadas | INT | DEFAULT 0 |
| id_voluntario | INT FK -> PERFIL_VOLUNTARIO | NOT NULL |
| id_actividad | INT FK -> ACTIVIDAD | NOT NULL |
| _UNIQUE_ (id_voluntario, id_actividad) | | un voluntario se inscribe una vez por actividad |

## RESENA

| Atributo | Tipo | Restricciones |
|---|---|---|
| id_resena | INT PK AI | NOT NULL |
| calificacion | INT | NOT NULL, CHECK 1..5 |
| comentario | TEXT | NULL, max 1000 |
| fecha_resena | DATETIME | DEFAULT NOW |
| id_inscripcion | INT FK -> INSCRIPCION | NOT NULL UNIQUE |

## MENSAJE

| Atributo | Tipo | Restricciones |
|---|---|---|
| id_mensaje | INT PK AI | NOT NULL |
| contenido | TEXT | NOT NULL, max 2000 |
| fecha_envio | DATETIME | DEFAULT NOW |
| leido | BOOLEAN | DEFAULT FALSE |
| id_usuario_remitente | INT FK -> USUARIO | NOT NULL |
| id_usuario_destinatario | INT FK -> USUARIO | NOT NULL |
| id_actividad | INT FK -> ACTIVIDAD | NULL |

## NOTIFICACION

| Atributo | Tipo | Restricciones |
|---|---|---|
| id_notificacion | INT PK AI | NOT NULL |
| titulo | VARCHAR(150) | NOT NULL |
| mensaje | VARCHAR(500) | NOT NULL |
| tipo | VARCHAR(40) | NOT NULL DEFAULT 'GENERAL'. Valores: INSCRIPCION_APROBADA, INSCRIPCION_RECHAZADA, NUEVA_ACTIVIDAD, ORG_VERIFICADA, MENSAJE_NUEVO |
| fecha_creacion | DATETIME | DEFAULT NOW |
| leido | BOOLEAN | DEFAULT FALSE |
| id_usuario | INT FK -> USUARIO | NOT NULL |
