# E6 - Diagrama de despliegue UML

```
+-----------------------------+      +-----------------------------+
|  Nodo: Cliente              |      |  Nodo: Servicio externo     |
|  - Navegador (Chrome,       |      |  - Groq API HTTPS           |
|    Firefox, Safari)         |      +--------------+--------------+
+--------------+--------------+                     ^
               |                                     |
               | HTTPS                               | HTTPS (REST + Bearer)
               v                                     |
+-----------------------------+                     |
|  Nodo: Servidor de aplicacion (local o VPS)       |
|  Sistema operativo: Linux / macOS                 |
|                                                   |
|  +-------------------+   +---------------------+  |
|  | Vite preview      |   | Node 20 (Express)   |  |
|  | port 5173 (dev)   |   | port 4000           |  |
|  | dist/ servido     |   | API REST + JWT      |  |
|  | por nginx en prod |   |                     |--+ 
|  +-------------------+   +-----------+---------+  
|                                      | mysql2 (TCP)
|                                      v             
|                          +-----------+---------+   
|                          | MySQL 8 (Docker)    |   
|                          | port 3307 -> 3306   |   
|                          | volumen mysql_data  |   
|                          +---------------------+   
+---------------------------------------------------+
```

Configuracion local (la que se entrega a la profesora):

| Servicio | Puerto host | Como se levanta |
|---|---|---|
| MySQL 8 | 3307 | `docker compose up -d` |
| Backend | 4000 | `npm run backend:dev` |
| Frontend (Vite) | 5173 | `npm run frontend:dev` |
