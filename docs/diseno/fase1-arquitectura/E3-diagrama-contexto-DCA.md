# E3 - Diagrama de contexto / DCA (Diagrama de contexto arquitectonico)

```
                +-----------------------------+
                |     Voluntario              |
                +--------------+--------------+
                               | HTTPS (REST + JWT)
                               v
+--------------+        +------+--------+         +---------------+
|              |  REST  |               |  HTTPS  |               |
|  Admin       +------->+  Frontend     +-------->+  Backend API  |
|  (browser)   |        |  React+Vite   |         |  Node+Express |
+--------------+        |  port 5173    |         |  port 4000    |
                        +------+--------+         +-------+-------+
                               ^                          |
                               | REST + JWT                | mysql2 (TCP 3307)
                               |                          v
                +--------------+--------------+   +-------+-------+
                | Organizacion                |   |  MySQL 8      |
                +-----------------------------+   |  voluntariado |
                                                  +-------+-------+
                                                          |
                                                          v
                                                  +-------+-------+
                                                  |   Groq API    |
                                                  |  (Llama 3.1)  |
                                                  +---------------+
```

- Los tres actores humanos (Voluntario, Organizacion, Admin) consumen el frontend desde un navegador.
- El frontend es el unico que habla con el backend (no expone la BD).
- El backend habla con MySQL via mysql2 y con Groq via REST sobre HTTPS.
