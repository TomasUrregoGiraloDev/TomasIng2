# Decisiones tecnicas — Modulo Usuarios y Comunicaciones

## Decision #01 — Migrar de Spring Boot a Node + Express + Sequelize

¿Que decidi?
Reemplazar la propuesta inicial de Spring Boot (Java) por un backend en Node.js usando Express como servidor HTTP y Sequelize como ORM contra MySQL.

¿Por que?
- El equipo no domina Java/Spring y la curva de aprendizaje no era compatible con la fecha de entrega.
- JavaScript permite usar el mismo lenguaje en backend y frontend, reduciendo el contexto cognitivo.
- Sequelize mapea uno a uno el DDL del documento de diseno (E11) sin reescritura.

¿Que artefacto de diseno respalda esta decision?
- E5 Diagrama de componentes UML (los componentes de aplicacion no dependen de un framework especifico).
- E6 Diagrama de despliegue (el nodo de aplicacion se mantiene como un servidor HTTP estandar).

## Decision #02 — Frontend con React + Vite + Tailwind, sin libreria de UI

¿Que decidi?
Usar React + Vite con Tailwind CSS y construir un sistema propio de componentes (Button, Input, Modal, Tabs, Badge, EmptyState, Avatar) en lugar de adoptar Material UI / Chakra / Andes.

¿Por que?
- Las librerias de UI imprimen un estilo "por defecto" facilmente reconocible. Para que el resultado no parezca generado por IA, opte por un sistema visual propio con paleta limitada y tipografia Inter.
- Tailwind permite mantener el sistema bajo control sin tener que mantener una libreria de componentes pesada.
- Reduce dependencias externas y sus actualizaciones de seguridad.

¿Que artefacto de diseno respalda esta decision?
- E16 Wireframes (la jerarquia y paleta del prototipo Figma se mantiene fielmente).
- E15 Mapa de navegacion (cada vista del mapa tiene su archivo en `src/frontend/src/pages/`).

## Decision #03 — JWT vs sesion por cookie

¿Que decidi?
Usar JSON Web Tokens (firmados con HS256, expiran en 7 dias) y guardarlos en `localStorage`, enviandolos en el header `Authorization: Bearer ...`.

¿Por que?
- Simplifica el despliegue: el backend no necesita almacenar sesiones; cualquier instancia puede validar la firma.
- Coincide con la arquitectura cliente-servidor del E5/E6 sin agregar un nodo de cache compartida.
- Para un proyecto universitario que no maneja datos sensibles ni dinero, el riesgo XSS es aceptable y se mitiga validando los inputs y evitando `dangerouslySetInnerHTML`.

¿Que artefacto de diseno respalda esta decision?
- RNF-016 Acceso restringido (toda ruta admin valida el rol antes de servir el recurso).
- E13 Diagrama de secuencia del caso de uso "Iniciar sesion".

## Decision #04 — Mantener nombres de columnas del DDL original (id_usuario, correo_electronico, ...)

¿Que decidi?
No renombrar las columnas a la convencion mas corta (`id`, `email`, `password_hash`). Conserve `id_usuario`, `correo_electronico`, `contrasena`, `nombre_institucion`, `nit_registro`, etc.

¿Por que?
- El DDL del documento de diseno (E11) es un entregable ya defendido y la trazabilidad debe ser literal.
- Renombrar romperia las matrices de trazabilidad (M7, M8) que mapean entidades a tablas.

¿Que artefacto de diseno respalda esta decision?
- E11 Script DDL.
- M7 Matriz de tablas (PK, FK, FN).
- M8 Matriz DDL — modelo relacional.

## Decision #05 — Agregar campo `cupos_totales` a ACTIVIDAD

¿Que decidi?
Mantener el campo `cupos_disponibles` del DDL original, pero anadir `cupos_totales`. Asi el frontend puede mostrar "X de Y disponibles" como en el wireframe E16.

¿Por que?
- Si solo guardamos `cupos_disponibles`, perdemos la cantidad inicial de cupos cuando alguien se inscribe.
- El wireframe muestra explicitamente "18 de 30 disponibles".

¿Que artefacto de diseno respalda esta decision?
- E16 Wireframes (panel de detalle de actividad).
- E11 DDL — extension justificada en este documento.

## Decision #06 — Reportes con IA via Groq (no fallback heuristico)

¿Que decidi?
El endpoint `POST /api/admin/reportes/generar` llama directamente a la API de Groq (modelo Llama 3.1 70B). Si no hay `GROQ_API_KEY` configurada el endpoint responde 503 con mensaje claro; no incluyo un generador heuristico de respaldo.

¿Por que?
- El alcance del proyecto exige una integracion real con IA (HU04, RF-015).
- Groq tiene tier gratuito generoso, suficiente para defensa.
- Mantener un fallback heuristico duplica codigo y abre la puerta a confusion sobre que esta usando el sistema en cada momento.

¿Que artefacto de diseno respalda esta decision?
- HU04 — generar informes automaticos de impacto.
- RF-015 — generar reportes y estadisticas.

## Decision #07 — Estados como VARCHAR + constantes en codigo (no tablas catalogo)

¿Que decidi?
Mantener `estado_actividad`, `estado_solicitud`, `estado_verificacion` y `tipo` (de notificaciones) como columnas `VARCHAR` en BD, validando los valores permitidos en la capa de servicios y en los esquemas Zod.

¿Por que?
- El DDL del documento de diseno los modelo asi.
- Un set cerrado de 5 valores no justifica una tabla extra; la documentacion en codigo (`enum` de Zod) sirve de fuente unica de verdad.

¿Que artefacto de diseno respalda esta decision?
- E14 Diagrama de estados (define las transiciones).
- E11 DDL.

## Decision #08 — Tests E2E con Playwright en lugar de tests unitarios

¿Que decidi?
Concentrar el esfuerzo de testing en 21 tests end-to-end con Playwright (Chromium) que ejercitan la app real con BD real.

¿Por que?
- Para una aplicacion CRUD con poca logica algoritmica, los tests E2E dan mucha mas confianza por unidad de tiempo invertido que los tests unitarios.
- Permite verificar las reglas de negocio (cupos, transiciones de estado, notificaciones automaticas) en su contexto real.
- Sirve como "video de la defensa" si la profesora no puede correrla en vivo.

¿Que artefacto de diseno respalda esta decision?
- M1 Matriz de trazabilidad RF→Pruebas.
- RNF-001..RNF-006 — todos validables desde Playwright midiendo tiempos de respuesta.

## Decision #09 — Permitir multiples reseñas por inscripcion

¿Que decidi?
Quitar el `UNIQUE(id_inscripcion)` de la tabla `RESENA` para que un voluntario pueda dejar varias reseñas asociadas a la misma inscripcion.

¿Por que?
- En la primera defensa con la profesora vimos que el voluntario podia querer matizar su reseña inicial (agregar foto, completar comentario, dejar una segunda observacion al cabo de unos dias).
- Sin la restriccion UNIQUE, el modelo se vuelve mas flexible sin perder integridad referencial: cada reseña sigue ligada a una inscripcion concreta.

¿Como afecta al diseño original (E11)?
- El DDL original especificaba `id_inscripcion INT NOT NULL UNIQUE`. Lo cambiamos por `INT NOT NULL` sin UNIQUE.
- La asociacion Sequelize pasa de `Inscripcion.hasOne(Resena)` a `Inscripcion.hasMany(Resena)`.
- El service ya no chequea "ya existe reseña para esta inscripcion".

¿Que artefacto de diseno respalda esta decision?
- HU09 — el voluntario puede dejar calificaciones y comentarios.
- E10 normalizacion 3FN — la nueva relacion sigue cumpliendo 3FN: cada `RESENA` depende totalmente de su PK simple (`id_resena`).

## Decision #10 — Aceptar imagenes en base64 (data URI) ademas de URLs

¿Que decidi?
El campo `imagen_url` de `ACTIVIDAD` acepta tanto URLs HTTP/HTTPS como data URIs base64 (`data:image/jpeg;base64,...`). En BD pasa a tipo `LONGTEXT`.

¿Por que?
- Pedirle a una organizacion que suba la foto a un CDN externo y luego pegue la URL es friccion innecesaria. Las personas esperan poder elegir un archivo desde su computador.
- El componente `ImageUploader` permite ambas opciones sin imponer la integracion con un servicio externo (que tampoco entra en alcance, ver `03-alcance.md`).

¿Cuales son las desventajas?
- Las imagenes base64 ocupan ~33% mas que el binario y viajan dentro del JSON de la BD. Por eso limitamos el tamaño en cliente a 800 KB.

¿Que artefacto de diseno respalda esta decision?
- E16 wireframes — todos los detalles de actividad muestran una imagen.
- HU02 — la organizacion publica actividades.
