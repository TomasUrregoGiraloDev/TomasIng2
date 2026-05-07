# E11 - Script DDL

El script DDL ejecutable se encuentra en [`src/database/ddl.sql`](../../../src/database/ddl.sql).

Se ejecuta automaticamente la primera vez que arranca el contenedor de MySQL (volumen `docker-entrypoint-initdb.d`). Tambien se puede ejecutar manualmente:

```bash
docker exec -i voluntariado_mysql mysql -uroot -p${DB_ROOT_PASSWORD} < src/database/ddl.sql
```

Ademas, el seeder del backend hace `sequelize.sync()` (no destructivo) para garantizar que cualquier columna agregada al modelo se cree.

## Tablas creadas

ROL, CIUDAD, CATEGORIA, USUARIO, PERFIL_VOLUNTARIO, PERFIL_ORGANIZACION, PERFIL_ADMIN, ACTIVIDAD, INSCRIPCION, RESENA, MENSAJE, NOTIFICACION.
