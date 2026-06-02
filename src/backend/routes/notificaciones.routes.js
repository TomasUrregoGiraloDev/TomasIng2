// ============================================================
// Ruta notificaciones.routes
// Tabla(s) BD : —
// HU          : HU07, HU11
// RF          : RF-010, RF-011
// ============================================================
import { Router } from 'express';
import { authRequired } from '../middlewares/auth.js';
import * as Ctrl from '../controllers/notificacion.controller.js';

const router = Router();
router.use(authRequired);
router.get('/', Ctrl.listar);
router.put('/:id/leer', Ctrl.marcarLeida);
export default router;
