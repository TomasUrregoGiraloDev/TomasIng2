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

---

## Seccion: Cambios en el modelo de datos respecto al documento de diseno (24/04/2026)

Esta seccion documenta cada diferencia entre el diccionario de datos / DDL del documento de ingenieria de software (version 24/04/2026) y el modelo implementado en el repositorio. El objetivo es garantizar trazabilidad completa sin alterar el codigo existente.

---

### Cambio M-01 — Tabla ACTIVIDAD: eliminacion de `horas_estimadas` y tabla catalogo `ESTADO_ACTIVIDAD`

**Documento de diseno:** Definia `horas_estimadas INT NOT NULL` como columna de ACTIVIDAD, y una tabla catalogo separada `ESTADO_ACTIVIDAD (id_estado_actividad, nombre_estado)` con FK en ACTIVIDAD.

**Implementacion actual:** Se elimino `horas_estimadas` y la tabla `ESTADO_ACTIVIDAD`. El estado se maneja con `estado_actividad VARCHAR(20) DEFAULT 'PUBLICADA'` directamente en ACTIVIDAD (valores: PUBLICADA, EN_CURSO, FINALIZADA, CANCELADA).

**Razon del cambio:**
- Las horas de una actividad son variables segun el voluntario; registrarlas en la actividad era un dato estimado sin utilidad real en las consultas de inscripcion.
- Una tabla catalogo de 3-4 fijas no justifica un JOIN adicional en cada consulta; el enum Zod en codigo sirve como fuente de verdad (ver Decision #07).

**Artefactos afectados:** E7 (diccionario de datos), E11 (DDL), E14 (diagrama de estados).

---

### Cambio M-02 — Tabla ACTIVIDAD: adicion de `cupos_disponibles` e `imagen_url`

**Documento de diseno:** No definia los campos `cupos_disponibles` ni `imagen_url` en ACTIVIDAD.

**Implementacion actual:** Se agregaron:
- `cupos_disponibles INT NOT NULL DEFAULT 0` — permite mostrar "X de Y disponibles" en el frontend (ver Decision #05).
- `imagen_url LONGTEXT` — acepta URL o base64 para la foto de portada de la actividad (ver Decision #10).

**Razon del cambio:** Ambos campos son requeridos por los wireframes (E16) y no estaban contemplados en el documento inicial.

**Artefactos afectados:** E7, E11, E16.

---

### Cambio M-03 — Tabla INSCRIPCION: ampliacion de estados y restriccion UNIQUE

**Documento de diseno:** Definia una tabla catalogo `ESTADO_INSCRIPCION` con 3 estados: Pendiente, Aceptada, Asistio. La columna en INSCRIPCION era `id_estado_inscripcion INT FK`.

**Implementacion actual:** Se elimino la tabla catalogo. Se usa `estado_solicitud VARCHAR(20) DEFAULT 'PENDIENTE'` con 5 estados: PENDIENTE, APROBADA, RECHAZADA, ASISTIO, NO_ASISTIO. Se agrego ademas la restriccion `UNIQUE (id_voluntario, id_actividad)` para evitar inscripciones duplicadas.

**Razon del cambio:**
- "Aceptada" se renombro a "APROBADA" para mayor claridad semantica.
- Se agrego "RECHAZADA" (el documento solo tenia Aceptada/Asistio, sin contemplar el rechazo explicito — necesario para CU-07).
- Se agrego "NO_ASISTIO" para diferenciar entre quien asistio y quien no, util para los reportes de impacto (RF-015).
- La restriccion UNIQUE evita que un mismo voluntario se inscriba dos veces a la misma actividad sin necesidad de logica adicional en el servicio.

**Artefactos afectados:** E7, E11, E14 (diagrama de estados de inscripcion), M11.

---

### Cambio M-04 — Tabla NOTIFICACION: eliminacion de tabla catalogo `TIPO_NOTIFICACION` y adicion de `titulo`

**Documento de diseno:** Definia `TIPO_NOTIFICACION (id_tipo_notificacion, nombre_tipo)` como tabla catalogo separada, con FK en NOTIFICACION. El campo `mensaje` era `VARCHAR(255)`.

**Implementacion actual:** Se elimino la tabla catalogo. Se usa `tipo VARCHAR(40) DEFAULT 'GENERAL'` inline. Se agrego `titulo VARCHAR(150) NOT NULL` y se amplio `mensaje` a `VARCHAR(500)`.

**Razon del cambio:**
- Misma razon que M-01: un catalogo de tipos fijos no justifica un JOIN en cada consulta de notificaciones.
- El campo `titulo` es necesario para mostrar una cabecera en la campana de notificaciones del frontend antes de que el usuario expanda el mensaje completo.
- El mensaje de 255 caracteres era insuficiente para notificaciones con contexto (nombre de actividad + organizacion + estado).

**Artefactos afectados:** E7, E11.

---

### Cambio M-05 — Tabla PERFIL_ORGANIZACION: adicion de `telefono` y `estado_verificacion`

**Documento de diseno:** No definia `telefono` ni `estado_verificacion` en PERFIL_ORGANIZACION. Tambien presentaba un typo en el diccionario: el campo aparecia como `nit_register` (incorrecto); en el DDL del mismo documento ya estaba correcto como `nit_registro`.

**Implementacion actual:** Se agregaron:
- `telefono VARCHAR(20) NULL` — requerido por el formulario de registro de organizaciones (E16).
- `estado_verificacion VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE'` — estados: PENDIENTE, VERIFICADA, SUSPENDIDA. Necesario para CU-11 (RF-016, HU16).

**Razon del cambio:** El modulo de administracion (CU-11) requiere que el admin pueda verificar o suspender organizaciones, lo cual exige un campo de estado en el perfil. El telefono es un dato de contacto elemental solicitado en los wireframes del registro.

**Artefactos afectados:** E7, E11, E2 (tabla de interacciones del Admin), CU-11.

---

### Cambio M-06 — Tabla PERFIL_ADMINISTRADOR renombrada a PERFIL_ADMIN; adicion de `nombre` y `apellido`

**Documento de diseno:** Tabla llamada `perfil_administrador` con columnas `id_admin`, `nivel_acceso`, `id_usuario`.

**Implementacion actual:** Tabla llamada `PERFIL_ADMIN` con columnas `id_admin`, `nombre VARCHAR(100) NOT NULL`, `apellido VARCHAR(100) NOT NULL`, `id_usuario`. Se elimino `nivel_acceso`.

**Razon del cambio:**
- En la version 1 todos los administradores tienen el mismo nivel de acceso; el campo `nivel_acceso` era prematuro para una sola instancia de admin.
- El nombre y apellido son necesarios para mostrar quien realizo cada accion en el log de auditoria (RNF-017).
- El nombre corto `PERFIL_ADMIN` sigue la convencion de los otros perfiles del sistema.

**Artefactos afectados:** E7, E11.

---

### Cambio M-07 — Tabla MENSAJE: renombre de columnas y adicion de `leido`

**Documento de diseno:** Columnas `id_remitente` e `id_destinatario` sin prefijo descriptivo.

**Implementacion actual:** Columnas renombradas a `id_usuario_remitente` e `id_usuario_destinatario` para mayor claridad de la FK. Se agrego `leido BOOLEAN DEFAULT FALSE` para soportar el indicador de mensaje no leido en el frontend.

**Razon del cambio:** Los nombres originales eran ambiguos en las consultas JOIN. El campo `leido` es requerido por el wireframe de mensajeria (E16) para mostrar el punto azul de mensaje nuevo.

**Artefactos afectados:** E7, E11.

---

### Cambio M-08 — Tabla CIUDAD: adicion de `departamento`

**Documento de diseno:** Solo `id_ciudad` y `nombre_ciudad`.

**Implementacion actual:** Se agrego `departamento VARCHAR(100) NULL`.

**Razon del cambio:** El filtro de busqueda de actividades (RF-006) permite filtrar por ciudad; mostrar el departamento junto al nombre de la ciudad evita ambiguedades entre ciudades homonimas de distintos departamentos.

**Artefactos afectados:** E7, E11.

---

### Cambio M-09 — Objetivo especifico 3: modulo de inscripcion en lugar de algoritmos de recomendacion

**Documento de diseno:** OE3 rezaba "implementar un modulo de emparejamiento asistido por algoritmos de recomendacion basicos".

**Implementacion actual:** OE3 en el repositorio dice "implementar un modulo de inscripcion y aprobacion". El alcance (03-alcance.md) excluye explicitamente la recomendacion personalizada en esta version.

**Razon del cambio:** La implementacion de algoritmos de filtrado colaborativo requeria un conjunto de datos historico suficientemente grande para ser util, y el tiempo disponible para la entrega no lo permitia. Se priorizo la solidez del flujo de inscripcion/aprobacion (CU-02, CU-07) sobre la recomendacion automatica, que queda como mejora futura documentada.

**Artefactos afectados:** 05-objetivos-especificos.md, 03-alcance.md.

---

### Cambio M-10 — Tabla VOLUNTARIO_INTERESES: reemplazada por campo `intereses TEXT` en PERFIL_VOLUNTARIO

**Documento de diseno:** Definia la tabla de union `VOLUNTARIO_INTERESES (id_voluntario PK/FK, id_categoria PK/FK)` para almacenar la relacion N:M entre voluntarios y categorias de interes.

**Implementacion actual:** Se elimino la tabla `VOLUNTARIO_INTERESES`. En su lugar, `PERFIL_VOLUNTARIO` tiene el campo `intereses TEXT NULL`, que almacena los intereses del voluntario como texto libre (por ejemplo: "Medio Ambiente, Educacion"). No existe un JOIN a CATEGORIA para los intereses.

**Razon del cambio:**
- La funcionalidad de notificacion por intereses (RF-011) requiere cruzar los intereses del voluntario con las categorias de actividades nuevas. En la version actual, la notificacion de nuevas actividades se implementa como un aviso general (no filtrado por interes), lo que hace que la tabla de union sea prematura sin la logica de recomendacion (ver Cambio M-09).
- Mantener la tabla VOLUNTARIO_INTERESES sin la logica de matching generaria deuda tecnica sin beneficio funcional inmediato.
- El campo TEXT es suficiente para la v1: permite mostrar los intereses del voluntario en su perfil (RNF-010) sin requerir el JOIN adicional.

**Impacto en RF-011:** La implementacion actual de RF-011 genera notificaciones en la plataforma cuando se aprueba o rechaza una inscripcion (tipo INSCRIPCION_APROBADA/RECHAZADA), no por coincidencia de categorias. El filtrado por interes queda documentado como mejora futura.

**Artefactos afectados:** E7 (diccionario de datos), E11 (DDL), E12 (diagrama de clases), M7 (matriz de tablas).
