# E15 - Mapa de navegacion

## Sin sesion

```
/                         (Home con selector de roles)
  |-- /login
  |-- /registro/voluntario
  +-- /registro/organizacion
```

## Voluntario

```
/voluntario/buscar              (lista filtrable de actividades)
  +-- /voluntario/actividad/:id (detalle + modal de inscripcion)
/voluntario/mis-inscripciones   (con tab para calificar)
/mensajes                       (compartido)
/notificaciones                 (compartido)
/perfil                         (compartido)
```

## Organizacion

```
/organizacion                       (resumen + KPIs)
  +-- /organizacion/publicar        (form nueva actividad)
/organizacion/actividades           (CRUD propio)
/organizacion/inscripciones         (tabs Pendientes, Aprobadas, Rechazadas, Asistencia)
/mensajes
/notificaciones
/perfil
```

## Administrador

```
/admin                  (resumen + grafico por categoria)
/admin/organizaciones   (verificar / suspender)
/admin/inscripciones    (vista global con tabs)
/admin/reportes         (boton "Generar reporte" -> Groq)
/perfil
/notificaciones
```

Cada ruta esta protegida segun el rol con `ProtectedRoute roles={[...]}` en `App.jsx`.
