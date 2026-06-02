// ============================================================
// Ruta inscripciones.routes
// Tabla(s) BD : —
// HU          : HU03, HU05, HU06
// RF          : RF-007, RF-008, RF-009
// ============================================================
import { Router } from 'express';
import { authRequired, requireRol } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import * as Ctrl from '../controllers/inscripcion.controller.js';

const router = Router();
router.use(authRequired);
router.get('/', Ctrl.listar);
router.post('/', requireRol('VOLUNTARIO'), validate(Ctrl.schemas.crear), Ctrl.crear);
router.put('/:id', requireRol('ORGANIZACION', 'ADMIN'), validate(Ctrl.schemas.cambiarEstado), Ctrl.cambiarEstado);
export default router;
