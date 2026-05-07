# M8 - DDL vs modelo relacional

| Tabla DDL | Modelo relacional E9 | Modelo Sequelize |
|---|---|---|
| ROL | ROL(id_rol, nombre_rol) | `models/Rol.js` |
| CIUDAD | CIUDAD(id_ciudad, nombre_ciudad, departamento) | `models/Ciudad.js` |
| CATEGORIA | CATEGORIA(id_categoria, nombre_categoria, descripcion) | `models/Categoria.js` |
| USUARIO | USUARIO(id_usuario, correo_electronico, contrasena, fecha_registro, id_rol, id_ciudad) | `models/Usuario.js` |
| PERFIL_VOLUNTARIO | PERFIL_VOLUNTARIO(id_voluntario, nombre, apellido, telefono, intereses, id_usuario) | `models/PerfilVoluntario.js` |
| PERFIL_ORGANIZACION | PERFIL_ORGANIZACION(id_organizacion, nombre_institucion, nit_registro, telefono, descripcion_org, estado_activo, estado_verificacion, id_usuario) | `models/PerfilOrganizacion.js` |
| PERFIL_ADMIN | PERFIL_ADMIN(id_admin, nombre, apellido, nivel_acceso, id_usuario) | `models/PerfilAdministrador.js` |
| ACTIVIDAD | ACTIVIDAD(id_actividad, titulo, descripcion, fecha_evento, direccion, cupos_totales, cupos_disponibles, estado_actividad, imagen_url, id_organizacion, id_categoria, id_ciudad) | `models/Actividad.js` |
| INSCRIPCION | INSCRIPCION(id_inscripcion, fecha_inscripcion, estado_solicitud, horas_acreditadas, id_voluntario, id_actividad) | `models/Inscripcion.js` |
| RESENA | RESENA(id_resena, calificacion, comentario, fecha_resena, id_inscripcion) | `models/Resena.js` |
| MENSAJE | MENSAJE(id_mensaje, contenido, fecha_envio, leido, id_usuario_remitente, id_usuario_destinatario, id_actividad) | `models/Mensaje.js` |
| NOTIFICACION | NOTIFICACION(id_notificacion, titulo, mensaje, tipo, fecha_creacion, leido, id_usuario) | `models/Notificacion.js` |

Diferencias respecto al DDL inicial del documento:
- Se agrego `cupos_totales` a ACTIVIDAD (ver Decision #05).
- Se agrego `telefono` a PERFIL_ORGANIZACION y PERFIL_VOLUNTARIO (necesario para mostrar contacto).
- Se agrego `imagen_url` a ACTIVIDAD (wireframe).
- Se agrego `estado_verificacion` a PERFIL_ORGANIZACION (HU-16).
- NOTIFICACION incluye `titulo` y `tipo` para clasificar; el original solo tenia `mensaje`.
