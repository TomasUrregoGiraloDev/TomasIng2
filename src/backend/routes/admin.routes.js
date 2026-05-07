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
export default router;
