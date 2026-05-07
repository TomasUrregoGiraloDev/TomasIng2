# M1 - Entidades vs RF / CU / DCA

| Entidad | RF que la usan | CU que la cubren | Componente DCA |
|---|---|---|---|
| ROL | RF-001 | CU-01 | Backend / models / Rol.js |
| CIUDAD | RF-001, RF-005, RF-006 | CU-01, CU-04 | Backend / models / Ciudad.js |
| CATEGORIA | RF-005, RF-006, RF-011 | CU-04, CU-01 | Backend / models / Categoria.js |
| USUARIO | RF-001, RF-002, RF-003 | CU-01 | Backend / models / Usuario.js |
| PERFIL_VOLUNTARIO | RF-002, RF-004, RF-007 | CU-01, CU-02, CU-05, CU-06 | Backend / models / PerfilVoluntario.js |
| PERFIL_ORGANIZACION | RF-002, RF-003, RF-016 | CU-04, CU-08, CU-09, CU-11 | Backend / models / PerfilOrganizacion.js |
| PERFIL_ADMIN | RF-016, RF-017 | CU-11, CU-12 | Backend / models / PerfilAdministrador.js |
| ACTIVIDAD | RF-005, RF-006, RF-008, RF-009, RF-017 | CU-01, CU-04, CU-05, CU-08, CU-09, CU-12 | Backend / models / Actividad.js |
| INSCRIPCION | RF-007, RF-008, RF-009, RF-014 | CU-02, CU-05, CU-06, CU-07 | Backend / models / Inscripcion.js |
| RESENA | RF-014 | CU-06 | Backend / models / Resena.js |
| MENSAJE | RF-012, RF-013, RF-015 | CU-10 | Backend / models / Mensaje.js |
| NOTIFICACION | RF-010, RF-011 | CU-10 | Backend / models / Notificacion.js |
