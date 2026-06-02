// ============================================================
// Ruta perfil.routes
// Tabla(s) BD : —
// HU          : HU10, HU13, HU14
// RF          : RF-002, RF-003, RF-004
// ============================================================
import { Router } from 'express';
import { authRequired } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import * as PerfilController from '../controllers/perfil.controller.js';

const router = Router();
router.use(authRequired);
router.get('/', PerfilController.obtener);
router.put('/', validate(PerfilController.schemas.actualizar), PerfilController.actualizar);
export default router;
