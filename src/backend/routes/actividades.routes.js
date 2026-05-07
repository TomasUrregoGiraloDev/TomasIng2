import { Router } from 'express';
import { authRequired, requireRol } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import * as Ctrl from '../controllers/actividad.controller.js';

const router = Router();

router.get('/', Ctrl.listar);
router.get('/:id', Ctrl.obtener);
router.post('/', authRequired, requireRol('ORGANIZACION'), validate(Ctrl.schemas.crear), Ctrl.crear);
router.put('/:id', authRequired, requireRol('ORGANIZACION'), validate(Ctrl.schemas.actualizar), Ctrl.actualizar);
router.post('/:id/cancelar', authRequired, requireRol('ORGANIZACION'), Ctrl.cancelar);
router.delete('/:id', authRequired, requireRol('ORGANIZACION'), Ctrl.eliminar);

export default router;
