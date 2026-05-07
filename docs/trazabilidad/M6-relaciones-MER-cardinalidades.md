# M6 - Relaciones MER y cardinalidades

| Relacion | Tablas | Cardinalidad | Implementacion Sequelize |
|---|---|---|---|
| usuario.rol | USUARIO -> ROL | N : 1 | `Usuario.belongsTo(Rol)` |
| usuario.ciudad | USUARIO -> CIUDAD | N : 1 | `Usuario.belongsTo(Ciudad)` |
| voluntario.usuario | PERFIL_VOLUNTARIO -> USUARIO | 1 : 1 | `Usuario.hasOne(PerfilVoluntario)` |
| organizacion.usuario | PERFIL_ORGANIZACION -> USUARIO | 1 : 1 | `Usuario.hasOne(PerfilOrganizacion)` |
| admin.usuario | PERFIL_ADMIN -> USUARIO | 1 : 1 | `Usuario.hasOne(PerfilAdmin)` |
| actividad.organizacion | ACTIVIDAD -> PERFIL_ORGANIZACION | N : 1 | `Actividad.belongsTo(PerfilOrganizacion)` |
| actividad.categoria | ACTIVIDAD -> CATEGORIA | N : 1 | `Actividad.belongsTo(Categoria)` |
| actividad.ciudad | ACTIVIDAD -> CIUDAD | N : 1 | `Actividad.belongsTo(Ciudad)` |
| inscripcion.voluntario | INSCRIPCION -> PERFIL_VOLUNTARIO | N : 1 | `Inscripcion.belongsTo(PerfilVoluntario)` |
| inscripcion.actividad | INSCRIPCION -> ACTIVIDAD | N : 1 | `Inscripcion.belongsTo(Actividad)` |
| resena.inscripcion | RESENA -> INSCRIPCION | 1 : 1 | `Inscripcion.hasOne(Resena)` |
| mensaje.remitente | MENSAJE -> USUARIO | N : 1 | `Mensaje.belongsTo(Usuario, as: remitente)` |
| mensaje.destinatario | MENSAJE -> USUARIO | N : 1 | `Mensaje.belongsTo(Usuario, as: destinatario)` |
| mensaje.actividad | MENSAJE -> ACTIVIDAD | N : 0..1 | `Mensaje.belongsTo(Actividad)` |
| notificacion.usuario | NOTIFICACION -> USUARIO | N : 1 | `Notificacion.belongsTo(Usuario)` |
