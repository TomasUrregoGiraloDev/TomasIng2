# E16 - Wireframes (baja fidelidad)

Los wireframes originales en Figma sirvieron de referencia visual. Ver capturas en `../imagenes/`. La implementacion final sigue la jerarquia y disposicion definida en cada uno:

| Wireframe | Pantalla implementada |
|---|---|
| Home — selector de roles | `pages/Home.jsx` |
| Login | `pages/Login.jsx` |
| Registro voluntario / organizacion | `pages/RegistroVoluntario.jsx`, `pages/RegistroOrganizacion.jsx` |
| Buscar actividades | `pages/VolBuscarActividades.jsx` |
| Detalle de actividad | `pages/VolDetalleActividad.jsx` |
| Mis inscripciones | `pages/VolMisInscripciones.jsx` |
| Dashboard organizacion | `pages/OrgDashboard.jsx` |
| Publicar actividad | `pages/OrgPublicarActividad.jsx` |
| Mis actividades | `pages/OrgMisActividades.jsx` |
| Solicitudes (org) | `pages/OrgInscripciones.jsx` |
| Admin organizaciones | `pages/AdminOrganizaciones.jsx` |
| Solicitudes (admin) | `pages/AdminInscripciones.jsx` |
| Reportes IA | `pages/AdminReportes.jsx` |
| Mensajes | `pages/Mensajes.jsx` |
| Notificaciones | `pages/Notificaciones.jsx` |
| Perfil | `pages/Perfil.jsx` |

Decisiones visuales aplicadas:
- Paleta unica con primario `#2563eb`. Estados con verde (success), ambar (warning), rojo (danger).
- Tipografia Inter cargada desde rsms.me (sin paquete npm extra).
- Sin emojis en UI ni en copy. Iconografia con `lucide-react`.
- Espaciado en multiplos de 4px. Cards con sombra suave y bordes sutiles.
