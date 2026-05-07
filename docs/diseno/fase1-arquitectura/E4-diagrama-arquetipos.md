# E4 - Diagrama de arquetipos

Aplicacion de la tecnica "UML en color". Los arquetipos clasicos: Persona/Organizacion (Party), Lugar (Place), Cosa (Thing), Momento-Intervalo (Moment-Interval) y Descripcion.

| Arquetipo | Color UML | Entidad mapeada | Atributos clave |
|---|---|---|---|
| Party | Verde | USUARIO, PERFIL_VOLUNTARIO, PERFIL_ORGANIZACION, PERFIL_ADMIN | identidad, contacto, rol |
| Place | Verde claro | CIUDAD | nombre, departamento |
| Description | Azul | ROL, CATEGORIA | tipos y categorias compartidas |
| Moment-Interval | Rosa/Rojo | ACTIVIDAD, INSCRIPCION, MENSAJE, NOTIFICACION, RESENA | fecha_evento, fecha_inscripcion, fecha_envio, fecha_creacion, fecha_resena |
| Thing | Amarillo | RESENA, MENSAJE (artefactos generados) | calificacion, contenido |

Mapeo a carpetas del codigo:

| Carpeta backend | Arquetipo dominante |
|---|---|
| `models/Usuario.js`, `PerfilVoluntario.js`, `PerfilOrganizacion.js`, `PerfilAdmin.js` | Party |
| `models/Ciudad.js` | Place |
| `models/Rol.js`, `Categoria.js` | Description |
| `models/Actividad.js`, `Inscripcion.js`, `Mensaje.js`, `Notificacion.js`, `Resena.js` | Moment-Interval |
