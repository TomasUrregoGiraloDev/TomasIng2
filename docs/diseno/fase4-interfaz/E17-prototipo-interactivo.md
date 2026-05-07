# E17 - Prototipo interactivo

El prototipo Figma original esta en:
https://www.figma.com/make/FZ0BcnpC88VemhIlt9D6Qa/Crear-prototipo-funcional?p=f&t=kK3r2FSMcDWPrpnw-0&preview-route=%2Fvoluntario

Esta implementacion es ya una version funcional del prototipo (no solo navegable), conectada a un backend real con MySQL.

## Como navegarla

1. `npm run db:up && npm run backend:seed && npm run dev` (ver README).
2. Abrir http://localhost:5173.
3. Login con cualquiera de las cuentas de demo:
   - voluntario@demo.com / Demo1234
   - org@demo.com / Demo1234
   - admin@demo.com / Demo1234
4. Recorrer el flujo completo:
   - Voluntario: buscar -> ver detalle -> inscribirse -> ver "Mis inscripciones".
   - Organizacion: ver actividades -> publicar -> ir a solicitudes -> aprobar.
   - Admin: ir a Organizaciones -> verificar la pendiente -> ir a Reportes -> generar.
