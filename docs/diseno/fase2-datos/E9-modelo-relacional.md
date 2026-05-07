# E9 - Modelo relacional

Notacion: PK en negrita, FK con flecha al lado.

- ROL(**id_rol**, nombre_rol)
- CIUDAD(**id_ciudad**, nombre_ciudad, departamento)
- CATEGORIA(**id_categoria**, nombre_categoria, descripcion)
- USUARIO(**id_usuario**, correo_electronico, contrasena, fecha_registro, id_rol → ROL, id_ciudad → CIUDAD)
- PERFIL_VOLUNTARIO(**id_voluntario**, nombre, apellido, telefono, intereses, id_usuario → USUARIO UNIQUE)
- PERFIL_ORGANIZACION(**id_organizacion**, nombre_institucion, nit_registro UNIQUE, telefono, descripcion_org, estado_activo, estado_verificacion, id_usuario → USUARIO UNIQUE)
- PERFIL_ADMIN(**id_admin**, nombre, apellido, nivel_acceso, id_usuario → USUARIO UNIQUE)
- ACTIVIDAD(**id_actividad**, titulo, descripcion, fecha_evento, direccion, cupos_totales, cupos_disponibles, estado_actividad, imagen_url, id_organizacion → PERFIL_ORGANIZACION, id_categoria → CATEGORIA, id_ciudad → CIUDAD)
- INSCRIPCION(**id_inscripcion**, fecha_inscripcion, estado_solicitud, horas_acreditadas, id_voluntario → PERFIL_VOLUNTARIO, id_actividad → ACTIVIDAD, UNIQUE(id_voluntario, id_actividad))
- RESENA(**id_resena**, calificacion, comentario, fecha_resena, id_inscripcion → INSCRIPCION UNIQUE)
- MENSAJE(**id_mensaje**, contenido, fecha_envio, leido, id_usuario_remitente → USUARIO, id_usuario_destinatario → USUARIO, id_actividad → ACTIVIDAD opcional)
- NOTIFICACION(**id_notificacion**, titulo, mensaje, tipo, fecha_creacion, leido, id_usuario → USUARIO)
