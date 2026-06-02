# 08 - Historias de Usuario y Requisitos Funcionales

## Historias de Usuario (HU01 - HU17)

Formato: Como [rol], quiero [accion], para [beneficio].

---

### HU01 — Busqueda y filtrado de actividades
- Como **voluntario**,
- quiero buscar y filtrar actividades por intereses y ubicacion,
- para encontrar rapidamente oportunidades relevantes y superar la fragmentacion de la informacion.

### HU02 — Publicacion de actividades
- Como **organizacion**,
- quiero registrar mi informacion y publicar las actividades que requieren apoyo,
- para difundir mis iniciativas y movilizar el esfuerzo ciudadano de forma eficiente.

### HU03 — Inscripcion a actividad
- Como **voluntario**,
- quiero inscribirme a una actividad mediante un solo clic en la plataforma,
- para formalizar mi compromiso y asegurar mi participacion sin depender de procesos externos.

### HU04 — Generacion de informes automaticos
- Como **organizacion**,
- quiero generar informes automaticos sobre el impacto logrado y las horas de voluntariado,
- para medir el alcance de mis iniciativas sin tener que realizar calculos manuales.

### HU05 — Calendario de eventos
- Como **voluntario**,
- quiero visualizar una lista centralizada con las fechas de los eventos de mi zona,
- para organizar mis compromisos y evitar confusiones en mi programacion personal.

### HU06 — Aprobacion de inscripciones
- Como **organizacion**,
- quiero aprobar o rechazar las solicitudes de inscripcion de los usuarios,
- para mantener el control de la capacidad del evento y asegurar que participe el personal adecuado.

### HU07 — Notificaciones en tiempo real
- Como **voluntario**,
- quiero recibir notificaciones en mi celular sobre eventos cercanos o cambios de ultimo momento,
- para evitar desinformacion y reaccionar a tiempo ante cualquier eventualidad logistica.

### HU08 — Mensajeria grupal
- Como **organizacion**,
- quiero enviar mensajes a grupos de voluntarios filtrados por habilidades o perfiles especificos,
- para optimizar la comunicacion y convocar a las personas exactas que necesito para una tarea.

### HU09 — Calificacion y resenas
- Como **voluntario**,
- quiero dejar una calificacion y comentario sobre mi experiencia con la organizacion,
- para fomentar la transparencia y ayudar a otros voluntarios a elegir proyectos de alta calidad.

### HU10 — Registro de cuenta
- Como **usuario del sistema** (voluntario u organizacion),
- quiero crear mi cuenta a traves de una interfaz intuitiva y facil de usar,
- para superar barreras tecnologicas y garantizar mi rapida adaptacion a la plataforma.

### HU11 — Alertas por intereses
- Como **voluntario**,
- quiero recibir alertas por correo electronico cuando se publique una actividad que coincida con mis intereses,
- para no perder ninguna oportunidad de participar en proyectos de mi agrado.

### HU12 — Dashboard de estadisticas
- Como **organizacion**,
- quiero visualizar un resumen (dashboard) con el total de horas trabajadas por los voluntarios en mis eventos,
- para conocer rapidamente el nivel de ayuda que estamos brindando a la comunidad.

### HU13 — Historial de participaciones
- Como **voluntario**,
- quiero consultar en mi perfil un historial de mis participaciones y actividades completadas,
- para tener un registro de mi experiencia que me sirva como hoja de vida de voluntariado.

### HU14 — Pausar perfil de organizacion
- Como **organizacion**,
- quiero pausar o desactivar temporalmente mi perfil publico con un solo boton,
- para evitar recibir nuevas solicitudes cuando no tengo cupos o mis proyectos estan inactivos.

### HU15 — Mensajeria directa
- Como **voluntario**,
- quiero enviar mensajes directos a la organizacion una vez que mi inscripcion es aprobada,
- para resolver dudas logisticas de ultima hora (ubicacion exacta, que materiales llevar, etc.).

### HU16 — Vista global del administrador
- Como **administrador**,
- quiero tener una vista global de todas las organizaciones registradas,
- para verificar su legitimidad y asegurar la seguridad de los voluntarios.

### HU17 — Moderacion de contenido
- Como **administrador**,
- quiero poder dar de baja comentarios o actividades reportadas como inapropiadas,
- para mantener un ambiente sano y profesional en la comunidad.

---

## Requisitos Funcionales (RF-001 - RF-017)

### Modulo 1: Gestion de Usuarios y Perfiles

#### RF-001: Registrar Usuario (C - Create)
- **Descripcion:** El sistema debe permitir registrar nuevos usuarios (voluntarios u organizaciones) capturando nombre, correo, contrasena y rol, realizando validacion HTML5 basica.
- **Historia relacionada:** HU10
- **Entidad afectada:** USUARIO, ROL
- **Modulo:** Gestion de Usuarios
- **Prioridad:** Alta

#### RF-002: Actualizar Perfil de Organizacion (U - Update)
- **Descripcion:** El sistema debe permitir a la organizacion modificar la informacion de su perfil mediante un formulario web.
- **Historia relacionada:** HU02
- **Entidad afectada:** PERFIL_ORGANIZACION
- **Modulo:** Gestion de Usuarios
- **Prioridad:** Alta

#### RF-003: Pausar/Desactivar Perfil de Organizacion (D - Delete Logico)
- **Descripcion:** El sistema debe permitir a la organizacion cambiar su estado a inactivo, ocultando sus actividades de las busquedas sin borrar los datos reales.
- **Historia relacionada:** HU14
- **Entidad afectada:** USUARIO, ACTIVIDAD
- **Modulo:** Gestion de Usuarios
- **Prioridad:** Alta

#### RF-004: Consultar Historial de Voluntario (R - Read)
- **Descripcion:** El sistema debe listar en el perfil del voluntario todas las actividades en las que participo con estado "completado", calculando el total de horas contribuidas.
- **Historia relacionada:** HU13
- **Entidad afectada:** INSCRIPCION, ACTIVIDAD
- **Modulo:** Gestion de Usuarios
- **Prioridad:** Media

### Modulo 2: Gestion de Actividades

#### RF-005: Publicar Actividades (C - Create)
- **Descripcion:** El sistema debe permitir a las organizaciones publicar nuevas actividades ingresando titulo, ubicacion, fecha y cupos.
- **Historia relacionada:** HU02
- **Entidad afectada:** ACTIVIDAD
- **Modulo:** Gestion de Actividades
- **Prioridad:** Alta

#### RF-006: Buscar y Filtrar Actividades (R - Read)
- **Descripcion:** El sistema debe permitir al voluntario buscar y listar actividades disponibles, aplicando filtros dinamicos por categoria, ciudad o fecha.
- **Historia relacionada:** HU01
- **Entidad afectada:** ACTIVIDAD, CATEGORIA, CIUDAD
- **Modulo:** Gestion de Actividades
- **Prioridad:** Alta

### Modulo 3: Gestion de Inscripciones

#### RF-007: Inscribirse a una Actividad (C - Create / U - Update)
- **Descripcion:** El sistema debe permitir al voluntario registrar una solicitud de inscripcion a un evento, y automaticamente restar 1 al cupo disponible de la actividad.
- **Historia relacionada:** HU03
- **Entidad afectada:** INSCRIPCION, ACTIVIDAD
- **Modulo:** Gestion de Inscripciones
- **Prioridad:** Alta

#### RF-008: Listar Eventos Inscritos (R - Read)
- **Descripcion:** El sistema debe consultar y mostrar al voluntario una lista de todas las actividades a las que esta inscrito, ordenadas cronologicamente.
- **Historia relacionada:** HU05
- **Entidad afectada:** INSCRIPCION, ACTIVIDAD
- **Modulo:** Gestion de Inscripciones
- **Prioridad:** Alta

#### RF-009: Aprobar o Rechazar Solicitudes (U - Update)
- **Descripcion:** El sistema debe permitir a la organizacion modificar el estado de las solicitudes de inscripcion de "pendiente" a "aceptada" o "rechazada".
- **Historia relacionada:** HU06
- **Entidad afectada:** INSCRIPCION
- **Modulo:** Gestion de Inscripciones
- **Prioridad:** Alta

### Modulo 4: Comunicaciones y Notificaciones

#### RF-010: Notificaciones por Cambio de Estado (C - Create)
- **Descripcion:** El sistema debe generar y enviar una notificacion automatica al voluntario cuando su inscripcion sea aceptada o haya un cambio en la actividad.
- **Historia relacionada:** HU07
- **Entidad afectada:** NOTIFICACION
- **Modulo:** Comunicaciones
- **Prioridad:** Media

#### RF-011: Notificaciones de Nuevas Actividades (R - Read / C - Create)
- **Descripcion:** El sistema debe consultar los intereses del voluntario y generar un aviso cuando se publique una actividad que coincida con su perfil.
- **Historia relacionada:** HU11
- **Entidad afectada:** NOTIFICACION, USUARIO
- **Modulo:** Comunicaciones
- **Prioridad:** Baja

#### RF-012: Enviar Mensaje Grupal (C - Create)
- **Descripcion:** El sistema debe permitir a las organizaciones redactar y enviar mensajes masivos dirigidos a grupos especificos de voluntarios inscritos.
- **Historia relacionada:** HU08
- **Entidad afectada:** MENSAJE
- **Modulo:** Comunicaciones
- **Prioridad:** Media

#### RF-013: Enviar Mensaje Directo (C - Create)
- **Descripcion:** El sistema debe permitir al voluntario redactar y enviar un mensaje directo a la organizacion sobre dudas de una actividad especifica.
- **Historia relacionada:** HU15
- **Entidad afectada:** MENSAJE
- **Modulo:** Comunicaciones
- **Prioridad:** Media

### Modulo 5: Interaccion y Reportes

#### RF-014: Registrar Resena y Comentario (C - Create)
- **Descripcion:** El sistema debe permitir al voluntario registrar un comentario y una calificacion (1-5 estrellas) tras finalizar una actividad.
- **Historia relacionada:** HU09
- **Entidad afectada:** RESENA
- **Modulo:** Gestion de Resenas
- **Prioridad:** Media

#### RF-015: Generar Reportes y Estadisticas (R - Read)
- **Descripcion:** El sistema debe calcular y mostrar estadisticas para las organizaciones (total de voluntarios, horas acreditadas, promedios) ejecutando consultas SQL de agregacion.
- **Historia relacionada:** HU04, HU12
- **Entidad afectada:** ACTIVIDAD, INSCRIPCION
- **Modulo:** Reportes y Estadisticas
- **Prioridad:** Alta

### Modulo 6: Administracion Global

#### RF-016: Gestion y Verificacion de Entidades (R/U/D)
- **Descripcion:** El sistema debe permitir al administrador listar todas las organizaciones, validar su estado y, si es necesario, suspender el acceso de aquellas que no cumplan con las normas.
- **Historia relacionada:** HU16
- **Entidad afectada:** PERFIL_ORGANIZACION, USUARIO
- **Modulo:** Administracion Global
- **Prioridad:** Media

#### RF-017: Moderacion de Contenido Critico (D - Delete)
- **Descripcion:** El sistema debe permitir al administrador eliminar de forma definitiva cualquier resena, comentario o actividad que haya sido marcada como ofensiva o fraudulenta.
- **Historia relacionada:** HU17
- **Entidad afectada:** RESENA, ACTIVIDAD
- **Modulo:** Administracion Global
- **Prioridad:** Media
