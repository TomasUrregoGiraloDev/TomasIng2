# E5 - Diagrama de componentes UML

```
+----------------------------------------------------------+
|                  Frontend (React + Vite)                 |
|  +---------------+  +---------------+  +--------------+  |
|  | pages/*       |->| services/api  |->| context/Auth |  |
|  +---------------+  +-------+-------+  +------+-------+  |
|                             | axios          |          |
+-----------------------------|----------------|----------+
                              v                v
+----------------------------------------------------------+
|             Backend (Node + Express)                     |
|  +---------+   +-------------+   +------------+          |
|  | routes/ |-->| controllers |-->| services   |          |
|  +---------+   +-------------+   +-----+------+          |
|       ^               ^                |                 |
|       |               |                v                 |
|  +---------+    +-----+------+   +-----+------+          |
|  | middlew.|    | validators |   | Sequelize  |          |
|  | (auth)  |    | (zod)      |   | models/    |          |
|  +---------+    +------------+   +-----+------+          |
+--------------------------------------------|-------------+
                                             v
                                  +----------+----------+
                                  |  MySQL 8 voluntar.  |
                                  +---------------------+
```

Mapping a carpetas:

| Componente | Path |
|---|---|
| `pages` | `src/frontend/src/pages/` |
| `services/api` | `src/frontend/src/services/api.js` |
| `context/Auth` | `src/frontend/src/context/AuthContext.jsx` |
| `routes` (Express) | `src/backend/routes/*.routes.js` |
| `controllers` | `src/backend/controllers/*.controller.js` |
| `services` | `src/backend/services/*Service.js` |
| `models` | `src/backend/models/*.js` |
| `middlewares` | `src/backend/middlewares/*.js` |
| `config DB` | `src/backend/config/db.js` |
| `validators` | esquemas zod en cada `*.controller.js` |
