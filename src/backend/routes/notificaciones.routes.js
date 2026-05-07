import { Router } from 'express';
import { authRequired } from '../middlewares/auth.js';
import * as Ctrl from '../controllers/notificacion.controller.js';

const router = Router();
router.use(authRequired);
router.get('/', Ctrl.listar);
router.put('/:id/leer', Ctrl.marcarLeida);
export default router;
