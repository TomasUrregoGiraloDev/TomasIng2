# 09 - Requisitos No Funcionales (RNF)

Cada RNF esta vinculado a una Historia de Usuario (ver `08-historias-usuario.md`) y define una metrica medible, la evidencia requerida y el procedimiento de verificacion.

---

## RNF-001: Rendimiento — Busqueda de Actividades (HU01)

- **Metrica:** El sistema debe retornar y renderizar en pantalla los resultados de una busqueda con filtros (procesando hasta 500 registros) en menos de 5 segundos.
- **Evidencia:** Captura de pantalla de la pestana Network de las herramientas de desarrollador del navegador mostrando el tiempo total de la peticion HTTP.
- **Verificacion:** Utilizar Chrome DevTools (pestana Network). Se realizaran 5 busquedas distintas con diferentes combinaciones de filtros, y se promediaran los tiempos de respuesta.

## RNF-002: Usabilidad — Validacion de Formularios (HU02)

- **Metrica:** El 100% de los campos obligatorios en el formulario de creacion deben contar con validacion nativa (HTML5 required, type, minlength) y bloquear el evento submit si hay campos vacios o incorrectos.
- **Evidencia:** Captura de pantalla mostrando el mensaje o "tooltip" nativo del navegador al intentar enviar el formulario vacio.
- **Verificacion:** Prueba de Caja Negra manual. Intentar enviar el formulario 3 veces dejando intencionalmente diferentes campos obligatorios vacios y comprobar que la pagina no recargue ni envie la peticion al servidor.

## RNF-003: Rendimiento — Respuesta de Inscripcion (HU03)

- **Metrica:** El tiempo de respuesta desde que el voluntario hace clic en "Inscribirse" hasta que se muestra el mensaje de confirmacion en pantalla debe ser menor a 3 segundos.
- **Evidencia:** Captura de pantalla del tiempo de la peticion POST/AJAX en la pestana Network del navegador.
- **Verificacion:** Ejecutar la accion de inscripcion con 3 usuarios diferentes cronometrando la accion mediante las herramientas para desarrolladores del navegador.

## RNF-004: Precision — Calculos de Reportes (HU04)

- **Metrica:** El 100% de los totales mostrados en la interfaz (sumatorias y conteos) deben coincidir exactamente con el resultado de la base de datos sin generar errores de redondeo.
- **Evidencia:** Dos capturas comparativas: una de la interfaz del sistema mostrando el total, y otra del resultado de ejecutar la consulta `SELECT SUM(...)` o `COUNT(...)` directamente en la base de datos.
- **Verificacion:** Generar un reporte de prueba en el sistema web y cruzar la informacion ejecutando la misma consulta manualmente en un gestor de base de datos (DBeaver, phpMyAdmin o MySQL Workbench). Ambos numeros deben ser identicos.

## RNF-005: Usabilidad — Diseno de Lista de Eventos (HU05)

- **Metrica:** La lista de eventos debe renderizarse como una tabla estructurada y el 100% de los registros deben listarse en estricto orden cronologico ascendente (fecha mas proxima en la fila 1).
- **Evidencia:** Captura de pantalla de la interfaz mostrando colores de fila alternos (CSS Zebra) y las fechas ordenadas.
- **Verificacion:** Inspeccion visual de la tabla generada en la interfaz y revision de la consulta SQL (`ORDER BY fecha ASC`) en el codigo fuente.

## RNF-006: Rendimiento — Actualizacion de Estado (HU06)

- **Metrica:** Tras aprobar o rechazar una solicitud, la peticion UPDATE debe procesarse en menos de 2 segundos y el cambio debe ser visible al instante en la interfaz al completarse la recarga de la vista.
- **Evidencia:** Captura de pantalla de la interfaz actualizada y captura de una consulta SELECT en la base de datos mostrando el nuevo estado de la solicitud.
- **Verificacion:** Realizar 5 cambios de estado midiendo el tiempo de la peticion HTTP (con DevTools) y verificando visualmente que el badge/texto de estado cambio.

## RNF-007: Confiabilidad — Envio de Emails (HU07)

- **Metrica:** El sistema debe conectarse al servidor SMTP y retornar un codigo de estado 250 (OK) por parte del servidor de correo al procesar una notificacion.
- **Evidencia:** Registro (log) de la consola o captura de pantalla de la bandeja de entrada de una herramienta de pruebas.
- **Verificacion:** Disparar 3 notificaciones de prueba en el sistema y verificar la recepcion inmediata en una herramienta de captura de correos para desarrollo (Mailtrap o Mailhog).

## RNF-008: Escalabilidad — Emails Secuenciales (HU08)

- **Metrica:** El bucle encargado de enviar correos masivos debe ser capaz de procesar 50 envios en menos de 30 segundos sin arrojar errores de timeout.
- **Evidencia:** Log de ejecucion del servidor detallando el inicio del proceso, la iteracion hasta 50, y el fin exitoso sin errores 500.
- **Verificacion:** Insertar 50 voluntarios de prueba en la base de datos, ejecutar la accion de envio masivo y cronometrar el proceso completo.

## RNF-009: Seguridad — Validacion de Resenas (HU09)

- **Metrica:** El sistema debe rechazar el 100% de las peticiones donde el texto supere los 500 caracteres, el archivo no sea .jpg/.png, o la imagen supere los 2MB de peso.
- **Evidencia:** Capturas de pantalla de las alertas de error mostradas por el sistema al intentar romper las reglas.
- **Verificacion:** Prueba de Limites (Boundary Testing). Se intentara subir: un archivo .pdf, una imagen de 2.5MB, y un texto de 501 caracteres. El sistema debe bloquear las tres acciones.

## RNF-010: Usabilidad — Accesibilidad Basica (HU10)

- **Metrica:** La interfaz debe cumplir con un ratio de contraste minimo de 4.5:1 (Estandar WCAG AA) entre el color del texto y el color de fondo en todos sus botones y textos principales.
- **Evidencia:** Captura del reporte de auditoria de Lighthouse (herramienta integrada en Chrome).
- **Verificacion:** Ejecutar la herramienta Lighthouse en Chrome DevTools, seleccionando la categoria "Accesibilidad". El reporte no debe arrojar errores de contraste.

## RNF-011: Precision — Coincidencia de Intereses (HU11)

- **Metrica:** El sistema debe enviar notificaciones unicamente al 100% de los usuarios cuyo campo `intereses` coincida con el `id_categoria` de la actividad recien creada.
- **Evidencia:** Comparativa entre el log de correos enviados (destinatarios) y el resultado de la consulta SQL: `SELECT correo FROM usuarios WHERE interes = X`.
- **Verificacion:** Crear una actividad categoria "Medio Ambiente". Teniendo usuarios de "Medio Ambiente" y "Educacion" en la BD, revisar en Mailtrap que solo los usuarios de "Medio Ambiente" recibieron el correo.

## RNF-012: Rendimiento — Carga de Estadisticas (HU12)

- **Metrica:** El panel (Dashboard) de estadisticas debe cargar completamente en menos de 5 segundos, ejecutando un maximo de 5 consultas SQL a la base de datos para construir las graficas/numeros.
- **Evidencia:** Captura de la pestana Network para el tiempo de carga, y captura del log de consultas del ORM mostrando que no se excedio el limite de 5 queries.
- **Verificacion:** Cargar el panel de estadisticas limpiando la cache del navegador. Medir el tiempo con DevTools y contar las consultas generadas en el log del servidor.

## RNF-013: Seguridad de Datos — Integridad del Historial (HU13)

- **Metrica:** La vista de historial debe restringir el 100% de las operaciones de escritura (sin endpoints PUT/PATCH/DELETE) y aplicar por defecto el filtro `WHERE estado = 'completado'`.
- **Evidencia:** Captura del codigo fuente del backend mostrando que la ruta es estrictamente GET y contiene el filtro hardcodeado.
- **Verificacion:** Prueba de manipulacion de URL o peticiones: Intentar enviar una peticion DELETE forzada hacia un registro del historial usando Postman. El servidor debe devolver un error 403 Forbidden o 404 Not Found.

## RNF-014: Seguridad — Efecto de Pausa (HU14)

- **Metrica:** Al actualizar el campo `activo = false` en una organizacion, el 100% de sus actividades deben dejar de ser retornadas en las busquedas o feeds de los voluntarios de manera inmediata.
- **Evidencia:** Dos capturas de pantalla del feed de un voluntario: una antes y otra despues de pausar la organizacion.
- **Verificacion:** Modificar manualmente el estado de una organizacion en la BD a "inactiva". Recargar la pagina del feed de actividades de un voluntario y verificar que los eventos de esa organizacion ya no existen en el DOM.

## RNF-015: Seguridad — Privacidad de Mensajes (HU15)

- **Metrica:** El sistema debe bloquear con un error HTTP 403 (Prohibido) cualquier intento de lectura de una conversacion si el `id_usuario` de la sesion actual no corresponde ni al remitente ni al destinatario.
- **Evidencia:** Captura de pantalla de Postman o del navegador mostrando el rechazo (Codigo 403) al intentar vulnerar la URL.
- **Verificacion:** Prueba de control de acceso (IDOR): Iniciar sesion con Usuario A. Obtener el ID de un mensaje enviado entre los Usuarios B y C. Escribir manualmente la URL de ese mensaje en el navegador del Usuario A y verificar que el sistema deniegue el acceso.

## RNF-016: Seguridad — Acceso Restringido (HU16, HU17)

- **Metrica:** El 100% de las funciones del modulo de administracion deben estar protegidas, permitiendo el acceso unicamente a usuarios con el `id_rol` de Administrador.
- **Evidencia:** Captura de pantalla de un error 403 (Forbidden) al intentar ingresar a la ruta `/admin` con una cuenta de Voluntario.
- **Verificacion:** Intento de acceso forzado mediante la URL. El sistema debe redirigir al Login o mostrar acceso denegado si la sesion no es administrativa.

## RNF-017: Integridad — Auditoria de Acciones (HU17)

- **Metrica:** Toda accion de eliminacion realizada por el administrador debe quedar registrada en la base de datos con fecha y ID del administrador para evitar abusos de poder.
- **Evidencia:** Captura de la tabla de registros (logs) mostrando quien elimino que contenido.
- **Verificacion:** Realizar una eliminacion de prueba y verificar mediante una consulta a la base de datos que se genero el registro de auditoria correspondiente.
