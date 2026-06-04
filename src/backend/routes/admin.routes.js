// ============================================================
// Ruta admin.routes
// Tabla(s) BD : ROL
// HU          : HU10, HU16, HU17
// RF          : RF-001, RF-015, RF-016, RF-017
// ============================================================
import { Router } from 'express';
import { authRequired, requireRol } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import * as Ctrl from '../controllers/admin.controller.js';

const router = Router();
router.use(authRequired, requireRol('ADMIN'));
router.get('/organizaciones', Ctrl.listarOrganizaciones);
router.put('/organizaciones/:id/estado', validate(Ctrl.schemas.cambiarEstadoOrg), Ctrl.cambiarEstadoOrganizacion);
router.delete('/actividades/:id', Ctrl.eliminarActividad);
router.get('/estadisticas', Ctrl.estadisticas);
router.post('/reportes/generar', Ctrl.generarReporte);
router.get('/categorias', Ctrl.listarCategorias);
router.post('/categorias', validate(Ctrl.schemas.categoria), Ctrl.crearCategoria);
router.put('/categorias/:id', validate(Ctrl.schemas.categoria), Ctrl.actualizarCategoria);
router.delete('/categorias/:id', Ctrl.eliminarCategoria);
router.get('/roles', Ctrl.listarRoles);
router.post('/roles', validate(Ctrl.schemas.rol), Ctrl.crearRol);
router.put('/roles/:id', validate(Ctrl.schemas.rol), Ctrl.actualizarRol);
router.delete('/roles/:id', Ctrl.eliminarRol);
export default router;
