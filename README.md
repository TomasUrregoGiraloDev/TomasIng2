# Plataforma de Voluntariado Colombia

Trabajo de la asignatura de Programacion con Framework — Corporacion Universitaria Remington.

| Item | Valor |
|---|---|
| Estudiante | Tomas Urrego Giraldo |
| Modulo | Usuarios y Comunicaciones |
| Companero | Albert Higuita Bautista (Modulo Campanas y Actividades) |
| Profesora | Ing. Gloria Amparo Lora Patino |
| Periodo | 2026 |

Migracion del proyecto inicialmente planteado en Spring Boot a un stack basado en JavaScript: React (frontend) + Node/Express + Sequelize (backend) + MySQL (base de datos). El cambio de framework se documenta en `DECISIONES.md`.

## Modulo implementado

Tablas asignadas a Tomas (todas con trazabilidad en codigo):

- `ROL` — catalogo de roles del sistema (Voluntario, Organizacion, Admin).
- `USUARIO` — autenticacion central, FK a ROL y CIUDAD.
- `PERFIL_VOLUNTARIO` / `PERFIL_ORGANIZACION` / `PERFIL_ADMIN` — perfiles especializados 1:1 con USUARIO.
- `MENSAJE` — mensajeria directa entre usuarios.
- `NOTIFICACION` — alertas y avisos del sistema.

El modulo de Albert (`CATEGORIA`, `CIUDAD`, `ACTIVIDAD`, `INSCRIPCION`, `RESENA`) tambien esta implementado para que la aplicacion sea funcional de extremo a extremo, pero los comentarios de trazabilidad estan concentrados en el modulo de Tomas.

## Stack

| Capa | Tecnologia |
|---|---|
| Frontend | React 18 + Vite + React Router 6 + Tailwind CSS + Axios |
| Backend  | Node 20 + Express 4 + Sequelize 6 + Zod + JWT (jsonwebtoken) + bcryptjs |
| Base de datos | MySQL 8 (via docker-compose) |
| IA para reportes | Groq REST API (modelo Llama 3.1 70B) |
| Tests | Playwright (Chromium) |

## Como ejecutar

### Requisitos previos

- Node.js 20 o superior.
- Docker Desktop (o cualquier MySQL 8 corriendo en `localhost`).

### 1. Variables de entorno

```bash
cp .env.example .env
```

Edita `.env`:
- `DB_*` puedes dejar los valores por defecto si vas a usar el contenedor.
- `JWT_SECRET` cambialo por cualquier cadena aleatoria.
- `GROQ_API_KEY` pega tu llave de https://console.groq.com/keys (necesaria para el modulo de reportes con IA).

### 2. Instalar dependencias

```bash
npm run install:all
```

Esto instala las dependencias del proyecto raiz, el backend y el frontend.

> **Si tu DNS no resuelve `registry.npmjs.org` (ej. detras de la VPN de MELI)**, puedes
> instalar las dependencias usando un contenedor Node con DNS publico, asi:
>
> ```bash
> docker run --rm --dns 8.8.8.8 -v "$PWD:/app" -w /app node:20-alpine npm install --no-fund --no-audit
> docker run --rm --dns 8.8.8.8 -v "$PWD:/app" -w /app/src/backend node:20-alpine npm install --no-fund --no-audit
> docker run --rm --dns 8.8.8.8 -v "$PWD:/app" -w /app/src/frontend node:20-alpine \
>   npm install --no-fund --no-audit --os=darwin --cpu=arm64 --include=optional
> ```
>
> El `--os=darwin --cpu=arm64` en el frontend es para que `rollup` baje su binario nativo de Mac M1/M2.

### 3. Levantar la base de datos

```bash
npm run db:up
```

Crea un contenedor MySQL 8 en el puerto `3307` (cambialo en `.env` si necesitas otro). El script `src/database/ddl.sql` se ejecuta automaticamente la primera vez.

### 4. Sembrar datos iniciales

```bash
npm run backend:seed
```

Crea los catalogos (roles, ciudades, categorias) y tres cuentas de demostracion:

| Rol | Correo | Contrasena |
|---|---|---|
| Voluntario | `voluntario@demo.com` | `Demo1234` |
| Organizacion (verificada) | `org@demo.com` | `Demo1234` |
| Organizacion (pendiente) | `org.pendiente@demo.com` | `Demo1234` |
| Organizacion (pendiente, para verificar desde admin) | `org.renacer@demo.com` | `Demo1234` |
| Administrador | `admin@demo.com` | `Demo1234` |

### 5. Arrancar backend y frontend juntos

```bash
npm run dev
```

- Backend en http://localhost:4000
- Frontend en http://localhost:5173

Tambien puedes arrancarlos por separado con `npm run backend:dev` y `npm run frontend:dev`.

## Tests E2E

```bash
npm run test:e2e
```

Playwright corre 21 tests E2E sobre la aplicacion real. Antes de ejecutar:

1. La base de datos debe estar levantada (`npm run db:up`).
2. La instalacion del navegador de Playwright (la primera vez): `npx playwright install chromium`.

Los tests usan los usuarios semilla creados en el paso 4. Cada test resetea la base con `node seeders/run.js --reset` para garantizar un estado conocido.

## Repositorio del companero

`Albert Higuita Bautista` — pendiente de actualizar el enlace del repositorio del modulo de Campanas y Actividades.

## Estructura del repo

Ver `docs/diseno/fase1-arquitectura/E5-diagrama-componentes-UML.md` para la descripcion completa de cada carpeta.

```
proyecto-tomas-apellido/
├── src/
│   ├── backend/         (Node + Express + Sequelize)
│   ├── frontend/        (React + Vite + Tailwind)
│   └── database/ddl.sql (script E11)
├── tests/e2e/           (Playwright)
├── docs/
│   ├── analisis/
│   ├── diseno/          (E1..E17)
│   └── trazabilidad/    (M1..M13)
├── docker-compose.yml
├── BITACORA.md
├── DECISIONES.md
└── README.md
```

## Documentacion

- [BITACORA.md](BITACORA.md) — registro semanal del avance.
- [DECISIONES.md](DECISIONES.md) — decisiones tecnicas con justificacion y artefacto de respaldo.
- [docs/diseno/](docs/diseno/) — artefactos E1..E17 del documento entregado.
- [docs/trazabilidad/](docs/trazabilidad/) — matrices M1..M13.
