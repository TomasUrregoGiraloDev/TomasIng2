import { Router } from 'express';
import { authRequired } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import * as PerfilController from '../controllers/perfil.controller.js';

const router = Router();
router.use(authRequired);
router.get('/', PerfilController.obtener);
router.put('/', validate(PerfilController.schemas.actualizar), PerfilController.actualizar);
export default router;
