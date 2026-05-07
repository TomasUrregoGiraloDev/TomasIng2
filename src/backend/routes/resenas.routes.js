import { Router } from 'express';
import { authRequired, requireRol } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import * as Ctrl from '../controllers/resena.controller.js';

const router = Router();
router.post('/', authRequired, requireRol('VOLUNTARIO'), validate(Ctrl.schemas.crear), Ctrl.crear);
router.get('/actividad/:actividadId', Ctrl.listarPorActividad);
export default router;
