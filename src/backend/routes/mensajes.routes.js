import { Router } from 'express';
import { authRequired } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import * as Ctrl from '../controllers/mensaje.controller.js';

const router = Router();
router.use(authRequired);
router.get('/', Ctrl.listar);
router.get('/conversacion/:userId', Ctrl.conversacion);
router.post('/', validate(Ctrl.schemas.enviar), Ctrl.enviar);
export default router;
