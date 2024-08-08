import { Router } from 'express';
import * as psicologosController from '../controller/psicologos.controller.js';

const router = Router();

router.post('/api/psicologos', psicologosController.createPsicologo);
router.post('/api/psicologos/login', psicologosController.loginPsicologo);

export default router;