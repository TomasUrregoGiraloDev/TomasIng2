# Bitacora — Modulo Usuarios y Comunicaciones

## Entrada #01 — 2026-04-17 (Fase 1: Estructura del Proyecto)

¿Que hice?
- Inicialice el repositorio con la estructura exigida (`src/`, `docs/`, `tests/`, README, BITACORA, DECISIONES).
- Configure el monorepo con `package.json` raiz, `docker-compose.yml` para MySQL 8 y `.env.example`.
- Subi el script DDL a `src/database/ddl.sql`.

¿Que problema encontre?
- El equipo arranco con Spring Boot por sugerencia de un companero, pero ninguno conocia el ecosistema Java.

¿Como lo resolvi?
- Migramos a un stack que ya maneja el equipo: Node + Express + Sequelize en backend y React + Vite + Tailwind en frontend. La justificacion completa quedo en `DECISIONES.md`.

¿Use IA? Si — Anthropic Claude. Pedi ayuda para definir la estructura de carpetas y validar que cumpliera la guia entregada por la profesora; ajuste manualmente los nombres y la separacion `docs/diseno/faseX/` segun los entregables E1..E17.

## Entrada #02 — 2026-04-25 (Fase 2: Capa de Datos)

¿Que hice?
- Implemente los 12 modelos de Sequelize alineados al DDL del documento de diseno (PKs `id_xxx`, columnas como `correo_electronico`, `contrasena`, `nombre_institucion`, `nit_registro`).
- Agregue `voluntariado@demo` con seeders de catalogos (roles, ciudades, categorias) y 4 usuarios de prueba (voluntario, organizacion verificada, organizacion pendiente, admin).

¿Que problema encontre?
- Sequelize por defecto usa `camelCase` en JS y `snake_case` en BD; al usar PKs personalizadas (`id_usuario`, `id_voluntario`, etc.) las asociaciones por defecto no funcionaban.

¿Como lo resolvi?
- Defini explicitamente `foreignKey` en cada `belongsTo` / `hasMany` y use `as` para los alias visibles en las consultas (`organizacion`, `voluntario`, etc.).

¿Use IA? Si — apoyo para revisar las relaciones 1:1 y la pareja `findOrCreate` en seeders.

## Entrada #03 — 2026-05-02 (Fase 3: Logica de Negocio - Catalogos y Auth)

¿Que hice?
- Capa de autenticacion completa: registro de voluntario, registro de organizacion, login y `/me`.
- Middleware `authRequired` con JWT, `requireRol` para restringir endpoints por rol.
- Validacion de payloads con `zod`.

¿Que problema encontre?
- Los formularios del frontend enviaban `id_ciudad` como string, lo que rompia la validacion estricta de Zod.

¿Como lo resolvi?
- Use `z.coerce.number()` en los esquemas para que el backend acepte tanto el numero como el string desde el formulario.

¿Use IA? Si — apoyo para sketch del esquema Zod, despues lo personalice con los campos del diccionario de datos.

## Entrada #04 — 2026-05-09 (Fase 3 cont.: Actividades + Inscripciones)

¿Que hice?
- CRUD completo de `actividad` con regla de negocio: solo organizaciones VERIFICADAS pueden publicar (RNF-013, RF-005).
- Inscripcion con bloqueo concurrente (transaccion + lock) para evitar sobrecupo (RF-007).
- Notificacion automatica al voluntario cuando la organizacion aprueba/rechaza la inscripcion (RF-010).

¿Que problema encontre?
- Bug raro al usar `Op.in` en una variable serializada con `Symbol.for('Op.in')`; Sequelize lo ignoraba silenciosamente.

¿Como lo resolvi?
- Importar `Op` directamente desde `sequelize` y construir la clausula con la sintaxis estandar.

¿Use IA? Si — para encontrar la causa raiz del bug del `Op.in`.

## Entrada #05 — 2026-05-16 (Fase 4: Capa de Presentacion)

¿Que hice?
- Vite + Tailwind + React Router con `AuthContext` y `ProtectedRoute`.
- Sistema de componentes propio (Button, Input, Modal, Tabs, Badge, EmptyState, Avatar). Sin librerias externas de UI: queremos que se vea hecho a mano y no generado por IA.
- 16 paginas conectadas a la API real (sin mocks).
- Integracion con la API de Groq para generar reportes ejecutivos en `/admin/reportes`.

¿Que problema encontre?
- Las imagenes externas a veces no cargaban (sin internet o URL caida); usar siempre stock photos generaria una sensacion de plantilla.

¿Como lo resolvi?
- Componente `ImagePlaceholder` con iniciales y color generado a partir del titulo, como fallback cuando no hay `imagen_url`.

¿Use IA? Si — borradores iniciales de algunos componentes; los renombre, eliminé clases redundantes y ajuste paddings para que respetaran la escala 4px.

## Entrada #06 — 2026-05-23 (Fase 4 cont.: Tests + Documentacion)

¿Que hice?
- 21 tests E2E con Playwright que cubren: home, registro, login, navegacion por rol, busqueda de actividades, inscripcion (modal de confirmacion), aprobacion desde la organizacion, verificacion desde el admin, generacion de reporte IA (skip si no hay GROQ_API_KEY), envio de mensajes, marcado de notificaciones leidas.
- Documentacion E1..E17 + matrices M1..M13 actualizadas a la implementacion real.

¿Que problema encontre?
- Los tests fallaban si la BD se quedaba con datos de un test anterior.

¿Como lo resolvi?
- `globalSetup` reinicia el esquema y siembra los datos de demo antes de toda la corrida; cada test que crea recursos los revierte en su `afterEach`.

¿Use IA? Si — primer borrador del `globalSetup`. Despues lo refactorice para que el reset solo corra una vez.

## Reflexion final

- Lo que mas costo: alinear los nombres exactos del DDL del documento de diseno (`id_usuario`, `correo_electronico`, etc.) con la convencion JS. Una vez fijada la regla, el resto fluyo.
- Lo que cambiaria del diseno original: agregaria un campo `cupos_totales` a `ACTIVIDAD` (lo necesite para mostrar "X de Y disponibles"); el DDL original solo trae `cupos_disponibles`. Esta extension esta documentada en DECISIONES.md.
- Lo aprendido: separar claramente service / controller / route mantiene los archivos chicos y permite reutilizar logica de negocio entre endpoints (la creacion de notificacion automatica vive en `NotificacionService` y la usan tres flujos distintos).
