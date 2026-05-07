# E10 - Normalizacion (1FN, 2FN, 3FN)

## 1FN — Atomicidad

Cada atributo guarda un unico valor indivisible. No hay grupos repetidos ni columnas multivaluadas.

Excepcion deliberada: `PERFIL_VOLUNTARIO.intereses` es TEXT libre (separado por comas en la UI). Se decidio mantener la firma del DDL original (E11) por trazabilidad. Si en una version futura se requiere filtrar por interes, se normalizaria a una tabla `voluntario_interes (id_voluntario, id_categoria)`.

## 2FN — Dependencia total de la clave

Todas las tablas tienen clave primaria simple `id_xxx` autogenerada, por lo que no puede aparecer dependencia parcial.

## 3FN — Sin dependencias transitivas

Casos revisados:

- `USUARIO` guarda `id_rol` e `id_ciudad` como FKs; el nombre del rol y el nombre de la ciudad viven en sus tablas.
- `ACTIVIDAD` no repite datos de la organizacion ni de la categoria; referencia sus PKs.
- `RESENA` depende de `id_inscripcion` (su FK natural), no de `id_voluntario` ni de `id_actividad` directamente.
- Los tres perfiles estan separados de USUARIO para evitar columnas con NULLs masivos segun el rol.
