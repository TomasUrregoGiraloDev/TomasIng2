import { Router } from 'express';
import { authRequired } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import * as AuthController from '../controllers/auth.controller.js';

const router = Router();

router.post('/register/voluntario', validate(AuthController.schemas.registrarVoluntario), AuthController.registrarVoluntario);
router.post('/register/organizacion', validate(AuthController.schemas.registrarOrganizacion), AuthController.registrarOrganizacion);
router.post('/login', validate(AuthController.schemas.login), AuthController.login);
router.get('/me', authRequired, AuthController.me);

export default router;
