# E12 - Diagrama de clases

```
+-------------+         +-------------+
|   Rol       |1       *|  Usuario    |1     1+----------------------+
+-------------+---------+-------------+------>| PerfilVoluntario     |
| id_rol      |         | id_usuario  |       +----------------------+
| nombre_rol  |         | correo_e..  |       | id_voluntario        |
+-------------+         | contrasena  |       | nombre, apellido     |
                        | id_rol FK   |       | telefono, intereses  |
                        | id_ciudad FK|       +----------------------+
                        +------+------+1     1
                               |---------------+----------------------+
                               |               | PerfilOrganizacion   |
                               |               +----------------------+
                               |               | id_organizacion      |
                               |               | nombre_institucion   |
                               |               | nit_registro UNIQUE  |
                               |               | estado_verificacion  |
                               |               +----------+-----------+1   *
                               |1     1                    |---------------+
                               +-->+---------------------+ |               |
                                   | PerfilAdmin         | v               v
                                   +---------------------+ +-------------+ +-------------+
                                   | id_admin            | |  Actividad  | | Inscripcion |
                                   | nivel_acceso        | +-------------+ +-------------+
                                   +---------------------+ | id_actividad| | id_inscr.   |
                                                           | titulo      |1| estado_sol. |
                                                           | fecha_evento|--| id_volunt.. |
                                                           | cupos_*     | | id_actividad|
                                                           | estado_act. | +------+------+
                                                           +------+------+        |1   1
                                                                  |1              v
                                                                  v        +------+------+
                                                              +---+----+   |   Resena    |
                                                              |Categoria|   +-------------+
                                                              +---------+   | calificac.  |
                                                                            | comentario  |
                                                                            +-------------+

  Usuario 1  *  Mensaje (remitente, destinatario)
  Usuario 1  *  Notificacion
  Actividad 0..1  *  Mensaje (opcional)
```

## Metodos clave por clase

`AuthService`
- `registrarVoluntario(datos)` — CU-01 / RF-001
- `registrarOrganizacion(datos)` — CU-01 / RF-001
- `login({ correo_electronico, contrasena })` — CU-01 / RF-001
- `obtenerUsuarioActual(id_usuario)` — CU-01 / RF-002

`PerfilService`
- `obtenerPerfil(id_usuario, rol)` — CU-01 / RF-002
- `actualizarPerfil(id_usuario, rol, datos)` — CU-01 / RF-002

`ActividadService`
- `listar(filtros)` — CU-01 / RF-006
- `obtener(id)` — CU-01 / RF-006
- `crear(id_usuario, datos)` — CU-04 / RF-005
- `actualizar(id_usuario, id, datos)` — CU-08 / RF-005
- `cancelar(id_usuario, id)` — CU-09 / RF-005

`InscripcionService`
- `crear(id_usuario, { id_actividad })` — CU-02 / RF-007
- `listar(id_usuario, rol, filtros)` — CU-05 / RF-008
- `cambiarEstado(id_usuario, rol, id, estado)` — CU-07 / RF-009

`NotificacionService`
- `crearNotificacion(...)` — CU-10 / RF-010
- `listarPorUsuario(id_usuario)` — CU-10 / RF-010
- `marcarLeida(id_usuario, id_notificacion)` — CU-10 / RF-010

`MensajeService`
- `listarConversaciones(id_usuario)` — CU-10 / RF-013
- `obtenerConversacion(id_usuario, id_otro)` — CU-10 / RF-015
- `enviar(id_usuario, payload)` — CU-10 / RF-013

`ResenaService`
- `crear(id_usuario, datos)` — CU-06 / RF-014
- `listarPorActividad(id_actividad)` — CU-06 / RF-014

`AdminService`
- `listarOrganizaciones(filtros)` — CU-11 / RF-016
- `cambiarEstadoOrganizacion(id, nuevoEstado)` — CU-11 / RF-016
- `eliminarActividad(id)` — CU-12 / RF-017
- `obtenerEstadisticas()` — RF-015

`ReporteIAService`
- `generarReporte()` — CU-03 / RF-015
