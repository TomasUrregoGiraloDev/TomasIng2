# Bitacora del proyecto

**Equipo**

| Integrante | Modulo | Tablas asignadas |
|---|---|---|
| Tomas Urrego Giraldo | Usuarios y Comunicaciones | ROL, USUARIO, PERFIL_VOLUNTARIO, PERFIL_ORGANIZACION, PERFIL_ADMIN, MENSAJE, NOTIFICACION |
| Albert Higuita Bautista | Campanas y Actividades | CATEGORIA, CIUDAD, ACTIVIDAD, INSCRIPCION, RESENA, e integracion con IA (reportes) |

Cada entrada semanal lista el aporte de cada integrante por separado.

---

## Semana 1 — hasta 2026-04-17 (Estructura del Proyecto)

### Tomas

- Cree el repositorio en GitHub (`Santiago20022/TomasIng2`) con la estructura exigida por la guia: `src/`, `docs/`, `tests/` y los archivos `README.md`, `BITACORA.md`, `DECISIONES.md`.
- Definimos con Albert el stack: Node.js + Express + Sequelize en backend y React + Vite + Tailwind en frontend (ver Decision #01 y #02 en `DECISIONES.md`).
- Configure el `docker-compose.yml` con MySQL 8 expuesto en el puerto 3307 para no chocar con instalaciones locales.

¿Que problema encontre?
- El equipo arranco con Spring Boot por sugerencia de un compañero, pero ninguno de los dos manejaba Java. La curva era incompatible con el cronograma.

¿Como lo resolvi?
- Migramos a un stack que ambos podemos defender. Lo dejamos justificado en `DECISIONES.md` para la profesora.

¿Use IA? Si — Anthropic Claude para validar la estructura de carpetas contra el documento de la guia. Yo ajuste manualmente los nombres de las fases (`fase1-arquitectura/`, `fase2-datos/`, etc.) para que coincidieran con el indice del documento.

### Albert

- Defini la organizacion de carpetas dentro de `src/backend/`: `models/`, `services/`, `controllers/`, `routes/`, `middlewares/`, `utils/`, `seeders/` (ver `docs/diseno/fase1-arquitectura/E5-diagrama-componentes-UML.md`).
- Cree el `package.json` raiz del monorepo y los scripts utiles (`db:up`, `backend:dev`, `frontend:dev`, `dev`, `test:e2e`).
- Cree el `.env.example` con todas las variables que iban a hacer falta (DB, JWT, GROQ).

¿Use IA? Si — pedi sugerencias para el `docker-compose.yml` con MySQL 8. Lo ajuste manualmente para que el `ddl.sql` se ejecute como `docker-entrypoint-initdb.d` y no tener que correr el script aparte.

---

## Semana 2 — hasta 2026-04-25 (Capa de Datos)

### Tomas

- Implemente los modelos Sequelize de mi modulo: `Rol`, `Usuario`, `PerfilVoluntario`, `PerfilOrganizacion`, `PerfilAdmin`, `Mensaje`, `Notificacion`. Use los nombres exactos del DDL del documento de diseño (`id_usuario`, `correo_electronico`, `contrasena`, `nombre_institucion`, `nit_registro`).
- Defini las asociaciones 1:1 entre `USUARIO` y los tres tipos de perfil, y las relaciones N:1 con `ROL` y `CIUDAD`.
- Agregue el seeder de catalogos del modulo: roles (VOLUNTARIO, ORGANIZACION, ADMIN) y los tres usuarios demo (`voluntario@demo.com`, `org@demo.com`, `admin@demo.com` con contraseña `Demo1234`).

¿Que problema encontre?
- Sequelize por defecto genera claves foraneas tipo `usuarioId`, pero el DDL exige `id_usuario`. Las primeras consultas con `include` me devolvian filas vacias porque el alias no coincidia.

¿Como lo resolvi?
- Defini `foreignKey` y `as` explicitos en cada `belongsTo` / `hasOne` / `hasMany`.

¿Use IA? Si — para encontrar el bug de los aliases. Despues lo verifique con `console.log` del SQL generado.

### Albert

- Implemente los modelos Sequelize de mi modulo: `Categoria`, `Ciudad`, `Actividad`, `Inscripcion`, `Resena`.
- Defini las relaciones: `PerfilOrganizacion 1:N Actividad`, `Actividad 1:N Inscripcion`, `PerfilVoluntario 1:N Inscripcion`, `Inscripcion 1:N Resena`.
- Cree el seeder de actividades demo: 5 actividades de la Fundacion Ambiental Verde (Reforestacion, Limpieza del Rio, Taller Ambiental, Brigada Animal, Festival de Lectura).

¿Que problema encontre?
- En MySQL 8, `cupos_disponibles INT DEFAULT 0` y un `CHECK` que valide consistencia con `cupos_totales` no se podia poner en una sola constraint sin romper migraciones futuras.

¿Como lo resolvi?
- Mantuve el CHECK simple (`cupos_disponibles >= 0`) en el DDL y validar la cota superior en la capa de servicio (`InscripcionService.cambiarEstado`).

¿Use IA? Si — para resolver el orden de creacion de tablas en el DDL para que las FKs no fallaran.

---

## Semana 3 — hasta 2026-05-02 (Logica de Negocio: Catalogos y Auth)

### Tomas

- Implemente la capa de autenticacion: `AuthService.registrarVoluntario`, `registrarOrganizacion`, `login`, `obtenerUsuarioActual`.
- Cree `middlewares/auth.js` (validacion de JWT) y `middlewares/rol.js` (`requireRol(...)` para restringir endpoints).
- Cree los esquemas de validacion con `zod` para los payloads de registro y login.

¿Que problema encontre?
- Los formularios del frontend mandan `id_ciudad` como string (`"3"`), y `z.number()` lo rechazaba.

¿Como lo resolvi?
- Use `z.coerce.number().int()` en los esquemas para que Zod convierta strings a numeros automaticamente.

¿Use IA? Si — borrador inicial del esquema. Lo personalice con los campos del diccionario de datos (E7).

### Albert

- Implemente los endpoints de catalogos publicos: `GET /api/catalogos/ciudades`, `categorias`, `estados-actividad`. Estos no requieren autenticacion porque el frontend los necesita en los formularios de registro.
- Defini la convencion de respuestas de error: `{ error, details }` con codigos HTTP semanticos (400 datos invalidos, 401 sin token, 403 sin rol, 404 no encontrado, 409 conflicto).

¿Use IA? No — fue una refactorizacion mecanica del manejo de errores en el `errorHandler` central.

---

## Semana 4 — hasta 2026-05-09 (Primeras Tablas Transaccionales)

### Tomas

- Implemente el endpoint `GET /api/perfil` y `PUT /api/perfil`, con discriminacion automatica por rol (devuelve el perfil del rol del usuario logueado).
- Cree las paginas frontend `Login`, `RegistroVoluntario`, `RegistroOrganizacion` y `Perfil`, con validacion en cliente, manejo de errores inline y redireccion por rol despues del login.
- `AuthContext` (React Context API) para guardar el usuario en sesion y exponer `login` / `logout` / `recargar` a toda la app.
- `ProtectedRoute roles={[...]}` que redirige al login si no hay sesion o al home si el rol no es el correcto.

¿Que problema encontre?
- Cuando guardaba el token en `localStorage` y recargaba la pagina, el header `Authorization` no se enviaba en la primera peticion porque el AuthContext aun no habia hidratado.

¿Como lo resolvi?
- Configure el interceptor de axios para que lea `localStorage` en cada request, no solo al inicializar.

¿Use IA? Si — para el patron de `useAuth` hook y el manejo de la promesa pendiente al iniciar.

### Albert

- Implemente `ActividadService.listar` con filtros opcionales: `q` (titulo), `id_categoria`, `id_ciudad`, `fecha`, `id_organizacion`. Excluye por defecto borradores y canceladas.
- Implemente `ActividadService.crear`, `actualizar`, `cancelar` y `eliminar` con la regla: solo organizaciones VERIFICADAS pueden publicar (RF-005, RNF-013).
- Cree las paginas frontend `VolBuscarActividades` (lista con buscador y filtros), `OrgPublicarActividad` (formulario completo) y `OrgMisActividades` (listado del lado de la org con boton Editar / Cancelar / Eliminar).

¿Que problema encontre?
- Si un voluntario buscaba "Limpieza" y ya estaba inscrito, el componente `ActivityCard` no le mostraba estado. Quedaba ambiguo.

¿Como lo resolvi?
- Agregue logica al detalle de actividad para distinguir tres estados visualmente: "Inscribirme", "Ya estas inscrito" y "Sin cupos".

¿Use IA? Si — para diseñar el filtro `Op.like` con escape de caracteres especiales.

---

## Semana 5 — hasta 2026-05-16 (Segunda Tabla Transaccional + Reglas de Negocio)

### Tomas

- Implemente `MensajeService.listarConversaciones` (agrupa por contraparte y suma no leidos) y `obtenerConversacion` (con marcado automatico de leido).
- Implemente `NotificacionService.crearNotificacion`, `listarPorUsuario`, `marcarLeida`. Esta el corazon del modulo de comunicaciones: cualquier accion del backend que necesite avisar al usuario llama a este service.
- Cree las paginas `Mensajes` (estilo chat con sidebar de conversaciones + ventana de hilo) y `Notificaciones` (lista con marcado individual).

Regla de negocio implementada:
- Cada mensaje crea automaticamente una `NOTIFICACION` para el destinatario (`tipo: 'MENSAJE_NUEVO'`).

¿Que problema encontre?
- En el sidebar de conversaciones, ordenar por fecha del ultimo mensaje requeria deduplicar por contraparte. Si hacia un `GROUP BY` perdia el `contenido` del ultimo mensaje.

¿Como lo resolvi?
- Hago el query simple (todos los mensajes ordenados por fecha desc) y deduplico en JS armando un Map con `contraparte.id` como clave; el primero en entrar es el ultimo en el tiempo.

¿Use IA? Si — para confirmar que el patron del Map era mas eficiente que un query con subselect.

### Albert

- Implemente `InscripcionService.crear` con bloqueo concurrente (transaccion + `LOCK_UPDATE`) para evitar sobrecupos cuando multiples voluntarios se inscriben al mismo tiempo (RF-007).
- Implemente `InscripcionService.cambiarEstado` con dos reglas:
  - Al APROBAR, decrementa `cupos_disponibles` atomicamente y crea una NOTIFICACION para el voluntario (`INSCRIPCION_APROBADA`).
  - Al RECHAZAR una previamente APROBADA, devuelve el cupo y notifica.
- Implemente `ResenaService.crear` con la regla: solo voluntarios con `estado_solicitud = 'ASISTIO'` pueden reseñar (RF-014).
- Cree las paginas `OrgInscripciones` (con tabs Pendientes / Aprobadas / Rechazadas / Asistencia) y `VolMisInscripciones` (con boton "Calificar" para inscripciones ya asistidas).

¿Que problema encontre?
- Bug raro al usar `Op.in` desde `Symbol.for('Op.in')` (no funcionaba). Sequelize lo ignoraba en silencio y la query devolvia todo sin el filtro.

¿Como lo resolvi?
- Importar `Op` directamente desde `sequelize` y usar la sintaxis estandar `{ [Op.in]: ids }`.

¿Use IA? Si — para encontrar la causa raiz del Op.in.

---

## Semana 6 — hasta 2026-05-23 (Capa de Presentacion: Admin + IA + Pulido)

### Tomas

- Implemente las paginas administrativas comunes: `AdminInscripciones` (vista global con tabs) y la integracion del badge de notificaciones en el `Layout`.
- Refactorice los componentes de UI propios (`Button`, `Input`, `Modal`, `Tabs`, `Badge`, `EmptyState`, `Avatar`, `Skeleton`, `ImageUploader`) para que mantengan un sistema de diseño coherente sin dependencias externas como Material UI o Andes (Decision #02).
- Verifique que ningun archivo del proyecto contiene emojis en codigo (`grep` recursivo, devuelve cero coincidencias).

¿Que problema encontre?
- Cuando una organizacion hacia click en una de sus actividades desde el dashboard, la app la mandaba a `/voluntario/actividad/:id`, que esta protegida solo para voluntarios → quedaba en blanco.

¿Como lo resolvi?
- Cree la pagina `/organizacion/actividad/:id/editar` con un formulario de edicion completo, y cambie todos los enlaces internos del dashboard para apuntar ahi.

¿Use IA? Si — borradores iniciales de los componentes. Los renombre, ajuste paddings a la escala de 4px y elimine clases innecesarias.

### Albert

- Implemente `AdminService.listarOrganizaciones`, `cambiarEstadoOrganizacion` (con notificacion automatica al verificar) y `obtenerEstadisticas` (counts y group by para el dashboard del admin).
- Implemente `ReporteIAService.generarReporte`: arma un prompt con las estadisticas reales de la plataforma y llama a Groq (modelo `llama-3.3-70b-versatile`). Si no hay `GROQ_API_KEY` configurada, devuelve 503 con mensaje claro.
- Cree las paginas `AdminDashboard` (KPIs + actividades por categoria), `AdminOrganizaciones` (con accion Verificar / Suspender) y `AdminReportes` (boton Generar reporte que muestra el texto en una tarjeta).

Otras mejoras:
- Permiti que el voluntario suba una imagen desde su computador (componente `ImageUploader`, conversion a base64, limite 800 KB).
- Agregue restriccion en el formulario de publicar actividad: la fecha del evento no puede estar en el pasado (validacion en cliente con `min` y en server con Zod refine).
- Agregue un link a Google Maps en el detalle de la actividad usando la direccion + ciudad.
- Permiti multiples reseñas por inscripcion (Decision #09).

¿Que problema encontre?
- El primer modelo que use de Groq (`llama-3.1-70b-versatile`) fue dado de baja, el endpoint devolvia 400.

¿Como lo resolvi?
- Lo cambie por `llama-3.3-70b-versatile` y dejo el modelo en una variable de entorno (`GROQ_MODEL`) por si lo deprecan en el futuro.

¿Use IA? Si — el prompt para Groq lo iteramos varias veces hasta que el output saliera limpio (sin emojis, en español neutro, con secciones claras).

---

## Semana 7 — hasta 2026-06-05 (Tests + Documentacion + Entrega Final)

### Tomas

- Configure Playwright (`playwright.config.js` con `webServer` que arranca backend y frontend, `globalSetup` que reinicia y siembra la BD).
- Escribi los specs de mi modulo: `auth.spec.js` (6 tests), `mensajes.spec.js` (2 tests), `notificaciones.spec.js` (2 tests). Cada test usa `data-testid` para no acoplarse al texto visible.
- Complete la documentacion del modulo: matrices `M1`, `M3` (componentes propios), `M5` (reglas de negocio del modulo Tomas), `M9` (clases y metodos con CU/RF), `M12` (pantallas por rol).

### Albert

- Escribi los specs de mi modulo: `voluntario.spec.js` (6 tests, incluye Google Maps), `organizacion.spec.js` (5 tests, incluye editar), `admin.spec.js` (4 tests, incluye reporte IA).
- Complete las matrices `M2`, `M4`, `M6`, `M7`, `M8`, `M10`, `M11`, `M13` y los artefactos `E1`–`E17` que faltaban.

### Resultado conjunto

- 25 tests E2E pasando en ~17 segundos.
- 24 archivos de documentacion (analisis + diseño + trazabilidad).
- Repo publico en https://github.com/Santiago20022/TomasIng2 con README detallado para que cualquiera pueda clonar y correr la app.
- Cuentas demo con datos suficientes para defender la app sin necesidad de crear nada en vivo (incluso una inscripcion ya en estado ASISTIO con reseña creada).

---

## Reflexion final

**Tomas**: Lo que mas me costo fue alinear los nombres exactos del DDL (`id_usuario`, `correo_electronico`, etc.) con la convencion JS. Una vez fijada la regla, el resto fluyo. Si rehiciera el diseño, agregaria un campo `cupos_totales` a `ACTIVIDAD` desde el principio (lo necesite para mostrar "X de Y disponibles" y termino siendo una extension justificada en `DECISIONES.md`).

**Albert**: Lo mas duro fue depurar el bug de `Op.in` y el bloqueo concurrente de cupos. La leccion: siempre que toques un contador con varias escrituras simultaneas, usa transaccion + lock. Si rehiciera el diseño, separaria la entidad `RESENA` para permitir multiples reseñas por inscripcion desde el inicio (lo terminamos cambiando en la semana 6, ver Decision #09).

**Aprendizaje en comun**: separar limpiamente service / controller / route mantiene los archivos chicos y facilita defender cualquier endpoint en una sesion individual sin tener que abrir todo el proyecto.
